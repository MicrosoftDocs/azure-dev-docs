---
title: Important considerations when designing your Azure solution
description: Understand the factors that affect your overall strategy for designing an Azure solution.
keywords: azure account, azure subscription, billing, region, resource groups
ms.service: azure
ms.topic: overview
ms.date: 07/29/2024
ms.custom: overview
---

# Key concepts for building Azure apps
This is part six in a series of 7 articles to help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: **Key concepts for building Azure apps**
* Part 7: [How am I billed?](azure-developer-billing.md)

Before you get too far in designing your application to run on Azure, chances are you'll need to do a little planning ahead of time.  As you get started, there are some basic Azure concepts that you need to understand to make the best decisions for your scenario.  Considerations include:

## Azure regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to, including across multiple regions to deliver cross-region resiliency when necessary.

Typically, you want all of the resources for a solution to be in the same region to minimize latency between different components of your application.  This means if your solution consists of an Azure App Service, a database, and Azure Blob storage, all of these resources should be created in the same Azure region.

Not every Azure service is available in every region.  The [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all) page can help you find a region where the Azure services needed by your app are available.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50C5F]


## Azure resource group

A Resource Group in Azure is a logical container to group Azure Resources together.  Every Azure resource must belong to one and only one resource group.

Resource groups are most often used to group together all of the Azure resources needed for a solution in Azure.  For example, say you've a web application deployed to Azure App Service that uses a SQL database, Azure Storage, and also Azure Key Vault.  It's common practice to put all of the Azure resources needed for this solution into a single resource group.  

:::image type="content" source="media/resource-group-example.png" alt-text="A diagram showing a sample resource group containing an App Service, SQL database, Blob storage, and a Key Vault.":::

This makes it easier to tell what resources are needed for the application to run and what resources are related to each other.  As such, the first step in creating resources for an app in Azure is usually creating the resource group that will serve as a container for the app's resources.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50C5E]


## Environments

If you've developed on-premises, you are familiar with promoting your code through dev, test, and production environments. In Azure, to create separate environments you would create a separate set of Azure resources for each environment you need.  

:::image type="content" source="media/test-environments-example-800px.png" alt-text="A diagram showing DEV, TEST, and PROD environments with a separate set of Azure resources in each environment." lightbox="media/test-environments-example.png":::

Since it's important that each environment be an exact copy, it's recommended to either [script the creation of resources](./azure-developer-create-resources.md#command-line-tools) needed for an environment or use [Infrastructure as Code (IaC) tools](./azure-developer-create-resources.md#infrastructure-as-code-tools) to declaratively specify the configuration of each environment.  This makes sure that the environment creation process is repeatable and also give you the ability to spin up new environments on demand, for example for performance or security testing of your application.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50C5M]


## DevOps Support

Whether it's publishing your apps to Azure with continuous integration or provisioning resources for a new environment, Azure integrates with most of the popular DevOps tools. You can work with the tools that you already have and maximize your existing experience with support for tools like:

- [GitHub Actions](../github/github-actions.md)
- [Azure DevOps](/azure/devops/)
- [Octopus Deploy](https://octopus.com/docs/infrastructure/deployment-targets/azure)
- [Jenkins](../jenkins/index.yml)
- [Terraform](/azure/developer/terraform/)
- [Ansible](../ansible/index.yml)
- [Chef](https://docs.chef.io/azure_portal)


> [!div class="nextstepaction"]
> [Continue to part 7: How am I billed?](azure-developer-billing.md)
