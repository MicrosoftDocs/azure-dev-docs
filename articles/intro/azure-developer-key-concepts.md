---
title: Important considerations when designing your Azure solution
description: Understand the factors that affect your overall strategy for designing an Azure solution.
keywords: azure account, azure subscription, billing, region, resource groups
ms.prod: azure
ms.topic: overview
ms.date: 02/01/2022
ms.custom: overview
---

# Important considerations when designing your Azure solution

Before you get too far in designing your application to run on Azure, chances are you'll need to do a little planning ahead of time.  As you get started, there are some basic Azure concepts that you need to understand to make the best decisions for your scenario.  Considerations include:

## Azure regions

A region is a set of datacenters deployed within a latency-defined perimeter and connected through a dedicated regional low-latency network. Azure gives you the flexibility to deploy applications where you need to, including across multiple regions to deliver cross-region resiliency.

Typically, you want all of the resources for a solution to be in the same region to minimize latency between different components of your application.  This means if your solution consists of an Azure App Service, a database, and Azure Storage, all of these resources should be created in the same Azure region.

Not every Azure service is available in every region.  The [Products available by region](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=all) page can help you find a region where the Azure services needed by your app are available.

## Azure resource group

A Resource Group in Azure is a logical container to group Azure Resources together.  Ever Azure resource must belong to one and only one resource group.

Resource groups are most often used to group together all of the Azure resources needed for a solution in Azure.  For example, say you have a web application deployed to Azure App Service that uses a SQL database, Azure Storage, and also Azure Key Vault.  It is common practice to put all of the Azure resources needed for this solution in a resource group.  This makes it easier to tell what resources are needed for the application to run and what resources are related to each other.  As such, the first step in creating resources for an app in Azure is usually creating the resource group that wil serve as a container for the app's resources.

Diagram!

## Environments

If you have developed on-premises, you are familiar with promoting your code through dev, test, and production environments. 


## DevOps Support


