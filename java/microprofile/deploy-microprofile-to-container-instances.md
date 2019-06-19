---
title: Deploy a MicroProfile app to the cloud with Docker and Azure
description: Learn how to deploy a MicroProfile app to the cloud using Docker and Azure Container Instances.
services: container-instances;container-retistry
documentationcenter: java
author: brunoborges
manager: routlaw
editor: brunoborges
ms.assetid:
ms.author: brborges
ms.date: 11/21/2018
ms.devlang: java
ms.service: container-instances
ms.tgt_pltfrm: multiple
ms.topic: article
ms.workload: web
---

# Deploy a MicroProfile application to the cloud with Docker and Azure

This article demonstrates how to pack a [MicroProfile.io] application in a Docker container and run it on Azure Container Instances.

> [!NOTE]
>
> This procedure works with any implementation of MicroProfile.io as long the Docker container image is self-executable (i.e. includes the runtime).

## Prerequisites

In order to complete the steps in this tutorial, you will need to have the following prerequisites:

* An Azure subscription; if you don't already have an Azure subscription, you can sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* A supported Java Development Kit (JDK). For more information about the JDKs available for use when developing on Azure, see <https://aka.ms/azure-jdks>.
* Apache's [Maven] build tool (version 3+).
* A [Git] client.

## MicroProfile Hello Azure sample

For this article, we will use the [MicroProfile Hello Azure](https://github.com/azure-samples/microprofile-hello-azure) sample:

### Clone, build, and run locally

```bash
$ git clone https://github.com/Azure-Samples/microprofile-hello-azure.git
$ mvn clean package
...
[INFO] BUILD SUCCESS
...
$ mvn payara-micro:start
...
[2018-07-30T13:34:51.553-0700] [] [INFO] [] [PayaraMicro] [tid: _ThreadID=1 _ThreadName=main] [timeMillis: 1532982891553] [levelValue: 800] Payara Micro  5.182 #badassmicrofish (build 303) ready in 10,304 (ms)
...
```

You can test the application by calling `curl` or visiting through a [browser](http://localhost:8080/api/hello):

```bash
$ curl http://localhost:8080/api/hello
Hello, Azure!
```

## Deploy to Azure

Now let's bring this application to the cloud using [Azure Container Instances] and [Azure Container Registry] services.

### Build a Docker image

The sample project already provides a Dockerfile you can use. You don't need Docker installed though, as we will use Azure Container Registry Build feature to build the image in the cloud.

To build the image and be ready to run on Azure, you will have to follow these steps:

1. Install and log in with Azure CLI
1. Create an Azure Resource Group
1. Create an Azure Container Registry (ACR)
1. Build the Docker image
1. Publish the Docker image to the ACR created before
1. (Optionally) Build and publish to ACR in one command


#### Set up Azure CLI

Make sure you have an Azure subscription, [Azure CLI installed](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), and that you are authenticated to your account:

```bash
az login
```

#### Create a Resource Group

```bash
export ARG=microprofileRG
export ADCL=eastus
az group create --name $ARG --location $ADCL
```

#### Create an Azure Container Registry instance

This command will create a globally unique (hopefully) container registry using a basic name with a random number.

```bash
export RANDINT=`date +"%m%d%y$RANDOM"`
export ACR=mydockerrepo$RANDINT
az acr create --name $ACR -g $ARG --sku Basic --admin-enabled
```

#### Build the Docker image

While you can easily build the Docker image locally using Docker itself, you may want to consider building it in the Cloud for few reasons:

1. No need to install Docker locally
1. Much faster since build will happen elsewhere (except for context upload time)
1. Process in the Cloud has access to faster Internet, therefore faster downloads
1. Image goes directly into the Container Registry

Because of these reasons, we will build the image using the [Azure Container Registry Build] feature:

```bash
export IMG_NAME="mympapp:latest"
az acr build -r $ACR -t $IMG_NAME -g $ARG .
...
Build complete
Build ID: aa1 was successful after 1m2.674577892s
```

#### Deploy Docker Image from Azure Container Registry (ACR) into Container Instances (ACI)

Now that the image is available on your ACR, let's push and instanciate a container instance on ACI. But first, we need to make sure we can authenticate into the ACR:

```bash
export ACR_REPO=`az acr show --name $ACR -g $ARG --query loginServer -o tsv`
export ACR_PASS=`az acr credential show --name $ACR -g $ARG --query "passwords[0].value" -o tsv`
export ACI_INSTANCE=myapp`date +"%m%d%y$RANDOM"`

az container create --resource-group $ARG --name $ACR --image $ACR_REPO/$IMG_NAME --cpu 1 --memory 1 --registry-login-server $ACR_REPO --registry-username $ACR --registry-password $ACR_PASS --dns-name-label $ACI_INSTANCE --ports 8080
```

#### Test Your Deployed MicroProfile Application

Your application should now be up and running. To test it from the command-line, try the following command:

```bash
curl http://$ACI_INSTANCE.$ADCL.azurecontainer.io:8080/api/hello
````

Congratulations! You have successfuly built and deployed a MicroProfile application as a Docker container onto Microsoft Azure.

## Next steps

For more information about the various technologies discussed in this article, see the following articles:

* [Log in to Azure from the Azure CLI](/azure/xplat-cli-connect)

<!-- URL List -->

[Azure Container Registry Build]: https://docs.microsoft.com/azure/container-registry/container-registry-build-overview
[MicroProfile.io]: https://microprofile.io
[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure for Java Developers]: https://docs.microsoft.com/java/azure/
[Azure portal]: https://portal.azure.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Maven]: http://maven.apache.org/
[Java Development Kit (JDK)]: https://aka.ms/azure-jdks
<!-- http://www.oracle.com/technetwork/java/javase/downloads/ -->
[Azure Container Instances]: https://docs.microsoft.com/azure/container-instances/
[Azure Container Registry]:  https://docs.microsoft.com/azure/container-registry