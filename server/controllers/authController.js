import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";

export const register = catchAsyncError(async (req, res, next) => {
    const { full_name, username, password, role } = req.body;

    if (!full_name || !username || !password) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    if (password.length < 6 || password.length > 16) {
        return next(
            new ErrorHandler("Password must be between 6 and 16 characters", 400)
        );
    }

    const isAlreadyRegistered = await database.query(
        `SELECT id FROM users WHERE username = $1`,
        [username]
    );

    if (isAlreadyRegistered.rows.length > 0) {
        return next(new ErrorHandler("Already registered", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await database.query(
        `INSERT INTO users (full_name, username, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
        [full_name, username, hashedPassword, role]
    );

    const user = userResult.rows[0];

    if (role === "Student") {

        // 1️⃣ Create student
        const studentResult = await database.query(
            `INSERT INTO students (user_id)
     VALUES ($1)
     RETURNING id`,
            [user.id]
        );

        const studentId = studentResult.rows[0].id;

        // 2️⃣ Create empty exam result for that student
        await database.query(
            `INSERT INTO student_exam_results (student_id)
     VALUES ($1)`,
            [studentId]
        );
    }

    sendToken(user, 201, "Registered successfully", res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler("Please enter username and password", 400));
    };

    const user = await database.query(`
        SELECT * FROM users WHERE username = $1`, [username.trim()]);

    if (user.rows.length === 0) {
        return next(new ErrorHandler("Invalid username", 401));
    };

    const isPasswordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid password", 401));
    };

    sendToken(user.rows[0], 200, "Login successful", res);
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const { user } = req;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now()),
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export const resetUserPassword = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return next(new ErrorHandler("Please provide new password and confirm password", 400));
    };

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    };

    if (newPassword.length < 6 || newPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 6 and 16 characters", 400));
    };

    const user = await database.query(
        "SELECT id FROM users WHERE id = $1", [userId]
    );

    if (user.rows.length === 0) {
        return next(new ErrorHandler("User not found", 404));
    };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.query(
        "UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]
    );

    res.status(200).json({
        success: true,
        message: "User password reset successfully"
    });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    };

    const ifPasswordMatch = await bcrypt.compare(currentPassword, req.user.password);

    if (!ifPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 401));
    };

    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New passwords do not match", 400));
    };

    if (newPassword.length < 6 || newPassword.length > 16 || confirmNewPassword.length < 6 || confirmNewPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 6 and 16 characters", 400));
    };

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.query(
        "UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, req.user.id]
    );

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { full_name } = req.body;

    if (!full_name) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    };

    // User " " മാത്രം അയച്ചാൽ reject ചെയ്യും
    if (full_name.trim().length === 0) {
        return next(new ErrorHandler("cannot be empty", 400));
    };

    let avatarData = {};

    // new profile image upload ചെയ്തുണ്ടോ എന്ന് check
    if (req.files && req.files.avatar) {
        const { avatar } = req.files;

        // already avatar ഉണ്ടെങ്കിൽ Cloudinary-ൽ നിന്ന് delete ചെയ്യുന്നു
        if (req.user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(req.user.avatar.public_id);
        }

        // New image Cloudinary-ലേക്ക് upload
        const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "markaz_avatar",
            width: 150,
            crop: "scale"
        });

        // DB-യിൽ save ചെയ്യാനുള്ള format
        avatarData = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url
        };
    };

    let user;

    if (Object.keys(avatarData).length === 0) {
        user = await database.query(
            "UPDATE users SET full_name = $1 WHERE id = $2 RETURNING *", [full_name, req.user.id]
        );
    } else {
        user = await database.query(
            "UPDATE users SET full_name = $1, avatar = $2 WHERE id = $3 RETURNING *",
            [full_name, avatarData, req.user.id]
        );
    };

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: user.rows[0]
    });
});

export const fetchAllRegisteredUsers = catchAsyncError(async (req, res) => {

    const result = await database.query(`
        SELECT 
            id,
            full_name,
            username,
            password,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
    `);

    res.status(200).json({
        success: true,
        count: result.rows.length,
        users: result.rows
    });
});

export const updateProfile2 = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;
    const { full_name } = req.body;

    if (!full_name) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    };

    // User " " മാത്രം അയച്ചാൽ reject ചെയ്യും
    if (full_name.trim().length === 0) {
        return next(new ErrorHandler("cannot be empty", 400));
    };

    const existingUser = await database.query(
        "SELECT * FROM users WHERE id = $1", [userId]);

    if (existingUser.rows.length === 0) {
        return next(new ErrorHandler("User not found", 404));
    }

    let avatarData = existingUser.rows[0].avatar;

    // new profile image upload ചെയ്തുണ്ടോ എന്ന് check
    if (req.files && req.files.avatar) {
        const { avatar } = req.files;

        // already avatar ഉണ്ടെങ്കിൽ Cloudinary-ൽ നിന്ന് delete ചെയ്യുന്നു
        if (avatarData?.public_id) {
            await cloudinary.uploader.destroy(avatarData.public_id);
        }

        // New image Cloudinary-ലേക്ക് upload
        const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "markaz_avatar",
            width: 150,
            crop: "scale"
        });

        // DB-യിൽ save ചെയ്യാനുള്ള format
        avatarData = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url
        };
    };


    const updatedUser = await database.query(
        "UPDATE users SET full_name = $1, avatar = $2 WHERE id = $3 RETURNING *",
        [full_name, avatarData, userId]
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser.rows[0]
    });
});