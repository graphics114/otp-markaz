import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import { useEffect, useState } from "react";
import { fetchAllExamResults, updateResult, addExamResult, fetchAllStudents, deleteResult } from "../../store/slices/studentsSlice";
import { hifizDashboardStats } from "../../store/slices/deshboarSlice";
import { FolderSearch, ReplaceAll, Users, GraduationCap, FileText, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Hifiz = () => {

  const { loading, results, students } = useSelector((state) => state.std);

  const [selectedStatus, setSelectedStatus] = useState({});

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hifiz, setHifiz] = useState("");
  const [hizb, setHizb] = useState("");

  useEffect(() => {
    dispatch(fetchAllExamResults());
    dispatch(fetchAllStudents());
    dispatch(hifizDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [search, fromDate, toDate]);

  const isWithinDateRange = (examDate) => {
    if (!examDate) return true;
    const date = new Date(examDate).setHours(0, 0, 0, 0);
    const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

    if (from && date < from) return false;
    if (to && date > to) return false;
    return true;
  };

  useEffect(() => {
    const filtered = results.filter(result =>
      result.institution === "Hifzul Quran College" &&
      isWithinDateRange(result.exam_date) &&
      (
        (result.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.reg_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.joining_batch?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.result_status?.toLowerCase() || "").includes(search.toLowerCase()) ||
        getRStatus(result).includes(search.toLowerCase())
      )
    );
    const newMax = Math.ceil(filtered.length / 10);
    setMaxPage(newMax || 1);
  }, [results, search, fromDate, toDate]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage)
    }
  }, [maxPage, page]);

  const handleResultChange = (resultId, field, value) => {
    setSelectedStatus(prev => ({
      ...prev,
      [resultId]: {
        ...prev[resultId],
        [field]: value
      }
    }));
  };

  const handleSave = (resultId) => {
    if (!selectedStatus[resultId]) {
      toast.info("No changes to save");
      return;
    }

    const dataToSave = { ...selectedStatus[resultId] };
    if (dataToSave.hifiz_marks === "") dataToSave.hifiz_marks = null;
    if (dataToSave.hizb_marks === "") dataToSave.hizb_marks = null;

    dispatch(updateResult(resultId, dataToSave));
  };

  const getRStatus = (result) => {
    const hifiz = result.hifiz_marks ?? 0;
    const hizb = result.hizb_marks ?? 0;

    return hifiz >= 30 && hizb >= 30 ? "passed" : "failed";
  };

  // PRINT
  const handlePrint = () => {
    const filteredResults = results.filter(result =>
      result.institution === "Hifzul Quran College" &&
      isWithinDateRange(result.exam_date) &&
      (
        (result.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.reg_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.joining_batch?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (result.result_status?.toLowerCase() || "").includes(search.toLowerCase()) ||
        getRStatus(result).includes(search.toLowerCase())
      )
    );

    const printDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const win = window.open("", "", "width=900,height=650");

    const tableRows = filteredResults.map((result, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${new Date(result.exam_date).toLocaleString("default", { month: "long" })}</td>
        <td>${result.full_name}</td>
        <td>${result.joining_batch}</td>
        <td>${result.reg_number}</td>
        <td>${result.hifiz_marks}</td>
        <td>${result.hizb_marks}</td>
        <td>${(result.hifiz_marks || 0) + (result.hizb_marks || 0)}</td>
        <td>${getRStatus(result).toUpperCase()}</td>
      </tr>
    `).join("");

    win.document.write(`
        <html>
          <head>
            <title>Hifiz College Exam Result</title>
            <style>
              @page { size: A4 landscape; margin: 10mm; }
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
                font-size: 12px;
              }
              th { background: #f1f5f9; }
              h2 { text-align: center; margin-bottom: 5px; }
              p { text-align: center; margin-top: 0; }
            </style>
          </head>
          <body>
            <h2>Hifzul Quran College</h2>
            <p>Exam Results Report</p>
            <p style="text-align: right; font-size: 10px;">Print Date: ${printDate}</p>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Month</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Reg No</th>
                  <th>Hifiz</th>
                  <th>Hizb</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </body>
        </html>
      `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // EXCEL EXPORT
  const handleExcel = () => {

    const excelData = results
      .filter((r) => r.institution === "Hifzul Quran College" && isWithinDateRange(r.exam_date))
      .map((r, index) => ({
        "Sl No": index + 1,
        "Month": new Date(r.exam_date).toLocaleString("default", { month: "long" }),
        "Name": r.full_name,
        "Reg No": r.reg_number,
        "Course": r.joining_batch,
        "Hifiz": r.hifiz_marks,
        "Hizb": r.hizb_marks,
        "Total": (r.hifiz_marks || 0) + (r.hizb_marks || 0),
        "Result": getRStatus(r).toUpperCase(),
      }));


    // Excel sheet create ചെയ്യുന്നു
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // File download
    XLSX.writeFile(workbook, "Hifiz-Collage-Exam-Result.xlsx");
  };

  // PDF EXPORT
  const handlePDF = () => {
    try {
      const doc = new jsPDF();

      const filteredResults = results.filter(result =>
        result.institution === "Hifzul Quran College" &&
        isWithinDateRange(result.exam_date) &&
        (
          (result.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (result.reg_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (result.joining_batch?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (result.result_status?.toLowerCase() || "").includes(search.toLowerCase()) ||
          getRStatus(result).includes(search.toLowerCase())
        )
      );

      const tableColumn = ["#", "Month", "Name", "Course", "Reg No", "Hifiz", "Hizb", "Total", "Status"];
      const tableRows = filteredResults.map((result, index) => [
        index + 1,
        new Date(result.exam_date).toLocaleString("default", { month: "long" }),
        result.full_name,
        result.joining_batch,
        result.reg_number,
        result.hifiz_marks,
        result.hizb_marks,
        (result.hifiz_marks || 0) + (result.hizb_marks || 0),
        getRStatus(result).toUpperCase()
      ]);

      doc.setFontSize(18);
      doc.text("Hifzul Quran College", 14, 22);
      doc.setFontSize(12);
      doc.text("Exam Results Report", 14, 30);
      doc.setFontSize(10);
      doc.text(`Print Date: ${new Date().toLocaleDateString("en-IN")}`, 14, 38);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [241, 245, 249], textColor: 0 },
      });

      doc.save("Hifiz-College-Results.pdf");
      toast.success("PDF generated successfully");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);

    const collegeResults = results.filter(
      r => r.institution === "Hifzul Quran College"
    );

    if (collegeResults.length === 0) {
      setIsResetting(false);
      setShowConfirm(false);
      return;
    }

    // UI update first
    const updated = {};
    collegeResults.forEach(r => {
      updated[r.result_id] = {
        ...(selectedStatus[r.result_id] || {}),
        hifiz_marks: 0,
        hizb_marks: 0,
      };
    });

    setSelectedStatus(prev => ({ ...prev, ...updated }));

    // Backend update (silent)
    for (const r of collegeResults) {
      await dispatch(
        updateResult(r.result_id, { hifiz_marks: 0, hizb_marks: 0 }, false)
      );
    }

    setIsResetting(false);
    setShowConfirm(false);

    toast.success("All marks reset successfully");
  };

  const handleAddResult = () => {
    if (!selectedStudent) {
      toast.error("Please select student");
      return;
    }

    dispatch(
      addExamResult(selectedStudent, {
        exam_date: examDate,
        hifiz_marks: hifiz === "" ? null : (hifiz ? Number(hifiz) : null),
        hizb_marks: hizb === "" ? null : (hizb ? Number(hizb) : null),
      })
    );

    // reset
    setSelectedStudent("");
    setSelectedCourse("");
    setExamDate("");
    setHifiz("");
    setHizb("");
    setShowAddModal(false);
  };

  const handleDeleteResult = (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      dispatch(deleteResult(resultId));
    }
  };


  return (<>
    <div className="relative w-full bg-gray-50 min-h-screen">
      <div className="p-[10px] pl-[10px] md:pl-[17rem] w-full">

        {/* HEADER */}
        <div className="flex-1 px-6 pt-6">
          <Header />
          <h1 className="text-2xl font-bold">Hifzul Quran College</h1>
          <p className="text-sm text-gray-600 mb-6">Manage all Results</p>
        </div>

        <div className=" sm:p-8 bg-gray-50 min-h-full p-2">

          {/* HEADER SIDE */}
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-6">
            {/* SEARCH */}
            <div className="relative w-full sm:w-40">
              <input type="text" placeholder="Search by name, reg number, course or status..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full border px-4 py-1.5 rounded-lg pl-10
                                   placeholder:text-sm focus:outline-none" />
              <FolderSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                               text-gray-400 w-5 h-5"/>
            </div>

            {/* DATE RANGE */}
            <div className="flex items-center gap-2 w-full sm:w-96">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border px-2 py-2 rounded-lg text-sm focus:outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border px-2 py-2 rounded-lg text-sm focus:outline-none"
              />
              {(fromDate || toDate) && (
                <button
                  onClick={() => { setFromDate(""); setToDate(""); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex gap-2 sm:ml-auto">

              {/* PRINT */}
              <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded">
                Print
              </button>

              {/* EXCEL */}
              <button
                onClick={handleExcel}
                className="px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Excel
              </button>

              {/* PDF */}
              <button
                onClick={handlePDF}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                PDF
              </button>

              {/* ADD RESULT */}
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
              >
                + Add Result
              </button>

            </div>
          </div>

          {/* STUDENTS */}
          <div className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${results && results.length > 0 && "shadow-lg"}`
            }`}>
            {loading ? (
              <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent 
                            rounded-full animate-spin" />
            ) : results && results.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 print:table-auto">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap">Month</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap">Course</th>
                    <th className="py-3 px-4 text-left">Reg No</th>
                    <th className="py-3 px-4 text-left">Hifiz</th>
                    <th className="py-3 px-4 text-left">Hizb</th>
                    <th className="py-3 px-4 text-left">Total</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap">R Status</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap actions-col">P Status</th>
                    <th className="py-3 px-4 text-left actions-col">Update</th>
                    <th className="py-3 px-4 text-left actions-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .filter(result =>
                      result.institution === "Hifzul Quran College" &&
                      isWithinDateRange(result.exam_date) &&
                      (
                        (result.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
                        (result.reg_number?.toLowerCase() || "").includes(search.toLowerCase()) ||
                        (result.joining_batch?.toLowerCase() || "").includes(search.toLowerCase()) ||
                        (result.result_status?.toLowerCase() || "").includes(search.toLowerCase()) ||
                        getRStatus(result).includes(search.toLowerCase())
                      )
                    )
                    .slice((page - 1) * 10, page * 10)
                    .map((result, index) => {
                      return (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-600">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {new Date(result.exam_date).toLocaleString("default", { month: "long" })}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.full_name}</td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.joining_batch}</td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.reg_number}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={selectedStatus[result.result_id]?.hifiz_marks !== undefined ? selectedStatus[result.result_id].hifiz_marks : (result.hifiz_marks ?? "")}
                              onChange={(e) =>
                                handleResultChange(result.result_id, "hifiz_marks", e.target.value)
                              }
                              className="text-center w-10 focus:outline-none 
                                                    bg-transparent"/>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={selectedStatus[result.result_id]?.hizb_marks !== undefined ? selectedStatus[result.result_id].hizb_marks : (result.hizb_marks ?? "")}
                              onChange={(e) =>
                                handleResultChange(result.result_id, "hizb_marks", e.target.value)
                              }
                              className="text-center w-10 focus:outline-none 
                                                    bg-transparent" />
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-700">
                            {(() => {
                              const hifiz = Number(selectedStatus[result.result_id]?.hifiz_marks ?? (result.hifiz_marks || 0));
                              const hizb = Number(selectedStatus[result.result_id]?.hizb_marks ?? (result.hizb_marks || 0));
                              return hifiz + hizb;
                            })()}
                          </td>
                          <td className="py-3 px-4">
                            {(() => {
                              const hifiz =
                                selectedStatus[result.result_id]?.hifiz_marks ?? result.hifiz_marks;

                              const hizb =
                                selectedStatus[result.result_id]?.hizb_marks ?? result.hizb_marks;

                              const isBlank = (value) => value === null || value === undefined || value === "";
                              const hifizBlank = isBlank(hifiz);
                              const hizbBlank = isBlank(hizb);
                              const hifizValid = !hifizBlank && Number(hifiz) >= 30;
                              const hizbValid = !hizbBlank && Number(hizb) >= 30;
                              
                              const isPassed = hifiz === 1 || hizb === 1 ||
                                  (hifizValid && hizbValid) ||
                                  (hifizBlank && hizbValid) ||
                                  (hizbBlank && hifizValid);

                              return (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold
                                                      ${isPassed
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                    }`}
                                >
                                  {isPassed ? "Passed" : "Failed"}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="py-3 px-4 actions-col">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium focus:outline-none
                                                  ${(selectedStatus[result.result_id]?.result_status ?? result.result_status) === "Published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                              {result.result_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 actions-col">
                            <button
                              onClick={() => handleSave(result.result_id)}
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              Save
                            </button>
                          </td>
                          <td className="py-3 px-4 actions-col">
                            <button
                              onClick={() => handleDeleteResult(result.result_id)}
                              className="text-red-500 hover:text-red-700 transition"
                              title="Delete Result"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            ) : (
              <h3 className="text-2xl p-6 font-bold">No Students Found!</h3>
            )}
          </div>

          {/* PAGNATION */}
          {!loading && results && results.length > 0 && (
            <div className="flex justify-center mt-6 gap-4">
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                            rounded disabled:opacity-50">
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">Page {page}</span>
              <button onClick={() => setPage((prev) => Math.min(prev + 1, maxPage))} disabled={maxPage === page}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                            rounded disabled:opacity-50">
                Next
              </button>
            </div>
          )}

          {/* RESET RESULT */}
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

                <h2 className="text-lg font-semibold text-gray-800">
                  Confirm Reset
                </h2>

                <p className="mt-3 text-sm text-gray-600">
                  Are you sure you want to
                  <span className="text-red-600 font-semibold"> reset all results</span>?
                  <br />
                  <span className="text-xs text-red-500">
                    This action cannot be undone.
                  </span>
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-gray-100 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmReset}
                    disabled={isResetting}
                    className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60"
                  >
                    {isResetting ? "Resetting..." : "Yes, Reset"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">

              <h2 className="text-lg font-bold mb-4">Add New Exam Result</h2>

              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedStudent("");
                }}
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="">Select Course</option>
                {[...new Set(students
                  .filter(s => s.institution === "Hifzul Quran College" && s.joining_batch)
                  .map(s => s.joining_batch))]
                  .map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
              </select>

              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
              >
                <option value="">Select Student</option>
                {students
                  .filter(s => s.institution === "Hifzul Quran College")
                  .filter(s => !selectedCourse || s.joining_batch === selectedCourse)
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
              </select>

              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="number"
                placeholder="Hifiz Marks"
                value={hifiz}
                onChange={(e) => setHifiz(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
              />

              <input
                type="number"
                placeholder="Hizb Marks"
                value={hizb}
                onChange={(e) => setHizb(e.target.value)}
                className="w-full border p-2 mb-4 rounded"
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
                <button
                  onClick={handleAddResult}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div >
  </>)
};

export default Hifiz;