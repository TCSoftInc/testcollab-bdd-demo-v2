@helpdesk @sync-only
Feature: Ticket Board Overview

        Navigation: Support console > Choose a workspace dropdown > Tickets sidetab > Board submenu

    Background:
      Given a signed-in support agent
        And the agent opens the page:"/support/:workspaceId/tickets" for workspaceId:"318"

  Rule: Board list

    Scenario Outline: Find tickets - Matching rows - <criterion>
       When the agent types a ticket "<criterion>" in the search field
       Then only matching tickets and their linked tickets are listed
       When the agent empties the search field
       Then the full ticket list is shown again
     Examples:
            | criterion           |
            | Subject             |
            | Requester           |
            | Subject / Requester |

    Scenario: Find tickets - Nothing found
       When the agent types this text in the search field
            | ticket-that-does-not-exist-000 |
       Then the ticket list is empty
        And the list shows the text "No tickets match your search."
        And the agent empties the search field
        And the full ticket list is shown again

  @slow
  Rule: CSV download

    Scenario: Download with UTC times
      Given the ticket board holds tickets to download
       When the agent refreshes the board
        And the agent switches "Show times in UTC" on
        And the agent downloads the board as CSV
       Then the browser asks where to save the file
        And the download completes
        And the CSV file is stored in the downloads folder
        And the CSV header holds these columns in this order:
            | Column           |
            | Ticket ID        |
            | Subject          |
            | Requester        |
            | Requester Email  |
            | Organization     |
            | Status           |
            | Priority         |
            | Type             |
            | Channel          |
            | Assignee         |
            | Assignee Group   |
            | Created At       |
            | Updated At       |
            | First Reply At   |
            | Solved At        |
            | Due Date         |
            | Tags             |
            | Product Area     |
            | Language         |
            | Satisfaction     |
            | Reopens          |
            | Replies          |
            | Agent Replies    |
            | Internal Notes   |
            | Attachments      |
            | SLA Policy       |
            | SLA Breached     |
            | First Reply Time |
            | Resolution Time  |
            | Wait Time        |
            | On-hold Time     |
            | Escalated        |
            | Source Form      |
            | Country          |
            | Merged Into      |
        And the CSV holds one line for each ticket on the board
        And the first 5 Created At values end with "Z"

    @runon:=>main
    Scenario: Download a filtered range in local time
      Given the ticket board holds tickets to download
       When the agent switches "Show times in UTC" off
        And the agent picks a random preset in the date range menu
        # The random filter picks only from columns whose values match a filter option one to one.
        And the agent keeps only one random value of a random filter
        And the agent downloads the board as CSV
       Then the browser asks where to save the file
        And the ticket count on the board equals the count of the chosen filter value
        And the download completes
        And the CSV file is stored in the downloads folder
        And the CSV header holds these columns in this order:
            | Column           |
            | Ticket ID        |
            | Subject          |
            | Requester        |
            | Requester Email  |
            | Organization     |
            | Status           |
            | Priority         |
            | Type             |
            | Channel          |
            | Assignee         |
            | Assignee Group   |
            | Created At       |
            | Updated At       |
            | First Reply At   |
            | Solved At        |
            | Due Date         |
            | Tags             |
            | Product Area     |
            | Language         |
            | Satisfaction     |
            | Reopens          |
            | Replies          |
            | Agent Replies    |
            | Internal Notes   |
            | Attachments      |
            | SLA Policy       |
            | SLA Breached     |
            | First Reply Time |
            | Resolution Time  |
            | Wait Time        |
            | On-hold Time     |
            | Escalated        |
            | Source Form      |
            | Country          |
            | Merged Into      |
        And the CSV column of the chosen filter holds only the chosen value
        And the CSV holds one line for each ticket on the board
        And the first 5 Created At values carry the local time zone offset

    Scenario: Download search results
      Given the ticket board holds tickets to download
       When the agent searches for the requester of the first ticket
        And the agent downloads the board as CSV
       Then the browser asks where to save the file
        And the download completes
        And the CSV file is stored in the downloads folder
        And the CSV header holds these columns in this order:
            | Column     |
            | Ticket ID  |
            | Created At |
        And the CSV holds one line for each ticket on the board
        And every CSV line names the searched requester
