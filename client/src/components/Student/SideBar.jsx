import { ClipboardCheck, LayoutDashboard, Users, User, LogOut, MoveLeft, Home } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toggleComponent, toggleNavbar } from "../../Store/slices/popupSlice";
import { logout } from "../../Store/slices/authSlice";
import { useState } from "react";

const StdSideBar = () => {

    const { user } = useSelector((state) => state.auth);

    const [activeLink, setActiveLink] = useState(0);

    const { isNavbarOpened } = useSelector((state) => state.popup);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const Links = [
        {
            icon: <Home />,
            title: "Home"
        },

        {
            icon: <User />,
            title: "My Profile"
        },

        {
            icon: <ClipboardCheck />,
            title: "Result"
        },
    ];


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
        bg-card border border-border z-50 mt-[10px] transition-all duration-300 shadow-xl p-4 space-y-4 flex flex-col 
        justify-between md:left-[10px]`}>
            <nav className="space-y-2">
                <div className="flex flex-col gap-2 py-2">
                    <h2 className="flex items-center justify-between text-xl font-bold text-foreground">
                        <span>{user?.role} Panel</span>
                        <MoveLeft className="block md:hidden cursor-pointer" onClick={() => dispatch(toggleNavbar())} />
                    </h2>
                    <hr className="border-border" />
                </div>

                {Links.map((item, index) => {
                    return (
                        <button onClick={() => {
                            setActiveLink(index);
                            dispatch(toggleComponent(item.title));
                        }} key={index} className={`${activeLink === index
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"}
                            w-full transition-all duration-300 flex items-center 
                            rounded-xl cursor-pointer px-4 py-3 gap-3 font-medium`} >
                            {item.icon} {item.title}
                        </button>
                    )
                })}

            </nav>

            <button onClick={handleLogout} className="text-white rounded-xl cursor-pointer flex 
                items-center px-4 py-3 gap-3 bg-destructive hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20">
                <LogOut /> Logout
            </button>

        </aside>
    </>)
}

export default StdSideBar;