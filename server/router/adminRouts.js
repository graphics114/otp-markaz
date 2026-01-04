import express from "express";
import { fetchAllUsers, fetchSingleUser, updateUserRole, deleteUser, adminDashboardStats, hifizDashboardStats
  } from "../controllers/adminController.js";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.use(authorizedRoles("Admin", "Staff"));

router.get("/users", fetchAllUsers);
router.get("/users/:userId", fetchSingleUser);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/delete/:userId", deleteUser);
router.get("/dashboard/stats", adminDashboardStats);
router.get("/hifiz/deshboard/status", hifizDashboardStats);

export default router;
