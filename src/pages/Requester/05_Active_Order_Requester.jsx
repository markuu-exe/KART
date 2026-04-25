import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History, User, Settings } from 'lucide-react';

const orderItems = [
	'Bananas (1 bunch)',
	'Apples (4 pcs)',
	'Onions (1 kg)',
	'Garlic (3 bulbs)',
	'Tomatoes (500g)',
	'Potatoes (1 kg)',
	'Carrots (2 pcs)',
	'Leafy Greens (2 bundles)',
	'Chicken (1 kg)',
	'Ground Meat (500g)',
	'Eggs (1 dozen)',
	'Fish (3 pcs)',
	'Tofu (2 blocks)',
	'Milk (1L)',
];

function RequesterNav() {
	const navigate = useNavigate();

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
						GC
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-ink-default truncate">Gina Cole</p>
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
	const [receiptUploaded, setReceiptUploaded] = useState(false);
	const [orderReceived, setOrderReceived] = useState(false);

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
							At Store
						</span>
					</div>

					<section className="mt-6">
						<div className="h-2 bg-border-rule rounded-full overflow-hidden">
							<div className="h-full bg-primary-orange rounded-full" style={{ width: '34%' }} />
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
										YB
									</div>
									<p className="text-label text-ink-default">Yuno · Runner</p>
								</div>

								<div className="bg-surface-default border border-border-rule rounded-xl px-4 py-3 text-center">
									<p className="text-label text-ink-default font-semibold">Zone Name</p>
									<p className="text-caption text-ink-light">City Name</p>
								</div>
							</div>
						</div>

						<div className="bg-primary-orange-bg border border-primary-orange rounded-2xl p-6 shadow-sm">
							<p className="text-body text-ink-light mb-1">📋 Items ({orderItems.length} items)</p>
							<ul className="list-disc pl-7 text-body text-ink-default space-y-1">
								{orderItems.map((item) => (
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
								Items total: <span className="font-mono text-mono">₱715.56</span>
							</p>
							<p className="text-body text-ink-mid mt-1">
								+ Runner fee: <span className="font-mono text-mono">₱30</span>
							</p>
							<div className="my-4 border-t border-border-rule" />
							<p className="text-body text-ink-default">
								Prepare: <span className="font-mono text-primary-orange text-mono">₱745.56</span>
							</p>
							<p className="text-caption text-ink-mid mt-2">Pay via COD or GCash: [RunnerGCashNumber]</p>

							<button
								type="button"
								className="mt-4 h-11 px-5 rounded-xl border border-primary-orange text-primary-orange text-label"
								onClick={() => {
									// TODO: Connect to PATCH /api/v1/orders/:id/confirm-delivery endpoint.
									setOrderReceived(true);
									setReceiptUploaded(true);
								}}
							>
								I Received My Order
							</button>

							{orderReceived ? (
								<p className="text-caption text-status-green mt-3">Order marked as received.</p>
							) : null}
						</div>

						<button
							type="button"
							className="text-caption text-status-red underline mx-auto block"
							onClick={() => {
								// TODO: Connect report issue action to support workflow when endpoint is available.
							}}
						>
							Something wrong? Report an issue
						</button>
					</section>
				</div>
			</main>
		</div>
	);
}
