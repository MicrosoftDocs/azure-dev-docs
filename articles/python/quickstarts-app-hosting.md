---
title: Getting started with hosting Python apps on Azure
description: Index of getting started material in the Azure documentation for hosting Python app code.
ms.date: 05/20/2025
ms.topic: get-started
ms.custom: devx-track-python, py-fresh-zinc
---

# Hosting Python apps on Azure

Azure offers several options for hosting your application, each suited to different levels of control and responsibility. For an overview of these options, see [Hosting applications on Azure](../intro/hosting-apps-on-azure.md)e.

In general, selecting a hosting option involves balancing control with management responsibility. The more control you require over the infrastructure, the more responsibility you take on for management of one or more resources.

We recommend starting with Azure App Service, which provides a highly managed environment with minimal administrative overhead. As your needs evolve, you can explore other options that offer increased flexibility and control, such as Azure Container Apps, Azure Kubernetes Service (AKS), or ultimately Azure Virtual Machines, which provide the greatest control but also require the most maintenance.

The hosting options in this article are presented in order from more managed (less responsibility on your part) to less managed (more control and responsibility).

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
