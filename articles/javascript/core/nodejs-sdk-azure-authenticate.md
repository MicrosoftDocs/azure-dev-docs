---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: how-to
ms.date: 08/06/2021
ms.custom: devx-track-js
---

# Authenticate with the Azure management modules for JavaScript

Each Azure SDK npm package details how to correctly and securely authenticate to use that package. Do not mix and match authentication packages and code unless all packages use the same authentication package on the npm package page.

## Azure authentication packages

All [Azure SDK client libraries](../azure-sdk-library-package-index.md) require authentication via a `credentials` object. There are multiple ways of authenticating and creating the required
credentials.

The authentication libraries include the following:

* **@azure/identity - recommended authentication package**
* @azure/ms-rest-nodeauth
* @azure/ms-rest-browserauth

## Authentication with Azure services while developing

[Common credential methods](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/identity/identity/README.md#credential-classes) to create the required credential while you are developing:

| Azure authentication type|Purpose|
|--|--|
|**DefaultAzureCredential**|This authentication is the **recommended method**. Learn how to [set up the DefaultAzureCredential](../how-to/with-sdk/set-up-development-environment.md).|
| **DeviceCodeCredential**| This is the easiest way to authenticate when you are *trying Azure services*. It requires logging in with your personal account with a browser. |
|**UserPasswordCredential**|This authentication requires you to enter your personal username and password. This is the least secure method and is not recommended.| 

## Authentication with Azure services and production code

Common methods to create the required credential in your production code:

|Azure authentication type|Purpose|
|--|--|
|**Managed Service Identity (MSI)**|[MSI authentication](/azure/active-directory/managed-identities-azure-resources/overview) is best for production scenarios. You aren't going to use it in your local development environment. [Services](/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities) that support MSI.|
|**Certificates**|[Certificates](/azure/cloud-services/cloud-services-certs-create) need to be uploaded to Azure either using the [Portal](/azure/cloud-services/cloud-services-configure-ssl-certificate-portal).|

## JavaScript authentication samples for Azure

|Authentication package|Sample authentication scripts|
|--|--|
|[@azure/identity](https://www.npmjs.com/package/@azure/identity
)<br>recommended|[Set up Identity](../how-to/with-sdk/set-up-development-environment.md)|
|[@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth)|[Service Principal with Certificate](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpCert.ts)<br>[Service Principal from file](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpSecret.ts)<br>[Interactive](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/interactivePersonalAccount.ts)<br>[Basic](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/usernamePassword.ts)|
|[@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth)|[Authentication with popup (create-react-app)](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/authentication-with-popup)<br>[React without pop-up](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/react-app)<br>[HTML with Login button](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/vanilla)|
|[ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)|[Service principal](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication)<br>[Interactive](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#interactive-login)<br>[Basic](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#basic-authentication)|

## Next steps	

* [Azure npm packages](../azure-sdk-library-package-index.md)
* [Azure npm package documentation](/javascript/api/overview/azure/)
