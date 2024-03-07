---
title: Secure Java Spring boot apps using groups and group claims
description: Shows you how to develop a Java Spring boot web app to restrict access to routes using security groups with the Microsoft identity platform.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Secure Java Spring boot apps using groups and group claims

This article demonstrates a Java Spring Boot web app that uses the [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) for authentication, authorization, and token acquisition with the [OpenID Connect](/entra/identity-platform/v2-protocols-oidc) protocol to sign in users, and restricts access to pages based on Azure Active Directory security group membership.

:::image type="content" source="./media/topology-spring.png" alt-text="Overview":::

An Identity Developer session covered Microsoft Entra ID App roles and security groups, featuring this scenario and how to handle the overage claim. [Watch the video Using Security Groups and Application Roles in your apps](https://www.youtube.com/watch?v=LRoc-na27l0).

## Scenario

1. This web application uses Microsoft Entra ID Spring Boot Starter client library for Java to sign in users in a Microsoft Entra ID tenant and obtain an [ID Token](/entra/identity-platform/id-tokens) from Microsoft Entra ID.
1. The ID token contains the groups claim. The application loads these claims into Spring GrantedAuthorities list for the signed-in user. These values determine which pages the user is authorized to access.

## Prerequisites

- [JDK Version 15](https://jdk.java.net/15/). This sample was developed on a system with Java 15 but may be compatible with other versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) is recommended for running this sample in VSCode.
- A Microsoft Entra ID tenant. For more information, see [Quickstart: Set up a tenant](/entra/identity-platform/quickstart-create-new-tenant)
- A user account in your Microsoft Entra ID tenant. This sample doesn't work with a personal Microsoft account. Therefore, if you signed in to the [Azure portal](https://portal.azure.com) with a personal account and have never created a user account in your directory before, you need to do that now.
- Two security groups, named **AdminGroup** and **UserGroup**, containing the user or users that you want to sign and test this sample. Or, you may add the user to two existing security groups in your tenant. If you choose to use existing groups, be sure to modify the sample configuration to use your existing security groups' name and object ID.
- [Visual Studio Code](https://code.visualstudio.com/download)
- [VS Code Azure Tools Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Setup

### Clone or download this repository

From your shell or command line:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-spring-tutorial.git
cd ms-identity-java-spring-tutorial
cd 3-Authorization-II/groups
```

or download and extract the repository *.zip* file.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

### Register the sample application with your Azure Active Directory tenant

There's one project in this sample. To register it, you can:

- follow the steps below for manually register your apps
- or use PowerShell scripts that:
  - **automatically** creates the Microsoft Entra ID applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.

> [!IMPORTANT]
> If you've never used **Azure AD Powershell** before, we recommend you go through the [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/3-Authorization-II/groups/AppCreationScripts/AppCreationScripts.md) in the source repository once to ensure that your environment is prepared correctly for this step.

### [Powershell](#tab/Powershell)

1. On Windows, run PowerShell as administrator and navigate to the root of the cloned directory.
1. If you've never used Azure AD Powershell before, we recommend you go through the [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/3-Authorization-II/groups/AppCreationScripts/AppCreationScripts.md) in the source repository once to ensure that your environment is prepared correctly for this step.
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
   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/3-Authorization-II/groups/AppCreationScripts/AppCreationScripts.md) in the source repository.
   > The scripts also provide a guide to automated application registration, configuration, and removal, which can help in your CI/CD scenarios.

### [Manual](#tab/Manual)

### Choose the Microsoft Entra ID tenant where you want to create your applications

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

### Register the web app (java-spring-webapp-groups)

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.
1. Select the **App Registrations** pane on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-groups`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file or files later in your code.
1. In the app's registration screen, select the **Certificates & secrets** pane in the left to open the page where you can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
1. Type a key description - for example, *app secret*.
1. Select one of the available key durations: **6 months**, **12 months** or **Custom**.
1. Select **Add**. The generated key value is displayed.
1. Copy and save the generated value for use in later steps. You need this key later in your code's configuration files. This key value isn't displayed again, and isn't retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or pane.
1. In the app's registration screen, select the **API permissions** pane in the left to open the page where we add access to the APIs that your application needs.
1. Select **Add a permission**.
1. Ensure that the **Microsoft APIs** tab is selected.
1. In the **Commonly used Microsoft APIs** section, select **Microsoft Graph**.
1. In the **Delegated permissions** section, select **GroupMember.Read.All** from the list. Use the search box if necessary. This permission is necessary for getting group memberships via Graph if the overage scenario occurs.
1. Select the button to grant admin consent for `GroupMember.Read.All`.
1. Select **Add permissions**.

### Create Security Groups

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.
1. Select **Groups** pane on the left.
1. In the **Groups** pane, select **New Group**.
    - For **Group Type**, select **Security**
    - For **Group Name**, enter **AdminGroup**
    - For **Group Description**, enter **Admin Security Group**
    - Add **Group Owners** and **Group Members** that you want to use and test in this sample.
    - Select **Create**.
1. In the **Groups** pane, select **New Group**.
    - For **Group Type**, select **Security**
    - For **Group Name**, enter **UserGroup**
    - For **Group Description**, enter **User Security Group**
    - Add **Group Owners** and **Group Members** that you want to use and test in this sample.
    - Select **Create**.

For more information, visit: [Create a basic group and add members using Microsoft Entra ID](/azure/active-directory/fundamentals/active-directory-groups-create-azure-portal)

### Configure Security Groups

You have two different options available to you on how you can further configure your application to receive the groups claim.

1. [Receive **all the groups** that the signed-in user is assigned to in a Microsoft Entra ID tenant, included nested groups](#configure-your-application-to-receive-all-the-groups-the-signed-in-user-is-assigned-to-including-nested-groups).

1. [Receive the **groups** claim values from a **filtered set of groups** that your application is programmed to work with](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-may-be-assigned-to) (Not available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing)).

> To get the on-premise group's `samAccountName` or `On Premises Group Security Identifier` instead of Group ID, see [Configure group claims for applications with Azure Active Directory](/azure/active-directory/hybrid/how-to-connect-fed-group-claims#prerequisites-for-using-group-attributes-synchronized-from-active-directory).

#### Configure your application to receive all the groups the signed-in user is assigned to, including nested groups

1. In the app's registration screen, select the **Token Configuration** pane in the left to open the page where you can configure the claims provided tokens issued to your application.
1. Select **Add groups claim** to open the **Edit Groups Claim** screen.
1. Select **Security groups** OR **All groups (includes distribution lists but not groups assigned to the application)**. Choosing both negates the effect of the **Security Groups** option.
1. Under the **ID** section, select **Group ID**. This selection causes Microsoft Entra ID to send the [object id](/graph/api/resources/group) of the groups the user is assigned to in the **groups** claim of the [ID Token](/entra/identity-platform/id-tokens) that your app receives after signing-in a user.

#### Configure your application to receive the groups claim values from a filtered set of groups a user may be assigned to

##### Prerequisites, benefits and limitations of using this option

1. This option is useful when your application is interested in a selected set of groups that a signing-in user may be assigned to and not every security group this user is assigned to in the tenant. This option also saves your application from running into the [overage](#the-groups-overage-claim) issue.
1. This feature isn't available in the [Microsoft Entra ID Free edition](https://www.microsoft.com/security/business/microsoft-entra-pricing).
1. **Nested group assignments** aren't available when this option is utilized.

##### Steps to enable this option in your app

1. In the app's registration screen, select the **Token Configuration** pane in the left to open the page where you can configure the claims provided tokens issued to your application.
1. Select the **Add groups claim** button on top to open the **Edit Groups Claim** screen.
1. Select **Groups assigned to the application** and don't selection any other options. Choosing more options, such as **Security Groups** or **All groups (includes distribution lists but not groups assigned to the application)**, negates the effect of the **Groups assigned to the application** option.
1. Under the **ID** section, select **Group ID**. This selection causes Microsoft Entra ID to send the object [id](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [ID Token](/entra/identity-platform/id-tokens) that your app receives after signing-in a user.
1. If you're exposing a Web API using the **Expose an API** option, then you can also choose the **Group ID** option under the **Access** section. This selection causes Microsoft Entra ID to send the [Object ID](/graph/api/resources/group) of the groups the user is assigned to in the groups claim of the [access token](/entra/identity-platform/access-tokens) issued to the client applications of your API.
1. In the app's registration screen, select on the **Overview** pane in the left to open the Application overview screen. Select the hyperlink with the name of your application in **Managed application in local directory**. This field title might be truncated - for example, **Managed application in ...**. When you select this link, you navigate to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the back button of your browser.
1. Select the **Users and groups** pane in the left to open the page where you can assign users and groups to your application.
    1. Select the **Add user** button on the top row.
    1. Select **User and Groups** from the resultant screen.
    1. Choose the groups that you want to assign to this application.
    1. Select **Select** to finish selecting the groups.
    1. Select **Assign** to finish the group assignment process.
    1. Your application now receives these selected groups in the groups claim when a user signing in to your app is a member of  one or more these **assigned** groups.
1. Select the **Properties** pane in the left to open the page that lists the basic properties of your application.Set the **User assignment required?** flag to **Yes**.

> [!IMPORTANT]
> When you set **User assignment required?** to **Yes**, Microsoft Entra ID checks that only users assigned to your application in the **Users and groups** pane are able to sign-in to your app. You can assign users directly or by assigning security groups they belong to.

---

### Configure your code sample to use your app registration and security groups (java-spring-webapp-groups)

Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

> [!NOTE]
> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

Open the *src\main\resources\application.yml* file.

1. Find the key `Enter_Your_Tenant_ID_Here` and replace the existing value with your Microsoft Entra tenant ID.
1. Find the key `Enter_Your_Client_ID_Here` and replace the existing value with the application ID (clientId) of `java-spring-webapp-groups` app copied from the Azure portal.
1. Find the key `Enter_Your_Client_Secret_Here` and replace the existing value with the key you saved during the creation of `java-spring-webapp-groups` copied from the Azure portal.
1. Find the key `Enter_Your_Admin_Group_ID_Here` and replace the existing value with objectId of your **AdminGroup**.
1. Find the key `Enter_Your_User_Group_ID_Here` and replace the existing value with the objectId of your **UserGroup**

Open the *src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java* file.

1. Find the key `Enter_Your_Admin_Group_ID_Here` and replace the existing value with objectId of your **AdminGroup**.
1. Find the key `Enter_Your_User_Group_ID_Here` and replace the existing value with the objectId of your **UserGroup**

## Run the sample

### [Deploy to Azure Spring Apps](#tab/asa)

#### Prerequisites

[!INCLUDE [deploy-spring-apps-intro.md](includes/deploy-spring-apps-intro.md)]

#### Prepare the Spring project

[!INCLUDE [deploy-spring-apps-prepare.md](includes/deploy-spring-apps-prepare.md)]

#### Configure the Maven plugin

[!INCLUDE [deploy-spring-apps-configure-maven.md](includes/deploy-spring-apps-configure-maven.md)]

#### Prepare the web app for deployment

[!INCLUDE [deploy-spring-apps-prepare-deploy.md](includes/deploy-spring-apps-prepare-deploy.md)]

[!INCLUDE [deploy-spring-apps-secret-note.md](includes/deploy-spring-apps-secret-note.md)]

#### Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-spring-apps-update-registration.md](includes/deploy-spring-apps-update-registration.md)]

#### Deploy the app

[!INCLUDE [deploy-spring-apps-deploy.md](includes/deploy-spring-apps-deploy.md)]

#### Validate the app

[!INCLUDE [deploy-spring-apps-validate.md](includes/deploy-spring-apps-validate.md)]

### [Run locally](#tab/local)

1. Open a terminal or the integrated VSCode terminal.
1. In the same directory as this readme file, run `mvn clean compile spring-boot:run`.
1. Open your browser and navigate to `http://localhost:8080`.

:::image type="content" source="./media/app.png" alt-text="Experience":::

---

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Select the context-sensitive button at the top right (it reads **Sign In** on first run)
- Alternatively, select **token details**, **admins only**, or **regular users**. Because these are protected pages that require authentication, you're automatically redirected to the sign-in page.
- Follow the instructions on the next page to sign in with an account in the Microsoft Entra ID tenant.
- On the consent screen, note the scopes that are being requested.
- Upon successful completion of the sign-in flow, you should be redirected to the home page (`sign in status`), or one of the other pages, depending on which button triggered your sign-in flow.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims, including **groups**.
- Select **Admins Only** to view the `/admin_only`. Only users belonging to the **AdminGroup** security group can view this page. Otherwise an authorization failure message is displayed.
- Select **Regular Users** to view the `/regular_user` page. Only users belonging to the **UserGroup** security group can view this page. Otherwise an authorization failure message is displayed.
- You can also use the button on the top right to sign out. The status page reflects this.

## Contents

| File/folder                                                                   | Description                                                                               |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| *AppCreationScripts/*                                                         | Scripts to automatically configure Microsoft Entra ID app registrations.                  |
| *pom.xml*                                                                     | Application dependencies.                                                                 |
| *src/main/resources/templates/*                                               | Thymeleaf Templates for UI.                                                               |
| *src/main/resources/application.yml*                                          | Application and Microsoft Entra ID Boot Starter Library Configuration.                    |
| *src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/* | This directory contains the main application entry point, controller, and config classes. |
| *.../MsIdentitySpringBootWebappApplication.java*                              | Main class.                                                                               |
| *.../SampleController.java*                                                   | Controller with endpoint mappings.                                                        |
| *.../SecurityConfig.java*                                                     | Security Configuration - for example, which routes require authentication.                |
| *.../Utilities.java*                                                          | Utility Class - for example, filter ID token claims.                                      |
| *CHANGELOG.md*                                                                | List of changes to the sample.                                                            |
| *CONTRIBUTING.md*                                                             | Guidelines for contributing to the sample.                                                |
| *LICENSE*                                                                     | The license for the sample.                                                               |

## About the code

This sample demonstrates how to use [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) to sign in users into your Microsoft Entra ID tenant. It also makes use of **Spring Oauth2 Client** and **Spring Web** boot starters. It uses claims from **ID Token** obtained from Azure Active Directory to display details of the signed-in user, and to restrict access to some pages by using the groups claim for authorization.

### Project Initialization

Create a new Java Maven project and copy the *pom.xml* file from this project, and the *src* folder of this repository.

If you'd like to create a project like this from scratch, you may use [Spring Initializer](https://start.spring.io):

- For **Packaging**, select **Jar**.
- For **Java**, select version **11**.
- For **Dependencies**, add the following:
  - Azure Active Directory
  - Spring Oauth2 Client
  - Spring Web
- Be sure that it comes with Azure SDK version 3.5 or higher. If not, consider replacing the pre-configured *pom.xml* with the *pom.xml* from this repository.

### ID Token Claims

To extract token details, make use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping. See the [Sample Controller](./src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for an example of this app making use of ID Token claims.

```java
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
//...
@GetMapping(path = "/some_path")
public String tokenDetails(@AuthenticationPrincipal OidcUser principal) {
    Map<String, Object> claims = principal.getIdToken().getClaims();
}
```

### Process a Groups claim in the ID token

The name of the roles that the signed-in user is assigned to is returned in the groups claim of the token.

```json
{
  ...
  "groups": [
    "xyz-id-xyz",
    "xyz-id-xyz",]
  ...
}
```

A common way to access them is documented in the **ID Token Claims** section above.
Microsoft Entra ID Boot Starter (v3.5 and above) parses the groups claim automatically and adds each group to the signed in user's **Authorities**. This allows developers to make use of groups with Spring **PrePost** condition annotations using the `hasAuthority` method. For example, you can find the following `@PreAuthorize` conditions demonstrated in *SampleController.java*:

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

To see a full list of authorities for a given user:

 ```java
@GetMapping(path = "/some_path")
public String tokenDetails(@AuthenticationPrincipal OidcUser principal) {
    Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
}
```

### Sign-in and sign-out links

To sign in, you must make a request to the Azure Active Directory sign-in endpoint that's automatically configured by **Microsoft Entra ID Spring Boot Starter client library for Java**.

```html
<a class="btn btn-success" href="/oauth2/authorization/azure">Sign In</a>
```

To sign out, you must make POST request to the **logout** endpoint.

```html
<form action="#" th:action="@{/logout}" method="post">
  <input class="btn btn-warning" type="submit" value="Sign Out" />
</form>
```

### Authentication-dependent UI elements

This app has some simple logic in the UI template pages for determining content to display based on whether the user is authenticated or not. For example, the following Spring Security Thymeleaf tags may be used:

```html
<div sec:authorize="isAuthenticated()">
  this content only shows to authenticated users
</div>
<div sec:authorize="isAnonymous()">
  this content only shows to not-authenticated users
</div>
```

### Protect routes with AADWebSecurityConfigurerAdapter

By default, this app protects the **ID Token Details**, **Admins Only** and **Regular Users** pages so that only logged-in users can access them. This app uses configures these routes from the `app.protect.authenticated` property from the *application.yml* file. To configure your app's specific requirements, extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](./src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class.

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

To ensure that the token size doesn’t exceed HTTP header size limits, the Microsoft identity platform limits the number of object Ids that it includes in the **groups** claim.

If a user is member of more groups than the overage limit (**150 for SAML tokens, 200 for JWT tokens, 6 for single-page applications**), then the Microsoft identity platform does not emit the group IDs in the groups claim in the token. Instead, it includes an **overage** claim in the token that indicates to the application to query the [MS Graph API](https://graph.microsoft.com) to retrieve the user’s group membership.

Microsoft Entra ID Boot Starter (v3.5 and above) parses the groups claim automatically and adds each group to the signed in user's **Authorities**. It **automatically** handles the groups overage scenario.

> We strongly advise you use the [group filtering feature](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-may-be-assigned-to) (if possible) to avoid running into group overages.

#### Create the Overage Scenario for testing

1. You can use the *BulkCreateGroups.ps1* file provided in the *AppCreationScripts* folder to create a large number of groups and assign users to them. This file helps test overage scenarios during development. Remember to change the user's **objectId** provided in the *BulkCreateGroups.ps1* script.

When attending to overage scenarios, which requires a call to [Microsoft Graph](https://graph.microsoft.com) to read the signed-in user's group memberships, your app needs to have the [User.Read](/graph/permissions-reference#user-permissions) and [GroupMember.Read.All](/graph/permissions-reference#group-permissions) for the [getMemberGroups](/graph/api/user-getmembergroups) function to execute successfully.

> [!IMPORTANT]
> For the overage scenario, make sure you've granted **Admin Consent** for the MS Graph API's **GroupMember.Read.All** scope for both the Client and the Service apps (see the **App Registration** steps above).

#### Update the Microsoft Entra ID app registration (java-spring-webapp-groups)

1. Navigate back to to the [Azure portal](https://portal.azure.com).
In the left-hand navigation pane, select the **Azure Active Directory** service, and then select **App registrations (Preview)**.
1. In the resulting screen, select the `java-spring-webapp-groups` application.
1. In the app's registration screen, select **Authentication** in the menu.
   - In the **Redirect URIs** section, update the reply URLs to match the site URL of your Azure deployment. For example:
      - `https://java-spring-webapp-groups.azurewebsites.net/login/oauth2/code/`

> [!IMPORTANT]
> If your app is using an *in-memory* storage, Azure App Services spins down your web site if it is inactive, and any records that your app was keeping are emptied. In addition, if you increase the instance count of your website, requests are distributed among the instances. Your apps records, therefore, aren't the same on each instance.

## More information

- [Microsoft identity platform (Azure Active Directory for developers)](/entra/identity-platform/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](/entra/identity-platform/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs (Preview)](/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Azure Active Directory](/entra/identity-platform/app-objects-and-service-principals)
- [National Clouds](/entra/identity-platform/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
    // Add MSAL-java docs

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
