import type { SplitResult } from '../types/split';
import { formatBaht } from '../utils/formatters';
import { Receipt, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface SummaryProps {
  splitResult: SplitResult;
}

export const Summary: React.FC<SummaryProps> = ({ splitResult }) => {
  if (!splitResult.isValid) return null;

  const isDiscount = splitResult.differenceFromOriginal < -0.005;
  const isExtra = splitResult.differenceFromOriginal > 0.005;
  const absDiff = Math.abs(splitResult.differenceFromOriginal);
  const pct = Math.abs(splitResult.percentAdjustment).toFixed(1);

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-150 mb-3.5 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
          <Receipt className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-stone-800 m-0">สรุปภาพรวมบิล</h2>
          <p className="text-[11px] text-stone-400 m-0">เปรียบเทียบราคาเดิมกับยอดจ่ายจริง</p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-stone-100">
          <span className="text-stone-500">ราคาอาหารรวม (เดิม)</span>
          <span className="font-semibold text-stone-800">
            {formatBaht(splitResult.totalFoodOriginal)} บาท
          </span>
        </div>

        {isDiscount && (
          <div className="flex items-center justify-between py-1 text-emerald-600 border-b border-stone-100">
            <span className="flex items-center gap-1 font-medium">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>ส่วนลดรวมที่ได้</span>
            </span>
            <span className="font-bold">
              -{formatBaht(absDiff)} บาท ({pct}%)
            </span>
          </div>
        )}

        {isExtra && (
          <div className="flex items-center justify-between py-1 text-amber-600 border-b border-stone-100">
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ค่าส่ง / ค่าใช้จ่ายเพิ่มเติม</span>
            </span>
            <span className="font-bold">
              +{formatBaht(absDiff)} บาท
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1.5 font-bold text-stone-900 text-sm">
          <span>ยอดที่จ่ายจริงทั้งหมด</span>
          <span className="text-orange-600 text-base font-extrabold">
            {formatBaht(splitResult.totalPaid)} บาท
          </span>
        </div>
      </div>

      {/* Zero drift validation pill */}
      <div className="mt-3 py-2 px-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-stone-600">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>ยอดรวมกระจายคืนทุกรายการ:</span>
        </div>
        <span className="font-bold text-emerald-700">
          {formatBaht(splitResult.sumWeighted)} ฿ (ตรงเป๊ะ 100%)
        </span>
      </div>
    </div>
  );
};
