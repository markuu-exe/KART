import React from 'react';

const imgVector = "https://www.figma.com/api/mcp/asset/3c65461b-4cec-46ab-929e-5a5df2ece802";
const imgVector1 = "https://www.figma.com/api/mcp/asset/86198773-49ad-4539-9978-40503584eeb0";
const imgVector2 = "https://www.figma.com/api/mcp/asset/8a0578d5-25f0-4bce-8aba-9f9f56687976";
const imgVector3 = "https://www.figma.com/api/mcp/asset/a26f2c60-784c-4879-ba7e-ad77964bda9b";
const imgVector4 = "https://www.figma.com/api/mcp/asset/068f13a4-2177-4990-9f52-3bab74934147";

function Divider({ className, variant = "Horizontal" }) {
  return <div className={`${className || "border-border-rule border-solid border-t h-px w-[352px]"}`} />;
}

function ProgressBar({ className, progress = "At_Store" }) {
  return (
    <div className={className || "flex flex-col gap-2 items-center justify-center relative w-full max-w-3xl"}>
      <div className="bg-border-rule flex h-2 items-start justify-start rounded-full w-full overflow-hidden">
        <div className="bg-primary-orange h-2 rounded-full w-[34%]" />
      </div>
      <div className="flex flex-wrap justify-between gap-3 leading-[1.5] text-caption text-center w-full whitespace-nowrap">
        <p className="font-normal text-ink-light font-sans">Accepted</p>
        <p className="font-bold text-primary-orange font-sans">At Store</p>
        <p className="font-normal text-ink-light font-sans">Purchased</p>
        <p className="font-normal text-ink-light font-sans">Delivered</p>
      </div>
    </div>
  );
}

function StatusPills({ className, state = "AtStore" }) {
  return (
    <div className={className || "bg-primary-orange-bg flex h-6 items-center justify-center px-3 rounded-full"}>
      <div className="font-medium text-mono-sm text-primary-orange text-center whitespace-nowrap font-mono">
        <p className="leading-[1.5]">At Store</p>
      </div>
    </div>
  );
}

function Icons({ className, icon = "Icon" }) {
  const isSettings = icon === "Settings";
  return (
    <div className={className || "relative w-5 h-5"} id={isSettings ? "node-119_48" : "node-116_42"}>
      <div className={`absolute ${isSettings ? "inset-[8.33%_8.13%]" : "inset-[8.33%_8.33%_8.34%_8.34%]"}`} data-name="Vector">
        <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={isSettings ? imgVector1 : imgVector} />
      </div>
    </div>
  );
}

function Avatar({ className, initialsText = "JD", type = "Initials" }) {
  return (
    <div className={className || "bg-primary-orange flex items-center justify-center rounded-full min-w-[36px] min-h-[36px]"}>
      <div className="font-bold text-label text-surface-white text-center whitespace-nowrap font-sans">
        <p className="leading-[1.5]">{initialsText}</p>
      </div>
    </div>
  );
}

function NavItemsGroup({ className, role = "Requester", selected = "HomeBoard" }) {
  return (
    <div className={className || "flex flex-col gap-4 w-full"}>
      <div className="bg-primary-orange-bg flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
        <div className="relative shrink-0 w-5 h-5">
          <div className="absolute inset-[12.5%_16.67%]">
            <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector2} />
          </div>
        </div>
        <p className="font-semibold leading-[1.5] relative shrink-0 text-label text-primary-orange whitespace-nowrap font-sans">
          Home
        </p>
      </div>
      <div className="flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
        <div className="relative shrink-0 w-5 h-5">
          <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector3} />
        </div>
        <p className="font-medium leading-[1.5] text-label text-ink-mid whitespace-nowrap font-sans">
          History
        </p>
      </div>
      <div className="flex gap-3 items-center min-h-[44px] px-3 rounded-[12px] w-full">
        <div className="relative shrink-0 w-5 h-5">
          <img alt="" className="absolute inset-0 block w-full h-full object-contain" src={imgVector4} />
        </div>
        <p className="font-medium leading-[1.5] text-label text-ink-mid whitespace-nowrap font-sans">
          Profile
        </p>
      </div>
    </div>
  );
}

function Navigation({ className, type = "Default" }) {
  return (
    <div className={className || "bg-surface-white border-border-rule border-r border-solid flex flex-col min-h-screen w-full lg:w-[240px] px-4 py-6"}>
      <div className="flex flex-col gap-1 pb-8">
        <div className="flex flex-col font-extrabold justify-center relative shrink-0 text-[28px] text-primary-orange tracking-[-0.56px] font-heading">
          <p className="leading-[normal]">Kart</p>
        </div>
        <div className="flex flex-col font-normal justify-center relative shrink-0 text-caption text-ink-light font-sans">
          <p className="leading-[1.5]">Skip the checkout line.</p>
        </div>
      </div>
      <NavItemsGroup className="flex flex-col gap-4 w-full" />
      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-center gap-3 w-full">
          <Avatar className="bg-primary-orange rounded-full shrink-0 w-9 h-9" initialsText="GC" />
          <div className="flex-1 min-w-0 flex flex-col gap-px">
            <div className="font-semibold text-label text-ink-default truncate font-sans">
              <p className="leading-[1.2]">Gina Cole</p>
            </div>
            <div className="font-normal text-caption text-ink-light font-sans">
              <p className="leading-[1.2]">Requester</p>
            </div>
          </div>
          <Icons className="shrink-0 w-5 h-5" icon="Settings" />
        </div>
      </div>
    </div>
  );
}

export default function ActiveOrderRequester() {
  return (
    <div className="min-h-screen bg-surface-default flex flex-col lg:flex-row">
      <Navigation className="bg-surface-white border-border-rule border-r border-solid flex flex-col min-h-screen w-full lg:w-[240px] px-4 py-6" />
      <div className="flex-1 flex flex-col min-h-screen items-start overflow-x-hidden overflow-y-auto px-6 py-8 lg:px-10 lg:py-10 w-full">
        <div className="flex items-start p-6 w-full">
          <div className="font-normal text-label text-primary-orange text-center whitespace-nowrap font-sans">
            <p className="leading-[1.5]">← Your Order</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-center p-4 w-full">
          <p className="font-bold leading-[1.3] text-heading-1 text-ink-default tracking-[-0.48px] whitespace-nowrap font-heading">
            Your Order
          </p>
          <StatusPills className="bg-primary-orange-bg flex h-6 items-center justify-center px-3 rounded-full" />
        </div>
        <div className="w-full">
          <ProgressBar className="flex flex-col gap-2 items-center justify-center w-full" />
        </div>
        <div className="relative mx-auto w-full max-w-[640px] px-4 py-4 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[253px] flex flex-col gap-6 items-center justify-center shadow-sm">
          <div className="flex items-start p-4 w-full">
            <div className="bg-primary-orange-bg border border-primary-orange border-solid flex flex-col items-start justify-center overflow-hidden p-6 rounded-[16px] shadow-sm w-full">
              <div className="flex flex-col gap-4 items-center justify-center w-full">
                <div className="flex flex-col gap-2 items-center justify-center shrink-0 w-full max-w-[128px]">
                  <div className="bg-status-green-bg flex items-center justify-center rounded-full shrink-0 w-9 h-9">
                    <div className="flex flex-col font-bold justify-center leading-[0] relative shrink-0 text-label text-status-green text-center whitespace-nowrap font-sans">
                      <p className="leading-[1.5]">YB</p>
                    </div>
                  </div>
                  <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-label text-ink-default text-center whitespace-nowrap font-sans">
                    <p className="leading-[1.5] whitespace-pre">{`Yuno  · Runner`}</p>
                  </div>
                </div>
                <div className="bg-surface-default border border-border-rule flex flex-col gap-4 items-center justify-center p-4 rounded-[12px] w-full text-center whitespace-nowrap">
                  <div className="flex flex-col font-semibold justify-center relative shrink-0 text-label text-ink-default font-sans">
                    <p className="leading-[1.5]">Zone Name</p>
                  </div>
                  <div className="flex flex-col font-normal justify-center relative shrink-0 text-caption text-ink-light font-sans">
                    <p className="leading-[1.5]">City Name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="bg-primary-orange-bg border border-primary-orange border-solid flex flex-col items-center justify-center overflow-hidden p-6 rounded-[16px] shadow-sm w-full max-w-[588px]">
              <div className="flex items-center justify-center w-full">
                <div className="flex flex-col font-normal leading-[0] text-body text-black text-center font-sans">
                  <p className="leading-[1.65] mb-0 text-ink-light whitespace-pre-wrap">📋 Items (14 items)</p>
                  <ul className="list-disc mb-0">
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">{`Bananas (1 bunch) `}</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Apples (4 pcs)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Onions (1 kg)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Garlic (3 bulbs)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Tomatoes (500g)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Potatoes (1 kg)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Carrots (2 pcs)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Leafy Greens (2 bundles)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Chicken (1 kg)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Ground Meat (500g)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Eggs (1 dozen)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Fish (3 pcs)</span>
                    </li>
                    <li className="mb-0 ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Tofu (2 blocks)</span>
                    </li>
                    <li className="ms-[calc(var(--list-marker-font-size,0)*1.5*1)]">
                      <span className="leading-[1.65]">Milk (1L)</span>
                    </li>
                  </ul>
                  <p className="leading-[1.65] whitespace-pre-wrap">&nbsp;</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center justify-center p-4 w-full">
            <div className="flex flex-col font-medium justify-center leading-[0] not-italic relative shrink-0 text-mono-sm text-ink-default text-center whitespace-nowrap font-mono">
              <p className="leading-[1.5]">📷 Receipt</p>
            </div>
            <div className="bg-surface-default border-[1.5px] border-border-rule border-dashed flex flex-col items-center justify-center p-3 rounded-[12px] w-full">
              <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-caption text-ink-light text-center whitespace-nowrap font-sans">
                <p className="leading-[1.5]">Waiting for runner to upload receipt…</p>
              </div>
            </div>
          </div>
          <div className="bg-primary-orange-bg border border-primary-orange border-solid flex flex-col gap-10 items-center justify-center p-6 rounded-[16px] w-full">
            <div className="flex flex-col font-normal justify-center leading-[0] min-w-full relative shrink-0 text-body text-ink-mid text-center w-[min-content] whitespace-pre-wrap font-sans">
              <p className="mb-0">
                <span>Items total:</span>
                <span className="font-medium leading-[1.5] text-mono font-mono">{` ₱715.56`}</span>
              </p>
              <p>
                <span>{`+ Runner fee:  `}</span>
                <span className="font-medium leading-[1.5] text-mono font-mono">
                  ₱30
                </span>
              </p>
            </div>
            <Divider className="border-border-rule border-solid border-t h-px shrink-0 w-[352px]" />
            <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-body text-ink-mid text-center whitespace-nowrap font-sans">
              <p>
                <span className="text-ink-default">{`Prepare: `}</span>
                <span className="font-medium leading-[1.5] text-primary-orange text-mono font-mono">
                  ₱745.56
                </span>
              </p>
            </div>
            <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-caption text-ink-mid text-center whitespace-nowrap font-sans">
              <p className="leading-[1.5]">Pay via COD or GCash: [RunnerGCashNumber]</p>
            </div>
            <div className="bg-primary-orange-bg border border-primary-orange border-solid flex h-11 items-center justify-center px-5 rounded-[12px] w-full sm:w-auto">
              <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-label text-primary-orange text-center whitespace-nowrap font-sans">
                <p className="leading-[1.5]">{` I Received My Order`}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-2 w-full">
            <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-caption text-status-red text-center whitespace-nowrap font-sans">
              <p className="decoration-solid leading-[1.5] underline">
                Something wrong? Report an issue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}