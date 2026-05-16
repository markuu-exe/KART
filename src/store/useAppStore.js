import { create } from 'zustand';
import { supabase, insertOrder } from '@/lib/supabase';

const ORDERS_REALTIME_CHANNEL = 'orders-realtime';

const getRowId = (row) => row?.id;

const upsertById = (list, row) => {
  const rowId = getRowId(row);
  if (!rowId) return list;

  const index = list.findIndex((item) => getRowId(item) === rowId);
  if (index === -1) {
    return [row, ...list];
  }

  const next = [...list];
  next[index] = { ...next[index], ...row };
  return next;
};

const removeById = (list, id) => list.filter((item) => getRowId(item) !== id);

export const useAppStore = create((set, get) => ({
  // --- STATE ---
  user: null,
  role: null, 
  isLoading: false,
  isAuthResolved: false, // Set to true ONLY after session check finishes
  error: null,

  orders: [],
  isOrdersLoading: false,
  ordersRealtimeChannel: null,
  isOrdersRealtimeConnected: false,

  // --- ACTIONS ---
  
  // Call this once at the root of the app (e.g., App.jsx) on load/refresh
  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session) {
        get().stopOrdersRealtime();
        set({ user: null, role: null, orders: [], isAuthResolved: true, isLoading: false });
        return;
      }

      const supabaseUser = session.user;
      const userRole = supabaseUser.user_metadata?.role || null;

      set({
        user: supabaseUser,
        role: userRole,
        isAuthResolved: true,
        isLoading: false
      });

      get().startOrdersRealtime();
    } catch (err) {
      console.error('Auth sync failed:', err.message);
      get().stopOrdersRealtime();
      set({ user: null, role: null, orders: [], error: err.message, isAuthResolved: true, isLoading: false });
    }
  },

  setUser: (user) => {
    const userRole = user?.user_metadata?.role || null;
    set({ user, role: userRole, isAuthResolved: true });

    if (user) {
      get().startOrdersRealtime();
      return;
    }

    get().stopOrdersRealtime();
    set({ orders: [] });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  setOrders: (orders) => set({ orders }),
  upsertOrder: (order) => set((state) => ({ orders: upsertById(state.orders, order) })),
  removeOrder: (orderId) => set((state) => ({ orders: removeById(state.orders, orderId) })),
  
  fetchOrders: async ({ requesterId, runnerId } = {}) => {
    set({ isOrdersLoading: true });
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

    if (requesterId) query = query.eq('requester_id', requesterId);
    if (runnerId) query = query.eq('runner_id', runnerId);

    const { data, error } = await query;
    if (error) {
      set({ error: error.message, isOrdersLoading: false });
      return [];
    }

    const nextOrders = Array.isArray(data) ? data : [];
    set({ orders: nextOrders, isOrdersLoading: false, error: null });
    return nextOrders;
  },

  acceptOrder: async ({ orderId, runnerId }) => {
    if (!orderId || !runnerId) return { data: null, error: 'Missing orderId or runnerId.' };

    const { data, error } = await supabase
      .from('orders')
      .update({ status: 'accepted', runner_id: runnerId, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    get().upsertOrder(data);
    set({ error: null });
    return { data, error: null };
  },

  updateOrderStatus: async ({ orderId, status }) => {
    if (!orderId || !status) return { data: null, error: 'Missing orderId or status.' };

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    get().upsertOrder(data);
    set({ error: null });
    return { data, error: null };
  },

  createOrder: async ({ requesterId, items, zone, amount, address, pickupLat, pickupLng, dropoffLat, dropoffLng, pickupAddress, deliveryAdd }) => {
    if (!requesterId || !items || !zone || !amount || !address || !pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return { data: null, error: 'Missing required order fields.' };
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return { data: null, error: 'Amount must be a valid positive number.' };
    }

    const payload = {
      requester_id: requesterId,
      items: Array.isArray(items) ? items : [items],
      zone,
      amount: numericAmount,
      city: address,
      pickup_latitude: pickupLat,
      pickup_longitude: pickupLng,
      dropoff_latitude: dropoffLat,
      dropoff_longitude: dropoffLng,
      pickup_location: pickupAddress || null,
      dropoff_location: deliveryAdd || null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await insertOrder(payload);
    if (error) {
      set({ error: error.message });
      return { data: null, error: error.message };
    }

    get().upsertOrder(data);
    set({ error: null });
    return { data, error: null };
  },

  startOrdersRealtime: () => {
    const existingChannel = get().ordersRealtimeChannel;
    if (existingChannel) return;

    const channel = supabase
      .channel(ORDERS_REALTIME_CHANNEL)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            get().removeOrder(getRowId(payload.old));
            return;
          }

          const changedOrder = payload.new;
          if (!changedOrder) return;

          const nextStatus = String(changedOrder.status || '').toLowerCase();
          const prevStatus = String(payload.old?.status || '').toLowerCase();
          const isNewErrand = payload.eventType === 'INSERT';
          const isNewlyAccepted = payload.eventType === 'UPDATE' && nextStatus === 'accepted' && prevStatus !== nextStatus;

          if (!isNewErrand && !isNewlyAccepted) return;

          get().upsertOrder(changedOrder);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          set({ isOrdersRealtimeConnected: true, error: null });
          return;
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          set({ isOrdersRealtimeConnected: false, error: 'Orders realtime connection lost.' });
        }
      });

    set({ ordersRealtimeChannel: channel });
  },

  stopOrdersRealtime: () => {
    const channel = get().ordersRealtimeChannel;
    if (!channel) return;

    supabase.removeChannel(channel);
    set({ ordersRealtimeChannel: null, isOrdersRealtimeConnected: false });
  },

  logout: () => {
    get().stopOrdersRealtime();
    set({ user: null, role: null, error: null, orders: [], isOrdersLoading: false });
  },
}));