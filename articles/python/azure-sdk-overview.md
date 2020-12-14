---
title: Use the Azure libraries (SDK) for Python
description: Overview of the features and capabilities of the Azure libraries for Python that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 09/19/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Use the Azure libraries (SDK) for Python

The open-source Azure libraries for Python simplify provisioning, managing, and using Azure resources from Python application code.

## The details you really want to know

- The Azure libraries are how you communicate with Azure services *from* Python code that you run either locally or in the cloud. (Whether you can run Python code within the scope of a particular service depends on whether that service itself currently supports Python.)

- The libraries support Python 2.7 and Python 3.5.3 or later, and it is also tested with PyPy 5.4+.

- The Azure SDK for Python is composed solely of over 180 individual Python libraries that relate to specific Azure services. There are no other tools in the "SDK".

- When running code locally, authenticating with Azure relies on environment variables as described on [Configure your local dev environment](configure-local-development-environment.md). 

- You install the library packages you need with `pip install <library_name>`, using the library names on the [Python SDK package index](azure-sdk-library-package-index.md). For further details, see [Install Azure libraries](azure-sdk-install.md).

- There are distinct **management** and **client** libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and is used by different kinds of code. For more details, see the following sections later in this article:
  - [Provision and manage Azure resources with management libraries](#provision-and-manage-azure-resources-with-management-libraries)
  - [Connect to and use Azure resources with client libraries](#connect-to-and-use-azure-resources-with-client-libraries)

- Documentation for the libraries is found on the [Azure for Python Reference](/python/api/overview/azure/), which is organized by Azure Service, or the [Python API browser](/python/api/), which is organized by package name. At present, you often need to click to a number of layers to get to the classes and methods you care about. Allow us to apologize in advance for this sub-par experience. We're working to improve it!

- To try the libraries for yourself, we first recommend [setting up your local dev environment](configure-local-development-environment.md). Then you can try any of the following standalone examples (in any order): [Example: Provision a resource group](azure-sdk-example-resource-group.md), [Example: Provision and use Azure Storage](azure-sdk-example-storage.md), [Example: Provision a web app and deploy code](azure-sdk-example-web-app.md), [Example: Provision and use a MySQL database](azure-sdk-example-database.md), and [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md).

- For a demonstration video, see <a href="https://www.youtube.com/watch?v=M1pVxItg2Mg&feature=youtu.be&ocid=AID3006292" target="_blank">Using Azure SDKs to interact with Azure resource</a> (youtube.com) from virtual PyCon 2020.

### Non-essential but still interesting details

- Because the Azure CLI is written in Python using the management libraries, anything you can do with Azure CLI commands you can also do from a Python script. That said, the CLI commands provide many helpful features such as performing multiple tasks together, automatically handling asynchronous operations, formatting output like connection strings, and so on. Consequently, using the CLI (or its equivalent, Azure PowerShell) for automated provisioning and management scripts can be significantly more convenient than writing the equivalent Python code, unless you want to have a much more exacting degree of control over the process.

- The Azure libraries for Python build on top of the underlying Azure REST API, allowing you to use those APIs through familiar Python paradigms. However, you can always use the REST API directly from Python code, if desired.

- You can find the source code for the Azure libraries on [https://github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). As an open-source project, contributions are welcome!

- Although you can use the libraries with interpreters such as IronPython and Jython that we don't test against, you may encounter isolated issues and incompatibilities.

- The source repo for the library API reference documentation resides on [https://github.com/MicrosoftDocs/azure-docs-sdk-python/](https://github.com/MicrosoftDocs/azure-docs-sdk-python/).

- We're currently updating the Azure libraries for Python libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.

  - This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library.

  - The libraries that currently work with the Core library are listed on [Azure SDK for Python latest releases](azure-sdk-library-package-index.md#libraries-using-azurecore). These libraries, primarily the client libraries, are sometimes referred to as "track 2".

  - The management libraries and any other that aren't yet updated are sometimes referred to as "track 1".

- For details on the guidelines we apply to the libraries, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_introduction.html).

## Provision and manage Azure resources with management libraries

The SDK's *management* (or "management plane") libraries, the names of which all begin with `azure-mgmt-`, help you create, provision and otherwise manage Azure resources from Python scripts. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that you can through the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/install-azure-cli). (As noted earlier, the Azure CLI is written in Python and uses the management libraries to implement its various commands.)

The following examples illustrate how to use some of the primary management libraries:

- [Provision a resource group](azure-sdk-example-resource-group.md)
- [List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Provision Azure Storage](azure-sdk-example-storage.md)
- [Provision a web app and deploy code](azure-sdk-example-web-app.md)
- [Provision and query a database](azure-sdk-example-database.md)
- [Provision a virtual machine](azure-sdk-example-virtual-machines.md)

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api) and the [Azure Samples](/samples/browse/?languages=python&term=Getting%20started%20-%20Managing).

### Migrating from older management libraries

If you are migrating code from older versions of the management libraries, see the following details:

- If you use the `ServicePrincipalCredentials` class, see [How to authenticate - use token credentials](azure-sdk-authenticate.md#authenticate-with-token-credentials).
- The names of async APIs have changed as described on [Library usage patterns - asynchronous operations](azure-sdk-library-usage-patterns.md#asynchronous-operations). Simply said, the names of async APIs in newer libraries start with `begin_`. In most cases, the API signature remains the same.

## Connect to and use Azure resources with client libraries

The SDK's *client* (or "data plane") libraries help you write Python application code to interact with already-provisioned services. Client libraries exist only for those services that support a client API.

The article, [Example: Use Azure Storage](azure-sdk-example-storage-use.md), provides a basic illustration of using client library.

Different Azure services also provide examples using these libraries. See the following index pages for additional links:

- [App hosting](quickstarts-app-hosting.md)
- [Cognitive Services](quickstarts-cognitive-services.md)
- [Data solutions](quickstarts-data-solutions.md)
- [Identity and security](quickstarts-identity-security.md)
- [Machine learning](quickstarts-machine-learning.md)
- [Messaging and IoT](quickstarts-messaging-iot.md)
- [Other services](quickstarts-other-services.md)

For details on working with each client library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK's GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api) and the [Azure Samples](/samples/browse/?languages=python&products=azure).

## Get help and connect with the SDK team

- Visit the [Azure libraries for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter

## Next step

We strongly recommend doing a one-time setup of your local development environment so that you can easily use any of the Azure libraries for Python.

> [!div class="nextstepaction"]
> [Set up your local dev environment >>>](configure-local-development-environment.md)
