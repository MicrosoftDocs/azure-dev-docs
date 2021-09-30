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

## Provide authentication to Azure platform with credentials

## Create an SDK client and call methods

## Core packages

* Long running operations (LRO)
* Paging

## Asynchronous paging of results

An SDK method returns an asynchronous iterator to allow for asynchronous results. The results may use paging and continuation tokens to break up result sets.

The following JavaScript example demonstrates asynchronous paging over a list of Azure Storage files which exist in the file share. The code sets an artificially short paging size of 2 in order to quickly and visually demonstrate the process when you run the sample code in debug. 

:::code language="JavaScript" source="~/../js-e2e/storage/file-paging/page-through-files.js" range="37-52,67-83":::

Learn more about page and iterators from:

* [@azure/core-paging](https://docs.microsoft.com/en-us/javascript/api/@azure/core-paging/?view=azure-node-latest)

## Long running operations

## Handling timeouts to Azure

## Verbose logging from the SDK

## Bundling