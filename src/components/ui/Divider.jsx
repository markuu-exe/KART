export default function Divider({ className = '', ...props }) {
  return <div className={`h-px w-full bg-border-rule ${className}`} {...props} />;
}
