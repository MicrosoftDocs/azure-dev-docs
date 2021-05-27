---
title: Getting started with Authentication
titleSuffix: Azure Developer Center
description: The Microsoft identity platform allows a JavaScript developer to authenticate and authorize user identity in your browser, server, or serverless application.  
ms.topic: how-to
ms.date: 05/27/2021
ms.custom: devx-track-js
---

# Getting started with authentication on Azure

The Microsoft identity platform allows a JavaScript developer to authenticate and authorize user identity in your browser, server, or serverless application. 

## 1. Create app registration

The Active directory **app registration** is required to provide authentication with Microsoft Identity.

### [Simple no-code authentication](#tab/no-code)

The no-code authentication path, _[Easy Auth](/azure/app-service/overview-authentication-authorization)_, means the hosting environment manages the authentication for your app. 

1. Create your hosting resource, such as an Azure web app or Azure function app.
1. Enable Easy Auth by adding Authentication to your hosting resource. The process creates the app registration for you. 
1. If you only need to use authentication as a barrier to entry for your app, you are done. If your app needs to access other resources on behalf of the user or service, continue with MSAL integration. 

### [Custom SDK authentication](#tab/msal)

Before you create your app registration, determine tasks based on expected users. 

|Users|Select|
|--|--|
|Everyone (social, public, private, and [external identities](/azure/active-directory/external-identities/compare-with-b2c))|[Azure Active Directory B2C](/azure/active-directory-b2c/overview)<br>* Create a new tenant to hold your Active Directory.<br>* Create the [app registration](/azure/active-directory/develop/quickstart-register-app).|
|Microsoft identity only<br>Users existing in Microsoft tenant(s) or personal Microsoft accounts|[Azure Active Directory](/azure/active-directory-b2c/overview)<br>* Select a tenant to create app registration in.<br>* Create the [app registration](/azure/active-directory/develop/quickstart-register-app).|

---

## 2. Collect app registration information for MSAL integration

To integrate user authentication to access Azure resources on behalf of your users, you need app registration information. 

Collect required information for the app registration from the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to configure the [MSAL SDK](https://github.com/AzureAD/microsoft-authentication-library-for-js) :

* Application (client) ID
* Directory (tenant) ID
* Client secret

## 3. Find an MSAL sample for your scenario

The fastest way to get started with the MSAL SDK is to [find your scenario](/azure/active-directory/develop/authentication-flows-app-scenarios), then locate your [framework and sample](/azure/active-directory/develop/sample-v2-code) associated with your scenario. 

## 4.Integration with DefaultAzureCredential

Configure your runtime environment so your code can use the DefaultAzureCredential, on behalf of your users or system. This allows your same code to run in local, stage, and production environments, without managing credentials yourself. 

Examples of DefaultAzureCredential: 

* [Key vault](/javascript/api/overview/azure/identity-readme#authenticating-with-the-defaultazurecredential)
* [Azure Storage](/javascript/api/overview/azure/storage-blob-readme#create-the-blob-service-client)

### [Simple no-code authentication](#tab/no-code-credential)

Configure a [managed identity](/azure/app-service/overview-managed-identity) for your hosting environment. 

The value for the [MSAL SDK](https://www.npmjs.com/package/@azure/identity)'s DefaultAzureCredential is controlled by the managed identity on the runtime environment. 

### [Custom SDK authentication](#tab/msal-credential)

Configure your environment to use [environment variables](https://www.npmjs.com/package/@azure/identity#environment-variables). 

The value for the [MSAL SDK](https://www.npmjs.com/package/@azure/identity)'s DefaultAzureCredential is controlled by the runtime environment. 

---

## Next steps

* [JS: Add easy authentication to your web app](../with-web-app/add-authentication-to-web-app.md)
* [JS: Add Microsoft login button to a single page application](../../tutorial/single-page-application-azure-login-button-sdk-msal.md)
* [JS: Deploy Express.js with Microsoft Authentication (MSAL) to Azure App service](../with-web-app/deploy-msal-sdk-authentication-expressjs.md)