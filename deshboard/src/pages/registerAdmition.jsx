import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmition } from "../store/slices/admitionSlice";
import { toggleRegisterAdmition } from "../store/slices/extraSlice";

const RegisterAdmition = () => {
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
      country: "",
      state: "",
      district: "",
      pin_code: "",
      institution: "",
      madrasa_class: "",
      school_class: "",
    });

    const handleAdmitionChange = (e) => {
      const { name, value } = e.target;

      setEditData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "state" && { district: "" }), // reset district when state changes
        ...(name === "country" && { state: "", district: "" }), // optional
      }));
    };


    const [avatarFile, setAvatarFile] = useState(null);

    // const sendWhatsApp = () => {
    //   const phone = editData.whatsapp_number; // 9876543210
    //   const message = `
    // Admission Successful ✅
    // Name: ${editData.candidate_name}
    // Institution: ${editData.institution}
    // `;

    //   const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    //   window.open(url, "_blank");
    // };

    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      setAvatarFile(file);
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (avatarFile) {
        const formData = new FormData();

        Object.keys(editData).forEach((key) => {
          formData.append(key, editData[key]);
        });

        formData.append("photo", avatarFile);

        dispatch(registerAdmition(formData));
        dispatch(toggleRegisterAdmition())
        // sendWhatsApp();
      } else {
        dispatch(registerAdmition(editData));
        dispatch(toggleRegisterAdmition())
        // sendWhatsApp();
      }
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

    return(<>
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl w-full h-full max-w-2xl p-6 relative">
            <button onClick={() => dispatch(toggleRegisterAdmition())}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl">
                    &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">New Admission</h2>
    
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
                    <input type="text" name="candidate_name" placeholder="Enter name"
                        onChange={handleAdmitionChange} value={editData.candidate_name} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        DOB <span className="text-red-600">*</span>
                    </label>
                    <input type="date" name="date_of_birth" placeholder="Enter date of birth"
                        onChange={handleAdmitionChange} value={editData.date_of_birth} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input type="tel" name="phone_number" placeholder="Enter phone number" pattern="[0-9]{10}" maxLength={10}
                        onChange={handleAdmitionChange} value={editData.phone_number} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Whatsapp Number <span className="text-red-600">*</span>
                    </label>
                    <input type="tel" name="whatsapp_number" placeholder="Enter whatsapp_number" pattern="[0-9]{10}" maxLength={10}
                        onChange={handleAdmitionChange} value={editData.whatsapp_number} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                       Aadhar Number <span className="text-red-600">*</span>
                    </label>
                    <input type="number" name="aadhar_number" placeholder="Enter aadhar number" maxLength={12}
                        onChange={handleAdmitionChange} value={editData.aadhar_number} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Blood Group
                  </label>

                  <select
                    name="blood_group"
                    value={editData.blood_group}
                    onChange={handleAdmitionChange}
                    className={`border px-4 py-2 rounded-lg h-[41px] outline-none
                      ${editData.blood_group === "" ? "bg-gray-100 text-gray-400" : "bg-white text-black"}
                      focus:bg-white focus:text-black
                    `}
                  >
                    <option value="" disabled hidden>
                      Select Blood Group
                    </option>
                    
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group} className="text-black">
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Profile Image</label>
                    <input type="file" name="avatar" onChange={handleAvatarChange}
                        className="p-2 border rounded-lg col-span-1 md:col-span-2 h-[41px]
                        file:mr-4 file:px-4 file:rounded-md file:border-0 file:bg-blue-50
                        file:text-blue-700 file:hover:text-blue-500 focus:outline-none" />
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
                        Father's Phone
                    </label>
                    <input type="tel" name="father_phone" placeholder="Enter your father's phone" maxLength={10}
                        onChange={handleAdmitionChange} value={editData.father_phone}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Father's Occupation
                    </label>
                    <input type="text" name="father_occupation" placeholder="Enter your father's occupation"
                        onChange={handleAdmitionChange} value={editData.father_occupation}
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
                        Mother's Phone
                    </label>
                    <input type="tel" name="mother_phone" placeholder="Enter your mother's phone" maxLength={10}
                        onChange={handleAdmitionChange} value={editData.mother_phone}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Mother's Occupation
                    </label>
                    <input type="text" name="mother_occupation" placeholder="Enter your mother's occupation"
                        onChange={handleAdmitionChange} value={editData.mother_occupation}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Guardian's Name <span className="text-red-600">*</span>
                    </label>
                    <input type="text" name="guardian_name" placeholder="Enter guardian's name"
                        onChange={handleAdmitionChange} value={editData.guardian_name} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Guardian's Phone <span className="text-red-600">*</span>
                    </label>
                    <input type="number" name="guardian_phone" placeholder="Enter guardian's phone" maxLength={10}
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
                    <input type="text" name="address_line1" placeholder="Enter address_line1"
                        onChange={handleAdmitionChange} value={editData.address_line1}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Address Line2
                    </label>
                    <input type="text" name="address_line2" placeholder="Enter address_line2"
                        onChange={handleAdmitionChange} value={editData.address_line2}
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Locality <span className="text-red-600">*</span>
                    </label>
                    <input type="text" name="locality" placeholder="Enter locality"
                        onChange={handleAdmitionChange} value={editData.locality} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Country
                  </label>

                  <select
                    name="country"
                    value={editData.country}
                    onChange={handleAdmitionChange}
                    className={`border px-4 py-2 rounded-lg h-[41px] outline-none
                      ${editData.country === "" ? "bg-gray-100 text-gray-400" : "bg-white text-black"}
                      focus:bg-white focus:text-black
                    `}
                  >
                    <option value="" disabled hidden>
                      Select country
                    </option>
                    <option value="India" className="text-black">
                      India
                    </option>
                  </select>
                </div>
    
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>

                  <select
                    name="state"
                    value={editData.state}
                    onChange={handleAdmitionChange}
                    className={`border px-4 py-2 rounded-lg h-[41px] outline-none
                      ${editData.state === "" ? "bg-gray-100 text-gray-400" : "bg-white text-black"}
                      focus:bg-white focus:text-black
                    `}
                  >
                    <option value="" disabled hidden>
                      Select state
                    </option>
                    
                    {indiaStates.map((item) => (
                      <option key={item.state} value={item.state} className="text-black">
                        {item.state}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">District</label>
                    <select
                      name="district"
                      value={editData.district}
                      onChange={handleAdmitionChange}
                      disabled={!editData.state}
                      className={`border px-4 py-2 rounded-lg h-[41px] outline-none
                        ${!editData.state
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : editData.district === ""
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white text-black"}
                      `}
                    >
                      <option value="" disabled hidden>
                        Select district
                      </option>
                        
                      {districts.map((dist) => (
                        <option key={dist} value={dist} className="text-black">
                          {dist}
                        </option>
                      ))}
                    </select>
                </div>
    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Pin Code
                    </label>
                    <input type="number" name="pin_code" placeholder="Enter pin code" maxLength={6}
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

                  <select
                    name="institution"
                    value={editData.institution}
                    onChange={handleAdmitionChange}
                    required
                    className={`border px-4 py-2 rounded-lg h-[41px] outline-none
                      ${editData.institution === "" ? "bg-gray-100 text-gray-400" : "bg-white text-black"}
                    `}
                  >
                    <option value="" disabled hidden>
                      Select institution
                    </option>
                    <option value="Hifzul Quran College" className="text-black">
                      Hifzul Quran College
                    </option>
                    <option value="Uthmaniyya College of Excellence" className="text-black">
                      Uthmaniyya College of Excellence
                    </option>
                  </select>
                </div>

    
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        School <span className="text-red-600">*</span>
                    </label>
                    <input type="school_class" name="school_class" placeholder="Enter school class/program"
                        onChange={handleAdmitionChange} value={editData.school_class} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <div className="flex flex-col md:col-span-1 gap-1">
                    <label className="text-sm font-medium text-gray-700">
                        Madrasa <span className="text-red-600">*</span>
                    </label>
                    <input type="madrasa_class" name="madrasa_class" placeholder="Enter mor deteails"
                        onChange={handleAdmitionChange} value={editData.madrasa_class} required
                        className="border px-4 py-2 rounded-lg placeholder:text-sm focus:outline-none" />
                </div>
    
                <button type="submit" className="flex items-center justify-center gap-2 bg-blue-600
                    hover:bg-blue-700 text-white py-2 px-6 rounded col-span-1 md:col-span-3">
                        {loading ? (
                            <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent
                                rounded-full animate-spin" />
    
                            <span>Registering...</span>
                            </>
                        ) : (
                            "Register"
                        )}
                </button>
            </form>
        </div>
    </div>
    </>)
}

export default RegisterAdmition;