import { Home, Info, Building2, BookOpen, FileText, ClipboardCheck, Phone, X, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup, toggleSidebar } from "../../Store/slices/popupSlice";

const Sidebar = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const { isSidebarOpen } = useSelector((state) => state.popup);

    const menuItems = [
        { name: "Home", icon: Home, path: "/" },
        { name: "About Us", icon: Info, path: "/about" },
        { name: "Institutions", icon: Building2, path: "/institutions" },
        // {name: "Publications", icon: BookOpen, path: "/publications"}, // Placeholder
        // {name: "Admissions", icon: ClipboardCheck, path: "/admissions"}, // Placeholder
        { name: "Contact Us", icon: Phone, path: "/contact" },
    ];

    if (!isSidebarOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={() => dispatch(toggleSidebar())}
            />

            {/* Sidebar Container */}
            <aside className="fixed left-0 top-0 h-full w-72 z-50 bg-background/95 backdrop-blur-md border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out animate-slide-in-left">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <img src="/navelogo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="p-4 overflow-y-auto h-[calc(100%-180px)]">
                    <div className="mb-2 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Menu
                    </div>
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        onClick={() => dispatch(toggleSidebar())}
                                        className={`flex items-center px-4 py-3 rounded-xl gap-3 transition-all duration-200 group
                                            ${isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                : "text-foreground hover:bg-secondary hover:text-primary"
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"}`} />
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-6 mb-2 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Portal
                    </div>
                    <ul>
                        <li>
                            <button
                                onClick={() => { dispatch(toggleAuthPopup()); dispatch(toggleSidebar()) }}
                                className="w-full flex items-center px-4 py-3 rounded-xl gap-3 text-foreground hover:bg-secondary hover:text-primary transition-all duration-200 group text-left"
                            >
                                <LogIn className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium text-sm">Student Login</span>
                            </button>
                        </li>
                        <li>
                            <button
                                // onClick={() => dispatch(toggleSidebar())} // Future Link
                                className="w-full flex items-center px-4 py-3 rounded-xl gap-3 text-foreground hover:bg-secondary hover:text-primary transition-all duration-200 group text-left opacity-70 cursor-not-allowed"
                            >
                                <ClipboardCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                <span className="font-medium text-sm">Admission (Soon)</span>
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-secondary/20 border-t border-border/50">
                    <p className="text-xs text-center text-muted-foreground">
                        &copy; {new Date().getFullYear()} Markaz Ottappalam.
                    </p>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;