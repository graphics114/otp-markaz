import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { Trophy, MapPin, Calendar, Printer, FileSpreadsheet } from "lucide-react";
import { fetchTopStudents } from "../store/slices/deshboarSlice";
import * as XLSX from "xlsx";

const TopStudents = () => {
  const dispatch = useDispatch();
  const { topStudents, topStudentsLoading } = useSelector((state) => state.desh);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Calculate from and to dates based on selected month
  const getMonthDates = (monthYear) => {
    if (!monthYear) return { from: null, to: null };

    const [year, month] = monthYear.split('-').map(Number);
    // Use local date to avoid timezone issues
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0); // Last day of the month

    // Format as YYYY-MM-DD in local timezone
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    return {
      from: formatDate(fromDate),
      to: formatDate(toDate)
    };
  };

  const { from, to } = getMonthDates(selectedMonth);

  useEffect(() => {
    const fetchData = () => {
      // Fetch more students to ensure we get data for all batches
      if (selectedMonth) {
        dispatch(fetchTopStudents(100, from, to));
      } else {
        dispatch(fetchTopStudents(100, null, null));
      }
    };

    fetchData();
  }, [dispatch, selectedMonth, from, to]);

  // Group by batch and take the top scorer for each
  const topStudentsByBatch = Object.values(
    topStudents.reduce((acc, student) => {
      const batch = student.batch || "No Batch";
      if (!acc[batch] || student.totalMarks > acc[batch].totalMarks) {
        acc[batch] = student;
      }
      return acc;
    }, {})
  ).sort((a, b) => b.totalMarks - a.totalMarks);

  // PRINT FUNCTION
  const handlePrint = () => {
    if (!topStudentsByBatch || topStudentsByBatch.length === 0) {
      return;
    }

    const monthName = selectedMonth
      ? new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : 'All Time';

    const printDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const win = window.open("", "", "width=900,height=650");

    const tableRows = topStudentsByBatch.map((student, index) => `
      <tr>
        <td style="padding: 8px; text-align: center;">1</td>
        <td style="padding: 8px;">${student.name || 'N/A'}</td>
        <td style="padding: 8px;">${student.location || 'N/A'}</td>
        <td style="padding: 8px;">${student.batch || 'N/A'}</td>
        <td style="padding: 8px;">${student.examDate ? new Date(student.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
        <td style="padding: 8px; text-align: right; font-weight: bold;">${student.totalMarks || 0}</td>
      </tr>
    `).join("");

    win.document.write(`
      <html>
        <head>
          <title>Top Scoring Students - ${monthName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; margin-bottom: 5px; }
            h2 { color: #666; font-size: 14px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f3f4f6; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
            td { border: 1px solid #ddd; }
            .print-date { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Top Scoring Students</h1>
          <h2>Month: ${monthName}</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Location</th>
                <th>Batch</th>
                <th>Exam Date</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <div class="print-date">Printed on: ${printDate}</div>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // EXCEL EXPORT FUNCTION
  const handleExcel = () => {
    if (!topStudentsByBatch || topStudentsByBatch.length === 0) {
      return;
    }

    const monthName = selectedMonth
      ? new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : 'All Time';

    const excelData = topStudentsByBatch.map((student, index) => ({
      "Rank": 1,
      "Name": student.name || 'N/A',
      "Location": student.location || 'N/A',
      "Batch": student.batch || 'N/A',
      "Exam Date": student.examDate
        ? new Date(student.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'N/A',
      "Total Marks": student.totalMarks || 0,
      "Hifiz Marks": student.hifizMarks || 0,
      "Hizb Marks": student.hizbMarks || 0,
      "Tajweed Marks": student.tajweedMarks || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Top Students");

    const fileName = `Top-Students-${monthName.replace(/\s+/g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] mx-4 w-full min-h-screen pt-10">
      <Header />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Top Scoring Students</h1>
        <p className="text-sm text-gray-500">Highest performing students from each batch for the selected month</p>
      </div>

      {/* MONTH FILTER */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">View by Month</h3>
            <p className="text-xs text-gray-500">
              {selectedMonth
                ? `Showing top students for ${new Date(selectedMonth + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`
                : 'Select a month to view top scoring students'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
          </div>

          {selectedMonth && (
            <button
              onClick={() => {
                const now = new Date();
                setSelectedMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              Current Month
            </button>
          )}
        </div>
      </div>

      {/* TOP SCORING STUDENTS TABLE */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Trophy className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Batch-wise Toppers</h3>
              <p className="text-xs text-gray-500">Highest scoring students from each batch</p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {topStudentsByBatch && topStudentsByBatch.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={handleExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Excel
              </button>
            </div>
          )}
        </div>

        {topStudentsLoading ? (
          <div className="text-center py-10 text-gray-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading top students...
          </div>
        ) : topStudentsByBatch && topStudentsByBatch.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Exam Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {topStudentsByBatch.map((student, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🥇</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin size={14} />
                        <span className="text-sm">{student.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{student.batch}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {student.examDate
                          ? new Date(student.examDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                          : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-lg text-blue-600">{student.totalMarks}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <Trophy size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No top students data available</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default TopStudents;
