---
title: Deploy to Azure using GitHub Actions
description: Create workflows within your repository to build, test, package, release and deploy to Azure. 
author: N-Usha 
ms.author: ushan 
ms.topic: conceptual
ms.service: azure 
ms.date: 05/05/2020
ms.custom: github-actions-azure
---


# Deploy to Azure using GitHub Actions

[GitHub Actions](https://help.github.com/articles/about-github-actions) enable developers to build automated software development lifecycle workflows.  

With GitHub Actions for Azure you can create workflows that you can set up in your repository to build, test, package, release and **deploy** to Azure. [Learn more about all other integrations with Azure](https://aka.ms/GitHubonAzure).

Get started today with a [free Azure account](https://azure.com/free/open-source)!

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
  
For GitHub Actions for Azure, see the following pages: 
   
- [Azure Actions](https://github.com/marketplace?query=Azure&type=actions)  
- [Starter Action Workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)


## Connect to Azure

For sample workflows to connect to Azure and run scripts based on Az CLI or Az PowerShell , use the following GitHub actions:  

- [Azure login](https://github.com/Azure/login)  
- [Azure CLI](https://github.com/Azure/CLI)
- [Azure PowerShell](https://github.com/Azure/powershell)


## Sample apps with CI/CD workflow samples 

The following samples provide end-to-end workflows  to build and deploy Web apps of any language, any ecosystem to Azure. 

- [Deploy a Web App with ASP.NET support](https://github.com/Azure-Samples/dotnet-sample)  
- [Deploy an ASP.NET Core App](https://github.com/Azure-Samples/dotnet_core_sample)  
- [Deploy a Node.js Web App](https://github.com/Azure-Samples/node_express_app)  
- [Deploy a Java Web App](https://github.com/Azure-Samples/java-spring-petclinic)  
- [Deploy a Java Spring App](https://github.com/Azure-Samples/Java-application-petstore-ee7)  
- [Deploy a Python Web App](https://github.com/Azure-Samples/pythonSample_thecatsaidno)  
- [Deploy a containerized Web app using Docker](https://github.com/Azure-Samples/Node_express_container)


## Deploy a Web app

Deploy to Azure Web Apps and Azure Web App for Containers:

- [Azure/webapps-deploy action](https://github.com/Azure/webapps-deploy)

Deploy a Static Web app:
- [Azure/static-web-apps-deploy](/azure/static-web-apps/getting-started?tabs=angular)


Configure App settings and Connection Strings using the actions:

- [Azure/appservice-settings](https://github.com/Azure/appservice-settings) 
- [Azure App Service settings](https://github.com/Azure/appservice-settings)  

## Deploy a serverless app

- [Azure Functions](https://github.com/Azure/functions-action)  
- [Azure Functions for Containers](https://github.com/Azure/webapps-container-deploy)  
 
## Build and Deploy containerized apps

- [Docker login](https://github.com/Azure/docker-login)  
- [Deploy to Azure Container Instances](https://github.com/Azure/aci-deploy)
- [Container scanning action](https://github.com/Azure/container-scan)

## Deploy to Kubernetes

- [Kubectl tool installer](https://github.com/Azure/setup-kubectl)  
- [Kubernetes set context](https://github.com/Azure/k8s-set-context)  
- [AKS set context](https://github.com/Azure/aks-set-context)  
- [Kubernetes create secret](https://github.com/Azure/k8s-create-secret)  
- [Kubernetes deploy](https://github.com/Azure/k8s-deploy)  
- [Setup Helm](https://github.com/Azure/setup-helm)  
- [Kubernetes bake](https://github.com/Azure/k8s-bake)  

## Train and Deploy a machine learning model 

- [Login](https://github.com/Azure/aml-workspace) 
- [Train](https://github.com/Azure/aml-run)
- [Deploy Model](https://github.com/Azure/aml-deploy)

## Deploy to databases

- [Azure SQL database](https://github.com/Azure/sql-action)  
- [Azure MySQL action](https://github.com/Azure/mysql-action)  

## Azure Policy Integrations

- [Azure Policy Compliance Scan](https://github.com/Azure/policy-compliance-scan) 

## Trigger a run in Azure Pipelines

- [Azure Pipelines](https://github.com/Azure/pipelines)  
 
## Utility actions

- [Variable substitution](https://github.com/Microsoft/variable-substitution) 


## Additional resources

The following GitHub resources are available to support using GitHub to deploy your apps to Azure.  

- [Marketplace for GitHub Actions for Azure](https://github.com/marketplace?query=Azure&type=actions)
- [Learning Lab, Continuous Delivery with Azure](https://lab.github.com/githubtraining/github-actions:-continuous-delivery-with-azure)
- [Starter Action Workflows to deploy to Azure](https://github.com/Azure/actions-workflow-samples)