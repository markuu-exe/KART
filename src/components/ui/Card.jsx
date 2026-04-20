import './Card.css';

export default function Card({
  children,
  variant = 'Base',
  className = '',
  ...props
}) {
  const variantClass = `card-${variant.toLowerCase()}`;

  return (
    <div className={`card ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
