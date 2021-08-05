---
title: What is the Azure SDK for Go?
description: Learn how the Azure SDK for Go can help you create and manage Azure resources.
ms.date: 08/04/2021
ms.topic: overview
ms.custom: devx-track-go
---
# What is the Azure SDK for Go?

## Key details

- The Azure SDK for Go provides several libraries (grouped into *management* and *client*) that allow your Go code to communicates with Azure services. Your Go code can run either locally or in the cloud.
- The management and client libraries support the two most recent major Go releases. For a list of all Go releases and to see how to update to a specific version, see [Go Release History](https://golang.org/doc/devel/release.html).
- You will sometimes see the management libraries referred to as the "management plane" and the client libraries referred to as the "data plane".
- The key difference between the management plane and the data plane is the following:
    - You use the management plane to manage resources in your Azure subscription. This includes creating and deleting Azure resources such as resource groups, virtual machines, and so on.
    - You use the data plane to use capabilities exposed by an instance of a resource type.
    - Using the Azure Storage service as an example, you use the management plan to create a storage account and the data plane to read and write data in that storage account instance.
- The management and client libraries are built on top of the Azure REST API. This hierarchy allows you to access the functionality of the Azure REST API from the familiar Go lexicon. You can also use the Azure REST API directly from your Go code.
- The source code for the management and client libraries in available via a [GitHub repository](https://github.com/Azure/azure-sdk-for-go). As an open-source project, contributions from the public are welcome!
- The latest version of the management and client libraries implement common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.
- The Azure SDK for Go is composed of many individual Go libraries that relate to specific Azure services. For the list of client and management libraries, see the [SDK directory listing in the Azure SDK for Go GitHub repo](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk).