---
title: Fundamentals of the Azure SDK for C++
description: Learn the fundamentals of using the Azure SDK for C++. 
author: ronniegeraghty
ms.author: rgeraghty
ms.topic: overview
ms.date: 3/7/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# Core Concepts of the Azure SDK for C++

The Azure SDK for C++ provides a set of libraries designed to help C++ developers integrate Azure services into their applications. This article explores the fundamental concepts that underpin the SDK, including the distinction between data and management planes, the role of Azure Core, package naming conventions, client objects, and configuration options. Understanding these core concepts will enable you to effectively use the SDK in your C++ applications.

## Data vs Management Plane

The Azure SDK for C++ provides libraries for data plane operations but doesn't offer libraries for management plane operations. Data plane libraries are used to interact with already provisioned Azure services. If you require management plane libraries for provisioning and managing Azure resources in C++, leave an issue on our [GitHub repository](https://github.com/Azure/azure-sdk-for-cpp/issues/new/choose).

## Azure Core vs. Other Libraries

The Azure Core ([`azure-core`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/index.html)) library provides fundamental functionalities that other libraries build on top of to provide specific functionalities for different Azure services. Developers need to understand the role of Azure Core to effectively use the SDK.

The main shared concepts of [`Azure::Core`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/namespace_azure.html) include:

- Handling streaming data and input/output (I/O) via [`BodyStream`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_i_o_1_1_body_stream.html) along with its derived types.
- Accessing HTTP response details for the returned model of any SDK client operation, via [`Response<T>`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_response.html).
- Polling long-running operations (LROs), via [`Operation<T>`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_operation.html).
- Exceptions for reporting errors from service requests in a consistent fashion via the base exception type [`RequestFailedException`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_request_failed_exception.html).
- Abstractions for Azure SDK credentials [`TokenCredential`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-core/latest/class_azure_1_1_core_1_1_credentials_1_1_token_credential.html).
- Replaceable HTTP transport layer to send requests and receive responses over the network.
- HTTP pipeline and HTTP policies such as retry and logging, which are configurable via service client specific options.

## Package Naming Scheme

The Azure SDK for C++ uses a consistent naming scheme: `azure-<group_name>-<service_name>-<sub_service_name>`. Each name starts with `azure-`, followed by the group, service, and optionally a subservice. For example, `azure-security-keyvault-secrets` is for Azure Key Vault secrets.

## Client Objects

Client objects in the Azure SDK for C++ are used to interact with Azure services. Each client object corresponds to a specific Azure service and provides methods to perform operations on that service. For example, [`BlobClient`](https://azuresdkdocs.z19.web.core.windows.net/cpp/azure-storage-blobs/latest/class_azure_1_1_storage_1_1_blobs_1_1_blob_client.html) is used to interact with Azure Blob Storage.

## Options Parameter for Client Objects

Client objects in the Azure SDK for C++ have methods that take an options parameter for customizing the interactions with the service. These options parameters can be used to set things like time-outs, retry policies, and other configurations.
