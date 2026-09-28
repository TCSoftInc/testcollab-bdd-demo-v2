@bdd @authentication
Feature: User login
  Registered users need clear feedback when they sign in.

  Background:
    Given the demo application is open
    And I am on the login page

  Rule: Registered users can sign in

    @smoke @dataset
    Scenario Outline: Sign in as <email>
      When I sign in with "<email>" and "<password>"
      Then I should see the welcome message "<welcome>"

      Examples: Active accounts
        | email             | password        | welcome                   |
        | valid@example.com | correctpassword | Welcome back, John Doe!   |
        | jane@example.com  | mypassword123   | Welcome back, Jane Smith! |

  Rule: Invalid credentials remain on the login page

    @negative @dataset
    Scenario Outline: Reject <case> login
      When I sign in with "<email>" and "<password>"
      Then I should see the login error "<error>"

      Examples: Invalid requests
        | case         | email               | password      | error               |
        | wrong-secret | valid@example.com   | wrongpassword | Invalid credentials |
        | unknown-user | missing@example.com | anypassword   | User not found      |
