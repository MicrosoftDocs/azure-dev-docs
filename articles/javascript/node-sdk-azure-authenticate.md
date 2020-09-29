---
title: Authenticate with the Azure management modules for Node.js
description: Authenticate with a service principal into the Azure management modules for Node.js
ms.topic: how-to
ms.date: 06/17/2017
ms.custom: devx-track-js
---

# Authenticate with the Azure management modules for JavaScript

There are two sets of management packages for Azure services that helps you with resource management.
- Azure SDK for Node.js
- Azure SDK for JavaScript

Azure SDK for Node.js is the older set of management packages for Azure services that 
- are usable only in Node.js and not browsers
- are written in JavaScript with hand written type declaration files
- not in active development and deprecated in favor of the Azure SDK for JavaScript packages
- have package names that begin with `azure-arm-`
- require [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) package to create credentials which can 
then be passed to the client classes in the packages in order to authenticate using Azure Active Directory.
- live in the https://github.com/Azure/azure-sdk-for-node repo

Azure SDK for JavaScript is the newer set of management packages for Azure services that are
- usable both in Node.js and browsers
- written in TypeScript, can be used in both JavaScript and TypeScript projects
- in active development and receive updates as and when Azure services update their resource management APIs
- have package names that begin with `@azure/arm-`
- require [@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) package to create 
credentials which can then be passed to the client classes in the packages in order to authenticate using 
Azure Active Directory. If your application runs in the browser, use 
[@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth) instead.
- live in the https://github.com/Azure/azure-sdk-for-js repo

An easy way to differentiate between the two sets of packages is to look at the package names.

All service APIs require authentication via a `credentials` object when being
instantiated. There are multiple ways of authenticating and creating the required
credentials for packages in both Azure SDK for Node.js and Azure SDK for JavaScript.

Some common methods are:

- Basic authentication that uses username and password
- Interactive login which is the easiest way to authenticate, but requires logging in with a user account.
- Service principal authentication. The topic, 
[Create an Azure service principal with Node.js](./node-sdk-azure-authenticate-principal.md), 
explains various techniques for creating a service principal. 

The readme on each of the packages below go into details on the the various ways you can get a credential object.
- [@azure/ms-rest-nodeauth](https://www.npmjs.com/package/@azure/ms-rest-nodeauth) when using any management package
in Azure SDK for JavaScript in Node.js
- [@azure/ms-rest-browserauth](https://www.npmjs.com/package/@azure/ms-rest-browserauth) when using any management package
in Azure SDK for JavaScript in a browser
- [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) when using any management package in the older Azure SDK for Node.js

[!INCLUDE [chrome-note](includes/chrome-note.md)]

## Next steps	

* [Deploy a static website to Azure from Visual Studio Code](tutorial-vscode-static-website-node-01.md)