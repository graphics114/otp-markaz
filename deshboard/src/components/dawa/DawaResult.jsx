import Header from "../Header";
import { BookOpenCheck, ChevronRight } from 'lucide-react';

const DawaResult = ({ onBack }) => {
    const courses = [
        { id: "HI1", name: "HI 1", color: "from-blue-500 to-indigo-600" },
        { id: "HI2", name: "HI 2", color: "from-indigo-500 to-purple-600" },
        { id: "HS1", name: "HS 1", color: "from-purple-500 to-pink-600" },
        { id: "HS2", name: "HS 2", color: "from-pink-500 to-rose-600" },
        { id: "BS1", name: "BS 1", color: "from-orange-500 to-red-600" },
        { id: "BS2", name: "BS 2", color: "from-amber-500 to-orange-600" },
        { id: "BS3", name: "BS 3", color: "from-yellow-500 to-amber-600" },
        { id: "BS4", name: "BS 4", color: "from-emerald-500 to-teal-600" },
        { id: "BS5", name: "BS 5", color: "from-cyan-500 to-blue-600" },
    ];

    return (
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full min-h-screen bg-gray-50/50">
            {/* HEADER */}
            <div className="flex-1 p-6">
                <Header />
                <div className="mt-4">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            ← Back to Institutions
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Results Management</h1>
                    <p className="text-gray-500 mt-1">Select a course to manage and view student examination results</p>
                </div>
            </div>

            {/* COURSES GRID */}
            <div className="px-6 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <button
                            key={course.id}
                            className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-start p-6 text-left"
                        >
                            {/* Gradient Background Decoration */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.color} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`} />

                            {/* Icon Container */}
                            <div className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${course.color} text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-300`}>
                                <BookOpenCheck className="w-6 h-6" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {course.name}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                                    Examination Module
                                </p>
                            </div>

                            <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                <span>Check Results</span>
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </div>

                            {/* Bottom Border Glow */}
                            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${course.color} w-0 group-hover:w-full transition-all duration-500`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* QUICK STATS/INFO SECTION (Optional Aesthetic Addition) */}
            <div className="px-6 pb-12">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white" />
                        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-8 border-white" />
                    </div>
                    <div className="relative z-10 md:flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Manage Results Effeciently</h2>
                            <p className="text-gray-400 mt-2 max-w-md">Access detailed analytics and individual student reports for all courses in Uthmaniyya College of Excellence.</p>
                        </div>
                        <div className="mt-6 md:mt-0 flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <p className="text-xs text-gray-400 uppercase font-bold">Courses</p>
                                <p className="text-2xl font-bold">09</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <p className="text-xs text-gray-400 uppercase font-bold">Action</p>
                                <p className="text-sm font-semibold mt-1">Ready to Grade</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DawaResult;