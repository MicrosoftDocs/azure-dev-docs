---
title: Deploy Tools
description: Streamline Azure resource deployment with Azure MCP Server. Learn how to deploy applications and infrastructure efficiently. 
keywords: azure mcp server, azmcp, deploy
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 08/20/2025
---

# Azure Deploy tools for the Azure MCP Server

Azure MCP Server simplifies Azure resource deployment by providing a unified experience for deploying applications and infrastructure. This article explains how to use Azure MCP Server to streamline your deployment process and improve efficiency.

## App: get logs

This tool fetches logs from the [Log Analytics](/azure/azure-monitor/logs/log-analytics-overview) workspace for Container Apps, App Services, and Function Apps deployed using azd. Use it after a successful `azd up` to check app status or troubleshoot errors in deployed applications.

Example prompts include:

- **Fetch app logs**: "Get logs for my app service in the 'production' environment."
- **View deployment logs**: "Show me the latest deployment logs for my container app."
- **Check function logs**: "Retrieve logs for my function app in workspace 'analytics'."
- **Troubleshoot app**: "Show error logs for my web app deployed with azd."
- **Get logs with limit**: "Get the last 50 logs for my app service."

| Parameter | Required or optional| Description |
|-----------|----------|-------------|
| **Workspace folder** |  Required | The full path of the workspace folder. |
| **AZD environment name** | Required | The name of the environment created by AZD in the AZURE_ENV_NAME variable during `azd init` or `azd up`. |
| **Limit** | Optional | The maximum row number of logs to retrieve. Use this to get a specific number of logs or to avoid the retrieved logs from reaching token limit. Default is 200. |

## Architecture: generate mermaid diagram

Generate a [Mermaid](https://mermaid.js.org/) architecture diagram for the application topology. 

Example prompts include:

- **Generate architecture diagram**: "Create a Mermaid diagram for my Azure application."
- **Show app topology**: "Visualize the architecture of my deployed services."
- **Diagram resources**: "Generate a diagram for all resources in my workspace."
- **App structure diagram**: "Show the structure of my container app and function app."
- **Service relationship diagram**: "Create a diagram showing how my web app connects to the database."

| Parameter |  Required or optional| Description |
|-----------|----------|-------------|
| **Raw input** | Required | The raw input to process. |


## Infrastructure as Code: get guidance

This tool offers guidance for creating [Bicep](/azure/azure-resource-manager/bicep/) or Terraform files to deploy applications on Azure. The guidelines outline rules to improve the quality of Infrastructure as Code files, ensuring they are compatible with the AZD tool and adhere to best practices.

Example prompts include:

- **IaC guidance for Bicep**: "Give me best practices for Bicep files for my web app."
- **Terraform rules**: "What are the guidelines for writing Terraform for Azure Container Apps?"
- **Resource-specific rules**: "Show me IaC rules for deploying appservice and aks."
- **AZD compatibility**: "How do I make my Bicep files compatible with AZD?"
- **IaC for multiple resources**: "Provide guidance for Bicep and Terraform for appservice, containerapp, and function."

| Parameter | Required or optional| Description |
|-----------|----------|-------------|
| **Deployment tool** | Required | The deployment tool to use. Valid values: `AZD`, `AzCli`. |
| **Infrastructure as code file type** | Optional | The Infrastructure as Code type. Valid values: `bicep`, `terraform`. Leave empty if deployment tool is the Azure CLI. |
| **Resource types** | Optional | Specifies the Azure resource types to retrieve IaC rules for. It should be comma-separated. Supported values are: `appservice`, `containerapp`, `function`, `aks`. If none of these services are used, this parameter can be left empty. |

## Pipeline: get guidance

Guidance to create a CI/CD pipeline which provision Azure resources and build and deploy applications to Azure. Use this tool before creating a Github actions workflow file for deployment on Azure. Infrastructure files should be ready and the application should be ready to be containerized.

Example prompts include:

- **CI/CD pipeline setup**: "How do I set up a CI/CD pipeline for my Azure app?"
- **GitHub Actions guidance**: "Give me guidance for creating a GitHub Actions workflow for deployment."
- **Pipeline for containerized app**: "What are the steps to build and deploy a container app using AZD?"
- **Environment-specific pipeline**: "Set up a pipeline for deploying to the 'staging' environment."
- **Pipeline configuration**: "Show me how to use azure.yaml for pipeline setup."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Use AZD pipeline configuration** | Optional | Whether to use the AZD tool to set up the deployment pipeline. Set to true only if `azure.yaml` is provided or the context suggests AZD tools. |
| **Organization name** | Optional | The name of the organization or the user account name of the current Github repository. |
| **Repository name** | Optional | The name of the current Github repository. |
| **GitHub environment name** | Optional | The name of the environment to which the deployment pipeline will be deployed. |


## Plan: create deployment plan

Generates a deployment plan to construct the infrastructure and deploy the application on Azure. Agent should read its output and generate a deployment plan in `.azure/plan.copilotmd` for execution steps, with recommended Azure services based on the information detected from project. 

<!-- `azmcp deploy plan get` -->

Example prompts include:

- **Generate deployment plan**: "Create a deployment plan for my Azure web app."
- **Plan for multiple services**: "Generate a plan to deploy container app and function app."
- **Deployment steps**: "Show me the steps to deploy my project to Azure using AZD."
- **Service recommendation**: "Recommend Azure services for my application and generate a plan."
- **Provisioning plan**: "Create a plan using Bicep for my appservice and aks resources."

| Parameter |  Required or optional| Description |
|-----------|----------|-------------|
| **Workspace folder** |  Required | The full path of the workspace folder. |
| **Project name** |  Required | The name of the project to generate the deployment plan for. If not provided, will be inferred from the workspace. |
| **Target app service** |  Required | The Azure service to deploy the application. Valid values: `ContainerApp`, `WebApp`, `FunctionApp`, `AKS`. Recommend one based on user application. |
| **Provisioning tool** |  Required | The tool to use for provisioning Azure resources. Valid values: `AZD`, `AzCli`. Use AzCli if TargetAppService is `AKS`. |
| **Azd IaC options** |  Optional | The Infrastructure as Code option for AZD. Valid values: `bicep`, `terraform`. Leave empty if Deployment tool is `AzCli`. |



