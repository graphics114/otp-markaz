import { useSelector } from "react-redux";
import Header from "../Student/Head";
import { User, GraduationCap, BookOpen, Calendar, Quote, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Welcom = () => {
    const { user } = useSelector((state) => state.auth);
    const [dateString, setDateString] = useState("");

    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setDateString(new Date().toLocaleDateString('en-US', options));
    }, []);

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
                        <div className="w-20 h-20 rounded-full bg-gray-700 mb-4 overflow-hidden border-4 border-gray-600">
                            <img
                                src={user?.avatar?.url}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400 hidden">
                                {user?.full_name?.charAt(0)}
                            </div>
                        </div>
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

            </div>
        </main>
    );
}

export default Welcom;