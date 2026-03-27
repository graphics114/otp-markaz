import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";

// --- PROGRAMS CONTROLLER ---

export const addProgram = catchAsyncError(async (req, res, next) => {
    const { program_name } = req.body;
    if (!program_name) {
        return next(new ErrorHandler("Program name is required", 400));
    }

    const result = await database.query(
        "INSERT INTO programs (program_name) VALUES ($1) RETURNING *",
        [program_name]
    );

    res.status(201).json({
        success: true,
        message: "Program added successfully",
        program: result.rows[0],
    });
});

export const fetchAllPrograms = catchAsyncError(async (req, res, next) => {
    const result = await database.query("SELECT * FROM programs ORDER BY created_at DESC");
    res.status(200).json({
        success: true,
        programs: result.rows,
    });
});

export const deleteProgram = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const result = await database.query("DELETE FROM programs WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Program not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Program deleted successfully",
    });
});

// --- ATTENDANCE CONTROLLER ---

export const fetchStudentsForAttendance = catchAsyncError(async (req, res, next) => {
    const { institution, joining_batch } = req.query;

    if (!institution || !joining_batch) {
        return next(new ErrorHandler("Institution and Batch are required", 400));
    }

    const result = await database.query(
        `SELECT s.id, u.full_name, s.reg_number, s.roll_number 
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.institution = $1 AND s.joining_batch = $2
         ORDER BY s.roll_number ASC, u.full_name ASC`,
        [institution, joining_batch]
    );


    res.status(200).json({
        success: true,
        students: result.rows,
    });
});

export const submitAttendance = catchAsyncError(async (req, res, next) => {
    const { program_id, attendance_date, attendance_data } = req.body;
    // attendance_data: [{student_id: UUID, status: boolean}, ...]

    if (!program_id || !attendance_date || !attendance_data || !Array.isArray(attendance_data)) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    try {
        await database.query("BEGIN");

        for (const record of attendance_data) {
            await database.query(
                `INSERT INTO attendance (student_id, program_id, attendance_date, status)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (student_id, program_id, attendance_date)
                 DO UPDATE SET status = EXCLUDED.status`,
                [record.student_id, program_id, attendance_date, record.status]
            );
        }

        await database.query("COMMIT");

        res.status(200).json({
            success: true,
            message: "Attendance submitted successfully",
        });
    } catch (error) {
        await database.query("ROLLBACK");
        return next(new ErrorHandler(error.message, 500));
    }
});

export const fetchAttendanceData = catchAsyncError(async (req, res, next) => {
    const { program_id, attendance_date } = req.query;

    if (!program_id || !attendance_date) {
        return next(new ErrorHandler("Program and Date are required", 400));
    }

    const result = await database.query(
        `SELECT student_id, status FROM attendance 
         WHERE program_id = $1 AND attendance_date = $2`,
        [program_id, attendance_date]
    );

    res.status(200).json({
        success: true,
        attendance: result.rows,
    });
});

export const fetchAttendanceReport = catchAsyncError(async (req, res, next) => {
    const { program_id, start_date, end_date, institution, joining_batch } = req.query;

    if (!start_date || !end_date) {
        return next(new ErrorHandler("Date Range is required", 400));
    }

    // First fetch students in the batch
    const studentsQuery = `
        SELECT s.id, u.full_name, s.reg_number, s.roll_number 
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.institution = $1 AND s.joining_batch = $2
        ORDER BY s.roll_number ASC, u.full_name ASC
    `;
    const studentsResult = await database.query(studentsQuery, [institution, joining_batch]);
    const students = studentsResult.rows;

    if (students.length === 0) {
        return res.status(200).json({ success: true, report: [] });
    }

    const studentIds = students.map(s => s.id);

    // Fetch total days and present days for these students in the range
    let reportQuery = `
        SELECT 
            student_id,
            COUNT(*) as total_days,
            SUM(CASE WHEN status = true THEN 1 ELSE 0 END) as present_days
        FROM attendance
        WHERE attendance_date BETWEEN $1 AND $2
        AND student_id = ANY($3)
    `;

    const queryParams = [start_date, end_date, studentIds];

    if (program_id && program_id !== "all") {
        queryParams.push(program_id);
        reportQuery += ` AND program_id = $${queryParams.length}`;
    }

    reportQuery += ` GROUP BY student_id`;


    const reportResult = await database.query(reportQuery, queryParams);
    const reportData = reportResult.rows;


    // Combine student info with stats
    const finalReport = students.map(student => {
        const stats = reportData.find(r => r.student_id === student.id) || { total_days: 0, present_days: 0 };
        const total = parseInt(stats.total_days);
        const present = parseInt(stats.present_days);
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : "0.00";

        return {
            ...student,
            total_days: total,
            present_days: present,
            percentage: percentage
        };
    });

    res.status(200).json({
        success: true,
        report: finalReport
    });
});

export const fetchMyAttendance = catchAsyncError(async (req, res, next) => {
    const studentResult = await database.query(
        "SELECT id FROM students WHERE user_id = $1",
        [req.user.id]
    );

    if (studentResult.rows.length === 0) {
        return next(new ErrorHandler("Student profile not found", 404));
    }

    const student_id = studentResult.rows[0].id;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return next(new ErrorHandler("Date Range is required", 400));
    }

    const reportQuery = `
        SELECT 
            attendance_date,
            status,
            p.program_name
        FROM attendance a
        JOIN programs p ON a.program_id = p.id
        WHERE student_id = $1
        AND attendance_date BETWEEN $2 AND $3
        ORDER BY attendance_date DESC
    `;

    const result = await database.query(reportQuery, [student_id, start_date, end_date]);

    // Global latest attendance (regardless of filter)
    const latestGlobal = await database.query(`
        SELECT 
            attendance_date,
            status,
            p.program_name
        FROM attendance a
        JOIN programs p ON a.program_id = p.id
        WHERE student_id = $1
        ORDER BY attendance_date DESC, a.created_at DESC
        LIMIT 1
    `, [student_id]);

    const total_days = result.rows.length;
    const present_days = result.rows.filter(r => r.status === true).length;
    const percentage = total_days > 0 ? ((present_days / total_days) * 100).toFixed(2) : "0.00";

    res.status(200).json({
        success: true,
        attendance: result.rows,
        latest: latestGlobal.rows[0] || null,
        stats: {
            total_days,
            present_days,
            absent_days: total_days - present_days,
            percentage
        }
    });
});

export const fetchStudentDetailedAttendance = catchAsyncError(async (req, res, next) => {
    const { student_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
        return next(new ErrorHandler("Date Range is required", 400));
    }

    const reportQuery = `
        SELECT 
            attendance_date,
            status,
            p.program_name
        FROM attendance a
        JOIN programs p ON a.program_id = p.id
        WHERE student_id = $1
        AND attendance_date BETWEEN $2 AND $3
        ORDER BY attendance_date DESC
    `;

    const result = await database.query(reportQuery, [student_id, start_date, end_date]);

    // Fetch student basic info
    const studentInfo = await database.query(
        `SELECT u.full_name, s.roll_number, s.institution, s.joining_batch 
         FROM students s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = $1`,
        [student_id]
    );

    const total_days = result.rows.length;
    const present_days = result.rows.filter(r => r.status === true).length;
    const percentage = total_days > 0 ? ((present_days / total_days) * 100).toFixed(2) : "0.00";

    res.status(200).json({
        success: true,
        student: studentInfo.rows[0] || null,
        attendance: result.rows,
        stats: {
            total_days,
            present_days,
            absent_days: total_days - present_days,
            percentage
        }
    });
});
