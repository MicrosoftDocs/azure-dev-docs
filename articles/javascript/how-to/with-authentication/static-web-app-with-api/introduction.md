---
title: "1: Add MSAL to React introduction"
titleSuffix: Azure Developer Center
description: In this article series, learn to add the Microsoft Identity Provider SDK (MSAL.js) to a React client app, and integrate with an Azure Function API.
ms.topic: how-to
ms.date: 07/12/2021
ms.custom: devx-track-js
---

# How to authenticate users with Microsoft Authentication Library for React 

In this article series, learn how to authenticate users with the Microsoft Authentication Library for React (MSAL React) and call an Azure service on behalf of the user. 

If your server-side app doesn't need to call into an Azure service _on behalf of an authenticated user_,  then your React client app wouldn't _need_ to pass the user's access to token to the Azure Function app. 

## Application architecture

The application architecture includes:

* A React client, which provides the user authentication step and can call an Azure service on behalf of ([OAuth on-behalf-of](/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow) flow) the user from either:
    * The React client itself.
    * or from an Azure Function app. 
* A serverless Azure Function app provides an API endpoint abstracting away the call into an Azure service. This is the suggested mechanism when:
  *  The call to an Azure service includes information you don't want exposed in the browser
  * Or the call(s) require long-running operations. 
* An Azure service (Microsoft Graph) used to demonstrate how to call an Azure service on behalf of a user. 
* An Azure database (Cosmos DB) used as the custom web app's database, storing information specific to the web app.
* The HTTP call to an Azure service requires an access token with higher permissions. This token shouldn't be cached in the browser storage.

:::image type="content" source="../../../media/how-to-with-authentication-static-web-app-msal/msal-react-function-api-microsoft-graph-architecture.png" alt-text="Architectural diagram showing the user, through a browser, connecting to a Static web app. The Static web app then connects to Microsoft Identity to get an access token, then to Microsoft Graph to get user information, then to Cosmos DB to store custom information specific to this web app.":::

### Authentication architecture

This article explains how to authenticate users to your client app with a Microsoft Identity provider app. The authentication starts on the React client.

|Steps to authenticate|Explanation|
|--|--|
|In the browser, the user selects the Login button with either the pop-up or redirect method.|The pop-up manages the redirect to the Microsoft identity platform [authorization endpoint](/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code). 
|The authentication flow displays|Either a pop-up window displays or the web browser redirects to a page. |
|The user logs into their Microsoft account.|The user has to provide correct credentials before the access token is returned to the React client, then to the user's browser session.|
|The browser continues to the React client app's root route, '/'.|The access token is managed by the MSAL React library and held in session.|
|The user selects another route in the app.| The new route also requires and checks user authentication. Any calls to the Function API receive the user's access token so the API can act on behalf of the user.|

The **Profile** and **FunctionAPI** menu choices both call the Microsoft Graph API and pass the user's credentials, which are required to access that API. The Microsoft Graph API is used to *demonstrate* the passing of credentials to any API, including your own custom API. 

## How the sample code is organized?

The [sample](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/4-Deployment/2-deploy-static) includes the following:

|Area|Purpose|
|--|--|
|Client|React app (presentation layer). It calls the Microsoft Graph directly or uses the Azure Function app. |
|Serverless API|Calls the Microsoft Graph API on behalf of user. Creates user document in Cosmos DB which includes user name, email, and favorite color. |

## Set up your development environment

Install the following for your local development environment.

- Create a free [Azure subscription](https://azure.microsoft.com/free/)
- [Node.js 12 or 14](https://nodejs.org/en/download)
    - If you have a different version of Node.js installed on your local computer, consider using [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) or a Docker container.  
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 
    - [Azure Databases](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

## Next steps

* [Register an application with the Microsoft identity platform](register-application-with-identity.md)
