import { cn } from "@/lib/utils";

const statusClasses = {
  default: 'border border-border-rule bg-surface-white text-ink-default',
  searching: 'bg-status-yellow-bg text-amber-800',
  accepted: 'bg-status-blue-bg text-status-blue',
  atstore: 'bg-primary-orange-bg text-primary-orange',
  purchased: 'bg-primary-orange text-surface-white',
  delivered: 'bg-status-green text-surface-white',
};

export default function StatusPill({
  status = 'Default',
  className = '',
  ...props
}) {
  const statusClass = statusClasses[status.toLowerCase()] || statusClasses.default;

  return (
    <div className={cn('inline-flex h-6 items-center justify-center rounded-full px-2.5 font-mono text-xs font-medium capitalize whitespace-nowrap', statusClass, className)} {...props}>
      {status}
    </div>
  );
}
