import pkg from 'pg';
const { Client } = pkg;

const database = new Client({
    connectionString: "postgresql://ottapalam_markaz_user:nLGmylwJcs1pvgC9QbmTAwaWGVFIoA1d@dpg-d5dv6iumcj7s73b1k0r0-a.oregon-postgres.render.com/ottapalam_markaz",
    ssl: {
        rejectUnauthorized: false,
    },
});

async function check() {
    try {
        await database.connect();
        const res = await database.query("SELECT id, username, role, password FROM users");
        console.log("LIVE USERS IN RENDER DB:");
        console.log(JSON.stringify(res.rows, null, 2));
        await database.end();
    } catch (err) {
        console.error("DEBUG DB ERROR:", err);
    }
}
check();
