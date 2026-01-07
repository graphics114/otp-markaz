import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAdmition } from "../store/slices/admitionSlice";
import { toggleUpdateAdmition } from "../store/slices/extraSlice";


const UpdateAdmition = ({ selectedAdmition }) => {

    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.admition);

    const [editData, setEditData] = useState({
        candidate_name: "",
        date_of_birth: "",
        phone_number: "",
        whatsapp_number: "",
        aadhar_number: "",
        blood_group: "",
        father_name: "",
        mother_name: "",
        guardian_name: "",
        guardian_phone: "",
        address_line1: "",
        address_line2: "",
        locality: "",
        country: "",
        state: "",
        district: "",
        pin_code: "",
        institution: "",
        syllabus: "",
        madrasa_class: "",
        school_class: "",
    });

    useEffect(() => {
        if (selectedAdmition) {
            setEditData({
                candidate_name: selectedAdmition.candidate_name || "",
                date_of_birth: selectedAdmition.date_of_birth
                    ? new Date(selectedAdmition.date_of_birth).toISOString().split("T")[0] : "",
                phone_number: selectedAdmition.phone_number || "",
                whatsapp_number: selectedAdmition.whatsapp_number || "",

                aadhar_number: selectedAdmition.aadhar_number || "",
                blood_group: selectedAdmition.blood_group || "",

                father_name: selectedAdmition.father_name || "",

                mother_name: selectedAdmition.mother_name || "",

                guardian_name: selectedAdmition.guardian_name || "",
                guardian_phone: selectedAdmition.guardian_phone || "",

                address_line1: selectedAdmition.address_line1 || "",
                address_line2: selectedAdmition.address_line2 || "",
                locality: selectedAdmition.locality || "",
                district: selectedAdmition.district || "",
                state: selectedAdmition.state || "",
                country: selectedAdmition.country || "",
                pin_code: selectedAdmition.pin_code || "",

                institution: selectedAdmition.institution || "",
                syllabus: selectedAdmition.syllabus || "",
                school_class: selectedAdmition.school_class || "",
                madrasa_class: selectedAdmition.madrasa_class || "",
            });
        }
    }, [selectedAdmition]);

    const handleAdmitionChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            candidate_name: editData.candidate_name,
            date_of_birth: editData.date_of_birth,
            phone_number: editData.phone_number,
            whatsapp_number: editData.whatsapp_number,

            aadhar_number: editData.aadhar_number,
            blood_group: editData.blood_group,

            father_name: editData.father_name,

            mother_name: editData.mother_name,

            guardian_name: editData.guardian_name,
            guardian_phone: editData.guardian_phone,

            address_line1: editData.address_line1,
            address_line2: editData.address_line2,
            locality: editData.locality,
            district: editData.district,
            state: editData.state,
            country: editData.country,
            pin_code: editData.pin_code,

            institution: editData.institution,
            syllabus: editData.syllabus,
            madrasa_class: editData.madrasa_class,
            school_class: editData.school_class,
        }

        dispatch(updateAdmition({ id: selectedAdmition.id, data }));
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full h-full max-w-2xl p-6 relative">
                <button onClick={() => dispatch(toggleUpdateAdmition())}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Update Details</h2>

                <form onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="md:col-span-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Basic Information
                        </h3>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Candidate Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="candidate_name" placeholder="Enter your name"
                            onChange={handleAdmitionChange} value={editData.candidate_name} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            DOB <span className="text-red-600">*</span>
                        </label>
                        <input type="date" name="date_of_birth" placeholder="Enter your date of birth"
                            onChange={handleAdmitionChange} value={editData.date_of_birth} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-600">*</span>
                        </label>
                        <input type="number" name="phone_number" placeholder="Enter your phone number" maxLength={10}
                            onChange={handleAdmitionChange} value={editData.phone_number} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Whatsapp Number
                        </label>
                        <input type="number" name="whatsapp_number" placeholder="Enter your whatsapp_number" maxLength={10}
                            onChange={handleAdmitionChange} value={editData.whatsapp_number}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Aadhar Number <span className="text-red-600">*</span>
                        </label>
                        <input type="number" name="aadhar_number" placeholder="Enter your aadhar number" maxLength={12}
                            onChange={handleAdmitionChange} value={editData.aadhar_number} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Blood Group
                        </label>
                        <select name="blood_group" value={editData.blood_group} onChange={handleAdmitionChange}
                            className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                            <option value="">Select Blood Group</option>
                            {BLOOD_GROUPS.map((group) => (
                                <option key={group} value={group}>
                                    {group}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3 pt-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Parent Information
                        </h3>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Father's Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="father_name" placeholder="Enter your father's name"
                            onChange={handleAdmitionChange} value={editData.father_name} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Mother's Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="mother_name" placeholder="Enter your mother's name"
                            onChange={handleAdmitionChange} value={editData.mother_name} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Guardian's Name <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="guardian_name" placeholder="Enter your guardian's name"
                            onChange={handleAdmitionChange} value={editData.guardian_name} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Guardian's Phone <span className="text-red-600">*</span>
                        </label>
                        <input type="number" name="guardian_phone" placeholder="Enter your guardian's phone" maxLength={10}
                            onChange={handleAdmitionChange} value={editData.guardian_phone} required
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
                            onChange={handleAdmitionChange} value={editData.address_line1}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Address Line2
                        </label>
                        <input type="text" name="address_line2" placeholder="Enter your address_line2"
                            onChange={handleAdmitionChange} value={editData.address_line2}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Locality <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="locality" placeholder="Enter your locality"
                            onChange={handleAdmitionChange} value={editData.locality} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Country
                        </label>
                        <select name="country" value={editData.country} onChange={handleAdmitionChange}
                            className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                            <option value="">Select country</option>
                            <option value="India">India</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            State
                        </label>
                        <select name="state" value={editData.state} onChange={handleAdmitionChange}
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
                            name="district" value={editData.district} onChange={handleAdmitionChange}
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
                        <input type="number" name="pin_code" placeholder="Enter your pin code" maxLength={6}
                            onChange={handleAdmitionChange} value={editData.pin_code}
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="md:col-span-3 pt-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Institution Details
                        </h3>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Institution <span className="text-red-600">*</span>
                        </label>
                        <select name="institution" value={editData.institution} onChange={handleAdmitionChange}
                            className="border px-4 py-2 rounded-lg h-[41px] outline-none" required>
                            <option value="">Select institution</option>
                            <option value="Hifzul Quran College">Hifzul Quran College</option>
                            <option value="Uthmaniyya College of Excellence">Uthmaniyya College of Excellence</option>
                        </select>
                    </div>

                    {editData.institution === "Hifzul Quran College" && (
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">
                                Syllabus <span className="text-red-600">*</span>
                            </label>

                            <select
                                name="syllabus"
                                value={editData.syllabus}
                                onChange={handleAdmitionChange}
                                required
                                className={`border px-4 py-2 rounded-lg h-[41px] outline-none text-sm
                            ${editData.syllabus === ""
                                        ? "bg-gray-100 text-gray-400"
                                        : "bg-white text-black"}
                          `}
                            >
                                <option value="" disabled hidden>Select Course</option>
                                <option value="CBSE" className="text-black">CBSE</option>
                                <option value="KERALA" className="text-black">KERALA</option>
                            </select>
                        </div>
                    )}

                    <div className="flex flex-col md:col-span-1 gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            School <span className="text-red-600">*</span>
                        </label>
                        <input type="text" name="school_class" placeholder="Enter school class"
                            onChange={handleAdmitionChange} value={editData.school_class} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <div className="flex flex-col md:col-span-1 gap-1">
                        <label className="text-sm font-medium text-gray-700">
                            Madrasa <span className="text-red-600">*</span>
                        </label>
                        <input type="madrasa_class" name="madrasa_class" placeholder="Enter madrasa class"
                            onChange={handleAdmitionChange} value={editData.madrasa_class} required
                            className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                    </div>

                    <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600
                    hover:bg-blue-700 text-white py-2 px-6 rounded col-span-1 md:col-span-3">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent
                                rounded-full animate-spin" />

                                <span>Updating...</span>
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default UpdateAdmition;