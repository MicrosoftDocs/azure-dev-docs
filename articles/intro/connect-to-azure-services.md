---
title: Connect your app to Azure Services
description: An overview of how to connect your applications to Azure.
ms.service: azure
ms.topic: overview
ms.date: 09/24/2025
---

# Connect your app to Azure services

This article is part four in a series of seven articles that help you get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: **Connect your app to Azure services**
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)

Azure offers many services that applications can use whether they're hosted in Azure or on-premises. For example, you can:

- Store and retrieve files with Azure Blob Storage.
- Add full-text search to your application with Azure AI Search.
- Use Azure Service Bus to handle messaging between different components of a microservices architecture.
- Use Text Analytics to identify and redact sensitive data in a document.

Azure services offer the benefit that they're fully managed by Azure.

## Access Azure services from application code

Use either the Azure SDK or the Azure REST API to access Azure services from your application code.

- **Azure SDK** - Available for .NET, Java, JavaScript, Python, and Go.
- **Azure REST API** - Available for all languages.

When possible, use the Azure SDK to access Azure services from application code. Advantages include:

- **Access Azure services like any other library.** You import the appropriate SDK package, create a client object, then call its methods to work with your Azure resource.
- **Simplify authentication.** When you create an SDK client object, you include credentials, and the SDK handles authenticating your calls to Azure.
- **Simplified programming model.** Internally, the Azure SDK calls the Azure REST API. The SDK includes built-in error handling, retry logic, and result pagination, making development simpler than calling the REST API directly.

## Azure SDK

The Azure SDK lets you access Azure services from .NET, Java, JavaScript, Python, and Go. Install the required packages from each language's package manager, then call the SDK methods to access Azure resources.


> [!VIDEO 80e061f0-39fd-439b-8fa3-aba064820634]


For more information about the Azure SDK, see the documentation in each language's developer center.

| Language                                | &nbsp;     | Overview                                                                           | Package list                                                                                         |
|-----------------------------------------|------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| ![.NET Logo](./media/logo-dotnet.png)   | .NET       |[Azure SDK for .NET overview](/dotnet/azure/sdk/azure-sdk-for-dotnet)               | [Azure SDK for .NET package list](/dotnet/azure/sdk/packages)                                        |
| ![Java Logo](./media/logo-java.png)     | Java       |[Azure SDK for Java overview](../java/sdk/overview.md)                   | [Azure SDK for Java package list](../java/sdk/azure-sdk-library-package-index.md)         |
| ![JavaScript Logo](./media/logo-js.png) | JavaScript |[Azure SDK for JavaScript overview](../javascript/core/use-azure-sdk.md) | [Azure SDK for JavaScript package list](../javascript/azure-sdk-library-package-index.md) |
| ![Python Logo](./media/logo-python.png) | Python     |[Azure SDK for Python overview](../python/sdk/azure-sdk-overview.md)         | [Azure SDK for Python package list](../python/sdk/azure-sdk-library-package-index.md)         |
| ![Golang Logo](./media/logo-golang.png) | Go         |[Azure SDK for Go overview](../go/overview.md)                           | [Azure SDK for Go package list](https://azure.github.io/azure-sdk/releases/latest/all/go.html)     |

## Azure REST API

Use the Azure REST API when the Azure SDK doesn't support your programming language. For details and the full list of operations, see the [Azure REST API overview](/rest/api/azure/).

> [!div class="nextstepaction"]
> [Continue to part 5: How do I create and manage resources in Azure?](azure-developer-create-resources.md)
