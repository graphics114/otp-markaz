import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import avatar from "../assets/avatar.jpg"
import { fetchAllAdmissions, deleteAdmition } from "../store/slices/admitionSlice"
import { useEffect, useState } from "react";
import { Trash2, UserPen, FolderSearch } from "lucide-react";

import UpdateAdmition from "../pages/updateAdmition";
import RegisterAdmition from "../pages/registerAdmition";
import { toggleUpdateAdmition, toggleRegisterAdmition } from "../store/slices/extraSlice";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Admissions = () => {

  const { loading, admissions, totalAdmissions } = useSelector((state) => state.admition);
  const [selectedAdmition, setSelectedAdmition] = useState(null);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);

  const { isUpdateSAdmitionOpened, isRegisterAdmitionOpend } = useSelector((state) => state.extra);

  useEffect(() => {
    dispatch(fetchAllAdmissions(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalAdmissions !== undefined) {
      const newMax = Math.ceil(totalAdmissions / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalAdmissions]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage)
    }
  }, [maxPage, page]);

  const handleDeleteAdmition = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This candidate will be permanently deleted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAdmition(id, page));
      }
    });
  };

  const institutions = [
    "All Institutions",
    "Hifzul Quran College",
    "Uthmaniyya College of Excellence",
  ];

  // INST FILTER
  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions");
  const [search, setSearch] = useState("");

  const filteredAdmitios = admissions.filter((admition) => {
    // Institution filter
    const matchesInstitution =
      selectedInstitution === "All Institutions" ||
      admition.institution === selectedInstitution;

    // Global search (ALL FIELDS)
    const searchText = search.toLowerCase();

    const matchesSearch = Object.values(admition)
      .join(" ")
      .toLowerCase()
      .includes(searchText);

    return matchesInstitution && matchesSearch;
  });

  // EXCEL EXPORT
  const handleExcel = () => {
    // Apply same filters used in UI
    const exportData = filteredAdmitios.map((s, index) => ({
      "Sl No": index + 1,
      "Candidate Name": s.candidate_name ,
      "Date of Birth": s.date_of_birth
        ? new Date(s.date_of_birth).toLocaleDateString("en-IN")
        : "",
      "Phone Number": s.phone_number,
      "whatsapp_number": s.whatsapp_number,
      "Aadhaar Number": s.aadhar_number,
      "Blood Group": s.blood_group,

      "Father's Name": s.father_name,
      "Mother's Name": s.mother_name,

      "Guardian's Name": s.guardian_name,
      "Guardian's Phone": s.guardian_phone,

      "Address Line 1": s.address_line1,
      "Address Line 2": s.address_line2,
      "Locality": s.locality,
      "District": s.district,
      "State": s.state,
      "Country": s.country,
      "Pin Code": s.pin_code,

      "School": s.course_program,
      "Madrasa": s.madrasa_class,
      "Institution": s.institution,
      "Applayed": s.created_at,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column width
    worksheet["!cols"] = Object.keys(exportData[0]).map(() => ({
      wch: 20,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

    XLSX.writeFile(workbook, "Admition-data.xlsx");
  };


  return (<>
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      {/* HEADER */}
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold">Admissions</h1>
        <p className="text-sm text-gray-600 mb-6">Manage all your admissions</p>
      </div>

      <div className="p-4 sm:p-8 bg-gray-50 min-h-full">

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          {/* ALL FILTER */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, reg no, phone, ins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg pl-10
                               placeholder:text-sm focus:outline-none"
            />
            <FolderSearch className="absolute left-3 top-1/2 -translate-y-1/2
                      text-gray-400 w-5 h-5" />
          </div>

          {/* INST FILER */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none
                                 placeholder:text-sm h-11">
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 ml-auto">

            {/* REGISTER */}
            <button onClick={() => dispatch(toggleRegisterAdmition())}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all">
                    New Admission
            </button>

            {/* PRINT */}
            <button
              onClick={() => window.print()}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Print
            </button>

            {/* EXCEL EXPORT */}
            <button
              onClick={handleExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Excel
            </button>
          </div>

        </div>

        {/* PRINT ONLY TABLE */}
        <div id="table-print" className="hidden">
          <h2 className="text-center text-xl font-bold mb-2">
            Admitions List
          </h2>

          <p className="text-center mb-4">
            Institution: {selectedInstitution} <br />
            Date: {new Date().toLocaleDateString()}
          </p>

          <table className="w-full border-collapse border text-[10px]">
            <thead>
              <tr>
                <th className="border">#</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Candidate Name</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">DOB</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Phone</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">UIDAI</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Father's Name</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Guardian's Name</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Guardian's Phone</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Place</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">School</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Madrasa</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Institution</th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmitios.map((s, i) => (
                <tr key={s.id}>
                  <td className="border text-center">{i + 1}</td>
                  <td className="border p-2">{s.candidate_name}</td>
                  <td className="border p-2">{new Date(s.date_of_birth).toLocaleDateString("en-IN")}</td>
                  <td className="border p-2">{s.phone_number}</td>
                  <td className="border p-2">{s.aadhar_number}</td>
                  <td className="border p-2">{s.father_name}</td>
                  <td className="border p-2">{s.guardian_name}</td>
                  <td className="border p-2">{s.guardian_phone}</td>
                  <td className="border p-2">{s.locality}</td>
                  <td className="border p-2">{s.school_class}</td>
                  <td className="border p-2">{s.madrasa_class}</td>
                  <td className="border p-2">{s.institution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STUDENTS */}
        <div className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${admissions && admissions.length > 0 && "shadow-lg"}`
          }`}>
          {loading ? (
            <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent 
                        rounded-full animate-spin" />
          ) : admissions && admissions.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 table-fixed">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Candidate Name</th>
                  <th className="py-3 px-4 text-left">DOB</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Phone Number</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Whatsapp Number</th>
                  <th className="py-3 px-4 text-left">UIDAI</th>
                  <th className="py-3 px-4 text-left">Blood</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Father's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Mother's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Guardian's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Guardian's Phone</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Address Line1</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Address Line2</th>
                  <th className="py-3 px-4 text-left">Locality</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">State</th>
                  <th className="py-3 px-4 text-left">District</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Pin Code</th>
                  <th className="py-3 px-4 text-left">Institution</th>
                  <th className="py-3 px-4 text-left">Madrasa</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">School</th>
                  <th className="py-3 px-4 text-left">Applayed</th>
                  <th className="py-3 px-4 text-left">Edit</th>
                  <th className="py-3 px-4 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmitios.map((admition, index) => {
                  return (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-600">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <img src={admition?.photo?.url || avatar} alt="avatar"
                          className="w-10 h-10 rounded-md object-cover" />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.candidate_name}</td>
                      <td className="py-3 px-4">
                        {new Date(admition.date_of_birth).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-4">{admition.phone_number}</td>
                      <td className="py-3 px-4">{admition.whatsapp_number}</td>
                      <td className="py-3 px-4">{admition.aadhar_number}</td>
                      <td className="py-3 px-4">{admition.blood_group}</td>
                      <td className="py-3 px-4">{admition.father_name}</td>
                      <td className="py-3 px-4">{admition.mother_name}</td>
                      <td className="py-3 px-4">{admition.guardian_name}</td>
                      <td className="py-3 px-4">{admition.guardian_phone}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.address_line1}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.address_line2}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.locality}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.country}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.state}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.district}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.pin_code}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.institution}</td>
                      <td className="py-3 px-4">{admition.madrasa_class}</td>
                      <td className="py-3 px-4">{admition.school_class}</td>
                      <td className="py-3 px-4">{new Date(admition.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        {/* UPDATE */}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAdmition(admition);
                          dispatch(toggleUpdateAdmition());
                        }}
                          className="text-green-500 cursor-pointer font-semibold">
                          <UserPen className="w-6 h-auto" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteAdmition(admition.id)}
                          className="text-red-500 cursor-pointer font-semibold">
                          <Trash2 className="w-6 h-auto" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <h3 className="text-2xl p-6 font-bold">No Students Found!</h3>
          )}
        </div>

        {/* PAGNATION */}
        {!loading && admissions.length > 0 && (
          <div className="flex justify-center mt-6 gap-4">
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                        rounded disabled:opacity-50">
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">Page {page}</span>
            <button onClick={() => setPage((prev) => Math.min(prev + 1, maxPage))} disabled={maxPage === page}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                        rounded disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>
    </main>
    {isUpdateSAdmitionOpened && <UpdateAdmition selectedAdmition={selectedAdmition} />}
    {isRegisterAdmitionOpend && <RegisterAdmition />}
  </>)
};

export default Admissions;