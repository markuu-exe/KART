import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, ClipboardList, History, Home, Settings, User, ChevronRight } from 'lucide-react';

const ORDER_DATA = [
  {
    id: 'ord-1001',
    itemSummary: 'Bananas, Apples, Onions, Garlic, Tomatoes, Potatoes',
    zone: 'Market Zone A',
    date: '2026-03-20',
    amount: 620,
    status: 'delivered',
  },
  {
    id: 'ord-1002',
    itemSummary: 'Rice, Cooking Oil, Salt, Soy Sauce, Vinegar',
    zone: 'Market Zone B',
    date: '2026-03-16',
    amount: 455,
    status: 'in_progress',
  },
  {
    id: 'ord-1003',
    itemSummary: 'Chicken, Eggs, Milk, Bread, Cheese',
    zone: 'Central Grocery',
    date: '2026-03-05',
    amount: 820,
    status: 'delivered',
  },
  {
    id: 'ord-1004',
    itemSummary: 'Detergent, Fabric Conditioner, Bleach',
    zone: 'Household Hub',
    date: '2026-02-25',
    amount: 390,
    status: 'cancelled',
  },
  {
    id: 'ord-1005',
    itemSummary: 'Fish, Tofu, Leafy Greens, Carrots',
    zone: 'Fresh Produce',
    date: '2026-02-18',
    amount: 540,
    status: 'delivered',
  },
  {
    id: 'ord-1006',
    itemSummary: 'Ground Meat, Bell Pepper, Onion, Tomato Sauce',
    zone: 'Weekend Market',
    date: '2026-02-11',
    amount: 470,
    status: 'delivered',
  },
];

const FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'in_progress', label: 'In Progress' },
];

function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function formatMonth(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }).toUpperCase();
}

function formatAmount(amountValue) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountValue);
}

function SideNav({ role }) {
  const navigate = useNavigate();
  const isRequester = role === 'requester';

  const navItems = isRequester
    ? [
        { id: 'home', label: 'Home', icon: Home, path: '/requester/board' },
        { id: 'history', label: 'History', icon: History, path: '/requester/history', selected: true },
        { id: 'profile', label: 'Profile', icon: User, path: '/requester/profile' },
      ]
    : [
        { id: 'board', label: 'Board', icon: ClipboardList, path: '/runner/board' },
        { id: 'history', label: 'History', icon: History, path: '/runner/history', selected: true },
        { id: 'profile', label: 'Profile', icon: User, path: '/runner/profile' },
      ];

  return (
    <aside className="bg-surface-white border-r border-border-rule flex flex-col h-full min-w-60 px-4 py-6">
      <div className="flex flex-col pb-8">
        <p className="font-heading font-extrabold text-[28px] tracking-tight text-primary-orange">Kart</p>
        <p className="text-caption text-ink-light">Skip the checkout line.</p>
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`min-h-11 px-3 rounded-xl flex items-center gap-3 text-left ${
                item.selected ? 'bg-primary-orange-bg text-primary-orange' : 'text-ink-mid'
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-sm ${item.selected ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 min-w-52">
          <div className="w-9 h-9 rounded-full bg-primary-orange inline-flex items-center justify-center text-surface-white text-sm font-bold">
            GC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink-default truncate">Gina Cole</p>
            <p className="text-caption text-ink-light">{isRequester ? 'Requester' : 'Runner'}</p>
          </div>
          <Settings className="w-5 h-5 text-ink-mid" />
        </div>
      </div>
    </aside>
  );
}

function HistoryRow({ row, role }) {
  const isRunner = role === 'runner';

  return (
    <button
      type="button"
      className="w-full bg-surface-white border border-border-rule rounded-xl p-4 flex items-center gap-3 text-left"
      onClick={() => {
        // TODO: Navigate to history detail screen when history detail route is finalized.
      }}
    >
      <div className="w-[3px] self-stretch rounded-[2px] bg-status-green" />

      <div className="flex-1 min-w-0">
        <p className="text-label font-semibold text-ink-default truncate">{row.itemSummary}</p>
      </div>

      <div className="hidden lg:flex items-center gap-2 text-caption text-ink-light shrink-0">
        <span>{isRunner ? 'You ran' : 'You requested'}</span>
        <span className="inline-block w-1 h-1 rounded-full bg-ink-light" />
        <span>{row.zone}</span>
        <span className="inline-block w-1 h-1 rounded-full bg-ink-light" />
        <span>{formatDate(row.date)}</span>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <p className="font-mono text-mono text-ink-default">{formatAmount(row.amount)}</p>
        <p className="text-caption text-ink-light">{isRunner ? '+PHP 30 fee' : 'total paid'}</p>
      </div>

      <ChevronRight className="w-4 h-4 text-border-rule shrink-0" />
    </button>
  );
}

export default function OrderHistoryScreen({ role = 'requester' }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(4);

  const subtitle = role === 'runner' ? "All errands you've completed" : "All requests you've posted";

  const filteredRows = useMemo(() => {
    const rows = activeFilter === 'all' ? ORDER_DATA : ORDER_DATA.filter((item) => item.status === activeFilter);
    const sorted = [...rows].sort((a, b) => {
      const aValue = new Date(a.date).getTime();
      const bValue = new Date(b.date).getTime();
      return sortOrder === 'newest' ? bValue - aValue : aValue - bValue;
    });

    return sorted;
  }, [activeFilter, sortOrder]);

  const visibleRows = filteredRows.slice(0, visibleCount);

  const groupedRows = useMemo(() => {
    const groups = new Map();
    visibleRows.forEach((row) => {
      const monthKey = formatMonth(row.date);
      if (!groups.has(monthKey)) {
        groups.set(monthKey, []);
      }
      groups.get(monthKey).push(row);
    });
    return Array.from(groups.entries());
  }, [visibleRows]);

  return (
    <div className="bg-surface-default flex items-start size-full">
      <SideNav role={role} />

      <main className="bg-surface-default flex-1 h-full overflow-y-auto p-10">
        <section className="max-w-[960px] mx-auto flex flex-col gap-4">
          <header className="flex items-start justify-between">
            <div>
              <h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Order History</h1>
              <p className="text-caption text-ink-light">{subtitle}</p>
            </div>
            <div className="px-3 py-3 rounded-full bg-surface-white border border-border-rule font-mono text-mono text-ink-mid">
              {filteredRows.length} orders
            </div>
          </header>

          <div className="border-b border-border-rule pb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {FILTER_OPTIONS.map((option) => {
                const selected = activeFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`h-8 rounded-full px-3 text-caption border ${
                      selected
                        ? 'bg-primary-orange-bg border-primary-orange text-primary-orange font-semibold'
                        : 'bg-surface-default border-border-rule text-ink-mid'
                    }`}
                    onClick={() => {
                      setActiveFilter(option.id);
                      setVisibleCount(4);
                    }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="h-11 rounded-lg px-3 bg-surface-white border border-border-rule inline-flex items-center gap-2 text-caption text-ink-mid"
              onClick={() => setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
            >
              <ArrowUpDown className="w-4 h-4" />
              {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {groupedRows.length === 0 ? (
              <div className="py-8 text-center text-caption text-ink-light">No history yet for this filter.</div>
            ) : (
              groupedRows.map(([month, rows]) => (
                <div key={month} className="space-y-2">
                  <p className="font-mono text-mono-sm text-ink-light px-2 pt-2">{month}</p>
                  {rows.map((row) => (
                    <HistoryRow key={row.id} row={row} role={role} />
                  ))}
                </div>
              ))
            )}
          </div>

          {visibleCount < filteredRows.length ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="h-11 rounded-xl px-5 bg-surface-white border border-border-rule text-label text-ink-mid"
                onClick={() => setVisibleCount((prev) => prev + 4)}
              >
                Load More
              </button>
            </div>
          ) : null}

          <p className="text-caption text-ink-light">
            TODO: Replace ORDER_DATA with API results once order history endpoint and pagination are available.
          </p>
        </section>
      </main>
    </div>
  );
}