import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, History, User, Settings, ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const STEP_ORDER = ['accepted', 'at_store', 'purchased', 'delivered'];

const STEP_LABELS = {
	accepted: 'Accepted',
	at_store: 'At Store',
	purchased: 'Purchased',
	delivered: 'Delivered',
};

const ACTIVE_STATUSES = new Set(['accepted', 'at_store', 'purchased', 'delivered']);

function getInitials(name) {
	const parts = String(name || 'User').trim().split(' ').filter(Boolean);
	return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
}

function toSummaryItems(items) {
	if (Array.isArray(items) && items.length > 0) {
		return items;
	}

	if (typeof items === 'string' && items.trim()) {
		return [items];
	}

	return ['No items listed'];
}

function formatCurrency(amount) {
	const numericAmount = Number(amount || 0);
	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 2,
	}).format(numericAmount);
}

function RunnerNav() {
	const navigate = useNavigate();
	const { user } = useAppStore();
	const fullName = user?.user_metadata?.full_name || 'User';

	const items = [
		{ id: 'Board', icon: ClipboardList, label: 'Board', path: '/runner/board' },
		{ id: 'History', icon: History, label: 'History', path: '/runner/history' },
		{ id: 'Profile', icon: User, label: 'Profile', path: '/runner/profile' },
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
							className="min-h-11 px-3 rounded-xl flex items-center gap-3 text-ink-mid"
							onClick={() => navigate(item.path)}
						>
							<Icon className="w-5 h-5" />
							<span className="text-sm font-medium">{item.label}</span>
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
						<p className="text-caption text-ink-light">Runner</p>
					</div>
					<Settings className="w-5 h-5 text-ink-mid" />
				</div>
			</div>
		</aside>
	);
}

function Stepper({ step }) {
	const activeIndex = STEP_ORDER.indexOf(step);

	return (
		<div className="w-full flex items-center px-2">
			{STEP_ORDER.map((name, index) => {
				const isDone = index <= activeIndex;
				const isCurrent = index === activeIndex;

				return (
					<div key={name} className="flex items-center flex-1">
						<div className="w-full max-w-22.5 flex flex-col items-center">
							<div
								className={`w-6 h-6 rounded-full inline-flex items-center justify-center ${
									isDone
										? step === 'delivered'
											? 'bg-status-green text-surface-white'
											: 'bg-primary-orange text-surface-white'
										: 'bg-border-rule text-border-rule'
								}`}
							>
								{step === 'delivered' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px]">•</span>}
							</div>
							<p className={`mt-1 text-label ${isCurrent ? 'text-ink-default' : 'text-ink-mid'}`}>{STEP_LABELS[name]}</p>
						</div>
						{index < STEP_ORDER.length - 1 ? (
							<div className="flex-1 h-0.5 bg-border-rule -mt-5" />
						) : null}
					</div>
				);
			})}
		</div>
	);
}

export default function ActiveOrderRunner() {
	const navigate = useNavigate();
	const { user, orders, fetchOrders, isOrdersLoading, updateOrderStatus } = useAppStore();
	const [step, setStep] = useState('accepted');
	const [receiptPreview, setReceiptPreview] = useState('');

	useEffect(() => {
		if (!user?.id) {
			return;
		}

		fetchOrders({ runnerId: user.id });
	}, [fetchOrders, user?.id]);

	const activeOrder = useMemo(
		() =>
			orders.find((order) => {
				const status = String(order.status || '').toLowerCase();
				return ACTIVE_STATUSES.has(status);
			}),
		[orders],
	);

	useEffect(() => {
		if (!activeOrder?.status) {
			return;
		}

		setStep(String(activeOrder.status).toLowerCase());
	}, [activeOrder?.status]);

	const statusTone = useMemo(() => {
		if (step === 'accepted') {
			return { pillClass: 'bg-status-blue-bg text-status-blue', label: 'Accepted' };
		}
		if (step === 'at_store') {
			return { pillClass: 'bg-primary-orange-bg text-primary-orange', label: 'At Store' };
		}
		if (step === 'purchased') {
			return { pillClass: 'bg-status-yellow-bg text-status-yellow', label: 'Purchased' };
		}
		return { pillClass: 'bg-status-green text-surface-white', label: 'Delivered' };
	}, [step]);

	const handlePrimaryAction = async () => {
		if (!activeOrder?.id) {
			return;
		}

		if (step === 'accepted') {
			const { error } = await updateOrderStatus({ orderId: activeOrder.id, status: 'at_store' });
			if (!error) {
				setStep('at_store');
			}
			return;
		}

		if (step === 'at_store') {
			const { error } = await updateOrderStatus({ orderId: activeOrder.id, status: 'purchased' });
			if (!error) {
				setStep('purchased');
			}
			return;
		}

		if (step === 'purchased') {
			const { error } = await updateOrderStatus({ orderId: activeOrder.id, status: 'delivered' });
			if (!error) {
				setStep('delivered');
			}
		}
	};

	const primaryLabel =
		step === 'accepted' ? "I'm at the Store" : step === 'at_store' ? 'Mark as Purchased' : 'Mark as Delivered';

	if (isOrdersLoading) {
		return (
			<div className="bg-surface-default flex min-h-screen w-full items-stretch">
				<RunnerNav />
				<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
					<p className="text-caption text-ink-light">Loading active errand...</p>
				</main>
			</div>
		);
	}

	if (!activeOrder) {
		return (
			<div className="bg-surface-default flex min-h-screen w-full items-stretch">
				<RunnerNav />
				<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
					<h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Active Errand</h1>
					<p className="text-caption text-ink-light mt-2">No active errand assigned right now.</p>
				</main>
			</div>
		);
	}

	return (
		<div className="bg-surface-default flex min-h-screen w-full items-stretch">
			<RunnerNav />

			<main className="bg-surface-default flex-1 min-h-screen overflow-y-auto p-10">
				<button type="button" className="inline-flex items-center gap-1.5 text-primary-orange text-label mb-4" onClick={() => navigate('/runner/board')}>
					<ArrowLeft className="w-4 h-4" />
					Back to Board
				</button>

				<section className="max-w-225 mx-auto flex flex-col gap-6">
					<div className="flex items-center justify-between">
						<h1 className="font-heading font-bold text-heading-1 tracking-tight text-ink-default">Active Errand</h1>
						<span className={`h-6 px-2.5 rounded-full font-mono text-mono-sm inline-flex items-center ${statusTone.pillClass}`}>
							{statusTone.label}
						</span>
					</div>

					<Stepper step={step} />

					<div className="bg-surface-default border border-border-rule rounded-2xl p-4 flex items-center gap-3">
						<button type="button" className="text-caption text-primary-orange underline">Open Maps →</button>
						<span className="text-primary-orange text-label">📍</span>
						<div>
							<p className="text-[14px] text-ink-default font-semibold">Deliver to: {activeOrder.zone || 'Unspecified zone'}</p>
							<p className="text-caption text-ink-light">{activeOrder.city || 'No city details provided'}</p>
						</div>
					</div>

					<div className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6 max-w-170 mx-auto w-full">
						<div className="bg-surface-default border border-border-rule rounded-2xl p-5">
							<h2 className="text-heading-2 text-ink-default font-semibold">🛒 Shopping List</h2>
							<ul className="mt-3 text-body text-ink-default space-y-1 pl-5 list-disc">
								{toSummaryItems(activeOrder.items).map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<div className="mt-4 border border-border-rule p-3">
								<p className="font-mono text-mono text-ink-light">Budget cap: {formatCurrency(activeOrder.amount)}</p>
							</div>
						</div>
					</div>

					<div className="text-center">
						<p className="font-mono text-mono-sm text-ink-light uppercase">📷 Receipt</p>
						{step === 'delivered' ? (
							<div className="mt-2 mx-auto w-full max-w-190 rounded-xl border-[1.5px] border-dashed border-border-rule bg-primary-orange-bg p-4 text-caption text-ink-light">
								{receiptPreview ? (
									<img src={receiptPreview} alt="Uploaded receipt" className="w-full h-42.5 object-cover rounded-lg" />
								) : (
									'No receipt image uploaded.'
								)}
							</div>
						) : (
							<label className="mt-2 mx-auto w-full max-w-190 min-h-20 rounded-xl border-[1.5px] border-dashed border-primary-orange bg-primary-orange-bg px-8 py-5 flex flex-col items-center justify-center cursor-pointer">
								<Camera className="w-6 h-6 text-ink-default" />
								<span className="text-caption text-ink-default mt-1">Click to Upload Receipt</span>
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(event) => {
										const file = event.target.files?.[0];
										if (!file) return;
										setReceiptPreview(URL.createObjectURL(file));
									}}
								/>
							</label>
						)}
					</div>

					<button
						type="button"
						className={`h-12 rounded-xl px-5 shadow-sm text-label ${
							step === 'delivered'
								? 'bg-border-rule text-ink-light cursor-not-allowed'
								: 'bg-primary-orange text-surface-white'
						}`}
						onClick={handlePrimaryAction}
						disabled={step === 'delivered'}
					>
						{step === 'delivered' ? '🏠 Mark as Delivered' : `🏪 ${primaryLabel}`}
					</button>

					{step !== 'delivered' ? (
						<button type="button" className="text-caption text-status-red mx-auto">
							Cancel Errand
						</button>
					) : null}

					{step === 'delivered' ? (
						<div className="bg-status-green-bg border border-status-green rounded-2xl p-5 text-center">
							<p className="text-heading-2 text-status-green font-semibold">🎉 Errand Complete!</p>
							<p className="text-body text-ink-mid mt-2">Collect payment from requester.</p>
							<button
								type="button"
								className="mt-4 h-11 w-full rounded-xl bg-surface-white border border-border-rule text-label text-ink-mid"
								onClick={() => navigate('/runner/board')}
							>
								Back to Errand Board
							</button>
						</div>
					) : null}
				</section>
			</main>
		</div>
	);
}
