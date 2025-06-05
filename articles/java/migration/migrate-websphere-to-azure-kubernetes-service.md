---
title: Migrate WebSphere applications to Azure Kubernetes Service (AKS)
description: This guide describes what you should be aware of when you want to migrate WebSphere applications to Azure Kubernetes Service (AKS).
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.topic: upgrade-and-migration-article
ms.date: 09/20/2024
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, migration-java, template-how-to, linux-related-content
#Customer intent: As a Java developer, I want to migrate my on-premise WebSphere Application Server workload to IBM WebSphere Liberty or Open Liberty that runs on Azure Kubernetes Service
---

# Migrate WebSphere applications to Azure Kubernetes Service (AKS)

This guide describes what you should be aware of when you want to migrate an existing WebSphere Application Server (WAS) workload to IBM WebSphere Liberty or Open Liberty on Azure Kubernetes Service (AKS).

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [vm-aks-aro-tradeoffs-was-liberty](includes/vm-aks-aro-tradeoffs-was-liberty.md)]

### Determine whether the prebuilt Azure Marketplace offer is a good starting point

After you've decided that AKS is the appropriate deployment target, you must accept that the IBM WebSphere Liberty operator or Open Liberty Operator (the operator) is the only way to run Liberty on Kubernetes. After accepting this fact, you must decide whether or not the prebuilt [Azure Marketplace offer](https://ibm.biz/liberty-aks) is a good starting point. Here are some things to consider about the prebuilt Azure Marketplace offer:

- IBM and Microsoft created this offer to allow you to quickly provision Liberty on AKS. This concept is explained in more detail in the following content.
- At a high level, the offer automates the following steps for you.
  - Take an existing application image, if desired.
  - Provision an AKS cluster and an Azure Container Registry (ACR) instance, if desired.
  - Install and configure the IBM WebSphere Liberty operator or Open Liberty operator on AKS.
  - Use the operator to run the whole thing. The operator deploys and manages containerized Liberty applications in AKS. You can find the reference documentation at [IBM WebSphere Liberty operator](https://www.ibm.com/docs/was-liberty/core?topic=operator-getting-started-websphere-liberty) and [Open Liberty operator](https://github.com/OpenLiberty/open-liberty-operator).

If you don't use the prebuilt Azure Marketplace offer, you must learn how to use the operator directly. Mastering the operator is beyond the scope of this article. The complete documentation for the operator is available at [IBM WebSphere Liberty operator](https://www.ibm.com/docs/was-liberty/core?topic=operator-getting-started-websphere-liberty) and [Open Liberty operator](https://github.com/OpenLiberty/open-liberty-operator).

Now that you've been introduced to the various ways to handle Liberty on AKS, you're better able to choose whether to use the prebuilt Azure Marketplace offer or to do it yourself using the operator directly.

[!INCLUDE [determine-whether-the-liberty-version-is-compatible](includes/determine-whether-the-liberty-version-is-compatible.md)]

[!INCLUDE [determine-whether-liberty-license-is-needed](includes/determine-whether-liberty-license-is-needed.md)]

[!INCLUDE [inventory-difference-between-your-env-and-liberty](includes/inventory-difference-between-your-env-and-liberty.md)]

[!INCLUDE [inventory-server-capacity-aks](includes/inventory-server-capacity-aks.md)]

[!INCLUDE [inventory-all-secrets](includes/inventory-was-secrets.md)]

After you have a solid inventory of secrets, consult the operator documentation regarding secrets. For more information, see the following articles:

- [WebSphere Liberty on AKS: Configuring security for containerized applications](https://www.ibm.com/docs/was-liberty/base?topic=operator-configuring-security-containerized-applications)
- [Open Liberty: user guide](https://github.com/OpenLiberty/open-liberty-operator/blob/main/doc/user-guide-v1.adoc)
- [Security concepts for applications and clusters in Azure Kubernetes Service](/azure/aks/concepts-security)

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

After you have a solid inventory of certificates, configure them by using the following articles:

- [Configuring single sign-on (SSO) for WebSphere Liberty operators](https://www.ibm.com/docs/was-liberty/core?topic=applications-configuring-sso-operators)
- [Open Liberty: Certificates](https://openliberty.io/docs/latest/single-sign-on.html)
- [Security concepts for applications and clusters in Azure Kubernetes Service](/azure/aks/concepts-security).

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-liberty](includes/validate-that-the-supported-java-version-works-correctly-liberty.md)]

[!INCLUDE [inventory-was-jndi-resources](includes/inventory-was-jndi-resources.md)]

If you're using the prebuilt Azure Marketplace offer, the set of JNDI resources you can customize at deployment time is limited to what the offer supports. For WebSphere Liberty on AKS, you can make an object available in the default Java Naming and Directory Interface (JNDI) namespace. For more information, see [Developing with the JNDI default namespace in a Liberty feature](https://www.ibm.com/docs/was-liberty/core?topic=liberty-developing-jndi-default-namespace-in-feature). For Open Liberty, see [Java Naming and Directory Interface](https://openliberty.io/docs/latest/reference/feature/jndi-1.0.html).

[!INCLUDE [inspect-your-profile-configuration](includes/inspect-your-profile-configuration-liberty.md)]

You need to capture these customizations in the container image that AKS runs. When you use the prebuilt Azure Marketplace offer, such customizations are best handled by creating a custom container image and making it available in a public registry, then pointing to that registry at deployment time.

If you're using a WebSphere Application Server Network Deployment cell, each cluster member runs in an installation of traditional WAS. Liberty is a lightweight profile of WebSphere Application Server. It's a flexible and dynamic profile of WAS, which enables the WAS server to deploy only required custom features instead of deploying a large set of available Java EE components.

[!INCLUDE [determine-whether-session-replication-is-used](includes/determine-whether-session-replication-is-used-liberty.md)]

The prebuilt Azure Marketplace offer supports session affinity via the Application Gateway ingress controller. When deploying the offer, select **Enable cookie based affinity**.

[!INCLUDE [document-datasources](includes/document-datasources-was.md)]

JDBC configuration is a core server configuration in Liberty. For more information, see [JDBC Driver](https://www.ibm.com/docs/was-liberty/core?topic=configuration-jdbcdriver).

The prebuilt Azure Marketplace offer has limited support for databases. You can handle the configuration in the application images and use the image when you deploy the offer.

[!INCLUDE [determine-whether-was-has-been-customized](includes/determine-whether-was-has-been-customized.md)]

You need to capture these customizations in the container image that AKS runs. When you use the prebuilt Azure Marketplace offer, such customizations are best handled by creating a custom container image and making it available in a public registry, then pointing to that registry at deployment time.

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use-virtual-machines](includes/determine-whether-jms-queues-or-topics-are-in-use-virtual-machines-was.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

You can handle these libraries using the same techniques as described in [Accessing third-party APIs from a Java EE application](https://www.ibm.com/docs/was-liberty/core?topic=cclljea-accessing-third-party-apis-from-java-ee-application).

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/determine-whether-osgi-bundles-are-used-was.md)]

You can include the bundles in the image supplied to the prebuilt Azure Marketplace offer. For more information, see [Configuring libraries for OSGi applications](https://www.ibm.com/docs/was-liberty/core?topic=manually-configuring-libraries-osgi-applications).

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

Liberty on AKS runs on Linux x86_64. Any OS-specific code must be compatible with Linux. To learn how to discover specific OS information, follow the steps in the [Determine whether the Liberty version is compatible](#determine-whether-the-liberty-version-is-compatible) section.

[!INCLUDE [determine-whether-ibm-integration-bus-is-in-use](includes/determine-whether-ibm-integration-bus-is-in-use.md)]

IBM Integration Bus isn't directly supported in the prebuilt Azure Marketplace offer. To enable the feature, follow the instructions in [Enabling the JMS application on Liberty to connect to the service integration bus](https://www.ibm.com/docs/was-liberty/zos?topic=eiblwast-enabling-jms-application-liberty-connect-service-integration-bus) in the IBM documentation.

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/determine-whether-your-application-is-packaged-as-an-ear-was.md)]

The prebuilt Azure Marketplace offer allows you to use an existing container image. You can prepare the application according to your business requirements.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Determine whether and how the file system is used

Kubernetes deals with file systems with persistent volumes (PV). Mounting persistent volumes isn't supported in the prebuilt Azure Marketplace offer. To enable different storage options, follow the instructions at [Storage options for applications in Azure Kubernetes Service](/azure/aks/concepts-storage).

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [determine-the-network-topology](includes/determine-the-network-topology-liberty.md)]

[!INCLUDE [account-for-the-use-of-jca-adapters-and-resource-adapters](includes/account-for-the-use-of-jca-adapters-and-resource-adapters-liberty.md)]

### Determine whether clustering is used

The operator handles clustering for all possible ways of running WAS workload on AKS.

#### Inspect your EJB clustering

If your application is using local Enterprise Java Beans (EJB), you may need to migrate them to a clustered EJB. For more information, see [Developing EJB applications on Liberty](https://www.ibm.com/docs/was-liberty/base?topic=environment-developing-ejb-applications-liberty).

### Account for load-balancing requirements

The best way to account for load balancing is to use the App Gateway integration provided by the built-in Azure Marketplace offer.

## Migration

The steps in this section assume that your analysis has lead you to decide to use the prebuilt Azure Marketplace offer.

### Provision the offer

To open the offer in the Azure portal, see [IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service](https://ibm.biz/liberty-aks). Select **Create**, then use the information you gathered in the preceding steps to help in filling out the fields of the offer.

### Account for KeyStores

You must account for the migration of any SSL/TLS KeyStores used by your application. For more information, see [Configuring Keystores](https://www.ibm.com/docs/was-liberty/core?topic=liberty-enabling-ssl-communication-in).

### Connect the JMS sources

After you've connected the databases, you can configure JMS by following the instructions at [Overview of JCA configuration elements](https://www.ibm.com/docs/was-liberty/core?topic=resourceadapter-overview-jca-configuration-elements) in the IBM documentation.

### Account for logging

You can't do cloud without mastering logging. The operator provides different approaches for monitoring. For more information, see [Monitoring the Liberty server runtime environment](https://www.ibm.com/docs/was-liberty/core?topic=monitoring-liberty-server-runtime-environment). If you prefer using Elastic Stack, Azure provides great support for Elastic. For complete details, see [What is Elastic integration with Azure?](/azure/partner-solutions/elastic/overview) You can combine the knowledge in these two resources to achieve an Azure-optimized logging solution for Liberty on AKS.

### Migrate your applications

Whether or not you chose to provide an application image at deployment time, you need to update the application via CI/CD. The IBM documentation has a sample that shows how to do this update. For more information, see [Deploying applications in Liberty](https://www.ibm.com/docs/was-liberty/core?topic=deploying-applications-in-liberty).

### Configure tests

You must configure any in-container tests against applications to access the new servers running within Azure. As with the CI/CD concerns, you must ensure that the necessary network security rules allow your tests to access the applications deployed to Azure. For more information, see [Network security groups](/azure/virtual-network/security-overview).

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. The following articles provide information on post-migration enhancements:

- Dynamic scaling is a key value proposition to justify the complexity of using Kubernetes. To achieve a native Kubernetes optimized scaling solution, combine the knowledge in [Tutorial: Scale applications in Azure Kubernetes Service (AKS)](/azure/aks/tutorial-kubernetes-scale) with the IBM documentation section [Setting up auto scaling for Liberty collectives](https://www.ibm.com/docs/was-liberty/nd?topic=collectives-setting-up-auto-scaling-liberty).

- If you deployed Liberty with Azure Application Gateway by following the steps in the offer, you may want to do more configuration on the Application Gateway. For more information, see [Application Gateway configuration overview](/azure/application-gateway/configuration-overview).

- Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

- Get Java-optimized application performance monitoring with Azure Monitor and Application Insights. For more information, see [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](/azure/azure-monitor/app/kubernetes-codeless).

- Use Azure Storage to serve static content mounted to AKS. For more information, see [Storage options for applications in Azure Kubernetes Service (AKS)](/azure/aks/concepts-storage). Combine this knowledge with the IBM documentation [WebSphereLibertyApplication custom resource](https://www.ibm.com/docs/was-liberty/core?topic=resources-webspherelibertyapplication-custom-resource).

- Deploy your applications to your migrated WAS cluster with Azure DevOps. For more information, see [Azure DevOps getting started documentation](/azure/devops/get-started).

- Use Azure Managed Identities to managed secrets and assign role based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

- Integrate Liberty Java EE authentication and authorization with Microsoft Entra ID. For more information, see [Integrating Microsoft Entra getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).

- Tune WebSphere Liberty or Open Liberty to achieve better performance. For more information, see [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).
