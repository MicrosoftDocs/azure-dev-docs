---
title: 'Overview: Authenticate JavaScript apps to Azure using the Azure SDK'
description: Understand how to authenticate Node.js and browser-based applications to Azure services when using the Azure SDK for JavaScript in both server environments and in local development.
ms.date: 05/16/2022
ms.topic: overview
ms.custom: devx-track-js
---

# How to authenticate JavaScript apps to Azure services using the Azure SDK for JavaScript

[!INCLUDE [Create app registration step 1](<../../includes/authentication/overview-para-1.md>)] This article describes the recommended approaches to authenticate an app to Azure when using the Azure SDK for JavaScript.

## Recommended app authentication approach

The recommended process is to have your apps use **token-based authentication**, rather than connection strings or keys, when authenticating to Azure resources. The Azure SDK for JavaScript provides token-based authentication and allow apps to seamlessly authenticate to Azure resources whether the app is in local development, deployed to Azure, or deployed to an on-premises server.

The specific type of token-based authentication an app should use to authenticate to Azure resources depends on where the app is running and is shown in the following diagram.

:::image type="content" source="../../media/azure-sdk-authentication/javascript-sdk-auth-strategy.png" alt-text="A diagram showing the recommended token-based authentication strategies for an app depending on where it's running." :::

|Environment|Authentication|
|--|--|
|**Local**| When a developer is running an app during local development - The app can authenticate to Azure using either an application service principal for local development or by using the developer's Azure credentials.  Each of these options is discussed in more detail in the section [authentication during local development](#authentication-during-local-development).|
|**Azure**| When an app is hosted on Azure - The app should authenticate to Azure resources using a managed identity. This option is discussed in more detail below in the section [authentication in server environments](#authentication-in-server-environments).|
|**On-premises**|When an app is hosted and deployed on-premises - The app should authenticate to Azure resources using an application service principal. This option is discussed in more detail below in the section [authentication in server environments](#authentication-in-server-environments).|

### Advantages of token-based authentication

When building apps for Azure, token-based authentication is strongly recommended over secrets (connection strings or keys). Token-based authentication is provided with [DefaultAzureCredential](#use-defaultazurecredential-in-an-application).

|Token-based authentication|Secrets (connection strings and keys)|
|--|--|
|[Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege), establish the specific permissions needed by the app on the Azure resource. | A connection string or key grants full rights to the Azure resource.|
|There's no application secret to store.| Must store and rotate secrets in app setting or environment variable.|
|The [@azure/identity](https://www.npmjs.com/package/@azure/identity) package in the Azure SDK manages tokens for you behind the scenes. This makes using token-based authentication as easy to use as a connection string.|Secrets are not managed.|

Use of connection strings should be limited to initial proof of concept apps or development prototypes that don't access production or sensitive data.  Otherwise, the token-based authentication classes available in the Azure SDK should always be preferred when authenticating to Azure resources.

### DefaultAzureCredential

The Azure SDK [DefaultAzureCredential](#use-defaultazurecredential-in-an-application) method allows apps to use different authentication methods depending on the environment they're run in. This allows apps to deploy in local, test, and production environments without code changes.  You configure the appropriate authentication method for each environment and `DefaultAzureCredential` automatically detects and uses that authentication method. The use of `DefaultAzureCredential` is preferred over manually coding conditional logic or feature flags to use different authentication methods in different environments.

Details about using the DefaultAzureCredential class are covered later in this article in the section [Use DefaultAzureCredential in an application](#use-defaultazurecredential-in-an-application).

## Authentication in server environments

When hosting in a server environment, each application should be assigned a unique *application identity* per environment. In Azure, an app identity is represented by a **service principal**, a special type of *security principal* intended to identify and authenticate apps to Azure. The type of service principal to use for your app depends on where your app is running.

<!--
| Authentication method | Description |
|-----------------------|-------------|
| Apps hosted in Azure  | [!INCLUDE [sdk-auth-overview-managed-identity](./includes/sdk-auth-overview-managed-identity.md)]            |
| Apps hosted outside of Azure<br>(for example on-premises apps) | [!INCLUDE [sdk-auth-overview-service-principal](./includes/sdk-auth-overview-service-principal.md)] |
-->
## Authentication during local development

When an application is run on a developer's workstation during local development, the local environment must still authenticate to any Azure services used by the app. 

<!--
The two main strategies for authenticating apps to Azure during local development are:

| Authentication method | Description |
|-----------------------|-------------|
| Create dedicated application service principal objects to be used during local development | [!INCLUDE [sdk-auth-overview-dev-service-principals](./includes/sdk-auth-overview-dev-service-principals.md)] |
| Authenticate the app to Azure using the developer's credentials during local development | [!INCLUDE [sdk-auth-overview-dev-accounts](./includes/sdk-auth-overview-dev-accounts.md)] |
-->
## Use DefaultAzureCredential in an application

To use [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) in a JavaScript app, add the [@azure/identity](https://www.npmjs.com/package/@azure/identity) package to your application.

```terminal
npm install @azure/identity
```

Then, the following [code example](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/connect-with-default-azure-credential.js) shows how to instantiate a `DefaultAzureCredential` object and use it with an Azure SDK client class, in this case a BlobServiceClient used to access Blob storage.

```javascript
// connect-with-default-azure-credential.js
const { BlobServiceClient } = require('@azure/storage-blob');
const { DefaultAzureCredential } = require('@azure/identity');
require('dotenv').config()

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error('Azure Storage accountName not found');

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);
```

`DefaultAzureCredential` will automatically detect the authentication mechanism configured for the app and obtain the necessary tokens to authenticate the app to Azure. If an application makes use of more than one SDK client, the same credential object can be used with each SDK client object.

### Sequence of selecting authentication methods when using DefaultAzureCredential

Internally, `DefaultAzureCredential` implements a chain of selecting credential providers for authenticating applications to Azure resources.  Each credential provider is able to detect if credentials of that type are configured for the app.  `DefaultAzureCredential` sequentially checks each provider in order and uses the credentials from the first provider that has credentials configured.

The order in which `DefaultAzureCredential` looks for credentials for JavaScript is shown in the diagram and table below.  

:::image type="content" source="../../media/azure-sdk-authentication/DefaultAzureCredentialAuthFlow.svg" alt-text="A diagram showing the sequence in which DefaultAzureCredential checks to see what authentication source is configured for an application." lightbox="../../media/azure-sdk-authentication/DefaultAzureCredentialAuthFlow.svg":::

If you've more than one credential configured, the order of finding the credential through the chain is important. 

In the image, there are two paths:
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
