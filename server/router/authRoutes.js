import express from "express";
import { register, login, getUser, logout, resetUserPassword, updatePassword, updateProfile, fetchAllRegisteredUsers, updateProfile2, } from "../controllers/authController.js";
import { authorizedRoles, isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post("/client/login", login);
router.get("/me", isAuthenticated, getUser);
router.get("/logout", isAuthenticated, logout);
router.put("/password/reset/:userId", isAuthenticated, resetUserPassword);
router.put("/password/update", isAuthenticated, updatePassword);
router.put("/profile/update", isAuthenticated, updateProfile);
router.get("/fatch/all", isAuthenticated, fetchAllRegisteredUsers);

router.put("/update/user/:userId", isAuthenticated, updateProfile2)

export default router;