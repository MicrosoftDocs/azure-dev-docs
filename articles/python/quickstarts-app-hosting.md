---
title: Getting started with hosting Python apps on Azure
description: Index of getting started material in the Azure documentation for hosting Python app code.
ms.date: 1/23/2024
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Hosting Python apps on Azure

Azure provides various different ways to host your app depending on your needs. The article [Hosting applications on Azure](../intro/hosting-apps-on-azure.md) provides an overview of the different options.

Generally speaking, choosing an Azure hosting option is a matter of choosing on the continuum of control versus responsibility. The more control you need, the more responsibility you take on for management of the resource(s). In this continuum, we recommend starting with Azure App Service, with the least administrative responsibility on your part. Then, consider other options in the continuum moving toward taking more administrative responsibility of your Azure resources. At the other end of the continuum from App Service is Azure Virtual Machines, where you have the most control and more administrative responsibility for maintaining your resources.

The sections in this article are arranged approximately from more managed options (less management overhead for you) to less managed options (more control for you).

- **Web app hosting with Azure App Service**:
  - [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Deploy a Python (Django or Flask) web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Create and deploy a Flask web app to Azure with a system-assigned managed identity](./tutorial-python-managed-identity-cli.md)
  - [Configure a Python app for Azure App Service](/azure/app-service/configure-language-python)

- **Content delivery network with Azure Static web apps**
  - [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Quickstart: Building your first static site with Azure Static Web Apps](/azure/static-web-apps/getting-started?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)

- **Serverless hosting with Azure Functions**:
  - [Quickstart: Create a Python function in Azure from the command line](/azure/azure-functions/create-first-function-cli-python)
  - [Quickstart: Create a function in Azure with Python using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-python)
  - [Connect Azure Functions to Azure Storage using command line tools](/azure/azure-functions/functions-add-output-binding-storage-queue-cli?tabs=bash%2Cbrowser&pivots=programming-language-python)
  - [Connect Azure Functions to Azure Storage using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-storage-queue-vs-code?pivots=programming-language-python)
  
- **Container hosting with Azure**:
  - [Overview of Python Container Apps in Azure](./containers-in-azure-overview-python.md)
  - [Deploy a container to App Service](./tutorial-containerize-deploy-python-web-app-azure-01.md)
  - [Deploy a container to Azure Container Apps](./tutorial-deploy-python-web-app-azure-container-apps-01.md)
  - [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli?toc=/azure/developer/python/toc.json&bc=/azure/developer/python/breadcrumb/toc.json)
  - [Deploy a container in Azure Container Instances using the Azure CLI](/azure/container-instances/container-instances-quickstart)
  - [Create your first Service Fabric container application on Linux](/azure/service-fabric/service-fabric-get-started-containers-linux)

- **Compute intensive and long running operations with Azure Batch**:
  - [Use Python to create and run an Azure Batch job](/azure/batch/quick-run-python)
  - [Tutorial: Run a parallel file processing workload with Azure Batch using Python](/azure/batch/tutorial-parallel-python)
  - [Tutorial: Run Python scripts through Azure Data Factory using Azure Batch](/azure/batch/tutorial-run-python-batch-azure-data-factory)

- **On-demand, scalable computing resources with Azure Virtual Machines**:
  - [Quickstart: Use the Azure CLI to deploy a Linux virtual machine (VM) in Azure](/azure/virtual-machines/linux/quick-create-cli)
