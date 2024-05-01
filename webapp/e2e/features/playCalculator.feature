Feature: Playing calculator game with default settings

Scenario: The user plays a game with default settings
  Given A logged user
  When I press play button
  Then questions with 4 answers are displayed till time finishes