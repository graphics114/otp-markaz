import { ClipboardCheck, LayoutDashboard, Users, User, LogOut, MoveLeft, GraduationCap, PackagePlus, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";
import { logout } from "../store/slices/authSlice";
import { useState } from "react";

const SideBar = () => {

    const { user } = useSelector((state) => state.auth);

    const [activeLink, setActiveLink] = useState(0);
    const [isResultDropdownOpen, setIsResultDropdownOpen] = useState(false);
    const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(false);


    const Links = [
        {
            icon: <LayoutDashboard />,
            title: "Deshboard"
        },
        {
            icon: <GraduationCap />,
            title: "Students",
            isDropdown: true,
            subLinks: [
                { title: "Students", icon: <GraduationCap className="w-4 h-4" /> },
                { title: "Attendance", icon: <ClipboardCheck className="w-4 h-4" /> },
            ]
        },
        {
            icon: <ClipboardCheck />,
            title: "Result",
            isDropdown: true,
            subLinks: [
                { title: "Result", icon: <ClipboardCheck className="w-4 h-4" /> },
                { title: "Top Students", icon: <Trophy className="w-4 h-4" /> },
            ]
        },
        {
            icon: <PackagePlus />,
            title: "Admissions"
        },
        {
            icon: <Users />,
            title: "Users"
        },
        {
            icon: <User />,
            title: "Profile"
        },

    ];



    const { isNavbarOpened } = useSelector((state) => state.extra);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }
    return (<>
        {/* Backdrop for mobile */}
        {isNavbarOpened && (
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                onClick={() => dispatch(toggleNavbar())}
            />
        )}

        <aside className={`${isNavbarOpened ? "left-[10px]" : "-left-full"} fixed w-64 h-[97.5%] rounded-xl 
        bg-white z-50 mt-[10px] transition-all duration-300 shadow-xl p-4 space-y-4 flex flex-col 
        justify-between md:left-[10px]`}>
            <nav className="space-y-2">
                <div className="flex flex-col gap-2 py-2">
                    <h2 className="flex items-center justify-between text-xl font-bold">
                        <span>{user?.role} Panal</span>
                        <MoveLeft className="block md:hidden" onClick={() => dispatch(toggleNavbar())} />
                    </h2>
                    <hr />
                </div>

                {Links.map((item, index) => {
                    const isOpen = item.title === "Result" ? isResultDropdownOpen :
                        item.title === "Students" ? isStudentsDropdownOpen : false;
                    const toggle = () => {
                        if (item.title === "Result") setIsResultDropdownOpen(!isResultDropdownOpen);
                        if (item.title === "Students") setIsStudentsDropdownOpen(!isStudentsDropdownOpen);
                    };

                    if (item.isDropdown) {
                        return (
                            <div key={index} className="space-y-1">
                                <button
                                    onClick={toggle}
                                    className={`hover:bg-gray-200 w-full transition-all duration-300 flex items-center justify-between rounded-md cursor-pointer px-3 py-3 gap-2`}
                                >
                                    <div className="flex items-center gap-2">
                                        {item.icon} {item.title}
                                    </div>
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {isOpen && (
                                    <div className="ml-4 pl-2 border-l border-gray-100 space-y-1 overflow-hidden transition-all">
                                        {item.subLinks.map((sub, subIdx) => (
                                            <button
                                                key={subIdx}
                                                onClick={() => {
                                                    setActiveLink(`${index}-${subIdx}`);
                                                    dispatch(toggleComponent(sub.title));
                                                }}
                                                className={`${activeLink === `${index}-${subIdx}` && "bg-dark-gradient text-white"}
                                                    hover:bg-gray-100 w-full transition-all duration-300 flex items-center 
                                                    rounded-md cursor-pointer px-3 py-2 gap-2 text-sm text-gray-600`}
                                            >
                                                {sub.icon} {sub.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }


                    return (
                        <button onClick={() => {
                            setActiveLink(index);
                            dispatch(toggleComponent(item.title));
                        }} key={index} className={`${activeLink === index && "bg-dark-gradient text-white"}
                            hover:bg-gray-200 w-full transition-all duration-300 flex items-center 
                            rounded-md cursor-pointer px-3 py-3 gap-2`} >
                            {item.icon} {item.title}
                        </button>
                    )
                })}

            </nav>

            <button onClick={handleLogout} className="text-white rounded-md cursor-pointer flex 
                items-center px-2 py-2 gap-2 bg-red-gradient">
                <LogOut /> Logout
            </button>

        </aside>
    </>)
}

export default SideBar;