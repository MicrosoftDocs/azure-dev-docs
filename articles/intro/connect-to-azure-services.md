---
title: Connect your app to Azure Services
description: An overview of how to connect your applications to Azure.
ms.service: azure
ms.topic: article
ms.date: 07/29/2024
---

This is part four in a short series of 8 articles to help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: **Connect your app to Azure services**
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)
* Part 8: [Versioning policy for Azure services, SDKs, and CLI tools](azure-service-sdk-tool-versioning.md)

# Connect your app to Azure Services

Azure offers a variety of services that applications can take advantage of regardless of whether they are hosted in Azure or on-premises. For example you could:

- Use Azure Blob Storage to store and retrieve files in the cloud.
- Add full text searching capability to your application using Azure AI Search.
- Use Azure Service Bus to handle messaging between different components of a microservices architecture.
- Use Text Analytics to identify and redact sensitive data in a document.

Azure services offer the benefit that they are fully managed by Azure.

## Accessing Azure Services from Application Code

There are two ways to access Azure service from your application code.

- **Azure SDK** - Available for .NET, Java, JavaScript, Python and Go.
- **Azure REST API** - Available from all languages.

When possible, it is recommended to use the Azure SDK to access Azure services from application code. Advantages of using the Azure SDK include:

- **Accessing Azure services is just like using any other library.**  You import the appropriate SDK package into your application, create a client object, and then call methods on the client object to communicate with your Azure resource.
- **Simplifies the process of authenticating your application to Azure.** When creating an SDK client object, you include the right credentials and the SDK takes care of authenticating your calls to Azure
- **Simplified programming model.**  Internally, the Azure SDK calls the Azure REST API.  However, the Azure SDK has built in error handling, retry logic, and result pagination making programming against the SDK simpler than calling the REST API directly.

## Azure SDK

The Azure SDK allows programmatic access to Azure services from .NET, Java, JavaScript, Python, and Go applications. Applications install the necessary packages from their respective package manager and then call methods to programmatically access Azure resources.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50C7t]


More information about the Azure SDK for each language can be found in each language's developer center.

| Language                                | &nbsp;     | Overview                                                                           | Package list                                                                                         |
|-----------------------------------------|------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| ![.NET Logo](./media/logo-dotnet.png)   | .NET       |[Azure SDK for .NET overview](/dotnet/azure/sdk/azure-sdk-for-dotnet)               | [Azure SDK for .NET package list](/dotnet/azure/sdk/packages)                                        |
| ![Java Logo](./media/logo-java.png)     | Java       |[Azure SDK for Java overview](../java/sdk/overview.md)                   | [Azure SDK for Java package list](../java/sdk/azure-sdk-library-package-index.md)         |
| ![JavaScript Logo](./media/logo-js.png) | JavaScript |[Azure SDK for JavaScript overview](../javascript/core/use-azure-sdk.md) | [Azure SDK for JavaScript package list](../javascript/azure-sdk-library-package-index.md) |
| ![Python Logo](./media/logo-python.png) | Python     |[Azure SDK for Python overview](../python/sdk/azure-sdk-overview.md)         | [Azure SDK for Python package list](../python/sdk/azure-sdk-library-package-index.md)         |
| ![Golang Logo](./media/logo-golang.png) | Go         |[Azure SDK for Go overview](../go/overview.md)                           | [Azure SDK for Go package list](https://azure.github.io/azure-sdk/releases/latest/all/go.html)     |

## Azure REST API

Programming languages not supported by the Azure SDK can make use of the Azure REST API.  Details of how to call the Azure REST API and a full list of operations are available in the [Azure REST API overview](/rest/api/azure/).

> [!div class="nextstepaction"]
> [Continue to part 5: How do I create and manage resources in Azure?](azure-developer-create-resources.md)
