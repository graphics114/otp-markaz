import { ClipboardCheck,LayoutDashboard, Users, User, LogOut, MoveLeft, GraduationCap, PackagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toggleComponent, toggleNavbar } from "../store/slices/extraSlice";
import { logout } from "../store/slices/authSlice";
import { useState } from "react";

const SideBar = () => {

    const { user } = useSelector((state) => state.auth);

    const [activeLink, setActiveLink] = useState(0);

    const Links = [
        {
            icon: <LayoutDashboard />,
            title: "Deshboard"
        },

        {
            icon: <GraduationCap />,
            title: "Students"
        },

        {
            icon: <ClipboardCheck />,
            title: "Result"
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

    if(!isAuthenticated) {
        return <Navigate to="/login" />
    }
    return(<>
    <aside className={`${isNavbarOpened ? "left-[10px]" : "-left-full"} fixed w-64 h-[97.5%] rounded-xl 
        bg-white z-10 mt-[10px] transition-all duration-300 shadow-lg p-4 space-y-4 flex flex-col 
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
                    return(
                        <button onClick={() => {setActiveLink(index);
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