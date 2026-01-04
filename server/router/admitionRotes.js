import express from "express";
import { createAdmissionCandidate, deleteAdmissionCandidate, fetchAllAdmissionCandidates, fetchSingleAdmissionCandidate, updateAdmissionCandidate } from "../controllers/admitionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/new/admition", createAdmissionCandidate);
router.put("/update/:admissionId", isAuthenticated, updateAdmissionCandidate);
router.delete("/delete/:admissionId", isAuthenticated, deleteAdmissionCandidate);
router.get("/fetch/single/:admissionId", isAuthenticated, fetchSingleAdmissionCandidate);
router.get("/fetch/all", fetchAllAdmissionCandidates);

export default router;