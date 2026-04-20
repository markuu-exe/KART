import './StatusPill.css';

export default function StatusPill({
  status = 'Default',
  className = '',
  ...props
}) {
  const statusClass = `pill-${status.toLowerCase()}`;

  return (
    <div className={`status-pill ${statusClass} ${className}`} {...props}>
      {status}
    </div>
  );
}
