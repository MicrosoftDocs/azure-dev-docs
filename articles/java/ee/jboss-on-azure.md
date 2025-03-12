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

This article describes the available solutions for hosting Red Hat JBoss Enterprise Application Platform (JBoss EAP) on Azure, including the features and benefits of each option so you can choose the best one for your deployment.

There are three hosting options for JBoss EAP on Azure: App Service, Azure Red Hat OpenShift, and Azure Virtual Machines. All three solutions are jointly developed and supported by Red Hat and Microsoft. When you open a support case on the Azure portal about your JBoss EAP applications, Azure support will automatically contact Red Hat technical support when necessary.

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing JBoss EAP on Azure solutions, fill out this short [survey on JBoss EAP migration](https://aka.ms/jboss-on-azure-survey) and include your contact information. Our team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## JBoss EAP on Azure App Service

Azure App Service is a fully managed platform for web applications, with built-in infrastructure maintenance, security, patching, and scaling. You can use your favorite development tools like Visual Studio Code, deploy rapidly with Maven and GitHub Actions, or monitor your applications with Application Insights. For more information, see [Azure App Service overview](/azure/app-service/overview).

JBoss EAP is available on different App Service Linux plans - including the Free Tier. For more information about App Service Linux plans, see [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/). JBoss EAP clustering is fully supported on the Isolated plans. All Red Hat supported versions of JBoss EAP are available on App Service including 8.0 and 7.4. As new versions of JBoss EAP are released, they're offered on App Service as part of regular platform upgrades. For a full list available versions, go to your JBoss EAP web application in the Azure portal, then select **Settings** > **Configuration** > **General Settings** > **Java Web Server Version**. JBoss EAP commercial support is built into App Service. JBoss EAP pricing information is available on the [Azure App Service Pricing](https://azure.microsoft.com/pricing/details/app-service/linux/#jboss) page.

> [!VIDEO https://www.youtube.com/embed/8b_Wiuw8l-8]

## JBoss EAP on Azure Red Hat OpenShift

Azure Red Hat OpenShift provides highly available, fully managed OpenShift clusters on demand, monitored and operated jointly by Microsoft and Red Hat. If you're already using or planning to adopt containers/Kubernetes, deploying JBoss EAP on Azure Red Hat OpenShift is a compelling option. Red Hat and Microsoft provide a marketplace solution template that automates common boilerplate provisioning tasks to deploy JBoss EAP on Azure Red Hat OpenShift. The solution can automatically provision an Azure Red Hat OpenShift cluster, the JBoss EAP Operator, a sample application or your own application deployed using Source-to-Image (S2I) technology. You can launch the solution [JBoss EAP on Azure Red Hat OpenShift](https://aka.ms/eap-aro-portal) from the Azure portal.

As an alternative to the solution template, Red Hat and Microsoft also provide a step-by-step guide on how to deploy JBoss EAP on Azure Red Hat OpenShift using Helm Charts instead of the Operator. For more information, see [Deploy a Java application with Red Hat JBoss Enterprise Application Platform (JBoss EAP) on an Azure Red Hat OpenShift 4 cluster](jboss-eap-on-aro.md).

## JBoss EAP on Azure Virtual Machines

Virtual machines are a mature, proven migration path to the cloud that provides maximum flexibility and control. These factors are especially important for mission-critical workloads most suited to lift-and-shift migration. Microsoft and Red Hat provide robust options for migrating JBoss EAP workloads to Azure Virtual Machines. You can launch the solutions from the Azure portal to deploy the following resources:

- A [single JBoss EAP instance on Azure VM](https://aka.ms/eap-vm-single-portal).
- A [static JBoss EAP cluster on Azure VMs](https://aka.ms/eap-vm-cluster-portal) - that is, a JBoss EAP cluster on a fixed number of VMs, with or without domain mode enabled. This option is very similar to traditional on-premises JBoss EAP clusters.

Azure solution templates help accelerate migrating JBoss EAP workloads. The solutions automatically provision several Azure resources to quickly create a JBoss EAP deployment on Azure Virtual Machines. The automatically provisioned resources include virtual network, storage, network security group, OpenJDK, Red Hat Enterprise Linux (RHEL), JBoss EAP, Azure App Gateway, and database connectivity (Azure SQL, Oracle Database, PostgreSQL, MySQL). The solutions support the latest versions of JBoss EAP 7, OpenJDK 8, and RHEL 8.

The offers require a JBoss EAP subscription and work on a Bring-Your-Own-Subscription (BYOS) basis. For the RHEL part of the offer, you have a choice to use either Pay-As-You-Go (PAYGO) or BYOS. In case of PAYGO, there's an extra hourly RHEL subscription charge for using the offer on top of the normal Azure compute, network and storage costs. To use RHEL BYOS, you must [contact Red Hat](https://www.redhat.com/en/technologies/cloud-computing/cloud-access) to get your subscription enabled on Azure. Once you do so, the RHEL BYOS options will become visible as plans.

## Next steps

The following articles provide more information on getting started with these technologies.

- [Quickstart: Create a Java app on Azure App Service](/azure/app-service/quickstart-java?tabs=javase&pivots=platform-linux)
- [Configure a Java app for Azure App Service](/azure/app-service/configure-language-java?pivots=platform-linux)
- [Quickstart: Deploy a Java application with JBoss EAP on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
