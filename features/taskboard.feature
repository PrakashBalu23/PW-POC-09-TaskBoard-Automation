
Feature: TaskBoard Issue Management

  Scenario: Create a task successfully
    Given I open the TaskBoard board
    When I create a task with valid details
    Then the new task should appear on the board

  Scenario: Verify mandatory field validations
    Given I open the TaskBoard board
    When I submit the create issue form without required fields
    Then I should see the mandatory field validation messages

  Scenario: Create a bug successfully
    Given I open the TaskBoard board
    When I create a bug with valid details
    Then the new issue should appear on the board

  Scenario: Create a story successfully
    Given I open the TaskBoard board
    When I create a story with valid details
    Then the new issue should appear on the board

  Scenario: Create a low priority task
    Given I open the TaskBoard board
    When I create a low priority task
    Then the new issue should appear on the board

  Scenario: Create an issue in the backlog
    Given I open the TaskBoard board
    When I create an issue in the backlog
    Then the backlog issue should appear in the backlog

  Scenario: Verify minimum summary length validation
    Given I open the TaskBoard board
    When I submit an issue with a short summary
    Then I should see the summary length validation message

  Scenario: Verify issue type is mandatory
    Given I open the TaskBoard board
    When I submit an issue without selecting a type
    Then I should see the type validation message

  Scenario: Verify priority is mandatory
    Given I open the TaskBoard board
    When I submit an issue without selecting a priority
    Then I should see the priority validation message

  Scenario: Verify assignee is mandatory
    Given I open the TaskBoard board
    When I submit an issue without selecting an assignee
    Then I should see the assignee validation message

  Scenario: Create a bug with low priority
    Given I open the TaskBoard board
    When I create a bug with low priority
    Then the new issue should appear on the board

  Scenario: Create a story with medium priority
    Given I open the TaskBoard board
    When I create a story with medium priority
    Then the new issue should appear on the board

  Scenario: Create an issue with minimum story points
    Given I open the TaskBoard board
    When I create an issue with one story point
    Then the new issue should appear on the board

  Scenario: Create an issue with maximum story points
    Given I open the TaskBoard board
    When I create an issue with thirteen story points
    Then the new issue should appear on the board

  Scenario: Create a task with medium priority
    Given I open the TaskBoard board
    When I create a medium priority task
    Then the new issue should appear on the board

  Scenario: Create a task assigned to Sara Lopez
    Given I open the TaskBoard board
    When I create a task assigned to Sara Lopez
    Then the new issue should appear on the board

  Scenario: Create a task with a label
    Given I open the TaskBoard board
    When I create a task with a label
    Then the new issue should appear on the board

  Scenario: Verify story points are mandatory
    Given I open the TaskBoard board
    When I submit an issue without story points
    Then I should see the story points validation message

  Scenario: Create an issue in Sprint 14
    Given I open the TaskBoard board
    When I create an issue in Sprint 14
    Then the new issue should appear on the board

  Scenario: Create a task with a different label
    Given I open the TaskBoard board
    When I create a task with a different label
    Then the new issue should appear on the board

  Scenario: Create a task assigned to Dev Patel
    Given I open the TaskBoard board
    When I create a task assigned to Dev Patel
    Then the new issue should appear on the board

  Scenario: Create a high priority task
    Given I open the TaskBoard board
    When I create a high priority task
    Then the new issue should appear on the board

  Scenario: Create an issue with three story points
    Given I open the TaskBoard board
    When I create an issue with three story points
    Then the new issue should appear on the board

  Scenario: Create a task with the security label
    Given I open the TaskBoard board
    When I create a task with the security label
    Then the new issue should appear on the board

  Scenario: Create a task assigned to Mia Chen
    Given I open the TaskBoard board
    When I create a task assigned to Mia Chen
    Then the new issue should appear on the board

  Scenario: Create a high priority story
    Given I open the TaskBoard board
    When I create a high priority story
    Then the new issue should appear on the board

  Scenario: Create a task with the regression label
    Given I open the TaskBoard board
    When I create a task with the regression label
    Then the new issue should appear on the board

  Scenario: Create an issue with five story points
    Given I open the TaskBoard board
    When I create an issue with five story points
    Then the new issue should appear on the board
@status
Scenario: Update task status from To do to In progress
  When I update task "PA-4" status to "progress"
  Then task "PA-4" status should be "progress"
@comments
Scenario: Add a comment to an existing task
  When I add comment "POC09 automation comment" to task "PA-4"
  Then comment "POC09 automation comment" should be visible on task "PA-4"
@subtask
Scenario: Add a sub-task to an existing task
  When I add sub-task "POC09 automation sub-task" to task "PA-4"
  Then sub-task "POC09 automation sub-task" should be visible on task "PA-4"
@details-status
Scenario: Update status from task details page
  When I change task details status for "PA-4" to "In progress"
  Then task details status for "PA-4" should be "In progress"

@details-assignee
Scenario: Change assignee from task details page
  When I change the assignee for task "PA-4" to "Sara Lopez"
  Then task "PA-4" should be assigned to "Sara Lopez"

@details-points
Scenario: Update points from task details page
  When I change points for task "PA-4" to 3
  Then task "PA-4" should have 3 points
@search
Scenario: Search for an existing task by its title
  When I search tasks for "Dark mode for dashboard"
  Then task "Dark mode for dashboard" should appear in search results
  And task "Flaky search test" should not appear in search results
@myissues
Scenario: Enable the Only My Issues filter
  When I enable the Only My Issues filter
  Then the Only My Issues filter should be enabled
@assignee-filter
Scenario Outline: Toggle an assignee filter
  When I toggle the assignee filter "<assigneeKey>"
  Then the assignee filter "<assigneeKey>" should have changed state

 Examples:
      | assigneeKey |
      | amir        |
      | sara        |
      | dev         |
      | mia         |