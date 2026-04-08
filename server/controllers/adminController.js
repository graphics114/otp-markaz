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
  const totalResults = await database.query(`SELECT COUNT(*) FROM student_exam_results WHERE DATE_TRUNC('month', exam_date) = DATE_TRUNC('month', CURRENT_DATE)`);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE result_status = 'Pending') AS pending
    FROM student_exam_results
    WHERE DATE_TRUNC('month', exam_date) = DATE_TRUNC('month', CURRENT_DATE)
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

  const latestAttendance = await database.query(`
    WITH latest_session AS (
        SELECT program_id, attendance_date
        FROM attendance
        ORDER BY attendance_date DESC, created_at DESC
        LIMIT 1
    )
    SELECT 
        p.program_name,
        a.attendance_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present_count,
        COUNT(*) FILTER (WHERE a.status = false) AS absent_count
    FROM attendance a
    JOIN programs p ON a.program_id = p.id
    JOIN latest_session ls ON a.program_id = ls.program_id AND a.attendance_date = ls.attendance_date
    GROUP BY p.program_name, a.attendance_date
  `);

  const batchAttendance = await database.query(`
    WITH latest_batch_session AS (
        SELECT DISTINCT ON (s.institution, s.joining_batch)
            s.institution, 
            s.joining_batch, 
            a.attendance_date, 
            a.program_id
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        ORDER BY s.institution, s.joining_batch, a.attendance_date DESC, a.created_at DESC
    )
    SELECT 
        lbs.institution, 
        lbs.joining_batch, 
        lbs.attendance_date as max_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present,
        COUNT(*) FILTER (WHERE a.status = false) AS absent
    FROM latest_batch_session lbs
    JOIN students s ON s.institution = lbs.institution AND s.joining_batch = lbs.joining_batch
    JOIN attendance a ON a.student_id = s.id AND a.attendance_date = lbs.attendance_date AND a.program_id = lbs.program_id
    GROUP BY lbs.institution, lbs.joining_batch, lbs.attendance_date
    ORDER BY lbs.attendance_date DESC, lbs.institution, lbs.joining_batch
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

      latest_attendance: latestAttendance.rows[0] ? {
        program_name: latestAttendance.rows[0].program_name,
        date: latestAttendance.rows[0].attendance_date,
        present: Number(latestAttendance.rows[0].present_count),
        absent: Number(latestAttendance.rows[0].absent_count)
      } : null,

      batch_attendance: batchAttendance.rows.map(row => ({
        institution: row.institution,
        batch: row.joining_batch,
        date: row.max_date,
        present: Number(row.present),
        absent: Number(row.absent)
      }))
    }
  });

});

export const hifizDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`
    SELECT COUNT(*) FROM users u
    JOIN students s ON u.id = s.user_id
    WHERE s.institution = $1
  `, ["Hifzul Quran College"]);

  const totalStudents = await database.query(`SELECT COUNT(*) FROM students WHERE institution = $1`, ["Hifzul Quran College"]);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates WHERE institution = $1`, ["Hifzul_Quran_College"]); // Note: Check consistency of institution names in DB

  const totalResults = await database.query(`
  SELECT COUNT(*) 
  FROM student_exam_results ser
  JOIN students s ON s.id = ser.student_id
  WHERE s.institution = $1
  AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
  `, ["Hifzul Quran College"]);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE ser.result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE ser.result_status = 'Pending') AS pending
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    WHERE s.institution = $1
    AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
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



  const latestAttendance = await database.query(`
    WITH latest_session AS (
        SELECT a.program_id, a.attendance_date
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY a.attendance_date DESC, a.created_at DESC
        LIMIT 1
    )
    SELECT 
        p.program_name,
        a.attendance_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present_count,
        COUNT(*) FILTER (WHERE a.status = false) AS absent_count
    FROM attendance a
    JOIN programs p ON a.program_id = p.id
    JOIN students s ON a.student_id = s.id
    JOIN latest_session ls ON a.program_id = ls.program_id AND a.attendance_date = ls.attendance_date
    WHERE s.institution = $1
    GROUP BY p.program_name, a.attendance_date
  `, ["Hifzul Quran College"]);

  const batchAttendance = await database.query(`
    WITH latest_batch_session AS (
        SELECT DISTINCT ON (s.joining_batch)
            s.joining_batch, 
            a.attendance_date, 
            a.program_id
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY s.joining_batch, a.attendance_date DESC, a.created_at DESC
    )
    SELECT 
        lbs.joining_batch, 
        lbs.attendance_date as max_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present,
        COUNT(*) FILTER (WHERE a.status = false) AS absent
    FROM latest_batch_session lbs
    JOIN students s ON s.joining_batch = lbs.joining_batch AND s.institution = $1
    JOIN attendance a ON a.student_id = s.id AND a.attendance_date = lbs.attendance_date AND a.program_id = lbs.program_id
    GROUP BY lbs.joining_batch, lbs.attendance_date
    ORDER BY lbs.attendance_date DESC, lbs.joining_batch
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

      latest_attendance: latestAttendance.rows[0] ? {
        program_name: latestAttendance.rows[0].program_name,
        date: latestAttendance.rows[0].attendance_date,
        present: Number(latestAttendance.rows[0].present_count),
        absent: Number(latestAttendance.rows[0].absent_count)
      } : null,

      batch_attendance: batchAttendance.rows.map(row => ({
        institution: "Hifzul Quran College",
        batch: row.joining_batch,
        date: row.max_date,
        present: Number(row.present),
        absent: Number(row.absent)
      }))
    }
  });
});

export const dawaDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`
    SELECT COUNT(*) FROM users u
    JOIN students s ON u.id = s.user_id
    WHERE s.institution = $1
  `, ["Uthmaniyya College..."]);

  const totalStudents = await database.query(`SELECT COUNT(*) FROM students WHERE institution = $1`, ["Uthmaniyya College..."]);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates WHERE institution = $1`, ["Uthmaniyya College of Excellence"]);

  const totalResults = await database.query(`
  SELECT COUNT(*) 
  FROM student_exam_results ser
  JOIN students s ON s.id = ser.student_id
  WHERE s.institution = $1
  AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
  `, ["Uthmaniyya College..."]);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE ser.result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE ser.result_status = 'Pending') AS pending
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    WHERE s.institution = $1
    AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
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


  const latestAttendance = await database.query(`
    WITH latest_session AS (
        SELECT a.program_id, a.attendance_date
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY a.attendance_date DESC, a.created_at DESC
        LIMIT 1
    )
    SELECT 
        p.program_name,
        a.attendance_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present_count,
        COUNT(*) FILTER (WHERE a.status = false) AS absent_count
    FROM attendance a
    JOIN programs p ON a.program_id = p.id
    JOIN students s ON a.student_id = s.id
    JOIN latest_session ls ON a.program_id = ls.program_id AND a.attendance_date = ls.attendance_date
    WHERE s.institution = $1
    GROUP BY p.program_name, a.attendance_date
  `, ["Uthmaniyya College..."]);

  const batchAttendance = await database.query(`
    WITH latest_batch_session AS (
        SELECT DISTINCT ON (s.joining_batch)
            s.joining_batch, 
            a.attendance_date, 
            a.program_id
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY s.joining_batch, a.attendance_date DESC, a.created_at DESC
    )
    SELECT 
        lbs.joining_batch, 
        lbs.attendance_date as max_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present,
        COUNT(*) FILTER (WHERE a.status = false) AS absent
    FROM latest_batch_session lbs
    JOIN students s ON s.joining_batch = lbs.joining_batch AND s.institution = $1
    JOIN attendance a ON a.student_id = s.id AND a.attendance_date = lbs.attendance_date AND a.program_id = lbs.program_id
    GROUP BY lbs.joining_batch, lbs.attendance_date
    ORDER BY lbs.attendance_date DESC, lbs.joining_batch
  `, ["Uthmaniyya College..."]);


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

      latest_attendance: latestAttendance.rows[0] ? {
        program_name: latestAttendance.rows[0].program_name,
        date: latestAttendance.rows[0].attendance_date,
        present: Number(latestAttendance.rows[0].present_count),
        absent: Number(latestAttendance.rows[0].absent_count)
      } : null,

      batch_attendance: batchAttendance.rows.map(row => ({
        institution: "Uthmaniyya College...",
        batch: row.joining_batch,
        date: row.max_date,
        present: Number(row.present),
        absent: Number(row.absent)
      }))
    }
  });
});

export const schoolDashboardStats = catchAsyncError(async (req, res) => {

  const totalUsers = await database.query(`
    SELECT COUNT(*) FROM users u
    JOIN students s ON u.id = s.user_id
    WHERE s.institution = $1
  `, ["Academic"]);

  const totalStudents = await database.query(`SELECT COUNT(*) FROM students WHERE institution = $1`, ["Academic"]);
  const totalAdmissions = await database.query(`SELECT COUNT(*) FROM admission_candidates WHERE institution = $1`, ["Academic"]);

  const totalResults = await database.query(`
  SELECT COUNT(*) 
  FROM student_exam_results ser
  JOIN students s ON s.id = ser.student_id
  WHERE s.institution = $1
  AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
  `, ["Academic"]);

  const resultStatus = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE ser.result_status = 'Published') AS published,
      COUNT(*) FILTER (WHERE ser.result_status = 'Pending') AS pending
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    WHERE s.institution = $1
    AND DATE_TRUNC('month', ser.exam_date) = DATE_TRUNC('month', CURRENT_DATE)
  `, ["Academic"]);

  const studentsByInstitution = await database.query(`
    SELECT COUNT(*) AS school_students
    FROM students
    WHERE institution = $1
  `, ["Academic"]);

  const admissionsByInstitution = await database.query(`
    SELECT
      COUNT(*) FILTER (WHERE institution = $1) AS school_admissions
    FROM admission_candidates
  `, ["Academic"]);


  const latestAttendance = await database.query(`
    WITH latest_session AS (
        SELECT a.program_id, a.attendance_date
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY a.attendance_date DESC, a.created_at DESC
        LIMIT 1
    )
    SELECT 
        p.program_name,
        a.attendance_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present_count,
        COUNT(*) FILTER (WHERE a.status = false) AS absent_count
    FROM attendance a
    JOIN programs p ON a.program_id = p.id
    JOIN students s ON a.student_id = s.id
    JOIN latest_session ls ON a.program_id = ls.program_id AND a.attendance_date = ls.attendance_date
    WHERE s.institution = $1
    GROUP BY p.program_name, a.attendance_date
  `, ["Academic"]);

  const batchAttendance = await database.query(`
    WITH latest_batch_session AS (
        SELECT DISTINCT ON (s.joining_batch)
            s.joining_batch, 
            a.attendance_date, 
            a.program_id
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE s.institution = $1
        ORDER BY s.joining_batch, a.attendance_date DESC, a.created_at DESC
    )
    SELECT 
        lbs.joining_batch, 
        lbs.attendance_date as max_date,
        COUNT(*) FILTER (WHERE a.status = true) AS present,
        COUNT(*) FILTER (WHERE a.status = false) AS absent
    FROM latest_batch_session lbs
    JOIN students s ON s.joining_batch = lbs.joining_batch AND s.institution = $1
    JOIN attendance a ON a.student_id = s.id AND a.attendance_date = lbs.attendance_date AND a.program_id = lbs.program_id
    GROUP BY lbs.joining_batch, lbs.attendance_date
    ORDER BY lbs.attendance_date DESC, lbs.joining_batch
  `, ["Academic"]);


  res.status(200).json({
    success: true,
    cards: {
      total_users: Number(totalUsers.rows[0].count),
      total_students: Number(totalStudents.rows[0].count),
      total_admissions: Number(totalAdmissions.rows[0].count),
      total_results: Number(totalResults.rows[0].count),

      published_results: Number(resultStatus.rows[0].published),
      pending_results: Number(resultStatus.rows[0].pending),

      school_students: Number(studentsByInstitution.rows[0].school_students),
      school_admissions: Number(admissionsByInstitution.rows[0].school_admissions),

      latest_attendance: latestAttendance.rows[0] ? {
        program_name: latestAttendance.rows[0].program_name,
        date: latestAttendance.rows[0].attendance_date,
        present: Number(latestAttendance.rows[0].present_count),
        absent: Number(latestAttendance.rows[0].absent_count)
      } : null,

      batch_attendance: batchAttendance.rows.map(row => ({
        institution: "Academic",
        batch: row.joining_batch,
        date: row.max_date,
        present: Number(row.present),
        absent: Number(row.absent)
      }))
    }
  });
});
