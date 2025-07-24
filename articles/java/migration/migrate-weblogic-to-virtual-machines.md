---
title: Migrate WebLogic applications to Azure Virtual Machines
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure Virtual Machines.
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: upgrade-and-migration-article
ms.date: 09/09/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java, devx-track-extended-java
---

# Migrate WebLogic Server applications to Azure Virtual Machines

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure Virtual Machines. For an overview of available WebLogic Server solutions in Azure Marketplace, see [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

### Define what you mean by "migration complete"

This guide, and the corresponding Azure Marketplace Offers, are a starting point to accelerate the migration of your WebLogic Server workloads to Azure. It's important to define the scope of your migration effort. For example, are you doing a strict "lift and shift" from your existing infrastructure to Azure Virtual Machines? If so, you may be tempted to work in some "lift and improve" as you migrate.

It's better to stick as close to pure "lift and shift" as possible, accounting for the necessary changes as detailed in this guide. Define what you mean by "migration complete" so that you know when you've reached this milestone. When you've reached your "migration complete", you can take a snapshot of your Virtual Machines as described in [Create a snapshot](/azure/virtual-machines/windows/snapshot-copy-managed-disk). After you've verified that you can successfully restore from your snapshot, you can do the improvements without fear of losing the migration progress you've achieved thus far.

[!INCLUDE [vm-aks-tradeoffs-wls](includes/vm-aks-tradeoffs-wls.md)]

### Determine whether the prebuilt Azure Marketplace offers are a good starting point

Oracle and Microsoft have partnered to bring a set of Azure solution templates to Azure Marketplace to provide a solid starting point for migrating to Azure. Consult the [Oracle Fusion Middleware](https://docs.oracle.com/en/middleware/standalone/weblogic-server/wlazu/) documentation for the list of offers and choose the one that most closely matches your existing deployment. You can see the list of offers in the overview article [What is Oracle WebLogic Server on Azure?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

If none of the existing offers are a good starting point, you have to reproduce the deployment by hand using Azure Virtual Machine resources. You can find the step-by-step guidance in [Install Oracle WebLogic Server on Azure Virtual Machines manually](migrate-weblogic-to-azure-vm-manually.md). For more information, see [What is IaaS?](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas/)

### Determine whether the WebLogic version is compatible

Your existing WebLogic version must be compatible with the version in the IaaS offers. To see the offers for WebLogic version 12.2.1.4, [query Azure Marketplace for Oracle WebLogic 12.2.1.4](https://azuremarketplace.microsoft.com/marketplace/apps?search=oracle%20weblogic%2012.2.1.4&page=1). If your existing WebLogic version isn't compatible with that version, you have to reproduce the deployment by hand using Azure IaaS resources. For more information, see [the Azure documentation](https://azure.microsoft.com/resources/cloud-computing-dictionary/what-is-iaas/).

[!INCLUDE [inventory-server-capacity-virtual-machines](includes/inventory-server-capacity-virtual-machines.md)]

[!INCLUDE [inventory-all-secrets](includes/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-weblogic](includes/validate-that-the-supported-java-version-works-correctly-weblogic.md)]

[!INCLUDE [inventory-jndi-resources](includes/inventory-jndi-resources.md)]

[!INCLUDE [inspect-your-domain-configuration](includes/inspect-your-domain-configuration.md)]

[!INCLUDE [determine-whether-session-replication-is-used](includes/determine-whether-session-replication-is-used.md)]

[!INCLUDE [document-datasources](includes/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-management-over-rest-is-used](includes/determine-whether-management-over-rest-is-used.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use-virtual-machines](includes/determine-whether-jms-queues-or-topics-are-in-use-virtual-machines.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/determine-whether-your-application-is-packaged-as-an-ear.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [determine-whether-wlst-is-used](includes/determine-whether-wlst-is-used.md)]

### Determine whether and how the file system is used

VM filesystems operate the same way as on-premises filesystems with respect to persistence, startup, and shutdown. Even so, it's important to be aware of your filesystem needs and ensure the VMs have adequate storage size and performance.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [determine-the-network-topology](includes/determine-the-network-topology.md)]

[!INCLUDE [account-for-the-use-of-jca-adapters-and-resource-adapters](includes/account-for-the-use-of-jca-adapters-and-resource-adapters.md)]

[!INCLUDE [account-for-the-use-of-custom-security-providers-and-jaas](includes/account-for-the-use-of-custom-security-providers-and-jaas.md)]

[!INCLUDE [determine-whether-weblogic-clustering-is-used](includes/determine-whether-weblogic-clustering-is-used.md)]

[!INCLUDE [determine-whether-the-java-ee-application-client-feature-is-used](includes/determine-whether-the-java-ee-application-client-feature-is-used.md)]

## Migration

### Select a WebLogic on Azure Virtual Machines offer

The following offers are available for WebLogic on Azure Virtual Machines.

During the deployment of an offer, you're asked to choose the Virtual Machine size for your WebLogic server nodes. It's important to consider all aspects of sizing (memory, processor, disk) in your choice of VM size. For more information, see the [Azure Documentation for virtual machine sizing](/azure/cloud-services/cloud-services-sizes-specs)

#### WebLogic Server Single Node with no Admin Server

This offer creates a single VM and installs WebLogic on it, but doesn't configure any domains, which is useful for scenarios where you have a highly customized domain configuration.

#### WebLogic Server Single Node with Admin Server

This offer provisions a single VM and installs WebLogic Server on it. It creates a domain and starts up the admin server.

#### WebLogic Server N-Node Cluster

This offer creates a highly available cluster of WebLogic Server VMs.

#### WebLogic Server N-Node Dynamic Cluster

This offer creates a highly available and scalable dynamic cluster of WebLogic Server VMs

### Provision the offer

After you've selected which offer to start with, follow the instructions in [documentation for the offers](https://docs.oracle.com/en/middleware/standalone/weblogic-server/wlazu/) to provision that offer. Make sure to choose the domain name that matches your existing domain name. You can even match the domain password with your existing domain password.

### Migrate the domains

After you've provisioned the offer, you can examine the domain configuration and follow [this guidance](https://support.oracle.com/knowledge/Middleware/2336356_1.html) for details on how to migrate the domains.

### Connect the databases

After you've migrated the domains, you can connect the databases by following the instructions [in the offer documentation](https://docs.oracle.com/en/middleware/standalone/weblogic-server/wlazu/deploy-oracle-weblogic-server-cluster-microsoft-azure-iaas.html#GUID-69FE91BD-32E2-4F58-9765-008988385534). These instructions help you account for any database secrets and access strings involved.

### Account for KeyStores

You must account for the migration of any SSL KeyStores used by your application. For more information, see [Configuring Keystores](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/secmg/identity_trust.html#GUID-7F03EB9C-9755-430B-8B86-17199E0C01DC).

### Connect the JMS sources

After you've connected the databases, you can configure JMS. For more information, see [Fusion Middleware Administering JMS Resources for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/jmsad/overview.html) in the WebLogic documentation.

[!INCLUDE [account-for-authentication-and-authorization](includes/account-for-authentication-and-authorization.md)]

### Account for logging

Use the integration with Elastic on Azure provided by the Oracle WebLogic Server marketplace solution templates. This approach is the easiest way to account for logging. You can see the list of offers in the overview article [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic) Complete tutorials to configure Elastic are provided in:

* [Land Oracle WebLogic Server logs to Elasticsearch and Kibana in admin offer](https://aka.ms/wls-admin-elk-postdeployment-guide)
* [Land Oracle WebLogic Server logs to Elasticsearch and Kibana in cluster offer](https://aka.ms/wls-cluster-elk-postdeployment-guide)
* [Land Oracle WebLogic Server logs to Elasticsearch and Kibana in dynamic cluster offer](https://aka.ms/wls-dynamic-cluster-elk-postdeployment-guide)

If the Elastic integration isn't appropriate, you should carry over the existing logging configuration when you migrate the domain. For more information, see [Configure java.util.logging logger levels](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlach/taskhelp/logging/ConfigureJavaLoggingLevels.html) and [Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wllog/index.html) in the Oracle documentation.

### Migrating your applications

The techniques used to deploy applications from the development team into test, staging, and production servers vary greatly from case to case. In some cases, there's a highly evolved CI/CD platform that results in the applications being deployed to the WebLogic Server. In other cases, the process can be more manual. One benefit of using Azure Virtual Machines to migrate WebLogic applications to the cloud is that your existing processes continue to work.

You have to configure the Network Security Group that the offer provisions to allow access from your CI/CD pipeline or manual deployment system. For more information, see [Network security groups](/azure/virtual-network/network-security-groups-overview).

### Testing

Any in-container tests against applications must be configured to access the new servers running within Azure. As with the CI/CD concerns, you must ensure the necessary network security rules allow your tests to access the applications deployed to Azure. For more information, see [Network security groups](/azure/virtual-network/network-security-groups-overview).

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. For guidance on some potential post-migration enhancements, see the following recommendations:

* Using Azure Storage to serve static content mounted to the virtual machines. For more information, see [Attach or detach a data disk to a virtual machine](/azure/lab-services/devtest-lab-attach-detach-data-disk).

* Deploy your applications to your migrated WebLogic cluster with Azure DevOps. For more information, see [Azure DevOps getting started documentation](/azure/devops/get-started).

* If you deployed WebLogic Server with Azure Application Gateway by following the steps in [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](migrate-weblogic-with-app-gateway.md), you may want to do more configuration on the Application Gateway. For more information, see [Application Gateway configuration overview
](/azure/application-gateway/configuration-overview).

* Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

* Use Azure Managed Identities to managed secrets and assign role based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview)

* Integrate WebLogic Java EE authentication and authorization with Microsoft Entra ID. For more information, see [Integrating Microsoft Entra getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).

* Use Azure Key Vault to store any information that functions as a "secret". For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).
