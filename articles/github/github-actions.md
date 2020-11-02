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


# What is GitHub Actions for Azure?

[GitHub Actions](https://help.github.com/articles/about-github-actions) helps you automate your software development workflows from within GitHub. You can deploy workflows in the same place where you store code and collaborate on pull requests and issues.

In GitHub Actions, a [workflow](https://help.github.com/articles/about-github-actions#workflow) is an automated process that you set up in your GitHub repository. You can build, test, package, release, or deploy any project on GitHub with a workflow.

Each workflow is made up of individual [actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions) that run after a specific event (like a pull request) occur.  The individual actions are packaged scripts that automate software development tasks.

With GitHub Actions for Azure, you can create workflows that you can set up in your repository to build, test, package, release, and deploy to Azure. GitHub Actions for Azure support Azure services, including Azure App Service, Azure Functions, and Azure key vault.

GitHub Actions also includes support for utilities, including Azure Resource Manager templates, Azure CLI, and Azure Policy.

## Why should I use GitHub Actions for Azure

GitHub Actions for Azure are developed by Microsoft and designed to be used with Azure. You can see all of the GitHub Actions for Azure in the [GitHub Marketplace](https://github.com/marketplace?query=Azure&type=actions). See [Finding and customizing actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/finding-and-customizing-actions) to learn more about incorporating actions into your workflows.

## What is the difference between GitHub Actions and Azure Pipelines

Azure Pipelines and GitHub Actions both help you automate software development workflows. [Learn more](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/migrating-from-azure-pipelines-to-github-actions) about how the services differ and how to migrate from Azure Pipelines to GitHub Actions.

## What do I need to use GitHub Actions for Azure

You'll need Azure and GitHub accounts:

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## How do I connect GitHub Actions and Azure

Depending on the action, you'll use a service principal or publish profile to connect to Azure from GitHub. You'll use a service principal each time you use the [Azure login](https://github.com/marketplace/actions/azure-login) action. The [Azure App Service action](https://github.com/marketplace/actions/azure-webapp) supports using a publish profile.

You can use the Azure login action in combination with both the [Azure CLI](https://github.com/marketplace/actions/azure-cli-action) and Azure [Azure PowerShell](https://github.com/marketplace/actions/azure-powershell-action) actions.  


## What is included in a GitHub Actions workflow

Workflows are made up of one or more jobs. Within a job, there are steps made up of individual actions. See [Introduction to GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions/introduction-to-github-actions) to learn more about GitHub Actions concepts.  

## Where can I see complete workflow examples

The [Azure starter action workflows repository](https://github.com/Azure/actions-workflow-samples) includes end-to-end workflows to build and deploy Web apps of any language, any ecosystem to Azure.

## Next Steps

> [!div class="nextstepaction"]
> [Learning path, Automate your workflow with GitHub Actions](https://docs.microsoft.com/learn/modules/github-actions-automate-tasks/)

> [!div class="nextstepaction"]
> [Learning Lab, Continuous Delivery with Azure](https://lab.github.com/githubtraining/github-actions:-continuous-delivery-with-azure)
  