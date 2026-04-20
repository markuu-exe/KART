import './Chip.css';

export default function Chip({
  label = 'Label',
  selected = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`chip ${selected ? 'chip-selected' : 'chip-default'} ${className}`}
      {...props}
    >
      {label}
    </div>
  );
}
