Feature: Checking history

Scenario: The user checks its history
  Given A logged user
  When I go to History section
  Then games with questions and answers are shown