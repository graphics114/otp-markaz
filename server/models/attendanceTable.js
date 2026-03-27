import database from "../database/db.js";

export async function createAttendanceTables() {
    try {
        const createProgramsQuery = `
            CREATE TABLE IF NOT EXISTS programs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                program_name VARCHAR(150) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        const createAttendanceQuery = `
            CREATE TABLE IF NOT EXISTS attendance (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

                student_id UUID NOT NULL,
                program_id UUID NOT NULL,

                attendance_date DATE NOT NULL,

                status BOOLEAN NOT NULL,  -- true = Present, false = Absent

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,

                UNIQUE (student_id, program_id, attendance_date)
            );
        `;

        await database.query(createProgramsQuery);
        await database.query(createAttendanceQuery);
        console.log("Programs and Attendance tables created successfully.");
    } catch (error) {
        console.error("Error creating attendance tables:", error);
        process.exit(1);
    }
}
