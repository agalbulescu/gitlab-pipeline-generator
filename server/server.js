const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// GitLab API Configuration
const GITLAB_CONFIG = {
    API_BASE_URL: process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4',
    PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN,
    PIPELINE_TRIGGER_TOKEN: process.env.GITLAB_PIPELINE_TRIGGER_TOKEN
};

// Add session storage (in-memory for this example)
const sessions = {};

const users = [
    { id: 1, username: 'user1', password: 'qa', name: 'User 1' },
    { id: 2, username: 'user2', password: 'qa', name: 'User 2' },
    { id: 2, username: 'user3', password: 'qa', name: 'User 3' },
    // Add more users as needed
];

// Helper function for GitLab API requests
async function gitlabApiRequest(endpoint, method = 'GET', body = null) {
    const url = `${GITLAB_CONFIG.API_BASE_URL}/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': GITLAB_CONFIG.ACCESS_TOKEN
    };

    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `GitLab API request failed with status ${response.status}`);
    }

    return response.json();
}

// API Endpoints

// Add this endpoint for user list (protected)
app.get('/api/users', (req, res) => {
    // In a real app, you'd add authentication check here
    res.json(users.map(user => ({ 
        id: user.id, 
        username: user.username,
        name: user.name 
    })));
});

// Add login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create session
    const sessionToken = Math.random().toString(36).substring(2);
    sessions[sessionToken] = {
        userId: user.id,
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    
    res.json({ 
        success: true,
        token: sessionToken,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    });
});

// Add session validation endpoint
app.get('/api/validate-session', (req, res) => {
    const token = req.headers.authorization;
    if (!token || !sessions[token]) {
        return res.status(401).json({ valid: false });
    }
    
    // Check if session expired
    if (sessions[token].expires < Date.now()) {
        delete sessions[token];
        return res.status(401).json({ valid: false });
    }
    
    const user = users.find(u => u.id === sessions[token].userId);
    if (!user) {
        return res.status(401).json({ valid: false });
    }
    
    res.json({
        valid: true,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    });
});

// API endpoint to generate pipeline YML
app.post('/api/generate-pipeline', (req, res) => {
    const { selectedGames } = req.body;
    
    if (!selectedGames || !Array.isArray(selectedGames)) {
        return res.status(400).json({ error: 'Invalid game selection' });
    }
    
    try {
        const pipelineYml = generatePipelineYml(selectedGames);
        res.json({ pipelineYml });
    } catch (error) {
        console.error('Pipeline generation error:', error);
        res.status(500).json({ error: 'Failed to generate pipeline' });
    }
});

// Trigger a new pipeline
app.post('/api/trigger-pipeline', async (req, res) => {
    try {
        const { branch, variables } = req.body;
        
        if (!GITLAB_CONFIG.PIPELINE_TRIGGER_TOKEN) {
            throw new Error('Pipeline trigger token not configured');
        }

        const response = await fetch(`${GITLAB_CONFIG.API_BASE_URL}/projects/${encodeURIComponent(GITLAB_CONFIG.PROJECT_ID)}/trigger/pipeline`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: GITLAB_CONFIG.PIPELINE_TRIGGER_TOKEN,
                ref: branch || 'main',
                variables: {
                    SELECTED_GAMES: variables?.SELECTED_GAMES || '',
                    // Add other variables if needed
                }
            })
        });

        if (!response.ok) throw new Error(await response.text());
        res.json(await response.json());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get pipeline status
app.get('/api/pipeline-status/:pipelineId', async (req, res) => {
    try {
        const { pipelineId } = req.params;
        const pipeline = await gitlabApiRequest(`/pipelines/${pipelineId}`);
        const jobs = await gitlabApiRequest(`/pipelines/${pipelineId}/jobs`);

        // Calculate progress
        const totalJobs = jobs.length;
        const completedJobs = jobs.filter(job => job.status === 'success' || job.status === 'failed').length;
        const progress = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

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

// Get project branches
app.get('/api/branches', async (req, res) => {
    try {
        const branches = await gitlabApiRequest('/repository/branches');
        res.json(branches.map(branch => branch.name));
    } catch (error) {
        console.error('Branches fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

function generatePipelineYml(selectedGames) {
    // Group games by their base name
    const gamesMap = {};
    selectedGames.forEach(game => {
        const [gameName, ...suites] = game.split(':');
        gamesMap[gameName] = gamesMap[gameName] || [];
        if (suites.length > 0) gamesMap[gameName].push(...suites);
    });

    // Format SELECTED_GAMES variable
    const selectedGamesValue = Object.entries(gamesMap)
        .map(([game, suites]) => `${game}:${suites.join(',')}`)
        .join(',');

    // Generate test jobs
    const testJobs = Object.entries(gamesMap).map(([game, suites], index) => {
        const resourceGroup = `group_${(index % 5) + 1}`;
        
        const scriptContent = [
            '    - |',
            '      echo "Running ' + game + ' tests"',
            '      ',
            '      # Extract the "' + game + '" section from SELECTED_GAMES',
            '      GAME_SECTION=$(echo "$SELECTED_GAMES" | grep -oP \'' + game + ':\\K[^,]*\')',
            '      ',
            '      if [ -z "$GAME_SECTION" ]; then',
            '        echo "No ' + game + ' tests selected."',
            '        exit 0',
            '      fi',
            '      ',
            '      GAME_SUITES=$(echo "$GAME_SECTION" | tr \':\' \' \')',
            '      PYTEST_CMDS=()',
            '      ',
            '      for SUITE in $GAME_SUITES; do',
            '        case $SUITE in',
            '          all) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ tests/' + game + '/mobile/") ;;',
            '          payouts) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ tests/' + game + '/mobile/ -k test_payouts") ;;',
            '          analytics) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ tests/' + game + '/mobile/ -k test_analytics") ;;',
            '          smapp) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ -k test_smapp") ;;',
            '          desktop) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/") ;;',
            '          mobile) PYTEST_CMDS+=("pytest tests/' + game + '/mobile/") ;;',
            '          desktop_payouts) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ -k test_payouts") ;;',
            '          mobile_payouts) PYTEST_CMDS+=("pytest tests/' + game + '/mobile/ -k test_payouts") ;;',
            '          desktop_ui) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ -k test_ui") ;;',
            '          mobile_ui) PYTEST_CMDS+=("pytest tests/' + game + '/mobile/ -k test_ui") ;;',
            '          desktop_analytics) PYTEST_CMDS+=("pytest tests/' + game + '/desktop/ -k test_analytics") ;;',
            '          mobile_analytics) PYTEST_CMDS+=("pytest tests/' + game + '/mobile/ -k test_analytics") ;;',
            '          *) echo "Unknown suite: $SUITE, skipping."; exit 1 ;;',
            '        esac',
            '      done',
            '      ',
            '      echo "Running commands:"',
            '      for CMD in "${PYTEST_CMDS[@]}"; do',
            '        echo "$CMD"',
            '        eval "$CMD --junitxml=results_' + game + '.xml || true"',
            '      done'
        ].join('\n');

        return [
            'test_' + game + ':',
            '  id_tokens:',
            '    GITLAB_OIDC_TOKEN:',
            '      aud: https://gitlab.example.com',
            '  stage: test',
            '  tags:',
            '    - jenkins-huge',
            '  image: escuxezg0/pypipe-debian:latest',
            '  resource_group: ' + resourceGroup,
            '  script:',
            scriptContent,
            '  rules:',
            '    - if: \'$SELECTED_GAMES =~ /' + game + ':/\'',
            '      when: always',
            '  artifacts:',
            '    paths:',
            '      - reports/results_' + game + '.xml',
            '    when: always'
        ].join('\n');
    }).join('\n\n');

    // Main pipeline template using concatenation instead of template literals
    return [
        'variables:',
        '  SELECTED_GAMES:',
        '    value: "' + selectedGamesValue + '"',
        '    description: "Comma-separated list of games and suites to test"',
        '',
        '.assume-role: &assume-role',
        '  - >',
        '    export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s"',
        '    $(aws sts assume-role-with-web-identity',
        '    --role-arn ${AWS_ROLE_ARN}',
        '    --role-session-name "GitLabRunner-${CI_PROJECT_ID}-${CI_PIPELINE_ID}"',
        '    --web-identity-token $GITLAB_OIDC_TOKEN',
        '    --duration-seconds 36000',
        '    --query \'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]\'',
        '    --output text))',
        '',
        'stages:',
        '  - notify_pipeline_start',
        '  - test',
        '  - rerun_failed',
        '  - notify_pipeline_end',
        '',
        'notify_pipeline_start:',
        '  stage: notify_pipeline_start',
        '  image: alpine/curl:8.7.1',
        '  script:',
        '    - |',
        '      curl -X POST -H \'Content-type: application/json\' --data \'{',
        '        "text": "Pipeline for project *\'$CI_PROJECT_NAME\'* has started :rocket:.\\nBranch: *\'$CI_COMMIT_REF_NAME\'*",',
        '        "channel": "\'$SLACK_CHANNEL\'",',
        '        "username": "gitlab-ci",',
        '        "icon_emoji": ":gitlab:"',
        '      }\' $SLACK_WEBHOOK_URL',
        '  rules:',
        '    - if: $CI_PIPELINE_SOURCE == "web"',
        '',
        testJobs,
        '',
        'rerun_failed_tests:',
        '  stage: rerun_failed',
        '  image: escuxezg0/pypipe-debian:latest',
        '  script:',
        '    - |',
        '      # Find all results files',
        '      RESULTS_FILES=$(find . -name "results_*.xml" -not -name "results_rerun.xml" -type f)',
        '      ',
        '      if [ -z "$RESULTS_FILES" ]; then',
        '        echo "No test results files found."',
        '        exit 0',
        '      fi',
        '      ',
        '      # Combine all results files to find failed tests',
        '      FAILED_TESTS=""',
        '      for FILE in $RESULTS_FILES; do',
        '        echo "Processing $FILE for failed tests..."',
        '        TESTS_IN_FILE=$(xmllint --xpath "//testcase[./failure]/@name" "$FILE" 2>/dev/null | sed -E \'s/name="([^"]+)"/\\1/g\' | tr \'\\n\' \' \')',
        '        if [ -n "$TESTS_IN_FILE" ]; then',
        '          FAILED_TESTS="${FAILED_TESTS} ${TESTS_IN_FILE}"',
        '        fi',
        '      done',
        '      ',
        '      # Run only failed tests if there are any',
        '      if [ -n "$FAILED_TESTS" ]; then',
        '        echo "Re-running failed tests: $FAILED_TESTS"',
        '        pytest -k "$FAILED_TESTS" --junitxml=results_rerun.xml || true',
        '      else',
        '        echo "No failed tests to re-run."',
        '      fi',
        '  dependencies:',
        '    - test_matka',
        '  artifacts:',
        '    paths:',
        '      - reports/results_rerun.xml',
        '    when: always',
        '',
        'notify_pipeline_end:',
        '  stage: notify_pipeline_end',
        '  image: alpine/curl:8.7.1',
        '  script:',
        '    - |',
        '      if [ "$CI_JOB_STATUS" == "success" ]; then',
        '        curl -X POST -H \'Content-type: application/json\' --data \'{',
        '          "text": "Pipeline for project *\'$CI_PROJECT_NAME\'* finished successfully :white_check_mark:.\\nBranch: *\'$CI_COMMIT_REF_NAME\'*",',
        '          "channel": "\'$SLACK_CHANNEL\'",',
        '          "username": "gitlab-ci",',
        '          "icon_emoji": ":gitlab:"',
        '        }\' $SLACK_WEBHOOK_URL',
        '      else',
        '        curl -X POST -H \'Content-type: application/json\' --data \'{',
        '          "text": "Pipeline for project *\'$CI_PROJECT_NAME\'* failed :x:.\\nBranch: *\'$CI_COMMIT_REF_NAME\'*",',
        '          "channel": "\'$SLACK_CHANNEL\'",',
        '          "username": "gitlab-ci",',
        '          "icon_emoji": ":gitlab:"',
        '        }\' $SLACK_WEBHOOK_URL',
        '      fi',
        '  rules:',
        '    - if: $CI_PIPELINE_SOURCE == "web"'
    ].join('\n');
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