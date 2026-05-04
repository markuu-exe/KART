import ProfileScreen from '@/components/shared/ProfileScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function ProfileRunner() {
	return (
		<PageTransition>
			<ProfileScreen role="runner" />
		</PageTransition>
	);
}
