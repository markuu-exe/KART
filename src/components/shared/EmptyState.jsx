import './EmptyState.css';

export default function EmptyState({
  illustration = null,
  icon = null,
  title = 'Title',
  message = 'Body',
  actionLabel = '',
  onAction,
  className = '',
  illustrationClassName = '',
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
      {illustration && <div className={`empty-state-illustration ${illustrationClassName}`.trim()}>{illustration}</div>}
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
