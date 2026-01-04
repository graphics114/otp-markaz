import database from "../database/db.js";

export async function createStudentsTable() {
    try {
        const query =`
            CREATE TABLE IF NOT EXISTS students (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

                user_id UUID UNIQUE NOT NULL,

                reg_number VARCHAR(50) UNIQUE,
                date_of_birth DATE,

                phone_number VARCHAR(20),
                emergency_contact VARCHAR(20),

                aadhar_number VARCHAR(20) UNIQUE,
                blood_group VARCHAR(5),

                father_name VARCHAR(150),
                father_phone VARCHAR(20),
                father_occupation VARCHAR(100),

                mother_name VARCHAR(150),
                mother_phone VARCHAR(20),
                mother_occupation VARCHAR(100),

                guardian_name VARCHAR(150),
                guardian_phone VARCHAR(20),

                address_line1 TEXT,
                address_line2 TEXT,
                locality VARCHAR(100),
                district VARCHAR(100),
                state VARCHAR(100),
                country VARCHAR(100),
                pin_code VARCHAR(10),

                joining_year INT,
                institution VARCHAR(150),
                joining_batch VARCHAR(50),
                course_program VARCHAR(150),

                other TEXT,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error creating user table:", error);
        process.exit(1);
        
    }
}