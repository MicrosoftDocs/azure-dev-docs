---
title: Migrate WebLogic applications to WildFly on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 2/12/2020
---

# Migrate WebLogic applications to WildFly on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing WebLogic application to run on WildFly in an Azure Kubernetes Service container.

## Before you start

If any of the pre-migration requirements can't be met, see the companion migration guides:

* [Migrate WebLogic applications to Azure Virtual Machines](migrate-weblogic-to-virtual-machines.md)

## Pre-migration

1. [Inventory server capacity](#inventory-server-capacity)
1. [Inventory all secrets](#inventory-all-secrets)
1. [Inventory all certificates](#inventory-all-certificates)
1. [Validate that the supported Java version works correctly](#validate-that-the-supported-java-version-works-correctly)
1. [Inventory JNDI resources](#inventory-jndi-resources)
1. [Domain configuration](#domain-configuration)
1. [Determine whether session replication is used](#determine-whether-session-replication-is-used)
1. [Document datasources](#document-datasources)
1. [Determine whether WebLogic has been customized](#determine-whether-weblogic-has-been-customized)
1. [Determine whether Management over REST is used](#determine-whether-management-over-rest-is-used)
1. [Determine whether a connection to on-premises is needed](#determine-whether-a-connection-to-on-premises-is-needed)
1. [Determine whether JMS Queues or Topics are being used](#determine-whether-jms-queues-or-topics-are-in-use)
1. [Determine whether you are using your own custom created shared Java EE libraries](#determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries)
1. [Determine whether OSGi bundles are used](#determine-whether-osgi-bundles-are-used)
1. [Determine whether your application contains OS-specific code](#determine-whether-your-application-contains-os-specific-code)
1. [Determine whether Oracle Service Bus is being used](#determine-whether-oracle-service-bus-is-in-use)
1. [Determine whether your application is composed of multiple WARs](#determine-whether-your-application-is-composed-of-multiple-wars)
1. [Determine whether your application is packaged as an EAR](#determine-whether-your-application-is-packaged-as-an-ear)
1. [Identify all outside processes/daemons running on the production server(s)](#identify-all-outside-processes-and-daemons-running-on-the-production-servers)
1. [Determine whether your application relies on scheduled jobs](#determine-whether-your-application-relies-on-scheduled-jobs)
1. [Determine whether JCA connectors are used](#determine-whether-jca-connectors-are-used)
1. [Determine whether JAAS is used](#determine-whether-jaas-is-used)
1. [Determine whether WebLogic clustering is used](#determine-whether-weblogic-clustering-is-used)
1. [Determine whether your application uses a Resource Adapter](#determine-whether-your-application-uses-a-resource-adapter)
1. [In-Place Testing](#in-place-testing)

[!INCLUDE [inventory-server-capacity](includes/migration/inventory-server-capacity.md)]

[!INCLUDE [inventory-all-secrets](includes/migration/inventory-all-secrets.md)]

[!INCLUDE [inventory-all-certificates](includes/migration/inventory-all-certificates.md)]

[!INCLUDE [inventory-jndi-resources](includes/migration/inventory-jndi-resources.md)]

[!INCLUDE [domain-configuration](includes/migration/domain-configuration.md)]

[!INCLUDE [determine-whether-session-replication-is-used](includes/migration/determine-whether-session-replication-is-used.md)]

[!INCLUDE [document-datasources](includes/migration/document-datasources.md)]

[!INCLUDE [determine-whether-weblogic-has-been-customized](includes/migration/determine-whether-weblogic-has-been-customized.md)]

[!INCLUDE [determine-whether-management-over-rest-is-used](includes/migration/determine-whether-management-over-rest-is-used.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/migration/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-jms-queues-or-topics-are-in-use](includes/migration/determine-whether-jms-queues-or-topics-are-in-use.md)]

[!INCLUDE [determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries](includes/migration/determine-whether-you-are-using-your-own-custom-created-shared-java-ee-libraries.md)]

[!INCLUDE [determine-whether-osgi-bundles-are-used](includes/migration/determine-whether-osgi-bundles-are-used.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/migration/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [determine-whether-oracle-service-bus-is-in-use](includes/migration/determine-whether-oracle-service-bus-is-in-use.md)]

[!INCLUDE [determine-whether-your-application-is-composed-of-multiple-wars](includes/migration/determine-whether-your-application-is-composed-of-multiple-wars.md)]

[!INCLUDE [determine-whether-your-application-is-packaged-as-an-ear](includes/migration/determine-whether-your-application-is-packaged-as-an-ear.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/migration/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Validate that the supported Java version works correctly

Using WildFly on Azure Kubernetes Service requires a specific version of Java. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a supported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run

```bash
java -version
```

### Determine whether your application relies on scheduled jobs

Scheduled jobs, such as Quartz Scheduler tasks or cron jobs, should NOT be used with Azure Kubernetes Service. Azure Kubernetes Service will not prevent you from deploying an application containing scheduled tasks internally. However, if your application is scaled out, the same scheduled job may run more than once per scheduled period. This situation can lead to unintended consequences.

To execute scheduled jobs on Azure, consider using [Azure Functions with a Timer Trigger](/azure/azure-functions/functions-bindings-timer). You don't need to migrate the job code itself into a function. Instead, the function can invoke a URL in your application to trigger the job.

> [!NOTE]
> To prevent malicious use, you'll likely need to ensure that the job invocation endpoint requires credentials. In this case, the trigger function will need to provide the credentials.

### Determine whether WLST is used

If you currently use WebLogic Scripting Tool (WLST) to perform the deployment, you will need to assess what it is doing. If WLST is changing any (runtime) parameters of your application as part of the deployment, you will need to make sure those parameters conform to one of the following options:

1. They are externalized as app settings.
2. They are embedded in your application.
3. They are using the JBoss CLI during deployment.

If WLST is doing more than what is mentioned above, you will have some additional work to do during migration.

### Determine whether your application uses WebLogic specific APIs

If your application uses WebLogic-specific APIs, you will need to refactor your application to NOT use them. For example, if you have used a class mentioned in the [Java API Reference for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/wlapi/index.html?overview-summary.html), you have used a WebLogic-specific API in your application.

### Determine whether your application uses Entity Beans or EJB 2.x-style CMP Beans

If your application uses Entity Beans or EJB 2.x style CMP beans, it is recommended you refactor your application to NOT use them.

### Determine whether the Java EE Application Client feature is used

If you have client applications that connect to your (server) application using the Java EE Application Client feature, you will need to refactor both your client applications and your (server) application to use HTTP APIs.

### Determine whether a deployment plan was used

If a deployment plan was used to perform the deployment, you'll need to assess what the deployment plan is doing. If the deployment plan is a straight deploy, then you'll be able to deploy your web application without any changes. If the deployment plan is more elaborate, you'll need to determine whether you can use the JBoss CLI to properly configure your application as part of the deployment. If it isn't possible to use the JBoss CLI, you'll need to refactor your application in such a way that a deployment plan is no longer needed.

### Determine whether EJB timers are in use

If your application uses EJB timers, you'll need to validate that the EJB timer code can be triggered by each WildFly instance independently. This validation is needed because, in the Azure Kubernetes Service deployment scenario, each EJB timer will be triggered on its own WildFly instance.

### Validate if and how the file system is used

Any usage of the file system on the application server will require reconfiguration or, in rare cases, architectural changes. File system may be used by WebLogic shared modules or by your application code. You may identify some or all of the following scenarios.

#### Read-only static content

If your application currently serves static content, an alternate location for that static content will be required. You may wish to consider moving [static content to Azure Blob Storage](/azure/storage/blobs/storage-blob-static-website) and [adding Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn#enable-azure-cdn-for-the-storage-account) for lightning-fast downloads globally.

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We have provided [a sample implementation for your use](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, Azure Files can be [mounted into the Azure Kubernetes Service pod](/azure/aks/concepts-storage).

### Determine whether JCA connectors are used

If your application uses JCA connectors you'll have to validate the JCA connector can be used on WildFly. If the JCA implementation is tied to WebLogic, you'll have to refactor your application to NOT use the JCA connector. If it can be used, then you'll need to add the JARs to the server classpath and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

#### Determine whether your application uses a Resource Adapter

If your application needs a Resource Adapter (RA), it needs to be compatible with WildFly. Determine whether the RA works fine on a standalone instance of WildFly by deploying it to the server and properly configuring it. If the RA works properly, you'll need to add the JARs to the server classpath of the Docker image and put the necessary configuration files in the correct location in the WildFly server directories for it to be available.

### Determine whether JAAS is used

If your application is using JAAS, then you'll need to capture how JAAS is configured. If it's using a database, you can convert it to a JAAS domain on WildFly. If it's a custom implementation, you'll need to validate that it can be used on WildFly.

### Determine whether WebLogic clustering is used

Most likely, you've deployed your application on multiple WebLogic servers to achieve high availability. Azure Kubernetes Service is capable of scaling, but if you've used the WebLogic Cluster API, you'll need to refactor your code to eliminate the use of that API.

<!-- shared content -->
### In-Place Testing

Prior to creation of container images, migrate your application to the JDK and WildFly that you intend to use on AKS. Test the application thoroughly to ensure compatibility and performance.
<!-- end shared content -->

## Migration

<!-- shared content -->
### Provision Azure Container Registry and Azure Kubernetes Service

Create a container registry and an Azure Kubernetes cluster whose Service Principal has the Reader role on the registry. Be sure to [choose the appropriate network model](/azure/aks/operator-best-practices-network#choose-the-appropriate-network-model) for your cluster's networking requirements.

```bash
az group create -g $resourceGroup -l eastus
az acr create -g $resourceGroup -n $acrName --sku Standard
az aks create -g $resourceGroup -n $aksName --attach-acr $acrName --network-plugin azure
```
<!-- end shared content -->

### Create a Docker image for WildFly

You will need to create a Dockerfile with the following:

1. A supported JDK
1. An install of WildFly
1. JVM runtime options
1. A way to pass in environment variables (if applicable)
1. A way to use secrets upon deployment (if applicable)
1. A database driver (if applicable)
1. Setup datasources (if applicable)
1. Setup JNDI resources (if applicable)
1. Copy in additional server level libraries (if applicable)

### Build and push the Docker image to Azure Container Registry

Once you have created the Dockerfile you will need to build the Docker image and publish it to your Azure Container Registry.

<!-- shared content -->
### Provision a Public IP Address

If your application is to be accessible from outside your internal or virtual network(s), a public static IP address will be required. This IP address should be provisioned inside cluster's node resource group.

```bash
nodeResourceGroup=$(az aks show -g $resourceGroup -n $aksName --query 'nodeResourceGroup' -o tsv)
publicIp=$(az network public-ip create -g $nodeResourceGroup -n applicationIp --sku Standard --allocation-method Static --query 'publicIp.ipAddress' -o tsv)
echo "Your public IP address is ${publicIp}."
```
<!-- end shared content -->

<!-- shared content -->
### Deploy to AKS

[Create and apply your Kuberntes YAML file(s)](/azure/aks/kubernetes-walkthrough#run-the-application). If creating an external load balancer (whether to your application or to an ingress controller), be sure to provide the IP Address provisioned in the previous section as the `LoadBalancerIP`.

Include [externalized parameters as environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Don't include secrets (such as passwords, API keys, and JDBC connection strings). These are covered in the following section.
<!-- end shared content -->

### Configure Persistent Storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

### Configure KeyVault FlexVolume

[Create an Azure KeyVault](/azure/key-vault/quick-create-cli) and populate all the necessary secrets. Then, configure a KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will need to make sure the startup script used to bootstrap WildFly imports the certificates into the keystore used by WildFly before starting the server.

<!-- shared content -->
### Migrate scheduled jobs

To execute scheduled jobs on your AKS cluster, define [Cron Jobs](https://kubernetes.io/docs/tasks/job/automated-tasks-with-cron-jobs/) as needed.
<!-- end shared content -->

## Post-migration

Now that you have your application migrated to Azure Kubernetes Service you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more cloud-native.

### Recommendations

 <!-- shared content -->
1. Consider [adding a DNS name](/azure/aks/ingress-static-ip#configure-a-dns-name) to your the IP address allocated to your ingress controller or application load balancer.

1. Consider [adding HELM charts for your application](https://helm.sh/docs/topics/charts/). A helm chart allows you to parametrize your application deployment for use and customization by a more diverse set of customers.

1. Design and implement a DevOps strategy. In order to maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

1. Enable [Azure Monitoring for the cluster](/azure/azure-monitor/insights/container-insights-enable-existing-clusters). This allows Azure monitor to collect container logs, track utilization, etc.

1. Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure [Prometheus Metrics scraping in Azure Monitor](/azure/azure-monitor/insights/container-insights-prometheus-integration) instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions.

1. Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

1. Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).<!-- end shared content -->

1. Make sure your deployment file specifies how rolling updates are done.

1. Validate the minimal number of replicas needed for regular load.

1. Setup a Horizontal Pod Autoscaler to deal with peek time loads.

1. Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the JVM parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` in the Dockerfile to further optimize performance.
