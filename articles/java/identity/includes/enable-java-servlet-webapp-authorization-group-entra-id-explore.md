---
author: KarlErickson
ms.author: bbanerjee
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
1. Select **Groups** to see any information about security group membership for the signed-in user.
1. Select **Admin Only** or **Regular User** to access the groups claim protected endpoints.
   - If your signed-in user is in the `GroupAdmin` group, the user can enter both pages.
   - If your signed-in user is in the `GroupMember` group, the user can enter the **Regular User** page only.
   - If your signed-in user is in neither group, the user can't access either of the two pages.
1. Use the button in the corner to sign out.
1. After signing out, select **ID Token Details** to observe that the app displays a `401: unauthorized` error instead of the ID token claims when the user isn't authorized.

## About the code

This sample uses MSAL for Java (MSAL4J) to sign a user in and obtain an ID token that might contain the groups claim. If there are too many groups for emission in the ID token, the sample uses [Microsoft Graph SDK for Java](https://github.com/microsoftgraph/msgraph-sdk-java) to obtain the group membership data from Microsoft Graph. Based on the groups the user belongs to, the signed-in user can access either none, one, or both of the protected pages, `Admins Only` and `Regular Users`.

If you want to replicate this sample's behavior, you must add MSAL4J and Microsoft Graph SDK to your projects using Maven. You can copy the *pom.xml* file and the contents of the *helpers* and *authservlets* folders in the *src/main/java/com/microsoft/azuresamples/msal4j* folder. You also need the *authentication.properties* file. These classes and files contain generic code that you can use in a wide array of applications. You can copy the rest of the sample as well, but the other classes and files are built specifically to address this sample's objective.

## Contents

The following table shows the contents of the sample project folder:

| File/folder                                                     | Description                                                                                 |
|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| *src/main/java/com/microsoft/azuresamples/msal4j/groupswebapp/* | This directory contains the classes that define the app's backend business logic.           |
| *src/main/java/com/microsoft/azuresamples/msal4j/authservlets/* | This directory contains the classes that are used for sign in and sign out endpoints.       |
| *____Servlet.java*                                              | All of the endpoints available are defined in *.java* classes ending in *____Servlet.java*. |
| *src/main/java/com/microsoft/azuresamples/msal4j/helpers/*      | Helper classes for authentication.                                                          |
| *AuthenticationFilter.java*                                     | Redirects unauthenticated requests to protected endpoints to a 401 page.                    |
| *src/main/resources/authentication.properties*                  | Microsoft Entra ID and program configuration.                                               |
| *src/main/webapp/*                                              | This directory contains the UI - JSP templates                                              |
| *CHANGELOG.md*                                                  | List of changes to the sample.                                                              |
| *CONTRIBUTING.md*                                               | Guidelines for contributing to the sample.                                                  |
| *LICENSE*                                                       | The license for the sample.                                                                 |

## Process a groups claim in tokens, including handling overage

The following sections describe how the app processes a groups claim.

### The groups claim

The object ID of the security groups the signed-in user is member of is returned in the groups claim of the token, shown in the following example:

```json
{
  ...
  "groups": [
    "0bbe91cc-b69e-414d-85a6-a043d6752215",
    "48931dac-3736-45e7-83e8-015e6dfd6f7c",]
  ...
}
```

### The groups overage claim

To ensure that the token size doesn't exceed HTTP header size limits, the Microsoft identity platform limits the number of object IDs that it includes in the groups claim.

The overage limit is 150 for SAML tokens, 200 for JWT tokens, and 6 for Single Page applications. If a user is member of more groups than the overage limit, then the Microsoft identity platform does not emit the group IDs in the groups claim in the token. Instead, it includes an overage claim in the token that indicates to the application to query the [Microsoft Graph API](https://graph.microsoft.com) to retrieve the user's group membership, as shown in the following example:

```json
{
  ...
  "_claim_names": {
    "groups": "src1"
    },
    {
   "_claim_sources": {
    "src1": {
        "endpoint":"[Graph Url to get this user's group membership from]"
        }
    }
  ...
}
```

#### Create the overage scenario in this sample for testing

To create the overage scenario, you can use the following steps:

1. You can use the *BulkCreateGroups.ps1* file provided in the *AppCreationScripts* folder to create a large number of groups and assign users to them. This file helps test overage scenarios during development. Remember to change the user's `objectId` provided in the *BulkCreateGroups.ps1* script.

1. When you run this sample and an overage occurs, you see the `_claim_names` in the home page after the user signs in.

1. We strongly advise that you use the group filtering feature, if possible, to avoid running into group overages. For more information, see the section [Configure your application to receive the groups claim values from a filtered set of groups a user might be assigned to](#configure-your-application-to-receive-the-groups-claim-values-from-a-filtered-set-of-groups-a-user-might-be-assigned-to).

1. In case you cannot avoid running into group overage, we suggest you use the following steps to process the groups claim in your token:

   1. Check for the claim `_claim_names` with one of the values being *groups*. This indicates overage.
   1. If found, make a call to the endpoint specified in `_claim_sources` to fetch user's groups.
   1. If none found, look into the *groups*  claim for user's groups.

> [!NOTE]
> Handling overage requires a call to [Microsoft Graph](https://graph.microsoft.com) to read the signed-in user's group memberships, so your app needs to have the [GroupMember.Read.All](/graph/permissions-reference#group-permissions) permission for the [getMemberObjects](/graph/api/user-getmemberobjects) function to execute successfully.
>
> For more information about programming for Microsoft Graph, see the video [An introduction to Microsoft Graph for developers](https://www.youtube.com/watch?v=EBbnpFdB92A).

### ConfidentialClientApplication

A `ConfidentialClientApplication` instance is created in the *AuthHelper.java* file, as shown in the following example. This object helps craft the Microsoft Entra authorization URL and also helps exchange the authentication token for an access token.

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

In this sample, these values are read from the *authentication.properties* file using a properties reader in the *Config.java* file.

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

   - `AuthorizationRequestUrlParameters`: Parameters that must be set in order to build an AuthorizationRequestUrl.
   - `REDIRECT_URI`: Where Microsoft Entra redirects the browser - along with the auth code - after collecting user credentials. It must match the redirect URI in the Microsoft Entra ID app registration in the [Azure portal](https://portal.azure.com).
   - `SCOPES`: [Scopes](/entra/identity-platform/access-tokens#scopes) are permissions requested by the application.
     - Normally, the three scopes `openid profile offline_access` suffice for receiving an ID token response.
     - Full list of scopes requested by the app can be found in the *authentication.properties* file. You can add more scopes like User.Read and so on.

1. The user is presented with a sign-in prompt by Microsoft Entra ID. If the sign-in attempt is successful, the user's browser is redirected to the app's redirect endpoint. A valid request to this endpoint contain an [authorization code](/entra/identity-platform/v2-oauth2-auth-code-flow).

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

   // handle groups overage if it has occurred.
   handleGroupsOverage(contextAdapter);
   ```

1. After previous step, you can extract group memberships by calling `context.getGroups()` using an instance of `IdentityContextData`.

1. If the user is a member of too many groups - more than 200 - a call to `context.getGroups()` might have been empty if it weren't for the call to `handleGroupsOverage()`. Meanwhile, `context.getGroupsOverage()` returns `true`, signalling that an overage has occurred, and that getting the full list of groups requires a call to Microsoft Graph. See the `handleGroupsOverage()` method in *AuthHelper.java* to see how this application uses `context.setGroups()` when there's an overage.

### Protect the routes

See *AuthenticationFilter.java* to see how the sample app filters access to routes. In the *authentication.properties* file, the `app.protect.authenticated` property contains the comma-separated routes that only authenticated users can access, as shown in the following example:

```ini
# for example, /token_details requires any user to be signed in and does not require special groups claim
app.protect.authenticated=/token_details
```

Any of the routes listed in the comma-separated rule sets under the `app.protect.groups` are also off-limits to non-authenticated authenticated users, as shown in the following example. However, these routes also contain a space-separated list of group memberships. Only users belonging to at least one of the corresponding groups can access these routes after authenticating.

```ini
# define short names for group IDs here for the app. This is useful in the next property (app.protect.groups).
# EXCLUDE the curly braces, they are in this file only as delimiters.
# example:
# app.groups=groupA abcdef-qrstuvw-xyz groupB abcdef-qrstuv-wxyz
app.groups=admin {enter-your-admins-group-id-here}, user {enter-your-users-group-id-here}

# A route and its corresponding group(s) that can view it, <space-separated>; the start of the next route & its group(s) is delimited by a <comma-and-space-separator>
# this says: /admins_only can be accessed by admin group, /regular_user can be accessed by admin group and user group
app.protect.groups=/admin_only admin, /regular_user admin user
```

### Scopes

[Scopes](/entra/identity-platform/permissions-consent-overview) tell Microsoft Entra ID the level of access that the application is requesting.

Based on the requested scopes, Microsoft Entra ID presents a consent dialogue to the user upon sign-in. If the user consents to one or more scopes and obtains a token, the scopes-consented-to are encoded into the resulting `access_token`.

For the scopes requested by the application, see *authentication.properties*. By default, the application sets the scopes value to `GroupMember.Read.All`. This particular Microsoft Graph API scope is required in case the application needs to call Graph for getting the user's group memberships.

## More information

- [Microsoft Authentication Library (MSAL) for Java](https://github.com/AzureAD/microsoft-authentication-library-for-java)
- [Microsoft identity platform (Microsoft Entra ID for developers)](/entra/identity-platform/)
- [Quickstart: Register an application with the Microsoft identity platform](/entra/identity-platform/quickstart-register-app)
- [Understanding Microsoft Entra ID application consent experiences](/entra/identity-platform/application-consent-experience)
- [Understand user and admin consent](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#understand-user-and-admin-consent-and-make-appropriate-code-changes)
- [MSAL code samples](/entra/identity-platform/sample-v2-code?tabs=framework#java)
