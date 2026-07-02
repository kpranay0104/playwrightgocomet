/**
 * Raw selectors for the OrangeHRM dashboard and the employee-search widget.
 * Kept separate from DashboardPage.ts for the same reason as
 * LoginPage.locators.ts — selector changes shouldn't touch page-object
 * behavior.
 */
export const dashboardPageLocators = {
  dashboardHeader: { tag: 'h6', hasText: 'Dashboard' },
  userDropdown: '.oxd-userdropdown-tab',
  sidebarSearchInput: 'input[placeholder="Type for hints..."]', // PIM "Employee List" search box
  employeeListResults: '.oxd-table-card',
  employeeSearchInputPlaceholder: 'Search',
  employeeSearchButtonText: 'Search',
};
