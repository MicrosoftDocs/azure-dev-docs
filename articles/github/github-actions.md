---
title: What is GitHub Actions for Azure?
description: Create workflows within your repository to build, test, package, release, and deploy to Azure. 
author: N-Usha 
ms.author: ushan 
ms.topic: conceptual
ms.service: azure 
ms.date: 10/30/2020
ms.custom: github-actions-azure
---


# What is GitHub Actions for Azure

[GitHub Actions](https://help.github.com/articles/about-github-actions) helps you automate your software development workflows from within GitHub. You can deploy workflows in the same place where you store code and collaborate on pull requests and issues.

In GitHub Actions, a [workflow](https://help.github.com/articles/about-github-actions#workflow) is an automated process that you set up in your GitHub repository. You can build, test, package, release, or deploy any project on GitHub with a workflow.

Each workflow is made up of individual [actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions) that run after a specific event (like a pull request) occur.  The individual actions are packaged scripts that automate software development tasks.

With GitHub Actions for Azure, you can create workflows that you can set up in your repository to build, test, package, release, and deploy to Azure. GitHub Actions for Azure supports Azure services, including Azure App Service, Azure Functions, and Azure Key Vault.

GitHub Actions also include support for utilities, including Azure Resource Manager templates, Azure CLI, and Azure Policy.

> [!VIDEO https://www.youtube.com/watch?v=36hY0-O4STg]

## Why should I use GitHub Actions for Azure

GitHub Actions for Azure are developed by Microsoft and designed to be used with Azure. You can see all of the GitHub Actions for Azure in the [GitHub Marketplace](https://github.com/marketplace?query=Azure&type=actions). See [Finding and customizing actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/finding-and-customizing-actions) to learn more about incorporating actions into your workflows.

## What is the difference between GitHub Actions and Azure Pipelines

Azure Pipelines and GitHub Actions both help you automate software development workflows. [Learn more](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/migrating-from-azure-pipelines-to-github-actions) about how the services differ and how to migrate from Azure Pipelines to GitHub Actions.

## What do I need to use GitHub Actions for Azure

You'll need Azure and GitHub accounts:

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## How do I connect GitHub Actions and Azure

Depending on the action, you'll use a service principal or publish profile to connect to Azure from GitHub. You'll use a service principal each time you use the [Azure login](https://github.com/marketplace/actions/azure-login) action. The [Azure App Service action](https://github.com/marketplace/actions/azure-webapp) supports using a publish profile or service principal. See [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) to learn more about service principals.  

You can use the Azure login action in combination with both the [Azure CLI](https://github.com/marketplace/actions/azure-cli-action) and Azure [Azure PowerShell](https://github.com/marketplace/actions/azure-powershell-action) actions. The Azure login action also works with most other GitHub actions for Azure including [deploying to web apps](https://github.com/marketplace/actions/azure-webapp) and [accessing key vault secrets](https://github.com/marketplace/actions/azure-key-vault-get-secrets).

## What is included in a GitHub Actions workflow

Workflows are made up of one or more jobs. Within a job, there are steps made up of individual actions. See [Introduction to GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions) to learn more about GitHub Actions concepts.  

## Where can I see complete workflow examples

The [Azure starter action workflows repository](https://github.com/Azure/actions-workflow-samples) includes end-to-end workflows to build and deploy Web apps of any language, any ecosystem to Azure.

## Where can I see all the available actions

Visit the [Marketplace for GitHub Actions for Azure](https://github.com/marketplace?query=Azure&type=actions) to see all the available GitHub Actions for Azure.

* [Deploy to a static web app](/azure/static-web-apps/getting-started?tabs=angular)
* [Azure App Service settings](https://github.com/Azure/appservice-settings)  
* [Deploy to Azure Functions](https://github.com/Azure/functions-action)  
* [Deploy to Azure Functions for Containers](https://github.com/Azure/webapps-container-deploy)  
* [Docker login](https://github.com/Azure/docker-login)  
* [Deploy to Azure Container Instances](https://github.com/Azure/aci-deploy)
* [Container scanning action](https://github.com/Azure/container-scan)
* [Kubectl tool installer](https://github.com/Azure/setup-kubectl)  
* [Kubernetes set context](https://github.com/Azure/k8s-set-context)  
* [AKS set context](https://github.com/Azure/aks-set-context)  
* [Kubernetes create secret](https://github.com/Azure/k8s-create-secret)  
* [Kubernetes deploy](https://github.com/Azure/k8s-deploy)  
* [Setup Helm](https://github.com/Azure/setup-helm)  
* [Kubernetes bake](https://github.com/Azure/k8s-bake)  
* [Build Azure virtual machine images](https://github.com/Azure/build-vm-image)
* [Machine learning login](https://github.com/Azure/aml-workspace)
* [Machine learning training](https://github.com/Azure/aml-run)
* [Machine learning - deploy model](https://github.com/Azure/aml-deploy)
* [Deploy to Azure SQL database](https://github.com/Azure/sql-action)  
* [Deploy to Azure MySQL action](https://github.com/Azure/mysql-action)  
* [Azure Policy Compliance Scan](https://github.com/Azure/policy-compliance-scan)
* [Manage Azure Policy](https://github.com/Azure/manage-azure-policy)
* [Trigger an Azure Pipelines run](https://github.com/Azure/pipelines)  
* [Variable substitution](https://github.com/Microsoft/variable-substitution)

## Next Steps

> [!div class="nextstepaction"]
> [Learning path, Automate your workflow with GitHub Actions](https://docs.microsoft.com/learn/modules/github-actions-automate-tasks/)

> [!div class="nextstepaction"]
> [Learning Lab, Continuous Delivery with Azure](https://lab.github.com/githubtraining/github-actions:-continuous-delivery-with-azure)
