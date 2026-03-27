import express from "express";
import {
    addProgram, fetchAllPrograms, deleteProgram,
    fetchStudentsForAttendance, submitAttendance, fetchAttendanceData,
    fetchAttendanceReport, fetchMyAttendance, fetchStudentDetailedAttendance
} from "../controllers/attendanceController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";


const router = express.Router();

// Programs
router.post("/program/add", addProgram);
router.get("/programs/getall", fetchAllPrograms);
router.delete("/program/delete/:id", deleteProgram);

// Attendance
router.get("/students", fetchStudentsForAttendance);
router.post("/submit", submitAttendance);
router.get("/get", fetchAttendanceData);
router.get("/report", fetchAttendanceReport);
router.get("/my-attendance", isAuthenticated, fetchMyAttendance);
router.get("/student/:student_id/details", fetchStudentDetailedAttendance);



export default router;
