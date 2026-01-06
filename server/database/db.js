import pkg from 'pg';
const { Client } = pkg;

const database = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://ottapalam_markaz:03xH71xpITljN82craEg9ZrdBiVAasEa@dpg-d5e8vjvfte5s73ad3j80-a.oregon-postgres.render.com/ottapalam_markaz_xgp8",
    ssl: process.env.DATABASE_URL ? (process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false) : { rejectUnauthorized: false },
});

try {
    await database.connect();
    console.log("Database connected successfully");
} catch (err) {
    console.error("Database connection failed:", err);

    process.exit(1);
}

export default database;