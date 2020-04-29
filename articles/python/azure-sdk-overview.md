---
title: Azure SDK for Python
description: Overview of the features and capabilities of the Azure SDK for Python that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 04/29/2020
ms.topic: conceptual
---

# Azure SDK for Python

The open-source Azure SDK for Python simplifies provisioning, managing, and using Azure resources from Python application code.

## The details you really want to know

- The SDK supports Python 2.7 and Python 3.5.3 or later, and it tested also with PyPy 5.4+.

- The SDK is composed of over 180 individual Python libraries that relate to specific Azure services.

- You install the libraries you need by using `pip install <library_name>` using the library names on the [release list](https://azure.github.io/azure-sdk/releases/latest/all/python.html). For further details, see [Install Azure SDK libraries](azure-sdk-install.md).

- There are distinct "management" and "client" libraries that serve different purposes and are used by different kinds of code. For more details, see the following sections later in this article:
  - [Provision and manage Azure resources with management libraries](#provision-and-manage-azure-resources-with-management-libraries)
  - [Connect to and use Azure resources with client libraries](#connect-to-and-use-azure-resources-with-client-libraries)

- Documentation for the SDK is found on the [Azure SDK for Python Reference](/python/api/overview/azure/?view=azure-python), which is organized by Azure Service, or the [Python API browser](/python/api/?view=azure-python), which is organized by package name. At present, you often need to click to a number of layers to get to the classes and methods you care about. Allow us to apologize in advance for this sub-par experience. We're working to improve it!

- To try the libraries for yourself, see [Get started with the Azure SDK for Python](azure-sdk-get-started.yml).

### Non-essential but still interesting details

- Because the Azure CLI is written in Python using the SDK management libraries, anything you can do with Azure CLI commands you can also do from a Python script. That said, the CLI commands provide many helpful features such as performing multiple tasks together, automatically handling asynchronous operations, formatting output like connection strings, and so on. Consequently, using the CLI (or its equivalent, Azure PowerShell) for automated provisioning and management scripts can be significantly more convenient than writing the equivalent Python code, unless you want to have a much more exacting degree of control over the process.

- The Azure SDK for Python is a Python layer on top of the underlying Azure REST API, allowing you to use those APIs through familiar Python paradigms. However, you can always use the REST API directly from Python code, if desired.

- You can find the source code for the SDK on [https://github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). As an open source project, contributions are welcome!

- Although you can use the SDK with interpreters such as IronPython and Jython that we don't test against, you may encounter isolated issues and incompatibilities.

- The source repo for the SDK documentation is found on [https://github.com/MicrosoftDocs/azure-docs-sdk-python/](https://github.com/MicrosoftDocs/azure-docs-sdk-python/).

- We're currently updating the Azure SDK for Python client libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.

  - This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/core/azure-core) library.

  - The libraries that currently work with the Core library are listed on [Azure SDK for Python latest releases](https://azure.github.io/azure-sdk/releases/latest/#python).

- For details on the guidelines we apply to the SDK, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_introduction.html).

## Provision and manage Azure resources with management libraries

The SDK's *management* libraries, the names of which all begin with `azure-mgmt-`, help you create, provision and otherwise manage Azure resources from Python scripts. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that can you through the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/install-azure-cli). (As noted earlier, the Azure CLI is written in Python and uses the management libraries to implement its various commands.)

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

## Connect to and use Azure resources with client libraries

The SDK's *client* libraries help you write Python application code to interact with already-provisioned services. The SDK provides client libraries only for those services that support a client API.

For details on working with each client library, see the *README.md* or *README.rst* file located in the library's project folder in the SDK's [GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find additional code snippets in the [reference documentation](/python/api?view=azure-python) and the [Azure Samples](https://docs.microsoft.com/samples/browse/?languages=python&products=azure).

## Next step

> [!div class="nextstepaction"]
> [Install SDK libraries >>>](azure-sdk-install.md)

## Get help and give feedback

- Visit the [Azure SDK for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter
