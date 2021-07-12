---
title: "3: Create the local authenticated Static web app"
titleSuffix: Azure Developer Center
description: In this article, learn to configure a Static web app and API to use the MSAL SDK to authenticate users both on the client app and on the Azure Function API. 
ms.topic: how-to
ms.date: 07/12/2021
ms.custom: devx-track-js
---

# Create the local authenticated Static web app

In this article, learn to configure a Static web app and API to use the [MSAL.js SDK](https://github.com/AzureAD/microsoft-authentication-library-for-js) to authenticate users both on the client app and on the Azure Function API.

The general steps for this article are:
* Cloning the full client/API sample. 
* Set the MSAL configuration values you obtained when you registered the Microsoft identity platform application. 
* Run the application locally.

The React app passes an authenticated user's access token to the Function API so that the API can act on behalf of the user. This specific API calls the Microsoft Graph, _as an example_ of calling an Azure service.

## Clone the GitHub repository for the sample project

The sample code is _part of_ a repository with several samples. While you are cloning the entire repo, make sure that in the rest of the article, you are focused on just the single sample in the `\4-Deployment\2-deploy-static\App` directory.

1. Go to the [GitHub sample repository](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial) in a web browser. 
1. Fork the repository into your own account by selecting **Fork**.

   :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/github-sample-repository-fork.png" alt-text="Partial screenshot of GitHub sample repository with Fork button highlighted.":::

1. In a bash terminal on your local machine, clone your fork. Replace `YOUR-ACCOUNT` with your own account name. 

    ```bash
    git clone https://github.com/YOUR-ACCOUNT/ms-identity-javascript-react-tutorial
    ```

1. In a bash terminal, navigate to the specific sample for this article in the `\4-Deployment\2-deploy-static\App` directory, then install the dependencies. 

    ```bash
    cd "ms-identity-javascript-react-tutorial\4-Deployment\2-deploy-static\App" && \
    npm install && \
    cd api && \
    npm install && \
    cd .. 
    ```

4. Open the project in VS Code. 

    ```bash
    code .
    ```

## Configure settings and secrets

The React client and the Azure Function both need to have configuration settings so the MSAL SDK can access your identity app. 

You should have collected the following information from the [previous article in this series](register-application-with-identity.md):

* Application (client) ID
* Directory (tenant) ID
* Client secret
* App ID URI

1. Create a React environment settings file, `./.env`, for local development and add the following fields to it:

    ```text
    REACT_APP_AAD_APP_CLIENT_ID=
    REACT_APP_AAD_APP_TENANT_ID=
    REACT_APP_AAD_APP_REDIRECT_URI=    
    REACT_APP_AAD_APP_FUNCTION_SCOPE_URI=
    ```

1. Set the following values:

    |Property|Value|
    |--|--|
    |REACT_APP_AAD_APP_CLIENT_ID|Application (client) ID|
    |REACT_APP_AAD_APP_TENANT_ID|Directory (tenant) ID|
    |REACT_APP_AAD_APP_REDIRECT_URI|http://localhost:3000|
    |REACT_APP_AAD_APP_FUNCTION_SCOPE_URI|App ID URI|

1. Open the Function API file, `./api/local.settings.json`, and set the following values:

    |Property|Value|Description|
    |--|--|--|
    |CLIENT_ID|Application (client) ID|Enter value as string, in quotes.|
    |CLIENT_SECRET|Client secret|Enter value as string, in quotes.|
    |TENANT_INFO|Directory (tenant) ID|Enter value as string, in quotes|

1. Replace the `./src/authConfig.js` file with the following code to use the `./.env` file. 

    ```javascript
    /*
    * Copyright (c) Microsoft Corporation. All rights reserved.
    * Licensed under the MIT License.
    */

    import { LogLevel } from "@azure/msal-browser";

    /**
    * Configuration object to be passed to MSAL instance on creation. 
    * For a full list of MSAL.js configuration parameters, visit:
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
    */
    export const msalConfig = {
        auth: {
            clientId:  `${process.env["REACT_APP_AAD_APP_CLIENT_ID"]}`, // This is the ONLY mandatory field that you need to supply.
            authority: `https://login.microsoftonline.com/${process.env["REACT_APP_AAD_APP_TENANT_ID"]}`, // Defaults to "https://login.microsoftonline.com/common"
            redirectUri: `${process.env["REACT_APP_AAD_APP_REDIRECT_URI"]}`, // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
            postLogoutRedirectUri: `${process.env["REACT_APP_AAD_APP_REDIRECT_URI"]}`, // Indicates the page to navigate after logout.
            navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
        },
        cache: {
            cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                    }
                }
            }
        }
    };

    /**
    * Scopes you add here will be prompted for user consent during sign-in.
    * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
    * For more information about OIDC scopes, visit: 
    * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
    */
    export const loginRequest = {
        scopes: []
    };

    /**
    * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
    * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
    */
    export const protectedResources = {
        graphMe: {
            endpoint: "https://graph.microsoft.com/v1.0/me",
            scopes: ["User.Read"],
        },
        functionApi: {
            endpoint: "/api/hello",
            scopes: [`${process.env["REACT_APP_AAD_APP_FUNCTION_SCOPE_URI"]}/access_as_user`], // e.g. api://xxxxxx/access_as_user
        }
    }
    ```

    It is important that _all_ environment settings used in the build of the static web site are switched from hard-code strings to environment variables so that the GitHub action can add those settings to the build as part of the deployment process to Azure. 
    
    If you leave secrets in the source code, you:
    * leak secrets into your code repository
    * require a new PR to change them in the deployed site

## Configure local proxy

For local development, you need to set up the proxy. Open the `./src/package.json` file and add the following property object to the root.

```json
"proxy": "http://localhost:7071",
```

When deployed to Azure Static web apps, the React client's calls to `/api/hello` are proxied to the Azure Function app without having to set up the proxy. 

## Run the app locally

1. In a VSCode interactive bash terminal, build the React client app. 

    ```bash
    npm start
    ```

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/msal-react-function-api-microsoft-graph-home-page.png" alt-text="A browser screenshot show the sample app home page with the sign in button, before a user has authenticated.":::
    

1. In a VSCode interactive bash terminal, build the Function API

    ```bash
    cd ./api && npm start
    ```

## Sign in to use the app

1. Open a browser with the local client URL, `http://localhost:3000/`.

1. The first time you sign in to the app, you (as the user) need to give the Microsoft identity platform app (created in the Azure portal) permission to access your data. This is the same API permission created in the Microsoft identity platform app:

    * Microsoft Graph - User.Read
    * Your own API - access_as_user

1. Once you are logged in, the home page displays.

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/msal-react-function-api-microsoft-graph-home-page-after-authentication.png" alt-text="A browser screenshot show the sample app home page with the sign in button, after a user has authenticated.":::

1. select the **Profile** Menu item to access the Graph API from the React client. 

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/msal-react-profile-microsoft-graph.png" alt-text="A browser screenshot show the Microsoft Graph profile information for the signed in user from the React client.":::

1. Select the **Function API** Menu item to access the Graph API from the Function API. 

    :::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/msal-react-function-api-microsoft-graph.png" alt-text="A browser screenshot show the Microsoft Graph profile information for the signed in user from the Function API.":::
 
1. When you are done using the app, close both VS Code interactive terminals to stop the application.

## View user sign-ins from Azure portal

As an administrator of your authentication app, you may want to see login history and errors. 

1. Sign in to the Azure portal, then search for **Enterprise applications**.
1. On the Enterprise applications page, search for the name of your app you registered [in this step](register-application-with-identity.md#create-microsoft-identity-provider-app-registration), such as `Microsoft Identity Static web app - favorite color`. Or you can search with the client ID from the `.env` file. 
1. Select your app from the list. 
1. Select **Users and groups** to see the people that are in your app. Because you just created the app and you are the only person that logged in, you should just see your own Identity record.
1. If you need to see who has signed in, select **Sign-ins**.  

## Next steps

* [ Store custom app user information in MongoDB](./add-mongodb-database-to-api.md)
