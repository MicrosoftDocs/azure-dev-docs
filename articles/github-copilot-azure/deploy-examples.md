---
title: GitHub Copilot for Azure prompt engineering examples for deploying your application
description: This article provides example prompts that can help you deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 5/30/2025
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for deploying your application with GitHub Copilot for Azure

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure and Azure MCP Server to help you deploy your application. Use [best practices](introduction.md#best-practices) to achieve the best results. Most importantly:

- Use "Agent" mode for the best experience. Avoid "Ask" mode.
- Include the word "Azure" in the prompt to help Copilot understand that it needs to call tools from the Azure MCP Server.
- If using Visual Studio Code, make sure you use "Configure Tools ..." and include both "Azure MCP" and "GitHub Copilot for Azure". [See the Tool calling section's Visual Studio Code tab](introduction.md#tool-calling) for more details.

## Example prompts for deploying an app

If you want to use GitHub Copilot for Azure for help with deploying your application, you can start with an open-ended question or request like one of these examples:

- "Help me deploy my application to Azure."
- "How can I deploy this app to Azure?"
- "Deploy this project to Azure."
- "Run this app on Azure."


Then, add more detail for better results. Here are some example prompts:

|Service or technology|Deploy prompt examples|
|---|---|
|Azure Kubernetes Service (AKS)|<ul><li>"Can you help me create a new deployment in my AKS cluster?"</li><li>"What is the Azure command to scale a deployment to 5 replicas?"</li><li>"Can you provide the Azure command to expose a deployment as a service?"</li></ul>|
|Azure App Service|<ul><li>"How many Azure web app plans using the free tier do I have deployed, grouped by region in my <placeholder> subscription?"</li><li>"How many Azure web apps do I have deployed in eastus?"</li></ul>|
|Azure Container Apps|<ul><li>"How can I deploy my container app to Azure?"</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"Use azd to deploy my Azure project."</li><li>"I want to use azd to create a deployment pipeline for my Azure application."</li><li>"Initialize my project with the Azure Developer CLI."</li><li>"Please start an azd deployment pipeline in Azure."</li></ul>|
|Azure DevOps|<ul><li>"Create a deployment pipeline for my Azure project."</li><li>"I don't want to deploy my app from my local machine — can you set up a remote Azure solution instead?"</li><li>"I need a CI/CD pipeline so I can deploy my app to Azure."</li><li>"I need help setting up a pipeline to deploy my app to Azure."</li><li>"Please help me create an automated Azure deployment pipeline for my app."</li><li>"This project is ready for automated deployment — set it up in Azure."</li></ul>|
|Azure OpenAI Service|<ul><li>"Create an Azure OpenAI deployment using the gpt-3.5-turbo model with a Terraform template, setting the model version to 0613."</li></ul>|
|GitHub Actions|<ul><li>"Let's use GitHub Actions to deploy my app to Azure."</li><li>"Set up a GitHub Actions pipeline to deploy my Azure app."</li></ul>|

In many cases, when you ask GitHub Copilot for Azure to choose Azure services and deploy your application to Azure, it will create Bicep templates and give you the option to use `azd` to begin deployment. 

>[!IMPORTANT]
>You should always inspect the Bicep templates to ensure you understand what GitHub Copilot for Azure is recommending. Furthermore, the templates are intended to be a starting point. You should plan on editing the templates to suit your needs.

## GitHub Copilot for Azure to deploy models to Azure OpenAI Service

In addition to the example prompts for deploying to Azure OpenAI Service, GitHub Copilot for Azure has the following capabilities:

- Given an existing OpenAI resource, user can deploy a model and optionally input a name for model to deploy.
- Given the name of an existing resource group, and optionally location, user can deploy a model, and GitHub Copilot for Azure will deploy a new OpenAI resource. User needs to input the name of the new OpenAI resource to create.
- Given the location, user can deploy a model, and GitHub Copilot for Azure will deploy a new resource group and OpenAI resource.  User needs to input the name of the new resource group and OpenAI resource to create.
- If there is insufficient quota error, the user will be asked to choose a different region.

## Example prompts for Azure Kubernetes Service (AKS)

GitHub Copilot for Azure enables users to perform a robust set of tasks related to Azure Kubernetes Service (AKS) directly from the GitHub Copilot Chat view. These skills include creating an AKS cluster, deploying a manifest to an AKS cluster, and generating Kubectl commands.

### Create an AKS Cluster

Users can quickly set up an AKS cluster using simple, natural language prompts. GitHub Copilot for Azure reduces the complexity and time required to manually configure and deploy a Kubernetes cluster.

You can create an AKS cluster using the following prompts:

- "Can you help me create a Kubernetes cluster in Azure?"
- "Can you set up an AKS cluster for me?"
- "I have a containerized application—can you help me create an AKS cluster to host it?"
- "Create an AKS cluster."
- "Help me create a Kubernetes cluster in Azure to host my application."


### Deploy a Manifest to an AKS Cluster

Users can deploy their application manifests to an AKS cluster directly from the GitHub Copilot Chat view. This simplifies the deployment process and ensures consistency. Use these predefined prompts to reduce the risk of errors during deployment, leading to more reliable and stable deployments.

To deploy a manifest file to an AKS cluster, you can use these prompts:

- "Help me deploy my manifest file to Azure."
- "Can you deploy my manifest to my AKS cluster?"
- "Can you deploy my manifest to my Azure Kubernetes cluster?"
- "Deploy my application manifest to an AKS cluster."
- "Deploy the manifest for my AKS cluster."

### **Generate Kubectl Command**

Users can generate various Kubectl commands to manage their AKS clusters without needing to remember complex command syntax. Using GitHub Copilot for Azure makes cluster management more accessible and efficient, especially for users who aren't Kubernetes experts.

You can generate various Kubectl commands for your AKS cluster using these prompts:

- "List all services for my AKS cluster."
- "Show the kubectl command to get deployments with at least 2 replicas in my AKS cluster."
- "Get all services in my AKS cluster with external IPs."
- "What is the kubectl command to get pod info for my AKS cluster?"
- "Get the kubectl command for listing all API resources in Azure."

## Example prompts for undeploying an app

If you deployed your application with `azd`, you can ask GitHub Copilot for Azure for undeploying assistance. As a Visual Studio Code extension, it has context about where and how you deployed your application to Azure.

Example prompts:

- "Undeploy my project using the Azure Developer CLI."
- "Use azd to undeploy my Azure project."
- "Undeploy this project from Azure."
- "Stop this app running on Azure."
- "Remove this code from running on Azure."

> [!NOTE]
> Currently, GitHub Copilot for Azure can only undeploy an app if it was originally deployed with AZD.

## Related content

- [Understand what GitHub Copilot for Azure is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-deploy-app-agent-mode.md) to understand how to include GitHub Copilot for Azure in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
