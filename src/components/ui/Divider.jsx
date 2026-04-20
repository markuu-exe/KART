import './Divider.css';

export default function Divider({ className = '', ...props }) {
  return <div className={`divider ${className}`} {...props} />;
}
