import './Avatar.css';

export default function Avatar({
  type = 'Initials',
  initials = 'JD',
  image = null,
  className = '',
  ...props
}) {
  return (
    <div className={`avatar avatar-${type.toLowerCase()} ${className}`} {...props}>
      {type === 'Image' && image ? (
        <img src={image} alt="User avatar" className="avatar-image" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  );
}
