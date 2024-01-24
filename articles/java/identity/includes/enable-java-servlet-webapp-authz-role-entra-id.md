---
ms.author: bbanerjee
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---


## Scenario

1. This web application uses [**MSAL for Java (MSAL4J)**](https://github.com/AzureAD/microsoft-authentication-library-for-java) to sign in a user and obtain an [ID Token](https://learn.microsoft.com/entra/identity-platform/id-tokens) from **Microsoft Entra ID**:

This sample first leverages the  **MSAL for Java (MSAL4J)** to sign in the user. On the home page it displays an option for the user to view the claims in their ID Tokens. This web application also allows the users to view a **privileged admin page** or a **regular user page** depending on the app role they have been assigned to. The idea is to provide an example of how, within an application, access to certain functionality/page is restricted to subsets of users depending on which role they belong to.

This kind of authorization is implemented using role-based access control (RBAC). When using RBAC, an administrator grants permissions to roles, not to individual users or groups. The administrator can then assign roles to different users and groups to control who has then access to certain content and functionality.  

This sample application defines the following two *Application Roles*:

- `PrivilegedAdmin`: Authorized to access the `Admins Only` and the `Regular Users` pages.
- `RegularUser`: Authorized to access the `Regular Users` page.

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest.  When a user signs into the application, Microsoft Entra ID emits a `roles` claim for each role that the user has been granted individually to the user in the from of role membership.  Assignment of users and groups to roles can be done through the portal's UI, or programmatically using the [Microsoft Graph](https://graph.microsoft.com) and [Microsoft Azure AD PowerShell](https://docs.microsoft.com/powershell/module/azuread/?view=azureadps-2.0).  In this sample, application role management is done through the Azure portal or using PowerShell.

> [!NOTE]
>  Role claims will not be present for guest users in a tenant if the `https://login.microsoftonline.com/common/` endpoint is used as the authority to sign in users. You need to sign-in a user to a tenanted endpoint like 'https://login.microsoftonline.com/tenantid'

## Prerequisites

- [JDK Version 8 or higher](https://jdk.java.net/8/)
- [Maven 3](https://maven.apache.org/download.cgi)
- A Microsoft Entra ID tenant. For more information on how to get a Microsoft Entra ID tenant, see [How to get a Microsoft Entra ID tenant](https://learn.microsoft.com/entra/identity-platform/quickstart-create-new-tenant)
- A user account in your own Microsoft Entra ID tenant if you want to work with **accounts in your organizational directory only** (single-tenant mode). If have not yet [created a user account](https://learn.microsoft.com/entra/fundamentals/add-users) in your AD tenant yet, you should do so before proceeding.

## Setup

### Clone or download this repository

From your shell or command line:

```console
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 3-Authorization-II/roles
```

or download and extract the repository .zip file.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

## Register the sample application with your Microsoft Entra ID tenant

There is one project in this sample. To register the app on the portal, you can:

- either follow manual configuration steps below
- or use PowerShell scripts that:
  - **automatically** creates the Microsoft Entra ID applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.
  - by default, the automation scripts set up an application that works with **accounts in your organizational directory only**.

### [Powershell](#tab/Powershell)

1. On Windows, run PowerShell and navigate to the root of the cloned directory
1. In PowerShell run:

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Microsoft Entra ID application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```PowerShell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > [!NOTE]
   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/3-Authorization-II/roles/AppCreationScripts/AppCreationScripts.md)
   > [!NOTE]
   > The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

### [Manual](#tab/Manual)

### Choose the Microsoft Entra ID tenant where you want to create your applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Microsoft Entra ID tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Microsoft Entra ID tenant.

### Register the web app (java-servlet-webapp-roles)

[Register a new web app](https://learn.microsoft.com/entra/identity-platform/quickstart-register-app) in the [Azure Portal](https://portal.azure.com).
Following this guide, you must:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.
1. Select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `java-servlet-webapp-roles`.
   - Under **Supported account types**, select an option.
     - Select **Accounts in this organizational directory only** if you're building an application for use only by users in your tenant (**single-tenant**).
   - In the **Redirect URI** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/msal4j-servlet-roles/auth/redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, click on the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, click on **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security concerns.
   - The generated key value will be displayed when you click the **Add** button. Copy the generated value for use in the steps later.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

#### Define the Application Roles

1. Still on the same app registration, select the **App roles** blade to the left.
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

 To add users to the app role defined earlier, follow the guidelines here: [Assign users and groups to roles.](https://learn.microsoft.com/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-roles)

### Configure the web app (java-servlet-webapp-roles) to use your app registration

Open the project in your IDE to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the [authentication.properties](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/3-Authorization-II/roles/src/main/resources/authentication.properties) file
1. Find the string `{enter-your-tenant-id-here}`. Replace the existing value with your Microsoft Entra ID tenant ID.
1. Find the string `{enter-your-client-id-here}` and replace the existing value with the application ID (clientId) of the `java-servlet-webapp-call-graph` application copied from the Azure portal.
1. Find the string `{enter-your-client-secret-here}` and replace the existing value with the key you saved during the creation of the `java-servlet-webapp-roles` app, in the Azure portal.
1. Find the key `app.roles` and make sure the value is set to `app.roles=admin PrivilegedAdmin, user RegularUser` (or substitute the names of your specific roles).

## Running The Sample
### Build .war File Using Maven

1. Navigate to the directory containing the pom.xml file for this sample (the same directory as this README), and run the following Maven command:
    ```
    mvn clean package
    ```
1. This should generate a `.war` file which can be run on a variety of application servers