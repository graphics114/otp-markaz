import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import { useEffect, useState } from "react";
import { fetchAllExamResults, updateResult } from "../../store/slices/studentsSlice";
import { FolderSearch, ReplaceAll } from "lucide-react";
import { toast } from "react-toastify";

import * as XLSX from "xlsx";

const HifizResult = () => {

  const { loading, results, totalStudents } = useSelector((state) => state.std);

  const [selectedStatus, setSelectedStatus] = useState({});

  const [search, setSearch] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);

  useEffect(() => {
    dispatch(fetchAllExamResults(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalStudents !== undefined) {
      const newMax = Math.ceil(totalStudents / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalStudents]);

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
    dispatch(updateResult(resultId, selectedStatus[resultId]));
  };

  const getRStatus = (result) => {
    const hifiz = result.hifiz_marks ?? 0;
    const hizb = result.hizb_marks ?? 0;

    return hifiz >= 30 && hizb >= 30 ? "passed" : "failed";
  };

  // PRINT
  const handlePrint = () => {
    const printContent = document.getElementById("print-only-table");

    const printDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
        <html>
          <head>
            <title>Hifiz Collage Exam Result</title>
            <style>
              @page { size: A4 landscape; margin: 10mm; }
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; }
              th, td {
                border: 1px solid #000;
                padding: 6px;
                white-space: nowrap;
                text-align: left;
              }
              th { background: #f1f5f9; }
              h2 { text-align: center; }
              p { text-align: center; }
              .actions-col { display: none; }
            </style>
          </head>
          <body>
            <h2>Hifiz Collage Exam Result</h2>
            <p>Print Date: ${printDate}<p>
            ${printContent.innerHTML}
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

    const excelData = results.map((r, index) => ({
      "Sl No": index + 1,
      "Name": r.full_name,
      "Reg No": r.reg_number,
      "Course": r.joining_batch,
      "Hifiz": r.hifiz_marks,
      "Hizb": r.hizb_marks,
      "Result": r.hifiz_marks >= 30 && r.hizb_marks >= 30 ? "Passed" : "Failed",
    }));


    // Excel sheet create ചെയ്യുന്നു
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // File download
    XLSX.writeFile(workbook, "Hifiz-Collage-Exam-Result.xlsx");
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

    toast.success("All marks reset sucssusfully");
  };

  return (<>
    <div className="fixed inset-0 bg-gray-50">
      <div className="p-[10px] pl-[10px] md:pl-[17rem] w-full">

        {/* HEADER */}
        <div className="flex-1 p-6">
          <Header />
          <h1 className="text-2xl font-bold">Hifzul Quran College</h1>
          <p className="text-sm text-gray-600 mb-6">Manage all Results</p>
        </div>

        <div className=" sm:p-8 bg-gray-50 min-h-full p-2">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            {/* SEARCH */}
            <div className="relative w-full sm:w-72">
              <input type="text" placeholder="Search by name, reg number or status..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg pl-10
                                   placeholder:text-sm focus:outline-none" />
              <FolderSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                               text-gray-400 w-5 h-5"/>
            </div>

            <div className="flex gap-2 ml-50 sm:ml-auto">

              {/* PRINT */}
              <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded">
                Print
              </button>

              {/* EXCEL */}
              <button
                onClick={handleExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Excel
              </button>

              {/* Reset Marks */}
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reset All Marks
              </button>


            </div>
          </div>

          {/* STUDENTS */}
          <div id="print-only-table" className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${results && results.length > 0 && "shadow-lg"}`
            }`}>
            {loading ? (
              <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent 
                            rounded-full animate-spin" />
            ) : results && results.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 print:table-auto">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap">Course</th>
                    <th className="py-3 px-4 text-left">Reg No</th>
                    <th className="py-3 px-4 text-left">Hifiz</th>
                    <th className="py-3 px-4 text-left">Hizb</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap">R Status</th>
                    <th className="py-3 px-4 text-left whitespace-nowrap actions-col">P Status</th>
                    <th className="py-3 px-4 text-left actions-col">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {results.filter((result) => (result.institution === "Hifzul Quran College") &&
                    (
                      result.full_name.toLowerCase().includes(search.toLowerCase()) ||
                      result.reg_number.toLowerCase().includes(search.toLowerCase()) ||
                      result.result_status.toLowerCase().includes(search.toLowerCase()) ||
                      getRStatus(result).includes(search.toLowerCase())
                    )
                  )
                    .map((result, index) => {
                      return (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 font-semibold text-gray-600">
                            {(page - 1) * 10 + index + 1}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.full_name}</td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.joining_batch}</td>
                          <td className="py-3 px-4 whitespace-nowrap">{result.reg_number}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={selectedStatus[result.result_id]?.hifiz_marks ?? result.hifiz_marks}
                              onChange={(e) =>
                                handleResultChange(result.result_id, "hifiz_marks", e.target.value)
                              }
                              className="text-center w-10 focus:outline-none 
                                                    bg-transparent"/>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={selectedStatus[result.result_id]?.hizb_marks ?? result.hizb_marks}
                              onChange={(e) =>
                                handleResultChange(result.result_id, "hizb_marks", e.target.value)
                              }
                              className="text-center w-10 focus:outline-none 
                                                    bg-transparent" />
                          </td>
                          <td className="py-3 px-4">
                            {(() => {
                              const hifiz =
                                selectedStatus[result.result_id]?.hifiz_marks ?? result.hifiz_marks;

                              const hizb =
                                selectedStatus[result.result_id]?.hizb_marks ?? result.hizb_marks;

                              const isPassed = hifiz >= 30 && hizb >= 30;

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
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium focus:outline-none text-center
                                                  ${(selectedStatus[result.result_id]?.result_status ?? result.result_status) === "Published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                              {result.result_status}
                            </div>
                          </td>
                          <td className="py-3 px-4 actions-col">
                            <button
                              onClick={() => handleSave(result.result_id)}
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              Save
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
      </div>
    </div>
  </>)
};

export default HifizResult;