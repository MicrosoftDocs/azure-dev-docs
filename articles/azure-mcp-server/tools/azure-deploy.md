---
title: Azure MCP Server Tools for Azure Deploy
description: Use Azure MCP Server tools to manage deployments and deployment pipelines for Azure applications and infrastructure with natural language prompts from your IDE.
author: diberry
ms.author: diberry
reviewer: qianwens
ms.date: 09/16/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
tool_count: 5
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
---

# Azure MCP Server tools for Azure Deploy

The Azure MCP Server helps you manage Azure Deploy tasks. These tasks include operations that generate architecture diagrams, get app logs, retrieve deploy plans, fetch IaC rules, and provide pipeline guidance, all through natural language prompts.

Azure Deploy is a set of tools that help you plan, validate, and monitor deployments to Azure resources. For more information, see [Azure Deploy documentation](/azure/azure-resource-manager/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Get app logs

<!-- @mcpcli deploy app logs get -->

This tool shows application logs for applications that the Azure Developer CLI (azd) deploys. This tool queries the application's Log Analytics workspace for Azure Container Apps, Azure App Service, and Azure Functions. It automatically discovers the workspace and associated resources from the azd environment configuration. It works only for applications deployed by `azd up`.

Check deployment status or troubleshoot post-deployment issues.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Show me the log of the application deployed by azd for Azd env name 'dev' and workspace folder '/home/alice/projects/my-app'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **AZD env name** |  Required | The environment name created by the Azure Developer CLI (azd) and stored in AZURE_ENV_NAME during `azd init` or `azd up`. If you don't provide this parameter in context, the tool checks the `.azure` directory in the workspace, or runs `azd env list`. |
| **Workspace folder** |  Required | The full path to the workspace folder that contains the azd project. |
| **Limit** |  Optional | The maximum number of log rows to retrieve. Use it to limit results or avoid exceeding token limits. Default is 200. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp deploy app logs get \
  --workspace-folder <workspace-folder> \
  --azd-env-name <azd-env-name> \
  [--limit <limit>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `workspace-folder` | string | Yes | The full path of the workspace folder. |
| `azd-env-name` | string | Yes | The name of the environment created by azd (AZURE_ENV_NAME) during `azd init` or `azd up`. If you don't provide this parameter in context, the tool tries to find it in the `.azure` directory in the workspace or use `azd env list`. |
| `limit` | integer | No | The maximum number of log rows to retrieve. Use this parameter to get a specific number of logs or to avoid reaching the token limit. Default is 200. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |

## Generate architecture diagram

<!-- @mcpcli deploy architecture diagram generate -->

This tool is part of the Model Context Protocol (MCP) toolset. It generates an Azure service architecture diagram that shows recommended Azure services and their logical connections for an application. This tool renders the diagram from an application topology (AppTopology) provided as input. You provide an AppTopology that describes services, compute hosts, dependencies, and environment settings. You can build the AppTopology by scanning the workspace to detect services, frameworks, and environment variables for connection strings. For .NET Aspire applications, include `aspireManifest.json`. The diagram focuses on service selection and connections. It doesn't show detailed network topology or security design.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Generate the Azure architecture diagram for this application raw MCP tool input '\<secure-password\>'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Raw mcp tool input** |  Required | JSON object that defines the input structure for this tool. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp deploy architecture diagram generate \
  --raw-mcp-tool-input <raw-mcp-tool-input>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `raw-mcp-tool-input` | string | Yes | See the JSON schema after this table. |

**`raw-mcp-tool-input` JSON schema**

```json
{
    "type": "object",
    "properties": {
        "workspaceFolder": {
            "type": "string",
            "description": "The full path of the workspace folder."
        },
        "projectName": {
            "type": "string",
            "description": "The name of the project. This name generates the resource names."
        },
        "services": {
            "type": "array",
            "description": "An array of service parameters.",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "The name of the service."
                    },
                    "path": {
                        "type": "string",
                        "description": "The relative path of the service main project folder."
                    },
                    "language": {
                        "type": "string",
                        "description": "The programming language of the service."
                    },
                    "port": {
                        "type": "string",
                        "description": "The port number the service uses. Get this number from the Dockerfile for container apps. If it's not available, default to 80."
                    },
                    "azureComputeHost": {
                        "type": "string",
                        "description": "The appropriate Azure service to host this service. Use containerapp if the service is containerized and has a Dockerfile.",
                        "enum": [
                            "appservice",
                            "containerapp",
                            "function",
                            "staticwebapp",
                            "aks"
                        ]
                    },
                    "dockerSettings": {
                        "type": "object",
                        "description": "Docker settings for the service. Include these settings only if the service's azureComputeHost is containerapp.",
                        "properties": {
                            "dockerFilePath": {
                                "type": "string",
                                "description": "The absolute path to the Dockerfile for the service. If the service's azureComputeHost isn't containerapp, leave this field blank."
                            },
                            "dockerContext": {
                                "type": "string",
                                "description": "The absolute path to the Docker build context for the service. If the service's azureComputeHost isn't containerapp, leave this field blank."
                            }
                        },
                        "required": [
                            "dockerFilePath",
                            "dockerContext"
                        ]
                    },
                    "dependencies": {
                        "type": "array",
                        "description": "An array of dependent services. A compute service can depend on another compute service.",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "The name of the dependent service. You can use any name, or reference another service in the services array if you're referencing appservice, containerapp, staticwebapps, aks, or functionapp."
                                },
                                "serviceType": {
                                    "type": "string",
                                    "description": "The name of the Azure service for this dependent service.",
                                    "enum": [
                                        "azureaisearch",
                                        "azureaiservices",
                                        "appservice",
                                        "azureapplicationinsights",
                                        "azurebotservice",
                                        "containerapp",
                                        "azurecosmosdb",
                                        "functionapp",
                                        "azurekeyvault",
                                        "aks",
                                        "azuredatabaseformysql",
                                        "azureopenai",
                                        "azuredatabaseforpostgresql",
                                        "azureprivateendpoint",
                                        "azurecacheforredis",
                                        "azuresqldatabase",
                                        "azurestorageaccount",
                                        "staticwebapp",
                                        "azureservicebus",
                                        "azuresignalrservice",
                                        "azurevirtualnetwork",
                                        "azurewebpubsub"
                                    ]
                                },
                                "connectionType": {
                                    "type": "string",
                                    "description": "The connection authentication type of the dependency.",
                                    "enum": [
                                        "http",
                                        "secret",
                                        "system-identity",
                                        "user-identity",
                                        "bot-connection"
                                    ]
                                },
                                "environmentVariables": {
                                    "type": "array",
                                    "description": "An array of environment variables defined in source code to set up the connection.",
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            },
                            "required": [
                                "name",
                                "serviceType",
                                "connectionType",
                                "environmentVariables"
                            ]
                        }
                    },
                    "settings": {
                        "type": "array",
                        "description": "An array of environment variables needed to run this service. Search the entire codebase to find environment variables.",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": [
                    "name",
                    "path",
                    "azureComputeHost",
                    "language",
                    "port",
                    "dependencies",
                    "settings"
                ]
            }
        }
    },
    "required": [
        "workspaceFolder",
        "services"
    ]
}
```

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get IaC rules

<!-- @mcpcli deploy iac rules get -->

Retrieves rules and best practices for creating Bicep and Terraform Infrastructure as Code (IaC) files to deploy Azure applications. This Model Context Protocol (MCP) tool returns guidance on Azure resource configuration standards, compatibility with Azure Developer CLI (azd) and Azure CLI, and general IaC quality requirements. Use the guidance to improve Bicep scripts and Terraform templates for Azure resources and to align deployments with Azure best practices.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "Show me the rules and best practices for writing Bicep and Terraform IaC for Azure using deployment tool 'AzCli'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deployment tool** |  Required | The deployment tool to use. Valid values: `AzCli`, `AZD`. |
| **IaC type** |  Optional | The type of IaC file used for deployment. Valid values include `bicep`, `terraform`. Leave empty only if you want to use Azure CLI command script without IaC file. |
| **Resource types** |  Optional | List of Azure resource types to generate rules for. Get the value from context and use the same resources defined in the plan. Valid value: `appservice`,`containerapp`,`function`,`aks`,`azuredatabaseforpostgresql`,`azuredatabaseformysql`,`azuresqldatabase`,`azurecosmosdb`,`azurestorageaccount`,`azurekeyvault`. |



Examples

- Provide IaC rules for Bicep and Terraform for Azure App Service and Azure SQL Database: "Get rules for deployment tool 'AZD' and IaC type 'bicep' for resources 'appservice','azuresqldatabase'".
- Show best practices for a Terraform template that deploys Azure Kubernetes Service and Azure Key Vault: "Get rules for deployment tool 'AzCli' and IaC type 'terraform' for resources 'aks','azurekeyvault'".
- Request general IaC quality checks without an IaC file, using an AzCli script: "Get rules for deployment tool 'AzCli' and leave IaC type empty for resources 'azurestorageaccount'".

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp deploy iac rules get \
  --deployment-tool <deployment-tool> \
  [--iac-type <iac-type>] \
  [--resource-types <resource-types>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deployment-tool` | string | Yes | The deployment tool to use. Valid values: AzCli, AZD |
| `iac-type` | string | No | The type of IaC file used for deployment. Valid values: bicep, terraform. Leave empty ONLY if user wants to use AzCli command script and no IaC file. |
| `resource-types` | string | No | Comma-separated list of Azure resource types to generate rules for. Get the value from context and use the same resources defined in plan. Valid value: `appservice`, `containerapp`, `function`, `aks`, `azuredatabaseforpostgresql`, `azuredatabaseformysql`, `azuresqldatabase`, `azurecosmosdb`, `azurestorageaccount`, `azurekeyvault` |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get pipeline guidance

<!-- @mcpcli deploy pipeline guidance get -->

This Model Context Protocol (MCP) tool generates CI/CD pipeline configuration and step-by-step guidance to deploy an application to Azure by using GitHub Actions or Azure DevOps pipelines. It supports Azure Developer CLI (azd) and Azure CLI–based deployments. It can generate pipelines that provision infrastructure and deploy application code.

You can choose GitHub Actions or Azure DevOps, decide whether the pipeline should only deploy or also provision infrastructure, and confirm whether the project uses azd (for example, an `azure.yaml` file is present). Specify `deploy-only` or `provision-and-deploy`, and set `Is azd project` to `true` only if the project uses azd tooling and an `azure.yaml` file is available.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "How do I set up a CI/CD pipeline with GitHub Actions to deploy my app to Azure, with Deploy option `deploy-only`, it isn't an AZD project, and the pipeline platform `github-actions`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deploy option** |  Optional | Valid values: `deploy-only`, `provision-and-deploy`. Default to `deploy-only`. Set to `provision-and-deploy` only when you explicitly want an infrastructure provisioning pipeline that uses local provisioning scripts. |
| **Is AZD project** |  Optional | Whether to use AZD tool in the deployment pipeline. Set to `true` only if `azure.yaml` is provided or the context suggests AZD tools. |
| **Pipeline platform** |  Optional | The platform for the deployment pipeline. Valid values: `github-actions`, `azure-devops`. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp deploy pipeline guidance get \
  [--is-azd-project <TRUE|FALSE>] \
  [--pipeline-platform <pipeline-platform>] \
  [--deploy-option <deploy-option>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `is-azd-project` | boolean | No | Whether to use azd tool in the deployment pipeline. Set to true ONLY if `azure.yaml` is provided or the context suggests AZD tools. If the switch is included without a value, it defaults to `true`. |
| `pipeline-platform` | string | No | The platform for the deployment pipeline. Valid values: `github-actions`, `azure-devops`. |
| `deploy-option` | string | No | Valid values: `deploy-only`, `provision-and-deploy`. Default to `deploy-only`. Set to `provision-and-deploy` ONLY WHEN user explicitly wants an infrastructure provisioning pipeline that uses local provisioning scripts. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Get deploy plan

<!-- @mcpcli deploy plan get -->

Generates a formatted, step-by-step deployment plan for an application to Azure. This tool, part of the Model Context Protocol (MCP), suggests Azure resources, provides infrastructure as code (IaC) templates, and lists deployment steps based on a target hosting service and a chosen provisioning tool. For example, target hosting services include Azure Container Apps, Azure App Service, or Azure Kubernetes Service (AKS). For provisioning tools, examples include Azure Developer CLI (azd), Azure CLI with Bicep, or Terraform.

This tool doesn't scan your workspace or detect resources automatically. You analyze the project, determine frameworks, dependencies, and existing resources, choose the hosting service and provisioning tool, and then provide those values to generate the plan.

#### [MCP Server](#tab/mcp-server)

Example prompts include:

- "How do I create a step-by-step deployment plan for project name 'my-webapp' to Azure with deploy option 'provision-and-deploy', provisioning tool 'AZD', source type 'from-project', target app service 'WebApp', workspace folder '/home/dev/my-webapp', and IaC options 'bicep'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deploy option** |  Optional | Set the value based on project and user input. Valid values: `provision-and-deploy`, `deploy-only`, `provision-only`. Choose `deploy-only` when you deploy to existing Azure resources or when IaC files already exist. Choose `provision-only` when you only want to provision Azure resources. Choose `provision-and-deploy` when you want to provision infrastructure and deploy the application. |
| **Project name** |  Required | The name of the project to generate the deployment plan for. If you don't provide a project name, the tool infers it from the workspace. |
| **Provisioning tool** |  Optional | The tool to use for provisioning Azure resources. Valid values: `AzCli`, `AZD`. For example, Azure Developer CLI (azd) or Azure CLI with Bicep. |
| **Source type** |  Optional | The source of the plan to generate from. Valid values: `from-project`, `from-azure`, `from-context`. Use `from-project` to base the plan on project files in the workspace. Use `from-azure` to base the plan on existing Azure resources. Use `from-context` to base the plan on values you provide when no project files or Azure resources exist. |
| **Target app service** |  Optional | The Azure service to deploy the application. Valid values: `ContainerApp`, `WebApp`, `FunctionApp`, `AKS`. Recommend one based on the application architecture and runtime. |
| **IaC options** |  Optional | The Infrastructure as Code option. Valid values: `bicep`, `terraform`. Leave empty to use an Azure CLI script. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp deploy plan get \
  --project-name <project-name> \
  [--target-app-service <target-app-service>] \
  [--provisioning-tool <provisioning-tool>] \
  [--source-type <source-type>] \
  [--deploy-option <deploy-option>] \
  [--iac-options <iac-options>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project-name` | string | Yes | The name of the project to generate the deployment plan for. |
| `target-app-service` | string | No | The Azure service to deploy the application. Valid values: ContainerApp, WebApp, FunctionApp, AKS. If not specified, defaults to ContainerApp. Recommend one based on the user application when possible. |
| `provisioning-tool` | string | No | The tool to use for provisioning Azure resources. Valid values: AzCli, AZD. |
| `source-type` | string | No | The source of the plan to generate from. Valid values: `from-project`, `from-azure`, `from-context`. If user doesn't have existing resources, set `from-project` and generate the deploy plan based on the project files in the workspace. If user mentions Azure resources exist, set `from-azure` and ask for existing Azure resources details to generate plan. If the user has no existing resource but declares the expected Azure resources, use `from-context` and the deploy plan should be based on the user's input. |
| `deploy-option` | string | No | Set the value based on project and user's input. Valid values: `provision-and-deploy`, `deploy-only`, `provision-only`. Use `deploy-only` if user mentions they want to deploy to existing Azure resources or IaC files already exist in project, get Azure resource group from project files or from user. Use `provision-only` if user only wants to provision Azure resources. Use `provision-and-deploy` if user wants to deploy application and doesn't have existing infrastructure resources, or are starting from an empty resource group. |
| `iac-options` | string | No | The Infrastructure as Code option. Valid values: bicep, terraform. Leave empty if user wants to use azcli command script. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure deployment documentation](/azure/azure-resource-manager/templates/)
