import './NavItem.css';

export default function NavItem({
  label = 'Label',
  active = true,
  icon = null,
  className = '',
  onClick = () => {},
  ...props
}) {
  return (
    <button
      className={`nav-item-btn ${active ? 'nav-item-active' : 'nav-item-default'} ${className}`}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="nav-item-icon">{icon}</span>}
      {active && <span className="nav-item-label">{label}</span>}
    </button>
  );
}
