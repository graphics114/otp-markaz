import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { fetchAllExamResults, fetchAllStudents } from "../store/slices/studentsSlice";
import { fetchAttendanceReport } from "../store/slices/attendanceSlice";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";
import { User, TrendingUp, Search, Calendar, FileText, Download, Users, CheckCircle, XCircle, Eye, List, LayoutGrid } from "lucide-react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ProgressReport = () => {
  const dispatch = useDispatch();
  const { results, students, loading: stdLoading } = useSelector((state) => state.std);
  const { attendanceReport, loading: attLoading } = useSelector((state) => state.attendance);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().substring(0, 10);
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().substring(0, 10);
  });

  const [viewMode, setViewMode] = useState("all"); // "all" or "individual"
  const [displayType, setDisplayType] = useState("summary"); // "summary" or "detailed"

  useEffect(() => {
    dispatch(fetchAllStudents(1));
    dispatch(fetchAllExamResults());
  }, [dispatch]);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(fetchAttendanceReport({
        institution: "all",
        joining_batch: "all",
        program_id: "all",
        start_date: startDate,
        end_date: endDate
      }));
    }
  }, [startDate, endDate, dispatch]);

  const rangeResults = useMemo(() => {
    const filtered = results.filter(r => {
      if (!r.exam_date) return false;
      const d = r.exam_date.substring(0, 10);
      return d >= startDate && d <= endDate;
    }).sort((a, b) => new Date(b.exam_date) - new Date(a.exam_date));

    if (!searchTerm) return filtered;
    return filtered.filter(r =>
      r.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reg_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [results, startDate, endDate, searchTerm]);

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [students, searchTerm]);

  // Data for Summary View
  const allStudentsSummary = useMemo(() => {
    return students.map(student => {
      const studentRangeResults = results.filter(r => r.student_id === student.id && r.exam_date && r.exam_date.substring(0, 10) >= startDate && r.exam_date.substring(0, 10) <= endDate);
      const att = attendanceReport.find(a => a.id === student.id);

      let total = 0;
      let count = 0;
      studentRangeResults.forEach(result => {
        total += (result.hifiz_marks || 0) + (result.hizb_marks || 0) + (result.competitions || 0) +
          (result.presentation_skill || 0) + (result.writing_skill || 0) +
          (result.reading_skill || 0) + (result.attendance || 0);
        count++;
      });
      const avg = count > 0 ? Math.round(total / count) : 0;
      const allExamsPassed = studentRangeResults.length > 0 && studentRangeResults.every(r => {
        const isAcademicPass = (
          (r.competitions ?? 0) >= 0 &&
          (r.presentation_skill ?? 0) >= 0 &&
          (r.writing_skill ?? 0) >= 0 &&
          (r.reading_skill ?? 0) >= 0
        );
        const isAttendancePass = (r.attendance ?? 0) >= 13;

        // Memory subjects pass rule (30+)
        const hifizPass = (r.hifiz_marks === null || r.hifiz_marks === undefined || r.hifiz_marks === "" || r.hifiz_marks === 1 || Number(r.hifiz_marks) >= 30);
        const hizbPass = (r.hizb_marks === null || r.hizb_marks === undefined || r.hizb_marks === "" || r.hizb_marks === 1 || Number(r.hizb_marks) >= 30);

        // For Uthmaniyya students, memory marks will be null/empty and satisfy the rules above.
        // For Hifiz students, at least one memory mark should be valid.
        const isHifiz = student.institution === "Hifzul Quran College";
        const memoryPass = isHifiz ? (Number(r.hifiz_marks) >= 30 || Number(r.hizb_marks) >= 30) : true;

        return isAcademicPass && isAttendancePass && memoryPass;
      });

      return {
        student,
        avg,
        status: count > 0 ? (allExamsPassed ? "Passed" : "Failed") : "N/A",
        attendance: att ? `${Math.round((att.present_days / att.total_days) * 100)}%` : "0%",
        examCount: count,
        allResults: studentRangeResults
      };
    }).filter(item => searchTerm ? (
      item.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true).sort((a, b) => b.avg - a.avg);
  }, [students, results, startDate, endDate, attendanceReport, searchTerm]);

  const individualData = useMemo(() => {
    if (!selectedStudentId) return { results: [], chart: [], stats: { avg: 0, high: 0, low: 0, count: 0 } };
    const filtered = results.filter(r => r.student_id === selectedStudentId && r.exam_date)
      .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
    const chart = filtered.map(r => {
      const total = (r.hifiz_marks || 0) + (r.hizb_marks || 0) + (r.competitions || 0) +
        (r.presentation_skill || 0) + (r.writing_skill || 0) + (r.reading_skill || 0) +
        (r.attendance || 0);
      return {
        month: new Date(r.exam_date).toLocaleString('default', { month: 'short' }),
        totalMarks: total,
        exam_date: r.exam_date
      };
    });
    const marks = chart.map(d => d.totalMarks);
    const attMarks = filtered.map(r => r.attendance || 0);
    const attAvgPct = attMarks.length > 0 ? Math.round((attMarks.reduce((a, b) => a + b, 0) / (attMarks.length * 20)) * 100) : 0;

    const stats = marks.length > 0 ? {
      avg: Math.round(marks.reduce((a, b) => a + b, 0) / marks.length),
      high: Math.max(...marks),
      low: Math.min(...marks),
      count: marks.length,
      attAvg: `${attAvgPct}%`
    } : { avg: 0, high: 0, low: 0, count: 0, attAvg: "0%" };
    return { results: filtered, chart, stats };
  }, [selectedStudentId, results]);

  const generateDetailedReport = (doc, item, isFirstPage = true) => {
    const { student, allResults } = item;
    if (!isFirstPage) doc.addPage();

    // Page Border
    doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.5); doc.rect(5, 5, 200, 287);

    // Add Logo
    const img = new Image(); img.src = '/logo2.png';
    doc.addImage(img, 'PNG', 95, 8, 20, 20);

    // Header Text
    doc.setFontSize(18); doc.setTextColor(31, 41, 55); doc.setFont("helvetica", "bold");
    doc.text("OTTAPALAM MARKAZ", 105, 33, { align: "center" });

    doc.setFontSize(10); doc.setTextColor(107, 114, 128); doc.setFont("helvetica", "normal");
    const instTitle = (student.institution && !student.institution.includes("..."))
      ? student.institution
      : "Uthmaniyya College of Excelence";
    doc.text(instTitle, 105, 38, { align: "center" });
    doc.setFontSize(14); doc.setTextColor(37, 99, 235); doc.setFont("helvetica", "bold");
    doc.text("STUDENT PROGRESS REPORT", 105, 48, { align: "center" });
    doc.setDrawColor(229, 231, 235); doc.setLineWidth(0.1); doc.line(14, 52, 196, 52);

    // Student Meta
    doc.setFontSize(8); doc.setTextColor(156, 163, 175); doc.text("STUDENT INFORMATION", 14, 58);
    doc.setFontSize(10); doc.setTextColor(31, 41, 55); doc.setFont("helvetica", "bold");
    doc.text(`NAME: ${student.full_name.toUpperCase()}`, 14, 63);
    doc.text(`REG NO: ${student.reg_number}`, 14, 68);
    doc.text(`BATCH: ${student.joining_batch}`, 14, 73);
    doc.setFontSize(8); doc.setTextColor(156, 163, 175); doc.text("REPORTING PERIOD", 140, 58);
    doc.setFontSize(10); doc.setTextColor(31, 41, 55); doc.text(`${startDate} to ${endDate}`, 140, 63);

    const sortedRecords = allResults.sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
    const examCount = sortedRecords.length;

    // Identify if memory marks exist anywhere in the period
    const hasHifiz = sortedRecords.some(r => r.hifiz_marks !== null && r.hifiz_marks !== undefined && r.hifiz_marks !== "" && r.hifiz_marks !== 1);
    const hasHizb = sortedRecords.some(r => r.hizb_marks !== null && r.hizb_marks !== undefined && r.hizb_marks !== "" && r.hizb_marks !== 1);

    // Identify custom subjects that have entered marks in any record of sortedRecords
    const customSubjectsMap = {};
    sortedRecords.forEach(r => {
      const customObj = typeof r.custom_subjects === "string"
        ? JSON.parse(r.custom_subjects || "{}")
        : (r.custom_subjects || {});
      Object.entries(customObj).forEach(([name, val]) => {
        if (val !== null && val !== undefined && val !== "") {
          if (!customSubjectsMap[name]) customSubjectsMap[name] = 0;
          customSubjectsMap[name] += Number(val);
        }
      });
    });

    const aggregated = sortedRecords.reduce((acc, r) => {
      acc.hifiz += (Number(r.hifiz_marks) || 0);
      acc.hizb += (Number(r.hizb_marks) || 0);
      acc.competition += (r.competitions || 0);
      acc.presentation += (r.presentation_skill || 0);
      acc.writing += (r.writing_skill || 0);
      acc.reading += (r.reading_skill || 0);
      acc.attendance += (r.attendance || 0);
      return acc;
    }, { hifiz: 0, hizb: 0, competition: 0, presentation: 0, writing: 0, reading: 0, attendance: 0 });

    const mainSubjects = [
      ...(hasHifiz ? [{ name: "Hifiz", obtained: aggregated.hifiz, max: examCount * 100 }] : []),
      ...(hasHizb ? [{ name: "Hizb", obtained: aggregated.hizb, max: examCount * 100 }] : []),
      ...Object.entries(customSubjectsMap).map(([name, obtained]) => ({
        name,
        obtained,
        max: examCount * 100
      }))
    ];

    const additionalFields = [
      { name: "Competition", obtained: aggregated.competition, max: examCount * 20 },
      { name: "Presentation Skill", obtained: aggregated.presentation, max: examCount * 20 },
      { name: "Writing Skill", obtained: aggregated.writing, max: examCount * 20 },
      { name: "Reading Skill", obtained: aggregated.reading, max: examCount * 20 },
      { name: "Attendance", obtained: aggregated.attendance, max: examCount * 20 }
    ];

    const mainMax = mainSubjects.reduce((sum, s) => sum + s.max, 0);
    const mainObtained = mainSubjects.reduce((sum, s) => sum + s.obtained, 0);
    const mainPct = mainMax > 0 ? ((mainObtained / mainMax) * 100).toFixed(2) : "0.00";

    const addMax = additionalFields.reduce((sum, s) => sum + s.max, 0);
    const addObtained = additionalFields.reduce((sum, s) => sum + s.obtained, 0);
    const addPct = addMax > 0 ? ((addObtained / addMax) * 100).toFixed(2) : "0.00";

    const totalObtained = mainObtained + addObtained;
    const totalMax = mainMax + addMax;
    const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

    const checkPass = (s) => {
      const pct = (s.obtained / s.max) * 100;
      if (s.name === "Attendance") return pct >= 65; // (13/20 = 65%)
      if (["Hifiz", "Hizb"].includes(s.name)) return pct >= 30; // (30/100 = 30%)
      if (["Competition", "Presentation Skill", "Writing Skill", "Reading Skill"].includes(s.name)) return pct >= 0;
      return pct >= 35;
    };

    const mainPassed = mainSubjects.every(s => checkPass(s));
    const addPassed = additionalFields.every(s => checkPass(s));

    const overallPassed = mainPassed && addPassed;

    autoTable(doc, {
      startY: 78,
      head: [["Subject", "Max", "Obtained", "Percentage", "Status"]],
      body: [
        ...(mainSubjects.length > 0 ? [
          [{ content: "MAIN SUBJECTS", colSpan: 5, styles: { fillColor: [224, 231, 255], textColor: [30, 64, 175], fontStyle: 'bold', halign: 'center' } }]
        ] : []),
        ...mainSubjects.map(s => [
          s.name.toUpperCase(),
          s.max,
          s.obtained,
          `${((s.obtained / s.max) * 100).toFixed(2)}%`,
          checkPass(s) ? "PASS" : "FAIL"
        ]),
        ...(mainSubjects.length > 0 ? [
          [{ content: "MAIN SUBJECTS SUMMARY", styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }, mainMax, mainObtained, `${mainPct}%`, mainPassed ? "PASSED" : "FAILED"]
        ] : []),
        [{ content: "", colSpan: 5, styles: { fillColor: [255, 255, 255], minCellHeight: 2 } }],
        [{ content: "ADDITIONAL FIELDS", colSpan: 5, styles: { fillColor: [224, 231, 255], textColor: [30, 64, 175], fontStyle: 'bold', halign: 'center' } }],
        ...additionalFields.map(s => [
          s.name.toUpperCase(),
          s.max,
          s.obtained,
          `${((s.obtained / s.max) * 100).toFixed(2)}%`,
          checkPass(s) ? "PASS" : "FAIL"
        ]),
        [{ content: "ADDITIONAL FIELDS SUMMARY", styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } }, addMax, addObtained, `${addPct}%`, addPassed ? "PASSED" : "FAILED"],
        [{ content: "", colSpan: 5, styles: { fillColor: [255, 255, 255], minCellHeight: 2 } }],
        [{ content: "OVERALL PERFORMANCE SUMMARY", styles: { fontStyle: 'bold', fillColor: [226, 232, 240] } }, totalMax, totalObtained, `${overallPct}%`, overallPassed ? "PASSED" : "FAILED"]
      ],
      theme: 'grid', styles: { fontSize: 8, cellPadding: 2, halign: 'center' },
      columnStyles: { 0: { halign: 'left' } },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      didParseCell: (data) => {
        if (data.section === 'body') {
          let rawText = "";
          const rawCell = data.row.cells[0]?.raw;
          if (rawCell) {
            rawText = rawCell.content !== undefined ? rawCell.content : rawCell;
          }
          rawText = String(rawText || "");
          
          const isOverall = rawText.includes("SUMMARY");
          const isDivider = rawText === "MAIN SUBJECTS" || rawText === "ADDITIONAL FIELDS" || rawText === "";
          
          if (isOverall) {
            if (data.column.index === 4) {
              const pass = data.cell.raw === "PASSED";
              data.cell.styles.fillColor = pass ? [34, 197, 94] : [239, 68, 68];
              data.cell.styles.textColor = [255, 255, 255];
            }
          }
          else if (data.column.index === 4 && !isDivider) {
            data.cell.styles.fillColor = data.cell.raw === "PASS" ? [59, 130, 246] : [244, 63, 94];
            data.cell.styles.textColor = [255, 255, 255];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    let finalY = doc.lastAutoTable.finalY + 20;
    if (finalY > 275) {
      doc.addPage();
      doc.setDrawColor(37, 99, 235); doc.setLineWidth(0.5); doc.rect(5, 5, 200, 287);
      finalY = 30;
    }
    doc.setDrawColor(229, 231, 235); doc.line(14, finalY, 74, finalY); doc.setFontSize(9); doc.setTextColor(156, 163, 175); doc.text("Teacher's Signature", 14, finalY + 5);
    doc.line(136, finalY, 196, finalY); doc.text("Parent's Signature", 136, finalY + 5);
    doc.setFontSize(7); doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" });
  };

  const handleExportAllDetailedPDF = () => {
    const doc = new jsPDF();
    const studentsToExport = allStudentsSummary.filter(item => item.examCount > 0);
    if (studentsToExport.length === 0) return toast.error("No students with results found in this range");

    studentsToExport.forEach((item, index) => {
      generateDetailedReport(doc, item, index === 0);
    });
    doc.save(`Bulk_Detailed_Reports_${startDate}_to_${endDate}.pdf`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(22); doc.setTextColor(37, 99, 235);
    doc.text("ACADEMIC PROGRESS REPORT", 148.5, 20, { align: "center" });
    doc.setFontSize(10); doc.setTextColor(156, 163, 175);
    doc.text(`Report Period: ${startDate} to ${endDate}`, 148.5, 26, { align: "center" });

    if (displayType === "detailed") {
      autoTable(doc, {
        startY: 35,
        head: [["#", "Month", "Name", "Reg No", "Competition", "Description", "Presentation", "Writing", "Reading", "Attendance", "Total", "R Status", "P Status"]],
        body: rangeResults.map((r, i) => {
          const total = (r.hifiz_marks || 0) + (r.hizb_marks || 0) + (r.competitions || 0) + (r.presentation_skill || 0) + (r.writing_skill || 0) + (r.reading_skill || 0) + (r.attendance || 0);
          return [
            i + 1,
            new Date(r.exam_date).toLocaleString('default', { month: 'long' }),
            r.full_name,
            r.reg_number,
            r.competitions || "0",
            r.description || "-",
            r.presentation_skill || "0",
            r.writing_skill || "0",
            r.reading_skill || "0",
            r.attendance || "0",
            total,
            total >= 35 ? "PASSED" : "FAILED",
            r.status || "Pending"
          ];
        }),
        headStyles: { fillColor: [37, 99, 235] }
      });
    } else {
      autoTable(doc, {
        startY: 35,
        head: [["#", "Reg No", "Name", "Batch", "Attend %", "Avg Marks", "Exams", "Result"]],
        body: allStudentsSummary.map((item, i) => [
          i + 1, item.student.reg_number, item.student.full_name, item.student.joining_batch, item.attendance, item.examCount > 0 ? item.avg : "-", item.examCount, item.status
        ]),
        headStyles: { fillColor: [37, 99, 235] }
      });
    }
    const finalY = doc.lastAutoTable.finalY + 40;
    doc.line(40, finalY, 100, finalY); doc.text("Teacher's Signature", 40, finalY + 7);
    doc.line(196, finalY, 256, finalY); doc.text("Parent's Signature", 196, finalY + 7);
    doc.save(`Academic_Report_${startDate}_to_${endDate}.pdf`);
  };

  const handleExportIndividualPDF = (item) => {
    const doc = new jsPDF();
    generateDetailedReport(doc, item, true);
    doc.save(`${item.student.full_name}_Report.pdf`);
  };

  return (
    <main className="p-2 md:p-8 pl-4 md:pl-[18rem] w-full min-h-screen bg-gray-50/50">
      <Header />
      <div className="mt-4 md:mt-6 max-w-7xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div><h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center md:text-left">Progress Analytics</h1><p className="text-sm text-gray-500 text-center md:text-left">Comprehensive academic tracking and batch reporting</p></div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-center md:justify-start">
            <button onClick={() => { setSearchTerm(""); setViewMode("all"); }} className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "all" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"}`}>Batch View</button>
            <button className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === "individual" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"}`} onClick={() => setViewMode("individual")}>Individual View</button>
            <button onClick={handleExportAllDetailedPDF} className="flex-1 md:flex-none bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 shadow-lg shadow-blue-100"><FileText size={16} /> Bulk Progress</button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1"><Calendar size={12} /> Start Date</label><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-gray-50 border-none p-3 rounded-2xl outline-none font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /></div>
            <div><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1"><Calendar size={12} /> End Date</label><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-gray-50 border-none p-3 rounded-2xl outline-none font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20" /></div>
            <div className="md:col-span-2 relative mt-0"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block ml-1 flex items-center gap-1"><Search size={12} /> {viewMode === "all" ? (displayType === 'summary' ? "Search Summary" : "Search Detailed Results") : "Search Student Profile"}</label><div className="relative"><input type="text" placeholder="Search name or reg no..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-none p-3 pl-10 rounded-2xl outline-none transition-all font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20" /><Search className="absolute left-3 top-3.5 text-gray-300" size={18} /></div>
              {viewMode === "individual" && searchTerm && (<div className="absolute z-10 w-full left-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-1">{filteredStudents.map(s => (<button key={s.id} onClick={() => { setSelectedStudentId(s.id); setSearchTerm(""); setViewMode("individual"); }} className="w-full p-3 flex items-center gap-3 hover:bg-blue-50 rounded-xl text-left"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{s.full_name[0]}</div><div><p className="font-bold text-gray-800 text-sm">{s.full_name}</p><p className="text-[10px] text-gray-400 font-medium">{s.reg_number}</p></div></button>))}</div>)}
            </div>
          </div>
        </div>

        {viewMode === "individual" && selectedStudentId ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              {[
                { label: "Attendance", val: individualData.stats.attAvg, color: "text-blue-600", bg: "bg-blue-50", icon: <Calendar /> },
                { label: "Avg Marks", val: individualData.stats.avg, color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp /> },
                { label: "Best Score", val: individualData.stats.high, color: "text-purple-600", bg: "bg-purple-50", icon: <TrendingUp /> },
                { label: "Exams", val: individualData.stats.count, color: "text-orange-600", bg: "bg-orange-50", icon: <FileText /> },
              ].map((s, i) => (<div key={i} className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:scale-[1.02] flex flex-col justify-center items-center md:items-start text-center md:text-left"><div className={`w-8 h-8 ${s.bg} ${s.color} rounded-lg flex items-center justify-center mb-2 md:mb-3`}>{s.icon}</div><p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p><p className={`text-xl md:text-2xl font-black ${s.color}`}>{s.val}</p></div>))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* TRAJECTORY */}
              <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 underline decoration-blue-500/30 underline-offset-8">Growth Trajectory</h3>
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={individualData.chart}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" hide />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="totalMarks" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DETAILED EXAM HISTORY (MATCHING SCREENSHOT) */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 underline decoration-blue-500/30 underline-offset-8">Exam Records Breakdown</h3>
                <div className="space-y-8 overflow-y-auto max-h-[600px] pr-2 scrollbar-hide">
                  {individualData.results.slice().reverse().map((r, i) => {
                    const customObj = typeof r.custom_subjects === "string"
                      ? JSON.parse(r.custom_subjects || "{}")
                      : (r.custom_subjects || {});

                    const customSubs = Object.entries(customObj)
                      .filter(([_, val]) => val !== null && val !== undefined && val !== "")
                      .map(([name, val]) => ({
                        name,
                        max: 100,
                        obtained: Number(val)
                      }));

                    const mainSubjects = [
                      ...(r.hifiz_marks !== null && r.hifiz_marks !== undefined && r.hifiz_marks !== "" && r.hifiz_marks !== 1 ? [{ name: "Hifiz", max: 100, obtained: Number(r.hifiz_marks) }] : []),
                      ...(r.hizb_marks !== null && r.hizb_marks !== undefined && r.hizb_marks !== "" && r.hizb_marks !== 1 ? [{ name: "Hizb", max: 100, obtained: Number(r.hizb_marks) }] : []),
                      ...customSubs
                    ];

                    const additionalFields = [
                      { name: "Competition", obtained: r.competitions || 0, max: 20 },
                      { name: "Presentation Skill", obtained: r.presentation_skill || 0, max: 20 },
                      { name: "Writing Skill", obtained: r.writing_skill || 0, max: 20 },
                      { name: "Reading Skill", obtained: r.reading_skill || 0, max: 20 },
                      { name: "Attendance", obtained: r.attendance || 0, max: 20 }
                    ];

                    const checkPassItem = (s) => {
                      if (s.name === "Attendance") return s.obtained >= 13;
                      if (["Hifiz", "Hizb"].includes(s.name)) return s.obtained >= 30;
                      if (["Competition", "Presentation Skill", "Writing Skill", "Reading Skill"].includes(s.name)) return s.obtained >= 0;
                      return s.obtained >= 35;
                    };

                    const mainMax = mainSubjects.reduce((sum, s) => sum + s.max, 0);
                    const mainObtained = mainSubjects.reduce((sum, s) => sum + s.obtained, 0);
                    const mainPct = mainMax > 0 ? ((mainObtained / mainMax) * 100).toFixed(2) : "0.00";
                    const mainPassed = mainSubjects.every(s => checkPassItem(s));

                    const addMax = additionalFields.reduce((sum, s) => sum + s.max, 0);
                    const addObtained = additionalFields.reduce((sum, s) => sum + s.obtained, 0);
                    const addPct = addMax > 0 ? ((addObtained / addMax) * 100).toFixed(2) : "0.00";
                    const addPassed = additionalFields.every(s => checkPassItem(s));

                    const subjects = [...mainSubjects, ...additionalFields];
                    const isPassed = mainPassed && addPassed;

                    const totalObtained = mainObtained + addObtained;
                    const totalMax = mainMax + addMax;
                    const overallPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";
                    const isLast = i === individualData.results.length - 1;

                    const totalMarksOnly = totalObtained - (r.attendance || 0);
                    return (
                      <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{new Date(r.exam_date).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-bold ${isPassed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                            {isPassed ? "PASSED" : "FAILED"}
                          </span>
                        </div>

                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-gray-50/30 border-b border-gray-50">
                              <th className="px-4 py-3 font-bold text-gray-500">Subject</th>
                              <th className="px-2 py-3 font-bold text-gray-500 text-center">Max</th>
                              <th className="px-2 py-3 font-bold text-gray-500 text-center">Obtd</th>
                              <th className="px-2 py-3 font-bold text-gray-500 text-center">%</th>
                              <th className="px-4 py-3 font-bold text-gray-500 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mainSubjects.length > 0 && (
                              <tr className="bg-purple-50/50 border-b border-purple-100">
                                <td colSpan="5" className="px-4 py-2 font-bold text-purple-700 text-[10px] uppercase tracking-widest">Subjects</td>
                              </tr>
                            )}
                            {mainSubjects.map((s, idx) => {
                              const pct = ((s.obtained / s.max) * 100).toFixed(2);
                              let passed = false;
                              if (["Hifiz", "Hizb"].includes(s.name)) passed = (s.obtained >= 30);
                              else passed = (s.obtained >= 35);
                              return (
                                <tr key={`main-${idx}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                  <td className="px-4 py-3 font-bold text-gray-700">{s.name}</td>
                                  <td className="px-2 py-3 text-center text-gray-400">{s.max}</td>
                                  <td className="px-2 py-3 text-center font-bold text-gray-800">{s.obtained}</td>
                                  <td className="px-2 py-3 text-center font-black text-emerald-600">{pct}%</td>
                                  <td className="px-2 py-0 text-center">
                                    <div className={`h-full w-full py-3 flex items-center justify-center font-bold text-white rounded-r-lg ${passed ? "bg-blue-600" : "bg-rose-600"}`}>
                                      {passed ? "PASS" : "FAIL"}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            
                            {/* MAIN SUBJECTS SUMMARY ROW */}
                            {mainSubjects.length > 0 && (
                              <tr className="bg-gray-50/50 font-black border-t border-gray-100">
                                <td className="px-4 py-3 uppercase text-gray-700 text-[10px]">MAIN SUBJECTS SUMMARY</td>
                                <td className="px-2 py-3 text-center text-gray-700">{mainMax}</td>
                                <td className="px-2 py-3 text-center text-gray-700">{mainObtained}</td>
                                <td className="px-2 py-3 text-center text-blue-600">{mainPct}%</td>
                                <td className="px-2 py-0 text-center">
                                  <div className={`h-full w-full py-3 flex items-center justify-center text-white rounded-r-lg ${mainPassed ? "bg-emerald-500" : "bg-rose-600"}`}>
                                    {mainPassed ? "PASSED" : "FAILED"}
                                  </div>
                                </td>
                              </tr>
                            )}

                            <tr>
                              <td colSpan="5" className="h-3 bg-white border-none"></td>
                            </tr>
                            <tr className="bg-blue-50/50 border-b border-blue-100">
                              <td colSpan="5" className="px-4 py-2 font-bold text-blue-700 text-[10px] uppercase tracking-widest">Additional Fields</td>
                            </tr>
                            {additionalFields.map((s, idx) => {
                              const pct = ((s.obtained / s.max) * 100).toFixed(2);
                              let passed = false;
                              if (s.name === "Attendance") passed = (s.obtained >= 13);
                              else passed = (s.obtained >= 0);
                              return (
                                <tr key={`add-${idx}`} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                  <td className="px-4 py-3 font-bold text-gray-700">{s.name}</td>
                                  <td className="px-2 py-3 text-center text-gray-400">{s.max}</td>
                                  <td className="px-2 py-3 text-center font-bold text-gray-800">{s.obtained}</td>
                                  <td className="px-2 py-3 text-center font-black text-emerald-600">{pct}%</td>
                                  <td className="px-2 py-0 text-center">
                                    <div className={`h-full w-full py-3 flex items-center justify-center font-bold text-white rounded-r-lg ${passed ? "bg-blue-600" : "bg-rose-600"}`}>
                                      {passed ? "PASS" : "FAIL"}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            
                            {/* ADDITIONAL FIELDS SUMMARY ROW */}
                            <tr className="bg-gray-50/50 font-black border-t border-gray-100">
                              <td className="px-4 py-3 uppercase text-gray-700 text-[10px]">ADDITIONAL FIELDS SUMMARY</td>
                              <td className="px-2 py-3 text-center text-gray-700">{addMax}</td>
                              <td className="px-2 py-3 text-center text-gray-700">{addObtained}</td>
                              <td className="px-2 py-3 text-center text-blue-600">{addPct}%</td>
                              <td className="px-2 py-0 text-center">
                                <div className={`h-full w-full py-3 flex items-center justify-center text-white rounded-r-lg ${addPassed ? "bg-emerald-500" : "bg-rose-600"}`}>
                                  {addPassed ? "PASSED" : "FAILED"}
                                </div>
                              </td>
                            </tr>

                            {/* OVERALL ROW */}
                            <tr>
                              <td colSpan="5" className="h-3 bg-white border-none"></td>
                            </tr>
                            <tr className="bg-gray-100 font-black">
                              <td className="px-4 py-4 uppercase text-gray-900">OVERALL PERFORMANCE SUMMARY</td>
                              <td className="px-2 py-4 text-center text-gray-900">{totalMax}</td>
                              <td className="px-2 py-4 text-center text-gray-900">{totalObtained}</td>
                              <td className="px-2 py-4 text-center text-blue-600">{overallPct}%</td>
                              <td className="px-2 py-0 text-center">
                                <div className={`h-full w-full py-4 flex items-center justify-center text-white rounded-r-lg ${isPassed ? "bg-emerald-500" : "bg-rose-600"}`}>
                                  {isPassed ? "PASSED" : "FAILED"}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-auto text-center md:text-left">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2"><Users className="text-blue-500" size={20} /> Batch Records Dashboard</h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">Found {displayType === 'summary' ? allStudentsSummary.length : rangeResults.length} records in this period</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-center">
                <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                  <button onClick={() => setDisplayType("summary")} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold ${displayType === "summary" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={14} /> SUMMARY</button>
                  <button onClick={() => setDisplayType("detailed")} className={`p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold ${displayType === "detailed" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}><List size={14} /> DETAILED</button>
                </div>
                <div className="hidden md:block w-[1px] h-10 bg-gray-100 mx-2"></div>
                <div className="text-center">
                  <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pass Rate</p>
                  <p className="text-base md:text-lg font-black text-emerald-600 mt-1">{displayType === 'summary' ? (allStudentsSummary.filter(i => i.examCount > 0).length > 0 ? Math.round((allStudentsSummary.filter(i => i.status === "Passed").length / allStudentsSummary.filter(i => i.examCount > 0).length) * 100) : 0) : (rangeResults.length > 0 ? Math.round((rangeResults.filter(r => (r.competitions || 0) >= 0 && (r.presentation_skill || 0) >= 0 && (r.writing_skill || 0) >= 0 && (r.reading_skill || 0) >= 0 && (r.attendance || 0) >= 13).length / rangeResults.length) * 100) : 0)}%</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              {displayType === "summary" ? (
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student Details</th>
                      <th className="px-4 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Batch</th>
                      <th className="px-4 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Attendance</th>
                      <th className="px-4 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Exams</th>
                      <th className="px-4 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Avg Mark</th>
                      <th className="px-4 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 md:px-8 py-4 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allStudentsSummary.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-all group">
                        <td className="px-6 md:px-8 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-500 font-black text-xs md:text-sm group-hover:scale-110">{item.student.full_name[0]}</div><div><p className="font-bold text-gray-800 text-xs md:text-sm leading-tight line-clamp-1">{item.student.full_name}</p><p className="text-[9px] md:text-[10px] text-gray-400 font-medium tracking-wide uppercase">{item.student.reg_number}</p></div></div></td>
                        <td className="px-4 py-4 text-center"><span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{item.student.joining_batch}</span></td>
                        <td className="px-4 py-4 text-center"><div className="flex flex-col items-center"><span className="text-sm font-black text-gray-700">{item.attendance}</span><div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: item.attendance }}></div></div></div></td>
                        <td className="px-4 py-4 text-center"><span className="text-xs font-bold text-gray-500">{item.examCount}</span></td>
                        <td className="px-4 py-4 text-center">{item.examCount > 0 ? (<span className="text-lg font-black text-blue-600">{item.avg}</span>) : (<span className="text-xs font-bold text-gray-300 italic">No Exams</span>)}</td>
                        <td className="px-4 py-4 text-center">{item.examCount > 0 ? (<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${item.status === "Passed" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{item.status.toUpperCase()}</div>) : (<span className="text-[10px] font-bold text-gray-300">—</span>)}</td>
                        <td className="px-6 md:px-8 py-4 text-center flex items-center justify-center gap-2"><button onClick={() => { setSelectedStudentId(item.student.id); setViewMode("individual"); }} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Eye size={14} /></button><button onClick={() => handleExportIndividualPDF(item)} disabled={item.examCount === 0} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-0"><Download size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* DETAILED TABLE (EXACT MATCH TO SUBMITTED SCREENSHOT) */
                <table className="w-full text-left min-w-[1200px] text-xs">
                  <thead className="bg-[#f8f9fa] border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">#</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Month</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Name</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Reg No</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Competition</th>
                      <th className="px-4 py-3 font-bold text-gray-700">Description</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Presentation Skill</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Writing Skill</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Reading Skill</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Attendance</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-center">Total</th>
                      <th className="px-4 py-3 font-bold text-gray-700">R Status</th>
                      <th className="px-4 py-3 font-bold text-gray-700">P Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {rangeResults.map((r, i) => {
                      const total = (r.hifiz_marks || 0) + (r.hizb_marks || 0) + (r.competitions || 0) + (r.presentation_skill || 0) + (r.writing_skill || 0) + (r.reading_skill || 0) + (r.attendance || 0);
                      return (
                        <tr key={i} className="hover:bg-gray-50 transition-all border-b border-gray-50">
                          <td className="px-4 py-3 text-center text-gray-400">{i + 1}</td>
                          <td className="px-4 py-3 text-gray-600">{new Date(r.exam_date).toLocaleString('default', { month: 'long' })}</td>
                          <td className="px-4 py-3 font-medium text-gray-800 uppercase line-clamp-1">{r.full_name}</td>
                          <td className="px-4 py-3 text-gray-500 font-mono">{r.reg_number}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.competitions ?? "0"}</td>
                          <td className="px-4 py-3 text-gray-400 italic line-clamp-1 max-w-[100px]">{r.description || "-"}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.presentation_skill ?? 0}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.writing_skill ?? 0}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.reading_skill ?? 0}</td>
                          <td className="px-4 py-3 text-center text-gray-600">{r.attendance ?? 0}</td>
                          <td className="px-4 py-3 text-center font-bold text-gray-900">{total}</td>
                          <td className="px-4 py-3"><span className={`font-bold ${(r.competitions || 0) >= 0 && (r.presentation_skill || 0) >= 0 && (r.writing_skill || 0) >= 0 && (r.reading_skill || 0) >= 0 && (r.attendance || 0) >= 13 ? 'text-emerald-600' : 'text-rose-500'}`}>{(r.competitions || 0) >= 0 && (r.presentation_skill || 0) >= 0 && (r.writing_skill || 0) >= 0 && (r.reading_skill || 0) >= 0 && (r.attendance || 0) >= 13 ? 'PASSED' : 'FAILED'}</span></td>
                          <td className="px-4 py-3"><span className="text-gray-400 font-medium">{r.status || "Pending"}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProgressReport;
