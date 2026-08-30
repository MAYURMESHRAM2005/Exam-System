
import { ArrowLeft, Check, Calendar, Shield, FileText, Plus, Trash2, Loader2, Download, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type React from 'react';
import { apiFetch } from '../services/httpClient';

interface CreateExamProps {
  onBack: () => void;
  examId?: string | null;
}

export function CreateExam({ onBack, examId }: CreateExamProps) {
  const isEditing = !!examId;
  const [loadingExisting, setLoadingExisting] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [examData, setExamData] = useState({
    title: '',
    course: '',
    duration: '60',
    date: '',
    totalMarks: '100',
    passingMarks: '40',
    time: '',
    instructions: '',
    enableProctoring: true,
    enableCamera: true,
    enableMicrophone: true,
    enableScreenShare: false,
    tabSwitchLimit: '3',
    faceDetection: true,
    negativeMarkingEnabled: false,
    negativeMarksPerWrong: '0.25',
    shuffleQuestions: false,
    shuffleOptions: false,
    autoTerminateEnabled: false,
    autoTerminateMaxTabSwitches: '',
    autoTerminateOnFullscreenExit: false,
    autoTerminateOnDevTools: false,
    autoTerminateOnMultipleFaces: false,
    autoTerminateMaxPhoneDetections: '',
    autoTerminateOnCameraDisabled: false,
    autoTerminateOnMicDisabled: false,
  });
  const [questions, setQuestions] = useState<QuestionDraft[]>([]);

  // --- AI Question Generation ---
  const [aiCount, setAiCount] = useState('10');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [aiValidationErrors, setAiValidationErrors] = useState<string[]>([]);
const handleAddQuestion = () => {
  setQuestions([
    ...questions,
    {
      questionText: "",
      type: "mcq",
      options: ["", "", "", ""],
      correctAnswer: "",
      marks: 5,
    },
  ]);
};

// ✅ DELETE QUESTION
const handleDeleteQuestion = (index: number) => {
  const updated = questions.filter((_, i) => i !== index);
  setQuestions(updated);
};

// ✅ UPDATE QUESTION
interface QuestionDraft {
  questionText: string;
  type: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

const defaultOptionsForType = (type: string): string[] => {
  if (type === "mcq" || type === "msq") return ["", "", "", ""];
  if (type === "truefalse") return ["True", "False"];
  return []; // descriptive / coding — no multiple-choice options
};

const handleQuestionChange = (
  index: number,
  field: keyof QuestionDraft,
  value: string | number
) => {
  const updated = questions.map((q, i) => {
    if (i !== index) return q;
    const next = { ...q, [field]: value };

    // Changing the type changes what "options" and "correctAnswer" even
    // mean, so reset them rather than leaving stale, mismatched data.
    if (field === "type") {
      next.options = defaultOptionsForType(String(value));
      next.correctAnswer = String(value) === "truefalse" ? "True" : "";
    }

    return next;
  });
  setQuestions(updated);
};

// ✅ UPDATE OPTIONS
const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
  const updated = [...questions];
  updated[qIndex].options[optIndex] = value;
  setQuestions(updated);
};

// ✅ EDIT MODE: load the existing exam and pre-fill the form
useEffect(() => {
  if (!examId) return;

  const loadExam = async () => {
    setLoadingExisting(true);
    setLoadError(null);

    try {
      const data = await apiFetch(`/exams/${examId}`);

      setExamData({
        title: data.title || '',
        course: data.courseCode || '',
        duration: String(data.duration ?? '60'),
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        totalMarks: String(data.totalMarks ?? '100'),
        passingMarks: String(data.passingMarks ?? '40'),
        time: data.time || '',
        instructions: data.instructions || '',
        enableProctoring: data.proctoring?.enableProctoring ?? true,
        enableCamera: data.proctoring?.enableCamera ?? true,
        enableMicrophone: data.proctoring?.enableMicrophone ?? true,
        enableScreenShare: data.proctoring?.enableScreenShare ?? false,
        tabSwitchLimit: String(data.proctoring?.tabSwitchLimit ?? '3'),
        faceDetection: data.proctoring?.faceDetection ?? true,
        negativeMarkingEnabled: data.negativeMarking?.enabled ?? false,
        negativeMarksPerWrong: String(data.negativeMarking?.marksPerWrong ?? '0.25'),
        shuffleQuestions: data.shuffleQuestions ?? false,
        shuffleOptions: data.shuffleOptions ?? false,
        autoTerminateEnabled: data.autoTerminate?.enabled ?? false,
        autoTerminateMaxTabSwitches: data.autoTerminate?.maxTabSwitches ? String(data.autoTerminate.maxTabSwitches) : '',
        autoTerminateOnFullscreenExit: data.autoTerminate?.onFullscreenExit ?? false,
        autoTerminateOnDevTools: data.autoTerminate?.onDevToolsOpen ?? false,
        autoTerminateOnMultipleFaces: data.autoTerminate?.onMultipleFaces ?? false,
        autoTerminateMaxPhoneDetections: data.autoTerminate?.maxPhoneDetections ? String(data.autoTerminate.maxPhoneDetections) : '',
        autoTerminateOnCameraDisabled: data.autoTerminate?.onCameraDisabled ?? false,
        autoTerminateOnMicDisabled: data.autoTerminate?.onMicrophoneDisabled ?? false,
      });

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Something went wrong while loading this exam.');
    } finally {
      setLoadingExisting(false);
    }
  };

  loadExam();
}, [examId]);



// ✅ CSV IMPORT
interface CsvImportResult {
  successCount: number;
  errorCount: number;
  errors: string[];
  questions: QuestionDraft[];
}

const CSV_HEADERS = ['questionText', 'type', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'marks'];
const VALID_TYPES = ['mcq', 'msq', 'truefalse', 'descriptive', 'coding'];

/** Parse a single CSV line respecting quoted fields */
function parseCsvLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

/** Detect CSV delimiter by checking the header line */
function detectDelimiter(firstLine: string): string {
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  // Pick the delimiter that appears most often
  if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
  if (semicolonCount > commaCount) return ';';
  return ',';
}

/** Parse raw CSV text into rows of trimmed cell values */
function parseCsvText(text: string): string[][] {
  // Strip BOM (Byte Order Mark) that Excel/Windows adds to CSV files
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const nonEmpty = lines.map((l) => l.trim()).filter((l) => l.length > 0);

  if (nonEmpty.length === 0) return [];

  // Auto-detect delimiter from header line
  const delimiter = detectDelimiter(nonEmpty[0]);

  return nonEmpty.map((l) => parseCsvLine(l, delimiter));
}

/** Validate a single row and return a QuestionDraft or an error string */
function validateCsvRow(
  cells: string[],
  rowNum: number,
  headerMap: Record<string, number>
): { question: QuestionDraft | null; error: string | null } {
  const get = (key: string) => {
    // Try exact key, then lowercase version for case-insensitive matching
    let idx = headerMap[key];
    if (idx === undefined) idx = headerMap[key.toLowerCase()];
    return idx !== undefined && idx < cells.length ? cells[idx].trim() : '';
  };

  const questionText = get('questionText');
  const type = (get('type') || 'mcq').toLowerCase().trim();
  const optionA = get('optionA');
  const optionB = get('optionB');
  const optionC = get('optionC');
  const optionD = get('optionD');
  const correctAnswer = get('correctAnswer');
  const marksStr = get('marks');

  if (!questionText) {
    return { question: null, error: `Row ${rowNum}: questionText is empty.` };
  }

  if (!VALID_TYPES.includes(type)) {
    return {
      question: null,
      error: `Row ${rowNum}: invalid type "${type}". Must be one of: ${VALID_TYPES.join(', ')}`,
    };
  }

  const marks = Number(marksStr);
  if (!marksStr || isNaN(marks) || marks <= 0) {
    return { question: null, error: `Row ${rowNum}: marks must be a positive number (got "${marksStr}").` };
  }

  if (type === 'descriptive' || type === 'coding') {
    return {
      question: {
        questionText,
        type,
        options: [],
        correctAnswer: '',
        marks,
      },
      error: null,
    };
  }

  if (type === 'truefalse') {
    const validAnswers = ['true', 'false'];
    const ca = correctAnswer.toLowerCase();
    if (!ca || !validAnswers.includes(ca)) {
      return {
        question: null,
        error: `Row ${rowNum}: correctAnswer for true/false must be "True" or "False" (got "${correctAnswer}").`,
      };
    }
    return {
      question: {
        questionText,
        type,
        options: ['True', 'False'],
        correctAnswer: ca === 'true' ? 'True' : 'False',
        marks,
      },
      error: null,
    };
  }

  // mcq / msq
  const options = [optionA, optionB, optionC, optionD].filter((o) => o.length > 0);
  if (options.length < 2) {
    return {
      question: null,
      error: `Row ${rowNum}: at least 2 options are required (found ${options.length}).`,
    };
  }

  if (!correctAnswer) {
    return { question: null, error: `Row ${rowNum}: correctAnswer is required.` };
  }

  if (type === 'mcq') {
    // Support both full option text ("Router") and letter labels ("C" -> option index 2)
    let resolvedAnswer = correctAnswer;
    if (!options.includes(correctAnswer)) {
      // Try mapping letter label (A/B/C/D) to the corresponding option
      const letterIndex = correctAnswer.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
      if (letterIndex >= 0 && letterIndex < options.length && correctAnswer.length === 1) {
        resolvedAnswer = options[letterIndex];
      } else {
        return {
          question: null,
          error: `Row ${rowNum}: correctAnswer "${correctAnswer}" does not match any option. Use the full option text or a letter (A-${String.fromCharCode(65 + options.length - 1)}).`,
        };
      }
    }
    // Use the resolved answer (full option text)
    return {
      question: {
        questionText,
        type,
        options,
        correctAnswer: resolvedAnswer,
        marks,
      },
      error: null,
    };
  } else if (type === 'msq') {
    const answers = correctAnswer.split(',').map((a) => a.trim()).filter(Boolean);
    // Resolve each answer: support both full text and letter labels
    const resolvedAnswers = answers.map((a) => {
      if (options.includes(a)) return a;
      const idx = a.toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < options.length && a.length === 1) return options[idx];
      return a; // will fail validation below
    });
    const allValid = resolvedAnswers.every((a) => options.includes(a));
    if (!allValid || resolvedAnswers.length === 0) {
      return {
        question: null,
        error: `Row ${rowNum}: correctAnswer for MSQ must be comma-separated options or letters (A-${String.fromCharCode(65 + options.length - 1)}).`,
      };
    }
    // Use resolved answers
    return {
      question: {
        questionText,
        type,
        options,
        correctAnswer: resolvedAnswers.join(','),
        marks,
      },
      error: null,
    };
  }

  // Fallback for any other type (shouldn't reach here with current types)
  return {
    question: {
      questionText,
      type,
      options,
      correctAnswer,
      marks,
    },
    error: null,
  };
}

/** Full CSV import handler */
const [csvImportResult, setCsvImportResult] = useState<CsvImportResult | null>(null);

const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setCsvImportResult(null);

  if (!file.name.toLowerCase().endsWith('.csv')) {
    setCsvImportResult({ successCount: 0, errorCount: 0, errors: ['Please select a .csv file.'], questions: [] });
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const text = event.target?.result as string;
      const rows = parseCsvText(text);

      if (rows.length < 2) {
        setCsvImportResult({ successCount: 0, errorCount: 0, errors: ['CSV file must contain a header row and at least one question row.'], questions: [] });
        return;
      }

      const headerRow = rows[0];
      const rawHeaders = headerRow.map((h) => h.replace(/^\uFEFF/, '').trim());
      const cleanHeaders = rawHeaders.map((h) => h.toLowerCase());

      // Build header map with exact match first, then fuzzy fallback
      const headerMap: Record<string, number> = {};
      cleanHeaders.forEach((h, i) => {
        if (h) headerMap[h] = i;
      });

      // Flexible header matching: maps CSV column names to expected field names
      // Handles truncated headers ("questionT"), extra spaces, etc.
      const HEADER_ALIASES: Record<string, string[]> = {
        'questiontext': ['questiontext', 'question', 'question_text', 'questiontxt', 'questiont'],
        'type': ['type', 'questiontype', 'qtype'],
        'correctanswer': ['correctanswer', 'correct_answer', 'correctans', 'correcta', 'answer', 'correct'],
        'marks': ['marks', 'mark', 'score', 'points'],
        'optiona': ['optiona', 'option_a', 'opta', 'a'],
        'optionb': ['optionb', 'option_b', 'optb', 'b'],
        'optionc': ['optionc', 'option_c', 'optc', 'c'],
        'optiond': ['optiond', 'option_d', 'optd', 'd'],
      };

      // Try to find each required header using aliases
      function findHeaderIndex(targetField: string): number | null {
        const aliases = HEADER_ALIASES[targetField] || [targetField];
        // Exact match first
        for (const alias of aliases) {
          if (alias in headerMap) return headerMap[alias];
        }
        // Fuzzy: find a header that starts with or contains the target
        for (let i = 0; i < cleanHeaders.length; i++) {
          const h = cleanHeaders[i];
          if (!h) continue;
          for (const alias of aliases) {
            if (h.startsWith(alias) || alias.startsWith(h) || h.includes(alias) || alias.includes(h)) {
              return i;
            }
          }
        }
        return null;
      }

      // Map each expected field to a column index
      const resolvedMap: Record<string, number> = {};
      const requiredFields = ['questiontext', 'type', 'correctanswer', 'marks'];
      const missingFields: string[] = [];

      for (const field of requiredFields) {
        const idx = findHeaderIndex(field);
        if (idx !== null) {
          resolvedMap[field] = idx;
        } else {
          missingFields.push(field);
        }
      }

      if (missingFields.length > 0) {
        const detectedHeaders = rawHeaders.join(', ') || '(none)';
        setCsvImportResult({
          successCount: 0,
          errorCount: 0,
          errors: [
            `Could not find columns: ${missingFields.join(', ')}.`,
            `Your headers: ${detectedHeaders}`,
            `Required: questionText, type, correctAnswer, marks`,
          ],
          questions: [],
        });
        return;
      }

      // Use resolvedMap instead of headerMap for row validation
      Object.assign(headerMap, resolvedMap);

      const importedQuestions: QuestionDraft[] = [];
      const errors: string[] = [];
      const dataRows = rows.slice(1);

      dataRows.forEach((cells, idx) => {
        const rowNum = idx + 2; // 1-indexed, +1 for header
        // Skip completely empty rows
        if (cells.every((c) => c === '')) return;

        const result = validateCsvRow(cells, rowNum, headerMap);
        if (result.error) {
          errors.push(result.error);
        } else if (result.question) {
          importedQuestions.push(result.question);
        }
      });

      const importResult: CsvImportResult = {
        successCount: importedQuestions.length,
        errorCount: errors.length,
        errors,
        questions: importedQuestions,
      };

      setCsvImportResult(importResult);

      if (importedQuestions.length > 0) {
        // Replace all questions (including the initial empty one)
        setQuestions(importedQuestions);
      }
    } catch {
      setCsvImportResult({ successCount: 0, errorCount: 0, errors: ['Failed to parse CSV file. Please check the file format.'], questions: [] });
    }
  };

  reader.readAsText(file);
  // Reset the input so the same file can be re-imported
  e.target.value = '';
};

/** Download CSV template */
const handleDownloadTemplate = () => {
  // CSV-escape a cell: wrap in quotes if it contains commas, quotes, or newlines
  const csvCell = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  };

  const header = CSV_HEADERS.join(',');
  const sampleRows = [
    [csvCell('What is React?'), 'mcq', csvCell('Library'), csvCell('Framework'), csvCell('Language'), csvCell('Tool'), csvCell('Library'), '5'].join(','),
    [csvCell('The sky is blue'), 'truefalse', csvCell('True'), csvCell('False'), '', '', csvCell('True'), '3'].join(','),
    [csvCell('Describe OOP principles'), 'descriptive', '', '', '', '', '', '10'].join(','),
    [csvCell('Which are JS frameworks?'), 'msq', csvCell('React'), csvCell('Angular'), csvCell('Django'), csvCell('Vue'), csvCell('React,Angular,Vue'), '8'].join(','),
  ];
  const csvContent = [header, ...sampleRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'exam_questions_template.csv';
  link.click();
  URL.revokeObjectURL(url);
};

// ✅ AI QUESTION GENERATION
const handleAiGenerate = async () => {
  const topic = examData.title.trim();
  if (!topic) {
    setAiError('Please enter an exam title first — it will be used as the topic for AI generation.');
    return;
  }

  const count = parseInt(aiCount, 10);
  if (isNaN(count) || count < 1 || count > 50) {
    setAiError('Number of questions must be between 1 and 50.');
    return;
  }

  setAiGenerating(true);
  setAiError(null);
  setAiSuccess(null);
  setAiValidationErrors([]);

  try {
    const data = await apiFetch('/ai/generate-questions', {
      method: 'POST',
      body: JSON.stringify({
        topic,
        count,
        difficulty: aiDifficulty,
        marksPerQuestion: 5,
      }),
    });

    const generated = data.questions || [];

    if (generated.length === 0) {
      setAiError('AI returned no valid questions. Please try again.');
      return;
    }

    // Preserve existing non-empty questions; append new AI questions
    const existingNonEmpty = questions.filter(
      (q) => q.questionText && q.questionText.trim().length > 0
    );
    const merged = [...existingNonEmpty, ...generated];
    setQuestions(merged);

    setAiSuccess(
      `Successfully generated ${generated.length} question(s)` +
      (generated.length < count
        ? ` (${count - generated.length} were filtered out due to validation issues)`
        : '') +
      (data.validationErrors?.length
        ? ` — ${data.validationErrors.length} row(s) had validation errors.`
        : '')
    );

    if (data.validationErrors?.length) {
      setAiValidationErrors(data.validationErrors);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate questions. Please try again.';
    setAiError(message);
  } finally {
    setAiGenerating(false);
  }
};

  const steps = [
    { id: 1, name: 'Exam Details', icon: FileText },
    { id: 2, name: 'Questions', icon: FileText },
    { id: 3, name: 'Proctoring Rules', icon: Shield },
    { id: 4, name: 'Schedule & Publish', icon: Calendar }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setExamData({ ...examData, [field]: value });
  };
const handlePublish = async () => {
  try {
    // ✅ VALIDATION
    if (!examData.date || !examData.time) {
      alert("Please select date and time");
      return;
    }

    if (!examData.title || !examData.course) {
      alert("Please fill all required fields");
      return;
    }

    const endpoint = isEditing ? `/exams/${examId}` : "/exams/create";
    const method = isEditing ? "PUT" : "POST";

    await apiFetch(endpoint, {
      method,
      body: JSON.stringify({
        title: examData.title,
        courseCode: examData.course,

        // ✅ convert to number
        duration: Number(examData.duration),
        totalMarks: Number(examData.totalMarks),
        passingMarks: Number(examData.passingMarks),

        instructions: examData.instructions,

        // ✅ FIX DATE FORMAT
        // date: new Date(examData.date + "T" + examData.time),
        date: examData.date,
        time: examData.time,
          

        // ✅ FIXED PROCTORING (typo removed)
        proctoring: {
          enableProctoring: examData.enableProctoring,
          enableCamera: examData.enableCamera,
          enableMicrophone: examData.enableMicrophone,
          enableScreenShare: examData.enableScreenShare,
          faceDetection: examData.faceDetection,
          tabSwitchLimit: Number(examData.tabSwitchLimit),
        },

        // ✅ NEGATIVE MARKING
        negativeMarking: {
          enabled: examData.negativeMarkingEnabled,
          marksPerWrong: Number(examData.negativeMarksPerWrong) || 0,
        },

        // ✅ SHUFFLING
        shuffleQuestions: examData.shuffleQuestions,
        shuffleOptions: examData.shuffleOptions,

        // ✅ AUTO-TERMINATE RULES (opt-in per exam)
        autoTerminate: {
          enabled: examData.autoTerminateEnabled,
          maxTabSwitches: examData.autoTerminateMaxTabSwitches ? Number(examData.autoTerminateMaxTabSwitches) : null,
          onFullscreenExit: examData.autoTerminateOnFullscreenExit,
          onDevToolsOpen: examData.autoTerminateOnDevTools,
          onMultipleFaces: examData.autoTerminateOnMultipleFaces,
          maxPhoneDetections: examData.autoTerminateMaxPhoneDetections ? Number(examData.autoTerminateMaxPhoneDetections) : null,
          onCameraDisabled: examData.autoTerminateOnCameraDisabled,
          onMicrophoneDisabled: examData.autoTerminateOnMicDisabled,
        },

        // ✅ SAFE QUESTIONS — filter out any empty/blank questions
        questions: questions?.filter((q) => q.questionText && q.questionText.trim().length > 0) || [],
      }),
    });

    alert(isEditing ? "Exam Updated Successfully 🎉" : "Exam Created Successfully 🎉");
    onBack();

  } catch (error) {
    console.error("Publish Error:", error);
    alert(error instanceof Error ? error.message : (isEditing ? "Exam update failed" : "Exam creation failed"));
  }
};
          
 return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <button className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium">
              Save as Draft
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className="text-slate-600">Set up your exam with AI-powered proctoring</p>
        </div>

        {loadingExisting && (
          <div className="flex items-center justify-center gap-2 text-slate-500 py-12">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading exam details...</span>
          </div>
        )}

        {!loadingExisting && loadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-8">
            {loadError}
          </div>
        )}

        {!loadingExisting && (
        <>
        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between overflow-x-auto hide-scrollbar">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step.id
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                    ) : (
                      <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 hidden sm:block">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-slate-500">Step {step.id}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 sm:mx-4 ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
          {/* Step 1: Exam Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Exam Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      value={examData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Data Structures Midterm"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Course Code *
                    </label>
                    <input
                      type="text"
                      value={examData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      placeholder="e.g., CS301"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      value={examData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      value={examData.totalMarks}
                      onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Passing Marks *
                    </label>
                    <input
                      type="number"
                      value={examData.passingMarks}
                      onChange={(e) => handleInputChange('passingMarks', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-5 border border-slate-200 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer mb-3">
                    <div>
                      <span className="font-medium text-slate-900">Negative Marking</span>
                      <p className="text-sm text-slate-600">
                        Deduct marks for wrong answers on Multiple Choice, Multiple Select, and True/False questions
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={examData.negativeMarkingEnabled}
                      onChange={(e) => handleInputChange('negativeMarkingEnabled', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 flex-shrink-0 ml-4"
                    />
                  </label>

                  {examData.negativeMarkingEnabled && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Marks Deducted Per Wrong Answer
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={examData.negativeMarksPerWrong}
                        onChange={(e) => handleInputChange('negativeMarksPerWrong', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5 border border-slate-200 rounded-lg space-y-4">
                  <div>
                    <span className="font-medium text-slate-900">Randomization</span>
                    <p className="text-sm text-slate-600">
                      Give each student a different, but individually consistent, layout
                    </p>
                  </div>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700">Shuffle question order</span>
                    <input
                      type="checkbox"
                      checked={examData.shuffleQuestions}
                      onChange={(e) => handleInputChange('shuffleQuestions', e.target.checked)}
                      className="w-5 h-5 text-indigo-600"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700">Shuffle answer options</span>
                    <input
                      type="checkbox"
                      checked={examData.shuffleOptions}
                      onChange={(e) => handleInputChange('shuffleOptions', e.target.checked)}
                      className="w-5 h-5 text-indigo-600"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Exam Instructions
                  </label>
                  <textarea
                    value={examData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Enter instructions for students..."
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Add Questions</h2>
                <button onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  <Plus className="w-5 h-5" />
                  Add Question
                </button>
              </div>

  <div className="space-y-4 mb-6">
  {questions.length === 0 && (
    <div className="text-center py-8 text-slate-400">
      <p className="text-sm">No questions yet. Add questions manually, import from CSV, or generate with AI.</p>
    </div>
  )}
  {questions.map((q, index) => (
    <div key={index} className="border border-slate-200 rounded-lg p-5">          <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              Q{index + 1}
            </span>

            <select
              value={q.type}
              onChange={(e) =>
                handleQuestionChange(index, "type", e.target.value)
              }
              className="px-2 sm:px-3 py-1 border border-slate-300 rounded text-xs sm:text-sm min-h-[36px]"
            >
              <option value="mcq">MCQ (single)</option>
              <option value="msq">MSQ (multiple)</option>
              <option value="truefalse">True/False</option>
              <option value="descriptive">Descriptive</option>
              <option value="coding">Coding</option>
            </select>

            <input
              type="number"
              value={q.marks}
              onChange={(e) =>
                handleQuestionChange(index, "marks", e.target.value)
              }
              className="w-16 sm:w-20 px-2 sm:px-3 py-1 border border-slate-300 rounded text-xs sm:text-sm min-h-[36px]"
            />
          </div>

          {/* QUESTION INPUT */}
          <input
            type="text"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(index, "questionText", e.target.value)
            }
            placeholder="Enter your question here..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-3"
          />

          {/* OPTIONS — only meaningful for MCQ / MSQ / True-False */}
          {(q.type === "mcq" || q.type === "msq") && (
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(index, i, e.target.value)
                  }
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              ))}
            </div>
          )}

          {q.type === "truefalse" && (
            <div className="flex gap-3">
              {["True", "False"].map((opt) => (
                <span
                  key={opt}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-slate-50"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}

          {(q.type === "descriptive" || q.type === "coding") && (
            <p className="text-xs text-slate-500 italic">
              No fixed options — this question is graded manually.
            </p>
          )}
        </div>

        {/* DELETE BUTTON SAME STYLE */}
        <button
          onClick={() => handleDeleteQuestion(index)}
          className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* CORRECT ANSWER — only for auto-graded types (MCQ / True-False) */}
      {(q.type === "mcq" || q.type === "truefalse") && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Correct Answer:</label>
          <select
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(index, "correctAnswer", e.target.value)
            }
            className="px-3 py-1 border border-slate-300 rounded text-sm"
          >
            <option value="">Select</option>
            {q.options
              .filter((opt) => opt.trim().length > 0)
              .map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* CORRECT ANSWERS — MSQ allows more than one; stored as a
          comma-joined string (matches backend's normalizeMultiAnswer,
          which compares order-independently). */}
      {q.type === "msq" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-slate-600">Correct Answers:</label>
          <div className="flex flex-wrap gap-3">
            {q.options
              .filter((opt) => opt.trim().length > 0)
              .map((opt, i) => {
                const selected = q.correctAnswer
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean);
                const isChecked = selected.includes(opt);
                return (
                  <label
                    key={i}
                    className="flex items-center gap-1.5 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const next = isChecked
                          ? selected.filter((v) => v !== opt)
                          : [...selected, opt];
                        handleQuestionChange(index, "correctAnswer", next.join(","));
                      }}
                    />
                    {opt}
                  </label>
                );
              })}
          </div>
        </div>
      )}
    </div>
  ))}
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-center cursor-pointer">
  
  <FileText className="w-6 h-6 mx-auto mb-2 text-slate-400" />
  <p className="text-sm font-medium text-slate-600">
    Import Questions from CSV
  </p>

  {/* HIDDEN INPUT */}
  <input
    type="file"
    accept=".csv"
    onChange={handleCsvImport}
    className="hidden"
  />
</label>
                <button
                  onClick={handleAiGenerate}
                  disabled={aiGenerating}
                  className="p-4 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {aiGenerating ? (
                    <Loader2 className="w-6 h-6 mx-auto mb-2 text-indigo-500 animate-spin" />
                  ) : (
                    <svg className="w-6 h-6 mx-auto mb-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  )}
                  <p className="text-sm font-medium text-indigo-600">
                    {aiGenerating ? 'Generating...' : 'Generate Questions with AI'}
                  </p>
                </button>
              </div>

              {/* AI Generation Options */}
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  <span className="font-medium text-indigo-900">AI Question Generation</span>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  Uses the exam title above as the topic. Enter a clear, specific title for best results.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={aiCount}
                      onChange={(e) => setAiCount(e.target.value)}
                      className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-800 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="w-full px-3 py-2 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Generation Results */}
              {aiError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700">{aiError}</span>
                </div>
              )}
              {aiSuccess && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-green-700">{aiSuccess}</span>
                </div>
              )}
              {aiValidationErrors.length > 0 && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm font-medium text-amber-800 mb-1">Validation warnings:</p>
                  <ul className="text-xs text-amber-700 space-y-0.5">
                    {aiValidationErrors.slice(0, 5).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {aiValidationErrors.length > 5 && (
                      <li>... and {aiValidationErrors.length - 5} more</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Download CSV Template */}
              <div className="mt-3">
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Template
                </button>
              </div>

              {/* CSV Import Results */}
              {csvImportResult && (
                <div className="mt-4 p-4 rounded-lg border">
                  {csvImportResult.errorCount > 0 ? (
                    <div className="bg-amber-50 border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">
                          Imported: {csvImportResult.successCount} question(s), {csvImportResult.errorCount} failed
                        </span>
                      </div>
                      <ul className="text-sm text-amber-700 space-y-1 ml-7">
                        {csvImportResult.errors.map((err, i) => (
                          <li key={i}>• {err}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-green-200">
                      <div className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Successfully imported {csvImportResult.successCount} question(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Proctoring Rules */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Proctoring Configuration</h2>
              
              <div className="space-y-6">
                {/* Enable Proctoring */}
                <div className="p-5 border border-slate-200 rounded-lg">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-slate-900">Enable AI Proctoring</p>
                      <p className="text-sm text-slate-600">Monitor students during the exam</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={examData.enableProctoring}
                      onChange={(e) => handleInputChange('enableProctoring', e.target.checked)}
                      className="w-12 h-6 appearance-none bg-slate-300 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform checked:after:translate-x-6"
                    />
                  </label>
                </div>

                {examData.enableProctoring && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 border border-slate-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Camera Required</p>
                              <p className="text-xs text-slate-600">Webcam monitoring</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={examData.enableCamera}
                            onChange={(e) => handleInputChange('enableCamera', e.target.checked)}
                            className="w-5 h-5 text-indigo-600"
                          />
                        </label>
                      </div>

                      <div className="p-5 border border-slate-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Check className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Microphone Access</p>
                              <p className="text-xs text-slate-600">Audio monitoring</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={examData.enableMicrophone}
                            onChange={(e) => handleInputChange('enableMicrophone', e.target.checked)}
                            className="w-5 h-5 text-indigo-600"
                          />
                        </label>
                      </div>

                      <div className="p-5 border border-slate-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Check className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Screen Sharing</p>
                              <p className="text-xs text-slate-600">Share entire screen</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={examData.enableScreenShare}
                            onChange={(e) => handleInputChange('enableScreenShare', e.target.checked)}
                            className="w-5 h-5 text-indigo-600"
                          />
                        </label>
                      </div>

                      <div className="p-5 border border-slate-200 rounded-lg">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Check className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Face Detection</p>
                              <p className="text-xs text-slate-600">AI face recognition</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={examData.faceDetection}
                            onChange={(e) => handleInputChange('faceDetection', e.target.checked)}
                            className="w-5 h-5 text-indigo-600"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-lg">
                      <label className="block mb-3">
                        <span className="font-medium text-slate-900">Tab Switch Limit</span>
                        <p className="text-sm text-slate-600">Maximum allowed tab switches before warning</p>
                      </label>
                      <input
                        type="number"
                        value={examData.tabSwitchLimit}
                        onChange={(e) => handleInputChange('tabSwitchLimit', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                      <label className="flex items-center justify-between cursor-pointer mb-3">
                        <div>
                          <h3 className="font-semibold text-amber-900">Auto-Terminate Rules</h3>
                          <p className="text-xs text-amber-800">
                            Automatically end an attempt (auto-submit + notify both sides) when a rule below is triggered.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={examData.autoTerminateEnabled}
                          onChange={(e) => handleInputChange('autoTerminateEnabled', e.target.checked)}
                          className="w-5 h-5 text-indigo-600 flex-shrink-0 ml-3"
                        />
                      </label>

                      {examData.autoTerminateEnabled && (
                        <div className="space-y-3 pt-2 border-t border-amber-200">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-amber-900">Max tab switches (blank = off)</span>
                            <input
                              type="number"
                              min={1}
                              value={examData.autoTerminateMaxTabSwitches}
                              onChange={(e) => handleInputChange('autoTerminateMaxTabSwitches', e.target.value)}
                              placeholder="Off"
                              className="w-20 px-2 py-1 border border-amber-300 rounded text-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-amber-900">Max phone detections (blank = off)</span>
                            <input
                              type="number"
                              min={1}
                              value={examData.autoTerminateMaxPhoneDetections}
                              onChange={(e) => handleInputChange('autoTerminateMaxPhoneDetections', e.target.value)}
                              placeholder="Off"
                              className="w-20 px-2 py-1 border border-amber-300 rounded text-sm"
                            />
                          </div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examData.autoTerminateOnFullscreenExit}
                              onChange={(e) => handleInputChange('autoTerminateOnFullscreenExit', e.target.checked)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-amber-800">Terminate on fullscreen exit</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examData.autoTerminateOnDevTools}
                              onChange={(e) => handleInputChange('autoTerminateOnDevTools', e.target.checked)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-amber-800">Terminate if developer tools are opened</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examData.autoTerminateOnMultipleFaces}
                              onChange={(e) => handleInputChange('autoTerminateOnMultipleFaces', e.target.checked)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-amber-800">Terminate if multiple faces are detected</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examData.autoTerminateOnCameraDisabled}
                              onChange={(e) => handleInputChange('autoTerminateOnCameraDisabled', e.target.checked)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-amber-800">Terminate if camera is disabled</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={examData.autoTerminateOnMicDisabled}
                              onChange={(e) => handleInputChange('autoTerminateOnMicDisabled', e.target.checked)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm text-amber-800">Terminate if microphone is disabled</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Schedule & Publish */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Schedule & Publish</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Exam Date *
                    </label>
                    <input
                    type="date"
                    value={examData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Start Time * <span className="text-slate-400 font-normal">(IST)</span>
                    </label>
                    <input
                      type="time"
                      value={examData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      All exam times are scheduled in Indian Standard Time (IST), regardless of your device's timezone. Students will see it converted to their own local time.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Exam Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Title:</p>
                      <p className="font-medium text-slate-900">{examData.title || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Course:</p>
                      <p className="font-medium text-slate-900">{examData.course || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Duration:</p>
                      <p className="font-medium text-slate-900">{examData.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Total Marks:</p>
                      <p className="font-medium text-slate-900">{examData.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Proctoring:</p>
                      <p className={`font-medium ${examData.enableProctoring ? 'text-green-600' : 'text-slate-400'}`}>
                        {examData.enableProctoring ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Schedule:</p>
                      <p className="font-medium text-slate-900">
                        {examData.date && examData.time ? `${examData.date} at ${examData.time}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <h3 className="font-semibold text-blue-900 mb-2">Ready to Publish?</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Once published, students will be notified and the exam will appear in their dashboard.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handlePublish}
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                      Publish Now
                    </button>
                    <button className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50">
                      Schedule for Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-lg hover:shadow-xl transition-all">
             {isEditing ? 'Save Changes' : 'Publish Now'}
            </button>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
