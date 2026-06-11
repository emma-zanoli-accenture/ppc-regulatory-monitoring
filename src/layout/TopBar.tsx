import { BRAND } from '../config/brand';
import { RoleSwitcher } from './RoleSwitcher';
import { DemoControls } from './DemoControls';
import { DemoGuide } from './DemoGuide';

/** Global top bar: brand mark, app title, and the prominent role switcher. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* Signature: a hairline teal accent rule along the very top. */}
      <div className="h-0.5 accent-rule" />
      <div className="flex h-[58px] items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded text-[13px] font-bold text-white"
            style={{ backgroundColor: BRAND.primaryColor }}
          >
            {BRAND.shortName}
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold tracking-tight text-slate-900">
              Regulatory Change Management
            </p>
            <p className="text-2xs text-slate-400">{BRAND.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <DemoGuide />
          <DemoControls />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
