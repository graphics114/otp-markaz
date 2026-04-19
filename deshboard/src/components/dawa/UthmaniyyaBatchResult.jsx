import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import { useEffect, useState } from "react";
import {
  fetchAllExamResults,
  updateResult,
  addExamResult,
  fetchAllStudents,
  deleteResult,
} from "../../store/slices/studentsSlice";
import { FolderSearch, Trash2, ArrowLeft, ReplaceAll } from "lucide-react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { axiosInstance } from "../../lib/axios";

const INSTITUTION = "Uthmaniyya College...";

const UthmaniyyaBatchResult = ({ course, onBack }) => {
  const { loading, results, students } = useSelector((state) => state.std);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const isAdmin = user?.role === "Admin";

  const [selectedStatus, setSelectedStatus] = useState({});
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  // Add Result Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [competitions, setCompetitions] = useState("");
  const [description, setDescription] = useState("");
  const [presentationSkill, setPresentationSkill] = useState("");
  const [writingSkill, setWritingSkill] = useState("");
  const [readingSkill, setReadingSkill] = useState("");
  const [attendance, setAttendance] = useState("");

  // Auto-compute total from all numeric sub-fields
  const calcTotal = (resultId, result) => {
    const get = (field, fallback) => {
      const s = selectedStatus[resultId]?.[field];
      return Number(s !== undefined ? s : (fallback ?? 0)) || 0;
    };
    return (
      get("competitions", result?.competitions) +
      get("presentation_skill", result?.presentation_skill) +
      get("writing_skill", result?.writing_skill) +
      get("reading_skill", result?.reading_skill) +
      get("attendance", result?.attendance)
    );
  };

  // Modal-level auto total
  const modalTotal =
    (Number(competitions) || 0) +
    (Number(presentationSkill) || 0) +
    (Number(writingSkill) || 0) +
    (Number(readingSkill) || 0) +
    (Number(attendance) || 0);

  const getRStatus = (result) => {
    const total = calcTotal(result.result_id, result);
    return total >= 35 ? "Passed" : "Failed";
  };

  const isWithinDateRange = (examDate) => {
    if (!selectedMonth) return true;
    if (!examDate) return false;
    const date = new Date(examDate);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return monthStr === selectedMonth;
  };

  const filteredResults = results.filter(
    (r) =>
      r.institution === INSTITUTION &&
      r.joining_batch === course &&
      isWithinDateRange(r.exam_date) &&
      (
        (r.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (r.reg_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (r.result_status?.toLowerCase() || "").includes(search.toLowerCase())
      )
  );

  useEffect(() => {
    dispatch(fetchAllExamResults());
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedMonth]);

  useEffect(() => {
    const newMax = Math.ceil(filteredResults.length / 10) || 1;
    setMaxPage(newMax);
  }, [filteredResults.length]);

  useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [maxPage, page]);

  const handleResultChange = (resultId, field, value) => {
    setSelectedStatus((prev) => ({
      ...prev,
      [resultId]: { ...prev[resultId], [field]: value },
    }));
  };

  const handleSave = (resultId, result) => {
    if (!selectedStatus[resultId]) {
      toast.info("No changes to save");
      return;
    }
    const data = { ...selectedStatus[resultId] };
    const nullIfEmpty = ["competitions", "presentation_skill", "writing_skill", "reading_skill", "attendance"];
    nullIfEmpty.forEach((f) => { if (data[f] === "") data[f] = null; });
    // Always persist the auto-computed total
    data.total_marks = calcTotal(resultId, result);
    dispatch(updateResult(resultId, data));
  };

  const handleToggleAllStatus = async () => {
    if (!filteredResults.length) return;

    const allPublished = filteredResults.every(
      r => (selectedStatus[r.result_id]?.result_status ?? r.result_status) === "Published"
    );
    const nextStatus = allPublished ? "Pending" : "Published";

    const updated = {};
    filteredResults.forEach(r => {
      updated[r.result_id] = {
        ...(selectedStatus[r.result_id] || {}),
        result_status: nextStatus,
      };
    });

    setSelectedStatus(prev => ({ ...prev, ...updated }));

    for (const r of filteredResults) {
      await dispatch(updateResult(r.result_id, { result_status: nextStatus }, false));
    }

    toast.success(`All results marked as ${nextStatus}`);
  };

  const handleDelete = (resultId) => {
    if (window.confirm("Delete this result?")) dispatch(deleteResult(resultId));
  };

  const resetAddForm = () => {
    setSelectedStudent("");
    setExamDate("");
    setCompetitions("");
    setDescription("");
    setPresentationSkill("");
    setWritingSkill("");
    setReadingSkill("");
    setAttendance("");
    setShowAddModal(false);
  };

  const handleAddResult = () => {
    if (!selectedStudent) { toast.error("Please select a student"); return; }
    dispatch(
      addExamResult(selectedStudent, {
        exam_date: examDate,
        total_marks: modalTotal,
        competitions: competitions === "" ? null : (competitions ? Number(competitions) : null),
        description: description === "" ? null : description,
        presentation_skill: presentationSkill === "" ? null : (presentationSkill ? Number(presentationSkill) : null),
        writing_skill: writingSkill === "" ? null : (writingSkill ? Number(writingSkill) : null),
        reading_skill: readingSkill === "" ? null : (readingSkill ? Number(readingSkill) : null),
        attendance: attendance === "" ? null : (attendance ? Number(attendance) : null),
      })
    );
    resetAddForm();
  };

  const handleAutoAttendance = async () => {
    if (!selectedMonth) {
      toast.error("Please select a month first");
      return;
    }
    
    try {
      const parts = selectedMonth.split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const lastDay = new Date(year, month, 0).getDate();
      
      const start_date = `${selectedMonth}-01`;
      const end_date = `${selectedMonth}-${lastDay}`;
      
      const res = await axiosInstance.get("/attendance/report", {
        params: {
          program_id: "all",
          start_date,
          end_date,
          institution: INSTITUTION,
          joining_batch: course
        }
      });
      
      const reportData = res.data.report;
      if (!reportData || reportData.length === 0) {
        toast.warning("No attendance records found for this month");
        return;
      }
      
      const newStatusMap = { ...selectedStatus };
      let updatedCount = 0;
      
      filteredResults.forEach((resItem) => {
        const studentId = resItem.student_id;
        const studentReport = reportData.find(r => r.id === studentId);
        
        if (studentReport && studentReport.total_days > 0) {
          const attendanceMark = Math.round((studentReport.present_days / studentReport.total_days) * 10);
          
          newStatusMap[resItem.result_id] = {
            ...(newStatusMap[resItem.result_id] || {}),
            attendance: attendanceMark
          };
          updatedCount++;
        }
      });
      
      setSelectedStatus(newStatusMap);
      toast.success(`Generated attendance marks for ${updatedCount} students. Don't forget to save!`);
      
    } catch (error) {
      toast.error("Failed to generate attendance marks");
      console.error(error);
    }
  };

  // ── PRINT ──
  const handlePrint = () => {
    const win = window.open("", "", "width=1000,height=700");
    const printDate = new Date().toLocaleDateString("en-IN");
    const rows = filteredResults.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${new Date(r.exam_date).toLocaleString("default", { month: "long" })}</td>
        <td>${r.full_name}</td>
        <td>${r.reg_number}</td>
        <td>${r.competitions ?? ""}</td>
        <td>${r.description ?? ""}</td>
        <td>${r.presentation_skill ?? ""}</td>
        <td>${r.writing_skill ?? ""}</td>
        <td>${r.reading_skill ?? ""}</td>
        <td>${r.attendance ?? ""}</td>
        <td>${r.total_marks ?? ""}</td>
        <td>${getRStatus(r).toUpperCase()}</td>
        <td>${r.result_status ?? ""}</td>
      </tr>`).join("");

    win.document.write(`
      <html><head><title>${INSTITUTION} – ${course}</title>
      <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { font-family: Arial; }
        table { width:100%; border-collapse:collapse; margin-top:16px; }
        th,td { border:1px solid #000; padding:6px; font-size:11px; }
        th { background:#f1f5f9; }
        h2,p { text-align:center; margin:4px 0; }
      </style></head>
      <body>
        <h2>Uthmaniyya College — ${course}</h2>
        <p>Exam Results | Print Date: ${printDate}</p>
        <table><thead><tr>
          <th>#</th><th>Month</th><th>Name</th><th>Reg No</th>
          <th>Competition</th><th>Description</th><th>Presentation Skill</th>
          <th>Writing Skill</th><th>Reading Skill</th><th>Attendance</th>
          <th>Total</th><th>R Status</th><th>P Status</th>
        </tr></thead><tbody>${rows}</tbody></table>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // ── EXCEL ──
  const handleExcel = () => {
    const data = filteredResults.map((r, i) => ({
      "Sl No": i + 1,
      Month: new Date(r.exam_date).toLocaleString("default", { month: "long" }),
      Name: r.full_name,
      "Reg No": r.reg_number,
      Competitions: r.competitions,
      Description: r.description,
      "Presentation Skill": r.presentation_skill,
      "Writing Skill": r.writing_skill,
      "Reading Skill": r.reading_skill,
      Attendance: r.attendance,
      "Total Marks": r.total_marks,
      "R Status": getRStatus(r).toUpperCase(),
      "P Status": r.result_status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, course);
    XLSX.writeFile(wb, `Uthmaniyya-${course}-Results.xlsx`);
  };

  // ── PDF ──
  const handlePDF = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(16); doc.text(`Uthmaniyya College — ${course}`, 14, 18);
      doc.setFontSize(10); doc.text(`Print Date: ${new Date().toLocaleDateString("en-IN")}`, 14, 26);
      autoTable(doc, {
        startY: 32,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [241, 245, 249], textColor: 0 },
        head: [["#", "Month", "Name", "Reg No", "Competition", "Description", "Presentation Skill", "Writing Skill", "Reading Skill", "Attendance", "Total", "R Status", "P Status"]],
        body: filteredResults.map((r, i) => [
          i + 1,
          new Date(r.exam_date).toLocaleString("default", { month: "long" }),
          r.full_name, r.reg_number,
          r.competitions ?? "",
          r.description ?? "",
          r.presentation_skill ?? "",
          r.writing_skill ?? "",
          r.reading_skill ?? "",
          r.attendance ?? "",
          r.total_marks ?? "",
          getRStatus(r).toUpperCase(),
          r.result_status ?? "",
        ]),
      });
      doc.save(`Uthmaniyya-${course}-Results.pdf`);
      toast.success("PDF generated");
    } catch (e) {
      toast.error("Failed to generate PDF");
    }
  };

  const courseStudents = students.filter(
    (s) => s.institution === INSTITUTION && s.joining_batch === course
  );

  return (
    <>
      <div className="relative w-full bg-gray-50 min-h-screen">
        <div className="p-[10px] pl-[10px] md:pl-[17rem] w-full">

          {/* HEADER */}
          <div className="flex-1 px-6 pt-6">
            <Header />
            <button
              onClick={onBack}
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </button>
            <h1 className="text-2xl font-bold mt-2">Uthmaniyya College — {course}</h1>
            <p className="text-sm text-gray-500 mb-4">Mark entry for batch {course}</p>
          </div>

          <div className="sm:p-8 bg-gray-50 p-2">

            {/* CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-6 flex-wrap">
              {/* Search */}
              <div className="relative w-full sm:w-36">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-[34px] border px-3 py-1.5 rounded-lg pl-9 placeholder:text-sm focus:outline-none text-sm"
                />
                <FolderSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Month picker */}
              <div className="flex items-center gap-2">
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full sm:w-36 h-[34px] border px-3 py-1.5 rounded-lg text-sm focus:outline-none bg-white shadow-sm"
                />
                {selectedMonth && (
                  <button onClick={() => setSelectedMonth("")} className="text-xs text-red-500 hover:text-red-700 font-medium">
                    Clear
                  </button>
                )}
              </div>

              <div className="flex gap-1.5 sm:ml-auto flex-wrap">

                {isAdmin && (
                  <button
                    onClick={handleToggleAllStatus}
                    className="px-2 text-black rounded hover:text-blue-800"
                    title="Toggle Publish Status for All"
                  >
                    <ReplaceAll />
                  </button>
                )}

                <button onClick={handlePrint} className="px-3 py-1.5 bg-gray-700 text-white rounded text-sm">Print</button>
                <button onClick={handleExcel} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700">Excel</button>
                <button onClick={handlePDF} className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700">PDF</button>
                <button onClick={handleAutoAttendance} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 whitespace-nowrap">Auto</button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                >
                  + Add Result
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className={`overflow-x-auto rounded-lg ${loading ? "p-10" : filteredResults.length > 0 ? "shadow-lg" : ""}`}>
              {loading ? (
                <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mt-10" />
              ) : filteredResults.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-blue-100 text-gray-700">
                    <tr>
                      <th className="py-3 px-3 text-left text-sm">#</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Month</th>
                      <th className="py-3 px-3 text-left text-sm">Name</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Reg No</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Competition</th>
                      <th className="py-3 px-3 text-left text-sm">Description</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Presentation Skill</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Writing Skill</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Reading Skill</th>
                      <th className="py-3 px-3 text-left text-sm">Attendance</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">Total Marks</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">R Status</th>
                      <th className="py-3 px-3 text-left text-sm whitespace-nowrap">P Status</th>
                      <th className="py-3 px-3 text-left text-sm">Save</th>
                      <th className="py-3 px-3 text-left text-sm">Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.slice((page - 1) * 10, page * 10).map((result, index) => (
                      <tr key={result.result_id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm text-gray-500 font-semibold">{(page - 1) * 10 + index + 1}</td>
                        <td className="py-2 px-3 text-sm whitespace-nowrap">
                          {new Date(result.exam_date).toLocaleString("default", { month: "long" })}
                        </td>
                        <td className="py-2 px-3 text-sm whitespace-nowrap">{result.full_name}</td>
                        <td className="py-2 px-3 text-sm whitespace-nowrap">{result.reg_number}</td>

                        {/* COMPETITIONS */}
                        <td className="py-2 px-3">
                          <input type="number" min="0"
                            value={selectedStatus[result.result_id]?.competitions !== undefined ? selectedStatus[result.result_id].competitions : (result.competitions ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "competitions", e.target.value)}
                            className="w-14 text-center focus:outline-none bg-transparent border-b border-gray-300 text-sm" />
                        </td>

                        {/* DESCRIPTION */}
                        <td className="py-2 px-3">
                          <input type="text"
                            value={selectedStatus[result.result_id]?.description !== undefined ? selectedStatus[result.result_id].description : (result.description ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "description", e.target.value)}
                            className="w-28 focus:outline-none bg-transparent border-b border-gray-200 text-xs" />
                        </td>

                        {/* PRESENTATION */}
                        <td className="py-2 px-3">
                          <input type="number" min="0"
                            value={selectedStatus[result.result_id]?.presentation_skill !== undefined ? selectedStatus[result.result_id].presentation_skill : (result.presentation_skill ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "presentation_skill", e.target.value)}
                            className="w-14 text-center focus:outline-none bg-transparent border-b border-gray-300 text-sm" />
                        </td>

                        {/* WRITING */}
                        <td className="py-2 px-3">
                          <input type="number" min="0"
                            value={selectedStatus[result.result_id]?.writing_skill !== undefined ? selectedStatus[result.result_id].writing_skill : (result.writing_skill ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "writing_skill", e.target.value)}
                            className="w-14 text-center focus:outline-none bg-transparent border-b border-gray-300 text-sm" />
                        </td>

                        {/* READING */}
                        <td className="py-2 px-3">
                          <input type="number" min="0"
                            value={selectedStatus[result.result_id]?.reading_skill !== undefined ? selectedStatus[result.result_id].reading_skill : (result.reading_skill ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "reading_skill", e.target.value)}
                            className="w-14 text-center focus:outline-none bg-transparent border-b border-gray-300 text-sm" />
                        </td>

                        {/* ATTENDANCE */}
                        <td className="py-2 px-3">
                          <input type="number" min="0"
                            value={selectedStatus[result.result_id]?.attendance !== undefined ? selectedStatus[result.result_id].attendance : (result.attendance ?? "")}
                            onChange={(e) => handleResultChange(result.result_id, "attendance", e.target.value)}
                            className="w-14 text-center focus:outline-none bg-transparent border-b border-gray-300 text-sm" />
                        </td>

                        {/* TOTAL MARKS — auto-computed, read-only */}
                        <td className="py-2 px-3">
                          <span className="inline-block w-14 text-center font-black text-blue-700 bg-blue-50 border border-blue-200 rounded px-1 py-0.5 text-sm">
                            {calcTotal(result.result_id, result)}
                          </span>
                        </td>

                        {/* R STATUS */}
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 flex items-center justify-center rounded-full text-xs font-semibold ${
                            getRStatus(result) === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {getRStatus(result)}
                          </span>
                        </td>

                        {/* PUBLISH STATUS */}
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (selectedStatus[result.result_id]?.result_status ?? result.result_status) === "Published"
                              ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {isAdmin ? (
                              <select
                                value={selectedStatus[result.result_id]?.result_status ?? result.result_status}
                                onChange={(e) => handleResultChange(result.result_id, "result_status", e.target.value)}
                                className="bg-transparent focus:outline-none text-xs font-medium"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Published">Published</option>
                              </select>
                            ) : (
                              result.result_status || "Pending"
                            )}
                          </span>
                        </td>

                        {/* SAVE */}
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleSave(result.result_id, result)}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >Save</button>
                        </td>

                        {/* DELETE */}
                        <td className="py-2 px-3">
                          <button onClick={() => handleDelete(result.result_id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg font-semibold">No results found for {course}</p>
                  <p className="text-sm mt-1">Add a result using the button above</p>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {filteredResults.length > 10 && (
              <div className="flex justify-center mt-6 gap-4">
                <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Previous</button>
                <span className="px-4 py-2 text-gray-700">Page {page} / {maxPage}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, maxPage))} disabled={page === maxPage}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD RESULT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add Result — {course}</h2>

            {/* Exam Date */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Exam Date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)}
                className="w-full border p-2 rounded text-sm" />
            </div>

            {/* Student Select */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                disabled={!examDate}
              >
                <option value="">{!examDate ? "Please select Exam Date first" : "Select Student"}</option>
                {courseStudents.filter(s => {
                  if (!examDate) return false;
                  const modalMonth = examDate.substring(0, 7);
                  const hasResult = results.some(r => r.student_id === s.id && r.exam_date && r.exam_date.substring(0, 7) === modalMonth);
                  return !hasResult;
                }).map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name} ({s.reg_number})</option>
                ))}
              </select>
            </div>

            <hr className="my-3" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Additional Fields</p>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Competitions</label>
              <input type="number" placeholder="Competitions Marks" value={competitions}
                onChange={(e) => setCompetitions(e.target.value)}
                className="w-full border p-2 rounded text-sm" />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea placeholder="Description" value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2} className="w-full border p-2 rounded text-sm resize-none" />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Pres Skill</label>
                <input type="number" placeholder="Pres Skill" value={presentationSkill}
                  onChange={(e) => setPresentationSkill(e.target.value)}
                  className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Writ Skill</label>
                <input type="number" placeholder="Writ Skill" value={writingSkill}
                  onChange={(e) => setWritingSkill(e.target.value)}
                  className="w-full border p-2 rounded text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Read Skill</label>
                <input type="number" placeholder="Read Skill" value={readingSkill}
                  onChange={(e) => setReadingSkill(e.target.value)}
                  className="w-full border p-2 rounded text-sm" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Attendance Marks</label>
              <input type="number" placeholder="Attendance" value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full border p-2 rounded text-sm" />
            </div>

            {/* Auto-computed Total */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-4">
              <span className="text-sm font-bold text-gray-600">Total Marks (Auto)</span>
              <span className="text-2xl font-black text-blue-700">{modalTotal}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={resetAddForm} className="px-4 py-2 bg-gray-100 rounded text-sm">Cancel</button>
              <button onClick={handleAddResult} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                Save Result
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UthmaniyyaBatchResult;
