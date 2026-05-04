import OrderHistoryScreen from '@/components/shared/OrderHistoryScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function OrderHistoryRequester() {
	return (
		<PageTransition>
			<OrderHistoryScreen role="requester" />
		</PageTransition>
	);
}
