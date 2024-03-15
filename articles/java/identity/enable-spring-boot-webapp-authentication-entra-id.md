---
title: Secure Java Spring Boot apps using Microsoft Entra ID
titleSuffix: Azure
description: Shows you how to develop a Java Spring Boot web app that supports sign-in by Microsoft Entra account.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Secure Java Spring Boot apps using Microsoft Entra ID

This article demonstrates a Java Spring Boot web app that signs in users on your Microsoft Entra ID tenant using the [Microsoft Entra ID Spring Boot Starter client library for Java](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-active-directory). It uses the OpenID Connect protocol.

The following diagram shows the topology of the app:

:::image type="content" source="media/topology-spring.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses the Microsoft Entra ID Spring Boot Starter client library for Java to sign-in a user and obtain an ID token from Microsoft Entra ID. The ID token proves that the user is authenticated with Microsoft Entra ID and enables the user to access protected routes.

## Prerequisites

[!INCLUDE [prerequisites-spring-boot.md](includes/prerequisites-spring-boot.md)]

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-spring-tutorial.git
cd ms-identity-java-spring-tutorial
cd 1-Authentication/sign-in
```

Alternatively, navigate to the [ms-identity-java-spring-tutorial](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial) repository, then download it as a *.zip* file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid path length limitations on Windows, we recommend cloning into a directory near the root of your drive.

### Register the sample applications with your Microsoft Entra ID tenant

There's one project in this sample. To register the app on the Azure portal, you can either follow manual configuration steps or use a PowerShell script. The script does the following tasks:

- Creates the Microsoft Entra ID applications and related objects, such as passwords, permissions, and dependencies.
- Modifies the project configuration files.
- By default, sets up an application that works with accounts in your organizational directory only.

### [Use PowerShell](#tab/PowerShell)

Use the following steps to run the PowerShell script:

1. On Windows, open PowerShell and navigate to the root of the cloned directory.

1. Use the following command to set the execution policy for PowerShell:

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Use the following commands to run the configuration script:

   ```powershell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > [!NOTE]
   > Other ways of running the scripts are described in [App Creation Scripts](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/1-Authentication/sign-in/AppCreationScripts/AppCreationScripts.md). The scripts also provide a guide to automated application registration, configuration, and removal, which can help in your CI/CD scenarios.

### [Use manual steps](#tab/Manual)

The following sections show you how to register the app manually.

#### Choose the Microsoft Entra ID tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Microsoft Entra ID tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Microsoft Entra ID tenant.

#### Register the app (java-spring-webapp-auth)

Use the following steps to register the app:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Microsoft Entra ID**.
1. Select **App Registrations** on the navigation pane, then select **New registration**.
1. In the **Register an application page** that appears, enter the following application registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-auth`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.
1. In the app's registration screen, select **Certificates & secrets** on the navigation pane to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**.
1. Type a key description - for example, *app secret*.
1. Select one of the available key durations: **In 1 year**, **In 2 years**, or **Never Expires**.
1. Select **Add**. The generated key value is displayed.
1. Copy and save the generated value for use in later steps. You need this key for your code's configuration files. This key value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

---

#### Configure the app (java-spring-webapp-auth) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the *src\main\resources\application.yml* file.

1. Find the key `Enter_Your_Tenant_ID_Here` and replace the existing value with your Microsoft Entra tenant ID.

1. Find the key `Enter_Your_Client_ID_Here` and replace the existing value with the application ID or `clientId` of the `java-spring-webapp-auth` app copied from the Azure portal.

1. Find the key `Enter_Your_Client_Secret_Here` and replace the existing value with the key you saved during the creation of `java-spring-webapp-auth` copied from the Azure portal.

## Run the sample

### [Deploy to Azure Spring Apps](#tab/asa)

The following sections show you how to deploy the sample to Azure Spring Apps.

### Prerequisites

[!INCLUDE [deploy-spring-apps-intro.md](includes/deploy-spring-apps-intro.md)]

### Prepare the Spring project

[!INCLUDE [deploy-spring-apps-prepare.md](includes/deploy-spring-apps-prepare.md)]

### Configure the Maven plugin

[!INCLUDE [deploy-spring-apps-configure-maven.md](includes/deploy-spring-apps-configure-maven.md)]

### Prepare the web app for deployment

[!INCLUDE [deploy-spring-apps-prepare-deploy.md](includes/deploy-spring-apps-prepare-deploy.md)]

[!INCLUDE [deploy-spring-apps-secret-note.md](includes/deploy-spring-apps-secret-note.md)]

### Update your Microsoft Entra ID app registration

[!INCLUDE [deploy-spring-apps-update-registration.md](includes/deploy-spring-apps-update-registration.md)]

### Deploy the app

[!INCLUDE [deploy-spring-apps-deploy.md](includes/deploy-spring-apps-deploy.md)]

### Validate the app

[!INCLUDE [deploy-spring-apps-validate.md](includes/deploy-spring-apps-validate.md)]

### [Run locally](#tab/local)

To run the sample locally, use the following steps:

1. Open a Bash window or the integrated Visual Studio Code terminal.

1. In the root directory of the app project, use the following command:

   ```bash
   mvn clean compile spring-boot:run
   ```

1. Open your browser and navigate to `http://localhost:8080`. You should see a screen with the text `You're signed in! Click here to get your ID Token Details`.

:::image type="content" source="media/app.png" alt-text="Screenshot of the sample app.":::

---

## Explore the sample

- Notice the signed-in or signed-out status displayed at the center of the screen.
- Select the context-sensitive button in the corner. This button reads **Sign In** when you first run the app.
  - Alternatively, select **token details**. Because this page is protected and requires authentication, you're automatically redirected to the sign-in page.
- On the next page, follow the instructions and sign in with an account in the Microsoft Entra ID tenant.
- On the consent screen, note the scopes that are being requested.
- Upon successful completion of the sign-in flow, you should be redirected to the home page - which shows the **sign in status** - or the **token details** page, depending on which button triggered your sign-in flow.
- Notice that the context-sensitive button now says **Sign out** and displays your user name.
- If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims.
- You can also use the button in the corner to sign out. The status page reflects the new state.

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

This sample demonstrates how to use [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory) to sign in users into your Microsoft Entra ID tenant. It also makes use of **Spring Oauth2 Client** and **Spring Web** boot starters. It uses claims from **ID Token** obtained from Microsoft Entra ID to display details of the signed-in user.

### Project initialization

Create a new Java Maven project and copy the *pom.xml* file from this project, and the *src* folder of this repository.

If you'd like to create a project like this from scratch, you can use [Spring Initializer](https://start.spring.io):

- For **Packaging**, select **Jar**.
- For **Java**, select version **11**.
- For **Dependencies**, add the following items:
  - **Microsoft Entra ID**
  - **Spring Oauth2 Client**
  - **Spring Web**
- Be sure that it comes with Azure SDK version 3.3 or higher. If not, consider replacing the preconfigured *pom.xml* with the *pom.xml* from this repository.

### ID token claims

To extract token details, make use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping. See the [Sample Controller](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for an example of this app making use of ID token claims.

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

To sign in, you must make a request to the Microsoft Entra ID sign-in endpoint automatically configured by Microsoft Entra ID Spring Boot Starter client library for Java.

```html
<a class="btn btn-success" href="/oauth2/authorization/azure">Sign In</a>
```

To sign out, you must make POST request to the `logout` endpoint, as shown in the following example:

```html
<form action="#" th:action="@{/logout}" method="post">
  <input class="btn btn-warning" type="submit" value="Sign Out" />
</form>
```

### Authentication-dependent UI elements

This app has some simple logic in the UI template pages for determining content to display based on whether the user is authenticated or not. For example, you can use the following Spring Security Thymeleaf tags:

```html
<div sec:authorize="isAuthenticated()">
  this content only shows to authenticated users
</div>
<div sec:authorize="isAnonymous()">
  this content only shows to not-authenticated users
</div>
```

### Protect routes with AADWebSecurityConfigurerAdapter

By default, this app protects the **ID Token Details** page so that only logged-in users can access it. This app uses configures these routes from the `app.protect.authenticated` property from the *application.yml* file. To configure your app's specific requirements, extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class.

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
      .antMatchers(protectedRoutes).authenticated()     // limit these pages to authenticated users (default: /token_details)
      .antMatchers("/**").permitAll();                  // allow all other routes.
    }
}
```

## More information

- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Overview of Microsoft Authentication Library (MSAL)](/entra/identity-platform/msal-overview)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](/entra/identity-platform/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs (Preview)](/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals)
- [National Clouds](/entra/identity-platform/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-active-directory)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID tokens](/entra/identity-platform/id-tokens)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
