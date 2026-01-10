import express from "express";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { addExamResult, deleteExamResult, fetchAllExamResults, fetchMyExamResult, fetchStudentExamResult, publishExamResult, searchResultsByDate, updateExamResult } from "../controllers/examController.js";

const router = express.Router();

router.post("/add/result/:studentId", isAuthenticated, addExamResult);
router.put("/update/result/:resultId", isAuthenticated, updateExamResult);
router.get("/fetch/all/result", fetchAllExamResults);
router.get("/fetch/single/result/:studentId", fetchStudentExamResult);
router.put("/publish/result/:resultId", isAuthenticated, publishExamResult);
router.get("/fetch/my/result", isAuthenticated, fetchMyExamResult);
router.get("/search", isAuthenticated, searchResultsByDate);
router.delete("/delete/result/:resultId", isAuthenticated, deleteExamResult);

export default router;