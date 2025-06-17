---
title: Secure Spring Boot apps using Azure Active Directory B2C
description: Shows you how to develop a Java Spring Boot web app that supports sign-in by Azure Active Directory B2C.
author: KarlErickson
ms.author: karler
ms.reviewer: givermei
ms.date: 03/11/2024
ms.topic: how-to
ms.custom: devx-track-identity-java, devx-track-java, devx-track-extended-java
---

# Secure Java Spring Boot apps using Azure Active Directory B2C

This article demonstrates a Java Spring Boot web app that signs in users on your Azure Active Directory B2C tenant using the [Azure AD B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c). It uses the OpenID Connect protocol.

The following diagram shows the topology of the app:

:::image type="content" source="media/topology-spring.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses the Azure AD B2C Spring Boot Starter client library for Java to sign in a user and obtain an ID token from Azure AD B2C. The ID token proves that the user is authenticated with Azure AD B2C and enables the user to access protected routes.

## Prerequisites

- [JDK version 15](https://jdk.java.net/15/). This sample was developed on a system with Java 15, but it might be compatible with other versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) is recommended for running this sample in Visual Studio Code.
- An Azure AD B2C tenant. For more information, see [Tutorial: Create an Azure Active Directory B2C tenant](/azure/active-directory-b2c/tutorial-create-tenant)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [Azure Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)

[!INCLUDE [spring-boot-overview-recommendations.md](includes/spring-boot-overview-recommendations.md)]

## Set up the sample

The following sections show you how to set up the sample application.

### Clone or download the sample repository

To clone the sample, open a Bash window and use the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-msal-java-samples.git
cd 4-spring-web-app/1-Authentication/sign-in-b2c
```

Alternatively, navigate to the [ms-identity-msal-java-samples](https://github.com/Azure-Samples/ms-identity-msal-java-samples) repository, then download it as a **.zip** file and extract it to your hard drive.

> [!IMPORTANT]
> To avoid file path length limitations on Windows, clone or extract the repository into a directory near the root of your hard drive.

This sample comes with a preregistered application for demo purposes. If you'd like to use your own Azure AD B2C tenant and application, register and configure the application in the Azure portal. For more information, see the [Register the app](#register-the-app-java-spring-webapp-auth-b2c) section. Otherwise, continue with the steps in the [Run the sample](#run-the-sample) section.

### Choose the Azure AD B2C tenant where you want to create your applications

To choose your tenant, use the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If your account is present in more than one Azure AD B2C tenant, select your profile in the corner of the Azure portal, and then select **Switch directory** to change your session to the desired Azure AD B2C tenant.

### Create user flows and custom policies

To create common user flows like sign-up, sign-in, profile edit, and password reset, see [Tutorial: Create user flows in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-create-user-flows).

You should consider creating custom policies in Azure Active Directory B2C as well. However, this task is beyond the scope of this tutorial. For more information, see [Azure AD B2C custom policy overview](/azure/active-directory-b2c/custom-policy-overview).

### Add external identity providers

See [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](/azure/active-directory-b2c/tutorial-add-identity-providers).

### Register the app (java-spring-webapp-auth-b2c)

To register the app, use the following steps:

1. Navigate to the [Azure portal](https://portal.azure.com) and select **Azure AD B2C**.

1. Select **App Registrations** on the navigation pane, then select **New registration**.

1. In the **Register an application page** that appears, enter the following application registration information:

   - In the **Name** section, enter a meaningful application name for display to users of the app - for example, `java-spring-webapp-auth-b2c`.
   - Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.

1. Select **Register** to create the application.

1. On the app's registration page, find and copy the **Application (client) ID** value to use later. You use this value in your app's configuration file or files.

1. Select **Save** to save your changes.

1. On the app's registration page, select the **Certificates & secrets** pane on the navigation pane to open the page to generate secrets and upload certificates.

1. In the **Client secrets** section, select **New client secret**.

1. Type a description - for example, **app secret**.

1. Select one of the available durations as per your security concerns - for example, **In 2 years**.

1. Select **Add**. The generated value is displayed.

1. Copy and save the generated value for use in later steps. You need this value for your code's configuration files. This value isn't displayed again, and you can't retrieve it by any other means. So, be sure to save it from the Azure portal before you navigate to any other screen or pane.

### Configure the app (java-spring-webapp-auth-b2c) to use your app registration

Use the following steps to configure the app:

> [!NOTE]
> In the following steps, `ClientID` is the same as `Application ID` or `AppId`.

1. Open the project in your IDE.

1. Open the **src/main/resources/application.yml** file.

1. Find the `client-id` property and replace the existing value with the application ID or `clientId` of the `java-spring-webapp-auth-b2c` application from the Azure portal.

1. Find the `client-secret` property and replace the existing value with the value you saved during the creation of the `java-spring-webapp-auth-b2c` application from the Azure portal.

1. Find the `base-uri` property and replace the two instances of the value `fabrikamb2c` with the name of the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.

1. Find the `sign-up-or-sign-in` property and replace it with the name of the sign-up/sign-in user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.

1. Find the `profile-edit` property and replace it with the name of the password reset user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.

1. Find the `password-reset` property and replace it with the name of the edit profile user-flow policy you created in the Azure AD B2C tenant in which you created the `java-spring-webapp-auth-b2c` application in the Azure portal.

1. Open the **src/main/resources/templates/navbar.html** file.

1. Find the references to the `b2c_1_susi` and `b2c_1_edit_profile` flows and replace them with your `sign-up-sign-in` and `profile-edit` user-flows.

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

1. Open your browser and navigate to `http://localhost:8080`. You should see a screen with the text `You're signed in! Click here to get your ID Token Details`.

:::image type="content" source="media/app.png" alt-text="Screenshot of the sample app.":::

---

## Explore the sample

Use the following steps to explore the sample:

1. Notice the signed-in or signed-out status displayed at the center of the screen.
1. Select the context-sensitive button in the corner. This button reads **Sign In** when you first run the app. Alternatively, select the link to **token details**. Because this page is protected and requires authentication, you're automatically redirected to the sign-in page.
1. On the next page, follow the instructions and sign in with an account of your chosen identity provider. You can also choose to sign up or sign in to a local account on the B2C tenant using an email address.
1. Upon successful completion of the sign-in flow, you should be redirected to the home page - which shows the **sign in status** - or the **token details** page, depending on which button triggered your sign-in flow.
1. Notice that the context-sensitive button now says **Sign out** and displays your username.
1. If you're on the home page, select **ID Token Details** to see some of the ID token's decoded claims.
1. Edit your profile. Select **edit profile** to change details like your display name, place of residence, and profession.
1. Use the button in the corner to sign out. The status page reflects the new state.

## About the code

This sample demonstrates how to use [Azure AD B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c) to sign in users into your Azure AD B2C tenant. The sample also makes use of the Spring Oauth2 Client and Spring Web boot starters. The sample uses claims from the ID token obtained from Azure AD B2C to display the details of the signed-in user.

### Contents

The following table shows the contents of the sample project folder:

| File/folder                                                                   | Description                                                                               |
|-------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **pom.xml**                                                                     | Application dependencies.                                                                 |
| **src/main/resources/templates/**                                               | Thymeleaf Templates for UI.                                                               |
| **src/main/resources/application.yml**                                          | Application and Microsoft Entra Boot Starter library configuration.                       |
| **src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/** | This directory contains the main application entry point, controller, and config classes. |
| **.../MsIdentitySpringBootWebappApplication.java**                              | Main class.                                                                               |
| **.../SampleController.java**                                                   | Controller with endpoint mappings.                                                        |
| **.../SecurityConfig.java**                                                     | Security configuration - for example, which routes require authentication.                |
| **.../Utilities.java**                                                          | Utility class - for example, filter ID token claims.                                      |
| **CHANGELOG.md**                                                                | List of changes to the sample.                                                            |
| **CONTRIBUTING.md**                                                             | Guidelines for contributing to the sample.                                                |
| **LICENSE**                                                                     | The license for the sample.                                                               |

### ID token claims

To extract token details, the app makes use of Spring Security's `AuthenticationPrincipal` and `OidcUser` object in a request mapping, as shown in the following example, as shown in the following example. See the [Sample Controller](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/1-Authentication/sign-in-b2c/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SampleController.java) for the full details of how this app makes use of ID token claims.

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

For sign-in, the app makes a request to the Azure AD B2C sign-in endpoint automatically configured by Azure AD B2C Spring Boot Starter client library for Java, as shown in the following example:

```html
<a class="btn btn-success" href="/oauth2/authorization/{your-sign-up-sign-in-user-flow}">Sign In</a>
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

### Protect routes with WebSecurityConfigurerAdapter

By default, the app protects the **ID Token Details** page so that only signed-in users can access it. The app configures these routes from the `app.protect.authenticated` property from the **application.yml** file. To configure your app's specific requirements, you can extend `WebSecurityConfigurerAdapter` in one of your classes. For an example, see this app's [SecurityConfig](https://github.com/Azure-Samples/ms-identity-msal-java-samples/blob/main/4-spring-web-app/1-Authentication/sign-in-b2c/src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class, shown in the following code:

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
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs](/entra/identity-platform/quickstart-configure-app-access-web-apis)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [Application and service principal objects in Microsoft Entra ID](/entra/identity-platform/app-objects-and-service-principals)
- [National Clouds](/entra/identity-platform/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [Microsoft Entra ID Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory)
- [Azure Active Directory B2C Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID tokens](/entra/identity-platform/id-tokens)
- [Access tokens in the Microsoft identity platform](/entra/identity-platform/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).
