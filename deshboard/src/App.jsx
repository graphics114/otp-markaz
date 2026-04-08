import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

import { getUser } from "./store/slices/authSlice";

// Pages
import Login from "./pages/login";

// Admin Components
import Deshboard from "./components/Dashboard";
import SideBar from "./components/SideBar";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Students from "./components/Students";
import Result from "./components/Result";
import Admissions from "./components/admissions";
import TopStudents from "./components/TopStudents";
import Attendance from "./components/Attendance";


// Hifiz Components
import StaffUsers from "./components/staff/StaffUsers";
import StaffSideBar from "./components/staff/StaffSideBar";
import HifizResult from "./components/staff/HifizResult";
import HifizStudents from "./components/staff/HifizStudents";
import HifizDeshboard from "./components/staff/HifizDeshboard";

//School Components
import SchoolDeshboard from "./components/school/SchoolDeshboard";
import SchoolStudents from "./components/school/SchoolStudents";
import SchoolResult from "./components/school/SchoolResult";

//Dawa Components
import DawaDeshboard from "./components/dawa/DawaDeshboard";
import DawaStudents from "./components/dawa/DawaStudents";
import DawaResult from "./components/dawa/DawaResult";

const App = () => {
  const dispatch = useDispatch();

  const { user, isAuthenticated, isUserLoading } = useSelector((state) => state.auth);
  const { openedComponent } = useSelector((state) => state.extra);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  /* ADMIN DASHBOARD CONTENT */
  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Deshboard":
        return <Deshboard />;
      case "Students":
        return <Students />;
      case "Result":
        return <Result />;
      case "Admissions":
        return <Admissions />;
      case "Users":
        return <Users />;
      case "Top Students":
        return <TopStudents />;
      case "Profile":
        return <Profile />;
      case "Attendance":
        return <Attendance />;

      default:
        return <Deshboard />;
    }
  };

  /* HIFIFZ DASHBOARD CONTENT */
  const staffRenderDashboardContent = () => {
    switch (openedComponent) {
      case "Deshboard":
        return <HifizDeshboard />;
      case "Students":
        return <HifizStudents />;
      case "Result":
        return <HifizResult />;
      case "Users":
        return <StaffUsers />;
      case "Profile":
        return <Profile />;
      case "Attendance":
        return <Attendance />;
      default:
        return <HifizDeshboard />;

    }
  };

  /* DAWA DASHBOARD CONTENT */
  const dawaRenderDashboardContent = () => {
    switch (openedComponent) {
      case "Deshboard":
        return <DawaDeshboard />;
      case "Students":
        return <DawaStudents />;
      case "Result":
        return <DawaResult />;
      case "Users":
        return <StaffUsers />;
      case "Profile":
        return <Profile />;
      case "Attendance":
        return <Attendance />;
      default:
        return <DawaDeshboard />;

    }
  };

  /* SCHOOL DASHBOARD CONTENT */
  const schoolRenderDashboardContent = () => {
    switch (openedComponent) {
      case "Deshboard":
        return <SchoolDeshboard />;
      case "Students":
        return <SchoolStudents />;
      case "Result":
        return <SchoolResult />;
      case "Users":
        return <StaffUsers />;
      case "Profile":
        return <Profile />;
      case "Attendance":
        return <Attendance />;
      default:
        return <SchoolDeshboard />;
    }
  };

  /*  ROLE BASED LAYOUT  */
  const renderRoleLayout = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // ADMIN & SCHOOL
    if (user?.role === "Admin") {
      return (
        <div className="flex min-h-screen">
          <SideBar />
          {renderDashboardContent()}
        </div>
      );
    }

    //HIFIZ
    if (user?.role === "Hifiz") {
      return (
        <div className="flex min-h-screen">
          <StaffSideBar />
          {staffRenderDashboardContent()}
        </div>
      );
    }

    //DAWA
    if (user?.role === "Dawa") {
      return (
        <div className="flex min-h-screen">
          <StaffSideBar />
          {dawaRenderDashboardContent()}
        </div>
      );
    }


    //SCHOOL
    if (user?.role === "School") {
      return (
        <div className="flex min-h-screen">
          <StaffSideBar />
          {schoolRenderDashboardContent()}
        </div>
      );
    }
    // DEFAULT (e.g. Student trying to access dashboard)
    return <Navigate to="/login" replace />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={renderRoleLayout()} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </>
  );
};

export default App;