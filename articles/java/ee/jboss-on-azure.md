---
title: JBoss EAP on Azure
description: An overview of the different JBoss EAP solutions on Azure, all jointly developed and supported by Red Hat and Microsoft.
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: overview
ms.date: 03/12/2025
ms.custom: template-overview, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-extended-java, linux-related-content
---

# JBoss EAP on Azure

This article describes the available solutions for hosting Red Hat JBoss Enterprise Application Platform (EAP) on Azure, including the features and benefits of each option so you can choose the best one for your deployment.

There are three hosting options for JBoss EAP on Azure: App Service, Azure Red Hat OpenShift, and Azure Virtual Machines (VMs). Red Hat and Microsoft jointly develop and support all three solutions. When you open a support case on the Azure portal about your JBoss EAP applications, Azure support automatically contacts Red Hat technical support when necessary.

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing JBoss EAP on Azure solutions, fill out this short [survey on JBoss EAP migration](https://aka.ms/jboss-on-azure-survey) and include your contact information. Our team of program managers, architects, and engineers promptly get in touch with you to initiate close collaboration.

## JBoss EAP on Azure App Service

Azure App Service is a fully managed platform for web applications, with built-in infrastructure maintenance, security, patching, and scaling. You can use your favorite development tools like Visual Studio Code, deploy rapidly with Maven and GitHub Actions, or monitor your applications with Application Insights. For more information, see [Azure App Service overview](/azure/app-service/overview).

JBoss EAP is available on different App Service Linux plans - including the Free Tier. For more information about App Service Linux plans, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/). JBoss EAP clustering is fully supported on the Isolated plans. All Red Hat supported versions of JBoss EAP are available on App Service including 8.0 and 7.4. As new versions of JBoss EAP are released, they're offered on App Service as part of regular platform upgrades. For a full list available versions, go to your JBoss EAP web application in the Azure portal, then select **Settings** > **Configuration** > **General Settings** > **Java Web Server Version**. JBoss EAP commercial support is built into App Service. JBoss EAP pricing information is available on the [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/#jboss) page.

<br/>

> [!VIDEO https://www.youtube.com/embed/8b_Wiuw8l-8]

## JBoss EAP on Azure Red Hat OpenShift

Azure Red Hat OpenShift provides highly available, fully managed OpenShift clusters on demand, monitored and operated jointly by Microsoft and Red Hat. If you're already using or planning to adopt containers/Kubernetes, deploying JBoss EAP on Azure Red Hat OpenShift is a compelling option. Red Hat and Microsoft provide a marketplace solution template that automates common boilerplate provisioning tasks to deploy JBoss EAP on Azure Red Hat OpenShift. The solution can automatically provision the following resources:

* An Azure Red Hat OpenShift cluster. Alternatively, you can deploy to an existing cluster.
* A JBoss EAP Operator.
* Optionally, a sample getting started application.
* Optionally, a custom application deployment using Source-to-Image (S2I).
* A virtual network and subnet.

You can launch the solution [JBoss EAP on Azure Red Hat OpenShift](https://aka.ms/eap-aro-portal) from the Azure portal.

As an alternative to the solution template, Red Hat and Microsoft also provide a detailed step-by-step guide on how to deploy JBoss EAP on Azure Red Hat OpenShift. For more information, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster](jboss-eap-on-aro.md).

## JBoss EAP on Azure Virtual Machines

Virtual machines are a mature, proven migration path to the cloud that provides maximum flexibility and control. These factors are especially important for mission-critical workloads most suited to lift-and-shift migration. Microsoft and Red Hat provide robust options for migrating JBoss EAP workloads to Azure Virtual Machines. There are two solution templates that you can launch from the Azure portal to match your use case:

- A [single JBoss EAP instance on an Azure Virtual Machine](https://aka.ms/eap-vm-single-portal).
- A [JBoss EAP cluster on Azure Virtual Machines](https://aka.ms/eap-vm-cluster-portal).

The solution templates help accelerate migrating workloads. They can automatically provision the following resources:

* Red Hat Enterprise Linux (RHEL) VMs
* JBoss EAP standalone or cluster
* JBoss EAP management console
* Red Hat build of OpenJDK
* Data source connection (optional)
* Domain mode enabled (optional)
* Virtual network and subnet
* Network security group
* Azure App Gateway with public IP address (if applicable)
* Storage account for setting up Azure ping protocol for JGroups usage (if applicable)
* Storage account for sharing configuration files between VMs (if applicable)

The solutions support various versions of JBoss EAP, OpenJDK, and RHEL such as JBoss EAP 8 with OpenJDK 17 on RHEL 9. They can work on a bring-your-own-subscription or pay-as-you-go basis. To use bring-your-own-subscription, you must [contact Red Hat](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) to get your subscription enabled on Azure. After you do so, the bring-your-own-subscription options become visible as plans.

In addition to the solution templates, Red Hat and Microsoft also publish basic Virtual Machine images for JBoss EAP in Azure Marketplace. The images represent certified, supported, up-to-date, and secure JBoss EAP, OpenJDK, and RHEL combinations. The images are available on a pay-as-you-go basis only. For customers that need even more flexibility and control, Red Hat and Microsoft provide a [detailed step-by-step guide](/azure/developer/java/migration/migrate-jboss-eap-to-azure-vm-manually) on how to deploy JBoss EAP on Azure Virtual Machines.

## Next steps

The following articles provide more information on getting started with these technologies.

- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Quickstart: Deploy a Java application with JBoss EAP on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
