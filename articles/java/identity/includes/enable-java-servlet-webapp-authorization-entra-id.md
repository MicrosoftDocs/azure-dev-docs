---
author: KarlErickson
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 2-Authorization-I/call-graph
```

Alternatively, navigate to the [ms-identity-java-servlet-webapp-authentication](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication) repository, then download it as a *.zip* file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

### Register the sample application with your Microsoft Entra ID tenant

There's one project in this sample. To register the app on the Azure portal, you can follow manual configuration steps.

The following sections show you how to register the app manually.

#### Choose the Microsoft Entra ID tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

#### Register the app (java-servlet-webapp-call-graph)

First, register a new app in the [Azure portal](https://portal.azure.com) by following the instructions in [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

Then, use the following steps to complete the registration:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Select **New registration**.

1. In the **Register an application page** that appears, enter the following application registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-servlet-webapp-call-graph`.
   - Under **Supported account types**, select one of the following options:

     - Select **Accounts in this organizational directory only** if you're building an application for use only by users in your tenant - that is, a *single-tenant* application.
     - Select **Accounts in any organizational directory** if you'd like users in any Microsoft Entra ID tenant to be able to use your application - that is, a *multi-tenant* application.
     - Select **Accounts in any organizational directory and personal Microsoft accounts** for the widest set of customers - that is, a multi-tenant application that also supports Microsoft personal accounts.

   - Select **Personal Microsoft accounts** for use only by users of personal Microsoft accounts - for example, Hotmail, Live, Skype, and Xbox accounts.
   - In the **Redirect URI** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/msal4j-servlet-graph/auth/redirect`.

1. Select **Register** to create the application.

1. On the app's registration page, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.

1. Select **Save** to save your changes.

1. On the app's registration page, select **Certificates & secrets** on the navigation pane to open the page where you can generate secrets and upload certificates.

1. In the **Client secrets** section, select **New client secret**.

1. Type a description - for example, *app secret*.

1. Select one of the available durations: **In 1 year**, **In 2 years**, or **Never Expires**.

1. Select **Add**. The generated value is displayed.

1. Copy and save the generated value for use in later steps. You need this value for your code's configuration files. This value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

1. On the app's registration page, select **API permissions** from the navigation pane to open the page to add access to the APIs that your application needs.

1. Select **Add permissions**.

1. Ensure that the **Microsoft APIs** tab is selected.

1. In the **Commonly used Microsoft APIs** section, select **Microsoft Graph**.

1. In the **Delegated permissions** section, select **User.Read** from the list. Use the search box if necessary.

1. Select **Add permissions**.

---

### Configure the app (java-servlet-webapp-call-graph) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the *./src/main/resources/authentication.properties* file.

1. Find the string `{enter-your-tenant-id-here}`. Replace the existing value with one of the following values:

   - Your Microsoft Entra ID tenant ID if you registered your app with the **Accounts in this organizational directory only** option.
   - The word `organizations` if you registered your app with the **Accounts in any organizational directory** option.
   - The word `common` if you registered your app with the **Accounts in any organizational directory and personal Microsoft accounts** option.
   - The word `consumers` if you registered your app with the **Personal Microsoft accounts** option.

1. Find the string `{enter-your-client-id-here}` and replace the existing value with the application ID or `clientId` of the `java-servlet-webapp-call-graph` application copied from the Azure portal.

1. Find the string `{enter-your-client-secret-here}` and replace the existing value with the value you saved during the creation of the `java-servlet-webapp-call-graph` app, in the Azure portal.

## Build the sample

To build the sample using Maven, navigate to the directory containing the *pom.xml* file for the sample, and then run the following command:

```bash
mvn clean package
```

This command generates a *.war* file that you can run on a variety of application servers.
