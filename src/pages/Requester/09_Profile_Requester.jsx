import ProfileScreen from '@/components/shared/ProfileScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function ProfileRequester() {
	return (
		<PageTransition>
			<ProfileScreen role="requester" />
		</PageTransition>
	);
}
