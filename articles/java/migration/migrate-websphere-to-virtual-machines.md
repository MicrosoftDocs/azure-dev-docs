---
title: Migrate WebSphere applications to Azure Virtual Machines
description: This guide describes what you should be aware of when you want to migrate an existing WebSphere application to run on Azure Virtual Machines.
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.topic: upgrade-and-migration-article
ms.date: 09/20/2024
recommendations: false
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-was-vm, devx-track-javaee-was, devx-track-javaee-websphere, migration-java, linux-related-content
---

# Migrate WebSphere applications to Azure Virtual Machines

This guide describes what you should be aware of when you want to migrate an existing WebSphere Application Server (WAS) traditional application to run on Azure Virtual Machines. For an overview of available WAS traditional solutions in Azure Marketplace, see [What are solutions to run the IBM WebSphere family of products on Azure?](../ee/websphere-family.md)

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Define what you mean by "migration complete"

This guide, and the corresponding Azure Marketplace offers, are a starting point to accelerate the migration of your WAS traditional workloads to Azure. It's important to define the scope of your migration effort. For example, are you doing a strict "lift and shift" from your existing infrastructure to Azure Virtual Machines? If so, you may be tempted to work in some "lift and improve" as you migrate.

It's better to stick as close to pure "lift and shift" as possible, accounting for the necessary changes as detailed in this guide. Define what you mean by "migration complete" so that you know when you've reached this milestone. When you've reached your "migration complete", you can take a snapshot of your Virtual Machines as described in [Create a snapshot of a virtual hard disk](/azure/virtual-machines/windows/snapshot-copy-managed-disk). After you've verified that you can successfully restore from your snapshot, you can do the improvements without fear of losing the migration progress you've achieved thus far.

[!INCLUDE [vm-aks-aro-tradeoffs-was-liberty](includes/vm-aks-aro-tradeoffs-was-liberty.md)]

### Determine whether the prebuilt Azure Marketplace offers are a good starting point

IBM and Microsoft have partnered to bring a set of Azure solution templates to Azure Marketplace to provide a solid starting point for migrating to Azure. For the list of offers, see [Run the WebSphere family of products and Liberty on Microsoft Azure](https://developer.ibm.com/blogs/run-the-websphere-family-of-products-on-microsoft-azure/), and then choose the one that most closely matches your existing deployment. You can see the list of offers in the overview article [What are solutions to run the IBM WebSphere family of products on Azure?](../ee/websphere-family.md)

If none of the existing offers are a good starting point, you have to reproduce the deployment by hand using Azure Virtual Machine resources. You can find the step-by-step guidance in [Tutorial: Manually install IBM WebSphere Application Server Network Deployment traditional on Azure Virtual Machines](migrate-websphere-to-azure-vm-manually.md). For more information, see [What is IaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas)

### Determine whether the WAS traditional version is compatible

Your existing WAS traditional version must be compatible with the version in the IaaS offers. You can find the version information from the overview page of [IBM WebSphere Application Server Single Instance on Azure VM](https://aka.ms/twas-single-portal) and [IBM WebSphere Application Server Cluster on Azure VMs](https://aka.ms/twas-cluster-portal). If your existing WAS traditional version isn't compatible with that version, you have to reproduce the deployment by hand using Azure IaaS resources. For more information, see [What is IaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas)

[!INCLUDE [inventory-server-capacity-virtual-machines](includes/inventory-server-capacity-virtual-machines.md)]

[!INCLUDE [inventory-all-secrets](includes/inventory-was-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]
For more information, see the IBM document [Certificate management in SSL](https://www.ibm.com/docs/en/was/9.0.5?topic=ssl-certificate-management-in)

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-was](includes/validate-that-the-supported-java-version-works-correctly-was.md)]

[!INCLUDE [inventory-was-jndi-resources](includes/inventory-was-jndi-resources.md)]

[!INCLUDE [inspect-your-profile-configuration](includes/inspect-your-profile-configuration.md)]

[!INCLUDE [determine-whether-session-replication-is-used](includes/determine-whether-session-replication-is-used-was.md)]

[!INCLUDE [document-datasources](includes/document-datasources-was.md)]

[!INCLUDE [determine-whether-was-has-been-customized](includes/determine-whether-was-has-been-customized.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use-virtual-machines](includes/determine-whether-jms-queues-or-topics-are-in-use-virtual-machines-was.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/determine-whether-osgi-bundles-are-used-was.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-ibm-integration-bus-is-in-use](includes/determine-whether-ibm-integration-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/determine-whether-your-application-is-packaged-as-an-ear-was.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Determine whether and how the file system is used

VM filesystems operate the same way as on-premises filesystems with respect to persistence, startup, and shutdown. Even so, it's important to be aware of your filesystem needs and ensure the VMs have adequate storage size and performance.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [determine-the-network-topology](includes/determine-the-network-topology-was.md)]

[!INCLUDE [account-for-the-use-of-jca-adapters-and-resource-adapters](includes/account-for-the-use-of-jca-adapters-and-resource-adapters-was.md)]

[!INCLUDE [account-for-the-use-of-custom-security-providers-and-jaas](includes/account-for-authentication-and-authorization-was.md)]

[!INCLUDE [determine-whether-was-clustering-is-used](includes/determine-whether-was-clustering-is-used.md)]

[!INCLUDE [determine-whether-the-java-ee-application-client-feature-is-used](includes/determine-whether-the-java-ee-application-client-feature-is-used.md)]

## Migration

### Select a WAS traditional on Azure Virtual Machines offer

The following offers are available for WAS on Azure Virtual Machines.

During the deployment of an offer, you're asked to choose the virtual machine size for your WAS nodes. It's important to consider all aspects of sizing (memory, processor, disk) in your choice of VM size. For more information, see [Sizes for Cloud Services (classic)](/azure/cloud-services/cloud-services-sizes-specs).

* [IBM WebSphere Application Server Single Instance on Azure VM](https://aka.ms/twas-single-portal)

  This offer automates most boilerplate steps to provision a single WebSphere instance on an Azure Virtual Machine. It creates an Application server profile with WAS admin console.

* [IBM WebSphere Application Server Cluster on Azure VMs](https://aka.ms/twas-cluster-portal)

  This offer automates most boilerplate steps to provision a WebSphere cluster on Azure VMs. It creates a deployment manager with WAS admin console on an Azure VM and required numbers of node agents on separated Azure VMs.

### Provision the offer

After you've selected which offer to start with, provision that offer by following the instructions in [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](../ee/traditional-websphere-application-server-virtual-machines.md).

### Migrate the profiles

After you've provisioned the offer, you can examine the profile configuration. For more information, see [Profile concepts](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=mpdios-profile-concepts) in the IBM documentation.

### Connect the databases

After you've migrated the profiles, you can connect the databases by following the instructions in [Configuring the WebSphere Application Server data source](https://www.ibm.com/docs/en/was/9.0.5?topic=SSEQTP_9.0.5/com.ibm.websphere.nd.multiplatform.doc/ae/twim_fedmap_datasconf.htm) in the IBM documentation.

### Account for KeyStores

You must account for the migration of any SSL KeyStores used by your application. For more information, see [Keystore configurations for SSL](https://www.ibm.com/docs/en/was/9.0.5?topic=ssl-keystore-configurations) in the IBM documentation.

### Connect the JMS sources

After you've connected the databases, you can configure JMS by following the instructions at [Setting up JMS in IBM WebSphere Application Server](https://www.ibm.com/docs/en/iis/9.1?topic=jms-setting-up-in-websphere-application-server) in the IBM documentation.

[!INCLUDE [account-for-authentication-and-authorization](includes/account-for-authentication-and-authorization-was.md)]

### Account for logging

You can configure Elastic Stack by following the instructions at [Analyzing WebSphere Application Server logs with Elastic Stack](https://www.ibm.com/docs/en/was/9.0.5?topic=tools-analyzing-websphere-application-server-logs-elastic-stack) in the IBM documentation. Azure provides support for Elastic. For more information, see [What is Elastic integration with Azure?](/azure/partner-solutions/elastic/overview) You can combine the knowledge in these two resources to achieve an Azure-optimized logging solution for WAS on VMs.

### Migrating your applications

The techniques used to deploy applications from the development team into test, staging, and production servers vary greatly from case to case. In some cases, there's a highly evolved CI/CD platform that results in the applications being deployed to the WebSphere Application Server. In other cases, the process can be more manual. One benefit of using Azure Virtual Machines to migrate WAS traditional applications to the cloud is that your existing processes continue to work.

You have to configure the Network Security Group that the offer provisions to allow access from your CI/CD pipeline, or manual deployment system. For more information, see [Network security groups](/azure/virtual-network/network-security-groups-overview).

### Testing

You must configure any in-container tests against applications to access the new servers running within Azure. As with the CI/CD concerns, you must ensure the necessary network security rules allow your tests to access the applications deployed to Azure. For more information, see [Network security groups](/azure/virtual-network/network-security-groups-overview).

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. For guidance on some potential post-migration enhancements, see the following recommendations:

* Use Azure Storage to serve static content mounted to the virtual machines. For more information, see [Attach or detach a data disk for a lab virtual machine in Azure DevTest Labs](/azure/lab-services/devtest-lab-attach-detach-data-disk).

* Deploy your applications to your migrated WAS cluster with Azure DevOps. For more information, see [Get started with Azure DevOps documentation](/azure/devops/get-started).

* If you deployed WAS traditional with Azure Application Gateway, you may want to do more configuration on the Application Gateway. For more information, see [Application Gateway configuration overview](/azure/application-gateway/configuration-overview).

* Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

* Use Azure Managed Identities to managed secrets and assign role based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

* Integrate WAS Java EE authentication and authorization with Microsoft Entra ID. For more information, see [Integrating Microsoft Entra ID with applications getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).

* Use Azure Key Vault to store any information that functions as a "secret". For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).
