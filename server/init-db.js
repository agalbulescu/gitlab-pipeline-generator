const { pool } = require('./db');

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

        // Create games table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                display_name VARCHAR(255) NOT NULL,
                internal_name VARCHAR(255) NOT NULL UNIQUE
            )
        `);

        // Create environments table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS environments (
                id SERIAL PRIMARY KEY,
                display_name TEXT NOT NULL,
                internal_name TEXT UNIQUE NOT NULL
            );
        `);

        // Create browser_profiles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS browser_profiles (
                id SERIAL PRIMARY KEY,
                display_name TEXT NOT NULL,
                internal_name TEXT UNIQUE NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('desktop', 'mobile'))
            );
        `);

        // Create pipelines table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pipelines (
                id INTEGER PRIMARY KEY,
                status TEXT,
                ref TEXT,
                sha TEXT,
                created_at TIMESTAMP,
                updated_at TIMESTAMP,
                finished_at TIMESTAMP,
                environment TEXT
            );
        `);

        // Create jobs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY,
                pipeline_id INTEGER REFERENCES pipelines(id),
                name TEXT,
                status TEXT,
                stage TEXT,
                started_at TIMESTAMP,
                finished_at TIMESTAMP,
                suites TEXT
            );
        `);

        // Create test results table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_results (
                id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES jobs(id),
                name TEXT,
                classname TEXT,
                status TEXT,
                time FLOAT,
                message TEXT,
                run_type TEXT,
                environment TEXT,
                browser_profile_name TEXT
            );
        `);

        console.log('✅ Database fully ensured.');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        process.exit(1);
    }

    // Insert default games if they don't exist
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

    // Insert default environments if they don't exist
    const defaultEnvironments = [
        { displayName: 'Stage', internalName: 'stage' },
        { displayName: 'Pre-Prod', internalName: 'preprod' },
        { displayName: 'Certification', internalName: 'certification' },
        { displayName: 'QA01', internalName: 'qa01' },
        { displayName: 'QA02', internalName: 'qa02' },
        { displayName: 'QA03', internalName: 'qa03' },
        { displayName: 'QA04', internalName: 'qa04' },
        { displayName: 'QA05', internalName: 'qa05' },
        { displayName: 'QA06', internalName: 'qa06' },
        { displayName: 'QA07', internalName: 'qa07' },
        { displayName: 'QA08', internalName: 'qa08' },
        { displayName: 'QA09', internalName: 'qa09' }
    ];
    for (const env of defaultEnvironments) {
        await pool.query(
            'INSERT INTO environments (display_name, internal_name) VALUES ($1, $2) ON CONFLICT (internal_name) DO NOTHING',
            [env.displayName, env.internalName]
        );
    }

    // Insert default browser profiles if they don't exist
    const defaultBrowserProfiles = [
        { displayName: 'Chrome - 1920 x 1080', internalName: 'chrome1920x1080', type: 'desktop' },
        { displayName: 'Chrome - 1366 x 768', internalName: 'chrome1366x768', type: 'desktop' },
        { displayName: 'Firefox - 1920 x 1080', internalName: 'firefox1920x1080', type: 'desktop' },
        { displayName: 'Samsung Galaxy A51/71', internalName: 'chrome_m_galaxy_a51_71', type: 'mobile' }
    ];
    for (const profile of defaultBrowserProfiles) {
        await pool.query(
            'INSERT INTO browser_profiles (display_name, internal_name, type) VALUES ($1, $2, $3) ON CONFLICT (internal_name) DO NOTHING',
            [profile.displayName, profile.internalName, profile.type]
        );
    }

}

module.exports = { initDatabase };
