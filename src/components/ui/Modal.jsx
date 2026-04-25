import { cn } from "@/lib/utils";

export default function Modal({
  children,
  type = 'BottomSheet',
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        'flex w-full max-w-xl max-h-screen flex-col items-center justify-start overflow-y-auto rounded-t-2xl bg-surface-white px-6 py-6 shadow-lg',
        type === 'BottomSheet' ? 'sm:rounded-2xl' : 'rounded-2xl',
        className,
      )}
      {...props}
    >
      <div className="mb-4 h-1 w-10 shrink-0 rounded-full bg-border-rule" />
      <div className="w-full flex-1">
        {children}
      </div>
    </div>
  );
}
