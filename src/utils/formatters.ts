import type { SplitResult, PersonShare } from '../types/split';

export function formatBaht(amount: number): string {
  if (isNaN(amount)) return '0.00';
  return (Math.round(amount * 100) / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(amount: number): string {
  if (isNaN(amount)) return '0';
  return (Math.round(amount * 100) / 100).toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Builds Thai friendly text message for LINE / Messenger
 */
export function buildShareMessage(
  splitResult: SplitResult,
  personShares: PersonShare[],
  includeItemDetails = true
): string {
  if (!splitResult.isValid) return '';

  const lines: string[] = [];
  lines.push('🍚 ค่าอาหาร (SplitMeal) 🧾');
  lines.push('━━━━━━━━━━━━━━━━━━━━');

  if (personShares.length > 0) {
    personShares.forEach((ps) => {
      lines.push(`👤 ${ps.personName}: ${formatBaht(ps.totalWeighted)} บาท`);
      if (includeItemDetails && ps.items.length > 0) {
        ps.items.forEach((it) => {
          lines.push(`   • ${it.itemName} (${formatBaht(it.weightedShare)} ฿)`);
        });
      }
    });
  } else {
    // Item only breakdown
    splitResult.items.forEach((it) => {
      lines.push(`🍱 ${it.name}: ${formatBaht(it.weightedPrice)} บาท`);
    });
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 ยอดที่จ่ายจริงรวม: ${formatBaht(splitResult.totalPaid)} บาท`);

  if (splitResult.totalFoodOriginal > 0 && Math.abs(splitResult.differenceFromOriginal) > 0.01) {
    const isDiscount = splitResult.differenceFromOriginal < 0;
    const diffAbs = Math.abs(splitResult.differenceFromOriginal);
    const pct = Math.abs(splitResult.percentAdjustment).toFixed(1);
    if (isDiscount) {
      lines.push(`(ราคาเดิม ${formatBaht(splitResult.totalFoodOriginal)} ฿ | ประหยัดไป -${formatBaht(diffAbs)} ฿ หรือลด ${pct}%) 🎉`);
    } else {
      lines.push(`(ค่าอาหาร ${formatBaht(splitResult.totalFoodOriginal)} ฿ + ค่าส่ง/อื่นๆ +${formatBaht(diffAbs)} ฿) 🛵`);
    }
  }

  lines.push('\nขอบคุณค่า 💸 พร้อมโอน PromptPay ได้เลยน้า!');

  return lines.join('\n');
}
