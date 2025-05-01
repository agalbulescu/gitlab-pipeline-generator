// Function to toggle light/dark mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelector('.sub-title').classList.toggle('light-mode');
    document.querySelector('.sub-title-2').classList.toggle('light-mode');
    document.querySelector('.buttons-container').classList.toggle('light-mode');
    document.querySelector('.textbox-container').classList.toggle('light-mode');
    document.querySelector('table').classList.toggle('light-mode');
    document.querySelector('#edit-games').classList.toggle('light-mode');
    document.querySelector('#pipeline-info').classList.toggle('light-mode');
}

function toggleButton(button) {
    const buttons = document.querySelectorAll('.buttons-container button');
    const regressionButton = document.querySelector('.buttons-container button:nth-child(1)');
    const sanityButton = document.querySelector('.buttons-container button:nth-child(2)');
    const smokeButton = document.querySelector('.buttons-container button:nth-child(3)');
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(5)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(6)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(7)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(8)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(9)');

    button.classList.toggle('active');

    // Regression → clear all others
    if (button === regressionButton) {
        if (regressionButton.classList.contains('active')) {
            buttons.forEach(btn => {
                if (btn !== regressionButton && btn.textContent !== 'CLEAR') {
                    btn.classList.remove('active');
                }
            });
        }
    }

    // Sanity → clear everything except itself
    if (button === sanityButton) {
        if (sanityButton.classList.contains('active')) {
            buttons.forEach(btn => {
                if (btn !== sanityButton && btn.textContent !== 'CLEAR') {
                    btn.classList.remove('active');
                }
            });
        }
    }

    // Smoke → clear everything except itself
    if (button === smokeButton) {
        if (smokeButton.classList.contains('active')) {
            buttons.forEach(btn => {
                if (btn !== smokeButton && btn.textContent !== 'CLEAR') {
                    btn.classList.remove('active');
                }
            });
        }
    }

    // Desktop ↔ smapp binding
    if (button === desktopButton) {
        if (desktopButton.classList.contains('active')) {
            smappButton.classList.add('active');
        } else {
            smappButton.classList.remove('active');
        }
    }

    if (button === smappButton && desktopButton.classList.contains('active')) {
        smappButton.classList.add('active');
    }

    // Selecting payouts, ui, analytics clears desktop & mobile
    if (button === payoutsButton || button === uiButton || button === analyticsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        desktopButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    // Selecting desktop or mobile clears payouts, ui, analytics
    if (button === desktopButton || button === mobileButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        payoutsButton.classList.remove('active');
        uiButton.classList.remove('active');
        analyticsButton.classList.remove('active');
    }

    // Clear button
    if (button.textContent === 'CLEAR') {
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    updateTableBasedOnButtons();
    updateOutput();
}

function clearButtons() {
    const buttons = document.querySelectorAll('.buttons-container button');
    buttons.forEach(button => button.classList.remove('active'));
    updateTableBasedOnButtons();
    updateOutput();
}

function updateTableBasedOnButtons() {
    const rows = document.querySelectorAll('#table-body tr');
    // const allButton = document.querySelector('.buttons-container button:first-child');
    const regressionButton = document.querySelector('.buttons-container button:first-child');
    const sanityButton = document.querySelector('.buttons-container button:nth-child(2)');
    const smokeButton = document.querySelector('.buttons-container button:nth-child(3)');
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(5)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(6)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(7)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(8)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(9)');

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        // const allSwitch = row.querySelector('.all-switch');
        const regressionSwitch = row.querySelector('.regression-switch');
        const sanitySwitch = row.querySelector('.sanity-switch');
        const smokeSwitch = row.querySelector('.smoke-switch');
        const payoutsSwitch = row.querySelector('.payouts-switch');
        const uiSwitch = row.querySelector('.ui-switch');
        const analyticsSwitch = row.querySelector('.analytics-switch');
        const smappSwitch = row.querySelector('.smapp-switch');
        const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
        const desktopUISwitch = row.querySelector('.desktop-ui-switch');
        const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
        const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
        const mobileUISwitch = row.querySelector('.mobile-ui-switch');
        const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

        runSwitch.checked = false;
        // allSwitch.checked = false;
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;

        if (regressionButton.classList.contains('active') ||
            sanityButton.classList.contains('active') ||
            smokeButton.classList.contains('active') ||
            payoutsButton.classList.contains('active') ||
            uiButton.classList.contains('active') ||
            analyticsButton.classList.contains('active') ||
            smappButton.classList.contains('active') ||
            desktopButton.classList.contains('active') ||
            mobileButton.classList.contains('active')) {
            runSwitch.checked = true;
            runSwitch.disabled = false;
            row.classList.add('selected-row');
            const switches = row.querySelectorAll('input[type="checkbox"]');
            switches.forEach(switchInput => {
                if (switchInput !== runSwitch) {
                    switchInput.disabled = false;
                }
            });

            // if (allButton.classList.contains('active')) {
            //     allSwitch.checked = true;
            //     toggleAllSwitch(allSwitch);
            // }

            if (regressionButton.classList.contains('active')) {
                regressionSwitch.checked = true;
                toggleRegressionSwitch(regressionSwitch);
            }
            if (sanityButton.classList.contains('active')) {
                sanitySwitch.checked = true;
                toggleSanitySwitch(sanitySwitch);
            }
            if (smokeButton.classList.contains('active')) {
                smokeSwitch.checked = true;
                toggleSmokeSwitch(smokeSwitch);
            }

            if (payoutsButton.classList.contains('active')) {
                payoutsSwitch.checked = true;
                togglePayoutsSwitch(payoutsSwitch);
            }

            if (uiButton.classList.contains('active')) {
                uiSwitch.checked = true;
                toggleUISwitch(uiSwitch);
            }

            if (analyticsButton.classList.contains('active')) {
                analyticsSwitch.checked = true;
                toggleAnalyticsSwitch(analyticsSwitch);
            }

            if (smappButton.classList.contains('active')) {
                smappSwitch.checked = true;
                toggleSMAppSwitch(smappSwitch);
            }

            if (desktopButton.classList.contains('active')) {
                desktopPayoutsSwitch.checked = true;
                desktopUISwitch.checked = true;
                desktopAnalyticsSwitch.checked = true;
                smappSwitch.checked = true;
                toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
                toggleDesktopUISwitch(desktopUISwitch);
                toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
                toggleSMAppSwitch(smappSwitch);
            }

            if (mobileButton.classList.contains('active')) {
                mobilePayoutsSwitch.checked = true;
                mobileUISwitch.checked = true;
                mobileAnalyticsSwitch.checked = true;
                toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
                toggleMobileUISwitch(mobileUISwitch);
                toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch);
            }
        } else {
            runSwitch.checked = false;
            runSwitch.disabled = false;
            row.classList.remove('selected-row');
            const switches = row.querySelectorAll('input[type="checkbox"]');
            switches.forEach(switchInput => {
                if (switchInput !== runSwitch) {
                    switchInput.disabled = true;
                    switchInput.checked = false;
                }
            });
        }
    });
}

function toggleRowSwitches(runSwitch) {
    const row = runSwitch.closest('tr');
    const switches = row.querySelectorAll('input[type="checkbox"]');
    switches.forEach(switchInput => {
        if (switchInput !== runSwitch) {
            switchInput.disabled = !runSwitch.checked;
            if (!runSwitch.checked) {
                switchInput.checked = false;
            }
        }
    });

    if (runSwitch.checked) {
        const regressionSwitch = row.querySelector('.regression-switch');
        if (regressionSwitch) {
            regressionSwitch.checked = true;
            toggleRegressionSwitch(regressionSwitch);
        }
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
    updateOutput();
}

function toggleRegressionSwitch(regressionSwitch) {
    const row = regressionSwitch.closest('tr');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    const smappSwitch = row.querySelector('.smapp-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (regressionSwitch.checked) {
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleSanitySwitch(sanitySwitch) {
    const row = sanitySwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    const smappSwitch = row.querySelector('.smapp-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (sanitySwitch.checked) {
        regressionSwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleSmokeSwitch(smokeSwitch) {
    const row = smokeSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    const smappSwitch = row.querySelector('.smapp-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (smokeSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    }
    updateOutput();
}

function togglePayoutsSwitch(payoutsSwitch) {
    const row = payoutsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');

    if (payoutsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
    } else if (desktopPayoutsSwitch.checked || mobilePayoutsSwitch.checked) {
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleUISwitch(uiSwitch) {
    const row = uiSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');

    if (uiSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        desktopUISwitch.checked = false;
        mobileUISwitch.checked = false;
    } else if (desktopUISwitch.checked || mobileUISwitch.checked) {
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleAnalyticsSwitch(analyticsSwitch) {
    const row = analyticsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (analyticsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    } else if (desktopAnalyticsSwitch.checked || mobileAnalyticsSwitch.checked) {
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleSMAppSwitch(smappSwitch) {
    const row = smappSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    if (smappSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopPayoutsSwitch(desktopPayoutsSwitch) {
    const row = desktopPayoutsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (desktopPayoutsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobilePayoutsSwitch(mobilePayoutsSwitch) {
    const row = mobilePayoutsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (mobilePayoutsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopUISwitch(desktopUISwitch) {
    const row = desktopUISwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (desktopUISwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobileUISwitch(mobileUISwitch) {
    const row = mobileUISwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (mobileUISwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch) {
    const row = desktopAnalyticsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (desktopAnalyticsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch) {
    const row = mobileAnalyticsSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (mobileAnalyticsSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

function togglePipelineInfo() {
    const infoSection = document.getElementById('pipeline-info');
    infoSection.classList.toggle('expanded');
}

function updateOutput() {
    const outputText = document.getElementById('output-text');
    const rows = document.querySelectorAll('#table-body tr');
    let output = '';

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        if (runSwitch.checked) {
            const internalName = row.dataset.internalName;
            const regressionSwitch = row.querySelector('.regression-switch');
            const sanitySwitch = row.querySelector('.sanity-switch');
            const smokeSwitch = row.querySelector('.smoke-switch');
            const selectedColumns = [];

            // Check for regression (was all)
            if (regressionSwitch && regressionSwitch.checked) {
                selectedColumns.push('regression');
            }
            // Check for sanity
            else if (sanitySwitch && sanitySwitch.checked) {
                selectedColumns.push('sanity');
            }
            // Check for smoke
            else if (smokeSwitch && smokeSwitch.checked) {
                selectedColumns.push('smoke');
            }
            else {
                const switches = row.querySelectorAll('input[type="checkbox"]:checked');
                switches.forEach(switchInput => {
                    if (
                        switchInput !== runSwitch &&
                        switchInput !== regressionSwitch &&
                        switchInput !== sanitySwitch &&
                        switchInput !== smokeSwitch
                    ) {
                        const columnName = switchInput.getAttribute('data-column');
                        selectedColumns.push(columnName);
                    }
                });

                const hasAllDesktop = selectedColumns.includes('smapp') &&
                                     selectedColumns.includes('desktop_payouts') &&
                                     selectedColumns.includes('desktop_ui') &&
                                     selectedColumns.includes('desktop_analytics');

                const hasAllMobile = selectedColumns.includes('mobile_payouts') &&
                                    selectedColumns.includes('mobile_ui') &&
                                    selectedColumns.includes('mobile_analytics');

                const hasAllColumns = hasAllDesktop && hasAllMobile;

                const hasPayoutsUiAnalyticsSmapp = selectedColumns.includes('payouts') &&
                                                  selectedColumns.includes('ui') &&
                                                  selectedColumns.includes('analytics') &&
                                                  selectedColumns.includes('smapp');

                if (hasAllColumns) {
                    selectedColumns.length = 0;
                    selectedColumns.push('regression');
                } else if (hasPayoutsUiAnalyticsSmapp) {
                    selectedColumns.length = 0;
                    selectedColumns.push('regression');
                } else {
                    if (hasAllDesktop) {
                        selectedColumns.splice(selectedColumns.indexOf('smapp'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_payouts'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_ui'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('desktop_analytics'), 1);
                        selectedColumns.push('desktop');
                    }

                    if (hasAllMobile) {
                        selectedColumns.splice(selectedColumns.indexOf('mobile_payouts'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('mobile_ui'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('mobile_analytics'), 1);
                        selectedColumns.push('mobile');
                    }
                }
            }

            if (selectedColumns.length > 0) {
                output += `${internalName}:${selectedColumns.join(':')},`;
            }
        }
    });

    outputText.value = output.slice(0, -1);
}

function renderTestSummaryChart(containerId, summary, jobName) {
    const canvas = document.createElement('canvas');
    canvas.id = `${containerId}-chart`;
    canvas.style.maxWidth = '500px';
    canvas.style.marginTop = '15px';

    const wrapper = document.getElementById(containerId);
    wrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Passed', 'Failed', 'Skipped'],
            datasets: [{
                label: `Test Results - ${jobName}`,
                data: [summary.passed, summary.failed, summary.skipped],
                backgroundColor: ['#4CAF50', '#f44336', '#FF9800']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: `Results Summary for ${jobName}`
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function triggerPipeline(branch) {

    console.log('Triggering on branch:', branch);

    try {
        const response = await fetch('/api/trigger-pipeline', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                branch
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to trigger pipeline');
        }

        return await response.json();
    } catch (error) {
        console.error('Pipeline trigger error:', error);
        throw error;
    }
}

async function checkPipelineStatus(pipelineId) {
    try {
        const response = await fetch(`/api/pipeline-status/${pipelineId}`);
        if (!response.ok) throw new Error('Failed to check pipeline status');
        return await response.json();
    } catch (error) {
        console.error('Pipeline status error:', error);
        throw error;
    }
}

// Add pipeline status polling
async function pollPipelineStatus(pipelineId) {
    const interval = setInterval(async () => {
        try {
            const status = await checkPipelineStatus(pipelineId);
            
            updatePipelineStatusDisplay(status);
            
            if (status.status === 'success' || 
                status.status === 'failed' || 
                status.status === 'canceled') {
                clearInterval(interval);
            }
        } catch (error) {
            console.error('Polling error:', error);
            clearInterval(interval);
        }
    }, 5000); // Poll every 5 seconds
}

function updatePipelineStatusDisplay(status) {
    const progressBar = document.querySelector('.pipeline-progress .progress');
    const progressText = document.querySelector('.pipeline-progress .progress-text');
    
    progressBar.style.width = `${status.progress}%`;
    progressText.textContent = `Status: ${status.status} (${status.progress}% complete)`;
    
    if (status.status === 'success') {
        progressBar.style.backgroundColor = '#4CAF50';
    } else if (status.status === 'failed') {
        progressBar.style.backgroundColor = '#f44336';
    }
}

// Pipeline generation and triggering functionality
document.addEventListener('DOMContentLoaded', async () => {
    // DOM elements
    const loginForm = document.getElementById('login-form');
    const loggedInUser = document.getElementById('logged-in-user');
    const usernameSelect = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserSpan = document.getElementById('current-user');
    const generateBtn = document.getElementById('generate-btn');

    // Store generated pipeline
    let generatedPipeline = null;

    // Initialize game selector
    async function loadGames() {
        try {
            const res = await fetch('/api/games');
            if (!res.ok) throw new Error('Failed to fetch games');
            const games = await res.json();
            updateTableWithGames(games);
        } catch (err) {
            console.error('Error loading games:', err);
        }
    }

    function updateTableWithGames(games) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
    
        games.forEach(game => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <label class="switch">
                        <input type="checkbox" onchange="toggleRowSwitches(this)">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td class="game-name-cell">${game.display_name}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="regression-switch" disabled onchange="toggleRegressionSwitch(this)" data-column="regression">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="sanity-switch" disabled onchange="toggleSanitySwitch(this)" data-column="sanity">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="smoke-switch" disabled onchange="toggleSmokeSwitch(this)" data-column="smoke">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="payouts-switch" disabled onchange="togglePayoutsSwitch(this)" data-column="payouts">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="ui-switch" disabled onchange="toggleUISwitch(this)" data-column="ui">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="analytics-switch" disabled onchange="toggleAnalyticsSwitch(this)" data-column="analytics">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="smapp-switch" disabled onchange="toggleSMAppSwitch(this)" data-column="smapp">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="desktop-payouts-switch" disabled onchange="toggleDesktopPayoutsSwitch(this)" data-column="desktop_payouts">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="desktop-ui-switch" disabled onchange="toggleDesktopUISwitch(this)" data-column="desktop_ui">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="desktop-analytics-switch" disabled onchange="toggleDesktopAnalyticsSwitch(this)" data-column="desktop_analytics">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="mobile-payouts-switch" disabled onchange="toggleMobilePayoutsSwitch(this)" data-column="mobile_payouts">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="mobile-ui-switch" disabled onchange="toggleMobileUISwitch(this)" data-column="mobile_ui">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="mobile-analytics-switch" disabled onchange="toggleMobileAnalyticsSwitch(this)" data-column="mobile_analytics">
                        <span class="slider round"></span>
                    </label>
                </td>
            `;
            row.dataset.internalName = game.internal_name;
            tableBody.appendChild(row);
        });

        const tableCells = document.querySelectorAll('#table-body td');
        tableCells.forEach(cell => {
            cell.addEventListener('click', (event) => {
                const switchInput = cell.querySelector('input[type="checkbox"]');
                if (switchInput && !switchInput.disabled) {
                    switchInput.checked = !switchInput.checked;
                    switchInput.dispatchEvent(new Event('change'));
                }
            });
        });
    
        updateTableBasedOnButtons();
    }    

    await loadGames();

    // Hook elements
    const adminSection = document.getElementById('admin-section');
    const createUserBtn = document.getElementById('create-user-btn');
    const newUsername = document.getElementById('new-username');
    const newName = document.getElementById('new-name');
    const newPassword = document.getElementById('new-password');
    const adminFeedback = document.getElementById('admin-feedback');
    const userList = document.getElementById('user-list');

    createUserBtn.addEventListener('click', async () => {
        const username = newUsername.value.trim();
        const name = newName.value.trim();
        const password = newPassword.value.trim();
        if (!username || !name || !password) {
            adminFeedback.textContent = '⚠️ Please fill all fields';
            adminFeedback.style.color = 'red';
            return;
        }

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, name, password })
            });

            if (!res.ok) throw new Error('Failed to create user');
            adminFeedback.textContent = '✅ User created successfully';
            adminFeedback.style.color = 'green';

            newUsername.value = '';
            newName.value = '';
            newPassword.value = '';

            loadUserList(); // refresh list
        } catch (err) {
            adminFeedback.textContent = `❌ ${err.message}`;
            adminFeedback.style.color = 'red';
        }
    });

    // Check for existing session
    const user = await checkPersistentSession();
    if (user) {
        showLoggedInState(user);
    } else {
        showLoggedOutState();
    }
    
    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        showLoggedOutState();
    });
    
    generateBtn.addEventListener('click', generatePipeline);
    
    // Persistent session management
    async function checkPersistentSession() {
        try {
            const response = await fetch('/api/check-session', {
                credentials: 'include' // 👈 include session cookie
            });
    
            if (!response.ok) return false;
    
            const { valid, user } = await response.json();
            return valid ? user : false;
        } catch (error) {
            console.error('Session check failed:', error);
            return false;
        }
    }

    async function loadUserList() {
        try {
            const res = await fetch('/api/users', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to load users');
            const users = await res.json();
    
            userList.innerHTML = '';
            users.forEach(u => {
                const li = document.createElement('li');
                li.textContent = `${u.username} (${u.name}) `;
    
                // Add delete button/icon
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '❌';
                deleteBtn.style.marginLeft = '10px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.addEventListener('click', async () => {
                    if (!confirm(`Are you sure you want to delete user "${u.username}"?`)) return;
    
                    try {
                        const res = await fetch(`/api/users/${u.id}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        });
                        if (!res.ok) throw new Error('Failed to delete user');
                        loadUserList();
                    } catch (err) {
                        alert(`❌ ${err.message}`);
                    }
                });
    
                li.appendChild(deleteBtn);
                userList.appendChild(li);
            });
        } catch (err) {
            userList.innerHTML = `<li style="color:red;">❌ ${err.message}</li>`;
        }
    }    

    async function loadAdminGames() {
        try {
            const res = await fetch('/api/games');
            const games = await res.json();
    
            const gamesList = document.getElementById('games-list');
            gamesList.innerHTML = '';
    
            games.forEach(game => {
                const li = document.createElement('li');
                li.textContent = `${game.display_name} (${game.internal_name}) `;
    
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', async () => {
                    if (confirm(`Delete game "${game.display_name}"?`)) {
                        const resp = await fetch(`/api/games/${game.id}`, { method: 'DELETE' });
                        if (resp.ok) {
                            loadAdminGames();
                        } else {
                            alert('Failed to delete game');
                        }
                    }
                });
    
                li.appendChild(deleteBtn);
                gamesList.appendChild(li);
            });
        } catch (err) {
            console.error('Failed to load games', err);
        }
    }
    
    document.getElementById('add-game-btn').addEventListener('click', async () => {
        const display = document.getElementById('new-game-display').value.trim();
        const internal = document.getElementById('new-game-internal').value.trim();
    
        if (!display || !internal) {
            alert('Please fill both display and internal name');
            return;
        }
    
        try {
            const res = await fetch('/api/games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_name: display, internal_name: internal })
            });
            if (res.ok) {
                document.getElementById('new-game-display').value = '';
                document.getElementById('new-game-internal').value = '';
                loadAdminGames();
            } else {
                alert('Failed to add game');
            }
        } catch (err) {
            console.error('Add game error', err);
        }
    });

    // Handle login
    async function handleLogin() {
        const username = usernameSelect.value;
        const password = passwordInput.value;
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // 👈 important!
            });
    
            if (!response.ok) throw new Error('Login failed');
    
            const { user } = await response.json(); // no token!
            showLoggedInState(user);
        } catch (error) {
            showError(error.message);
        }
    }    

    // UI state functions
    function showLoggedInState(user) {
        if (user.isAdmin) {
            adminSection.style.display = 'block';
            loadUserList();
            document.getElementById('admin-games-section').style.display = 'block';
            loadAdminGames();
        } else {
            adminSection.style.display = 'none';
            document.getElementById('admin-games-section').style.display = 'none';
            document.getElementById('generate-btn').disabled = false;
            document.getElementById('pipeline-trigger-section').style.display = 'block';
            document.getElementById('app-content').style.display = 'block'; // 👈 show the main UI
            // ✅ Only fetch branches after login/session confirmed
            fetchBranches();
        }
        loginForm.style.display = 'none';
        loggedInUser.style.display = 'flex';
        currentUserSpan.textContent = `Logged in as: ${user.name}`;
    }

    function showLoggedOutState() {
        loginForm.style.display = 'flex';
        loggedInUser.style.display = 'none';
        currentUserSpan.textContent = '';
        document.getElementById('generate-btn').disabled = true;
        document.getElementById('pipeline-trigger-section').style.display = 'none';
        document.getElementById('app-content').style.display = 'none'; // 👈 hide the main UI
        adminSection.style.display = 'none';
        document.getElementById('admin-games-section').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    function showError(message) {
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    const slimEnvSelector = new SlimSelect({
        select: '#env-selector'
    });

    let slimBranchSelector;

    // Add these new functions to handle GitLab API operations
    async function fetchBranches() {
        const branchSelector = document.getElementById('branch-selector');
        
        try {
            // Show loading state
            branchSelector.innerHTML = '<option value="">Loading branches (this may take a while)...</option>';
            branchSelector.disabled = true;

            const response = await fetch('/api/branches', {
                method: 'GET',
                credentials: 'include' // Include session cookie
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            let branches = await response.json();

            // Ensure branches is an array and has "main"
            if (!Array.isArray(branches)) branches = [];
            if (!branches.includes('main')) branches.unshift('main');
            
            // Initialize SlimSelect with proper configuration for large datasets
            slimBranchSelector = new SlimSelect({
                select: '#branch-selector',
                settings: {
                    placeholderText: 'Select branch',
                    allowDeselect: false, // Force selection
                    showSearch: true,
                    searchPlaceholder: 'Search branches...',
                    searchText: 'No matches found',
                    searchingText: 'Searching branches...'
                },
                data: [
                    // Add main branch first as default selected
                    { text: 'main', value: 'main', selected: true },
                    // Add all other branches
                    ...branches.filter(b => b !== 'main').map(branch => ({
                        text: branch,
                        value: branch
                    }))
                ],
                events: {
                    afterOpen: () => {
                        const searchInput = document.querySelector('.ss-search input');
                        if (searchInput) searchInput.focus();
                    }
                }
            });
            
        } catch (error) {
            console.error('Error loading branches:', error);
            // Fallback to just "main" branch
            slimBranchSelector = new SlimSelect({
                select: '#branch-selector',
                settings: {
                    placeholderText: 'Select branch',
                    allowDeselect: false
                },
                data: [
                    { text: 'main', value: 'main', selected: true }
                ]
            });
            showPipelineStatus('Using fallback branch list', 'warning');
        } finally {
            branchSelector.disabled = false;
        }
    }

    async function generatePipeline() {
        const selectedEnv = slimEnvSelector.getSelected()[0];
        const outputText = document.getElementById('output-text').value;
        if (!outputText) {
            showPipelineStatus('Please select at least one game to test', 'error');
            return;
        }
    
        try {
            showPipelineStatus('Generating pipeline...', 'info');
            
            const response = await fetch('/api/generate-pipeline', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    selectedGames: outputText.split(','), 
                    environment: selectedEnv 
                  })
            });
    
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.error || 'Failed to generate pipeline');
            }
    
            const data = await response.json();
            generatedPipeline = data.pipelineYml;
    
            // Show success with full pipeline YML
            showPipelineStatus(
                'Pipeline generated successfully!', 
                'success',
                generatedPipeline
            );
    
            // Show the trigger section
            document.getElementById('pipeline-trigger-section').style.display = 'block';
        } catch (error) {
            console.error('Pipeline generation error:', error);
            showPipelineStatus(
                `Failed to generate pipeline: ${error.message}`,
                'error',
                error.stack // Shows stack trace in details
            );
        }
    }

    document.getElementById('trigger-btn').addEventListener('click', async () => {

        const selectedBranch = slimBranchSelector.getSelected()[0];
        // const selectedGames = document.getElementById('output-text').value;
        
        if (!generatedPipeline) {
            showError('No pipeline generated to trigger');
            return;
        }
    
        try {
            showPipelineStatus(`Triggering pipeline on branch: ${selectedBranch}`);

            // const pipelineData = await triggerPipeline(selectedBranch, selectedGames);
            const pipelineData = await triggerPipeline(selectedBranch);
    
            showPipelineStatus(`Pipeline triggered successfully! ID: ${pipelineData.id}`);
    
            // Start polling
            pollPipelineStatus(pipelineData.id);
        } catch (error) {
            showError('Failed to trigger pipeline: ' + error.message);
        }
    });

    function showPipelineStatus(message, type = 'info', details = '') {
        const pipelineStatus = document.getElementById('pipeline-status');
        if (!pipelineStatus) return;
    
        // Clear previous messages
        pipelineStatus.innerHTML = '';
    
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message ${type}`;
    
        // Main message
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageDiv.appendChild(messageElement);
    
        // If details are provided, create toggle button and hidden pre block
        if (details) {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Show Full YAML';
            toggleButton.style.marginTop = '10px';
            toggleButton.className = 'copy-button'; // reuse your green button style
    
            const preBlock = document.createElement('pre');
            preBlock.className = 'pipeline-yml-block';
            preBlock.textContent = details;
            preBlock.style.display = 'none';
            preBlock.style.maxHeight = '300px';
            preBlock.style.overflowY = 'auto';
            preBlock.style.backgroundColor = '#1e1e1e';
            preBlock.style.color = '#ccc';
            preBlock.style.padding = '10px';
            preBlock.style.border = '1px solid #444';
            preBlock.style.marginTop = '10px';
    
            toggleButton.addEventListener('click', () => {
                if (preBlock.style.display === 'none') {
                    preBlock.style.display = 'block';
                    toggleButton.textContent = 'Hide Full YAML';
                } else {
                    preBlock.style.display = 'none';
                    toggleButton.textContent = 'Show Full YAML';
                }
            });
    
            messageDiv.appendChild(toggleButton);
            messageDiv.appendChild(preBlock);
        }
    
        pipelineStatus.appendChild(messageDiv);
    }    

    async function pollPipelineStatus(pipelineId) {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/pipeline-status/${pipelineId}`);
                if (!response.ok) throw new Error('Failed to fetch status');
                
                const status = await response.json();
                updatePipelineStatusDisplay(status);
                
                // Stop polling if pipeline completes
                if (['success', 'failed', 'canceled'].includes(status.status)) {
                    clearInterval(interval);
                
                    // Refresh UI one last time
                    setTimeout(() => {
                        updatePipelineStatusDisplay(status);
                        loadAndDisplayArtifacts(status.jobs); // 🔥 Load the results
                    }, 1000);
                }
                
            } catch (error) {
                clearInterval(interval);
                console.error('Polling error:', error);
                showPipelineStatus('Pipeline status updates stopped', 'error');
            }
        }, 10000); // Poll every 10 seconds
    }
    
    function updatePipelineStatusDisplay(status) {
        // Get or create status container
        let statusContainer = document.getElementById('pipeline-status-container');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'pipeline-status-container';
            document.getElementById('pipeline-status').appendChild(statusContainer);
        }
    
        // Update progress bar
        const progressBar = document.querySelector('.progress-bar .progress');
        if (progressBar) {
            progressBar.style.width = `${status.progress}%`;
            progressBar.style.backgroundColor = 
                status.status === 'success' ? '#4CAF50' :
                status.status === 'failed' ? '#f44336' : '#2196F3';
        }
    
        // Update status text
        statusContainer.innerHTML = `
            <div class="status-message ${status.status}">
                <strong>Pipeline Status:</strong> ${status.status.toUpperCase()}<br>
                <strong>Progress:</strong> ${status.progress}%<br>
                ${status.web_url ? `<a href="${status.web_url}" target="_blank">View in GitLab</a>` : ''}
                ${status.status === 'success' ? '✅' : status.status === 'failed' ? '❌' : '⏳'}
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress" style="width: ${status.progress}%"></div>
                </div>
            </div>
        `;
    }

    async function loadAndDisplayArtifacts(jobs) {
        const infoContainer = document.getElementById('pipeline-info');
        const existing = document.getElementById('test-artifacts');
        if (existing) existing.remove();
    
        const resultsWrapper = document.createElement('div');
        resultsWrapper.id = 'test-artifacts';
    
        for (const job of jobs) {
            if (!['success', 'failed'].includes(job.status)) continue;
    
            const response = await fetch(`/api/pipeline-artifacts/${job.id}`);
            if (!response.ok) continue;
    
            const { artifacts } = await response.json();
    
            const jobBox = document.createElement('div');
            jobBox.classList.add('job-artifacts');
    
            const title = document.createElement('h4');
            title.textContent = `Job: ${job.name}`;
            jobBox.appendChild(title);
    
            for (const [filename, xmlContent] of Object.entries(artifacts)) {
                const summary = parseJUnitXmlSummary(xmlContent);
                const summaryBox = document.createElement('div');
                summaryBox.className = 'artifact-summary';
    
                const chartContainerId = `${job.name}-${filename}-chart-container`.replace(/[^a-zA-Z0-9-_]/g, '_');
                summaryBox.id = chartContainerId;
    
                summaryBox.innerHTML = `
                    <div><strong>${filename}</strong></div>
                    <div>Total: ${summary.tests}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}</div>
                    <div>Duration: ${summary.time}s</div>
                    ${
                        summary.failures.length > 0
                            ? `<ul style="margin-top: 8px;">${summary.failures.map(f => `<li>${f}</li>`).join('')}</ul>`
                            : '<em style="color:gray;">No failures</em>'
                    }
                `;
    
                // Append summary and render chart
                jobBox.appendChild(summaryBox);
                renderTestSummaryChart(chartContainerId, summary, job.name);
    
                // Raw XML toggle
                const toggle = document.createElement('details');
                toggle.style.marginTop = '8px';
                const summaryEl = document.createElement('summary');
                summaryEl.textContent = 'View raw XML';
                const pre = document.createElement('pre');
                pre.textContent = xmlContent;
                pre.style.maxHeight = '250px';
                pre.style.overflowY = 'auto';
                pre.style.backgroundColor = '#1e1e1e';
                pre.style.color = '#ccc';
                pre.style.padding = '10px';
                pre.style.border = '1px solid #444';
    
                toggle.appendChild(summaryEl);
                toggle.appendChild(pre);
    
                jobBox.appendChild(toggle);
            }
    
            resultsWrapper.appendChild(jobBox);
        }
    
        infoContainer.appendChild(resultsWrapper);
    }    

    function parseJUnitXmlSummary(xmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'application/xml');
    
        const testsuite = doc.querySelector('testsuite');
        const tests = parseInt(testsuite?.getAttribute('tests') || '0');
        const failures = parseInt(testsuite?.getAttribute('failures') || '0');
        const skipped = parseInt(testsuite?.getAttribute('skipped') || '0');
        const errors = parseInt(testsuite?.getAttribute('errors') || '0');
        const time = parseFloat(testsuite?.getAttribute('time') || '0');
    
        const failedTests = Array.from(doc.querySelectorAll('testcase'))
            .filter(tc => tc.querySelector('failure'))
            .map(tc => {
                const classname = tc.getAttribute('classname') || '';
                const name = tc.getAttribute('name') || '';
                return `${classname} :: ${name}`;
            });
    
        return {
            tests,
            failed: failures + errors,
            passed: tests - failures - errors - skipped,
            skipped,
            time,
            failures: failedTests
        };
    }

    document.getElementById('search-btn').addEventListener('click', async () => {
        const searchId = document.getElementById('search-id').value.trim();
        const resultsDiv = document.getElementById('search-results');
        resultsDiv.innerHTML = '';
    
        if (!searchId) {
            resultsDiv.innerHTML = '<p style="color:red;">Please enter a valid ID</p>';
            return;
        }
    
        try {
            const response = await fetch(`/api/pipeline-summary/${searchId}`);
            if (!response.ok) throw new Error('Not found');
    
            const { pipeline, jobs } = await response.json();
    
            const summaryHtml = `
                <h4>Pipeline #${pipeline.pipeline_id} (${pipeline.status})</h4>
                <p>Ref: <strong>${pipeline.ref}</strong>, Created: ${new Date(pipeline.created_at).toLocaleString()}</p>
                <ul>
                    ${jobs.map(job => `
                        <li>
                            <strong>${job.job_name}</strong>: ${job.status} (${job.total_tests} tests, ${job.failed_tests} failed)
                        </li>
                    `).join('')}
                </ul>
            `;
    
            resultsDiv.innerHTML = summaryHtml;
        } catch (err) {
            console.error('Search error:', err);
            resultsDiv.innerHTML = `<p style="color:red;">No data found for ID: ${searchId}</p>`;
        }
    });
    
});