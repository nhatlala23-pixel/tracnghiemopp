# 🎓 OPP Quiz - Website Ôn Tập & Thi Trắc Nghiệm Lập Trình Hướng Đối Tượng

Website tĩnh ôn tập và thi trắc nghiệm môn **Lập trình hướng đối tượng (OOP)** dành cho sinh viên. Hệ thống hoạt động 100% Client-side, không cần backend, không cần database, lưu trữ tiến trình qua `localStorage`.

---

## 🌟 Tính Năng Nổi Bật

- 📚 **Luyện tập theo từng chương (Practice):** Hỗ trợ ôn luyện độc lập theo từng chương hoặc chọn nhiều chương cùng lúc. Xem đáp án và giải thích ngay khi làm bài.
- ⏱️ **Thi thử trắc nghiệm (Exam):** Tạo đề thi chuẩn 90 câu ngẫu nhiên từ ngân hàng câu hỏi 6 chương, có đếm ngược thời gian và nộp bài tự động.
- 📊 **Thống kê chi tiết (Statistics):** Bảng tổng hợp tiến độ học tập 6 chương, tỷ lệ đúng/sai, số câu đã ôn theo thời gian thực (trực quan hóa bằng biểu đồ Chart.js).
- 🔖 **Ghi chú & Bookmark:** Đánh dấu những câu hỏi hay hoặc câu cần xem lại.
- ❌ **Ôn lại câu làm sai (Wrong Questions):** Tự động lưu các câu làm sai trong bài thi để người dùng luyện tập lại đến khi thành thạo.
- 🌓 **Giao diện Hiện đại:** Hỗ trợ Light / Dark mode, thiết kế chuẩn UI/UX, tương thích hoàn hảo trên cả máy tính và điện thoại di động.

---

## 📖 Ngân Hàng Câu Hỏi (360 Câu Thật)

| Chương | Tên học phần | Số câu thật | Dải mã định danh ID |
| :---: | :--- | :---: | :---: |
| **Chương 1** | Tổng quan & Khái niệm OOP | **10** | `CH1-Q001` → `CH1-Q010` |
| **Chương 2** | Lớp và Đối tượng (Class & Object) | **80** | `CH2-Q001` → `CH2-Q080` |
| **Chương 3** | Tính đóng gói (Encapsulation) | **80** | `CH3-Q001` → `CH3-Q080` |
| **Chương 4** | Tính kế thừa (Inheritance) | **30** | `CH4-Q001` → `CH4-Q030` |
| **Chương 5** | Đa hình & Lớp trừu tượng (Polymorphism & Abstraction) | **80** | `CH5-Q001` → `CH5-Q080` |
| **Chương 6** | Giao diện & Ngoại lệ (Interface & Exception) | **80** | `CH6-Q001` → `CH6-Q080` |
| **TỔNG CỘNG** | **Toàn bộ học phần OOP** | **360 câu** | **Duy nhất tuyệt đối** |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** React 18, Vite
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS, PostCSS
- **Icons:** Lucide React
- **Biểu đồ:** Chart.js, React-ChartJS-2
- **Lưu trữ:** Web LocalStorage API
- **Deployment:** Vercel

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local)

1. **Clone repository:**
   ```bash
   git clone https://github.com/nhatlala23-pixel/tracnghiemopp.git
   cd tracnghiemopp
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```
   Mở trình duyệt tại: `http://localhost:5173`

4. **Kiểm tra tính toàn vẹn ngân hàng câu hỏi:**
   ```bash
   node scripts/verifyBank.js
   ```

5. **Build cho môi trường Production:**
   ```bash
   npm run build
   ```
