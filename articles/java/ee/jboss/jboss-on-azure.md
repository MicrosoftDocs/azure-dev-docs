---
title: "JBoss EAP on Azure"
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
author: jasonfreeberg
ms.author: jafreebe
ms.topic: overview
ms.date: 05/17/2021
ms.custom: template-overview, devx-track-java
---

# JBoss EAP on Azure

There are three hosting options for JBoss EAP on Azure: App Service, Virtual Machines & Virtual Machine Scale Sets, and Azure Red Hat OpenShift. All solutions are jointly developed and supported by Red Hat and Azure. This article covers the features and benefits of each solution so you can choose the best option for your JBoss EAP deployment.

## JBoss EAP on Azure App Service

[Azure App Service](https://azure.microsoft.com/services/app-service/) is a fully managed platform for web and API applications with built-in infrastructure maintenance, security patching, and scaling. App Service integrates with networking features such as virtual networks, Private Endpoints and Hybrid Connections, allowing you to secure and isolate your infrastructure as necessary. Deploy rapidly with GitHub Actions and DevOps Pipelines integration and monitor your applications with Azure Monitor application insights. For more information on App Service's features, see the [App Service documentation](https://docs.microsoft.com/azure/app-service/overview).

JBoss EAP is available on the Linux variants of Premium v3 and Isolated v2 [App Service Plans](https://azure.microsoft.com/pricing/details/app-service/linux/).The Isolated plans host your application in a private, dedicated Azure environment. Premium v3 and Isolated v2 plans can be purchased on a Pay-As-You-Go basis, or on [1 to 3-year reservations](https://docs.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations) to reduce costs up to 50%. For more information on reservation discounts on App Service, see [App Service reservation discounts](https://docs.microsoft.com/azure/cost-management-billing/reservations/reservation-discount-app-service)

JBoss EAP on Azure App Service is jointly supported by Red Hat and Microsoft. When you open a support case on the Azure Portal regarding your JBoss EAP apps, Azure support will automatically contact Red Hat technical support when necessary. This integrated support is provided to all JBoss EAP applications running on App Service.

### More Resources

- [Quickstart: JBoss EAP on Azure App Service](https://docs.microsoft.com/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Java on App Service documentation](https://docs.microsoft.com/azure/app-service/configure-language-java?pivots=platform-linux)

## JBoss EAP on Azure Virtual Machines

[Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) (VMSS) provide groups of load-balanced, highly scalable virtual machines for workloads of any size. Choose a VM image of your preference and scale to thousands of VMs based on usage metrics. JBoss EAP on VMSS uses jointly-developed deployment templates to install JBoss EAP and Red Hat Enterprise Linux on your VMs behind a load balancer, all within a Virtual Network. This provides you with an enterprise-scale foundation to lift-and-shift your existing JBoss EAP applications. JBoss EAP on VMSS supports clustered deployments via Azure Ping, so your stateful applications can run well.
