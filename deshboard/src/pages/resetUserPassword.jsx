import { useDispatch, useSelector } from "react-redux";
import { toggleResetPassword } from "../store/slices/extraSlice";
import { useState, useEffect } from "react";
import { resetUserPassword } from "../store/slices/adminSlice"

const ResetPassword = ({ selectedUser }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        userId: "",
        username: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if(selectedUser) {
            setFormData((prev) => ({
                ...prev,
                userId: selectedUser.id || "",
                username: selectedUser.username || "",
            }));
        }
    }, [selectedUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
        }

        dispatch(resetUserPassword(selectedUser.id, data));
    };

    return(<>
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            <button onClick={() => dispatch(toggleResetPassword())}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl">
                &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

            <form onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        UserId
                    </label>
                    <span className="border px-4 py-2 rounded-lg overflow-hidden h-[41px] text-gray-600 
                        whitespace-nowrap text-ellipsis">
                        {formData.userId}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <span className="border px-4 py-2 rounded-lg overflow-hidden h-[41px] text-gray-600">
                        {formData.username}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        New Password <span className="text-red-500">*</span>
                    </label>
                    <input type="password" name="newPassword" placeholder="Enter new password"
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none"
                        onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input type="password" name="confirmPassword" placeholder="Enter confirm Password"
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none"
                        onChange={handleChange} required />
                </div>

                <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600
                    hover:bg-blue-700 text-white py-2 px-6 rounded col-span-1 md:col-span-2">
                    {loading ? (
                        <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent
                            rounded-full animate-spin" />
                            <span>Submiting...</span>
                        </>
                    ) : ("Submit")}
                </button>
            </form>
        </div>
    </div>
    </>)
}

export default ResetPassword;