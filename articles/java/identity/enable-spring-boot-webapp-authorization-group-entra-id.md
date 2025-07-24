---
title: Secure Java Spring Boot apps using groups and group claims
titleSuffix: Azure
description: Shows you how to develop a Java Spring Boot web app to restrict access to routes using security groups with the Microsoft identity platform.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: how-to
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Secure Java Spring Boot apps using groups and group claims

This article demonstrates a Java Spring Boot web app that uses the [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) for authentication, authorization, and token acquisition. The app uses the [OpenID Connect](/entra/identity-platform/v2-protocols-oidc) protocol to sign in users, and restricts access to pages based on Microsoft Entra ID security group membership.

The following diagram shows the topology of the app:

:::image type="content" source="media/topology-spring.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses the Microsoft Entra ID Spring Boot Starter client library for Java to sign in users in a Microsoft Entra ID tenant and obtain an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID.

The ID token contains the groups claim. The application loads claims into the Spring `GrantedAuthorities` list for the signed-in user. These values determine which pages the user is authorized to access.

For a video that covers this scenario, see [Implement authorization in your applications using app roles, security groups, scopes, and directory roles](https://www.youtube.com/watch?v=LRoc-na27l0).

## Prerequisites

- [JDK version 15](https://jdk.java.net/15/). This sample was developed on a system with Java 15, but it might be compatible with other versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) is recommended for running this sample in Visual Studio Code.
- A Microsoft Entra ID tenant. For more information, see [Quickstart: Set up a tenant](/entra/identity-platform/quickstart-create-new-tenant).
- A user account in your Microsoft Entra ID tenant. This sample doesn't work with a personal Microsoft account. Therefore, if you signed in to the [Azure portal](https://portal.azure.com) with a personal account and you don't have a user account in your directory, you need to create one now.
- Two security groups, named `AdminGroup` and `UserGroup`, containing the user or users that you want to sign and test this sample. Alternatively, you can add the user to two existing security groups in your tenant. If you choose to use existing groups, be sure to modify the sample configuration to use your existing security groups' name and object ID.
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-msal-java-samples.git
cd 4-spring-web-app/3-Authorization-II/groups
```

Alternatively, navigate to the [ms-identity-msal-java-samples](https://github.com/Azure-Samples/ms-identity-msal-java-samples) repository, then download it as a **.zip** file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

### Register the sample application with your Microsoft Entra ID tenant

There's one project in this sample. The following sections show you how to register the app using the Azure portal.

#### Choose the Microsoft Entra ID tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

#### Register the app (java-spring-webapp-groups)

To register the app, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.

1. Select **App Registrations** on the navigation pane, then select **New registration**.

1. In the **Register an application page** that appears, enter the following application registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-groups`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.

1. Select **Register** to create the application.

1. On the app's registration page, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.

1. On the app's registration page, select **Certificates & secrets** on the navigation pane to open the page where you can generate secrets and upload certificates.

1. In the **Client secrets** section, select **New client secret**.

1. Type a description - for example, **app secret**.

1. Select one of the available durations: **6 months**, **12 months**, or **Custom**.

1. Select **Add**. The generated value is displayed.

1. Copy and save the generated value for use in later steps. You need this value for your code's configuration files. This value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

1. On the app's registration page, select **API permissions** on the navigation pane to open the page where you can add access to the APIs that your application needs.

1. Select **Add a permission**.

1. Ensure that the **Microsoft APIs** tab is selected.

1. In the **Commonly used Microsoft APIs** section, select **Microsoft Graph**.

1. In the **Delegated permissions** section, select **GroupMember.Read.All** from the list. Use the search box if necessary. This permission is necessary for getting group memberships via Graph if the overage scenario occurs.

1. Select the button to grant admin consent for `GroupMember.Read.All`.

1. Select **Add permissions**.

#### Create security groups

To create security groups, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.

1. Select **Groups** on the navigation pane.

1. In the **Groups** pane, select **New Group**, and then provide the following information:

   - For **Group Type**, select **Security**.
   - For **Group Name**, enter **AdminGroup**.
   - For **Group Description**, enter **Admin Security Group**.
   - Add **Group Owners** and **Group Members** that you want to use and test in this sample.
   - Select **Create**.

1. In the **Groups** pane, select **New Group**, and then provide the following information:

   - For **Group Type**, select **Security**.
   - For **Group Name**, enter **UserGroup**.
   - For **Group Description**, enter **User Security Group**.
   - Add **Group Owners** and **Group Members** that you want to use and test in this sample.
   - Select **Create**.

For more information, see [Manage Microsoft Entra groups and group membership](/entra/fundamentals/how-to-manage-groups).

#### Configure security groups

You have the following options on how you can further configure your application to receive the groups claim:

- Receive all the groups that the signed-in user is assigned to in a Microsoft Entra ID tenant, included nested groups. For more information, see the section [Configure your application to receive all the groups the signed-in user is assigned to, including nested groups](#configure-your-application-to-receive-all-the-groups-the-signed-in-user-is-assigned-to-including-nested-groups).

- Receive the groups claim values from a filtered set of groups that your application is programmed to work with. For more information, see the section [Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-might-be-assigned-to). This option isn't available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing).

> [!NOTE]
> To get the on-premise group's `samAccountName` or `On Premises Group Security Identifier` instead of the group ID, see the section [Prerequisites for using group attributes synchronized from Active Directory](/entra/identity/hybrid/connect/how-to-connect-fed-group-claims#prerequisites-for-using-group-attributes-synchronized-from-active-directory) in [Configure group claims for applications by using Microsoft Entra ID](/entra/identity/hybrid/connect/how-to-connect-fed-group-claims).

##### Configure your application to receive all the groups the signed-in user is assigned to, including nested groups

To configure the app, use the following steps:

1. On the app's registration page, select **Token Configuration** on the navigation pane to open the page where you can configure the claims provided tokens issued to your application.

1. Select **Add groups claim** to open the **Edit Groups Claim** screen.

1. Select **Security groups** OR **All groups (includes distribution lists but not groups assigned to the application)**. Choosing both negates the effect of the **Security Groups** option.

1. Under the **ID** section, select **Group ID**. This selection causes Microsoft Entra ID to send the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [ID token](/entra/identity-platform/id-tokens) that your app receives after signing-in a user.

##### Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to

This option is useful when the following cases are true:

- Your application is interested in a selected set of groups that a signing-in user might be assigned to.
- Your app isn't interested in every security group this user is assigned to in the tenant.

This option helps your application avoid the [overage](#the-groups-overage-claim) issue.

> [!NOTE]
> This feature isn't available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing).
>
> Nested group assignments aren't available when you use this option.

To enable this option in your app, use the following steps:

1. On the app's registration page, select **Token Configuration** on the navigation pane to open the page where you can configure the claims provided tokens issued to your application.

1. Select **Add groups claim** to open the **Edit Groups Claim** screen.

1. Select **Groups assigned to the application** and don't selection any other options. If you choose more options, such as **Security Groups** or **All groups (includes distribution lists but not groups assigned to the application)**, these options negate the effect of the **Groups assigned to the application** option.

1. Under the **ID** section, select **Group ID**. This selection causes Microsoft Entra ID to send the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [ID token](/entra/identity-platform/id-tokens) that your app receives after signing-in a user.

1. If you're exposing a Web API using the **Expose an API** option, then you can also choose the **Group ID** option under the **Access** section. This selection causes Microsoft Entra ID to send the [object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [access token](/entra/identity-platform/access-tokens) issued to the client applications of your API.

1. On the app's registration page, select **Overview** on the navigation pane to open the Application overview screen.

1. Select the hyperlink with the name of your application in **Managed application in local directory**. This field title might be truncated - for example, **Managed application in ...**. When you select this link, you navigate to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the back button of your browser.

1. Select **Users and groups** on the navigation pane to open the page where you can assign users and groups to your application.

1. Select **Add user**.

1. Select **User and Groups** from the resultant screen.

1. Choose the groups that you want to assign to this application.

1. Select **Select** to finish selecting the groups.

1. Select **Assign** to finish the group assignment process.

   Your application now receives these selected groups in the groups claim when a user signing in to your app is a member of one or more these assigned groups.

1. Select **Properties** on the navigation pane to open the page that lists the basic properties of your application. Set the **User assignment required?** flag to **Yes**.

> [!IMPORTANT]
> When you set **User assignment required?** to **Yes**, Microsoft Entra ID checks that only users assigned to your application in the **Users and groups** pane are able to sign-in to your app. You can assign users directly or by assigning security groups they belong to.

---

### Configure your code sample to use your app registration and security groups (java-spring-webapp-groups)

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the **src\main\resources\application.yml** file.

1. Find the placeholder `Enter_Your_Tenant_ID_Here` and replace the existing value with your Microsoft Entra tenant ID.

1. Find the placeholder `Enter_Your_Client_ID_Here` and replace the existing value with the application ID or `clientId` of the `java-spring-webapp-groups` app copied from the Azure portal.

1. Find the placeholder `Enter_Your_Client_Secret_Here` and replace the existing value with the value you saved during the creation of `java-spring-webapp-groups` copied from the Azure portal.

1. Find the placeholder `Enter_Your_Admin_Group_ID_Here` and replace the existing value with the `objectId` value of your **AdminGroup**.

1. Find the placeholder `Enter_Your_User_Group_ID_Here` and replace the existing value with the `objectId` value of your **UserGroup**.

1. Open the **src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java** file.

1. Find the placeholder `Enter_Your_Admin_Group_ID_Here` and replace the existing value with the `objectId` value of your **AdminGroup**.

1. Find the placeholder `Enter_Your_User_Group_ID_Here` and replace the existing value with the `objectId` value of your **UserGroup**.

## Run the sample

### [Deploy to Azure Container Apps](#tab/aca)

The following sections show you how to deploy the sample to Azure Container Apps.

### Prerequisites

[!INCLUDE [deploy-container-apps-intro.md](includes/deploy-container-apps-intro.md)]

### Prepare the Spring project

[!INCLUDE [deploy-container-apps-prepare.md](includes/deploy-container-apps-prepare.md)]

## Setup

[!INCLUDE [deploy-container-apps-cli-setup.md](includes/deploy-container-apps-cli-setup.md)]

## Create the Azure Container Apps environment

[!INCLUDE [deploy-container-apps-cli-setup.md](includes/deploy-container-apps-create-env-variables.md)]

### Prepare the app for deployment

[!INCLUDE [deploy-container-apps-prepare-deploy.md](includes/deploy-container-apps-prepare-deploy.md)]

[!INCLUDE [deploy-container-apps-secret-note.md](includes/deploy-container-apps-secret-note.md)]

### Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-container-apps-update-registration.md](includes/deploy-container-apps-update-registration.md)]

### Deploy the app

[!INCLUDE [deploy-container-apps-deploy.md](includes/deploy-container-apps-deploy.md)]

### Validate the app

[!INCLUDE [deploy-container-apps-validate.md](includes/deploy-container-apps-validate.md)]

### [Run locally](#tab/local)

To run the sample locally, use the following steps:

1. Open a Bash window or the integrated Visual Studio Code terminal.

1. In the root directory of the app project, use the following command:

   ```bash
   mvn clean compile spring-boot:run
   ```

1. Open your browser and navigate to `http://localhost:8080`. You should see a screen with the text `You're signed in!` and buttons with the following labels: `ID Token Details`, `Admins Only`, and `Regular Users`.

:::image type="content" source="media/app-spring-group.png" alt-text="Screenshot of the sample app.":::

---

## Explore the sample

Use the following steps to explore the sample:

1. Notice the signed-in or signed-out status displayed at the center of the screen.
1. Select the context-sensitive button in the corner. This button reads **Sign In** when you first run the app. Alternatively, select **token details**, **admins only**, or **regular users**. Because these pages are protected and require authentication, you're automatically redirected to the sign-in page.
1. On the next page, follow the instructions and sign in with an account in the Microsoft Entra ID tenant.
1. On the consent screen, notice the scopes that are being requested.
1. Upon successful completion of the sign-in flow, you should be redirected to the home page - which shows the **sign in status** - or one of the other pages, depending on which button triggered your sign-in flow.
1. Notice that the context-sensitive button now says **Sign out** and displays your username.
1. If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims, including groups.
1. Select **Admins Only** to view the `/admin_only`. Only users belonging to the `AdminGroup` security group can view this page. Otherwise, an authorization failure message is displayed.
1. Select **Regular Users** to view the `/regular_user` page. Only users belonging to the `UserGroup` security group can view this page. Otherwise, an authorization failure message is displayed.
1. Use the button in the corner to sign out. The status page reflects the new state.

## About the code

This sample demonstrates how to use [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) to sign in users into your Microsoft Entra ID tenant. The sample also makes use of the Spring Oauth2 Client and Spring Web boot starters. The sample uses claims from the ID token obtained from Microsoft Entra ID to display the details of the signed-in user, and to restrict access to some pages by using the groups claim for authorization.

### Contents

The following table shows the contents of the sample project folder:

| File/folder                                                                   | Description                                                                               |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **pom.xml**                                                                     | Application dependencies.                                                                 |
| **src/main/resources/templates/**                                               | Thymeleaf Templates for UI.                                                               |
| **src/main/resources/application.yml**                                          | Application and Microsoft Entra ID Boot Starter Library Configuration.                    |
| **src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/** | This directory contains the main application entry point, controller, and config classes. |
| **.../MsIdentitySpringBootWebappApplication.java**                              | Main class.                                                                               |
| **.../SampleController.java**                                                   | Controller with endpoint mappings.                                                        |
| **.../SecurityConfig.java**                                                     | Security configuration - for example, which routes require authentication.                |
| **.../Utilities.java**                                                          | Utility class - for example, filter ID token claims.                                      |
| **CHANGELOG.md**                                                                | List of changes to the sample.                                                            |
| **CONTRIBUTING.md**                                                             | Guidelines for contributing to the sample.                                                |
| **LICENSE**                                                                     | The license for the sample.                                                               |

### ID token claims

To extract token details, the app makes use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping, as shown in the following example. See the [Sample Controller](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/3-Authorization-II/groups/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for the full details of how this app makes use of ID token claims.

```java
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
//...
@GetMapping(path = "/some_path")
public String tokenDetails(@AuthenticationPrincipal OidcUser principal) {
    Map<String, Object> claims = principal.getIdToken().getClaims();
}
```

### Process a groups claim in the ID token

The groups claim of the token includes the names of the groups that the signed-in user is assigned to, as shown in the following example:

```json
{
  ...
  "groups": [
    "xyz-id-xyz",
    "xyz-id-xyz",]
  ...
}
```

A common way to access the group names is documented in the [ID token claims](#id-token-claims) section.

Microsoft Entra ID Boot Starter v3.5 and higher parses the groups claim automatically and adds each group to the signed-in user's `Authorities`. This configuration enables developers to make use of groups with Spring `PrePost` condition annotations using the `hasAuthority` method. For example, you can find the following `@PreAuthorize` conditions demonstrated in **SampleController.java**:

```java
@GetMapping(path = "/admin_only")
@PreAuthorize("hasAuthority('enter-admin-group-id-here')")
public String adminOnly(Model model) {
    // restrict to users who belong to AdminGroup
}
@GetMapping(path = "/regular_user")
@PreAuthorize("hasAnyAuthority('enter-user-group-id-here','enter-admin-group-id-here')")
public String regularUser(Model model) {
    // restrict to users who belong to any of UserGroup or AdminGroup
}
```

The following code gets a full list of authorities for a given user:

 ```java
@GetMapping(path = "/some_path")
public String tokenDetails(@AuthenticationPrincipal OidcUser principal) {
    Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
}
```

### Sign-in and sign-out links

For sign-in, the app makes a request to the Microsoft Entra ID sign-in endpoint automatically configured by Microsoft Entra ID Spring Boot Starter client library for Java, as shown in the following example:

```html
<a class="btn btn-success" href="/oauth2/authorization/azure">Sign In</a>
```

For sign-out, the app makes a POST request to the `logout` endpoint, as shown in the following example:

```html
<form action="#" th:action="@{/logout}" method="post">
  <input class="btn btn-warning" type="submit" value="Sign Out" />
</form>
```

### Authentication-dependent UI elements

The app has some simple logic in the UI template pages for determining content to display based on whether the user is authenticated, as shown in the following example using Spring Security Thymeleaf tags:

```html
<div sec:authorize="isAuthenticated()">
  this content only shows to authenticated users
</div>
<div sec:authorize="isAnonymous()">
  this content only shows to not-authenticated users
</div>
```

### Protect routes with AADWebSecurityConfigurerAdapter

By default, the app protects the **ID Token Details**, **Admins Only**, and **Regular Users** pages so that only signed-in users can access them. The app configures these routes using the `app.protect.authenticated` property from the **application.yml** file. To configure your app's specific requirements, you can extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/3-Authorization-II/groups/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class, shown in the following code:

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends AADWebSecurityConfigurerAdapter{
  @Value( "${app.protect.authenticated}" )
  private String[] protectedRoutes;

    @Override
    public void configure(HttpSecurity http) throws Exception {
    // use required configuration form AADWebSecurityAdapter.configure:
    super.configure(http);
    // add custom configuration:
    http.authorizeRequests()
      .antMatchers(protectedRoutes).authenticated()     // limit these pages to authenticated users (default: /token_details, /admin_only, /regular_user)
      .antMatchers("/**").permitAll();                  // allow all other routes.
    }
}
```

### The groups overage claim

To ensure that the token size doesn't exceed HTTP header size limits, the Microsoft identity platform limits the number of object IDs that it includes in the groups claim.

The overage limit is 150 for SAML tokens, 200 for JWT tokens, 6 for single-page applications. If a user is a member of more groups than the overage limit, then the Microsoft identity platform doesn't emit the group IDs in the groups claim in the token. Instead, it includes an overage claim in the token that indicates to the application to query the [Microsoft Graph API](https://graph.microsoft.com) to retrieve the user's group membership.

Microsoft Entra ID Boot Starter v3.5 and higher parses the groups claim automatically and adds each group to the signed-in user's `Authorities`. The starter automatically handles the groups overage scenario.

> [!NOTE]
> We strongly advise you use the group filtering feature, if possible, to avoid running into group overages. For more information, see the section [Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-might-be-assigned-to).

#### Create the overage scenario for testing

You can use the **BulkCreateGroups.ps1** file provided in the **AppCreationScripts** folder to create a large number of groups and assign users to them. This file helps test overage scenarios during development. Remember to change the user's `objectId` provided in the **BulkCreateGroups.ps1** script.

Handling overage requires a call to [Microsoft Graph](https://graph.microsoft.com) to read the signed-in user's group memberships, so your app needs to have the [User.Read](/graph/permissions-reference#user-permissions) and [GroupMember.Read.All](/graph/permissions-reference#group-permissions) permissions for the [getMemberGroups](/graph/api/user-getmembergroups) function to execute successfully.

> [!IMPORTANT]
> For the overage scenario, make sure you've granted `Admin Consent` for the Microsoft Graph API's `GroupMember.Read.All` scope for both the client and service apps. For more information, see the app registration steps earlier in this article.

#### Update the Microsoft Entra ID app registration (java-spring-webapp-groups)

To update the app registration, use the following steps:

1. Navigate back to the [Azure portal](https://portal.azure.com).

1. On the navigation pane, select **Azure Active Directory**, and then select **App registrations (Preview)**.

1. In the resulting screen, select the `java-spring-webapp-groups` application.

1. On the app's registration page, select **Authentication** from the menu.

1. In the **Redirect URIs** section, update the reply URLs to match the site URL of your Azure deployment - for example, `https://java-spring-webapp-groups.azurewebsites.net/login/oauth2/code/`.

> [!IMPORTANT]
> If your app is using an in-memory storage, Azure App Services spins down your web site if it's inactive, and any records that your app was keeping are emptied. Also, if you increase the instance count of your website, requests are distributed among the instances. Thus, your apps records aren't the same on each instance.

## More information

- [Microsoft identity platform documentation](/entra/identity-platform/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs](/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Azure Active Directory](/entra/identity-platform/app-objects-and-service-principals)
- [National Clouds](/entra/identity-platform/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
