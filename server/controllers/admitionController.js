import ErrorHandler from "../middlewares/errorMiddlewares.js";
import database from "../database/db.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import cloudinary from "cloudinary";

export const createAdmissionCandidate = catchAsyncError(async (req, res, next) => {

    const {
        candidate_name,
        date_of_birth,
        gender,
        institution,
        madrasa_class,
        school_class,
        phone_number,
        whatsapp_number,
        guardian_phone,
        father_name,
        mother_name,
        guardian_name,
        address_line1,
        address_line2,
        locality,
        district,
        state,
        country,
        pin_code,
        aadhar_number,
        blood_group
    } = req.body;

    if (!candidate_name || !date_of_birth || !institution || !phone_number) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // 📸 Photo upload (Cloudinary)
    let photoData = null;

    if (req.files && req.files.photo) {
        const { photo } = req.files;

        const uploadedPhoto = await cloudinary.v2.uploader.upload(
            photo.tempFilePath,
            {
                folder: "admission_candidates",
                width: 300,
                crop: "scale"
            }
        );

        photoData = {
            public_id: uploadedPhoto.public_id,
            url: uploadedPhoto.secure_url
        };
    }

    const result = await database.query(
        `INSERT INTO admission_candidates (
            candidate_name, photo, date_of_birth, gender,
            institution, madrasa_class, school_class,
            phone_number, guardian_phone,
            father_name, mother_name, guardian_name,
            address_line1, address_line2, locality, district, state, country, pin_code,
            aadhar_number, blood_group, whatsapp_number
        ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,
            $10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
        ) RETURNING *`,
        [
            candidate_name,
            photoData,
            date_of_birth,
            gender,
            institution,
            madrasa_class,
            school_class,
            phone_number,
            guardian_phone,
            father_name,
            mother_name,
            guardian_name,
            address_line1,
            address_line2,
            locality,
            district,
            state,
            country,
            pin_code,
            aadhar_number,
            blood_group,
            whatsapp_number,
        ]
    );

    res.status(201).json({
        success: true,
        admission: result.rows[0]
    });
});

export const updateAdmissionCandidate = catchAsyncError(async (req, res, next) => {

    const { admissionId } = req.params;

    const check = await database.query(
        "SELECT id FROM admission_candidates WHERE id = $1",
        [admissionId]
    );

    if (check.rows.length === 0) {
        return next(new ErrorHandler("Admission candidate not found", 404));
    }

    const fields = Object.keys(req.body);
    const values = Object.values(req.body);

    if (fields.length === 0) {
        return next(new ErrorHandler("No data to update", 400));
    }

    const query = `
        UPDATE admission_candidates SET
        ${fields.map((f, i) => `${f} = $${i + 1}`).join(", ")}
        WHERE id = $${fields.length + 1}
        RETURNING *
    `;

    const result = await database.query(query, [...values, admissionId]);

    res.status(200).json({
        success: true,
        admission: result.rows[0]
    });
});

export const deleteAdmissionCandidate = catchAsyncError(async (req, res, next) => {

    const { admissionId } = req.params;

    const result = await database.query(
        "DELETE FROM admission_candidates WHERE id = $1 RETURNING *",
        [admissionId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Admission candidate not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Admission candidate deleted successfully"
    });
});

export const fetchSingleAdmissionCandidate = catchAsyncError(async (req, res, next) => {

    const { admissionId } = req.params;

    const result = await database.query(
        "SELECT * FROM admission_candidates WHERE id = $1",
        [admissionId]
    );

    if (result.rows.length === 0) {
        return next(new ErrorHandler("Admission candidate not found", 404));
    }

    res.status(200).json({
        success: true,
        admission: result.rows[0]
    });
});

export const fetchAllAdmissionCandidates = catchAsyncError(async (req, res) => {

    const result = await database.query(
        `SELECT *
         FROM admission_candidates
         ORDER BY created_at DESC`
    );

    res.status(200).json({
        success: true,
        count: result.rows.length,
        admissions: result.rows
    });
});