---
title: Migrate JBoss EAP applications to JBoss EAP on Azure VMs
description: This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in Azure VMs.
author: KarlErickson
ms.author: karler
ms.topic: conceptual
ms.date: 10/04/2022
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm
recommendations: false
---

# Migrate JBoss EAP applications to JBoss EAP on Azure VMs

This guide describes what you should be aware of when you want to migrate an existing JBoss EAP application to run on JBoss EAP in Azure VMs.

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Define what you mean by "migration complete"

This guide, and the corresponding Azure Marketplace offers, are a starting point to accelerate the migration of your JBoss EAP workloads to Azure. It's important to define the scope of your migration effort. For example, are you doing a strict "lift and shift" from your existing infrastructure to Azure Virtual Machines? If so, you may be tempted to work in some "lift and improve" as you migrate.

It's better to stick as close to pure "lift and shift" as possible, accounting for the necessary changes as detailed in this guide. Define what you mean by "migration complete" so that you know when you've reached this milestone. When you've reached your "migration complete", you can take a snapshot of your virtual machines as described in [Create a snapshot of a virtual hard disk](/azure/virtual-machines/windows/snapshot-copy-managed-disk). It's safer to do the improvements after you've verified that you can successfully restore from your snapshot. That way you can proceed without fear of losing the migration progress you've achieved thus far.

### Determine whether the pre-built Azure Marketplace offers are a good starting point

Red Hat and Microsoft have partnered to bring a set of Azure solution templates to Azure Marketplace to provide a solid starting point for migrating to Azure. You can see the list of offers in the [JBoss EAP on Azure Virtual Machines](../ee/jboss-on-azure.md#jboss-eap-on-azure-virtual-machines) section of [Red Hat JBoss EAP on Azure](../ee/jboss-on-azure.md).

To get a feel for the pre-built Azure Marketplace offer, see [Quickstart: Deploy JBoss EAP Server on Azure VM using the Azure portal](../ee/jboss-eap-single-server-azure-vm.md).

If none of the existing offers are a good starting point, you'll have to reproduce the deployment by hand using the resources available in Azure Virtual Machines. For more information, see [What is IaaS?](https://azure.microsoft.com/overview/what-is-iaas/)

### Determine whether the JBoss EAP version is compatible

Your existing JBoss EAP version must be compatible with the version in the infrastructure-as-a-service (IaaS) offers. The Azure portal pages for the offers will show which versions of JBoss EAP are available. For more information, see the [JBoss EAP Cluster on VMs](https://aka.ms/jboss-eap-on-vms) offer on the Azure portal. If your existing JBoss EAP version isn't compatible with the versions available in the offer, you'll have to reproduce the deployment by hand using Azure IaaS resources. For more information, see [What is IaaS?](https://azure.microsoft.com/overview/what-is-iaas/)

### Ensure you have the necessary licenses

When using the pre-built Azure Marketplace offers, you must have current licenses from Red Hat for all of your JBoss EAP servers. Moving them to Azure, you can choose between the following deployment options to meet your needs:

- Deploy on Red Hat Enterprise Linux pay-as-you-go virtual machines. This option is known as *PAYG*.
- Move your Red Hat JBoss EAP and Red Hat Enterprise Linux subscriptions to Azure through the [Red Hat Cloud Access](https://aka.ms/red-hat-cloud-access-overview) program. This option is known as *BYOS*.

In both options, for license portability, you'll be asked for the *Pool ID* from Red Hat. Make sure you have this ID on hand before trying the offers.

The pre-built Azure Marketplace offers include support for Red Hat Satellite for license management. For an overview on Red Hat Satellite, see [Red Hat Satellite](https://aka.ms/red-hat-satellite).

> [!NOTE]
> If you don't have an EAP entitlement, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Write down the account details, which will be used as the *RHSM username* and *RHSM password* in the pre-built Azure Marketplace offers.
>
> The steps for discovering your *Pool ID* are explained in the [Prerequisites](../ee/jboss-eap-single-server-azure-vm.md#prerequisites) section in [Quickstart: Deploy JBoss EAP Server on an Azure virtual machine using the Azure portal](../ee/jboss-eap-single-server-azure-vm.md).

[!INCLUDE [inventory-server-capacity-aks](includes/inventory-server-capacity-aks.md)]

### Inventory all secrets

Check all properties and configuration files on the production server or servers for any secrets and passwords. Be sure to check the *jboss-web.xml* file in your WARs. Configuration files that contain passwords or credentials may also be found inside your application.

Consider storing those secrets in Azure KeyVault. For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-jboss-eap](includes/validate-that-the-supported-java-version-works-correctly-jboss-eap.md)]

[!INCLUDE [inventory-external-resources](includes/inventory-external-resources-jboss.md)]

### Determine whether and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. The file system may be used by JBoss EAP modules or by your application code. You may identify some or all of the scenarios described in the following sections.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [dynamic-or-internal-content-app-service](includes/dynamic-or-internal-content-app-service.md)]

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/determine-whether-your-application-relies-on-scheduled-jobs-app-service.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/determine-whether-jms-queues-or-topics-are-in-use.md)]

### Determine whether JCA connectors are in use

If your application uses JCA connectors, validate that you can use the JCA connector on JBoss EAP. If you can use the JCA connector on JBoss EAP, then for it to be available, you must add the JARs to the server classpath and put the necessary configuration files in the correct location in the JBoss EAP server directories.

[!INCLUDE [determine-whether-jaas-is-in-use](includes/determine-whether-jaas-is-in-use-jboss.md)]

[!INCLUDE [determine-whether-your-application-uses-a-resource-adapter](includes/determine-whether-your-application-uses-a-resource-adapter-jboss.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

### Determine whether your application is packaged as an EAR

If your application is packaged as an EAR file, be sure to examine the *application.xml* file and capture the configuration.

> [!NOTE]
> If you want to be able to scale each of your web applications independently for better use of your Azure VM resources, you should break up the EAR into separate web applications.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [perform-in-place-testing](includes/perform-in-place-testing-jboss.md)]

## Migration

### Select a JBoss EAP on Azure Virtual Machines offer

The offers described in the following sections are available for JBoss EAP on Azure Virtual Machines.

During the deployment of an offer, you'll be asked to choose the virtual machine size for your JBoss EAP server nodes. It's important to consider all aspects of sizing (memory, processor, disk) in your choice of VM size. For more information, see [Sizes for Cloud Services (classic)](/azure/cloud-services/cloud-services-sizes-specs).

### JBoss EAP on Virtual Machine Scale Sets

Virtual machine scale sets provide groups of load-balanced, highly scalable virtual machines for workloads of any size. For more information, see [What are virtual machine scale sets?](/azure/virtual-machine-scale-sets/overview)

### JBoss EAP on Clustered Virtual Machines

If you prefer, a traditional cluster of VMs using the JBoss EAP clustering mechanism is suitable for a lift and shift from deployments that are already using this feature. For more information, see [Configuring a Red Hat JBoss EAP 7 Cluster](https://aka.ms/eap-vm-docs-cluster) in the JBoss EAP documentation. The pre-built Azure Marketplace offer includes support for domain mode. For an overview of EAP Domains and domain mode, see [Domain Management](https://aka.ms/eap-vms-domain-mode).

### JBoss EAP Single Server

If you only need a single server, perhaps for testing and evaluation, or for lightweight workloads, there's an offer that deploys a JBoss EAP single server on a single VM.

### Red Hat Migration Toolkit for Apps

The [Red Hat Migration Toolkit for Applications](https://marketplace.visualstudio.com/items?itemName=redhat.mta-vscode-extension) is a free extension for Visual Studio Code. This extension analyzes your application code and configuration to provide recommendations for migrating to the cloud from on-premises. For more information, see [Migration Toolkit for Applications overview](https://developers.redhat.com/products/mta/overview).

The contents of this guide will help you address the other components of the migration journey, such as choosing the correct VM size, and externalizing your session state.

## Post-migration

Now that you've migrated your application to Azure App Service, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

[!INCLUDE [post-migration-recommendations-app-service](includes/post-migration-recommendations-app-service.md)]
