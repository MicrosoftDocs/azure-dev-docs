---
title: Authentication and Authorization - JavaScript - Azure
description: Understand how to develop JavaScript apps with Identity, authentication, and users with Azure.  
ms.topic: conceptual
ms.date: 09/20/2021
ms.custom:  devx-track-js
---

# Identity, authentication, and users

Authentication and authorization are broad subjects for a web application that can be reduced to specific programmatic tasks and user interactions with an application. This article focuses on the top concepts a JavaScript developer commonly has to understand. 

## Authentication with Azure

Authentication is the ability to for an identity to gain access to an object. 

Typically for a JavaScript developer on Azure, this means the ability to:

* allow your program to access your Azure resources
* allow a user to access your app, usually after logging in

|Required|Perspective|Description|
|--|--|--|
|Yes|Developer|Application code must pass required credentials to Azure to access Azure resources.|
|No|User|For a user of an application, authentication can be anonymous or require a user account. This restricted access can use any common authentication provider, including Microsoft, or your can build your own authentication layer for your users.|

## Authentication for developers to Azure services

Programmatic authentication to Azure requires a valid credential for the exact service the code uses. You need to read the Quickstart documentation for the service, and understand what type of credentials the service expects. 

### Local developer environment for authenticating to Azure

Once you understand how to connect to a service, you should create a service principal and set the service principal to an environment variable on your development machine. That step removes your personal account from direct interaction with Azure, and the risk of your personal account being compromised by checking in credentials with the source code. 

### Cloud apps authenticating to Azure

For cloud-based apps, the Azure hosting services provide access to the [Application settings](../how-to/configure-web-app-settings.md), including environment variables and secrets. To add another layer of security to your web app, store secrets in Azure [Key vault](/azure/key-vault), and access those secrets programmatically from your hosted app. 

## Modern programmatic service authentication with @azure/identity

The current Azure SDK library uses a service principal for programmatic authentication to Azure services with the [@azure/identity](https://www.npmjs.com/package/@azure/identity) npm package. This authentication simplifies the process and is available on the [modern Azure SDK packages](https://www.npmjs.com/package/@azure/identity#client-libraries-supporting-authentication-with-azure-identity). 

```javascript
// The default credential first checks environment variables for configuration.
// If environment configuration is incomplete, it will try managed identity.

// Azure service to use
const { KeyClient } = require("@azure/keyvault-keys");

// Azure authentication library to access Azure service
const { DefaultAzureCredential } = require("@azure/identity");

// Azure SDK clients accept the credential as a parameter
const credential = new DefaultAzureCredential();

// Create authenticated client
const client = new KeyClient(vaultUrl, credential);

// Use service from authenticated client
const getResult = await client.getKey("MyKeyName");
```

## Classic programmatic service authentication

Not all services support authentication with Azure Active directory, in which case @azure/identity cannot be used. 

To learn the specific service authentication requirements, each SDK's npm `README.md` file has detailed instructions on how to authentication to the Azure service. 

## User Authentication with an App registration

Microsoft Authentication Library (MSAL) is the recommended library for web development for user authentication. The library is available in several [languages and frameworks](/azure/active-directory/develop/msal-overview#languages-and-frameworks).

In order to use MSAL, your web app needs an [App registration](/azure/active-directory/develop/quickstart-register-app) with Microsoft. The app registration includes common authentication information such as user scope permissions, and the redirect URL. 

Learn more with the sample project in this [MSAL quickstart](/azure/active-directory/develop/quickstart-v2-javascript).

A user grants permission to your app when they log in to your app. This permission is stored with their user, which they can manage and revoke:

* Consumer app permissions management - [https://account.live.com/consent/manage](https://account.live.com/consent/manage)
* Active Directory app permissions management - [https://myapplications.microsoft.com/](https://myapplications.microsoft.com/)

## Next steps

* [Configure your Azure App service](../how-to/configure-web-app-settings.md)