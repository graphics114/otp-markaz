import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyExamResult } from "../../Store/slices/examResultSlice";
import { downloadResultPDF } from "../../utils/resultPdf";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import Header from "./Head";

// Sub-component for individual result card
const ResultCard = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isPassed = result.hifiz_marks >= 30 && result.hizb_marks >= 30;

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
        <div className="p-6 bg-background animate-fade-in-up">
          <div className="flex sm:hidden justify-between items-center mb-6">
            <span className="text-sm font-medium text-muted-foreground mr-2">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isPassed
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
              }`}>
              {isPassed ? "PASSED" : "FAILED"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Marks Card 1 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 flex flex-col items-center">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Hifiz Marks</span>
              {result.hifiz_marks ? (
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                  {result.hifiz_marks}
                </span>
              ) : (
                <span className="text-2xl font-bold text-red-600 mt-2 font-sans">
                  Absent
                </span>
              )}
            </div>

            {/* Marks Card 2 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800 flex flex-col items-center">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">Hizb Marks</span>
              {result.hifiz_marks ? (
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                  {result.hifiz_marks}
                </span>
              ) : (
                <span className="text-2xl font-bold text-red-600 mt-2 font-sans">
                  Absent
                </span>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-t border-border gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Student Name</p>
              <p className="font-medium text-foreground">{result.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Result Status</p>
              <p className="font-medium text-foreground">{result.result_status}</p>
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