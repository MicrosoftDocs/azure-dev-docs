---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: how-to
ms.date: 09/29/2020
ms.custom: devx-track-js
---

# Authenticate with the Azure management modules for JavaScript

All [SDK client libraries](../azure-sdk-library-package-index.md) require authentication via a `credentials` object when being
instantiated. There are multiple ways of authenticating and creating the required
credentials.

Common methods to create the required credentials are:

- **Service principal** authentication is the _recommended method_. Learn how to 
[create an Azure service principal](node-sdk-azure-authenticate-principal.md). 
- **Interactive login** which is the easiest way to authenticate, but requires logging in with a user account and browser.
- **Basic** authentication with your  username and password. This is the least secure method. 

## Samples

|Authentication package|Sample authentication scripts|
|--|--|
|[@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) <br>(recommended)|[Service Principal with Certificate](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpCert.ts)<br>[Service Principal from file](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/authFileWithSpSecret.ts)<br>[Interactive](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/interactivePersonalAccount.ts)<br>[Basic](https://github.com/Azure/ms-rest-nodeauth/blob/master/samples/usernamePassword.ts)|
|[@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth)<br>(recommended)|[Authentication with popup (create-react-app)](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/authentication-with-popup)<br>[React without pop-up](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/react-app)<br>[HTML with Login button](https://github.com/Azure/ms-rest-browserauth/tree/master/samples/vanilla)|
|[ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure)|[Service principal](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#service-principal-authentication)<br>[Interactive](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#interactive-login)<br>[Basic](https://github.com/Azure/azure-sdk-for-node/blob/master/Documentation/Authentication.md#basic-authentication)|

[!INCLUDE [chrome-note](../includes/chrome-note.md)]

## Next steps	

* [Deploy a static website to Azure from Visual Studio Code](../tutorial-vscode-static-website-node-01.md)