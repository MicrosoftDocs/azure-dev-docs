---
title: Important considerations when designing your Azure solution
description: Understand the factors that affect your overall strategy for designing an Azure solution.
keywords: azure account, azure subscription, billing, region, resource groups
ms.service: azure
ms.topic: overview
ms.date: 09/29/2025
ms.custom: overview
---

# Key concepts for building Azure apps
This article is part six in a series of seven articles that help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: **Key concepts for building Azure apps**
* Part 7: [How am I billed?](azure-developer-billing.md)

Before designing your application to run on Azure, you need to plan ahead. As you start, you need to understand some basic Azure concepts to make the best decisions for your scenario. Consider the information in the following sections when planning.

## Azure regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected by a dedicated regional low-latency network. Azure lets you deploy applications where you need them, including across multiple regions to deliver cross-region resiliency when needed.

Typically, you want to keep all resources for a solution in the same region to minimize latency between components of your application. For example, if your solution includes Azure App Service, a database, and Azure Blob Storage, create all these resources in the same Azure region.

Not every Azure service is available in every region. The [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all) page helps you find a region where the Azure services your app needs are available.


> [!VIDEO a46cc039-9c20-411c-9829-a92dd96c1bf1]


## Azure resource group

A resource group in Azure is a logical container that groups Azure resources together. Every Azure resource belongs to one resource group.

Resource groups often group all the Azure resources needed for a solution in Azure. For example, if you have a web application deployed to Azure App Service that uses a SQL database, Azure Storage, and Azure Key Vault, it's common to place all these resources in a single resource group.

:::image type="content" source="media/resource-group-example.png" alt-text="A diagram showing a sample resource group containing an App Service, SQL database, Blob storage, and a Key Vault.":::

This approach makes it easier to identify the resources needed for the application to run and how they're related. Typically, the first step in creating resources for an app in Azure is creating the resource group that serves as a container for the app's resources.


> [!VIDEO ec777d71-6067-4f03-bf19-8dd5189125c6]


## Environments

If you've developed on-premises, you're familiar with promoting your code through dev, test, and production environments. In Azure, to create separate environments you would create a separate set of Azure resources for each environment you need.

:::image type="content" source="media/test-environments-example-800px.png" alt-text="A diagram showing DEV, TEST, and PROD environments with a separate set of Azure resources in each environment." lightbox="media/test-environments-example.png":::

Because it's important that each environment is an exact copy, use [scripting to create resources](./azure-developer-create-resources.md#command-line-tools) needed for an environment or use [infrastructure as code (IaC) tools](./azure-developer-create-resources.md#infrastructure-as-code-tools) to declaratively specify the configuration of each environment. This ensures that the environment creation process is repeatable and also lets you create new environments on demand, such as for performance or security testing of your application.


> [!VIDEO 11847e6e-3424-4284-ba49-f7358fc8c8c9]


## DevOps Support

Whether you're publishing apps to Azure with continuous integration or provisioning resources for a new environment, Azure integrates with popular DevOps tools. You can work with your existing tools and maximize your experience with support for tools like:

- [GitHub Actions](../github/github-actions.md)
- [Azure DevOps](/azure/devops/)
- [Octopus Deploy](https://octopus.com/docs/infrastructure/deployment-targets/azure)
- [Jenkins](../jenkins/index.yml)
- [Terraform](../terraform/index.yml)
- [Ansible](../ansible/index.yml)
- [Chef](https://docs.chef.io/azure_chef_cli/)


> [!div class="nextstepaction"]
> [Continue to part 7: How am I billed?](azure-developer-billing.md)
