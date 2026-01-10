import { ThemeProvider } from "./contexts/ThemeContext";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Store/slices/authSlice";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/Sidebar";
import LoginModal from "./components/Layout/LoginModal";

import About from "./Pages/About";

import Index from "./Pages/Home"
import Institutions from "./Pages/Institusions";
import ContactUs from "./Pages/Contact";
import StdSideBar from "./components/Student/SideBar";
import Profile from "./components/Student/Myprofile";
import StudentExamResult from "./components/Student/StudentExamResult";
import Welcom from "./components/Student/Welcom";

const App = () => {

  const { openedComponent } = useSelector((state) => state.popup);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  /* HIFIFZ DASHBOARD CONTENT */
  const RenderDashboardContent = () => {
    switch (openedComponent) {
      case "Home":
        return <Welcom />;
      case "My Profile":
        return <Profile />;
      case "Result":
        return <StudentExamResult />;
      default:
        return <Welcom />;
    }
  };

  /*  ROLE BASED LAYOUT  */
  const renderRoleLayout = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // ADMIN
    if (user?.role === "Student") {
      return (
        <div className="flex min-h-screen">
          <StdSideBar />
          {RenderDashboardContent()}
        </div>
      );
    }

    // DEFAULT (e.g. Student trying to access dashboard)
    return <Navigate to="/login" replace />;
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {!(isAuthenticated && user?.role === "Student" && location.pathname === "/") && <Navbar />}
        <Sidebar />

        <Routes>
          <Route path="/" element={isAuthenticated ? renderRoleLayout() : <Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/institutions/*" element={<Institutions />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>

        <LoginModal />
        {!(isAuthenticated && user?.role === "Student" && location.pathname === "/") && <Footer />}
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
};


export default App;