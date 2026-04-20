import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/useAppStore';
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

const ROLES = [
	{ id: 'requester', label: 'Requester', description: 'Post requests and track deliveries' },
	{ id: 'runner', label: 'Runner', description: 'Accept errands and deliver orders' },
];

export default function ZoneOnboarding() {
	const navigate = useNavigate();
	const { user, setUser } = useAppStore();
	const [selectedZoneId, setSelectedZoneId] = useState('lahug');
	const [selectedRole, setSelectedRole] = useState(user?.user_metadata?.role || 'requester');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const selectedZone = useMemo(
		() => ZONES.find((zone) => zone.id === selectedZoneId) || null,
		[selectedZoneId]
	);

	const handleContinue = async () => {
		if (!selectedZone) {
			return;
		}

		setLoading(true);
		setError('');

		try {
			const { data, error: updateError } = await supabase.auth.updateUser({
				data: {
					role: selectedRole,
					zone: selectedZone.name,
					zone_id: selectedZone.id,
					zone_name: selectedZone.name,
					zone_city: selectedZone.city,
					onboarding_complete: true,
				},
			});

			if (updateError) {
				throw updateError;
			}

			if (data.user) {
				setUser(data.user);
			} else if (user) {
				setUser({
					...user,
					user_metadata: {
						...(user.user_metadata || {}),
						role: selectedRole,
						zone: selectedZone.name,
						zone_id: selectedZone.id,
						zone_name: selectedZone.name,
						zone_city: selectedZone.city,
						onboarding_complete: true,
					},
				});
			}

			navigate(selectedRole === 'runner' ? '/runner/board' : '/requester/board');
		} catch (updateError) {
			setError(updateError instanceof Error ? updateError.message : 'Unable to save your zone right now.');
		} finally {
			setLoading(false);
		}
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

					<section className="onboarding-roles" aria-label="Choose your role">
						{ROLES.map((role) => {
							const isSelected = role.id === selectedRole;

							return (
								<button
									key={role.id}
									type="button"
									className={`onboarding-roleCard ${isSelected ? 'is-selected' : ''}`}
									onClick={() => setSelectedRole(role.id)}
									aria-pressed={isSelected}
								>
									<span className="onboarding-roleCard__label">{role.label}</span>
									<span className="onboarding-roleCard__description">{role.description}</span>
								</button>
							);
						})}
					</section>

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

					{error ? (
						<p className="onboarding-error" role="alert">
							{error}
						</p>
					) : null}

					<Button
						type="button"
						variant={selectedZone ? 'brand' : 'secondary'}
						size="lg"
						className="onboarding-continue"
						onClick={handleContinue}
						disabled={!selectedZone || loading}
					>
						{loading ? 'Saving...' : 'Continue'}
					</Button>
				</Card>
			</div>
		</div>
	);
}
