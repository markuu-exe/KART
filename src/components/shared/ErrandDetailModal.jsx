import { useEffect } from 'react';
import { X } from 'lucide-react';
import RouteMap from './RouteMap';

function getInitials(name) {
  const parts = String(name || '').trim().split(' ').filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '';
}

function getRequesterDisplayName(errand) {
  return (
    errand.requesterName ||
    errand.requester_name ||
    errand.requesterFullName ||
    errand.requester_full_name ||
    errand.sourceOrder?.requesterName ||
    errand.sourceOrder?.requester_name ||
    errand.sourceOrder?.requesterFullName ||
    errand.sourceOrder?.requester_full_name ||
    errand.sourceOrder?.requester?.full_name ||
    errand.sourceOrder?.requester?.user_metadata?.full_name ||
    ''
  );
}

function getRequesterDisplayRole(errand) {
  return (
    errand.requesterRole ||
    errand.requester_role ||
    errand.sourceOrder?.requesterRole ||
    errand.sourceOrder?.requester_role ||
    'Requester'
  );
}

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

  const source = errand.sourceOrder || errand;
  
  // Extract pickup coordinates with multiple fallback patterns
  const pickupCoordinates =
    source.pickupCoordinates ||
    source.pickup_coordinates ||
    source.pickupLocation ||
    source.pickup_location ||
    (source.pickup_latitude != null && source.pickup_longitude != null
      ? { lat: source.pickup_latitude, lng: source.pickup_longitude }
      : null) ||
    (source.pickupLatitude != null && source.pickupLongitude != null
      ? { lat: source.pickupLatitude, lng: source.pickupLongitude }
      : null) ||
    (source.pickupLat != null && source.pickupLng != null
      ? { lat: source.pickupLat, lng: source.pickupLng }
      : null);

  // Extract dropoff coordinates with multiple fallback patterns
  const dropoffCoordinates =
    source.dropoffCoordinates ||
    source.dropoff_coordinates ||
    source.destinationCoordinates ||
    source.destination_coordinates ||
    source.dropoffLocation ||
    source.dropoff_location ||
    (source.dropoff_latitude != null && source.dropoff_longitude != null
      ? { lat: source.dropoff_latitude, lng: source.dropoff_longitude }
      : null) ||
    (source.dropoffLatitude != null && source.dropoffLongitude != null
      ? { lat: source.dropoffLatitude, lng: source.dropoffLongitude }
      : null) ||
    (source.dropoffLat != null && source.dropoffLng != null
      ? { lat: source.dropoffLat, lng: source.dropoffLng }
      : null);

  const requesterName = getRequesterDisplayName(errand);
  const requesterInitials = getInitials(requesterName);
  const requesterRole = getRequesterDisplayRole(errand);
  const showRequesterIdentity = Boolean(requesterName || requesterInitials);

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

          <div className="mt-4">
            <RouteMap pickup={pickupCoordinates} dropoff={dropoffCoordinates} />
          </div>

          <div className="mt-4 border-t border-border-rule" />

          {showRequesterIdentity ? (
            <div className="mt-4 flex items-center justify-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-orange text-surface-white text-label font-bold inline-flex items-center justify-center">
                {requesterInitials || requesterName.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-label text-ink-mid font-medium">
                {requesterName}{requesterRole ? ` · ${requesterRole}` : ''}
              </p>
            </div>
          ) : null}

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
