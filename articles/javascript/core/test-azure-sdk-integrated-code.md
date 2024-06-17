---
title: JavaScript test strategies with Azure SDK
description: When developing applications integrated with Azure SDKs, you should consider the following strategies to ensure the quality of your code. 
ms.topic: how-to
ms.date: 10/26/2021
ms.custom: devx-track-js
---

# Test strategies with Azure SDK

When developing applications integrated with Azure SDKs, consider how much integration your code base has with the Azure SDKs. 

## Without Azure cloud: Small teams

When your code base has very few integration calls to the Azure SDKs, we recommend you capture example results from those calls. Once the results are captured, use a mock or spy to inject the result into your code instead of hitting the Azure cloud.  

With this strategy, your local development and testing isn't dependent on the Azure cloud. Your tests can run predictably without timeouts, or other cloud issues.

## Without Azure cloud: More integration calls

When you have more integration calls, consider using a recorder/playback strategy to generate the sample results and verify your code paths. This strategy also allows you to verify your own business logic without a dependency on the Azure cloud. This strategy requires more infrastructure to support your test requirements.

## With Azure cloud: tests against services 

When you run your tests against the Azure cloud services, consider creating separate resources just for testing. Your tests may be able to run and complete against services in lower pricing tiers or different regions. 

## Azure SDK tests

The Azure SDK tests for each SDK are available in the GitHub repo for the JavaScript SDKs. Some example tests are:

* [Azure Storage Blob](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/test) 
* [Azure Event Grid](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid/test)
* [Azure Key vault](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-secrets/test)

## Next steps

* [List account subscriptions](../sdk/authentication/local-development-environment-service-principal.md?tabs=azure-sdk-for-javascript) with the resource manager SDK for subscriptions