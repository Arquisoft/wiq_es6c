Feature: Login with an existing user

Scenario: The user is registered in the site
  Given A registered user
  When I fill the data in the form and press submit
  Then Menu screen is displayed