import { cn } from "@/lib/utils";

export default function Chip({
  label = 'Label',
  selected = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'inline-flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 font-sans text-sm font-medium whitespace-nowrap transition-colors',
        selected
          ? 'border-primary-orange bg-primary-orange-bg text-primary-orange font-semibold'
          : 'border-border-rule bg-surface-default text-ink-mid',
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
}
