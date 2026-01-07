import { useDispatch, useSelector } from "react-redux";
import { toggleUpdateUser } from "../store/slices/extraSlice";
import { useEffect, useState } from "react";
import { updateUser } from "../store/slices/adminSlice"


const UserUpdate = ({ selectedUser }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.admin);

    const [editData, setEditData] = useState({
        full_name: "",
        username: "",
        role: "",
        institution: "",
        joining_batch: "",
    });

    useEffect(() => {
        if (selectedUser) {
            setEditData({
                full_name: selectedUser.full_name || "",
                username: selectedUser.username || "",
                role: selectedUser.role || "",
                institution: selectedUser.institution || "",
                joining_batch: selectedUser.joining_batch || "",
            });
        }
    }, [selectedUser]);

    const [avatarFile, setAvatarFile] = useState(null);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleUserChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            full_name: editData.full_name,
            username: editData.username,
            role: editData.role,
            institution: editData.institution,
            joining_batch: editData.joining_batch,
        };

        if (avatarFile) {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });

            formData.append("avatar", avatarFile);

            dispatch(updateUser(selectedUser.id, formData));
        } else {
            dispatch(updateUser(selectedUser.id, data));
        }
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
        (s) => s.instu === editData.institution
    );

    const courses = selectedinstuObj?.courses || [];

    return (<>
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
                <button onClick={() => dispatch(toggleUpdateUser())}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Update Details</h2>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="full_name" placeholder="Enter your fullname"
                            onChange={handleUserChange} value={editData.full_name}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Username <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="username" placeholder="Enter your username"
                            onChange={handleUserChange} value={editData.username}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Role <span className="text-red-600">*</span>
                        </label>
                        <select name="role" value={editData.role} onChange={handleUserChange}
                            className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                            <option value="">Select Role</option>
                            <option value="Student">Student</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Profile Image</label>
                        <input type="file" name="avatar" onChange={handleAvatarChange}
                            className="p-2 border rounded-lg h-[41px]
                            file:mr-4 file:px-4 file:rounded-md file:border-0 file:bg-blue-50
                            file:text-blue-700 file:hover:text-blue-500 focus:outline-none" />
                    </div>

                    {editData.role === "Student" && (
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Institution
                                </label>
                                <select name="institution" value={editData.institution} onChange={handleUserChange}
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
                                    name="joining_batch" value={editData.joining_batch} onChange={handleUserChange}
                                    disabled={!editData.institution} className="border px-4 py-2 rounded-lg h-[41px] 
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
                                <span>Updating User...</span>
                            </>
                        ) : ("Update User")}
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default UserUpdate;