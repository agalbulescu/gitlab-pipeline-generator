const express = require('express');
const session = require('express-session');

const path = require('path');
require('dotenv').config();

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
    API_BASE_URL: process.env.GITLAB_API_URL,
    PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN,
    TRIGGER_TOKEN: process.env.GITLAB_PIPELINE_TRIGGER_TOKEN,
    PUBLIC_YML_ACCESS_TOKEN: process.env.GITLAB_PUBLIC_YML_ACCESS_TOKEN
};

let latestGeneratedPipelineYml = '';

const users = [
    { id: 1, username: 'aalbulescu', password: 'qa', name: 'Andrei Albulescu' },
    { id: 2, username: 'bdobre', password: 'qa', name: 'Bogdan Dobre' },
    { id: 2, username: 'seftimie', password: 'qa', name: 'Sergiu Eftimie' },
    // Add more users as needed
];

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

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.name = user.name;
    req.session.expires = Date.now() + SESSION_DURATION;

    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    });
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

app.get('/api/check-session', (req, res) => {
    if (!req.session.userId || req.session.expires < Date.now()) {
        return res.status(401).json({ valid: false });
    }

    req.session.expires = Date.now() + SESSION_DURATION;

    const user = users.find(u => u.id === req.session.userId);
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
                    token: GITLAB_CONFIG.TRIGGER_TOKEN,
                    // variables: Object.entries(variables || {}).map(([key, value]) => ({
                    //     key,
                    //     value
                    // }))
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

function generatePipelineYml(selectedGames) {
  const maxConcurrentGroups = 5; // You can make this configurable

  const suiteMap = {
      'all': 'tests/${internalName}/desktop/ tests/${internalName}/mobile/',
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
      aud: https://gitlab.external.tools.ezugicdn.com
  stage: test
  tags:
    - jenkins-huge
  image: escuxezg0/pypipe-debian:latest
  resource_group: group_${groupId}
  script:
    - |
      echo "Running ${gameName} tests"
      export PYTEST_CACHE_DIR=".pytest_cache_${internalName}"
      ${commands.join('\n')}
      pytest --last-failed --last-failed-no-failures none --junitxml=reports/rerun_${internalName}.xml || true
  rules:
    - if: '$SELECTED_GAMES =~ /${internalName}:/'
      when: always
  artifacts:
    untracked: true
    paths:
      - reports/results_${internalName}.xml
      - reports/rerun_${internalName}.xml
    when: always`;
  });

  const testJobNames = selectedGames.map(game => {
      const internalName = game.split(':')[0].toLowerCase().replace(/\s+/g, '_');
      return `test_${internalName}`;
  });

  return `
variables:
  SELECTED_GAMES: "${selectedGames.join(',')}"

.assume-role: &assume-role
- >
  export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s"
  $(aws sts assume-role-with-web-identity
  --role-arn $AWS_ROLE_ARN
  --role-session-name "GitLabRunner-$CI_PROJECT_ID-$CI_PIPELINE_ID"
  --web-identity-token $GITLAB_OIDC_TOKEN
  --duration-seconds 36000
  --query 'Credentials.[AccessKeyId,SecretAccessKey,SessionToken]'
  --output text))

stages:
- notify_pipeline_start
- test
- rerun_failed
- notify_pipeline_end

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

${testJobs.join('\n\n')}

rerun_failed_tests:
  stage: rerun_failed
  image: escuxezg0/pypipe-debian:latest
  script:
    - mkdir -p reports
    - echo "Extracting failed test names..."

    # Find all failed test node IDs from reports
    - |
      > reports/failed_tests.txt
      for file in reports/results_*.xml; do
        internal=$(basename "$file" .xml | cut -d_ -f2-)
        echo "Processing $file"
        # Extract file + class + test names
        xmllint --xpath '//testcase[failure]' "$file" 2>/dev/null | \
        grep -oP 'classname="\\K[^"]+' | while read -r classname; do
          grep -oP 'name="\\K[^"]+' "$file" | while read -r name; do
            echo "$classname::$name" >> reports/failed_tests.txt
          done
        done
      done

    - echo "Running failed tests only..."
    - |
      if [ -s reports/failed_tests.txt ]; then
        # Convert to -k format: test1 or test2 or ...
        rerun_expr=$(awk -F:: '{print $2}' reports/failed_tests.txt | paste -sd ' or ' -)
        pytest -v -k "$rerun_expr" --junitxml=reports/results_rerun.xml || true
      else
        echo "No failed tests found. Skipping rerun."
      fi

  dependencies:
    - ${testJobNames.join('\n    - ')}
  artifacts:
    paths:
      - reports/results_rerun.xml
      - reports/failed_tests.txt
    when: always

notify_pipeline_end:
  stage: notify_pipeline_end
  image: alpine/curl:8.7.1
  script:
    - |
      if [ "$CI_JOB_STATUS" == "success" ]; then
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
    - if: $CI_PIPELINE_SOURCE == "trigger"`;
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