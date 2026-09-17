import chapter01 from './questions/chapter01.json';
import chapter02 from './questions/chapter02.json';
import chapter03 from './questions/chapter03.json';
import chapter04 from './questions/chapter04.json';
import chapter05 from './questions/chapter05.json';
import chapter06 from './questions/chapter06.json';

/**
 * Thông tin định danh 6 chương học phần môn OPP
 */
export const CHAPTERS_INFO = [
  { chapter: 1, name: 'Chương 1: Tổng quan & Khái niệm OOP', shortName: 'Chương 1' },
  { chapter: 2, name: 'Chương 2: Lớp và Đối tượng (Class & Object)', shortName: 'Chương 2' },
  { chapter: 3, name: 'Chương 3: Tính đóng gói (Encapsulation)', shortName: 'Chương 3' },
  { chapter: 4, name: 'Chương 4: Tính kế thừa (Inheritance)', shortName: 'Chương 4' },
  { chapter: 5, name: 'Chương 5: Đa hình & Lớp trừu tượng (Polymorphism & Abstraction)', shortName: 'Chương 5' },
  { chapter: 6, name: 'Chương 6: Giao diện & Ngoại lệ (Interface & Exception)', shortName: 'Chương 6' },
];

/**
 * Danh sách câu hỏi theo từng chương
 */
export const chaptersData = [
  { chapter: 1, ...CHAPTERS_INFO[0], questions: chapter01 },
  { chapter: 2, ...CHAPTERS_INFO[1], questions: chapter02 },
  { chapter: 3, ...CHAPTERS_INFO[2], questions: chapter03 },
  { chapter: 4, ...CHAPTERS_INFO[3], questions: chapter04 },
  { chapter: 5, ...CHAPTERS_INFO[4], questions: chapter05 },
  { chapter: 6, ...CHAPTERS_INFO[5], questions: chapter06 },
];

/**
 * Toàn bộ ngân hàng câu hỏi được tổng hợp tự động từ 6 chương.
 * Số lượng câu hỏi hoàn toàn động dựa trên dữ liệu thật của các file JSON.
 */
export const allQuestions = [
  ...chapter01,
  ...chapter02,
  ...chapter03,
  ...chapter04,
  ...chapter05,
  ...chapter06,
];

export default allQuestions;
