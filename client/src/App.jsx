import { ThemeProvider } from "./contexts/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/Sidebar";
import LoginModal from "./components/Layout/LoginModal";

import About from "./Pages/About";

import Index from "./Pages/Home"
import Institutions from "./Pages/Institusions";
import ContactUs from "./Pages/Contact";

import StudentDashboard from "./components/Student/StudentDashboard";

/* HIFIFZ DASHBOARD CONTENT */
const RenderDashboardContent = () => {

  const { openedComponent } = useSelector((state) => state.popup);

  switch (openedComponent) {
    case "Deshboard":
      return <StudentDashboard />;
    default:
      return <StudentDashboard />;
  }
};


const App = () => {

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Sidebar />
          <LoginModal />

          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated && user?.role === "Student"
                  ? <RenderDashboardContent />
                  : <Index />
              }
            />

            <Route path="/about" element={<About />} />
            <Route path="/institutions/*" element={<Institutions />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>

          <Footer />
        </div>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
};


export default App;