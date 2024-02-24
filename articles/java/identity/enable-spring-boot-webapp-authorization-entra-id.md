---
title: Enable your Java Spring Boot web app to sign in users and access resources on Microsoft Graph
description: Shows you how to develop a Java Spring Boot web app to sign in users and call Microsoft Graph with the Microsoft identity platform.
services: active-directory
ms.date: 01/01/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Enable your Java Spring Boot web app to sign in users and access resources on Microsoft Graph

This article demonstrates a Java Spring Boot web app that signs in users and obtains an access token for calling [Microsoft Graph](/graph/overview). It uses the [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) for authentication, authorization, and token acquisition. It leverages [Microsoft Graph SDK for Java](https://github.com/microsoftgraph/msgraph-sdk-java) to obtain data from Graph.

:::image type="content" source="./ReadmeFiles/topology.png" alt-text="Overview":::

## Scenario

1. This Java Spring MVC web app leverages the **Microsoft Entra ID Spring Boot Starter client library for Java** to obtain an [Access Token](/entra/identity-platform/access-tokens) for [Microsoft Graph](/graph/overview) from **Microsoft Entra ID**.
1. The **Access Token** proves that the user is authorized to access the Microsoft Graph API endpoint as defined in the scope.

[!INCLUDE [spring-mvc-prereqs.md](includes/spring-mvc-prereqs.md)]

[!INCLUDE [spring-mvc-overview-recommendation.md](includes/spring-mvc-overview-recommendation.md)]

## Setup

### Clone or download this repository

From your shell or command line:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-spring-tutorial.git
cd ms-identity-java-spring-tutorial
cd 2-Authorization-I/call-graph
```

or download and extract the repository *.zip* file.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

### Register the sample application(s) with your Azure Active Directory tenant

There is one project in this sample. To register it, you can:

- follow the steps below for manually register your apps
- or use PowerShell scripts that:
  - **automatically** creates the Microsoft Entra ID applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.

> [!IMPORTANT]
> If you have never used **Azure AD Powershell** before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.

### [Powershell](#tab/Powershell)

1. On Windows, run PowerShell as **Administrator** and navigate to the root of the cloned directory
1. If you have never used Azure AD Powershell before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.
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
   > Other ways of running the scripts are described in [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md)
   > The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

### [Manual](#tab/Manual)

### Choose the Microsoft Entra ID tenant where you want to create your applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Microsoft Entra ID tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Microsoft Entra ID tenant.

### Register the webApp app (java-spring-webapp-call-graph)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Microsoft Entra ID** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app, for example `java-spring-webapp-call-graph`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security posture.
   - The generated key value is displayed when you select the **Add** button. Copy the generated value for use in the steps later.
   - You'll need this key later in your code's configuration files. This key value isn't displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.
1. In the app's registration screen, click on the **API permissions** blade in the left to open the page where we add access to the Apis that your application needs.
   - Click the **Add permissions** button and then,
   - Ensure that the **Microsoft APIs** tab is selected.
   - In the *Commonly used Microsoft APIs* section, click on **Microsoft Graph**
   - In the **Delegated permissions** section, select the **User.Read** in the list. Use the search box if necessary.
   - Click on the **Add permissions** button in the bottom.

---

#### Configure the webApp app (java-spring-webapp-call-graph) to use your app registration

Open the project in your IDE (Visual Studio Code or IntelliJ IDEA) to configure the code.

> [!NOTE]
> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the *src\main\resources\application.yml* file.
1. Find the key `Enter_Your_Tenant_ID_Here` and replace the existing value with your Microsoft Entra tenant ID.
1. Find the key `Enter_Your_Client_ID_Here` and replace the existing value with the application ID (clientId) of `java-spring-webapp-call-graph` app copied from the Azure portal.
1. Find the key `Enter_Your_Client_Secret_Here` and replace the existing value with the key you saved during the creation of `java-spring-webapp-call-graph` copied from the Azure portal.

## Running the sample

### [Deploy to Azure Spring Apps](#tab/asa)

#### Prerequisites

[!INCLUDE [deploy-spring-apps-intro.md](includes/deploy-spring-apps-intro.md)]

#### Prepare the Spring project

[!INCLUDE [deploy-spring-apps-prepare.md](includes/deploy-spring-apps-prepare.md)]

#### Configure the Maven plugin

[!INCLUDE [deploy-spring-apps-congigure-maven.md](includes/deploy-spring-apps-configure-maven.md)]

#### Prepare the web app for deployment

[!INCLUDE [deploy-spring-apps-prepare-deploy.md](includes/deploy-spring-apps-prepare-deploy.md)]

[!INCLUDE [deploy-spring-apps-secret-note.md](includes/deploy-spring-apps-secret-note.md)]

#### Update your Microsoft Entra ID App Registration

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
- Click the context-sensitive button at the top right (it reads `Sign In` on first run)
  - Alternatively, click the link to `token details` or `call graph`. Since this is a protected page that requires authentication, you'll be automatically redirected to the sign-in page.
- Follow the instructions on the next page to sign in with an account in the Microsoft Entra ID tenant.
- On the consent screen, note the scopes that are being requested.
- Upon successful completion of the sign-in flow, you should be redirected to the home page (`sign in status`), or one of the other pages, depending on which button triggered your sign-in flow.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- If you are on the home page, you'll see an option to click **ID Token Details**: click it to see some of the ID token's decoded claims.
- Click the **Call Graph** button to make a call to Microsoft Graph's [/me endpoint](/graph/api/user-get?view=graph-rest-1.0&tabs=java#example-2-signed-in-user-request) endpoint and see a selection of user details obtained.
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
| *.../SecurityConfig.java*                                                     | Security Configuration (e.g., which routes require authentication?).                      |
| *.../Utilities.java*                                                          | Utility Class (e.g., filter ID token claims, MS Graph SDK initialization and use).        |
| *CHANGELOG.md*                                                                | List of changes to the sample.                                                            |
| *CONTRIBUTING.md*                                                             | Guidelines for contributing to the sample.                                                |
| *LICENSE*                                                                     | The license for the sample.                                                               |

## About the code

This sample demonstrates how to use [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) to sign in users into your Microsoft Entra ID tenant and obtain an **Access Token** for calling **Microsoft Graph**. It also makes use of **Spring Oauth2 Client** and **Spring Web** boot starters.

### Project Initialization

Create a new Java Maven project and copy the *pom.xml* file from this project, and the *src* folder of this repository.

If you'd like to create a project like this from scratch, you may use [Spring Initializer](https://start.spring.io):

- For **Packaging**, select `Jar`
- For **Java** select version `11`
- For **Dependencies**, add the following:
  - Azure Active Directory
  - Spring Oauth2 Client
  - Spring Web
- Be sure that it comes with Azure SDK version 3.3 or higher. If not, please consider replacing the pre-configured *pom.xml* with the *pom.xml* from this repository.

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

### Sign-in and sign-out links

To sign in, you must make a request to the Azure Active Directory sign-in endpoint that is automatically configured by **Microsoft Entra ID Spring Boot Starter client library for Java**.

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

### Protecting routes with AADWebSecurityConfigurerAdapter

By default, this app protects the **ID Token Details** and **Call Graph** pages so that only logged-in users can access them. This app uses configures these routes from the `app.protect.authenticated` property from the *application.yml* file. To configure your app's specific requirements, extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](./src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class.

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
      .antMatchers(protectedRoutes).authenticated()     // limit these pages to authenticated users (default: /token_details, /call_graph)
      .antMatchers("/**").permitAll();                  // allow all other routes.
    }
}
```

### Call Graph

When the user navigates to `/call_graph`, the application creates an instance of the GraphServiceClient ([Microsoft Graph SDK for Java, v3](https://github.com/microsoftgraph/msgraph-sdk-java)), utilizing an Oauth2AuthorizedClient (`graphAuthorizedClient`) that AAD boot starter has prepared. The app asks the GraphServiceClient to call the  `/me` endpoint and displays details for the currently-signed-in user.

The Oauth2AuthorizedClient must be prepared with the correct scopes (see *application.yml* and the following **Scopes** section). It is used to surface the access token and place it in the Authorization header of GraphServiceClient requests.

```java
//see SampleController.java
@GetMapping(path = "/call_graph")
public String callGraph(@RegisteredOAuth2AuthorizedClient("graph") OAuth2AuthorizedClient graphAuthorizedClient) {
  // See the Utilities.graphUserProperties() method for the full example of the following operation:
  GraphServiceClient graphServiceClient = Utilities.getGraphServiceClient(graphAuthorizedClient);
  User user = graphServiceClient.me().buildRequest().get();
  return user.displayName;
}
```

```yml
# see application.yml file
authorization-clients:
  graph:
    # Specifies the Microsoft Graph scopes that your app needs access to:
    scopes: https://graph.microsoft.com/User.Read
```

### Scopes

[Scopes](/entra/identity-platform/v2-permissions-and-consent) tell Microsoft Entra ID the level of access that the application is requesting. Note the Microsoft Graph scopes requested by this application by referring to [application.yml](./src/main/resources/application.yml).

- By default, this application sets the scopes value to `https://graph.microsoft.com/User.Read`.
- The `User.Read` scope is for accessing the information of the currently-signed-in user from the [/me endpoint](https://graph.microsoft.com/v1.0/me).
- Valid requests to the [/me endpoint](https://graph.microsoft.com/v1.0/me) must contain the `User.Read` scope.

Upon signing in, Microsoft Entra ID presents a consent dialogue to the user, based on the scopes requested by the application. If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting **Access Token**.

In this app, the `graphAuthorizedClient` (see previous section) surfaces the **Access Token** that proves which the scopes the user has consented to. The app leverages this to create an instance of `GraphServiceClient` (discussed above) that handles Graph requests.

Using `GraphServiceClient.me().buildRequest().get()`, a request built and made to `https://graph.microsoft.com/v1.0/me`. The **Access Token** is placed in the Authorization header of the request.

## Deployment

[Deploy to Azure App Service](../../4-Deployment/deploy-to-azure-app-service). Prepare your app for deployment to Azure App Service, configure authentication parameters and use various Azure services for managing your operations.

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
- [Azure Active Directory Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-active-directory)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID Tokens](/entra/identity-platform/id-tokens)
- [Access Tokens](/entra/identity-platform/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).

