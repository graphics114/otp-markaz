import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice";
import { toggleRegisterUser } from "../store/slices/extraSlice";

const UserRegister = () => {
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        password: "",
        role: "",
        institution: "",
        joining_batch: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData));
        dispatch(toggleRegisterUser());
    };

    // INSTUTUTION
    const institutions = [
        {
            instu: "Hifzul Quran College",
            courses: [
                "HZ1",
                "HZ2",
                "HZ3",
            ],
        },
        {
            instu: "Uthmaniyya College...",
            courses: [
                "HI1",
                "HI2",
                "HS1",
                "HS2",
                "BS1",
                "BS2",
                "BS3",
                "BS4",
                "BS5",
            ],
        },
    ];

    const selectedinstuObj = institutions.find(
        (s) => s.instu === formData.institution
    );

    const courses = selectedinstuObj?.courses || [];

    return (<>
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
                <button onClick={() => dispatch(toggleRegisterUser())}
                    className="absolute top-4 right-4 justify-end text-gray-600 hover:text-red-500 text-xl">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">
                    New Register
                </h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="full_name" placeholder="Enter your fullname"
                            onChange={handleChange} className="border px-4 py-2 rounded-lg 
                        placeholder:text-sm focus:outline-none" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Username <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="username" placeholder="Enter new username"
                            onChange={handleChange} className="border px-4 py-2 rounded-lg 
                        placeholder:text-sm focus:outline-none" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Password <span className="text-red-600">*</span>
                        </label>
                        <input type="password" name="password" placeholder="Enter new password"
                            onChange={handleChange} className="border px-4 py-2 rounded-lg 
                        placeholder:text-sm h-[41px] focus:outline-none" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <select name="role" value={formData.role} onChange={handleChange}
                            className={`border px-4 py-2 rounded-lg h-[41px] ${formData.role === "" ? "text-gray-400 text-sm" : "text-black text-sm"
                                }`} required>
                            <option value="" disabled hidden>Select Role</option>
                            <option value="Student" className="text-black">Student</option>
                            <option value="Hifiz" className="text-black">Hifiz</option>
                            <option value="Dawa" className="text-black">Dawa</option>
                        </select>
                    </div>

                    {formData.role === "Student" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Institution
                                </label>
                                <select name="institution" value={formData.institution} onChange={handleChange}
                                    className="border px-4 py-2 rounded-lg h-[41px] outline-none text-sm">
                                    <option value="">Select institution</option>
                                    {institutions.map((item) => (
                                        <option key={item.instu} value={item.instu}>
                                            {item.instu}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">Course</label>
                                <select
                                    name="joining_batch" value={formData.joining_batch} onChange={handleChange}
                                    disabled={!formData.institution} className="border px-4 py-2 rounded-lg h-[41px] 
                                outline-none disabled:bg-gray-100 text-sm">
                                    <option value="">Select course</option>
                                    {courses.map((cour) => (
                                        <option key={cour} value={cour}>
                                            {cour}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600 
                    hover:bg-blue-700 text-white py-2 px-6 rounded col-span-1 md:col-span-2">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                            rounded-full animate-spin"/>
                                <span>Registering...</span>
                            </>
                        ) : ("Register")}
                    </button>

                </form>
            </div>
        </div>
    </>)
}

export default UserRegister;