const { expect } = require('@playwright/test');

class TaskBoardPage {
  constructor(page) {
    this.page = page;
    this.lastCreatedSummary = '';

    // Board page
    this.createButton = page.getByRole('button', {
      name: 'Create',
      exact: true
    });

    // Create Issue form
    this.summaryInput = page.getByLabel('Summary');
    this.typeDropdown = page.getByLabel('Type');
    this.priorityDropdown = page.getByLabel('Priority');
    this.assigneeDropdown = page.getByTestId('task-assignee');
    this.storyPointsDropdown = page.getByLabel('Story points');
    this.labelsInput = page.getByPlaceholder('Type and press Enter');
    this.addToDropdown = page.getByLabel('Add to');
  }

  async openBoard() {
    await this.page.goto(
      'https://www.practiceqaautomation.com/apps/projects'
    );
  }

  async openCreateIssueForm() {
    await this.page.getByRole('button', {
      name: /create/i
    }).click();
  }

  async submitEmptyIssueForm() {
    await this.createButton.click();
  }

  async verifyMandatoryMessages() {
    await expect(
      this.page.getByText(
        'Title must be at least 5 characters',
        { exact: true }
      )
    ).toBeVisible();

    await expect(
      this.page.getByText('Choose a type', { exact: true })
    ).toBeVisible();

    await expect(
      this.page.getByText('Choose a priority', { exact: true })
    ).toBeVisible();

    await expect(
      this.page.getByText('Choose an assignee', { exact: true })
    ).toBeVisible();

    await expect(
      this.page.getByText('Estimate story points', { exact: true })
    ).toBeVisible();

    await expect(
      this.page.getByText(
        'Fill in the required fields.',
        { exact: true }
      )
    ).toBeVisible();
  }

  async createTask(task) {
    await this.summaryInput.fill(task.summary);

    await this.typeDropdown.selectOption({
      label: task.type
    });

    await this.priorityDropdown.selectOption({
      label: task.priority
    });

    await this.assigneeDropdown.selectOption({
      label: task.assignee
    });

    if (task.storyPoints !== undefined && task.storyPoints !== null) {
      await this.storyPointsDropdown.selectOption({
        label: String(task.storyPoints)
      });
    }

    if (task.label) {
      await this.labelsInput.fill(task.label);
      await this.labelsInput.press('Enter');
    }

    await this.addToDropdown.selectOption({
      label: task.sprint
    });

    this.lastCreatedSummary = task.summary;

    await this.createButton.click();
  }

  async verifyTaskVisible(summary) {
    await expect(
      this.page.getByText(summary, { exact: true })
    ).toBeVisible();
  }

  async getLastCreatedSummary() {
    return this.lastCreatedSummary;
  }

  async verifyBacklogIssueVisible(summary) {
    // Verify the success toast for a backlog issue.
    await expect(
      this.page.getByText(/created in the backlog/i)
    ).toBeVisible();
  }

  async verifySummaryLengthValidation() {
    await expect(
      this.page.getByText(
        'Title must be at least 5 characters',
        { exact: true }
      )
    ).toBeVisible();
  }

  async verifyTypeValidation() {
    await expect(
      this.page.getByText('Choose a type', { exact: true })
    ).toBeVisible();
  }

  async verifyPriorityValidation() {
    await expect(
      this.page.getByText('Choose a priority', { exact: true })
    ).toBeVisible();
  }

  async verifyAssigneeValidation() {
    await expect(
      this.page.getByText('Choose an assignee', { exact: true })
    ).toBeVisible();
  }

  async verifyStoryPointsValidation() {
    await expect(
      this.page.getByText(
        'Estimate story points',
        { exact: true }
      )
    ).toBeVisible();
  }

  // Update task status using its task ID.
  // Supported values: todo, progress, review, done.
  async updateTaskStatus(taskId, status) {
    const statusDropdown = this.page.getByTestId(
      `move-task-${taskId}`
    );

    await expect(statusDropdown).toBeVisible();
    await statusDropdown.selectOption(status);
  }

  // Verify the selected status.
  async verifyTaskStatus(taskId, expectedStatus) {
    const statusDropdown = this.page.getByTestId(
      `move-task-${taskId}`
    );

    await expect(statusDropdown).toHaveValue(expectedStatus);
  }
  // Open a task's details page.
async openTaskDetails(taskId) {
  await this.page.goto(
    `https://www.practiceqaautomation.com/apps/projects/task/${taskId}`
  );
}

// Add a comment to the task.
async addComment(comment) {
  const commentInput = this.page.getByPlaceholder('Add a comment');

  await expect(commentInput).toBeVisible();
  await commentInput.fill(comment);

  await this.page.getByRole('button', {
    name: 'Post',
    exact: true
  }).click();
}

async verifyCommentVisible(comment) {
  const commentText = this.page.getByText(comment, {
    exact: false
  });

  await expect(commentText).toBeVisible({
    timeout: 10000
  });
}
// Add a sub-task to an existing task
async addSubTask(subTaskName) {
  const subTaskInput = this.page.getByTestId('subtask-input');
  const addButton = this.page.getByTestId('add-subtask');

  await expect(subTaskInput).toBeVisible();
  await subTaskInput.fill(subTaskName);
  await addButton.click();
}

// Verify the sub-task is displayed
async verifySubTaskVisible(subTaskName) {
  await expect(
    this.page.getByText(subTaskName, { exact: true })
  ).toBeVisible({ timeout: 10000 });
}
// Update Status on the task details page
async updateDetailsStatus(status) {
  const dropdown = this.page.getByLabel('Status');

  await expect(dropdown).toBeVisible();
  await dropdown.selectOption({ label: status });
}

async verifyDetailsStatus(status) {
  const dropdown = this.page.getByLabel('Status');

  await expect(
    dropdown.locator('option:checked')
  ).toHaveText(status);
}

// Update Assignee
async updateDetailsAssignee(assignee) {
  const dropdown = this.page.getByLabel('Assignee');

  await expect(dropdown).toBeVisible();
  await dropdown.selectOption({ label: assignee });
}

async verifyDetailsAssignee(assignee) {
  const dropdown = this.page.getByLabel('Assignee');

  await expect(
    dropdown.locator('option:checked')
  ).toHaveText(assignee);
}

// Update Points
async updateDetailsPoints(points) {
  const dropdown = this.page.getByLabel('Points');

  await expect(dropdown).toBeVisible();
  await dropdown.selectOption({
    label: String(points)
  });
}

async verifyDetailsPoints(points) {
  const dropdown = this.page.getByLabel('Points');

  await expect(
    dropdown.locator('option:checked')
  ).toHaveText(String(points));
}
// Search tasks on the board
async searchTasks(searchText) {
  const searchInput = this.page.getByTestId('board-search');

  await expect(searchInput).toBeVisible();
  await searchInput.fill(searchText);
}

// Verify matching task is displayed
async verifySearchResultVisible(summary) {
  const matchingTask = this.page
    .getByTestId('task-card')
    .filter({ hasText: summary });

  await expect(matchingTask).toBeVisible();
}

// Verify non-matching task is not displayed
async verifyTaskNotInSearchResults(summary) {
  const nonMatchingTask = this.page
    .getByTestId('task-card')
    .filter({ hasText: summary });

  await expect(nonMatchingTask).toHaveCount(0);
}

// Clear search field
async clearTaskSearch() {
  const searchInput = this.page.getByTestId('board-search');

  await expect(searchInput).toBeVisible();
  await searchInput.clear();
}
// Enable the Only My Issues filter
async enableOnlyMyIssuesFilter() {
  const toggle = this.page.getByTestId('only-mine');

  await expect(toggle).toBeVisible();

  if (await toggle.getAttribute('aria-checked') !== 'true') {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute('aria-checked', 'true');
}

// Verify the filter is enabled
async verifyOnlyMyIssuesFilterEnabled() {
  const toggle = this.page.getByTestId('only-mine');

  await expect(toggle).toHaveAttribute('aria-checked', 'true');
}

// Disable the Only My Issues filter
async disableOnlyMyIssuesFilter() {
  const toggle = this.page.getByTestId('only-mine');

  await expect(toggle).toBeVisible();

  if (await toggle.getAttribute('aria-checked') === 'true') {
    await toggle.click();
  }

  await expect(toggle).toHaveAttribute('aria-checked', 'false');
}
// Get an assignee filter button
getAssigneeFilter(assigneeKey) {
  const validKeys = ['amir', 'sara', 'dev', 'mia'];

  if (!validKeys.includes(assigneeKey)) {
    throw new Error(`Invalid assignee key: ${assigneeKey}`);
  }

  return this.page.getByTestId(`filter-assignee-${assigneeKey}`);
}

// Toggle an assignee filter and verify its state changes
async toggleAssigneeFilter(assigneeKey) {
  const filterButton = this.getAssigneeFilter(assigneeKey);

  await expect(filterButton).toBeVisible();

  const previousState = await filterButton.getAttribute('aria-pressed');
  await filterButton.click();

  if (previousState === 'true') {
    await expect(filterButton).toHaveAttribute('aria-pressed', 'false');
  } else {
    await expect(filterButton).toHaveAttribute('aria-pressed', 'true');
  }
}
}

module.exports = { TaskBoardPage };