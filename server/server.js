const express = require('express');
const session = require('express-session');
const AdmZip = require('adm-zip'); 

const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./init-db'); // make sure path is correct
initDatabase();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use((req, res, next) => {
    // Security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    next();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Middleware setup for session management
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // change to true in production with HTTPS
        httpOnly: true,
        sameSite: 'none',
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
    API_BASE_URL: process.env.GITLAB_API_URL,
    PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN,
    TRIGGER_TOKEN: process.env.GITLAB_PIPELINE_TRIGGER_TOKEN,
    PUBLIC_YML_ACCESS_TOKEN: process.env.GITLAB_PUBLIC_YML_ACCESS_TOKEN
};

let latestGeneratedPipelineYml = '';

// Helper function for GitLab API requests
async function gitlabApiRequest(endpoint, method = 'GET', body = null) {
    // Add validation for required configuration
    if (!GITLAB_CONFIG.API_BASE_URL || !GITLAB_CONFIG.PROJECT_ID || !GITLAB_CONFIG.ACCESS_TOKEN) {
        throw new Error('GitLab configuration is incomplete');
    }

    const url = `${GITLAB_CONFIG.API_BASE_URL}/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}${endpoint}`;
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

// Add this endpoint for user list (protected)
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

app.post('/api/users', async (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(403).json({ error: 'Forbidden: admin only' });
    }

    const { username, password, name } = req.body;
    await db.query('INSERT INTO users (username, password, name) VALUES ($1, $2, $3)', [username, password, name]);
    res.json({ success: true });
});

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

// Add login endpoint
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check admin first
        if (username === ADMIN_USERNAME) {
            if (password !== ADMIN_PASSWORD) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            req.session.userId = 0; // special ID for admin
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

        // Non-admin (from DB)
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || user.password !== password) {
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


app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// Session check middleware (to protect routes)
app.use((req, res, next) => {
    // Skip session check for the public GitLab YAML endpoint
    if (req.path.startsWith('/generated-ci/')) {
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

// API endpoint to generate pipeline YML
app.post('/api/generate-pipeline', (req, res) => {
    const { selectedGames, environment } = req.body;
    
    if (!selectedGames || !Array.isArray(selectedGames)) {
        return res.status(400).json({ error: 'Invalid game selection' });
    }
    
    try {
        const pipelineYml = generatePipelineYml(selectedGames, environment);
        latestGeneratedPipelineYml = pipelineYml;
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

    // Optionally make it look like a file for GitLab or browsers
    res.setHeader('Content-Disposition', `inline; filename="${token}.yml"`);

    // Set the content type to YAML and send the content
    res.type('text/yaml').send(latestGeneratedPipelineYml);
});

// Trigger a new pipeline using trigger token and include
app.post('/api/trigger-pipeline', async (req, res) => {
    try {
        // const { branch, variables } = req.body;
        const { branch } = req.body;

        console.log('Triggering pipeline with:', {
            ref: branch || 'main',
            token: GITLAB_CONFIG.TRIGGER_TOKEN,
            // variables: Object.entries(variables || {}).map(([key, value]) => ({ key, value }))
        });
        
        const response = await fetch(
            `${GITLAB_CONFIG.API_BASE_URL}/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}/trigger/pipeline`,
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
        res.json(pipelineData);
    } catch (error) {
        console.error('Pipeline trigger error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to trigger pipeline'
        });
    }
});

// Get pipeline status

app.get('/api/pipeline-status/:pipelineId', async (req, res) => {
    try {
        const { pipelineId } = req.params;

        // Fetch pipeline and job info from GitLab
        const pipeline = await gitlabApiRequest(`/pipelines/${pipelineId}`);
        const jobs = await gitlabApiRequest(`/pipelines/${pipelineId}/jobs`);

        // Calculate progress
        const totalJobs = jobs.length;
        const completedJobs = jobs.filter(job => job.status === 'success' || job.status === 'failed').length;
        const progress = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

        // Insert pipeline info into DB
        await db.query(
            `INSERT INTO pipelines (id, status, ref, sha, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
            [pipeline.id, pipeline.status, pipeline.ref, pipeline.sha, pipeline.created_at, pipeline.updated_at]
        );

        // Insert each job
        for (const job of jobs) {
            await db.query(
                `INSERT INTO jobs (id, pipeline_id, name, status, stage, started_at, finished_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, finished_at = EXCLUDED.finished_at`,
                [job.id, pipeline.id, job.name, job.status, job.stage, job.started_at, job.finished_at]
            );
        }

        res.json({
            ...pipeline,
            progress,
            jobs
        });
    } catch (error) {
        console.error('Pipeline status error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/pipeline/:pipelineId', async (req, res) => {
    try {
        const pipelineId = parseInt(req.params.pipelineId, 10);
        const pipelineResult = await db.query('SELECT * FROM pipelines WHERE pipeline_id = $1', [pipelineId]);
        const jobsResult = await db.query('SELECT * FROM jobs WHERE pipeline_id = $1', [pipelineId]);

        if (pipelineResult.rows.length === 0) {
            return res.status(404).json({ error: 'Pipeline not found' });
        }

        res.json({
            pipeline: pipelineResult.rows[0],
            jobs: jobsResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch pipeline' });
    }
});

app.get('/api/pipeline-summary/:id', async (req, res) => {
    const { id } = req.params;
    const db = require('./db');

    try {
        // Try as pipeline ID
        let result = await db.query('SELECT * FROM pipelines WHERE pipeline_id = $1', [id]);
        if (result.rowCount === 0) {
            // Try as job ID
            const jobResult = await db.query('SELECT * FROM jobs WHERE job_id = $1', [id]);
            if (jobResult.rowCount === 0) return res.status(404).json({ error: 'Not found' });

            const job = jobResult.rows[0];
            return res.json({
                pipeline: { pipeline_id: job.pipeline_id, status: job.status },
                jobs: [job]
            });
        }

        const pipeline = result.rows[0];
        const jobsResult = await db.query('SELECT * FROM jobs WHERE pipeline_id = $1', [id]);

        res.json({
            pipeline,
            jobs: jobsResult.rows
        });
    } catch (err) {
        console.error('Summary fetch error:', err);
        res.status(500).json({ error: 'Internal error' });
    }
});

app.get('/api/pipeline-artifacts/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        // 1. Get the artifact archive (zip)
        const response = await fetch(`${GITLAB_CONFIG.API_BASE_URL}/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}/jobs/${jobId}/artifacts`, {
            headers: {
                'PRIVATE-TOKEN': GITLAB_CONFIG.ACCESS_TOKEN
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch artifacts: ${errorText}`);
        }

        const buffer = await response.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));

        // 2. Look for result and rerun XMLs
        const artifactFiles = zip.getEntries().filter(entry =>
            entry.entryName.endsWith('.xml') &&
            (entry.entryName.includes('results_') || entry.entryName.includes('rerun_'))
        );

        if (artifactFiles.length === 0) {
            return res.status(404).json({ error: 'No relevant .xml files found in artifacts.' });
        }

        // 3. Extract contents
        const artifacts = {};
        artifactFiles.forEach(entry => {
            artifacts[entry.entryName] = zip.readAsText(entry);
        });

        res.json({ success: true, artifacts });
    } catch (error) {
        console.error('Artifact fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get project branches
app.get('/api/branches', async (req, res) => {
    try {
        // Get all branches with pagination support
        let allBranches = [];
        let page = 1;
        let morePages = true;
        const perPage = 100; // GitLab's max per page

        while (morePages) {
            const branches = await gitlabApiRequest(`/repository/branches?per_page=${perPage}&page=${page}`);
            
            if (!branches || !Array.isArray(branches) || branches.length === 0) {
                morePages = false;
            } else {
                allBranches = allBranches.concat(branches);
                page++;
                
                // Safety check to prevent infinite loops
                if (page > 50) { // Maximum 5000 branches (100 per page × 50)
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

function generatePipelineYml(selectedGames, environment = 'UNKNOWN_ENV') {
  const maxConcurrentGroups = 5; // You can make this configurable

  const suiteMap = {
      'regression': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/',
      'sanity': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -m sanity',
      'smoke': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -m smoke',
      'payouts': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_payouts',
      'ui': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_ui',
      'analytics': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/ -k test_analytics',
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

        # Extract test file paths from classnames and de-duplicate
        grep '<testcase' "$RESULTS_XML" | grep '<failure' -B1 | grep '<testcase' \\
          | sed -n 's/.*classname="\\([^"]*\\)".*/\\1/p' \\
          | sed 's/\\./\\//g' | sed 's/$/.py/' | sort -u > "$FAILED_FILES"

        echo "Contents of failed test files:"
        cat "$FAILED_FILES"

        if [ -s "$FAILED_FILES" ]; then
          echo "Found failed files, rerunning them..."
          RERUN_ARGS=$(paste -sd ' ' "$FAILED_FILES")
          pytest -v $RERUN_ARGS --junitxml="$RERUN_XML" || true
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
  image: alpine/curl:8.7.1
  script:
    - |
      curl -X POST -H 'Content-type: application/json' --data '{
        "text": "Pipeline for project *'$CI_PROJECT_NAME'* has started :rocket:.\\nBranch: *'$CI_COMMIT_REF_NAME'*",
        "channel": "'$SLACK_CHANNEL'",
        "username": "gitlab-ci",
        "icon_emoji": ":gitlab:"
      }' $SLACK_WEBHOOK_URL
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
`;

  const notifyPipelineEnd = `
notify_pipeline_end:
  stage: notify_pipeline_end
  image: alpine/curl:8.7.1
  script:
    - |
      if [ "$CI_PIPELINE_STATUS" == "success" ]; then
        curl -X POST -H 'Content-type: application/json' --data '{
          "text": "Pipeline for project *'$CI_PROJECT_NAME'* finished successfully :white_check_mark:.\\nBranch: *'$CI_COMMIT_REF_NAME'*",
          "channel": "'$SLACK_CHANNEL'",
          "username": "gitlab-ci",
          "icon_emoji": ":gitlab:"
        }' $SLACK_WEBHOOK_URL
      else
        curl -X POST -H 'Content-type: application/json' --data '{
          "text": "Pipeline for project *'$CI_PROJECT_NAME'* failed :x:.\\nBranch: *'$CI_COMMIT_REF_NAME'*",
          "channel": "'$SLACK_CHANNEL'",
          "username": "gitlab-ci",
          "icon_emoji": ":gitlab:"
        }' $SLACK_WEBHOOK_URL
      fi
  rules:
    - if: $CI_PIPELINE_SOURCE == "trigger"
  dependencies:
    - notify_pipeline_start
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

async function startServer(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log('GitLab Project ID:', GITLAB_CONFIG.PROJECT_ID);
            resolve(server);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} in use, trying port ${port + 1}...`);
                resolve(null); // Signal that this port failed
            } else {
                reject(err); // Other errors should crash the app
            }
        });
    });
}

async function findAvailablePort(startPort) {
    let port = startPort;
    let server = null;
    
    while (port < startPort + 10 && !server) { // Try up to 10 ports
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