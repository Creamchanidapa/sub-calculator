import type { AppState, Person } from '../types/split';

const STORAGE_KEY = 'splitmeal_app_state_v1';

export function createDefaultPeople(count = 2): Person[] {
  const colors = [
    '#F97316', // Orange
    '#059669', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#EAB308', // Amber
    '#14B8A6', // Teal
    '#6366F1', // Indigo
  ];

  return Array.from({ length: Math.max(1, count) }, (_, i) => ({
    id: `person-${i + 1}`,
    name: `คนที่ ${i + 1}`,
    avatarColor: colors[i % colors.length],
  }));
}

export const DEFAULT_STATE: AppState = {
  people: createDefaultPeople(2),
  items: [
    { id: 'item-1', price: 79, name: '', quantity: 1, assignedPersonIds: ['person-1'] },
    { id: 'item-2', price: 69, name: '', quantity: 1, assignedPersonIds: ['person-2'] },
    { id: 'item-3', price: 69, name: '', quantity: 1, assignedPersonIds: ['person-2'] },
  ],
  totalPaid: '162.75',
  mode: 'proportional_item',
  extraFees: {
    deliveryFee: 0,
    discount: 0,
    coupon: 0,
    otherFee: 0,
  },
};

export function loadSavedState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.people) && Array.isArray(parsed.items)) {
      return {
        ...DEFAULT_STATE,
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Failed to parse saved state:', e);
  }
  return DEFAULT_STATE;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function clearSavedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state:', e);
  }
}
