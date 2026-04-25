import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, Settings, MapPin, ClipboardList } from 'lucide-react';
import { ErrandDetailModal, EmptyState } from '@/components';
import { useAppStore } from '@/store/useAppStore';
import boxIllustration from '@/assets/Icons/Icon=Box.svg';

const ZONES = ['Guadalupe', 'Tisa', 'Talamban', 'Lahug', 'Labangon', 'Banilad', 'Apas', 'Zapatera'];

const FALLBACK_ITEMS = ['No item details provided'];

function formatCurrency(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return '₱0.00';
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(numericAmount);
}

function formatRelativeTime(inputDate) {
  if (!inputDate) {
    return 'Just now';
  }

  const date = new Date(inputDate);
  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function toStatusLabel(status) {
  const raw = String(status || 'pending').trim();
  if (!raw) {
    return 'Pending';
  }

  return raw
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toStatusTone(status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'delivered') {
    return 'green';
  }

  if (normalized === 'at_store' || normalized === 'purchased') {
    return 'orange';
  }

  return 'blue';
}

function toSummary(items) {
  if (Array.isArray(items) && items.length > 0) {
    return items.join(', ');
  }

  if (typeof items === 'string' && items.trim()) {
    return items;
  }

  return 'Errand request';
}

function AppNav({ selected = 'Home' }) {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const fullName = user?.user_metadata?.full_name || 'User';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

  const items = [
    { id: 'Home', icon: Home, label: 'Home', path: '/requester/board' },
    { id: 'History', icon: History, label: 'History', path: '/requester/history' },
    { id: 'Profile', icon: User, label: 'Profile', path: '/requester/profile' },
  ];

  return (
    <aside className="bg-surface-white border-r border-border-rule flex min-h-screen min-w-60 flex-col px-4 py-6 self-stretch">
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.id === selected;

          return (
            <button
              key={item.id}
              type="button"
              className={`min-h-11 px-3 rounded-xl flex items-center gap-3 text-left ${
                active ? 'bg-primary-orange-bg text-primary-orange' : 'text-ink-mid'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 min-w-52">
          <div className="w-9 h-9 rounded-full bg-primary-orange inline-flex items-center justify-center text-surface-white text-sm font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-default truncate">{fullName}</p>
            <p className="text-caption text-ink-light">Requester</p>
          </div>
          <Settings className="w-5 h-5 text-ink-mid" />
        </div>
      </div>
    </aside>
  );
}

function StatusPill({ tone, children }) {
  const map = {
    blue: 'bg-status-blue-bg text-status-blue',
    orange: 'bg-primary-orange-bg text-primary-orange',
    green: 'bg-status-green text-surface-white',
  };

  return <div className={`h-6 px-2.5 rounded-full inline-flex items-center ${map[tone]}`}>{children}</div>;
}

function RequestCard({ request, onOpen }) {
  const stripeToneMap = {
    blue: 'border-status-blue',
    orange: 'border-primary-orange',
    green: 'border-status-green',
  };

  return (
    <button
      type="button"
      className={`w-full text-left bg-surface-white border-l-4 ${stripeToneMap[request.stripeTone]} rounded-2xl shadow-sm pl-5 pr-4 py-4`}
      onClick={() => onOpen(request)}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6">
          <p className="flex-1 text-label text-ink-default font-semibold truncate">{request.summary}</p>
          <StatusPill tone={request.statusTone}>
            <span className="font-mono text-mono-sm">{request.status}</span>
          </StatusPill>
        </div>
        <div className="flex items-center gap-1.5 text-caption text-ink-light">
          <MapPin className="w-3 h-3" />
          <span>{request.zone}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-ink-light" />
          <span>{request.amount}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-ink-light" />
          <span>{request.age}</span>
        </div>
      </div>
    </button>
  );
}

function EmptyOrdersState({ onPostRequest }) {
  return (
    <div className="flex min-h-90 items-center justify-center py-4">
      <EmptyState
        illustration={<img src={boxIllustration} alt="" aria-hidden="true" />}
        title="No active orders yet"
        message="Your active requests will appear here after you post one and a runner accepts it."
        actionLabel="Post a request"
        onAction={onPostRequest}
      />
    </div>
  );
}

export default function RequesterDashboard() {
  const navigate = useNavigate();
  const { user, orders, fetchOrders, isOrdersLoading } = useAppStore();
  const [itemText, setItemText] = useState('');
  const [zone, setZone] = useState('Guadalupe');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const firstName = user?.user_metadata?.full_name?.split(' ')?.[0] || 'there';
  const todayLabel = new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    fetchOrders({ requesterId: user.id });
  }, [fetchOrders, user?.id]);

  const activeRequests = useMemo(
    () =>
      orders.map((order) => {
        const statusTone = toStatusTone(order.status);

        return {
          id: order.id,
          summary: toSummary(order.items),
          status: toStatusLabel(order.status),
          statusTone,
          stripeTone: statusTone,
          zone: order.zone || 'Unspecified zone',
          amount: formatCurrency(order.amount),
          age: formatRelativeTime(order.created_at),
          address: [order.city, order.zone].filter(Boolean).join(', ') || 'Address not specified',
          items: Array.isArray(order.items) && order.items.length > 0 ? order.items : FALLBACK_ITEMS,
        };
      }),
    [orders],
  );

  const activeCount = activeRequests.length;

  const modalErrand = useMemo(() => {
    if (!selectedRequest) {
      return null;
    }

    return {
      items: selectedRequest.items,
      zone: selectedRequest.zone,
      address: selectedRequest.address,
      budget: selectedRequest.amount,
      postedTime: selectedRequest.age,
      requesterInitials: 'GC',
      requesterName: 'Gina',
      requesterRole: 'Requester',
    };
  }, [selectedRequest]);

  return (
    <div className="bg-surface-default flex min-h-screen w-full items-stretch">
      <AppNav selected="Home" />

      <main className="bg-surface-default flex-1 min-h-screen p-10 overflow-y-auto">
        <header className="pb-8">
          <h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Hi, {firstName}!</h1>
          <p className="text-caption text-ink-light">{todayLabel}</p>
        </header>

        <section className="flex gap-8 items-start justify-center">
          <div className="w-full max-w-105 flex flex-col gap-3">
            <p className="font-mono text-mono-sm tracking-wider uppercase text-ink-light text-center">New Request</p>

            <div className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-heading-2 text-ink-default font-semibold text-center">Quick Request</h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-caption uppercase tracking-wide text-ink-light">Item(s) Needed</label>
                  <div className="bg-surface-white border border-border-rule rounded-lg p-3 h-22">
                    <textarea
                      className="w-full h-14.5 resize-none bg-transparent outline-none text-body text-ink-mid leading-relaxed"
                      placeholder="e.g. 1 loaf bread, 2L water..."
                      maxLength={500}
                      value={itemText}
                      onChange={(event) => setItemText(event.target.value)}
                    />
                    <div className="text-caption text-right text-ink-light">{itemText.length} / 500</div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pb-2">
                  <label className="text-caption uppercase text-ink-light">Delivery Zone</label>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {ZONES.map((name) => {
                      const active = name === zone;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setZone(name)}
                          className={`h-8 px-3 rounded-full border text-caption ${
                            active
                              ? 'bg-primary-orange-bg border-primary-orange text-primary-orange font-semibold'
                              : 'bg-surface-default border-border-rule text-ink-mid font-medium'
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-caption uppercase tracking-wide text-ink-light">Budget Cap (₱)</label>
                    <div className="bg-surface-white border border-border-rule rounded-lg min-h-11 px-3 flex items-center gap-2">
                      <span className="font-mono text-mono text-primary-orange-light">₱</span>
                      <span className="text-body text-ink-light">Includes ₱30 runner fee</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-caption uppercase tracking-wide text-ink-light">Delivery Address</label>
                    <div className="bg-surface-white border border-border-rule rounded-lg min-h-11 px-3 flex items-center">
                      <span className="text-body text-ink-light">Street, Landmark</span>
                    </div>
                  </div>
                </div>

                <button type="button" className="h-11 rounded-xl px-5 bg-primary-orange text-surface-white text-label shadow-sm">
                  Post Request →
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-mono-sm tracking-wider uppercase text-ink-light">My Active Requests</span>
              <span className="h-5 px-2 rounded-full bg-primary-orange text-surface-white text-caption font-semibold inline-flex items-center">
                {activeCount}
              </span>
              <button
                type="button"
                className="h-8 px-3 rounded-full border border-border-rule bg-surface-white text-caption text-ink-mid"
                onClick={() => navigate('/requester/active-order')}
              >
                View Active Order
              </button>
            </div>

            {activeCount > 0 ? (
              <div className="flex flex-col gap-3">
                {activeRequests.map((request) => (
                  <RequestCard key={request.id} request={request} onOpen={setSelectedRequest} />
                ))}
              </div>
            ) : (
              <EmptyOrdersState onPostRequest={() => navigate('/requester/board')} />
            )}
            {isOrdersLoading ? <p className="text-center text-caption text-ink-light">Loading requests...</p> : null}
          </div>
        </section>
      </main>

      <ErrandDetailModal
        isOpen={Boolean(selectedRequest)}
        errand={modalErrand}
        onClose={() => setSelectedRequest(null)}
        acceptLabel="View Request"
      />
    </div>
  );
}
