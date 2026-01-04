import { X } from "lucide-react";
import { toggleAuthPopup } from "../../Store/slices/popupSlice"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../../Store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const LoginModal = () => {

    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        dispatch(login({
            username: formData.username,
            password: formData.password
        }));
    };

    const { isAuthPopupOpen } = useSelector((state) => state.popup)

    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!isAuthenticated || !user) return;

      // STUDENT
      if (user.role === "Student") {
        toast.success("Login successful");

        dispatch(toggleAuthPopup());

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);

      }
      // NOT STUDENT
      else {
        toast.error("Only students are allowed to login");
        dispatch(toggleAuthPopup());
      }

    }, [isAuthenticated, user, dispatch, navigate]);


    if (!isAuthPopupOpen) return null;

    return (<>
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2">

            {/* OVERLAY */}
            <div className="absolute inset-0 backdrop-blur-md shadow-inherit" />
            <div className="relative z-10 bg-white rounded-lg px-6 py-6 w-full max-w-md mx-4 animate-fade-in-up">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-black">
                        Login
                    </h2>
                    <button onClick={() => dispatch(toggleAuthPopup())}
                        className="p-2 rounded-lg border border-border hover:glow-on-hover animate-smooth">
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>
                <p className="text-gray-400  text-xs">
                    Enter your username and password to <br /> access your accound
                </p>

                <form onSubmit={handleLogin}>
                    {/* AUTHENTICATION FORM */}
                    <div className="relative pt-4">
                        <h5>Username</h5>
                        <input type="username" placeholder="Enter your username" name="username"
                            value={formData.username} onChange={handleChange}
                            className="w-full py-1 pl-3 bg-white shadow-md rounded-sm
                            focus:outline-none placeholder:text-sm" required />

                        <div className="pt-3">
                            <h5>Password</h5>
                            <input type="password" placeholder="Enter your password" name="password"
                                value={formData.password} onChange={handleChange}
                                className="w-full py-1 pl-3 bg-white shadow-md rounded-sm
                            focus:outline-none placeholder:text-sm" />
                        </div>
                    </div>

                    <div className="p-2">
                        <button type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-blue-600
                        rounded-lg hover:bg-blue-700 text-white font-semibold py-1 transition"
                            disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent
                                    rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : ("Sign in")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>)
};

export default LoginModal;