---
title: Add MSAL to React
titleSuffix: Azure Developer Center
description: In this article, learn to add the Microsoft Identity Provider SDK (MSAL.js) to a React client app, and integrate with an Azure Function API.
ms.topic: how-to
ms.date: 06/15/2021
ms.custom: devx-track-js
---

# How to authenticate with Microsoft Authentication Library for React 

In this article, learn how to use the Microsoft Authentication Library for React (MSAL React) in a React client app, and integrate with an Azure Function API. Deploy both together as a Static web app on Azure. 

## Application authentication architecture

This articles explains how to authenticate users to your Microsoft Identity app. The authentication starts on the React client.

|User steps to authenticate|Explanation|
|--|--|
|In the browser, the user selects the Login button with either the pop-up or redirect method.|The pop-up manages the redirect to the authentication flow without leaving the browser window for the React app. 
|The authentication flow displays||
|The user logs into their Microsoft account.||
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

Because this sample has an API, without direct login from a user, your app registration needs a few more settings.

### Create an app registration client secret

The secret is used to authenticate requests from your Function API to your app registration.

1. In the app's registration screen, select the **Certificates & secrets** blade to open the page where we can generate secrets and upload certificates.
1. In the **Client secrets** section, select **New client secret**, then enter a key description (for instance `react SWA/API app secret`),
1. Select one of the available key durations, then select **Add**.

    The generated key is displayed. 

1. Copy the generated value for use in the steps later. This key value will not be displayed again, and is not retrievable by any other means, so make sure to note it from the Azure portal before navigating to any other screen or blade.

    You'll need this key later in your React and API configuration files. 

### Create an app ID URI

The URI is used to secure your Function API to authenticated users.

1. In the app's registration screen, select the **Expose an API** blade to open the page where you can declare the parameters to expose this app as an API for which client applications can obtain [access tokens](/azure/active-directory/develop/access-tokens) for.
1. Declare the unique [resource](/azure/active-directory/develop/v2-oauth2-auth-code-flow) URI that the your client and API applications will use to obtain access tokens for this app registration: 
1. Select `Set` next to the **Application ID URI** to generate a URI that is unique for this app.
1. Accept the proposed Application ID URI (`api://{clientId}`) by selecting **Save**.
1. Copy the URI. You'll need this later in your React and API configuration files. 

## Configure app registration API scope

All app registrations have to publish a minimum of one [scope](/azure/active-directory/develop/v2-oauth2-auth-code-flow#request-an-authorization-code) for the client application to obtain an access token successfully. 

1. Still on the **Expose an API** blade, select **Add a scope**. 
1. For **Scope name**, use `access_as_user`.
1. Select **Admins and users** options for **Who can consent?**.
1. For **Admin consent display name** type `Access msal-react-spa`.
1. For **Admin consent description** type `Allows the app to access msal-react-spa as the signed-in user.`
1. For **User consent display name** type `Access msal-react-spa`.
1. For **User consent description** type `Allow the application to access msal-react-spa on your behalf.`
1. Keep **State** as **Enabled**.
1. Select **Add scope** to save this scope.

## Configure app registration to connect to MS Graph

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
