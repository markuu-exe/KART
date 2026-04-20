import './InfoRow.css';

export default function InfoRow({
  label = 'Label',
  value = 'Value',
  className = '',
  ...props
}) {
  return (
    <div className={`info-row ${className}`} {...props}>
      <div className="info-row-label">{label}</div>
      <div className="info-row-value">{value}</div>
    </div>
  );
}
