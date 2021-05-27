---
title: Getting started with Authentication
titleSuffix: Azure Developer Center
description: Learn the common tasks to use authentication on Azure.  
ms.topic: how-to
ms.date: 05/27/2021
ms.custom: devx-track-js
---

# Getting started with authentication on Azure

The Microsoft identity platform allows a JavaScript developer to authenticate and authorize user identity in your JavaScript application. 

## Add code-based authentication with MSAL SDK

When you want to integrate code-based authentication and authorization, determine your user base steps based on your intended users.

### Determine tasks based on expected users

|Users|Select|
|--|--|
|Everyone (social, public, private, and [external identities](/azure/active-directory/external-identities/compare-with-b2c))|[Azure Active Directory B2C](/azure/active-directory-b2c/overview)<br>* Create a new tenant to hold your Active Directory.<br>* Create the [app registration](/azure/active-directory/develop/quickstart-register-app).|
|Less than everyone|[Azure Active Directory](/azure/active-directory-b2c/overview)<br>* Select a tenant to create app registration in.<br>* Create the [app registration](/azure/active-directory/develop/quickstart-register-app).|

### Collect configuration information for MSAL SDK

Once you have the app registration, collect its required information for the registration from the [Azure portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) to configure the [MSAL SDK](https://github.com/AzureAD/microsoft-authentication-library-for-js) :

* Application (client) ID
* Directory (tenant) ID
* Client secret

### Find an MSAL sample for your scenario

The fastest way to get started with the MSAL SDK is to [find your scenario](/azure/active-directory/develop/authentication-flows-app-scenarios), then locate your [framework and sample](/azure/active-directory/develop/sample-v2-code) associated with your scenario. 

## No-code authentication for web and API-hosted apps

If you want to use authentication for your Azure-hosted web app or function app without changing your code, use [Easy Auth](/azure/app-service/overview-authentication-authorization). Easy auth is configured in the Azure portal for your web app or function app. 

Easy Auth provides access to several identity providers:

* Microsoft
* Facebook
* Google
* Twitter
* OpenID Connect

The [authentication flow](/azure/app-service/overview-authentication-authorization#authentication-flow) directs a user through the identity provider authentication flow then back to your web or function app. The identity provider's authentication information is returned, typically in the query string or HTTP header.

Learn more: 

* Azure Web app tutorial: [Add authentication to your web app running on Azure App Service](/azure/app-service/scenario-secure-app-overview)

## Hosting and MSAL integration with managed identity and DefaultAzureCredential

Azure hosting platforms provide Easy Auth for no-code authentication integration. You can add [managed identity](/azure/app-service/overview-managed-identity) and the MSAL SDK to access other Azure resources, with the DefaultAzureCredential.

The value for the [MSAL SDK](https://www.npmjs.com/package/@azure/identity)'s DefaultAzureCredential is controlled by the managed identity on the hosting environment. 

Examples of DefaultAzureCredential: 

* [Key vault](/javascript/api/overview/azure/identity-readme#authenticating-with-the-defaultazurecredential)
* [Azure Storage](/javascript/api/overview/azure/storage-blob-readme#create-the-blob-service-client)


## Next steps

* [JS: Add easy authentication to your web app](../with-web-app/add-authentication-to-web-app.md)
* [JS: Add Microsoft login button to a single page application](../../tutorial/single-page-application-azure-login-button-sdk-msal.md)
* [JS: Deploy Express.js with Microsoft Authentication (MSAL) to Azure App service](../with-web-app/deploy-msal-sdk-authentication-expressjs.md)