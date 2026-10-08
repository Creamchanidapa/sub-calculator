export interface PresetCase {
  id: string;
  title: string;
  description: string;
  peopleCount: number;
  items: { name: string; price: number; quantity?: number; assignedIndex?: number }[];
  totalPaid: string;
}

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'case-1',
    title: 'ตัวอย่าง 1: 3 รายการ (162.75 ฿)',
    description: '79, 69, 69 บาท (ลดจาก 217 เหลือ 162.75)',
    peopleCount: 3,
    items: [
      { name: 'ข้าวหมูทอด', price: 79, assignedIndex: 0 },
      { name: 'ข้าวกะเพรา', price: 69, assignedIndex: 1 },
      { name: 'ข้าวไก่ย่าง', price: 69, assignedIndex: 2 },
    ],
    totalPaid: '162.75',
  },
  {
    id: 'case-2',
    title: 'ตัวอย่าง 2: 2 รายการ (167 ฿)',
    description: '119, 69 บาท (จ่ายจริง 167)',
    peopleCount: 2,
    items: [
      { name: 'สเต๊กไก่สไปซี่', price: 119, assignedIndex: 0 },
      { name: 'สลัดผักรวม', price: 69, assignedIndex: 1 },
    ],
    totalPaid: '167',
  },
  {
    id: 'case-3',
    title: 'ตัวอย่าง 3: 2 รายการ (117 ฿)',
    description: '65, 60 บาท (จ่ายจริง 117)',
    peopleCount: 2,
    items: [
      { name: 'ข้าวผัดต้มยำ', price: 65, assignedIndex: 0 },
      { name: 'ชานมไข่มุก', price: 60, assignedIndex: 1 },
    ],
    totalPaid: '117',
  },
  {
    id: 'case-4',
    title: 'ตัวอย่าง 4: 4 รายการ (191 ฿)',
    description: '65, 61, 61, 65 บาท (จ่ายจริง 191)',
    peopleCount: 4,
    items: [
      { name: 'ก๋วยเตี๋ยวต้มยำ', price: 65, assignedIndex: 0 },
      { name: 'บะหมี่หมูแดง', price: 61, assignedIndex: 1 },
      { name: 'เส้นเล็กน้ำใส', price: 61, assignedIndex: 2 },
      { name: 'เกี๊ยวน้ำรวมมิตร', price: 65, assignedIndex: 3 },
    ],
    totalPaid: '191',
  },
  {
    id: 'case-5',
    title: 'ตัวอย่าง 5: 3 รายการ (151 ฿)',
    description: '61, 61, 65 บาท (จ่ายจริง 151)',
    peopleCount: 3,
    items: [
      { name: 'ข้าวมันไก่ตอน', price: 61, assignedIndex: 0 },
      { name: 'ข้าวมันไก่ทอด', price: 61, assignedIndex: 1 },
      { name: 'ข้าวมันไก่ผสม', price: 65, assignedIndex: 2 },
    ],
    totalPaid: '151',
  },
];
