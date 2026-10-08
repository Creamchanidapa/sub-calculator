import type { CalculatedItem, Person } from '../types/split';
import { formatBaht } from '../utils/formatters';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CalculationResultProps {
  items: CalculatedItem[];
  people: Person[];
  totalPaid: number;
  onAssignPerson: (itemId: string, personId: string) => void;
  onSwitchToPersonMode: () => void;
}

export const CalculationResult: React.FC<CalculationResultProps> = ({
  items,
  people,
  totalPaid,
  onAssignPerson,
  onSwitchToPersonMode,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-150 mb-3.5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-800 m-0">ผลการหารตามสัดส่วน</h2>
            <p className="text-[11px] text-stone-400 m-0">คำนวณถัวเฉลี่ยกลับไปยังแต่ละรายการ</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchToPersonMode}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
        >
          <span>ดูแบบแบ่งตามคน</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Items Breakdown list */}
      <div className="divide-y divide-stone-100">
        {items.map((item, idx) => {
          const isDiscount = item.discountOrExtra < -0.005;
          const isExtra = item.discountOrExtra > 0.005;
          const assignedPersonId = item.assignedPersonIds?.[0] || people[idx % people.length]?.id;

          return (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between gap-2 text-xs"
            >
              {/* Item info */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base select-none shrink-0">🍱</span>
                <div className="min-w-0">
                  <div className="font-semibold text-stone-800 truncate">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span className="line-through">
                      {formatBaht(item.originalPrice)} ฿
                    </span>
                    {people.length > 1 && (
                      <div className="relative inline-block">
                        <select
                          value={assignedPersonId}
                          onChange={(e) => onAssignPerson(item.id, e.target.value)}
                          className="text-[10px] bg-stone-100 text-stone-600 font-medium px-1.5 py-0.5 rounded cursor-pointer border border-transparent hover:border-stone-200 outline-none"
                        >
                          {people.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Price calculation */}
              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1 font-bold text-stone-900 text-sm">
                  <span>{formatBaht(item.weightedPrice)}</span>
                  <span className="text-xs font-normal text-stone-500">บาท</span>
                </div>
                {isDiscount && (
                  <span className="text-[10px] font-semibold text-emerald-600">
                    ลด {formatBaht(Math.abs(item.discountOrExtra))} ฿
                  </span>
                )}
                {isExtra && (
                  <span className="text-[10px] font-semibold text-amber-600">
                    +{formatBaht(item.discountOrExtra)} ฿
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtotal line */}
      <div className="mt-2 pt-2.5 border-t border-stone-200 flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">รวมทั้งหมด</span>
        <div className="flex items-center gap-1">
          <span className="text-base font-extrabold text-stone-900">
            {formatBaht(totalPaid)}
          </span>
          <span className="text-xs text-stone-500">บาท</span>
        </div>
      </div>
    </div>
  );
};
