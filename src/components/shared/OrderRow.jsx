import './OrderRow.css';

export default function OrderRow({
  itemSummary = 'Sample Item',
  zone = '[Zone]',
  date = '[DD MMM YYYY]',
  amount = '₱0.00',
  role = 'Requester',
  className = '',
  ...props
}) {
  const isRunner = role === 'Runner';

  return (
    <div className={`order-row ${className}`} {...props}>
      <div className="order-row-status-stripe" />
      <div className="order-row-content">
        <div className="order-row-summary">{itemSummary}</div>
        <div className="order-row-meta">
          <span>{isRunner ? 'You ran' : 'You requested'}</span>
          <span className="order-row-dot">•</span>
          <span>{zone}</span>
          <span className="order-row-dot">•</span>
          <span>{date}</span>
        </div>
      </div>
      <div className="order-row-amount">
        <div className="order-row-price">{amount}</div>
        <div className="order-row-label">
          {isRunner ? '+₱30 fee' : 'total paid'}
        </div>
      </div>
    </div>
  );
}
