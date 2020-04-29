---
title: Cloud Development on Azure 
description: An overview of developing cloud applications on Microsoft Azure, including an overview of the cloud development cycle.
ms.date: 04/29/2020
ms.topic: conceptual
---

# Cloud development on Azure

You're a Python developer, and you're ready to developer cloud applications for Microsoft Azure. To prepare yourself for a long and productive career, let's spend a few minutes orienting you to the basic landscape of cloud development on Azure.

## What is Azure? Data centers, services, and resources

Microsoft's CEO, Satya Nadella, often refers to Azure as "the world's computer." A computer, as you well know, is a collection of hardware that's managed by an operating system, which provide a platform upon which you can build software that helps people apply the system's computing power to any number of tasks. (That's why we use the word "application" to describe such software.)

In the case of Azure, the computer's hardware is not a single machine but an enormous pool of virtualized server computers contained in [dozens of massive data centers around the world](https://azure.microsoft.com/global-infrastructure/regions/). The Azure "operating system" is then composed of *services* that dynamically allocate and de-allocate different parts of that resource pool as applications need them. Each allocation&mdash;be it computing power (CPU cores and memory), storage, databases, networks, and so on&mdash;is called a *resource*. And each discrete resource is accordingly assigned a unique *object identifier* (a GUID) and a unique URL.

Resources are the building blocks of a cloud application. The cloud development process thus begins with creating the appropriate environment into which you can deploy the different parts of the application. Put simply, you cannot deploy any code or data to Azure until you've allocated and configured&mdash;that is *provisioned*&mdash;a suitable target resource, such as a virtual machine, a database, a storage account, a container registry, a container orchestrator, a web host, a virtual network, AI and analytics engines, and so on.

The process of creating the environment for your application, then, involves identifying the relevant services and resource types involved, and then provisioning those resources (at which point you begin renting them from Azure). Indeed, there are hundreds of different types of resources at your disposal, from basic "infrastructure" resources like virtual machines, where you retain full control and responsibility for the software you deploy, to higher-level "platform" services that provide a more managed environment where you concern yourself with only data and application code.

Finding the right services for your application, and balancing their relative costs, can be challenging, but is also part of the creative fun of cloud development. Other articles on this developer center help you understand your choices. In the meantime, let's discuss how you actually work with all of these services and resources.

> [!TIP]
> A "hybrid cloud" refers to the combination of private computers and data centers with cloud resources like Azure, and has its own considerations beyond what's covered in the previous discussion. Furthermore, this discussion assumes new application development; scenarios that involve rearchitecting and migrating existing on-premises applications are not covered here.

## Creating, accessing, and managing resources

As described in the previous section, an essential part of developing a cloud application is provisioning the necessary resources within Azure to which you can then deploy your code and data. But how is this provisioning done, exactly? How do you ask Azure to allocate resources for your application, and how do you then configure and otherwise access those resources? In short, how do you talk to Azure itself to get all these resources in place?

The answer is straightforward. As with most operating systems, you can communicate with Azure through three routes: a user interface, a command-line interface, and an API.

| Provisioning method | Description | Pros | Cons |
| --- | --- | --- | --- |
| [Azure portal](https://portal.azure.com) | Azure's fully customizable, browser-based user interface through which you can provision and manage resources with all Azure services. To access the portal, you must first sign in using a Microsoft Account and then create a free Azure account with a subscription. (Once signed in, you can select the **?** icon and select **Launch guided tour** for a simple walkthrough of the main portal features.) | The user interface makes it easy to explore services and all their the various configuration options. Setting configuration values is secure because no information is stored on the local workstation. | Working with the portal is a manual process and cannot be automated. To remember what you did to change a configuration, for example, means recording your steps in a separate document. |
| [Azure CLI](/cli/azure/?view=azure-cli-latest) | Azure's [open source](https://github.com/Azure/azure-cli) command-line interface. Once you're signed in to the CLI (using the `az login` command), you can perform the same tasks that you can through the portal. (You can also use [Azure PowerShell](/powershell/) for this same purpose, although the Azure CLI is better for Python developers.) | Easily automated through scripts and processing of output. Provides higher-level commands that provision multiple resources together for common tasks, such as deploying a web app. | Steeper learning curve than using the portal, and commands are subject to bugs. Error messages are not always helpful. |
| [Azure REST API](/rest/api/?view=Azure)<br/>[Azure SDK](https://azure.microsoft.com/downloads/) | Azure's programmatic interface, provided via secure REST over HTTP because Azure's data centers are all inherently connected to the Internet. Every resource, furthermore, is assigned a unique URL that supports a resource-specific API, subject to stringent authentication protocols and access policies. (The Azure portal and the Azure CLI, in fact, ultimately do their work through the REST API.) <br/> For developers, the *Azure SDK* provides language-specific libraries that translate the capabilities of the REST API into much more convenient programming paradigms such as classes and objects.| Precise control over all operations, including a much more direct means of using output from one operation as input to another. For Python developers, allows working within familiar language paradigms rather than using the CLI. Can also be used from application code to automate management scenarios. | Operations that can be done with one CLI command typically require multiple lines of code, all of which is subject to bugs. Does not provide higher-level operations like the Azure CLI. |

You can use any or all of these complementary methods to create, configure, and manage whatever Azure resources you need. In fact, you typically use all three in the course of a development project, and it's worth your time to become familiar with each of them.

Within this developer center, we primarily show use of the CLI and Python code that uses the Azure SDK because use of the portal is well covered in the documentation for each individual service.

> [!TIP]
> Many Azure services allow you to configure scaling characteristics to meet variable demand, in which case Azure can automatically provision additional resources when needed and de-allocate them as appropriate. Such automatic scaling is one of the key advantages of a cloud platform that's backed by the resources of multiple data centers. Instead of designing your environment for peak demand, paying for capacity you wouldn't typically be utilizing, you can design the environment for baseline or average usage and pay for additional capabity only when necessary.

### Subscriptions, resource groups, and regions

Within Azure's resource model, you can imagine that, over time, you'll be provisioning many different resources across many Azure services for different applications. There are three levels of hierarchy that you can use to organize these resources:

1. *Subscriptions*: each Azure subscription has its own billing account and oftentimes represents a distinct team or departmental within an organization. In general, you provision all the resources you need for any given application within the same subscription so they can benefit from features like shared authentication. However, because all resources can be accessed through public URLs and the necessary authorization tokens, it's certainly possible to spread resources across multiple subscriptions.

1. *Resource groups*: resource groups are containers for other resources, which you can then manage *as* a group. Whenever you provision a resource, in fact, you must specify the group to which is belongs. Your first step with a new project is usually to create an appropriate resource group.

1. *Resource naming*: within a resource group, you can then use whatever naming strategies you like to express commonalities or relationships between resources. Because the name is often used in the resource's URL, there may be limitations on the characters you can use. (Some names, for example, allow only letters and numbers, whereas others allow hyphens and underscores.)

A key characteristic of a resource group is that it's always associated with a specific Azure *region*, which is the location of the specific data center. All the resources in the same group are be co-located in that data center, and can thus interact much more efficiently than if they were in different regions. Developers often choose regions that are closest to their customers, thus optimizing an application's responsiveness. Azure also offers geo-replication features to synchronize copies of your application and databases across multiple regions so you can better serve a global customer base.

> [!TIP]
> Due to local laws and regulations, which are determined by the *geography* in which you create a subscription, you might have access to only certain regions and those regions may not support all Azure services. For details, see [Azure global infrastructure](https://azure.microsoft.com/global-infrastructure/).

## The Azure development flow: provision, code, test, deploy, and manage

Now that you understand Azure's model of services and resources, you can understand the overall flow of developing cloud applications with Azure: provision, code, test, deploy, and manage.

### Step 1: Provision and configure resources

As described earlier in this article, the first step in developing any application is to provision and configure the resources that make up the target environment for your application.

Provisioning begins by creating a resource group in a suitable Azure region. You can create a resource group through the Azure portal, through the Azure CLI, or with a custom script that uses the Azure SDK (or REST API).

Within that resource group, you then provision and configure the individual resources you need, again using the portal, the CLI, or the Azure SDK. Configuration includes setting access policies that control what identities (service principals and/or application IDs) are able to access those resources.

For most development scenarios, you'll likely create provisioning scripts with the Azure CLI and/or Python code using the Azure SDK. Such scripts describe the totality of your application's resource needs, and enable you to easily recreate those resources within different development, test, and production environments. Such scripts aso make it easy to provision an environment in a different region, or to use different resource groups. You can also maintain these scripts in source control repositories so that you have full auditing and change history.

### Step 2: Write your app code to use resources

Once you've provisioned the resources you need for your application, you can write the application code to works with those resources. For example, in the provisioning step you might have created an Azure storage account, created a blob container within that account, and set access policies for the application on that container. From your code, now, you can authenticate with that storage account and then create, update, or delete blobs within that container. Similarly, you might have provisioned a database with a schema and appropriate permissions, so that your application code can connect to the database and perform the usual create-read-update-delete operations.

As a Python developer, you'll probably be writing your application code in Python using the Azure SDK for Python. That said, any independent part of a cloud application can be written in any supported language. If you're working in a team with a variety of language expertise, for instance, it's entirely possible that some parts of the application are written in Python, some in JavaScript, some in Java, and others in C#.

Note that application code can use the Azure SDK to perform provisioning and management operations, if needed. Provisioning scripts, similarly, can use the SDK to initialize resources with specific data, or perform housekeeping tasks on cloud resources even when those scripts are run locally.

### Step 3: Test and debug your app code locally

Developers typically like to test code on their local workstations before trying to deploy it to the cloud. By running the code locally, you can take full advantage of debugging features offered by tools such as Visual Studio Code and manage your code in a source control repository.

Azure fully supports local development and debugging using the same code you eventually deploy to the cloud. Environment variables are the key: on the cloud, Azure exposes a resource's settings through environment variables. By creating those same environment variables locally, you can run the same code that you deploy to the cloud without any modifications. This pattern works for authentication credentials, resource URLs, connection strings, and any number of other settings, making it easy to use resources in a development environment when running code locally and production resources once the code is deployed to the cloud.

### Step 4: Deploy your app code to Azure

Once you've tested your code locally, you're ready to deploy the code to whatever Azure service you're provisioned to host it. For example, if you're writing a Django web application, you either deploy that code to a virtual machine (where you provide your own web server) or to Azure App Service (which provides the web server for you). Once deployed, that code is running on the server rather than on your local machine, and can access all the Azure resources for which it's authorized.

As noted in the previous section, in typical development processes you first deploy your code to the resources you've provisioned in a development environment. After a round of testing, you deploy your code to resources in a staging environment, making the application available to your test team and perhaps preview customers. Once you're satisfied with the application's performance, you can deploy the code to your production environment. All of these deployments can also be automated through continuous integration and continuous deployment using Azure DevOps.

However you do it, once the code is deployed to the cloud, it truly becomes a cloud application, running entirely on the server computers in Azure's data centers.

### Step 5: Manage, monitor, and revise

After deployment, you want to make sure the application is performing as it should, responding to customer requests and using resources efficiently (and at the lowest cost). You can manage how Azure automatically scales your deployment as needed, and you can collect and monitor performance data through the Azure portal, the Azure CLI, or custom scripts written with the Azure SDK. You can then make real-time adjustments to your provisioned resources to optimize performance, again using any of the same tools.

Monitoring gives you insight about how you might restructure your cloud application. For example, you may find that certain portions of a web app (such as a group of API endpoints) are used only occasionally in comparison to the primary parts. You could then choose to deploy those APIs separately as serverless Azure Functions, where they have their own backing compute resources that don't compete with the main application but cost only pennies per month. Your main application then becomes more responsive to more customers without having to scale up to a higher-cost tier.

## Next steps

You're now familiar with the basic structure of Azure and the overall development flow: provision resources, write and test code, deploy the code to Azure, and then monitor and manage those resources.

The next step is to get your workstation fully configured to work with that flow, after which you're ready to get rolling with the Azure SDK!

> [!div class="nextstepaction"]
> [Configfure your local dev environment >>>](configure-local-development-environment.md)
