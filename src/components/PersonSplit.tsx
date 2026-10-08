import type { PersonShare, Person, SplitMode } from '../types/split';
import { formatBaht } from '../utils/formatters';
import { Users, UserPlus } from 'lucide-react';

interface PersonSplitProps {
  personShares: PersonShare[];
  people: Person[];
  mode: SplitMode;
  totalPaid: number;
  onAddPerson: () => void;
  onAssignPerson: (itemId: string, personId: string) => void;
}

export const PersonSplit: React.FC<PersonSplitProps> = ({
  personShares,
  people,
  mode,
  totalPaid,
  onAddPerson,
  onAssignPerson,
}) => {
  const avatarEmojis = ['👩', '👨', '🧑', '👧', '👦', '🧔', '👵', '👴'];

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-150 mb-3.5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-800 m-0">
              {mode === 'equal' ? 'หารเท่ากันทุกคน' : 'แบ่งยอดตามคน'}
            </h2>
            <p className="text-[11px] text-stone-400 m-0">
              {mode === 'equal'
                ? `เฉลี่ย ${people.length} คน คนละเท่าๆ กัน`
                : 'ยอดสุทธิที่แต่ละคนต้องจ่ายตามรายการที่ทาน'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddPerson}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>เพิ่มคน</span>
        </button>
      </div>

      {/* Cards per Person */}
      <div className="space-y-3">
        {personShares.map((ps, idx) => {
          const emoji = avatarEmojis[idx % avatarEmojis.length];

          return (
            <div
              key={ps.personId}
              className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/80 hover:border-orange-200 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg select-none">{emoji}</span>
                  <div>
                    <span className="font-bold text-stone-900 text-sm">
                      {ps.personName}
                    </span>
                    <span className="text-[10px] text-stone-400 ml-1.5">
                      ({ps.items.length} รายการ)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block leading-tight">
                    ต้องจ่าย:
                  </span>
                  <span className="text-base font-extrabold text-orange-600">
                    {formatBaht(ps.totalWeighted)} ฿
                  </span>
                </div>
              </div>

              {/* Items detail for this person */}
              {ps.items.length > 0 ? (
                <div className="bg-white/80 rounded-xl p-2.5 border border-stone-200/60 divide-y divide-stone-100 text-xs">
                  {ps.items.map((it) => (
                    <div
                      key={it.itemId}
                      className="py-1 flex items-center justify-between first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-700 font-medium truncate">
                          {it.itemName}
                        </span>
                        {it.isShared && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-semibold">
                            แชร์กัน
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-semibold text-stone-800">
                          {formatBaht(it.weightedShare)} ฿
                        </span>

                        {/* Quick switch owner */}
                        {people.length > 1 && (
                          <div className="relative inline-block">
                            <select
                              value={ps.personId}
                              onChange={(e) => onAssignPerson(it.itemId, e.target.value)}
                              title="ย้ายรายการนี้ให้คนอื่น"
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-600 rounded px-1 py-0.5 outline-none cursor-pointer border border-transparent"
                            >
                              <option disabled value={ps.personId}>
                                ย้าย ▾
                              </option>
                              {people
                                .filter((p) => p.id !== ps.personId)
                                .map((p) => (
                                  <option key={p.id} value={p.id}>
                                    ให้ {p.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 bg-stone-100/70 rounded-xl text-center text-xs text-stone-400 italic">
                  ยังไม่มีรายการอาหารของคนนี้
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total verification bar */}
      <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
        <span className="text-stone-500 font-medium">ยอดรวมทุกคน:</span>
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
