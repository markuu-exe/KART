const OSRM_ROUTE_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';

const DEFAULT_PRICING = {
  baseFee: 30,
  perKilometer: 8,
  perMinute: 1.5,
};

function toNumber(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function normalizeCoordinates(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value) && value.length >= 2) {
    const longitude = toNumber(value[0]);
    const latitude = toNumber(value[1]);

    if (longitude === null || latitude === null) {
      return null;
    }

    return [longitude, latitude];
  }

  if (typeof value === 'object') {
    const latitude = toNumber(value.lat ?? value.latitude ?? value.y);
    const longitude = toNumber(value.lng ?? value.lon ?? value.long ?? value.longitude ?? value.x);

    if (longitude === null || latitude === null) {
      return null;
    }

    return [longitude, latitude];
  }

  return null;
}

export function formatDistance(distanceMeters) {
  const numericDistance = toNumber(distanceMeters);
  if (numericDistance === null) {
    return null;
  }

  const distanceKm = numericDistance / 1000;
  if (distanceKm < 1) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km`;
}

export function formatDuration(durationSeconds) {
  const numericDuration = toNumber(durationSeconds);
  if (numericDuration === null) {
    return null;
  }

  const totalMinutes = Math.max(1, Math.round(numericDuration / 60));
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function formatPeso(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function estimateRoutePricing({ distanceMeters, durationSeconds }, pricing = DEFAULT_PRICING) {
  const distanceKm = Number.isFinite(distanceMeters) ? distanceMeters / 1000 : 0;
  const durationMinutes = Number.isFinite(durationSeconds) ? durationSeconds / 60 : 0;

  const distanceCharge = distanceKm * pricing.perKilometer;
  const timeCharge = durationMinutes * pricing.perMinute;
  const total = pricing.baseFee + distanceCharge + timeCharge;

  return {
    baseFee: pricing.baseFee,
    distanceCharge,
    timeCharge,
    total,
  };
}

export async function fetchRouteMatrixEstimate(pickup, dropoff, signal) {
  const pickupCoordinates = normalizeCoordinates(pickup);
  const dropoffCoordinates = normalizeCoordinates(dropoff);

  if (!pickupCoordinates || !dropoffCoordinates) {
    throw new Error('Pickup and drop-off coordinates are required.');
  }

  const coordinates = `${pickupCoordinates[0]},${pickupCoordinates[1]};${dropoffCoordinates[0]},${dropoffCoordinates[1]}`;

  const response = await fetch(
    `${OSRM_ROUTE_ENDPOINT}/${coordinates}?overview=full&geometries=geojson`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`OSRM route request failed with status ${response.status}.`);
  }

  const data = await response.json();
  const distanceMeters = data?.routes?.[0]?.distance ?? null;
  const durationSeconds = data?.routes?.[0]?.duration ?? null;

  if (!Number.isFinite(distanceMeters) || !Number.isFinite(durationSeconds)) {
    throw new Error('OSRM did not return a valid route estimate.');
  }

  const pricing = estimateRoutePricing({ distanceMeters, durationSeconds });

  return {
    distanceMeters,
    durationSeconds,
    distanceLabel: formatDistance(distanceMeters),
    durationLabel: formatDuration(durationSeconds),
    pricing,
  };
}
