
module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['step-definitions/**/*.js'],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  }
};
