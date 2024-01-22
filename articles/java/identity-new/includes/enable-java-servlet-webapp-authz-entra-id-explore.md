---
ms.author: bbanerjee
ms.topic: include
ms.date: 01/01/2024
ms.custom: devx-track-java
---

## Explore the sample

- Note the signed-in or signed-out status displayed at the center of the screen.P
- Click the context-sensitive button at the top right (it will read `Sign In` on first run)
- Follow the instructions on the next page to sign in with an account in the Azure AD tenant.
- On the consent screen, note the scopes that are being requested.
- Note the context-sensitive button now says `Sign out` and displays your username to its left.
- The middle of the screen now has an option to click for **ID Token Details**: click it to see some of the ID token's decoded claims.
- Click the **Call Graph** button to make a call to Microsoft Graph's [/me endpoint](https://docs.microsoft.com/graph/api/user-get?view=graph-rest-1.0&tabs=java#example-2-signed-in-user-request) and see a selection of user details obtained.
- You can also use the button on the top right to sign out.


## About the code

This sample uses **MSAL for Java (MSAL4J)** to sign a user in and obtain a token for MS Graph API. It leverages [Microsoft Graph SDK for Java](https://github.com/microsoftgraph/msgraph-sdk-java) to obtain data from Graph. You must add these libraries to your projects using Maven. If you want to replicate this sample's behavior, you may choose to copy the `pom.xml` file, and the contents of the `helpers` and `authservlets` packages in the `src/main/java/com/microsoft/azuresamples/msal4j` package. You'll also need the [authentication.properties file](src/main/resources/authentication.properties). These classes and files contain generic code that can be used in a wide array of applications. The rest of the sample may be copied as well, but the other classes and files are built specifically to address this sample's objective.

A **ConfidentialClientApplication** instance is created in the [AuthHelper.java](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/helpers/AuthHelper.java) class. This object helps craft the AAD authorization URL and also helps exchange the authentication token for an access token.

```Java
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
- The **Azure AD Authority**, which includes your AAD tenant ID.

In this sample, these values are read from the [authentication.properties](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in/src/main/resources/authentication.properties) file using a properties reader in the class [Config.java](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in/src/main/java/com/microsoft/azuresamples/msal4j/helpers/Config.java).

### Step-by-step walkthrough

1. The first step of the sign-in process is to send a request to the `/authorize` endpoint on for our Azure Active Directory Tenant. Our MSAL4J `ConfidentialClientApplication` instance is leveraged to construct an authorization request URL. Our app redirects the browser to this URL, which is where the user will sign in.

    ```Java
    final ConfidentialClientApplication client = getConfidentialClientInstance();
    AuthorizationRequestUrlParameters parameters = AuthorizationRequestUrlParameters.builder(Config.REDIRECT_URI, Collections.singleton(Config.SCOPES))
            .responseMode(ResponseMode.QUERY).prompt(Prompt.SELECT_ACCOUNT).state(state).nonce(nonce).build();

    final String authorizeUrl = client.getAuthorizationRequestUrl(parameters).toString();
    contextAdapter.redirectUser(authorizeUrl);
    ```

    - **AuthorizationRequestUrlParameters**: Parameters that must be set in order to build an AuthorizationRequestUrl.
    - **REDIRECT_URI**: Where Microsoft Entra ID will redirect the browser (along with auth code) after collecting user credentials. It must match the redirect URI in the Microsoft Entra ID app registration on [Azure Portal](https://portal.azure.com)
    - **SCOPES**: [Scopes](https://docs.microsoft.com/azure/active-directory/develop/access-tokens#scopes) are permissions requested by the application.
      - Normally, the three scopes `openid profile offline_access` suffice for receiving an ID Token response.
      - Full list of scopes requested by the app can be found in the [authentication.properties file](https://github.com/Azure-Samples/ms-identity-java-servlet-webapp-authentication/blob/main/1-Authentication/sign-in/src/main/resources/authentication.properties). You can add more scopes like User.Read and so on.

1. The user is presented with a sign-in prompt by Azure Active Directory. If the sign-in attempt is successful, the user's browser is redirected to our app's redirect endpoint. A valid request to this endpoint will contain an [**authorization code**](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow).
1. Our ConfidentialClientApplication instance then exchanges this authorization code for an ID Token and Access Token from Azure Active Directory.

    ```Java
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

### Protecting the routes

See `AuthenticationFilter.java` for how the sample app filters access to routes. In the `authentication.properties` file, the key `app.protect.authenticated` contains the comma-separated routes that are to be accessed by authenticated users only.

```ini
# e.g., /token_details requires any user to be signed in and does not require special roles or groups claim(s)
app.protect.authenticated=/token_details
```

### Call Graph

When the user navigates to `/call_graph`, the application creates an instance of the IGraphServiceClient (Java Graph SDK), passing along the signed-in user's access token. The Graph client from hereon places the access token in the Authorization headers of its requests. The app then asks the Graph Client to call the  `/me` endpoint to yield details for the currently signed-in user.

The following code is all that is required for an application developer to write for accessing the `/me` endpoint, provided that they already have a valid access token for Graph Service with the `User.Read` scope.

  ```java
  //CallGraphServlet.java
  User user = GraphHelper.getGraphClient(contextAdapter).me().buildRequest().get();
  ```

### Scopes

- [Scopes](https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent) tell Azure AD the level of access that the application is requesting.
- Based on the requested scopes, Azure AD presents a consent dialogue to the user upon signing in.
- If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting `access_token`.
- Note the scope requested by the application by referring to [authentication.properties](./src/main/resources/authentication.properties). By default, the application sets the scopes value to `User.Read`.
- This particular MS Graph API scope is for accessing the information of the currently-signed-in user. The graph endpoint for accessing this info is `https://graph.microsoft.com/v1.0/me`
- Any valid requests made to this endpoint must bear an `access_token` that contains the scope `User.Read` in the Authorization header.


## More information

- [Microsoft Authentication Library \(MSAL\) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform (Azure Active Directory for developers)](https://docs.microsoft.com/azure/active-directory/develop/)
- [Quickstart: Register an application with the Microsoft identity platform (Preview)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)

- [Understanding Azure AD application consent experiences](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience)
- [Understand user and admin consent](https://docs.microsoft.com/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent)
- [MSAL code samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code)
