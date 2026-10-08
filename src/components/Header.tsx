import React, { useState } from 'react';
import { RotateCcw, Sparkles, Check, ChevronDown } from 'lucide-react';
import { PRESET_CASES, type PresetCase } from '../utils/testCases';

interface HeaderProps {
  onSelectPreset: (preset: PresetCase) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPreset, onReset }) => {
  const [showPresets, setShowPresets] = useState(false);

  return (
    <header className="relative pt-4 pb-3 px-4">
      <div className="flex items-center justify-between mb-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-md shadow-orange-500/20 text-xl select-none">
            🍚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-none">
                SplitMeal
              </h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-700 tracking-wider">
                Proportional
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              หารค่าอาหารตามสัดส่วน ไม่ต้องคิดเอง
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Preset Cases Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="preset-examples-btn"
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200/80 transition-all active:scale-95 cursor-pointer"
              title="เลือกตัวอย่างทดสอบ"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ตัวอย่าง</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showPresets && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPresets(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-stone-150 py-1.5 z-50 animate-fade-in divide-y divide-stone-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    เลือกตัวอย่างทดสอบ
                  </div>
                  {PRESET_CASES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSelectPreset(preset);
                        setShowPresets(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-orange-50/70 transition-colors flex flex-col gap-0.5 cursor-pointer"
                    >
                      <span className="text-xs font-semibold text-stone-800">
                        {preset.title}
                      </span>
                      <span className="text-[11px] text-stone-500">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="button"
            id="reset-form-btn"
            onClick={onReset}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="ล้างข้อมูลใหม่"
            aria-label="ล้างข้อมูลใหม่"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtitle / Tip pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/60">
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>กระจายยอดที่จ่ายจริงตามสัดส่วนเดิม ยอดรวมตรงเป๊ะทุกครั้ง</span>
      </div>
    </header>
  );
};
