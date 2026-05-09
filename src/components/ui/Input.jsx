import { useId } from "react";
import { cn } from "@/lib/utils";

export default function Input({
  type = "text",
  label = "",
  placeholder = "",
  prefix = null,
  suffix = null,
  maxLength = 500,
  value = "",
  onChange = () => {},
  className = "",
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isTextarea = type.toLowerCase() === "textarea";
  const charCount = value ? value.length : 0;


  const fieldShellClasses = cn(
    "relative flex rounded-md border bg-surface-white transition-colors w-full",
    "border-border-rule focus-within:border-primary-orange focus-within:ring-1 focus-within:ring-primary-orange/20",
    isTextarea ? "min-h-24 p-3 flex-col items-stretch" : "h-11 items-center"
  );

  const sharedFieldClasses = cn(
    "w-full min-w-0 border-0 bg-transparent font-sans text-sm leading-6 text-ink-default outline-none placeholder:text-ink-light focus:ring-0",
    !isTextarea && "h-full", // Let standard input take full height of the container
    !isTextarea && prefix && "pl-10", // Left padding to make room for prefix
    !isTextarea && suffix && "pr-10", // Right padding to make room for suffix
    className
  );

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label 
          htmlFor={inputId}
          className="font-sans text-xs font-normal uppercase tracking-wider text-ink-light cursor-pointer select-none"
        >
          {label}
        </label>
      )}

      {isTextarea ? (
        <div className={fieldShellClasses}>
          <textarea
            id={inputId}
            className={sharedFieldClasses}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            placeholder={placeholder}
            {...props}
          />
          <div className="mt-1 w-full text-right font-sans text-xs font-normal text-ink-light select-none">
            {charCount} / {maxLength}
          </div>
        </div>
      ) : (
        <div className={fieldShellClasses}>
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center whitespace-nowrap font-mono text-sm font-medium text-primary-orange-light select-none">
              {prefix}
            </span>
          )}

          <input
            id={inputId}
            type={type}
            className={sharedFieldClasses}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
          />

          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-5 w-5 items-center justify-center shrink-0 select-none">
              {suffix}
            </span>
          )}
        </div>
      )}
    </div>
  );
}