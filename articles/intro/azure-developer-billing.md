---
title: How am I billed?
description: A developer focused overview of how billing works on Azure.
keywords: azure billing, azure portal
ms.service: azure
ms.topic: overview
ms.date: 07/29/2024
ms.custom: overview
---

# How am I billed?

This is part seven in a short series of 8 articles to help developers get started with Azure.

* Part 1: [Azure for developers overview](azure-developer-overview.md)
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: **How am I billed?**
* Part 8: [Versioning policy for Azure services, SDKs, and CLI tools](azure-service-sdk-tool-versioning.md)

When creating applications that use Azure, you need to understand the factors that influence the cost of the solutions you create.  You will also want to understand how you can estimate the cost of a solution, how you're billed, and how you can monitor the costs incurred in your Azure subscriptions.

## What is an Azure Account?

Your Azure account is what allows you to sign in to Azure.  You may have an Azure account through the organization you work for or the school you attend.  You may also create an individual Azure account for personal use linked to your Microsoft account.  If you're looking to learn about and experiment with Azure, you can [create an Azure account for free](https://azure.microsoft.com/free/).

> [!div class="nextstepaction"]
> [Create a free Azure account](https://azure.microsoft.com/free/)

If you're using an Azure account from your workplace or school, your organization's Azure administrators has likely assigned different groups and roles to your account that govern what you can and cannot do in Azure.  If you can't create a certain type of resource, check with your Azure administrator on the permissions assigned to your account.

## What is an Azure subscription?

Billing for Azure resources is done on a per-subscription basis. An Azure subscription therefore defines a set of Azure resources that will be invoiced together.

Organizations often create multiple Azure subscriptions for billing and management purposes.  For example, an organization may choose to create one subscription for each department in the organization such that each department pays for their own Azure resources.  *When creating Azure resources, it's important to pay attention to what subscription you're creating the resources in because the owner of that subscription will pay for those resources.*  

If you have an individual Azure account tied to your Microsoft account, it's also possible to have multiple subscriptions.  For example, a user might have both a Visual Studio Enterprise subscription that provides monthly Azure credits and a Pay-as-you-go subscription which bills to their credit card.  In this scenario, you again want to be sure and choose the right subscription when creating Azure resources to avoid an unexpected bill for Azure services.


> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE50ydI]


## What factors influence the cost of a service on Azure?

There are several factors that can influence the cost of a given service in Azure.

- **Compute power** - Compute power refers to the amount of CPU and memory assigned to a resource.  The more compute power allocated to a resource, the higher the cost will be.  Many Azure services include the ability to elastically scale, allowing you to ramp up compute power when demand is high but scale back and save money when demand is low.
- **Storage amount** - Most storage services are billed based on the amount of data you want to store.
- **Storage hardware** - Some storage services provide options on the type of hardware your data will be stored on.  Depending on the type of data you're storing, you may want a more long-term storage option with slower read and write speeds, or you may be willing to pay for low latency read and writes for highly transactional operations.
- **Bandwidth** - Most services bill ingress and egress separately.  Ingress is the amount of bandwidth required to handle incoming requests.  Egress is the amount of bandwidth required to handle outgoing data that satisfies those requests.
- **Per use** - Some services bill based on the number of times the service is used or a count of the number of requests that are handled or the number of some entity (such as Microsoft Entra user accounts) that have been configured.
- **Per service** - Some services simply charge a straight monthly fee.
- **Region** - Sometimes, services have different prices depending on the region (data center) where it's hosted.

## Azure Pricing Calculator

Most Azure solutions involve multiple Azure services, making it challenging to determine the cost of a solution upfront.  For this reason, Azure provides the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to help estimate how much a solution will cost.

> [!div class="nextstepaction"]
> [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

## Where can I find our current spend in Azure?

The Azure portal provides an easy to navigate and visual presentation of all the services your organization utilized during a particular month.  You can view by service, by resource group, and so on.  

To access billing information in the Azure portal, [sign in to the Azure portal](https://portal.azure.com) and follow these steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/billing-azure-portal-1.md>)] | :::image type="content" source="./media/billing-azure-portal-1-240px.png" alt-text="A screenshot showing how to use the search box at the top of the Azure portal to locate the cost management and billing page." lightbox="./media/billing-azure-portal-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/billing-azure-portal-2.md>)] | :::image type="content" source="./media/billing-azure-portal-2-240px.png" alt-text="A screenshot showing the overview page for cost management and billing that summarizes spending across your Azure subscriptions" lightbox="./media/billing-azure-portal-2.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/billing-azure-portal-3.md>)] | :::image type="content" source="./media/billing-azure-portal-3-240px.png" alt-text="A screenshot of the detailed overview page for an Azure subscription showing the links used for cost analysis, setting up cost alerts, and how to get detailed billing data by Azure resource." lightbox="./media/billing-azure-portal-3.png"::: |

You can also access the Cost Management + Billing overview page directly.

> [!div class="nextstepaction"]
> [Azure Cost Management in the Azure Portal](https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview)

Cost information can also be accessed programmatically to create a customized and easily accessible view into your cloud spend for management via the Billing API.

- [Azure Billing libraries for .NET](/dotnet/api/overview/azure/billing)
- [Azure Billing libraries for Python](/python/api/overview/azure/billing)
- [Azure Resource Manager Billing client library for Java - Version 1.0.0-beta.1](/java/api/overview/azure/resourcemanager-billing-readme)
- [All other programming languages - RESTful API](/rest/api/billing/)
- [Azure consumption API overview](/azure/cost-management-billing/manage/consumption-api-overview)

## What tools are available to monitor and analyze my cloud spend?

Two services are available to set up and manage your cloud costs.

- The first is **cost alerts** which allows you to set spending thresholds and receive notifications as your bill nears those thresholds. 
- The second is **Azure Cost Management** which helps you plan for and control your costs, providing cost analysis, budgets, recommendations, and allows you to export cost management data for analysis in Excel or your own custom reporting.

Learn more about cost alerts and **Azure Cost Management**:

- [Use cost alerts to monitor usage and spending](/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending)
- [What is Azure Cost Management + Billing?](/azure/cost-management-billing/cost-management-billing-overview)
- [How to optimize your cloud investment with Azure Cost Management](/azure/cost-management-billing/costs/cost-mgt-best-practices)


> [!div class="nextstepaction"]
> [Continue to part 8: Versioning policy for Azure services, SDKs, and CLI tools](azure-service-sdk-tool-versioning.md)

