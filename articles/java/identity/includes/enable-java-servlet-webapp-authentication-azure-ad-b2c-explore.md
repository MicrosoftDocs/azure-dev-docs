---
author: KarlErickson
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Explore the sample

Use the following steps to explore the sample:

1. Notice the signed-in or signed-out status displayed at the center of the screen.
1. Select the context-sensitive button in the corner. This button reads **Sign In** when you first run the app.
1. On the next page, follow the instructions and sign in with an account of your chosen identity provider.
1. Notice that the context-sensitive button now says **Sign out** and displays your username.
1. Select **ID Token Details** to see some of the ID token's decoded claims.
1. You also have the option of editing your profile. Select the link to edit details like your display name, place of residence, and profession.
1. Use the button in the corner to sign out.
1. After signing out, navigate to the following URL for the token details page: `http://localhost:8080/ms-identity-b2c-java-servlet-webapp-authentication/auth_token_details`. Here, you can observe how the app displays a `401: unauthorized` error instead of the ID token claims.

## About the code

This sample demonstrates how to use MSAL4J to sign in users into your Azure AD B2C tenant.

### Contents

The following table shows the contents of the sample project folder:

| File/folder                 | Description                                                                                          |
|-----------------------------|------------------------------------------------------------------------------------------------------|
| **AuthHelper.java**           | Helper functions for authentication.                                                                 |
| **Config.java**               | Runs on startup and configures properties reader and logger.                                         |
| **authentication.properties** | Microsoft Entra ID and program configuration.                                                        |
| **AuthenticationFilter.java** | Redirects unauthenticated requests to protected resources to a 401 page.                             |
| **MsalAuthSession**           | Instantiated with an `HttpSession`. Stores all MSAL related session attributes in session attribute. |
| **____Servlet.java**          | All of the endpoints available are defined in **.java** classes ending in **____Servlet.java**.          |
| **CHANGELOG.md**              | List of changes to the sample.                                                                       |
| **CONTRIBUTING.md**           | Guidelines for contributing to the sample.                                                           |
| **LICENSE**                   | The license for the sample.                                                                          |

### ConfidentialClientApplication

A `ConfidentialClientApplication` instance is created in the **AuthHelper.java** file, as shown in the following example. This object helps craft the Azure AD B2C authorization URL and also helps exchange the authentication token for an access token.

```java
IClientSecret secret = ClientCredentialFactory.createFromSecret(SECRET);
confClientInstance = ConfidentialClientApplication
                     .builder(CLIENT_ID, secret)
                     .b2cAuthority(AUTHORITY + policy)
                     .build();
```

The following parameters are used for instantiation:

- The Client ID of the app.
- The client secret, which is a requirement for Confidential Client Applications.
- The Azure AD B2C Authority concatenated with the appropriate `UserFlowPolicy` for sign-up, sign-in, profile-edit, or password-reset.

In this sample, these values are read from the **authentication.properties** file using a properties reader in the **Config.java** file.

### Step-by-step walkthrough

The following steps provide a walkthrough of the app's functionality:

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint for your Azure Active Directory B2C tenant. The MSAL4J `ConfidentialClientApplication` instance is used to construct an authorization request URL, and the app redirects the browser to this URL, as shown in the following example:

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

   The following list describes the features of this code:

   - `AuthorizationRequestUrlParameters`: Parameters that must be set in order to build an AuthorizationRequestUrl.

   - `REDIRECT_URI`: Where Azure AD B2C redirects the browser - along with the auth code - after collecting the user credentials.

   - `SCOPES`: [Scopes](/azure/active-directory-b2c/access-tokens#scopes) are permissions requested by the application.

     Normally, the three scopes `openid profile offline_access` would suffice for receiving an ID token response. However, MSAL4J requires all responses from Azure AD B2C to also contain an access token.

     In order for Azure AD B2C to dispense an access token as well as an ID token, the request must include an additional resource scope. Because this app doesn't actually require an external resource scope, it adds its own client ID as a fourth scope in order to receive an access token.

     You can find a full list of scopes requested by the app in the **authentication.properties** file.

   - `ResponseMode.QUERY`: Azure AD B2C can return the response as form params in an HTTP POST request or as query string params in an HTTP GET request.

   - `Prompt.SELECT_ACCOUNT`: Azure AD B2C should ask the user to select the account that they intend to authenticate against.

   - `state`: A unique variable set by the app into the session on each token request and destroyed after receiving the corresponding Azure AD B2C redirect callback. The state variable ensures that Azure AD B2C requests to the `/auth_redirect endpoint` are actually from Azure AD B2C authorization requests originating from this app and this session, thereby preventing CSRF attacks. This is done in the **AADRedirectServlet.java** file.

   - `nonce`: A unique variable set by the app into the session on each token request, and destroyed after receiving the corresponding token. This nonce is transcribed to the resulting tokens dispensed Azure AD B2C, thereby ensuring that there's no token-replay attack occurring.

1. The user is presented with a sign-in prompt by Azure Active Directory B2C. If the sign-in attempt is successful, the user's browser is redirected to the app's redirect endpoint. A valid request to this endpoint contains an [authorization code](/azure/active-directory-b2c/authorization-code-flow).

1. The `ConfidentialClientApplication` instance then exchanges this authorization code for an ID token and access token from Azure Active Directory B2C, as shown in the following example:

   ```java
   final AuthorizationCodeParameters authParams = AuthorizationCodeParameters
                       .builder(authCode, new URI(REDIRECT_URI))
                       .scopes(Collections.singleton(SCOPES)).build();

   final ConfidentialClientApplication client = AuthHelper
           .getConfidentialClientInstance(policy);
   final Future<IAuthenticationResult> future = client.acquireToken(authParams);
   final IAuthenticationResult result = future.get();
   ```

   The following list describes the features of this code:

   - `AuthorizationCodeParameters`: Parameters that must be set in order to exchange the Authorization Code for an ID and/or access token.
   - `authCode`: The authorization code that was received at the redirect endpoint.
   - `REDIRECT_URI`: The redirect URI used in the previous step must be passed again.
   - `SCOPES`: The scopes used in the previous step must be passed again.

1. If `acquireToken` is successful, the token claims are extracted and the nonce claim is validated against the nonce stored in the session, as shown in the following example:

   ```java
   parseJWTClaimsSetAndStoreResultInSession(msalAuth, result, serializedTokenCache);
   validateNonce(msalAuth)
   processSuccessfulAuthentication(msalAuth);
   ```

1. If the nonce is successfully validated, authentication status is put into a server-side session, leveraging methods exposed by the `MsalAuthSession` class, as shown in the following example:

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
