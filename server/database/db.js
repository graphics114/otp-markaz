import pkg from "pg";

const { Client } = pkg;

const database = new Client({
    user: "postgres",
    host: "localhost",
    database: "ottapalam_markaz",
    password: "Unaisku114@",
    port: 5432,
});

try {
    await database.connect();
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connected failed:", error);
    
    process.exit(1);
}

export default database;