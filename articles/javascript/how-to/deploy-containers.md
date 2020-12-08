---
title: Deploy Node.js containers to Azure
description: Use Docker containers to deploy Node.js apps to Azure
ms.topic: how-to
ms.date: 12/07/2020
ms.custom: seo-javascript-september2019, devx-track-js
---

# Deploy Node.js container to Azure 

Building app with containers is a common pattern for scalability. Azure provides several choices for how you can deploy your containers.

## Host your container app on Azure

The following hosting choices allow you to deploy your containered applications.

| Service | Suggested for |
|--|--|
|[App service](/azure/app-service/quickstart-custom-container?pivots=container-linux)|Deploy and run a custom container on Azure App service.|
|[Container Instances](/azure/container-instances/)|Quickly set up a single container.|
|[Container Registry](container-registry/)|Build, store, and manage custom or private container images.|
|[Kubernetes Service](/azure/aks/)|Multi-container orchestrations.|
|[Virtual Machines](/azure/virtual-machines) (VMs)|Full control of a Windows or Linux VM. [Find an endorsed Linux Distribution](/azure/virtual-machines/linux/endorsed-distros?toc=/azure/virtual-machines/linux/toc.json) or [learn how to find](/azure/virtual-machines/linux/cli-ps-findimage) Linux VM images in the Azure Marketplace.|

## Build, containerize, and deploy app to Azure

To get started, follow this [tutorial](develop-nodejs-on-azure.md) to learn how to:

* Download sample code
* Run the Node.js app
* Debug the app in Visual Studio Code
* Containerize the Node.js MEAN app
* Deploy the app using Azure CLI commands
* Create a MongoDB server on a CosmosDB resource
* Add the container image to your private Container registry
* Add custom domain name to your web app
* Scale out your web app to a larger size
* Create and delete a resource group for all the resources

## Next steps

Microsoft Learn modules:

- [Run Docker containers with Azure Container Instances](/learn/modules/run-docker-with-azure-container-instances/)

- [Build and store container images with Azure Container Registry](/learn/modules/build-and-store-container-images/)
