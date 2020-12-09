---
title: Authentication and Authorization - JavaScript - Azure
description: Understand how to developer with Identity, authentication, and users with Azure.  
ms.topic: reference
ms.date: 12/09/2020
ms.custom:  devx-track-js
---

# Identity, authentication, and Users

Authentication and authorization are broad subjects for a web application that can be reduced to specific programmatic tasks, DevOps tasks, and user interactions with an application. This article focuses on the top tasks a JavaScript developer commonly has to design for or complete for a web application. 

## Authentication with Azure

Authentication is the ability to allow a programmer or user to access a service or app.

|Required|Perspective|Description|
|--|--|--|
|Yes|Developer|Application code must pass required credentials to Azure to access Azure services.|
|No|User|For a user of an application, authentication can be anonymous or require a user account. This restricted access can use any common authentication provider, including Microsoft, or your can build your own authentication layer for your users.|

## Authentication for developers to Azure services

Programmatic authentication to Azure requires a valid credential for the exact service the code uses. You need to read the Quickstart documentation for the service, and understand what type of credentials the service expects. 

Once you understand how to connect to a service, you should create a service principal and set the service principal to an environment variable on your development machine. That step removes your personal account for direct interaction with Azure, and the risk of your personal account being compromised by checking in credentials with the source code. 

## Programmatic use of modern Azure with @azure/identity npm package

The current Azure SDK library uses that service principal for programmatic authentication to Azure services with the [@azure/identity](https://www.npmjs.com/package/@azure/identity) npm package. This authentication simplifies the process and is available on the [modern Azure SDK packages](https://www.npmjs.com/package/@azure/identity#client-libraries-supporting-authentication-with-azure-identity). 

## Programmatic use of legacy Azure with 