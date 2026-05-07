import React from 'react';

const imgGroup = "https://www.figma.com/api/mcp/asset/30478b0f-93c7-45ef-93e1-8bbc5fdb9cf2";
const imgVector = "https://www.figma.com/api/mcp/asset/d1e67bbd-321b-42dd-b46c-9b1aae6df38d";
const imgVector1 = "https://www.figma.com/api/mcp/asset/89d6ed47-f577-4ff9-91ac-f7dad44e9a6a";
const imgVector2 = "https://www.figma.com/api/mcp/asset/23339004-9851-44f4-ab52-3a3512c84611";
const imgVector3 = "https://www.figma.com/api/mcp/asset/b1f9895b-9d73-4d17-a933-dd01a04ce171";
const imgVector4 = "https://www.figma.com/api/mcp/asset/346c61ea-fbd0-42ba-8796-04635033d6b1";
const imgVector5 = "https://www.figma.com/api/mcp/asset/708ac628-1a9a-433c-81eb-ad353e6b1353";

function Btn({ className, buttonLabel = "Button", state = "Default", type = "Primary" }) {
  return (
    <div className={`${className || "bg-primary-orange flex items-center justify-center h-11 px-5 rounded-[12px] shadow-sm"}`}>
      <div className="text-label text-surface-white text-center font-normal font-sans">
        <p className="leading-[1.5]">{buttonLabel}</p>
      </div>
    </div>
  );
}

function Camera({ className }) {
  return (
    <div className={className || "relative w-6 h-6"}>
      <img alt="" className="absolute inset-0 w-full h-full object-contain" src={imgGroup} />
    </div>
  );
}

function StepNode({ className, state = "current", stepLabel2 = "Current", stepLabel3 = "Future" }) {
  const isCurrent = state === "current";
  const isFuture = state === "future";
  return (
    <div className={className || "h-[48px] relative w-[59px]"} id={isCurrent ? "node-189_606" : "node-189_609"}>
      {isFuture && (
        <>
          <div className="absolute flex flex-col font-normal inset-[58.33%_16.95%_0_16.95%] justify-center leading-[0] text-label text-ink-default text-center whitespace-nowrap font-sans">
            <p className="leading-[1.5]">{stepLabel3}</p>
          </div>
          <div className="absolute bg-border-rule inset-[0_25.42%_41.67%_27.12%] rounded-[9999px]" />
        </>
      )}
      {isCurrent && (
        <>
          <div className="absolute flex flex-col font-normal inset-[58.33%_10.17%_0_10.17%] justify-center leading-[0] text-label text-ink-default text-center whitespace-nowrap font-sans">
            <p className="leading-[1.5]">{stepLabel2}</p>
          </div>
          <div className="absolute inset-[0_25.42%_41.67%_27.12%] flex items-center justify-center rounded-full bg-primary-orange">
            <div className="text-label text-surface-white font-normal font-sans">
              <p className="leading-[1.5]">.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ConnectorLine({ className, state = "unfilled" }) {
  return <div className={className || "bg-border-rule h-1.5 rounded-full"} />;
}

function StatusPills({ className, state = "Accepted" }) {
  return (
    <div className={className || "inline-flex items-center h-6 px-3 rounded-full bg-status-blue-bg"}>
      <span className="text-mono-sm font-medium text-status-blue whitespace-nowrap font-mono">Accepted</span>
    </div>
  );
}

function Arrow({ className }) {
  return (
    <div className={className || "relative w-5 h-5"}>
      <div className="absolute inset-0 flex items-center justify-center">
        <img alt="" className="w-full h-full object-contain" src={imgVector} />
      </div>
    </div>
  );
}

function Icons({ className, icon = "Icon" }) {
  const isSettings = icon === "Settings";
  return (
    <div className={className || "relative w-5 h-5"} id={isSettings ? "node-119_48" : "node-116_42"}>
      <div className={`absolute ${isSettings ? "inset-[8.33%_8.13%]" : "inset-[8.33%_8.33%_8.34%_8.34%]"}`} id={isSettings ? "node-119_51" : "node-116_45"}>
        <img alt="" className="absolute inset-0 w-full h-full object-contain" src={isSettings ? imgVector2 : imgVector1} />
      </div>
    </div>
  );
}

function Avatar({ className, initialsText = "JD", type = "Initials" }) {
  return (
    <div className={className || "bg-primary-orange flex items-center justify-center rounded-full w-9 h-9"}>
      <div className="text-label text-surface-white text-center font-bold font-sans">
        <p className="leading-[1.5]">{initialsText}</p>
      </div>
    </div>
  );
}

export default function ActiveOrderRunner() {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <aside className="bg-surface-white border-border-rule border-r border-solid flex flex-col w-full lg:w-[240px] px-4 py-6">
        <div className="flex flex-col gap-4 pb-8">
          <div className="text-[28px] font-extrabold text-primary-orange tracking-[-0.56px] font-heading">
            <p className="leading-normal">Kart</p>
          </div>
          <div className="text-caption text-ink-light font-normal font-sans">
            <p className="leading-[1.5]">Skip the checkout line.</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-[208px]">
          <button className="flex items-center gap-3 min-h-[44px] w-full rounded-[12px] bg-primary-orange-bg px-3">
            <div className="relative w-5 h-5">
              <img alt="" className="absolute inset-0 w-full h-full object-contain" src={imgVector3} />
            </div>
            <span className="font-medium text-label text-primary-orange whitespace-nowrap font-sans">Board</span>
          </button>
          <button className="flex items-center gap-3 min-h-[44px] w-full rounded-[12px] px-3 bg-surface-default">
            <div className="relative w-5 h-5">
              <img alt="" className="absolute inset-0 w-full h-full object-contain" src={imgVector4} />
            </div>
            <span className="font-medium text-label text-ink-mid whitespace-nowrap font-sans">History</span>
          </button>
          <button className="flex items-center gap-3 min-h-[44px] w-full rounded-[12px] px-3 bg-surface-default">
            <div className="relative w-5 h-5">
              <img alt="" className="absolute inset-0 w-full h-full object-contain" src={imgVector5} />
            </div>
            <span className="font-medium text-label text-ink-mid whitespace-nowrap font-sans">Profile</span>
          </button>
        </div>
        <div className="mt-auto flex items-center gap-3 w-full max-w-[208px]">
          <Avatar className="bg-primary-orange rounded-full w-9 h-9" initialsText="GC" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-label text-ink-default font-sans">Gina Cole</p>
            <p className="text-caption text-ink-light font-normal font-sans">Requester</p>
          </div>
          <Icons className="w-5 h-5" icon="Settings" />
        </div>
      </aside>
      <div className="bg-surface-default flex-1 flex flex-col h-full overflow-x-hidden overflow-y-auto p-10 lg:p-12">
        <div className="flex items-center gap-2 pb-4">
          <Arrow className="w-5 h-5" />
          <p className="font-normal leading-[1.5] text-label text-primary-orange whitespace-nowrap font-sans">
            Back to Board
          </p>
        </div>
        <main className="flex-1 px-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-heading-1 font-bold text-ink-default tracking-[-0.48px]">Active Errand</p>
              <StatusPills />
            </div>
            <div className="flex flex-col gap-4 rounded-[16px] border border-border-rule bg-surface-default p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-orange text-surface-white font-bold">.</div>
                <p className="text-label text-ink-default">Accepted</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <ConnectorLine className="h-1.5 flex-1 rounded-full bg-border-rule" />
                <StepNode className="h-[48px] w-[59px]" state="future" stepLabel3="At Store" />
                <ConnectorLine className="h-1.5 flex-1 rounded-full bg-border-rule" />
                <StepNode className="h-[48px] w-[59px]" state="future" stepLabel3="Purchased" />
                <ConnectorLine className="h-1.5 flex-1 rounded-full bg-border-rule" />
                <StepNode className="h-[48px] w-[59px]" state="future" stepLabel3="Delivered" />
              </div>
            </div>
            <div className="rounded-[16px] border border-border-rule bg-surface-default p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-caption text-primary-orange underline">Open Maps →</p>
                <span className="text-label text-primary-orange">📍</span>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold text-ink-default">Deliver to: Tisa</p>
                <p className="text-caption text-ink-light">Sitio Sunflower, 5th Street · Ring the Doorbell</p>
              </div>
            </div>
            <section className="rounded-[16px] border border-border-rule bg-surface-white p-6 shadow-sm">
              <div className="space-y-4">
                <p className="text-heading-2 font-semibold">🛒 Shopping List</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-ink-light">•</span>
                    <p className="text-body text-ink-default">1 kg Rice</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-ink-light">•</span>
                    <p className="text-body text-ink-default">1 kilo Banana</p>
                  </div>
                </div>
                <div className="rounded-[12px] border border-border-rule px-4 py-3">
                  <p className="text-mono text-ink-light">Budget cap: ₱500</p>
                </div>
              </div>
            </section>
            <div className="space-y-4">
              <p className="text-center text-mono-sm text-ink-light">📷 RECEIPT</p>
              <div className="mx-auto w-full max-w-[190px] rounded-[12px] border border-dashed border-primary-orange bg-primary-orange-bg py-8">
                <Camera className="mx-auto w-6 h-6" />
                <p className="mt-3 text-caption text-ink-default text-center">Click to Upload Receipt</p>
              </div>
            </div>
            <Btn buttonLabel="🏪 I'm at the Store" className="w-full" />
            <div className="text-center text-caption text-status-red">Cancel Errand</div>
          </div>
        </main>
      </div>
    </div>
  );
}