---
title: Cloud Development with Azure - What is Azure?
description: An overview of developing cloud applications on Microsoft Azure, starting with how data centers, services, and resources relate.
ms.date: 10/06/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Cloud development on Azure

You're a Python developer, and you're ready to develop cloud applications for Microsoft Azure. To help you prepare for a long and productive career, this series of three articles orients you to the basic landscape of cloud development on Azure.

## What is Azure? Data centers, services, and resources

Microsoft's CEO, Satya Nadella, often refers to Azure as "the world's computer." A computer, as you well know, is a collection of hardware that's managed by an operating system, which provides a platform upon which you can build software that helps people apply the system's computing power to any number of tasks. (That's why we use the word "application" to describe such software.)

In the case of Azure, the computer's hardware is not a single machine but an enormous pool of virtualized server computers contained in [dozens of massive data centers around the world](https://azure.microsoft.com/global-infrastructure/regions/). The Azure "operating system" is then composed of *services* that dynamically allocate and de-allocate different parts of that resource pool as applications need them. Those dynamic allocations allow applications to respond quickly to any number of changing conditions, such as customer demand.

Each allocation&mdash;be it computing power (CPU cores and memory), storage, databases, networks, and so on&mdash;is called a *resource*. And each discrete resource is accordingly assigned a unique *object identifier* (a GUID) and a unique URL.

![Layers of Azure, from the data center to Azure services to allocate resources](media/cloud-development/azure-layers.png)

Resources are the building blocks of a cloud application. The cloud development process thus begins with creating the appropriate environment into which you can deploy the different parts of the application. Put simply, you cannot deploy any code or data to Azure until you've allocated and configured&mdash;that is *provisioned*&mdash;a suitable target resource, such as a virtual machine, a database, a storage account, a container registry, a container orchestrator, a web host, a virtual network, AI and analytics engines, and so on.

The process of creating the environment for your application, then, involves identifying the relevant services and resource types involved, and then provisioning those resources (at which point you begin renting them from Azure). The provisioning process is essentially how you construct the computing system to which you deploy your application.

There are hundreds of different types of resources at your disposal, from basic "infrastructure" resources like virtual machines, where you retain full control and responsibility for the software you deploy, to higher-level "platform" services that provide a more managed environment where you concern yourself with only data and application code.

Finding the right services for your application, and balancing their relative costs, can be challenging, but is also part of the creative fun of cloud development. To understand the many choices, review the [Azure developer's guide](/azure/guides/developer/azure-developer-guide). Here, let's next discuss how you actually work with all of these services and resources.

> [!NOTE]
> You've probably seen and perhaps have grown weary of the terms "IaaS" (infrastructure-as-a-service), "PaaS" (platform-as-a-service), and so on. The "as-a-service" part reflects the reality that you generally don't have physical access to the data centers themselves. Instead, you use tools like the Azure portal, the Azure CLI, or Azure's REST API to provision "infrastructure" resources, "platform" resources, and so on. As a "service," Azure is always standing by waiting to receive your requests.
>
> On this developer center, we spare you the IaaS, PaaS, etc. jargon because "as-a-service" is just inherent to the cloud to begin with!

> [!NOTE]
> A "hybrid cloud" refers to the combination of private computers and data centers with cloud resources like Azure, and has its own considerations beyond what's covered in the previous discussion. Furthermore, this discussion assumes new application development; scenarios that involve rearchitecting and migrating existing on-premises applications are not covered here.

> [!NOTE]
> You might hear the terms *cloud native* and *cloud enabled* applications, which are often discussed as the same thing. There are differences, however. A cloud enabled application is often one that is migrated, as a whole, from an on-premises data center to cloud-based servers. Oftentimes, such applications retain their original structure and are simply deployed to virtual machines in the cloud (and therefore across geographic regions). Such a migration allows the application to scale to meet global demand without having to provision new hardware in your own data center. However, scaling must be done at the virtual machine (or infrastructure) level, even if only one part of the application needs increased performance.
>
> A cloud *native* application, on the other hand, is written from the outset to take advantage of the many different, independently scalable services available in a cloud such as Azure. Cloud native applications are more loosely structured (using micro-service architectures, for example), which allows you to more precisely configure deployment and scaling for each part. Such a structure simplifies maintenance and often dramatically reduces costs because you need pay for premium services only where necessary.
>
> For more information, see [Build cloud-native applications in Azure](https://azure.microsoft.com/overview/cloudnative/) and [Architecting Cloud Native .NET Applications for Azure](/dotnet/architecture/cloud-native/), the principles of which apply to applications written in any language.

## Next step

> [!div class="nextstepaction"]
> [Provisioning, accessing, and managing resources >>>](cloud-development-provisioning.md)
