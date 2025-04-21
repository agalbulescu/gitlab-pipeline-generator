// Game selector functionality
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

// Function to add a new game entry
function addGameEntry(displayName = '', internalName = '') {
    const container = document.getElementById('games-list-container');
    const entry = document.createElement('div');
    entry.classList.add('game-entry');
    entry.innerHTML = `
        <input type="text" class="display-name" placeholder="Display Name" value="${displayName}">
        <input type="text" class="internal-name" placeholder="Internal Name" value="${internalName}">
        <button onclick="removeGameEntry(this)">✖</button>
    `;
    container.appendChild(entry);
}

// Function to remove a game entry
function removeGameEntry(button) {
    const entry = button.closest('.game-entry');
    entry.remove();
}

// Function to save the games list and update the table
function saveGamesList() {
    updateTable();
    toggleEditGames();
}

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
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(2)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(3)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(5)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(6)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(7)');

    button.classList.toggle('active');

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

    if (button === payoutsButton || button === uiButton || button === analyticsButton) {
        desktopButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    if (button === desktopButton || button === mobileButton) {
        payoutsButton.classList.remove('active');
        uiButton.classList.remove('active');
        analyticsButton.classList.remove('active');
    }

    if (button.textContent === 'ALL') {
        buttons.forEach(btn => {
            if (btn !== button && btn.textContent !== 'CLEAR') {
                btn.classList.remove('active');
            }
        });
    } else if (button.textContent !== 'CLEAR') {
        document.querySelector('.buttons-container button:first-child').classList.remove('active');
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

function toggleEditGames() {
    const editGames = document.getElementById('edit-games');
    const table = document.querySelector('table');
    const subTitle = document.querySelector('.sub-title');
    const subTitle2 = document.querySelector('.sub-title-2');
    const buttonsContainer = document.querySelector('.buttons-container');
    const textboxContainer = document.querySelector('.textbox-container');
    const editGamesButton = document.getElementById('edit-games-button');

    if (editGames.style.display === 'none' || editGames.style.display === '') {
        editGames.style.display = 'block';
        table.style.display = 'none';
        subTitle.style.display = 'none';
        subTitle2.style.display = 'none';
        buttonsContainer.style.display = 'none';
        textboxContainer.style.display = 'none';
        editGamesButton.classList.add('active');
    } else {
        editGames.style.display = 'none';
        table.style.display = 'table';
        subTitle.style.display = 'block';
        subTitle2.style.display = 'block';
        buttonsContainer.style.display = 'flex';
        textboxContainer.style.display = 'flex';
        editGamesButton.classList.remove('active');
    }

    if (editGames.style.display === 'block') {
        const tableBody = document.getElementById('table-body');
        const rows = tableBody.querySelectorAll('tr');
        const container = document.getElementById('games-list-container');
        container.innerHTML = '';
        rows.forEach(row => {
            const displayName = row.querySelector('td:nth-child(2)').textContent;
            const internalName = row.dataset.internalName;
            addGameEntry(displayName, internalName);
        });
    }
}

function updateTable() {
    const container = document.getElementById('games-list-container');
    const entries = container.querySelectorAll('.game-entry');
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    entries.forEach(entry => {
        const displayName = entry.querySelector('.display-name').value.trim();
        const internalName = entry.querySelector('.internal-name').value.trim();
        if (!displayName || !internalName) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <label class="switch">
                    <input type="checkbox" onchange="toggleRowSwitches(this)">
                    <span class="slider round"></span>
                </label>
            </td>
            <td class="game-name-cell">${displayName}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" class="all-switch" disabled onchange="toggleAllSwitch(this)" data-column="all">
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
        row.dataset.internalName = internalName;
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

function updateTableBasedOnButtons() {
    const rows = document.querySelectorAll('#table-body tr');
    const allButton = document.querySelector('.buttons-container button:first-child');
    const payoutsButton = document.querySelector('.buttons-container button:nth-child(2)');
    const uiButton = document.querySelector('.buttons-container button:nth-child(3)');
    const analyticsButton = document.querySelector('.buttons-container button:nth-child(4)');
    const smappButton = document.querySelector('.buttons-container button:nth-child(5)');
    const desktopButton = document.querySelector('.buttons-container button:nth-child(6)');
    const mobileButton = document.querySelector('.buttons-container button:nth-child(7)');

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        const allSwitch = row.querySelector('.all-switch');
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
        allSwitch.checked = false;
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

        if (allButton.classList.contains('active') ||
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

            if (allButton.classList.contains('active')) {
                allSwitch.checked = true;
                toggleAllSwitch(allSwitch);
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
        const allSwitch = row.querySelector('.all-switch');
        if (allSwitch) {
            allSwitch.checked = true;
            toggleAllSwitch(allSwitch);
        }
        row.classList.add('selected-row');
    } else {
        row.classList.remove('selected-row');
    }
    updateOutput();
}

function toggleAllSwitch(allSwitch) {
    const row = allSwitch.closest('tr');
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

    if (allSwitch.checked) {
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
    const allSwitch = row.querySelector('.all-switch');
    const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
    const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');

    if (payoutsSwitch.checked) {
        allSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
    } else if (desktopPayoutsSwitch.checked || mobilePayoutsSwitch.checked) {
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleUISwitch(uiSwitch) {
    const row = uiSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const desktopUISwitch = row.querySelector('.desktop-ui-switch');
    const mobileUISwitch = row.querySelector('.mobile-ui-switch');

    if (uiSwitch.checked) {
        allSwitch.checked = false;
        desktopUISwitch.checked = false;
        mobileUISwitch.checked = false;
    } else if (desktopUISwitch.checked || mobileUISwitch.checked) {
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleAnalyticsSwitch(analyticsSwitch) {
    const row = analyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
    const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

    if (analyticsSwitch.checked) {
        allSwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;
    } else if (desktopAnalyticsSwitch.checked || mobileAnalyticsSwitch.checked) {
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleSMAppSwitch(smappSwitch) {
    const row = smappSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    if (smappSwitch.checked) {
        allSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopPayoutsSwitch(desktopPayoutsSwitch) {
    const row = desktopPayoutsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (desktopPayoutsSwitch.checked) {
        allSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobilePayoutsSwitch(mobilePayoutsSwitch) {
    const row = mobilePayoutsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    if (mobilePayoutsSwitch.checked) {
        allSwitch.checked = false;
        payoutsSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopUISwitch(desktopUISwitch) {
    const row = desktopUISwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (desktopUISwitch.checked) {
        allSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobileUISwitch(mobileUISwitch) {
    const row = mobileUISwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    if (mobileUISwitch.checked) {
        allSwitch.checked = false;
        uiSwitch.checked = false;
    }
    updateOutput();
}

function toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch) {
    const row = desktopAnalyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (desktopAnalyticsSwitch.checked) {
        allSwitch.checked = false;
        analyticsSwitch.checked = false;
    }
    updateOutput();
}

function toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch) {
    const row = mobileAnalyticsSwitch.closest('tr');
    const allSwitch = row.querySelector('.all-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    if (mobileAnalyticsSwitch.checked) {
        allSwitch.checked = false;
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
            const allSwitch = row.querySelector('.all-switch');
            const selectedColumns = [];

            if (allSwitch.checked) {
                selectedColumns.push('all');
            } else {
                const switches = row.querySelectorAll('input[type="checkbox"]:checked');
                switches.forEach(switchInput => {
                    if (switchInput !== runSwitch && switchInput !== allSwitch) {
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
                    selectedColumns.push('all');
                } else if (hasPayoutsUiAnalyticsSmapp) {
                    selectedColumns.length = 0;
                    selectedColumns.push('all');
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

function copyText() {
    const outputText = document.getElementById('output-text');
    outputText.select();
    document.execCommand('copy');
    
    // Optional: Show feedback
    const copyButton = document.querySelector('.copy-button');
    const originalText = copyButton.textContent;
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
        copyButton.textContent = originalText;
    }, 2000);
}

// Add these new functions to handle GitLab API operations
async function fetchBranches() {
    try {
        const response = await fetch('/api/branches');
        if (!response.ok) throw new Error('Failed to fetch branches');
        return await response.json();
    } catch (error) {
        console.error('Error fetching branches:', error);
        showError('Failed to load branches: ' + error.message);
        return ['main']; // Fallback to main branch
    }
}

async function triggerPipeline(branch, variables) {
    try {
        const response = await fetch('/api/trigger-pipeline', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                branch,
                variables: {
                    SELECTED_GAMES: variables.SELECTED_GAMES
                }
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

// Update the triggerPipeline function to use real API
async function triggerPipeline() {
    if (!generatedPipeline) {
        showError('No pipeline generated to trigger');
        return;
    }
    
    const selectedBranch = branchSelector.value || 'main';
    const outputText = document.getElementById('output-text').value;
    
    try {
        showPipelineStatus('Triggering pipeline on branch: ' + selectedBranch);
        
        const pipelineData = await triggerPipeline(selectedBranch, {
            SELECTED_GAMES: outputText
        });
        
        showPipelineStatus(`
            <div class="status-message success">
                Pipeline triggered successfully! ID: ${pipelineData.id}
            </div>
            <div class="pipeline-progress">
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                </div>
                <div class="progress-text">Status: ${pipelineData.status}</div>
            </div>
        `);
        
        // Start polling for pipeline status
        pollPipelineStatus(pipelineData.id);
    } catch (error) {
        showError('Failed to trigger pipeline: ' + error.message);
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
    const triggerSection = document.getElementById('pipeline-trigger-section');
    const triggerBtn = document.getElementById('trigger-btn');
    const branchSelector = document.getElementById('branch-selector');
    const pipelineStatus = document.getElementById('pipeline-status');

    // Store generated pipeline
    let generatedPipeline = null;

    // Initialize game selector
    defaultGames.forEach(game => {
        addGameEntry(game.displayName, game.internalName);
    });
    updateTable();

    // Load branches when page loads
    fetchBranches().then(branches => {
        branchSelector.innerHTML = branches.map(branch => 
            `<option value="${branch}">${branch}</option>`
        ).join('');
    });

    // Check if user is already logged in
    checkLoginStatus();
    
    // Event listeners
    await loadUsers();
    
    // Check existing session
    const user = await checkAuth();
    if (user) {
        showLoggedInState(user);
    } else {
        showLoggedOutState();
    }
    
    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    generateBtn.addEventListener('click', generatePipeline);
    triggerBtn.addEventListener('click', triggerPipeline);
    
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            showLoggedInState(loggedInUser);
        } else {
            showLoggedOutState();
        }
    }
    
    // Load users on page load
    async function loadUsers() {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error('Failed to load users');
            const users = await response.json();
            
            // Populate dropdown
            usernameSelect.innerHTML = '<option value="">Select User</option>' +
                users.map(user => 
                    `<option value="${user.username}">${user.name}</option>`
                ).join('');
        } catch (error) {
            console.error('Error loading users:', error);
            showError('Failed to load user list');
        }
    }

    // Auth functions
    async function checkAuth() {
        const token = localStorage.getItem('sessionToken');
        if (!token) return false;
        
        try {
            const response = await fetch('/api/validate-session', {
                headers: { 'Authorization': token }
            });
            
            if (!response.ok) {
                localStorage.removeItem('sessionToken');
                return false;
            }
            
            const { valid, user } = await response.json();
            if (valid) {
                return user;
            }
            return false;
        } catch (error) {
            console.error('Session validation error:', error);
            return false;
        }
    }

    // Handle login
    async function handleLogin() {
        const username = usernameSelect.value;
        const password = passwordInput.value;
        
        if (!username || !password) {
            showError('Please select a user and enter a password');
            return;
        }
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }
            
            const { user } = await response.json();
            showLoggedInState(user);
        } catch (error) {
            showError(error.message);
        }
    }

    // Handle logout
    function handleLogout() {
        showLoggedOutState();
    }
    
    // UI state functions
    function showLoggedInState(user) {
        loginForm.style.display = 'none';
        loggedInUser.style.display = 'flex';
        currentUserSpan.textContent = `Logged in as: ${user.name}`;
        document.getElementById('generate-btn').disabled = false;
    }

    function showLoggedOutState() {
        loginForm.style.display = 'flex';
        loggedInUser.style.display = 'none';
        currentUserSpan.textContent = '';
        document.getElementById('generate-btn').disabled = true;
        document.getElementById('pipeline-trigger-section').style.display = 'none';
    }

    function showError(message) {
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }

    async function generatePipeline() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText) {
            pipelineStatus.innerHTML = `
                <div class="status-message error">
                    Please select at least one game to test
                </div>
            `;
            return;
        }

        try {
            const response = await fetch('/api/generate-pipeline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedGames: outputText.split(',') })
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate pipeline');
            }
            
            const data = await response.json();
            generatedPipeline = data.pipelineYml;
            
            triggerSection.style.display = 'flex';
            
            pipelineStatus.innerHTML = `
                <div class="status-message success">
                    Pipeline generated successfully!
                </div>
                <div class="pipeline-preview">
                    <pre>${escapeHtml(generatedPipeline.substring(0, 200))}...</pre>
                </div>
            `;
            
        } catch (error) {
            console.error('Pipeline generation error:', error);
            pipelineStatus.innerHTML = `
                <div class="status-message error">
                    Failed to generate pipeline: ${error.message}
                </div>
            `;
        }
    }

    async function triggerPipeline() {
        const branch = document.getElementById('branch-selector').value;
        const selectedGames = document.getElementById('output-text').value;
    
        try {
            const response = await fetch('/api/trigger-pipeline', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    branch,
                    variables: { SELECTED_GAMES: selectedGames }
                })
            });
            
            if (!response.ok) throw new Error('Failed to trigger pipeline');
            const pipeline = await response.json();
            
            // Display pipeline info
            document.getElementById('pipeline-status').innerHTML = `
                <div class="status-message success">
                    Pipeline triggered! ID: ${pipeline.id}
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: 0%"></div>
                    <div class="status">Status: ${pipeline.status}</div>
                </div>
            `;
            
            // Start polling for status updates
            pollPipelineStatus(pipeline.id);
        } catch (error) {
            document.getElementById('pipeline-status').innerHTML = `
                <div class="status-message error">
                    Failed to trigger pipeline: ${error.message}
                </div>
            `;
        }
    }

    async function pollPipelineStatus(pipelineId) {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/pipeline-status/${pipelineId}`);
                if (!response.ok) throw new Error('Failed to fetch status');
                const status = await response.json();
                
                // Update progress bar
                const progressBar = document.querySelector('.progress-bar');
                const statusText = document.querySelector('.status');
                progressBar.style.width = `${status.progress}%`;
                statusText.textContent = `Status: ${status.status} (${status.progress}%)`;
                
                // Stop polling if pipeline completes
                if (['success', 'failed', 'canceled'].includes(status.status)) {
                    clearInterval(interval);
                    if (status.status === 'success') {
                        statusText.innerHTML += '<br>✅ Pipeline succeeded!';
                    } else {
                        statusText.innerHTML += '<br>❌ Pipeline failed.';
                    }
                }
            } catch (error) {
                clearInterval(interval);
                console.error('Polling error:', error);
            }
        }, 5000); // Check every 5 seconds
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});