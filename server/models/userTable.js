import database from "../database/db.js";

export async function createUserTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

                full_name VARCHAR(150) NOT NULL CHECK (char_length(full_name) >= 3),
                username VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                
                role VARCHAR(10) DEFAULT 'Student' CHECK (role IN ('Admin', 'Hifiz', 'Dawa', 'Student')),
                
                avatar JSONB DEFAULT NULL,
                
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error creating user table:", error);
        process.exit(1);

    }
}