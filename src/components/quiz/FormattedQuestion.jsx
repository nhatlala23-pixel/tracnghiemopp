import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

/**
 * Phân tích nội dung câu hỏi thành 3 phần:
 * 1. prefix: Lời dẫn / câu hỏi đầu bài
 * 2. code: Đoạn mã nguồn (C++, Java, C#)
 * 3. suffix: Câu hỏi phụ sau đoạn mã (nếu có)
 */
export function parseQuestionContent(rawText) {
  if (!rawText) return { prefix: '', code: '', suffix: '', language: 'code' };

  // Phát hiện ngôn ngữ dựa trên từ khóa trong câu
  let language = 'C++';
  if (/ngôn ngữ Java/i.test(rawText) || /System\.out\./.test(rawText) || /\bextends\b/.test(rawText)) {
    language = 'Java';
  } else if (/ngôn ngữ C#/i.test(rawText) || /Console\.Write/.test(rawText)) {
    language = 'C#';
  } else if (/ngôn ngữ C\+\+/i.test(rawText) || /cout\s*<</.test(rawText) || /#include/.test(rawText)) {
    language = 'C++';
  }

  if (!rawText.includes('\n')) {
    return { prefix: rawText, code: '', suffix: '', language };
  }

  const lines = rawText.split('\n');

  // Các từ khóa bắt đầu đoạn mã nguồn
  const codeStartRegex = /^(\d+[\s:]+|)(\/\/|#include|class\b|struct\b|interface\b|public\b|private\b|protected\b|template\b|void\b|int\b|float\b|double\b|char\b|bool\b|const\b|static\b|abstract\b|final\b|enum\b|typedef\b)/i;

  let codeStartIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (codeStartRegex.test(l)) {
      codeStartIdx = i;
      break;
    }
  }

  // Dự phòng nếu dòng bắt đầu bằng dấu ngoặc nhọn hoặc cú pháp code
  if (codeStartIdx === -1) {
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (/[{};]/.test(l) && !l.endsWith('?') && !l.endsWith(':')) {
        codeStartIdx = i;
        break;
      }
    }
  }

  // Nếu không phát hiện thấy code, hiển thị text có xuống dòng
  if (codeStartIdx === -1) {
    return { prefix: rawText, code: '', suffix: '', language };
  }

  // Tìm điểm kết thúc code (lời dẫn câu hỏi phía sau như: "Hỏi: ...", "Khi đó, ...")
  const suffixStartRegex = /^(Hỏi|Khi đó|Nếu|Trong lớp|Trong|Cho|Hãy|Đoạn lệnh sau|Khi thêm lệnh|Lựa chọn nào)/i;
  let codeEndIdx = lines.length;

  for (let i = lines.length - 1; i > codeStartIdx; i--) {
    const l = lines[i].trim();
    if (suffixStartRegex.test(l) && !/[{};]$/.test(l)) {
      codeEndIdx = i;
      break;
    }
  }

  const prefix = lines.slice(0, codeStartIdx).join('\n').trim();
  const code = lines.slice(codeStartIdx, codeEndIdx).join('\n');
  const suffix = lines.slice(codeEndIdx).join('\n').trim();

  return { prefix, code, suffix, language };
}

export const FormattedQuestion = ({ questionText, questionNumber }) => {
  const [copied, setCopied] = useState(false);
  const { prefix, code, suffix, language } = parseQuestionContent(questionText);

  const handleCopyCode = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Nếu không có đoạn code, hiển thị dạng text thông thường
  if (!code) {
    return (
      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
        {questionNumber && (
          <span className="text-blue-600 dark:text-blue-400 font-extrabold mr-2">
            Câu {questionNumber}:
          </span>
        )}
        {questionText}
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Lời dẫn / Câu hỏi phía trên */}
      {prefix && (
        <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
          {questionNumber && (
            <span className="text-blue-600 dark:text-blue-400 font-extrabold mr-2">
              Câu {questionNumber}:
            </span>
          )}
          {prefix}
        </div>
      )}

      {/* Khung hiển thị code riêng biệt và chuyên nghiệp */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 dark:border-slate-800 bg-[#1e293b] dark:bg-[#0f172a] shadow-lg text-slate-100">
        {/* Header thanh công cụ code */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/90 dark:bg-slate-900/90 border-b border-slate-700/60 text-xs text-slate-300 select-none">
          <div className="flex items-center gap-2">
            {/* 3 chấm macOS phong cách IDE */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <span className="flex items-center gap-1 font-semibold text-slate-300 font-mono">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              {language}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Sao chép mã nguồn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-medium">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Sao chép</span>
              </>
            )}
          </button>
        </div>

        {/* Nội dung mã nguồn */}
        <pre className="p-4 sm:p-5 overflow-x-auto text-[13px] sm:text-sm font-mono leading-relaxed whitespace-pre text-emerald-300 dark:text-emerald-300 tab-4 selection:bg-blue-600 selection:text-white">
          <code>{code}</code>
        </pre>
      </div>

      {/* Lời dẫn phụ phía dưới code (nếu có) */}
      {suffix && (
        <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed pt-1">
          {suffix}
        </div>
      )}
    </div>
  );
};

export default FormattedQuestion;
