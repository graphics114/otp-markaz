import ErrorHandler from "../middlewares/errorMiddlewares.js";
import database from "../database/db.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const fetchAllUsers = catchAsyncError(async (req, res) => {

  const result = await database.query(`
        SELECT
            u.id,
            u.full_name,
            u.username,
            u.role,
            u.avatar,
            u.created_at,
            s.institution,
            s.joining_batch
        FROM users u
        LEFT JOIN students s ON u.id = s.user_id
        ORDER BY u.created_at DESC
    `);

  res.status(200).json({
    success: true,
    count: result.rows.length,
    users: result.rows
  });
});

export const fetchSingleUser = catchAsyncError(async (req, res, next) => {

  const { userId } = req.params;

  const result = await database.query(
    `SELECT id, full_name, username, role, avatar, created_at
         FROM users
         WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: result.rows[0]
  });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {

  const { userId } = req.params;
  const { role } = req.body;

  if (!role) {
    return next(new ErrorHandler("Role is required", 400));
  }

  const result = await database.query(
    `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING id, full_name, username, role`,
    [role, userId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user: result.rows[0]
  });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {

  const { userId } = req.params;

  const result = await database.query(
    `DELETE FROM users
         WHERE id = $1
         RETURNING id`,
    [userId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});

export const adminDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`SELECT COUNT(*) FROM users`);
  const totalStudents = await database.query(`SELECT COUNT(*) FROM students`);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates`);
  const totalResults = await database.query(`SELECT COUNT(*) FROM student_exam_results`);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE result_status = 'Pending') AS pending
    FROM student_exam_results
  `);

  const studentsByInstitution = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE institution = 'Hifzul Quran College') AS hifzul_students,
      COUNT(*) FILTER (WHERE institution = 'Uthmaniyya College...') AS uthmaniyya_students
    FROM students
  `);

  const admissionsByInstitution = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE institution = 'Hifzul Quran College') AS hifzul_admissions,
      COUNT(*) FILTER (WHERE institution = 'Uthmaniyya College of Excellence') AS uthmaniyya_admissions
    FROM admission_candidates
  `);

  res.status(200).json({
    success: true,
    cards: {
      total_users: Number(totalUsers.rows[0].count),
      total_students: Number(totalStudents.rows[0].count),
      total_admissions: Number(totalAdmissions.rows[0].count),
      total_results: Number(totalResults.rows[0].count),

      published_results: Number(resultStatus.rows[0].published),
      pending_results: Number(resultStatus.rows[0].pending),

      hifzul_students: Number(studentsByInstitution.rows[0].hifzul_students),
      uthmaniyya_students: Number(studentsByInstitution.rows[0].uthmaniyya_students),

      hifzul_admissions: Number(admissionsByInstitution.rows[0].hifzul_admissions),
      uthmaniyya_admissions: Number(admissionsByInstitution.rows[0].uthmaniyya_admissions),
    }
  });
});

export const hifizDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`SELECT COUNT(*) FROM users WHERE users.role = $1`, ["Student"]);
  
  const totalStudents = await database.query(`SELECT COUNT(*) FROM students`);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates`);

  const totalResults = await database.query(`
  SELECT COUNT(*) 
  FROM student_exam_results ser
  JOIN students s ON s.id = ser.student_id
  WHERE s.institution = $1
  `, ["Hifzul Quran College"]);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE ser.result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE ser.result_status = 'Pending') AS pending
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    WHERE s.institution = $1
  `, ["Hifzul Quran College"]);

  const studentsByInstitution = await database.query(`
    SELECT COUNT(*) AS hifzul_students
    FROM students
    WHERE institution = $1
  `, ["Hifzul Quran College"]);

  const admissionsByInstitution = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE institution = $1) AS hifzul_admissions
    FROM admission_candidates
  `, ["Hifzul Quran College"]);


  res.status(200).json({
    success: true,
    cards: {
      total_users: Number(totalUsers.rows[0].count),
      total_students: Number(totalStudents.rows[0].count),
      total_admissions: Number(totalAdmissions.rows[0].count),
      total_results: Number(totalResults.rows[0].count),

      published_results: Number(resultStatus.rows[0].published),
      pending_results: Number(resultStatus.rows[0].pending),

      hifzul_students: Number(studentsByInstitution.rows[0].hifzul_students),
      hifzul_admissions: Number(admissionsByInstitution.rows[0].hifzul_admissions),
    }
  });
});

export const dawaDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`SELECT COUNT(*) FROM users WHERE users.role = $1`, ["Student"]);
  
  const totalStudents = await database.query(`SELECT COUNT(*) FROM students`);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates`);

  const totalResults = await database.query(`
  SELECT COUNT(*) 
  FROM student_exam_results ser
  JOIN students s ON s.id = ser.student_id
  WHERE s.institution = $1
  `, ["Uthmaniyya College..."]);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE ser.result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE ser.result_status = 'Pending') AS pending
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    WHERE s.institution = $1
  `, ["Uthmaniyya College..."]);

  const studentsByInstitution = await database.query(`
    SELECT COUNT(*) AS dawa_students
    FROM students
    WHERE institution = $1
  `, ["Uthmaniyya College..."]);

  const admissionsByInstitution = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE institution = $1) AS dawa_admissions
    FROM admission_candidates
  `, ["Uthmaniyya College of Excellence"]);


  res.status(200).json({
    success: true,
    cards: {
      total_users: Number(totalUsers.rows[0].count),
      total_students: Number(totalStudents.rows[0].count),
      total_admissions: Number(totalAdmissions.rows[0].count),
      total_results: Number(totalResults.rows[0].count),

      published_results: Number(resultStatus.rows[0].published),
      pending_results: Number(resultStatus.rows[0].pending),

      dawa_students: Number(studentsByInstitution.rows[0].dawa_students),
      dawa_admissions: Number(admissionsByInstitution.rows[0].dawa_admissions),
    }
  });
});