const {
  Given,
  When,
  Then,
  After,
  setDefaultTimeout
} = require('@cucumber/cucumber');

const { chromium, firefox, webkit } = require('playwright');
const { expect } = require('@playwright/test');
const { TaskBoardPage } = require('../pages/TaskBoardPage');
const { validTask } = require('../test-data/taskData');
const fs = require('fs');

setDefaultTimeout(30000);

let browser;
let context;
let page;
let taskBoardPage;

function getBrowserType() {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();

  const browsers = {
    chromium,
    firefox,
    webkit
  };

  const selectedBrowser = browsers[browserName];

  if (!selectedBrowser) {
    throw new Error(
      `Unsupported browser: ${browserName}. Use chromium, firefox, or webkit.`
    );
  }

  return selectedBrowser;
}

async function initializeTaskBoard() {
  if (!browser || !context || !page || !taskBoardPage) {
    const selectedBrowser = getBrowserType();

    browser = await selectedBrowser.launch({
  headless: process.env.CI === 'true' ? true : false
});

    context = await browser.newContext();

    await context.tracing.start({
      screenshots: true,
      snapshots: true,
      sources: true
    });

    page = await context.newPage();
    taskBoardPage = new TaskBoardPage(page);
  }

  await taskBoardPage.openBoard();
}

// Existing setup step.
Given('I open the TaskBoard board', async function () {
  await initializeTaskBoard();
});

// Alias for the other wording used in the feature file.
Given('I open the TaskBoard application', async function () {
  await initializeTaskBoard();
});

// Create a task with valid details.
When('I create a task with valid details', async function () {
  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(validTask);
});

When('I create a bug with valid details', async function () {
  const bug = {
    ...validTask,
    summary: 'POC09 - Login Bug',
    type: 'Bug'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(bug);
});

When('I create a story with valid details', async function () {
  const story = {
    ...validTask,
    summary: 'POC09 - User Story',
    type: 'Story'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(story);
});

When('I create a low priority task', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Low Priority',
    priority: 'Low'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create an issue in the backlog', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Backlog Issue',
    sprint: 'Backlog'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

// Verify created tasks.
Then('the new task should appear on the board', async function () {
  await taskBoardPage.verifyTaskVisible(validTask.summary);
});

Then('the new issue should appear on the board', async function () {
  const issueSummary = await taskBoardPage.getLastCreatedSummary();
  await taskBoardPage.verifyTaskVisible(issueSummary);
});

Then('the backlog issue should appear in the backlog', async function () {
  const issueSummary = await taskBoardPage.getLastCreatedSummary();
  await taskBoardPage.verifyBacklogIssueVisible(issueSummary);
});

// Mandatory validation.
When(
  'I submit the create issue form without required fields',
  async function () {
    await taskBoardPage.openCreateIssueForm();
    await taskBoardPage.submitEmptyIssueForm();
  }
);

Then(
  'I should see the mandatory field validation messages',
  async function () {
    await taskBoardPage.verifyMandatoryMessages();
  }
);

When('I submit an issue with a short summary', async function () {
  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.summaryInput.fill('Bug');
  await taskBoardPage.submitEmptyIssueForm();
});

Then(
  'I should see the summary length validation message',
  async function () {
    await taskBoardPage.verifySummaryLengthValidation();
  }
);

When('I submit an issue without selecting a type', async function () {
  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.summaryInput.fill('POC09 - Missing Type');
  await taskBoardPage.priorityDropdown.selectOption({ label: 'High' });
  await taskBoardPage.assigneeDropdown.selectOption({ label: 'Amir Khan' });
  await taskBoardPage.storyPointsDropdown.selectOption({ label: '3' });
  await taskBoardPage.submitEmptyIssueForm();
});

Then(
  'I should see the type validation message',
  async function () {
    await taskBoardPage.verifyTypeValidation();
  }
);

When(
  'I submit an issue without selecting a priority',
  async function () {
    await taskBoardPage.openCreateIssueForm();
    await taskBoardPage.summaryInput.fill('POC09 - Missing Priority');
    await taskBoardPage.typeDropdown.selectOption({ label: 'Task' });
    await taskBoardPage.assigneeDropdown.selectOption({ label: 'Amir Khan' });
    await taskBoardPage.storyPointsDropdown.selectOption({ label: '3' });
    await taskBoardPage.submitEmptyIssueForm();
  }
);

Then(
  'I should see the priority validation message',
  async function () {
    await taskBoardPage.verifyPriorityValidation();
  }
);

When(
  'I submit an issue without selecting an assignee',
  async function () {
    await taskBoardPage.openCreateIssueForm();
    await taskBoardPage.summaryInput.fill('POC09 - Missing Assignee');
    await taskBoardPage.typeDropdown.selectOption({ label: 'Task' });
    await taskBoardPage.priorityDropdown.selectOption({ label: 'High' });
    await taskBoardPage.storyPointsDropdown.selectOption({ label: '3' });
    await taskBoardPage.submitEmptyIssueForm();
  }
);

Then(
  'I should see the assignee validation message',
  async function () {
    await taskBoardPage.verifyAssigneeValidation();
  }
);

// Type and priority combinations.
When('I create a bug with low priority', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Bug Low Priority',
    type: 'Bug',
    priority: 'Low'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a story with medium priority', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Story Medium Priority',
    type: 'Story',
    priority: 'Medium'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

// Story points combinations.
When('I create an issue with one story point', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - One Story Point',
    storyPoints: 1
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create an issue with thirteen story points', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Thirteen Story Points',
    storyPoints: 13
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a medium priority task', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Medium Priority Task',
    priority: 'Medium'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

// Assignee scenarios.
When('I create a task assigned to Sara Lopez', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Sara Assigned Task',
    assignee: 'Sara Lopez'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

// Label scenarios.
When('I create a task with a label', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Labelled Task',
    label: 'qa'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I submit an issue without story points', async function () {
  await taskBoardPage.openCreateIssueForm();

  await taskBoardPage.summaryInput.fill(
    'POC09 - Missing Story Points'
  );

  await taskBoardPage.typeDropdown.selectOption({
    label: 'Task'
  });

  await taskBoardPage.priorityDropdown.selectOption({
    label: 'High'
  });

  await taskBoardPage.assigneeDropdown.selectOption({
    label: 'Amir Khan'
  });

  await taskBoardPage.submitEmptyIssueForm();
});

Then(
  'I should see the story points validation message',
  async function () {
    await taskBoardPage.verifyStoryPointsValidation();
  }
);

// Sprint scenario.
When('I create an issue in Sprint 14', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Sprint 14 Issue',
    sprint: 'Sprint 14'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a task with a different label', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Different Label',
    label: 'regression'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a task assigned to Dev Patel', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Dev Patel Task',
    assignee: 'Dev Patel'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a high priority task', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - High Priority Task',
    priority: 'High'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create an issue with three story points', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Three Story Points',
    storyPoints: 3
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a task with the security label', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Security Label Task',
    label: 'security'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a task assigned to Mia Chen', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Mia Chen Task',
    assignee: 'Mia Chen'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a high priority story', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - High Priority Story',
    type: 'Story',
    priority: 'High'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create a task with the regression label', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Regression Label Task',
    label: 'regression'
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

When('I create an issue with five story points', async function () {
  const task = {
    ...validTask,
    summary: 'POC09 - Five Story Points',
    storyPoints: 5
  };

  await taskBoardPage.openCreateIssueForm();
  await taskBoardPage.createTask(task);
});

// Status update scenario.
// Initialize the page if no Given/Background step has initialized it.
When(
  'I update task {string} status to {string}',
  async function (taskId, status) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.updateTaskStatus(taskId, status);
  }
);

Then(
  'task {string} status should be {string}',
  async function (taskId, status) {
    await taskBoardPage.verifyTaskStatus(taskId, status);
  }
);
// Add a comment to a task.
When(
  'I add comment {string} to task {string}',
  async function (comment, taskId) {
    // Initialize TaskBoard when needed
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.addComment(comment);
  }
);

// Verify that the comment is displayed.
Then(
  'comment {string} should be visible on task {string}',
  async function (comment, taskId) {
    await taskBoardPage.verifyCommentVisible(comment);
  }
);
// Add a sub-task to an existing task.
When(
  'I add sub-task {string} to task {string}',
  async function (subTaskName, taskId) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.addSubTask(subTaskName);
  }
);

// Verify that the sub-task is visible.
Then(
  'sub-task {string} should be visible on task {string}',
  async function (subTaskName, taskId) {
    await taskBoardPage.verifySubTaskVisible(subTaskName);
  }
);
// Task details: Status
When(
  'I change task details status for {string} to {string}',
  async function (taskId, status) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.updateDetailsStatus(status);
  }
);

Then(
  'task details status for {string} should be {string}',
  async function (taskId, status) {
    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.verifyDetailsStatus(status);
  }
);

// Task details: Assignee
When(
  'I change the assignee for task {string} to {string}',
  async function (taskId, assignee) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.updateDetailsAssignee(assignee);
  }
);

Then(
  'task {string} should be assigned to {string}',
  async function (taskId, assignee) {
    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.verifyDetailsAssignee(assignee);
  }
);

// Task details: Points
When(
  'I change points for task {string} to {int}',
  async function (taskId, points) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.updateDetailsPoints(points);
  }
);

Then(
  'task {string} should have {int} points',
  async function (taskId, points) {
    await taskBoardPage.openTaskDetails(taskId);
    await taskBoardPage.verifyDetailsPoints(points);
  }
);
// Search for a task
When(
  'I search tasks for {string}',
  async function (searchText) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.searchTasks(searchText);
  }
);

// Verify matching task appears
Then(
  'task {string} should appear in search results',
  async function (summary) {
    await taskBoardPage.verifySearchResultVisible(summary);
  }
);

// Verify non-matching task does not appear
Then(
  'task {string} should not appear in search results',
  async function (summary) {
    await taskBoardPage.verifyTaskNotInSearchResults(summary);
  }
);
// Enable the Only My Issues filter
When(
  'I enable the Only My Issues filter',
  async function () {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    await taskBoardPage.enableOnlyMyIssuesFilter();
  }
);

// Verify the Only My Issues filter is enabled
Then(
  'the Only My Issues filter should be enabled',
  async function () {
    await taskBoardPage.verifyOnlyMyIssuesFilterEnabled();
  }
);
// Toggle an assignee filter and remember its expected state.
When(
  'I toggle the assignee filter {string}',
  async function (assigneeKey) {
    if (!taskBoardPage || !page) {
      await initializeTaskBoard();
    }

    const filterButton =
      taskBoardPage.getAssigneeFilter(assigneeKey);

    const previousState =
      await filterButton.getAttribute('aria-pressed');

    if (previousState !== 'true' && previousState !== 'false') {
      throw new Error(
        `Unexpected aria-pressed value for ${assigneeKey}: ${previousState}`
      );
    }

    this.expectedAssigneeFilterState =
      previousState === 'true' ? 'false' : 'true';

    await taskBoardPage.toggleAssigneeFilter(assigneeKey);
  }
);

// Verify that the filter state changed as expected.
Then(
  'the assignee filter {string} should have changed state',
  async function (assigneeKey) {
    const filterButton =
      taskBoardPage.getAssigneeFilter(assigneeKey);

    await expect(filterButton).toHaveAttribute(
      'aria-pressed',
      this.expectedAssigneeFilterState
    );
  }
);
// Screenshot on failure and trace recording.
After(async function (scenario) {
  fs.mkdirSync('reports', { recursive: true });

  try {
    if (scenario.result?.status === 'FAILED' && page) {
      const screenshotPath = `reports/failure-${Date.now()}.png`;

      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      this.attach(
        fs.readFileSync(screenshotPath),
        'image/png'
      );
    }
  } finally {
    try {
      if (context) {
        const tracePath = `reports/trace-${Date.now()}.zip`;

        await context.tracing.stop({
          path: tracePath
        });
      }
    } finally {
      if (browser) {
        await browser.close();
      }

      browser = null;
      context = null;
      page = null;
      taskBoardPage = null;
    }
  }
});