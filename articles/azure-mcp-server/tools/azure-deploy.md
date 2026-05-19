---

title: Azure MCP Server tools for Azure Deploy
description: Use Azure MCP Server tools to manage deployments and deployment pipelines for Azure applications and infrastructure with natural language prompts from your IDE.
ms.date: 04/06/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 5
mcp-cli.version: 2.0.0-beta.39+0410ff6ade5c70a207a8e7c7a7c78be69f7f1d76
author: diberry
ms.author: diberry
reviewer: qianwens
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Deploy

The Azure MCP Server helps you manage Azure Deploy tasks. These tasks include operations that generate architecture diagrams, get app logs, retrieve deploy plans, fetch IaC rules, and provide pipeline guidance, all through natural language prompts.

Azure Deploy is a set of tools that help you plan, validate, and monitor deployments to Azure resources. For more information, see [Azure Deploy documentation](/azure/azure-resource-manager/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Get app logs

<!-- @mcpcli deploy app logs get -->

This tool shows application logs for applications that the Azure Developer CLI (azd) deploys. This tool queries the application's Log Analytics workspace for Azure Container Apps, Azure App Service, and Azure Functions. It automatically discovers the workspace and associated resources from the azd environment configuration. It works only for applications deployed by `azd up`.

Check deployment status or troubleshoot post-deployment issues.

Example prompts include:

- "Show me the log of the application deployed by azd for Azd env name 'dev' and workspace folder '/home/alice/projects/my-app'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **AZD env name** |  Required | The environment name created by the Azure Developer CLI (azd) and stored in AZURE_ENV_NAME during `azd init` or `azd up`. If not provided in context, this tool checks the `.azure` directory in the workspace, or runs `azd env list`. |
| **Workspace folder** |  Required | The full path to the workspace folder that contains the azd project. |
| **Limit** |  Optional | The maximum number of log rows to retrieve. Use it to limit results or avoid exceeding token limits. Default is 200. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Generate architecture diagram

<!-- @mcpcli deploy architecture diagram generate -->

This tool is part of the Model Context Protocol (MCP) toolset. It generates an Azure service architecture diagram that shows recommended Azure services and their logical connections for an application. This tool renders the diagram from an application topology (AppTopology) provided as input. You provide an AppTopology that describes services, compute hosts, dependencies, and environment settings. You can build the AppTopology by scanning the workspace to detect services, frameworks, and environment variables for connection strings. For .NET Aspire applications, include `aspireManifest.json`. The diagram focuses on service selection and connections. It doesn't show detailed network topology or security design.

Example prompts include:

- "Generate the Azure architecture diagram for this application raw MCP tool input '\<secure-password\>'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Raw mcp tool input** |  Required | JSON object that defines the input structure for this tool. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get IaC rules

<!-- @mcpcli deploy iac rules get -->

Retrieves rules and best practices for creating Bicep and Terraform Infrastructure as Code (IaC) files to deploy Azure applications. This Model Context Protocol (MCP) tool returns guidance on Azure resource configuration standards, compatibility with Azure Developer CLI (azd) and Azure CLI, and general IaC quality requirements. Use the guidance to improve Bicep scripts and Terraform templates for Azure resources and to align deployments with Azure best practices.

Example prompts include:

- "Show me the rules and best practices for writing Bicep and Terraform IaC for Azure using deployment tool 'AzCli'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deployment tool** |  Required | The deployment tool to use. Valid values: `AzCli`, `AZD`. |
| **IaC type** |  Optional | The type of IaC file used for deployment. Valid values include `bicep`, `terraform`. Leave empty only if you want to use Azure CLI command script without IaC file. |
| **Resource types** |  Optional | List of Azure resource types to generate rules for. Get the value from context and use the same resources defined in the plan. Valid value: `appservice`,`containerapp`,`function`,`aks`,`azuredatabaseforpostgresql`,`azuredatabaseformysql`,`azuresqldatabase`,`azurecosmosdb`,`azurestorageaccount`,`azurekeyvault`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

Examples

- Provide IaC rules for Bicep and Terraform for Azure App Service and Azure SQL Database: "Get rules for deployment tool 'AZD' and IaC type 'bicep' for resources 'appservice','azuresqldatabase'".
- Show best practices for a Terraform template that deploys Azure Kubernetes Service and Azure Key Vault: "Get rules for deployment tool 'AzCli' and IaC type 'terraform' for resources 'aks','azurekeyvault'".
- Request general IaC quality checks without an IaC file, using an AzCli script: "Get rules for deployment tool 'AzCli' and leave IaC type empty for resources 'azurestorageaccount'".

## Get pipeline guidance

<!-- @mcpcli deploy pipeline guidance get -->

This Model Context Protocol (MCP) tool generates CI/CD pipeline configuration and step-by-step guidance to deploy an application to Azure by using GitHub Actions or Azure DevOps pipelines. It supports Azure Developer CLI (azd) and Azure CLI–based deployments. It can generate pipelines that provision infrastructure and deploy application code.

You can choose GitHub Actions or Azure DevOps, decide whether the pipeline should only deploy or also provision infrastructure, and confirm whether the project uses azd (for example, an `azure.yaml` file is present). Specify `deploy-only` or `provision-and-deploy`, and set `Is azd project` to `true` only if the project uses azd tooling and an azure.yaml file is available.

Example prompts include:

- "How do I set up a CI/CD pipeline with GitHub Actions to deploy my app to Azure, with Deploy option 'deploy-only', it isn't an AZD project, and the pipeline platform 'github-actions'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deploy option** |  Required | Valid values: deploy-only, provision-and-deploy. Default to deploy-only. Set to `provision-and-deploy` only when you explicitly want an infra provisioning pipeline that uses local provisioning scripts. |
| **Is AZD project** |  Required | Whether to use AZD tool in the deployment pipeline. Set to `true` only if `azure.yaml` is provided or the context suggests AZD tools. |
| **Pipeline platform** |  Required | The platform for the deployment pipeline. Valid values: `github-actions`, `azure-devops`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get deploy plan

<!-- @mcpcli deploy plan get -->

Generates a formatted, step-by-step deployment plan for an application to Azure. This tool, part of the Model Context Protocol (MCP), suggests Azure resources, provides infrastructure as code (IaC) templates, and lists deployment steps based on a target hosting service and a chosen provisioning tool. For example, target hosting services include Azure Container Apps, Azure App Service, or Azure Kubernetes Service (AKS). For provisioning tools, examples include Azure Developer CLI (azd), Azure CLI with Bicep, or Terraform.

This tool doesn't scan your workspace or detect resources automatically. You analyze the project, determine frameworks, dependencies, and existing resources, choose the hosting service and provisioning tool, and then provide those values to generate the plan.

Example prompts include:

- "How do I create a step-by-step deployment plan for project name 'my-webapp' to Azure with deploy option 'provision-and-deploy', provisioning tool 'AZD', source type 'from-project', target app service 'WebApp', workspace folder '/home/dev/my-webapp', and IaC options 'bicep'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deploy option** |  Required | Set the value based on project and user input. Valid values: `provision-and-deploy`, `deploy-only`, `provision-only`. Choose `deploy-only` when you deploy to existing Azure resources or when IaC files already exist. Choose `provision-only` when you only want to provision Azure resources. Choose `provision-and-deploy` when you want to provision infrastructure and deploy the application. |
| **Project name** |  Required | The name of the project to generate the deployment plan for. If you don't provide a project name, the tool infers it from the workspace. |
| **Provisioning tool** |  Required | The tool to use for provisioning Azure resources. Valid values: `AzCli`, `AZD`. For example, Azure Developer CLI (azd) or Azure CLI with Bicep. |
| **Source type** |  Required | The source of the plan to generate from. Valid values: `from-project`, `from-azure`, `from-context`. Use `from-project` to base the plan on project files in the workspace. Use `from-azure` to base the plan on existing Azure resources. Use `from-context` to base the plan on values you provide when no project files or Azure resources exist. |
| **Target app service** |  Required | The Azure service to deploy the application. Valid values: `ContainerApp`, `WebApp`, `FunctionApp`, `AKS`. Recommend one based on the application architecture and runtime. |
| **Workspace folder** |  Required | The full path of the workspace folder. |
| **IaC options** |  Optional | The Infrastructure as Code option. Valid values: `bicep`, `terraform`. Leave empty to use an Azure CLI script. |
| **Resource group** | Optional | The name of the Azure resource group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure deployment documentation](/azure/azure-resource-manager/templates/)