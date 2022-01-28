---
title: "JBoss EAP on Azure"
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
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

JBoss EAP on Azure App Service is jointly supported by Red Hat and Microsoft. When you open a support case on the Azure portal about your JBoss EAP apps, Azure support will automatically contact Red Hat technical support when necessary. This integrated support is provided to all JBoss EAP applications running on App Service. Starting August 1st, all JBoss EAP sites will be billed $0.15/core/hour for the integrated technical support. JBoss EAP sites cannot opt-out of the integrated support.

The following video describes the GA release of JBoss EAP on Azure App Service.

<br>

> [!VIDEO https://www.youtube.com/embed/8b_Wiuw8l-8]

## JBoss EAP on Azure Red Hat Openshift (ARO)

[Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/#overview) provides highly available, fully managed OpenShift clusters on demand, monitored and operated jointly by Microsoft and Red Hat. If you're already using containers, using Kubernetes, or adopting microservices, then deploying JBoss EAP on ARO is a compelling option. You can use the [Source-2-Image feature](https://access.redhat.com/documentation/en-us/red_hat_software_collections/2/html/using_red_hat_software_collections_container_images/sti) to create container images from your application source code, meaning you do not have to create your own Dockerfiles and images for your applications. For stateful or clustered JBoss applications, the EAP Operator provides a StatefulSet for the EAP instances. The EAP Operator also guarantees the uniqueness and ordering of the instances for scenarios like distributed transactions, stateful EJBs, and shared session information.

## JBoss EAP on Azure Virtual Machines

Several plans are available for running JBoss EAP on Azure Virtual Machines. Visit the offer [in the Azure portal](https://aka.ms/jboss-eap-on-vms) and select the option best suited for your needs.

Virtual machine scale sets provide groups of load-balanced, highly scalable virtual machines for workloads of any size. For more information, see [Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/).

If you prefer a traditional cluster of VMs using the JBoss EAP clustering mechanism, is suitable for a lift and shift from deployments that are already using this feature.  For more information see [the JBoss EAP documentation](https://access.redhat.com/documentation/en-us/reference_architectures/2017/html-single/configuring_a_red_hat_jboss_eap_7_cluster/index).

Choose a VM image of your preference and scale to thousands of VMs based on usage metrics. JBoss EAP on virtual machine scale sets uses jointly developed deployment templates to install JBoss EAP and Red Hat Enterprise Linux on your VMs behind a load balancer, all within a virtual network. These templates provide you with an enterprise-scale foundation to lift-and-shift your existing JBoss EAP applications. JBoss EAP on virtual machine scale sets supports clustered deployments via Azure Ping, so your stateful applications can run well.


## Next steps

The following articles provide more information on getting started with these technologies.

- [Red Hat JBoss EAP on Azure best practices](/azure/virtual-machines/workloads/redhat/jboss-eap-on-azure-best-practices)
- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Configure a Java app for Azure App Service](/azure/app-service/configure-language-java?pivots=platform-linux)
- [Getting Started with JBoss EAP for Openshift](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/getting_started_with_jboss_eap_for_openshift_container_platform/index)
- [Deploy Red Hat JBoss EAP on Azure VMs and virtual machine scale sets using the Azure Marketplace offer](/azure/virtual-machines/workloads/redhat/jboss-eap-marketplace-image)
