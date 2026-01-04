import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, toggleAuthPopup } from "../../Store/slices/popupSlice"
import { logout } from "../../Store/slices/authSlice";


const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (<>
    <nav className="fixed left-0 w-full top-0 z-50 glass border-b-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 animate-slide-in-top">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-105">
            <img src="/navelogo.png" alt="OTP Markaz"
              className="h-12 w-auto object-contain drop-shadow-sm" />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-6">

            {/* Nav Links */}
            <div className="flex items-center space-x-4 mr-4 bg-secondary/30 px-4 py-1.5 rounded-full border border-border/50 backdrop-blur-sm">
              <NavLink to="/"
                className={({ isActive }) =>
                  `px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full
                               ${isActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
                }>
                Home
              </NavLink>

              <NavLink to="/about"
                className={({ isActive }) =>
                  `px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full
                               ${isActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
                }>
                About
              </NavLink>

              <NavLink to="/institutions"
                className={({ isActive }) =>
                  `px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full
                               ${isActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
                }>
                Institutions
              </NavLink>

              <NavLink to="/contact"
                className={({ isActive }) =>
                  `px-3 py-1 text-sm font-medium transition-all duration-300 rounded-full
                               ${isActive ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`
                }>
                Contact
              </NavLink>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme}
                className="p-2.5 rounded-full hover:bg-secondary/80 transition-all duration-300 text-foreground border border-transparent hover:border-border">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <button onClick={handleLogout}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition-all duration-300 hover:-translate-y-0.5">
                  Logout
                </button>
              ) : (
                <button onClick={() => dispatch(toggleAuthPopup())}
                  className="hidden lg:block px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 hover:-translate-y-0.5">
                  Student Login
                </button>
              )}
              <button className="px-5 py-2 text-sm font-semibold text-foreground bg-secondary/50 border border-border rounded-full hover:bg-secondary transition-all duration-300">
                Admission
              </button>
            </div>

          </div>

          {/* MOBILE MENU TOGGLES */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-colors">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="p-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition-colors border border-transparent active:scale-95"
              onClick={() => dispatch(toggleSidebar())}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  </>)
};

export default Navbar;