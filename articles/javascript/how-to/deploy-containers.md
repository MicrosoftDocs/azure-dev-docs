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
|[Container Registry](/azure/container-registry/)|Build, store, and manage custom or private container images.|
|[Kubernetes Service](/azure/aks/)|Multi-container orchestrations.|
|[Virtual Machines](/azure/virtual-machines) (VMs)|Full control of a Windows or Linux VM. [Find an endorsed Linux Distribution](/azure/virtual-machines/linux/endorsed-distros?toc=/azure/virtual-machines/linux/toc.json) or [learn how to find](/azure/virtual-machines/linux/cli-ps-findimage) Linux VM images in the Azure Marketplace.|

## Build, containerize, and deploy app to Azure

To get started, select from the list:
* Tutorial: [Express.js](../tutorial/tutorial-vscode-docker-node/tutorial-vscode-docker-node-01.md)
* Tutorial: [Deno](../tutorial/deploy-deno-app-azure-app-service-azure-cli.md)

## Next steps

Microsoft Learn modules:

- [Run Docker containers with Azure Container Instances](/learn/modules/run-docker-with-azure-container-instances/)

- [Build and store container images with Azure Container Registry](/learn/modules/build-and-store-container-images/)
