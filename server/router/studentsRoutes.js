import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { addStudentByUser, deleteStudent, fetchAllStudents, fetchStudentByUser, updateStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/new/student/:userId", isAuthenticated, addStudentByUser);
router.put("/update/student/:studentID", isAuthenticated, updateStudent);
router.delete("/delete/student/:studentID", isAuthenticated, deleteStudent);
router.get("/fatchsingle/student/:userId", isAuthenticated, fetchStudentByUser);
router.get("/fatchall/students", isAuthenticated, fetchAllStudents);

export default router;