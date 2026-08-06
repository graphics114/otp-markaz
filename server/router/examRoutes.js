import express from "express";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";
import { 
    addExamResult, deleteExamResult, fetchAllExamResults, fetchMyExamResult, 
    fetchStudentExamResult, publishExamResult, searchResultsByDate, updateExamResult, 
    getTopScoringStudents, getUthmaniyyaSubjects, addUthmaniyyaSubject, deleteUthmaniyyaSubject 
} from "../controllers/examController.js";

const router = express.Router();

router.get("/uthmaniyya-subjects", getUthmaniyyaSubjects);
router.post("/uthmaniyya-subjects", isAuthenticated, addUthmaniyyaSubject);
router.delete("/uthmaniyya-subjects/:id", isAuthenticated, deleteUthmaniyyaSubject);

router.post("/add/result/:studentId", isAuthenticated, addExamResult);
router.put("/update/result/:resultId", isAuthenticated, updateExamResult);
router.get("/fetch/all/result", fetchAllExamResults);
router.get("/fetch/single/result/:studentId", fetchStudentExamResult);
router.put("/publish/result/:resultId", isAuthenticated, publishExamResult);
router.get("/fetch/my/result", isAuthenticated, fetchMyExamResult);
router.get("/search", isAuthenticated, searchResultsByDate);
router.get("/top-students", getTopScoringStudents);
router.delete("/delete/result/:resultId", isAuthenticated, deleteExamResult);

export default router;