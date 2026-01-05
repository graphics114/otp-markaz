import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Navigate } from "react-router-dom";

const Login = () => {

    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();

        dispatch(login({
            username: formData.username,
            password: formData.password
        }));
    };

    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    if (isAuthenticated && (user?.role === "Admin" || user?.role === "Staff")) {
        return <Navigate to={"/"} />
    }

    return (<>
        <div className="min-h-screen flex items-center justify-center
        border-b-gray-200">
            <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8 sm:p-8 mx-5">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Welcome Back
                </h2>
                <p className="text-center font-normal text-sm text-gray-500 mb-2">
                    Enter your username and password to access your account
                </p>

                <form onSubmit={handleLogin}>
                    <div className="p-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange}
                            placeholder="Enter your username" className="w-full px-4 py-1 border 
                        rounded-md placeholder:text-sm focus:outline-none" required />
                    </div>

                    <div className="p-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange}
                            placeholder="Enter your password" className="w-full px-4 py-1 border 
                        rounded-md placeholder:text-sm focus:outline-none" required />
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
}

export default Login;