const { pool } = require('./db'); // Adjust path if necessary

async function initDatabase() {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                name TEXT NOT NULL
            );
        `);
        console.log('✅ Users table ensured');
        // Create pipelines table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipelines (
                id INTEGER PRIMARY KEY,
                status TEXT,
                ref TEXT,
                sha TEXT,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            );
        `);
        console.log('✅ Pipelines table ensured');
        // Create jobs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY,
                pipeline_id INTEGER REFERENCES pipelines(id),
                name TEXT,
                status TEXT,
                stage TEXT,
                started_at TIMESTAMP,
                finished_at TIMESTAMP
            );
        `);
        console.log('✅ Jobs table ensured');
        console.log('✅ Database ensured.');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        process.exit(1);
    }
}

module.exports = { initDatabase };
