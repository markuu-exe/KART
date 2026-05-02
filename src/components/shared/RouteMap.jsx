import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchRouteMatrixEstimate, formatPeso, normalizeCoordinates } from '@/lib/mapbox';

function buildRouteGeoJson(pickupCoordinates, dropoffCoordinates) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [pickupCoordinates, dropoffCoordinates],
    },
    properties: {},
  };
}

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
  const markerRefs = useRef([]);
  const [estimate, setEstimate] = useState(null);
  const [status, setStatus] = useState('idle');

  const pickupCoordinates = useMemo(() => normalizeCoordinates(pickup), [pickup]);
  const dropoffCoordinates = useMemo(() => normalizeCoordinates(dropoff), [dropoff]);
  const hasCoordinates = Boolean(pickupCoordinates && dropoffCoordinates);
  const hasToken = Boolean(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);

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
    });

    return () => controller.abort();
  }, [dropoffCoordinates, hasCoordinates, pickupCoordinates]);

  useEffect(() => {
    if (!mapContainerRef.current || !hasCoordinates || !hasToken) {
      return undefined;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: pickupCoordinates,
      zoom: 12,
      attributionControl: false,
      cooperativeGestures: true,
    });

    const pickupMarker = new mapboxgl.Marker({ color: '#ff5c1a' }).setLngLat(pickupCoordinates).addTo(map);
    const dropoffMarker = new mapboxgl.Marker({ color: '#1f9d55' }).setLngLat(dropoffCoordinates).addTo(map);
    markerRefs.current = [pickupMarker, dropoffMarker];

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      if (!map.getSource('route-line')) {
        map.addSource('route-line', {
          type: 'geojson',
          data: buildRouteGeoJson(pickupCoordinates, dropoffCoordinates),
        });
      }

      if (!map.getLayer('route-line')) {
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#ff5c1a',
            'line-width': 4,
            'line-opacity': 0.9,
          },
        });
      }

      const bounds = new mapboxgl.LngLatBounds(pickupCoordinates, pickupCoordinates);
      bounds.extend(dropoffCoordinates);
      map.fitBounds(bounds, { padding: 56, duration: 0 });
    });

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      map.remove();
    };
  }, [dropoffCoordinates, hasCoordinates, hasToken, pickupCoordinates]);

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
          Mapbox GL JS
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border-rule bg-surface-white">
        {hasCoordinates && hasToken ? <div ref={mapContainerRef} className="h-72 w-full bg-surface-default" /> : null}
        {!hasCoordinates || !hasToken ? (
          <div className="flex h-72 items-center justify-center px-6 text-center text-caption text-ink-light">
            {!hasToken
              ? 'Add VITE_MAPBOX_ACCESS_TOKEN to .env.local to enable the route preview.'
              : 'Add pickup and drop-off coordinates to render the route.'}
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
