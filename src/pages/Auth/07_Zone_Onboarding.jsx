import { useMemo, useState } from 'react';
import { Button, Card } from '@/components';
import { Check } from 'lucide-react';
import onboardingHeroImage from '@/assets/Images/hero-onboading-orangeAbstract.jpg';
import './07_Zone_Onboarding.css';

const ZONES = [
	{ id: 'guadalupe', name: 'Guadalupe', city: 'Cebu City' },
	{ id: 'tisa', name: 'Tisa', city: 'Cebu City' },
	{ id: 'talamban', name: 'Talamban', city: 'Cebu City' },
	{ id: 'lahug', name: 'Lahug', city: 'Cebu City' },
	{ id: 'labangon', name: 'Labangon', city: 'Cebu City' },
	{ id: 'banilad', name: 'Banilad', city: 'Cebu City' },
	{ id: 'apas', name: 'Apas', city: 'Cebu City' },
	{ id: 'zapatera', name: 'Zapatera', city: 'Cebu City' },
	{ id: 'mactan', name: 'Mactan', city: 'Lapu-Lapu City' },
];

export default function ZoneOnboarding() {
	const [selectedZoneId, setSelectedZoneId] = useState('lahug');

	const selectedZone = useMemo(
		() => ZONES.find((zone) => zone.id === selectedZoneId) || null,
		[selectedZoneId]
	);

	const handleContinue = () => {
		// TODO: Persist selected zone via API (e.g., PATCH /api/v1/profile/zone) and route to the next onboarding step.
		// Expected payload: { zoneId: selectedZoneId, zoneName: selectedZone?.name, city: selectedZone?.city }
	};

	return (
		<div className="onboarding-page" style={{ '--onboarding-bg-image': `url(${onboardingHeroImage})` }}>
			<div className="onboarding-shell">
				<Card variant="Base" className="onboarding-card">
					<div className="onboarding-progress" aria-hidden="true">
						<span className="onboarding-progress__dot onboarding-progress__dot--active" />
						<span className="onboarding-progress__dot" />
					</div>

					<header className="onboarding-header">
						<h1 className="onboarding-title">Where are you based?</h1>
						<p className="onboarding-description">
							Pick your primary neighborhood. This helps match you with nearby errands and requesters.
						</p>
					</header>

					<section className="onboarding-zones" aria-label="Choose your primary zone">
						{ZONES.map((zone) => {
							const isSelected = zone.id === selectedZoneId;

							return (
								<button
									key={zone.id}
									type="button"
									className={`onboarding-zoneCard ${isSelected ? 'is-selected' : ''}`}
									onClick={() => setSelectedZoneId(zone.id)}
									aria-pressed={isSelected}
								>
									<span className="onboarding-zoneCard__name">{zone.name}</span>
									<span className="onboarding-zoneCard__city">{zone.city}</span>
								</button>
							);
						})}
					</section>

					{selectedZone ? (
						<div className="onboarding-zoneNotice" role="status">
							<Check className="onboarding-zoneNotice__icon" aria-hidden="true" />
							<span>
								Your zone: {selectedZone.name}, {selectedZone.city}
							</span>
						</div>
					) : null}

					<Button
						type="button"
						variant={selectedZone ? 'brand' : 'secondary'}
						size="lg"
						className="onboarding-continue"
						onClick={handleContinue}
						disabled={!selectedZone}
					>
						Continue
					</Button>
				</Card>
			</div>
		</div>
	);
}
