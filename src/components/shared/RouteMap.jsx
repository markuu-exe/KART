import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRouteMatrixEstimate, formatPeso, normalizeCoordinates } from '@/lib/routing';

function RouteStat({ label, value, accent = 'text-ink-default' }) {
  return (
    <div className="rounded-xl border border-border-rule bg-surface-white px-3 py-2.5">
      <p className="text-caption uppercase tracking-wide text-ink-light">{label}</p>
      <p className={`mt-1 text-label font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

export default function RouteMap({
  pickup,
  dropoff,
  pickupLabel = 'Pickup',
  dropoffLabel = 'Drop-off',
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRefs = useRef([]);
  const [estimate, setEstimate] = useState(null);
  const [status, setStatus] = useState('idle');

  const pickupCoordinates = useMemo(() => normalizeCoordinates(pickup), [pickup]);
  const dropoffCoordinates = useMemo(() => normalizeCoordinates(dropoff), [dropoff]);
  const hasCoordinates = Boolean(pickupCoordinates && dropoffCoordinates);

  // Fetch route estimate when coordinates change
  useEffect(() => {
    if (!hasCoordinates) {
      return undefined;
    }

    const controller = new AbortController();

    (async () => {
      setStatus('loading');
      try {
        const result = await fetchRouteMatrixEstimate(pickupCoordinates, dropoffCoordinates, controller.signal);
        if (!controller.signal.aborted) {
          setEstimate(result);
          setStatus('ready');
        }
      } catch (error) {
        if (error.name === 'AbortError' || controller.signal.aborted) {
          return;
        }

        setEstimate(null);
        setStatus('error');
      }
    })();

    return () => controller.abort();
  }, [dropoffCoordinates, hasCoordinates, pickupCoordinates]);

  // Manage map instance and markers
  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined;
    }

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch {
        // Silently catch error if map is already removed
      }
      mapInstanceRef.current = null;
    }

    if (!hasCoordinates) {
      return undefined;
    }

    // Create new map instance
    const map = L.map(mapContainerRef.current).setView(pickupCoordinates, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add pickup marker
    const pickupMarker = L.circleMarker(pickupCoordinates, {
      color: '#ff5c1a',
      radius: 8,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    // Add dropoff marker
    const dropoffMarker = L.circleMarker(dropoffCoordinates, {
      color: '#1f9d55',
      radius: 8,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(map);

    markerRefs.current = [pickupMarker, dropoffMarker];

    // Draw route line
    L.polyline([pickupCoordinates, dropoffCoordinates], {
      color: '#ff5c1a',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    // Fit bounds to show both markers
    const bounds = L.latLngBounds([pickupCoordinates, dropoffCoordinates]);
    map.fitBounds(bounds, { padding: [56, 56] });

    // Store reference for cleanup
    mapInstanceRef.current = map;

    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch {
        // Silently catch error if map is already removed
      }
      markerRefs.current = [];
    };
  }, [dropoffCoordinates, hasCoordinates, pickupCoordinates]);

  const routeSummary = estimate
    ? [
        { label: 'Distance', value: estimate.distanceLabel || 'N/A' },
        { label: 'ETA', value: estimate.durationLabel || 'N/A' },
        { label: 'Suggested fee', value: formatPeso(estimate.pricing.total), accent: 'text-primary-orange' },
      ]
    : [];

  return (
    <section className={`rounded-2xl border border-border-rule bg-surface-default p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-caption uppercase tracking-wide text-ink-light">Route preview</p>
          <p className="text-label font-semibold text-ink-default">
            {pickupLabel} to {dropoffLabel}
          </p>
        </div>
        <span className="rounded-full bg-primary-orange-bg px-2.5 py-1 text-caption font-semibold text-primary-orange">
          Leaflet + OSRM
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border-rule bg-surface-white">
        {hasCoordinates ? <div ref={mapContainerRef} className="h-72 w-full bg-surface-default" /> : null}
        {!hasCoordinates ? (
          <div className="flex h-72 items-center justify-center px-6 text-center text-caption text-ink-light">
            Add pickup and drop-off coordinates to render the route.
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {status === 'loading' ? (
          <div className="rounded-xl border border-border-rule bg-surface-white px-3 py-2.5 text-caption text-ink-light">
            Calculating distance and ETA...
          </div>
        ) : null}
        {status === 'error' ? (
          <div className="rounded-xl border border-status-red bg-status-red-bg px-3 py-2.5 text-caption text-status-red">
            Route estimate unavailable right now.
          </div>
        ) : null}
        {routeSummary.map((item) => (
          <div key={item.label} className="min-w-34 flex-1">
            <RouteStat label={item.label} value={item.value} accent={item.accent} />
          </div>
        ))}
      </div>
    </section>
  );
}
