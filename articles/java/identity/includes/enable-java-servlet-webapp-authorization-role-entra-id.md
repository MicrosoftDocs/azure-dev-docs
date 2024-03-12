---
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Setup

### Clone or download the sample repository

To clone the sample, open a command prompt and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 3-Authorization-II/roles
```

Alternatively, navigate to the [ms-identity-java-servlet-webapp-authentication](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication) repository, then download it as a *.zip* file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

## Register the sample application with your Microsoft Entra ID tenant

There's one project in this sample. To register the app on the portal, you can:

- either follow manual configuration steps below
- or use PowerShell scripts that:
  - automatically creates the Microsoft Entra ID applications and related objects - such as passwords, permissions, and dependencies - for you.
  - modify the projects' configuration files.
  - by default, the automation scripts set up an application that works with accounts in your organizational directory only.

### [Powershell](#tab/Powershell)

1. On Windows, run PowerShell and navigate to the root of the cloned directory.
1. In PowerShell, run the following command:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Microsoft Entra ID application and configure the code of the sample application accordingly.
1. In PowerShell, run the following commands:

   ```powershell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > [!NOTE]
   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/3-Authorization-II/roles/AppCreationScripts/AppCreationScripts.md)
   > [!NOTE]
   > The scripts also provide a guide to automated application registration, configuration, and removal, which can help in your CI/CD scenarios.

### [Manual](#tab/Manual)

### Choose the Microsoft Entra ID tenant where you want to create your applications

As a first step, you need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

### Register the web app (java-servlet-webapp-roles)

[Register a new web app](/entra/identity-platform/quickstart-register-app) in the [Azure Portal](https://portal.azure.com).
Following this guide, you must:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-servlet-webapp-roles`.
   - Under **Supported account types**, select an option.
     - Select **Accounts in this organizational directory only** if you're building an application for use only by users in your tenant - that is, a *single-tenant* application.
   - In the **Redirect URI** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/msal4j-servlet-roles/auth/redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file or files later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select **Certificates & secrets** in the navigation pane to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**.
1. Type a key description - for example, *app secret*.
1. Select one of the available key durations: **In 1 year**, **In 2 years**, or **Never Expires**.
1. Select **Add**. The generated key value is displayed.
1. Copy the generated value for use in the steps later. You need this key later in your code's configuration files. This key value isn't displayed again, and isn't retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or pane.

#### Define the Application Roles

1. Still on the same app registration, select the **App roles** pane to the left.
1. Select **Create app role**:
   - For **Display name**, enter a suitable name, for instance **PrivilegedAdmin**.
   - For **Allowed member types**, choose **User**.
   - For **Value**, enter **PrivilegedAdmin**.
   - For **Description**, enter **PrivilegedAdmins who can view the Admin Page**.
1. Select **Create app role**:
   - For **Display name**, enter a suitable name, for instance **RegularUser**.
   - For **Allowed member types**, choose **User**.
   - For **Value**, enter **RegularUser**.
   - For **Description**, enter **RegularUsers who can view the User Page**.
1. Select **Apply** to save your changes.

#### Assign users to the Application roles

 To add users to the app role defined earlier, follow the guidelines here: [Assign users and groups to roles.](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles)

### Configure the web app (java-servlet-webapp-roles) to use your app registration

Open the project in your IDE to configure the code.

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the [authentication.properties](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/3-Authorization-II/roles/src/main/resources/authentication.properties) file.
1. Find the string `{enter-your-tenant-id-here}`. Replace the existing value with your Microsoft Entra ID tenant ID.
1. Find the string `{enter-your-client-id-here}` and replace the existing value with the application ID or `clientId` of the `java-servlet-webapp-call-graph` application copied from the Azure portal.
1. Find the string `{enter-your-client-secret-here}` and replace the existing value with the key you saved during the creation of the `java-servlet-webapp-roles` app, in the Azure portal.
1. Find the key `app.roles` and make sure the value is set to `app.roles=admin PrivilegedAdmin, user RegularUser`, or substitute the names of your specific roles.

## Run the sample

### Build the .war file using Maven

To build the *.war* file, navigate to the directory containing the *pom.xml* file for the sample, and then run the following Maven command:

```bash
mvn clean package
```

This command generates a *.war* file that you can run on a variety of application servers.
