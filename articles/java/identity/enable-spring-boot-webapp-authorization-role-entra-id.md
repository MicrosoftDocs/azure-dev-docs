---
title: Secure Java Spring Boot apps using roles and role claims
titleSuffix: Azure
description: Shows you how to enable your Java Spring Boot web app to restrict access to routes using app roles with the Microsoft identity platform.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: how-to
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Secure Java Spring Boot apps using roles and role claims

This article demonstrates a Java Spring Boot web app that uses the [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) for authentication, authorization, and token acquisition. The app uses the [OpenID Connect](/entra/identity-platform/v2-protocols-oidc) protocol to sign in users, and restricts access to some routes using [Microsoft Entra ID Application Roles (app roles)](/entra/identity-platform/howto-add-app-roles-in-apps) for authorization.

App roles, along with security groups, are popular means to implement authorization. Using role-based access control (RBAC) with application roles and role claims, you can securely enforce authorization policies with minimal effort. Another approach is to use Microsoft Entra ID groups and group claims. Microsoft Entra ID groups and application roles aren't mutually exclusive. You can use them both to provide fine-grained access control.

For a video that covers a similar scenario, see [Implement authorization in your applications using app roles, security groups, scopes, and directory roles](https://www.youtube.com/watch?v=LRoc-na27l0).

For more information about how the protocols work in this scenario and other scenarios, see [Authentication vs. authorization](/entra/identity-platform/authentication-vs-authorization).

The following diagram shows the topology of the app:

:::image type="content" source="media/topology-spring.png" alt-text="Diagram that shows the topology of the app.":::

The app uses the Microsoft Entra ID Spring Boot Starter client library for Java to sign in a user and obtain an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID. The ID token contains the roles claim. The application inspects the value of this claim to determine which pages the user is authorized to access.

This kind of authorization is implemented using RBAC. With RBAC, an administrator grants permissions to roles, not to individual users or groups. The administrator can then assign roles to different users and groups to control who has access to certain content and functionality.

This sample application defines the following two Application Roles:

- `PrivilegedAdmin`: Authorized to access the **Admins Only** and the **Regular Users** pages.
- `RegularUser`: Authorized to access the **Regular Users** page.

These application roles are defined in the [Azure portal](https://portal.azure.com) in the application's registration manifest. When a user signs into the application, Microsoft Entra ID emits a roles claim for each role granted individually to the user in the form of role membership.

You can assign users and groups to roles through the Azure portal.

> [!NOTE]
> Role claims aren't present for guest users in a tenant if the `https://login.microsoftonline.com/common/` endpoint is used as the authority to sign in users. You need to sign-in a user to a tenanted endpoint like `https://login.microsoftonline.com/tenantid`.

## Prerequisites

[!INCLUDE [prerequisites-spring-boot.md](includes/prerequisites-spring-boot.md)]

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-msal-java-samples.git
cd 4-spring-web-app/3-Authorization-II/roles
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

#### Register the app (java-spring-webapp-roles)

To register the app, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.

1. Select **App Registrations** on the navigation pane, then select **New registration**.

1. In the **Register an application page** that appears, enter the following application registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-roles`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.

1. Select **Register** to create the application.

1. On the app's registration page, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.

1. On the app's registration page, select **Certificates & secrets** on the navigation pane to open the page where you can generate secrets and upload certificates.

1. In the **Client secrets** section, select **New client secret**.

1. Type a description - for example, **app secret**.

1. Select one of the available durations: **In 1 year**, **In 2 years**, or **Never Expires**.

1. Select **Add**. The generated value is displayed.

1. Copy and save the generated value for use in later steps. You need this value for your code's configuration files. This value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

#### Define the app roles

To define the app roles, use the following steps:

1. Still on the same app registration, select **App roles** on the navigation pane.

1. Select **Create app role**, then enter the following values:

   - For **Display name**, enter a suitable name - for example, **PrivilegedAdmin**.
   - For **Allowed member types**, choose **User**.
   - For **Value**, enter **PrivilegedAdmin**.
   - For **Description**, enter **PrivilegedAdmins who can view the Admin Page**.

1. Select **Create app role**, then enter the following values:

   - For **Display name**, enter a suitable name - for example, **RegularUser**.
   - For **Allowed member types**, choose **User**.
   - For **Value**, enter **RegularUser**.
   - For **Description**, enter **RegularUsers who can view the User Page**.

1. Select **Apply** to save your changes.

#### Assign users to app roles

To add users to the app role defined earlier, follow the guidelines here: [Assign users and groups to roles.](/entra/identity-platform/howto-add-app-roles-in-apps#assign-users-and-groups-to-microsoft-entra-roles)

---

### Configure the app (java-spring-webapp-roles) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the **src\main\resources\application.yml** file.

1. Find the placeholder `Enter_Your_Tenant_ID_Here` and replace the existing value with your Microsoft Entra tenant ID.

1. Find the placeholder `Enter_Your_Client_ID_Here` and replace the existing value with the application ID or `clientId` of the `java-spring-webapp-roles` app copied from the Azure portal.

1. Find the placeholder `Enter_Your_Client_Secret_Here` and replace the existing value with the value you saved during the creation of `java-spring-webapp-roles` copied from the Azure portal.

1. Open the **src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootapplication/Sample.Controller.java** file.

1. Find the references to the `PrivilegedAdmin` and `RegularUser` app roles in this file. If necessary, change them to reflect the app role names you chose in the previous steps.

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
1. If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims, including roles.
1. Select **Admins Only** to view the `/admin_only`. Only users with app role `PrivilegedAdmin` can view this page. Otherwise, an authorization failure message is displayed.
1. Select **Regular Users** to view the `/regular_user` page. Only users with app role `RegularUser` or `PrivilegedAdmin` can view this page. Otherwise, an authorization failure message is displayed.
1. Use the button in the corner to sign out. The status page reflects the new state.

## About the code

This sample demonstrates how to use [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) to sign in users into your Microsoft Entra ID tenant. The sample also makes use of the Spring Oauth2 Client and Spring Web boot starters. The sample uses claims from the ID token obtained from Microsoft Entra ID to display the details of the signed-in user, and to restrict access to some pages by using the roles claim for authorization.

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
| **LICENSE`**                                                                    | The license for the sample.                                                               |

### ID token claims

To extract token details, the app makes use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping, as shown in the following example. See the [Sample Controller](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/3-Authorization-II/roles/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for the full details of how this app makes use of ID token claims.

```java
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
//...
@GetMapping(path = "/some_path")
public String tokenDetails(@AuthenticationPrincipal OidcUser principal) {
    Map<String, Object> claims = principal.getIdToken().getClaims();
}
```

### Process a roles claim in the ID token

The roles claim of the token includes the names of the roles that the signed-in user is assigned to, as shown in the following example:

```json
{
  ...
  "roles": [
    "PrivilegedAdmin",
    "RegularUser",]
  ...
}
```

A common way to access the role names is documented in the [ID token claims](#id-token-claims) section.

Microsoft Entra ID Boot Starter v3.3 and higher also parses the roles claim automatically and adds each role to the signed-in user's `Authorities`, prefixing each with the string `APPROLE_`. This configuration enables developers to make use of app roles with Spring `PrePost` condition annotations using the `hasAuthority` method. For example, you can find the following `@PreAuthorize` conditions demonstrated in **SampleController.java**:

```java
@GetMapping(path = "/admin_only")
@PreAuthorize("hasAuthority('APPROLE_PrivilegedAdmin')")
public String adminOnly(Model model) {
    // restrict to users who have PrivilegedAdmin app role only
}
@GetMapping(path = "/regular_user")
@PreAuthorize("hasAnyAuthority('APPROLE_PrivilegedAdmin','APPROLE_RegularUser')")
public String regularUser(Model model) {
    // restrict to users who have any of RegularUser or PrivilegedAdmin app roles
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

By default, the app protects the **ID Token Details**, **Admins Only**, and **Regular Users** pages so that only signed-in users can access them. The app configures these routes from the `app.protect.authenticated` property from the **application.yml** file. To configure your app's specific requirements, you can extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/3-Authorization-II/roles/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class, shown in the following code:

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
- [Azure Active Directory Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID tokens](/entra/identity-platform/id-tokens)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
