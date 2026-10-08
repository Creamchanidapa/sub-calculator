# 🍚 SplitMeal - แอปหารค่าอาหารตามสัดส่วน

**SplitMeal** คือ Web Application สำหรับหารค่าอาหารตามสัดส่วนของยอดจ่ายจริง เหมาะสำหรับกลุ่มเพื่อนหรือเพื่อนร่วมงานที่สั่งอาหารร่วมกัน โดยแต่ละคนสั่งอาหารราคาไม่เท่ากัน ระบบจะกระจายส่วนลด ค่าส่ง และค่าใช้จ่ายสุทธิไปยังแต่ละรายการและแต่ละบุคคลอย่างยุติธรรม พร้อมระบบจัดการเศษสตางค์ (Zero-Drift Rounding) ผลรวมตรงกับยอดจ่ายจริงเป๊ะ 100%

---

## 🌟 ฟีเจอร์หลัก (Features)

- ⚡ **โหมดกรอกเร็ว (Quick Input Mode)**: กรอกเฉพาะตัวเลขราคาอาหารได้ทันที เช่น `[ 79 ] [ 69 ] [ 69 ]` หรือ Paste ทีเดียว เช่น `79 69 69` คำนวณเสร็จภายในไม่เกิน 10–15 วินาที
- 🏷️ **ช่องใส่ส่วนลด & ค่าส่ง (Optional)**: ใส่ส่วนลดได้ทั้งแบบ "บาท (฿)" หรือ "เปอร์เซ็นต์ (%)" และมีช่องค่าส่ง โดยคำนวณยอดสุทธิให้อัตโนมัติ
- 🎯 **การคำนวณสัดส่วนแม่นยำ (Largest Remainder Method)**: จัดการเศษทศนิยม 2 ตำแหน่ง การันตีว่าผลรวมย่อยจะเท่ากับยอด Total Paid พอดี ไม่มีปัญหาเงินขาดหรือเกินแม้แต่ 0.01 บาท
- 👥 **แบ่งตามคน (Person Split)**: สรุปยอดแยกตามบุคคล และสามารถแตะเพื่อเปลี่ยนเจ้าของอาหารได้ง่ายๆ
- ⚖️ **โหมดหารเท่ากัน (Equal Split)**: เฉลี่ยค่าอาหารเท่ากันทุกคน
- 📋 **คัดลอกส่ง LINE / Messenger**: กดปุ่มเดียว คัดลอกสรุปรายการพร้อม Emoji และยอดที่แต่ละคนต้องโอน พร้อมส่งเข้ากลุ่มแชททันที
- 💾 **บันทึกอัตโนมัติ (LocalStorage)**: บันทึกข้อมูลบนอุปกรณ์ของผู้ใช้ ไม่ต้องกลัวข้อมูลหายเมื่อรีเฟรชหน้าเว็บ

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Micro-interactions**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 วิธีติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. Clone repository
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>

# 2. ติดตั้ง Dependencies
npm install

# 3. รัน Dev Server
npm run dev

# 4. Build Production
npm run build
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:5173/`
