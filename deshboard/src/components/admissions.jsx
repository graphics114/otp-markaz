import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
// import avatar from "../assets/avatar.jpg"
import { fetchAllAdmissions, deleteAdmition } from "../store/slices/admitionSlice"
import { useEffect, useState } from "react";
import { Trash2, UserPen, FolderSearch, Ticket, BanknoteArrowDown } from "lucide-react";

import UpdateAdmition from "../pages/updateAdmition";
import RegisterAdmition from "../pages/registerAdmition";
import EnrollStudent from "../pages/enrollStudent";
import { toggleUpdateAdmition, toggleRegisterAdmition, toggleEnrollStudent } from "../store/slices/extraSlice";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Admissions = () => {

  const { loading, admissions } = useSelector((state) => state.admition);
  const [selectedAdmition, setSelectedAdmition] = useState(null);

  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);

  const { isUpdateSAdmitionOpened, isRegisterAdmitionOpend, isEnrollStudentOpened } = useSelector((state) => state.extra);

  const institutions = [
    "All Institutions",
    "Hifzul Quran College",
    "Uthmaniyya College of Excellence",
  ];

  // INST FILTER
  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions");
  const [search, setSearch] = useState("");
  // Default to current date (YYYY-MM-DD)
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);

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

  useEffect(() => {
    dispatch(fetchAllAdmissions(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (filteredAdmitios.length !== undefined) {
      const newMax = Math.ceil(filteredAdmitios.length / 10);
      setMaxPage(newMax || 1);
    }
  }, [filteredAdmitios.length]);

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

  // EXCEL EXPORT
  const handleExcel = () => {
    // Apply same filters used in UI
    const exportData = filteredAdmitios.map((s, index) => ({
      "Sl No": index + 1,
      "Admission ID": s.id ? s.id.toString().slice(-6).toUpperCase() : "------",
      "Candidate Name": s.candidate_name,
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
      "Institution": s.institution,
      "School": s.school_class,
      "Board": s.syllabus,
      "Medium": s.medium,
      "Madrasa": s.madrasa_class,
      "Earlier": s.earlier,
      "Prv Institution": s.prv_institution,
      "prv Contact": s.inst_contact,
      "Complited Juz": s.com_juz,
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

  // PRINT STATE
  const [printType, setPrintType] = useState('list');

  const handlePrintList = () => {
    setPrintType('list');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePrintHallTicket = () => {
    setPrintType('hallTicket');
    setTimeout(() => {
      window.print();
    }, 100);
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

          {/* DATE INPUT */}
          <div className="relative w-full sm:w-48">
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg text-sm h-11 focus:outline-none placeholder-gray-400"
            />
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

          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto ml-auto">

            {/* REGISTER */}
            <button onClick={() => dispatch(toggleRegisterAdmition())}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all whitespace-nowrap w-full sm:w-auto">
              New Admission
            </button>

            {/* PRINT LIST */}
            <button
              onClick={handlePrintList}
              className="bg-gray-700 text-white px-4 py-2 rounded flex-1 sm:flex-none"
            >
              Print
            </button>

            {/* HALL TICKET */}
            <button
              onClick={handlePrintHallTicket}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Ticket className="w-4 h-4" />
            </button>

            {/* EXCEL EXPORT */}
            <button
              onClick={handleExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex-1 sm:flex-none"
            >
              Excel
            </button>
          </div>

        </div>

        {/* PRINT ONLY LIST TABLE */}
        {printType === 'list' && (
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
                  <th className="border px-1 py-0.5 whitespace-nowrap">Institution</th>
                  <th className="border px-1 py-0.5 whitespace-nowrap">Syllabus</th>
                  <th className="border px-1 py-0.5 whitespace-nowrap">School</th>
                  <th className="border px-1 py-0.5 whitespace-nowrap">Madrasa</th>
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
                    <td className="border p-2">{s.institution}</td>
                    <td className="border p-2">{s.syllabus}</td>
                    <td className="border p-2">{s.school_class}</td>
                    <td className="border p-2">{s.madrasa_class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRINT ONLY HALL TICKETS */}
        {printType === 'hallTicket' && (
          <div id="hall-ticket-print" className="hidden">
            <style>{`
              @media print {
                @page { margin: 5mm; size: A4 portrait; }
                body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            `}</style>
            {filteredAdmitios.map((student, index) => (
              <div key={student.id}
                className="w-full font-sans print-hall-ticket-container relative"
                style={{ height: '135mm', pageBreakInside: 'avoid', breakInside: 'avoid', breakAfter: index % 2 !== 0 ? 'page' : 'auto', padding: '4mm' }}>

                {/* CARD CONTAINER */}
                <div className="border border-blue-900 h-full bg-white relative p-4 flex flex-col overflow-hidden rounded-xl shadow-[inset_0_0_0_2px_#1e3a8a]">

                  {/* Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
                    <img src="/logo2.png" alt="watermark" className="w-[50%] object-contain grayscale" />
                  </div>

                  {/* HEADER */}
                  <div className="flex justify-between items-start border-b-2 pb-2 mb-3 shrink-0 relative z-10">
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="h-16 w-16 p-1 bg-white rounded-full border-2 border-blue-100 flex items-center justify-center">
                        <img src="/logo2.png" alt="Logo" className="w-[85%] h-[85%] object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-[11px] font-bold text-blue-900 uppercase tracking-[0.2em] leading-none mb-1">Ottapalam Markaz</h1>
                        <h2 className="text-xl font-extrabold uppercase tracking-tight text-blue-950 mt-0.5">{student.institution || "Institution"}</h2>
                        <div className="mt-1.5 bg-blue-900 text-white px-2.5 py-1 inline-block rounded w-max shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Entrance Examination Hall Ticket</p>
                        </div>
                      </div>
                    </div>
                    {/* Admition ID */}
                    <div className="text-center rounded-lg border-2 border-blue-900 bg-blue-50 overflow-hidden shrink-0 min-w-[130px] shadow-sm">
                      <div className="bg-blue-900 text-white py-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider leading-none">Admission ID</p>
                      </div>
                      <div className="p-2.5">
                        <p className="text-xl font-mono font-bold text-blue-950 leading-none">{student.id ? student.id.toString().slice(-6).toUpperCase() : "------"}</p>
                      </div>
                    </div>
                  </div>

                  {/* BODY CONTENT */}
                  <div className="flex-1 flex flex-col justify-between relative z-10 mb-2">

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 pr-10">

                      <div className="col-span-2 flex items-baseline border-b border-gray-300 pb-1.5">
                        <span className="w-40 text-[11px] font-bold text-slate-500 uppercase">Candidate Name</span>
                        <span className="text-lg font-bold text-slate-900 uppercase leading-snug">
                          : {student.candidate_name}
                          {student.locality && <span className="text-sm font-semibold text-slate-600 ml-1.5 align-baseline">, {student.locality}</span>}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-baseline border-b border-gray-300 pb-1.5">
                        <span className="w-32 text-[10px] font-bold text-slate-500 uppercase">Father's Name</span>
                        <span className="flex-1 text-sm font-bold text-slate-800 uppercase">
                          : {student.father_name || "-"}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-baseline border-b border-gray-300 pb-1.5">
                        <span className="w-32 text-[10px] font-bold text-slate-500 uppercase">Institution</span>
                        <span className="flex-1 text-sm font-bold text-slate-800 uppercase">
                          : {student.institution || "General"}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-baseline border-b border-gray-300 pb-1.5">
                        <span className="w-32 text-[10px] font-bold text-slate-500 uppercase">Date of Birth</span>
                        <span className="flex-1 text-sm font-bold text-slate-800 uppercase">
                          : {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString("en-IN") : "N/A"}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-baseline border-b border-gray-300 pb-1.5">
                        <span className="w-32 text-[10px] font-bold text-slate-500 uppercase">School / Madrasa</span>
                        <span className="flex-1 text-sm font-bold text-slate-800 uppercase">
                          : {student.school_class || "-"} / {student.madrasa_class || "-"}
                        </span>
                      </div>

                    </div>

                    {/* Venue Box */}
                    <div className="mt-4 flex justify-between items-center border border-blue-200 rounded-lg p-3 shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-500 mb-0.5 tracking-wide">Examination Centre</p>
                        <p className="text-sm font-bold text-blue-950 uppercase">{student.institution || "Main Campus"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-500 mb-0.5 tracking-wide">Examination Date</p>
                        <p className="text-base font-bold text-blue-800">{examDate ? new Date(examDate).toLocaleDateString('en-GB') : "As per schedule"}</p>
                      </div>
                    </div>

                  </div>

                  {/* FOOTER */}
                  <div className="border-t-2 border-blue-900 pt-2 flex justify-between items-end mt-auto relative z-10 shrink-0">
                    <div className="flex-1 pr-6">
                      <p className="text-[11px] font-extrabold uppercase text-slate-900 mb-2">Important Instructions :</p>
                      <ul className="text-[9px] text-slate-700 list-decimal pl-4 space-y-1 font-semibold leading-relaxed">
                        <li>Candidate must carry a printed copy of this Hall Ticket and a Valid ID proof.</li>
                        <li>Report at the examination centre 30 minutes prior to the commencement of the exam.</li>
                        <li>Electronic devices, smart watches, and unauthorized materials are strictly prohibited inside the hall.</li>
                      </ul>
                    </div>

                    <div className="flex gap-8 items-end">
                      <div className="w-36 text-center">
                        <div className="h-12 border-b border-dashed border-gray-300 mb-1"></div>
                        <div className="border-t-2 border-slate-500 pt-1">
                          <p className="text-[10px] font-bold uppercase text-slate-800">Candidate's Sign</p>
                        </div>
                      </div>
                      <div className="w-36 text-center relative">
                        {/* Fake Stamp Visualizer */}
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-12 h-12 border-[3px] border-blue-600/20 rounded-full flex items-center justify-center pointer-events-none">
                          <span className="text-[5px] text-blue-600/30 uppercase font-bold transform -rotate-12">Authorized</span>
                        </div>
                        <div className="h-12 border-b border-dashed border-gray-300 mb-1"></div>
                        <div className="border-t-2 border-slate-500 pt-1">
                          <p className="text-[10px] font-bold uppercase text-slate-800">Authorized Signatory</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual cut line shown randomly if needed, disabled for raw print */}
                  {index % 2 === 0 && (
                    <div className="absolute -bottom-4 left-0 w-full flex items-center justify-center opacity-30 select-none">
                      <span className="text-xs text-slate-500 tracking-[0.5em] font-mono">------------------------------------</span>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}

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
                  {/* <th className="py-3 px-4 text-left">Image</th> */}
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
                  <th className="py-3 px-4 text-left whitespace-nowrap">School</th>
                  <th className="py-3 px-4 text-left">Board</th>
                  <th className="py-3 px-4 text-left">Medium</th>
                  <th className="py-3 px-4 text-left">Madrasa</th>
                  <th className="py-3 px-4 text-left">Earlier</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Prv Institution</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">prv Contact</th>
                  <th className="py-3 px-4 text-left whitespace-nowrap">Complited Juz</th>
                  <th className="py-3 px-4 text-left">Applayed</th>
                  <th className="py-3 px-4 text-left">Edit</th>
                  <th className="py-3 px-4 text-left">Delete</th>
                  <th className="py-3 px-4 text-left">Enroll</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmitios.slice((page - 1) * 10, page * 10).map((admition, index) => {
                  return (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-600">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      {/* <td className="py-3 px-4">
                        <img src={admition?.photo?.url || avatar} alt="avatar"
                          className="w-10 h-10 rounded-md object-cover" />
                      </td> */}
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
                      <td className="py-3 px-4">{admition.school_class}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{admition.syllabus}</td>
                      <td className="py-3 px-4">{admition.medium}</td>
                      <td className="py-3 px-4">{admition.madrasa_class}</td>
                      <td className="py-3 px-4">{admition.earlier}</td>
                      <td className="py-3 px-4">{admition.prv_institution}</td>
                      <td className="py-3 px-4">{admition.inst_contact}</td>
                      <td className="py-3 px-4">{admition.com_juz}</td>
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
                      <td className="py-3 px-4">
                        {/* ENROLL */}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAdmition(admition);
                          dispatch(toggleEnrollStudent());
                        }}
                          className="text-gray-600 cursor-pointer font-semibold">
                          <BanknoteArrowDown className="w-6 h-auto" />
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
    {isEnrollStudentOpened && <EnrollStudent selectedAdmition={selectedAdmition} />}
  </>)
};

export default Admissions;