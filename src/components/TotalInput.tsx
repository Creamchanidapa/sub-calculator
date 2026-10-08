import React, { useState } from 'react';
import { DollarSign, Tag, Bike, RotateCcw, Sparkles } from 'lucide-react';
import type { ExtraFees } from '../types/split';
import { formatBaht } from '../utils/formatters';

interface TotalInputProps {
  totalPaid: string;
  foodSubtotal: number;
  extraFees: ExtraFees;
  onChangeTotalPaid: (val: string) => void;
  onChangeExtraFees: (fees: ExtraFees) => void;
  onSetTotalToSubtotal: () => void;
}

export const TotalInput: React.FC<TotalInputProps> = ({
  totalPaid,
  foodSubtotal,
  extraFees,
  onChangeTotalPaid,
  onChangeExtraFees,
  onSetTotalToSubtotal,
}) => {
  const [discountType, setDiscountType] = useState<'baht' | 'percent'>('baht');
  const [discountRawInput, setDiscountRawInput] = useState<string>(
    extraFees.discount > 0 ? String(extraFees.discount) : ''
  );
  const [deliveryRawInput, setDeliveryRawInput] = useState<string>(
    extraFees.deliveryFee > 0 ? String(extraFees.deliveryFee) : ''
  );

  // Sync external changes (e.g. presets or reset) to local inputs
  React.useEffect(() => {
    if (extraFees.discount > 0) {
      setDiscountRawInput(String(Math.round(extraFees.discount * 100) / 100));
    } else if (extraFees.discount === 0) {
      setDiscountRawInput('');
    }

    if (extraFees.deliveryFee > 0) {
      setDeliveryRawInput(String(extraFees.deliveryFee));
    } else if (extraFees.deliveryFee === 0) {
      setDeliveryRawInput('');
    }
  }, [extraFees.discount, extraFees.deliveryFee]);

  const parsedTotal = parseFloat(totalPaid) || 0;
  const difference = parsedTotal - foodSubtotal;
  const hasDiscount = difference < -0.01;
  const hasExtra = difference > 0.01;

  // Calculate discount amount in Baht
  const calculateDiscountAmount = (valStr: string, type: 'baht' | 'percent'): number => {
    const val = parseFloat(valStr) || 0;
    if (val <= 0) return 0;
    if (type === 'percent') {
      return (foodSubtotal * val) / 100;
    }
    return val;
  };

  // When discount input changes, update Total Paid automatically
  const handleDiscountChange = (newRawVal: string, type = discountType) => {
    setDiscountRawInput(newRawVal);
    const discAmount = calculateDiscountAmount(newRawVal, type);
    const delivery = parseFloat(deliveryRawInput) || 0;

    const newExtraFees: ExtraFees = {
      ...extraFees,
      discount: discAmount,
      discountType: type,
    };
    onChangeExtraFees(newExtraFees);

    if (foodSubtotal > 0) {
      if (newRawVal.trim() === '' && delivery === 0) {
        // If discount cleared and no delivery, keep current total or let user edit
      } else {
        const computedTotal = Math.max(0, foodSubtotal - discAmount + delivery);
        onChangeTotalPaid(computedTotal.toFixed(2));
      }
    }
  };

  const handleToggleDiscountType = (newType: 'baht' | 'percent') => {
    setDiscountType(newType);
    if (discountRawInput.trim()) {
      handleDiscountChange(discountRawInput, newType);
    }
  };

  const handleDeliveryChange = (newVal: string) => {
    setDeliveryRawInput(newVal);
    const delivery = parseFloat(newVal) || 0;
    const discAmount = calculateDiscountAmount(discountRawInput, discountType);

    const newExtraFees: ExtraFees = {
      ...extraFees,
      deliveryFee: delivery,
    };
    onChangeExtraFees(newExtraFees);

    if (foodSubtotal > 0) {
      const computedTotal = Math.max(0, foodSubtotal - discAmount + delivery);
      onChangeTotalPaid(computedTotal.toFixed(2));
    }
  };

  const handleClearDiscount = () => {
    setDiscountRawInput('');
    const delivery = parseFloat(deliveryRawInput) || 0;
    onChangeExtraFees({
      ...extraFees,
      discount: 0,
    });
    if (foodSubtotal > 0) {
      const computedTotal = Math.max(0, foodSubtotal + delivery);
      onChangeTotalPaid(computedTotal.toFixed(2));
    }
  };

  const handleApplyQuickDiscount = (amount: number, type: 'baht' | 'percent') => {
    setDiscountType(type);
    setDiscountRawInput(String(amount));
    handleDiscountChange(String(amount), type);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50/70 via-white to-white rounded-3xl p-4 shadow-sm border-2 border-orange-200/90 mb-4 transition-all relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-stone-900 m-0">ส่วนลด & ยอดจ่ายจริง</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-orange-500 text-white uppercase tracking-wider">
                คำนวณสุทธิ
              </span>
            </div>
            <p className="text-[11px] text-stone-500 m-0">
              ราคาอาหารรวม: <strong className="text-stone-800">{formatBaht(foodSubtotal)} ฿</strong>
            </p>
          </div>
        </div>

        {/* Quick button to set equal to subtotal */}
        {foodSubtotal > 0 && (
          <button
            type="button"
            id="reset-to-subtotal-btn"
            onClick={() => {
              handleClearDiscount();
              setDeliveryRawInput('');
              onSetTotalToSubtotal();
            }}
            className="text-[11px] font-semibold text-stone-600 hover:text-orange-700 bg-stone-100 hover:bg-orange-100 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
            title="ล้างส่วนลดและใช้ราคาเต็ม"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ใช้ราคาเดิม</span>
          </button>
        )}
      </div>

      {/* SECTION 1: DISCOUNT INPUT (ช่องใส่ส่วนลด - ใส่หรือไม่ใส่ก็ได้) */}
      <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="discount-input"
            className="text-xs font-bold text-amber-950 flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>ส่วนลด (Discount)</span>
            <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
              ถ้ามี / ไม่บังคับ
            </span>
          </label>

          {/* Unit Toggle: Baht (฿) or Percent (%) */}
          <div className="inline-flex p-0.5 rounded-lg bg-amber-200/60 border border-amber-300/60 text-xs">
            <button
              type="button"
              onClick={() => handleToggleDiscountType('baht')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                discountType === 'baht'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-amber-800 hover:text-stone-900'
              }`}
            >
              ฿ บาท
            </button>
            <button
              type="button"
              onClick={() => handleToggleDiscountType('percent')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                discountType === 'percent'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-amber-800 hover:text-stone-900'
              }`}
            >
              % เปอร์เซ็นต์
            </button>
          </div>
        </div>

        {/* Discount Input Box */}
        <div className="relative">
          <input
            type="number"
            id="discount-input"
            inputMode="decimal"
            step="any"
            value={discountRawInput}
            onChange={(e) => handleDiscountChange(e.target.value)}
            placeholder={discountType === 'baht' ? 'ใส่ส่วนลด เช่น 50 หรือ 54.25' : 'ใส่เปอร์เซ็นต์ส่วนลด เช่น 20 หรือ 25'}
            className="w-full pl-3 pr-16 py-2.5 text-base font-bold text-stone-900 bg-white rounded-xl border border-amber-300 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-500 placeholder:text-stone-300 placeholder:font-normal"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {discountRawInput && (
              <button
                type="button"
                onClick={handleClearDiscount}
                className="text-stone-400 hover:text-stone-700 text-xs px-1 cursor-pointer"
                title="ลบส่วนลด"
              >
                ✕
              </button>
            )}
            <span className="text-xs font-bold text-amber-700 pointer-events-none">
              {discountType === 'baht' ? 'บาท' : '%'}
            </span>
          </div>
        </div>

        {/* Quick tap discount presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-[10px] text-amber-800/80 shrink-0 font-medium flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            กดเร็ว:
          </span>
          {[
            { val: 15, label: '15฿', type: 'baht' as const },
            { val: 30, label: '30฿', type: 'baht' as const },
            { val: 50, label: '50฿', type: 'baht' as const },
            { val: 100, label: '100฿', type: 'baht' as const },
            { val: 10, label: '10%', type: 'percent' as const },
            { val: 20, label: '20%', type: 'percent' as const },
            { val: 25, label: '25%', type: 'percent' as const },
          ].map((chip) => (
            <button
              key={`${chip.type}-${chip.val}`}
              type="button"
              onClick={() => handleApplyQuickDiscount(chip.val, chip.type)}
              className="shrink-0 px-2 py-0.5 bg-white hover:bg-amber-100/80 active:scale-95 text-stone-700 text-[11px] font-semibold rounded-lg border border-amber-200 transition-all cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: OPTIONAL DELIVERY FEE (ค่าส่ง - ถ้ามี) */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 mb-3 text-xs">
        <label
          htmlFor="delivery-fee-input"
          className="text-[11px] font-semibold text-stone-600 flex items-center gap-1.5 cursor-pointer"
        >
          <Bike className="w-3.5 h-3.5 text-sky-500" />
          <span>ค่าส่ง / Delivery (ถ้ามี):</span>
        </label>
        <div className="relative w-28">
          <input
            type="number"
            id="delivery-fee-input"
            inputMode="decimal"
            step="any"
            value={deliveryRawInput}
            onChange={(e) => handleDeliveryChange(e.target.value)}
            placeholder="0"
            className="w-full pl-2.5 pr-8 py-1.5 text-xs font-bold text-stone-900 bg-white rounded-xl border border-stone-200 outline-none focus:border-orange-400 text-right"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 pointer-events-none">
            บาท
          </span>
        </div>
      </div>

      {/* SECTION 3: TOTAL PAID INPUT (ยอดที่จ่ายจริงสุทธิ) */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="total-paid-input"
            className="text-xs font-bold text-stone-900 flex items-center gap-1"
          >
            <span>ยอดที่จ่ายจริงสุทธิ (Total Paid)</span>
            <span className="text-[10px] text-orange-600 font-semibold">
              *นำไปกระจายตามสัดส่วน
            </span>
          </label>
          <span className="text-[11px] text-stone-400">
            {discountRawInput.trim() ? '(คำนวณให้อัตโนมัติ หรือพิมพ์แก้ได้)' : '(พิมพ์ยอดสุทธิโดยตรงได้)'}
          </span>
        </div>

        {/* Large Input Field */}
        <div className="relative">
          <input
            type="number"
            id="total-paid-input"
            inputMode="decimal"
            step="any"
            value={totalPaid}
            onChange={(e) => onChangeTotalPaid(e.target.value)}
            placeholder="0.00"
            className="w-full pl-4 pr-16 py-3.5 text-2xl sm:text-3xl font-black text-stone-900 bg-white rounded-2xl border-2 border-orange-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none shadow-inner transition-all placeholder:text-stone-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm font-bold text-stone-400">
            <span>บาท</span>
          </div>
        </div>
      </div>

      {/* Price comparison & breakdown pill */}
      {parsedTotal > 0 && foodSubtotal > 0 && (
        <div className="flex flex-col gap-1 text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-500">
              ราคาอาหารเดิม: <strong className="text-stone-800">{formatBaht(foodSubtotal)} ฿</strong>
            </span>
            {hasDiscount && (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                🎉 ประหยัด -{formatBaht(Math.abs(difference))} ฿ ({Math.abs((difference / foodSubtotal) * 100).toFixed(1)}%)
              </span>
            )}
            {hasExtra && (
              <span className="font-bold text-amber-600 flex items-center gap-1">
                🛵 ค่าส่ง/เพิ่ม +{formatBaht(difference)} ฿
              </span>
            )}
            {!hasDiscount && !hasExtra && (
              <span className="text-stone-500">
                ราคาตรงกับยอดเดิมพอดี
              </span>
            )}
          </div>

          {/* Mathematical breakdown breadcrumb */}
          {Math.abs(difference) > 0.005 && (
            <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/60 font-mono">
              อาหาร {formatBaht(foodSubtotal)} ฿
              {hasDiscount && ` - ส่วนลด ${formatBaht(Math.abs(difference))} ฿`}
              {hasExtra && ` + ค่าใช้จ่าย ${formatBaht(difference)} ฿`}
              {' = จ่ายจริง '}
              <strong className="text-stone-700">{formatBaht(parsedTotal)} ฿</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
