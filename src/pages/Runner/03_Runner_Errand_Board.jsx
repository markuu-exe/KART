import { useMemo, useState } from 'react';
import { ClipboardList, History, User, Settings, Footprints, MapPin } from 'lucide-react';
import { ErrandDetailModal } from '@/components';

const FILTERS = ['All Zones', 'Guadalupe', 'Tisa', 'Talamban', 'Lahug', 'Labangon', 'Banilad', 'Apas', 'Zapatera'];

const DETAIL_ITEMS = [
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

const OPEN_ERRANDS = Array.from({ length: 6 }, (_, index) => ({
	id: `e-${index + 1}`,
	summary: 'Bananas (1 bunch), Apples (4 pcs), Onions (1 kg), Garlic (3 bulbs), Tomatoes (500g), Potatoes (1 kg), Carrots (2 pcs)',
	zone: 'Tisa',
	address: 'Sitio Sunflower, 5th Street',
	age: '12m ago',
	payout: '₱40.00',
}));

function RunnerNav() {
	const items = [
		{ id: 'Board', icon: ClipboardList, label: 'Board', active: true },
		{ id: 'History', icon: History, label: 'History', active: false },
		{ id: 'Profile', icon: User, label: 'Profile', active: false },
	];

	return (
		<aside className="bg-surface-white border-r border-border-rule flex flex-col h-full min-w-60 px-4 py-6">
			<div className="flex flex-col pb-8">
				<p className="font-heading font-extrabold text-[28px] tracking-tight text-primary-orange">Kart</p>
				<p className="text-caption text-ink-light">Skip the checkout line.</p>
			</div>

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
						YB
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-ink-default truncate">Yuno Ball</p>
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
		<div className="bg-surface-white border-l-4 border-primary-orange rounded-2xl shadow-sm pl-5 pr-4 py-4 w-full max-w-[500px] min-w-[360px]">
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
					<span className="w-[3px] h-[3px] rounded-full bg-ink-light" />
					<span>{errand.address}</span>
					<span className="w-[3px] h-[3px] rounded-full bg-ink-light" />
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

export default function RunnerErrandBoard() {
	const [selectedFilter, setSelectedFilter] = useState('All Zones');
	const [selectedErrand, setSelectedErrand] = useState(null);

	const filteredErrands = useMemo(() => {
		if (selectedFilter === 'All Zones') {
			return OPEN_ERRANDS;
		}

		return OPEN_ERRANDS.filter((errand) => errand.zone === selectedFilter);
	}, [selectedFilter]);

	const modalErrand = useMemo(() => {
		if (!selectedErrand) {
			return null;
		}

		return {
			items: DETAIL_ITEMS,
			zone: selectedErrand.zone,
			address: selectedErrand.address,
			budget: '₱730.00',
			postedTime: '3:48 PM',
			requesterInitials: 'GC',
			requesterName: 'Gina',
			requesterRole: 'Requester',
		};
	}, [selectedErrand]);

	return (
		<div className="bg-surface-default flex items-start size-full">
			<RunnerNav />

			<main className="bg-surface-default flex-1 h-full p-10 overflow-y-auto">
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

				<section className="pt-6 flex flex-wrap gap-4 justify-center">
					{filteredErrands.map((errand) => (
						<RunnerErrandCard
							key={errand.id}
							errand={errand}
							onDetails={setSelectedErrand}
							onAccept={setSelectedErrand}
						/>
					))}
				</section>

				<section className="pt-8 text-center">
					<Footprints className="w-9 h-9 mx-auto text-ink-light/75" />
					<p className="mt-2 text-label text-ink-default font-semibold">Laid-back Day</p>
					<p className="mt-1 text-body text-ink-light">No open errands in {selectedFilter.toLowerCase()} right now.</p>
				</section>
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
