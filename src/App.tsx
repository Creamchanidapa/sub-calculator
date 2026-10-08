import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { PeopleInput } from './components/PeopleInput';
import { QuickPriceInput } from './components/QuickPriceInput';
import { TotalInput } from './components/TotalInput';
import { ValidationBanner } from './components/ValidationBanner';
import { CalculationResult } from './components/CalculationResult';
import { PersonSplit } from './components/PersonSplit';
import { Summary } from './components/Summary';
import { CopyButton } from './components/CopyButton';
import { Toast } from './components/Toast';

import type { AppState, SplitMode, ItemInput, ExtraFees } from './types/split';
import { calculateProportionalSplit } from './utils/calculateProportionalSplit';
import { loadSavedState, saveState, createDefaultPeople, DEFAULT_STATE } from './utils/storage';
import type { PresetCase } from './utils/testCases';
import { Calculator } from 'lucide-react';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadSavedState());
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // People handlers
  const handleUpdatePeopleCount = (newCount: number) => {
    setState((prev) => {
      const currentPeople = [...prev.people];
      if (newCount > currentPeople.length) {
        // Add more people
        const newPeople = createDefaultPeople(newCount);
        // keep existing names
        for (let i = 0; i < currentPeople.length; i++) {
          newPeople[i] = currentPeople[i];
        }
        return { ...prev, people: newPeople };
      } else if (newCount < currentPeople.length) {
        // Truncate people
        const sliced = currentPeople.slice(0, newCount);
        // Reassign any item assigned to removed people to the first person
        const validIds = new Set(sliced.map((p) => p.id));
        const updatedItems = prev.items.map((it) => {
          const currentAssigned = it.assignedPersonIds || [];
          const filtered = currentAssigned.filter((id) => validIds.has(id));
          return {
            ...it,
            assignedPersonIds: filtered.length > 0 ? filtered : [sliced[0].id],
          };
        });
        return { ...prev, people: sliced, items: updatedItems };
      }
      return prev;
    });
  };

  const handleRenamePerson = (id: string, newName: string) => {
    setState((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, name: newName } : p)),
    }));
  };

  const handleAddPerson = () => {
    if (state.people.length < 20) {
      handleUpdatePeopleCount(state.people.length + 1);
      showToast(`เพิ่มสมาชิกเรียบร้อย (${state.people.length + 1} คน)`);
    }
  };

  // Item handlers
  const handleUpdateItemPrice = (id: string, price: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, price } : it)),
    }));
  };

  const handleUpdateItemName = (id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, name } : it)),
    }));
  };

  const handleUpdateItemQuantity = (id: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, quantity } : it)),
    }));
  };

  const handleAssignPerson = (itemId: string, personId: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId ? { ...it, assignedPersonIds: [personId] } : it
      ),
    }));
  };

  const handleAddItem = () => {
    setState((prev) => {
      const nextIndex = prev.items.length + 1;
      const defaultPersonId = prev.people[(nextIndex - 1) % prev.people.length]?.id || prev.people[0]?.id;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: `item-${Date.now()}-${nextIndex}`,
            price: 0,
            name: '',
            quantity: 1,
            assignedPersonIds: [defaultPersonId],
          },
        ],
      };
    });
  };

  const handleRemoveItem = (id: string) => {
    setState((prev) => {
      if (prev.items.length <= 1) {
        showToast('ต้องมีอย่างน้อย 1 รายการ');
        return prev;
      }
      return {
        ...prev,
        items: prev.items.filter((it) => it.id !== id),
      };
    });
  };

  const handleBatchAddPrices = (prices: number[]) => {
    setState((prev) => {
      const newItems: ItemInput[] = prices.map((price, idx) => ({
        id: `batch-${Date.now()}-${idx}`,
        price,
        name: '',
        quantity: 1,
        assignedPersonIds: [prev.people[idx % prev.people.length]?.id || prev.people[0]?.id],
      }));
      return {
        ...prev,
        items: newItems,
      };
    });
    showToast(`นำเข้า ${prices.length} รายการอาหารแล้ว! ✨`);
  };

  // Total Paid & Fees
  const handleChangeTotalPaid = (val: string) => {
    setState((prev) => ({ ...prev, totalPaid: val }));
  };

  const handleChangeExtraFees = (extraFees: ExtraFees) => {
    setState((prev) => ({ ...prev, extraFees }));
  };

  const handleSetTotalToSubtotal = () => {
    const subtotal = state.items.reduce(
      (sum, it) => sum + (it.price || 0) * Math.max(1, it.quantity || 1),
      0
    );
    setState((prev) => ({ ...prev, totalPaid: subtotal.toFixed(2) }));
    showToast('ปรับยอดจ่ายจริงเท่ากับราคาอาหารเดิมแล้ว');
  };

  // Presets and Reset
  const handleSelectPreset = (preset: PresetCase) => {
    const newPeople = createDefaultPeople(preset.peopleCount);
    const newItems: ItemInput[] = preset.items.map((it, idx) => ({
      id: `preset-${idx}-${Date.now()}`,
      name: it.name,
      price: it.price,
      quantity: it.quantity || 1,
      assignedPersonIds: [newPeople[it.assignedIndex ?? (idx % newPeople.length)]?.id || newPeople[0].id],
    }));

    const origTotal = preset.items.reduce((s, it) => s + it.price * (it.quantity || 1), 0);
    const paidNum = parseFloat(preset.totalPaid) || 0;
    const diff = origTotal - paidNum;
    const discountVal = diff > 0.005 ? Math.round(diff * 100) / 100 : 0;

    setState({
      people: newPeople,
      items: newItems,
      totalPaid: preset.totalPaid,
      mode: 'proportional_item',
      extraFees: { deliveryFee: 0, discount: discountVal, coupon: 0, otherFee: 0 },
    });

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.3 },
    });

    showToast(`โหลด "${preset.title}" เรียบร้อย! ✨`);
  };

  const handleReset = () => {
    setState({
      ...DEFAULT_STATE,
      items: [
        { id: 'item-1', price: 0, name: '', quantity: 1, assignedPersonIds: ['person-1'] },
        { id: 'item-2', price: 0, name: '', quantity: 1, assignedPersonIds: ['person-2'] },
      ],
      totalPaid: '',
    });
    showToast('ล้างข้อมูลทั้งหมดแล้ว');
  };

  // Compute live calculation
  const parsedTotalPaid = parseFloat(state.totalPaid) || 0;

  const splitResult = useMemo(() => {
    if (state.mode === 'equal') {
      // In equal split mode: split totalPaid equally among all people
      const numPeople = Math.max(1, state.people.length);
      const targetSatang = Math.round(parsedTotalPaid * 100);
      const floorSatang = Math.floor(targetSatang / numPeople);
      const rem = targetSatang % numPeople;

      const personShares = state.people.map((p, idx) => {
        const satang = floorSatang + (idx < rem ? 1 : 0);
        return {
          personId: p.id,
          personName: p.name,
          items: [],
          totalOriginal: parsedTotalPaid / numPeople,
          totalWeighted: satang / 100,
        };
      });

      return {
        items: state.items.map((it, idx) => ({
          id: it.id,
          name: it.name?.trim() || `รายการที่ ${idx + 1}`,
          originalPrice: (it.price || 0) * (it.quantity || 1),
          quantity: it.quantity || 1,
          unitPrice: it.price || 0,
          weightedPrice: 0,
          rawPrice: 0,
          discountOrExtra: 0,
          assignedPersonIds: it.assignedPersonIds || [],
        })),
        totalFoodOriginal: state.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
        totalPaid: parsedTotalPaid,
        differenceFromOriginal: parsedTotalPaid - state.items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0),
        percentAdjustment: 0,
        isValid: parsedTotalPaid > 0,
        personShares,
        isBalanced: true,
        sumWeighted: parsedTotalPaid,
      };
    }

    // Default & Person mode: use proportional split!
    return calculateProportionalSplit(state.items, parsedTotalPaid, state.people);
  }, [state.items, parsedTotalPaid, state.people, state.mode]);

  const foodSubtotal = useMemo(() => {
    return state.items.reduce((sum, it) => {
      const p = !isNaN(it.price) && it.price > 0 ? it.price : 0;
      const q = Math.max(1, it.quantity || 1);
      return sum + p * q;
    }, 0);
  }, [state.items]);

  const hasNegativePrices = state.items.some((it) => it.price < 0);
  const hasZeroOrMissingPaid = parsedTotalPaid <= 0;
  const hasErrors = hasNegativePrices || hasZeroOrMissingPaid || foodSubtotal === 0;

  let errorMessage: string | undefined;
  if (hasNegativePrices) {
    errorMessage = '⚠️ ห้ามกรอกราคาอาหารติดลบ';
  } else if (hasZeroOrMissingPaid) {
    errorMessage = '⚠️ กรุณาระบุยอดที่จ่ายจริง (Total Paid)';
  } else if (foodSubtotal === 0) {
    errorMessage = '⚠️ กรุณากรอกราคาอาหารอย่างน้อย 1 รายการ';
  }

  const handleManualCalculate = () => {
    if (!hasErrors && splitResult.isValid) {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast('⚡ คำนวณยอดตามสัดส่วนเรียบร้อยแล้ว!');
    } else {
      showToast(errorMessage || 'กรุณาตรวจสอบข้อมูล');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-stone-800 pb-16">
      {/* Maximum container width for clean mobile-first view */}
      <main className="max-w-md mx-auto min-h-screen px-3 sm:px-4 py-2 flex flex-col">
        {/* Header with App Branding and Presets */}
        <Header
          onSelectPreset={handleSelectPreset}
          onReset={handleReset}
        />

        {/* Mode Selector */}
        <ModeSelector
          mode={state.mode}
          onChangeMode={(newMode: SplitMode) => {
            setState((prev) => ({ ...prev, mode: newMode }));
            if (newMode === 'person_assigned') {
              setShowDetails(true);
            }
          }}
        />

        {/* Step 1: People Count */}
        <PeopleInput
          people={state.people}
          onUpdatePeopleCount={handleUpdatePeopleCount}
          onRenamePerson={handleRenamePerson}
        />

        {/* Step 2: Food Items Input */}
        <QuickPriceInput
          items={state.items}
          people={state.people}
          showDetails={showDetails}
          onToggleShowDetails={setShowDetails}
          onUpdateItemPrice={handleUpdateItemPrice}
          onUpdateItemName={handleUpdateItemName}
          onUpdateItemQuantity={handleUpdateItemQuantity}
          onAssignPerson={handleAssignPerson}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onBatchAddPrices={handleBatchAddPrices}
        />

        {/* Step 3: Total Paid Input (Most Prominent) */}
        <TotalInput
          totalPaid={state.totalPaid}
          foodSubtotal={foodSubtotal}
          extraFees={state.extraFees}
          onChangeTotalPaid={handleChangeTotalPaid}
          onChangeExtraFees={handleChangeExtraFees}
          onSetTotalToSubtotal={handleSetTotalToSubtotal}
        />

        {/* Calculate Action Button */}
        <div className="mb-4">
          <button
            type="button"
            id="calculate-btn"
            onClick={handleManualCalculate}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            <span>คำนวณยอดตามสัดส่วน</span>
          </button>
        </div>

        {/* Validation Status Banner */}
        <ValidationBanner
          splitResult={splitResult}
          hasErrors={hasErrors}
          errorMessage={errorMessage}
        />

        {/* Results Section */}
        {splitResult.isValid && (
          <div className="space-y-3.5 animate-fade-in">
            {/* View based on current mode */}
            {state.mode === 'person_assigned' || state.mode === 'equal' ? (
              <PersonSplit
                personShares={splitResult.personShares}
                people={state.people}
                mode={state.mode}
                totalPaid={parsedTotalPaid}
                onAddPerson={handleAddPerson}
                onAssignPerson={handleAssignPerson}
              />
            ) : (
              <CalculationResult
                items={splitResult.items}
                people={state.people}
                totalPaid={parsedTotalPaid}
                onAssignPerson={handleAssignPerson}
                onSwitchToPersonMode={() => setState((prev) => ({ ...prev, mode: 'person_assigned' }))}
              />
            )}

            {/* Bill Summary */}
            <Summary splitResult={splitResult} />

            {/* Quick Copy for LINE / Messenger */}
            <CopyButton
              splitResult={splitResult}
              personShares={splitResult.personShares}
              onTriggerToast={showToast}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-6 pb-4 text-center text-xs text-stone-400">
          <p className="font-medium text-stone-500">
            🍚 SplitMeal • หารค่าอาหารตามสัดส่วน
          </p>
          <p className="text-[11px] mt-1">
            กระจายยอดที่จ่ายจริงตามราคาเดิม • บันทึกข้อมูลอัตโนมัติบนอุปกรณ์ของคุณ
          </p>
        </footer>
      </main>

      {/* Floating Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default App;
