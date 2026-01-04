import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, School, BookOpen } from "lucide-react";

import InHome from "../components/Institutions/Home";
import HifzulQuran from "../components/Institutions/HifzulQuran";
import Uthmaniyya from "../components/Institutions/UthmaniCollege";
import IcsSchool from "../components/Institutions/Ics";
import Nios from "../components/Institutions/Nios";
import Thibyan from "../components/Institutions/Thibyan";
import Moc from "../components/Institutions/Moc";
import Hadiya from "../components/Institutions/Hadiya";
import Madrasa from "../components/Institutions/Madrasa";
import Santhwanam from "../components/Institutions/Santhwanam";
import Masjid from "../components/Institutions/Masjid";

const Institutions = () => {
    const location = useLocation();

    // Sidebar Navigation Items
    const navItems = [
        { name: "All Institutions", path: "/institutions", end: true },
        { name: "Hifzul Qur'an College", path: "/institutions/hifzulquran" },
        { name: "Uthmaniyya College", path: "/institutions/uthmaniyya" },
        { name: "Islamic Central School", path: "/institutions/ics" },
        { name: "NIOS", path: "/institutions/nios" },
        { name: "Thibyan Pre School", path: "/institutions/thibyan" },
        { name: "Markaz Oriental College", path: "/institutions/moc" },
        { name: "Hadiya Women's College", path: "/institutions/hadiya" },
        { name: "Isha'Athul Islam Madrasa", path: "/institutions/madrasa" },
        { name: "Santhwana Kendram", path: "/institutions/santhwanam" },
        { name: "Masjidul Isha'a", path: "/institutions/masjid" },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar Navigation */}
                    <aside className="w-full lg:w-72 flex-shrink-0 animate-slide-in-left">
                        <div className="bg-secondary/10 rounded-xl p-4 sticky top-24 border border-border/50">
                            <h3 className="text-lg font-bold mb-4 px-2 flex items-center gap-2">
                                <School className="w-5 h-5 text-blue-600" />
                                Departments
                            </h3>
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                                             ${isActive
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm"
                                            }`
                                        }
                                    >
                                        {item.name}
                                        {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 animate-fade-in-up">
                        <div className="bg-background rounded-2xl md:p-6 min-h-[500px]">
                            <Routes>
                                <Route index element={<InHome />} />
                                <Route path="hifzulquran" element={<HifzulQuran />} />
                                <Route path="uthmaniyya" element={<Uthmaniyya />} />
                                <Route path="ics" element={<IcsSchool />} />
                                <Route path="nios" element={<Nios />} />
                                <Route path="thibyan" element={<Thibyan />} />
                                <Route path="moc" element={<Moc />} />
                                <Route path="hadiya" element={<Hadiya />} />
                                <Route path="madrasa" element={<Madrasa />} />
                                <Route path="santhwanam" element={<Santhwanam />} />
                                <Route path="masjid" element={<Masjid />} />
                            </Routes>
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Institutions;