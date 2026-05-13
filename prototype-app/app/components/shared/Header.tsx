import React from "react";
import { Settings, ChevronRight } from "lucide-react";

interface HeaderProps {
  step: number;
  onReset: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  canGoNext: boolean;
}

export function Header({ step, onReset, onPrevStep, onNextStep, canGoNext }: HeaderProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { n: 0, label: "Request" },
    { n: 1, label: "Acceptance" },
    { n: 2, label: "Repair" },
    { n: 3, label: "Delivery" }
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
        <Settings className="text-red-600" />
        <span className="text-gray-900">GLOBAL<span className="text-red-600">CARS</span></span>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div className={`flex items-center gap-2 transition-colors ${step === s.n ? 'text-red-600' : step > s.n ? 'text-emerald-600' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s.n ? 'bg-red-600 border-red-600 text-white' : step > s.n ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                {s.n}
              </div>
              {s.label}
            </div>
            {i < 3 && <ChevronRight className="w-4 h-4 opacity-30" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
          <button 
            onClick={onPrevStep}
            disabled={mounted && step === 0}
            className="p-1.5 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Previous Stage"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button 
            onClick={onNextStep}
            disabled={mounted && !canGoNext}
            className="p-1.5 hover:bg-white rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Next Stage"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button onClick={onReset} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium">
          ↺ Reset
        </button>
      </div>
    </header>
  );
}
