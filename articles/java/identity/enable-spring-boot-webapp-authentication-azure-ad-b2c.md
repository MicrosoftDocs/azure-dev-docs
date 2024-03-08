---
title: Secure Spring Boot apps using Azure Active Directory B2C
description: Shows you how to develop a Java Spring Boot web app that supports sign-in by Azure Active Directory B2C.
services: active-directory
ms.date: 03/11/2024
ms.service: active-directory
ms.subservice: B2C
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Secure Java Spring Boot apps using Azure Active Directory B2C

This article demonstrates a Java Spring Boot web app that signs in users on your Azure Active Directory B2C tenant using the [Azure AD B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-active-directory-b2c). It uses the OpenID Connect protocol.

## Scenario

1. The client Java Spring web app uses the Azure AD B2C Spring Boot Starter client library for Java to sign in a user and obtain an ID token from Azure AD B2C.

1. The **ID token proves that the user has successfully authenticated with Azure AD B2C and allows the user to access protected routes.

:::image type="content" source="./media/topology-spring.png" alt-text="Overview":::

## Prerequisites

- [JDK Version 15](https://jdk.java.net/15/). This sample was developed on a system with Java 15 but may be compatible with other versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) is recommended for running this sample in VSCode.
- An Azure AD B2C tenant. For more information, see [Tutorial: Create an Azure Active Directory B2C tenant](/azure/active-directory-b2c/tutorial-create-tenant)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [VS Code Azure Tools Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Setup

### Clone or download this repository

From your shell or command line:

```bash
git clone https://github.com/Azure-Samples/ms-identity-java-spring-tutorial.git
cd ms-identity-java-spring-tutorial
cd 1-Authentication/sign-in-b2c
```

or download and extract the repository *.zip* file.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

This sample comes with a pre-registered application for demo purposes. If you would like to use your own Azure AD B2C tenant and application, follow the steps below to register and configure the application on Azure portal. Otherwise, continue with the steps for Running the sample.

### Choose the Azure AD B2C tenant where you want to create your applications

As a first step, you need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD B2C tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Azure AD B2C tenant.

### Create user flows and custom policies

To create common user flows like sign up, sign in, edit profile, and password reset, see [Tutorial: Create user flows in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-create-user-flows).

You may consider creating [Custom policies in Azure Active Directory B2C](/azure/active-directory-b2c/custom-policy-overview) as well, however, this is beyond the scope of this tutorial.

### Add external identity providers

See [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-add-identity-providers).

### Register the web app (java-spring-webapp-auth-b2c)

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Azure AD B2C**.
1. Select the **App Registrations** pane on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-auth-b2c`.
   - Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file or files later in your code.
1. Select **Save** to save your changes.

1. In the app's registration screen, select the **Certificates & secrets** pane in the navigation pane to open the page to generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**.
1. Type a key description - for example, *app secret*.
1. Select one of the available key durations as per your security concerns - for example, **In 2 years**.
1. Select **Add**. The generated key value is displayed.
1. Copy the generated value for use in the steps later. You need this key later in your code's configuration files. This key value isn't displayed again, and isn't retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or pane.

#### Configure the web app (java-spring-webapp-auth-b2c) to use your app registration

Open the project in your IDE (like **Visual Studio Code**) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

Open the *src/main/resources/application.yml* file.

1. Find the key `client-id` and replace the existing value with the application ID (clientId) of the `java-spring-webapp-auth-b2c` application from the Azure portal.
1. Find the app key `client-secret` and replace the existing value with the key you saved during the creation of the `java-spring-webapp-auth-b2c` application from the Azure portal.
1. Find the app key `base-uri` and replace the two instances of `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.
1. Find the app key `sign-up-or-sign-in` and replace it with the name of the sign-up/sign-in user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.
1. Find the app key `profile-edit` and replace it with the name of the password reset user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.
1. Find the app key `password-reset` and replace it with the name of the edit profile user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.

Open the *src/main/resources/templates/navbar.html* file.

1. Find the references to the references to `b2c_1_susi` and `b2c_1_edit_profile` flows and replace them with your `sign-up-sign-in` and `profile-edit` user-flows.

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
- Select the context-sensitive button at the top right (it reads **Sign In** on first run).
  - Alternatively, select the link to **token details**. Because this is a protected page that requires authentication, you're automatically redirected to the sign-in page.
- Follow the instructions on the next page to sign in with an account of your chosen identity provider. You may also choose to sign up or sign in to a local account on the B2C tenant using an email address.
- Upon successful completion of the sign-in flow, you should be redirected to the home page (`sign in status`) or `token details` page, depending on which button triggered your sign-in flow.
- Note the context-sensitive button now says **Sign out** and displays your username to its left.
- If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims.
- You also have the option to edit your profile. Select **edit profile** to change details like your display name, place of residence, and profession.
- You can also use the button on the top right to sign out. The status page reflects this.

## Contents

| File/folder                                                                   | Description                                                                               |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| *pom.xml*                                                                     | Application dependencies.                                                                 |
| *src/main/resources/templates/*                                              | Thymeleaf Templates for UI.                                                               |
| *src/main/resources/application.yml*                                          | Application and Azure AD Boot Starter Library Configuration.                              |
| *src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/* | This directory contains the main application entry point, controller, and config classes. |
| *.../MsIdentitySpringBootWebappApplication.java*                              | Main class.                                                                               |
| *.../SampleController.java*                                                   | Controller with endpoint mappings.                                                        |
| *.../SecurityConfig.java*                                                     | Security Configuration - for example, which routes require authentication.                |
| *.../Utilities.java*                                                          | Utility Class - for example, filter ID token claims.                                      |
| *CHANGELOG.md*                                                                | List of changes to the sample.                                                            |
| *CONTRIBUTING.md*                                                             | Guidelines for contributing to the sample.                                                |
| *LICENSE*                                                                     | The license for the sample.                                                               |

## About the code

This sample demonstrates how to use [Azure AD B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c) to sign in users into your Azure AD tenant. It also makes use of **Spring Oauth2 Client** and **Spring Web** boot starters. It uses claims from **ID Token** obtained from Azure Active Directory to display details of the signed-in user.

### Project Initialization

Create a new Java Maven project and copy the *pom.xml* file from this project, and the *src* folder of this repository.

If you'd like to create a project like this from scratch, you may use [Spring Initializer](https://start.spring.io):

- For **Packaging**, select **Jar**.
- For **Java**, select version **11**.
- For **Dependencies**, add the following items:
  - **Azure Active Directory B2C**
  - **Spring Oauth2 Client**
  - **Spring Web**
- Be sure that it comes with Azure SDK version 3.3 or higher. If it doesn't, consider replacing the pre-configured *pom.xml* file with the *pom.xml* from this repository.

### ID Token Claims

To extract token details, make use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping. See the [Sample Controller](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for an example of this app making use of ID Token claims.

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

To sign in, you must make a request to the Azure Active Directory sign-in endpoint that's automatically configured by **Azure AD B2C Spring Boot Starter client library for Java**.

```html
<a class="btn btn-success" href="/oauth2/authorization/{your-sign-up-sign-in-user-flow}">Sign In</a>
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

### Protect routes with WebSecurityConfigurerAdapter

By default, this app protects the **ID Token Details** page so that only logged-in users can access it. This app uses configures these routes from the `app.protect.authenticated` property from the *application.yml* file. To configure your app's specific requirements, extend `WebSecurityConfigurerAdapter` in one of your classes. For an example, see this app's [SecurityConfig](https://github.com/Azure-Samples/ms-identity-java-spring-tutorial/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class.

```java
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Value("${app.protect.authenticated}")
    private String[] protectedRoutes;

    private final AADB2COidcLoginConfigurer configurer;

    public SecurityConfig(AADB2COidcLoginConfigurer configurer) {
        this.configurer = configurer;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http.authorizeRequests()
            .antMatchers(protectedRoutes).authenticated()     // limit these pages to authenticated users (default: /token_details)
            .antMatchers("/**").permitAll()                  // allow all other routes.
            .and()
            .apply(configurer)
            ;
        // @formatter:off
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
- [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory)
- [Azure Active Directory B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID Tokens](/entra/identity-platform/id-tokens)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
