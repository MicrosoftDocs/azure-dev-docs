---
ms.custom: devx-track-js
ms.topic: include
ms.date: 09/30/2020
---

## Types of SDK client libraries

There are two sets of management packages for Azure services that helps you with resource management.

|Feature|Azure SDK for JavaScript<br>(recommended)|Azure SDK for Node.js<br>(older)|
|--|--|--|
|In active development|✔️|❌|
|Use in Node.js|✔️|✔️|
|Use in browser|✔️|❌|
|Use in JavaScript|✔️|✔️|
|Use in TypeScript<br>(.d.ts included)|✔️|❌|
|GitHub repository|[Azure/azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js)|[Azure/azure-sdk-for-node](https://github.com/Azure/azure-sdk-for-node)|

## Types of authentication libraries:

* [@azure/identity](https://www.npmjs.com/package/@azure/identity): The Azure Identity library provides Azure Active Directory token authentication support across the Azure SDK. It provides a set of TokenCredential implementations which can be used to construct Azure SDK clients which support AAD token authentication.
* [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node): MSAL Node enables applications to authenticate users using Azure AD work and school accounts (AAD), Microsoft personal accounts (MSA) and social identity providers like Facebook, Google, LinkedIn, Microsoft accounts, etc. through Azure AD B2C service. It also enables your app to get tokens to access Microsoft Cloud services such as Microsoft Graph.