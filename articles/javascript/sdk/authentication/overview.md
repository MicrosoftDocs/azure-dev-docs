---
title: 'Overview: Authenticate JavaScript apps to Azure using the Azure SDK'
description: Understand how to authenticate Node.js and browser-based applications to Azure services when using the Azure SDK for JavaScript in both server environments and in local development.
ms.date: 05/16/2022
ms.topic: overview
ms.custom: devx-track-js
---

# How to authenticate JavaScript apps to Azure services using the Azure SDK for JavaScript

[!INCLUDE [Create app registration step 1](<../../../includes/authentication/overview-para-1.md>)] This article describes the recommended approaches to authenticate an app to Azure when using the Azure SDK for JavaScript.

## Recommended app authentication approach

[!INCLUDE [Recommended app authentication approach](<../../../includes/authentication/overview-recommend-authentication-javascript.md>)]

:::image type="content" source="../../media/azure-sdk-authentication/javascript-sdk-auth-strategy.png" alt-text="A diagram showing the recommended token-based authentication strategies for an app depending on where it's running." :::

### Advantages of token-based authentication

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/defaultazurecredential-overview-javascript.md>)]

[!INCLUDE [Advantages of token-based authentication](<../../../includes/authentication/overview-advantages.md>)]

Use the following SDK: 

* [@azure/identity](https://www.npmjs.com/package/@azure/identity)


### DefaultAzureCredential

[!INCLUDE [DefaultAzureCredential](<../../../includes/authentication/overview-defaultazurecredential-javascript.md>)]

## Authentication in server environments

[!INCLUDE [Authentication in server environments](<../../../includes/authentication/overview-server-environments.md>)]

## Authentication during local development

[!INCLUDE [Authentication during local development](<../../../includes/authentication/overview-local-environments.md>)]

## Use DefaultAzureCredential in an application

To use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) in a JavaScript app, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```terminal
npm install @azure/identity
```

Then, the following [code example](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-default-azure-credential.js) shows how to instantiate a `DefaultAzureCredential` object and use it with an Azure SDK client class, in this case a BlobServiceClient used to access Blob storage.

```javascript
// connect-with-default-azure-credential.js
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import 'dotenv/config'

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
```

[!INCLUDE [Authentication during local development - after](<../../../includes/authentication/overview-defaultazurecredential-after.md>)]

### Sequence of selecting authentication methods when using DefaultAzureCredential

[!INCLUDE [Sequence of selecting authentication methods when using DefaultAzureCredential](<../../../includes/authentication/overview-credential-sequence.md>)]

The order in which `DefaultAzureCredential` looks for credentials for JavaScript is shown in the diagram and table below.  

:::image type="content" source="../../../includes/media/sdk-auth-passwordless/javascript/default-azure-credential-auth-flow.svg" alt-text="A diagram showing the sequence in which DefaultAzureCredential checks to see what authentication source is configured for an application." lightbox="../../../includes/media/sdk-auth-passwordless/javascript/default-azure-credential-auth-flow.svg":::

There are two paths:
* **Deployed service** (Azure or on-premises): the sequence begins with the environment variables, then the managed identity, then the rest of the locations for a credential (Visual Studio Code, Azure CLI, Azure PowerShell). 
* **Developer's local environment**: The local developer workstation's chain starts with Visual Studio Code's signed in Azure user, shown in the bottom bar of the IDE, then moves on to the Azure CLI, then Azure PowerShell. It's important to understand if you've configured your local environment variables, either for your entire environment, or a project's virtual environment (such as with DOTENV), these variables will override the Visual Studio Code -> Azure CLI -> PowerShell chain because they're the first credential checked in the chain. 

| Credential type               | Description |
|-------------------------------|-------------|
| Environment | DefaultAzureCredential reads a set of environment variables to determine if an application service principal (application user) has been set for the app. If so, `DefaultAzureCredential` uses these values to authenticate the app to Azure.<br><br>This method is most often used in server environments but can also be used when developing locally.             |
| Managed Identity              | If the application is deployed to an Azure host with Managed Identity enabled, `DefaultAzureCredential` will authenticate the app to Azure using that Managed Identity. Authentication using a Managed Identity is discussed in the [Authentication in server environments](#authentication-in-server-environments) section of this document.<br><br>This method is only available when an application is hosted in Azure using a [managed-identity enabled service](/azure/active-directory/managed-identities-azure-resources/managed-identities-status). |
| Visual Studio Code            | If the developer has authenticated to Azure using the Visual Studio Code Azure Account plugin, `DefaultAzureCredential` will authenticate the app to Azure using that same account. |
| Azure CLI                     | If a developer has authenticated to Azure using the `az login` command in the Azure CLI, `DefaultAzureCredential` will authenticate the app to Azure using that same account. |
| Azure PowerShell              | If a developer has authenticated to Azure using the `Connect-AzAccount` cmdlet from Azure PowerShell, `DefaultAzureCredential` will authenticate the app to Azure using that same account.            |
| Interactive                   | If enabled, DefaultAzureCredential will interactively authenticate the developer via the current system's default browser. By default, this option is disabled. |
