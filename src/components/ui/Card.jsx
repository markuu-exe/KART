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
    <div className={cn('w-full max-w-full flex flex-col items-start justify-center overflow-hidden rounded-lg bg-surface-white p-4 sm:p-6 shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-lg', variantClass, className)} {...props}>
      {children}
    </div>
  );
}
