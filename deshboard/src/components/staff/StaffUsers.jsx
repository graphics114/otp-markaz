import { useDispatch, useSelector } from "react-redux";
import Header from "../Header";
import avatar from "../../assets/avatar.jpg"
import { useEffect, useState } from "react";
import { fetchAllUsers, deleteUser } from "../../store/slices/adminSlice";
import { Trash2, UserPen, KeyRound, FolderSearch } from "lucide-react";
import UserRegister from "../../pages/staffUserRegister";
import UserUpdate from "../../pages/userUpdate";
import { toggleRegisterUser, toggleUpdateUser } from "../../store/slices/extraSlice";

import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const StaffUsers = () => {

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");

  const { loading, totalUsers, users } = useSelector((state) => state.admin);

  const { isRegisterUserOpened, isUpdateUserOpened } =
    useSelector((state) => state.extra);

  const dispatch = useDispatch();

  const [maxPage, setMaxPage] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (totalUsers !== undefined) {
      const newMax = Math.ceil(totalUsers / 10);
      setMaxPage(newMax || 1);
    }
  }, [totalUsers]);

  useEffect(() => {
    if (maxPage && page > maxPage) {
      setPage(maxPage);
    }
  }, [maxPage, page]);

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id, page));
      }
    });
  };

  // PRINT
  const handlePrint = () => {
    const printContent = document.getElementById("users-table-print");

    const printDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
        <html>
          <head>
            <title>Users List</title>
            <style>
              @page { size: auto; margin: 10mm; }
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background: #f1f5f9; }
              img { width: 40px; height: 40px; border-radius: 50%; }
              h2 { text-align: center; }
              p { text-align: center; }

                /* Hide actions column in print */
              .actions-col { display: none; }
            </style>
          </head>
          <body>
            <h2>Users List</h2>
            <p>Print Date: ${printDate}<p>
            ${printContent.innerHTML}
          </body>
        </html>
      `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // EXCEL EXPORT
  const handleExcel = () => {
    const exportData = filteredUsers.map((user) => ({
      Name: user.full_name,
      Username: user.username,
      Role: user.role,
      Institution: user.institution,
      Course: user.joining_batch,
      "Registered On": new Date(user.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "students-list.xlsx");
  };

  const institutions = [
    "All Institutions",
    "Hifzul Quran College",
    "Uthmaniyya College...",
  ];

  const [selectedInstitution, setSelectedInstitution] = useState("All Institutions");

  const filteredUsers = (users || []).filter((user) => {
    const matchesRole = (user.role === "Student");

    const matchesInstitution =
      selectedInstitution === "All Institutions" ||
      user.institution === selectedInstitution;

    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()) ||
      user.institution?.toLowerCase().includes(search.toLowerCase()) ||
      user.joining_batch?.toLowerCase().includes(search.toLowerCase()) ||
      user.created_at.includes(search);

    return matchesRole && matchesInstitution && matchesSearch;
  });

  return (<>
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      {/* HEADER */}
      <div className="flex-1 p-6">
        <Header />
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-600 mb-6">Manage all your users</p>
      </div>

      {/* USERS */}
      <div className="p-4 sm:p-8 bg-gray-50 min-h-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">

          {/* SEARCH */}
          <div className="relative w-full sm:w-72">
            <input type="text" placeholder="Search by name, username or role..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg pl-10
                               placeholder:text-sm focus:outline-none" />
            <FolderSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                           text-gray-400 w-5 h-5"/>
          </div>

          {/* INST FILER */}
          <div className="relative w-full sm:w-48">
            <select
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none placeholder:text-sm h-11"
            >
              {institutions.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {/* REGISTER */}
            <button onClick={() => dispatch(toggleRegisterUser())}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                        font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all">
              New User
            </button>

            {/* PRINT */}
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-700 text-white rounded">
              Print
            </button>

            {/* EXCEL */}
            <button
              onClick={handleExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Excel
            </button>
          </div>
        </div>

        {/* USER TABLE */}
        <div id="users-table-print" className={`overflow-x-auto rounded-lg ${loading ? "p-10 shadow-none" : `${users && users.length > 0 && "shadow-lg"}`}`}>
          {loading ? (
            <div className="w-40 h-40 mx-auto border-2 border-white border-t-transparent 
                            rounded-full animate-spin" />
          ) : users && users.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Joined</th>
                  <th className="py-3 px-4 text-left">Institution</th>
                  <th className="py-3 px-4 text-left">Course</th>
                  <th className="py-3 px-4 text-left actions-col">Edit</th>
                  <th className="py-3 px-4 text-left actions-col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => {
                  return (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-600">
                        {(page - 1) * 10 + index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <img src={user?.avatar?.url || avatar} alt="avatar"
                          className="w-10 h-10 rounded-md object-cover" />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{user.full_name}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{user.username}</td>
                      <td className="py-3 px-4">{user.role}</td>
                      <td className="py-3 px-4">
                        {new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{user.institution}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{user.joining_batch}</td>
                      <td className="actions-col">

                        {/* UPDATE USER */}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                          dispatch(toggleUpdateUser());
                        }}
                          className="text-green-600 cursor-pointer py-3 px-3
                                                font-semibold">
                          <UserPen className="w-6 h-auto" />
                        </button>
                      </td>
                      <td className="actions-col">
                        {/* DELETE USER */}
                        <button onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 cursor-pointer py-3 px-3 
                                                    font-semibold">
                          <Trash2 className="w-6 h-auto" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <h3 className="text-2xl p-6 font-bold">No Users Found!</h3>
          )}
        </div>

        {/* PAGNATION */}
        {!loading && users.length > 0 && (
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
    {isRegisterUserOpened && <UserRegister />}
    {isUpdateUserOpened && <UserUpdate selectedUser={selectedUser} />}
  </>);
};

export default StaffUsers;