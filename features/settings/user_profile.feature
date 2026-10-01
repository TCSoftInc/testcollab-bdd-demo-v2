@bdd @profile
Feature: User profile management
  A signed-in user can keep profile details current.

  Background:
    Given the demo application is open
    And I am signed in as "valid@example.com"

  @data-table
  Scenario: Update profile from a Gherkin data table
    When I update the profile with:
      | name  | John Smith                                      |
      | phone | +1-555-9999                                     |
      | bio   | Senior developer with expertise in test design. |
    And I save the profile
    Then the profile field "name" should contain "John Smith"
    And the profile field "phone" should contain "+1-555-9999"
    And I should see "Profile updated successfully!"

  @doc-string
  Scenario: Save a multiline profile biography
    When I replace the biography with:
      """
      Quality engineer
      BDD advocate
      Accessibility champion
      """
    And I save the profile
    Then the biography should contain:
      """
      Quality engineer
      BDD advocate
      Accessibility champion
      """

  Scenario: Change only the phone number
    When I update the profile with:
      | phone | +1-555-3030 |
    And I save the profile
    Then the profile field "phone" should contain "+1-555-3030"
    And the profile field "name" should contain "John Doe"
    And I should see "Profile updated successfully!"
