const express = require('express');
const session = require('express-session');
const AdmZip = require('adm-zip');
const { XMLParser } = require('fast-xml-parser');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./init-db');
initDatabase();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Setup for session management
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'none', // 'lax'/'strict' for HTTP, 'none' for HTTPS
        maxAge: SESSION_DURATION
    }
}));

app.use('/api/protected', (req, res, next) => {
    if (!req.session.userId || req.session.expires < Date.now()) {
        return res.status(401).json({ error: 'Session expired or not found' });
    }
    req.session.expires = Date.now() + SESSION_DURATION;
    next();
});

// GitLab API Configuration
const GITLAB_CONFIG = {
    BASE_URL: process.env.GITLAB_BASE_URL,
    PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN,
    TRIGGER_TOKEN: process.env.GITLAB_PIPELINE_TRIGGER_TOKEN,
    PUBLIC_YML_ACCESS_TOKEN: process.env.GITLAB_PUBLIC_YML_ACCESS_TOKEN
};

let latestGeneratedPipelineYml = '';

// Helper function for GitLab API requests
async function gitlabApiRequest(endpoint, method = 'GET', body = null) {

    if (!GITLAB_CONFIG.BASE_URL || !GITLAB_CONFIG.PROJECT_ID || !GITLAB_CONFIG.ACCESS_TOKEN) {
        throw new Error('GitLab configuration is incomplete');
    }

    const url = `${GITLAB_CONFIG.BASE_URL}/api/v4/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': GITLAB_CONFIG.ACCESS_TOKEN
    };

    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });
        if (!response.ok) {
            throw new Error(`GitLab API request failed with status ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('GitLab API Error:', error);
        throw new Error('Failed to fetch from GitLab API');
    }
}

// API Endpoints
// Get all users (admin only)
app.get('/api/users', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    try {
        const result = await db.query('SELECT id, username, name FROM users ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Failed to fetch users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Create a new user (admin only)
app.post('/api/users', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin only' });
    }

    const { username, password, name } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.query('INSERT INTO users (username, password, name) VALUES ($1, $2, $3)', [username, hashedPassword, name]);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Failed to create user:', err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Delete a user (admin only)
app.delete('/api/users/:id', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin only' });
    }

    const userId = parseInt(req.params.id, 10);
    try {
        await db.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ success: true });
    } catch (err) {
        console.error('❌ Failed to delete user:', err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Get all games
app.get('/api/games', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM games ORDER BY display_name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch games:', err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Add a new game (admin only)
app.post('/api/games', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin only' });
    }
    const { display_name, internal_name } = req.body;
    try {
        await db.query('INSERT INTO games (display_name, internal_name) VALUES ($1, $2)', [display_name, internal_name]);
        res.json({ success: true });
    } catch (err) {
        console.error('Add game error:', err);
        res.status(500).json({ error: 'Failed to add game' });
    }
});

// Delete a game (admin only)
app.delete('/api/games/:id', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin only' });
    }
    const id = parseInt(req.params.id, 10);
    try {
        await db.query('DELETE FROM games WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete game error:', err);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});

// Login and session management
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (username === ADMIN_USERNAME) {
            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            req.session.userId = 0;
            req.session.username = ADMIN_USERNAME;
            req.session.name = 'Administrator';
            req.session.isAdmin = true;
            req.session.expires = Date.now() + SESSION_DURATION;

            return res.json({
                success: true,
                user: {
                    id: 0,
                    username: ADMIN_USERNAME,
                    name: 'Administrator',
                    isAdmin: true
                }
            });
        }

        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.name = user.name;
        req.session.isAdmin = false;
        req.session.expires = Date.now() + SESSION_DURATION;

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                isAdmin: false
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Change password
app.post('/api/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = req.session.userId;

    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Admin check (admin password is not in DB)
        if (req.session.isAdmin) {
            if (currentPassword !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'Invalid current password' });
            }

            // NOTE: Here you could update ADMIN_PASSWORD in env/config, but usually admins are managed outside DB.
            return res.status(400).json({ error: 'Admin password change is not supported via API' });
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('❌ Change password error:', err);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Session check middleware (to protect routes)
app.use((req, res, next) => {
    // Skip session check for the public GitLab YAML endpoint and results pages
    const exemptPaths = [
        req.path.startsWith('/generated-ci/'),
        req.path.match(/^\/results\/\d+$/)
    ];

    if (exemptPaths.some(Boolean)) {
        return next();
    }

    // Standard session check
    if (!req.session.userId || req.session.expires < Date.now()) {
        return res.status(401).json({ error: 'Session expired or not found' });
    }

    // Extend session expiration
    req.session.expires = Date.now() + SESSION_DURATION;
    next();
});

// Check session validity
app.get('/api/check-session', async (req, res) => {
    if (typeof req.session.userId === 'undefined' || req.session.expires < Date.now()) {
        return res.status(401).json({ valid: false });
    }

    req.session.expires = Date.now() + SESSION_DURATION;

    if (req.session.isAdmin) {
        return res.json({
            valid: true,
            user: {
                id: 0,
                username: ADMIN_USERNAME,
                name: 'Administrator',
                isAdmin: true
            }
        });
    }

    try {
        const result = await db.query('SELECT id, username, name FROM users WHERE id = $1', [req.session.userId]);
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ valid: false });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                isAdmin: false
            }
        });
    } catch (err) {
        console.error('Session check DB error:', err);
        res.status(500).json({ valid: false, error: 'DB error' });
    }
});

// Get project branches
app.get('/api/branches', async (req, res) => {
    try {
        // Get all branches with pagination
        let allBranches = [];
        let page = 1;
        let morePages = true;
        const perPage = 100;

        while (morePages) {
            const branches = await gitlabApiRequest(`/repository/branches?per_page=${perPage}&page=${page}`);
            
            if (!branches || !Array.isArray(branches) || branches.length === 0) {
                morePages = false;
            } else {
                allBranches = allBranches.concat(branches);
                page++;
                
                // Safety check to prevent infinite loops
                if (page > 50) { // Maximum 5000 branches
                    morePages = false;
                    console.warn('Hit safety limit while fetching branches');
                }
            }
        }

        // Extract branch names and sort alphabetically
        const branchNames = allBranches
            .map(branch => branch.name)
            .filter(name => name)
            .sort((a, b) => a.localeCompare(b));

        res.json(branchNames);
    } catch (error) {
        console.error('Branches fetch error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to retrieve branches from GitLab'
        });
    }
});

// Generate pipeline YAML
app.post('/api/generate-pipeline', (req, res) => {
    const { selectedGames, environment } = req.body;
    
    if (!selectedGames || !Array.isArray(selectedGames)) {
        return res.status(400).json({ error: 'Invalid game selection' });
    }
    
    try {
        const pipelineYml = generatePipelineYml(selectedGames, environment);
        latestGeneratedPipelineYml = pipelineYml;
        const match = pipelineYml.match(/SELECTED_GAMES:\s*"([^"]+)"/);
        global.lastSelectedGames = match ? match[1] : '';

        res.json({ pipelineYml });
    } catch (error) {
        console.error('Pipeline generation error:', error);
        res.status(500).json({ error: 'Failed to generate pipeline' });
    }
});

// Secure endpoint to serve the generated pipeline YAML
app.get('/generated-ci/:token.yml', (req, res) => {
    const { token } = req.params;

    if (token !== GITLAB_CONFIG.PUBLIC_YML_ACCESS_TOKEN) {
        return res.status(403).send('Forbidden: Invalid token');
    }

    const emptyYaml = 
`stages:
  - message
    
print-message:
  stage: message
  script:
    - echo "This pipeline has not been configured to run any game, please use the Gitlab Pipeline Generator"`;
    const yamlContent = latestGeneratedPipelineYml.trim() || emptyYaml;

    res.setHeader('Content-Disposition', `inline; filename="${token}.yml"`);

    res.type('text/yaml').send(yamlContent);
});

// Trigger pipeline
app.post('/api/trigger-pipeline', async (req, res) => {
    try {
        const { branch } = req.body;

        if (!branch) {
            return res.status(400).json({ error: 'Branch name is required' });
        }
        
        const response = await fetch(
            `${GITLAB_CONFIG.BASE_URL}/api/v4/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}/trigger/pipeline`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ref: branch || 'main',
                    token: GITLAB_CONFIG.TRIGGER_TOKEN
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitLab API Error:', errorText);
            throw new Error(`Failed to trigger pipeline: ${errorText}`);
        }

        const pipelineData = await response.json();

        latestGeneratedPipelineYml = '';

        res.json(pipelineData);
    } catch (error) {
        console.error('Pipeline trigger error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to trigger pipeline'
        });
    }
});

// Save pipeline info and jobs details to DB
app.get('/api/pipeline-status/:pipelineId', async (req, res) => {
    try {
        const { pipelineId } = req.params;
        const pipeline = await gitlabApiRequest(`/pipelines/${pipelineId}`);
        const jobs = await gitlabApiRequest(`/pipelines/${pipelineId}/jobs`);
        let selectedGamesVar = global.lastSelectedGames || '';

        const selectedGameSuites = parseSelectedGames(selectedGamesVar);

        const totalJobs = jobs.length;
        const completedJobs = jobs.filter(j => ['success', 'failed'].includes(j.status)).length;
        const progress = totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0;

        await db.query(`
            INSERT INTO pipelines (id, status, ref, sha, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at
        `, [pipeline.id, pipeline.status, pipeline.ref, pipeline.sha, pipeline.created_at, pipeline.updated_at]);

        for (const job of jobs) {
            if (!job.name.startsWith('test_')) continue;

            const suites = selectedGameSuites[job.name] || [];

            await db.query(`
                INSERT INTO jobs (id, pipeline_id, name, status, stage, started_at, finished_at, suites)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, finished_at = EXCLUDED.finished_at, suites = EXCLUDED.suites
            `, [job.id, pipeline.id, job.name, job.status, job.stage, job.started_at, job.finished_at, suites.join(',')]);
        }

        res.json({ ...pipeline, progress, jobs });
    } catch (err) {
        console.error('Pipeline status error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Process artifacts and save test results to DB
app.get('/api/pipeline-artifacts/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ''
    });

    try {
        const response = await fetch(`${GITLAB_CONFIG.BASE_URL}/api/v4/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}/jobs/${jobId}/artifacts`, {
            headers: { 'PRIVATE-TOKEN': GITLAB_CONFIG.ACCESS_TOKEN }
        });

        if (!response.ok) return res.status(404).json({ error: 'No artifacts found' });

        const buffer = await response.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));
        const artifactFiles = zip.getEntries().filter(e => e.entryName.endsWith('.xml'));

        if (artifactFiles.length === 0) return res.status(404).json({ error: 'No .xml files found' });

        const initialResults = [];
        const rerunResults = [];

        await db.query('DELETE FROM test_results WHERE job_id = $1', [jobId]);

        for (const entry of artifactFiles) {
            const xmlContent = zip.readAsText(entry);
            const jsonObj = parser.parse(xmlContent);

            let testsuites = [];
            if (jsonObj.testsuite) testsuites = [jsonObj.testsuite];
            else if (jsonObj.testsuites?.testsuite) {
                testsuites = Array.isArray(jsonObj.testsuites.testsuite)
                    ? jsonObj.testsuites.testsuite
                    : [jsonObj.testsuites.testsuite];
            }

            const runType = entry.entryName.includes('rerun_') ? 'rerun' : 'initial';
            const targetArray = entry.entryName.includes('rerun_') ? rerunResults : initialResults;

            for (const suite of testsuites) {
                if (!suite.testcase) continue;
                const testcases = Array.isArray(suite.testcase) ? suite.testcase : [suite.testcase];

                for (const tc of testcases) {

                    const status = tc.failure ? 'failed' : tc.skipped ? 'skipped' : 'passed';
                    const failure = tc.failure;
                    let message = null;
                    if (typeof failure === 'object') {
                        message = failure['#text'] || failure.message || JSON.stringify(failure);
                    } else if (typeof failure === 'string') {
                        message = failure;
                    }

                    const name = tc.name || null;
                    const classname = tc.classname || null;
                    const time = tc.time ? parseFloat(tc.time) : 0;
                    
                    const record = {
                        name,
                        classname,
                        status,
                        time,
                        message,
                        run_type: runType
                    };
                    targetArray.push(record);

                    await db.query(`
                        INSERT INTO test_results (job_id, name, classname, status, time, message, run_type)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `, [jobId, record.name, record.classname, record.status, record.time, record.message, record.run_type]);
                }
            }
        }

        res.json({
            success: true,
            artifacts: {
                initial_results: initialResults,
                rerun_results: rerunResults
            }
        });
    } catch (err) {
        console.error('Artifact fetch error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get Pipeline summary and Jobs from DB
app.get('/api/pipeline-summary/:id', async (req, res) => {
    const { id } = req.params;
    const jobSummaries = [];
    let pipelineSummary = { total: 0, passed: 0, failed: 0, skipped: 0 };

    try {
        let result = await db.query('SELECT * FROM pipelines WHERE id = $1', [id]);
        let pipeline, jobsResult;

        if (result.rowCount === 0) {
            const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
            if (jobResult.rowCount === 0) return res.status(404).json({ error: 'Not found' });

            const job = jobResult.rows[0];
            const pipelineResult = await db.query('SELECT * FROM pipelines WHERE id = $1', [job.pipeline_id]);
            pipeline = pipelineResult.rows[0];
            jobsResult = await db.query('SELECT * FROM jobs WHERE pipeline_id = $1', [job.pipeline_id]);
        } else {
            pipeline = result.rows[0];
            jobsResult = await db.query('SELECT * FROM jobs WHERE pipeline_id = $1', [pipeline.id]);
        }

        for (const job of jobsResult.rows) {
            const testResult = await db.query(
                `SELECT status, COUNT(*) AS count
                 FROM test_results
                 WHERE job_id = $1 AND run_type = 'initial'
                 GROUP BY status`,
                [job.id]
            );

            let total = 0, passed = 0, failed = 0, skipped = 0;
            testResult.rows.forEach(r => {
                total += parseInt(r.count);
                if (r.status === 'passed') passed += parseInt(r.count);
                if (r.status === 'failed') failed += parseInt(r.count);
                if (r.status === 'skipped') skipped += parseInt(r.count);
            });

            pipelineSummary.total += total;
            pipelineSummary.passed += passed;
            pipelineSummary.failed += failed;
            pipelineSummary.skipped += skipped;

            jobSummaries.push({
                ...job,
                total_tests: total,
                passed_tests: passed,
                failed_tests: failed,
                skipped_tests: skipped
            });
        }

        res.json({
            pipeline: {
                pipeline_id: pipeline.id,
                status: pipeline.status,
                ref: pipeline.ref,
                created_at: pipeline.created_at
            },
            jobs: jobSummaries,
            summary: pipelineSummary
        });
    } catch (err) {
        console.error('Summary fetch error:', err);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Get job results and failure logs from DB
app.get('/api/job-results/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const result = await db.query(
            `SELECT name, classname, status, time, message, run_type
             FROM test_results
             WHERE job_id = $1`,
            [jobId]
        );

        const initialResults = [];
        const rerunResults = [];

        for (const row of result.rows) {
            const record = {
                name: row.name,
                classname: row.classname,
                status: row.status,
                time: row.time,
                message: row.message,
                run_type: row.run_type
            };
            if (row.run_type === 'rerun') rerunResults.push(record);
            else initialResults.push(record);
        }

        res.json({ initial_results: initialResults, rerun_results: rerunResults });
    } catch (err) {
        console.error('Job result fetch error:', err);
        res.status(500).json({ error: 'Failed to retrieve job results' });
    }
});

// Serve the results page
app.get('/results/:id', (req, res) => {
    if (!req.session || !req.session.userId || req.session.expires < Date.now()) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Parse selected games
function parseSelectedGames(value) {
    const map = {};
    value.split(',').forEach(entry => {
        const [game, ...suites] = entry.split(':');
        if (game) {
            map[`test_${game}`] = suites.map(s => s.trim());
        }
    });
    return map;
}

// Generate pipeline YAML
function generatePipelineYml(selectedGames, environment = 'UNKNOWN_ENV') {
  const maxConcurrentGroups = 5; // CONFIGURABLE

  const suiteMap = {
      'regression': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/',
      'sanity': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -m sanity',
      'smoke': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -m smoke',
      'payouts': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_payouts',
      'ui': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_ui',
      'analytics': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_analytics',
      'backoffice': 'tests/${internalName}/desktop/ -k test_backoffice',
      'oss': 'tests/${internalName}/desktop/ -k test_oss',
      'smapp': 'tests/${internalName}/desktop/ -k test_smapp',
      'desktop': 'tests/${internalName}/desktop/',
      'mobile': 'tests/${internalName}/mobile/',
      'desktop_payouts': 'tests/${internalName}/desktop/ -k test_payouts',
      'mobile_payouts': 'tests/${internalName}/mobile/ -k test_payouts',
      'desktop_ui': 'tests/${internalName}/desktop/ -k test_ui',
      'mobile_ui': 'tests/${internalName}/mobile/ -k test_ui',
      'desktop_analytics': 'tests/${internalName}/desktop/ -k test_analytics',
      'mobile_analytics': 'tests/${internalName}/mobile/ -k test_analytics'
  };

  const testJobs = selectedGames.map((game, index) => {
    const [gameName, ...suites] = game.split(':');
    const internalName = gameName.toLowerCase().replace(/\s+/g, '_');
    const uniqueSuites = [...new Set(suites)];
    const commands = uniqueSuites.map(suite =>
      `pytest ${suiteMap[suite].replace(/\$\{internalName\}/g, internalName)} --junitxml=reports/results_${internalName}.xml || true`
    );
  
    const groupId = (index % maxConcurrentGroups) + 1;
  
    return `
test_${internalName}:
  id_tokens:
    GITLAB_OIDC_TOKEN:
      aud: ${GITLAB_CONFIG.BASE_URL}
  stage: test
  tags:
    - jenkins-huge
  image: escuxezg0/pypipe-debian:latest
  resource_group: group_${groupId}
  script:
    - |
      echo "Running ${gameName} tests"
      ${commands.join('\n')}

      echo "Checking for failed tests to re-run for ${internalName}..."

      FAILED_FILES=reports/failed_files_${internalName}.txt
      RERUN_XML=reports/rerun_${internalName}.xml
      RESULTS_XML=reports/results_${internalName}.xml

      if [ -f "$RESULTS_XML" ]; then
        echo "Parsing failed test files from $RESULTS_XML..."
        mkdir -p reports
        > "$FAILED_FILES"

        # Extract test file paths from classnames and names and de-duplicate
        if grep -q '<failure' "$RESULTS_XML"; then
          grep '<testcase' "$RESULTS_XML" | grep '<failure' -B1 | grep '<testcase' \\
            | sed -n 's/.*classname="\\([^"]*\\)".*name="\\([^"]*\\)".*/\\1::\\2/p' \\
            | sed 's/\\./\\//g' | sed 's/^/\\.\\//' | sed 's/\\(::.*\\)/.py\\1/' \\
            | sort -u > "$FAILED_FILES"
        else
          echo "No <failure> tags found in $RESULTS_XML, skipping failure parsing."
        fi

        echo "Contents of failed test files:"
        cat "$FAILED_FILES"

        if [ -s "$FAILED_FILES" ]; then
          echo "Found failed files, rerunning them..."
          mapfile -t ARGS < "$FAILED_FILES"
          pytest -v "\${ARGS[@]}" --junitxml="$RERUN_XML" || true
        else
          echo "No failed test files found to rerun."
        fi
      else
        echo "No results XML found at $RESULTS_XML, skipping rerun."
      fi
  rules:
    - if: '$SELECTED_GAMES =~ /${internalName}:/'
      when: always
  artifacts:
    untracked: true
    paths:
      - reports/results_${internalName}.xml
      - reports/rerun_${internalName}.xml
      - reports/failed_files_${internalName}.txt
    when: always
    `;
  });

  const assumeRoleAnchor = `
.assume-role: &assume-role
- >
  export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s" \\
  $(aws sts assume-role-with-web-identity \\
    --role-arn $AWS_ROLE_ARN \\
    --role-session-name "GitLabRunner-$CI_PROJECT_ID-$CI_PIPELINE_ID" \\
    --web-identity-token $GITLAB_OIDC_TOKEN \\
    --duration-seconds 36000 \\
    --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]' \\
    --output text))
`;

  const notifyPipelineStart = `
notify_pipeline_start:
  stage: notify_pipeline_start
  image: alpine/curl:latest
  script:
    - echo $(date +%s) > start_time.txt
    - |
      curl -X POST -H 'Content-type: application/json' --data '{
        "text": "*🚀 Pipeline Started 🚀*\\n*Project:* '$CI_PROJECT_NAME'\\n*Branch:* <'$CI_PROJECT_URL/-/commits/$CI_COMMIT_REF_NAME'|'$CI_COMMIT_REF_NAME'>\\n*Commit:* <'$CI_PROJECT_URL/-/commit/$CI_COMMIT_SHA'|'$CI_COMMIT_SHORT_SHA'>\\n*Pipeline URL:* <'$CI_PROJECT_URL/-/pipelines/$CI_PIPELINE_ID'|'$CI_PIPELINE_ID'>",
        "channel": "'$SLACK_CHANNEL'",
        "username": "gitlab-ci",
        "icon_emoji": ":rocket:"
      }' $SLACK_WEBHOOK_URL
  artifacts:
    paths:
      - start_time.txt
    expire_in: 6 hours
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
  allow_failure: true
`;

  const notifyPipelineEnd = `
notify_pipeline_end:
  stage: notify_pipeline_end
  image: alpine/curl:latest
  script:
    - START_TIME=$(cat start_time.txt 2>/dev/null || echo 0)
    - END_TIME=$(date +%s)
    - DURATION_SEC=$((END_TIME - START_TIME))
    - DURATION_FMT=$(printf '%02dh:%02dm:%02ds' $((DURATION_SEC/3600)) $(((DURATION_SEC%3600)/60)) $((DURATION_SEC%60)))
    - |
      if [ "$CI_PIPELINE_STATUS" = "success" ]; then
        STATUS_TEXT="✅ *Pipeline Passed* ✅"
      else
        STATUS_TEXT="❌ *Pipeline Failed* ❌"
      fi
    - |
      MESSAGE="*🏁 Pipeline Finished 🏁*\\n$STATUS_TEXT\\n*Project:* $CI_PROJECT_NAME\\n*Branch:* <$CI_PROJECT_URL/-/commits/$CI_COMMIT_REF_NAME|$CI_COMMIT_REF_NAME>\\n*Commit:* <$CI_PROJECT_URL/-/commit/$CI_COMMIT_SHA|$CI_COMMIT_SHORT_SHA>\\n*Pipeline URL:* <$CI_PROJECT_URL/-/pipelines/$CI_PIPELINE_ID|$CI_PIPELINE_ID>\\n*Duration:* $DURATION_FMT\\n*Results:* <https://pypipe.456842.xyz/results/$CI_PIPELINE_ID|View>"
    - |
      PAYLOAD=$(printf '{"text":"%s","channel":"%s","username":"gitlab-ci","icon_emoji":":gitlab:"}' "$MESSAGE" "$SLACK_CHANNEL")
      curl -X POST -H 'Content-type: application/json' --data "$PAYLOAD" "$SLACK_WEBHOOK_URL"
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
  allow_failure: true
`;

  return `
variables:
  SELECTED_GAMES: "${selectedGames.join(',')}"
  ENVIRONMENT: "${environment}"

${assumeRoleAnchor}

stages:
- notify_pipeline_start
- test
- notify_pipeline_end

${notifyPipelineStart}

${testJobs.join('\n\n')}

${notifyPipelineEnd}
`;
}

// Start the server and handle port conflicts
async function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log('GitLab Project ID:', GITLAB_CONFIG.PROJECT_ID);
            resolve(server);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} in use, trying port ${port + 1}...`);
                resolve(null);
            } else {
                reject(err);
            }
        });
    });
}

// Find an available port starting from the specified port
async function findAvailablePort(startPort) {
    let port = startPort;
    let server = null;
    
    while (port < startPort + 10 && !server) {
        server = await startServer(port);
        if (!server) port++;
    }
    
    if (!server) {
        console.error('Failed to find available port');
        process.exit(1);
    }
    
    return server;
}

// Start the server
(async () => {
    try {
        const PORT = process.env.PORT || 3000;
        await findAvailablePort(PORT);
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
})();