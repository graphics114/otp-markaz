import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
    fetchPrograms, addProgram, deleteProgram,
    fetchStudentsForAttendance, fetchAttendanceData, fetchYesterdayAttendanceData, submitAttendance,
    fetchAttendanceReport, clearAttendanceData
} from "../store/slices/attendanceSlice";

import { Check, X, Plus, Trash2, Calendar, BookOpen, Users, BarChart3, ListChecks, Download, Printer, FileSpreadsheet, UserSearch } from "lucide-react";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import StudentDetailedAttendance from "./StudentDetailedAttendance";


const Attendance = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading, programs, students, attendanceData, yesterdayAttendanceData, attendanceReport } = useSelector((state) => state.attendance);

    const isAdmin = user?.role === "Admin";

    const [activeTab, setActiveTab] = useState("mark"); // "mark" or "report"

    const [filters, setFilters] = useState({
        institution: "",
        joining_batch: "",
        program_id: "",
        attendance_date: new Date().toISOString().split("T")[0],
    });

    const [reportFilters, setReportFilters] = useState({
        institution: "",
        joining_batch: "",
        program_id: "",
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
    });

    const [newProgramName, setNewProgramName] = useState("");
    const [localAttendance, setLocalAttendance] = useState({}); // {student_id: status}
    const [statusFilter, setStatusFilter] = useState("all"); // "all" | "present" | "absent"

    const sortedStudents = useMemo(() => {
        const getRollNum = (v) => {
            const str = (v ?? "").toString();
            const digits = str.replace(/\D/g, "");
            return digits ? Number.parseInt(digits, 10) : Number.POSITIVE_INFINITY;
        };

        return [...students].sort((a, b) => {
            const ar = getRollNum(a?.roll_number);
            const br = getRollNum(b?.roll_number);
            if (ar !== br) return ar - br;

            const as = (a?.roll_number ?? "").toString();
            const bs = (b?.roll_number ?? "").toString();
            const byStr = as.localeCompare(bs, undefined, { numeric: true, sensitivity: "base" });
            if (byStr !== 0) return byStr;

            return (a?.full_name ?? "").localeCompare(b?.full_name ?? "", undefined, { sensitivity: "base" });
        });
    }, [students]);

    // Role-based institution locking
    useEffect(() => {
        if (user?.role === "Hifiz") {
            setFilters(prev => ({ ...prev, institution: "Hifzul Quran College" }));
            setReportFilters(prev => ({ ...prev, institution: "Hifzul Quran College" }));
        } else if (user?.role === "Dawa") {
            setFilters(prev => ({ ...prev, institution: "Uthmaniyya College..." }));
            setReportFilters(prev => ({ ...prev, institution: "Uthmaniyya College..." }));
        }
    }, [user?.role]);

    useEffect(() => {
        dispatch(fetchPrograms());
    }, [dispatch]);

    // Staff should not access admin-only views (report/details)
    useEffect(() => {
        if (!isAdmin && activeTab !== "mark") {
            setActiveTab("mark");
        }
    }, [isAdmin, activeTab]);

    // Marking logic
    useEffect(() => {
        if (filters.institution && filters.joining_batch) {
            dispatch(fetchStudentsForAttendance({
                institution: filters.institution,
                joining_batch: filters.joining_batch
            }));
        }
    }, [dispatch, filters.institution, filters.joining_batch]);

    useEffect(() => {
        // Clear old attendance data when filters change to avoid showing wrong marks
        dispatch(clearAttendanceData());
    }, [dispatch, filters.institution, filters.joining_batch, filters.program_id, filters.attendance_date]);


    useEffect(() => {
        if (filters.program_id && filters.attendance_date) {
            dispatch(fetchAttendanceData({
                program_id: filters.program_id,
                attendance_date: filters.attendance_date
            }));

            const yesterday = new Date(filters.attendance_date);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            
            dispatch(fetchYesterdayAttendanceData({
                program_id: filters.program_id,
                attendance_date: yesterdayStr
            }));
        }
    }, [dispatch, filters.program_id, filters.attendance_date]);

    useEffect(() => {
        if (sortedStudents.length > 0) {
            const initial = {};
            sortedStudents.forEach(s => {
                const existing = attendanceData?.find(a => a.student_id === s.id);
                initial[s.id] = existing !== undefined ? existing.status : true;
            });
            setLocalAttendance(initial);
        }
    }, [sortedStudents, attendanceData]);

    // Report logic
    const handleFetchReport = () => {
        if (reportFilters.institution && reportFilters.joining_batch && reportFilters.program_id) {
            dispatch(fetchAttendanceReport(reportFilters));
        }
    };

    const institutions = [
        {
            instu: "Hifzul Quran College",
            batches: ["HZ1", "HZ2", "HZ3"],
        },
        {
            instu: "Uthmaniyya College...",
            batches: ["HI1", "HI2", "HI3", "HS1", "HS2", "BS1", "BS2", "BS3", "BS4", "BS5"],
        },
    ];

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleReportFilterChange = (e) => {
        setReportFilters({ ...reportFilters, [e.target.name]: e.target.value });
    };

    const toggleStatus = (studentId) => {
        setLocalAttendance(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const handleSave = () => {
        const attendance_data = Object.keys(localAttendance).map(student_id => ({
            student_id,
            status: localAttendance[student_id]
        }));

        dispatch(submitAttendance({
            program_id: filters.program_id,
            attendance_date: filters.attendance_date,
            attendance_data
        }, {
            program_id: filters.program_id,
            attendance_date: filters.attendance_date
        }));
    };


    const handleExcel = () => {
        if (attendanceReport.length === 0) return;
        const data = attendanceReport.map(row => ({
            "Roll No": row.roll_number || '-',
            "Student Name": row.full_name,
            "Batch": row.joining_batch || '-',
            "Total Attendance": row.total_days,
            "Present": row.present_days,
            "Percentage (%)": row.percentage
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
        XLSX.writeFile(workbook, `Attendance_Report_${reportFilters.institution}_${reportFilters.joining_batch}.xlsx`);
    };

    const handlePrint = () => {
        const source = document.getElementById('attendance-report-table');
        const element = source.cloneNode(true);
        element.classList.add('cloned-print-element');
        element.style.padding = '40px';

        const opt = {
            margin: 0,
            filename: `Attendance_Report_${reportFilters.institution}_${reportFilters.joining_batch}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const handlePrintMarking = () => {
        const source = document.getElementById('daily-attendance-table');
        const element = source.cloneNode(true);
        element.classList.add('cloned-print-element');
        element.style.padding = '40px';

        const opt = {
            margin: 0,
            filename: `Attendance_${filters.institution}_${filters.joining_batch}_${filters.attendance_date}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const handleAddProgram = (e) => {


        e.preventDefault();
        if (newProgramName.trim()) {
            dispatch(addProgram({ program_name: newProgramName }));
            setNewProgramName("");
        }
    };

    return (
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full min-h-screen bg-gray-50">
            <div className="flex-1 p-6">
                <Header />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
                        <p className="text-sm text-gray-600">Track and manage student attendance and reports</p>
                    </div>

                    <div className="flex flex-wrap bg-white p-1 rounded-xl shadow-sm border border-gray-100 gap-1">
                        <button
                            onClick={() => setActiveTab("mark")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto justify-center ${activeTab === "mark" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <ListChecks className="w-4 h-4" />
                            Mark Attendance
                        </button>
                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => setActiveTab("report")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto justify-center ${activeTab === "report" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Percentage View
                                </button>
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all w-full sm:w-auto justify-center ${activeTab === "details" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <UserSearch className="w-4 h-4" />
                                    Student Details
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {activeTab === "mark" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Filters & Program Management */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                    <Users className="w-5 h-5" />
                                    Selection Criteria
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Institution</label>
                                        <select
                                            name="institution"
                                            value={filters.institution}
                                            onChange={handleFilterChange}
                                            disabled={!isAdmin}
                                            className="border p-2 rounded-lg bg-gray-50 outline disabled:bg-gray-100 disabled:text-gray-500"
                                        >
                                            <option value="">Select Institution</option>
                                            {institutions.map(i => <option key={i.instu} value={i.instu}>{i.instu}</option>)}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Batch</label>
                                        <select name="joining_batch" value={filters.joining_batch} onChange={handleFilterChange} disabled={!filters.institution} className="border p-2 rounded-lg bg-gray-50 outline-none disabled:opacity-50">
                                            <option value="">Select Batch</option>
                                            {institutions.find(i => i.instu === filters.institution)?.batches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Program</label>
                                        <select name="program_id" value={filters.program_id} onChange={handleFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none">
                                            <option value="">Select Program</option>
                                            {programs.map(p => <option key={p.id} value={p.id}>{p.program_name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                                        <input
                                            type="date"
                                            name="attendance_date"
                                            value={filters.attendance_date}
                                            onChange={handleFilterChange}
                                            disabled={!isAdmin}
                                            className="border p-2 rounded-lg bg-gray-50 outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isAdmin && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600">
                                        <BookOpen className="w-5 h-5" />
                                        Programs
                                    </h2>
                                    <form onSubmit={handleAddProgram} className="flex gap-2 mb-4">
                                        <input type="text" placeholder="New program..." value={newProgramName} onChange={(e) => setNewProgramName(e.target.value)} className="flex-1 border p-2 rounded-lg text-sm outline-none" />
                                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"><Plus className="w-5 h-5" /></button>
                                    </form>
                                    <div className="max-h-48 overflow-y-auto space-y-2 text-sm">
                                        {programs.map(p => (
                                            <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg group">
                                                <span className="text-gray-700 font-medium">{p.program_name}</span>
                                                <button onClick={() => dispatch(deleteProgram(p.id))} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                                <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center sticky top-0 bg-white z-10 gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">Student List</h2>
                                        {filters.institution && (
                                            <p className="text-xs text-blue-600 font-bold">
                                                {filters.institution} - Batch {filters.joining_batch || 'N/A'}
                                            </p>
                                        )}
                                    </div>

                                    {/* STATUS FILTER TOGGLE + PDF — Admin only */}
                                    {isAdmin && (
                                        <>
                                            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 no-print">
                                                <button
                                                    onClick={() => setStatusFilter("all")}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                        statusFilter === "all"
                                                            ? "bg-blue-600 text-white shadow"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    All ({sortedStudents.length})
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter("present")}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                        statusFilter === "present"
                                                            ? "bg-green-600 text-white shadow"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    Present ({Object.values(localAttendance).filter(v => v !== false).length})
                                                </button>
                                                <button
                                                    onClick={() => setStatusFilter("absent")}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                        statusFilter === "absent"
                                                            ? "bg-red-600 text-white shadow"
                                                            : "text-gray-500 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    Absent ({Object.values(localAttendance).filter(v => v === false).length})
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {sortedStudents.length > 0 && (
                                                    <button
                                                        onClick={handlePrintMarking}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                        PDF
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="overflow-x-auto" id="daily-attendance-table">
                                    {/* Professional Print Header (Daily Attendance) - Admin only */}
                                    {isAdmin && (
                                        <div className="print-header p-8 border-b-2 border-gray-100 mb-8 bg-white">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h1 className="text-xl font-black text-blue-900 tracking-tighter uppercase">Attendance Sheet</h1>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Record</p>
                                                    <p className="text-xs text-blue-600 font-bold mt-1">Date: {filters.attendance_date}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-gray-600">Institution: <span className="font-black text-gray-900 ml-1 pb-0.5">{filters.institution || 'N/A'}</span></p>
                                                    <p className="text-sm font-medium text-gray-600">Program: <span className="font-black text-gray-900 ml-1 pb-0.5">{programs.find(p => p.id === filters.program_id)?.program_name || 'N/A'}</span></p>
                                                </div>
                                                <div className="space-y-3">
                                                    <p className="text-sm font-medium text-gray-600">Batch: <span className="font-black text-gray-900 ml-1 pb-0.5">{filters.joining_batch || 'N/A'}</span></p>
                                                    <div className="flex gap-6 items-center mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm border border-green-600"></div>
                                                            <span className="text-xs font-black text-green-700">{Object.values(localAttendance).filter(v => v !== false).length}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm border border-red-600"></div>
                                                            <span className="text-xs font-black text-red-700">{Object.values(localAttendance).filter(v => v === false).length}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {sortedStudents.length > 0 ? (
                                        <div className="p-2">
                                            {/* UI ONLY: ALIGNED SUMMARY */}
                                            <div className="flex items-center gap-6 mb-8 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-fit mx-auto no-print">
                                                {/* PRESENT */}
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-sm bg-green-600"></div>
                                                    <span className="text-xl font-black text-green-700 leading-none">
                                                        {Object.values(localAttendance).filter(v => v !== false).length}
                                                    </span>
                                                </div>

                                                {/* ABSENT */}
                                                <div className="flex items-center gap-2 pr-6 border-r border-gray-100">
                                                    <div className="w-5 h-5 rounded-sm bg-red-600"></div>
                                                    <span className="text-xl font-black text-red-600 leading-none">
                                                        {Object.values(localAttendance).filter(v => v === false).length}
                                                    </span>
                                                </div>

                                                {/* TOTAL */}
                                                <div className="flex items-center gap-2 pl-2">
                                                    <span className="text-xl font-black text-blue-600 leading-none">{sortedStudents.length}</span>
                                                </div>
                                            </div>

                                            {/* UI ONLY: ATTENDANCE GRID */}
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 pb-4 no-print px-6">
                                                {sortedStudents
                                                    .filter(s => {
                                                        if (statusFilter === "present") return localAttendance[s.id] !== false;
                                                        if (statusFilter === "absent") return localAttendance[s.id] === false;
                                                        return true;
                                                    })
                                                    .map((s) => {
                                                    const isAbsentYesterday = yesterdayAttendanceData && yesterdayAttendanceData.some(a => a.student_id === s.id && a.status === false);
                                                    let bgColorClass = "bg-green-600 text-white";
                                                    if (localAttendance[s.id] === false) {
                                                        bgColorClass = "bg-red-600 text-white";
                                                    } else if (isAbsentYesterday) {
                                                        bgColorClass = "bg-yellow-500 text-white";
                                                    }

                                                    return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => toggleStatus(s.id)}
                                                        title={s.full_name}
                                                        className={`aspect-square flex flex-col items-center justify-center p-1 rounded-sm transition-all transform active:scale-95 ${bgColorClass}`}
                                                    >
                                                        <span className="font-black text-xl border-b border-white/30 w-full text-center pb-1 mb-1">{s.roll_number || '-'}</span>
                                                        <span className="text-[10px] font-bold text-center leading-tight line-clamp-2 w-full px-1">{s.full_name}</span>
                                                    </button>
                                                )})}
                                                {sortedStudents.filter(s => {
                                                    if (statusFilter === "present") return localAttendance[s.id] !== false;
                                                    if (statusFilter === "absent") return localAttendance[s.id] === false;
                                                    return false;
                                                }).length === 0 && statusFilter !== "all" && (
                                                    <div className="col-span-full py-10 text-center text-gray-400">
                                                        <p className="text-xs font-bold">No {statusFilter} students found</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* PRINT ONLY: RESPECTS STATUS FILTER */}
                                            <div className="print-only mt-2 px-2">

                                                {/* ── ALL: single combined table with Status column ── */}
                                                {statusFilter === "all" && (
                                                    <div className="mb-8">
                                                        <table className="w-full border-collapse border-b border-gray-100">
                                                            <thead>
                                                                <tr className="bg-gray-50/80 border-t border-b border-gray-200">
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-12">#</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-24">Roll No</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-left">Student Name</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-32">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {sortedStudents.map((s, idx) => (
                                                                    <tr key={s.id} className="border-b border-gray-50">
                                                                        <td className="py-3 px-6 text-center text-xs text-gray-400 font-bold">{idx + 1}</td>
                                                                        <td className="py-3 px-6 text-center font-bold text-blue-600 text-sm">{s.roll_number || '-'}</td>
                                                                        <td className="py-3 px-6 text-sm font-black text-gray-800 uppercase tracking-tight">{s.full_name}</td>
                                                                        <td className="py-3 px-6 text-center">
                                                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${localAttendance[s.id] !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                                {localAttendance[s.id] !== false ? 'Present' : 'Absent'}
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* ── PRESENT ONLY TABLE ── */}
                                                {statusFilter === "present" && (
                                                    <div className="mb-8">
                                                        <div className="flex items-center gap-3 mb-3 px-2">
                                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                            <h3 className="text-sm font-black text-green-700 uppercase tracking-widest">Present Students</h3>
                                                            <span className="ml-auto text-xs font-black bg-green-100 text-green-700 px-3 py-0.5 rounded-full">
                                                                {sortedStudents.filter(s => localAttendance[s.id] !== false).length}
                                                            </span>
                                                        </div>
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-green-50 border-t border-b border-green-200">
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-12">#</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-24">Roll No</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-left">Student Name</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-green-50">
                                                                {sortedStudents
                                                                    .filter(s => localAttendance[s.id] !== false)
                                                                    .map((s, idx) => (
                                                                        <tr key={s.id} className="border-b border-green-50">
                                                                            <td className="py-3 px-6 text-center text-xs text-gray-400 font-bold">{idx + 1}</td>
                                                                            <td className="py-3 px-6 text-center font-bold text-blue-600 text-sm">{s.roll_number || '-'}</td>
                                                                            <td className="py-3 px-6 text-sm font-black text-gray-800 uppercase tracking-tight">{s.full_name}</td>
                                                                        </tr>
                                                                    ))}
                                                                {sortedStudents.filter(s => localAttendance[s.id] !== false).length === 0 && (
                                                                    <tr><td colSpan={3} className="py-4 text-center text-xs text-gray-400 italic">No present students</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* ── ABSENT ONLY TABLE ── */}
                                                {statusFilter === "absent" && (
                                                    <div className="mb-8">
                                                        <div className="flex items-center gap-3 mb-3 px-2">
                                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                            <h3 className="text-sm font-black text-red-700 uppercase tracking-widest">Absent Students</h3>
                                                            <span className="ml-auto text-xs font-black bg-red-100 text-red-700 px-3 py-0.5 rounded-full">
                                                                {sortedStudents.filter(s => localAttendance[s.id] === false).length}
                                                            </span>
                                                        </div>
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-red-50 border-t border-b border-red-200">
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-12">#</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-center w-24">Roll No</th>
                                                                    <th className="py-3 px-6 text-[10px] font-black text-gray-400 uppercase text-left">Student Name</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-red-50">
                                                                {sortedStudents
                                                                    .filter(s => localAttendance[s.id] === false)
                                                                    .map((s, idx) => (
                                                                        <tr key={s.id} className="border-b border-red-50">
                                                                            <td className="py-3 px-6 text-center text-xs text-gray-400 font-bold">{idx + 1}</td>
                                                                            <td className="py-3 px-6 text-center font-bold text-blue-600 text-sm">{s.roll_number || '-'}</td>
                                                                            <td className="py-3 px-6 text-sm font-black text-gray-800 uppercase tracking-tight">{s.full_name}</td>
                                                                        </tr>
                                                                    ))}
                                                                {sortedStudents.filter(s => localAttendance[s.id] === false).length === 0 && (
                                                                    <tr><td colSpan={3} className="py-4 text-center text-xs text-gray-400 italic">No absent students</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {/* Print Only: Signatures */}
                                                <div className="mt-20 grid grid-cols-2 gap-24 px-12">
                                                    <div className="text-center pt-8 border-t border-dashed border-gray-300">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Class Teacher Signature</p>
                                                    </div>
                                                    <div className="text-center pt-8 border-t border-dashed border-gray-300">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Principal Approval</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-20 text-center text-gray-400">
                                            <Users className="w-12 h-12 mx-auto mb-2 opacity-10" />
                                            <p>Select Institution and Batch to mark attendance</p>
                                        </div>
                                    )}
                                </div>
                                {sortedStudents.length > 0 && (
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                        <p className="text-xs text-gray-500 italic">Mark status and click save</p>
                                        <button onClick={handleSave} disabled={loading || !filters.program_id} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50">Save</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeTab === "report" ? (
                    <div className="space-y-6">
                        {/* Report Filters */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-600">
                                <Calendar className="w-5 h-5" />
                                Report Parameters
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Institution</label>
                                    <select
                                        name="institution"
                                        value={reportFilters.institution}
                                        onChange={handleReportFilterChange}
                                        disabled={!isAdmin}
                                        className="border p-2 rounded-lg bg-gray-50 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                    >
                                        <option value="">Select Institution</option>
                                        {institutions.map(i => <option key={i.instu} value={i.instu}>{i.instu}</option>)}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Batch</label>
                                    <select name="joining_batch" value={reportFilters.joining_batch} onChange={handleReportFilterChange} disabled={!reportFilters.institution} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm disabled:opacity-50">
                                        <option value="">Select Batch</option>
                                        <option value="all">All Batches</option>
                                        {institutions.find(i => i.instu === reportFilters.institution)?.batches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Program</label>
                                    <select name="program_id" value={reportFilters.program_id} onChange={handleReportFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm">
                                        <option value="">Select Program</option>
                                        <option value="all">All Programs</option>
                                        {programs.map(p => <option key={p.id} value={p.id}>{p.program_name}</option>)}
                                    </select>

                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                                    <input type="date" name="start_date" value={reportFilters.start_date} onChange={handleReportFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                                    <div className="flex gap-2">
                                        <input type="date" name="end_date" value={reportFilters.end_date} onChange={handleReportFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm flex-1" />
                                        <button onClick={handleFetchReport} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md">Get</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Report Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-lg font-semibold">Attendance Percentage Report</h2>
                                    {attendanceReport.length > 0 && <span className="text-xs font-bold text-blue-600">{attendanceReport.length} Students Found</span>}
                                </div>

                                {attendanceReport.length > 0 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handlePrint}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                                        >
                                            <Printer className="w-4 h-4" />
                                            PDF
                                        </button>
                                        <button
                                            onClick={handleExcel}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200 transition"
                                        >
                                            <FileSpreadsheet className="w-4 h-4" />
                                            Excel
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="overflow-x-auto" id="attendance-report-table">
                                {/* Professional Print Header (Percentage Report) - Admin only */}
                                {isAdmin && (
                                    <div className="print-header p-8 border-b-2 border-gray-100 mb-8 bg-white uppercase">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h1 className="text-xl font-black text-blue-900 tracking-tighter">Attendance Performance Report</h1>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Analytical Record</p>
                                                <p className="text-xs text-blue-600 font-bold mt-1">Period: {reportFilters.start_date} to {reportFilters.end_date}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                            <p className="text-sm font-medium text-gray-600 tracking-tight">Institution: <span className="font-black text-gray-900 ml-1">{reportFilters.institution || 'ALL'}</span></p>
                                            <p className="text-sm font-medium text-gray-600 tracking-tight">Batch Identifier: <span className="font-black text-gray-900 ml-1">{reportFilters.joining_batch || 'ALL'}</span></p>
                                            <p className="text-sm font-medium text-gray-600 tracking-tight">Program Focus: <span className="font-black text-gray-900 ml-1">{reportFilters.program_id === 'all' ? 'Unified (All Programs)' : (programs.find(p => p.id === reportFilters.program_id)?.program_name || 'N/A')}</span></p>
                                            <p className="text-sm font-black text-blue-700 italic tracking-tighter">Generated on {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}


                                {loading ? (
                                    <div className="p-20 text-center">
                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-500">Calculating stats...</p>
                                    </div>
                                ) : attendanceReport.length > 0 ? (
                                    <>
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase border-y border-gray-200">
                                                <tr>
                                                    <th className="py-4 px-6 text-center w-24">Roll No</th>
                                                    <th className="py-4 px-6 text-left">Student Name</th>
                                                    <th className="py-4 px-6 text-center w-24">Batch</th>
                                                    <th className="py-4 px-6 text-center w-32">Total</th>
                                                    <th className="py-4 px-6 text-center w-24 text-green-600">Present</th>
                                                    <th className="py-4 px-6 text-center w-24 text-red-500">Absent</th>
                                                    <th className="py-4 px-6 text-center w-40">Attendance %</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 font-medium">
                                                {attendanceReport.map((row) => (
                                                    <tr key={row.id} className="hover:bg-blue-50/30 transition-colors border-b border-gray-50">
                                                        <td className="py-4 px-6 text-center font-bold text-blue-600 tracking-wider bg-blue-50/20 text-sm">{row.roll_number || '-'}</td>
                                                        <td className="py-4 px-6 text-left font-black text-gray-800 uppercase text-xs tracking-tight">{row.full_name}</td>
                                                        <td className="py-4 px-6 text-center text-gray-700 font-bold text-sm bg-gray-50/50">{row.joining_batch || '-'}</td>
                                                        <td className="py-4 px-6 text-center text-gray-600 text-sm font-bold">{row.total_days}</td>
                                                        <td className="py-4 px-6 text-center text-green-600 font-bold text-sm tracking-tighter">{row.present_days}</td>
                                                        <td className="py-4 px-6 text-center text-red-500 font-bold text-sm tracking-tighter">{row.total_days - row.present_days}</td>
                                                        <td className="py-4 px-6 text-center">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className={`text-sm font-black ${row.percentage >= 75 ? 'text-green-600' : 'text-orange-600'}`}>{row.percentage}%</span>
                                                                <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden no-print">
                                                                    <div className={`h-full ${row.percentage >= 75 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${row.percentage}%` }}></div>
                                                                </div>
                                                                <div className="print-only">
                                                                    <span className={`text-[9px] font-black tracking-widest uppercase ${row.percentage >= 75 ? 'text-green-500' : 'text-orange-600'}`}>
                                                                        {row.percentage >= 75 ? 'Excellent' : 'Low Status'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Print Only: Performance Signatures */}
                                        <div className="print-only mt-24 flex justify-between px-16 pb-12">
                                            <div className="text-center">
                                                <div className="h-0.5 w-56 bg-gray-300 mb-3"></div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Coordinator</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="h-0.5 w-56 bg-gray-300 mb-3"></div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Principal Signature</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-20 text-center text-gray-400">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-10" />
                                        <p>Select date range and click "Get" to generates statistics</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : activeTab === "details" ? (
                    <StudentDetailedAttendance />
                ) : null}
            </div>
        </main>
    );
};

export default Attendance;
