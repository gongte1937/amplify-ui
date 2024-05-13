Feature: Modal

  Modal variation overlays an application with the Authenticator.

  Background:
    Given I'm running the example "/ui/components/authenticator/gen2/modal"

  @angular @react @vue
  Scenario: Application is wrapped with Authenticator
    Then I see "Sign in"

  @angular @react @vue
  Scenario: Application renders when signed in
    When I type my "email" with status "CONFIRMED"
    Then I type my password
    Then I click the "Sign in" button
    Then I see "Sign out"
