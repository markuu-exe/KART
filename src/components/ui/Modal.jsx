import './Modal.css';

export default function Modal({
  children,
  type = 'BottomSheet',
  className = '',
  ...props
}) {
  return (
    <div className={`modal modal-${type.toLowerCase()} ${className}`} {...props}>
      <div className="modal-drag-handle" />
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
}
