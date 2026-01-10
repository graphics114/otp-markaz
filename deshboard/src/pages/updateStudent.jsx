import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStudent } from "../store/slices/studentsSlice";
import { toggleUpdateStudent } from "../store/slices/extraSlice";


const UpdateStudent = ({ selectedStudent }) => {
    
    const dispatch = useDispatch();

    const { loading } = useSelector((state) => state.std);

    const [editData, setEditData] = useState({
        studentId: "",
        reg_number: "",
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

    useEffect(() => {
        if(selectedStudent) {
            setEditData({
                full_name: selectedStudent.full_name || "",
                studentId: selectedStudent.id || "",

                reg_number: selectedStudent.reg_number || "",
                date_of_birth: selectedStudent.date_of_birth
                ? new Date(selectedStudent.date_of_birth).toISOString().split("T")[0]
                : "",
                phone_number: selectedStudent.phone_number || "",
                emergency_contact: selectedStudent.emergency_contact || "",
                
                aadhar_number: selectedStudent.aadhar_number || "",
                blood_group: selectedStudent.blood_group || "",
                
                father_name: selectedStudent.father_name || "",
                father_phone: selectedStudent.father_phone || "",
                father_occupation: selectedStudent.father_occupation || "",
                
                mother_name: selectedStudent.mother_name || "",
                mother_phone: selectedStudent.mother_phone || "",
                mother_occupation: selectedStudent.mother_occupation || "",
                
                guardian_name: selectedStudent.guardian_name || "",
                guardian_phone: selectedStudent.guardian_phone || "",
                
                address_line1: selectedStudent.address_line1 || "",
                address_line2: selectedStudent.address_line2 || "",
                locality: selectedStudent.locality || "",
                district: selectedStudent.district || "",
                state: selectedStudent.state || "",
                country: selectedStudent.country || "",
                
                pin_code: selectedStudent.pin_code || "",
                joining_year: selectedStudent.joining_year || "",
                institution: selectedStudent.institution || "",
                joining_batch: selectedStudent.joining_batch || "",
                course_program: selectedStudent.course_program || "",
                other: selectedStudent.other || "",
            });
        }
    }, [selectedStudent]);

    const handleStudentChange = (e) => {
        setEditData({ ...editData, [e.target.name] : e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            reg_number: editData.reg_number,
            date_of_birth: editData.date_of_birth,
            phone_number: editData.phone_number,
            emergency_contact: editData.emergency_contact,
            
            aadhar_number: editData.aadhar_number,
            blood_group: editData.blood_group,
            
            father_name: editData.father_name,
            father_phone: editData.father_phone,
            father_occupation: editData.father_occupation,
            
            mother_name: editData.mother_name,
            mother_phone: editData.mother_phone,
            mother_occupation: editData.mother_occupation,
            
            guardian_name: editData.guardian_name,
            guardian_phone: editData.guardian_phone,
            
            address_line1: editData.address_line1,
            address_line2: editData.address_line2,
            locality: editData.locality,
            district: editData.district,
            state: editData.state,
            country: editData.country,
            
            pin_code: editData.pin_code,
            joining_year: editData.joining_year,
            institution: editData.institution,
            joining_batch: editData.joining_batch,
            course_program: editData.course_program,
            other: editData.other,
        }

        dispatch(updateStudent(selectedStudent.id, data));
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


    return(<>
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full h-full max-w-2xl p-6 relative">
            <button onClick={() => dispatch(toggleUpdateStudent())}
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
                        StudentId
                    </label>
                    <span className="border px-4 py-2 rounded-lg overflow-hidden h-[41px] text-gray-600
                        whitespace-nowrap text-ellipsis">
                        {editData.studentId}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <span className="border px-4 py-2 rounded-lg overflow-hidden h-[41px] text-gray-600
                        whitespace-nowrap text-ellipsis">
                        {editData.full_name}
                    </span>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Reg Number <span className="text-red-600">*</span>
                    </label>
                    <input type="text" name="reg_number" placeholder="Enter your regnum"
                        onChange={handleStudentChange} value={editData.reg_number} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        DOB
                    </label>
                    <input type="date" name="date_of_birth" placeholder="Enter your date of birth"
                        onChange={handleStudentChange} value={editData.date_of_birth}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Phone Number 
                    </label>
                    <input type="tel" name="phone_number" placeholder="Enter your phone number" maxLength={10}
                        onChange={handleStudentChange} value={editData.phone_number} 
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Emergency Contact
                    </label>
                    <input type="tel" name="emergency_contact" placeholder="Enter your emergency contact" maxLength={10}
                        onChange={handleStudentChange} value={editData.emergency_contact}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Aadhar Number 
                    </label>
                    <input type="num" name="aadhar_number" placeholder="Enter your aadhar number" maxLength={12}
                        onChange={handleStudentChange} value={editData.aadhar_number} 
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Blood Group
                    </label>
                    <select name="blood_group" value={editData.blood_group} onChange={handleStudentChange}
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
                        Father's Name 
                    </label>
                    <input type="text" name="father_name" placeholder="Enter your father's name"
                        onChange={handleStudentChange} value={editData.father_name} 
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Father's Phone
                    </label>
                    <input type="tel" name="father_phone" placeholder="Enter your father's phone" maxLength={10}
                        onChange={handleStudentChange} value={editData.father_phone}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Father's Occupation
                    </label>
                    <input type="text" name="father_occupation" placeholder="Enter your father's occupation"
                        onChange={handleStudentChange} value={editData.father_occupation}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Mother's Name 
                    </label>
                    <input type="text" name="mother_name" placeholder="Enter your mother's name"
                        onChange={handleStudentChange} value={editData.mother_name} 
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Mother's Phone
                    </label>
                    <input type="tel" name="mother_phone" placeholder="Enter your mother's phone" maxLength={10}
                        onChange={handleStudentChange} value={editData.mother_phone}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Mother's Occupation
                    </label>
                    <input type="text" name="mother_occupation" placeholder="Enter your mother's occupation"
                        onChange={handleStudentChange} value={editData.mother_occupation}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Guardian's Name 
                    </label>
                    <input type="text" name="guardian_name" placeholder="Enter your guardian's name"
                        onChange={handleStudentChange} value={editData.guardian_name} 
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Guardian's Phone
                    </label>
                    <input type="tel" name="guardian_phone" placeholder="Enter your guardian's phone" maxLength={10}
                        onChange={handleStudentChange} value={editData.guardian_phone}
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
                        onChange={handleStudentChange} value={editData.address_line1}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Address Line2
                    </label>
                    <input type="text" name="address_line2" placeholder="Enter your address_line2"
                        onChange={handleStudentChange} value={editData.address_line2}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Locality
                    </label>
                    <input type="text" name="locality" placeholder="Enter your locality"
                        onChange={handleStudentChange} value={editData.locality}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Country
                    </label>
                    <select name="country" value={editData.country} onChange={handleStudentChange}
                        className="border px-4 py-2 rounded-lg h-[41px] outline-none">
                            <option value="">Select country</option>
                            <option value="India">India</option>
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       State
                    </label>
                    <select name="state" value={editData.state} onChange={handleStudentChange}
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
                    name="district" value={editData.district} onChange={handleStudentChange} 
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
                        onChange={handleStudentChange} value={editData.pin_code}
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
                    <input type="num" name="joining_year" placeholder="Enter joining_year" maxLength={4}
                        onChange={handleStudentChange} value={editData.joining_year}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Institution
                    </label>
                    <select name="institution" value={editData.institution} onChange={handleStudentChange}
                        className="border px-4 py-2 rounded-lg h-[41px] outline-none">
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
                    name="joining_batch" value={editData.joining_batch} onChange={handleStudentChange} 
                    disabled={!editData.institution} className="border px-4 py-2 rounded-lg h-[41px] 
                    outline-none disabled:bg-gray-100">
                    <option value="">Select course</option>
                    {courses.map((cour) => (
                      <option key={cour} value={cour}>
                        {cour}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        School
                    </label>
                    <input type="course_program" name="course_program" placeholder="Enter school class/program"
                        onChange={handleStudentChange} value={editData.course_program}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col md:col-span-2 gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Other Details
                    </label>
                    <input type="other" name="other" placeholder="Enter mor deteails"
                        onChange={handleStudentChange} value={editData.other}
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

export default UpdateStudent;