import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, Settings } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const ACTIVE_STATUSES = new Set(['accepted', 'at_store', 'purchased', 'delivered']);

function getInitials(name) {
	const parts = String(name || 'User').trim().split(' ').filter(Boolean);
	return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
}

function formatCurrency(amount) {
	const numericAmount = Number(amount || 0);
	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 2,
	}).format(numericAmount);
}

function toStatusLabel(status) {
	const normalized = String(status || '').toLowerCase();
	if (normalized === 'accepted') return 'Accepted';
	if (normalized === 'at_store') return 'At Store';
	if (normalized === 'purchased') return 'Purchased';
	if (normalized === 'delivered') return 'Delivered';
	return 'Pending';
}

function getProgressWidth(status) {
	const normalized = String(status || '').toLowerCase();
	if (normalized === 'accepted') return '25%';
	if (normalized === 'at_store') return '50%';
	if (normalized === 'purchased') return '75%';
	if (normalized === 'delivered') return '100%';
	return '10%';
}

function RequesterNav() {
	const navigate = useNavigate();
	const { user } = useAppStore();
	const fullName = user?.user_metadata?.full_name || 'User';

	const items = [
		{ id: 'Home', label: 'Home', icon: Home, active: true, path: '/requester/board' },
		{ id: 'History', label: 'History', icon: History, active: false, path: '/requester/history' },
		{ id: 'Profile', label: 'Profile', icon: User, active: false, path: '/requester/profile' },
	];

	return (
		<aside className="bg-surface-white border-r border-border-rule flex min-h-screen min-w-60 flex-col px-4 py-6 self-stretch">
			<div className="flex flex-col gap-1">
				{items.map((item) => {
					const Icon = item.icon;
					return (
						<button
							type="button"
							key={item.id}
							className={`min-h-11 px-3 rounded-xl flex items-center gap-3 ${
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
					<div className="w-9 h-9 rounded-full bg-primary-orange inline-flex items-center justify-center text-surface-white text-sm font-bold">
						{getInitials(fullName)}
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

export default function ActiveOrderRequester() {
	const navigate = useNavigate();
	const { user, orders, fetchOrders, isOrdersLoading, updateOrderStatus } = useAppStore();
	const [receiptUploaded, setReceiptUploaded] = useState(false);
	const [orderReceived, setOrderReceived] = useState(false);

	useEffect(() => {
		if (!user?.id) {
			return;
		}

		fetchOrders({ requesterId: user.id });
	}, [fetchOrders, user?.id]);

	const activeOrder = useMemo(
		() =>
			orders.find((order) => {
				const status = String(order.status || '').toLowerCase();
				return ACTIVE_STATUSES.has(status);
			}),
		[orders],
	);

	const currentStatus = toStatusLabel(activeOrder?.status);
	const progressWidth = getProgressWidth(activeOrder?.status);
	const items = Array.isArray(activeOrder?.items) ? activeOrder.items : [];
	const totalAmount = formatCurrency(activeOrder?.amount);
	const runnerFee = formatCurrency(30);
	const grandTotal = formatCurrency(Number(activeOrder?.amount || 0) + 30);

	const handleConfirmReceived = async () => {
		if (String(activeOrder?.status || '').toLowerCase() === 'delivered') {
			setOrderReceived(true);
			setReceiptUploaded(true);
			return;
		}

		if (!activeOrder?.id) {
			return;
		}

		const { error } = await updateOrderStatus({ orderId: activeOrder.id, status: 'delivered' });
		if (!error) {
			setOrderReceived(true);
			setReceiptUploaded(true);
		}
	};

	if (isOrdersLoading) {
		return (
			<div className="bg-surface-default flex min-h-screen w-full items-stretch">
				<RequesterNav />
				<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
					<p className="text-caption text-ink-light">Loading active order...</p>
				</main>
			</div>
		);
	}

	if (!activeOrder) {
		return (
			<div className="bg-surface-default flex min-h-screen w-full items-stretch">
				<RequesterNav />
				<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
					<div className="max-w-225 mx-auto">
						<h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Your Order</h1>
						<p className="text-caption text-ink-light mt-2">No active order right now.</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="bg-surface-default flex min-h-screen w-full items-stretch">
			<RequesterNav />

			<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
				<div className="max-w-225 mx-auto">
					<button type="button" className="text-label text-primary-orange px-2 py-1" onClick={() => navigate('/requester/board')}>
						← Your Order
					</button>

					<div className="flex items-center justify-center gap-3 mt-3">
						<h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Your Order</h1>
						<span className="h-6 px-2.5 rounded-full bg-primary-orange-bg text-primary-orange font-mono text-mono-sm inline-flex items-center">
							{currentStatus}
						</span>
					</div>

					<section className="mt-6">
						<div className="h-2 bg-border-rule rounded-full overflow-hidden">
							<div className="h-full bg-primary-orange rounded-full" style={{ width: progressWidth }} />
						</div>
						<div className="flex items-center justify-between mt-2 text-caption">
							<span className="text-ink-light">Accepted</span>
							<span className="text-primary-orange font-bold">At Store</span>
							<span className="text-ink-light">Purchased</span>
							<span className="text-ink-light">Delivered</span>
						</div>
					</section>

					<section className="mt-10 space-y-6 max-w-160 mx-auto">
						<div className="bg-primary-orange-bg border border-primary-orange rounded-2xl p-6 shadow-sm">
							<div className="flex items-center justify-center gap-6">
								<div className="flex flex-col items-center gap-1">
									<div className="w-9 h-9 rounded-full bg-status-green-bg inline-flex items-center justify-center text-status-green text-label font-bold">
										{activeOrder?.runner_id ? getInitials(activeOrder.runner_id) : '--'}
									</div>
									<p className="text-label text-ink-default">{activeOrder?.runner_id ? 'Assigned Runner' : 'Waiting for runner'}</p>
								</div>

								<div className="bg-surface-default border border-border-rule rounded-xl px-4 py-3 text-center">
									<p className="text-label text-ink-default font-semibold">{activeOrder.zone || 'Unspecified zone'}</p>
									<p className="text-caption text-ink-light">{activeOrder.city || 'Unknown city'}</p>
								</div>
							</div>
						</div>

						<div className="bg-primary-orange-bg border border-primary-orange rounded-2xl p-6 shadow-sm">
							<p className="text-body text-ink-light mb-1">📋 Items ({items.length} items)</p>
							<ul className="list-disc pl-7 text-body text-ink-default space-y-1">
								{items.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>

						<div className="text-center">
							<p className="font-mono text-mono-sm text-ink-default">📷 Receipt</p>
							<div className="mt-2 border-[1.5px] border-dashed border-border-rule rounded-xl bg-surface-default p-4">
								<p className="text-caption text-ink-light">
									{receiptUploaded ? 'Receipt received.' : 'Waiting for runner to upload receipt...'}
								</p>
							</div>
						</div>

						<div className="bg-primary-orange-bg border border-primary-orange rounded-2xl p-6 text-center">
							<p className="text-body text-ink-mid">
								Items total: <span className="font-mono text-mono">{totalAmount}</span>
							</p>
							<p className="text-body text-ink-mid mt-1">
								+ Runner fee: <span className="font-mono text-mono">{runnerFee}</span>
							</p>
							<div className="my-4 border-t border-border-rule" />
							<p className="text-body text-ink-default">
								Prepare: <span className="font-mono text-primary-orange text-mono">{grandTotal}</span>
							</p>
							<p className="text-caption text-ink-mid mt-2">Pay via COD or GCash once delivered.</p>

							<button
								type="button"
								className="mt-4 h-11 px-5 rounded-xl border border-primary-orange text-primary-orange text-label disabled:opacity-60"
								onClick={handleConfirmReceived}
								disabled={String(activeOrder?.status || '').toLowerCase() === 'delivered'}
							>
								{String(activeOrder?.status || '').toLowerCase() === 'delivered' ? 'Already Delivered' : 'I Received My Order'}
							</button>

							{orderReceived ? (
								<p className="text-caption text-status-green mt-3">Order marked as received.</p>
							) : null}
						</div>

						<button
							type="button"
							className="text-caption text-status-red underline mx-auto block"
							onClick={() => navigate('/requester/profile')}
						>
							Something wrong? Report an issue
						</button>
					</section>
				</div>
			</main>
		</div>
	);
}
