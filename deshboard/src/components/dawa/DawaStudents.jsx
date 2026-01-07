import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import avatar from "../../assets/avatar.jpg"
import { fetchAllStudents, deleteStudent } from "../../store/slices/studentsSlice"
import { useEffect, useState } from "react";
import { Trash2, UserPen, FolderSearch } from "lucide-react";

import UpdateStudent from "../../pages/updateStudent";
import { toggleUpdateStudent } from "../../store/slices/extraSlice";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

const DawaStudents = () => {

  const { loading, students, totalStudents } = useSelector((state) => state.std);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);

  const { isUpdateStudentOpened } = useSelector((state) => state.extra);

  useEffect(() => {
    dispatch(fetchAllStudents(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalStudents !== undefined) {
      const newMax = Math.ceil(totalStudents / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalStudents]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage)
    }
  }, [maxPage, page]);

  const handleDeleteStudent = (id, reg_number) => {
    Swal.fire({
      title: "Are you sure?",
      text: `This student "${reg_number}" will be permanently deleted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteStudent(id, page));
      }
    });
  };

  // INST FILTER
  const Course = [
    "All Course",
    "HI1",
    "HI2",
    "HS1",
    "HS2",
    "BS1",
    "BS2",
    "BS3",
    "BS4",
    "BS5",
  ];

  const [selectedCours, setSelectedCours] = useState("All Course");
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) => {
    // Institution filter
    const matchesInstitution =
      student.institution === "Uthmaniyya College...";

    // Course filter
    const matchesCourse =
      selectedCours === "All Course" || student.joining_batch === selectedCours;

    // Global search (ALL FIELDS)
    const searchText = search.toLowerCase();

    const matchesSearch = Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchText);

    return matchesInstitution && matchesCourse && matchesSearch;
  });

  const handlePDF = () => {
    const element = document.getElementById("table-print");
    element.style.display = "block";

    html2pdf()
      .set({
        margin: [0.2, 0.2, 0.2, 0.2],
        filename: "dawa-students.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          scrollX: 0,
          scrollY: 0,
          useCORS: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "landscape",
        },
      })
      .from(element)
      .save()
      .then(() => {
        element.style.display = "none";
      });
  };

  // EXCEL EXPORT
  const handleExcel = () => {
    // Apply same filters used in UI
    const exportData = filteredStudents.map((s, index) => ({
      "Sl No": index + 1,
      "Full Name": s.full_name,
      "Register Number": s.reg_number,
      "Date of Birth": s.date_of_birth
        ? new Date(s.date_of_birth).toLocaleDateString("en-IN")
        : "",
      "Phone Number": s.phone_number,
      "Emergency Contact": s.emergency_contact,
      "Aadhaar Number": s.aadhar_number,
      "Blood Group": s.blood_group,

      "Father Name": s.father_name,
      "Father Phone": s.father_phone,
      "Father Occupation": s.father_occupation,

      "Mother Name": s.mother_name,
      "Mother Phone": s.mother_phone,
      "Mother Occupation": s.mother_occupation,

      "Guardian Name": s.guardian_name,
      "Guardian Phone": s.guardian_phone,

      "Address Line 1": s.address_line1,
      "Address Line 2": s.address_line2,
      "Locality": s.locality,
      "District": s.district,
      "State": s.state,
      "Country": s.country,
      "Pin Code": s.pin_code,

      "Institution": s.institution,
      "Course": s.joining_batch,
      "School": s.course_program,
      "Joining Year": s.joining_year,
      "Other": s.other,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto column width
    worksheet["!cols"] = Object.keys(exportData[0]).map(() => ({
      wch: 20,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Dawa students-full-data.xlsx");
  };

  return (<>
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      {/* HEADER */}
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold">Students</h1>
        <p className="text-sm text-gray-600 mb-6">Manage all Students</p>
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

          {/* COURSE FILTER */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedCours}
              onChange={(e) => setSelectedCours(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none
                                 placeholder:text-sm h-11 cursor-pointer">
              {Course.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 ml-auto">

            {/* PDF */}
            <button
              onClick={handlePDF}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              PDF
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
        <div id="table-print" className="hidden"
          style={{ width: "100%", padding: "0", margin: "0", fontFamily: "Arial, sans-serif", }}>
          <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "700", lineHeight: "2" }}>
            Students List
          </h2>

          <p style={{ textAlign: "center", fontSize: "12px", lineHeight: "2", }} className="mb-2">
            Institution: Hifzul Quran College <br />
            Date: {new Date().toLocaleDateString()}
          </p>

          <table className="w-full border-collapse border text-[10px]"
            style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", }}>
            <thead>
              <tr>
                <th className="border mb-1">#</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Name</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Reg No</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Phone</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Course</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">UIDAI</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Father Name</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Phone</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">Place</th>
                <th className="border px-1 py-0.5 whitespace-nowrap">School</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s, i) => (
                <tr key={s.id}>
                  <td className="border text-center">{i + 1}</td>
                  <td className="border p-2">{s.full_name}</td>
                  <td className="border p-2">{s.reg_number}</td>
                  <td className="border p-2">{s.phone_number}</td>
                  <td className="border p-2">{s.joining_batch}</td>
                  <td className="border p-2">{s.aadhar_number}</td>
                  <td className="border p-2">{s.father_name}</td>
                  <td className="border p-2">{s.father_phone}</td>
                  <td className="border p-2">{s.locality}</td>
                  <td className="border p-2">{s.course_program}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* STUDENTS */}
        <div className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${students && students.length > 0 && "shadow-lg"}`
          }`}>
          {loading ? (
            <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent 
                        rounded-full animate-spin" />
          ) : students && students.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 table-fixed">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Reg No</th>
                  <th className="py-3 px-4 text-left">DOB</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Phone Number</th>
                  <th className="py-3 px-4 text-left">Emergency</th>
                  <th className="py-3 px-4 text-left">UIDAI</th>
                  <th className="py-3 px-4 text-left">Blood</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Father's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Father's Phone</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Father's Occupation</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Mother's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Mother's Phone</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Mother's Occupation</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Guardian's Name</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Guardian's Phone</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Address Line1</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Address Line2</th>
                  <th className="py-3 px-4 text-left">Locality</th>
                  <th className="py-3 px-4 text-left">Country</th>
                  <th className="py-3 px-4 text-left">State</th>
                  <th className="py-3 px-4 text-left">District</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Pin Code</th>
                  <th className="py-3 px-4 text-left">Join</th>
                  <th className="py-3 px-4 text-left">Institution</th>
                  <th className="py-3 px-4 text-left">Course</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">School</th>
                  <th className="py-3 px-4 text-left">other</th>
                  <th className="py-3 px-4 text-left">Edit</th>
                  <th className="py-3 px-4 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => {
                  return (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-600">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <img src={student?.avatar?.url || avatar} alt="avatar"
                          className="w-10 h-10 rounded-md object-cover" />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.full_name}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.reg_number}</td>
                      <td className="py-3 px-4">
                        {new Date(student.date_of_birth).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3 px-4">{student.phone_number}</td>
                      <td className="py-3 px-4">{student.emergency_contact}</td>
                      <td className="py-3 px-4">{student.aadhar_number}</td>
                      <td className="py-3 px-4">{student.blood_group}</td>
                      <td className="py-3 px-4">{student.father_name}</td>
                      <td className="py-3 px-4">{student.father_phone}</td>
                      <td className="py-3 px-4">{student.father_occupation}</td>
                      <td className="py-3 px-4">{student.mother_name}</td>
                      <td className="py-3 px-4">{student.mother_phone}</td>
                      <td className="py-3 px-4">{student.mother_occupation}</td>
                      <td className="py-3 px-4">{student.guardian_name}</td>
                      <td className="py-3 px-4">{student.guardian_phone}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.address_line1}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.address_line2}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.locality}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.country}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.state}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.district}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.pin_code}</td>
                      <td className="py-3 px-4">{student.joining_year}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{student.institution}</td>
                      <td className="py-3 px-4">{student.joining_batch}</td>
                      <td className="py-3 px-4">{student.course_program}</td>
                      <td className="py-3 px-4">{student.other}</td>
                      <td className="py-3 px-4">
                        {/* UPDATE */}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                          dispatch(toggleUpdateStudent());
                        }}
                          className="text-green-500 cursor-pointer font-semibold">
                          <UserPen className="w-6 h-auto" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteStudent(student.id, student.reg_number)}
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
        {!loading && students.length > 0 && (
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
    {isUpdateStudentOpened && <UpdateStudent selectedStudent={selectedStudent} />}
  </>)
};

export default DawaStudents;