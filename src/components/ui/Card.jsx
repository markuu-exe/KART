import { cn } from "@/lib/utils";

const variantClasses = {
  base: 'border border-border-rule bg-surface-white',
  highlight: 'border border-primary-orange bg-primary-orange-bg',
  statusaccent: 'border-l-4 border-ink-default pl-5 pr-4 py-4',
};

export default function Card({
  children,
  variant = 'Base',
  className = '',
  ...props
}) {
  const variantClass = variantClasses[variant.toLowerCase()] || variantClasses.base;

  return (
    <div className={cn('flex flex-col items-start justify-center overflow-hidden rounded-lg bg-surface-white p-6 shadow-sm', variantClass, className)} {...props}>
      {children}
    </div>
  );
}
