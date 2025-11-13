---
title: Use the Azure AI Foundry azd agent extension
description: Learn what the Azure AI Foundry azd agent extension is, why to use it, who it is for, and how to scaffold, provision, and deploy an agent end to end.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/30/2025
ms.service: azure-dev-cli
ms.topic: tutorial
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Deploy an agent to Microsoft Foundry with the azd AI agent extension

The Azure Developer CLI (`azd`) AI agent extension helps you build, set up, and publish AI agents on Microsoft Foundry, bridging the gap between local development and cloud deployment. It puts everything in your terminal and editor so you can go from an idea to a running, shareable agent in Azure with minimal friction.

With this extension, combine Microsoft Foundry's advanced features, like multi-model reasoning and integrated evaluations, with the developer friendly workflow of `azd`. Iterate on AI agents locally and push them to the cloud at scale, all with a consistent set of tools.

## Overview and key features

The `azd ai agent` extension adds agent centric workflows directly to the Azure Developer CLI. It integrates Microsoft Foundry projects, model deployments, connections, and agent definitions with existing lifecycle commands like `azd init` and `azd up`. Automate scaffolding, provisioning, and publishing to go from an empty folder to a callable endpoint in minutes.

Key features include:

- **Project scaffolding**: Initialize complete agent projects (infrastructure-as-code templates, agent definitions, configuration) to start iterating immediately.
- **Declarative configuration**: Define services, resources, and model deployments in a single version controlled `azure.yaml` for repeatable environments.
- **Unified provisioning and deployment**: Run `azd up` to build containers (when needed), push images, create resources, deploy models, and publish the agent in one step.
- **Agent definition management**: Import agent definitions from catalogs, GitHub, or local paths. The CLI analyzes them and maps required parameters to environment variables.
- **Secure by default**: Automatic managed identity setup and recommended baseline security without manual credential handling.
- **Scalable model provisioning**: Specify model names, versions, SKUs, and capacity. `azd` deploys them consistently across environments.

## Prerequisites

Before you start, make sure you have:

- [Azure Developer CLI (`azd`)](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd) (version 1.21.0 or later) installed and authenticated (`azd auth login`). The `azd ai agent` extension is built in.
- An Azure subscription with permissions to create resource groups and Microsoft Foundry resources
  - Sign up for a free account at [azure.com/free](https://azure.com/free) if you don't have one.
- Azure CLI (`az`) installed for some operations

## Initialize the Foundry configuration template

Initialize a new project with the `azd-ai-starter-basic` template. In an empty folder, run:

```bash
azd init -t Azure-Samples/azd-ai-starter-basic
```

When prompted, provide an environment name for your agent project (for example, "my-analytics-agent").

The `azd init` process:

- Clones the starter template files into your project
- Creates the directory structure with `infra/` (Infrastructure as Code files) and `src/` folders
- Generates an `azure.yaml` configuration file
- Sets up `.azure/<env>/.env` for environment-specific variables

### Review your project structure

The initialized template includes these key files:

```text
├── .azure/                 # Environment-specific settings (.env)
├── infra/                  # Bicep files for Azure infrastructure
├── src/                    # Agent definition and code
└── azure.yaml              # Project configuration
```

Open the `azure.yaml` to see how your agent project is configured:

```yaml
name: analytics-agent-demo

services:
    analytics-agent:
        project: src
        host: foundry.hostedagent

resources:
    foundry-project:
        type: ai.project
        models:
            - name: gpt-4o-mini
              version: "2024-07-18"
              format: OpenAI
              sku:
                  name: GlobalStandard
                  capacity: 10
```

This declarative configuration defines your agent service and the Azure AI resources it needs, including model deployments.

### Initialize your agent definition

The starter template provides the project structure, but you need to add a specific agent definition. Agent definitions describe your agent's behavior, tools, and capabilities. Find example definitions in the [Agent Framework repository](https://github.com/microsoft/agent-framework).

Use your own agent definition, or an existing definition from the catalog. In the following command, replace the placeholder text *`<agent-definition-url>`* with your agent definition URL:

```bash
azd ai agent init -m <agent-definition-url>
```

The preceding command:

- Downloads the agent definition YAML file into your project's `src/` directory
- Analyzes the agent definition to understand its requirements
- Updates `azure.yaml` with the corresponding services and configurations
- Maps agent parameters to environment variables

### Provision and deploy your agent

With your project configured, deploy everything to Azure with one familiar command:

```bash
azd up
```

This single command orchestrates your entire deployment workflow, from infrastructure to a live agent endpoint:

1. **Provisions infrastructure**: Creates your Microsoft Foundry account, project, and all necessary Azure resources defined in your Bicep files.
1. **Deploys models**: Provisions the model deployments specified in `azure.yaml` (for example, GPT-4o-mini with the configured SKU and capacity).
1. **Builds and pushes container**: If your agent has custom code, `azd` packages it into a container image and pushes it to your Azure Container Registry.
1. **Publishes agent**: Creates an Agent Application in Microsoft Foundry and deploys your agent as a live, callable service.

For a new project, the provisioning and deployment process typically takes several minutes to complete. When `azd up` finishes, you see output that includes the Microsoft Foundry project endpoint, resource group and project names, and agent application details.

### Test your agent in Microsoft Foundry

To test your agent in Microsoft Foundry:

1. Open the [Microsoft Foundry portal](https://ai.azure.com).
1. Go to the project provisioned by `azd` (the project name is displayed in the `azd up` output).
1. Open the **Agents** section to see your deployed agent.
1. Launch the agent in the playground, and send a test query, for example, "Summarize your capabilities".

You see a response from the agent in the chat window.



## How it works

This section explains how `azd` turns a local agent project into a secure, running service in Microsoft Foundry. At a high level, azd scaffolds your project, sets up resources and models, builds and publishes containers, and configures identity before deploying the agent application.

### Project scaffolding and configuration

When you run `azd init` with a Microsoft Foundry template, `azd` sets up a complete, well-structured project. The template includes:

- **Bicep infrastructure files** in the `infra/` directory that define all the necessary Microsoft Foundry resources, model deployments, and networking.
- **An `azure.yaml` file** that provides a declarative map of your services, resources, and dependencies.
- **Environment configurations** in `.azure/<env>/.env` that store subscription IDs, resource names, and endpoints.

Next, when you run `azd ai agent init`, the CLI:

- Gets the agent definition from the URL or local path you provide.
- Reads the YAML to understand the agent's requirements (models, tools, connections).
- Updates `azure.yaml` to include the agent as a service.
- Creates or updates environment variables for the agent runtime.

### Resource setup

The `azd up` command triggers all infrastructure setup through Azure Resource Manager. Based on your `azure.yaml` and Bicep files, `azd`:

- Compiles your Bicep templates into ARM templates.
- Creates a resource group in your Azure region.
- Sets up the Microsoft Foundry account and project.
- Deploys the specified models to the project with your configured SKUs and capacity.

For example, if your `azure.yaml` specifies `gpt-4o-mini` with version `2024-07-18`, `azd` creates that exact model deployment in your Foundry project. This declarative approach ensures consistency between environments, so your development, staging, and production deployments use identical configurations.

### Container build and publishing

For agents with custom code (for custom tools, integrations, or business logic), `azd` handles the complete containerization workflow:

1. **Build**: Packages your agent code into a Docker container image using the configuration from your project.
1. **Push**: Authenticates to Azure Container Registry and pushes the image with a unique tag.
1. **Deploy**: Creates an Agent Application in Microsoft Foundry and a deployment that runs your container.

azd deploys your agent to Azure Container Apps, which provides automatic scaling, managed compute, and integrated monitoring. The Agent Application is the stable, versioned interface for your agent, with a unique name and endpoint.

### Identity and security

Finally, `azd` automatically configures secure access patterns so you don't have to manage credentials manually:

- **Managed identity**: Your agent uses the Foundry project's system-assigned managed identity to authenticate with other Azure resources.
- **Role assignments**: azd grants required permissions automatically (for example, giving your agent access to Azure AI services, storage, or databases).
- **Endpoint security**: Agent endpoints use Azure AD authentication by default, so only authorized users or applications can call your agent.

These security configurations follow Azure best practices and work out of the box, so you start with a secure foundation.

## Use cases and scenarios

Use these `azd` features to build different types of agents.

### Build conversational AI assistants

Create intelligent customer service agents that understand context, access knowledge bases, and provide personalized responses. Use `azd` to:

- Rapidly deploy multiple agent variations for A/B testing
- Integrate agents with Azure AI Search for retrieval-augmented generation
- Connect to business systems and APIs through custom tools
- Version and roll back agent deployments as you iterate

### Build data analysis and insights agents

Build agents that analyze data, generate visualizations, and provide insights. With `azd`, you can:

- Provision agents with access to Azure SQL Database or Cosmos DB.
- Deploy specialized models for quantitative analysis.
- Create agents that use code interpreter tools for calculations.
- Publish agents that help people learn a language.

### Multi-agent orchestration

Develop systems where multiple specialized agents collaborate on complex tasks:

- Deploy a coordinator agent that routes requests to specialist agents
- Provision each agent with different model configurations for optimal performance
- Use the declarative `azure.yaml` to define agent relationships and dependencies
- Scale individual agents independently based on workload

### Enterprise agent deployment

Standardize agent development and deployment across your organization:

- Create reusable agent blueprints that encode your organization's best practices
- Publish agent templates to internal catalogs for teams to consume
- Enforce consistent security, compliance, and monitoring configurations
- Automate agent deployment in CI/CD pipelines using `azd provision` and `azd deploy`

## Advanced configuration

Once you're comfortable with the basic workflow, you can customize your deployments to meet more advanced requirements.

### Customizing model deployments

Your `azure.yaml` file gives you full control over which models get deployed. To add or change a model, simply edit the file:

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

This configuration provisions multiple models, enabling your agent to use different models for different tasks (for example, a larger model for complex reasoning and a smaller one for simple queries). When you next run `azd up`, it will automatically deploy the new model and update your project.

### Managing environment variables

Key environment variables `azd` sets or uses:

| Variable | Purpose |
|----------|---------|
| `AZURE_SUBSCRIPTION_ID` | Target subscription for resources. |
| `AZURE_RESOURCE_GROUP` | Resource group hosting the AI project. |
| `AZURE_LOCATION` | Azure region (must support chosen models). |
| `AZURE_AI_ACCOUNT_NAME` | Microsoft Foundry account (hub). |
| `AZURE_AI_PROJECT_NAME` | Project hosting the agent. |
| `AZURE_AI_FOUNDRY_PROJECT_ENDPOINT` | Endpoint for agent management and runtime calls. |

These variables are stored in `.azure/<environment-name>/.env` and can be customized for each of your environments (for example, dev, test, and prod).

### Adding connections for retrieval-augmented generation

To integrate Azure AI Search or other data sources for Retrieval-Augmented Generation (RAG), the process is just as simple:

1. Add the connection resource to your `azure.yaml`.
1. Update your agent definition to reference the connection.
1. Run `azd up` to provision the connection and redeploy your agent.

The `azd` commands handle all the underlying wiring between your agent and the connected services, so you can focus on building great RAG experiences.

## Current status and what's next

The new `azd ai agent` capabilities are available in public preview as of Microsoft Ignite 2025. While it's an early release, it's ready for you to try today, and we're actively evolving these features based on your feedback.

### Getting involved

To get started:

- **Explore sample agents**: Check out the [Agent Framework repository](https://github.com/microsoft/agent-framework) for [.NET agents](https://github.com/microsoft/agent-framework/tree/main/dotnet/samples) and [Python agents](https://github.com/microsoft/agent-framework/tree/main/python/samples) you can deploy with `azd ai agent init`.
- **Join the community**: Share your experiences and ask questions in the [Azure Developer CLI GitHub discussions](https://github.com/Azure/azure-dev/discussions).
- **Report issues and suggest features**: We're eager for your feedback! File issues or suggestions in the [Azure/azure-dev repository](https://github.com/Azure/azure-dev/issues) (tag them with `ai-agent`).
- **Review documentation**: Visit the [Microsoft Foundry documentation](https://learn.microsoft.com/azure/ai-foundry/) for comprehensive guides on agent development.

### What's coming next

The team is working on several enhancements:

- Expanded agent definition catalog with more pre-built blueprints
- Enhanced local testing and debugging workflows
- Support for additional Azure AI services and connections
<!-- /TODO: verify this list before publishing and add two more items -->

Your feedback will shape these priorities, so we encourage you to share your ideas and use cases.

## Start building intelligent agents today

We believe this new extension will change how you develop agents by letting you focus on what's important: building intelligent solutions. We've handled the complexity so you can get back to creating. With Microsoft Foundry's advanced capabilities and `azd`'s developer-friendly workflow, you have everything you need to create, iterate, and deploy production-grade AI agents.

[Install the Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd) today and start building the next generation of AI agents.

## Additional resources

- [Azure Developer CLI documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Agent Framework repository (samples and tools)](https://github.com/microsoft/agent-framework)
- [Azure Developer CLI GitHub repository](https://github.com/Azure/azure-dev)
- [AI Foundry starter template](https://github.com/Azure-Samples/ai-foundry-starter-basic)

Happy building!
