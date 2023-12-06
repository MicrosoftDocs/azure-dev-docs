---
page_type: sample
languages:
  - java
products:
  - azure
  - msal-java
  - azure-active-directory
  - entra
urlFragment: msal-java-spring-boot-sign-in
description: "This sample demonstrates a Java Spring MVC web app that authenticates users with Azure AD"
---

# Enable your Java Spring Boot web app to sign in users on your Azure Active Directory tenant with the Microsoft identity platform

- [Overview](#overview)
- [Scenario](#scenario)
- [Contents](#contents)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Clone or download this repository](#clone-or-download-this-repository)
  - [Register the sample application(s) with your Azure Active Directory tenant](#register-the-sample-applications-with-your-azure-active-directory-tenant)
  - [Choose the Azure AD tenant where you want to create your applications](#choose-the-azure-ad-tenant-where-you-want-to-create-your-applications)
  - [Register the webApp app (java-spring-webapp-auth)](#register-the-webapp-app-java-spring-webapp-auth)
- [Running the sample](#running-the-sample)
- [Explore the sample](#explore-the-sample)
- [We'd love your feedback!](#wed-love-your-feedback)
- [About the code](#about-the-code)
  - [Project Initialization](#project-initialization)
  - [ID Token Claims](#id-token-claims)
  - [Sign-in and sign-out links](#sign-in-and-sign-out-links)
  - [Authentication-dependent UI elements](#authentication-dependent-ui-elements)
  - [Protecting routes with AADWebSecurityConfigurerAdapter](#protecting-routes-with-aadwebsecurityconfigureradapter)
- [More information](#more-information)
- [Community Help and Support](#community-help-and-support)
- [Contributing](#contributing)

<!-- ![Build badge](https://identitydivision.visualstudio.com/_apis/public/build/definitions/a7934fdd-dcde-4492-a406-7fad6ac00e17/<BuildNumber>/badge) -->

## Overview

This sample demonstrates a Java Spring MVC web app that signs in users on your Azure Active Directory tenant using the [Azure AD Spring Boot Starter client library for Java](https://mvnrepository.com/artifact/com.azure.spring/spring-cloud-azure-starter-active-directory). It uses the OpenID Connect protocol.

![Overview](./media/topology-spring.png)

## Scenario

1. The client Java Spring MVC web app leverages the Azure AD Spring Boot Starter client library for Java to sign-in a user and obtain an ID Token from **Azure AD**.
2. The **ID Token** proves that the user has successfully authenticated with **Azure AD** and allows the user to access protected routes.

![Overview](./media/topology-spring.png)

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `AppCreationScripts/`                                                               | Scripts to automatically configure Azure AD app registrations.                              |
| `pom.xml`                                                                           | Application dependencies.                                                                   |
| `src/main/resources/templates/`                                                     | Thymeleaf Templates for UI.                                                                 |
| `src/main/resources/application.yml`                                                | Application and Azure AD Boot Starter Library Configuration.                                |
| `src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/`       | This directory contains the main application entry point, controller, and config classes.   |
| `.../MsIdentitySpringBootWebappApplication.java`                                    | Main class.                                                                                 |
| `.../SampleController.java`                                                         | Controller with endpoint mappings.                                                          |
| `.../SecurityConfig.java`                                                           | Security Configuration (e.g., which routes require authentication?).                        |
| `.../Utilities.java`                                                                | Utility Class (e.g., filter ID token claims                                                 |
| `CHANGELOG.md`                                                                      | List of changes to the sample.                                                              |
| `CONTRIBUTING.md`                                                                   | Guidelines for contributing to the sample.                                                  |
| `LICENSE`                                                                           | The license for the sample.                                                                 |

## Prerequisites

- [JDK Version 15](https://jdk.java.net/15/). This sample has been developed on a system with Java 15 but may be compatible with other versions.
- [Maven 3](https://maven.apache.org/download.cgi)
- [Java Extension Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) is recommended for running this sample in VSCode.
- An **Azure AD** tenant. For more information see: [How to get an Azure AD tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant)
- A user account in your **Azure AD** tenant. This sample will not work with a **personal Microsoft account**. Therefore, if you signed in to the [Azure portal](https://portal.azure.com) with a personal account and have never created a user account in your directory before, you need to do that now.

## Setup

### Clone or download this repository

From your shell or command line:

```console
    git clone https://github.com/Azure-Samples/ms-identity-java-spring-tutorial.git
    cd ms-identity-java-spring-tutorial
    cd 1-Authentication/sign-in
```

or download and extract the repository .zip file.

> :warning: To avoid path length limitations on Windows, we recommend cloning into a directory near the root of your drive.

### Register the sample application(s) with your Azure Active Directory tenant

There is one project in this sample. To register it, you can:

- follow the steps below for manually register your apps
- or use PowerShell scripts that:
  - **automatically** creates the Azure AD applications and related objects (passwords, permissions, dependencies) for you.
  - modify the projects' configuration files.

<details>
  <summary>Expand this section if you want to use this automation:</summary>

> :warning: If you have never used **Azure AD Powershell** before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.

1. On Windows, run PowerShell as **Administrator** and navigate to the root of the cloned directory
1. If you have never used Azure AD Powershell before, we recommend you go through the [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md) once to ensure that your environment is prepared correctly for this step.
1. In PowerShell run:

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
   ```

1. Run the script to create your Azure AD application and configure the code of the sample application accordingly.
1. In PowerShell run:

   ```PowerShell
   cd .\AppCreationScripts\
   .\Configure.ps1
   ```

   > Other ways of running the scripts are described in [App Creation Scripts](./AppCreationScripts/AppCreationScripts.md)
   > The scripts also provide a guide to automated application registration, configuration and removal which can help in your CI/CD scenarios.

</details>

### Choose the Azure AD tenant where you want to create your applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one Azure AD tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD tenant.

### Register the webApp app (java-spring-webapp-auth)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `java-spring-webapp-auth`.
   - Under **Supported account types**, select **Accounts in this organizational directory only**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/login/oauth2/code/`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.
1. In the app's registration screen, select the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security posture.
   - The generated key value will be displayed when you select the **Add** button. Copy the generated value for use in the steps later.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

#### Configure the webApp app (java-spring-webapp-auth) to use your app registration

Open the project in your IDE (Visual Studio Code or IntelliJ IDEA) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the `src\main\resources\application.yml` file.
1. Find the key `Enter_Your_Tenant_ID_Here` and replace the existing value with your Azure AD tenant ID.
1. Find the key `Enter_Your_Client_ID_Here` and replace the existing value with the application ID (clientId) of `java-spring-webapp-auth` app copied from the Azure portal.
1. Find the key `Enter_Your_Client_Secret_Here` and replace the existing value with the key you saved during the creation of `java-spring-webapp-auth` copied from the Azure portal.

## Running the sample

1. Open a terminal or the integrated VSCode terminal.
1. In the same directory as this readme file, run `mvn clean compile spring-boot:run`.
1. Open your browser and navigate to `http://localhost:8080`.

![Experience](./media/app.png)

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Click the context-sensitive button at the top right (it will read `Sign In` on first run)
  - Alternatively, click the link to `token details`. Since this is a protected page that requires authentication, you'll be automatically redirected to the sign-in page.
- Follow the instructions on the next page to sign in with an account in the Azure AD tenant.
- On the consent screen, note the scopes that are being requested.
- Upon successful completion of the sign-in flow, you should be redirected to the home page (`sign in status`) or `token details` page, depending on which button triggered your sign-in flow.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- If you are on the home page, you'll see an option to click **ID Token Details**: click it to see some of the ID token's decoded claims.
- You can also use the button on the top right to sign out. The status page will reflect this.

> :information_source: Did the sample not work for you as expected? Did you encounter issues trying this sample? Then please reach out to us using the [GitHub Issues](../../../../issues) page.

## We'd love your feedback!

Were we successful in addressing your learning objective? Consider taking a moment to [share your experience with us](https://forms.office.com/r/iTZtCTrZrH).

## About the code

This sample demonstrates how to use [Azure AD Spring Boot Starter client library for Java](https://docs.microsoft.com/java/api/overview/azure/active-directory-spring-boot-starter-readme?view=azure-java-stable) to sign in users into your Azure AD tenant. It also makes use of **Spring Oauth2 Client** and **Spring Web** boot starters. It uses claims from **ID Token** obtained from Azure Active Directory to display details of the signed-in user.

### Project Initialization

Create a new Java Maven project and copy the `pom.xml` file from this project, and the `src` folder of this repository.

If you'd like to create a project like this from scratch, you may use [Spring Initializer](https://start.spring.io):

- For **Packaging**, select `Jar`
- For **Java** select version `11`
- For **Dependencies**, add the following:
  - Azure Active Directory
  - Spring Oauth2 Client
  - Spring Web
- Be sure that it comes with Azure SDK version 3.3 or higher. If not, please consider replacing the pre-configured `pom.xml` with the `pom.xml` from this repository.

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

To sign in, you must make a request to the Azure Active Directory sign-in endpoint that is automatically configured by **Azure AD Spring Boot Starter client library for Java**.

```html
<a class="btn btn-success" href="/oauth2/authorization/azure">Sign In</a>
```

To sign out, you must make POST request to the **logout** endpoint.

```HTML
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

By default, this app protects the **ID Token Details** page so that only logged-in users can access it. This app uses configures these routes from the `app.protect.authenticated` property from the `application.yml` file. To configure your app's specific requirements, extend `AADWebSecurityConfigurationAdapter` in one of your classes. For an example, see this app's [SecurityConfig](./src/main/java/com/microsoft/azuresamples/msal4j/msidentityspringbootwebapp/SecurityConfig.java) class.

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

## Deployment

[Deploy to Azure App Service](../../4-Deployment/deploy-to-azure-app-service). Prepare your app for deployment to Azure App Service, configure authentication parameters and use various Azure services for managing your operations.

## More information

- [Microsoft identity platform (Azure Active Directory for developers)](https://docs.microsoft.com/azure/active-directory/develop/)
- [Overview of Microsoft Authentication Library (MSAL)](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
- [Quickstart: Configure a client application to access web APIs (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis)
- [Understanding Azure AD application consent experiences](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience)
- [Understand user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent)
- [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)
- [National Clouds](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud#app-registration-endpoints)
- [MSAL code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code)
- [Azure Active Directory Spring Boot Starter client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-starter-active-directory)
- [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [MSAL4J Wiki](https://github.com/AzureAD/microsoft-authentication-library-for-java/wiki)
- [ID Tokens](https://docs.microsoft.com/azure/active-directory/develop/id-tokens)
- [Access Tokens](https://docs.microsoft.com/azure/active-directory/develop/access-tokens)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios).

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`azure-active-directory` `azure-ad-b2c` `ms-identity` `adal` `msal`, `java`].

If you find a bug in the sample, raise the issue on [GitHub Issues](../../../../issues).

To provide feedback on or suggest features for Azure Active Directory, visit [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.