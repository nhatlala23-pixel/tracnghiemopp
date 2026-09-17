import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateQuestionBank } from '../src/utils/questionValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawPath = 'C:\\Users\\PC\\.gemini\\antigravity-ide\\brain\\0a860f6d-5f16-4fc5-b41a-cc5aa434fd44\\scratch\\chapter02_raw.txt';
const answerKeyPath = path.join(__dirname, '../src/data/answerKey.json');
const outputPath = path.join(__dirname, '../src/data/questions/chapter02.json');

const rawText = fs.readFileSync(rawPath, 'utf-8');
const answerKey = JSON.parse(fs.readFileSync(answerKeyPath, 'utf-8')).chapter02;

const blocks = rawText.split(/(?=Câu số \d+:)/g).filter(b => b.trim());

const questions = [];

for (let i = 0; i < blocks.length; i++) {
  const block = blocks[i].trim();
  const matchNum = block.match(/^Câu số (\d+):/);
  if (!matchNum) continue;

  const qNum = parseInt(matchNum[1], 10);
  const content = block.replace(/^Câu số \d+:\s*/, '').trim();

  // Find where options start (A. or A )
  const optionMatch = content.match(/\n(?=[A-E][\.\s])/);
  if (!optionMatch) {
    console.error(`Error matching options for question ${qNum}`);
    continue;
  }

  const qText = content.substring(0, optionMatch.index).trim();
  const optionsText = content.substring(optionMatch.index).trim();

  const optionLines = optionsText.split(/\n(?=[A-E][\.\s])/).map(l => l.trim()).filter(Boolean);
  const options = {};

  optionLines.forEach(line => {
    const optMatch = line.match(/^([A-E])[\.\s]\s*(.*)/s);
    if (optMatch) {
      const letter = optMatch[1];
      const optVal = optMatch[2].trim();
      options[letter] = optVal;
    }
  });

  // Special handling for question 57 if second C was scanned as C
  if (qNum === 57 && !options.D) {
    const lines = optionLines;
    if (lines.length >= 4) {
      options['A'] = lines[0].replace(/^A[\.\s]\s*/, '').trim();
      options['B'] = lines[1].replace(/^B[\.\s]\s*/, '').trim();
      options['C'] = lines[2].replace(/^C[\.\s]\s*/, '').trim();
      options['D'] = lines[3].replace(/^[CD][\.\s]\s*/, '').trim();
    }
  }

  const correctAnswer = answerKey[String(qNum)];

  questions.push({
    id: `CH2-Q${String(qNum).padStart(3, '0')}`,
    chapter: 2,
    questionNumber: qNum,
    question: qText,
    options: {
      A: options.A || '',
      B: options.B || '',
      C: options.C || '',
      D: options.D || ''
    },
    correctAnswer: correctAnswer || 'A',
    explanation: '',
    difficulty: 'medium',
    tags: []
  });
}

console.log(`Parsed ${questions.length} questions for Chapter 2.`);

const val = validateQuestionBank(questions);
if (!val.isValid) {
  console.error('Validation errors:', val.errors);
  process.exit(1);
}

fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf-8');
console.log('Successfully saved Chapter 2 to chapter02.json');
