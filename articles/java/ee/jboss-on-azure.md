---
title: "JBoss EAP on Azure"
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
author: jasonfreeberg
ms.author: jafreebe
ms.topic: overview
ms.date: 05/17/2021
ms.custom: template-overview, devx-track-java
---

# Red Hat JBoss EAP on Azure

This article describes the available solutions for hosting JBoss EAP on Azure, including the features and benefits of each option so you can choose the best one for your deployment.

There are two hosting options for JBoss EAP on Azure: App Service and virtual machine scale sets. Both solutions are jointly developed and supported by Red Hat and Azure.

## JBoss EAP on Azure App Service

[Azure App Service](https://azure.microsoft.com/services/app-service/) is a fully managed platform for web and API applications, with built-in infrastructure maintenance, security patching, and scaling. App Service integrates with networking features such as virtual networks, Private Endpoints, and Hybrid Connections. This integration allows you to secure and isolate your infrastructure as necessary. You can deploy rapidly with GitHub Actions and Azure Pipelines integration, and monitor your applications with Azure Monitor application insights. For more information, see [App Service overview](/azure/app-service/overview).

JBoss EAP is available on the Linux variants of Premium v3 and Isolated v2 App Service plans. For more information about these plans, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/). The Isolated plans host your application in a private, dedicated Azure environment. You can purchase Premium v3 and Isolated v2 plans on a Pay-As-You-Go basis, or on one to three-year reservations to reduce costs up to 50%. For more information, see [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations) and [How reservation discounts apply to Azure App Service](/azure/cost-management-billing/reservations/reservation-discount-app-service)

JBoss EAP on Azure App Service is jointly supported by Red Hat and Microsoft. When you open a support case on the Azure portal regarding your JBoss EAP apps, Azure support will automatically contact Red Hat technical support when necessary. This integrated support is provided to all JBoss EAP applications running on App Servic

## JBoss EAP on Azure Virtual Machines

[Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/) provide groups of load-balanced, highly scalable virtual machines for workloads of any size. Choose a VM image of your preference and scale to thousands of VMs based on usage metrics. JBoss EAP on Virtual Machine Scale Sets (VMSS) uses jointly-developed deployment templates to install JBoss EAP and Red Hat Enterprise Linux on your VMs behind a load balancer, all within a virtual network. These templates provide you with an enterprise-scale foundation to lift-and-shift your existing JBoss EAP applications. JBoss EAP on VMSS supports clustered deployments via Azure Ping, so your stateful applications can run well.

## Next steps

- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Configure a Java app for Azure App Service](/azure/app-service/configure-language-java?pivots=platform-linux)
- [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?term=jboss)
