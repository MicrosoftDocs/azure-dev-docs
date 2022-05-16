---
title: Use the Azure libraries (SDK) for JavaScript
description: Overview of the features and capabilities of the Azure libraries for JavaScript that helps developers be more productive when provisioning, using, and managing Azure resources.
ms.date: 05/16/2022
ms.topic: conceptual
ms.custom: devx-track-js
---

# Use the Azure libraries (SDK) for JavaScript

The open-source Azure libraries for JavaScript simplify provisioning, managing, and using Azure resources from JavaScript application code.

## The details you really want to know

- The Azure libraries are how you communicate with Azure services *from* JavaScript code that you run either locally or in the cloud. (Whether you can run JavaScript code within the scope of a particular service depends on whether that service itself currently supports JavaScript.)

- The libraries support JavaScript 3.6 or later, and it is also tested with PyPy 5.4+.

- The Azure SDK for JavaScript is composed solely of over 180 individual JavaScript libraries that relate to specific Azure services. There are no other tools in the "SDK".

- When running code locally, authenticating with Azure relies on environment variables as described in [How to authenticate JavaScript apps to Azure services using the Azure SDK for JavaScript](./authentication-overview.md#authentication-during-local-development).

- To install library packages with pip, use `pip install <library_name>` using library names from the [package index](azure-sdk-library-package-index.md). To install library packages in conda environments, use `conda install <package_name>` using names from the [Microsoft channel on anaconda.org](https://anaconda.org/microsoft/repo). For more information, see [Install Azure libraries](azure-sdk-install.md).

- There are distinct **management** and **client** libraries (sometimes referred to as "management plane" and "data plane" libraries). Each set serves different purposes and is used by different kinds of code. For more information, see the following sections later in this article:
  - [Provision and manage Azure resources with management libraries](#provision-and-manage-azure-resources-with-management-libraries)
  - [Connect to and use Azure resources with client libraries](#connect-to-and-use-azure-resources-with-client-libraries)

- Documentation for the libraries is found on the [Azure for JavaScript Reference](/javaScript/api/overview/azure/), which is organized by Azure Service, or the [JavaScript API browser](/javaScript/api/), which is organized by package name. 

- To try the libraries for yourself, we first recommend [setting up your local dev environment](../configure-local-development-environment.md). Then you can try any of the following standalone examples (in any order): [Example: Provision a resource group](./examples/azure-sdk-example-resource-group.md), [Example: Provision and use Azure Storage](./examples/azure-sdk-example-storage.md), [Example: Provision a web app and deploy code](./examples/azure-sdk-example-web-app.md), [Example: Provision and use a MySQL database](./examples/azure-sdk-example-database.md), and [Example: Provision a virtual machine](./examples/azure-sdk-example-virtual-machines.md).

- For demonstration videos, see <a href="https://www.youtube.com/watch?v=4xoJLCFP4_4" target="_blank">Introducing the Azure SDK for JavaScript</a> (PyCon 2021) and <a href="https://www.youtube.com/watch?v=M1pVxItg2Mg&feature=youtu.be&ocid=AID3006292" target="_blank">Using Azure SDKs to interact with Azure resource</a> (PyCon 2020).

### Non-essential but still interesting details

- Because the Azure CLI is written in JavaScript using the management libraries, anything you can do with Azure CLI commands you can also do from a JavaScript script. That said, the CLI commands provide many helpful features such as performing multiple tasks together, automatically handling asynchronous operations, formatting output like connection strings, and so on. Consequently, using the CLI (or its equivalent, Azure PowerShell) for automated provisioning and management scripts can be significantly more convenient than writing the equivalent JavaScript code, unless you want to have a much more exacting degree of control over the process.

- The Azure libraries for JavaScript build on top of the underlying Azure REST API, allowing you to use those APIs through familiar JavaScript paradigms. However, you can always use the REST API directly from JavaScript code, if desired.

- You can find the source code for the Azure libraries on [https://github.com/Azure/azure-sdk-for-javaScript](https://github.com/Azure/azure-sdk-for-javaScript). As an open-source project, contributions are welcome!

- Although you can use the libraries with interpreters such as IronJavaScript and Jython that we don't test against, you may encounter isolated issues and incompatibilities.

- The source repo for the library API reference documentation resides on [https://github.com/MicrosoftDocs/azure-docs-sdk-javaScript/](https://github.com/MicrosoftDocs/azure-docs-sdk-javaScript/).

- We're currently updating the Azure libraries for JavaScript libraries to share common cloud patterns such as authentication protocols, logging, tracing, transport protocols, buffered responses, and retries.

  - This shared functionality is contained in the [azure-core](https://github.com/Azure/azure-sdk-for-javaScript/tree/master/sdk/core/azure-core) library.

  - The libraries that currently work with the Core library are listed on [Azure SDK for JavaScript latest releases](azure-sdk-library-package-index.md#libraries-using-azurecore). These libraries, primarily the client libraries, are sometimes referred to as "track 2".

  - The management libraries and any other that aren't yet updated are sometimes referred to as "track 1".

- For details on the guidelines we apply to the libraries, see the [JavaScript Guidelines: Introduction](https://azure.github.io/azure-sdk/javaScript_design.html#introduction).

## Provision and manage Azure resources with management libraries

The SDK's *management* (or "management plane") libraries, the names of which all begin with `azure-mgmt-`, help you create, provision and otherwise manage Azure resources from JavaScript scripts. All Azure services have corresponding management libraries.

With the management libraries, you can write configuration and deployment scripts to perform the same tasks that you can through the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/install-azure-cli). (As noted earlier, the Azure CLI is written in JavaScript and uses the management libraries to implement its various commands.)

The following examples illustrate how to use some of the primary management libraries:

- [Provision a resource group](./examples/azure-sdk-example-resource-group.md)
- [List resource groups in a subscription](./examples/azure-sdk-example-list-resource-groups.md)
- [Provision Azure Storage](./examples/azure-sdk-example-storage.md)
- [Provision a web app and deploy code](./examples/azure-sdk-example-web-app.md)
- [Provision and query a database](./examples/azure-sdk-example-database.md)
- [Provision a virtual machine](./examples/azure-sdk-example-virtual-machines.md)

For details on working with each management library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK GitHub repository](https://github.com/Azure/azure-sdk-for-javaScript/tree/master/sdk). You can also find more code snippets in the [reference documentation](/javaScript/api) and the [Azure Samples](/samples/browse/?languages=javaScript&term=Getting%20started%20-%20Managing).

### Migrating from older management libraries

If you are migrating code from older versions of the management libraries, see the following details:

- If you use the `ServicePrincipalCredentials` class, see [Authenticate with token credentials](./authentication-azure-hosted-apps.md).
- The names of async APIs have changed as described on [Library usage patterns - asynchronous operations](azure-sdk-library-usage-patterns.md#asynchronous-operations). Simply said, the names of async APIs in newer libraries start with `begin_`. In most cases, the API signature remains the same.

## Connect to and use Azure resources with client libraries

The SDK's *client* (or "data plane") libraries help you write JavaScript application code to interact with already-provisioned services. Client libraries exist only for those services that support a client API.

The article, [Example: Use Azure Storage](./examples/azure-sdk-example-storage-use.md), provides a basic illustration of using client library.

Different Azure services also provide examples using these libraries. See the following index pages for other links:

- [App hosting](../quickstarts-app-hosting.md)
- [Cognitive Services](../quickstarts-cognitive-services.md)
- [Data solutions](../quickstarts-data-solutions.md)
- [Identity and security](../quickstarts-identity-security.md)
- [Machine learning](../quickstarts-machine-learning.md)
- [Messaging and IoT](../quickstarts-messaging-iot.md)
- [Other services](../quickstarts-other-services.md)

For details on working with each client library, see the *README.md* or *README.rst* file located in the library's project folder in the [SDK's GitHub repository](https://github.com/Azure/azure-sdk-for-javaScript/tree/master/sdk). You can also find more code snippets in the [reference documentation](/javaScript/api) and the [Azure Samples](/samples/browse/?languages=javaScript&products=azure).

## Get help and connect with the SDK team

- Visit the [Azure libraries for JavaScript documentation](https://aka.ms/javaScript-docs)
- Post questions to the community on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-sdk-javaScript)
- Open issues against the SDK on [GitHub](https://github.com/Azure/azure-sdk-for-javaScript/issues)
- Mention [@AzureSDK](https://twitter.com/AzureSdk/) on Twitter
- [Complete a short survey about the Azure SDK for JavaScript](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)

## Next step

We strongly recommend doing a one-time setup of your local development environment so that you can easily use any of the Azure libraries for JavaScript.

> [!div class="nextstepaction"]
> [Set up your local dev environment >>>](../configure-local-development-environment.md)
