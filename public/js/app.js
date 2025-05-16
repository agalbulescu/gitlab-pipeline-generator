let currentTheme = '';
const themeSelectors = '.sub-title, .job-artifacts, .all-games-actions, .selected-games-actions';

// Function to toggle light/dark mode
function toggleMode() {
    currentTheme = currentTheme === 'light-mode' ? '' : 'light-mode';
    const body = document.body;
    body.classList.toggle('light-mode');
    document.querySelector('header').classList.toggle('light-mode');
    document.querySelectorAll(themeSelectors).forEach(el => {
        el.classList.toggle('light-mode', currentTheme === 'light-mode');
    });
    document.querySelector('.buttons-container').classList.toggle('light-mode');
    document.querySelector('.selected-buttons-container').classList.toggle('light-mode');
    document.querySelector('table').classList.toggle('light-mode');
    document.querySelector('#pipeline-info').classList.toggle('light-mode');
}

function toggleButton(button) {
    const buttons = document.querySelectorAll('.buttons-container button');
    const regressionButton = document.querySelector('.buttons-container [data-label="regression"]');
    const sanityButton = document.querySelector('.buttons-container [data-label="sanity"]');
    const smokeButton = document.querySelector('.buttons-container [data-label="smoke"]');
    const payoutsButton = document.querySelector('.buttons-container [data-label="payouts"]');
    const uiButton = document.querySelector('.buttons-container [data-label="ui"]');
    const analyticsButton = document.querySelector('.buttons-container [data-label="analytics"]');

    const backofficeButton = document.querySelector('.buttons-container [data-label="backoffice"]');
    const ossButton = document.querySelector('.buttons-container [data-label="oss"]');
    const smappButton = document.querySelector('.buttons-container [data-label="smapp"]');
    const desktopButton = document.querySelector('.buttons-container [data-label="desktop"]');
    const desktopPayoutsButton = document.querySelector('.buttons-container [data-label="desktop_payouts"]');
    const desktopUIButton = document.querySelector('.buttons-container [data-label="desktop_ui"]');
    const desktopAnalyticsButton = document.querySelector('.buttons-container [data-label="desktop_analytics"]');

    const mobileButton = document.querySelector('.buttons-container [data-label="mobile"]');
    const mobilePayoutsButton = document.querySelector('.buttons-container [data-label="mobile_payouts"]');
    const mobileUIButton = document.querySelector('.buttons-container [data-label="mobile_ui"]');
    const mobileAnalyticsButton = document.querySelector('.buttons-container [data-label="mobile_analytics"]');

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

    if (button === backofficeButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
    }

    if (button === ossButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
    }

    if (button === smappButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
    }

    // Selecting payouts, ui, analytics clears desktop & mobile
    if (button === payoutsButton || button === uiButton || button === analyticsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        if (desktopButton.classList.contains('active')) {
            desktopButton.classList.remove('active');
            backofficeButton.classList.remove('active');
            ossButton.classList.remove('active');
            smappButton.classList.remove('active');
        }
        mobileButton.classList.remove('active');
        if (button === payoutsButton) {
            desktopPayoutsButton.classList.remove('active');
            mobilePayoutsButton.classList.remove('active');
        }
        if (button === uiButton) {
            desktopUIButton.classList.remove('active');
            mobileUIButton.classList.remove('active');
        }
        if (button === analyticsButton) {
            desktopAnalyticsButton.classList.remove('active');
            mobileAnalyticsButton.classList.remove('active');
        }
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

    if (button === desktopPayoutsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        payoutsButton.classList.remove('active');
        if (desktopButton.classList.contains('active')) {
            desktopButton.classList.remove('active');
            backofficeButton.classList.remove('active');
            ossButton.classList.remove('active');
            smappButton.classList.remove('active');
        }
    }

    if (button === desktopUIButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        uiButton.classList.remove('active');
        if (desktopButton.classList.contains('active')) {
            desktopButton.classList.remove('active');
            backofficeButton.classList.remove('active');
            ossButton.classList.remove('active');
            smappButton.classList.remove('active');
        }
    }

    if (button === desktopAnalyticsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        analyticsButton.classList.remove('active');
        if (desktopButton.classList.contains('active')) {
            desktopButton.classList.remove('active');
            backofficeButton.classList.remove('active');
            ossButton.classList.remove('active');
            smappButton.classList.remove('active');
        }
    }

    if (button === mobilePayoutsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        payoutsButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    if (button === mobileUIButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        uiButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    if (button === mobileAnalyticsButton) {
        regressionButton.classList.remove('active');
        sanityButton.classList.remove('active');
        smokeButton.classList.remove('active');
        analyticsButton.classList.remove('active');
        mobileButton.classList.remove('active');
    }

    if (button === desktopButton) {
        if (desktopButton.classList.contains('active')) {
            backofficeButton.classList.add('active');
            ossButton.classList.add('active');
            smappButton.classList.add('active');
        } else {
            backofficeButton.classList.remove('active');
            ossButton.classList.remove('active');
            smappButton.classList.remove('active');
        }
        desktopPayoutsButton.classList.remove('active');
        desktopUIButton.classList.remove('active');
        desktopAnalyticsButton.classList.remove('active');
    }

    if (button === mobileButton) {
        mobilePayoutsButton.classList.remove('active');
        mobileUIButton.classList.remove('active');
        mobileAnalyticsButton.classList.remove('active');
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

function toggleSelectedButton(button) {
    const buttons = document.querySelectorAll('.selected-buttons-container button');
    const allButtons = {
        regression: buttons[0],
        sanity: buttons[1],
        smoke: buttons[2],
        payouts: buttons[3],
        ui: buttons[4],
        analytics: buttons[5],
        desktop: buttons[6],
        desktop_payouts: buttons[7],
        desktop_ui: buttons[8],
        desktop_analytics: buttons[9],
        backoffice: buttons[10],
        oss: buttons[11],
        smapp: buttons[12],
        mobile: buttons[13],
        mobile_payouts: buttons[14],
        mobile_ui: buttons[15],
        mobile_analytics: buttons[16]
    };

    button.classList.toggle('active');

    const isActive = (btn) => btn.classList.contains('active');

    if (button === allButtons.regression && isActive(button)) {
        buttons.forEach(btn => {
            if (btn !== button && btn.textContent !== 'CLEAR') btn.classList.remove('active');
        });
    }

    if ([allButtons.sanity, allButtons.smoke].includes(button) && isActive(button)) {
        buttons.forEach(btn => {
            if (btn !== button && btn.textContent !== 'CLEAR') btn.classList.remove('active');
        });
    }

    if (button === allButtons.backoffice) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
    }

    if (button === allButtons.oss) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
    }

    if (button === allButtons.smapp) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
    }

    if ([allButtons.payouts, allButtons.ui, allButtons.analytics].includes(button)) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        if (allButtons.desktop.classList.contains('active')) {
            allButtons.desktop.classList.remove('active');
            allButtons.backoffice.classList.remove('active');
            allButtons.oss.classList.remove('active');
            allButtons.smapp.classList.remove('active');
        }
        allButtons.mobile.classList.remove('active');
        if (button === allButtons.payouts) {
            allButtons.desktop_payouts.classList.remove('active');
            allButtons.mobile_payouts.classList.remove('active');
        }
        if (button === allButtons.ui) {
            allButtons.desktop_ui.classList.remove('active');
            allButtons.mobile_ui.classList.remove('active');
        }
        if (button === allButtons.analytics) {
            allButtons.desktop_analytics.classList.remove('active');
            allButtons.mobile_analytics.classList.remove('active');
        }
    }

    if ([allButtons.desktop, allButtons.mobile].includes(button)) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.payouts.classList.remove('active');
        allButtons.ui.classList.remove('active');
        allButtons.analytics.classList.remove('active');
    }

    if (button === allButtons.desktop) {
        if (isActive(button)) {
            allButtons.backoffice.classList.add('active');
            allButtons.oss.classList.add('active');
            allButtons.smapp.classList.add('active');
        } else {
            allButtons.backoffice.classList.remove('active');
            allButtons.oss.classList.remove('active');
            allButtons.smapp.classList.remove('active');
        }
        allButtons.desktop_payouts.classList.remove('active');
        allButtons.desktop_ui.classList.remove('active');
        allButtons.desktop_analytics.classList.remove('active');
    }

    if (button === allButtons.desktop_payouts) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.payouts.classList.remove('active');
        if (allButtons.desktop.classList.contains('active')) {
            allButtons.desktop.classList.remove('active');
            allButtons.backoffice.classList.remove('active');
            allButtons.oss.classList.remove('active');
            allButtons.smapp.classList.remove('active');
        }
    }

    if (button === allButtons.desktop_ui) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.ui.classList.remove('active');
        if (allButtons.desktop.classList.contains('active')) {
            allButtons.desktop.classList.remove('active');
            allButtons.backoffice.classList.remove('active');
            allButtons.oss.classList.remove('active');
            allButtons.smapp.classList.remove('active');
        }
    }

    if (button === allButtons.desktop_analytics) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.analytics.classList.remove('active');
        if (allButtons.desktop.classList.contains('active')) {
            allButtons.desktop.classList.remove('active');
            allButtons.backoffice.classList.remove('active');
            allButtons.oss.classList.remove('active');
            allButtons.smapp.classList.remove('active');
        }
    }

    if (button === allButtons.mobile) {
        allButtons.mobile_payouts.classList.remove('active');
        allButtons.mobile_ui.classList.remove('active');
        allButtons.mobile_analytics.classList.remove('active');
    }

    if (button == allButtons.mobile_payouts) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.payouts.classList.remove('active');
        allButtons.mobile.classList.remove('active');
    }

    if (button == allButtons.mobile_ui) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.ui.classList.remove('active');
        allButtons.mobile.classList.remove('active');
    }

    if (button == allButtons.mobile_analytics) {
        allButtons.regression.classList.remove('active');
        allButtons.sanity.classList.remove('active');
        allButtons.smoke.classList.remove('active');
        allButtons.analytics.classList.remove('active');
        allButtons.mobile.classList.remove('active');
    }

    if (button.textContent === 'CLEAR') {
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    updateSelectedTableRows(buttons);
    updateOutput();
}

function updateSelectedTableRows(buttons) {
    const rows = document.querySelectorAll('#table-body tr');

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        if (!runSwitch.checked) return;

        const regressionSwitch = row.querySelector('.regression-switch');
        const sanitySwitch = row.querySelector('.sanity-switch');
        const smokeSwitch = row.querySelector('.smoke-switch');
        const payoutsSwitch = row.querySelector('.payouts-switch');
        const uiSwitch = row.querySelector('.ui-switch');
        const analyticsSwitch = row.querySelector('.analytics-switch');
        const backofficeSwitch = row.querySelector('.backoffice-switch');
        const ossSwitch = row.querySelector('.oss-switch');
        const smappSwitch = row.querySelector('.smapp-switch');
        const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
        const desktopUISwitch = row.querySelector('.desktop-ui-switch');
        const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
        const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
        const mobileUISwitch = row.querySelector('.mobile-ui-switch');
        const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

        const activeLabels = Array.from(buttons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.textContent.trim());

        // Reset row
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        backofficeSwitch.checked = false;
        ossSwitch.checked = false;
        smappSwitch.checked = false;
        desktopPayoutsSwitch.checked = false;
        desktopUISwitch.checked = false;
        desktopAnalyticsSwitch.checked = false;
        mobilePayoutsSwitch.checked = false;
        mobileUISwitch.checked = false;
        mobileAnalyticsSwitch.checked = false;

        if (activeLabels.length === 0) {
            runSwitch.checked = false;
            toggleRowSwitches(runSwitch);
            return;
        }

        if (activeLabels.includes('REGRESSION')) {
            regressionSwitch.checked = true;
            toggleRegressionSwitch(regressionSwitch);
        }
        if (activeLabels.includes('SANITY')) {
            sanitySwitch.checked = true;
            toggleSanitySwitch(sanitySwitch);
        }
        if (activeLabels.includes('SMOKE')) {
            smokeSwitch.checked = true;
            toggleSmokeSwitch(smokeSwitch);
        }
        if (activeLabels.includes('PAYOUTS')) {
            payoutsSwitch.checked = true;
            togglePayoutsSwitch(payoutsSwitch);
        }
        if (activeLabels.includes('UI')) {
            uiSwitch.checked = true;
            toggleUISwitch(uiSwitch);
        }
        if (activeLabels.includes('ANALYTICS')) {
            analyticsSwitch.checked = true;
            toggleAnalyticsSwitch(analyticsSwitch);
        }
        if (activeLabels.includes('BACKOFFICE')) {
            backofficeSwitch.checked = true;
            toggleBackofficeSwitch(backofficeSwitch);
        }
        if (activeLabels.includes('OSS')) {
            ossSwitch.checked = true;
            toggleOssSwitch(ossSwitch);
        }
        if (activeLabels.includes('SMAPP')) {
            smappSwitch.checked = true;
            toggleSMAppSwitch(smappSwitch);
        }
        if (activeLabels.includes('DESKTOP')) {
            desktopPayoutsSwitch.checked = true;
            desktopUISwitch.checked = true;
            desktopAnalyticsSwitch.checked = true;
            backofficeSwitch.checked = true;
            ossSwitch.checked = true;
            smappSwitch.checked = true;
            toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
            toggleDesktopUISwitch(desktopUISwitch);
            toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
            toggleBackofficeSwitch(backofficeSwitch);
            toggleOssSwitch(ossSwitch);
            toggleSMAppSwitch(smappSwitch);
        }
        if (activeLabels.includes('DESKTOP PAYOUTS')) {
            desktopPayoutsSwitch.checked = true;
            toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
        }
        if (activeLabels.includes('DESKTOP UI')) {
            desktopUISwitch.checked = true;
            toggleDesktopUISwitch(desktopUISwitch);
        }
        if (activeLabels.includes('DESKTOP ANALYTICS')) {
            desktopAnalyticsSwitch.checked = true;
            toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
        }
        if (activeLabels.includes('MOBILE')) {
            mobilePayoutsSwitch.checked = true;
            mobileUISwitch.checked = true;
            mobileAnalyticsSwitch.checked = true;
            toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
            toggleMobileUISwitch(mobileUISwitch);
            toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch);
        }
        if (activeLabels.includes('MOBILE PAYOUTS')) {
            mobilePayoutsSwitch.checked = true;
            toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
        }
        if (activeLabels.includes('MOBILE UI')) {
            mobileUISwitch.checked = true;
            toggleMobileUISwitch(mobileUISwitch);
        }
        if (activeLabels.includes('MOBILE ANALYTICS')) {
            mobileAnalyticsSwitch.checked = true;
            toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch);
        }
    });
}

function clearSelectedButtons() {
    const buttons = document.querySelectorAll('.selected-buttons-container button');
    buttons.forEach(button => button.classList.remove('active'));
    updateSelectedTableRows(buttons);
}

function updateSelectedActionsState() {
    const selectedButtons = document.querySelectorAll('.selected-action-btn');
    const rows = document.querySelectorAll('#table-body tr');
    const totalRows = rows.length;
    const selectedRows = Array.from(rows).filter(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]');
        return runSwitch && runSwitch.checked;
    });

    const shouldDisable = selectedRows.length === 0 || selectedRows.length === totalRows;

    selectedButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.disabled = shouldDisable;
        btn.classList.toggle('disabled', shouldDisable);
    });
}

function updateTableBasedOnButtons() {
    const rows = document.querySelectorAll('#table-body tr');
    const regressionButton = document.querySelector('.buttons-container [data-label="regression"]');
    const sanityButton = document.querySelector('.buttons-container [data-label="sanity"]');
    const smokeButton = document.querySelector('.buttons-container [data-label="smoke"]');
    const payoutsButton = document.querySelector('.buttons-container [data-label="payouts"]');
    const uiButton = document.querySelector('.buttons-container [data-label="ui"]');
    const analyticsButton = document.querySelector('.buttons-container [data-label="analytics"]');

    const backofficeButton = document.querySelector('.buttons-container [data-label="backoffice"]');
    const ossButton = document.querySelector('.buttons-container [data-label="oss"]');
    const smappButton = document.querySelector('.buttons-container [data-label="smapp"]');
    const desktopButton = document.querySelector('.buttons-container [data-label="desktop"]');
    const desktopPayoutsButton = document.querySelector('.buttons-container [data-label="desktop_payouts"]');
    const desktopUIButton = document.querySelector('.buttons-container [data-label="desktop_ui"]');
    const desktopAnalyticsButton = document.querySelector('.buttons-container [data-label="desktop_analytics"]');

    const mobileButton = document.querySelector('.buttons-container [data-label="mobile"]');
    const mobilePayoutsButton = document.querySelector('.buttons-container [data-label="mobile_payouts"]');
    const mobileUIButton = document.querySelector('.buttons-container [data-label="mobile_ui"]');
    const mobileAnalyticsButton = document.querySelector('.buttons-container [data-label="mobile_analytics"]');

    rows.forEach(row => {
        const runSwitch = row.querySelector('input[type="checkbox"]:first-child');
        const regressionSwitch = row.querySelector('.regression-switch');
        const sanitySwitch = row.querySelector('.sanity-switch');
        const smokeSwitch = row.querySelector('.smoke-switch');
        const payoutsSwitch = row.querySelector('.payouts-switch');
        const uiSwitch = row.querySelector('.ui-switch');
        const analyticsSwitch = row.querySelector('.analytics-switch');
        const backofficeSwitch = row.querySelector('.backoffice-switch');
        const ossSwitch = row.querySelector('.oss-switch');
        const smappSwitch = row.querySelector('.smapp-switch');
        const desktopPayoutsSwitch = row.querySelector('.desktop-payouts-switch');
        const desktopUISwitch = row.querySelector('.desktop-ui-switch');
        const desktopAnalyticsSwitch = row.querySelector('.desktop-analytics-switch');
        const mobilePayoutsSwitch = row.querySelector('.mobile-payouts-switch');
        const mobileUISwitch = row.querySelector('.mobile-ui-switch');
        const mobileAnalyticsSwitch = row.querySelector('.mobile-analytics-switch');

        runSwitch.checked = false;
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
        payoutsSwitch.checked = false;
        uiSwitch.checked = false;
        analyticsSwitch.checked = false;
        backofficeSwitch.checked = false;
        ossSwitch.checked = false;
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
            backofficeButton.classList.contains('active') ||
            ossButton.classList.contains('active') ||
            smappButton.classList.contains('active') ||
            desktopButton.classList.contains('active') ||
            desktopPayoutsButton.classList.contains('active') ||
            desktopUIButton.classList.contains('active') ||
            desktopAnalyticsButton.classList.contains('active') ||
            mobileButton.classList.contains('active') ||
            mobilePayoutsButton.classList.contains('active') ||
            mobileUIButton.classList.contains('active') ||
            mobileAnalyticsButton.classList.contains('active')) {
            runSwitch.checked = true;
            runSwitch.disabled = false;
            row.classList.add('selected-row');
            const switches = row.querySelectorAll('input[type="checkbox"]');
            switches.forEach(switchInput => {
                if (switchInput !== runSwitch) {
                    switchInput.disabled = false;
                }
            });

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

            if (backofficeButton.classList.contains('active')) {
                backofficeSwitch.checked = true;
                toggleBackofficeSwitch(backofficeSwitch);
            }
            
            if (ossButton.classList.contains('active')) {
                ossSwitch.checked = true;
                toggleOssSwitch(ossSwitch);
            }

            if (smappButton.classList.contains('active')) {
                smappSwitch.checked = true;
                toggleSMAppSwitch(smappSwitch);
            }

            if (desktopButton.classList.contains('active')) {
                desktopPayoutsSwitch.checked = true;
                desktopUISwitch.checked = true;
                desktopAnalyticsSwitch.checked = true;
                backofficeSwitch.checked = true;
                ossSwitch.checked = true;
                smappSwitch.checked = true;
                toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
                toggleDesktopUISwitch(desktopUISwitch);
                toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
                toggleBackofficeSwitch(backofficeSwitch);
                toggleOssSwitch(ossSwitch);
                toggleSMAppSwitch(smappSwitch);
            }

            if (desktopPayoutsButton.classList.contains('active')) {
                desktopPayoutsSwitch.checked = true;
                toggleDesktopPayoutsSwitch(desktopPayoutsSwitch);
            }
            if (desktopUIButton.classList.contains('active')) {
                desktopUISwitch.checked = true;
                toggleDesktopUISwitch(desktopUISwitch);
            }
            if (desktopAnalyticsButton.classList.contains('active')) {
                desktopAnalyticsSwitch.checked = true;
                toggleDesktopAnalyticsSwitch(desktopAnalyticsSwitch);
            }

            if (mobileButton.classList.contains('active')) {
                mobilePayoutsSwitch.checked = true;
                mobileUISwitch.checked = true;
                mobileAnalyticsSwitch.checked = true;
                toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
                toggleMobileUISwitch(mobileUISwitch);
                toggleMobileAnalyticsSwitch(mobileAnalyticsSwitch);
            }

            if (mobilePayoutsButton.classList.contains('active')) {
                mobilePayoutsSwitch.checked = true;
                toggleMobilePayoutsSwitch(mobilePayoutsSwitch);
            }
            if (mobileUIButton.classList.contains('active')) {
                mobileUISwitch.checked = true;
                toggleMobileUISwitch(mobileUISwitch);
            }
            if (mobileAnalyticsButton.classList.contains('active')) {
                mobileAnalyticsSwitch.checked = true;
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
    updateSelectedActionsState();
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
    updateSelectedActionsState();
    updateOutput();
}

function toggleRegressionSwitch(regressionSwitch) {
    const row = regressionSwitch.closest('tr');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    const payoutsSwitch = row.querySelector('.payouts-switch');
    const uiSwitch = row.querySelector('.ui-switch');
    const analyticsSwitch = row.querySelector('.analytics-switch');
    const backofficeSwitch = row.querySelector('.backoffice-switch');
    const ossSwitch = row.querySelector('.oss-switch');
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
        backofficeSwitch.checked = false;
        ossSwitch.checked = false;
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
    const backofficeSwitch = row.querySelector('.backoffice-switch');
    const ossSwitch = row.querySelector('.oss-switch');
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
        backofficeSwitch.checked = false;
        ossSwitch.checked = false;
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
    const backofficeSwitch = row.querySelector('.backoffice-switch');
    const ossSwitch = row.querySelector('.oss-switch');
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
        backofficeSwitch.checked = false;
        ossSwitch.checked = false;
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

function toggleBackofficeSwitch(backofficeSwitch) {
    const row = backofficeSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    if (backofficeSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
    }
    updateOutput();
}

function toggleOssSwitch(ossSwitch) {
    const row = ossSwitch.closest('tr');
    const regressionSwitch = row.querySelector('.regression-switch');
    const sanitySwitch = row.querySelector('.sanity-switch');
    const smokeSwitch = row.querySelector('.smoke-switch');
    if (ossSwitch.checked) {
        regressionSwitch.checked = false;
        sanitySwitch.checked = false;
        smokeSwitch.checked = false;
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

            // Check for regression
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

                const hasAllDesktop = selectedColumns.includes('backoffice') &&
                                        selectedColumns.includes('oss') &&
                                        selectedColumns.includes('smapp') &&
                                        selectedColumns.includes('desktop_payouts') &&
                                        selectedColumns.includes('desktop_ui') &&
                                        selectedColumns.includes('desktop_analytics');

                const hasAllMobile = selectedColumns.includes('mobile_payouts') &&
                                    selectedColumns.includes('mobile_ui') &&
                                    selectedColumns.includes('mobile_analytics');

                const hasAllColumns = hasAllDesktop && hasAllMobile;

                const hasPayoutsUiAnalyticsBackofficeOssSmapp = selectedColumns.includes('payouts') &&
                                                    selectedColumns.includes('ui') &&
                                                    selectedColumns.includes('analytics') &&
                                                    selectedColumns.includes('backoffice') && 
                                                    selectedColumns.includes('oss') &&
                                                    selectedColumns.includes('smapp');
                                                    
                if (hasAllColumns) {
                    selectedColumns.length = 0;
                    selectedColumns.push('regression');
                } else if (hasPayoutsUiAnalyticsBackofficeOssSmapp) {
                    selectedColumns.length = 0;
                    selectedColumns.push('regression');
                } else {
                    if (hasAllDesktop) {
                        selectedColumns.splice(selectedColumns.indexOf('backoffice'), 1);
                        selectedColumns.splice(selectedColumns.indexOf('oss'), 1);
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
    canvas.style.marginTop = '15px';

    wrapper.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Passed', 'Failed', 'Skipped', 'Error'],
            datasets: [{
                label: `Test Results - ${jobName}`,
                data: [summary.passed, summary.failed, summary.skipped, summary.error],
                backgroundColor: ['#4CAF50', '#f44336', '#FF9800', '#FFC107']
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
            labels: ['Passed', 'Failed', 'Skipped', 'Error'],
            datasets: [{
                label: 'Pipeline Summary',
                data: [summary.passed, summary.failed, summary.skipped, summary.error],
                backgroundColor: ['#4CAF50', '#f44336', '#FF9800', '#FFC107']
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
                        <input type="checkbox" class="backoffice-switch" disabled onchange="toggleBackofficeSwitch(this)" data-column="backoffice">
                        <span class="slider round"></span>
                    </label>
                </td>
                <td>
                    <label class="switch">
                        <input type="checkbox" class="oss-switch" disabled onchange="toggleOssSwitch(this)" data-column="oss">
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

    showPipelineStatus('No pipeline generated or triggered yet', 'info', '', 'default-message');

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

            loadUserList();
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
                credentials: 'include'
            });
    
            if (response.status === 401) {
                return false;
            }
    
            if (!response.ok) {
                const errorText = await response.text();
                console.warn('Unexpected error on session check:', errorText);
                return false;
            }
    
            const { valid, user } = await response.json();
            return valid ? user : false;
        } catch (error) {
            console.warn('Session check failed:', error);
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
                credentials: 'include'
            });
    
            if (!response.ok) throw new Error('Login failed');
    
            const { user } = await response.json();
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
            document.getElementById('app-content').style.display = 'block';
            document.getElementById('footer').style.display = 'block';
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
        document.getElementById('pipeline-trigger-controls').style.display = 'none';
        document.getElementById('app-content').style.display = 'none';
        document.getElementById('footer').style.display = 'none';
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

    async function fetchBranches() {
        const branchSelector = document.getElementById('branch-selector');
        
        try {
            // Show loading state
            branchSelector.innerHTML = '<option value="">Loading branches (this may take a while)...</option>';
            branchSelector.disabled = true;

            const response = await fetch('/api/branches', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            let branches = await response.json();

            // Ensure branches is an array and has "main"
            if (!Array.isArray(branches)) branches = [];
            if (!branches.includes('main')) branches.unshift('main');
            
            // Initialize SlimSelect
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
            document.getElementById('default-message')?.remove();
            showPipelineStatus('Generating pipeline...', 'info', '', 'generating-message');

            const response = await fetch('/api/generate-pipeline', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedGames: outputText.split(','), environment: selectedEnv })
            });

            if (!response.ok) throw new Error('Failed to generate pipeline');
            const data = await response.json();
            generatedPipeline = data.pipelineYml;

            showPipelineStatus('Pipeline generated successfully!', 'success', generatedPipeline, 'generated-pipeline-msg');
            document.getElementById('generating-message')?.remove();

            const triggerSection = document.getElementById('pipeline-trigger-controls');
            if (triggerSection.style.display !== 'block') {
                triggerSection.style.display = 'block';
                await fetchBranches();
            }
        } catch (error) {
            console.error('Pipeline generation error:', error);
            showPipelineStatus(`Failed to generate pipeline: ${error.message}`, 'error');
        }
    }

    document.getElementById('trigger-btn').addEventListener('click', async () => {
        const selectedBranch = slimBranchSelector.getSelected()[0];

        if (!generatedPipeline) {
            showError('No pipeline generated to trigger');
            return;
        }

        try {
            document.getElementById('generated-pipeline-msg')?.remove();
            showPipelineStatus('Triggering pipeline...', 'info', '', 'triggering-message');

            const pipelineData = await triggerPipeline(selectedBranch);

            document.getElementById('triggering-message')?.remove();
            showPipelineStatus(
                `Pipeline triggered successfully! Pipeline ID is: ${pipelineData.id}`,
                'success',
                '',
                'triggered-message'
            );

            pollPipelineStatus(pipelineData.id);
        } catch (error) {
            showError('Failed to trigger pipeline: ' + error.message);
        }
    });

    function showPipelineStatus(message, type = 'info', details = '', id = 'main-status', replace = true) {
        const pipelineStatus = document.getElementById('pipeline-status');
        if (!pipelineStatus) return;

        if (replace) {
            document.getElementById(id)?.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `status-message ${type}`;
        messageDiv.id = id;

        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageDiv.appendChild(messageElement);

        if (details) {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Show Full YAML';
            toggleButton.className = 'copy-button';
            toggleButton.style.marginTop = '10px';

            const preBlock = document.createElement('pre');
            preBlock.className = 'pipeline-yml-block';
            preBlock.textContent = details;
            preBlock.style.display = 'none';
            preBlock.style.maxHeight = '600px';
            preBlock.style.overflowY = 'auto';
            preBlock.style.backgroundColor = '#1e1e1e';
            preBlock.style.color = '#ccc';
            preBlock.style.padding = '10px';
            preBlock.style.border = '1px solid #444';
            preBlock.style.marginTop = '10px';

            toggleButton.onclick = () => {
                const isVisible = preBlock.style.display === 'block';
                preBlock.style.display = isVisible ? 'none' : 'block';
                toggleButton.textContent = isVisible ? 'Show Full YAML' : 'Hide Full YAML';
            };

            messageDiv.appendChild(toggleButton);
            messageDiv.appendChild(preBlock);
        }

        const container = document.getElementById('pipeline-status-container');

        if (replace) {
            document.getElementById(id)?.remove();
        }

        if (container) {
            container.after(messageDiv);
        } else {
            pipelineStatus.appendChild(messageDiv);
        }
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

                    for (const job of status.jobs) {
                        if (job.name?.startsWith('test_')) {
                            await fetch(`/api/pipeline-artifacts/${job.id}`);
                        }
                    }

                    setTimeout(() => {
                        showPipelineStatus('✅ Pipeline completed. Click below to load test results.', 'info', '', 'results-message');

                        const pipelineStatusDiv = document.getElementById('pipeline-status');
                        let loadBtn = document.getElementById('load-results-btn')

                        if (!loadBtn) {
                            loadBtn = document.createElement('button');
                            loadBtn.id = 'load-results-btn';
                            loadBtn.className = 'copy-button';
                            loadBtn.textContent = 'Load Test Results';
                            pipelineStatusDiv.appendChild(loadBtn);
                        }

                        const loadResults = async () => {
                            loadBtn.disabled = true;
                            loadBtn.textContent = 'Loading...';

                            try {
                                loadPipelineResultsById(pipelineId, 'pipeline-info').then(success => {
                                    if (success) {
                                        showPipelineStatus('✅ Results loaded successfully.', 'success', '', 'results-loaded-message', true);
                                        document.getElementById('results-message')?.remove();
                                        loadBtn.textContent = 'Reload Test Results';

                                        document.getElementById('test-artifacts')?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    } else {
                                        showPipelineStatus('❌ No data found for this pipeline.', 'error', '', 'results-loaded-message', true);
                                        document.getElementById('results-message')?.remove();
                                        loadBtn.textContent = 'Retry Loading';
                                    }
                                });
                            } catch (err) {
                                console.error('❌ Error loading results:', err);
                                showPipelineStatus('❌ Failed to load test results.', 'error', '', 'results-loaded-message', true);
                                document.getElementById('results-message')?.remove();
                                loadBtn.textContent = 'Retry Loading';
                            } finally {
                                loadBtn.disabled = false;
                            }
                        };
                        loadBtn.onclick = loadResults;
                    }, 3000);
                }
            } catch (error) {
                clearInterval(interval);
                console.error('Polling error:', error);
                showPipelineStatus('❌ Pipeline updates stopped due to error.', 'error');
            }
        }, 10000);
    }   
       
    function summarizeResults(results) {
        const summary = { total: 0, passed: 0, failed: 0, skipped: 0, error: 0 };
        results.forEach(r => {
            summary.total++;
            summary[r.status]++;
        });
        return summary;
    }    

    function renderFailures(container, results) {
        const failedTests = results.filter(t => (t.status === 'failed' || t.status === 'error') && t.message);
        if (!failedTests.length) return;

        const failedSection = document.createElement('div');
        failedSection.className = 'failed-tests-section';
        failedSection.style.marginTop = '20px';

        const header = document.createElement('strong');
        header.textContent = '⚠️ Failed or Error tests:';
        header.style.display = 'block';
        header.style.marginBottom = '6px';
        failedSection.appendChild(header);

        const rerunArgs = [];

        failedTests.forEach((test, idx) => {
            const testName = (test.name || test.classname || 'Unnamed Test').slice(0, 80);

            const testRow = document.createElement('div');
            testRow.style.display = 'flex';
            testRow.style.alignItems = 'center';
            testRow.style.gap = '10px';
            testRow.style.marginTop = '5px';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `- ${testName}`;
            nameSpan.style.flex = '1';

            const button = document.createElement('button');
            button.textContent = `Show logs`;
            button.className = 'logs-button';

            const pre = document.createElement('pre');
            pre.className = 'log-output';
            pre.textContent = test.message.trim();
            pre.style.display = 'none';
            pre.style.maxHeight = '500px';
            pre.style.overflowY = 'auto';
            pre.style.background = '#1e1e1e';
            pre.style.color = '#ccc';
            pre.style.padding = '10px';
            pre.style.border = '1px solid #444';
            pre.style.marginTop = '5px';

            button.addEventListener('click', () => {
                const isVisible = pre.style.display === 'block';
                pre.style.display = isVisible ? 'none' : 'block';
                button.textContent = `${isVisible ? 'Show' : 'Hide'} logs`;
            });

            testRow.appendChild(nameSpan);
            testRow.appendChild(button);
            failedSection.appendChild(testRow);
            failedSection.appendChild(pre);

            // Prepare rerun command
            if (test.classname && test.name) {
                const path = './' + test.classname.replace(/\./g, '/') + '.py';
                const testcase = `${path}::${test.name}`;
                rerunArgs.push(`"${testcase}"`);
            }
        });

        // Generate full command
        if (rerunArgs.length > 0) {
            const env = failedTests[0].environment || 'stage'; // fallback to 'stage' if missing
            const fullCommand = `pytest -v ${rerunArgs.join(' ')} --environment=${env}`;

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy re-run command for failed tests';
            copyBtn.className = 'copy-button';
            copyBtn.style.marginTop = '15px';

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(fullCommand)
                    .then(() => {
                        copyBtn.textContent = '✅ Copied!';
                        setTimeout(() => copyBtn.textContent = '📋 Copy re-run command for failed tests', 2000);
                    })
                    .catch(err => {
                        console.error('Clipboard copy failed:', err);
                        alert('Failed to copy to clipboard');
                    });
            });

            failedSection.appendChild(copyBtn);
        }

        container.appendChild(failedSection);
    }
    
    document.getElementById('search-btn').addEventListener('click', async () => {
        const searchId = document.getElementById('search-id').value.trim();
        const searchFormDiv = document.getElementById('search-form');
        document.getElementById('test-artifacts')?.remove();
        const errorMessageDiv = document.getElementById('search-error-message');
            if (errorMessageDiv) {
                errorMessageDiv.remove();
            }
    
        if (!searchId) {
            const errorMessage = document.createElement('p');
            errorMessage.id = 'search-error-message';
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Please enter a valid ID';
            searchFormDiv.appendChild(errorMessage);
            return;
        }
        try {
            loadPipelineResultsById(searchId, 'pipeline-search-section').then(success => {
                if (success) {
                    document.getElementById('test-artifacts')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    const errorMessage = document.createElement('p');
                    errorMessage.id = 'search-error-message';
                    errorMessage.style.color = 'red';
                    errorMessage.textContent = `No data found for ID: ${searchId}`;
                    searchFormDiv.appendChild(errorMessage);
                    return;
                }
            });
        } catch (err) {
            console.error('Search error:', err);
            const errorMessage = document.createElement('p');
            errorMessage.id = 'search-error-message';
            errorMessage.style.color = 'red';
            errorMessage.textContent = `No data found for ID: ${id}`;
            searchFormDiv.appendChild(errorMessage);
            return;
        }
    });

    const pathMatch = window.location.pathname.match(/^\/results\/(\d+)/);
    if (pathMatch) {
        const pipelineOrJobId = pathMatch[1];
        const searchFormDiv = document.getElementById('search-form');
        document.getElementById('test-artifacts')?.remove();
        const errorMessageDiv = document.getElementById('search-error-message');
            if (errorMessageDiv) {
                errorMessageDiv.remove();
            }
    
        if (!pipelineOrJobId) {
            const errorMessage = document.createElement('p');
            errorMessage.id = 'search-error-message';
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Please enter a valid ID';
            searchFormDiv.appendChild(errorMessage);
            return;
        }
        try {
            loadPipelineResultsById(pipelineOrJobId, 'pipeline-search-section').then(success => {
                if (success) {
                    document.getElementById('test-artifacts')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    const errorMessage = document.createElement('p');
                    errorMessage.id = 'search-error-message';
                    errorMessage.style.color = 'red';
                    errorMessage.textContent = `No data found for ID: ${pipelineOrJobId}`;
                    searchFormDiv.appendChild(errorMessage);
                    return;
                }
            });
        } catch (err) {
            console.error('Search error:', err);
            const errorMessage = document.createElement('p');
            errorMessage.id = 'search-error-message';
            errorMessage.style.color = 'red';
            errorMessage.textContent = `No data found for ID: ${id}`;
            searchFormDiv.appendChild(errorMessage);
            return;
        }
    }

    async function loadPipelineResultsById(id, containerId) {
        try {
            const response = await fetch(`/api/pipeline-summary/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error fetching pipeline summary:', errorText);
                return false;
            }

            const { pipeline, jobs, summary } = await response.json();

            const artifactsSection = document.getElementById(containerId);
            document.getElementById('test-artifacts')?.remove();

            const wrapper = document.createElement('div');
            wrapper.id = 'test-artifacts';
            artifactsSection.appendChild(wrapper);

            // PIPELINE SUMMARY
            const summaryBox = document.createElement('div');
            summaryBox.id = 'pipeline-summary';
            summaryBox.innerHTML = `
                <h2>Pipeline #${pipeline.pipeline_id} (${pipeline.status})</h2>
                <p>Branch: <strong>${pipeline.ref || 'N/A'}</strong>, Created: ${pipeline.created_at ? new Date(pipeline.created_at).toLocaleString() : 'N/A'}</p>
                <p>Total Tests: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}, Errors: ${summary.error}</p>
                <div id="search-summary-chart" style="max-width: 500px; margin: 20px 0;"></div>
            `;
            wrapper.appendChild(summaryBox);

            setTimeout(() => {
                renderSearchSummaryChart('search-summary-chart', summary);
            }, 100);

            // JOBS HEADER
            const testJobsBox = document.createElement('div');
            testJobsBox.className = 'test-jobs-summary';
            testJobsBox.innerHTML = `<h2>Test Jobs</h2>`;
            wrapper.appendChild(testJobsBox);

            for (const job of jobs) {
                if (!job.name || !job.name.startsWith('test_')) continue;

                const resultsRes = await fetch(`/api/job-results/${job.id}`);
                if (!resultsRes.ok) continue;

                const { initial_results, rerun_results } = await resultsRes.json();

                const box = document.createElement('div');
                box.classList.add('job-artifacts');

                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'job-details';
                contentWrapper.style.display = 'none';

                const baseName = job.name.replace(/^test_/, '');
                const displayGame = baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/_/g, ' ');

                let formattedSuites = '';
                if (job.suites) {
                    const suiteList = job.suites.split(',').map(s =>
                        s.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                    );
                    formattedSuites = ` (${suiteList.join(', ')})`;
                }

                // COLLAPSIBLE HEADER
                const hasFailures = [...(initial_results || []), ...(rerun_results || [])].some(t => t.status === 'failed');
                const header = document.createElement('div');
                header.className = 'job-header';
                header.style.cursor = 'pointer';
                header.style.display = 'flex';
                header.style.alignItems = 'center';
                header.style.gap = '10px';

                const arrow = document.createElement('span');
                arrow.textContent = '▶';
                arrow.style.transition = 'transform 0.2s';
                header.appendChild(arrow);

                const title = document.createElement('h3');
                title.style.margin = 0;
                title.textContent = `Job: ${displayGame}${formattedSuites}`;
                header.appendChild(title);

                if (hasFailures) {
                    const warning = document.createElement('span');
                    warning.textContent = '⚠️';
                    header.appendChild(warning);
                }

                header.onclick = () => {
                    const isVisible = contentWrapper.style.display === 'block';
                    contentWrapper.style.display = isVisible ? 'none' : 'block';
                    arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
                };

                box.appendChild(header);
                box.appendChild(contentWrapper);
                wrapper.appendChild(box);

                // INITIAL RESULTS
                if (initial_results?.length) {
                    const summary = summarizeResults(initial_results);
                    const summaryBox = document.createElement('div');
                    summaryBox.className = 'artifact-summary';
                    summaryBox.innerHTML = `
                        <h4>Initial Run</h4>
                        <div>Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}, Errors: ${summary.error}</div>
                    `;

                    const chartContainer = document.createElement('div');
                    chartContainer.id = `chart-initial-${job.id}`;
                    chartContainer.style.maxWidth = '500px';

                    contentWrapper.appendChild(summaryBox);
                    contentWrapper.appendChild(chartContainer);

                    await new Promise(resolve => setTimeout(() => {
                        renderTestSummaryChart(`chart-initial-${job.id}`, summary, `${job.name} Initial`);
                        renderFailures(contentWrapper, initial_results);
                        resolve();
                    }, 100));
                }

                // RE-RUN RESULTS
                if (rerun_results?.length) {
                    const summary = summarizeResults(rerun_results);
                    const summaryBox = document.createElement('div');
                    summaryBox.className = 'artifact-summary';
                    summaryBox.innerHTML = `
                        <h4>Re-run</h4>
                        <div>Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Skipped: ${summary.skipped}, Errors: ${summary.error}</div>
                    `;

                    const chartContainer = document.createElement('div');
                    chartContainer.id = `chart-rerun-${job.id}`;
                    chartContainer.style.maxWidth = '500px';

                    contentWrapper.appendChild(summaryBox);
                    contentWrapper.appendChild(chartContainer);

                    await new Promise(resolve => setTimeout(() => {
                        renderTestSummaryChart(`chart-rerun-${job.id}`, summary, `${job.name} Re-run`);
                        renderFailures(contentWrapper, rerun_results);
                        resolve();
                    }, 100));
                }
            }

            return true;
        } catch (err) {
            console.error('Failed to load results:', err);
            return false;
        }
    }
});