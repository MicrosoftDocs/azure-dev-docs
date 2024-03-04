---
ms.author: bbanerjee
ms.date: 01/01/2024
---

## Setup

### Clone or download the sample repository

From your shell or command line:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 1-Authentication/sign-in
```

or download and extract the repository *.zip* file.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

## Register the sample application with your Microsoft Entra ID tenant

There's one project in this sample. To register the app on the portal, you can:

- either follow manual configuration steps below
- or use PowerShell scripts that:
  - **automatically** create the Microsoft Entra ID applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.
  - by default, the automation scripts set up an application that works with **accounts in your organizational directory only**.

### [Powershell](#tab/Powershell)

1. On Windows, run PowerShell and navigate to the root of the cloned directory
1. In PowerShell run:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Microsoft Entra ID application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```powershell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > [!NOTE]
   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in/AppCreationScripts/AppCreationScripts.md)
   > The scripts also provide a guide to automated application registration, configuration, and removal, which can help in your CI/CD scenarios.

### [Manual](#tab/Manual)

[Register a new web app](/entra/identity-platform/quickstart-register-app) in the [Azure Portal](https://portal.azure.com).
Following this guide, you must:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-servlet-webapp-authentication`.
   - Under **Supported account types**, select an option.
     - Select **Accounts in this organizational directory only** if you're building an application for use only by users in your tenant (**single-tenant**).
     - Select **Accounts in any organizational directory** if you'd like users in any Microsoft Entra ID tenant to be able to use your application (**multi-tenant**).
     - Select **Accounts in any organizational directory and personal Microsoft accounts** for the widest set of customers (**multi-tenant** that also supports Microsoft personal accounts).
     - Select **Personal Microsoft accounts** for use only by users of personal Microsoft accounts - for example, Hotmail, Live, Skype, and Xbox accounts.
   - In the **Redirect URI** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/msal4j-servlet-auth/auth/redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file or files later in your code.
1. In the app's registration screen, click on the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, click on **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security concerns.
   - The generated key value is displayed when you click the **Add** button. Copy the generated value for use in the steps later.
   - You need this key later in your code's configuration files. This key value isn't displayed again, and isn't retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

---

### Configure the web app to use your app registration

Open the project in your IDE to configure the code.

> [!NOTE]
> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the *./src/main/resources/authentication.properties* file
1. Find the string `{enter-your-tenant-id-here}`. Replace the existing value with:

   - **Your Microsoft Entra ID tenant ID** if you registered your app with the **Accounts in this organizational directory only** option.
   - The word `organizations` if you registered your app with the **Accounts in any organizational directory** option.
   - The word `common` if you registered your app with the **Accounts in any organizational directory and personal Microsoft accounts** option.
   - The word `consumers` if you registered your app with the **Personal Microsoft accounts** option

1. Find the string `{enter-your-client-id-here}` and replace the existing value with the application ID (clientId) of the `java-servlet-webapp-authentication` application copied from the Azure portal.

1. Find the string `{enter-your-client-secret-here}` and replace the existing value with the key you saved during the creation of the `java-servlet-webapp-authentication` app, in the Azure portal.

## Run the sample
### Build .war file using Maven

1. Navigate to the directory containing the *pom.xml* file for this sample, and run the following Maven command:

   ```bash
   mvn clean package
   ```

1. This should generate a *.war* file that you can run on a variety of application servers.
