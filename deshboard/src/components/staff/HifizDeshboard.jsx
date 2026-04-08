import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../DeshHeader";
import CountUp from "react-countup";
import { Users, GraduationCap, ClipboardList, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { hifizDashboardStats } from "../../store/slices/deshboarSlice";

const StaffDeshboard = () => {
  const dispatch = useDispatch();
  const { cards, loading } = useSelector((state) => state.desh);

  useEffect(() => {
    dispatch(hifizDashboardStats());
  }, [dispatch]);

  /* STAT CARDS */
  const stats = [
    {
      title: "Total Users",
      value: cards?.total_users || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Students",
      value: cards?.hifzul_students || 0,
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Admissions",
      value: cards?.hifzul_admissions || 0,
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Results",
      value: cards?.total_results || 0,
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  /* GRAPH DATA */
  const studentsData = [
    { name: "Hifzul Quran College", value: cards?.hifzul_students || 0 },
  ];

  const admissionsData = [
    { name: "Hifzul Quran College", value: cards?.hifzul_admissions || 0 },
  ];

  const resultData = [
    { name: "Published", value: cards?.published_results || 0 },
    { name: "Pending", value: cards?.pending_results || 0 },
  ];

  return (
    <main className="flex-1 min-h-screen md:pl-[17rem] overflow-x-hidden bg-gray-50/50">
      <div className="p-3 sm:p-5 lg:p-6 pt-10">

        <Header />

        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 sm:p-6 lg:p-7 mb-5 sm:mb-8 shadow-lg">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1">Hifzul Quran College Dashboard</h1>
          <p className="text-xs sm:text-sm opacity-90">Students, admissions &amp; results overview</p>
          <div className="absolute -right-20 -top-20 w-48 sm:w-72 h-48 sm:h-72 bg-white/10 rounded-full" />
          <div className="absolute -right-10 -bottom-20 w-48 sm:w-72 h-48 sm:h-72 bg-white/5 rounded-full" />
        </div>

        {/* LATEST ATTENDANCE CARD */}
        {cards?.latest_attendance && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8 shadow-sm border border-gray-100 border-l-4 border-l-blue-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Latest Attendance Recorded</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-gray-800">{cards.latest_attendance.program_name}</h3>
              <p className="text-xs text-gray-400">
                Recorded on {new Date(cards.latest_attendance.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Present</p>
                <h4 className="text-xl sm:text-2xl font-black text-green-600"><CountUp end={cards.latest_attendance.present} /></h4>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Absent</p>
                <h4 className="text-xl sm:text-2xl font-black text-red-500"><CountUp end={cards.latest_attendance.absent} /></h4>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading dashboard data...</div>
        ) : (
          <>
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-10">
              {stats.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">{item.title}</p>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      <CountUp end={item.value} duration={1.2} />
                    </h2>
                    <div className={`absolute top-3 right-3 sm:top-5 sm:right-5 p-2 sm:p-3 rounded-xl ${item.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ANALYTICS CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">

              {/* RESULTS PIE */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-base sm:text-lg mb-1">Results Status</h3>
                <p className="text-xs text-gray-500 mb-3 sm:mb-4">Published vs Pending (This Month)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={resultData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      label
                    >
                      {resultData.map((_, index) => (
                        <Cell key={index} fill={index === 0 ? "#16a34a" : "#f59e0b"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-600" />
                    Published
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* BATCH ATTENDANCE SUMMARY TABLE */}
            {cards?.batch_attendance?.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h2 className="text-base sm:text-xl font-bold text-gray-800">Batch-wise Attendance Summary</h2>
                </div>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[360px]">
                      <thead className="bg-gray-50 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <tr>
                          <th className="py-3 px-3 sm:px-4 text-center">Batch</th>
                          <th className="py-3 px-2 sm:px-4 text-center">Date</th>
                          <th className="py-3 px-2 sm:px-4 text-center text-green-600">Present</th>
                          <th className="py-3 px-2 sm:px-4 text-center text-red-500">Absent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {cards.batch_attendance.map((batch, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                            <td className="py-3 px-3 sm:px-4 text-center">
                              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                                {batch.batch}
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-center text-[10px] sm:text-xs text-gray-400 font-medium">
                              {new Date(batch.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-center">
                              <span className="text-base sm:text-lg font-black text-green-600">
                                <CountUp end={batch.present} />
                              </span>
                            </td>
                            <td className="py-3 px-2 sm:px-4 text-center">
                              <span className="text-base sm:text-lg font-black text-red-500">
                                <CountUp end={batch.absent} />
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* GRAND TOTAL */}
                        <tr className="bg-blue-50/40 font-black border-t-2 border-blue-100">
                          <td className="py-4 px-3 sm:px-4 text-blue-700 text-xs sm:text-sm" colSpan={2}>GRAND TOTAL</td>
                          <td className="py-4 px-2 sm:px-4 text-center">
                            <span className="text-base sm:text-xl text-green-700">
                              <CountUp end={cards.batch_attendance.reduce((sum, b) => sum + b.present, 0)} />
                            </span>
                          </td>
                          <td className="py-4 px-2 sm:px-4 text-center">
                            <span className="text-base sm:text-xl text-red-600">
                              <CountUp end={cards.batch_attendance.reduce((sum, b) => sum + b.absent, 0)} />
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );

};

export default StaffDeshboard;