@serial
Feature: Employee Search
  As a logged-in user
  I want to search for an employee
  So that I can find their record quickly


  Scenario: Searching for the admin employee returns results
    When I search for the employee "Admin"
    Then I should see at least one search result
