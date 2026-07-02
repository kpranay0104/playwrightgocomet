@serial
Feature: Employee Search
  As a logged-in user
  I want to search for an employee
  So that I can find their record quickly

  # Deliberately has NO login step of its own. This relies on the shared
  # worker-scoped browser page (features/steps/fixtures.ts) and on
  # login.feature having already run and logged in successfully — see the
  # ordering note there, and playwright.config.bdd.ts (workers: 1,
  # fullyParallel: false) which guarantees feature files run in a fixed
  # order, in the same worker, rather than in parallel/fresh sessions.

  Scenario: Searching for the admin employee returns results
    When I search for the employee "Admin"
    Then I should see at least one search result
