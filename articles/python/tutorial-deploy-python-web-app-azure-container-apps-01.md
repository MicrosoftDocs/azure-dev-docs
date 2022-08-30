---
title: Overview of how to deploy a Python web app in Azure Container Apps
description: Overview of how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 08/30/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Overview: Deploy a Python web app on Azure Container Apps

This tutorial shows you how to containerize a Python web app and deploy it to [Azure Container Apps][2]. The provided sample web app can be containerized and the container image stored in [Azure Container Registry][3]. Azure Container Apps is initially configured to pull the container image from Container Registry. The sample app connects to a [Azure Database for PostgreSQL][4] to show communicating between Container Apps and other Azure resources. 

There are many options to build and deploy cloud native and containerized Python web apps on Azure. If you're starting off with containers, deploying your web app as a container to either Azure Web App Service or Azure Container Apps is a good first step. This tutorial covers Azure Container Apps. Deploying a Python web app as a container to Azure App Service is covered in the tutorial [Containerized Python web app on App Service](./tutorial-containerize-deploy-python-web-app-azure-01.md). Other options such as Azure Container Instance and Azure Kubernetes Service are covered in the article [Comparing Container Apps with other Azure container options][5].

In this tutorial you will:

* Build a [Docker][1] container image from a Python web app.
* Configure [Azure Container Apps][2] to host the container image.
* Set up a [GitHub Action][6] that updates the container image triggered by changes to repo. *This last step is optional.*

Following this tutorial, you'll have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service Overview
 
The service diagram supporting this tutorial shows how your local environment, GitHub repositories, and different Azure services are used in the tutorial.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png" alt-text="A screenshot of the services using in the Tutorial - Deploy a Python App on Azure Container Apps." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps.png":::

The components supporting this tutorial and shown in the diagram above are:

* [Azure Container Apps][2]
  * Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. A serverless platform means that you enjoy the benefits of running containers with minimal configuration. With Azure Container Apps, your applications can dynamically scale based on characteristics such as HTTP traffic, event-driven processing, or CPU or memory load.
  * Container Apps pulls image from Azure Container Registry. Revisions to container images trigger an update to the deployed container. You can also configure changes to GitHub to trigger the update. 

* [Azure Container Registry][3]
  * Azure Container Registry enables you to work with Docker images and its components in Azure. It provides a registry that's close to your deployments in Azure and that gives you control over access, making it possible to use your Azure Active Directory groups and permissions.
  * In this tutorial, the registry source is Azure Container Registry, but you can also use Docker Hub or a private registry with minor modifications.

* [Azure Database of PostgreSQL][4]
  * The sample code connects to PostgreSQL to storage application data.
  * The container app connects to PostgreSQL through environment variables set with Azure Service Connector.

* [Azure Service Connector][8]
  * Service Connector helps you connect Azure compute services to other backing services.
  * The Service Connector is used during the configuration of Azure Container Apps. The connector generates environment variables containing connection information for PostgreSQL.

* [GitHub][1]
  * The sample code for this tutorial is in a GitHub repo that you can fork and clone locally. To set up a CI/CD workflow with [GitHub Actions][6] you'll need a GitHub account.
  * You can still follow along with this tutorial without a GitHub account, but you'll have to work in the [Azure Cloud Shell][9] to build the container image from the sample code repo.  

## Revisions and CI/CD 

To make code changes and push them to the container, you create a new container image with the change. Then, you push the image to Container Registry, and create a new [revision](/azure/container-apps/revisions) of the container app. To automate this process, an optional step in the tutorial shows you how to build a continuous integration and continuous delivery (CI/CD) pipeline with GitHub actions. The pipeline automatically builds and deploys your code to the Container App. 

## Authentication and security

In this tutorial, you'll build a Docker container image directly in Azure and deploy it to Azure Container Apps. Container Apps run in the context of an environment, which is supported by a virtual network (VNET). Azure Virtual Networks (VNet) are fundamental building block for your private network in Azure. Container Apps allows you to expose your container app to the public web by enabling ingress. 

When you initially configure a container in Container Apps, you configure which container image to use from Azure Container Registry. You can create new revisions that use different versions of that image or a new image. Revisions are useful, for example, when you're making code changes or doing A/B testing. 

To set up continuous integration and continuous delivery (CI/CD), you connect to a GitHub account, repository, and branch. In addition, you create an Azure Active Directory service principal (or using an existing) context with role-based access control.

The tutorial sample web app uses PostgreSQL to store data. The sample code connects to PostgreSQL via a connection string. The connection string is stored securely using an [Azure Service Connector](/azure/service-connector/overview), which helps you connect Azure compute services to other backing services. During the configuration of the Container App, the tutorial walks you through the service connector.

## Prerequisites

To complete this tutorial, you'll need:

* An Azure account where you can create:
  * Azure Container Registry
  * Azure Container App environment
  * Azure Database for PostgreSQL

* [Visual Studio Code][16] or [Azure CLI][17], depending on what tool you'll use.
  * For Visual Studio Code, you'll need the [Container Apps extension][13].

* Python packages:
  * [pyscopg2-binary][12] for connecting to Mongo DB.
  * [Flask][10] or [Django][11] as a web framework.

## Sample app

The Python sample app is a restaurant review app that saves restaurant and review data in PostgreSQL. At the end of the tutorial, you'll have a restaurant review app deployed and running in Azure Container Apps that looks like the screenshot below.

:::image type="content" source="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png" alt-text="A screenshot of the sample app created from the Python containerized web app used in the Tutorial - Containerized Python App on Azure." lightbox="./media/tutorial-container-apps/containerization-of-python-web-app-sample-app-screenshot.png":::

[1]: https://www.docker.com/
[2]: /azure/container-apps/
[3]: /azure/container-registry
[4]: /azure/postgresql/
[5]: /azure/container-apps/compare-options
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
