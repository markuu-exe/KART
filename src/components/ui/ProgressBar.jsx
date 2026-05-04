import { cn } from "@/lib/utils";

const STEPS = ['Accepted', 'At Store', 'Purchased', 'Delivered'];

export default function ProgressBar({
  currentStep = 'Accepted',
  className = '',
  ...props
}) {
  const stepIndex = STEPS.indexOf(currentStep);
  const progressPercent = stepIndex === -1 ? 0 : ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className={cn('flex w-full max-w-sm flex-col gap-2', className)} {...props}>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-border-rule">
        <div
          className="h-full rounded-full bg-primary-orange transition-[width] duration-300 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex w-full items-center justify-between gap-0">
        {STEPS.map((step) => (
          <div
            key={step}
            className={cn(
              'flex-1 whitespace-nowrap px-1 text-center font-sans text-sm font-normal text-ink-light',
              STEPS.indexOf(step) <= stepIndex && 'text-ink-light',
              step === currentStep && 'font-bold text-primary-orange',
            )}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
