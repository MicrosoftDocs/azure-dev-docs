---
ms.custom: devx-track-js
ms.topic: include
ms.date: 10/20/2020
---

## Types of SDK client libraries

There are two sets of management packages for Azure services that help you with resource management.

|Feature|Azure SDK for JavaScript<br>(recommended)|Azure SDK for Node.js<br>(older)|
|--|--|--|
|In active development|✔️|❌|
|Use in Node.js|✔️|✔️|
|Use in browser|✔️|❌|
|Use in JavaScript|✔️|✔️|
|Use in TypeScript<br>(.d.ts included)|✔️|❌|
|GitHub repository|[Azure/azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js)|[Azure/azure-sdk-for-node](https://github.com/Azure/azure-sdk-for-node)|

## Authenticate to use the Azure SDKs

To authenticate for the Azure SDKs, you need to provide credentials. Select the best [credential class](https://www.npmjs.com/package/@azure/identity#credential-classes) for your programmatic or interactive scenario.

When adopting an Azure SDK, each npm package provides appropriate authentication sample code with the [@azure/identity](https://www.npmjs.com/package/@azure/identity) npm package. 