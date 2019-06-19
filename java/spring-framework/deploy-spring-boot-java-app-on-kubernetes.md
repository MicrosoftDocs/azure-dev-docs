---
title: Deploy a Spring Boot App on Kubernetes in Azure Kubernetes Service
description: This tutorial will walk you though the steps to deploy a Spring Boot application in a Kubernetes cluster on Microsoft Azure.
services: container-service
documentationcenter: java
author: rmcmurray
manager: mbaldwin
editor: ''
ms.assetid: 
ms.author: robmcm
ms.date: 12/19/2018
ms.devlang: java
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: na
ms.custom: mvc
---

# Deploy a Spring Boot Application on a Kubernetes Cluster in the Azure Kubernetes Service

**[Kubernetes]** and **[Docker]** are open-source solutions that help developers automate the deployment, scaling, and management of their applications running in containers.

This tutorial walks you through combining these two popular, open-source technologies to develop and deploy a Spring Boot application to Microsoft Azure. More specifically, you use *[Spring Boot]* for application development, *[Kubernetes]* for container deployment, and the [Azure Kubernetes Service (AKS)] to host your application.

### Prerequisites

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.
>

## Create the Spring Boot on Docker Getting Started web app

The following steps walk you through building a Spring Boot web application and testing it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:
   ```
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory.
   ```
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project.
   ```
   cd gs-spring-boot-docker
   cd complete
   ```

1. Use Maven to build and run the sample app.
   ```
   mvn package spring-boot:run
   ```

1. Test the web app by browsing to `http://localhost:8080`, or with the following `curl` command:
   ```
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
   # set the default name for Azure Container Registry, otherwise you will need to specify the name in "az acr login"
   az configure --defaults acr=wingtiptoysregistry
   az acr login
   ```

1. Navigate to the completed project directory for your Spring Boot application (for example, "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the registry name for your Azure Container Registry and the latest version of [jib-maven-plugin](https://github.com/GoogleContainerTools/jib/tree/master/jib-maven-plugin).

   ```xml
   <properties>
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <jib-maven-plugin.version>1.2.0</jib-maven-plugin.version>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the *pom.xml* file so that the `<plugin>` contains the `jib-maven-plugin`.

   ```xml
   <plugin>
     <artifactId>jib-maven-plugin</artifactId>
     <groupId>com.google.cloud.tools</groupId>
     <version>${jib-maven-plugin.version}</version>
     <configuration>
        <from>
            <image>openjdk:8-jre-alpine</image>
        </from>
        <to>
            <image>${docker.image.prefix}/${project.artifactId}</image>
        </to>
     </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to build the image and push the image to the registry:

   ```cmd
   mvn compile jib:build
   ```

> [!NOTE]
>
> Due to the security concern of Azure Cli and Azure Container Registry, the credential created by `az acr login` is valid for 1 hour, if you meet *401 Unauthorized* error, you can run the `az acr login -n <your registry name>` command again to reauthenticate.
>

## Create a Kubernetes Cluster on AKS using the Azure CLI

1. Create a Kubernetes cluster in Azure Kubernetes Service. The following command creates a *kubernetes* cluster in the *wingtiptoys-kubernetes* resource group, with *wingtiptoys-akscluster* as the cluster name, and *wingtiptoys-kubernetes* as the DNS prefix:
   ```azurecli
   az aks create --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-akscluster \ 
    --dns-name-prefix=wingtiptoys-kubernetes --generate-ssh-keys
   ```
   This command may take a while to complete.

1. When you're using Azure Container Registry (ACR) with Azure Kubernetes Service (AKS), you need to grant Azure Kubernetes Service pull access to Azure Container Registry. Azure creates a default service principal when you are creating Azure Kubernetes Service. Please run the following scripts in bash or Powershell to grant AKS access to ACR, see more details at [Authenticate with Azure Container Registry from Azure Kubernetes Service].

```bash
   # Get the id of the service principal configured for AKS
   CLIENT_ID=$(az aks show -g wingtiptoys-kubernetes -n wingtiptoys-akscluster --query "servicePrincipalProfile.clientId" --output tsv)
   
   # Get the ACR registry resource id
   ACR_ID=$(az acr show -g wingtiptoys-kubernetes -n wingtiptoysregistry --query "id" --output tsv)
   
   # Create role assignment
   az role assignment create --assignee $CLIENT_ID --role acrpull --scope $ACR_ID
```

  -- or --

```PowerShell
   # Get the id of the service principal configured for AKS
   $CLIENT_ID = az aks show -g wingtiptoys-kubernetes -n wingtiptoys-akscluster --query "servicePrincipalProfile.clientId" --output tsv
   
   # Get the ACR registry resource id
   $ACR_ID = az acr show -g wingtiptoys-kubernetes -n wingtiptoysregistry --query "id" --output tsv
   
   # Create role assignment
   az role assignment create --assignee $CLIENT_ID --role acrpull --scope $ACR_ID
```

1. Install `kubectl` using the Azure CLI. Linux users may have to prefix this command with `sudo` since it deploys the Kubernetes CLI to `/usr/local/bin`.
   ```azurecli
   az aks install-cli
   ```

1. Download the cluster configuration information so you can manage your cluster from the Kubernetes web interface and `kubectl`. 
   ```azurecli
   az aks get-credentials --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-akscluster
   ```

## Deploy the image to your Kubernetes cluster

This tutorial deploys the app using `kubectl`, then allow you to explore the deployment through the Kubernetes web interface.

### Deploy with kubectl

1. Open a command prompt.

1. Run your container in the Kubernetes cluster by using the `kubectl run` command. Give a service name for your app in Kubernetes and the full image name. For example:
   ```
   kubectl run gs-spring-boot-docker --image=wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest
   ```
   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `run` command

   * The `--image` parameter specifies the combined login server and image name as `wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest`

1. Expose your Kubernetes cluster externally by using the `kubectl expose` command. Specify your service name, the public-facing TCP port used to access the app, and the internal target port your app listens on. For example:
   ```
   kubectl expose deployment gs-spring-boot-docker --type=LoadBalancer --port=80 --target-port=8080
   ```
   In this command:

   * The container name `gs-spring-boot-docker` is specified immediately after the `expose deployment` command

   * The `--type` parameter specifies that the cluster uses load balancer

   * The `--port` parameter specifies the public-facing TCP port of 80. You access the app on this port.

   * The `--target-port` parameter specifies the internal TCP port of 8080. The load balancer forwards requests to your app on this port.

1. Once the app is deployed to the cluster, query the external IP address and open it in your web browser:

   ```
   kubectl get services -o jsonpath={.items[*].status.loadBalancer.ingress[0].ip} --namespace=default
   ```

   ![Browse Sample App on Azure][SB02]



### Deploy with the Kubernetes web interface

1. Open a command prompt.

1. Open the configuration website for your Kubernetes cluster in your default browser:
   ```
   az aks browse --resource-group=wingtiptoys-kubernetes --name=wingtiptoys-akscluster
   ```

1. When the Kubernetes configuration website opens in your browser, click the link to **deploy a containerized app**:

   ![Kubernetes Configuration Website][KB01]

1. When the **Resource Creation** page is displayed, specify the following options:

   a. Select **CREATE AN APP**.

   b. Enter your Spring Boot application name for the **App name**; for example: "*gs-spring-boot-docker*".

   c. Enter your login server and container image from earlier for the **Container image**; for example: "*wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest*".

   d. Choose **External** for the **Service**.

   e. Specify your external and internal ports in the **Port** and **Target port** text boxes.

   ![Kubernetes Configuration Website][KB02]


1. Click **Deploy** to deploy the container.

   ![Kubernetes Deploy][KB05]

1. Once your application has been deployed, you will see your Spring Boot application listed under **Services**.

   ![Kubernetes Services][KB06]

1. If you click the link for **External endpoints**, you can see your Spring Boot application running on Azure.

   ![Kubernetes Services][KB07]

   ![Browse Sample App on Azure][SB02]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](/java/azure/spring-framework)

### Additional Resources

For more information about using Spring Boot on Azure, see the following article:

* [Deploy a Spring Boot Application to the Azure App Service](deploy-spring-boot-java-web-app-on-azure.md)

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For more information about deploying a Java application to Kubernetes with Visual Studio Code, see [Visual Studio Code Java Tutorials].

For more information about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

The following links provide additional information about creating Spring Boot applications:

* For more information about creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

The following links provide additional information about using Kubernetes with Azure:

* [Get started with a Kubernetes cluster in Azure Kubernetes Service](/azure/aks/intro-kubernetes)

More information about using Kubernetes command-line interface is available in the **kubectl** user guide at <https://kubernetes.io/docs/user-guide/kubectl/>.

The Kubernetes website has several articles that discuss using images in private registries:

* [Configuring Service Accounts for Pods]
* [Namespaces]
* [Pulling an Image from a Private Registry]

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

For more information about iteratively running and debugging containers directly in Azure Kubernetes Service (AKS) with Azure Dev Spaces, see [Get started on Azure Dev Spaces with Java]

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Kubernetes Service (AKS)]: https://azure.microsoft.com/services/kubernetes-service/
[Azure for Java Developers]: /java/azure/
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service-web/app-service-linux-using-custom-docker-image
[Docker]: https://www.docker.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Working with Azure DevOps and Java]: /azure/devops/java/
[Kubernetes]: https://kubernetes.io/
[Kubernetes Command-Line Interface (kubectl)]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/
[Configuring Service Accounts for Pods]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/
[Namespaces]: https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
[Pulling an Image from a Private Registry]: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/

[Java Development Kit (JDK)]: https://aka.ms/azure-jdks
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->

<!-- Newly added -->
[Authenticate with Azure Container Registry from Azure Kubernetes Service]: /azure/container-registry/container-registry-auth-aks/
[Visual Studio Code Java Tutorials]: https://code.visualstudio.com/docs/java/java-kubernetes/
[Get started on Azure Dev Spaces with Java]: https://docs.microsoft.com/en-us/azure/dev-spaces/get-started-java
<!-- IMG List -->

[SB01]: ./media/deploy-spring-boot-java-app-on-kubernetes/SB01.png
[SB02]: ./media/deploy-spring-boot-java-app-on-kubernetes/SB02.png

[AR01]: ./media/deploy-spring-boot-java-app-on-kubernetes/AR01.png
[AR02]: ./media/deploy-spring-boot-java-app-on-kubernetes/AR02.png
[AR03]: ./media/deploy-spring-boot-java-app-on-kubernetes/AR03.png
[AR04]: ./media/deploy-spring-boot-java-app-on-kubernetes/AR04.png

[KB01]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB01.png
[KB02]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB02.png
[KB03]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB03.png
[KB04]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB04.png
[KB05]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB05.png
[KB06]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB06.png
[KB07]: ./media/deploy-spring-boot-java-app-on-kubernetes/KB07.png
