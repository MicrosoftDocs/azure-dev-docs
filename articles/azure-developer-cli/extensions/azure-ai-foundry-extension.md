---
title: Use the Microsoft Foundry azd agent extension
description: Learn about the Microsoft Foundry azd agent extension and how to scaffold, provision, and deploy an agent end to end.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 11/13/2025
ms.service: azure-dev-cli
ms.topic: tutorial
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Deploy an agent to Microsoft Foundry with the Azure Developer CLI AI agent extension

In this article, you learn to use the Azure Developer CLI (`azd`) AI agent extension to set up and deploy an agent in Microsoft Foundry. The extension lets you scaffold and deploy agents from your terminal or editor, combining Foundry capabilities with `azd` lifecycle commands (`azd init`, `azd up`) for a consistent local to cloud workflow.

## Key features

- **Project scaffolding**: Set up complete agent projects (infrastructure as code templates, agent definitions, configuration) and start iterating immediately.
- **Declarative configuration**: Define services, resources, and model deployments in an `azure.yaml` file for consistent environments.
- **Unified provisioning and deployment**: Run `azd up` to build containers, push images, create resources, deploy models, and publish the agent in one step.
- **Agent definition management**: Import agent definitions from catalogs, GitHub, or local paths; the CLI maps required parameters to environment variables.
- **Secure by default**: Set up managed identities and baseline security automatically without handling credentials manually.
- **Scalable model provisioning**: Specify model names, versions, and capacity; `azd` deploys them consistently across environments.

## Prerequisites

- The [Azure Developer CLI (`azd`) installed](/azure/developer/azure-developer-cli/install-azd) (version 1.21.0 or later).
    - The `azd ai agent` extension is built-in.
- An [Azure subscription](https://azure.com/free) with permission to create resource groups and Microsoft Foundry resources.
- The [Azure CLI installed](/cli/azure/install-azure-cli) for required operations.

## Set up and deploy an agent

Complete the following sections to provision and deploy an agent to Microsoft Foundry using the `azd` AI agent extension.

### Initialize Foundry template

1. Initialize a new project with the `azd-ai-starter-basic` template. In an empty folder, run:

    ```bash
    azd init -t Azure-Samples/azd-ai-starter-basic
    ```

1. When prompted, enter an environment name for the agent project (for example, "my-analytics-agent").

    The `azd init` process:

    - Clones the starter template files into your project
    - Creates the directory structure with `infra/` (Infrastructure as Code files) and `src/` folders
    - Generates an `azure.yaml` configuration file
    - Sets up `.azure/<env>/.env` for environment-specific variables

### Initialize the agent definition

The starter template provides the project structure, but you need to add a specific agent definition. Agent definitions describe your agent's behavior, tools, and capabilities. Find example definitions in the [Agent Framework repository](https://github.com/microsoft/agent-framework).

Use your own agent definition or one from the catalog.

Run the `azd ai agent init` command, with your own `<agent-definition-url>` value:

```bash
azd ai agent init -m <agent-definition-url>
```

The `azd ai agent init` command:

- Downloads the agent definition YAML file into your project's `src/` directory
- Analyzes the agent definition to understand its requirements
- Updates `azure.yaml` with the corresponding services and configurations
- Maps agent parameters to environment variables

### Review the project structure

The initialized template includes these key files:

```text
├── .azure/                 # Environment-specific settings (.env)
├── infra/                  # Bicep files for Azure infrastructure
├── src/                    # Agent definition and code
└── azure.yaml              # Project configuration
```

Open `azure.yaml` to see how the agent project is set up:

```yaml
requiredVersions:
    extensions:
        azure.ai.agents: '>=0.0.3'
name: ai-foundry-starter-basic
services:
    echo-agent:
        project: src/echo-agent
        host: azure.ai.agent
        language: docker
        docker:
            remoteBuild: true
        config:
            container:
                resources:
                    cpu: "1"
                    memory: 2Gi
                scale:
                    maxReplicas: 3
                    minReplicas: 1
infra:
    provider: bicep
    path: ./infra
    module: main
```

This declarative configuration defines your agent service and the Azure AI resources it needs, including model deployments.

### Provision and deploy the agent

Run `azd up` to deploy the resources and agent:

```bash
azd up
```

The `azd up` command orchestrates the deployment workflow, from infrastructure to a live agent endpoint:

- Provision infrastructure: Create the Microsoft Foundry account, project, and Azure resources defined in the Bicep files.
- **Deploys models**: Provisions the model deployments specified in `azure.yaml` (for example, GPT-4o-mini with the configured capacity).
- Build and push the container: If the agent has custom code, `azd` packages it into a container image and pushes it to the Azure Container Registry.
- Publish the agent: Create an Agent Application in Microsoft Foundry and deploy the agent as a live, callable service.

When `azd up` finishes, the output shows the Microsoft Foundry project endpoint, resource group and project names, and agent application details.

> [!NOTE]
> For a new project, the provisioning and deployment process typically takes several minutes to complete.

#### Identity and security

`azd` automatically configures secure access patterns so you don't have to manage credentials manually:

- **Managed identity**: Your agent uses the Foundry project's system-assigned managed identity to authenticate with other Azure resources.
- **Role assignments**: `azd` grants required permissions automatically (for example, giving your agent access to Azure AI services, storage, or databases).
- **Endpoint security**: Agent endpoints use Microsoft Entra ID (Azure AD) authentication by default, so only authorized users or applications can call your agent.

These security configurations follow Azure best practices and work out of the box, so you start with a secure foundation.

### Test the agent in Microsoft Foundry

1. Open the [Microsoft Foundry portal](https://ai.azure.com).
1. Go to the project set up by `azd` (the project name appears in the `azd up` output).
1. Open the **Agents** section to see your deployed agent.
1. Launch the agent in the playground and send a test query such as "Summarize your capabilities."

You see the agent's response in the chat window.

## Advanced configuration

You can customize your deployments to meet advanced requirements beyond the default workflow.

### Customize model deployments

The `azure.yaml` file gives you control over which models you deploy. To add or change a model, edit the file:

```yaml
resources:
    foundry-project:
        type: ai.project
        models:
            - name: gpt-4
              version: "turbo-2024-04-09"
              format: OpenAI
              sku:
                  name: Standard
                  capacity: 20
            - name: gpt-4o-mini
              version: "2024-07-18"
              format: OpenAI
              sku:
                  name: GlobalStandard
                  capacity: 10
```

Run `azd up` to deploy the new model and update your project.

This configuration deploys multiple models so your agent can use a larger model for complex reasoning and a smaller one for simple queries.

### Manage environment variables

Environment variables that `azd` sets or uses:

| Variable | Purpose |
|----------|---------|
| `AZURE_SUBSCRIPTION_ID` | Target subscription for resources. |
| `AZURE_RESOURCE_GROUP` | Resource group hosting the AI project. |
| `AZURE_LOCATION` | Azure region (must support chosen models). |
| `AZURE_AI_ACCOUNT_NAME` | Microsoft Foundry account (hub). |
| `AZURE_AI_PROJECT_NAME` | Project hosting the agent. |
| `AZURE_AI_FOUNDRY_PROJECT_ENDPOINT` | Endpoint for agent management and runtime calls. |

These variables are stored in `.azure/<environment-name>/.env`. Customize them for each environment (dev, test, and prod).

## Sample use cases and scenarios

Use `azd` to accelerate agent scenarios.

### Build conversational assistants

Create agents that answer questions with context and connect to internal data.

- Deploy variants for A/B testing
- Add Azure AI Search for retrieval-augmented responses
- Integrate business APIs through custom tools

### Build data and insights agents

Deliver summaries, calculations, and visualizations.

- Connect to Azure SQL Database or Cosmos DB.
- Use code interpreter tools for computation
- Mix larger reasoning models with smaller cost efficient models

### Orchestrate multiple agents

Coordinate specialists for complex workflows.

- Add a coordinator agent to route requests.
- Define relationships declaratively in `azure.yaml`.
- Scale agents independently based on load.

### Standardize enterprise deployment

Drive consistency across teams.

- Publish reusable blueprints and templates
- Apply consistent security, compliance, and monitoring
- Automate provisioning and deployment in CI/CD with `azd provision` and `azd deploy`.

## Explore the ecosystem

- **Explore sample agents**: Browse the [Agent Framework repository](https://github.com/microsoft/agent-framework) for [.NET agents](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples) and [Python agents](https://github.com/microsoft/agent-framework/tree/main/python/samples) and deploy them with `azd ai agent init`.
- **Join the community**: Share experiences and ask questions in the [Azure Developer CLI GitHub discussions](https://github.com/Azure/azure-dev/discussions).
- **Report issues and suggest features**: Give feedback. File issues or feature suggestions in the [Azure/azure-dev repository](https://github.com/Azure/azure-dev/issues) and tag them with `ai-agent`.
- **Review documentation**: Visit the [Microsoft Foundry documentation](/azure/ai-foundry/) for comprehensive guides on agent development.

## Additional resources

- [Install the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)
- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](/azure/ai-foundry/)
- [Agent Framework repository (samples and tools)](https://github.com/microsoft/agent-framework)
- [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev)
- [AI Foundry starter template](https://github.com/Azure-Samples/ai-foundry-starter-basic)
