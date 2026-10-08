import React, { useState } from 'react';
import { Plus, Trash2, Utensils, Zap, Sparkles, ChevronDown } from 'lucide-react';
import type { ItemInput, Person } from '../types/split';
import { formatBaht } from '../utils/formatters';

interface QuickPriceInputProps {
  items: ItemInput[];
  people: Person[];
  showDetails: boolean;
  onToggleShowDetails: (show: boolean) => void;
  onUpdateItemPrice: (id: string, price: number) => void;
  onUpdateItemName: (id: string, name: string) => void;
  onUpdateItemQuantity: (id: string, qty: number) => void;
  onAssignPerson: (itemId: string, personId: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onBatchAddPrices: (prices: number[]) => void;
}

export const QuickPriceInput: React.FC<QuickPriceInputProps> = ({
  items,
  people,
  showDetails,
  onToggleShowDetails,
  onUpdateItemPrice,
  onUpdateItemName,
  onUpdateItemQuantity,
  onAssignPerson,
  onAddItem,
  onRemoveItem,
  onBatchAddPrices,
}) => {
  const [quickPasteText, setQuickPasteText] = useState('');
  const [showQuickPaste, setShowQuickPaste] = useState(false);

  const totalFoodOriginal = items.reduce((sum, item) => {
    const qty = Math.max(1, item.quantity || 1);
    const p = !isNaN(item.price) && item.price > 0 ? item.price : 0;
    return sum + p * qty;
  }, 0);

  const handleApplyQuickPaste = () => {
    if (!quickPasteText.trim()) return;
    // Extract all numbers (including decimals) separated by spaces, commas, pluses, newlines
    const matches = quickPasteText.match(/(\d+(\.\d+)?)/g);
    if (matches && matches.length > 0) {
      const numbers = matches.map(Number).filter((n) => !isNaN(n) && n > 0);
      if (numbers.length > 0) {
        onBatchAddPrices(numbers);
        setQuickPasteText('');
        setShowQuickPaste(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-xs border border-stone-150 mb-3.5 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-800 m-0">ราคาอาหาร</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {items.length} รายการ
              </span>
            </div>
          </div>
        </div>

        {/* Toggle details vs pure numbers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowQuickPaste(!showQuickPaste)}
            className="flex items-center gap-1 text-[11px] font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-xl cursor-pointer transition-colors"
          >
            <Zap className="w-3 h-3" />
            <span>วางหลายราคา</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleShowDetails(!showDetails)}
            className="text-[11px] font-medium text-stone-500 hover:text-stone-800 underline underline-offset-2 cursor-pointer"
          >
            {showDetails ? 'ซ่อนชื่อเมนู' : 'ใส่ชื่อเมนู/คน'}
          </button>
        </div>
      </div>

      {/* Quick Paste Modal / Drawer */}
      {showQuickPaste && (
        <div className="mb-3.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 animate-fade-in">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              พิมพ์หรือวางราคาหลายตัวพร้อมกัน
            </label>
            <span className="text-[10px] text-amber-700">เช่น 79 69 69 หรือ 79+69+69</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={quickPasteText}
              onChange={(e) => setQuickPasteText(e.target.value)}
              placeholder="เช่น 79 69 69"
              className="flex-1 px-3 py-2 text-sm bg-white rounded-xl border border-amber-300 outline-none focus:ring-2 focus:ring-amber-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyQuickPaste();
              }}
            />
            <button
              type="button"
              onClick={handleApplyQuickPaste}
              className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              นำเข้า
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2 mb-3">
        {items.map((item, idx) => {
          const assignedPersonId = item.assignedPersonIds?.[0] || people[idx % people.length]?.id;

          return (
            <div
              key={item.id}
              className="group p-2.5 rounded-2xl bg-stone-50/80 hover:bg-stone-50 border border-stone-200/70 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                {/* Index badge */}
                <div className="w-6 h-6 rounded-lg bg-stone-200/80 text-stone-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                {/* Optional Menu Name Input */}
                {showDetails && (
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => onUpdateItemName(item.id, e.target.value)}
                    placeholder={`เมนูที่ ${idx + 1} (ไม่บังคับ)`}
                    className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-white rounded-xl border border-stone-200 outline-none focus:border-orange-400"
                  />
                )}

                {/* Price Input (Primary!) */}
                <div className="relative flex-1">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    value={item.price > 0 ? item.price : ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateItemPrice(item.id, isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    placeholder="ราคา (บาท)"
                    className="w-full pl-3 pr-8 py-2 text-base font-bold text-stone-900 bg-white rounded-xl border border-stone-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400 pointer-events-none">
                    ฿
                  </span>
                </div>

                {/* Quantity (if showDetails) */}
                {showDetails && (
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-stone-400">×</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={99}
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateItemQuantity(item.id, isNaN(val) ? 1 : Math.max(1, val));
                      }}
                      className="w-11 px-1.5 py-1.5 text-center text-xs font-semibold bg-white rounded-xl border border-stone-200 outline-none"
                    />
                  </div>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="w-8 h-8 rounded-xl text-stone-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="ลบรายการ"
                  aria-label="ลบรายการ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Person selector row (if showDetails or multiple people) */}
              {people.length > 1 && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/50">
                  <span className="text-[11px] text-stone-400">เจ้าของจานนี้:</span>
                  <div className="relative inline-block">
                    <select
                      value={assignedPersonId}
                      onChange={(e) => onAssignPerson(item.id, e.target.value)}
                      className="appearance-none pl-2.5 pr-6 py-0.5 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-700 outline-none focus:border-orange-400 cursor-pointer"
                    >
                      {people.map((p) => (
                        <option key={p.id} value={p.id}>
                          👤 {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Item button & Subtotal summary */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          id="add-item-btn"
          onClick={onAddItem}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มรายการ</span>
        </button>

        <div className="text-right">
          <span className="text-[11px] text-stone-400 mr-1.5">ราคารวมเดิม:</span>
          <span className="text-sm font-bold text-stone-800">
            {formatBaht(totalFoodOriginal)} ฿
          </span>
        </div>
      </div>
    </div>
  );
};
