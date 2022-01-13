---
title: How am I billed?
description: A developer focused overview of how billing works on Azure.
keywords: azure billing, azure portal
ms.topic: overview
ms.date: 01/07/2022
ms.custom: overview
---

# How am I billed?

When creating applications that use Azure, you should understand the factors that influence the cost of the solutions you create.  You will also want to understand how you can estimate the cost of a solution, how you are billed, and how you can monitor the costs incurred in your Azure subscriptions.

## What is an Azure Account?

To create or work with Azure, you must have an Azure account. You may have an Azure account through the organization you work for or the school you attend.  If you don't have an Azure account through an organization, you can create one using your Microsoft account.  

Your Azure account allows you to login to tools like the [Azure Portal](https://portal.azure.com/), [Azure CLI](/cli/azure/), and [Azure PowerShell](/powershell/azure) which are used to create, manage, and delete Azure resources.  The Azure portal also allows you to view billing information for your subscription(s).

## What is an Azure subscription?

A subscription is a logical grouping of Azure services that is linked to an Azure account. A single Azure account can contain multiple subscriptions.

Billing for Azure services is done on a per-subscription basis.  For example, an organization may choose to create one subscription for each department in the organization such that each department pays for their own Azure resources.  *When creating Azure resources, it is important to pay attention to what subscription you are creating the resources in because the owner of that subscription will pay for those resources.*  


If you have an individual Azure account tied to your Microsoft account, it is also possible to have multiple subscriptions.  For example, a user might have both a Visual Studio Enterprise subscription that provides monthly Azure credits and a Pay-as-you-go subscription which bills to their credit card.  In this scenario


## What factors influence the cost of a service on Azure?

Generally speaking, there are several factors that influence the costs of a given service.  Given the unique nature of each service, you should use the **Azure Pricing Calculator** to estimate how much a service will cost.

- **Compute processing power** - Most compute services are billed based on the speed and number of processor cores you will utilize.  A development server can use the lowest speeds and processors, while high load production data processing systems or high load servers will likely want the fastest processors with the maximum number of processing cores available.
- **Storage amount** - Most storage services are billed based on the amount of data you want to store.
- **Storage hardware** - Some storage services provide options on the type of hardware your data will be stored on.  Depending on the type of data you are storing, you may want a more long-term storage option with slower read and write speeds, or you may be willing to pay for low latency read and writes for highly transactional operations.
- **Bandwidth** - Most services bill ingress and egress separately.  Ingress is the amount of bandwidth required to handle incoming requests.  Egress is the amount of bandwidth required to handle outgoing data that satisfies those requests.
- **Per use** - Some services bill based on the number of times the service is used or a count of the number of requests that are handled or the number of some entity (such as Azure Active Directory user accounts) that have been configured.
- **Per service** - Some services simply charge a straight monthly fee.
- **Region** - Sometimes, services have different prices depending on the region (data center) where it's hosted.

![Conceptual video](https://via.placeholder.com/640x360?text=conceptual-video)

Learn more about the **Azure Pricing Calculator**:

- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)


## Where can I find our current spend in Azure?

The Azure portal provides an easy to navigate and visual presentation of all the services your organization utilized during a particular month.  You can view by service, by resource group, and so on.  

![Screenshot of Azure Portal displaying services utilized during a given month.](https://via.placeholder.com/600x400?text=Portal+Screenshot)

You can also access this information programmatically to create a customized and easily accessible view into your cloud spend for management via the Billing API.

Learn more about accessing billing data programmatically:

- [Azure Billing libraries for .NET](/dotnet/api/overview/azure/billing)
- [Azure Billing libraries for Python](/python/api/overview/azure/billing)
- [Azure Resource Manager Billing client library for Java - Version 1.0.0-beta.1](/java/api/overview/azure/resourcemanager-billing-readme)
- [All other programming languages - RESTful API](/rest/api/billing/)
- [Azure consumption API overview](/azure/cost-management-billing/manage/consumption-api-overview)


## What tools are available to monitor set up notifications about our cloud spend?

There are two critical services available to set up and manage your cloud costs.

The first is **cost alerts** which allows you to set spending thresholds and receive notifications as your bill nears those thresholds.  The following video shows you the basics of setting these up.

![Screencast video demo](https://via.placeholder.com/640x360?text=screencast-video-demo)

The second is **Azure Cost Management** which helps you plan for and control your costs, providing cost analysis, budgets, recommendations, and allows you to export cost management data for analysis in Excel or your own custom reporting.

![Screenshot of Cost Management screen in the Azure Portal](https://via.placeholder.com/600x400?text=azure+cost+management+Screenshot)

Learn more about cost alerts and **Azure Cost Management**:

- [Use cost alerts to monitor usage and spending](/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending)
- [What is Azure Cost Management + Billing?](/azure/cost-management-billing/cost-management-billing-overview)
- [How to optimize your cloud investment with Azure Cost Management](/azure/cost-management-billing/costs/cost-mgt-best-practices)