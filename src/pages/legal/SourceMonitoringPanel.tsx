import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  RadioTower,
  RefreshCw,
  SatelliteDish,
  Sparkles,
} from 'lucide-react';
import { AIThinkingIndicator, Button, SectionCard, Tag } from '../../components';
import { useDemoStore, MONITORED_SOURCES } from '../../store/DemoStore';
import { useToast } from '../../context/ToastContext';
import { REMIT_II_ID } from '../../data';
import { delay } from '../../lib/delay';
import { cn } from '../../lib/cn';

const SCAN_CAPTIONS = [
  'Scanning ACER publications…',
  'Analysing ENTSO-E transparency feeds…',
  'Cross-referencing the EU Official Journal…',
  'Detecting relevant regulatory changes…',
];

/**
 * The agentic centerpiece of the Legal dashboard. Two scripted actions — "Run
 * source scan" and "Update source catalogue" — are paced with the
 * AIThinkingIndicator so they read as a live agent working.
 */
export function SourceMonitoringPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    regulatoryChanges,
    catalogue,
    sourceScanRun,
    catalogueUpdated,
    runSourceScan,
    updateSourceCatalogue,
  } = useDemoStore();

  const [scanning, setScanning] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [scanCaption, setScanCaption] = useState(0);

  // Rotate scan captions while the agent "works" so the moment registers.
  useEffect(() => {
    if (!scanning) return;
    setScanCaption(0);
    const iv = setInterval(
      () => setScanCaption((c) => Math.min(c + 1, SCAN_CAPTIONS.length - 1)),
      560,
    );
    return () => clearInterval(iv);
  }, [scanning]);

  const remit = regulatoryChanges.find((c) => c.id === REMIT_II_ID);
  const catalogueChanges = catalogue
    .map((id) => regulatoryChanges.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const handleScan = async () => {
    setScanning(true);
    await delay(2200);
    runSourceScan();
    setScanning(false);
  };

  const handleUpdateCatalogue = async () => {
    setUpdating(true);
    await delay(1400);
    updateSourceCatalogue();
    setUpdating(false);
    toast({
      title: 'Source catalogue updated',
      description: 'REMIT II is now tracked in the monitored source catalogue.',
      variant: 'success',
    });
  };

  return (
    <SectionCard
      icon={SatelliteDish}
      iconTone="accent"
      title={
        <span className="flex items-center gap-2">
          Regulatory Source Monitoring
          <Tag tone="accent" size="sm">
            <Sparkles size={11} className="-ml-0.5" /> Agentic
          </Tag>
        </span>
      }
      description="Continuous AI monitoring of upstream regulatory sources."
      actions={
        <Button
          icon={RefreshCw}
          onClick={handleScan}
          loading={scanning}
          disabled={scanning || updating}
        >
          Run source scan
        </Button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Monitored sources */}
        <div>
          <p className="label-eyebrow mb-2.5">Monitored Sources</p>
          <ul className="space-y-2">
            {MONITORED_SOURCES.map((src) => (
              <li
                key={src.id}
                className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50/60 px-3 py-2"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-500" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{src.name}</p>
                  <p className="truncate text-xs text-slate-400">{src.authority}</p>
                </div>
                <RadioTower size={15} className="ml-auto shrink-0 text-slate-300" />
              </li>
            ))}
          </ul>
        </div>

        {/* Scan result / catalogue */}
        <div className="flex flex-col">
          <p className="label-eyebrow mb-2.5">Detection</p>

          {scanning && (
            <AIThinkingIndicator
              variant="panel"
              label={SCAN_CAPTIONS[scanCaption]}
              sublabel="Continuous AI monitoring across 4 regulatory sources"
            />
          )}

          {!scanning && !sourceScanRun && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
              <RadioTower size={22} className="text-slate-300" />
              <p className="mt-2 text-sm text-slate-400">
                Run a source scan to detect new relevant regulations.
              </p>
            </div>
          )}

          {!scanning && sourceScanRun && remit && (
            <div className="space-y-3 animate-fade-in">
              <button
                onClick={() => navigate(`/legal/regulatory-change/${remit.id}`)}
                className="group w-full rounded border border-accent-200 bg-accent-50/50 p-3.5 text-left transition-colors hover:bg-accent-50"
              >
                <div className="flex items-center gap-1.5 text-accent-700">
                  <BadgeCheck size={14} />
                  <span className="text-2xs font-semibold uppercase tracking-[0.08em]">
                    1 new relevant regulation detected
                  </span>
                </div>
                <p className="mt-1.5 flex items-start justify-between gap-2 text-sm font-semibold text-slate-900">
                  <span>{remit.title}</span>
                  <ArrowRight
                    size={16}
                    className="mt-0.5 shrink-0 text-accent-600 transition-transform group-hover:translate-x-0.5"
                  />
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Source: {remit.regulatorySource} · detected across 4 monitored feeds
                </p>
              </button>

              <Button
                variant="secondary"
                icon={RefreshCw}
                onClick={handleUpdateCatalogue}
                loading={updating}
                disabled={updating || catalogueUpdated}
                fullWidth
              >
                {catalogueUpdated ? 'Catalogue updated' : 'Update source catalogue'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Source catalogue list */}
      <div className="mt-5 border-t border-slate-200 pt-4">
        <p className="label-eyebrow mb-2.5">Source Catalogue</p>
        <ul className="space-y-1">
          {catalogueChanges.map((c) => {
            const isNew = c.id === REMIT_II_ID;
            return (
              <li
                key={c.id}
                className={cn(
                  'flex items-center gap-3 rounded border px-3 py-2 text-sm',
                  isNew
                    ? 'border-accent-200 bg-accent-50/60 animate-fade-in'
                    : 'border-slate-200 bg-slate-50/60',
                )}
              >
                <CheckCircle2
                  size={15}
                  className={isNew ? 'text-accent-600' : 'text-slate-300'}
                />
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                  {c.title}
                </span>
                <span className="shrink-0 text-xs text-slate-400">{c.regulatorySource}</span>
                {isNew && (
                  <Tag tone="accent" size="sm">
                    Newly added
                  </Tag>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SectionCard>
  );
}
