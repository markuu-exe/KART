import './EmptyState.css';

export default function EmptyState({
  icon = null,
  title = 'Title',
  message = 'Body',
  className = '',
  ...props
}) {
  return (
    <div className={`empty-state ${className}`} {...props}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}
