---
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Setup

### Clone or download the sample repository

To clone the sample, open a command prompt and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 1-Authentication/sign-in-b2c
```

Alternatively, navigate to the [ms-identity-java-servlet-webapp-authentication](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication) repository, then download it as a *.zip* file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

### Register the sample application with your Azure AD B2C tenant

This sample comes with a pre-registered application for testing purposes. If you would like to use your own Azure AD B2C tenant and application, follow the steps below to register and configure the application in the Azure portal. Otherwise, continue with the steps for [Run the sample](#run-the-sample).

### Choose the Azure AD B2C tenant where you want to create your applications

As a first step, you need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD B2C tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Azure AD B2C tenant.

### Create user flows and custom policies

To create common user flows like sign up, sign in, edit profile, and password reset, see [Tutorial: Create user flows in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-create-user-flows).

You may consider creating [Custom policies in Azure Active Directory B2C](/azure/active-directory-b2c/custom-policy-overview) as well, however, this is beyond the scope of this tutorial.

### Add external identity providers

See [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-add-identity-providers).

### Register the WebApp app (ms-identity-b2c-java-servlet-webapp-authentication)

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Azure AD B2C**.
1. Select the **App Registrations** pane on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `ms-identity-b2c-java-servlet-webapp-authentication`.
   - Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_redirect`.

1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file or files later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select **Certificates & secrets** in the navigation pane to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**.
1. Type a key description - for example, *app secret*.
1. Select one of the available key durations: **In 1 year**, **In 2 years**, or **Never Expires**.
1. Select **Add**. The generated key value is displayed.
1. Copy the generated value for use in the steps later. You need this key later in your code's configuration files. This key value isn't displayed again, and isn't retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or pane.

#### Configure the WebApp app (ms-identity-b2c-java-servlet-webapp-authentication) to use your app registration

Open the project in your IDE - such as Visual Studio Code - to configure the code.

> [!NOTE]
> In the following steps, "ClientID" is the same as "Application ID" or "AppId".

1. Open the [authentication.properties](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in-b2c/src/main/resources/authentication.properties) file.
1. Find the key `aad.clientId` and replace the existing value with the application ID or `clientId` of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.
1. Find the app key `aad.secret` and replace the existing value with the key you saved during the creation of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.
1. Find the app key `aad.scopes` and replace the existing application clientId with the value you placed into `aad.clientId` in step 1 of this section.
1. Find the app key `aad.authority` and replace the first instance of `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.authority` and replace the second instance of `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.signInPolicy` and replace it with the name of the sign-up/sign-in userflow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.passwordResetPolicy` and replace it with the name of the password reset userflow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.editProfilePolicy` and replace it with the name of the edit profile userflow policy you created in the Azure AD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

## Run the sample

### Build the .war file using Maven

To build the *.war* file, navigate to the directory containing the *pom.xml* file for the sample, and then run the following Maven command:

```bash
mvn clean package
```

This command generates a *.war* file that you can run on a variety of application servers.
