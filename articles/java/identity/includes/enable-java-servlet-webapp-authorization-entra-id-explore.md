---
ms.author: bbanerjee
ms.date: 01/01/2024
ms.custom: devx-track-java
---

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.
- Click the context-sensitive button at the top right (it reads `Sign In` on first run)
- Follow the instructions on the next page to sign in with an account in the Microsoft Entra ID tenant.
- On the consent screen, note the scopes that are being requested.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- The middle of the screen now has an option to click for **ID Token Details**: click it to see some of the ID token's decoded claims.
- Click the **Call Graph** button to make a call to Microsoft Graph's [/me endpoint](/graph/api/user-get?view=graph-rest-1.0&tabs=java#example-2-signed-in-user-request) and see a selection of user details obtained.
- You can also use the button on the top right to sign out.

## Contents

The full code for this sample is available at [https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/2-Authorization-I/call-graph](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/tree/main/2-Authorization-I/call-graph). The below table lists the overall parts of this sample.

| File/folder                                                        | Description                                                                             |
|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| *AppCreationScripts/*                                              | Scripts to automatically configure Microsoft Entra ID app registrations.                |
| *src/main/java/com/microsoft/azuresamples/msal4j/callgraphwebapp/* | This directory contains the classes that define the web app's backend business logic.   |
| *src/main/java/com/microsoft/azuresamples/msal4j/authservlets/*    | This directory contains the classes that are used for sign in and sign out endpoints.   |
| *____Servlet.java*                                                 | All of the endpoints available are defined in .java classes ending in ____Servlet.java. |
| *src/main/java/com/microsoft/azuresamples/msal4j/helpers/*         | Helper classes for authentication.                                                      |
| *AuthenticationFilter.java*                                        | Redirects unauthenticated requests to protected endpoints to a 401 page.                |
| *src/main/resources/authentication.properties*                     | Microsoft Entra ID and program configuration.                                           |
| *src/main/webapp/*                                                 | This directory contains the UI (JSP templates)                                          |
| *CHANGELOG.md*                                                     | List of changes to the sample.                                                          |
| *CONTRIBUTING.md*                                                  | Guidelines for contributing to the sample.                                              |
| *LICENSE*                                                          | The license for the sample.                                                             |

## About the code

This sample uses **MSAL for Java (MSAL4J)** to sign a user in and obtain a token for MS Graph API. It leverages [Microsoft Graph SDK for Java](https://github.com/microsoftgraph/msgraph-sdk-java) to obtain data from Graph. You must add these libraries to your projects using Maven. If you want to replicate this sample's behavior, you may choose to copy the *pom.xml* file, and the contents of the `helpers` and `authservlets` packages in the *src/main/java/com/microsoft/azuresamples/msal4j* package. You also need the *authentication.properties* file. These classes and files contain generic code that can be used in a wide array of applications. The rest of the sample may be copied as well, but the other classes and files are built specifically to address this sample's objective.

A `ConfidentialClientApplication` instance is created in the *AuthHelper.java* file. This object helps craft the Microsoft Entra ID authorization URL and also helps exchange the authentication token for an access token.

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
   - **REDIRECT_URI**: Where Microsoft Entra ID redirects the browser (along with auth code) after collecting user credentials. It must match the redirect URI in the Microsoft Entra ID app registration on [Azure Portal](https://portal.azure.com)
   - **SCOPES**: [Scopes](/entra/identity-platform/access-tokens#scopes) are permissions requested by the application.
     - Normally, the three scopes `openid profile offline_access` suffice for receiving an ID Token response.
     - Full list of scopes requested by the app can be found in the *authentication.properties* file. You can add more scopes like User.Read and so on.

1. The user is presented with a sign-in prompt by Microsoft Entra ID. If the sign-in attempt is successful, the user's browser is redirected to our app's redirect endpoint. A valid request to this endpoint contain an [authorization code](/entra/identity-platform/v2-oauth2-auth-code-flow).
1. Our ConfidentialClientApplication instance then exchanges this authorization code for an ID Token and Access Token from Microsoft Entra ID.

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
# for example, /token_details requires any user to be signed in and does not require special roles or groups claim(s)
app.protect.authenticated=/token_details, /call_graph
```

### Call Graph

When the user navigates to `/call_graph`, the application creates an instance of the IGraphServiceClient (Java Graph SDK), passing along the signed-in user's access token. The Graph client from hereon places the access token in the Authorization headers of its requests. The app then asks the Graph Client to call the  `/me` endpoint to yield details for the currently signed-in user.

The following code is all that is required for an application developer to write for accessing the `/me` endpoint, provided that they already have a valid access token for Graph Service with the `User.Read` scope.

```java
//CallGraphServlet.java
User user = GraphHelper.getGraphClient(contextAdapter).me().buildRequest().get();
```

### Scopes

- [Scopes](/entra/identity-platform/permissions-consent-overview) tell Microsoft Entra ID the level of access that the application is requesting.
- Based on the requested scopes, Microsoft Entra ID presents a consent dialogue to the user upon signing in.
- If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting `access_token`.
- Note the scope requested by the application by referring to *authentication.properties*. By default, the application sets the scopes value to `User.Read`.
- This particular MS Graph API scope is for accessing the information of the currently-signed-in user. The graph endpoint for accessing this info is `https://graph.microsoft.com/v1.0/me`
- Any valid requests made to this endpoint must bear an `access_token` that contains the scope `User.Read` in the Authorization header.

## More information

- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](/entra/identity-platform/quickstart-register-app)

- [Understanding Microsoft Entra ID application consent experiences](/en-us/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/en-us/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [MSAL code samples](/en-us/entra/identity-platform/sample-v2-code?tabs=framework#java)
