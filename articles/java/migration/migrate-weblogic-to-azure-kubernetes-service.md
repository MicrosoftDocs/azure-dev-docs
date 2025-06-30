---
title: Migrate WebLogic Server applications to Azure Kubernetes Service (AKS)
description: Migrate WebLogic Server applications to Azure Kubernetes Service (AKS)
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: upgrade-and-migration-article
ms.date: 05/12/2025
ms.custom: template-how-to, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-extended-java
#Customer intent: As a Java developer, I want to migrate my on-premise WebLogic Server workload to WebLogic on Azure Kubernetes Service (AKS)
---

# Migrate WebLogic Server applications to Azure Kubernetes Service (AKS)

This guide describes what you should be aware of when you want to migrate an existing WebLogic Server (WLS) application to run on Azure Kubernetes Service (AKS).

## Pre-migration

To ensure a successful migration, before you start, complete the assessment and inventory steps described in the following sections.

[!INCLUDE [vm-aks-tradeoffs-wls](includes/vm-aks-tradeoffs-wls.md)]

### Determine whether the prebuilt Azure Marketplace offer is a good starting point

Once you've decided that AKS is the appropriate deployment target, you must accept that the Oracle WLS Kubernetes operator (the operator) is the only way to run WLS on Kubernetes. After accepting this fact, you must decide whether or not the prebuilt [Azure Marketplace offer](https://aka.ms/wlsaks) is a good starting point. Here are some things to consider about the prebuilt Azure Marketplace offer.

- Oracle and Microsoft created this offer to allow you to quickly provision WLS on AKS using the *Model in Image* domain home source type. This concept is explained in more detail later in this article.
- At a high level, the offer automates the following steps for you.
  - Take an existing WAR or EAR deployment, if desired.
  - Wrap it in a container using the WebLogic Image Tool (WIT). For more information, see [WebLogic Image Tool](https://aka.ms/wls-wit) in the Oracle documentation.
  - Install and configure the WebLogic Kubernetes Operator on AKS.
  - Use the operator to run the whole thing. The operator invokes WebLogic Deploy Tooling (WDT) to stand up WebLogic environments and perform domain lifecycle operations in a repeatable fashion based on a metadata model. For more information, see [WebLogic Deploy Tooling](https://aka.ms/wls-wdt) in the Oracle documentation.
- Though the prebuilt offer does provide numerous Azure service integrations, such as App Gateway, Database integration, and more, it does make many simplifying assumptions. These assumptions make the offer not as flexible as mastering and using the operator yourself.

If you don't use the prebuilt Azure Marketplace offer, you must learn how to use the operator directly. Mastering the operator is beyond the scope of this article. The complete documentation for the WLS Kubernetes Operator is available at [Oracle](https://aka.ms/wlsoperator).

The remainder of this section provides some considerations for deciding to use the prebuilt Azure Marketplace offer or using the operator directly.

#### Decide whether to use the prebuilt Azure Marketplace offer

First, you have to understand the concept of the WLS *domain*. A domain is a logically related group of WLS resources. For the canonical definition of WLS domain, see [the Oracle documentation](https://aka.ms/javaee/wls/domains). Running WLS on AKS requires deciding how AKS deals with domains. The various choices are referred to as "domain home source type". The WLS Kubernetes operator supports three choices of domain home source type. The prebuilt Azure Marketplace offer uses the first one in this table.

| Domain home source type | Description                                                                                                                   | Positive aspects                                                                                                                                                                                                            | Negative aspects                                                                                                                                                                                                                          |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Model in Image        | WLS and applications are in the container image, and everything else is kept outside of that image.                           | **Supported by prebuilt offer.** Documented as an official sample; see [Oracle](https://aka.ms/wls-aks-model-in-image). Most heavily uses WDT. Most "cloud-native" option. Simplest CI/CD integration.                     | Biggest learning curve.                                                                                                                                                                                                                   |
| Domain in PV          | The domain resides on a Kubernetes persistent volume.                                                                         | Conceptually similar to running on VMs. You can use the WLS console to make changes and those changes persist across AKS pod restarts. Documented as an official sample; see [Oracle](https://aka.ms/wls-aks-domain-on-pv). | Some challenges related to NFS must be mitigated. For more information, see [Oracle](https://aka.ms/wls-aks-persistent-storage). This approach is the least "cloud-native" technique; the state resides entirely outside the AKS cluster. |
| Domain in Image       | The domain resides in a container image. Applications are contained in a container image that's overlaid on the domain image. | More "cloud-native" than Domain in PV. Easier for CI/CD.                                                                                                                                                                  | Can't use WLS console. Must maintain more container images.                                                                                                                                                                               |

> [!IMPORTANT]
> If you choose the Domain in PV source type, we strongly recommend NFS instead of SMB. NFS evolved from the UNIX operating system, and other variants such as GNU/Linux. For this reason, when using NFS with container technologies such as Docker, it's less likely to have problems for concurrent reads and file locking. 
>
> Be sure to enable NFS v4.1. Versions lower than v4.1 will have problems.

The operator documentation also includes a useful table comparing the various options. For more information, see [Choose a domain home source type](https://aka.ms/wls-aks-docs-domain-home-source-type).

To get a feel for the prebuilt Azure Marketplace offer, see [Quickstart: Deploy WebLogic Server on Azure Kubernetes Service using the Azure portal](/azure/aks/howto-deploy-java-wls-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/ee/breadcrumb/toc.json). For the reference documentation on the prebuilt Azure Marketplace offer, see [Oracle](https://aka.ms/wls-aks-docs).

To get a feel for using the operator directly, try the samples in [the operator documentation](https://aka.ms/wls-aks-samples).

Now that you've been introduced to the various ways to handle WLS domains on AKS, you're better able to choose whether to use the prebuilt Azure Marketplace offer or to do it yourself using the operator directly.

### Determine whether the WebLogic version is compatible

Your existing WLS version must be one of the versions supported by the operator. Oracle maintains these versions in the Oracle Container Registry (OCR). Use the following steps to see the list of supported versions.

1. Visit the Oracle Container Registry website and sign in. For more information, see [https://container-registry.oracle.com/](https://container-registry.oracle.com/).
1. If you have a support entitlement, select **Middleware**, then search for **weblogic_cpu**. Select **weblogic_cpu**.
1. If you don't have a support entitlement from Oracle, select **Middleware**, then search for **weblogic**. Select **weblogic**.

> [!NOTE]
> Get a support entitlement from Oracle before going to production. Failure to do so results in running insecure images that are not patched for critical security flaws. For more information on Oracle's critical patch updates, see [Critical Patch Updates, Security Alerts and Bulletins](https://www.oracle.com/security-alerts/).

The prebuilt Azure Marketplace offer allows you to select the WLS images from OCR and Azure Container Registry (ACR), and thus implicitly supports all of the versions available from OCR. If you direct the offer to pull an image from ACR, make sure it's derived from one of the supported versions listed in OCR.

[!INCLUDE [inventory-server-capacity-aks](includes/inventory-server-capacity-aks.md)]

[!INCLUDE [inventory-all-secrets](includes/inventory-all-secrets.md)]

Once you have a solid inventory of secrets, consult the operator documentation regarding secrets. For more information, see [Secrets](https://aka.ms/wlsoperator-secrets).

[!INCLUDE [inventory-all-certificates](includes/inventory-all-certificates.md)]

Once you have a solid inventory of certificates, you can install them directly with the prebuilt Azure Marketplace offer. For more information, see [TLS/SSL configuration](https://aka.ms/wls-aks-docs#tlsssl-configuration). If you're using the operator directly, see [Updating operator external certificates](https://aka.ms/wlsoperator-certificates).

[!INCLUDE [validate-that-the-supported-java-version-works-correctly-weblogic](includes/validate-that-the-supported-java-version-works-correctly-weblogic.md)]

[!INCLUDE [inventory-jndi-resources](includes/inventory-jndi-resources.md)]

If you're using the prebuilt Azure Marketplace offer, the set of JNDI resources you can customize at deployment time is limited to what the offer supports. Search for **JNDI** in the [offer documentation](https://aka.ms/wls-aks-docs). If you're using the operator directly, the JDNI resources can be defined depending on your chosen domain home source type. For Domain in PV, you can set them the usual way, with WLST or with the admin console. For Domain in Image or Model in Image, see [Typical overrides](https://aka.ms/wlsoperator-configoverrides#typical-overrides).

[!INCLUDE [inspect-your-domain-configuration](includes/inspect-your-domain-configuration.md)]

The prebuilt Azure Marketplace offer automatically creates a domain resource. If you're using the operator directly, you can completely customize how your domain is represented. For complete information, see [Domain resource](https://aka.ms/wlsoperator-domainresource).

[!INCLUDE [determine-whether-session-replication-is-used](includes/determine-whether-session-replication-is-used.md)]

The prebuilt Azure Marketplace offer supports session affinity via the Application Gateway ingress controller. Cookie based affinity is enabled by default. You can select **Disable cookie based affinity** to disable it. Look for cookie based affinity in [the documentation for the offer](https://aka.ms/wls-aks-docs#application-gateway-ingress-controller).

[!INCLUDE [document-datasources](includes/document-datasources.md)]

The prebuilt Azure Marketplace offer has support for most popular databases. For more information, see [Database](https://aka.ms/wls-aks-docs#database). For Domain in PV, you can set them the usual way, with WLST or with the admin console. For Domain in Image or Model in Image, see [Typical overrides](https://aka.ms/wlsoperator-configoverrides#typical-overrides).

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/determine-whether-weblogic-has-been-customized.md)]

You need to capture these customizations in the container image run by AKS. For the prebuilt Azure Marketplace offer, such customizations are best handled by creating a custom container image and making it available in Azure Container Registry, then pointing to that registry at deployment time. For more information, see [Image selection](https://aka.ms/wls-aks-docs#image-selection). If you're using the operator directly, see [JVM memory and Java option environment variables](https://aka.ms/wlsoperator-domainresource#jvm-memory-and-java-option-environment-variables).

[!INCLUDE [determine-whether-management-over-rest-is-used](includes/determine-whether-management-over-rest-is-used.md)]

The only domain home source type where it makes sense to continue to use management over REST is Domain in PV. It's possible to use it with the other domain home source types, but changes made are ephemeral and don't persist across pod restarts.

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use-virtual-machines](includes/determine-whether-jms-queues-or-topics-are-in-use-virtual-machines.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

These libraries can be handled using the same techniques as described in [Determine whether WebLogic has been customized](#determine-whether-weblogic-has-been-customized).

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/determine-whether-osgi-bundles-are-used.md)]

You can include them in the WAR or EAR supplied to the prebuilt Azure Marketplace offer or using the operator directly.

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

WLS on AKS runs on Oracle Linux. Any OS-specific code must be compatible with Oracle Linux. To learn how to discover specific OS information, follow the steps in [Determine whether the WebLogic version is compatible](#determine-whether-the-weblogic-version-is-compatible).

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/determine-whether-oracle-service-bus-is-in-use.md)]

OSB isn't directly supported in the prebuilt Azure Marketplace offer. If you must use OSB, you must use the operator directly.

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/determine-whether-your-application-is-packaged-as-an-ear.md)]

The prebuilt Azure Marketplace offer supports WARs and EARs. Using the operator directly also supports WARs and EARs.

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

[!INCLUDE [determine-whether-wlst-is-used](includes/determine-whether-wlst-is-used.md)]

The only domain home source type that's compatible with use of WLST is Domain in PV. For more information, see [Domain home on a PV](https://aka.ms/wls-aks-domain-on-pv).

### Determine whether and how the file system is used

Kubernetes deals with filesystems with persistent volumes (PV). Mounting persistent volumes is supported in the prebuilt Azure Marketplace offer, and when using the operator directly. If you're using Domain in PV, the filesystem is a central aspect of configuration.

[!INCLUDE [static-content](includes/static-content.md)]

[!INCLUDE [determine-the-network-topology](includes/determine-the-network-topology.md)]

### Account for the use of JCA Adapters and Resource Adapters

If your deployment relies on resource adapters, the most supported option is [Domain home on a PV](https://aka.ms/wls-aks-domain-on-pv).

[!INCLUDE [account-for-the-use-of-custom-security-providers-and-jaas](includes/account-for-the-use-of-custom-security-providers-and-jaas.md)]

If your deployment relies security providers, the most supported option is [Domain home on a PV](https://aka.ms/wls-aks-domain-on-pv).

### Determine whether WebLogic clustering is used

The operator handles clustering for all possible ways of running WLS on AKS.

#### Inspect your EJB clustering

If your application is using local EJB, you need to migrate them to clustered EJB. For more information, see [Clustered versus local EJB](https://aka.ms/wls-ejb-clustering).

### Account for load-balancing requirements

The best way to account for load balancing is to use the App Gateway integration provided by the built-in Azure Marketplace offer. For more information, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](./migrate-weblogic-with-app-gateway.md).

### Determine whether the Java EE Application Client feature is used

If your deployment relies on Java EE application clients, it's best to use the operator directly. For more information, see [External Clients](https://aka.ms/wlsoperator-external-clients).

### Determine whether multiple container images are needed

A WebLogic Server domain can contain multiple clusters. For example, a multi-tiered application can be represented in a single domain, but have two clusters, say "frontend" and "backend".  It's useful to be able to update the frontend, without updating the backend, and vice versa. However, with the Model in Image domain home source type, the entire domain is represented in one container image. To accommodate this use case, you must separate the clusters into their own domains, each with their own container image. The operator can manage multiple domains in multiple namespaces. For more information, see [Choose a domain namespace selection strategy](https://aka.ms/wlsoperator-namespaces#choose-a-domain-namespace-selection-strategy)

Adopting multiple domains may introduce T3 access problems between domains. To resolve these problems, enable a custom channel as described in [Determine whether enabling unknown host access is needed](#determine-whether-enabling-unknown-host-access-is-needed).

### Determine whether enabling unknown host access is needed

You may need to enable unknown host access by applying a patch to WebLogic for the following scenarios:

- Allow T3 access from external clients outside AKS to WLS clusters in AKS via a custom channel.
- Allow T3 access between different WLS domains in AKS via a custom channel.

For the details of the patch, follow the guidance in [How to Use the Patch Search in My Oracle Support(MOS)](https://support.oracle.com/knowledge/Support%20Tools/1078014_1.html) and search for patch `30656708`.

After the patch is applied, see [Enabling unknown host access](https://aka.ms/wlsoperator-external-clients).

## Migration

The steps in this section assume that your analysis has led you to decide to use the prebuilt Azure Marketplace offer.

### Provision the offer

To open the offer in the Azure portal, see [https://aka.ms/wlsaks](https://aka.ms/wlsaks). Select **Create**, and then follow the instructions in the [documentation for the offer](https://aka.ms/wls-aks-docs). Use the information you gathered in the preceding steps to aid in filling out the fields of the offer.

### Migrate the domains

After you've provisioned the offer, output the domain by following these steps.

If you navigated away from the **Deployment is in progress** page, the following steps show you how to get back to that page. If you're still on the page that shows **Your deployment is complete**, you can skip to step 5.

1. In the upper left of any portal page, select the hamburger menu and select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.
1. In the left navigation pane, in the **Settings** section, select **Deployments** to see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown in the following screenshot.

   :::image type="content" source="media/migrate-weblogic-to-azure-kubernetes-service/resource-group-deployments.png" alt-text="Screenshot of Azure portal showing the resource group deployments list." lightbox="media/migrate-weblogic-to-azure-kubernetes-service/resource-group-deployments.png":::

1. In the left panel, select **Outputs**. This list shows the output values from the deployment. Useful information is included in the outputs. We're interested in the outputs that allow us to inspect the domain and interact with the operator. The other values in the outputs are explained in detail in the [WebLogic on AKS user guide](https://aka.ms/wls-aks-docs#template-outputs).
1. Locate the output named `shellCmdtoConnectAks`. Paste the value of the output in a Bash shell and run the command. This command enables you to use `kubectl` as described in [Connect to the cluster](/azure/aks/learn/quick-kubernetes-deploy-cli#connect-to-the-cluster).
1. Locate the output named `shellCmdtoOutputWlsDomainYaml`. Paste the value of the output in a Bash shell and run the command. This command outputs the domain resource as a YAML file.
1. Now that you have the domain YAML of the current deployment, you can apply the knowledge in [Deploying domain resource YAML files](https://aka.ms/wlsoperator#deploying-domain-resource-yaml-files) and review [this guidance](https://support.oracle.com/knowledge/Middleware/2336356_1.html) for more clues on how to migrate the domains. This guidance requires adaptation to apply to the Kubernetes way of doing things, but it's still useful to know about.

### Account for KeyStores

You must account for the migration of any SSL KeyStores used by your application. For more information, see [Configuring Keystores](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/secmg/identity_trust.html).

### Connect the JMS sources

After you've connected the databases, you can configure JMS by following the instructions at [Administering JMS Resources for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/jmsad/index.html) in the WebLogic documentation.

### Account for logging

You can't do cloud without mastering logging. The operator provides samples for using Elasticsearch and Kibana. For more information, see [the operator documentation](https://aka.ms/wlsoperator-logging). Azure provides great support for Elastic. For complete details, see [What is Elastic integration with Azure?](/azure/partner-solutions/elastic/overview). You can combine the knowledge in these two resources to achieve an Azure-optimized logging solution for WLS on AKS.

### Migrating your applications

Whether or not you chose to provide a WAR or EAR file at deployment time, you need to update the application via CI/CD. The operator documentation has a sample that shows how to do this update. For more information, see [Update 3](https://aka.ms/wlsoperator-update-app). The other update samples are relevant to migration and are worth exploring.

### Testing

Any in-container tests against applications must be configured to access the new servers running within Azure. As with the CI/CD concerns, you must ensure the necessary network security rules allow your tests to access the applications deployed to Azure. For more information, see [Network security groups](/azure/virtual-network/network-security-groups-overview).

## Post-migration

After you've reached the migration goals you defined in the [pre-migration](#pre-migration) step, perform some end-to-end acceptance testing to verify that everything works as expected. For guidance on some potential post-migration enhancements, see the following recommendations:

- Scaling. Dynamic scaling is a key value proposition to justify the complexity of using Kubernetes. Combine the knowledge in [Tutorial: Scale applications in Azure Kubernetes Service (AKS)](/azure/aks/tutorial-kubernetes-scale) with the operator documentation section [Scaling](https://aka.ms/wlsoperator-scaling) to achieve a WLS-native Kubernetes optimized scaling solution. It's perfectly possible to use popular off-the shelf solutions such as Prometheus and Grafana for scaling with WLS on AKS. For more information, see [Using Prometheus and Grafana to Monitor WebLogic Server on Kubernetes](https://blogs.oracle.com/weblogicserver/post/using-prometheus-and-grafana-to-monitor-weblogic-server-on-kubernetes). Azure has a managed Grafana service. For details, see [What is Azure Managed Grafana?](/azure/managed-grafana/overview).

- If you captured load testing results prior to migration, re-run the test suite against the migrated server to see if the performance targets are met.

- If you deployed WebLogic Server with Azure Application Gateway by following the steps in the offer, you may want to do more configurations on the Application Gateway. For more information, see [Application Gateway configuration overview](/azure/application-gateway/configuration-overview).

- Enhance your network topology with advanced load balancing services. For more information, see [Using load-balancing services in Azure](/azure/traffic-manager/traffic-manager-load-balancing-azure).

- Get Java-optimized application performance monitoring with Azure Monitor and Application Insights. For more information, see [Zero instrumentation application monitoring for Kubernetes - Azure Monitor Application Insights](/azure/azure-monitor/app/kubernetes-codeless).

- Use Azure Storage to serve static content mounted to AKS. For more information, see [Storage options for applications in Azure Kubernetes Service (AKS)](/azure/aks/concepts-storage). Combine this knowledge with the operator documentation section [Providing Access To A Persistent Volume Claim](https://aka.ms/wlsoperator-volumes).

- Deploy your applications to your migrated WebLogic cluster with Azure DevOps. For more information, see [Azure DevOps getting started documentation](/azure/devops/get-started).

- Use Azure Managed Identities to managed secrets and assign role based access to Azure resources. For more information, see [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

- Integrate WebLogic Java EE authentication and authorization with Microsoft Entra ID. For more information, see [Integrating Microsoft Entra getting started guide](/azure/active-directory/manage-apps/plan-an-application-integration).
