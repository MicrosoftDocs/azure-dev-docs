---
title: Overview of How to Deploy a Python Web App in Azure Container Apps
description: Overview of how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: tutorial
ms.date: 12/18/2024
ms.custom: devx-track-python
---

# Tutorial: Learn overview concepts for deploying a Python web app on Azure Container Apps

This tutorial series shows you how to containerize a Python web app and deploy it to [Azure Container Apps][2]. A sample web app is containerized, and the Docker image is stored in [Azure Container Registry][3]. Azure Container Apps is configured to pull the Docker image from Container Registry and create a container. The sample app connects to [Azure Database for PostgreSQL][4] to demonstrate communication between Container Apps and other Azure resources.

There are several options to build and deploy cloud-native and containerized Python web apps on Azure. This tutorial series covers Azure Container Apps. Container Apps is good for running general-purpose containers, especially for applications that span many microservices deployed in containers.

In this tutorial series, you create one container. To deploy a Python web app as a container to Azure App Service, see [Containerized Python web app on Azure with MongoDB](./tutorial-containerize-deploy-python-web-app-azure-01.md).

The procedures in this tutorial series guide you to complete these tasks:

> [!div class="checklist"]
>
> * Build a [Docker][1] image from a Python web app and store the image in [Azure Container Registry][3].
> * Configure [Azure Container Apps][2] to host the Docker image.
> * Set up [GitHub Actions][6] to update the container with a new Docker image triggered by changes to your GitHub repository. *This step is optional.*
> * Set up continuous integration and continuous delivery (CI/CD) of a Python web app to Azure.

In this first part of the series, you learn foundational concepts for deploying a Python web app on Azure Container Apps.

## Service overview

The following diagram shows how you'll use your local environment, GitHub repositories, and Azure services in this tutorial series.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png" alt-text="Diagram of environments and services for deploying a Python web app on Azure Container Apps." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png":::

The diagram includes these components:

* [Azure Container Apps][2]:

  Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. A serverless platform means that you enjoy the benefits of running containers with minimal configuration. With Azure Container Apps, your applications can dynamically scale based on characteristics such as HTTP traffic, event-driven processing, or CPU or memory load.
  
  Container Apps pulls Docker images from Azure Container Registry. Changes to container images trigger an update to the deployed container. You can also configure GitHub Actions to trigger updates.

* [Azure Container Registry][3]:

  Azure Container Registry enables you to work with Docker images in Azure. Because Container Registry is close to your deployments in Azure, you have control over access. You can use your Microsoft Entra groups and permissions to control access to Docker images.

  In this tutorial series, the registry source is Azure Container Registry. But you can also use Docker Hub or a private registry with minor modifications.

* [Azure Database for PostgreSQL][4]:

  The sample code stores application data in a PostgreSQL database. The container app connects to PostgreSQL by using a [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/overview). Connection information is stored in environment variables configured explicitly or through an [Azure service connector][8].

* [GitHub][1]:

  The sample code for this tutorial series is in a GitHub repo that you fork and clone locally. To set up a CI/CD workflow with [GitHub Actions][6], you need a GitHub account.
  
  You can still follow along with this tutorial series without a GitHub account, if you work locally or in [Azure Cloud Shell][9] to build the container image from the sample code repo.

## Revisions and CI/CD

To make code changes and push them to a container, you create a new Docker image with your changes. Then, you push the image to Container Registry and create a new [revision](/azure/container-apps/revisions) of the container app.

To automate this process, an optional step in the tutorial series shows you how to build a CI/CD pipeline by using GitHub Actions. The pipeline automatically builds and deploys your code to Container Apps whenever a new commit is pushed to your GitHub repository.

## Authentication and security

In this tutorial series, you build a Docker container image directly in Azure and deploy it to Azure Container Apps. Container Apps runs in the context of an [environment][18], which is supported by an [Azure virtual network][19]. Virtual networks are a fundamental building block for your private network in Azure. Container Apps allows you to expose your container app to the public web by enabling ingress.

To set up CI/CD, you authorize Azure Container Apps as an [OAuth app][20] for your GitHub account. As an OAuth app, Container Apps writes a GitHub Actions workflow file to your repo with information about Azure resources and jobs to update them. The workflow updates Azure resources by using the credentials of a Microsoft Entra service principal (or an existing one) with role-based access for Container Apps and a username and password for Azure Container Registry. Credentials are stored securely in your GitHub repo.

Finally, the sample web app in this tutorial series stores data in a PostgreSQL database. The sample code connects to PostgreSQL via a connection string. When the app is running in Azure, it connects to the PostgreSQL database by using a user-assigned managed identity. The code uses [`DefaultAzureCredential`](./sdk/authentication/overview.md#defaultazurecredential) to dynamically update the password in the connection string with a Microsoft Entra access token during runtime. This mechanism prevents the need to hardcode the password in the connection string or an environment variable, and it provides an extra layer of security.

The tutorial series walks you through creating the managed identity and granting it an appropriate PostgreSQL role and permissions so that it can access and update the database. During the configuration of Container Apps, the tutorial series walks you through configuring the managed identity on the app and setting up environment variables that contain connection information for the database. You can also use an Azure service connector to accomplish the same thing.

## Prerequisites

To complete this tutorial series, you need:

* An Azure account where you can create:
  * An Azure Container Registry instance.
  * An Azure Container Apps environment.
  * An Azure Database for PostgreSQL instance.

* [Visual Studio Code][16] or the [Azure CLI][17], depending on what tool you use:
  * For Visual Studio Code, you need the [Container Apps extension][13].
  * You can use the Azure CLI through [Azure Cloud Shell][9].

* Python packages:
  * [pyscopg2-binary][12] for connecting to PostgreSQL.
  * [Flask][10] or [Django][11] as a web framework.

## Sample app

The Python sample app is a restaurant review app that saves restaurant and review data in PostgreSQL. At the end of the tutorial series, you'll have a restaurant review app deployed and running in Azure Container Apps that looks like the following screenshot.

:::image type="content" source="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png" alt-text="Screenshot of the sample app created from a Python containerized web app." lightbox="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png":::

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Build and deploy a Python web app with Azure Container Apps and PostgreSQL](tutorial-deploy-python-web-app-azure-container-apps-02.md)

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
