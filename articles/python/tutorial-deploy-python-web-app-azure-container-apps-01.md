---
title: Overview of how to deploy a Python web app in Azure Container Apps
description: Overview of how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 08/29/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Overview: Deploy a Python web app on Azure Container Apps

This tutorial shows you how to containerize a Python web app and deploy it to [Azure Container Apps](/azure/container-apps/). The provided sample web app can be containerized and the container image stored in [Azure Container Registry](/azure/container-registry). Azure Container Apps is configured to pull container images from Container Registry. The sample app connects to to a [Azure Database for PostgreSQL](/azure/postgresql/) to show communicating between Container Apps and other Azure resources. FInally, an optional step in the tutorial shows you how to build a continuous integration and continuous delivery (CI/CD) pipeline with GitHub actions.

Azure Container Apps enables you to run microservices and containerized applications on a serverless platform. This means that you enjoy the benefits of running containers with minimal configuration. With Azure Container Apps, your applications can dynamically scale based on characteristics such as HTTP traffic, event-driven processing, or CPU or memory load. 

There are many options to build and deploy cloud native and containerized Python web apps on Azure. If you are starting off with containers, deploying your web app as a container to either Azure Web App Service or Azure Container Apps is a good first step. This tutorial covers Azure Container Apps. Deploying a Python web app as a container to Azure App Service is covered in the tutorial [Containerized Python web app on Azure](./tutorial-containerize-deploy-python-web-app-azure-01.md). Other options such as Azure Container Instance and Azure Kubernetes Service are covered in the article [Comparing Container Apps with other Azure container options](/azure/container-apps/compare-options).

In this tutorial you will:

* Build a Docker container image directly in Azure.
* Configure an Azure Container App to host the container image.
* Optionally configure a GitHub action that updates the container image triggered by checkins to GitHub.

Following this tutorial, you'll have the basis for Continuous Integration (CI) and Continuous Deployment (CD) of a Python web app to Azure.

## Service Overview

\[Diagram\]

The components supporting this tutorial and shown in the diagram above are:

* Azure Container Apps
* Azure Container Registry
* Azure Database of PostgreSQL
* GitHub

## Authentication and security

In this tutorial, you'll build a Docker image directly in Azure and deploy it to Azure Container Apps. Container Apps run in the context of an environment, which is supported by a virtual network (VNET). Azure Virtual Networks (VNet) are fundamental building block for your private network in Azure. Container Apps allows you to expose your container app to the public web by enabling ingress. 

Container Apps uses a service principal is used to securely pull images from Azure Container Registry. The service princiap allows grants permissions to the Container Apps so that it can access other Azure resources without the need to specify credentials.  When you set up continuous deployment, the service principal is created for you automatically. 

The tutorial sample web app uses PostgreSQL to store data. The sample code connects to PostgreSQL via a connection string. The connection string is stored securely using an [Azure Service Connector](/azure/service-connector/overview), which helps you connect Azure compute services to other backing services. During the configuration of the Container App, the tutorial walks your through the service connector.

## Prerequisites

To complete this tutorial, you'll need:

* An Azure account where you can create:
  * Azure Container Registry
  * Azure Container App environment
  * Azure Database for PostgreSQL

* Visual Studio Code or Azure CLI, depending on what tool you'll use.
  * For Visual Studio Code, you'll need the Azure Container Apps extension.

* Python packages:
   * LIBRARY for connecting to Postgres
   * Flask or Django as a web framework.





