import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, History, User, Settings, MapPin } from 'lucide-react';
import { ErrandDetailModal, EmptyState } from '@/components';
import { useAppStore } from '@/store/useAppStore';
import boxIllustration from '@/assets/Icons/Icon=Box.svg';

const FILTERS = ['All Zones', 'Guadalupe', 'Tisa', 'Talamban', 'Lahug', 'Labangon', 'Banilad', 'Apas', 'Zapatera'];

const FALLBACK_ITEMS = ['No item details provided'];
const OPEN_STATUSES = new Set(['', 'open', 'pending', 'posted', 'new']);

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

function toSummary(items) {
	if (Array.isArray(items) && items.length > 0) {
		return items.join(', ');
	}

	if (typeof items === 'string' && items.trim()) {
		return items;
	}

	return 'Errand request';
}

function RunnerNav() {
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
		{ id: 'Board', icon: ClipboardList, label: 'Board', active: true, path: '/runner/board' },
		{ id: 'History', icon: History, label: 'History', active: false, path: '/runner/history' },
		{ id: 'Profile', icon: User, label: 'Profile', active: false, path: '/runner/profile' },
	];

	return (
		<aside className="bg-surface-white border-r border-border-rule flex min-h-screen min-w-60 flex-col px-4 py-6 self-stretch">
			<div className="flex flex-col gap-1">
				{items.map((item) => {
					const Icon = item.icon;

					return (
						<button
							key={item.id}
							type="button"
							className={`min-h-11 px-3 rounded-xl flex items-center gap-3 text-left ${
								item.active ? 'bg-primary-orange-bg text-primary-orange' : 'text-ink-mid'
							}`}
							onClick={() => navigate(item.path)}
						>
							<Icon className="w-5 h-5" />
							<span className={`text-sm ${item.active ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
						</button>
					);
				})}
			</div>

			<div className="mt-auto pt-8">
				<div className="flex items-center gap-3 min-w-52">
					<div className="w-9 h-9 rounded-full bg-status-blue inline-flex items-center justify-center text-surface-white text-sm font-bold">
						{initials}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-ink-default truncate">{fullName}</p>
						<p className="text-caption text-ink-light">Runner</p>
					</div>
					<Settings className="w-5 h-5 text-ink-mid" />
				</div>
			</div>
		</aside>
	);
}

function RunnerErrandCard({ errand, onDetails, onAccept }) {
	return (
		<div className="bg-surface-white border-l-4 border-primary-orange rounded-2xl shadow-sm pl-5 pr-4 py-4 w-full max-w-125 min-w-90">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-6">
					<p className="flex-1 text-label text-ink-default font-semibold line-clamp-2">{errand.summary}</p>
					<span className="h-6 px-2.5 rounded-full bg-status-green-bg text-status-green font-mono text-mono-sm inline-flex items-center">
						{errand.payout}
					</span>
				</div>

				<div className="flex items-center gap-1.5 text-caption text-ink-light">
					<MapPin className="w-3 h-3" />
					<span>{errand.zone}</span>
					<span className="w-0.75 h-0.75 rounded-full bg-ink-light" />
					<span>{errand.address}</span>
					<span className="w-0.75 h-0.75 rounded-full bg-ink-light" />
					<span>{errand.age}</span>
				</div>

				<div className="grid grid-cols-2 gap-2 pt-1">
					<button
						type="button"
						className="h-9 rounded-xl bg-status-green-bg text-status-green text-label"
						onClick={() => onAccept(errand)}
					>
						Accept
					</button>
					<button
						type="button"
						className="h-9 rounded-xl border border-border-rule bg-surface-white text-ink-mid text-label"
						onClick={() => onDetails(errand)}
					>
						Details
					</button>
				</div>
			</div>
		</div>
	);
}

function EmptyErrandState({ zoneLabel }) {
	const navigate = useNavigate();

	return (
		<div className="flex items-center justify-center py-4" style={{ minHeight: 360 }}>
			<EmptyState
				illustration={<img src={boxIllustration} alt="" aria-hidden="true" />}
				title="No errands available"
				message={
					zoneLabel === 'All Zones'
						? 'There are no open errands near you right now. Check back soon or pick a zone to narrow the search.'
						: `There are no open errands in ${zoneLabel.toLowerCase()} right now. Try another zone or check back soon.`
				}
				actionLabel={zoneLabel === 'All Zones' ? 'Refresh board' : 'Show all zones'}
				onAction={() => {
					if (zoneLabel === 'All Zones') {
						navigate('/runner/board');
						return;
					}

					navigate('/runner/board');
				}}
			/>
		</div>
	);
}

export default function RunnerErrandBoard() {
	const navigate = useNavigate();
	const { user, orders, fetchOrders, acceptOrder, isOrdersLoading } = useAppStore();
	const [selectedFilter, setSelectedFilter] = useState('All Zones');
	const [selectedErrand, setSelectedErrand] = useState(null);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders, user?.id]);

	const openErrands = useMemo(
		() =>
			orders
				.filter((order) => OPEN_STATUSES.has(String(order.status || '').toLowerCase()))
				.map((order) => ({
					id: order.id,
					summary: toSummary(order.items),
					zone: order.zone || 'Unspecified zone',
					address: [order.city, order.zone].filter(Boolean).join(', ') || 'Address not specified',
					age: formatRelativeTime(order.created_at),
					payout: formatCurrency(order.amount),
					items: Array.isArray(order.items) && order.items.length > 0 ? order.items : FALLBACK_ITEMS,
				})),
		[orders],
	);

	const filteredErrands = useMemo(() => {
		if (selectedFilter === 'All Zones') {
			return openErrands;
		}

		return openErrands.filter((errand) => errand.zone === selectedFilter);
	}, [openErrands, selectedFilter]);

	const modalErrand = useMemo(() => {
		if (!selectedErrand) {
			return null;
		}

		return {
			items: selectedErrand.items,
			zone: selectedErrand.zone,
			address: selectedErrand.address,
			budget: selectedErrand.payout,
			postedTime: selectedErrand.age,
			requesterInitials: 'GC',
			requesterName: 'Gina',
			requesterRole: 'Requester',
		};
	}, [selectedErrand]);

	const handleAccept = async (errand) => {
		const { error } = await acceptOrder({ orderId: errand.id, runnerId: user?.id });
		if (!error) {
			navigate('/runner/active-order');
		}
	};

	return (
		<div className="bg-surface-default flex min-h-screen w-full items-stretch">
			<RunnerNav />

			<main className="bg-surface-default flex-1 min-h-screen p-10 overflow-y-auto">
				<header className="pb-6">
					<h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Errand Board</h1>
					<p className="text-caption text-ink-light">{filteredErrands.length} open near you</p>
				</header>

				<section className="pb-4 border-b border-border-rule flex flex-wrap gap-2">
					{FILTERS.map((zone) => {
						const active = zone === selectedFilter;
						return (
							<button
								key={zone}
								type="button"
								className={`h-8 px-3 rounded-full border text-caption ${
									active
										? 'bg-primary-orange-bg border-primary-orange text-primary-orange font-semibold'
										: 'bg-surface-default border-border-rule text-ink-mid font-medium'
								}`}
								onClick={() => setSelectedFilter(zone)}
							>
								{zone}
							</button>
						);
					})}
				</section>

				{filteredErrands.length > 0 ? (
					<section className="pt-6 flex flex-wrap gap-4 justify-center">
						{filteredErrands.map((errand) => (
							<RunnerErrandCard
								key={errand.id}
								errand={errand}
								onDetails={setSelectedErrand}
								onAccept={handleAccept}
							/>
						))}
					</section>
				) : (
					<EmptyErrandState zoneLabel={selectedFilter} />
				)}
				{isOrdersLoading ? <p className="pt-4 text-center text-caption text-ink-light">Loading errands...</p> : null}
			</main>

			<ErrandDetailModal
				isOpen={Boolean(selectedErrand)}
				errand={modalErrand}
				onClose={() => setSelectedErrand(null)}
				onAccept={() => setSelectedErrand(null)}
			/>
		</div>
	);
}
