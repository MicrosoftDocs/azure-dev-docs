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
git clone https://github.com/Azure-Samples/ms-identity-msal-java-samples.git
cd 3-java-servlet-web-app/3-Authorization-II/groups
```

Alternatively, navigate to the [ms-identity-msal-java-samples](hhttps://github.com/Azure-Samples/ms-identity-msal-java-samples) repository, then download it as a *.zip* file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

### Register the sample application with your Microsoft Entra ID tenant

There's one project in this sample. The following sections show you how to register the app using the Azure portal.

#### Choose the Microsoft Entra ID tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

#### Register the app (java-servlet-webapp-groups)

First, register a new app in the [Azure portal](https://portal.azure.com) by following the instructions in [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app).

Then, use the following steps to complete the registration:

1. Navigate to the Microsoft identity platform for developers [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) page.

1. Select **New registration**.

1. In the **Register an application page** that appears, enter the following app registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-servlet-webapp-groups`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/msal4j-servlet-groups/auth/redirect`.

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

1. Select **Add a permission**.

1. Ensure that the **Microsoft APIs** tab is selected.

1. In the **Commonly used Microsoft APIs** section, select **Microsoft Graph**.

1. In the **Delegated permissions** section, select **User.Read** and **GroupMember.Read.All** from the list. Use the search box if necessary.

1. Select **Add permissions**.

1. `GroupMember.Read.All` requires admin consent, so select **Grant/revoke admin consent for {tenant}**, and then select **Yes** when you're asked if you want to grant consent for the requested permissions for all accounts in the tenant. You need to be a Microsoft Entra ID tenant admin to do this action.

---

### Configure the app (java-servlet-webapp-groups) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the *./src/main/resources/authentication.properties* file.

1. Find the string `{enter-your-tenant-id-here}`. Replace the existing value with your Microsoft Entra tenant ID if you registered your app with the **Accounts in this organizational directory only** option.

1. Find the string `{enter-your-client-id-here}` and replace the existing value with the application ID or `clientId` of the `java-servlet-webapp-groups` application copied from the Azure portal.

1. Find the string `{enter-your-client-secret-here}` and replace the existing value with the value you saved during the creation of the `java-servlet-webapp-groups` app, in the Azure portal.

### Configure security groups

You have the following options available on how you can further configure your applications to receive the groups claim:

- Receive all the groups that the signed-in user is assigned to in a Microsoft Entra ID tenant, included nested groups. For more information, see the section [Configure your application to receive all the groups the signed-in user is assigned to, including nested groups](#configure-your-application-to-receive-all-the-groups-the-signed-in-user-is-assigned-to-including-nested-groups).

- Receive the groups claim values from a filtered set of groups that your application is programmed to work with. For more information, see the section [Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-might-be-assigned-to). This option isn't available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing).

> [!NOTE]
> To get the on-premise group's `samAccountName` or `On Premises Group Security Identifier` instead of the group ID, see the section [Prerequisites for using group attributes synchronized from Active Directory](/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#prerequisites-for-using-group-attributes-synchronized-from-active-directory) in [Configure group claims for applications by using Microsoft Entra ID](/entra/identity/hybrid/connect/how-to-connect-fed-group-claims).

#### Configure your application to receive all the groups the signed-in user is assigned to, including nested groups

To configure your application, use the following steps:

1. On the app's registration page, select **Token Configuration** on the navigation pane to open the page where you can configure the claims provided tokens issued to your application.

1. Select **Add groups claim** to open the **Edit Groups Claim** screen.

1. Select **Security groups** OR the **All groups (includes distribution lists but not groups assigned to the application)** option. Choosing both options negates the effect of the **Security Groups** option.

1. Under the **ID** section, select **Group ID**. This selection causes Microsoft Entra ID to send the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [ID token](/entra/identity-platform/id-tokens) that your app receives after signing-in a user.

#### Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to

This option is useful when the following cases are true:

* Your application is interested in a selected set of groups that a signing-in user might be assigned to.
* Your application isn't interested in every security group this user is assigned to in the tenant.

This option helps your application avoid the [overage](#the-groups-overage-claim) issue.

> [!NOTE]
This feature isn't available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing).
>
> Nested group assignments aren't available when you use this option.

To enable this option in your app, use the following steps:

1. On the app's registration page, select **Token Configuration** on the navigation pane to open the page where you can configure the claims provided tokens issued to your application.

1. Select **Add groups claim** to open the **Edit Groups Claim** screen.

1. Select **Groups assigned to the application**.

   Choosing other options - such as **Security Groups** or **All groups (includes distribution lists but not groups assigned to the application)** - negates the benefits your app derives from choosing to use this option.

1. Under the **ID** section, select **Group ID**. This selection results in Microsoft Entra ID sending the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [ID token](/entra/identity-platform/id-tokens).

1. If you're exposing a web API using the **Expose an API** option, then you can also choose the **Group ID** option under the **Access** section. This option results in Microsoft Entra ID sending the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [access token](/entra/identity-platform/access-tokens).

1. On the app's registration page, select **Overview** on the navigation pane to open the application overview screen.

1. Select the hyperlink with the name of your application in **Managed application in local directory**. This field title might be truncated - for instance `Managed application in ...`. When you select this link, you navigate to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the back button of your browser.

1. Select **Users and groups** on the navigation pane to open the page where you can assign users and groups to your application.

1. Select **Add user**.

1. Select **User and Groups** from the resultant screen.

1. Choose the groups that you want to assign to this application.

1. Select **Select** to finish selecting the groups.

1. Select **Assign** to finish the group assignment process.

   Your application now receives these selected groups in the groups claim when a user signing in to your app is a member of one or more these assigned groups.

1. Select **Properties** on the navigation pane to open the page that lists the basic properties of your application.Set the **User assignment required?** flag to **Yes**.

> [!IMPORTANT]
> When you set **User assignment required?** to **Yes**, Microsoft Entra ID checks that only users assigned to your application in the **Users and groups** pane are able to sign-in to your app. You can assign users directly or by assigning security groups they belong to.

### Configure the app (java-servlet-webapp-groups) to recognize group IDs

Use the following steps to configure the app:

> [!IMPORTANT]
> On the **Token Configuration** page, if you chose any option other than **groupID** - such as **DNSDomain\sAMAccountName** - you should enter the group name in the following steps - for example, `contoso.com\Test Group` - instead of the object ID:

1. Open the *./src/main/resources/authentication.properties* file.

1. Find the string `{enter-your-admins-group-id-here}` and replace the existing value with the object ID of the `GroupAdmin` group, which you copied from the Azure portal. Remove the curly braces from the placeholder value as well.

1. Find the string `{enter-your-users-group-id-here}` and replace the existing value with the object ID of the `GroupMember` group, which you copied from the Azure portal. Remove the curly braces from the placeholder value as well.

## Build the sample

To build the sample using Maven, navigate to the directory containing the *pom.xml* file for the sample, and then run the following command:

```bash
mvn clean package
```

This command generates a *.war* file that you can run on various application servers.
