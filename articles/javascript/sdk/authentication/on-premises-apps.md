---
title: Authenticate to Azure resources from JavaScript apps hosted on-premises
description: This article describes how to authenticate your application to Azure services when using the Azure SDK for JavaScript in on-premises hosted apps. 
ms.topic: how-to
ms.date: 03/13/2025
ms.custom:
  - devx-track-js
  - engagement-fy23
  - sfi-image-nochange
---

# Authenticate to Azure resources from JavaScript apps hosted on-premises

Apps hosted outside of Azure, such as on-premises or in a third-party data center, should use an application service principal through [Microsoft Entra ID](/entra/fundamentals/whatis) to authenticate to Azure services. In the sections ahead, you learn:

- How to register an application with Microsoft Entra to create a service principal
- How to assign roles to scope permissions
- How to authenticate using a service principal from your app code

Using dedicated application service principals allows you to adhere to the principle of least privilege when accessing Azure resources. Permissions are limited to the specific requirements of the app during development, preventing accidental access to Azure resources intended for other apps or services. This approach also helps avoid issues when the app is moved to production by ensuring it isn't over-privileged in the development environment.

A different app registration should be created for each environment the app is hosted in. This allows environment specific resource permissions to be configured for each service principal and make sure an app deployed to one environment doesn't talk to Azure resources that are part of another environment.

[!INCLUDE [authentication-create-app-registration](../../../includes/authentication/includes/authenticate-create-app-registration.md)]

[!INCLUDE [authentication-assign-service-principal-roles](../../../includes/authentication/includes/authentication-assign-service-principal-roles.md)]

[!INCLUDE [authentication-set-environment-variables](../../../includes/authentication/includes/authentication-set-environment-variables-javascript.md)]


## Authenticate to Azure services from your app

The [Azure Identity library](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true) provides various *credentials*&mdash;implementations of `TokenCredential` adapted to supporting different scenarios and Microsoft Entra authentication flows. The steps ahead demonstrate how to use [ClientSecretCredential](/javascript/api/@azure/identity/clientsecretcredential?view=azure-node-latest&preserve-view=true) when working with service principals locally and in production.

## Implement the code

Add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package in the Node.js project:

```bash
npm install @azure/identity
```

Azure services are accessed using specialized client classes from the various Azure SDK client libraries. For any JavaScript code that creates an Azure SDK client object in your app, follow these steps:

1. Import the `ClientSecretCredential` class from the `@azure/identity` module.
1. Create a `ClientSecretCredential` object with the `tenantId`, `clientId`, and `clientSecret`.
1. Pass the `ClientSecretCredential` instance to the Azure SDK client object constructor.

An example of this approach is shown in the following code segment:

```javascript
import { BlobServiceClient } from '@azure/storage-blob';
import { ClientSecretCredential } from '@azure/identity';

// Authentication
const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

// Azure Storage account name
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!tenantId || !clientId || !clientSecret || !accountName) {
  throw Error('Required environment variables not found');
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);
```

An alternative approach is to pass the `ClientSecretCredential` object directly to the Azure SDK client constructor:

```javascript
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new ClientSecretCredential(tenantId, clientId, clientSecret)
);
```

