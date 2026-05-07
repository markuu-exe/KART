import { insertRequest } from '../lib/supabase.js';

const useAppStore = create((set, get) => ({
  // Form state for Post Request
  requestForm: {
    items: '',
    deliveryZone: '',
    budgetCap: '',
    deliveryAddress: '',
  },
  // Active requests
  activeRequests: [],
  // Loading state
  isSubmitting: false,
  error: null,

  // Actions
  updateRequestForm: (field, value) => set((state) => ({
    requestForm: {
      ...state.requestForm,
      [field]: value,
    },
  })),

  resetRequestForm: () => set({
    requestForm: {
      items: '',
      deliveryZone: '',
      budgetCap: '',
      deliveryAddress: '',
    },
  }),

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setError: (error) => set({ error }),

  // Submit request
  submitRequest: async () => {
    const { requestForm, resetRequestForm, setSubmitting, setError } = get();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!requestForm.items.trim()) {
        throw new Error('Please enter items needed');
      }
      if (!requestForm.deliveryZone) {
        throw new Error('Please select a delivery zone');
      }
      if (!requestForm.budgetCap || isNaN(requestForm.budgetCap)) {
        throw new Error('Please enter a valid budget cap');
      }
      if (!requestForm.deliveryAddress.trim()) {
        throw new Error('Please enter delivery address');
      }

      // Insert into database
      const requestData = {
        items: requestForm.items,
        delivery_zone: requestForm.deliveryZone,
        budget_cap: parseFloat(requestForm.budgetCap),
        delivery_address: requestForm.deliveryAddress,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      await insertRequest(requestData);

      // Reset form on success
      resetRequestForm();

      // Optionally, refresh active requests
      // await get().fetchActiveRequests();

    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  },
}));

export default useAppStore;