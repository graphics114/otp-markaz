import pkg from 'pg';
const { Client } = pkg;

const database = new Client({
    connectionString:"postgresql://otp_markaz_db_user:x1t1wrpZpTiIfdjtDInKMKY6MQNlPbWu@dpg-d5d30o3e5dus7393vi20-a.oregon-postgres.render.com/otp_markaz_db",
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