import { cn } from "@/lib/utils";

export default function Input({
  type = 'Text',
  state = 'Default',
  label = '',
  placeholder = '',
  prefix = null,
  suffix = null,
  maxLength = 500,
  value = '',
  onChange = () => {},
  className = '',
  ...props
}) {
  const isTextarea = type === 'Textarea';
  const charCount = value.length;
  const isFocused = state === 'Focused';

  const sharedFieldClasses = cn(
    'w-full min-w-0 border-0 bg-transparent font-sans text-sm leading-6 text-ink-default outline-none placeholder:text-ink-light',
    className,
  );

  const fieldShellClasses = cn(
    'flex items-start gap-1.5 rounded-md border bg-surface-white px-3 transition-colors',
    isTextarea ? 'min-h-24 py-3 flex-col' : 'h-11 items-center',
    isFocused ? 'border-primary-orange ring-1 ring-primary-orange/20' : 'border-border-rule',
  );

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label className="font-sans text-xs font-normal uppercase tracking-wider text-ink-light">
          {label}
        </label>
      )}

      {isTextarea ? (
        <div className={fieldShellClasses}>
          <textarea
            className={sharedFieldClasses}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
            {...props}
          />
          <div className="mt-1 w-full text-right font-sans text-xs font-normal text-ink-light">
            {charCount} / {maxLength}
          </div>
        </div>
      ) : (
        <div className={fieldShellClasses}>
          {prefix && <span className="whitespace-nowrap font-mono text-sm font-medium text-primary-orange-light">{prefix}</span>}
          <input
            type="text"
            className={sharedFieldClasses}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
          />
          {suffix && <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">{suffix}</span>}
        </div>
      )}
    </div>
  );
}
