---
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Select the context-sensitive button at the top right (it reads **Sign In** on first run)
- Follow the instructions on the next page to sign in with an account in the Microsoft Entra ID tenant.
- On the consent screen, note the scopes that are being requested.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- Select **ID Token Details** to see some of the ID token's decoded claims.
- Select **Admins Only** to view the `/admin_only` page. Only users with app role **PrivilegedAdmin** can view this page. Otherwise an authorization failure message is displayed.
- Select **Regular Users** to view the `/regular_user` page. Only users with app role **RegularUser** or **PrivilegedAdmin** can view this page. Otherwise an authorization failure message is displayed.
- You can also use the button on the top right to sign out.

## Contents

The full code for this sample is available at [https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/3-Authorization-II/roles](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/3-Authorization-II/roles). The following table lists the overall parts of this sample:

| File/folder                                                     | Description                                                                            |
|-----------------------------------------------------------------|----------------------------------------------------------------------------------------|
| *AppCreationScripts/*                                           | Scripts to automatically configure Microsoft Entra ID app registrations.               |
| *src/main/java/com/microsoft/azuresamples/msal4j/roles/*        | This directory contains the classes that define the web app's backend business logic.  |
| *src/main/java/com/microsoft/azuresamples/msal4j/authservlets/* | This directory contains the classes that are used for sign in and sign out endpoints.  |
| *____Servlet.java*                                              | All of the endpoints available are defined in .java classes ending in ____Servlet.java |
| *src/main/java/com/microsoft/azuresamples/msal4j/helpers/*      | Helper classes for authentication.                                                     |
| *AuthenticationFilter.java*                                     | Redirects unauthenticated requests to protected endpoints to a 401 page.               |
| *src/main/resources/authentication.properties*                  | Microsoft Entra ID and program configuration.                                          |
| *src/main/webapp/*                                             | This directory contains the UI (JSP templates)                                         |
| *CHANGELOG.md*                                                  | List of changes to the sample.                                                         |
| *CONTRIBUTING.md*                                               | Guidelines for contributing to the sample.                                             |
| *LICENSE*                                                       | The license for the sample.                                                            |

## Process a roles claim in the ID token

The names of the roles that the signed in user is assigned to is returned in the `roles` claim of the token.

```json
{
  ...
  "roles": [
    "Role1",
    "Role2",]
  ...
}
```

## About the code

This sample uses **MSAL for Java (MSAL4J)** to sign a user in and obtain an ID token that may contain the roles claim. Based on the roles claim present, the signed-in user can access none, one, or both of the protected pages, `Admins Only` and `Regular Users`.

If you want to replicate this sample's behavior, you may choose to copy the *pom.xml* file, and the contents of the `helpers` and `authservlets` packages in the `src/main/java/com/microsoft/azuresamples/msal4j` package. You also need the *authentication.properties* file. These classes and files contain generic code that can be used in a wide array of applications. The rest of the sample may be copied as well, but the other classes and files are built specifically to address this sample's objective.

A `ConfidentialClientApplication` instance is created in the *AuthHelper.java* file. This object helps craft the AAD authorization URL and also helps exchange the authentication token for an access token.

```java
// getConfidentialClientInstance method
IClientSecret secret = ClientCredentialFactory.createFromSecret(SECRET);
confClientInstance = ConfidentialClientApplication
                    .builder(CLIENT_ID, secret)
                    .authority(AUTHORITY)
                    .build();
```

The following parameters need to be provided upon instantiation:

- The **Client ID** of the app
- The **Client Secret**, which is a requirement for Confidential Client Applications
- The **Microsoft Entra ID Authority**, which includes your AAD tenant ID.

In this sample, these values are read from the *authentication.properties* file using a properties reader in the *Config.java* file.

### Step-by-step walkthrough

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint on for our Microsoft Entra ID Tenant. Our MSAL4J `ConfidentialClientApplication` instance is leveraged to construct an authorization request URL. Our app redirects the browser to this URL, which is where the user signs in.

   ```java
   final ConfidentialClientApplication client = getConfidentialClientInstance();
   AuthorizationRequestUrlParameters parameters = AuthorizationRequestUrlParameters.builder(Config.REDIRECT_URI, Collections.singleton(Config.SCOPES))
           .responseMode(ResponseMode.QUERY).prompt(Prompt.SELECT_ACCOUNT).state(state).nonce(nonce).build();

   final String authorizeUrl = client.getAuthorizationRequestUrl(parameters).toString();
   contextAdapter.redirectUser(authorizeUrl);
   ```

   - **AuthorizationRequestUrlParameters**: Parameters that must be set in order to build an AuthorizationRequestUrl.
   - **REDIRECT_URI**: Where Microsoft Entra ID redirects the browser (along with auth code) after collecting user credentials. It must match the redirect URI in the  Microsoft Entra ID app registration on [Azure Portal](https://portal.azure.com)
   - **SCOPES**: [Scopes](/entra/identity-platform/access-tokens#scopes) are permissions requested by the application.
     - Normally, the three scopes `openid profile offline_access` suffice for receiving an ID token response.
     - Full list of scopes requested by the app can be found in the *authentication.properties* file. You can add more scopes like User.Read and so on.

1. The user is presented with a sign-in prompt by Microsoft Entra ID. If the sign-in attempt is successful, the user's browser is redirected to our app's redirect endpoint. A valid request to this endpoint contain an [authorization code](/entra/identity-platform/v2-oauth2-auth-code-flow).
1. Our `ConfidentialClientApplication` instance then exchanges this authorization code for an ID token and access token from Microsoft Entra ID.

   ```java
   // First, validate the state, then parse any error codes in response, then extract the authCode. Then:
   // build the auth code params:
   final AuthorizationCodeParameters authParams = AuthorizationCodeParameters
           .builder(authCode, new URI(Config.REDIRECT_URI)).scopes(Collections.singleton(Config.SCOPES)).build();

   // Get a client instance and leverage it to acquire the token:
   final ConfidentialClientApplication client = AuthHelper.getConfidentialClientInstance();
   final IAuthenticationResult result = client.acquireToken(authParams).get();
   ```

   - **AuthorizationCodeParameters**: Parameters that must be set in order to exchange the Authorization Code for an ID and/or access token.
   - **authCode**: The authorization code that was received at the redirect endpoint.
   - **REDIRECT_URI**: The redirect URI used in the previous step must be passed again.
   - **SCOPES**: The scopes used in the previous step must be passed again.

1. If `acquireToken` is successful, the token claims are extracted. If the nonce check passes, the results are placed in `context` (an instance of `IdentityContextData`) and saved to the session. The application can then instantiate this from the session (by way of an instance of `IdentityContextAdapterServlet`) whenever it needs access to it:

   ```java
   // parse IdToken claims from the IAuthenticationResult:
   // (the next step - validateNonce - requires parsed claims)
   context.setIdTokenClaims(result.idToken());

   // if nonce is invalid, stop immediately! this could be a token replay!
   // if validation fails, throws exception and cancels auth:
   validateNonce(context);

   // set user to authenticated:
   context.setAuthResult(result, client.tokenCache().serialize());
   ```

### Protect the routes

See *AuthenticationFilter.java* for how the sample app filters access to routes. In the *authentication.properties* file, the key `app.protect.authenticated` contains the comma-separated routes that are to be accessed by authenticated users only.

```ini
# for example, /token_details requires any user to be signed in and does not require special roles claim(s)
app.protect.authenticated=/token_details
```

Any of the routes listed in the comma-separated rule sets under the `app.protect.roles` are also off-limits to non-authenticated authenticated users.

However, these routes also contain a space-separated list of app role memberships: only users having at least one of the corresponding roles can access these routes after authenticating.

```ini
# local short names for app roles - for example, sets admin to mean PrivilegedAdmin (useful for long rule sets defined in the next key, app.protect.roles)
app.roles=admin PrivilegedAdmin, user RegularUser

# A route and its corresponding <space-separated> role(s) that can access it; the start of the next route & its role(s) is delimited by a <comma-and-space-separator>
# this says: /admins_only can be accessed by PrivilegedAdmin, /regular_user can be accessed by PrivilegedAdmin role and the RegularUser role
app.protect.roles=/admin_only admin, /regular_user admin user
```

### Scopes

- [Scopes](/entra/identity-platform/permissions-consent-overview) tell Microsoft Entra ID the level of access that the application is requesting.
- Based on the requested scopes, Microsoft Entra ID presents a consent dialogue to the user upon signing in.
- If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting `access_token`.
- Note the scopes requested by the application by referring to *authentication.properties*. These three scopes are requested by MSAL and given by Microsoft Entra ID by default.

## More information

- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform](/entra/identity-platform/)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](/entra/identity-platform/quickstart-register-app)

- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
- [How to: Add app roles to your application and receive them in the token](/entra/identity-platform/howto-add-app-roles-in-apps)
- [Manage user assignment for an app in Microsoft Entra ID](/entra/identity/enterprise-apps/assign-user-or-group-access-portal?pivots=portal#assign-a-user-to-an-app---portal)
