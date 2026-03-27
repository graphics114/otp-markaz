import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Student/Head";
import { Calendar, CheckCircle, XCircle, Clock, ChartBar, Filter } from "lucide-react";

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
    });

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/attendance/my-attendance`, {
                params: dateRange,
                withCredentials: true
            });
            if (data.success) {
                setAttendance(data.attendance);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleFilterChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full bg-gray-50 min-h-screen">
            <div className="p-6 pb-2">
                <Header />
            </div>

            <div className="px-4 md:px-6 pb-12 pt-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2 font-outfit">My Attendance</h1>
                    <p className="text-gray-500 text-sm">Track your attendance and performance</p>
                </div>

                {/* FILTERS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={dateRange.start_date}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={dateRange.end_date}
                                onChange={handleFilterChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={fetchAttendance}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                </div>

                {stats && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* PERCENTAGE CARD */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                    <ChartBar className="w-5 h-5 text-blue-100" />
                                </div>
                                <span className="text-xs font-bold text-blue-100/60 uppercase">Percentage</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black mb-1">{stats.percentage}%</h3>
                                <p className="text-blue-100/60 text-xs font-medium">Overall Attendance</p>
                            </div>
                        </div>

                        {/* TOTAL DAYS */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between ring-1 ring-gray-200/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-gray-100 rounded-xl">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Total</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-gray-800 mb-1">{stats.total_days}</h3>
                                <p className="text-gray-400 text-xs font-medium">Attandence Found</p>
                            </div>
                        </div>

                        {/* PRESENT DAYS */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between ring-1 ring-gray-200/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-green-50 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Present</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-green-600 mb-1">{stats.present_days}</h3>
                                <p className="text-gray-400 text-xs font-medium">Attandence you were present</p>
                            </div>
                        </div>

                        {/* ABSENT DAYS */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between ring-1 ring-gray-200/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-red-50 rounded-xl">
                                    <XCircle className="w-5 h-5 text-red-500" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase">Absent</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-red-500 mb-1">{stats.absent_days}</h3>
                                <p className="text-gray-400 text-xs font-medium">Attandence you were absent</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ATTENDANCE TABLE */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-200/50">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">History Log</h3>
                        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Detailed View</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Program / Session</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-400">Loading data...</td>
                                    </tr>
                                ) : attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-gray-400">No records found for this period</td>
                                    </tr>
                                ) : (
                                    attendance.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600">
                                                        <span className="text-[10px] font-bold uppercase leading-none">{new Date(row.attendance_date).toLocaleString('en-US', { month: 'short' })}</span>
                                                        <span className="text-lg font-black leading-none">{new Date(row.attendance_date).getDate()}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{new Date(row.attendance_date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                                        <p className="text-xs text-gray-400 tracking-wide">{row.attendance_date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-700">{row.program_name}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {row.status ? (
                                                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-green-200">
                                                        <CheckCircle className="w-3 h-3" /> Present
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ring-red-200">
                                                        <XCircle className="w-3 h-3" /> Absent
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default StudentAttendance;
