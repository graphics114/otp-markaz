import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const addStudentByUser = catchAsyncError(async (req, res, next) => {

    const { userId } = req.params;

    const {
        reg_number, date_of_birth, phone_number, emergency_contact,
        aadhar_number, blood_group,
        father_name, father_phone, father_occupation,
        mother_name, mother_phone, mother_occupation,
        guardian_name, guardian_phone,
        address_line1, address_line2, locality, district, state, country,
        pin_code, joining_year, institution, joining_batch, course_program, other
    } = req.body;

    if (!reg_number || !date_of_birth || !phone_number) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // ✅ Check user exists & role = Student
    const userCheck = await database.query(
        "SELECT id, role FROM users WHERE id = $1",
        [userId]
    );

    if (userCheck.rows.length === 0) {
        return next(new ErrorHandler("User not found", 404));
    }

    if (userCheck.rows[0].role !== "Student") {
        return next(new ErrorHandler("User is not a student", 400));
    }

    // ✅ Prevent duplicate student
    const existingStudent = await database.query(
        "SELECT id FROM students WHERE user_id = $1",
        [userId]
    );

    if (existingStudent.rows.length > 0) {
        return next(new ErrorHandler("Student already exists", 400));
    }

    const result = await database.query(
        `INSERT INTO students (
            user_id, reg_number, date_of_birth, phone_number, emergency_contact,
            aadhar_number, blood_group,
            father_name, father_phone, father_occupation,
            mother_name, mother_phone, mother_occupation,
            guardian_name, guardian_phone,
            address_line1, address_line2, locality, district, state, country,
            pin_code, joining_year, institution, joining_batch, course_program, other
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,
            $23,$24,$25,$26,$27
        ) RETURNING *`,
        [
            userId, reg_number, date_of_birth, phone_number, emergency_contact,
            aadhar_number, blood_group,
            father_name, father_phone, father_occupation,
            mother_name, mother_phone, mother_occupation,
            guardian_name, guardian_phone,
            address_line1, address_line2, locality, district, state, country,
            pin_code, joining_year, institution, joining_batch, course_program, other
        ]
    );

    res.status(201).json({
        success: true,
        student: result.rows[0]
    });
});

export const updateStudent = catchAsyncError(async (req, res, next) => {

    const { studentID } = req.params;
     const { reg_number } = req.body;

    const studentCheck = await database.query(
        "SELECT id FROM students WHERE id = $1",
        [studentID]
    );

    if (studentCheck.rows.length === 0) {
        return next(new ErrorHandler("Student not found", 404));
    }

    const fields = Object.keys(req.body);
    const values = Object.values(req.body).map(v =>
        v === "" ? null : v
    );

    if (fields.length === 0) {
        return next(new ErrorHandler("No data to update", 400));
    }

    const existingStudent = await database.query(
        "SELECT id FROM students WHERE reg_number = $1 AND id !=$2",
        [reg_number, studentID]
    );

    if (existingStudent.rows.length > 0) {
        return next(new ErrorHandler("Reg number already exists", 400));
    }


    const query = `
        UPDATE students SET
        ${fields.map((f, i) => `${f} = $${i + 1}`).join(", ")}
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;

    const result = await database.query(query, [...values, studentID]);

    res.status(200).json({
        success: true,
        student: result.rows[0]
    });
});

export const deleteStudent = catchAsyncError(async (req, res, next) => {
  const { studentID } = req.params;

  // 1️⃣ Get related user_id
  const studentRes = await database.query("SELECT user_id FROM students WHERE id = $1",
    [studentID]);

  if (studentRes.rows.length === 0) {
    return next(new ErrorHandler("Student not found", 404));
  }

  const userId = studentRes.rows[0].user_id;

  // 2️⃣ Delete student
  await database.query(
    "DELETE FROM students WHERE id = $1",
    [studentID]
  );

  // 3️⃣ Delete related user
  await database.query(
    "DELETE FROM users WHERE id = $1",
    [userId]
  );

  res.status(200).json({
    success: true,
    message: "Student and related user deleted successfully",
  });
});

export const fetchStudentByUser = catchAsyncError(async (req, res, next) => {

    const { userId } = req.params;

    const result = await database.query(
        `SELECT 
            u.id AS user_id,
            u.full_name,
            u.username,
            u.role,
            s.*
         FROM users u
         LEFT JOIN students s ON s.user_id = u.id
         WHERE u.id = $1`,
        [userId]
    );

    if (result.rows.length === 0 || !result.rows[0].id) {
        return next(new ErrorHandler("Student not found", 404));
    }

    res.status(200).json({
        success: true,
        student: result.rows[0]
    });
});

export const fetchAllStudents = catchAsyncError(async (req, res) => {

    const result = await database.query(
        `SELECT 
            u.avatar,
            u.full_name,
            u.username,
            s.*
         FROM users u
         JOIN students s ON s.user_id = u.id
         WHERE u.role = 'Student'
         ORDER BY s.reg_number ASC`
    );

    res.status(200).json({
        success: true,
        count: result.rows.length,
        students: result.rows
    });
});
