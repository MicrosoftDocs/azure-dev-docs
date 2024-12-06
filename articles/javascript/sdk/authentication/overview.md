---
title: How to authenticate JavaScript apps with Azure services
description: Learn how to authenticate a JavaScript app with Azure services by using classes in the Azure Identity library.
ms.date: 12/04/2024
ms.topic: overview
ms.custom: devx-track-js
---

# How to authenticate JavaScript apps to Azure services using the Azure Identity library

[!INCLUDE [Create app registration step 1](<../../../includes/authentication/overview-para-1.md>)] This article describes the recommended approaches to authenticate an app to Azure when using the Azure SDK for JavaScript.

## Recommended app authentication approach

[!INCLUDE [Recommended app authentication approach](<../../../includes/authentication/overview-recommend-authentication-javascript.md>)]

:::image type="content" source="../../media/azure-sdk-authentication/javascript-sdk-auth-strategy.png" alt-text="A diagram showing the recommended token-based authentication strategies for an app depending on where it's running." :::

### Advantages of token-based authentication

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/defaultazurecredential-overview-javascript.md>)]

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

Use the following library: 

* [@azure/identity](https://www.npmjs.com/package/@azure/identity)

### DefaultAzureCredential

[!INCLUDE [DefaultAzureCredential](<../../../includes/authentication/overview-defaultazurecredential-javascript.md>)]

## Authentication in server environments

[!INCLUDE [Authentication in server environments](<../../../includes/authentication/overview-server-environments.md>)]

## Authentication during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]

## Use DefaultAzureCredential in an application

[DefaultAzureCredential](credential-chains.md#use-defaultazurecredential-for-flexibility) is an opinionated, ordered sequence of mechanisms for authenticating to Microsoft Entra ID. Each authentication mechanism is a class derived from the [TokenCredential](/javascript/api/@azure/core-auth/tokencredential?view=azure-node-latest&preserve-view=true) class and is known as a *credential*. At runtime, `DefaultAzureCredential` attempts to authenticate using the first credential. If that credential fails to acquire an access token, the next credential in the sequence is attempted, and so on, until an access token is successfully obtained. In this way, your app can use different credentials in different environments without writing environment-specific code.

To use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential), add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```terminal
npm install @azure/identity
```

Then, the following [code sample](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-default-azure-credential.js) shows how to instantiate a `DefaultAzureCredential` object and use it with an Azure SDK service client class&mdash;in this case, a `BlobServiceClient` used to access Azure Blob Storage.

```javascript
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config';

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
```

[!INCLUDE [Authentication during local development - after](<../../../includes/authentication/overview-defaultazurecredential-after.md>)]
