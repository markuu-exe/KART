import { Home, History, User, Settings, MapPin } from 'lucide-react';
import { useState } from 'react';
import useAppStore from '../../store/useAppStore.js';

const Icons = ({ className, icon = "Icon" }) => {
  const iconMap = {
    Home: <Home className={className} />,
    History: <History className={className} />,
    Profile: <User className={className} />,
    Settings: <Settings className={className} />,
  };
  return iconMap[icon] || <div className={className}></div>;
};

const Avatar = ({ className, initialsText = "JD" }) => (
  <div className={`${className} bg-primary-orange rounded-full flex items-center justify-center min-w-[36px] min-h-[36px]`}>
    <span className="font-bold text-sm text-white">{initialsText}</span>
  </div>
);

const NavItemsGroup = ({ className, role = "Requester", selected = "HomeBoard" }) => (
  <div className={`${className} flex flex-col gap-1`}>
    <div className="bg-primary-orange-bg flex gap-3 items-center min-h-11 px-3 rounded-xl">
      <Icons className="shrink-0 w-5 h-5" icon="Home" />
      <span className="font-semibold text-sm text-primary-orange">Home</span>
    </div>
    <div className="flex gap-3 items-center min-h-11 px-3 rounded-xl">
      <Icons className="shrink-0 w-5 h-5" icon="History" />
      <span className="font-medium text-sm text-ink-mid">History</span>
    </div>
    <div className="flex gap-3 items-center min-h-11 px-3 rounded-xl">
      <Icons className="shrink-0 w-5 h-5" icon="Profile" />
      <span className="font-medium text-sm text-ink-mid">Profile</span>
    </div>
  </div>
);

const Navigation = ({ className }) => (
  <div className={`${className} bg-surface-white border-r border-border-rule flex flex-col w-full lg:w-[240px] px-4 py-6`}>
    <div className="flex flex-col pb-8">
      <div className="font-extrabold text-2xl text-primary-orange font-heading">Kart</div>
      <div className="font-normal text-caption text-ink-light">Skip the checkout line.</div>
    </div>
    <NavItemsGroup />
    <div className="flex-1 flex flex-col justify-end">
      <div className="flex gap-3 items-center min-w-52">
        <Avatar className="shrink-0 w-9 h-9" initialsText="GC" />
        <div className="flex-1 flex flex-col gap-px">
          <div className="font-semibold text-sm text-ink-default overflow-hidden text-ellipsis">Gina Cole</div>
          <div className="font-normal text-caption text-ink-light">Requester</div>
        </div>
        <Icons className="shrink-0 w-5 h-5" icon="Settings" />
      </div>
    </div>
  </div>
);

const Component02RequesterDashboard = () => {
  const {
    requestForm,
    updateRequestForm,
    submitRequest,
    isSubmitting,
    error,
  } = useAppStore();

  const [selectedZone, setSelectedZone] = useState('');

  const zones = ['Guadalupe', 'Tisa', 'Talamban', 'Lahug', 'Labangon', 'Banilad', 'Apas', 'Zapatera'];

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    updateRequestForm('deliveryZone', zone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitRequest();
  };

  return (
    <div className="min-h-screen bg-surface-default flex flex-col lg:flex-row">
      <Navigation />
      <div className="flex-1 flex flex-col min-h-screen p-6 lg:p-10">
        <div className="flex flex-col gap-1 pb-8">
          <h1 className="font-bold text-heading-1 text-ink-default font-heading tracking-tight">Hi, Gina!</h1>
          <p className="font-normal text-caption text-ink-light">Cebu City · March 25, 2026</p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row items-start justify-center">
          <div className="flex flex-col gap-3 items-center justify-center w-full max-w-[420px]">
            <p className="font-mono text-mono-sm text-ink-light tracking-wider uppercase">NEW REQUEST</p>
            <form onSubmit={handleSubmit} className="bg-surface-white border border-border-rule rounded-2xl shadow-sm p-6">
              <div className="flex flex-col gap-4">
                <h2 className="font-semibold text-heading-2 text-ink-default">Quick Request</h2>
                <div className="flex flex-col gap-1.5">
                  <label className="font-normal text-caption text-ink-light tracking-wide uppercase">ITEM(S) NEEDED</label>
                  <div className="bg-surface-white border border-border-rule rounded-lg p-3 min-h-[140px]">
                    <textarea
                      value={requestForm.items}
                      onChange={(e) => updateRequestForm('items', e.target.value)}
                      className="min-h-[110px] leading-relaxed text-body resize-none w-full text-ink-default"
                      placeholder="e.g. 1 loaf bread, 2L water..."
                      maxLength={500}
                    />
                    <div className="text-caption text-right text-ink-light">{requestForm.items.length} / 500</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 pb-2">
                  <label className="font-normal text-caption text-ink-light uppercase">DELIVERY ZONE</label>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {zones.map((zone) => (
                      <button
                        key={zone}
                        type="button"
                        onClick={() => handleZoneSelect(zone)}
                        className={`rounded-full h-8 px-3 flex items-center justify-center transition ${
                          selectedZone === zone
                            ? 'bg-primary-orange-bg border border-primary-orange'
                            : 'bg-surface-default border border-border-rule'
                        }`}
                      >
                        <span className={`font-medium text-caption ${
                          selectedZone === zone ? 'text-primary-orange' : 'text-ink-mid'
                        }`}>
                          {zone}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-normal text-caption text-ink-light tracking-wide uppercase">BUDGET CAP (₱)</label>
                    <div className="bg-surface-white border border-border-rule rounded-lg flex gap-2 items-center min-h-11 px-3">
                      <span className="font-mono text-mono text-primary-orange-light">₱</span>
                      <input
                        type="number"
                        value={requestForm.budgetCap}
                        onChange={(e) => updateRequestForm('budgetCap', e.target.value)}
                        className="flex-1 font-normal text-body text-ink-default leading-relaxed bg-transparent outline-none"
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                      />
                      <span className="font-normal text-caption text-ink-light">Includes ₱30 runner fee</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-normal text-caption text-ink-light tracking-wide uppercase">DELIVERY ADDRESS</label>
                    <div className="bg-surface-white border border-border-rule rounded-lg flex items-center min-h-11 px-3">
                      <input
                        type="text"
                        value={requestForm.deliveryAddress}
                        onChange={(e) => updateRequestForm('deliveryAddress', e.target.value)}
                        className="flex-1 font-normal text-body text-ink-default leading-relaxed bg-transparent outline-none"
                        placeholder="Street, Landmark"
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="text-status-red text-caption">{error}</div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary-orange rounded-xl h-11 px-5 shadow-sm flex items-center justify-center disabled:opacity-50"
                >
                  <span className="font-normal text-label text-surface-white">
                    {isSubmitting ? 'Posting...' : 'Post Request →'}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex gap-2 items-center justify-center">
              <span className="font-mono text-mono-sm text-ink-light tracking-wider uppercase">MY ACTIVE REQUESTS</span>
              <div className="bg-primary-orange rounded-full h-5 px-2 flex items-center justify-center">
                <span className="font-semibold text-caption text-surface-white">3</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-white border-l-4 border-status-blue rounded-2xl shadow-sm pl-5 pr-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <p className="flex-1 min-w-0 font-semibold text-label text-ink-default overflow-hidden text-ellipsis break-words">Sliced bread, 5kg rice, 1 tray eggs</p>
                    <div className="bg-status-blue-bg rounded-full h-6 px-2.5 flex items-center justify-center">
                      <span className="font-mono text-mono-sm text-status-blue">Accepted</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <MapPin className="w-3 h-3 text-ink-light" />
                    <span className="font-normal text-caption text-ink-light">Tisa</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">₱100.00</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">12m ago</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-white border-l-4 border-primary-orange rounded-2xl shadow-sm pl-5 pr-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <p className="flex-1 min-w-0 font-semibold text-label text-ink-default overflow-hidden text-ellipsis break-words">Bananas (1 bunch), Apples (4 pcs), Onions (1 kg), Garlic (3 bulbs), Tomatoes (500g), Potatoes (1 kg), Carrots (2 pcs), Leafy Greens (2 bundles), Chicken (1 kg), Ground Meat (500g), Eggs (1 dozen), Fish (3 pcs), Tofu (2 blocks), Milk (1L), Butter (1 bar), Cheese (1 box), Rice (5 kg), Pasta (500g), Cooking Oil (1L), Soy Sauce (1 bottle), Vinegar (1 bottle), Canned Tuna (3 cans), Loaf Bread (1 pack), Coffee (1 pack), Crackers (1 pack), Dishwashing Liquid (1 pouch), Laundry Detergent (1 kg), Bath Soap (3 bars).</p>
                    <div className="bg-primary-orange-bg rounded-full h-6 px-2.5 flex items-center justify-center">
                      <span className="font-mono text-mono-sm text-primary-orange">At Store</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <MapPin className="w-3 h-3 text-ink-light" />
                    <span className="font-normal text-caption text-ink-light">Tisa</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">₱100.00</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">30m ago</span>
                  </div>
                </div>
              </div>
              <div className="bg-surface-white border-l-4 border-status-green rounded-2xl shadow-sm pl-5 pr-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <p className="flex-1 min-w-0 font-semibold text-label text-ink-default overflow-hidden text-ellipsis break-words">Carrots (2 pcs), Leafy Greens (2 bundles), Chicken (1 kg), Ground Meat (500g), Eggs (1 dozen), Fish (3 pcs), Tofu (2 blocks), Milk (1L), Butter (1 bar), Cheese (1 box), Rice (5 kg), Pasta (500g), Cooking Oil (1L), Soy Sauce (1 bottle), Vinegar (1 bottle), Canned Tuna (3 cans), Loaf Bread (1 pack), Coffee (1 pack), Crackers (1 pack), Dishwashing Liquid (1 pouch), Laundry Detergent (1 kg), Bath Soap (3 bars).</p>
                    <div className="bg-status-green rounded-full h-6 px-2.5 flex items-center justify-center">
                      <span className="font-mono text-mono-sm text-surface-white">Delivered</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <MapPin className="w-3 h-3 text-ink-light" />
                    <span className="font-normal text-caption text-ink-light">Tisa</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">₱100.00</span>
                    <span className="w-0.5 h-0.5 bg-ink-light rounded-full"></span>
                    <span className="font-normal text-caption text-ink-light">45m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Component02RequesterDashboard;