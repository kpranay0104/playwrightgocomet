@serial
Feature: Login
  As a user of the application
  I want invalid attempts rejected and to log in once with valid
  credentials
  So that I reach the dashboard

  # Scenarios are ordered on purpose and share ONE browser session (see
  # features/steps/fixtures.ts — every scenario in the whole BDD suite runs
  # against the same worker-scoped page, not a fresh one per scenario).
  # Failure cases run first; the ONLY successful login happens last, here,
  # and search.feature continues from the session this leaves behind.

  Scenario: Submitting an empty login form is rejected
    Given I am on the login page
    When I submit the login form without entering anything
    Then I should see a required field validation message

  Scenario: Invalid credentials are rejected
    Given I am on the login page
    When I log in with invalid credentials
    Then I should see an "invalid" error message
    And I should still be on the login page

  Scenario: Valid credentials log the user in
    When I log in with valid credentials
    Then I should see the dashboard
