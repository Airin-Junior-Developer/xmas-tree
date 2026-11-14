# 🎄 Happy Christmas 2026 - 3D ASCII Christmas Tree

โปรแกรมวาดต้นคริสต์มาสแบบ 3D ASCII Art พร้อมเอฟเฟกต์แสงนีออน หิมะตก เสียงเพลง Last Christmas และฟีเจอร์ซานต้าขี่เลื่อนจู่โจมข้ามจอ!  
สร้างขึ้นตามคลิปวิดีโอ Instagram ของ **JooJhome** ([Instagram Reel](https://www.instagram.com/reel/DfrKxQOTGrc/)) ที่ไวรัลในแฮชแท็ก `#ascii #asciiart #javascript #creativecoding`

---

## 🌟 ฟีเจอร์เด่นในโปรแกรม (Features)

1. **3D ASCII Christmas Tree Renderer**:
   - ต้นคริสต์มาส 3D หมุนวนได้แบบ Real-time ด้วยสมการคณิตศาสตร์เชิงมุม (`Math.sin`, `Math.cos`)
   - กิ่งสนหลายชั้นไล่ระดับความลึกและเฉดสีเขียวสดใส
   - ริบบิ้นสายรุ้ง (Garland) สีทองพันรอบต้นไม้พร้อมไฟกระพริบวิบวับ
   - ลูกบอลประดับต้นคริสต์มาส (Ornaments) สีทับทิม, ทอง, ไซแอน, ชมพู ที่เปล่งแสงเรืองรอง (Neon Bloom)
   - ดาวทองเปล่งประกาย (Radiant Golden Star) บนยอดต้นไม้ พร้อมสะเก็ดดาวระยิบระยับ
   - กล่องของขวัญผูกโบว์ [🎁], [🎀] วางเรียงรายใต้ต้นไม้

2. **หน้าต่างพิมพ์โค้ดสด (Live Code Typing Box - "พิมพ์โค้ด")**:
   - แผงกระจกมุมซ้ายล่างจำลองการพิมพ์โค้ด JavaScript แบบสดๆ ทีละบรรทัด พร้อม Syntax Highlighting
   - ย่อ-ขยายหน้าต่าง หรือเปิด/ปิดได้ตามต้องการ

3. **โหมด "จู่โจมขี่เลื่อน" (Santa Sleigh Flight Attack)**:
   - ซานต้าพร้อมกวางเรนเดียร์นำโดยรูดอล์ฟจมูกแดง บินโฉบผ่านท้องฟ้าเหนือต้นคริสต์มาส
   - ปล่อยกล่องของขวัญ 🎁 ทิ้งร่มชูชีพร่วงลงมาสู่พื้นดิน
   - **อัปโหลดรูปหน้าคุณเอง**: สามารถเปลี่ยนใบหน้าของซานต้าบนเลื่อนให้เป็นรูปหน้าคุณหรือเพื่อนได้!

4. **"ใส่ชื่อตัวเองตอนจบ" (Personalized Holiday Greeting Card)**:
   - มีปุ่ม **"✍️ ใส่ชื่อตัวเอง"** เพื่อพิมพ์ชื่อของคุณ เช่น `Airin`
   - สร้างการ์ดอวยพรอักษร ASCII ตัวใหญ่ยักษ์ พร้อมข้อความอวยพรส่งท้ายปีเก่าต้อนรับปีใหม่

5. **เสียงดนตรีเทศกาล (Wham! - Last Christmas)**:
   - จำลองเสียง Synth / Chime ท่วงทำนองเพลงฮิต "Last Christmas" ด้วย Web Audio API แท้ 100% เล่นได้ทันทีโดยไม่ต้องโหลดไฟล์เสียงภายนอก

6. **รองรับทั้ง 2 รูปแบบ**:
   - 🌐 **Web Version (`index.html`)**: กราฟิกสวยงามแบบ Canvas + Bloom Effect เต็มจอ
   - 💻 **Terminal CLI Version (`tree.js`)**: รันในหน้าต่าง Terminal/Command Prompt ได้ทันทีด้วย ANSI Truecolor 256 สี

---

## 🚀 วิธีเปิดใช้งาน (How to Run)

### 1. เปิดเวอร์ชันหน้าเว็บ (Web Interactive Version)

คุณสามารถเปิดไฟล์ `index.html` ได้โดยตรง หรือรัน Local Server:

```bash
cd ~/Desktop/xmas-tree

# วิธีที่ 1: ดับเบิ้ลคลิกเปิดไฟล์ index.html ใน Finder หรือเปิดผ่านเบราว์เซอร์
open index.html

# หรือวิธีที่ 2: รันผ่าน Local Web Server
npm run web
# จากนั้นเปิดเบราว์เซอร์ไปที่ http://localhost:8080
```

### 2. รันเวอร์ชัน Terminal (CLI Version)

หากต้องการรันต้นคริสต์มาสแบบหมุนได้ในหน้าจอ Terminal ของ macOS:

```bash
cd ~/Desktop/xmas-tree

# รันด้วยคำสั่ง
node tree.js

# หรือ
npm start
```

#### ปุ่มควบคุมใน Terminal:
- `S` : ปล่อยซานต้าบินจู่โจมขี่เลื่อนข้ามหน้าจอ
- `N` : เปลี่ยนชื่อของคุณในการ์ดอวยพร
- `Q` หรือ `Ctrl+C` : ออกจากโปรแกรม

---

## 📁 โครงสร้างไฟล์ในโฟลเดอร์

```
xmas-tree/
├── index.html     # หน้าเว็บหลักพร้อม Canvas 3D ASCII และ UI
├── style.css      # ธีมกลางคืน Glassmorphism และ Neon Glow
├── script.js      # ตัวคำนวณ 3D Math, หิมะตก, ซานต้า, เสียงเพลงสังเคราะห์ Web Audio
├── tree.js        # ตัวรันใน Terminal ด้วย ANSI Colors
├── package.json   # สคริปต์คำสั่ง start / web
└── README.md      # คู่มือการใช้งานภาษาไทย
```
