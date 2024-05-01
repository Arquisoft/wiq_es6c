Feature: Playing classic game with default settings

Scenario: The user plays a game with default settings
  Given A logged user
  When I play with configured settings(2 questions 2 answers)
  Then 2 questions with 2 answers are asked