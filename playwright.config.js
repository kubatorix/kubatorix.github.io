// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30_000,
    fullyParallel: true,
    reporter: [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:8080',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'mobile',
            use: { ...devices['iPhone 13'] },
        },
        {
            name: 'figma',
            use: { ...devices['iPhone 13'], viewport: { width: 381, height: 844 } },
        },
        {
            name: 'tablet',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } },
        },
        {
            name: 'desktop',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
        },
    ],
    webServer: {
        command: 'npx http-server -p 8080 -c-1 --silent',
        url: 'http://127.0.0.1:8080',
        reuseExistingServer: true,
        timeout: 30_000,
    },
});
