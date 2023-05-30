---
title: "JBoss EAP on Azure"
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
author: KarlErickson
ms.author: karler
ms.topic: overview
ms.date: 09/15/2022
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-aro, devx-track-javaee-jbosseap-vm, devx-track-extended-java
---

# Red Hat JBoss EAP on Azure

This article describes the available solutions for hosting JBoss EAP on Azure, including the features and benefits of each option so you can choose the best one for your deployment.

There are three hosting options for JBoss EAP on Azure: App Service, Azure Red Hat OpenShift (ARO), and Azure Virtual Machines/VM Scale Sets. All three solutions are jointly developed and supported by Red Hat and Microsoft.

## JBoss EAP on Azure App Service

[Azure App Service](https://azure.microsoft.com/services/app-service/) is a fully managed platform for web and API applications, with built-in infrastructure maintenance, security patching, and scaling. App Service integrates with networking features such as virtual networks, Private Endpoints, and Hybrid Connections. This integration allows you to secure and isolate your infrastructure as necessary. You can deploy rapidly with GitHub Actions and Azure Pipelines integration, and monitor your applications with Azure Monitor Application Insights. For more information, see [App Service overview](/azure/app-service/overview).

JBoss EAP is available on the Linux variants of Premium v3 and Isolated v2 App Service plans. For more information about these plans, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/). The Isolated plans host your application in a private, dedicated Azure environment. You can purchase Premium v3 and Isolated v2 plans on a Pay-As-You-Go basis, or on one to three-year reservations to reduce costs up to 50%. For more information, see [What are Azure Reservations?](/azure/cost-management-billing/reservations/save-compute-costs-reservations) and [How reservation discounts apply to Azure App Service](/azure/cost-management-billing/reservations/reservation-discount-app-service).

JBoss EAP is offered with versions 7.3 and 7.4 on App Service. As new versions of JBoss EAP are released by Red Hat, they're offered on App Service as part of the regular platform upgrades. For a full list of the minor versions available for JBoss EAP on Azure App Service, go to your JBoss EAP web app in the Azure portal, then select **Settings** > **Configuration** > **General Settings** > **Java Web Server Version**.

JBoss EAP on Azure App Service is jointly supported by Red Hat and Microsoft. When you open a support case on the Azure portal about your JBoss EAP apps, Azure support will automatically contact Red Hat technical support when necessary. This integrated support is provided to all JBoss EAP applications running on App Service, pricing information is available on the [App Service Pricing page](https://azure.microsoft.com/pricing/details/app-service/linux/#jboss). JBoss EAP sites can't opt out of the integrated support, but you can [purchase a reservation](/azure/cost-management-billing/reservations/prepay-jboss-eap-integrated-support-app-service) for the integrated support to reduce costs.

<br>

> [!VIDEO https://www.youtube.com/embed/8b_Wiuw8l-8]

## JBoss EAP on Azure Red Hat OpenShift (ARO)

[Azure Red Hat OpenShift](https://azure.microsoft.com/services/openshift/#overview) provides highly available, fully managed OpenShift clusters on demand, monitored and operated jointly by Microsoft and Red Hat. If you're already using or planning to adopt containers/Kubernetes, deploying JBoss EAP on ARO is a compelling option. Red Hat and Microsoft provide official guidance for running JBoss EAP on ARO. For more information, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift (ARO) 4 cluster](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app). The guidance uses JBoss EAP Helm Charts. The Helm Charts let you easily and reliably deploy Java applications to OpenShift. The guidance also demonstrates the recommended use of Bootable JAR deployments, the WildFly JAR Maven plugin, Galleon layers, the Galleon data sources feature pack, clustered state on Kubernetes, OpenShift secrets, and liveness/readiness probes.

## JBoss EAP on Azure Virtual Machines

Virtual machines are a mature, proven migration path to the cloud that provides maximum flexibility and control. These factors are especially important for mission-critical workloads most suited to lift-and-shift migration. Microsoft and Red Hat provide robust options for migrating JBoss EAP workloads to Azure Virtual Machines.

Azure solution templates help accelerate migrating JBoss EAP workloads. This solution automatically provisions several Azure resources to quickly create a JBoss EAP deployment on Azure Virtual Machines or virtual machine scale sets. The automatically provisioned resources include virtual network, storage, network security group, OpenJDK, Red Hat Enterprise Linux (RHEL), and JBoss EAP. The solution supports the latest versions of JBoss EAP 7, OpenJDK 8, and RHEL 8.

You can create different types of JBoss EAP deployments:

- A single instance on a VM.
- A JBoss EAP cluster on a fixed number of VMs (with or without domain mode enabled). This option is very similar to traditional on-premises JBoss EAP clusters.
- A dynamic JBoss EAP cluster on virtual machine scale sets. Virtual machine scale sets provide groups of load-balanced virtual machines that can be scaled up or down in response to demand. For more information, see [Azure Virtual Machine Scale Sets](https://azure.microsoft.com/services/virtual-machine-scale-sets/). The JBoss EAP cluster is formed using Azure Ping and is suitable for stateful applications. This option doesn't support domain mode.

You can launch the solution from [the Azure portal](https://aka.ms/jboss-eap-on-vms).

The offer requires a JBoss EAP subscription and works on a Bring-Your-Own-Subscription (BYOS) basis. For the RHEL part of the offer, you have a choice to use either Pay-As-You-Go (PAYGO) or BYOS. In case of PAYGO, there's an extra hourly RHEL subscription charge for using the offer on top of the normal Azure compute, network and storage costs. To use RHEL BYOS, you must [contact Red Hat](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) to get your subscription enabled on Azure. Once you do so, the RHEL BYOS options will become visible as plans.

## Next steps

The following articles provide more information on getting started with these technologies.

- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Configure a Java app for Azure App Service](/azure/app-service/configure-language-java?pivots=platform-linux)
- [Deploy a Java application with JBoss EAP on ARO](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app)
