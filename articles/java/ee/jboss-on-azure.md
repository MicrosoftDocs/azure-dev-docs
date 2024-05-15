---
title: "JBoss EAP on Azure"
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
author: KarlErickson
ms.author: edburns
ms.topic: overview
ms.date: 10/03/2023
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-extended-java, linux-related-content
---

# Red Hat JBoss EAP on Azure

This article describes the available solutions for hosting JBoss EAP on Azure, including the features and benefits of each option so you can choose the best one for your deployment.

There are three hosting options for JBoss EAP on Azure: App Service, Azure Red Hat OpenShift, and Azure Virtual Machines/VM Scale Sets. All three solutions are jointly developed and supported by Red Hat and Microsoft.

## JBoss EAP on Azure App Service

Azure App Service is a fully managed platform for web and API applications, with built-in infrastructure maintenance, security patching, and scaling. App Service integrates with networking features such as virtual networks, Private Endpoints, and Hybrid Connections. This integration allows you to secure and isolate your infrastructure as necessary. You can deploy rapidly with GitHub Actions and Azure Pipelines integration, and monitor your applications with Azure Monitor Application Insights. For more information, see [Azure App Service overview](/azure/app-service/overview).

JBoss EAP is available on the Linux variants of Premium v3 and Isolated v2 App Service plans. For more information about these plans, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/). The Isolated plans host your application in a private, dedicated Azure environment. You can purchase Premium v3 and Isolated v2 plans on a Pay-As-You-Go basis, or on one to three-year reservations to reduce costs up to 50%. For more information, see [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations) and [How reservation discounts apply to Azure App Service](/azure/cost-management-billing/reservations/reservation-discount-app-service).

JBoss EAP is offered with versions 7.3 and 7.4 on App Service. As new versions of JBoss EAP are released by Red Hat, they're offered on App Service as part of the regular platform upgrades. For a full list of the minor versions available for JBoss EAP on Azure App Service, go to your JBoss EAP web app in the Azure portal, then select **Settings** > **Configuration** > **General Settings** > **Java Web Server Version**.

JBoss EAP on Azure App Service is jointly supported by Red Hat and Microsoft. When you open a support case on the Azure portal about your JBoss EAP apps, Azure support will automatically contact Red Hat technical support when necessary. This integrated support is provided to all JBoss EAP applications running on App Service, pricing information is available on the [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/#jboss) page. JBoss EAP sites can't opt out of the integrated support, but you can [purchase a reservation](/azure/cost-management-billing/reservations/prepay-jboss-eap-integrated-support-app-service) for the integrated support to reduce costs.

<br>

> [!VIDEO https://www.youtube.com/embed/8b_Wiuw8l-8]

## JBoss EAP on Azure Red Hat OpenShift

Azure Red Hat OpenShift provides highly available, fully managed OpenShift clusters on demand, monitored and operated jointly by Microsoft and Red Hat. If you're already using or planning to adopt containers/Kubernetes, deploying JBoss EAP on Azure Red Hat OpenShift (ARO) is a compelling option. Red Hat and Microsoft provide a marketplace solution template that automates common boilerplate provisioning tasks to deploy JBoss EAP on ARO. The solution can automatically provision an ARO cluster, the JBoss EAP Operator, a sample application or your own application deployed using Source-to-Image (S2I) technology. You can launch the solution [JBoss EAP on Azure Red Hat OpenShift](https://aka.ms/eap-aro-portal) from the Azure portal.

As an alternative to the solution template, Red Hat and Microsoft also provide a step-by-step guide on how to deploy JBoss EAP on ARO using Helm Charts instead of the Operator. For more information, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster](jboss-eap-on-aro.md).

## JBoss EAP on Azure Virtual Machines

Virtual machines are a mature, proven migration path to the cloud that provides maximum flexibility and control. These factors are especially important for mission-critical workloads most suited to lift-and-shift migration. Microsoft and Red Hat provide robust options for migrating JBoss EAP workloads to Azure Virtual Machines. You can launch the solutions from the Azure portal to deploy

- A [single JBoss EAP instance on Azure VM](https://aka.ms/eap-vm-single-portal).
- A [static JBoss EAP cluster on Azure VMs](https://aka.ms/eap-vm-cluster-portal), aka. a JBoss EAP cluster on a fixed number of VMs (with or without domain mode enabled). This option is very similar to traditional on-premises JBoss EAP clusters.
- Or a [dynamic JBoss EAP cluster on Azure VM Scale Sets](https://aka.ms/eap-vm-vmss-portal). Virtual machine scale sets provide groups of load-balanced virtual machines that can be scaled up or down in response to demand. For more information, see [Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/). The JBoss EAP cluster is formed using Azure Ping and is suitable for stateful applications. This option doesn't support domain mode.

Azure solution templates help accelerate migrating JBoss EAP workloads. The solutions automatically provision several Azure resources to quickly create a JBoss EAP deployment on Azure Virtual Machines or virtual machine scale sets. The automatically provisioned resources include virtual network, storage, network security group, OpenJDK, Red Hat Enterprise Linux (RHEL), JBoss EAP, Azure App Gateway, and database connectivity (Azure SQL, Oracle Database, PostgreSQL, MySQL). The solutions support the latest versions of JBoss EAP 7, OpenJDK 8, and RHEL 8.

The offers require a JBoss EAP subscription and work on a Bring-Your-Own-Subscription (BYOS) basis. For the RHEL part of the offer, you have a choice to use either Pay-As-You-Go (PAYGO) or BYOS. In case of PAYGO, there's an extra hourly RHEL subscription charge for using the offer on top of the normal Azure compute, network and storage costs. To use RHEL BYOS, you must [contact Red Hat](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) to get your subscription enabled on Azure. Once you do so, the RHEL BYOS options will become visible as plans.

## Next steps

The following articles provide more information on getting started with these technologies.

- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Configure a Java app for Azure App Service](/azure/app-service/configure-language-java?pivots=platform-linux)
- [Quickstart: Deploy a Java application with JBoss EAP on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Quickstart: Deploy JBoss EAP Server on Azure VM using the Azure portal](/azure/virtual-machines/workloads/redhat/jboss-eap-single-server-azure-vm?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Quickstart: Deploy a JBoss EAP cluster on Azure VMs using the Azure portal](/azure/developer/java/ee/jboss-eap-cluster-azure-vms)
