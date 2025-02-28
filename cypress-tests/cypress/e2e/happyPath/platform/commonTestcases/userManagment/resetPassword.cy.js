import { commonSelectors } from "Selectors/common";
import { commonText } from "Texts/common";
import { fake } from "Fixtures/fake";
import { addNewUser } from "Support/utils/onboarding";
import { logout } from "Support/utils/common";
import { onboardingSelectors } from "Selectors/onboarding";

describe("Password reset functionality", () => {
  const data = {};
  let passwordResetLink = "";

  it("Verify wrong password limit", () => {
    data.firstName = fake.firstName;
    data.email = fake.email.toLowerCase();

    cy.defaultWorkspaceLogin();
    addNewUser(data.firstName, data.email);
    logout();

    for (let i = 0; i < 5; i++) {
      cy.clearAndType(onboardingSelectors.signupEmailInput, data.email);
      cy.clearAndType(onboardingSelectors.loginPasswordInput, "passw");
      cy.get(onboardingSelectors.signInButton).click();
      cy.verifyToastMessage(
        commonSelectors.toastMessage,
        "Invalid credentials"
      );
    }
    cy.clearAndType(onboardingSelectors.signupEmailInput, data.email);
    cy.clearAndType(onboardingSelectors.loginPasswordInput, "passw");
    cy.get(onboardingSelectors.signInButton).click();
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      "Maximum password retry limit reached, please reset your password using forgot password option"
    );
  });

  it("Verify forgot password page elements and functionality", () => {
    cy.visit("/");
    cy.get(commonSelectors.forgotPasswordLink).click();
    cy.get(commonSelectors.pageLogo).should("be.visible");
    cy.get(commonSelectors.forgotPasswordPageHeader).verifyVisibleElement(
      "have.text",
      commonText.forgotPasswordPageHeader
    );
    cy.get(commonSelectors.forgotPasswordPageSubHeader).verifyVisibleElement(
      "have.text",
      "New to ToolJet? Create an account"
    );

    cy.get(commonSelectors.createAnAccountLink).verifyVisibleElement(
      "have.text",
      commonText.createAnAccountLink
    );

    cy.get('[data-cy="email-input-field-label"]').verifyVisibleElement(
      "have.text",
      "Email address *"
    );

    cy.get('[data-cy="email-input-field-input"]').should("be.visible");
    cy.get(commonSelectors.resetPasswordLinkButton)
      .verifyVisibleElement("have.text", commonText.resetPasswordLinkButton)
      .and("be.disabled");
    cy.wait(5000);
    cy.clearAndType('[data-cy="email-input-field-input"]', data.email);
    cy.get(commonSelectors.resetPasswordLinkButton).click();

    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      commonText.passwordResetEmailToast
    );
    cy.get(commonSelectors.pageLogo).should("be.visible");

    cy.get('[data-cy="check-your-mail-header"]').verifyVisibleElement(
      "have.text",
      "Check your mail"
    );

    cy.get(commonSelectors.onboardingPageDescription).verifyVisibleElement(
      "have.text",
      commonText.resetPasswordEmailDescription(data.email)
    );
    cy.get(commonSelectors.spamMessage).verifyVisibleElement(
      "have.text",
      commonText.spamMessage
    );
    cy.get(commonSelectors.onboardingSeperator).should("be.visible");
    cy.get(commonSelectors.onboardingSeperatorText).verifyVisibleElement(
      "have.text",
      commonText.onboardingSeperatorText
    );
    cy.get(commonSelectors.backToLoginButton).verifyVisibleElement(
      "have.text",
      commonText.backToLoginButton
    );

    cy.task("updateId", {
      dbconfig: Cypress.env("app_db"),
      sql: `select forgot_password_token from users where email='${data.email}';`,
    }).then((resp) => {
      passwordResetLink = `/reset-password/${resp.rows[0].forgot_password_token}`;
    });
  });

  it("Verify reset password page and functionality", () => {
    cy.visit(passwordResetLink);
    cy.get(commonSelectors.pageLogo).should("be.visible");
    cy.get(commonSelectors.passwordResetPageHeader).verifyVisibleElement(
      "have.text",
      commonText.passwordResetPageHeader
    );
    cy.get(commonSelectors.newPasswordInputLabel).verifyVisibleElement(
      "have.text",
      commonText.newPasswordInputLabel
    );
    cy.get(commonSelectors.newPasswordInputField).should("be.visible");
    cy.get(commonSelectors.passwordHelperText)
      .eq(0)
      .verifyVisibleElement("have.text", commonText.passwordHelperText);
    cy.get(commonSelectors.confirmPasswordInputFieldLabel).verifyVisibleElement(
      "have.text",
      commonText.confirmPasswordInputFieldLabel
    );
    cy.get(commonSelectors.confirmPasswordInputField).should("be.visible");
    cy.get(commonSelectors.passwordHelperText).verifyVisibleElement(
      "have.text",
      commonText.passwordHelperText
    );
    cy.get(commonSelectors.resetPasswordButton)
      .verifyVisibleElement("have.text", commonText.resetPasswordButton)
      .and("be.disabled");

    cy.clearAndType(commonSelectors.newPasswordInputField, "Pass");
    cy.get(commonSelectors.resetPasswordButton).should("be.disabled");

    cy.get(commonSelectors.newPasswordInputField).clear();
    cy.clearAndType(commonSelectors.confirmPasswordInputField, "Pass");
    cy.get(commonSelectors.resetPasswordButton).should("be.disabled");

    cy.clearAndType(commonSelectors.newPasswordInputField, "Pass");
    cy.clearAndType(commonSelectors.confirmPasswordInputField, "Pass");
    cy.get(commonSelectors.resetPasswordButton).should("be.disabled");

    cy.clearAndType(commonSelectors.newPasswordInputField, "password1");
    cy.clearAndType(commonSelectors.confirmPasswordInputField, "password");
    cy.get(commonSelectors.resetPasswordButton).should("be.disabled");

    cy.clearAndType(commonSelectors.newPasswordInputField, "Password");
    cy.clearAndType(commonSelectors.confirmPasswordInputField, "password");
    cy.get('[data-cy="confirm-password-input-error"]').verifyVisibleElement(
      "have.text",
      "Passwords don't match"
    );

    cy.clearAndType(commonSelectors.newPasswordInputField, "Password");
    cy.clearAndType(commonSelectors.confirmPasswordInputField, "Password");
    cy.get(commonSelectors.resetPasswordButton).should("be.enabled").click();
    cy.verifyToastMessage(
      commonSelectors.toastMessage,
      commonText.passwordResetSuccessToast
    );

    cy.get(commonSelectors.pageLogo).should("be.visible");
    cy.get('[data-cy="password-has-been-reset-header"]').verifyVisibleElement(
      "have.text",
      commonText.passwordResetSuccessPageHeader
    );
    cy.get(commonSelectors.resetPasswordPageDescription).verifyVisibleElement(
      "have.text",
      commonText.resetPasswordPageDescription
    );
    cy.get(commonSelectors.backToLoginButton).verifyVisibleElement(
      "have.text",
      commonText.backToLoginButton
    );
  });

  it("Verify user login using new password", () => {
    cy.visit("/");
    cy.clearAndType(onboardingSelectors.signupEmailInput, data.email);
    cy.clearAndType(onboardingSelectors.loginPasswordInput, "Password");
    cy.get(onboardingSelectors.signInButton).click();
    cy.get(commonSelectors.workspaceName).should("be.visible");
  });
});
