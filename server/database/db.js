import pkg from 'pg';
const { Client } = pkg;

const database = new Client({
    connectionString:"postgresql://ottapalam_markaz_user:nLGmylwJcs1pvgC9QbmTAwaWGVFIoA1d@dpg-d5dv6iumcj7s73b1k0r0-a.oregon-postgres.render.com/ottapalam_markaz",
    ssl:{
        rejectUnauthorized:false,
    },
    // user: "postgres",
    // host: "localhost",
    // database: "ottapalam_markaz",
    // password: "Unaisku114@", 
    // port: 5432, 
});

try {
    await database.connect();
    console.log("Database connected successfully");
} catch (err) {
    console.error("Database connection failed:", err);

    process.exit(1);
}

export default database;