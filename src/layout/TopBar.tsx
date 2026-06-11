import { BRAND } from '../config/brand';
import { RoleSwitcher } from './RoleSwitcher';
import { DemoControls } from './DemoControls';
import { DemoGuide } from './DemoGuide';

/** Global top bar: brand mark, app title, and the prominent role switcher. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="flex h-full items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: BRAND.primaryColor }}
          >
            {BRAND.shortName}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              Regulatory Change Management
            </p>
            <p className="text-xs text-slate-400">{BRAND.name}</p>
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
