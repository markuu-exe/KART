import './Navigation.css';
import Avatar from '../ui/Avatar';

export default function Navigation({
  userName = 'User Name',
  userInitials = 'UN',
  role = 'Requester',
  selectedNav = 'Home',
  onNavChange = () => {},
  className = '',
  ...props
}) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'history', label: 'History', icon: '⏱️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className={`navigation ${className}`} {...props}>
      <div className="nav-logo">
        <div className="nav-logo-title">Kart</div>
        <div className="nav-logo-subtitle">Skip the checkout line.</div>
      </div>

      <div className="nav-items">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${selectedNav === item.id ? 'nav-item-active' : ''}`}
            onClick={() => onNavChange(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="nav-user">
        <Avatar initials={userInitials} />
        <div className="nav-user-info">
          <div className="nav-user-name">{userName}</div>
          <div className="nav-user-role">{role}</div>
        </div>
        <button type="button" className="nav-settings" aria-label="Open navigation settings">⚙️</button>
      </div>
    </nav>
  );
}
