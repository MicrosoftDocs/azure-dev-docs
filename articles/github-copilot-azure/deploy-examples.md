---
title: GitHub Copilot for Azure Preview prompt engineering examples for deploying your application
description: This article provides example prompts that can help you deploy your application to the cloud.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: best-practice
ms.date: 11/18/2024
ms.collection: ce-skilling-ai-copilot
---

# Example prompts for deploying your application with GitHub Copilot for Azure Preview

If you're unfamiliar with Azure or you just want the tooling and AI to do most of the work, you can ask GitHub Copilot for Azure Preview to help you deploy your application. Use [best practices](introduction.md#best-practices) to achieve the best results.

## Example prompts for deploying an app

If you want to use GitHub Copilot for Azure Preview for help with deploying your application, you can start with an open-ended question or request like one of these examples:

- "@azure Help me deploy my application to Azure."
- "@azure How can I deploy this app?"
- "@azure Deploy this project to Azure."
- "@azure Run this app on Azure."

Then, add more detail for better results. Here are some example prompts:

|Service or technology|Deploy prompt examples|
|---|---|
|Azure Kubernetes Service (AKS)|<ul><li>"@azure Can you help me create a new deployment in my AKS cluster?"</li><li>"@azure What is the command to scale a deployment to 5 replicas?"</li><li>"@azure Can you provide the command to expose a deployment as a service?"</li></ul>|
|Azure App Service|<ul><li>"@azure How many web app plans using the free tier do I have deployed, grouped by region in my \<placeholder\> subscription?"</li><li>"@azure How many web apps do I have deployed in eastus?"</li></ul>|
|Azure Container Apps|<ul><li>"@azure How can I deploy my container app to Azure?"</li></ul>|
|Azure Developer CLI (`azd`)|<ul><li>"@azure Use azd to deploy my project."</li><li>"@azure I want to use azd to create a deployment pipeline for my application."</li><li>"@azure Initialize my project with the Azure Developer CLI."</li><li>"@azure Please start an azd pipeline."</li></ul>|
|Azure DevOps|<ul><li>"@azure Create a deployment pipeline for this project."</li><li>"@azure I don't want to deploy my app from my local machine. Can you set up a remote solution instead?"</li><li>"@azure I need a CI/CD pipeline so I can get my app deployed."</li><li>"@azure I need help with setting up a pipeline to deploy my app to Azure."</li><li>"@azure Please help me create an automated deployment pipeline for my app."</li><li>"@azure This project is ready for automated deployment. Set that up."</li></ul>|
|Azure OpenAI Service|<ul><li>"@azure Create an OpenAI deployment with the gpt-3.5-turbo model by using a Terraform template. Set the version of the model to 0613."</li></ul>|
|GitHub Actions|<ul><li>"@azure Let's use GitHub to deploy my app to Azure."</li><li>"@azure Set up a GitHub Actions pipeline to deploy my app to Azure."</li></ul>|

In many cases, when you ask GitHub Copilot for Azure to choose Azure services and deploy your application to Azure, it will create Bicep templates and give you the option to use `azd` to begin deployment. 

>[!IMPORTANT]
>You should always inspect the Bicep templates to ensure you understand what GitHub Copilot for Azure is recommending. Furthermore, the templates are intended to be a starting point. You should plan on editing the templates to suit your needs.

## GitHub Copilot for Azure to deploy models to Azure OpenAI Service

In addition to the example prompts for deploying to Azure OpenAI Service, GitHub Copilot for Azure has the following capabilities:

- Given an existing OpenAI resource, user can deploy a model and optionally input a name for model to deploy.
- Given the name of an existing resource group, and optionally location, user can deploy a model, and @azure will deploy a new OpenAI resource. User needs to input the name of the new OpenAI resource to create.
- Given the location, user can deploy a model, and @azure will deploy a new resource group and OpenAI resource.  User needs to input the name of the new resource group and OpenAI resource to create.
- If there is insufficient quota error, the user will be asked to choose a different region.

## Example prompts for Azure Kubernetes Service (AKS)

GitHub Copilot for Azure enables users to perform a robust set of tasks related to Azure Kubernetes Service (AKS) directly from the GitHub Copilot Chat view. These skills include creating an AKS cluster, deploying a manifest to an AKS cluster, and generating Kubectl commands.

### Create an AKS Cluster

Users can quickly set up an AKS cluster using simple, natural language prompts. GitHub Copilot for Azure reduces the complexity and time required to manually configure and deploy a Kubernetes cluster.

You can create an AKS cluster using the following prompts:

- \[@azure\] can you help me create a Kubernetes cluster
- \[@azure\] can you set up an AKS cluster for me?
- \[@azure\] I have a containerized application, can you help me create an AKS cluster to host it?
- \[@azure\] create AKS cluster
- \[@azure\] Help me create a Kubernetes cluster to host my application

### Deploy a Manifest to an AKS Cluster

Users can deploy their application manifests to an AKS cluster directly from the GitHub Copilot Chat view. This simplifies the deployment process and ensures consistency. Use these predefined prompts to reduce the risk of errors during deployment, leading to more reliable and stable deployments.

To deploy a manifest file to an AKS cluster, you can use these prompts:

- \[@azure\] help me deploy my manifest file
- \[@azure\] can you deploy my manifest to my AKS cluster?
- \[@azure\] can you deploy my manifest to my Kubernetes cluster?
- \[@azure\] deploy my application manifest to an AKS cluster
- \[@azure\] deploy manifest for AKS cluster

### **Generate Kubectl Command**

Users can generate various Kubectl commands to manage their AKS clusters without needing to remember complex command syntax. Using GitHub Copilot for Azure makes cluster management more accessible and efficient, especially for users who aren't Kubernetes experts.

You can generate various Kubectl commands for your AKS cluster using these prompts:

- \[@azure\] list all services for my AKS cluster
- \[@azure\] kubectl command to get deployments with at least 2 replicas in AKS cluster
- \[@azure\] get me all services in my AKS cluster with external IPs
- \[@azure\] what is the kubectl command to get pod info for my AKS cluster?
- \[@azure\] Can you get kubectl command for getting all API resources

## Example prompts for undeploying an app

If you deployed your application with `azd`, you can ask GitHub Copilot for Azure Preview for undeploying assistance. As a Visual Studio Code extension, it has context about where and how you deployed your application to Azure.

Example prompts:

- "@azure Undeploy my project with the Azure Developer CLI."
- "@azure Use azd to undeploy my project."
- "@azure Undeploy this project from Azure."
- "@azure Stop this app on Azure."
- "@azure Remove this code from running on Azure."

> [!NOTE]
> Currently, GitHub Copilot for Azure Preview can only undeploy an app if it was originally deployed with AZD.

## Related content

- [Understand what GitHub Copilot for Azure Preview is and how it works](introduction.md).
- [Get started](get-started.md) with GitHub Copilot for Azure by installing the software and writing your first prompt.
- Follow the [quickstart](quickstart-build-deploy-applications.md) to understand how to include GitHub Copilot for Azure Preview in your software development workflow. The quickstart describes how to deploy services to Azure, monitor their status, and troubleshoot problems.
- See example prompts for [designing and developing applications for Azure](design-develop-examples.md).
- See example prompts for [learning more about Azure and understanding your Azure account, subscription, and resources](learn-examples.md).
- See example prompts for [optimizing your applications in Azure](optimize-examples.md).
- See example prompts for [troubleshooting your Azure resources](troubleshoot-examples.md).
