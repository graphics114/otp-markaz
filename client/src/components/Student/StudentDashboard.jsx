import StudentExamResult from "./StudentExamResult";
import { useDispatch } from "react-redux";
import { logout } from "../../Store/slices/authSlice";
import { LogOut } from "lucide-react";

const StudentDashboard = () => {
  const dispatch = useDispatch();

  return (
    <div className="max-w-5xl mx-auto pt-8 pb-6 px-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 pt-24 gap-4">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Half-Year Exam Result
        </h1>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <StudentExamResult />
    </div>
  );
};

export default StudentDashboard;
