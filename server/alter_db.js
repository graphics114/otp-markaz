import database from "./database/db.js";

async function alterTable() {
    try {
        console.log("Altering column total_marks to drop DEFAULT/GENERATED expression...");
        // In PostgreSQL, to drop a generated expression, the easiest way in PG 12+ is ALTER COLUMN total_marks DROP EXPRESSION
        // Or if it's a default, DROP DEFAULT
        // However, DROP EXPRESSION might not exist in all PG versions. Alternatively, we can drop the column and recreate it as an integer.
        await database.query(`ALTER TABLE student_exam_results DROP COLUMN IF EXISTS total_marks CASCADE`);
        await database.query(`ALTER TABLE student_exam_results ADD COLUMN total_marks INTEGER DEFAULT 0`);
        console.log("Column total_marks successfully recreated as regular INTEGER.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
alterTable();
