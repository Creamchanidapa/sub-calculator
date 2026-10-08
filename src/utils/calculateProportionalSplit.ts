import type { ItemInput, CalculatedItem, Person, PersonShare, SplitResult } from '../types/split';

/**
 * Calculates proportional split of items based on total paid amount.
 * Uses Largest Remainder Method (Hare-Niemeyer) on satangs (cents)
 * to guarantee that the sum of weighted prices equals totalPaid EXACTLY (0 drift).
 * 
 * Formula:
 * weighted_price = (item_price / total_food_price) * total_paid
 */
export function calculateProportionalSplit(
  items: ItemInput[],
  totalPaid: number,
  people: Person[] = []
): SplitResult {
  // Input validation
  const validTotalPaid = Math.max(0, Number(totalPaid) || 0);
  const targetSatangs = Math.round(validTotalPaid * 100);

  // Filter items with valid prices
  const validItems = items.filter(
    (item) => !isNaN(item.price) && item.price > 0
  );

  const totalFoodOriginal = validItems.reduce((acc, item) => {
    const qty = Math.max(1, item.quantity || 1);
    return acc + item.price * qty;
  }, 0);

  if (validItems.length === 0 || validTotalPaid === 0 || totalFoodOriginal === 0) {
    return {
      items: items.map((item, idx) => ({
        id: item.id || `item-${idx}`,
        name: item.name?.trim() || `รายการที่ ${idx + 1}`,
        originalPrice: Math.max(0, (item.price || 0) * (item.quantity || 1)),
        quantity: Math.max(1, item.quantity || 1),
        unitPrice: Math.max(0, item.price || 0),
        weightedPrice: 0,
        rawPrice: 0,
        discountOrExtra: 0,
        assignedPersonIds: item.assignedPersonIds || [],
      })),
      totalFoodOriginal,
      totalPaid: validTotalPaid,
      differenceFromOriginal: validTotalPaid - totalFoodOriginal,
      percentAdjustment: totalFoodOriginal > 0 ? ((validTotalPaid - totalFoodOriginal) / totalFoodOriginal) * 100 : 0,
      isValid: validItems.length > 0 && validTotalPaid > 0,
      validationMessage:
        validItems.length === 0
          ? 'กรุณากรอกราคาอาหารอย่างน้อย 1 รายการ'
          : validTotalPaid === 0
          ? 'กรุณากรอกยอดที่จ่ายจริง (Total Paid)'
          : undefined,
      personShares: [],
      isBalanced: true,
      sumWeighted: 0,
    };
  }

  // 1. Calculate raw proportional shares in satangs
  interface ItemMath {
    index: number;
    item: ItemInput;
    originalPrice: number;
    rawSatang: number;
    floorSatang: number;
    remainder: number;
    finalSatang: number;
  }

  const itemMaths: ItemMath[] = validItems.map((item, idx) => {
    const qty = Math.max(1, item.quantity || 1);
    const originalPrice = item.price * qty;
    // Exact proportional satang
    const rawSatang = (originalPrice / totalFoodOriginal) * targetSatangs;
    const floorSatang = Math.floor(rawSatang);
    const remainder = rawSatang - floorSatang;

    return {
      index: idx,
      item,
      originalPrice,
      rawSatang,
      floorSatang,
      remainder,
      finalSatang: floorSatang,
    };
  });

  // 2. Largest Remainder Method: distribute discrepancy in satangs
  const sumFloorSatang = itemMaths.reduce((sum, im) => sum + im.floorSatang, 0);
  let discrepancy = targetSatangs - sumFloorSatang;

  if (discrepancy > 0) {
    // Sort indices by remainder descending, tie-break by original price descending
    const sortedIndices = [...itemMaths.keys()].sort((a, b) => {
      const diffRem = itemMaths[b].remainder - itemMaths[a].remainder;
      if (Math.abs(diffRem) > 1e-9) return diffRem;
      return itemMaths[b].originalPrice - itemMaths[a].originalPrice;
    });

    for (let i = 0; i < discrepancy; i++) {
      const targetIdx = sortedIndices[i % sortedIndices.length];
      itemMaths[targetIdx].finalSatang += 1;
    }
  } else if (discrepancy < 0) {
    // Rare float precision anomaly: subtract satang from smallest remainder
    const sortedIndices = [...itemMaths.keys()].sort((a, b) => {
      const diffRem = itemMaths[a].remainder - itemMaths[b].remainder;
      if (Math.abs(diffRem) > 1e-9) return diffRem;
      return itemMaths[a].originalPrice - itemMaths[b].originalPrice;
    });

    for (let i = 0; i < Math.abs(discrepancy); i++) {
      const targetIdx = sortedIndices[i % sortedIndices.length];
      if (itemMaths[targetIdx].finalSatang > 0) {
        itemMaths[targetIdx].finalSatang -= 1;
      }
    }
  }

  // 3. Construct calculated items
  const calculatedItems: CalculatedItem[] = validItems.map((item, idx) => {
    const math = itemMaths[idx];
    const qty = Math.max(1, item.quantity || 1);
    const weightedPrice = math.finalSatang / 100;
    const rawPrice = (math.originalPrice / totalFoodOriginal) * validTotalPaid;
    const discountOrExtra = weightedPrice - math.originalPrice;

    return {
      id: item.id || `item-${idx}`,
      name: item.name?.trim() || `รายการที่ ${idx + 1}`,
      originalPrice: math.originalPrice,
      quantity: qty,
      unitPrice: item.price,
      weightedPrice,
      rawPrice,
      discountOrExtra,
      assignedPersonIds:
        item.assignedPersonIds && item.assignedPersonIds.length > 0
          ? item.assignedPersonIds
          : people.length > 0
          ? [people[idx % people.length].id]
          : [],
    };
  });

  const sumWeighted = calculatedItems.reduce((acc, it) => acc + it.weightedPrice, 0);
  const roundedSumWeighted = Math.round(sumWeighted * 100) / 100;
  const isBalanced = Math.abs(roundedSumWeighted - validTotalPaid) < 0.001;

  // 4. Group by Person
  const personShares = calculatePersonShares(calculatedItems, people, targetSatangs);

  return {
    items: calculatedItems,
    totalFoodOriginal,
    totalPaid: validTotalPaid,
    differenceFromOriginal: validTotalPaid - totalFoodOriginal,
    percentAdjustment: totalFoodOriginal > 0 ? ((validTotalPaid - totalFoodOriginal) / totalFoodOriginal) * 100 : 0,
    isValid: true,
    personShares,
    isBalanced,
    sumWeighted: roundedSumWeighted,
  };
}

/**
 * Distributes calculated item prices to assigned people with exact satang conservation.
 */
function calculatePersonShares(
  calculatedItems: CalculatedItem[],
  people: Person[],
  targetSatangs: number
): PersonShare[] {
  if (people.length === 0) return [];

  // Map to hold person satangs
  const personMap = new Map<
    string,
    {
      person: Person;
      items: {
        itemId: string;
        itemName: string;
        originalShare: number;
        weightedShare: number;
        isShared: boolean;
      }[];
      totalOriginalSatang: number;
      totalWeightedSatang: number;
    }
  >();

  people.forEach((p) => {
    personMap.set(p.id, {
      person: p,
      items: [],
      totalOriginalSatang: 0,
      totalWeightedSatang: 0,
    });
  });

  // Assign each item to its people
  calculatedItems.forEach((item) => {
    const assignedIds = item.assignedPersonIds.length > 0
      ? item.assignedPersonIds.filter((id) => personMap.has(id))
      : [people[0].id];

    // Fallback if none matched
    const finalAssignedIds = assignedIds.length > 0 ? assignedIds : [people[0].id];
    const numSharers = finalAssignedIds.length;
    const isShared = numSharers > 1;

    const itemTotalSatang = Math.round(item.weightedPrice * 100);
    const itemOriginalSatang = Math.round(item.originalPrice * 100);

    // Split satangs among sharers using remainder method
    const baseShareSatang = Math.floor(itemTotalSatang / numSharers);
    const remainderSatang = itemTotalSatang % numSharers;

    const baseOrigSatang = Math.floor(itemOriginalSatang / numSharers);
    const remainderOrigSatang = itemOriginalSatang % numSharers;

    finalAssignedIds.forEach((pId, idx) => {
      const pData = personMap.get(pId)!;
      const personItemSatang = baseShareSatang + (idx < remainderSatang ? 1 : 0);
      const personOrigSatang = baseOrigSatang + (idx < remainderOrigSatang ? 1 : 0);

      pData.items.push({
        itemId: item.id,
        itemName: item.name,
        originalShare: personOrigSatang / 100,
        weightedShare: personItemSatang / 100,
        isShared,
      });

      pData.totalOriginalSatang += personOrigSatang;
      pData.totalWeightedSatang += personItemSatang;
    });
  });

  // Check sum of people satangs vs targetSatangs
  const allPeople = Array.from(personMap.values());
  const currentTotalSatang = allPeople.reduce((sum, p) => sum + p.totalWeightedSatang, 0);
  const diffSatang = targetSatangs - currentTotalSatang;

  if (diffSatang !== 0 && allPeople.length > 0) {
    // If there's an unassigned edge case or satang split drift, adjust person with highest share
    const personToAdjust = allPeople.reduce((maxP, p) =>
      p.totalWeightedSatang > maxP.totalWeightedSatang ? p : maxP
    );
    personToAdjust.totalWeightedSatang += diffSatang;
  }

  return allPeople.map((pData) => ({
    personId: pData.person.id,
    personName: pData.person.name,
    items: pData.items,
    totalOriginal: pData.totalOriginalSatang / 100,
    totalWeighted: pData.totalWeightedSatang / 100,
  }));
}
