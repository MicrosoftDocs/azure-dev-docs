---
title: Microsoft Foundry agent extension overview
description: Learn about the Microsoft Foundry agent extension, which lets you scaffold, provision, and deploy agents to Microsoft Foundry from your terminal.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/22/2026
ms.service: azure-dev-cli
ms.topic: overview
ms.custom: devx-track-azdevcli, devx-track-ai
ai-usage: ai-generated
---

# Microsoft Foundry agent extension overview

The Azure Developer CLI (`azd`) Microsoft Foundry agent extension scaffolds, provisions, and deploys agents to Microsoft Foundry from your terminal or editor. It combines Foundry agent capabilities with `azd` lifecycle commands for a consistent local-to-cloud workflow. You can go from a sample agent to a deployed, callable endpoint with a few commands.

This article introduces the extension. For complete step-by-step guidance, see the [Microsoft Foundry hosted agents documentation](/azure/foundry/agents/concepts/hosted-agents).

## Key features

| Feature | Description |
|---|---|
| Project scaffolding | Sets up complete agent projects, including infrastructure as code templates, agent definitions, and configuration, so you can start iterating immediately. |
| Declarative configuration | Defines services, resources, and model deployments in an `azure.yaml` file for consistent environments. |
| Unified provisioning and deployment | Runs `azd up` to build containers, push images, create resources, deploy models, and publish the agent in one step. |
| Agent definition management | Imports agent definitions from catalogs, GitHub, or local paths, and maps required parameters to environment variables. |
| Secure by default | Sets up managed identities and baseline security automatically without handling credentials manually. |
| Scalable model provisioning | Specifies model names, versions, and capacity, and deploys them consistently across environments. |

## Explore the workflow

The extension follows a familiar `azd` lifecycle from scaffolding to a live agent:

1. **Scaffold**: Initialize a sample agent project, including infrastructure as code, an agent definition, and configuration.
1. **Provision and deploy**: Create the Foundry account and project, deploy models, build and push the agent container, and publish the agent.
1. **Run locally**: Iterate on the agent on your local machine while connected to remote Azure resources.
1. **Invoke and monitor**: Send prompts to the deployed agent and stream live logs.
1. **Tear down**: Remove all provisioned resources when you're done.

## Try it

Try deploying a sample agent with the bare-minimum workflow. This example uses the basic Agent Framework sample from the Microsoft Foundry documentation.

1. Scaffold a sample agent project in an empty folder:

    ```bash
    azd ai agent init -m https://github.com/microsoft-foundry/foundry-samples/blob/main/samples/python/hosted-agents/agent-framework/responses/01-basic/azure.yaml
    ```

1. Provision resources and deploy the agent in one step:

    ```bash
    azd up
    ```

    > [!TIP]
    > You can also split this step into `azd provision` and `azd deploy` for more control over each stage.

1. Remove all provisioned resources when you're finished:

    ```bash
    azd down
    ```

    > [!WARNING]
    > `azd down` permanently deletes every resource in the resource group. Use it with care in shared or production environments.

For prerequisites, model selection, local testing, and troubleshooting, see [Quickstart: Deploy your first hosted agent](/azure/foundry/agents/quickstarts/quickstart-hosted-agent?pivots=azd).

## When to use the agent extension

Microsoft Foundry supports several ways to build and deploy hosted agents, including the Python SDK, Visual Studio Code, and the portal. The `azd` agent extension is the best fit when you want to:

- **Work primarily from the terminal or editor** with a scriptable, repeatable workflow.
- **Manage infrastructure and agents together** by using declarative `azure.yaml` and Bicep files under source control.
- **Move consistently from local to cloud** using the same `azd` lifecycle commands (`azd init`, `azd up`, `azd down`) you already use for other Azure apps.
- **Standardize deployments across environments** (dev, test, and production) and automate them in CI/CD.

For a guided portal experience or to author agents with the Python SDK, start with the [Microsoft Foundry hosted agents documentation](/azure/foundry/agents/quickstarts/quickstart-hosted-agent) instead.

## Additional resources

- [Azure Developer CLI documentation](/azure/developer/azure-developer-cli/)
- [Microsoft Foundry documentation](/azure/ai-foundry/)
- [Agent Framework repository (samples and tools)](https://github.com/microsoft/agent-framework)
- [Foundry starter template](https://github.com/Azure-Samples/ai-foundry-starter-basic)
