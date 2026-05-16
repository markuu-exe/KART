export const APP_ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  ONBOARDING: '/auth/onboarding',
  REQUESTER_BOARD: '/requester/board',
  REQUESTER_ACTIVE_ORDER: '/requester/active-order',
  REQUESTER_HISTORY: '/requester/history',
  REQUESTER_PROFILE: '/requester/profile',
  REQUESTER_PROFILE_EDIT: '/requester/profile/edit',
  RUNNER_BOARD: '/runner/board',
  RUNNER_ACTIVE_ORDER: '/runner/active-order',
  RUNNER_HISTORY: '/runner/history',
  RUNNER_PROFILE: '/runner/profile',
  RUNNER_PROFILE_EDIT: '/runner/profile/edit',
};

export const getAbsoluteUrl = (path) => `${window.location.origin}${path}`;

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

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 5000);

  if (signal) {
    signal.addEventListener('abort', () => abortController.abort());
  }

  try {
    const response = await fetch(
      `${OSRM_ROUTE_ENDPOINT}/${coordinates}?overview=full&geometries=geojson`,
      { signal: abortController.signal },
    );

    clearTimeout(timeoutId);

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
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError' && !signal?.aborted) {
      throw new Error('Route request timed out after 5 seconds.');
    }

    console.warn('Routing fetch failed, using fallback estimate.', error);

    const toRad = (x) => (x * Math.PI) / 180;
    const lon1 = pickupCoordinates[0];
    const lat1 = pickupCoordinates[1];
    const lon2 = dropoffCoordinates[0];
    const lat2 = dropoffCoordinates[1];

    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Multiply by 1.3 to approximate routing detour vs straight line
    const distanceMeters = Math.round((R * c) * 1.3);
    // Assume ~20 km/h average city speed (approx 5.5 m/s)
    const durationSeconds = Math.round(distanceMeters / 5.5);

    const pricing = estimateRoutePricing({ distanceMeters, durationSeconds });

    return {
      distanceMeters,
      durationSeconds,
      distanceLabel: formatDistance(distanceMeters),
      durationLabel: formatDuration(durationSeconds),
      pricing,
      isFallback: true,
    };
  }
}
