---
title: Use Azure client libraries for JavaScript
description: To programmatically access your Azure services, use the Azure client libraries (SDKs) for JavaScript or TypeScript development.
ms.topic: concept-article
ms.date: 08/23/2024
ms.custom: devx-track-js, devx-track-ts
---

# Use Azure client libraries for JavaScript and TypeScript

To programmatically access your Azure services, use the Azure client libraries for JavaScript. 

[!INCLUDE [javascript-sdk-libraries](../includes/libraries.md)]

## Differences between client libraries and REST APIs

Use the following information to understand when to use which type of access.

* The [Azure client libraries](../azure-sdk-library-package-index.md#modern-javascripttypescript-libraries) are the preferred method of accessing your Azure service. These libraries abstract away the boilerplate code required to manage cloud-based Azure platform REST requests such as authentication, retries, and logging.
* [Azure REST APIs](/rest/api/azure/) are the preferred method if you are:
  * Working with preview services that do not have Azure client libraries available. Consider your code as preview, which should be updated when the service is generally available with client libraries.
  * Want to make REST calls directly because you don't want the entire SDK to use a single REST API or you want deeper control over the HTTP requests.

## Azure client and management libraries

The Azure client library [releases](https://azure.github.io/azure-sdk/releases/latest/js.html) are available as:

* [Management](https://github.com/azure/azure-sdk-for-js#management): Management libraries enable you to create and manage Azure resources. You can recognize these libraries by `arm-` in their package names. The term ARM indicates the Azure Resource Manager.
  * [Documentation and code samples](https://aka.ms/azsdk/js/mgmt)
* [Client](https://github.com/azure/azure-sdk-for-js#client): Given an Azure resource already exists, use the client libraries to consume it and interact with it.
  * Each package README.md includes documentation and samples.

## Install Azure npm packages

Azure client libraries are freely available from [NPM](https://www.npmjs.com/). Install individual SDKs as needed. Each SDK provides TypeScript definitions.

For client/browser usage, Azure client libraries need to be added to your [bundling](#bundling) process.

## Use Azure npm package sample code

Each package includes documentation to quickly get you started with the package. Refer to the specific NPM packages you use to learn how to use them.

## Provide authentication credentials

The Azure client libraries require credentials [to authenticate to the Azure platform](../sdk/authentication/local-development-environment-service-principal.md). [Credential classes](https://www.npmjs.com/package/@azure/identity#credential-classes) provided by [@azure/identity](https://www.npmjs.com/package/@azure/identity) provide several benefits:

* Fast onboarding
* Most secure method
* Separate the authentication mechanism from the code. This allows you to use the same code locally and on the Azure platform while the credentials are different. 
* Provide chained authentication so several mechanisms can be available.

## Create an SDK client and call methods

Once you programmatically create a credential, pass the credential to your Azure client. The client may require additional information such as a subscription ID or service endpoint. These values are available in the Azure portal, for your resource.

The following code example uses the DefaultAzureCredential and the `arm` subscription client library to list subscriptions which this credential has access to read.

:::code language="JavaScript" source="~/../js-e2e/resources/subscriptions/list.js" highlight="28,33" :::

## Asynchronous paging of results

An SDK method can return an asynchronous iterator, [PagedAsyncIterableIterator](/javascript/api/@azure/core-paging/pagedasynciterableiterator), to allow for asynchronous results. The results may use paging and continuation tokens to break up result sets.

The following [JavaScript example](https://github.com/Azure-Samples/js-e2e/blob/main/storage/blob-paging/blob-paging.js) demonstrates asynchronous paging. The code sets an artificially short paging size of 2 in order to quickly and visually demonstrate the process when you run the sample code in debug.

:::code language="JavaScript" source="~/../js-e2e/storage/blob-paging/blob-paging.js" highlight="21-41":::

Learn more about paging and iterators on Azure:

* [Async Iterators in the Azure SDK for JavaScript/TypeScript](https://devblogs.microsoft.com/azure-sdk/async-iterators-in-the-azure-sdk-for-javascript-typescript/)

## Long running operations

An SDK method can return a long running operation (LRO) [raw response](/javascript/api/%40azure/core-lro/rawresponse). This response includes information including:

* Your request completed
* Your request is still in process

The following [JavaScript example](https://github.com/Azure-Samples/js-e2e/blob/main/storage/upload-url-to-blob-poll-until-done/upload-url-to-blob-poll-until-done.js) demonstrates how to wait for an LRO to complete, with `.pollUntildone()`, before continuing.

:::code language="JavaScript" source="~/../js-e2e/storage/upload-url-to-blob-poll-until-done/upload-url-to-blob-poll-until-done.js" highlight="38-44":::

Learn more about long running operations on Azure:

* [@azure/core-lro](/javascript/api/overview/azure/core-lro-readme)

## Canceling async operations

The [@azure/abort-controller](https://www.npmjs.com/package/@azure/abort-controller) package provides AbortController and AbortSignal classes. Use the AbortController to create an AbortSignal, which can then be passed to Azure SDK operations to cancel pending work. Azure SDK operations can be:

* Aborted based on your own logic
* Aborted based on a timeout limit
* Aborted based on a parent task's signal
* Aborted based on a parent task's signal _or_ a timeout limit

Learn more:

* [How to use abort signals to cancel operations in the Azure SDK for JavaScript/TypeScript](https://devblogs.microsoft.com/azure-sdk/how-to-use-abort-signals-to-cancel-operations-in-the-azure-sdk-for-javascript-typescript/ )

## Verbose logging from the SDK

When using an Azure SDK, there may be times when you need to debug your application.

* To enable logging at **build-time**, set the AZURE_LOG_LEVEL environment variable to `info`.
* To enable logging at **run-time**, use the [@azure/logger](https://www.npmjs.com/package/@azure/logger) package:

    ```javascript
    import { setLogLevel } from "@azure/logger";

    setLogLevel("info");
    ```

## Bundling

Learn about bundling with the Azure SDK:

* [To bundle the Azure SDKs](https://aka.ms/AzureSDKBundling)
* [Bundling samples](https://github.com/Azure/azure-sdk-for-js/tree/main/samples/Bundling)

## Next steps

* [List subscriptions with **@azure/arm-subscriptions** SDK](../sdk/authentication/local-development-environment-service-principal.md)
* [List recent resource operations with **@azure/arm-monitor** SDK](../how-to/with-azure-sdk/list-resource-operation-history.md)
