import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

export const addExamResult = catchAsyncError(async (req, res, next) => {

    const { studentId } = req.params;
    const { hifiz_marks, hizb_marks, tajweed_marks } = req.body;

    const studentCheck = await database.query(
        "SELECT id FROM students WHERE id = $1",
        [studentId]
    );

    if (studentCheck.rows.length === 0) {
        return next(new ErrorHandler("Student not found", 404));
    }

    const result = await database.query(
        `INSERT INTO student_exam_results (
            student_id, hifiz_marks, hizb_marks, tajweed_marks
        ) VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [studentId, hifiz_marks, hizb_marks, tajweed_marks]
    );

    res.status(201).json({
        success: true,
        exam: result.rows[0]
    });
});

export const updateExamResult = catchAsyncError(async (req, res, next) => {
  const { resultId } = req.params;
  const { hifiz_marks, hizb_marks, result_status } = req.body;

  const result = await database.query(
    `
    UPDATE student_exam_results
    SET 
      hifiz_marks = COALESCE($1, hifiz_marks),
      hizb_marks = COALESCE($2, hizb_marks),
      result_status = COALESCE($3, result_status)
      WHERE id = $4
      RETURNING *
    `, [hifiz_marks, hizb_marks, result_status, resultId]
  );

  if (result.rows.length === 0) {
    return next(new ErrorHandler("Result not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Result updated successfully",
    result: result.rows[0],
  });
});

export const fetchAllExamResults = catchAsyncError(async (req, res) => {

    const result = await database.query(
        `SELECT
            ser.id AS result_id,

            u.full_name,
            s.institution,
            s.reg_number,

            ser.hifiz_marks,
            ser.hizb_marks,
            ser.tajweed_marks,
            ser.total_marks,
            ser.result_status,
            ser.created_at

        FROM student_exam_results ser
        JOIN students s ON s.id = ser.student_id
        JOIN users u ON u.id = s.user_id
        ORDER BY s.reg_number ASC`
    );

    res.status(200).json({
        success: true,
        count: result.rows.length,
        results: result.rows
    });
});

export const fetchStudentExamResult = catchAsyncError(async (req, res, next) => {

    const { studentId } = req.params;

    const result = await database.query(
        `SELECT
            u.full_name,
            s.institution,
            s.reg_number,

            ser.id AS result_id,
            ser.hifiz_marks,
            ser.hizb_marks,
            ser.tajweed_marks,
            ser.total_marks,
            ser.result_status,
            ser.created_at
         FROM student_exam_results ser
         JOIN students s ON s.id = ser.student_id
         JOIN users u ON u.id = s.user_id
         WHERE ser.student_id = $1
         ORDER BY ser.created_at DESC`,
        [studentId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Exam result not found", 404));
    }

    res.status(200).json({
        success: true,
        count: result.rows.length,
        results: result.rows
    });
});

export const publishExamResult = catchAsyncError(async (req, res, next) => {

    const { resultId } = req.params;

    const result = await database.query(
        `UPDATE student_exam_results
         SET result_status = 'Published'
         WHERE id = $1
         RETURNING *`,
        [resultId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Result not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Result published successfully",
        result: result.rows[0]
    });
});

export const fetchMyExamResult = catchAsyncError(async (req, res, next) => {

    const userId = req.user.id; // logged-in student

    const result = await database.query(
        `SELECT 
            u.full_name,
            s.institution,
            s.reg_number,

            ser.id AS result_id,
            ser.hifiz_marks,
            ser.hizb_marks,
            ser.tajweed_marks,
            ser.total_marks,
            ser.result_status,
            ser.created_at
        FROM student_exam_results ser
        JOIN students s ON s.id = ser.student_id
        JOIN users u ON u.id = s.user_id
        WHERE s.user_id = $1
        AND ser.result_status = 'Published'
        ORDER BY ser.created_at DESC`,
        [userId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("No published exam results found", 404));
    }

    res.status(200).json({
        success: true,
        count: result.rows.length,
        results: result.rows
    });
});