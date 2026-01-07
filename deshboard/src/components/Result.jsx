import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { BookOpenCheck, ChevronRight } from 'lucide-react';

import Hifiz from "../pages/Hifiz";
import DawaResult from "./dawa/DawaResult";
import { toggleHifizCollage, toggleDawaCollage } from "../store/slices/extraSlice";

const Result = () => {
    const dispatch = useDispatch();
    const { isHifizCollageOpened, isDawaCollageOpened } = useSelector((state) => state.extra);

    const institutions = [
        {
            id: "hifiz",
            name: "Hifzul Quran College",
            description: "Manage memory-focused quranic studies results",
            color: "from-emerald-500 to-teal-600",
            onClick: () => dispatch(toggleHifizCollage())
        },
        {
            id: "uthmaniyya",
            name: "Uthmaniyya College",
            description: "Excellence in academic and religious education",
            color: "from-blue-600 to-indigo-700",
            onClick: () => dispatch(toggleDawaCollage())
        }
    ];

    // If any institution view is opened, we render that instead of the grid
    if (isHifizCollageOpened) {
        return <Hifiz />;
    }

    if (isDawaCollageOpened) {
        return <DawaResult onBack={() => dispatch(toggleDawaCollage())} />;
    }

    return (
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full min-h-screen bg-gray-50/30 font-sans">
            {/* HEADER */}
            <div className="flex-1 p-6">
                <Header />
                <div className="mt-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Main Results</h1>
                    <p className="text-sm text-gray-400 mt-1">Select an institution to manage results</p>
                </div>
            </div>

            {/* INSTITUTIONS GRID */}
            <div className="px-4 sm:px-6 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {institutions.map((inst) => (
                        <button
                            key={inst.id}
                            onClick={inst.onClick}
                            className="group relative overflow-hidden bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-start p-6 sm:p-8 text-left"
                        >
                            {/* Background Accent */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${inst.color} opacity-5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700`} />

                            {/* Icon Decoration */}
                            <div className={`mb-4 sm:mb-6 p-4 rounded-2xl bg-gradient-to-br ${inst.color} text-white shadow-xl group-hover:rotate-6 transition-all duration-300`}>
                                <BookOpenCheck className="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>

                            <div className="relative z-10 flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                    {inst.name}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-3 leading-relaxed">
                                    {inst.description}
                                </p>
                            </div>

                            <div className="mt-6 sm:mt-8 flex items-center text-blue-600 font-bold text-sm sm:text-base group-hover:translate-x-2 transition-transform">
                                <span>Check Results</span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                            </div>

                            {/* Subtle Loading Line/Glow */}
                            <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${inst.color} w-0 group-hover:w-full transition-all duration-500`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* INFO BANNER */}
            <div className="px-6 pb-12">
                <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <circle cx="10" cy="10" r="20" fill="white" />
                            <circle cx="90" cy="90" r="30" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-bold">Centralized Grading System</h2>
                            <p className="text-blue-200 mt-4 max-w-lg text-lg">
                                Monitor academic progress across all affiliated colleges.
                                Update marks, publish results, and generate performance reports instantly.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center min-w-[120px]">
                                <p className="text-blue-300 text-xs font-black uppercase tracking-widest">Active Inst.</p>
                                <p className="text-4xl font-bold mt-2">02</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 text-center min-w-[120px]">
                                <p className="text-blue-300 text-xs font-black uppercase tracking-widest">Status</p>
                                <p className="text-4xl font-bold mt-2 text-emerald-400">●</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Result;