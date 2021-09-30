---
title: Use Azure SDK
description: Use Azure SDK with JavaScript or TypeScript
ms.topic: conceptual
ms.date: 09/29/2021
ms.custom: devx-track-js
---

# Use Azure SDKs in JavaScript and TypeScript projects

## Differences between npm packages and REST APIs

## Azure resources and service data

Cover management plane and data plane

## Install Azure npm packages

## Use Azure npm package sample code

## Provide authentication credentials

## Create an SDK client and call methods

## Asynchronous paging of results

An SDK method can return an asynchronous iterator, [PagedAsyncIterableIterator](/javascript/api/@azure/core-paging/pagedasynciterableiterator), to allow for asynchronous results. The results may use paging and continuation tokens to break up result sets.

The following [JavaScript example](https://github.com/Azure-Samples/js-e2e/blob/main/storage/blob-paging/blob-paging.js) demonstrates asynchronous paging. The code sets an artificially short paging size of 2 in order to quickly and visually demonstrate the process when you run the sample code in debug. 

:::code language="JavaScript" source="~/../js-e2e/storage/blob-paging/blob-paging.js" highlight="21-41":::

Learn more about paging and iterators on Azure from:

* [@azure/core-paging](/javascript/api/@azure/core-paging/)

## Long running operations

An SDK method can return a long running operation (LRO) [_response_](/javascript/api/@azure/core-lro/lroresponse). This response includes information to know if your request completed or is still in process. 

The following [JavaScript example](https://github.com/Azure-Samples/js-e2e/blob/main/storage/upload-url-to-blob-poll-until-done/upload-url-to-blob-poll-until-done.js) demonstrates how to wait for a LRO to complete, with `.pollUntildone()`, before continuing. 

:::code language="JavaScript" source="~/../js-e2e/storage/upload-url-to-blob-poll-until-done/upload-url-to-blob-poll-until-done.js" highlight="38-44":::

Learn more about long running operations on Azure from:

* [@azure/core-lro](/javascript/api/@azure/core-lro)

## Handling timeouts to Azure

## Verbose logging from the SDK

## Bundling