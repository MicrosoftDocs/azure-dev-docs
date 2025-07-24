---
title: Use the Azure libraries (SDK) for Python
description: Overview of the features and capabilities of the Azure libraries for Python that help developers be more productive when creating, using, and managing Azure resources.
ms.date: 02/06/2025
ms.topic: article
ms.custom: devx-track-python, py-fresh-zinc
---

# Use the Azure libraries (SDK) for Python

The open-source Azure libraries for Python simplify provisioning, managing, and using Azure resources from Python application code.

## The details you really want to know

- The Azure libraries are how you communicate with Azure services *from* Python code that you run either locally or in the cloud. (Whether you can run Python code within the scope of a particular service depends on whether that service itself currently supports Python.)

- The libraries support [Python](https://www.python.org/) 3.8 or later. For more information about supported versions of Python, see [Azure SDKs Python version support policy](https://github.com/Azure/azure-sdk-for-python/wiki/Azure-SDKs-Python-version-support-policy). If you're using [PyPy](https://www.pypy.org/), make sure the version you use at least supports the Python version mentioned previously.

- The Azure SDK for Python is composed solely of over 180 individual Python libraries that relate to specific Azure services. There are no other tools in the SDK.

- When you run code locally, authenticating with Azure relies on environment variables as described in [How to authenticate Python apps to Azure services using the Azure SDK for Python](./authentication-overview.md#authentication-during-local-development).

- To install library packages with pip, use `pip install <library_name>` using library names from the [package index](azure-sdk-library-package-index.md). To install library packages in conda environments, use `conda install <package_name>` using names from the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). For more information, see [Install Azure library packages](azure-sdk-install.md).

- There are distinct **management** and **client** libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and is used by different kinds of code. For more information, see the following sections later in this article:
  - [Create and manage Azure resources with management libraries](#create-and-manage-azure-resources-with-management-libraries)
  - [Connect to and use Azure resources with client libraries](#connect-to-and-use-azure-resources-with-client-libraries)

- Documentation for the libraries is found on the [Azure for Python Reference](/python/api/overview/azure/), which is organized by Azure Service, or the [Python API browser](/python/api/), which is organized by package name.

- To try the libraries for yourself, we first recommend [setting up your local dev environment](../configure-local-development-environment.md). Then you can try any of the following standalone examples (in any order): [Example: Create a resource group](./examples/azure-sdk-example-resource-group.md), [Example: Create and use Azure Storage](./examples/azure-sdk-example-storage.md), [Example: Create and deploy a web app](./examples/azure-sdk-example-web-app.md), [Example: Create and query a MySQL database](./examples/azure-sdk-example-database.md), and [Example: Create a virtual machine](./examples/azure-sdk-example-virtual-machines.md).

- For demonstration videos, see <a href="https://www.youtube.com/watch?v=4xoJLCFP4_4" target="_blank">Introducing the Azure SDK for Python</a> (PyCon 2021) and <a href="https://www.youtube.com/watch?v=M1pVxItg2Mg&feature=youtu.be&ocid=AID3006292" target="_blank">Using Azure SDKs to interact with Azure resources</a> (PyCon 2020).

### Non-essential but still interesting details

- Because the [Azure CLI](/cli/azure/install-azure-cli) is written in Python using the management libraries, anything you can do with Azure CLI commands you can also do from a Python script. That said, the CLI commands provide many helpful features such as performing multiple tasks together, automatically handling asynchronous operations, formatting output like connection strings, and so on. So, using the CLI (or its equivalent, [Azure PowerShell](/powershell/azure/install-az-ps)) for automated creation and management scripts can be more convenient than writing the equivalent Python code, unless you want to have a much more exacting degree of control over the process.

- The Azure libraries for Python build on top of the underlying [Azure REST API](/rest/api/azure/), allowing you to use those APIs through familiar Python paradigms. However, you can always use the REST API directly from Python code, if desired.

- You can find the source code for the Azure libraries on [https://github.com/Azure/azure-sdk-for-python](https://github.com/Azure/azure-sdk-for-python). As an open-source project, contributions are welcome!

- Although you can use the libraries with interpreters such as IronPython and Jython that we don't test against, you may encounter isolated issues and incompatibilities.

- The source repo for the library API reference documentation resides on [https://github.com/MicrosoftDocs/azure-docs-sdk-python/](https://github.com/MicrosoftDocs/azure-docs-sdk-python/).

- Starting in 2019, we updated Azure Python libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries. The updated libraries adhere to [current Azure SDK guidelines](https://azure.github.io/azure-sdk/general_introduction.html).

  - On 31 March 2023, we retired support for Azure SDK libraries that don't conform to current Azure SDK guidelines. While older libraries can still be used beyond 31 March 2023, they'll no longer receive official support and updates from Microsoft. For more information, see the notice [Update your Azure SDK libraries](https://azure.microsoft.com/updates/support-for-azure-sdk-libraries-that-do-not-conform-to-our-current-azure-sdk-guidelines-will-be-retired-as-of-31-march-2023/).

  - To avoid missing security and performance updates to the Azure SDKs, upgrade to the [latest Azure SDK libraries](https://azure.github.io/azure-sdk/) by 31 March 2023.

  - To check which Python libraries are impacted, see [Azure SDK Deprecated Releases for Python](https://azure.github.io/azure-sdk/releases/deprecated/index.html#python).

- For details on the guidelines we apply to the libraries, see the [Python Guidelines: Introduction](https://azure.github.io/azure-sdk/python_design.html#introduction).

## Create and manage Azure resources with management libraries

The SDK's *management* (or "management plane") libraries, the names of which all begin with `azure-mgmt-`, help you create, configure, and otherwise manage Azure resources from Python scripts. All Azure services have corresponding management libraries. For more information, see [Azure control plane and data plane](/azure/azure-resource-manager/management/control-plane-and-data-plane).

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that you can through the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/install-azure-cli). (As noted earlier, the Azure CLI is written in Python and uses the management libraries to implement its various commands.)

The following examples illustrate how to use some of the primary management libraries:

- [Create a resource group](./examples/azure-sdk-example-resource-group.md)
- [List resource groups in a subscription](./examples/azure-sdk-example-list-resource-groups.md)
- [Create an Azure Storage account and a Blob storage container](./examples/azure-sdk-example-storage.md)
- [Create and deploy a web app to App Service](./examples/azure-sdk-example-web-app.md)
- [Create and query an Azure MySQL database](./examples/azure-sdk-example-database.md)
- [Create a virtual machine](./examples/azure-sdk-example-virtual-machines.md)

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find more code snippets in the [reference documentation](/python/api) and the [Azure Samples](/samples/browse/?languages=python&term=Getting%20started%20-%20Managing).

### Migrating from older management libraries

If you're migrating code from older versions of the management libraries, see the following details:

- If you use the `ServicePrincipalCredentials` class, see [Authenticate with token credentials](./authentication-azure-hosted-apps.md).
- The names of async APIs have changed as described on [Library usage patterns - asynchronous operations](azure-sdk-library-usage-patterns.md#asynchronous-operations). The names of async APIs in newer libraries start with `begin_`. In most cases, the API signature remains the same.

## Connect to and use Azure resources with client libraries

The SDK's *client* (or "data plane") libraries help you write Python application code to interact with already-provisioned services. Client libraries exist only for those services that support a client API.

The article, [Example: Use Azure Storage](./examples/azure-sdk-example-storage-use.md), provides a basic illustration of using client library.

Different Azure services also provide examples using these libraries. See the following index pages for other links:

- [App hosting](../quickstarts-app-hosting.md)
- [Cognitive Services](../quickstarts-cognitive-services.md)
- [Data solutions](../quickstarts-data-solutions.md)
- [Identity and security](../quickstarts-identity-security.md)
- [Machine learning](../quickstarts-machine-learning.md)
- [Messaging and IoT](../quickstarts-messaging-iot.md)
- [Other services](../quickstarts-other-services.md)

For details on working with each client library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK's GitHub repository](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk). You can also find more code snippets in the [reference documentation](/python/api) and the [Azure Samples](/samples/browse/?languages=python&products=azure).

## Get help and connect with the SDK team

- Visit the [Azure libraries for Python documentation](https://aka.ms/python-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-python)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-python/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

## Next step

We strongly recommend doing a one-time setup of your local development environment so that you can easily use any of the Azure libraries for Python.

> [!div class="nextstepaction"]
> [Set up your local dev environment >>>](../configure-local-development-environment.md)
