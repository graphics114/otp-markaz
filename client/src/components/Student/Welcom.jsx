import { useSelector } from "react-redux";
import Header from "../Student/Head";
import { User, GraduationCap, BookOpen, Calendar, Quote, ChevronRight, ClipboardCheck, ChartBar } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios.js";

const Welcom = () => {
    const { user } = useSelector((state) => state.auth);
    const [dateString, setDateString] = useState("");
    const [attendanceSummary, setAttendanceSummary] = useState(null);

    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDateString(new Date().toLocaleDateString('en-US', options));
        fetchAttendanceSummary();
    }, []);

    const fetchAttendanceSummary = async () => {
        try {
            // Set end_date to today and start_date to 30 days ago
            const end_date = new Date().toISOString().split('T')[0];
            const start_date = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

            const { data } = await axiosInstance.get("/attendance/my-attendance", {
                params: { start_date, end_date }
            });

            if (data.success) {
                setAttendanceSummary({
                    latest: data.latest,
                    stats: data.stats
                });
            }
        } catch (error) {
            console.error("Error fetching attendance summary:", error);
        }
    };


    return (
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full bg-gray-50 min-h-screen">
            {/* HEADER */}
            <div className="p-6 pb-2">
                <Header />
            </div>

            {/* CONTENT */}
            <div className="px-4 md:px-6 pb-12 pt-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* HERO SECTION */}
                    <div className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl overflow-hidden flex flex-col justify-center">
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 max-w-3xl">
                            <div className="flex items-center gap-2 mb-4 text-blue-100 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                <Calendar className="w-3 h-3" />
                                <span>{dateString}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                Welcome back, <br />
                                <span className="text-blue-200">{user?.full_name}, {user?.student_details?.locality}!</span>
                            </h1>
                            <p className="text-blue-100 text-lg md:text-xl max-w-xl opacity-90">
                                "Seek knowledge from the cradle to the grave."
                            </p>
                        </div>
                    </div>

                    {/* MINI PROFILE SUMMARY */}
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center h-full">
                        <h3 className="text-xl font-bold">{user?.full_name}</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {user?.student_details?.reg_number || user?.reg_number || "No Reg No"}
                        </p>

                        <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                                <p className="text-green-400 font-medium">Active</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Course</p>
                                <p className="text-gray-300 font-medium text-sm truncate">
                                    {user?.student_details?.joining_batch || user?.joining_batch || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ATTENDANCE SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* LATEST STATUS */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between ring-1 ring-gray-200/50">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${attendanceSummary?.latest?.status ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Latest Attendance</p>
                                <h4 className="text-lg font-bold text-gray-800">
                                    {attendanceSummary?.latest ? (attendanceSummary.latest.status ? "Present" : "Absent") : "No Data"}
                                </h4>
                                <p className="text-xs text-gray-400 italic">
                                    {attendanceSummary?.latest ? new Date(attendanceSummary.latest.attendance_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : "---"}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>

                    {/* MONTHLY SUMMARY */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 ring-1 ring-gray-200/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <ChartBar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance (Last 30 Days)</p>
                                    <h4 className="text-2xl font-black text-gray-800">
                                        {attendanceSummary?.stats?.percentage || "0.00"}%
                                    </h4>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                                <p className={`text-xs font-bold ${Number(attendanceSummary?.stats?.percentage) >= 75 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {Number(attendanceSummary?.stats?.percentage) >= 75 ? 'Good' : 'Low'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100/50 group hover:bg-green-50 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Present</p>
                                </div>
                                <p className="text-2xl font-black text-green-700">
                                    {attendanceSummary?.stats?.present_days || 0}
                                    {/* <span className="text-xs font-medium text-green-600 ml-1">Days</span> */}
                                </p>
                            </div>
                            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50 group hover:bg-red-50 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Absent</p>
                                </div>
                                <p className="text-2xl font-black text-red-700">
                                    {attendanceSummary?.stats?.absent_days || 0}
                                    {/* <span className="text-xs font-medium text-red-600 ml-1">Days</span> */}
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-2 bg-gray-100 rounded-full mt-6 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ${Number(attendanceSummary?.stats?.percentage) >= 75 ? 'bg-green-500' : 'bg-orange-500'}`}
                                style={{ width: `${attendanceSummary?.stats?.percentage || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Welcom;
