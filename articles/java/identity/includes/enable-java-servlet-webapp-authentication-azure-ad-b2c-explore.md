---
ms.author: bbanerjee
ms.date: 01/01/2024
ms.custom: devx-track-java
---

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Click the context-sensitive button at the top right (it reads `Sign In` on first run).
- Follow the instructions on the next page to sign in with an account of your chosen identity provider.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- The middle of the screen now has an option to click for ID Token Details: click it to see some of the ID token's decoded claims.
- You also have the option of editing your profile. Click the link to edit details like your display name, place of residence, and profession.
- You can also use the button on the top right to sign out.
- After signing out, click this link to the token details page: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_token_details` to observe how the app displays a `401: unauthorized` error instead of the ID token claims.

## Contents

The full code for this sample is available at [https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/1-Authentication/sign-in-b2c](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/1-Authentication/sign-in-b2c). The below table lists the overall parts of this sample.

| File/folder                 | Description                                                                                        |
|-----------------------------|----------------------------------------------------------------------------------------------------|
| *AuthHelper.java*           | Helper functions for authentication.                                                               |
| *Config.java*               | Runs on startup and configures properties reader and logger.                                       |
| *authentication.properties* | Azure AD and program configuration.                                                                |
| *AuthenticationFilter.java* | Redirects unauthenticated requests to protected resources to a 401 page.                           |
| *MsalAuthSession*           | Instantiated with an HttpSession, stores all MSAL related session attributes in session attribute. |
| *____Servlet.java*          | All of the endpoints available are defined in .java classes ending in ____Servlet.java             |
| *CHANGELOG.md*              | List of changes to the sample.                                                                     |
| *CONTRIBUTING.md*           | Guidelines for contributing to the sample.                                                         |
| *LICENSE*                   | The license for the sample.                                                                        |

## About the code

This sample demonstrates how to use **MSAL4J** to sign in users into your Azure AD B2C tenant.

A **ConfidentialClientApplication** instance is created in the *AuthHelper.java* file. This object helps craft the AAD B2C authorization URL and also helps exchange the authentication token for an access token.

```java
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

In this sample, these values are read from the *authentication.properties* file using a properties reader in the *Config.java* file.

### Step-by-step walkthrough

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint on for our Azure Active Directory B2C Tenant. Our MSAL4J ConfidentialClientApplication instance is leveraged to construct an authorization request URL, and our app redirects the browser to this URL.

    ```java
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
    - **REDIRECT_URI**: Where AAD B2C redirects the browser (along with auth code) after collecting user credentials.
    - **SCOPES**: [Scopes](/en-us/azure/active-directory-b2c/access-tokens#scopes) are permissions requested by the application.
      - Normally, the three scopes `openid profile offline_access` would suffice for receiving an ID Token response.
      - However, MSAL4J requires all responses from AAD B2C to also contain an Access Token.
      - In order for AAD B2C to dispense an access token as well as an ID Token, the request must include an additional resource scope.
      - Since this app doesn't actually require an external resource scope, it adds its own client ID as a fourth scope in order to receive an access token.
      - Full list of scopes requested by the app can be found in the *authentication.properties* file.
    - **ResponseMode.QUERY**: AAD can return the response as form params in an HTTP POST request or as query string params in an HTTP GET request.
    - **Prompt.SELECT_ACCOUNT**: AAD B2C should ask the user to select the account that they intend to authenticate against.
    - **state**: a unique variable set by the app into the session on each token request, and destroyed after receiving the corresponding AAD redirect callback. The state variable ensures that AAD requests to the `/auth_redirect endpoint` are actually from AAD authorization requests originating from this app and this session, thereby preventing CSRF attacks. This is done in the *AADRedirectServlet.java* file.
    - **nonce**: a unique variable set by the app into the session on each token request, and destroyed after receiving the corresponding token. This nonce is transcribed to the resulting tokens dispensed AAD, thereby ensuring that there is no token-replay attack occurring.

1. The user is presented with a sign-in prompt by Azure Active Directory B2C. If the sign-in attempt is successful, the user's browser is redirected to our app's redirect endpoint. A valid request to this endpoint contains an [authorization code](/en-us/azure/active-directory-b2c/authorization-code-flow).
1. Our ConfidentialClientApplication instance then exchanges this authorization code for an ID Token and Access Token from Azure Active Directory B2C.

    ```java
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

    ```java
    parseJWTClaimsSetAndStoreResultInSession(msalAuth, result, serializedTokenCache);
    validateNonce(msalAuth)
    processSuccessfulAuthentication(msalAuth);
    ```

1. If the nonce is successfully validated, authentication status is put into a server-side session, leveraging methods exposed by the `MsalAuthSession` class:

    ```java
    msalAuth.setAuthenticated(true);
    msalAuth.setUsername(msalAuth.getIdTokenClaims().get("name"));
    ```

## More information

- [What is Azure Active Directory B2C?](/azure/active-directory-b2c/overview)
- [Application types that can be used in Active Directory B2C](/azure/active-directory-b2c/application-types)
- [Recommendations and best practices for Azure Active Directory B2C](/azure/active-directory-b2c/best-practices)
- [Azure AD B2C session](/azure/active-directory-b2c/session-overview)
- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)

For more information about how OAuth 2.0 protocols work in this scenario and other scenarios, see [Authentication Scenarios for Microsoft Entra ID](/entra/identity-platform/authentication-flows-app-scenarios).