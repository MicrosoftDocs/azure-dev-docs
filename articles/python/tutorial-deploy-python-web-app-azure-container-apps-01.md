---
title: Overview of how to deploy a Python web app in Azure Container Apps
description: Overview of how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 01/31/2024
ms.custom: devx-track-python
---

# Overview: Deploy a Python web app on Azure Container Apps

This tutorial shows you how to containerize a Python web app and deploy it to [Azure Container Apps][2]. A sample web app will be containerized and the Docker image stored in [Azure Container Registry][3]. Azure Container Apps is configured to pull the Docker image from Container Registry and create a container. The sample app connects to an [Azure Database for PostgreSQL][4] to demonstrate communication between Container Apps and other Azure resources.

There are several options to build and deploy cloud native and containerized Python web apps on Azure. This tutorial covers Azure Container Apps. Container Apps are good for running general purpose containers, especially for applications that span many microservices deployed in containers. In this tutorial, you'll create one container. To deploy a Python web app as a container to Azure App Service, see [Containerized Python web app on App Service](./tutorial-containerize-deploy-python-web-app-azure-01.md).

In this tutorial you'll:

* Build a [Docker][1] image from a Python web app and store the image in [Azure Container Registry][3].
* Configure [Azure Container Apps][2] to host the Docker image.
* Set up a [GitHub Action][6] that updates the container with a new Docker image triggered by changes to your GitHub repository. *This last step is optional.*

Following this tutorial, you'll be set up for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service overview

The service diagram supporting this tutorial shows how your local environment, GitHub repositories, and Azure services are used in the tutorial.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png" alt-text="A screenshot of the environments and services used in the Tutorial - Deploy a Python App on Azure Container Apps." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png":::

The components supporting this tutorial and shown in the diagram above are:

* [Azure Container Apps][2]
  * Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. A serverless platform means that you enjoy the benefits of running containers with minimal configuration. With Azure Container Apps, your applications can dynamically scale based on characteristics such as HTTP traffic, event-driven processing, or CPU or memory load.
  * Container Apps pulls Docker images from Azure Container Registry. Changes to container images trigger an update to the deployed container. You can also configure GitHub Actions to trigger updates.

* [Azure Container Registry][3]
  * Azure Container Registry enables you to work with Docker images in Azure. Because Container Registry is close to your deployments in Azure, you have control over access, making it possible to use your Microsoft Entra groups and permissions to control access to Docker images.
  * In this tutorial, the registry source is Azure Container Registry, but you can also use Docker Hub or a private registry with minor modifications.

* [Azure Database for PostgreSQL][4]
  * The sample code stores application data in a PostgreSQL database.
  * The container app connects to PostgreSQL with a [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview). Connection information is stored in environment variables configured explicitly or with [Azure Service Connector][8].

* [GitHub][1]
  * The sample code for this tutorial is in a GitHub repo that you'll fork and clone locally. To set up a CI/CD workflow with [GitHub Actions][6], you'll need a GitHub account.
  * You can still follow along with this tutorial without a GitHub account, working locally or in the [Azure Cloud Shell][9] to build the container image from the sample code repo.

## Revisions and CI/CD

To make code changes and push them to a container, you create a new Docker image with your change. Then, you push the image to Container Registry and create a new [revision](/azure/container-apps/revisions) of the container app.

To automate this process, an optional step in the tutorial shows you how to build a continuous integration and continuous delivery (CI/CD) pipeline with GitHub Actions. The pipeline automatically builds and deploys your code to the Container App whenever a new commit is pushed to your GitHub repository.

## Authentication and security

In this tutorial, you'll build a Docker container image directly in Azure and deploy it to Azure Container Apps. Container Apps run in the context of an [*environment*][18], which is supported by an [Azure Virtual Networks (VNet)][19]. VNets are a fundamental building block for your private network in Azure. Container Apps allows you to expose your container app to the public web by enabling ingress.

To set up continuous integration and continuous delivery (CI/CD), you'll authorize Azure Container Apps as an [OAuth App][20] for your GitHub account. As an OAuth App, Container Apps writes a GitHub Actions workflow file to your repo with information about Azure resources and jobs to update them. The workflow updates Azure resources using credentials of a Microsoft Entra service principal (or existing one) with role-based access for Container Apps and username and password for Azure Container Registry. Credentials are stored securely in your GitHub repo.

Finally, the tutorial sample web app stores data in a PostgreSQL database. The sample code connects to PostgreSQL via a connection string. When running in Azure, the app connects to the PostgreSQL database with a user-assigned managed identity. The app code uses [DefaultAzureCredential](./sdk/authentication/overview#defaultazurecredential) to dynamically update the password in the connection string with a Microsoft Entra access token during runtime. This mechanism prevents having to hardcode the password in the connection string or an environment variable and provides an extra layer of security. The tutorial walks you through creating the managed identity and granting it an appropriate PostgreSQL ROLE and permissions for it to access and update the database. During the configuration of the Container App, the tutorial walks you through configuring the managed identity on the app and setting up environment variables containing connection information for the database. You can also use an Azure Service Connector to accomplish the same thing.

## Prerequisites

To complete this tutorial, you'll need:

* An Azure account where you can create:
  * Azure Container Registry
  * Azure Container Apps environment
  * Azure Database for PostgreSQL

* [Visual Studio Code][16] or [Azure CLI][17], depending on what tool you'll use
  * For Visual Studio Code, you'll need the [Container Apps extension][13].
  * You can also use Azure CLI through the [Azure Cloud Shell][9].

* Python packages:
  * [pyscopg2-binary][12] for connecting to PostgreSQL.
  * [Flask][10] or [Django][11] web framework.

## Sample app

The Python sample app is a restaurant review app that saves restaurant and review data in PostgreSQL. At the end of the tutorial, you'll have a restaurant review app deployed and running in Azure Container Apps that looks like the screenshot below.

:::image type="content" source="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png" alt-text="A screenshot of the sample app created from the Python containerized web app used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png":::

## Next step

> [!div class="nextstepaction"]
> [Build and deploy to Azure Container Apps](tutorial-deploy-python-web-app-azure-container-apps-02.md)

[1]: https://www.docker.com/
[2]: /azure/container-apps/
[3]: /azure/container-registry
[4]: /azure/postgresql/
[6]: https://docs.github.com/actions
[7]: https://github.com/
[8]: /azure/service-connector/
[9]: /azure/cloud-shell/overview
[10]: https://flask.palletsprojects.com/en/2.1.x/
[11]: https://www.djangoproject.com/
[12]: https://pypi.org/project/psycopg-binary/
[13]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps
[16]: https://code.visualstudio.com/
[17]: /cli/azure/what-is-azure-cli
[18]: /azure/container-apps/environment
[19]: /azure/virtual-network/virtual-networks-overview
[20]: https://docs.github.com/authentication/keeping-your-account-and-data-secure/authorizing-oauth-apps
