import pkg from 'pg';
const { Client } = pkg;

const database = new Client({
    connectionString: process.env.DATABASE_URL || "postgresql://ottapalam_markaz_user:nLGmylwJcs1pvgC9QbmTAwaWGVFIoA1d@dpg-d5dv6iumcj7s73b1k0r0-a.oregon-postgres.render.com/ottapalam_markaz",
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