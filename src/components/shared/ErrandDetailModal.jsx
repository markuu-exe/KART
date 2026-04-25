import { useEffect } from 'react';
import { X } from 'lucide-react';

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center gap-1.5 min-h-4.5">
      <span className="text-caption text-ink-light uppercase">{label}</span>
      <span className="w-0.75 h-0.75 rounded-full bg-ink-light" aria-hidden="true" />
      <span className="text-label text-ink-default font-medium">{value}</span>
    </div>
  );
}

export default function ErrandDetailModal({
  isOpen,
  errand,
  onClose,
  onAccept,
  acceptLabel = 'Accept This Errand',
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !errand) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/45 flex items-end justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="errand-detail-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-surface-white rounded-t-[20px] sm:rounded-[20px] shadow-md w-full max-w-130 max-h-[90vh] overflow-hidden">
        <div className="px-6 py-5 overflow-y-auto max-h-[90vh]">
          <div className="w-10 h-1 rounded-full bg-border-rule mx-auto" aria-hidden="true" />

          <div className="mt-5 flex items-center justify-between">
            <h2 id="errand-detail-title" className="text-heading-2 text-ink-default font-semibold">
              Errand Details
            </h2>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-surface-default text-ink-mid inline-flex items-center justify-center"
              onClick={onClose}
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 border-t border-border-rule" />

          <ul className="mt-4 list-disc pl-5 text-label text-ink-default font-semibold space-y-0.5">
            {errand.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="mt-4 border-t border-border-rule" />

          <div className="mt-4 flex flex-col gap-3">
            <MetaRow label="Zone" value={errand.zone} />
            <MetaRow label="Address" value={errand.address} />
            <MetaRow label="Budget" value={errand.budget} />
            <MetaRow label="Posted Time" value={errand.postedTime} />
          </div>

          <div className="mt-4 border-t border-border-rule" />

          <div className="mt-4 flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary-orange text-surface-white text-label font-bold inline-flex items-center justify-center">
              {errand.requesterInitials || 'RQ'}
            </div>
            <p className="text-label text-ink-mid font-medium">
              {errand.requesterName} · {errand.requesterRole}
            </p>
          </div>

          <button
            type="button"
            className="mt-4 w-full h-11 rounded-xl bg-primary-orange text-surface-white text-label shadow-sm"
            onClick={() => onAccept?.(errand)}
          >
            {acceptLabel} →
          </button>
        </div>
      </div>
    </div>
  );
}
