import './Avatar.css';
import { cn } from '@/lib/utils';

export default function Avatar({
  type = 'Initials',
  initials = 'JD',
  image = null,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center shrink-0 rounded-full overflow-hidden min-w-[36px] min-h-[36px]',
        className
      )}
      {...props}
    >
      {type === 'Image' && image ? (
        <img src={image} alt="User avatar" className="avatar-image w-full h-full object-cover" />
      ) : (
        <span className="avatar-initials w-full h-full flex items-center justify-center">{initials}</span>
      )}
    </div>
  );
}
