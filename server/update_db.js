import database from './database/db.js';

async function updateInstitutions() {
    try {
        console.log("Updating institutions in database...");
        
        // Update students table
        const resStudents = await database.query(
            "UPDATE students SET institution = 'Uthmaniyya College of Excellence' WHERE institution = 'Uthmaniyya College...'"
        );
        console.log(`Updated ${resStudents.rowCount} students.`);

        // Update admission_candidates table
        const resAdmissions = await database.query(
            "UPDATE admission_candidates SET institution = 'Uthmaniyya College of Excellence' WHERE institution = 'Uthmaniyya College...'"
        );
        console.log(`Updated ${resAdmissions.rowCount} admissions.`);

        // Update any other tables if they exist (grep found nothing else specific)
        
        console.log("Database update complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating database:", error);
        process.exit(1);
    }
}

updateInstitutions();
