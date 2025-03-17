---
title: Deploy a containerized Python web app on Azure with MongoDB
description: An overview of how to create and deploy a containerized Python web app (Django or Flask) on Azure App Service with MongoDB.
ms.topic: conceptual
ms.date: 03/17/2025
ms.custom: devx-track-python
---

# Overview: Containerized Python web app on Azure with MongoDB

This tutorial guides you through containerizing a Python web app and deploying it to Azure. [Azure App Service][1] hosts the single container web app and uses [MongoDB for Azure Cosmos DB][2] to store data. With App Service [Web App for Containers][3], you can focus on building and deploying your containers without worrying about managing and maintaining an underlying container orchestrator. When you are developing web apps, Azure App Service is a good option for taking your first steps with containers. For more information about Azure container options, see [Comparing Azure container options](/azure/container-apps/compare-options).

In this tutorial you:

* Build and run a [Docker][4] container locally. *This step is optional.*

* Build a [Docker][4] container image directly in Azure.

* Configure an App Service to create a web app based on the Docker container image.

Upon completion of this tutorial, you have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service overview

The service diagram supporting this tutorial shows two environments: developer environment and Azure. It highlights the key Azure services used in the development process.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png" alt-text="A screenshot of the services used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png":::

### Developer environment

The components supporting the developer environment in this tutorial include:

* **Local Development System**: A personal computer used for coding, building, and testing the Docker container.
* **Docker Containerization**: Docker is employed to package the application and its dependencies into a portable container.
* **Development Tools**: Includes a code editor and other necessary tools for software development.
* **Local MongoDB Instance**: A local MongoDB database is utilized for data storage during development.
* **MongoDB Connection**: Access to the local MongoDB database is provided through a connection string.

### Azure environment

The components supporting the Azure environment in this tutorial include:

* [Azure App Service][1]

  * Web App for Containers in Azure App Service uses the [Docker][4] container technology to provide container hosting of both built-in images and custom images using Docker.
  * Web App for Containers uses a webhook in the Azure Container Registry (ACR) to get notified of new images. When a new image is pushed to the registry, the webhook notification triggers App Service to pull the update and restart the application.

* [Azure Container Registry][11]

  * Azure Container Registry allows you to store and manage Docker images and their components in Azure. It provides a registry located near your deployments in Azure, giving you the ability to control over access using your Microsoft Entra groups and permissions.

  * In this tutorial, Azure Container Registry is the registry source, but you can also use Docker Hub or a private registry with minor modifications.

* [Azure Cosmos DB for MongoDB][2]

  * The Azure Cosmos DB for MongoDB is a NoSQL database that is utilized in this tutorial for data storage.

  * The containerized application accesses the Azure Cosmos DB resource through a connection string, which is provided as an environment variable.

  * Access to Azure Cosmos DB resource by the containerized application is via a connection string, which is passed as an environment variable to the containerized app.

## Authentication

In this tutorial, you build a Docker image, either locally or directly in Azure, and then deploy it to Azure App Service. The App Service pulls the container image from an Azure Container Registry repository.

To securely pull images from the repository, App Service utilizes a system-assigned managed identity. This managed identity grants the web app permissions to interact with other Azure resources, eliminating the need for explicit credentials. For this tutorial, the managed identity is configured during setup of App Service to use a registry container image.

The tutorial sample web app uses MongoDB to store data. The sample code connects to Azure Cosmos DB via a connection string.

## Prerequisites

To complete this tutorial, you need:

* An Azure account where you can create:

  * [Azure Container Registry][11]
  * [Azure App Service][1]
  * [Azure Cosmos DB for MongoDB][2] (or access to an equivalent). To create an Azure Cosmos DB for MongoDB database,follow the steps in [part 2 of this tutorial](tutorial-containerize-deploy-python-web-app-azure-02.md?tabs=mongodb-azure#tabpanel_3_mongodb-azure).

* [Visual Studio Code][16] or [Azure CLI][17], depending on your tool of choice. If you use Visual Studio Code, you need the [Docker extension][6] and [Azure App Service extension][7].

* These Python packages:

  * [PyMongo][8] for connecting to MongoDB.
  * [Flask][9] or [Django][10] as a web framework.

* [Docker][4] installed locally. *This is optional and is only required if you want to run the container locally*.

## Sample application

In this tutorial, you build a Python restaurant review application that utilizes MongoDB for data storage. For an example using PostgreSQL, see [Create and deploy a Flask web app to Azure with a managed identity](./tutorial-python-managed-identity-cli.md).

The end result of this tutorial is a restaurant review application, deployed and running in Azure, that looks like the following screenshot.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-web-app-sample-app-screenshot.png" alt-text="A screenshot of the sample app created from the Python containerized web app used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-web-app-sample-app-screenshot.png":::

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
[8]: https://pypi.org/project/pymongo/
[9]: https://flask.palletsprojects.com/en/stable/
[10]: https://www.djangoproject.com/
[11]: https://azure.microsoft.com/services/container-registry/
[12]: /azure/cosmos-db/mongodb/create-mongodb-python
[13]: /azure/cosmos-db/scripts/cli/mongodb/create
[14]: /azure/cosmos-db/scripts/powershell/mongodb/create
[15]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb
[16]: https://code.visualstudio.com/
[17]: /cli/azure/what-is-azure-cli
