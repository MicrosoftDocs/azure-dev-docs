---
title: Tutorial: Use the Azure AI Foundry azd agent extension
description: Learn what the Azure AI Foundry azd agent extension is, why to use it, who it is for, and how to scaffold, provision, and deploy an agent end to end.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 10/30/2025
ms.service: azure-dev-cli
ms.topic: tutorial
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Tutorial: Use the Azure AI Foundry azd agent extension

This tutorial shows how to use the Azure Developer CLI (`azd`) AI agent extension (`azd ai agent`) to scaffold, configure, provision, and deploy an Azure AI Foundry agent. You start from an empty folder, generate the project structure, provision model deployments and an AI project, and deploy a working agent.

The `azd ai agent` extension adds agent-centric workflows to the Azure Developer CLI. It integrates Azure AI Foundry projects, model deployments, and connections with existing `azd` lifecycle features, such as `azd init` and `azd up`. :

## Use cases and roles

Use the extension to:

- Accelerate inner-loop agent development without manually editing infrastructure templates and environment files.
- Reuse published blueprints (agent manifests) from an internal or public catalog.
- Keep agent infrastructure, model deployments, and application services in one declarative configuration (`azure.yaml`).
- Standardize provisioning and deployment across teams using consistent commands (`azd up`).
- Prepare agents for sharing and reuse with uniform structure, naming, and versioning.

Typical roles:

- Agent developers creating prompts, manifests, workflows, tools, and code logic.
- Application developers embedding one or more agents into web backends, APIs, or chat experiences.
- Platform or enablement teams publishing reusable agent blueprints to a catalog.
- DevOps engineers automating provisioning and deployment in CI/CD pipelines.

## Use the extension

In the following sections, you'll use the Azure AI Foundry extension to provision and deploy an agent to Azure AI Foundry.

### Initialize the foundry starter template

1. In an empty folder, run the `azd init` command:

    ```azdeveloper
    azd init -t Azure-Samples/ai-foundry-starter-basic
    ```

1. When prompted, provide an environment name for the agent project.

The `azd init` process:

- Installs the `azd ai` extension, if it isn't already installed
- Clones down the starter agent template files
- Sets environment variables required for model deployments and project context

### Review directory structure

The initialized template includes the following key files:

```text
├── .azure/                 # Environment-specific settings (.env)
├── infra/                  # Bicep files to create Azure infrastructure resources
└── azure.yaml              # Project + services + resources
```

Explore the `azure.yaml`:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
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
                    usageName: OpenAI.GlobalStandard.gpt-4o-mini
                    capacity: 10
```

### Initialize the agent definition

The AI Foundry starter template provides a basic `azd` template structure, but you'll still need to initialize an agent definition file for the type of agent you want to deploy. Azure AI Foundry provides a library of various Agent definitions you can use to get started.

(TBD - how to get the URL for the sample agent definition)

Use the URL from the Azure AI Foundry agent catalog to clone the agent definition into your starter project:

```azdeveloper
azd ai agent init -m <agent-definition-url>
```

The preceding command:

- Downloads the agent definition `yaml` file into the project `src` directory
- Analyzes the agent definition and updates the `azure.yaml` file with corresponding services

### Provision and deploy the agent resources

Use `azd up` to combine provisioning and deployment in one step:

```azdeveloper
azd up
```

The preceding command:

- Scaffolds an agent project in Azure AI Foundry
- Fetches an agent manifest from a catalog, GitHub URL, or local path
- Maps manifest parameters to environment variables and model deployment settings
- Create the Azure AI project and required model deployments
- Publishes the agent so it is available in the Azure AI Foundry project playground and via endpoints

### Test in Azure AI Foundry

1. Open the Azure AI Foundry portal.
1. Navigate to the project provisioned by `azd`.
1. Open the agent in the playground and send a query, for example: "Summarize this agent's capabilities.".

If the agent responds successfully, the deployment worked.

## Key environment variables

Common variables the extension sets or uses:

| Variable | Purpose |
|----------|---------|
| AZURE_SUBSCRIPTION_ID | Target subscription for resources. |
| AZURE_RESOURCE_GROUP | Resource group hosting the AI project. |
| AZURE_LOCATION | Azure region (must support chosen models). |
| AZURE_AI_ACCOUNT_NAME | Azure AI Foundry account (hub). |
| AZURE_AI_PROJECT_NAME | Project hosting the agent. |
| AZURE_AI_FOUNDRY_PROJECT_ENDPOINT | Endpoint for agent management and runtime calls. |

Stored per environment in `.azure/<env>/.env`.

## Next steps

- Add a connection (for example Azure AI Search) for retrieval-augmented workflows.
- Convert to a code-based agent (`main.py`, `pyproject.toml`) for custom logic.
- Introduce multiple agents for orchestration scenarios.
- Automate CI/CD with `azd provision` + `azd deploy` in pipeline stages.
