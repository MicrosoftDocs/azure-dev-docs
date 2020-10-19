---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: how-to
ms.date: 10/19/2020
ms.custom: devx-track-js
---

# Authenticate with the Azure management modules for JavaScript

All [SDK client libraries](azure-sdk-library-package-index.md) require authentication via a `credentials` object when being
instantiated. There are multiple ways of authenticating and creating the required
credentials.

## Authentication  with Azure services while developing

Common methods to create the required credentials while you are developing:

| Login type|Purpose|
|--|--|
|**Service principal**|This authentication is the _recommended method_. Learn how to [create an Azure service principal](node-sdk-azure-authenticate-principal.md). A service principal allows you to have a connection to Azure that is separate from your personal Azure account. It can be a temporary account or it can be a longer living account to act in place of your personal account.|
| **Interactive login**| This is the easiest way to authenticate when you are trying Azure services. It requires logging in with your personal account with a browser. |
|**Basic**|This authentication requires you to enter your personal username and password. This is the least secure method and is not recommended.| 

## Authentication with Azure services and production code

| Login type|Purpose|
|--|--|
|**Managed Service Identity (MSI)**|[MSI authentication](/azure/active-directory/managed-identities-azure-resources/overview) is best for production scenarios. Your aren't going to use it in your local development environment.|
|**Certificates**|[Certificates](/azure/cloud-services/cloud-services-certs-create) need to be uploaded to Azure either using the [Portal](/azure/cloud-services/cloud-services-configure-ssl-certificate-portal).|

## JavaScript authentication samples for Azure

|Authentication package|Sample authentication scripts|
|--|--|
|[@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) <br>(recommended)|[Service Principal with Certificate](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpCert.ts)<br>[Service Principal from file](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpSecret.ts)<br>[Interactive](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/interactivePersonalAccount.ts)<br>[Basic](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/usernamePassword.ts)|
|[@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth)<br>(recommended)|[Authentication with popup (create-react-app)](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/authentication-with-popup)<br>[React without pop-up](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/react-app)<br>[HTML with Login button](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/vanilla)|
|[ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)|[Service principal](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication)<br>[Interactive](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#interactive-login)<br>[Basic](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#basic-authentication)|

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Next steps	

* [Deploy a static website to Azure from Visual Studio Code](tutorial-vscode-static-website-node-01.md)