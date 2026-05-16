import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

// Mock landmarks with exact coordinates (Cebu City area)
const MOCK_LANDMARKS = [
  {
    id: 'sm-city-cebu',
    label: 'SM City Cebu',
    description: 'Banilad',
    lat: 10.3157,
    lng: 123.8854,
  },
  {
    id: 'ayala-mall',
    label: 'Ayala Center Cebu',
    description: 'Lahug',
    lat: 10.3222,
    lng: 123.8881,
  },
  {
    id: 'robinsons-mall',
    label: 'Robinsons Galleria',
    description: 'Fuente Osmeña',
    lat: 10.3011,
    lng: 123.8795,
  },
  {
    id: 'cebu-port',
    label: 'Cebu Port Terminal',
    description: 'North Reclamation Area',
    lat: 10.3148,
    lng: 123.8767,
  },
  {
    id: 'it-park',
    label: 'IT Park Cebu',
    description: 'Lahug',
    lat: 10.3233,
    lng: 123.8868,
  },
];

export default function LocationAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search landmark or address...',
  label = 'Location',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Track the previous prop value to detect changes during render
  const [prevValue, setPrevValue] = useState(value);
  const [searchTerm, setSearchTerm] = useState(value);

  // Reset local state synchronously if the controlled parent value prop changes
  if (value !== prevValue) {
    setPrevValue(value);
    setSearchTerm(value || '');
  }

  const filteredLandmarks = MOCK_LANDMARKS.filter(
    (landmark) =>
      landmark.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (landmark) => {
    setSearchTerm(landmark.label);
    onChange?.(landmark.label);
    onSelect?.(landmark);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange?.(newValue);
    setIsOpen(true);
  };

  const selectedLandmark = MOCK_LANDMARKS.find((l) => l.label === searchTerm);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-caption uppercase tracking-wide text-ink-light">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="bg-surface-white border border-border-rule rounded-lg min-h-11 px-3 py-2 flex items-center gap-2 cursor-text">
          <MapPin className="w-4 h-4 text-ink-light shrink-0" />
          <input
            type="text"
            className="flex-1 outline-none bg-transparent text-body text-ink-default placeholder:text-ink-light"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
          />
          <ChevronDown
            className={`w-4 h-4 text-ink-light shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-surface-white border border-border-rule rounded-lg shadow-md overflow-hidden">
            {filteredLandmarks.length > 0 ? (
              <ul className="max-h-56 overflow-y-auto">
                {filteredLandmarks.map((landmark) => {
                  const isSelected = selectedLandmark?.id === landmark.id;
                  return (
                    <li key={landmark.id}>
                      <button
                        type="button"
                        className={`w-full text-left px-4 py-3 border-b border-border-rule last:border-b-0 hover:bg-surface-default transition-colors ${
                          isSelected ? 'bg-primary-orange-bg' : ''
                        }`}
                        onClick={() => handleSelect(landmark)}
                      >
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isSelected ? 'text-primary-orange' : 'text-ink-light'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-body font-medium ${
                                isSelected ? 'text-primary-orange' : 'text-ink-default'
                              }`}
                            >
                              {landmark.label}
                            </p>
                            <p className="text-caption text-ink-light">{landmark.description}</p>
                            <p className="text-caption text-ink-light opacity-60">
                              {landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 py-3 text-caption text-ink-light text-center">
                No landmarks found. Try a different search.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedLandmark && (
        <div className="text-caption text-status-green font-medium">
          ✓ Coordinates: {selectedLandmark.lat.toFixed(4)}, {selectedLandmark.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
}