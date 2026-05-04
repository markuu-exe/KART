import OrderHistoryScreen from '@/components/shared/OrderHistoryScreen';
import PageTransition from '@/components/shared/PageTransition';

export default function OrderHistoryRunner() {
	return (
		<PageTransition>
			<OrderHistoryScreen role="runner" />
		</PageTransition>
	);
}
