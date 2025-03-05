---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
---

## Explore the sample

Use the following steps to explore the sample:

1. Notice the signed-in or signed-out status displayed at the center of the screen.
1. Select the context-sensitive button in the corner. This button reads **Sign In** when you first run the app.
1. On the next page, follow the instructions and sign in with an account in the Microsoft Entra ID tenant.
1. On the consent screen, notice the scopes that are being requested.
1. Notice that the context-sensitive button now says **Sign out** and displays your username.
1. Select **ID Token Details** to see some of the ID token's decoded claims.
1. Select **Call Graph** to make a call to Microsoft Graph's [/me endpoint](/graph/api/user-get?tabs=java#example-2-signed-in-user-request) and see a selection of the user details obtained.
1. Use the button in the corner to sign out.

## About the code

This sample uses MSAL for Java (MSAL4J) to sign a user in and obtain a token for Microsoft Graph API. It uses [Microsoft Graph SDK for Java](https://github.com/microsoftgraph/msgraph-sdk-java) to obtain data from Graph. You must add these libraries to your projects using Maven.

If you want to replicate this sample's behavior, you can copy the **pom.xml** file and the contents of the **helpers** and **authservlets** folders in the **src/main/java/com/microsoft/azuresamples/msal4j** folder. You also need the **authentication.properties** file. These classes and files contain generic code that you can use in a wide array of applications. You can copy the rest of the sample as well, but the other classes and files are built specifically to address this sample's objective.

### Contents

The following table shows the contents of the sample project folder:

| File/folder                                                        | Description                                                                                 |
|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **src/main/java/com/microsoft/azuresamples/msal4j/callgraphwebapp/** | This directory contains the classes that define the app's backend business logic.           |
| **src/main/java/com/microsoft/azuresamples/msal4j/authservlets/**    | This directory contains the classes that are used for sign in and sign out endpoints.       |
| **\*Servlet.java**                                                 | All of the endpoints available are defined in Java classes with names ending in `Servlet`. |
| **src/main/java/com/microsoft/azuresamples/msal4j/helpers/**         | Helper classes for authentication.                                                          |
| **AuthenticationFilter.java**                                        | Redirects unauthenticated requests to protected endpoints to a 401 page.                    |
| **src/main/resources/authentication.properties**                     | Microsoft Entra ID and program configuration.                                               |
| **src/main/webapp/**                                                 | This directory contains the UI - JSP templates                                              |
| **CHANGELOG.md**                                                     | List of changes to the sample.                                                              |
| **CONTRIBUTING.md**                                                  | Guidelines for contributing to the sample.                                                  |
| **LICENSE**                                                          | The license for the sample.                                                                 |

### ConfidentialClientApplication

A `ConfidentialClientApplication` instance is created in the **AuthHelper.java** file, as shown in the following example. This object helps craft the Microsoft Entra ID authorization URL and also helps exchange the authentication token for an access token.

```java
// getConfidentialClientInstance method
IClientSecret secret = ClientCredentialFactory.createFromSecret(SECRET);
confClientInstance = ConfidentialClientApplication
                     .builder(CLIENT_ID, secret)
                     .authority(AUTHORITY)
                     .build();
```

The following parameters are used for instantiation:

- The client ID of the app.
- The client secret, which is a requirement for Confidential Client Applications.
- The Microsoft Entra ID Authority, which includes your Microsoft Entra tenant ID.

In this sample, these values are read from the **authentication.properties** file using a properties reader in the **Config.java** file.

### Step-by-step walkthrough

The following steps provide a walkthrough of the app's functionality:

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint on for your Microsoft Entra ID tenant. The MSAL4J `ConfidentialClientApplication` instance is used to construct an authorization request URL. The app redirects the browser to this URL, which is where the user signs in.

   ```java
   final ConfidentialClientApplication client = getConfidentialClientInstance();
   AuthorizationRequestUrlParameters parameters = AuthorizationRequestUrlParameters.builder(Config.REDIRECT_URI, Collections.singleton(Config.SCOPES))
           .responseMode(ResponseMode.QUERY).prompt(Prompt.SELECT_ACCOUNT).state(state).nonce(nonce).build();

   final String authorizeUrl = client.getAuthorizationRequestUrl(parameters).toString();
   contextAdapter.redirectUser(authorizeUrl);
   ```

   The following list describes the features of this code:

   - `AuthorizationRequestUrlParameters`: Parameters that must be set in order to build an `AuthorizationRequestUrl`.
   - `REDIRECT_URI`: Where Microsoft Entra ID redirects the browser - along with the auth code - after collecting user credentials. It must match the redirect URI in the Microsoft Entra ID app registration in the [Azure portal](https://portal.azure.com)
   - `SCOPES`: [Scopes](/entra/identity-platform/access-tokens#scopes) are permissions requested by the application.
     - Normally, the three scopes `openid profile offline_access` suffice for receiving an ID token response.
     - Full list of scopes requested by the app can be found in the **authentication.properties** file. You can add more scopes such as `User.Read`.

1. The user is presented with a sign-in prompt by Microsoft Entra ID. If the sign-in attempt is successful, the user's browser is redirected to the app's redirect endpoint. A valid request to this endpoint contains an [authorization code](/entra/identity-platform/v2-oauth2-auth-code-flow).

1. The `ConfidentialClientApplication` instance then exchanges this authorization code for an ID token and access token from Microsoft Entra ID.

   ```java
   // First, validate the state, then parse any error codes in response, then extract the authCode. Then:
   // build the auth code params:
   final AuthorizationCodeParameters authParams = AuthorizationCodeParameters
           .builder(authCode, new URI(Config.REDIRECT_URI)).scopes(Collections.singleton(Config.SCOPES)).build();

   // Get a client instance and leverage it to acquire the token:
   final ConfidentialClientApplication client = AuthHelper.getConfidentialClientInstance();
   final IAuthenticationResult result = client.acquireToken(authParams).get();
   ```

   The following list describes the features of this code:

   - `AuthorizationCodeParameters`: Parameters that must be set in order to exchange the Authorization Code for an ID and/or access token.
   - `authCode`: The authorization code that was received at the redirect endpoint.
   - `REDIRECT_URI`: The redirect URI used in the previous step must be passed again.
   - `SCOPES`: The scopes used in the previous step must be passed again.

1. If `acquireToken` is successful, the token claims are extracted. If the nonce check passes, the results are placed in `context` - an instance of `IdentityContextData` - and saved to the session. The application can then instantiate the `IdentityContextData` from the session by way of an instance of `IdentityContextAdapterServlet` whenever it needs access to it, as shown in the following code:

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

For information about how the sample app filters access to routes, see **AuthenticationFilter.java**. In the **authentication.properties** file, the `app.protect.authenticated` property contains the comma-separated routes that only authenticated users can access, as shown in the following example:

```ini
# for example, /token_details requires any user to be signed in and does not require special roles or groups claim(s)
app.protect.authenticated=/token_details, /call_graph
```

### Call graph

When the user navigates to `/call_graph`, the application creates an instance of the `IGraphServiceClient` - from the Java Graph SDK - passing along the signed-in user's access token. The Graph client places the access token in the `Authorization` headers of its requests. The app then asks the Graph client to call the `/me` endpoint to yield details for the currently signed-in user.

If you already have a valid access token for Graph Service with the `User.Read` scope, you only need the following code to get access to the `/me` endpoint:

```java
//CallGraphServlet.java
User user = GraphHelper.getGraphClient(contextAdapter).me().buildRequest().get();
```

### Scopes

[Scopes](/entra/identity-platform/permissions-consent-overview) tell Microsoft Entra ID the level of access that the application is requesting.

Based on the requested scopes, Microsoft Entra ID presents a consent dialogue to the user upon sign-in. If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting `access_token`.

For the scopes requested by the application, see **authentication.properties**. By default, the application sets the scopes value to `User.Read`. This particular Microsoft Graph API scope is for accessing the information of the current signed-in user. The graph endpoint for accessing this info is `https://graph.microsoft.com/v1.0/me`. Any valid requests made to this endpoint must bear an `access_token` that contains the scope `User.Read` in the `Authorization` header.

## More information

- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
