---
title: What is the Azure SDK for Go?
description: Learn how the Azure SDK for Go can help you create and manage Azure resources.
ms.date: 08/10/2021
ms.topic: overview
ms.custom: devx-track-go
---

# What is the Azure SDK for Go?

## Introducing the management and client libraries

- The Azure SDK for Go provides several libraries (grouped into *management* and *client*) that allow your Go code to communicate with Azure services. Your Go code can run either locally or in the cloud.
- The management and client libraries support the two most recent major Go releases. For a list of all Go releases and to see how to update to a specific version, see [Go Release History](https://golang.org/doc/devel/release.html).
- You'll sometimes see the management libraries referred to as the "management plane" and the client libraries referred to as the "data plane".
- The key difference between the management plane and the data plane can best be explained as follows:
    - You use the management plane to manage resources in your Azure subscription.
    - You use the data plane to use capabilities exposed by an instance of a resource type.
    - Let's take using the Azure Storage service as an example. The management plane is used to create a storage account.  The data plane is then used to read and write data in that storage account.
- The management and client libraries are built on top of the Azure REST API. This hierarchy allows you to access the functionality of the Azure REST API from the familiar Go lexicon. You can also use the Azure REST API directly from your Go code.
- The source code for the management and client libraries in available via a [GitHub repository](https://github.com/Azure/azure-sdk-for-go). As an open-source project, contributions from the public are welcome!
- The current version of the management and client libraries shares the common cloud patterns implemented in the [Azure core library](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore). These patterns include authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.
- The Azure SDK for Go is composed of many individual Go libraries that relate to specific Azure services. For the list of client and management libraries, see the [Go section of the Azure SDK Releases page](https://azure.github.io/azure-sdk/#go).

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about the Azure SDK for Go management libraries](management-libraries.md)
