---
title: Provisioning, accessing, and managing resources in Azure
description: An overview of ways you can work with Azure resources, including Azure portal, VS Code, Azure CLI, Azure PowerShell, and Azure SDKs.
ms.date: 11/28/2022
ms.topic: conceptual
ms.custom: devx-track-python, devx-track-azurecli, py-fresh-zinc, devx-track-azurepowershell
---

# Provisioning, accessing, and managing resources on Azure

[Previous article: overview](cloud-development-overview.md)

As described in the previous article of this series, an essential part of developing a cloud application is provisioning the necessary resources within Azure to which you can then deploy your code and data. That is, building a cloud application begins with creating and configuring Azure resources to which you deploy that code and data. To review the types of available resources, see the [Azure developer's guide](/azure/guides/developer/azure-developer-guide).

How do you provision resources, exactly? How do you ask Azure to allocate resources for your application, and how do you then configure and otherwise access those resources? In short, how do you talk to Azure itself to get all these resources in place?

## How to communicate with Azure

As with most operating systems, you can communicate with Azure through three routes:

* A user interface, including accessing the [Azure portal](https://portal.azure.com) in a browser, or with Visual Studio Code using [Azure Tools pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack).
* A command-line interface, including the [Azure CLI](/cli/azure/) and the [Azure PowerShell](/powershell/).
* An API including the [Azure REST API](/rest/api/?view=Azure&preserve-view=true) or an Azure SDK such as the [Azure SDK for Python](./sdk/azure-sdk-overview.md).

You can use any or all of these complementary methods to create, configure, and manage whatever Azure resources you need. In fact, you typically use all three in the course of a development project, and it's worth your time to become familiar with each of them.

## Azure portal

The [Azure portal](https://portal.azure.com) is Azure's fully customizable, browser-based user interface through which you can provision and manage resources with all Azure services. To access the portal, you must first sign in using a Microsoft Account, and then create a free Azure account with a subscription.

**Pros**: The user interface makes it easy to explore services and all their various configuration options. Setting configuration values is secure because no information is stored on the local workstation.

**Cons**: Working with the portal is a manual process and can't be easily automated. To remember what you did to change a configuration, for example, you generally record your steps in a separate document.

## Visual Studio Code

You can use any editor or IDE to write Python code when developing for Azure. However, [Visual Studio Code](https://code.visualstudio.com/) provides extensions and customizations for Azure and Python that make your development cycle and the deployment from a local environment to Azure easier.

**Pros**: Azure extensions make it easy to discover and interact with the cloud services, in particular when you're first starting out with Azure.

**Cons**: An extension for an Azure service may not support all configuration options of that service. Automating extensions with scripting requires other tools or extensions.

## Azure CLI

The [Azure CLI](/cli/azure/) is Azure's [open source](https://github.com/Azure/azure-cli) command-line interface. Once you're signed in to the Azure CLI (using the `az login` command), you can perform the same tasks that you can through the portal.
  
**Pros**: Easily automated through scripts and processing of output. Provides higher-level commands that provision multiple resources together for common tasks, such as deploying a web app. Scripts can be managed in source control.

**Cons**: Steeper learning curve than using the portal, and commands are subject to bugs. Error messages aren't always helpful.

You can also use the [Azure PowerShell](/powershell/) module in place of the Azure CLI, although the Azure CLI's Linux-style commands are typically more familiar to Python developers.

In place of the local CLI or PowerShell, you can use the same commands in the Azure Cloud Shell, [https://shell.azure.com/](https://shell.azure.com/). The Cloud Shell is convenient because it's automatically authenticated with Azure once it opens and has the same capabilities you would through the Azure portal. The Cloud Shell also comes pre-configured with many [different tools](/azure/cloud-shell/features) that would be inconvenient to install locally, especially if you need to run only one or two commands.

Because Cloud Shell isn't a local environment, it's more suitable for singular operations like you'd do through the portal rather than scripted automation. Nevertheless, you can clone source repositories (for example, GitHub repositories) in the Cloud Shell. As a result, you can develop automation scripts locally, store them in a repository, clone the repository in Cloud Shell, and then run them there.

> [!NOTE]
> The Cloud Shell is backed by an Azure Storage account in a resource group called *cloud-shell-storage-\<your-region>*. That storage account contains an image of the Cloud Shell's file system, which stores the cloned repository. There's a small cost for this storage. You can delete the storage account when done with Cloud Shell if you won't be using it again.

## Azure REST API and Azure SDKs

The [Azure REST API](/rest/api/) is Azure's programmatic interface, provided via secure REST over HTTP because Azure's datacenters are all inherently connected to the Internet. Every resource is assigned a unique URL that supports a resource-specific API, subject to stringent authentication protocols and access policies. (The Azure portal and the Azure CLI, in fact, ultimately do their work through the REST API.)

For developers, the Azure SDKs provide language-specific libraries that translate the capabilities of the REST API into much more convenient programming paradigms such as classes and objects. For Python, you always install individual libraries with `pip install` rather than installing a standalone SDK as a whole. (For other languages, see [Azure SDK downloads](https://azure.microsoft.com/downloads/).)

**Pros**: Precise control over all operations, including a much more direct means of using output from one operation as input to another as compared to the Azure CLI. For Python developers, allows working within familiar language paradigms rather than using the CLI. Can also be used from application code to automate detailed management scenarios.
  
**Cons**: Operations that can be done with one CLI command typically require multiple lines of code, all of which is subject to bugs. Doesn't provide higher-level operations like the Azure CLI.

## Automatic on-demand provisioning

Many Azure services allow you to configure scaling characteristics to meet variable demand, in which case Azure can automatically provision extra resources when needed and de-allocate them as appropriate. Such automatic scaling is one of the key advantages of a cloud platform that's backed by the resources of multiple datacenters. Instead of designing your environment for peak demand, paying for capacity you wouldn't typically be utilizing, you can design the environment for baseline or average usage and pay for extra capability only when necessary.

For more information, see [Autoscaling](/azure/architecture/best-practices/auto-scaling) in the Azure Architecture Center.

## Subscriptions, resource groups, and regions

Within Azure's resource model, you can imagine that, over time, you'll be provisioning many different resources across many Azure services for different applications. There are three levels of hierarchy that you can use to organize these resources:

1. **Subscriptions**: each Azure subscription has its own billing account and often represents a distinct team or department within an organization. In general, you provision all the resources you need for any given application within the same subscription so they can benefit from features like shared authentication. However, because all resources can be accessed through public URLs and the necessary authorization tokens, it's possible to spread resources across multiple subscriptions.

1. **Resource groups**: within a subscription, resource groups are containers for other resources, which you can then manage as a group. (For this reason, a resource group typically relates to a specific project.) Whenever you provision a resource, in fact, you must specify the group to which it belongs. Your first step with a new project is usually to create an appropriate resource group. And by deleting the resource group you de-allocate all of its contained resources rather than having to delete each resource individually. Trust us when we say that neglecting to organize your resource groups can lead to many headaches later on when you don't remember which resource belongs to which project!

1. **Resource naming**: within a resource group, you can then use whatever naming strategies you like to express commonalities or relationships between resources. Because the name is often used in the resource's URL, there may be limitations on the characters you can use. (Some names, for example, allow only letters and numbers, whereas others allow hyphens and underscores.)

As you work with Azure, you'll develop your own preferences for organizing your resources and your own conventions for naming subscriptions, resource groups, and individual resources.

### Regions and geographies

A key characteristic of a resource group is that it's always associated with a specific Azure *region*, which is the location of the specific datacenter. All the resources in the same group are co-located in that datacenter, and can thus interact much more efficiently than if they were in different regions. Developers often choose regions that are closest to their customers, thus optimizing an application's responsiveness. Azure also offers geo-replication features to synchronize copies of your application and databases across multiple regions so you can better serve a global customer base.

Due to local laws and regulations, which are determined by the *geography* in which you create a subscription, you might have access to only certain regions and those regions may not support all Azure services. For details, see [Azure global infrastructure](https://azure.microsoft.com/global-infrastructure/).

## Next step

> [!div class="nextstepaction"]
> [The Azure development flow >>>](cloud-development-flow.md)
