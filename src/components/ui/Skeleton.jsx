import './Skeleton.css';

export default function Skeleton({ className = '', ...props }) {
  return <div className={`skeleton ${className}`} {...props} />;
}