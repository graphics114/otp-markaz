import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enrollStudent } from "../store/slices/studentsSlice";
import { toggleEnrollStudent } from "../store/slices/extraSlice";
import { fetchAllAdmissions } from "../store/slices/admitionSlice";

const EnrollStudent = ({ selectedAdmition }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.std);

    const [formData, setFormData] = useState({
        // User fields
        username: "",
        password: "",
        role: "Student",

        // common/student fields
        full_name: "",
        reg_number: "",
        roll_number: "",
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
        country: "India",
        pin_code: "",

        joining_year: new Date().getFullYear().toString(),
        institution: "",
        joining_batch: "", // Course
        course_program: "", // School class
        other: "",
    });

    useEffect(() => {
        if (selectedAdmition) {
            setFormData(prev => ({
                ...prev,
                full_name: selectedAdmition.candidate_name || "",
                date_of_birth: selectedAdmition.date_of_birth
                    ? new Date(selectedAdmition.date_of_birth).toISOString().split("T")[0]
                    : "",
                phone_number: selectedAdmition.phone_number || "",
                emergency_contact: selectedAdmition.whatsapp_number || selectedAdmition.guardian_phone || "",
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
                pin_code: selectedAdmition.pin_code || "",
                institution: selectedAdmition.institution || "",
                course_program: selectedAdmition.school_class || "",
                other: `Previous Inst: ${selectedAdmition.prv_institution || "N/A"}, Completed Juz: ${selectedAdmition.com_juz || 0}`
            }));
        }
    }, [selectedAdmition]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            full_name: formData.full_name,
            username: formData.username,
            password: formData.password,
            role: formData.role,
            institution: formData.institution,
            joining_batch: formData.joining_batch,
        };

        const studentData = {
            reg_number: formData.reg_number,
            roll_number: formData.roll_number,
            date_of_birth: formData.date_of_birth,

            phone_number: formData.phone_number,
            emergency_contact: formData.emergency_contact,
            aadhar_number: formData.aadhar_number,
            blood_group: formData.blood_group,
            father_name: formData.father_name,
            father_phone: formData.father_phone,
            father_occupation: formData.father_occupation,
            mother_name: formData.mother_name,
            mother_phone: formData.mother_phone,
            mother_occupation: formData.mother_occupation,
            guardian_name: formData.guardian_name,
            guardian_phone: formData.guardian_phone,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            locality: formData.locality,
            district: formData.district,
            state: formData.state,
            country: formData.country,
            pin_code: formData.pin_code,
            joining_year: formData.joining_year,
            institution: formData.institution,
            joining_batch: formData.joining_batch,
            course_program: formData.course_program,
            other: formData.other,
        };

        try {
            await dispatch(enrollStudent(selectedAdmition.id, userData, studentData));
            dispatch(toggleEnrollStudent());
            dispatch(fetchAllAdmissions(1)); // Refresh list
        } catch (err) {
            // Error is handled in the slice
        }
    };

    const institutions = [
        {
            instu: "Hifzul Quran College",
            courses: ["HZ1", "HZ2", "HZ3"],
        },
        {
            instu: "Uthmaniyya College of Excellence",
            courses: ["HI1", "HI2", "HI3", "HS1", "HS2", "BS1", "BS2", "BS3", "BS4", "BS5"],
        },
    ];

    const selectedinstuObj = institutions.find(
        (s) => s.instu === formData.institution
    );

    const courses = selectedinstuObj?.courses || [];

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] p-6 relative overflow-y-auto">
                <button onClick={() => dispatch(toggleEnrollStudent())}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center">Enroll Student</h2>
                <p className="text-sm text-center text-gray-600 mb-6">Create login credentials and student record for {formData.full_name}</p>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    {/* LOGIN CREDENTIALS SECTION */}
                    <div className="md:col-span-2 border-b pb-2 mb-2 font-bold text-blue-700">Login Credentials</div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Username <span className="text-red-600">*</span></label>
                        <input type="text" name="username" placeholder="New username"
                            onChange={handleChange} value={formData.username} className="border px-4 py-2 rounded-lg focus:outline-none" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Password <span className="text-red-600">*</span></label>
                        <input type="password" name="password" placeholder="New password"
                            onChange={handleChange} value={formData.password} className="border px-4 py-2 rounded-lg focus:outline-none" required />
                    </div>

                    {/* STUDENT DETAILS SECTION */}
                    <div className="md:col-span-2 border-b pb-2 mt-4 mb-2 font-bold text-blue-700">School & ID Details</div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Reg Number <span className="text-red-600">*</span></label>
                        <input type="text" name="reg_number" placeholder="Registration number"
                            onChange={handleChange} value={formData.reg_number} className="border px-4 py-2 rounded-lg focus:outline-none" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Roll Number</label>
                        <input type="text" name="roll_number" placeholder="Roll number"
                            onChange={handleChange} value={formData.roll_number} className="border px-4 py-2 rounded-lg focus:outline-none" />
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Joining Year</label>
                        <input type="number" name="joining_year" placeholder="2024"
                            onChange={handleChange} value={formData.joining_year} className="border px-4 py-2 rounded-lg focus:outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Institution</label>
                        <select name="institution" value={formData.institution} onChange={handleChange}
                            className="border px-4 py-2 rounded-lg h-[41px] outline-none text-sm">
                            <option value="">Select institution</option>
                            {institutions.map((item) => (
                                <option key={item.instu} value={item.instu}>{item.instu}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Course (Batch)</label>
                        <select name="joining_batch" value={formData.joining_batch} onChange={handleChange}
                            disabled={!formData.institution} className="border px-4 py-2 rounded-lg h-[41px] outline-none disabled:bg-gray-100 text-sm">
                            <option value="">Select course</option>
                            {courses.map((cour) => (
                                <option key={cour} value={cour}>{cour}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">School Class</label>
                        <input type="text" name="course_program" value={formData.course_program}
                            onChange={handleChange} className="border px-4 py-2 rounded-lg focus:outline-none" />
                    </div>

                    <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold mt-4 transition disabled:opacity-50">
                        {loading ? "Processing..." : "Confirm Enrollment & Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnrollStudent;
