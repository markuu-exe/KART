function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SkeletonCard({ className = '', showActions = false, accent = 'neutral' }) {
  const accentClass = accent === 'orange' ? 'border-primary-orange' : 'border-border-rule';

  return (
    <div
      className={joinClasses(
        'animate-pulse w-full bg-surface-white border-l-4 rounded-2xl shadow-sm pl-5 pr-4 py-4',
        accentClass,
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6">
          <div className="h-4 flex-1 rounded bg-surface-default" />
          <div className="h-6 w-18 rounded-full bg-surface-default" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-surface-default" />
          <div className="h-3 w-20 rounded bg-surface-default" />
          <div className="h-1 w-1 rounded-full bg-surface-default" />
          <div className="h-3 w-24 rounded bg-surface-default" />
          <div className="h-1 w-1 rounded-full bg-surface-default" />
          <div className="h-3 w-14 rounded bg-surface-default" />
        </div>

        {showActions ? (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-9 rounded-xl bg-surface-default" />
            <div className="h-9 rounded-xl bg-surface-default" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
