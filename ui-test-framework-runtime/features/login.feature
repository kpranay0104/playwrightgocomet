@serial
Feature: Login
  As a user of the application
  I want invalid attempts rejected and to log in once with valid
  credentials
  So that I reach the dashboard



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
