import EditProfileScreen from '@/components/shared/EditProfileScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function EditProfileRunner() {
	return (
		<PageTransition>
			<EditProfileScreen role="runner" />
		</PageTransition>
	);
}
