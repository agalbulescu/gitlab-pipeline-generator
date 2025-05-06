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
        // Create games table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                display_name VARCHAR(255) NOT NULL,
                internal_name VARCHAR(255) NOT NULL UNIQUE
            )
        `);
        console.log('✅ Games table ensured');
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
        // Create test results table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_results (
                id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES jobs(id),
                name TEXT,
                classname TEXT,
                status TEXT,
                time FLOAT,
                message TEXT
            );
        `);
        console.log('✅ Test Results table ensured');
        console.log('✅ Database completely ensured.');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        process.exit(1);
    }

    const defaultGames = [
        { displayName: 'Andar Bahar', internalName: 'andar_bahar' },
        { displayName: 'Automated Roulette', internalName: 'automated_roulette' },
        { displayName: 'Baccarat', internalName: 'baccarat' },
        { displayName: 'Baccarat Dragon Tiger', internalName: 'baccarat_dragon_tiger' },
        { displayName: 'Baccarat Knockout', internalName: 'baccarat_knockout' },
        { displayName: 'Baccarat No Commission', internalName: 'baccarat_no_commission' },
        { displayName: 'Baccarat Super Six', internalName: 'baccarat_super_six' },
        { displayName: 'Bet on Teen Patti', internalName: 'bet_on_teen_patti' },
        { displayName: 'Blackjack', internalName: 'blackjack' },
        { displayName: 'Blackjack Salon Privé', internalName: 'blackjack_salon_prive' },
        { displayName: 'Casino Hold\'em', internalName: 'casino_holdem' },
        { displayName: 'Cricket War', internalName: 'cricket_war' },
        { displayName: 'Lucky Seven', internalName: 'lucky_seven' },
        { displayName: 'Matka', internalName: 'matka' },
        { displayName: 'One Day Teen Patti Back & Lay', internalName: 'one_day_teen_patti_back_and_lay' },
        { displayName: 'OTT Andar Bahar', internalName: 'ott_andar_bahar' },
        { displayName: 'OTT Baccarat', internalName: 'ott_baccarat' },
        { displayName: 'OTT Roulette', internalName: 'ott_roulette' },
        { displayName: 'Roulette', internalName: 'roulette' },
        { displayName: 'Roulette New', internalName: 'roulette_new' },
        { displayName: 'Russian Poker', internalName: 'russian_poker' },
        { displayName: 'Sic Bo', internalName: 'sic_bo' },
        { displayName: 'Teen Patti', internalName: 'teen_patti' },
        { displayName: 'Thirty-Two Cards', internalName: 'thirty_two_cards' },
        { displayName: 'Ultimate Andar Bahar', internalName: 'ultimate_andar_bahar' },
        { displayName: 'Ultimate Roulette', internalName: 'ultimate_roulette' },
        { displayName: 'Ultimate Sic Bo', internalName: 'ultimate_sic_bo' },
        { displayName: 'Unlimited Blackjack', internalName: 'unlimited_blackjack' },
        { displayName: 'Xóc Đĩa', internalName: 'xoc_dia' }
    ];

    for (const game of defaultGames) {
        await pool.query(
            'INSERT INTO games (display_name, internal_name) VALUES ($1, $2) ON CONFLICT (internal_name) DO NOTHING',
            [game.displayName, game.internalName]
        );
    }
}

module.exports = { initDatabase };
