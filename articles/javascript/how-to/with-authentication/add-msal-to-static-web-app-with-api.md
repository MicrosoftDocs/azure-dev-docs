---
title: Add MSAL to React
titleSuffix: Azure Developer Center
description: In this article, learn to add the Microsoft Identity Provider SDK (MSAL.js) to a React client app, and integrate with an Azure Function API.
ms.topic: how-to
ms.date: 06/15/2021
ms.custom: devx-track-js
---

# How to authenticate users with Microsoft Authentication Library for React 

In this article, learn how to authenticate users with the Microsoft Authentication Library for React (MSAL React) and call an Azure service on behalf of the user. 

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

## Set up local development environment 

* Azure subscription
* Node.js
* Visual Studio Code
* Static web app extension
* CosmosDB extension

## Create Microsoft Identity provider app registration

Create your Microsoft Identity provider **app registration** to manage authentication. 

1. Sign in to the Azure portal, and [register an application](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps).
1. If your account is present in more than one Azure AD tenant, select your profile at the top right corner in the menu on top of the page, and then **switch directory** to change your portal session to the desired Azure AD tenant.
1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `msal-react-spa`.
1. For **Supported account types**, select **Accounts in this organizational directory only**.
1. In the **Redirect URI** section, select **Single-page application** in the combo-box and enter the following redirect URI: `http://localhost:3000/`.
1. Select **Register** to create the app registration for the authentication application.

## Get app registration settings

1. In the app's registration **Overview** screen, find and note the following:
    * **Application (client) ID**
    * **Directory (tenant) ID**

    You'll need these settings later in your React and API configuration files. 

## Function API configurations your app registration 

Because this sample has an Azure Function API, which needs to call into an Azure service (Microsoft Graph) without direct login from a user, your app registration needs a few more settings so the Azure function can act on behalf of the user. To understand why these settings are required, the flow of information from authentication to use is helpful. 

The flow of information to act on behalf of a user includes:

* During user authentication: Requesting `access_as_user` scoped permission during the user's login, to act on behalf of the user for the `/api/hello` endpoint in the Azure Function. This is configured in the Azure portal for your Azure app registration and configured in your code in the React app's `/src/authConfig.js` file.
* Between React client and Azure Function API call: When the React client calls into the Azure Function API, the client passes the access token received during client user authentication. 
* In Azure Function API call: The Azure Function takes the token, validates the token, acquires a new token to act on behalf of the user, then passes that new token to the Azure service (Microsoft Graph).

### Create an app registration client secret

The secret is used to authenticate requests from your Function API to your app registration.

1. In the app's registration screen, select the **Certificates & secrets** blade to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**, then enter a key description (for instance `react SWA/API app secret`),
1. Select one of the available key durations, then select **Add**.

    The generated key is displayed. 

1. Copy the generated value for use in the steps later. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

    You'll need this client secret later in your API configuration file. 

### Create and expose an authentication endpoint for API

In order for the Azure Function API to act on behalf of your user when calling other APIs, you need to create an authentication endpoint for your Azure Function API. This requires creating an application ID URI, which is used in the React client MSAL config object to request access on the user's behalf to your Azure Function API.

1. In the app's registration screen, select the **Expose an API** blade to open the page where you can declare the parameters to expose this app as an API for which your web applications can obtain [access tokens](/azure/active-directory/develop/access-tokens).
1. Declare the unique [resource](/azure/active-directory/develop/v2-oauth2-auth-code-flow) URI that your client and API applications will use to obtain access tokens for this app registration: 
1. Select `Set` next to the **Application ID URI** to generate a URI that is unique for this app.
1. Accept the proposed Application ID URI (`api://{clientId}`) by selecting **Save**.
1. Copy the URI. You'll need this later in your React and API configuration files. 

## Configure app registration API scope

Add the `access_as_user` [scope](/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code) for the React client application to obtain an access token with that scope successfully. 

Add information to the user's **first authentication** to explain the scope request.

1. Still on the **Expose an API** blade, select **Add a scope**. 
1. For **Scope name**, use `access_as_user`.
1. Select **Admins and users** options for **Who can consent?**.
1. For **Admin consent display name** type `Access msal-react-function`.
1. For **Admin consent description** type `Allows the app to access msal-react-spa as the signed-in user.`
1. For **User consent display name** type `Access msal-react-spa`.
1. For **User consent description** type `Allow the application to access msal-react-spa on your behalf.`
1. Keep **State** as **Enabled**.
1. Select **Add scope** to save this scope.

## Review app registration scopes to Microsoft Graph and your Function API

1. Select the **API permissions**.
   - Select the **Add a permission** button and then,
     - Ensure that the **Microsoft APIs** tab is selected.
     - In the *Commonly used Microsoft APIs* section, select **Microsoft Graph**
     - In the **Delegated permissions** section, select the **User.Read** in the list. Use the search box if necessary.
     - Select the **Add permissions** button at the bottom.
   - Select the **Add a permission** button and then,
     - Ensure that the **My APIs** tab is selected.
     - In the list of APIs, select the API `msal-react-spa`.
     - In the **Delegated permissions** section, select the **Access 'msal-react-spa'** in the list. Use the search box if necessary.
     - Select the **Add permissions** button at the bottom.

## Configure app registration to act on behalf of a user



## Download the sample project

## Configure MSAL settings and secrets

### Configure React settings and secrets

### Configure API settings and secrets

## Run client and API locally

## Create Static web app

## Configure Static web app settings and secrets

### Configure React settings and secrets

### Configure API settings and secrets

## Configure app registration redirect URL

## Deploy Static web app to Azure

## Run client and API on Azure
