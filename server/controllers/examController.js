import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

// export const addExamResult = catchAsyncError(async (req, res, next) => {

//     const { studentId } = req.params;
//     const { hifiz_marks, hizb_marks, tajweed_marks } = req.body;

//     const studentCheck = await database.query(
//         "SELECT id FROM students WHERE id = $1",
//         [studentId]
//     );

//     if (studentCheck.rows.length === 0) {
//         return next(new ErrorHandler("Student not found", 404));
//     }

//     const result = await database.query(
//         `INSERT INTO student_exam_results (
//             student_id, hifiz_marks, hizb_marks, tajweed_marks
//         ) VALUES ($1,$2,$3,$4)
//         RETURNING *`,
//         [studentId, hifiz_marks, hizb_marks, tajweed_marks]
//     );

//     res.status(201).json({
//         success: true,
//         exam: result.rows[0]
//     });
// });

export const updateExamResult = catchAsyncError(async (req, res, next) => {
    const { resultId } = req.params;
    let { hifiz_marks, hizb_marks, result_status } = req.body;

    if (hifiz_marks === "") hifiz_marks = 0;
    if (hizb_marks === "") hizb_marks = 0;

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
          ser.exam_date,

          u.full_name,
          s.reg_number,
          s.institution,
          s.joining_batch,

          ser.hifiz_marks,
          ser.hizb_marks,
          ser.tajweed_marks,
          ser.total_marks,
          ser.result_status

        FROM student_exam_results ser
        JOIN students s ON s.id = ser.student_id
        JOIN users u ON u.id = s.user_id
        ORDER BY ser.exam_date DESC;
        `
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

export const addExamResult = catchAsyncError(async (req, res) => {
    const { studentId } = req.params;
    let { hifiz_marks, hizb_marks, tajweed_marks, exam_date } = req.body;

    if (hifiz_marks === "") hifiz_marks = 0;
    if (hizb_marks === "") hizb_marks = 0;
    if (tajweed_marks === "") tajweed_marks = 0;

    const result = await database.query(
        `
    INSERT INTO student_exam_results
    (student_id, exam_date, hifiz_marks, hizb_marks, tajweed_marks)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
        [
            studentId,
            exam_date || new Date(),
            hifiz_marks,
            hizb_marks,
            tajweed_marks
        ]
    );

    res.status(201).json({
        success: true,
        message: "New exam result added",
        result: result.rows[0]
    });
});

export const searchResultsByDate = catchAsyncError(async (req, res) => {
    const { from, to } = req.query;

    const result = await database.query(
        `
    SELECT
      u.full_name,
      s.reg_number,
      ser.exam_date,
      ser.total_marks,
      ser.result_status
    FROM student_exam_results ser
    JOIN students s ON s.id = ser.student_id
    JOIN users u ON u.id = s.user_id
    WHERE ser.exam_date BETWEEN $1 AND $2
    ORDER BY ser.exam_date
    `,
        [from, to]
    );

    res.json({
        success: true,
        count: result.rows.length,
        results: result.rows
    });
});

export const deleteExamResult = catchAsyncError(async (req, res, next) => {
    const { resultId } = req.params;

    const result = await database.query(
        "DELETE FROM student_exam_results WHERE id = $1 RETURNING *",
        [resultId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Result not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Exam result deleted successfully",
    });
});