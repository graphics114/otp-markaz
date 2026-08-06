import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyExamResult } from "../../Store/slices/examResultSlice";
import { downloadResultPDF } from "../../utils/resultPdf";
import { ChevronDown, ChevronUp, Download, CheckCircle, FileText } from "lucide-react";
import Header from "./Head";

const SubjectResultCard = ({ subjectName, obtainedMarks, maxMarks = 100 }) => {
  if (obtainedMarks === null || obtainedMarks === undefined || obtainedMarks === "") return null;

  const isAbsent = obtainedMarks === null || obtainedMarks === undefined || obtainedMarks === "" || obtainedMarks === "A";
  let passed = false;
  
  if (subjectName === "Attendance") {
    passed = !isAbsent && Number(obtainedMarks) >= 13;
  } else if (["Competition", "Presentation Skill", "Writing Skill", "Reading Skill"].includes(subjectName)) {
    passed = !isAbsent && Number(obtainedMarks) >= 0;
  } else if (["Hifiz", "Hizb"].includes(subjectName)) {
    passed = !isAbsent && Number(obtainedMarks) >= 30;
  } else {
    // Custom subjects (e.g. Uthmaniyya College added subjects): pass mark is 35
    passed = !isAbsent && Number(obtainedMarks) >= 35;
  }
  
  const percentage = isAbsent ? "0.00" : ((Number(obtainedMarks) / maxMarks) * 100).toFixed(2);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          <span className="font-semibold text-gray-800">{subjectName}</span>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-md ${passed ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
          {passed ? "Pass" : "Fail"}
        </span>
      </div>

      <div className="flex justify-between items-center mt-2 px-2">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Obtained</span>
          <span className="text-lg font-bold text-gray-900">{isAbsent ? "A" : obtainedMarks}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Max</span>
          <span className="text-lg font-bold text-gray-900">{maxMarks}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">Percentage</span>
          <span className={`text-lg font-bold ${passed ? "text-green-600" : "text-red-600"}`}>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual result card
const ResultCard = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isBlank = (value) => value === null || value === undefined || value === "";
  
  const hifizBlank = isBlank(result.hifiz_marks);
  const hizbBlank = isBlank(result.hizb_marks);
  const hifizValid = !hifizBlank && Number(result.hifiz_marks) >= 30;
  const hizbValid = !hizbBlank && Number(result.hizb_marks) >= 30;

  const validHifiz = result.hifiz_marks !== null && result.hifiz_marks !== undefined && result.hifiz_marks !== "" && result.hifiz_marks !== 1;
  const validHizb = result.hizb_marks !== null && result.hizb_marks !== undefined && result.hizb_marks !== "" && result.hizb_marks !== 1;

  const memorySubjects = [
    { name: "Hifiz", val: result.hifiz_marks, valid: validHifiz, pass: hifizValid || result.hifiz_marks === 1 },
    { name: "Hizb", val: result.hizb_marks, valid: validHizb, pass: hizbValid || result.hizb_marks === 1 }
  ];

  const academicSubjects = [
    { name: "Competition", val: result.competitions, pass: (result.competitions ?? 0) >= 0 },
    { name: "Presentation Skill", val: result.presentation_skill, pass: (result.presentation_skill ?? 0) >= 0 },
    { name: "Writing Skill", val: result.writing_skill, pass: (result.writing_skill ?? 0) >= 0 },
    { name: "Reading Skill", val: result.reading_skill, pass: (result.reading_skill ?? 0) >= 0 },
    { name: "Attendance", val: result.attendance, pass: (result.attendance ?? 0) >= 13 }
  ];

  const customSubjectsObj = typeof result.custom_subjects === "string"
    ? JSON.parse(result.custom_subjects || "{}")
    : (result.custom_subjects || {});

  const customSubjects = Object.entries(customSubjectsObj)
    .filter(([_, val]) => val !== null && val !== undefined && val !== "")
    .map(([name, val]) => ({
      name,
      val,
      pass: Number(val) >= 35
    }));

  const allApplicableSubjects = [
    ...memorySubjects.filter(s => s.valid),
    ...academicSubjects.filter(s => s.val !== null && s.val !== undefined && s.val !== ""),
    ...customSubjects
  ];

  const isPassed = allApplicableSubjects.length > 0 && allApplicableSubjects.every(s => s.pass);
  const subjectsCount = allApplicableSubjects.length;

  let totalObtained = 0;
  let totalMax = 0;

  if (validHifiz) {
    totalObtained += result.hifiz_marks === 0 ? 0 : Number(result.hifiz_marks);
    totalMax += 100;
  }
  if (validHizb) {
    totalObtained += result.hizb_marks === 0 ? 0 : Number(result.hizb_marks);
    totalMax += 100;
  }

  const additionalFields = [
    { name: "Competitions", val: result.competitions, max: 20 },
    { name: "Presentation Skill", val: result.presentation_skill, max: 20 },
    { name: "Writing Skill", val: result.writing_skill, max: 20 },
    { name: "Reading Skill", val: result.reading_skill, max: 20 },
    { name: "Attendance", val: result.attendance, max: 20 },
  ];

  additionalFields.forEach(f => {
    if (f.val !== null && f.val !== undefined && f.val !== "") {
      totalObtained += Number(f.val);
      totalMax += f.max;
    }
  });

  customSubjects.forEach(s => {
    totalObtained += Number(s.val);
    totalMax += 100;
  });

  const overallPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Header - Always Visible & Clickable */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-secondary/20 px-6 py-4 border-b border-border/50 flex justify-between items-center cursor-pointer hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{result.institution}</h3>
            <p className="text-sm text-muted-foreground">Reg No: <span className="font-mono text-foreground font-medium">{result.reg_number}</span></p>
          </div>
        </div>

        <div className={`hidden sm:block px-4 py-1.5 rounded-full text-xs font-bold border ${isPassed
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-red-100 text-red-700 border-red-200"
          }`}>
          {isPassed ? "PASSED" : "FAILED"}
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 bg-gray-50/50 animate-fade-in-up border-t border-border">

          {/* Overall Performance */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-gray-800" />
              <h4 className="font-bold text-gray-800">Overall Performance</h4>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <span className={`px-3 py-1 text-xs font-bold rounded-md inline-block mb-3 ${isPassed ? "bg-blue-600 text-white" : "bg-red-600 text-white"}`}>
                {isPassed ? "Passed" : "Failed"}
              </span>

              <div className="mb-2">
                <p className="text-sm text-gray-500">{subjectsCount} subjects</p>
              </div>

              <div className="mb-1">
                <span className="text-3xl font-bold text-blue-600">{overallPercentage}%</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{totalObtained} / {totalMax} marks</p>
              </div>
            </div>
          </div>

          {/* Subject-wise Results */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3 ml-1">Subject-wise Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SubjectResultCard subjectName="Hifiz" obtainedMarks={result.hifiz_marks === 1 ? null : result.hifiz_marks} />
              <SubjectResultCard subjectName="Hizb" obtainedMarks={result.hizb_marks === 1 ? null : result.hizb_marks} />
              {customSubjects.map((s, idx) => (
                <SubjectResultCard key={idx} subjectName={s.name} obtainedMarks={s.val} maxMarks={100} />
              ))}
            </div>
          </div>

          {/* Personal and Skill Assessment */}
          <div className="mb-4">
            <h4 className="font-bold text-gray-800 mb-3 ml-1">Personal and Skill Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SubjectResultCard subjectName="Competition" obtainedMarks={result.competitions} maxMarks={20} />
              <SubjectResultCard subjectName="Presentation Skill" obtainedMarks={result.presentation_skill} maxMarks={20} />
              <SubjectResultCard subjectName="Writing Skill" obtainedMarks={result.writing_skill} maxMarks={20} />
              <SubjectResultCard subjectName="Reading Skill" obtainedMarks={result.reading_skill} maxMarks={20} />
              <SubjectResultCard subjectName="Attendance" obtainedMarks={result.attendance} maxMarks={20} />
            </div>
            {result.description && (
               <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                 <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Teacher's Note / Description</p>
                 <p className="text-sm text-gray-700 italic">"{result.description}"</p>
               </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-t border-gray-200 gap-4 mt-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Student Name</p>
              <p className="font-medium text-foreground">{result.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Result Date</p>
              <p className="font-medium text-foreground">{result.exam_date
                ? new Date(result.exam_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                : "N/A"}</p>
            </div>
          </div>

          {/* Download Action */}
          <div className="mt-4 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadResultPDF(result);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95"
            >
              <Download size={18} />
              Download Result PDF
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

const StudentExamResult = () => {
  const dispatch = useDispatch();
  const { loading, results, error } = useSelector((state) => state.exam);

  useEffect(() => {
    dispatch(fetchMyExamResult());
  }, [dispatch]);

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 p-6 mb:pb-0">
        <Header />
        <h1 className="text-2xl font-bold">Exam Result</h1>
        <p className="text-sm text-gray-600 mb-6">View your academic performance</p>
      </div>

      <div className="md:px-4 py-1">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-blue-600 font-medium animate-pulse">Fetching results...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-200 mt-4 shadow-sm">
            <p>Error: {error}</p>
          </div>
        ) : !results || results.length === 0 ? (
          <div className="text-center py-12 bg-secondary/10 rounded-xl border-2 border-dashed border-border mt-4">
            <p className="text-muted-foreground font-medium">No exam results published yet.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-12 animate-fade-in-up">
            {results.map((r, index) => (
              <ResultCard key={index} result={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default StudentExamResult;