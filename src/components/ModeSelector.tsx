import React from 'react';
import type { SplitMode } from '../types/split';
import { PieChart, Users, Equal } from 'lucide-react';

interface ModeSelectorProps {
  mode: SplitMode;
  onChangeMode: (mode: SplitMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChangeMode }) => {
  const modes: { id: SplitMode; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    {
      id: 'proportional_item',
      label: 'สัดส่วนรายการ',
      icon: PieChart,
      desc: 'กระจายตามราคาเดิม',
    },
    {
      id: 'person_assigned',
      label: 'แบ่งตามคน',
      icon: Users,
      desc: 'เลือกเจ้าของจาน',
    },
    {
      id: 'equal',
      label: 'หารเท่ากัน',
      icon: Equal,
      desc: 'เฉลี่ยเท่าทุกคน',
    },
  ];

  return (
    <div className="px-4 mb-3">
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-200/60 rounded-2xl border border-stone-200/50">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              id={`mode-${m.id}`}
              onClick={() => onChangeMode(m.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-white/50 font-normal'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-stone-400'}`} />
                <span className="text-xs">{m.label}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-normal hidden xs:block">
                {m.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
