---
page_type: sample
languages:
  - java
products:
  - azure-active-directory  
  - azure-active-directory-b2c
  - azure-active-directory-domain
  - entra
urlFragment: msal-java-jboss-eap-sign-in-b2c
description: "This sample demonstrates a Java Jboss EAP webapp that signs in users with Azure AD B2C"
---

# Java Jboss EAP Web App using MSAL4J to authenticate users into Azure Active Directory B2C

 1. [Overview](#overview)
 1. [Scenario](#scenario)
 1. [Contents](#contents)
 1. [Prerequisites](#prerequisites)
 1. [Setup](#setup)
 1. [Registration](#register-the-sample-application-with-your-azure-ad-b2c-tenant)
 1. [Running the sample](#running-the-sample)
 1. [Explore the sample](#explore-the-sample)
 1. [About the code](#about-the-code)
 1. [Deployment](#deploying-the-sample)
 1. [More information](#more-information)
 1. [Community Help and Support](#community-help-and-support)
 1. [Contributing](#contributing)
 1. [Code of Conduct](#code-of-conduct)

<!-- ![Build badge](https://identitydivision.visualstudio.com/_apis/public/build/definitions/a7934fdd-dcde-4492-a406-7fad6ac00e17/<BuildNumber>/badge) -->

## Overview

This sample demonstrates a Java Servlet web application that authenticates users against Azure Active Directory B2C (Azure AD B2C) using the the [Microsoft Authentication Library for Java (MSAL4J)](https://github.com/AzureAD/microsoft-authentication-library-for-java).

## Scenario

1. The client Java Servlet web application uses **MSAL4J** to sign-in users and obtains an [ID Token](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) from **Azure AD B2C**:
2. The **ID Token** proves that the user has successfully authenticated against a **Azure AD B2C** tenant.

![Overview](./media/topology-sign-in.png)

## Contents

| File/folder       | Description                                |
|-------------------|--------------------------------------------|
| `AuthHelper.java` | Helper functions for authentication. |
| `Config.java` | Runs on startup and configures properties reader and logger. |
| `authentication.properties`| Azure AD and program configuration. |
| `AuthenticationFilter.java`| Redirects unauthenticated requests to protected resources to a 401 page. |
| `MsalAuthSession` | Instantiated with an HttpSession, stores all MSAL related session attributes in session attribute. |
| `____Servlet.java`    | All of the endpoints available are defined in .java classes ending in ____Servlet.java |
| `CHANGELOG.md`    | List of changes to the sample.             |
| `CONTRIBUTING.md` | Guidelines for contributing to the sample. |
| `LICENSE`         | The license for the sample.                |

## Prerequisites

- [JDK Version 8 or higher](https://jdk.java.net/8/)
- [Maven 3](https://maven.apache.org/download.cgi)
- An **Azure AD B2C** tenant. For more information see: [How to get an Azure AD B2C tenant](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant)
- A user account in your **Azure AD B2C**.

## Setup

### Clone or download this repository

From your shell or command line:

```console
git clone https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication.git
cd 1-Authentication/sign-in-b2c
```

or download and extract the repository .zip file.

> :warning: To avoid file path length limitations on Windows, clone the repository into a directory near the root of your hard drive.

### Register the sample application with your Azure AD B2C tenant

:warning: This sample comes with a pre-registered application for testing purposes. If you would like to use your own **Azure AD B2C** tenant and application, follow the steps below to register and configure the application in the **Azure Portal**. Otherwise, continue with the steps for [Running the sample](#running-the-sample).

<details>
  <summary>Expand this section to see manual steps for configuring your own tenant:</summary>

### Choose the Azure AD B2C tenant where you want to create your applications

As a first step you'll need to:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If your account is present in more than one **Azure AD B2C** tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD B2C tenant.

### Create User Flows and Custom Policies

Please refer to [Tutorial: Create user flows in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-user-flows) to create common user flows like sign up, sign in, edit profile, and password reset.

You may consider creating [Custom policies in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/custom-policy-overview) as well, however, this is beyond the scope of this tutorial.

### Add External Identity Providers

Please refer to: [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-add-identity-providers)

### Register the WebApp app (ms-identity-b2c-java-servlet-webapp-authentication)

1. Navigate to the [Azure portal](https://portal.azure.com) and select the **Azure AD B2C** service.
1. Select the **App Registrations** blade on the left, then select **New registration**.
1. In the **Register an application page** that appears, enter your application's registration information:
   - In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `ms-identity-b2c-java-servlet-webapp-authentication`.
   - Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   - In the **Redirect URI (optional)** section, select **Web** in the combo-box and enter the following redirect URI: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_redirect`.
1. Select **Register** to create the application.
1. In the app's registration screen, find and note the **Application (client) ID**. You use this value in your app's configuration file(s) later in your code.
1. Select **Save** to save your changes.

1. In the app's registration screen, click on the **Certificates & secrets** blade in the left to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, click on **New client secret**:
   - Type a key description (for instance `app secret`),
   - Select one of the available key durations (**In 1 year**, **In 2 years**, or **Never Expires**) as per your security concerns.
   - The generated key value will be displayed when you click the **Add** button. Copy the generated value for use in the steps later.
   - You'll need this key later in your code's configuration files. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

#### Configure the WebApp app (ms-identity-b2c-java-servlet-webapp-authentication) to use your app registration

Open the project in your IDE (like **Visual Studio Code**) to configure the code.

> In the steps below, "ClientID" is the same as "Application ID" or "AppId".

1. Open the [authentication.properties](src/main/resources/authentication.properties) file.
1. Find the key `aad.clientId` and replace the existing value with the application ID (clientId) of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.
1. Find the app key `aad.secret` and replace the existing value with the key you saved during the creation of the `ms-identity-b2c-java-servlet-webapp-authentication` application from the Azure portal.
1. Find the app key `aad.scopes` and replace the existing application clientId with the value you placed into `aad.clientId` in step 1 of this section.
1. Find the app key `aad.authority` and replace the first instance of `fabrikamb2c` with the name of the AAD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.authority` and replace the second instance of `fabrikamb2c` with the name of the AAD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.signInPolicy` and replace it with the name of the sign-up/sign-in userflow policy you created in the AAD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.passwordResetPolicy` and replace it with the name of the password reset userflow policy you created in the AAD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.
1. Find the app key `aad.editProfilePolicy` and replace it with the name of the edit profile userflow policy you created in the AAD B2C tenant in which you created the `ms-identity-b2c-java-servlet-webapp-authentication` application in the Azure portal.

</details>

## Running The Sample

####Build .war File Using Maven

1. Navigate to the directory containing the pom.xml file for this sample (the same directory as this README), and run the following Maven command:
    ```
    mvn clean package
    ```
1. This should generate a `.war` file which can be run on a variety of application servers

## Deploying the Sample

Before you can deploy to JBoss, you will need to make some configuration changes in the sample itself and (re)build the package:

1. In the sample there is likely an application.properties or authentication.properties file where you configured the client ID, tenant, redirect URL, etc.

2. In the above mentioned file, changed references to localhost:8080 or localhost:8443 to the URL/port JBoss will run on, which by default should be localhost:9990

3. You will also need to make the same change in the Azure app registration, where you set it as the 'Redirect URI' in the 'Authentication' tab

To deploy the sample to JBoss EAP via the web console:

1. Start the JBoss server with %JBOSS_HOME%\bin\standalone.bat

2. Navigate to the JBoss web console in your browser, http://localhost:9990

3. Go to Deployments, click Add, and upload the .war you built

4. Most of the default settings should be fine except that you should name the application to match the 'Redirect URI' you set in sample configuration/Azure app registration, i.e. if the redirect URI is http://localhost:9990/msal4j-servlet-auth/ then you should name the application 'msal4j-servlet-auth'

5. Select the .war file you uploaded, click En/Disable, and Confirm to start the application

6. Once the application starts, navigate to http://localhost:9990/{whatever you named the application}/, and you should be able to access the application


## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Click the context-sensitive button at the top right (it will read `Sign In` on first run).
- Follow the instructions on the next page to sign in with an account of your chosen identity provider.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- The middle of the screen now has an option to click for ID Token Details: click it to see some of the ID token's decoded claims.
- You also have the option of editing your profile. Click the link to edit details like your display name, place of residence, and profession.
- You can also use the button on the top right to sign out.
- After signing out, click this link to the token details page: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_token_details` to observe how the app displays a `401: unauthorized` error instead of the ID token claims.

> :information_source: Did the sample not work for you as expected? Then please reach out to us using the [GitHub Issues](../issues) page.

## About the code

This sample demonstrates how to use **MSAL4J** to sign in users into your Azure AD B2C tenant.

A **ConfidentialClientApplication** instance is created in the [AuthHelper.java](src/main/java/com/microsoft/azuresamples/webapp/AuthHelper.java) class. This object helps craft the AAD B2C authorization URL and also helps exchange the authentication token for an access token.

```Java
IClientSecret secret = ClientCredentialFactory.createFromSecret(SECRET);
confClientInstance = ConfidentialClientApplication
                    .builder(CLIENT_ID, secret)
                    .b2cAuthority(AUTHORITY + policy)
                    .build();
```

The following parameters need to be provided upon instantiation:

- The **Client ID** of the app
- The **Client Secret**, which is a requirement for Confidential Client Applications
- The **Azure AD B2C Authority** concatenated with the appropriate **UserFlowPolicy** for sign-up/sign-in or profile-edit or password-reset.

In this sample, these values are read from the [authentication.properties](src/main/resources/authentication.properties) file using a properties reader in the class [Config.java](src/main/java/com/microsoft/azuresamples/webapp/Config.java).

### Step-by-step walkthrough

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint on for our Azure Active Directory B2C Tenant. Our MSAL4J ConfidentialClientApplication instance is leveraged to construct an authorization request URL, and our app redirects the browser to this URL.

    ```Java
    final ConfidentialClientApplication client = getConfidentialClientInstance(policy);
    final AuthorizationRequestUrlParameters parameters = AuthorizationRequestUrlParameters
        .builder(REDIRECT_URI, Collections.singleton(SCOPES)).responseMode(ResponseMode.QUERY)
        .prompt(Prompt.SELECT_ACCOUNT).state(state).nonce(nonce).build();

    final String redirectUrl = client.getAuthorizationRequestUrl(parameters).toString();
    Config.logger.log(Level.INFO, "Redirecting user to {0}", redirectUrl);
    resp.setStatus(302);
    resp.sendRedirect(redirectUrl);
    ```

    - **AuthorizationRequestUrlParameters**: Parameters that must be set in order to build an AuthorizationRequestUrl.
    - **REDIRECT_URI**: Where AAD B2C will redirect the browser (along with auth code) after collecting user credentials.
    - **SCOPES**: [Scopes](https://docs.microsoft.com/en-us/azure/active-directory-b2c/access-tokens#scopes) are permissions requested by the application.
      - Normally, the three scopes `openid profile offline_access` would suffice for receiving an ID Token response.
      - However, MSAL4J requires all responses from AAD B2C to also contain an Access Token.
      - In order for AAD B2C to dispense an access token as well as an ID Token, the request must include an additional resource scope.
      - Since this app doesn't actually require an external resource scope, it adds its own client ID as a fourth scope in order to receive an access token.
      - Full list of scopes requested by the app can be found in the [authentication.properties file](./src/main/resources/authentication.properties).
    - **ResponseMode.QUERY**: AAD can return the response as form params in an HTTP POST request or as query string params in an HTTP GET request.
    - **Prompt.SELECT_ACCOUNT**: AAD B2C should ask the user to select the account that they intend to authenticate against.
    - **state**: a unique variable set by the app into the session on each token request, and destroyed after receiving the corresponding AAD redirect callback. The state variable ensures that AAD requests to the [/auth_redirect endpoint](src/main/java/com/microsoft/azuresamples/authenticationb2c/AADRedirectServlet.java) are actually from AAD authorization requests originating from this app and this session, thereby preventing CSRF attacks.
    - **nonce**: a unique variable set by the app into the session on each token request, and destroyed after receiving the corresponding token. This nonce is transcribed to the resulting tokens dispensed AAD, thereby ensuring that there is no token-replay attack occurring.

1. The user is presented with a sign-in prompt by Azure Active Directory B2C. If the sign-in attempt is successful, the user's browser is redirected to our app's redirect endpoint. A valid request to this endpoint will contain an [**authorization code**](https://docs.microsoft.com/en-us/azure/active-directory-b2c/authorization-code-flow).
1. Our ConfidentialClientApplication instance then exchanges this authorization code for an ID Token and Access Token from Azure Active Directory B2C.

    ```Java
    final AuthorizationCodeParameters authParams = AuthorizationCodeParameters
                        .builder(authCode, new URI(REDIRECT_URI))
                        .scopes(Collections.singleton(SCOPES)).build();

    final ConfidentialClientApplication client = AuthHelper
            .getConfidentialClientInstance(policy);
    final Future<IAuthenticationResult> future = client.acquireToken(authParams);
    final IAuthenticationResult result = future.get();
    ```

    - **AuthorizationCodeParameters**: Parameters that must be set in order to exchange the Authorization Code for an ID and/or access token.
    - **authCode**: The authorization code that was received at the redirect endpoint.
    - **REDIRECT_URI**: The redirect URI used in the previous step must be passed again.
    - **SCOPES**: The scopes used in the previous step must be passed again.

1. If acquireToken is successful, the token claims are extracted and the nonce claim is validated against the nonce stored in the session.

    ```Java
    parseJWTClaimsSetAndStoreResultInSession(msalAuth, result, serializedTokenCache);
    validateNonce(msalAuth)
    processSuccessfulAuthentication(msalAuth);
    ```

1. If the nonce is successfully validated, authentication status is put into a server-side session, leveraging methods exposed by the class [MsalAuthSession.java](src/main/java/com/microsoft/azuresamples/webapp/authentication/MsalAuthSession.java):

    ```Java
    msalAuth.setAuthenticated(true);
    msalAuth.setUsername(msalAuth.getIdTokenClaims().get("name"));
    ```

## More information

- [What is Azure Active Directory B2C?](https://docs.microsoft.com/azure/active-directory-b2c/overview)
- [Application types that can be used in Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/application-types)
- [Recommendations and best practices for Azure Active Directory B2C](https://docs.microsoft.com/azure/active-directory-b2c/best-practices)
- [Azure AD B2C session](https://docs.microsoft.com/azure/active-directory-b2c/session-overview)
- [Microsoft Authentication Library \(MSAL\) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-flows-app-scenarios).

## Community Help and Support

Use [Stack Overflow](http://stackoverflow.com/questions/tagged/msal) to get support from the community.
Ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before.
Make sure that your questions or comments are tagged with [`azure-active-directory` `azure-ad-b2c` `ms-identity` `adal` `msal`].

If you find a bug in the sample, please raise the issue on [GitHub Issues](../../../../issues).

To provide a recommendation, visit the following [User Voice page](https://feedback.azure.com/forums/169401-azure-active-directory).

## Contributing

If you'd like to contribute to this sample, see [CONTRIBUTING.MD](/CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Code of Conduct

This project has adopted the Microsoft Open Source Code of Conduct. For more information see the Code of Conduct FAQ or contact opencode@microsoft.com with any additional questions or comments.