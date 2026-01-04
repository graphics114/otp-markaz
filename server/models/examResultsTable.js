import database from "../database/db.js";

export async function createExamResultsTable() {
    try {
        const query =`
            CREATE TABLE IF NOT EXISTS student_exam_results (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

            student_id UUID NOT NULL,
            publish_id UUID NOT NULL,

            hifiz_marks INT CHECK (hifiz_marks BETWEEN 0 AND 100),
            hizb_marks INT CHECK (hizb_marks BETWEEN 0 AND 100),
            tajweed_marks INT CHECK (tajweed_marks BETWEEN 0 AND 100),

            total_marks INT GENERATED ALWAYS AS (
              COALESCE(hifiz_marks,0) +
              COALESCE(hizb_marks,0) +
              COALESCE(tajweed_marks,0)
            ) STORED,

            result_status VARCHAR(20) DEFAULT 'Pending'
            CHECK (result_status IN ('Pending', 'Published')),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            FOREIGN KEY (publish_id) REFERENCES result_publish(id) ON DELETE CASCADE
            );
        `;
        await database.query(query);
    } catch (error) {
        console.error("Error creating exam result table:", error);
        process.exit(1);
    }
}