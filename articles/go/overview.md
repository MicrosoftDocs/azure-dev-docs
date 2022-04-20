---
title: What is the Azure SDK for Go?
description: Learn how the Azure SDK for Go can help you create and manage Azure resources.
ms.date: 04/20/2022
ms.topic: overview
ms.custom: devx-track-go
---

# What is the Azure SDK for Go?

Learn how the Azure SDK for Go can help you create and manage Azure resources.

## Introducing the management and client libraries

The Azure SDK for Go provides several libraries (grouped into *management* and *client*) that allow your Go code to communicate with Azure services. Both the management and client libraries are designed to work with both local and cloud environments.

Due to the adoption of generics, the Azure SDK for Go is compatible with Go 1.18 and later. Moving forward, the Azure SDK for Go will support the two most recent major releaes. For a list of all Go releases and to see how to update to a specific version, see [Go Release History](https://golang.org/doc/devel/release.html).

You'll sometimes see the management libraries referred to as the "_management plane_" and the client libraries referred to as the "_data plane_". The key difference between the management plane and the data plane can best be explained as follows:

- The management plane is used to manage resources in your Azure subscription.
- The data plane is used to interact with Azure resources in your subscription.

> [!TIP]
> Example: You want to create an Azure Storage Account in your subscription. You'll use the management plane to create the account. And the data plane to interact with the account by reading and writing data to the storage account.

The management and client libraries are built on top of the Azure REST API. This hierarchy allows you to access the functionality of the Azure REST API from the familiar Go lexicon. You can also use the Azure REST API directly from your Go code.

Source code for the management and client libraries is available via a [GitHub repository](https://github.com/Azure/azure-sdk-for-go). As an open-source project, contributions from the public are welcome!

Current version of the management and client libraries shares the common cloud patterns implemented in the [Azure core library](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/azcore). These patterns include authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.

The Azure SDK for Go is composed of many individual Go libraries that relate to specific Azure services. For the list of client and management libraries, see the [Go section of the Azure SDK Releases page](https://azure.github.io/azure-sdk/#go).

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Go Core Concepts](azure-sdk-core-concepts.md)

> [!div class="nextstepaction"]
> [Azure SDK for Go management libraries](management-libraries.md)
