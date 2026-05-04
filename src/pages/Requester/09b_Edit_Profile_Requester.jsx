import EditProfileScreen from '@/components/shared/EditProfileScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function EditProfileRequester() {
	return (
		<PageTransition>
			<EditProfileScreen role="requester" />
		</PageTransition>
	);
}
