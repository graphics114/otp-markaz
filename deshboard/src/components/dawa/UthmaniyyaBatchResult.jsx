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

const INSTITUTION = "Uthmaniyya College of Excellence";

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

  // Custom Subjects state
  const [customSubjectList, setCustomSubjectList] = useState([]);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [customSubjectMarksModal, setCustomSubjectMarksModal] = useState({});

  const fetchSubjects = async () => {
    try {
      const res = await axiosInstance.get("/exam/uthmaniyya-subjects");
      if (res.data?.success) {
        setCustomSubjectList(res.data.subjects || []);
      }
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    try {
      const res = await axiosInstance.post("/exam/uthmaniyya-subjects", {
        name: newSubjectName.trim(),
        pass_mark: 35,
        max_marks: 100
      });
      if (res.data?.success) {
        toast.success(`Subject '${newSubjectName.trim()}' added with pass mark 35`);
        setNewSubjectName("");
        setShowAddSubjectModal(false);
        fetchSubjects();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add subject");
    }
  };

  const handleDeleteSubject = async (subId, subName) => {
    if (!window.confirm(`Are you sure you want to delete the subject '${subName}'?`)) return;
    try {
      const res = await axiosInstance.delete(`/exam/uthmaniyya-subjects/${subId}`);
      if (res.data?.success) {
        toast.success(`Subject '${subName}' deleted successfully`);
        fetchSubjects();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete subject");
    }
  };

  const getCustomSubjectVal = (resultId, subjectName, fallbackCustom) => {
    const statusObj = selectedStatus[resultId];
    if (statusObj?.custom_subjects && statusObj.custom_subjects[subjectName] !== undefined) {
      return statusObj.custom_subjects[subjectName] ?? "";
    }
    const parsedFallback = typeof fallbackCustom === "string"
      ? JSON.parse(fallbackCustom || "{}")
      : (fallbackCustom || {});
    return parsedFallback[subjectName] ?? "";
  };

  const handleCustomSubjectChange = (resultId, subjectName, val) => {
    setSelectedStatus((prev) => {
      const currentItem = prev[resultId] || {};
      const existingResult = results.find(r => r.result_id === resultId);
      const defaultCustom = typeof existingResult?.custom_subjects === "string"
        ? JSON.parse(existingResult.custom_subjects || "{}")
        : (existingResult?.custom_subjects || {});
      
      const currentCustomObj = currentItem.custom_subjects !== undefined
        ? currentItem.custom_subjects
        : defaultCustom;

      return {
        ...prev,
        [resultId]: {
          ...currentItem,
          custom_subjects: {
            ...currentCustomObj,
            [subjectName]: val === "" ? null : Number(val)
          }
        }
      };
    });
  };

  // Auto-compute total from all numeric sub-fields
  const calcTotal = (resultId, result) => {
    const get = (field, fallback) => {
      const s = selectedStatus[resultId]?.[field];
      return Number(s !== undefined ? s : (fallback ?? 0)) || 0;
    };
    let total = (
      get("competitions", result?.competitions) +
      get("presentation_skill", result?.presentation_skill) +
      get("writing_skill", result?.writing_skill) +
      get("reading_skill", result?.reading_skill) +
      get("attendance", result?.attendance)
    );

    const statusObj = selectedStatus[resultId];
    const customObj = statusObj?.custom_subjects !== undefined
      ? statusObj.custom_subjects
      : (typeof result?.custom_subjects === "string"
         ? JSON.parse(result?.custom_subjects || "{}")
         : (result?.custom_subjects || {}));

    if (customObj) {
      Object.values(customObj).forEach(val => {
        if (val !== null && val !== undefined && val !== "" && !isNaN(val)) {
          total += Number(val);
        }
      });
    }
    return total;
  };

  // Modal-level auto total
  let modalTotal = (
    (Number(competitions) || 0) +
    (Number(presentationSkill) || 0) +
    (Number(writingSkill) || 0) +
    (Number(readingSkill) || 0) +
    (Number(attendance) || 0)
  );
  Object.values(customSubjectMarksModal).forEach(val => {
    if (val !== null && val !== undefined && val !== "" && !isNaN(val)) {
      modalTotal += Number(val);
    }
  });

  const getRStatus = (result) => {
    const isAcademicPass = (
      (result.competitions ?? 0) >= 0 &&
      (result.presentation_skill ?? 0) >= 0 &&
      (result.writing_skill ?? 0) >= 0 &&
      (result.reading_skill ?? 0) >= 0
    );
    const isAttendancePass = (result.attendance ?? 0) >= 13;
    
    let customPass = true;
    const statusObj = selectedStatus[result.result_id];
    const customObj = statusObj?.custom_subjects !== undefined
      ? statusObj.custom_subjects
      : (typeof result.custom_subjects === "string"
         ? JSON.parse(result.custom_subjects || "{}")
         : (result.custom_subjects || {}));

    if (customObj) {
      for (const key of Object.keys(customObj)) {
        const val = customObj[key];
        if (val !== null && val !== undefined && val !== "") {
          if (Number(val) < 35) {
            customPass = false;
            break;
          }
        }
      }
    }
    
    return (isAcademicPass && isAttendancePass && customPass) ? "Passed" : "Failed";
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
    const keys = Object.keys(selectedStatus);
    if (keys.length === 0) {
      toast.info("No changes to save");
      return;
    }
    let savedCount = 0;
    keys.forEach((id) => {
      const data = { ...selectedStatus[id] };
      const nullIfEmpty = ["competitions", "presentation_skill", "writing_skill", "reading_skill", "attendance"];
      nullIfEmpty.forEach((f) => { if (data[f] === "") data[f] = null; });
      const currentResult = results.find(r => r.result_id === id);
      data.total_marks = calcTotal(id, currentResult);
      dispatch(updateResult(id, data));
      savedCount++;
    });
    toast.success(`Saved ${savedCount} results successfully`);
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
    setCustomSubjectMarksModal({});
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
        custom_subjects: customSubjectMarksModal,
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

  // Helper for dynamic subject row maps in exports
  const getExportCustomSubjectVal = (r, subName) => {
    const statusObj = selectedStatus[r.result_id];
    const customObj = statusObj?.custom_subjects !== undefined
      ? statusObj.custom_subjects
      : (typeof r.custom_subjects === "string" ? JSON.parse(r.custom_subjects || "{}") : (r.custom_subjects || {}));
    return customObj?.[subName] ?? "";
  };

  // ── PRINT ──
  const handlePrint = () => {
    const win = window.open("", "", "width=1000,height=700");
    const printDate = new Date().toLocaleDateString("en-IN");
    const customHeaders = customSubjectList.map(s => `<th>${s.name}</th>`).join("");

    const rows = filteredResults.map((r, i) => {
      const customCells = customSubjectList.map(s => `<td>${getExportCustomSubjectVal(r, s.name)}</td>`).join("");
      return `
      <tr>
        <td>${i + 1}</td>
        <td>${new Date(r.exam_date).toLocaleString("default", { month: "long" })}</td>
        <td>${r.full_name}</td>
        <td>${r.reg_number}</td>
        ${customCells}
        <td>${r.competitions ?? ""}</td>
        <td>${r.description ?? ""}</td>
        <td>${r.presentation_skill ?? ""}</td>
        <td>${r.writing_skill ?? ""}</td>
        <td>${r.reading_skill ?? ""}</td>
        <td>${r.attendance ?? ""}</td>
        <td>${calcTotal(r.result_id, r)}</td>
        <td>${getRStatus(r).toUpperCase()}</td>
        <td>${r.result_status ?? ""}</td>
      </tr>`;
    }).join("");

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
          ${customHeaders}
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
    const data = filteredResults.map((r, i) => {
      const row = {
        "Sl No": i + 1,
        Month: new Date(r.exam_date).toLocaleString("default", { month: "long" }),
        Name: r.full_name,
        "Reg No": r.reg_number,
      };
      customSubjectList.forEach(s => {
        row[s.name] = getExportCustomSubjectVal(r, s.name);
      });
      return {
        ...row,
        Competitions: r.competitions,
        Description: r.description,
        "Presentation Skill": r.presentation_skill,
        "Writing Skill": r.writing_skill,
        "Reading Skill": r.reading_skill,
        Attendance: r.attendance,
        "Total Marks": calcTotal(r.result_id, r),
        "R Status": getRStatus(r).toUpperCase(),
        "P Status": r.result_status,
      };
    });
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
      
      const headRow = ["#", "Month", "Name", "Reg No", ...customSubjectList.map(s => s.name), "Competition", "Description", "Presentation Skill", "Writing Skill", "Reading Skill", "Attendance", "Total", "R Status", "P Status"];

      autoTable(doc, {
        startY: 32,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [241, 245, 249], textColor: 0 },
        head: [headRow],
        body: filteredResults.map((r, i) => [
          i + 1,
          new Date(r.exam_date).toLocaleString("default", { month: "long" }),
          r.full_name, r.reg_number,
          ...customSubjectList.map(s => getExportCustomSubjectVal(r, s.name)),
          r.competitions ?? "",
          r.description ?? "",
          r.presentation_skill ?? "",
          r.writing_skill ?? "",
          r.reading_skill ?? "",
          r.attendance ?? "",
          calcTotal(r.result_id, r),
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
                {/* <button onClick={handleAutoAttendance} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 whitespace-nowrap"> Auto </button> */}
                {isAdmin && (
                  <button
                    onClick={() => setShowAddSubjectModal(true)}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 whitespace-nowrap font-medium"
                  >
                    + Add Subject
                  </button>
                )}
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
                      {/* DYNAMIC SUBJECT COLUMNS */}
                      {(isAdmin || user?.role === "Dawa") && customSubjectList.map((sub) => (
                        <th key={sub.id} className="py-3 px-3 text-left text-sm whitespace-nowrap font-bold text-purple-900 bg-purple-50">
                          <div className="flex items-center justify-between gap-1">
                            <span>{sub.name} <span className="text-[10px] font-normal text-purple-600">(P:35)</span></span>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteSubject(sub.id, sub.name)}
                                className="text-purple-400 hover:text-red-600 transition ml-1"
                                title={`Delete subject '${sub.name}'`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
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

                        {/* DYNAMIC SUBJECT INPUTS */}
                        {(isAdmin || user?.role === "Dawa") && customSubjectList.map((sub) => (
                          <td key={sub.id} className="py-2 px-3 bg-purple-50/20">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="-"
                              value={getCustomSubjectVal(result.result_id, sub.name, result.custom_subjects)}
                              onChange={(e) => handleCustomSubjectChange(result.result_id, sub.name, e.target.value)}
                              className="w-14 text-center focus:outline-none bg-transparent border-b border-purple-300 font-semibold text-purple-900 text-sm"
                            />
                          </td>
                        ))}

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

      {/* ADD SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-3 text-purple-900">Add Subject — Uthmaniyya College</h2>
            <p className="text-xs text-gray-500 mb-4">
              Pass mark for subjects added via this button is <strong className="text-purple-700 font-bold">35</strong> out of 100. Unentered marks will not be displayed on student cards.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Fiqh, Hadith, Aqeedah..."
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setNewSubjectName("");
                  setShowAddSubjectModal(false);
                }}
                className="px-4 py-2 bg-gray-100 rounded text-sm text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-purple-600 text-white rounded text-sm font-semibold hover:bg-purple-700"
              >
                Save Subject
              </button>
            </div>
          </div>
        </div>
      )}

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

            {/* DYNAMIC SUBJECTS IN MODAL */}
            {customSubjectList.length > 0 && (
              <>
                <hr className="my-3" />
                <p className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-3">Uthmaniyya College Subjects (Pass: 35)</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {customSubjectList.map((sub) => (
                    <div key={sub.id}>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">{sub.name}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Marks (0-100)"
                        value={customSubjectMarksModal[sub.name] ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomSubjectMarksModal(prev => ({
                            ...prev,
                            [sub.name]: val === "" ? null : Number(val)
                          }));
                        }}
                        className="w-full border p-2 rounded text-sm"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

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
