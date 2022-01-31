---
title: Test strategies with Azure SDK
description: When developing applications integrated with Azure SDKs, you should consider the following strategies to ensure the quality of your code. 
ms.topic: how-to
ms.date: 10/26/2021
ms.custom: devx-track-js
---

# Test strategies with Azure SDK

When developing applications integrated with Azure SDKs, consider how much integration your code base has with the Azure SDKs. 

## Small team with few integration calls to Azure SDKs

When you code base has a very few integration calls to the Azure SDKs, we recommend you capture example results from those calls. Once the results are captured, use mocks/spys to integrate the example results. 

With this strategy, your local development and testing isn't dependent on the Azure cloud. Your tests can run predictably without timeouts, or other cloud issues.

## More integration calls to Azure SDK

When you have more integration calls, consider using a recorder/playback strategy to generate the sample results and verify your code paths. This strategy also allows you to verify your own business logic without a dependency on the Azure cloud. 

## Tests integrated with Azure cloud

When you run your tests against the Azure cloud resources, consider creating separate resources. Your tests may be able to run and complete against resources in lower pricing tiers or different regions. 

## Azure SDK tests

The Azure SDK tests for each SDK are available in the GitHub repo for the JavaScript SDKs. Some example tests are:

* [Azure Storage Blob](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/test) 
* [Azure Event grid](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid/test)
* [Azure Key vault](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/keyvault/keyvault-secrets/test)

## Next steps

* [List account subscriptions](nodejs-sdk-azure-authenticate.md?tabs=azure-sdk-for-javascript#3-list-azure-subscriptions-with-service-principal) with the resource manager SDK for subscriptions