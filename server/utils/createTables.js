import { createUserTable } from "../models/userTable.js"
import { createStudentsTable } from "../models/studentsTable.js"
import { createAdmissionTable } from "../models/admissionTable.js"
import { createExamResultsTable } from "../models/examResultsTable.js"
import { createResultPublishTable } from "../models/resultPublishTable.js"

export const createTables = async () => {
    try {
        await createUserTable();
        await createStudentsTable();
        await createAdmissionTable();
        await createResultPublishTable();
        await createExamResultsTable();
        console.log("All Tables Created Successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}