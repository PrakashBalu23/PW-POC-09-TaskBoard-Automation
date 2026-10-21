
const reporter = require('multiple-cucumber-html-reporter');

reporter.generate({
  jsonDir: './reports',
  reportPath: './reports/html-report',
  reportName: 'TaskBoard POC-09 Test Report',
  pageTitle: 'TaskBoard Automation Results',
  displayDuration: true,
  metadata: {
    browser: {
      name: 'chromium'
    },
    platform: {
      name: 'Windows'
    }
  }
});
