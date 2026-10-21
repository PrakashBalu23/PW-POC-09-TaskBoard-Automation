# PW-POC-09 - TaskBoard Automation

## Project Overview
Automated testing of the TaskBoard Project Management
application using Playwright, Cucumber BDD, and
Page Object Model (POM).

## Tech Stack
- JavaScript
- Playwright
- Cucumber BDD
- Page Object Model (POM)
- Node.js
- Git and GitHub

## Application Under Test
https://www.practiceqaautomation.com/apps/projects

## Test Coverage
- Create Task, Bug, and Story
- Mandatory field and summary validation
- Priority and story points
- Assignee selection
- Labels and sprint selection
- Backlog issue creation
- Task status updates
- Comments
- Sub-task creation
- Task details: Status, Assignee, Points
- Task search
- Only My Issues filter
- Assignee filters

## Project Structure
- features/ - Cucumber feature files
- step-definitions/ - Cucumber step definitions
- pages/ - Page Object Model classes
- test-data/ - Reusable test data
- reports/ - HTML report, traces, and failure screenshots

## Installation
Install dependencies:

npm install

Install Playwright browsers:

npx playwright install chromium firefox webkit

## Run Tests

Run all scenarios:

npx cucumber-js

Run Search scenarios:

npx cucumber-js --tags "@search"

Run Comments scenarios:

npx cucumber-js --tags "@comments"

Run Sub-task scenarios:

npx cucumber-js --tags "@subtask"

## Cross-Browser Execution (PowerShell)

Chromium:

$env:BROWSER="chromium"
npx cucumber-js

Firefox:

$env:BROWSER="firefox"
npx cucumber-js

WebKit:

$env:BROWSER="webkit"
npx cucumber-js

## Reports and Debugging
HTML report:
reports/cucumber-report.html

Execution traces:
reports/trace-*.zip

Failure screenshots:
reports/failure-*.png

## Latest Test Execution
- Scenarios passed: 40
- Steps passed: 149
- Failures: 0

## Notes
The test results above represent a recorded execution.
Re-run the suite to verify results after code changes.