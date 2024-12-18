---
title: Getting started with user authentication
titleSuffix: Azure Developer Center
description: The Microsoft identity platform allows a JavaScript developer to authenticate and authorize user identity in your browser, server, or serverless application.  
ms.topic: how-to
ms.date: 08/09/2022
ms.custom: devx-track-js
---

# Getting started with user authentication on Azure

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
|Microsoft identity only<br>Users existing in Microsoft tenant(s) or personal Microsoft accounts|[Microsoft Entra ID](/azure/active-directory-b2c/overview)<br>* Select a tenant to create app registration in.<br>* Create the [app registration](/azure/active-directory/develop/quickstart-register-app).|

---

## 2. Collect app registration information for MSAL integration

To integrate user authentication to access Azure resources on behalf of your users, you need app registration information. 

Collect required information for the app registration from the [Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to configure the [MSAL SDK](https://github.com/AzureAD/microsoft-authentication-library-for-js) :

* Application (client) ID
* Directory (tenant) ID
* Client secret

## 3. Find an MSAL sample for your scenario

The fastest way to get started with the MSAL SDK is to [find your scenario](/azure/active-directory/develop/authentication-flows-app-scenarios), then locate your [framework and sample](/azure/active-directory/develop/sample-v2-code) associated with your scenario. 

Top JS samples include:
* [GitHub Tutorial: Deploy your React/API to Static web apps with MSAL integration](https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/tree/main/4-Deployment/2-deploy-static)
* [GitHub Tutorial: Enable your Node.js web app to sign-in users and call APIs with the Microsoft identity platform](https://github.com/Azure-Samples/ms-identity-javascript-nodejs-tutorial)



## 4.Integration with DefaultAzureCredential

Configure your runtime environment so your code can use the DefaultAzureCredential, on behalf of your users or system. This allows your same code to run in local, stage, and production environments, without managing credentials yourself. 

Examples of DefaultAzureCredential: 

* [Key vault](/javascript/api/overview/azure/identity-readme#authenticating-with-the-defaultazurecredential)
* [Azure Storage](/javascript/api/overview/azure/storage-blob-readme#create-the-blob-service-client)

### [Azure hosted environments](#tab/no-code-credential)

Configure a [managed identity](/azure/app-service/overview-managed-identity) for your hosting environment. 

The value for the [MSAL SDK](https://www.npmjs.com/package/@azure/identity)'s DefaultAzureCredential is controlled by the managed identity on the runtime environment. 

### [Other environments](#tab/msal-credential)

Configure your local, on-premises, or other environment to use [environment variables](https://www.npmjs.com/package/@azure/identity#environment-variables). 

The value for the [MSAL SDK](https://www.npmjs.com/package/@azure/identity)'s DefaultAzureCredential is controlled by the runtime environment. 

---

## Helpful tools

* [JWT.ms](https://jwt.ms/) to inspect your tokens
* Independent VS Code extension [jwt-decoder](https://marketplace.visualstudio.com/items?itemName=jflbr.jwt-decoder)
* Microsoft Graph REST API for [@me](/graph/api/user-get?preserve-view=true&view=graph-rest-1.0&tabs=http#code-try-4)

## Samples

* [Microsoft identity platform code samples (v2.0 endpoint)](/azure/active-directory/develop/sample-v2-code)
* [Azure Active Directory B2C code samples](/azure/active-directory-b2c/code-samples)

## Next steps

* [GitHub Microsoft Authentication Library for JavaScript (MSAL.js) - includes many samples](https://github.com/AzureAD/microsoft-authentication-library-for-js)
* [JS: Add easy authentication to your web app](/azure/app-service/scenario-secure-app-authentication-app-service-as-user)
* [JS: Deploy Express.js with Microsoft Authentication (MSAL) to Azure App service](/entra/identity-platform/quickstart-web-app-nodejs-msal-sign-in?toc=/azure/developer/javascript/toc.json&bc=/azure/developer/javascript/breadcrumb/toc.json)
