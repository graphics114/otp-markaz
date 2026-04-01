import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchStudentsForAttendance,
    fetchStudentDetailedAttendance,
    clearStudentDetailedAttendance
} from "../store/slices/attendanceSlice";
import { Users, Calendar, BarChart3, Printer } from "lucide-react";
import html2pdf from "html2pdf.js";

const StudentDetailedAttendance = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading, students, studentDetailedAttendance } = useSelector((state) => state.attendance);

    const [filters, setFilters] = useState({
        institution: user?.role === "Hifiz" ? "Hifzul Quran College" : user?.role === "Dawa" ? "Uthmaniyya College..." : "",
        joining_batch: "",
        student_id: "",
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
    });

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

    useEffect(() => {
        if (filters.institution && filters.joining_batch) {
            dispatch(fetchStudentsForAttendance({
                institution: filters.institution,
                joining_batch: filters.joining_batch
            }));
        }
    }, [dispatch, filters.institution, filters.joining_batch]);

    useEffect(() => {
        // Clear detailed attendance if student selection changes
        dispatch(clearStudentDetailedAttendance());
    }, [filters.student_id, dispatch]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleFetchReport = () => {
        if (filters.student_id && filters.start_date && filters.end_date) {
            dispatch(fetchStudentDetailedAttendance(filters.student_id, {
                start_date: filters.start_date,
                end_date: filters.end_date
            }));
        }
    };

    const handlePrint = () => {
        const source = document.getElementById('student-details-report-table');
        const element = source.cloneNode(true);
        element.classList.add('cloned-print-element');
        element.style.padding = '40px';

        const opt = {
            margin: 0,
            filename: `Student_Detailed_Attendance_${filters.start_date}_to_${filters.end_date}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-blue-600">
                    <Calendar className="w-5 h-5" />
                    Student Details Parameters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Institution</label>
                        <select
                            name="institution"
                            value={filters.institution}
                            onChange={handleFilterChange}
                            disabled={user?.role !== "Admin"}
                            className="border p-2 rounded-lg bg-gray-50 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
                        >
                            <option value="">Select Institution</option>
                            {institutions.map(i => <option key={i.instu} value={i.instu}>{i.instu}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Batch</label>
                        <select name="joining_batch" value={filters.joining_batch} onChange={handleFilterChange} disabled={!filters.institution} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm disabled:opacity-50">
                            <option value="">Select Batch</option>
                            <option value="all">All Batches</option>
                            {institutions.find(i => i.instu === filters.institution)?.batches.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Select Student</label>
                        <select name="student_id" value={filters.student_id} onChange={handleFilterChange} disabled={!students.length} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm disabled:opacity-50">
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.roll_number} - {s.full_name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                        <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                        <div className="flex gap-2">
                            <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} className="border p-2 rounded-lg bg-gray-50 outline-none text-sm flex-1" />
                            <button onClick={handleFetchReport} disabled={loading || !filters.student_id} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50">Get</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-semibold">Student Comprehensive Attendance</h2>
                    </div>

                    {studentDetailedAttendance?.attendance?.length > 0 && (
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition"
                        >
                            <Printer className="w-4 h-4" />
                            PDF
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto" id="student-details-report-table">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading details...</p>
                        </div>
                    ) : studentDetailedAttendance ? (
                        <div className="p-8">
                            <div className="print-header mb-8 bg-white uppercase">
                                <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-8">
                                    <div>
                                        <h1 className="text-xl font-black text-blue-900 tracking-tighter">Detailed Student Attendance</h1>
                                        <p className="text-sm font-bold text-gray-600 mt-2">{studentDetailedAttendance.student.full_name}</p>
                                        <p className="text-xs text-gray-500 mt-1">Roll No: {studentDetailedAttendance.student.roll_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Individual Record</p>
                                        <p className="text-xs text-blue-600 font-bold mt-1">Period: {filters.start_date} to {filters.end_date}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Total Days</p>
                                        <p className="text-2xl font-black text-blue-600">{studentDetailedAttendance.stats.total_days}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Present</p>
                                        <p className="text-2xl font-black text-green-600">{studentDetailedAttendance.stats.present_days}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Absent</p>
                                        <p className="text-2xl font-black text-red-600">{studentDetailedAttendance.stats.absent_days}</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Percentage</p>
                                        <p className={`text-2xl font-black ${studentDetailedAttendance.stats.percentage >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {studentDetailedAttendance.stats.percentage}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left border-collapse border border-gray-100">
                                <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase border-y border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Date</th>
                                        <th className="py-4 px-6 text-left">Program</th>
                                        <th className="py-4 px-6 text-center w-32">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-medium">
                                    {studentDetailedAttendance.attendance?.length > 0 ? studentDetailedAttendance.attendance.map((row, index) => (
                                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-4 px-6 text-sm font-bold text-gray-800">
                                                {new Date(row.attendance_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 font-bold">{row.program_name}</td>
                                            <td className="py-4 px-6 text-center">
                                                <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter ${row.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {row.status ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-gray-500">No records found for this period.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

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
                        </div>
                    ) : (
                        <div className="p-20 text-center text-gray-400">
                            <Users className="w-12 h-12 mx-auto mb-2 opacity-10" />
                            <p>Select a student and date range to view detailed attendance</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetailedAttendance;
