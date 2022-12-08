---
title: Getting started with hosting Python apps on Azure
description: Index of getting started material in the Azure documentation for hosting Python app code.
ms.date: 12/09/2022
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Hosting Python apps on Azure

Azure provides a variety of different ways to host your app depending on your needs. The article [Hosting applications on Azure](../intro/hosting-apps-on-azure.md) provides an overview of the different options. 

Generally speaking, choosing an Azure hosting option is a matter of choosing on the continuum of control versus responsibility. The more control you need, the more responsibility you take on for management of that option. In this continuum, we recommend starting with Azure App Service (least administrative responsibility) and then consider other options in the continuum moving toward taking more control of the hosting environment. At the other end of the continuum is Azure Virtual Machine, where you have the most control over how your application is hosted.

The sections below are arranged approximately from more managed options (less management overhead for you) to less managed options (more control for you).

- **Web app hosting and monitoring**:
  - [Quickstart: Deploy a Python (Django or Flask) web app to Azure App Service](/azure/app-service/quickstart-python?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Deploy a Python (Django or Flask) web app with PostgreSQL in Azure](/azure/app-service/tutorial-python-postgresql-app?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Overview: Deploy a Python web app to Azure with managed identity](./tutorial-python-managed-identity-01)
  - [Configure a Python app for Azure App Service](/azure/app-service/configure-language-python)
  - [Set up Azure Monitor for your Python application](/azure/azure-monitor/app/opencensus-python)

- **Static web apps**
  - [Static website hosting in Azure Storage](/azure/storage/blobs/storage-blob-static-website?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)
  - [Quickstart: Building your first static site with Azure Static Web Apps](/azure/static-web-apps/getting-started?toc=/azure/developer/python/toc.json&bc=/azure/developer/breadcrumb/toc.json)

- **Serverless hosting with Azure Functions**:
  - [Quickstart: Create a Python function in Azure from the command line](/azure/azure-functions/create-first-function-cli-python)
  - [Quickstart: Create a function in Azure with Python using Visual Studio Code](/azure/azure-functions/create-first-function-vs-code-python)
  - [Connect Azure Functions to Azure Storage using command line tools](/azure/azure-functions/functions-add-output-binding-storage-queue-cli?tabs=bash%2Cbrowser&pivots=programming-language-python)
  - [Connect Azure Functions to Azure Storage using Visual Studio Code](/azure/azure-functions/functions-add-output-binding-storage-queue-vs-code?pivots=programming-language-python)
  
- **Container hosting**:
  - [Overview of Python Container Apps in Azure](./containers-in-azure-overview-python.md)
  - [Deploy a container to App Service](./tutorial-containerize-deploy-python-web-app-azure-01.md)
  - [Deploy a container to Azure Container Apps](./tutorial-deploy-python-web-app-azure-container-apps-01.md)
  - [Quickstart: Deploy an Azure Kubernetes Service cluster using the Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli?toc=/azure/developer/python/toc.json&bc=/azure/developer/python/breadcrumb/toc.json)
  - [Deploy a container instance in Azure using the Azure CLI](/azure/container-instances/container-instances-quickstart)
  - [Create your first Service Fabric container application on Linux](/azure/service-fabric/service-fabric-get-started-containers-linux)

- **Batch jobs**:
  - [Use Python API to run an Azure Batch job](/azure/batch/quick-run-python)
  - [Tutorial: Run a parallel workload with Azure Batch using the Python API](/azure/batch/tutorial-parallel-python)
  - [Tutorial: Run Python scripts through Azure Data Factory using Azure Batch](/azure/batch/tutorial-run-python-batch-azure-data-factory)

- **Virtual machines**:
  - [Create a Linux virtual machine with the Azure CLI](/azure/virtual-machines/linux/quick-create-cli)
