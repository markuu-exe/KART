import './ZoneCard.css';

export default function ZoneCard({
  zone = 'Zone Name',
  city = 'City Name',
  isSelected = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`zone-card ${isSelected ? 'zone-card-selected' : 'zone-card-default'} ${className}`}
      {...props}
    >
      <div className="zone-card-zone">{zone}</div>
      <div className="zone-card-city">{city}</div>
    </div>
  );
}
