import './EmptyState.css';

export default function EmptyState({
  icon = null,
  title = 'Title',
  message = 'Body',
  actionLabel = '',
  onAction,
  className = '',
  iconClassName = '',
  titleClassName = '',
  messageClassName = '',
  actionClassName = '',
  children = null,
  ...props
}) {
  const hasAction = Boolean(actionLabel && onAction);

  return (
    <div className={`empty-state ${className}`.trim()} {...props}>
      {icon && <div className={`empty-state-icon ${iconClassName}`.trim()}>{icon}</div>}
      <h2 className={`empty-state-title ${titleClassName}`.trim()}>{title}</h2>
      <p className={`empty-state-message ${messageClassName}`.trim()}>{message}</p>
      {children}
      {hasAction && (
        <button type="button" className={`empty-state-action ${actionClassName}`.trim()} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
