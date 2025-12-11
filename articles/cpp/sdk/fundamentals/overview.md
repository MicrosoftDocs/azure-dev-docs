---
title: Core Concepts of the Azure SDK for C++
description: Learn the fundamentals of using the Azure SDK for C++. 
ms.topic: overview
ms.date: 5/08/2025
ms.custom: devx-track-cpp

#customer intent: As a developer, I want a comprehensive and easy-to-use SDK for Azure services so that I can efficiently integrate cloud capabilities into my C++ applications.

---

# Core concepts of the Azure SDK for C++

The Azure SDK for C++ provides a set of libraries designed to help C++ developers integrate Azure services into their applications. This article explores the fundamental concepts that underpin the SDK, including the distinction between data and management planes, the role of Azure Core, package naming conventions, client objects, and configuration options. Understanding these core concepts will enable you to effectively use the SDK in your C++ applications.

## Data plane vs. management plane

The Azure SDK for C++ provides libraries for data plane operations but doesn't offer libraries for management plane operations. Data plane libraries are used to interact with already provisioned Azure services. If you require management plane libraries for provisioning and managing Azure resources in C++, leave an issue on our [GitHub repository](https://github.com/Azure/azure-sdk-for-cpp/issues/new/choose).

## Azure Core vs. other libraries

The Azure Core ([`azure-core`](/cpp/api/overview/azure/core-readme)) library provides fundamental functionalities that other libraries build on top of to provide specific functionalities for different Azure services. Developers need to understand the role of Azure Core to effectively use the SDK.

The main shared concepts of [`Azure::Core`](/cpp/api/azure-core/namespace_azure) include:

- Handling streaming data and input/output (I/O) via [`BodyStream`](/cpp/api/azure-core/class_azure_1_1_core_1_1_i_o_1_1_body_stream) along with its derived types.
- Accessing HTTP response details for the returned model of any SDK client operation, via [`Response<T>`](/cpp/api/azure-core/class_azure_1_1_response).
- Polling long-running operations (LROs), via [`Operation<T>`](/cpp/api/azure-core/class_azure_1_1_core_1_1_operation).
- Exceptions for reporting errors from service requests in a consistent fashion via the base exception type [`RequestFailedException`](/cpp/api/azure-core/class_azure_1_1_core_1_1_request_failed_exception).
- Abstractions for Azure SDK credentials [`TokenCredential`](/cpp/api/azure-core/class_azure_1_1_core_1_1_credentials_1_1_token_credential).
- Replaceable HTTP transport layer to send requests and receive responses over the network.
- HTTP pipeline and HTTP policies such as retry and logging, which are configurable via service client specific options.

## Package naming scheme

The Azure SDK for C++ uses a consistent naming scheme: `azure-<group_name>-<service_name>-<sub_service_name>`. Each name starts with `azure-`, followed by the group, service, and optionally a subservice. For example, `azure-security-keyvault-secrets` is for Azure Key Vault secrets.

## Client objects

Client objects in the Azure SDK for C++ are used to interact with Azure services. Each client object corresponds to a specific Azure service and provides methods to perform operations on that service. For example, [`BlobClient`](/cpp/api/azure-storage-blobs/class_azure_1_1_storage_1_1_blobs_1_1_blob_client) is used to interact with Azure Blob Storage.

## Options parameter for client objects

Client objects in the Azure SDK for C++ have methods that take an options parameter for customizing the interactions with the service. These options parameters can be used to set things like time-outs, retry policies, and other configurations.
