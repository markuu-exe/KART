import './NavItemGroup.css';
import NavItem from './NavItem';

export default function NavItemGroup({
  selectedItem = 'home',
  onItemSelect = () => {},
  className = '',
  ...props
}) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <div className={`nav-item-group ${className}`} {...props}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          label={item.label}
          active={selectedItem === item.id}
          onClick={() => onItemSelect(item.id)}
        />
      ))}
    </div>
  );
}
