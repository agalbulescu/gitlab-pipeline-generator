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
    const wrapper = document.getElementById(containerId);
    if (!wrapper) {
        console.warn(`⚠️ Chart container not found: ${containerId}`);
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.id = `${containerId}-chart`;
    // canvas.style.maxWidth = '500px';
    // canvas.style.height = '120px';
    canvas.style.marginTop = '15px';

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
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

function renderSearchSummaryChart(containerId, summary) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.id = `${containerId}-canvas`;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Passed', 'Failed', 'Skipped'],
            datasets: [{
                label: 'Pipeline Summary',
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
                    text: 'Pipeline Test Summary'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                            return '';
                        }
                    }
                }
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
    const table = document.getElementById('game-table');
    const thead = table.querySelector('thead');

    // Add sticky class
    thead.classList.add('sticky-header');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    thead.classList.add('sticky-active');
                } else {
                    thead.classList.remove('sticky-active');
                }
            });
        },
        { root: null, threshold: 0, rootMargin: `-${thead.offsetHeight}px 0px 0px 0px` }
    );

    observer.observe(table);

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
    const newUUsername = document.getElementById('new-user-username');
    const newUName = document.getElementById('new-user-name');
    const newUPassword = document.getElementById('new-user-password');
    const adminFeedback = document.getElementById('admin-feedback');
    const userList = document.getElementById('user-list');

    createUserBtn.addEventListener('click', async () => {
        const username = newUUsername.value.trim();
        const name = newUName.value.trim();
        const password = newUPassword.value.trim();
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

            newUUsername.value = '';
            newUName.value = '';
            newUPassword.value = '';

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
    
    document.getElementById('login-form').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
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

    // Show the form when clicking "Change Password"
    document.getElementById('show-change-password-btn').addEventListener('click', () => {
        document.getElementById('change-password-form').style.display = 'flex';
    });

    // Hide the form when clicking "Cancel"
    document.getElementById('cancel-password-btn').addEventListener('click', () => {
        document.getElementById('change-password-form').style.display = 'none';
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
    });

    // Handle password change
    document.getElementById('save-password-btn').addEventListener('click', async () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        if (!currentPassword || !newPassword) {
            alert('Please fill out both fields.');
            return;
        }

        try {
            const response = await fetch('/api/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to change password');

            alert('Password changed successfully!');
            document.getElementById('change-password-form').style.display = 'none';
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });

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
        loginForm.classList.remove('centered');
        loginForm.style.display = 'none';
        loggedInUser.style.display = 'flex';
        currentUserSpan.textContent = `Logged in as: ${user.name}`;
    }

    function showLoggedOutState() {
        loginForm.style.display = 'flex';
        loginForm.classList.add('centered');
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
    
    function updatePipelineStatusDisplay(status) {
        const pipelineStatus = document.getElementById('pipeline-status');
        let statusContainer = document.getElementById('pipeline-status-container');
    
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'pipeline-status-container';
            pipelineStatus.appendChild(statusContainer);
        }
    
        statusContainer.innerHTML = `
        <div class="status-message ${status.status}">
            <strong>Pipeline Status:</strong> ${status.status.toUpperCase()}<br>
            <strong>Progress:</strong> ${status.progress}% ${status.status === 'success' ? '✅' : status.status === 'failed' ? '❌' : '⏳'}<br>
            ${status.web_url ? `<a href="${status.web_url}" target="_blank">View in GitLab</a>` : ''}
        </div>
        <div class="progress-container">
            <div class="progress"></div>
        </div>
        `;
        
        // Apply progress styling AFTER the DOM is ready
        const progressBar = statusContainer.querySelector('.progress');
        progressBar.style.width = `${status.progress}%`;
    
        if (status.status === 'success') {
            progressBar.style.backgroundColor = '#4CAF50'; // green
        } else if (status.status === 'failed') {
            progressBar.style.backgroundColor = '#f44336'; // red
        } else if (status.status === 'running') {
            progressBar.style.backgroundColor = '#2196F3'; // blue
        } else {
            progressBar.style.backgroundColor = '#9E9E9E'; // gray fallback
        }
    }    

    async function pollPipelineStatus(pipelineId) {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/pipeline-status/${pipelineId}`);
                if (!response.ok) throw new Error('Failed to fetch status');
                
                const status = await response.json();
                updatePipelineStatusDisplay(status);
                
                if (['success', 'failed', 'canceled'].includes(status.status)) {
                    clearInterval(interval);

                    // ✅ Process artifacts for each job
                    for (const job of status.jobs) {
                        if (!job.name.startsWith('test_')) continue;
                        await fetch(`/api/pipeline-artifacts/${job.id}`);  // trigger backend parser
                    }
    
                    // ✅ Wait 2-3 seconds to let backend finish inserts
                    setTimeout(async () => {
                        try {
                            const summaryRes = await fetch(`/api/pipeline-summary/${pipelineId}`);
                            if (!summaryRes.ok) throw new Error('Failed to fetch summary');
                            const { jobs } = await summaryRes.json();
    
                            loadAndDisplayArtifacts(jobs);
                        } catch (error) {
                            console.error('Summary fetch error:', error);
                            showPipelineStatus('Failed to load test summary', 'error');
                        }
                    }, 5000); // wait 5 sec before summary fetch
                }
            } catch (error) {
                clearInterval(interval);
                console.error('Polling error:', error);
                showPipelineStatus('Pipeline updates stopped', 'error');
            }
        }, 10000); // Poll every 10 sec
    }    
    
    async function fetchAndProcessArtifacts(jobs) {
        for (const job of jobs) {
            if (!job.name.startsWith('test_')) continue;
            try {
                await fetch(`/api/pipeline-artifacts/${job.id}`);
            } catch (err) {
                console.warn(`Artifact process failed for ${job.id}: ${err.message}`);
            }
        }
    }
    
    async function loadAndDisplayArtifacts(jobs) {
        const infoContainer = document.getElementById('pipeline-info');
        document.getElementById('test-artifacts')?.remove();
    
        const wrapper = document.createElement('div');
        wrapper.id = 'test-artifacts';
    
        for (const job of jobs) {
            if (!job.name || !job.name.startsWith('test_')) continue;
    
            const box = document.createElement('div');
            box.classList.add('job-artifacts');
    
            const title = document.createElement('h4');
            title.textContent = `Job: ${job.name}`;
            box.appendChild(title);
    
            const response = await fetch(`/api/pipeline-artifacts/${job.id}`);
            if (!response.ok) {
                box.innerHTML += '<div style="color:gray;">No artifact data available</div>';
                wrapper.appendChild(box);
                continue;
            }
    
            const { artifacts } = await response.json();
    
            if (artifacts.initial_results && artifacts.initial_results.length > 0) {
                const summary = summarizeResults(artifacts.initial_results);
                const summaryBox = document.createElement('div');
                summaryBox.className = 'artifact-summary';
                summaryBox.innerHTML = `
                    <h5>Initial Run</h5>
                    <div>Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}</div>
                `;
                const chartContainer = document.createElement('div');
                chartContainer.id = `chart-initial-${job.id}`;
                chartContainer.style.maxWidth = '500px';
                box.appendChild(summaryBox);
                box.appendChild(chartContainer);
                setTimeout(() => {
                    renderTestSummaryChart(`chart-initial-${job.id}`, summary, `${job.name} Initial`);
                }, 0);
            }
    
            if (artifacts.rerun_results && artifacts.rerun_results.length > 0) {
                const summary = summarizeResults(artifacts.rerun_results);
                const summaryBox = document.createElement('div');
                summaryBox.className = 'artifact-summary';
                summaryBox.innerHTML = `
                    <h5>Re-run</h5>
                    <div>Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}</div>
                `;
                const chartContainer = document.createElement('div');
                chartContainer.id = `chart-rerun-${job.id}`;
                chartContainer.style.maxWidth = '500px';
                box.appendChild(summaryBox);
                box.appendChild(chartContainer);
                setTimeout(() => {
                    renderTestSummaryChart(`chart-rerun-${job.id}`, summary, `${job.name} Re-run`);
                }, 0);
            }
    
            wrapper.appendChild(box);
        }
    
        infoContainer.appendChild(wrapper);
    }
    
    function summarizeResults(results) {
        const summary = { total: 0, passed: 0, failed: 0, skipped: 0 };
        results.forEach(r => {
            summary.total++;
            summary[r.status]++;
        });
        return summary;
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
    
            const { pipeline, jobs, summary } = await response.json();
    
            let summaryHtml = `
                <h4>Pipeline #${pipeline.pipeline_id} (${pipeline.status})</h4>
                <p>Ref: <strong>${pipeline.ref || 'N/A'}</strong>, Created: ${pipeline.created_at ? new Date(pipeline.created_at).toLocaleString() : 'N/A'}</p>
                <p>Total Tests: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}</p>
                <div id="search-summary-chart" style="max-width: 500px; margin: 20px 0;"></div>
            `;
    
            resultsDiv.innerHTML = summaryHtml;
    
            // Render overall pipeline chart
            renderSearchSummaryChart('search-summary-chart', summary);
    
            // Loop through jobs and render summaries + charts
            for (const job of jobs) {
                if (!job.name || !job.name.startsWith('test_')) continue;
    
                const jobBox = document.createElement('div');
                jobBox.classList.add('job-summary');
                jobBox.innerHTML = `
                    <strong>${job.name}</strong>: ${job.status}
                    (${job.total_tests} tests, ${job.failed_tests} failed)
                    <div id="chart-search-${job.id}" style="max-width: 500px; height: 120px; margin-top: 10px;"></div>
                `;
    
                resultsDiv.appendChild(jobBox);
    
                const artifactsRes = await fetch(`/api/pipeline-artifacts/${job.id}`);
                if (!artifactsRes.ok) continue;
    
                const { artifacts } = await artifactsRes.json();
    
                if (artifacts.initial_results && artifacts.initial_results.length > 0) {
                    const initialSummary = summarizeResults(artifacts.initial_results);
                    setTimeout(() => {
                        renderTestSummaryChart(`chart-search-${job.id}`, initialSummary, `${job.name} Initial`);
                    }, 0);
                }
    
                if (artifacts.rerun_results && artifacts.rerun_results.length > 0) {
                    const rerunContainerId = `chart-search-${job.id}-rerun`;
    
                    const rerunLabel = document.createElement('div');
                    rerunLabel.textContent = 'Re-run';
                    rerunLabel.style.fontWeight = 'bold';
                    rerunLabel.style.marginTop = '5px';
    
                    const rerunContainer = document.createElement('div');
                    rerunContainer.id = rerunContainerId;
                    rerunContainer.style.maxWidth = '500px';
                    // rerunContainer.style.height = '120px';
                    rerunContainer.style.marginTop = '10px';
    
                    jobBox.appendChild(rerunLabel);
                    jobBox.appendChild(rerunContainer);
    
                    const rerunSummary = summarizeResults(artifacts.rerun_results);
                    setTimeout(() => {
                        renderTestSummaryChart(rerunContainerId, rerunSummary, `${job.name} Re-run`);
                    }, 0);
                }
            }
        } catch (err) {
            console.error('Search error:', err);
            resultsDiv.innerHTML = `<p style="color:red;">No data found for ID: ${searchId}</p>`;
        }
    });
    
    
});