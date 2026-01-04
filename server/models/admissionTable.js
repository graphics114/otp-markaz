import database from "../database/db.js";

export async function createAdmissionTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS admission_candidates (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

            candidate_name VARCHAR(150) NOT NULL CHECK (char_length(candidate_name) >= 3),
            photo JSONB DEFAULT NULL,

            date_of_birth DATE NOT NULL,
            gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),

            institution VARCHAR(150) NOT NULL,
            madrasa_class VARCHAR(50),
            school_class VARCHAR(50),

            phone_number VARCHAR(20) NOT NULL,
            whatsapp_number VARCHAR(15),
            guardian_phone VARCHAR(20),

            father_name VARCHAR(150),
            mother_name VARCHAR(150),
            guardian_name VARCHAR(150),

            address_line1 TEXT,
            address_line2 TEXT,
            locality VARCHAR(100),
            district VARCHAR(100),
            state VARCHAR(100),
            country VARCHAR(100),
            pin_code VARCHAR(10),

            aadhar_number VARCHAR(20) UNIQUE,
            blood_group VARCHAR(5),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error creating admission table:", error);
        process.exit(1);
    }
}