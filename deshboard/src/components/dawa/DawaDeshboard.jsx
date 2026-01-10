import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../DeshHeader";
import CountUp from "react-countup";
import { Users, GraduationCap, ClipboardList, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { dawaDashboardStats } from "../../store/slices/deshboarSlice";

const COLORS = ["#2563eb", "#9333ea"];

const DawaDeshboard = () => {
  const dispatch = useDispatch();
  const { cards, loading } = useSelector((state) => state.desh);

  useEffect(() => {
    dispatch(dawaDashboardStats());
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
      value: cards?.dawa_students || 0,
      icon: GraduationCap,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Admissions",
      value: cards?.dawa_admissions || 0,
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
    { name: "Uthmaniyya College...", value: cards?.dawa_students || 0 },
  ];

  const admissionsData = [
    { name: "Uthmaniyya College of Excellence", value: cards?.dawa_admissions || 0 },
  ];

  const resultData = [
    { name: "Published", value: cards?.published_results || 0 },
    { name: "Pending", value: cards?.pending_results || 0 },
  ];

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] mx-4 w-full min-h-screen pt-10">

      <Header />
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-7 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Uthmaniyya College of Excellence Dashboard</h1>
        <p className="text-sm opacity-90">
          Students, admissions & results overview
        </p>

        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full" />
        <div className="absolute -right-10 -bottom-20 w-72 h-72 bg-white/5 rounded-full" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading dashboard data...
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                >
                  <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                  <h2 className="text-3xl font-bold">
                    <CountUp end={item.value} duration={1.2} />
                  </h2>

                  <div
                    className={`absolute top-5 right-5 p-3 rounded-xl ${item.color}`}
                  >
                    <Icon size={22} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ANALYTICS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* STUDENTS */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-1">
                Students by Institution
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Institution-wise enrolled students
              </p>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={studentsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ADMISSIONS */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-1">
                Admissions by Institution
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Current admission distribution
              </p>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={admissionsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* RESULTS */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-1">
                Results Status
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Published vs Pending results (This Month)
              </p>

              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={resultData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    label
                  >
                    {resultData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === 0 ? "#16a34a" : "#f59e0b"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* LEGEND */}
              <div className="flex justify-center gap-6 mt-4 text-sm">
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
        </>
      )}
    </main>
  );

};

export default DawaDeshboard;