import database from "../database/db.js";

export async function createResultPublishTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS result_publish (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

                exam_name VARCHAR(150) NOT NULL,
                institution VARCHAR(150) NOT NULL,

                exam_year INT NOT NULL CHECK (exam_year >= 2000),
                exam_month VARCHAR(20),

                is_published BOOLEAN DEFAULT false,
                published_at TIMESTAMP DEFAULT NULL,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                UNIQUE (exam_name, institution, exam_year)
            );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error creating result publish table");
        process.exit(1);
    }
}