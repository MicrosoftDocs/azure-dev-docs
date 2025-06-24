---
title: Deploy a containerized Python web app on Azure with MongoDB
description: An overview of how to create and deploy a containerized Python web app (Django or Flask) on Azure App Service with MongoDB.
ms.topic: concept-article
ms.date: 03/17/2025
ms.custom: devx-track-python
---

# Overview: Containerized Python web app on Azure with MongoDB

This tutorial series shows you how to containerize a Python web app and then either run it locally or deploy it to [Azure App Service][1]. App Service [Web App for Containers][3] allows you to focus on building your containers without worrying about managing and maintaining an underlying container orchestrator. When you are building web apps, Azure App Service is a good option for taking your first steps with containers. This container web app can use either a local MongoDB instance or [MongoDB for Azure Cosmos DB][2] to store data. For more information about using containers in Azure, see [Comparing Azure container options](/azure/container-apps/compare-options).

In this tutorial you:

* Build and run a [Docker][4] container locally. See [Build and run a containerized Python web app locally](tutorial-containerize-deploy-python-web-app-azure-02.md).

* Build a [Docker][4] container image directly in Azure. See [Build a containerized Python web app in Azure](tutorial-containerize-deploy-python-web-app-azure-03.md).

* Configure an App Service to create a web app based on the Docker container image. See [Deploy a containerized Python app to App Service](tutorial-containerize-deploy-python-web-app-azure-04.md).

After completing the articles in this tutorial series, you'll have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service overview

The service diagram supporting this tutorial shows two environments: developer environment and Azure environment. It highlights the key Azure services used in the development process.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png" alt-text="A screenshot of the services used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png":::

### Developer environment

The components supporting the developer environment in this tutorial include:

* **Local Development System**: A personal computer used for coding, building, and testing the Docker container.

* **Docker Containerization**: Docker is employed to package the app and its dependencies into a portable container.

* **Development Tools**: Includes a code editor and other necessary tools for software development.

* **Local MongoDB Instance**: A local MongoDB database utilized for data storage during development.

* **MongoDB Connection**: Access to the local MongoDB database provided through a connection string.

### Azure environment

The components supporting the Azure environment in this tutorial include:

* [Azure App Service][1]

  * In Azure App Service, Web App for Containers uses the [Docker][4] container technology to provide container hosting of both built-in images and custom images using Docker.
  * Web App for Containers uses a webhook in the Azure Container Registry (ACR) to get notified of new images. When a new image is pushed to the registry, the webhook notification triggers App Service to pull the update and restart the app.

* [Azure Container Registry][11]

  * Azure Container Registry allows you to store and manage Docker images and their components in Azure. It provides a registry located near your deployments in Azure that gives you the ability to control access using your Microsoft Entra groups and permissions.

  * In this tutorial, Azure Container Registry is the registry source, but you can also use Docker Hub or a private registry with minor modifications.

* [Azure Cosmos DB for MongoDB][2]

  * The Azure Cosmos DB for MongoDB is a NoSQL database used in this tutorial for data storage.

  * The containerized application connects to and accesses the Azure Cosmos DB resource using a connection string, which is stored as an environment variable and provided to the app.

## Authentication

In this tutorial, you build a Docker image, either locally or in Azure, and then deploy it to Azure App Service. The App Service pulls the container image from an Azure Container Registry repository.

To securely pull images from the repository, App Service utilizes a system-assigned managed identity. This managed identity grants the web app permissions to interact with other Azure resources, eliminating the need for explicit credentials. For this tutorial, the managed identity is configured during setup of App Service to use a registry container image.

The tutorial sample web app uses MongoDB to store data. The sample code connects to Azure Cosmos DB via a connection string.

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can create:

  * [Azure Container Registry][11]
  * [Azure App Service][1]
  * [Azure Cosmos DB for MongoDB][2] (or access to an equivalent). To create an Azure Cosmos DB for MongoDB database, follow the steps in [part 2 of this tutorial](tutorial-containerize-deploy-python-web-app-azure-02.md).

* [Visual Studio Code][16] or [Azure CLI][17], depending on your tool of choice. If you use Visual Studio Code, you need the [Docker extension][6] and [Azure App Service extension][7].

* These Python packages:

  * [MongoDB Shell (mongosh)][8] for connecting to MongoDB.
  * [Flask][9] or [Django][10] as a web framework.

* [Docker][4] installed locally.

## Sample app

The end result of this tutorial is a restaurant review app, deployed and running in Azure, that looks like the following screenshot.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-web-app-sample-app-screenshot.png" alt-text="A screenshot of the sample app created from the Python containerized web app used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-web-app-sample-app-screenshot.png":::

In this tutorial, you build a Python restaurant review app that utilizes MongoDB for data storage. For an example app using PostgreSQL, see [Create and deploy a Flask web app to Azure with a managed identity](./tutorial-python-managed-identity-cli.md).

## Next step

> [!div class="nextstepaction"]
> [Build and test locally](tutorial-containerize-deploy-python-web-app-azure-02.md)

[1]: https://azure.microsoft.com/services/app-service/
[2]: /azure/cosmos-db/mongodb/mongodb-introduction
[3]: https://azure.microsoft.com/services/app-service/containers/
[4]: https://www.docker.com/
[5]: /azure/active-directory/managed-identities-azure-resources/overview
[6]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker
[7]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice
[8]: https://www.mongodb.com/docs/mongodb-shell/
[9]: https://flask.palletsprojects.com/
[10]: https://www.djangoproject.com/
[11]: https://azure.microsoft.com/services/container-registry/
[12]: /azure/cosmos-db/mongodb/create-mongodb-python
[13]: /azure/cosmos-db/scripts/cli/mongodb/create
[14]: /azure/cosmos-db/scripts/powershell/mongodb/create
[15]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb
[16]: https://code.visualstudio.com/
[17]: /cli/azure/what-is-azure-cli
