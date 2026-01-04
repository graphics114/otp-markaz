import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
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

// Staff Components
import StaffUsers from "./components/staff/StaffUsers";
import StaffSideBar from "./components/staff/StaffSideBar";
import HifizResult from "./components/staff/HifizResult";
import HifizStudents from "./components/staff/HifizStudents";
import HifizDeshboard from "./components/staff/HifizDeshboard";

const App = () => {
      const dispatch = useDispatch();

      const { user, isAuthenticated } = useSelector((state) => state.auth);
      const { openedComponent } = useSelector((state) => state.extra);

      useEffect(() => {
        dispatch(getUser());
      }, [dispatch]);

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
          case "Profile":
            return <Profile />;
          default:
            return <Deshboard />;
        }
      };

      /* HIFIFZ DASHBOARD CONTENT */
        const staffRenderDashboardContent = () => {
            switch (openedComponent) {
              case "Deshboard":
                return <HifizDeshboard/>;
              case "Students":
                return <HifizStudents />;
              case "Result":
                return <HifizResult />;
              case "Users":
                return <StaffUsers />;
              case "Profile":
                return <Profile />;
              default:
                return <HifizDeshboard />;
            }
        };

      /*  ROLE BASED LAYOUT  */
      const renderRoleLayout = () => {
        if (!isAuthenticated) {
          return <Navigate to="/login" replace />;
        }

        // ADMIN
        if (user?.role === "Admin") {
          return (
            <div className="flex min-h-screen">
              <SideBar />
              {renderDashboardContent()}
            </div>
          );
        }

        // STAFF
        if (user?.role === "Staff") {
          return (
            <div className="flex min-h-screen">
              <StaffSideBar />
              {staffRenderDashboardContent()}

              {/* <SideBar />
              {renderDashboardContent()} */}
            </div>
          );
        }

      };

      return (
        <>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={renderRoleLayout()} />
            </Routes>

            <ToastContainer />
          </Router>
        </>
      );
    };

export default App;