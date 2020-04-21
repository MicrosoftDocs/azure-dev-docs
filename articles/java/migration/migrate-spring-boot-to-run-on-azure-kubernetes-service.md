---
title: Migrate Spring Boot Applications to run on Azure Kubernetes Service
description: This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run in an Azure Kubernetes Service container.
author: mriem
ms.author: manriem
ms.topic: conceptual
ms.date: 4/10/2020
---

# Migrate Spring Boot Applications to run on Azure Kubernetes Service

This guide describes what you should be aware of when you want to migrate an existing Spring Boot application to run on Azure Kubernetes Service (AKS).

## Pre-migration

### Validate that the supported Java version works correctly

We recommend to use a supported version of Java when running a Spring Boot application on Azure Kubernetes Service. Therefore, you'll need to validate that your application is able to run correctly using that supported version. This validation is especially important if your current server is using a non supported version of Java (such as Oracle JDK or IBM OpenJ9).

To obtain your current version, sign in to your production server and run the following command:

```bash
java -version
```

### Determine whether and how the file system is used

Any usage of the file system by your Spring Boot application will require reconfiguration or, in rare cases, architectural changes. You may identify some or all of the scenarios described in the following sections.

#### Read-only static content

If your application currently serves static content, you'll need an alternate location for it. You may wish to consider moving static content to Azure Blob Storage and adding Azure CDN for lightning-fast downloads globally. For more information, see [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website) and [Quickstart: Integrate an Azure storage account with Azure CDN](/azure/cdn/cdn-create-a-storage-account-with-cdn).

#### Dynamically published static content

If your application allows for static content that is uploaded/produced by your application but is immutable after its creation, you can use Azure Blob Storage and Azure CDN as described above, with an Azure Function to handle uploads and CDN refresh. We've provided a sample implementation for your use at [Uploading and CDN-preloading static content with Azure Functions](https://github.com/Azure-Samples/functions-java-push-static-contents-to-cdn).

#### Dynamic or internal content

For files that are frequently written and read by your application (such as temporary data files), or static files that are visible only to your application, you can mount Azure Storage shares as persistent volumes. For more information, see [Dynamically create and use a persistent volume with Azure Files in Azure Kubernetes Service](/azure/aks/azure-files-dynamic-pv).

[!INCLUDE [determine-whether-your-application-relies-on-scheduled-jobs](includes/determine-whether-your-application-relies-on-scheduled-jobs.md)]

[!INCLUDE [determine-whether-a-connection-to-on-premises-is-needed](includes/determine-whether-a-connection-to-on-premises-is-needed.md)]

[!INCLUDE [determine-whether-your-application-contains-os-specific-code](includes/determine-whether-your-application-contains-os-specific-code.md)]

[!INCLUDE [identify-all-outside-processes-and-daemons-running-on-the-production-servers](includes/identify-all-outside-processes-and-daemons-running-on-the-production-servers.md)]

### Upgrade to the lastest Spring Boot version

If you are using a 1.x version of Spring Boot it is highly recommended to upgrade to the latest version before migrating to Azure Kubernetes Service. See [Spring Boot 2.0 migration guide](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.0-Migration-Guide)

### In-place testing

Before you create container images, migrate your application to the JDK and Spring Boot version that you intend to use on AKS. Test your application thoroughly to ensure compatibility and performance.

## Migration

[!INCLUDE [provision-azure-container-registry-and-azure-kubernetes-service](includes/provision-azure-container-registry-and-azure-kubernetes-service.md)]

### Create a Docker image for Spring Boot

To create a Dockerfile, you'll need the following prerequisites:

* A supported JDK
* Your JVM runtime options.
* A way to pass in environment variables (if applicable).

You can then perform the steps described in the following sections, where applicable. You can use the [Spring Boot Container Quickstart repo](https://github.com/Azure/spring-boot-container-quickstart) as a starting point for your Dockerfile and your Spring Boot application.

Secrets are covered in the [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume) section.

1. [Configure KeyVault FlexVolume](#configure-keyvault-flexvolume)

#### Configure KeyVault FlexVolume

Create an Azure KeyVault and populate all the necessary secrets. For more information, see [Quickstart: Set and retrieve a secret from Azure Key Vault using Azure CLI](/azure/key-vault/quick-create-cli). Then, configure a [KeyVault FlexVolume](https://github.com/Azure/kubernetes-keyvault-flexvol/blob/master/README.md) to make those secrets accessible to pods.

You will also need to update the startup script used to bootstrap your Spring Boot application. This script must import the certificates into the keystore used by Spring Boot before starting the application.

### Build and push the Docker image to Azure Container Registry

After you've created the Dockerfile, you'll need to build the Docker image and publish it to your Azure container registry.

If you used our [Spring Boot Container Quickstart GitHub repo](https://github.com/Azure/spring-boot-container-quickstart), the process of building and pushing your image to your Azure container registry would be the equivalent of invoking the following three commands.

In these examples, the `MY_ACR` environment variable holds the name of your Azure container registry and the `MY_APP_NAME` variable holds the name of the web application you want to use on your Azure container registry.

Build the deployment file:

```shell
mvn package
```

Log into your Azure container registry:

```shell
az acr login -n ${MY_ACR}
```

Build and push the image:

```shell
az acr build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME} .
```

Alternatively, you can use Docker CLI to first build and test the image locally, as shown in the following commands. This approach can simplify testing and refining the image before initial deployment to ACR. However, it requires you to install the Docker CLI and ensure the Docker daemon is running.

Build the image:

```shell
docker build -t ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Run the image locally:

```shell
docker run -it -p 8080:8080 ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

Your can now access your application at [http://localhost:8080](http://localhost:8080).

Log into your Azure container registry:

```shell
az acr login -n ${MY_ACR}
```

Push the image to your Azure container registry:

```shell
docker push ${MY_ACR}.azurecr.io/${MY_APP_NAME}
```

For more in-depth information on building and storing container images in Azure, see the Learn module [Build and store container images with Azure Container Registry](/learn/modules/build-and-store-container-images/).

If you do not require any customization of your Docker image, you could alternatively explore the use of the [Maven Jib plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin), or see [Deploy Spring Boot Application to the Azure Kubernetes Service](/azure/java/spring-framework/deploy-spring-boot-java-app-on-kubernetes) for more information.

[!INCLUDE [provision-a-public-ip-address](includes/provision-a-public-ip-address.md)]

### Deploy to AKS

Create and apply your Kubernetes YAML file(s). For more information, see [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](/azure/aks/kubernetes-walkthrough#run-the-application). If you're creating an external load balancer (whether for your application or for an ingress controller), be sure to provide the IP address provisioned in the previous section as the `LoadBalancerIP`.

Include externalized parameters as environment variables. For more information, see [Define Environment Variables for a Container](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/).

Be sure to include memory and CPU settings when creating your deployment YAML so your containers are properly sized.

### Configure persistent storage

If your application requires non-volatile storage, configure one or more [Persistent Volumes](/azure/aks/azure-disks-dynamic-pv).

[!INCLUDE [migrate-scheduled-jobs-aks](includes/migrate-scheduled-jobs-aks.md)]

## Post-migration

Now that you have migrated your application to Azure Kubernetes Service, you should verify that it works as you expect. After you've done that, we have some recommendations for you that can make your application more cloud-native.

Now that you've migrated your application to AKS, you should verify that it works as you expect. Once you've done that, we have some recommendations for you that can make your application more Cloud native.

### Recommendations

* Consider [adding a DNS name](/azure/aks/ingress-static-ip#configure-a-dns-name) to the IP address allocated to your ingress controller or application load balancer.

* Consider [adding HELM charts for your application](https://helm.sh/docs/topics/charts/). A helm chart allows you to parameterize your application deployment for use and customization by a more diverse set of customers.

* Design and implement a DevOps strategy. To maintain reliability while increasing your development velocity, consider [automating deployments and testing with Azure Pipelines](/azure/devops/pipelines/ecosystems/kubernetes/aks-template).

* Enable [Azure Monitoring for the cluster](/azure/azure-monitor/insights/container-insights-enable-existing-clusters) to allow the collection of container logs, track utilization, and so on.

* Consider exposing application-specific metrics via Prometheus. Prometheus is an open-source metrics framework broadly adopted in the Kubernetes community. You can configure [Prometheus Metrics scraping in Azure Monitor](/azure/azure-monitor/insights/container-insights-prometheus-integration) instead of hosting your own Prometheus server to enable metrics aggregation from your applications and automated response to or escalation of aberrant conditions.

* Design and implement a business continuity and disaster recovery strategy. For mission-critical applications, consider a [multi-region deployment architecture](/azure/aks/operator-best-practices-multi-region).

* Review the [Kubernetes Version Support policy](/azure/aks/supported-kubernetes-versions#kubernetes-version-support-policy). It's your responsibility to keep [updating your AKS cluster](/azure/aks/upgrade-cluster) to ensure it's always running a supported version.

* Have all team members responsible for cluster administration and application development review the pertinent [AKS best practices](/azure/aks/best-practices).

* Make sure your deployment file specifies how rolling updates are done. For more information, see [Rolling Update Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) in the Kubernetes documentation.

* Set up auto scaling to deal with peak time loads. For more information, see [Automatically scale a cluster to meet application demands on AKS](/azure/aks/cluster-autoscaler).

* Consider [monitoring the code cache size](https://docs.oracle.com/javase/8/embedded/develop-apps-platforms/codecache.htm) and adding the parameters `-XX:InitialCodeCacheSize` and `-XX:ReservedCodeCacheSize` to the `JAVA_OPTS` variable in the Dockerfile to further optimize performance.
