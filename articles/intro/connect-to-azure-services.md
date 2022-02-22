---
title: Connect your app to Azure Services
description: An overview of important services that developers use when building solutions on Azure.
ms.prod: azure
ms.topic: article
ms.date: 01/13/2022
---

# Connect your app to Azure Services

Azure offers a variety of services that applications can take advantage of regardless of whether they are hosted in Azure or on-premises.  For example you could:

- Use Azure Blob Storage to store and retrieve files in the cloud.
- Add full text searching capability to your application using Azure Cognitive Search.
- Use Azure Service Bus to handle messaging between different components of a microservices architecture.
- Use Text Analytics to identify and redact sensitive data in a document.

Azure services offer the benefit that they are fully managed by Azure.

## Accessing Azure Services from Application Code

There are two ways to access Azure service from your application code.

- **Azure SDK** - Available for .NET, Java, JavaScript, Python and Go.
- **Azure REST API** - Available from all languages.

When possible, it is recommended to use the Azure SDK to access Azure services from application code. Advantages of using the Azure SDK include:

- *Accessing Azure services is just like using any other library.*  You import the appropriate SDK package into your application, create a client object, and then call methods on the client object to communicate with your Azure resource.
- *Simplifies the process of authenticating your application to Azure.* When creating an SDK client object, you include the right credentials and the SDK takes care of authenticating your calls to Azure
- *Simplified programming model.*  Internally, the Azure SDK calls the Azure REST API.  However, the Azure SDK has built in error handling, retry logic and result pagination making programming against the SDK simpler than calling the REST API directly.

## Azure SDK

The Azure SDK for .NET is available as a series of packages available from NuGet.  Your application imports the packages for the services it uses 




## Azure REST API

Programming languages not supported by the Azure SDK can make use of the Azure REST API.
