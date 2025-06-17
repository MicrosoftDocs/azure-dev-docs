---
title: Deploy Spring Boot Application to Azure Kubernetes Service
description: This tutorial will walk you though the steps to deploy a Spring Boot application in a Kubernetes cluster on Microsoft Azure.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.date: 08/28/2024
ms.topic: install-set-up-deploy
ms.custom: mvc, devx-track-java, devx-track-azurecli, spring-cloud-azure, devx-track-extended-java
---

# Deploy Spring Boot Application to Azure Kubernetes Service

> [!NOTE]
> For Spring Boot applications, we recommend using Azure Container Apps. However, you can still choose to use Azure Kubernetes Service as a destination. For more information, see [Choose the right Azure services for your Java applications](../get-started/choose.md).

This tutorial walks you through combining Kubernetes and Docker to develop and deploy a Spring Boot application to Microsoft Azure. More specifically, you use [Spring Boot] for application development, [Kubernetes] for container deployment, and [Azure Kubernetes Service (AKS)] to host your application.

[Kubernetes] and [Docker] are open-source solutions that help developers automate the deployment, scaling, and management of their applications running in containers.

## Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see [Java support on Azure and Azure Stack](../fundamentals/java-support-on-azure.md).
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.
* The [ACR Docker credential helper](https://github.com/Azure/acr-docker-credential-helper).

> [!NOTE]
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.

## Create the Spring Boot on Docker Getting Started web app

The following steps walk you through building a Spring Boot web application and testing it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:

   ```bash
   mkdir C:\SpringBoot
   cd C:\SpringBoot
   ```

   -- or --

   ```bash
   mkdir /users/$USER/SpringBoot
   cd /users/$USER/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory.

   ```bash
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project.

   ```bash
   cd gs-spring-boot-docker
   cd complete
   ```

1. Use Maven to build and run the sample app.

   ```bash
   mvn package spring-boot:run
   ```

1. Test the web app by browsing to `http://localhost:8080`, or with the following `curl` command:

   ```bash
   curl http://localhost:8080
   ```

1. You should see the following message displayed: **Hello Docker World**

   ![Browse Sample App Locally][SB01]

## Create an Azure Container Registry using the Azure CLI

1. Open a command prompt.

1. Log in to your Azure account:

   ```azurecli
   az login
   ```

1. Choose your Azure Subscription:

   ```azurecli
   az account set -s <YourSubscriptionID>
   ```

1. Create a resource group for the Azure resources used in this tutorial.

   ```azurecli
   az group create --name=wingtiptoys-kubernetes --location=eastus
   ```

1. Create a private Azure container registry in the resource group. The tutorial pushes the sample app as a Docker image to this registry in later steps. Replace `wingtiptoysregistry` with a unique name for your registry.

   ```azurecli
   az acr create --resource-group wingtiptoys-kubernetes --location eastus \
    --name wingtiptoysregistry --sku Basic
   ```

## Push your app to the container registry via Jib

1. Log in to your Azure Container Registry from the Azure CLI.

   ```azurecli
   # set the default name for Azure Container Registry, otherwise you need to specify the name in "az acr login"
   az config set defaults.acr=wingtiptoysregistry
   az acr login
   ```

1. Open the **pom.xml** file with a text editor; for example [Visual Studio Code](https://code.visualstudio.com/docs).

   ```bash
   code pom.xml
   ```

1. Update the `<properties>` collection in the **pom.xml** file with the registry name for your Azure Container Registry and the latest version of [jib-maven-plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

   ```xml
   <properties>
      <!-- Note: If your ACR name contains upper case characters, be sure to convert them to lower case characters. -->
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <jib-maven-plugin.version>2.5.2</jib-maven-plugin.version>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the **pom.xml** file so that the `<plugin>` element contains an entry for the `jib-maven-plugin`, as shown in the following example. Note that we are using a base image from the Microsoft Container Registry (MCR): `mcr.microsoft.com/openjdk/jdk:11-ubuntu`, which contains an officially supported JDK for Azure. For other MCR base images with officially supported JDKs, see [Install the Microsoft Build of OpenJDK.](/java/openjdk/containers).

   ```xml
   <plugin>
     <artifactId>jib-maven-plugin</artifactId>
     <groupId>com.google.cloud.tools</groupId>
     <version>${jib-maven-plugin.version}</version>
     <configuration>
        <from>
            <image>mcr.microsoft.com/openjdk/jdk:11-ubuntu</image>
        </from>
        <to>
            <image>${docker.image.prefix}/gs-spring-boot-docker</image>
        </to>
     </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to build the image and push the image to the registry:

   ```azurecli
   az acr login && mvn compile jib:build
   ```

> [!NOTE]
> Due to the security concern of Azure Cli and Azure Container Registry, the credential created by `az acr login` is valid for 1 hour. If you see a `401 Unauthorized` error, you can run the `az acr login --name <your registry name>` command again to reauthenticate. If you see a `Read timed out` error, you can try increasing timeouts with `mvn -Djib.httpTimeout=7200000 jib:dockerBuild`, or `-Djib.httpTimeout=0` for an infinite timeout.

## Create a Kubernetes Cluster on AKS using the Azure CLI

1. Create a Kubernetes cluster in Azure Kubernetes Service. The following command creates a kubernetes cluster in the `wingtiptoys-kubernetes` resource group, with `wingtiptoys-akscluster` as the cluster name, with Azure Container Registry (ACR) `wingtiptoysregistry` attached, and `wingtiptoys-kubernetes` as the DNS prefix:

   ```azurecli
   az aks create --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-akscluster \
    --attach-acr wingtiptoysregistry \
    --dns-name-prefix=wingtiptoys-kubernetes --generate-ssh-keys
   ```

   This command may take a while to complete.

1. Install `kubectl` using the Azure CLI. Linux users may have to prefix this command with `sudo` since it deploys the Kubernetes CLI to `/usr/local/bin`.

   ```azurecli
   az aks install-cli
   ```

1. Download the cluster configuration information so you can manage your cluster from the Kubernetes web interface and `kubectl`. 

   ```azurecli
   az aks get-credentials --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-akscluster
   ```

## Deploy the image to your Kubernetes cluster

This tutorial deploys the app using `kubectl`, then allows you to explore the deployment through the Kubernetes web interface.

### Deploy with kubectl

1. Open a command prompt.

1. Run your container in the Kubernetes cluster by using the `kubectl run` command. Give a service name for your app in Kubernetes and the full image name. For example:

   ```bash
   kubectl run gs-spring-boot-docker --image=wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest
   ```

   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `run` command

   * The `--image` parameter specifies the combined login server and image name as `wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest`

1. Expose your Kubernetes cluster externally by using the `kubectl expose` command. Specify your service name, the public-facing TCP port used to access the app, and the internal target port your app listens on. For example:

   ```bash
   kubectl expose pod gs-spring-boot-docker --type=LoadBalancer --port=80 --target-port=8080
   ```

   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `expose pod` command.

   * The `--type` parameter specifies that the cluster uses load balancer.

   * The `--port` parameter specifies the public-facing TCP port of 80. You access the app on this port.

   * The `--target-port` parameter specifies the internal TCP port of 8080. The load balancer forwards requests to your app on this port.

1. Once the app is deployed to the cluster, query the external IP address and open it in your web browser:

   ```bash
   kubectl get services -o=jsonpath='{.items[*].status.loadBalancer.ingress[0].ip}'
   ```

   ![Browse Sample App on Azure][SB02]

### Deploy with the Kubernetes resource view

1. Select **Add** from any of the resource views (Namespace, Workloads, Services and ingresses, Storage, or Configuration).

   :::image type="content" source="media/deploy-spring-boot-java-app-on-kubernetes/KR01.png" alt-text="Kubernetes resources view.":::


1. Paste in the following YAML:

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: gs-spring-boot-docker
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: gs-spring-boot-docker
     template:
       metadata:
         labels:
           app: gs-spring-boot-docker
       spec:
         containers:
         - name: gs-spring-boot-docker
           image: wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest
   ```

1. Select **Add** at the bottom of the YAML editor to deploy the application.

   :::image type="content" source="media/deploy-spring-boot-java-app-on-kubernetes/KR02.png" alt-text="Kubernetes resources view, add resource.":::

   After deploying the `Deployment`, just like above, select **Add** at the bottom of the YAML editor to deploy `Service` using the following YAML:

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: gs-spring-boot-docker
   spec:
     type: LoadBalancer
     ports:
     - port: 80
       targetPort: 8080
     selector:
       app: gs-spring-boot-docker
   ```

1. Once the YAML file is added, the resource viewer shows your Spring Boot application. The external service includes a linked external IP address so you can easily view the application in your browser.

   :::image type="content" source="media/deploy-spring-boot-java-app-on-kubernetes/KR03.png" alt-text="Kubernetes resources view, services list.":::

   :::image type="content" source="media/deploy-spring-boot-java-app-on-kubernetes/KR04.png" alt-text="Kubernetes resources view, services list, external endpoints highlighted.":::

1. Select **External IP**. You'll then see your Spring Boot application running on Azure.

   ![Browse Sample App on Azure][SB02]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### See also

For more information about using Spring Boot on Azure, see the following article:

* [Deploy a Spring Boot application to Linux on Azure App Service](deploy-spring-boot-java-app-on-linux.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For more information about deploying a Java application to Kubernetes with Visual Studio Code, see [Visual Studio Code Java Tutorials].

For more information about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

The following links provide additional information about creating Spring Boot applications:

* For more information about creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

The following links provide additional information about using Kubernetes with Azure:

* [Get started with a Kubernetes cluster in Azure Kubernetes Service](/azure/aks/intro-kubernetes)

More information about using Kubernetes command-line interface is available in the **kubectl** user guide at <https://kubernetes.io/docs/reference/kubectl/>.

The Kubernetes website has several articles that discuss using images in private registries:

* [Configuring Service Accounts for Pods]
* [Namespaces]
* [Pulling an Image from a Private Registry]

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

For more information about iteratively running and debugging containers directly in Azure Kubernetes Service (AKS) with Azure Dev Spaces, see [Get started on Azure Dev Spaces with Java]

<!-- URL List -->
[kubectl create clusterrolebinding]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-clusterrolebinding-em-
[dashboard-authentication]: https://github.com/kubernetes/dashboard/wiki/Access-control
[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Kubernetes Service (AKS)]: https://azure.microsoft.com/services/kubernetes-service/
[Azure for Java Developers]: ../index.yml
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service/tutorial-custom-container
[Docker]: https://www.docker.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops-project/azure-devops-project-java
[Kubernetes]: https://kubernetes.io/
[Kubernetes Command-Line Interface (kubectl)]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: https://spring.io/projects/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/
[Configuring Service Accounts for Pods]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
[Namespaces]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[Pulling an Image from a Private Registry]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

[Java Development Kit (JDK)]: ../fundamentals/java-support-on-azure.md
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- Newly added -->
[Authenticate with Azure Container Registry from Azure Kubernetes Service]: /azure/container-registry/container-registry-auth-aks/
[Visual Studio Code Java Tutorials]: https://code.visualstudio.com/docs/java/java-kubernetes/
[Get started on Azure Dev Spaces with Java]: /azure/dev-spaces/get-started-java
<!-- IMG List -->

[SB01]: media/deploy-spring-boot-java-app-on-kubernetes/SB01.png
[SB02]: media/deploy-spring-boot-java-app-on-kubernetes/SB02.png
