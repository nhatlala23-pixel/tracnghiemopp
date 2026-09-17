import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateQuestionBank } from '../src/utils/questionValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const questionsDir = path.join(__dirname, '../src/data/questions');

console.log('=== KIỂM TRA TÍNH TOÀN VẸN NGÂN HÀNG CÂU HỎI (6 CHƯƠNG) ===');

let allQuestions = [];
const chapterNames = {
  1: 'Chương 1: Tổng quan & Khái niệm OOP',
  2: 'Chương 2: Lớp và Đối tượng (Class & Object)',
  3: 'Chương 3: Tính đóng gói (Encapsulation)',
  4: 'Chương 4: Tính kế thừa (Inheritance)',
  5: 'Chương 5: Đa hình & Lớp trừu tượng (Polymorphism & Abstraction)',
  6: 'Chương 6: Giao diện & Ngoại lệ (Interface & Exception)',
};

for (let ch = 1; ch <= 6; ch++) {
  const fileName = `chapter0${ch}.json`;
  const filePath = path.join(questionsDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Thiếu file: ${fileName}`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(content);
    if (!Array.isArray(questions)) {
      console.error(`❌ File ${fileName} không chứa một mảng JSON.`);
      process.exit(1);
    }
    console.log(`- ${chapterNames[ch]} (${fileName}): ${questions.length} câu`);
    allQuestions.push(...questions);
  } catch (e) {
    console.error(`❌ Lỗi phân tích cú pháp ${fileName}: ${e.message}`);
    process.exit(1);
  }
}

console.log(`\nTổng số câu trong 6 chương: ${allQuestions.length} câu`);

// Chạy validator chuẩn
const result = validateQuestionBank(allQuestions);

if (result.isValid) {
  console.log('✅ VALIDATION PASSED: Tất cả câu hỏi đều hợp lệ và tuân thủ schema 100%!');
} else {
  console.error('❌ PHÁT HIỆN CÁC LỖI VALIDATION:');
  result.errors.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}
