---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
---

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-msal-java-samples.git
cd 3-java-servlet-web-app/1-Authentication/sign-in-b2c
```

Alternatively, navigate to the [ms-identity-msal-java-samples](https://github.com/Azure-Samples/ms-identity-msal-java-samples) repository, then download it as a **.zip** file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

### Register the sample application with your Azure AD B2C tenant

The sample comes with a preregistered application for testing purposes. If you would like to use your own Azure AD B2C tenant and application, follow the steps in the following sections to register and configure the application in the Azure portal. Otherwise, continue with the steps for [Run the sample](#run-the-sample).

### Choose the Azure AD B2C tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If your account is present in more than one Azure AD B2C tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Azure AD B2C tenant.

### Create user flows and custom policies

To create common user flows like sign-up, sign-in, profile edit, and password reset, see [Tutorial: Create user flows in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-create-user-flows).

You should consider creating [Custom policies in Azure Active Directory B2C](/azure/active-directory-b2c/custom-policy-overview) as well, however, this is beyond the scope of this tutorial.

### Add external identity providers

See [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-add-identity-providers).

### Register the app (ms-identity-b2c-java-servlet-webapp-authentication)

To register the app, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Azure AD B2C**.

1. Select **App Registrations** on the navigation pane, then select **New registration**.

1. In the **Register an application page** that appears, enter the following application registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `ms-identity-b2c-java-servlet-webapp-authentication`.
   - Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_redirect`.

1. Select **Register** to create the application.

1. On the app's registration page, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.

1. Select **Save** to save your changes.

1. On the app's registration page, select **Certificates & secrets** on the navigation pane to open the page where you can generate secrets and upload certificates.

1. In the **Client secrets** section, select **New client secret**.

1. Type a description - for example, **app secret**.

1. Select one of the available durations: **In 1 year**, **In 2 years**, or **Never Expires**.

1. Select **Add**. The generated value is displayed.

1. Copy and save the generated value for use in later steps. You need this value for your code's configuration files. This value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

### Configure the app (ms-identity-b2c-java-servlet-webapp-authentication) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the **./src/main/resources/authentication.properties** file.

1. Find the `aad.clientId` property and replace the existing value with the application ID or `clientId` of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.

1. Find the `aad.secret` property and replace the existing value with the value you saved during the creation of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.

1. Find the `aad.scopes` property and replace the existing application clientId with the value you placed into `aad.clientId` in step 1 of this section.

1. Find the `aad.authority` property and replace the first instance of `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

1. Find the `aad.authority` property and replace the second instance of `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

1. Find the `aad.signInPolicy` property and replace it with the name of the sign-up/sign-in user-flow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

1. Find the `aad.passwordResetPolicy` property and replace it with the name of the password reset user-flow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

1. Find the `aad.editProfilePolicy` property and replace it with the name of the edit profile user-flow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

## Build the sample

To build the sample using Maven, navigate to the directory containing the **pom.xml** file for the sample, and then run the following command:

```bash
mvn clean package
```

This command generates a **.war** file that you can run on various application servers.
