---
title: Migrate WebLogic applications to Azure Virtual Machines
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure Virtual Machines.
author: edburns
ms.author: edburns
ms.topic: conceptual
ms.date: 1/27/2020
---

# Migrate WebLogic applications to Azure Virtual Machines

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on Azure Virtual Machines.

## Pre-migration

### Define what you mean by "migration complete"

This guide, and the corresponding Azure Marketplace Offers, are a starting point to accelerate the migration of your WebLogic Server workloads to Azure. It's important to define the scope of your migration effort. For example, are you doing a strict "lift and shift" from your existing infrastructure to Azure Virtual Machines? If so, you may be tempted to work in some "lift and improve" as you migrate.

It's better to stick as close to pure "lift and shift" as possible, accounting for the necessary changes as detailed in this guide. Define what you mean by "migration complete" so that you know when you've reached this milestone. When you've reached your "migration complete", you can take a snapshot of your Virtual Machines as described in [Create a snapshot](/azure/virtual-machines/windows/snapshot-copy-managed-disk). After you've verified that you can successfully restore from your snapshot, it's safer to do the improvements without fear of losing the migration progress you've achieved thus far.

### Determine whether the pre-built Marketplace offers are a good starting point

Oracle and Microsoft have partnered to bring a set of Azure solution templates to the Azure Marketplace to provide a solid starting point for migrating to Azure. Consult the [Oracle Fusion Middleware](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlazu/) documentation for the list of offers and choose the one that most closely matches your existing deployment. You can see the list of offers [in the Oracle documentation](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlazu/select-required-oracle-weblogic-server-offer-azure-marketplace.html#GUID-187739C5-EE7A-47C6-B3BA-C0A0333DC398)

If none of the existing offers are a good starting point, you'll have to reproduce the deployment by hand using Azure Virtual Machine resources. For more information, see [What is IaaS?](https://azure.microsoft.com/overview/what-is-iaas/).

### Determine whether the WebLogic version is compatible

Your existing WebLogic version must be compatible with the version in the IaaS offers. This query will show the offers for [WebLogic version 12.2.1.3](https://azuremarketplace.microsoft.com/marketplace/apps?search=oracle%20weblogic%2012.2.1.3&page=1). If your existing WebLogic version is not compatible with that version, you'll have to reproduce the deployment by hand using Azure IaaS resources. For more information, see [the Azure documentation](https://azure.microsoft.com/overview/what-is-iaas/).

[!INCLUDE [inventory-server-capacity-virtual-machines](includes/migration/inventory-server-capacity-virtual-machines.md)]

[!INCLUDE [inventory-all-secrets](includes/migration/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/migration/inventory-all-certificates.md)]

[!INCLUDE [validate-that-the-supported-java-version-works-correctly](includes/migration/validate-that-the-supported-java-version-works-correctly.md)]

[!INCLUDE [inventory-jndi-resources](includes/migration/inventory-jndi-resources.md)]

[!INCLUDE [domain-configuration](includes/migration/domain-configuration.md)]

[!INCLUDE [determine-whether-session-replication-is-used](includes/migration/determine-whether-session-replication-is-used.md)]

[!INCLUDE [document-datasources](includes/migration/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/migration/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-management-over-rest-is-used](includes/migration/determine-whether-management-over-rest-is-used.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/migration/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use-virtual-machines](includes/migration/determine-whether-jms-queues-or-topics-are-in-use-virtual-machines.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/migration/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/migration/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/migration/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/migration/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/migration/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/migration/determine-whether-your-application-is-packaged-as-an-ear.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/migration/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [determine-whether-wlst-is-used](includes/migration/determine-whether-wlst-is-used.md)]

[!INCLUDE [validate-whether-and-how-the-file-system-is-used](includes/migration/validate-whether-and-how-the-file-system-is-used.md)]

[!INCLUDE [determine-the-network-topology](includes/migration/determine-the-network-topology.md)]

[!INCLUDE [account-for-the-use-of-jca-adapters-and-resource-adapters](includes/migration/account-for-the-use-of-jca-adapters-and-resource-adapters.md)]

[!INCLUDE [account-for-the-use-of-custom-security-providers-and-jaas](includes/migration/account-for-the-use-of-custom-security-providers-and-jaas.md)]

[!INCLUDE [determine-whether-weblogic-clustering-is-used](includes/migration/determine-whether-weblogic-clustering-is-used.md)]

[!INCLUDE [determine-whether-the-java-ee-application-client-feature-is-used](includes/migration/determine-whether-the-java-ee-application-client-feature-is-used.md)]

## Migration

### Select a WebLogic on Azure Virtual Machines offer

The following offers are available for WebLogic on Azure Virtual Machines.

During the deployment of an offer, you'll be asked to choose the Virtual Machine size for your WebLogic server nodes. It's important to consider all aspects of sizing (memory, processor, disk) in your choice of VM size. For more information, see [the documentation for the offers](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlazu/deploy-oracle-weblogic-server-administration-server-single-node.html) and also the [Azure Documentation for virtual machine sizing](/azure/cloud-services/cloud-services-sizes-specs)

#### WebLogic Server Single Node with no Admin Server

This offer creates a single VM and installs WebLogic on it, but doesn't configure any domains, which is useful for scenarios where you have a highly customized domain configuration.

#### WebLogic Server Single Node with Admin Server

This offer provisions a single VM and installs WebLogic Server 12.1.2.3 on it. It creates a domain and starts up the admin server.

#### WebLogic Server N-Node Cluster

This offer creates a highly available cluster of WebLogic Server VMs.

#### WebLogic Server N-Node Dynamic Cluster

This offer creates a highly available and scalable dynamic cluster of WebLogic Server VMs

### Provision the offer

After you've selected which offer to start with, follow the instructions in [documentation for the offers](https://wls-eng.github.io/arm-oraclelinux-wls/) to provision that offer. Make sure to choose the domain name that matches your existing domain name. You can even match the domain password with your existing domain password.

### Migrate the domains

After you've provisioned the offer, you can examine the domain configuration and follow [this guidance](https://support.oracle.com/knowledge/Middleware/2336356_1.html) for details on how to migrate the domains.

### Connect the databases

After youve' migrated the domains, you can connect the databases by following the instructions [in the offer documentation](https://wls-eng.github.io/arm-oraclelinux-wls/#connecting-a-database-to-a-cluster). These instructions will help you account for any database secrets and access strings involved.

### Account for KeyStores

You must account for the migration of any SSL KeyStores used by your application. For more information, see [Configuring Keystores](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/secmg/identity_trust.html#GUID-7F03EB9C-9755-430B-8B86-17199E0C01DC).

### Connect the JMS sources

After you've connected the databases, you can configure JMS by following the instructions at [Fusion Middleware Administering JMS Resources for Oracle WebLogic Server](https://docs.oracle.com/middleware/12213/wls/JMSAD/toc.htm) in the WebLogic documentation.

### Account for logging

The existing logging configuration should be carried over when the domain is migrated. For more information, see [Configure java.util.logging logger levels](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlach/taskhelp/logging/ConfigureJavaLoggingLevels.html) and [Configuring Log Files and Filtering Log Messages for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wllog/index.html)

### Migrating your application(s)

The techniques used to deploy applications from the development team into test, staging, and production servers vary greatly from case to case. In some cases, there's a highly evolved CI/CD platform that results in the application(s) being deployed to the WebLogic Server. In other cases, the process can be more manual. One benefit of using Azure Virtual Machines to migrate WebLogic applications to the cloud is that your existing processes will continue to work.

You'll have to configure the Network Security Group that is provisioned by the offer to allow access from your CI/CD pipeline, or manual deployment system. For more information, see [Security groups](/azure/virtual-network/security-overview) in the Azure documentation for details.

### Testing

Any in-container tests against applications must be configured to access the new servers running within Azure. As with the CI/CD concerns you must ensure the necessary network security rules allow your tests to access the application(s) deployed to Azure. For more information, see [Security groups](/azure/virtual-network/security-overview) in the Azure documentation for details.

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. Some topics for post-migration enhancements include, but are certainly not limited to the following:

* Using Azure Storage to serve static content mounted to the virtual machines. For more information, see [Attach or detach a data disk to a virtual machine](/azure/lab-services/devtest-lab-attach-detach-data-disk).

* Deploy your applications to your migrated WebLogic cluster with Azure DevOps. For more information, see [Azure DevOps getting started documentation](/azure/devops/get-started/?view=azure-devops).

* Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

* Leverage Azure Managed Identities to managed secrets and assign role based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

* Integrate WebLogic Java EE authentication and authorization with Azure Active Directory. For more information, see [Integrating Azure Active Directory getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).

* Use Azure Key Vault to store any information that functions as a "secret". For more information, see [Azure Key Vault basic concepts](/azure/key-vault/basic-concepts).
