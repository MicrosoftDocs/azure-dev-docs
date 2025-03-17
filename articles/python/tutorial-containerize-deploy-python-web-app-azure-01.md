---
title: Deploy a containerized Python web app on Azure with MongoDB
description: An overview of how to create and deploy a containerized Python web app (Django or Flask) on Azure App Service with MongoDB.
ms.topic: conceptual
ms.date: 03/17/2025
ms.custom: devx-track-python
---

# Overview: Containerized Python web app on Azure with MongoDB

This tutorial shows you how to containerize a Python web app and deploy it to Azure. [Azure App Service][1] hosts the single container web app and uses [MongoDB for Azure Cosmos DB][2] to store data. With App Service [Web App for Containers][3], you can focus on building and deploying your containers without worrying about managing and maintaining an underlying container orchestrator. When developing web apps, Azure App Service is a good option for taking your first steps with containers. For more information about Azure container options, see [Comparing Azure container options](/azure/container-apps/compare-options).

In this tutorial you:

* Build and run a [Docker][4] container locally. *This step is optional.*

* Build a [Docker][4] container image directly in Azure.

* Configure an App Service to create a web app based on the Docker container image.

Upon completing this tutorial, you'll have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service overview

The service diagram supporting this tutorial shows two environments: developer environment and Azure. It highlights the key Azure services used in the development process.

:::image type="content" source="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png" alt-text="A screenshot of the services used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-web-app/containerization-of-python-apps-overview.png":::

### Developer environment

The components supporting the developer environment in this tutorial include:

* Local Development System: A personal computer used for coding, building, and testing the Docker container.
* Docker Containerization: Docker is employed to package the application and its dependencies into a portable container.
* Development Tools: Includes a code editor and other necessary tools for software development.
* Local MongoDB Instance: A local MongoDB database is utilized for data storage during development.
* MongoDB Connection: Access to the local MongoDB database is provided through a connection string.

### Azure environment

The components supporting the Azure environment in this tutorial include:

* [Azure App Service][1]

  * Web App for Containers in Azure App Service uses the [Docker][4] container technology to provide container hosting of both built-in images and custom images using Docker.
  * Web App for Containers uses a webhook in the Azure Container Registry to get notified of new images. When a new image is pushed to the registry, the webhook notification triggers App Service to pull the update and restart the application.

* [Azure Container Registry][11]

  * Azure Container Registry allows you to manage Docker images and their components in Azure. It provides a registry that's close to your deployments in Azure, giving you control over access, making it possible to use your Microsoft Entra groups and permissions.

  * In this tutorial, the registry source is Azure Container Registry, but you can also use Docker Hub or a private registry with minor modifications.

* [Azure Cosmos DB for MongoDB][2]

  * The Azure Cosmos DB for MongoDB is a NoSQL database used in this tutorial to store data.

  * Access to Azure Cosmos DB resource is via a connection string, which is passed as an environment variable to the containerized app.

## Authentication

In this tutorial, you'll build a Docker image (either locally or directly in Azure) and deploy it to Azure App Service. The App Service pulls the container image from an Azure Container Registry repository.

The App Service uses [managed identity][5] to pull images from Azure Container Registry. Managed identity allows you to grant permissions to the web app so that it can access other Azure resources without the need to specify credentials. Specifically, this tutorial uses a system assigned managed identity. Managed identity is configured during setup of App Service to use a registry container image.

The tutorial sample web app uses MongoDB to store data. The sample code connects to Azure Cosmos DB via a connection string. 

## Prerequisites

To complete this tutorial, you'll need:

* An Azure account where you can create:

  * [Azure Container Registry][11]
  * [Azure App Service][1]
  * [Azure Cosmos DB for MongoDB][2] (or access to an equivalent). To create an Azure Cosmos DB for MongoDB database, we recommend you follow the steps in [part 2 of this tutorial](tutorial-containerize-deploy-python-web-app-azure-02.md?tabs=mongodb-azure#tabpanel_3_mongodb-azure).

* [Visual Studio Code][16] or [Azure CLI][17], depending on what tool you'll use.

  * For Visual Studio Code, you'll need the [Docker extension][6] and [Azure App Service extension][7].

* Python packages:

  * [PyMongo][8] for connecting to MongoDB.
  * [Flask][9] or [Django][10] as a web framework.

* [Docker][4] installed locally if you want to run container locally.

## Sample app

The Python sample app is a restaurant review app that saves restaurant and review data in MongoDB. For an example of a web app using PostgreSQL, see [Create and deploy a Flask web app to Azure with a managed identity](./tutorial-python-managed-identity-cli.md).

At the end of the tutorial, you'll have a restaurant review app deployed and running in Azure that looks like the screenshot below.

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
[9]: https://flask.palletsprojects.com/en/2.1.x/
[10]: https://www.djangoproject.com/
[11]: https://azure.microsoft.com/services/container-registry/
[12]: /azure/cosmos-db/mongodb/create-mongodb-python
[13]: /azure/cosmos-db/scripts/cli/mongodb/create
[14]: /azure/cosmos-db/scripts/powershell/mongodb/create
[15]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb
[16]: https://code.visualstudio.com/
[17]: /cli/azure/what-is-azure-cli
