import './Navigation.css';
import Avatar from '../ui/Avatar';
import { APP_ROUTES } from '../../lib/routing';

export default function Navigation({
  userName = 'User Name',
  userInitials = 'UN',
  role = 'Requester',
  selectedNav = 'Home',
  onNavChange = () => {},
  className = '',
  ...props
}) {
  const isRunner = role?.toLowerCase() === 'runner';

  const navItems = [
    { id: 'home', path: isRunner ? APP_ROUTES.RUNNER_BOARD : APP_ROUTES.REQUESTER_BOARD, label: 'Home', icon: '🏠' },
    { id: 'history', path: isRunner ? APP_ROUTES.RUNNER_HISTORY : APP_ROUTES.REQUESTER_HISTORY, label: 'History', icon: '⏱️' },
    { id: 'profile', path: isRunner ? APP_ROUTES.RUNNER_PROFILE : APP_ROUTES.REQUESTER_PROFILE, label: 'Profile', icon: '👤' },
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
            onClick={() => onNavChange(item.path || item.id)}
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
