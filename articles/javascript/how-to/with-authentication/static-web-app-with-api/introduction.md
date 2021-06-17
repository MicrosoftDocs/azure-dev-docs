---
title: "1: Add MSAL to React introduction"
titleSuffix: Azure Developer Center
description: In this article series, learn to add the Microsoft Identity Provider SDK (MSAL.js) to a React client app, and integrate with an Azure Function API.
ms.topic: how-to
ms.date: 06/15/2021
ms.custom: devx-track-js
---

# How to authenticate users with Microsoft Authentication Library for React 

In this article series, learn how to authenticate users with the Microsoft Authentication Library for React (MSAL React) and call an Azure service on behalf of the user. 

If your server-side app doesn't need to call into an Azure service _on behalf of an authenticated user_,  then your React client app wouldn't _need_ to pass the user's access to token to the Azure Function app. 

## Application architecture

The application architecture includes:

* A React client, which provides the user authentication step and can call an Azure service on behalf of the user from either:
    * The React client itself.
    * or from an Azure Function app. 
* An Azure Function app provides an API endpoint abstracting away the call into an Azure service. This is the suggested mechanism when the call to an Azure service includes information you don't want exposed in the browser or the call(s) require long-running operations. 
* An Azure service used to demonstrate how to call an Azure service on behalf of a user. 

## When to act on behalf of a user

If your app requires user-level permissions to do something, such as retrieve images or files only they own, and you have secured those permissions in 

### Authentication architecture

This article explains how to authenticate users to your client app with a Microsoft Identity provider app. The authentication starts on the React client.

|User steps to authenticate|Explanation|
|--|--|
|In the browser, the user selects the Login button with either the pop-up or redirect method.|The pop-up manages the redirect to the authentication flow without leaving the browser window for the React app. 
|The authentication flow displays|Either a pop-up window displays or the web browser redirects to a page. |
|The user logs into their Microsoft account.|The user has to provide correct authentication before the access token is returned to your web app.|
|The browser continues to the React client app's root route, '/'.|The access token is managed by the MSAL React library and held in |

Continued use of the app also includes authentication both on the client and the Function API. The **Profile** and **FunctionAPI** menu choices both call an API and pass the user's credentials, which are required to access that API. While this specific API is the Microsoft Graph API, it is just a demonstration of passing credentials to any API, including your own custom API. 

The React client must pass the user's credentials to the API, then the API can use the credentials to call Microsoft Graph. 

## How the sample code is organized?

The [sample](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/4-Deployment/2-deploy-static) includes the following:

|App|Purpose|GitHub<br>Repository<br>Location|
|--|--|--|
|Client|React app (presentation layer). It calls the Azure Function app. |[/src]()|
|Server|Azure Function app (business layer) - calls the Azure Graph API on behalf of user |[/api]()|

## Set up your development environment

Install the following for your local development environment.

- Create a free [Azure subscription](https://azure.microsoft.com/free/)
- [Node.js 12 or 14](https://nodejs.org/en/download)
    - If you have a different version of Node.js installed on your local computer, consider using [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) or a Docker container.  
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/) and the following extensions
    - [Azure Resources](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureresourcegroups)
    - [Azure Static Web App](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) 

## Next steps

* [Register an application with the Microsoft identity platform](register-application-with-identity.md)