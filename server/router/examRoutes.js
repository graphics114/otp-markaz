import express from "express";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { addExamResult, fetchAllExamResults, fetchMyExamResult, fetchStudentExamResult, publishExamResult, updateExamResult } from "../controllers/examController.js";

const router = express.Router();

router.post("/add/result/:studentId", isAuthenticated, addExamResult);
router.put("/update/result/:resultId", isAuthenticated, updateExamResult);
router.get("/fetch/all/result", fetchAllExamResults);
router.get("/fetch/single/result/:studentId", fetchStudentExamResult);
router.put("/publish/result/:resultId", isAuthenticated, publishExamResult);
router.get("/fetch/my/result", isAuthenticated, fetchMyExamResult);

export default router;