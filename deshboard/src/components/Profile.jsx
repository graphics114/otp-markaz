import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import avatar from "../assets/avatar.jpg"
import { useState } from "react";
import { updateProfile, updatePassword } from "../store/slices/authSlice"

const Profile = () => {

    const { user, loading } = useSelector((state) => state.auth);

    const[editData, setEditData] = useState({ 
        full_name: user?.full_name || "", username: user?.username || ""});

    const [avatarFile, setAvatarFile] = useState(null);
    const [updatingSection, setUpdatingSection] = useState("");

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleProfileChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    }

    const dispatch = useDispatch();

    const updateProProfile = () => {
        const formData = new FormData();
        formData.append("full_name", editData.full_name);
        formData.append("username", editData.username);
        formData.append("avatar", avatarFile);
        setUpdatingSection("Profile");
        dispatch(updateProfile(formData));
    };

    const updateProfilePassword = () => {
        const formData = new FormData();
        formData.append("currentPassword", passwordData.currentPassword);
        formData.append("newPassword", passwordData.newPassword);
        formData.append("confirmNewPassword", passwordData.confirmNewPassword);
        setUpdatingSection("Password");
        dispatch(updatePassword(formData));
    };

    return(<>
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* HEADER */}
        <div className="flex-1 p-6 mb:pb-0">
            <Header />
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-sm text-gray-600 mb-6">Manage your profile</p>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl md:px-4 py-1">
            {/* PROFILE CARD */}
            <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center 
                gap-6 mb-10">
                    <img src={ user?.avatar?.url || avatar } alt={user?.name || avatar}
                        className="w-32 h-32 rounded-full object-cover border" loading="lazy" />
                <div>
                    <p className="text-xl font-medium">Name: {user?.full_name}</p>
                    <p className="text-md text-gray-600">Username: {user?.username}</p>
                    <p className="text-sm text-blue-600">Role: {user?.role}</p>
                </div>
            </div>

            {/* UPDATE PROFILE */}
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md mb-10">
                <p className="text-xl font-semibold mb-4">Update Profile</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="full_name" value={editData.full_name} 
                            onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="Enter your fullname" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" value={editData.username} 
                            onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="Enter your username" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Profile Image</label>
                        <input type="file" name="avatar" onChange={handleAvatarChange}
                            className="p-2 border rounded-lg col-span-1 md:col-span-2 h-[41px]
                            file:mr-4 file:px-4 file:rounded-md file:border-0 file:bg-blue-50
                            file:text-blue-700 file:hover:text-blue-500 focus:outline-none"  />
                    </div>
                </div>
                <button onClick={updateProProfile} className="flex justify-center items-center gap-2 rounded-lg 
                    bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 
                    transition-all mt-4" disabled={loading}>
                        {loading && updatingSection === "Profile" ? (
                            <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                rounded-full animate-spin" />
                            <span>Updating Profile...</span>
                            </>
                        ) : ("Update Profile")}
                    </button>
            </div>

            {/* UPDATE PASSWORD */}
            <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
                <p className="text-xl font-semibold mb-4">Update Password</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" name="currentPassword" value={passwordData.currentPassword}
                            onChange={handlePasswordChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="currentPassword" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" name="newPassword" value={passwordData.newPassword}
                            onChange={handlePasswordChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="newPassword" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword}
                            onChange={handlePasswordChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="confirmNewPassword" />
                    </div>
                </div>
                <button onClick={updateProfilePassword} className="flex justify-center items-center 
                    gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white 
                    font-semibold py-3 px-6 transition-all mt-4" disabled={loading}>
                        {loading && updatingSection === "Password" ? (
                            <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                rounded-full animate-spin" />
                            <span>Updating Password...</span>
                            </>
                        ) : ("Update Password")}
                </button>
            </div>
        </div>
    </main>
    </>)
}

export default Profile;