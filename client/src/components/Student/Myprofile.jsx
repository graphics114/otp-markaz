import { useDispatch, useSelector } from "react-redux";
import Header from "../Student/Head";
import avatar from "../../../public/avatar.jpg"
import { useState, useEffect } from "react";
import { updateProfile } from "../../Store/slices/authSlice"

const Profile = () => {

    const { user, loading } = useSelector((state) => state.auth);

    const [editData, setEditData] = useState({
        username: "",
        reg_number: "",

        full_name: "",
        date_of_birth: "",
        phone_number: "",
        emergency_contact: "",

        aadhar_number: "",
        blood_group: "",

        father_name: "",
        father_phone: "",
        father_occupation: "",

        mother_name: "",
        mother_phone: "",
        mother_occupation: "",

        guardian_name: "",
        guardian_phone: "",

        address_line1: "",
        address_line2: "",
        locality: "",
        district: "",
        state: "",
        country: "",

        pin_code: "",
        joining_year: "",
        institution: "",
        joining_batch: "",
        course_program: "",
        other: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [updatingSection, setUpdatingSection] = useState("");

    useEffect(() => {
        if (user) {
            const studentDetails = user.student_details || {};
            setEditData({
                username: user.username || "",
                reg_number: studentDetails.reg_number || user.reg_number || "",


                full_name: user.full_name || "",

                date_of_birth: studentDetails.date_of_birth
                    ? new Date(studentDetails.date_of_birth).toISOString().split("T")[0]
                    : (user.date_of_birth ? new Date(user.date_of_birth).toISOString().split("T")[0] : ""),

                phone_number: studentDetails.phone_number || user.phone_number || "",
                emergency_contact: studentDetails.emergency_contact || user.emergency_contact || "",

                aadhar_number: studentDetails.aadhar_number || user.aadhar_number || "",
                blood_group: studentDetails.blood_group || user.blood_group || "",

                father_name: studentDetails.father_name || user.father_name || "",
                father_phone: studentDetails.father_phone || user.father_phone || "",
                father_occupation: studentDetails.father_occupation || user.father_occupation || "",

                mother_name: studentDetails.mother_name || user.mother_name || "",
                mother_phone: studentDetails.mother_phone || user.mother_phone || "",
                mother_occupation: studentDetails.mother_occupation || user.mother_occupation || "",

                guardian_name: studentDetails.guardian_name || user.guardian_name || "",
                guardian_phone: studentDetails.guardian_phone || user.guardian_phone || "",

                address_line1: studentDetails.address_line1 || user.address_line1 || "",
                address_line2: studentDetails.address_line2 || user.address_line2 || "",
                locality: studentDetails.locality || user.locality || "",
                district: studentDetails.district || user.district || "",
                state: studentDetails.state || user.state || "",
                country: studentDetails.country || user.country || "",

                pin_code: studentDetails.pin_code || user.pin_code || "",
                joining_year: studentDetails.joining_year || user.joining_year || "",
                institution: studentDetails.institution || user.institution || "",
                joining_batch: studentDetails.joining_batch || user.joining_batch || "",
                course_program: studentDetails.course_program || user.course_program || "",
                other: studentDetails.other || user.other || "",
            });
        }
    }, [user]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleProfileChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const dispatch = useDispatch();

    const updateProProfile = () => {
        const formData = new FormData();
        Object.keys(editData).forEach(key => {
            formData.append(key, editData[key]);
        });
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }
        setUpdatingSection("Profile");
        dispatch(updateProfile(formData));
    };

    const BLOOD_GROUPS = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
    ];

    // STATE
    const indiaStates = [
        {
            state: "Kerala",
            districts: [
                "Thiruvananthapuram",
                "Kollam",
                "Pathanamthitta",
                "Alappuzha",
                "Kottayam",
                "Idukki",
                "Ernakulam",
                "Thrissur",
                "Palakkad",
                "Malappuram",
                "Kozhikode",
                "Wayanad",
                "Kannur",
                "Kasaragod",
            ],
        },
        {
            state: "Tamil Nadu",
            districts: [
                "Chennai",
                "Coimbatore",
                "Madurai",
                "Salem",
                "Tiruchirappalli",
            ],
        },
    ];

    const selectedStateObj = indiaStates.find(
      (s) => s.state === editData.state
    );

    const districts = selectedStateObj?.districts || [];

    return (<>
        <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
            {/* HEADER */}
            <div className="flex-1 p-6 mb:pb-0">
                <Header />
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-sm text-gray-600 mb-6">Manage your profile</p>
            </div>

            {/* CONTENT */}
            <div className="md:px-4 py-1">
                {/* PROFILE CARD */}
                <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center 
                gap-6 mb-10">
                    <img src={user?.avatar?.url || avatar} alt={user?.name || avatar}
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
                            <label className="text-sm font-medium text-gray-700">Username</label>
                            <input type="text" name="username" value={editData.username}
                                disabled className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none bg-gray-200 cursor-not-allowed" title="Username cannot be changed" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Reg Number
                            </label>
                            <input type="text" name="reg_number" value={editData.reg_number}
                                disabled className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none bg-gray-200 cursor-not-allowed" title="reg_number cannot be changed" />
                        </div>

                        <div className="md:col-span-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Basic Information
                          </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Full Name 
                            </label>
                            <input type="text" name="full_name" value={editData.full_name} 
                                onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="Enter your fullname" />
                        </div>

                        {/* Student Details */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Date of Birth 
                            </label>
                            <input type="date" name="date_of_birth" value={editData.date_of_birth} 
                                onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Phone Number 
                            </label>
                            <input type="text" name="phone_number" value={editData.phone_number}
                                onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="Enter phone number" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               Emergency Contact
                            </label>
                            <input type="tel" name="emergency_contact" placeholder="Enter your emergency contact" maxLength={10}
                                onChange={handleProfileChange} value={editData.emergency_contact}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               Aadhar Number 
                            </label>
                            <input type="num" name="aadhar_number" placeholder="Enter your aadhar number" maxLength={12}
                                onChange={handleProfileChange} value={editData.aadhar_number} 
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               Blood Group
                            </label>
                            <select name="blood_group" value={editData.blood_group} onChange={handleProfileChange}
                                className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                                    <option value="">Select Blood Group</option>
                                    {BLOOD_GROUPS.map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-1">
                            <label className="text-sm font-medium text-gray-700">Profile Image</label>
                            <input type="file" name="avatar" onChange={handleAvatarChange}
                                className="p-2 border rounded-lg h-[41px] w-full
                            file:mr-4 file:px-4 file:rounded-md file:border-0 file:bg-blue-50
                            file:text-blue-700 file:hover:text-blue-500 focus:outline-none" />
                        </div>

                        <div className="md:col-span-3 pt-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Parent Information
                          </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Father's Name</label>
                            <input type="text" name="father_name" value={editData.father_name}
                                onChange={handleProfileChange} className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none" placeholder="Enter father's name" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Father's Phone
                            </label>
                            <input type="tel" name="father_phone" placeholder="Enter your father's phone" maxLength={10}
                                onChange={handleProfileChange} value={editData.father_phone}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Father's Occupation
                            </label>
                            <input type="text" name="father_occupation" placeholder="Enter your father's occupation"
                                onChange={handleProfileChange} value={editData.father_occupation}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Mother's Name 
                            </label>
                            <input type="text" name="mother_name" placeholder="Enter your mother's name"
                                onChange={handleProfileChange} value={editData.mother_name} 
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Mother's Phone
                            </label>
                            <input type="tel" name="mother_phone" placeholder="Enter your mother's phone" maxLength={10}
                                onChange={handleProfileChange} value={editData.mother_phone}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Mother's Occupation
                            </label>
                            <input type="text" name="mother_occupation" placeholder="Enter your mother's occupation"
                                onChange={handleProfileChange} value={editData.mother_occupation}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Guardian's Name 
                            </label>
                            <input type="text" name="guardian_name" placeholder="Enter your guardian's name"
                                onChange={handleProfileChange} value={editData.guardian_name} 
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Guardian's Phone
                            </label>
                            <input type="tel" name="guardian_phone" placeholder="Enter your guardian's phone" maxLength={10}
                                onChange={handleProfileChange} value={editData.guardian_phone}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="md:col-span-3 pt-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Address Information
                          </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Address Line1
                            </label>
                            <input type="text" name="address_line1" placeholder="Enter your address_line1"
                                onChange={handleProfileChange} value={editData.address_line1}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Address Line2
                            </label>
                            <input type="text" name="address_line2" placeholder="Enter your address_line2"
                                onChange={handleProfileChange} value={editData.address_line2}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Locality
                            </label>
                            <input type="text" name="locality" placeholder="Enter your locality"
                                onChange={handleProfileChange} value={editData.locality}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               Country
                            </label>
                            <select name="country" value={editData.country} onChange={handleProfileChange}
                                className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                                    <option value="">Select country</option>
                                    <option value="India">India</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               State
                            </label>
                            <select name="state" value={editData.state} onChange={handleProfileChange}
                                className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                                    <option value="">Select state</option>
                                    {indiaStates.map((item) => (
                                        <option key={item.state} value={item.state}>
                                            {item.state}
                                        </option>
                                    ))}
                            </select>
                        </div>
                                
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-700">District</label>
                          <select
                            name="district" value={editData.district} onChange={handleProfileChange} 
                            disabled={!editData.state} className="border px-4 py-2 rounded-lg h-[41px] 
                            outline-none disabled:bg-gray-100">
                            <option value="">Select district</option>
                            {districts.map((dist) => (
                              <option key={dist} value={dist}>
                                {dist}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Pin Code
                            </label>
                            <input type="num" name="pin_code" placeholder="Enter your pin code" maxLength={6}
                                onChange={handleProfileChange} value={editData.pin_code}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="md:col-span-3 pt-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Institution Details
                          </h3>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Joining Year
                            </label>
                            <input type="num" name="joining_year" value={editData.joining_year}
                                disabled className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none bg-gray-200 cursor-not-allowed" title="joining_year cannot be changed" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                               Institution
                            </label>
                            <input type="num" name="institution" value={editData.institution}
                                disabled className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none bg-gray-200 cursor-not-allowed" title="institution cannot be changed" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-700">Course</label>
                          <input type="num" name="joining_batch" value={editData.joining_batch}
                                disabled className="p-2 border rounded-lg 
                            placeholder:text-sm focus:outline-none bg-gray-200 cursor-not-allowed" title="joining_batch cannot be changed" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                School
                            </label>
                            <input type="course_program" name="course_program" placeholder="Enter school class/program"
                                onChange={handleProfileChange} value={editData.course_program}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>

                        <div className="flex flex-col md:col-span-2 gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Other Details
                            </label>
                            <input type="other" name="other" placeholder="Enter mor deteails"
                                onChange={handleProfileChange} value={editData.other}
                                className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                        </div>
                    </div>
                    <button
                      onClick={updateProProfile}
                      disabled={loading}
                      className="md:col-span-3 flex justify-center items-center gap-2 rounded-lg 
                                 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                                 py-3 px-6 transition-all mt-6 w-full disabled:opacity-70"
                    >
                      {loading && updatingSection === "Profile" ? (
                        <>
                          <div
                            className="w-5 h-5 border-2 border-white border-t-transparent 
                                       rounded-full animate-spin"
                          />
                          <span>Updating Profile...</span>
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                </div>
            </div>
        </main>
    </>)
}

export default Profile;