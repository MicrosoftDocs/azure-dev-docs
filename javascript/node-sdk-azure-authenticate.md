---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: article
ms.date: 06/17/2017
---

# Authenticate with the Azure modules for Node.js

All service APIs require authentication via a `credentials` object when being
instantiated. There are three ways of authenticating and creating the required
credentials via the Azure SDK for Node.js: 

- Basic authentication
- Interactive login
- Service principal authentication

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Basic authentication

To programmatically authenticate using your Azure account credentials, use the `loginWithUsernamePassword` function. The following JavaScript code snippet illustrates how to use basic authentication using credentials that are stored as environment variables. 

```javascript
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.loginWithUsernamePassword(process.env.AZURE_USER, 
                                 process.env.AZURE_PASS, 
                                 (err, credentials) => {
  if (err) throw err;

  let storageClient = Azure.createARMStorageManagementClient(credentials, 
                                                             '<azure-subscription-id>');

  // ..use the client instance to manage service resources.
});
```

## Interactive login

Interactive login provides a link and a code that allows the user to
authenticate from a browser. Use this method when multiple accounts are used by
the same script or when user intervention is preferred.

```javascript
const Azure = require('azure');
const MsRest = require('ms-rest-azure');

MsRest.interactiveLogin((err, credentials) => {
  if (err) throw err;

  let storageClient = Azure.createARMStorageManagementClient(credentials, '<azure-subscription-id>');

  // ..use the client instance to manage service resources.
});
```

## Service principal authentication

[Interactive login](#interactive-login) is the easiest way to
authenticate. However, when using the Node.js SDK, you may want
to use service principal authentication rather than providing your account
credentials. The topic, 
[Create an Azure service principal with Node.js](./node-sdk-azure-authenticate-principal.md), 
explains various techniques for creating (and using) a service principal. 
