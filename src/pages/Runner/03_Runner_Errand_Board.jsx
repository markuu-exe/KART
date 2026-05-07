import React from 'react';

const imgVector = "https://www.figma.com/api/mcp/asset/abf86184-619a-415f-ad14-2f94cc481893";
const imgVector1 = "https://www.figma.com/api/mcp/asset/db530cde-6538-4e8e-a2c9-e34d12504b4e";
const imgVector2 = "https://www.figma.com/api/mcp/asset/92e8de68-0585-41e2-bf40-0a6609be9120";
const imgVector3 = "https://www.figma.com/api/mcp/asset/ec043952-7cb8-4d3f-a5c6-8ddc2108c9e9";
const imgVector4 = "https://www.figma.com/api/mcp/asset/c1e63455-5873-48ee-9a91-9354e02f3d0f";
const imgDot = "https://www.figma.com/api/mcp/asset/cb67a4c8-81b9-4883-a8e3-77a7b5594341";
const imgVector5 = "https://www.figma.com/api/mcp/asset/08e95ea3-94af-4535-9451-e0adfc87f231";

function Chip({ className, label = "Label", state = true }) {
  const isState = state;
  return (
    <div className={`${className || `border border-solid flex h-8 items-center justify-center min-h-8 px-3 rounded-full ${isState ? `bg-primary-orange-bg border-primary-orange` : `bg-surface-default border-border-rule`}`}`} id={isState ? "node-75_22" : "node-75_24"}>
      {!state && (
        <p className="font-medium leading-[1.5] relative shrink-0 text-caption text-ink-mid whitespace-nowrap font-sans">
          {label}
        </p>
      )}
      {isState && (
        <p className="font-semibold leading-[1.5] relative shrink-0 text-caption text-primary-orange whitespace-nowrap font-sans">
          {label}
        </p>
      )}
    </div>
  );
}

function Icons({ className, icon = "Icon" }) {
  const isSettings = icon === "Settings";
  return (
    <div className={className || "relative w-5 h-5"} id={isSettings ? "node-119_48" : "node-116_42"}>
      <div className={`absolute ${isSettings ? "inset-[8.33%_8.13%]" : "inset-[8.33%_8.33%_8.34%_8.34%]"}`} id={isSettings ? "node-119_51" : "node-116_45"}>
        <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={isSettings ? imgVector1 : imgVector} />
      </div>
    </div>
  );
}

export default function RunnerErrandBoard() {
  return (
    <div className="min-h-screen bg-surface-default flex flex-col lg:flex-row">
      <div className="bg-surface-white border-border-rule border-r border-solid flex flex-col w-full lg:w-[240px] px-6 py-6">
        <div className="flex flex-col gap-1 pb-8">
          <h1 className="text-2xl font-extrabold text-primary-orange font-heading">Kart</h1>
          <p className="text-caption text-ink-light">Skip the checkout line.</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="bg-primary-orange-bg flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
            <div className="relative shrink-0 w-5 h-5">
              <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector2} />
            </div>
            <p className="font-semibold leading-[1.5] text-label text-primary-orange whitespace-nowrap font-sans">Board</p>
          </div>
          <div className="flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
            <div className="relative shrink-0 w-5 h-5">
              <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector3} />
            </div>
            <p className="font-medium leading-[1.5] text-label text-ink-mid whitespace-nowrap font-sans">History</p>
          </div>
          <div className="flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
            <div className="relative shrink-0 w-5 h-5">
              <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector4} />
            </div>
            <p className="font-medium leading-[1.5] text-label text-ink-mid whitespace-nowrap font-sans">Profile</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex items-center gap-3 w-full">
            <div className="bg-status-blue flex items-center justify-center rounded-full shrink-0 w-9 h-9">
              <div className="font-bold text-label text-surface-white text-center whitespace-nowrap font-sans">
                <p className="leading-[1.5]">YB</p>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-px">
              <div className="font-semibold text-label text-ink-default truncate font-sans">
                <p className="leading-[1.2]">Yuno Ball</p>
              </div>
              <div className="font-normal text-caption text-ink-light font-sans">
                <p className="leading-[1.2]">Runner</p>
              </div>
            </div>
            <Icons className="shrink-0 w-5 h-5" icon="Settings" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-screen overflow-x-auto overflow-y-auto p-6 lg:p-10">
        <div className="flex flex-col gap-1 pb-6 w-full">
          <p className="font-bold text-heading-1 text-ink-default tracking-[-0.48px] font-heading">Errand Board</p>
          <p className="font-normal text-caption text-ink-light">6 open near you</p>
        </div>
        <div className="border-b border-border-rule pb-4 flex flex-wrap gap-2 w-full">
          <Chip className="bg-primary-orange-bg border-primary-orange border-solid flex h-8 items-center justify-center px-3 rounded-full shrink-0" label="All Zones" />
          <Chip className="bg-surface-default border-border-rule border-solid flex h-8 items-center justify-center px-3 rounded-full shrink-0" label="Guadalupe" state={false} />
          <Chip className="bg-surface-default border-border-rule border-solid flex h-8 items-center justify-center px-3 rounded-full shrink-0" label="Tisa" state={false} />
          <Chip className="bg-surface-default border-border-rule border-solid flex h-8 items-center justify-center px-3 rounded-full shrink-0" label="Talamban" state={false} />
          <Chip className="bg-surface-default border-border-rule border-solid flex h-8 items-center justify-center px-3 rounded-full shrink-0" label="Lahug" state={false} />
          <div className="bg-surface-default border-border-rule border border-solid flex h-8 items-center px-3 rounded-full shrink-0">
            <p className="font-medium leading-[1.5] text-caption text-ink-mid whitespace-nowrap font-sans">
              Labangon
            </p>
          </div>
          <div className="bg-surface-default border-border-rule border border-solid flex h-8 items-center px-3 rounded-full shrink-0">
            <p className="font-medium leading-[1.5] text-caption text-ink-mid whitespace-nowrap font-sans">
              Banilad
            </p>
          </div>
          <div className="bg-surface-default border-border-rule border border-solid flex h-8 items-center px-3 rounded-full shrink-0">
            <p className="font-medium leading-[1.5] text-caption text-ink-mid whitespace-nowrap font-sans">
              Apas
            </p>
          </div>
          <div className="bg-surface-default border-border-rule border border-solid flex h-8 items-center px-3 rounded-full shrink-0">
            <p className="font-medium leading-[1.5] text-caption text-ink-mid whitespace-nowrap font-sans">
              Zapatera
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 w-full pt-6">
          {/* Request Cards - placeholder, repeat as needed */}
          <section className="bg-surface-white border-primary-orange border-l-4 border-solid flex flex-col justify-between w-full max-w-[500px] min-h-[220px] overflow-hidden rounded-[16px] shadow-sm p-4">
            <div className="space-y-4">
              <p className="font-semibold text-label text-ink-default break-words leading-[1.5]">
                Bananas (1 bunch), Apples (4 pcs), Onions (1 kg), Garlic (3 bulbs), Tomatoes (500g), Potatoes (1 kg), Carrots (2 pcs), Leafy Greens (2 bundles), Chicken (1 kg), Ground Meat (500g), Eggs (1 dozen), Fish (3 pcs), Tofu (2 blocks), Milk (1L), Butter (1 bar), Cheese (1 box), Rice (5 kg), Pasta (500g), Cooking Oil (1L), Soy Sauce (1 bottle), Vinegar (1 bottle), Canned Tuna (3 cans), Loaf Bread (1 pack), Coffee (1 pack), Crackers (1 pack), Dishwashing Liquid (1 pouch), Laundry Detergent (1 kg), Bath Soap (3 bars).
              </p>
              <div className="inline-flex items-center rounded-full bg-status-green-bg px-3 h-8">
                <span className="font-medium text-mono-sm text-status-green whitespace-nowrap">₱40.00</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 text-caption text-ink-light">
                <span>📍 Tisa</span>
                <span className="inline-block w-1 h-1 rounded-full bg-ink-light" />
                <span>Sitio Sunflower, 5th Street</span>
                <span className="inline-block w-1 h-1 rounded-full bg-ink-light" />
                <span>12m ago</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" className="bg-status-green-bg text-status-green font-normal h-9 rounded-[12px] px-5 transition hover:bg-status-green/90">
                  Accept
                </button>
                <button type="button" className="border border-border-rule text-ink-mid font-normal h-9 rounded-[12px] px-5 transition hover:bg-surface-default">
                  Details
                </button>
              </div>
            </div>
          </section>
          {/* Repeat for more cards */}
        </div>
        <div className="flex flex-col gap-8 items-center justify-center p-10 w-full">
          <div className="relative shrink-0 w-12 h-12">
            <div className="absolute inset-[16.67%_19.2%_18.95%_20%]">
              <div className="absolute inset-[-1.55%_-1.99%_-1.97%_-1.64%]">
                <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector5} />
              </div>
            </div>
          </div>
          <div className="flex flex-col font-semibold justify-center leading-[0] relative shrink-0 text-label text-ink-default text-center whitespace-nowrap font-sans">
            <p className="leading-[1.5]">Laid-back Day</p>
          </div>
          <div className="flex flex-col font-normal justify-center leading-[0] max-w-[320px] relative shrink-0 text-body text-ink-light text-center whitespace-nowrap font-sans">
            <p className="leading-[1.65]">No open errands in Tisa right now.</p>
          </div>
        </div>
      </div>
    </div>
  );
}