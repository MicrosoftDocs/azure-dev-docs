---
title: Deploy to Azure using GitHub Actions
description: Create workflows within your repository to build, test, package, release and deploy to Azure.   
ms.topic: conceptual
ms.service: azure 
ms.date: 05/05/2020
---


# Deploy to Azure using GitHub Actions

You use GitHub Actions for Azure to automate your workflows to deploy to Azure. To get started, see these three GitHub Actions: 

- [Azure/webapps-deploy action](https://github.com/Azure/webapps-deploy), to deploy to Azure Web Apps and Azure Web App for Containers 
- [Azure/appservice-settings](https://github.com/Azure/appservice-settings) to configure App settings, connection strings and other general settings in bulk using JSON syntax on your Azure WebApp (Windows or Linux) or any of its deployment slots.

> [!NOTE]   
> The links provided in this article link to a GitHub article or a GitHub repository. 

## Key concepts

GitHub Actions enable you to create custom software development life cycle (SDLC) workflows directly in your GitHub repository. For an overview of GitHub Actions and core concepts, review the following articles: 

- [About GitHub Actions](https://help.github.com/actions/getting-started-with-github-actions/about-github-actions)
- [Core concepts ](https://help.github.com/actions/getting-started-with-github-actions/core-concepts-for-github-actions)
- [About packaging with GitHub Actions](https://help.github.com/en/actions/publishing-packages-with-github-actions/about-packaging-with-github-actions)

## Get started 

GitHub Actions includes preconfigured templates and Marketplace actions. 

- [Use preconfigured templates](https://help.github.com/actions/getting-started-with-github-actions/starting-with-preconfigured-workflow-templates)  
- [Use actions from GitHub Marketplace](https://help.github.com/en/actions/getting-started-with-github-actions/using-actions-from-github-marketplace)  
- [GitHub Marketplace Actions, Deploy to Azure](https://github.com/marketplace?type=actions&query=Azure)  
  
For links to all GitHub Actions for Azure, see the following page: 
   
- [Azure Actions](https://github.com/marketplace?query=Azure&type=actions)  

## Connect to Azure

For sample workflows to connect to Azure, see the following GitHub actions:  

- [Azure login](https://github.com/Azure/login)  
- [Azure CLI](https://github.com/Azure/CLI)  


## Starter templates and end-to-End CI/CD workflow samples 

The following samples provide end-to-end workflows to deploy your Web apps to Azure. 

- [Deploy a Wep App with ASP.NET support](https://github.com/Azure-Samples/dotnet-sample)  
- [Deplopy an ASP.NET Core App](https://github.com/Azure-Samples/dotnet_core_sample)  
- [Deploy a Node.js Web App](https://github.com/Azure-Samples/node_express-App)  
- [Deploy a Java Web App](https://github.com/Azure-Samples/java-spring-petclinic)  
- [Deploy a Java Spring App](https://github.com/Azure-Samples/Java-application-petstore-ee7)  
- [Deploy a Python Web App](https://github.com/Azure-Samples/pythonSample_thecatsaidno)  
- [Deploy using Docker](https://github.com/Azure-Samples/Node_express_container)  


## Deploy a Web app

- [Azure Web App](https://github.com/Azure/webapps-deploy)  
- [Azure Web App for Containers](https://github.com/Azure/webapps-container-deploy)  
- [Azure App Service settings](https://github.com/Azure/appservice-settings)  
- 
## Deploy a serverless app

- [Azure Functions](https://github.com/Azure/functions-action)  
- [Azure Functions for Containers](https://github.com/Azure/webapps-container-deploy)  
 
## Build and Deploy containerized apps

- [Docker login](https://github.com/Azure/docker-login)  

## Deploy to Kubernetes

- [Kubectl tool installer](https://github.com/Azure/setup-kubectl)  
- [Kubernetes set context](https://github.com/Azure/k8s-set-context)  
- [AKS set context](https://github.com/Azure/aks-set-context)  
- [Kubernetes create secret](https://github.com/Azure/k8s-create-secret)  
- [Kubernetes deploy](https://github.com/Azure/k8s-deploy)  
- [Setup Helm](https://github.com/Azure/setup-helm)  
- [Kubernetes bake](https://github.com/Azure/k8s-bake)  

## Deploy to databases

- [Azure SQL database](https://github.com/Azure/sql-action)  
- [Azure MySQL action](https://github.com/Azure/mysql-action)  

## Trigger a run in Azure Pipelines

- [Azure Pipelines](https://github.com/Azure/pipelines)  
 
## Utility actions

- [Variable substitution](https://github.com/Microsoft/variable-substitution) 