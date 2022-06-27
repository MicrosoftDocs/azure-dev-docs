---
title: "Tutorial: Containerized Python web apps on Azure"
description: Overview * Create and deploy a containerized Python web app to Azure
ms.topic: conceptual
ms.date: 06/27/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jess-johnson-msft
ms.author: jejohn
---

# Overview: Containerized Python web apps on Azure

This tutorial shows how to containerize a Python web app and deploy it to Azure. The containerized web app is hosted in [Azure App Service][1] and uses [MongoDB for Azure Cosmos DB][2] to store data. Using [Web App for Containers][3] on Azure allows you to focus on composing your containers without worrying about managing and maintaining an underlying container orchestrator. Use Web App for Containers when you need more control over the runtime, framework, tooling, and packages of a web-based application.

In this tutorial you will:

* Build a [Docker][4] container image from the Python web app code.

* Deploy the container image to App Service

* (Optionally) Run and test the container locally

Following this tutorial, you'll have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Azure services used in this tutorial

The service diagram supporting this tutorial shows the two environments (local and Azure) and the different components used in the tutorial.
	
:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png" alt-text="A screenshot of the services using in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png":::

The components supporting this tutorial and shown in the diagram above are:

* Azure App Service

  * The underlying technology that enables containerization is Web App for Containers.  Azure App Service uses the [Docker][4] container technology to host both built-in images and custom images.  In this tutorial we use a custom image and the Web App for Containers.

  * App Service creates a webhook in the selected registry with the registry as the scope. A docker push to any repository in the registry triggers an app restart. 

* Azure Cosmos DB API for MongoDB

  * The API for MongoDB is our NoSQL database acting in which our tutorial sample app stores data.

  * Access to Cosmos DB resource is via a connection string which can be passed as an environment variable to the containerized app in production.

* Azure Container Registry

  * Azure Container Registry is  resource for working with Docker images and its components in Azure. It provides a registry that's close to your deployments in Azure and that gives you control over access, making it possible to use your Azure Active Directory groups and permissions.

  * In this tutorial, the registry source can be an Azure Container Registry, but you can also use Docker Hub or a private registry.

## Authentication

In this tutorial, you will use Docker locally to build a container image and deploy it to Azure App Service. The App Service pulls a container image from an Azure Container Registry repository.

The App Service uses [managed identity][5] to pull images from Azure Container Registry. Managed identity allows you to grant permissions to the web app to access other Azure resources without needing any specific credentials. Specifically, this tutorial uses a system assigned managed identity. The managed identity is automatically set up for you when you configure App Service so that publish is from a Docker container.

The Python sample web app also uses MongoDB to store data. The sample code connects to Cosmos DB via a connection string. (Azure Cosmos DB doesn't yet support managed identity.)  Other Azure services Azure SQL and Azure Blog Storage support managed identity that would allow you connect without connection strings or keys. For more information, see What are Managed Identities for Azure resources.


## Prerequisites for this tutorial

To complete this tutorial, you'll need:

* An Azure account where you can create:

  * Azure Container Registry
  * App Service 
  * MongoDB for Azure Cosmos DB (or access to equivalent)

* Docker installed locally

* Visual Studio Code or Azure CLI

  * For Visual Studio Code with the [Docker extension][6] and [Azure App Service extension][7].

* Python packages:

  * [PyMongo][8] for connecting to Mongo DB
  * [Flask][9] or [Django][10]

## Sample app

You can start with sample app in the Django and Flask frameworks, or you can follow along using your own Python app. The sample app is a restaurant review app that saves restaurant and review data in MongoDB. At the end of the tutorial you will have a restaurant review app deployed and running in Azure.


[1]: https://azure.microsoft.com/services/app-service/
[2]: /azure/cosmos-db/mongodb/mongodb-introduction
[3]: https://azure.microsoft.com/services/app-service/containers/
[4]: https://www.docker.com/
[5]: /azure/active-directory/managed-identities-azure-resources/overview
[6]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
[7]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice
[8]: https://pypi.org/project/pymongo/
[9]: https://flask.palletsprojects.com/en/2.1.x/
[10]: https://www.djangoproject.com/