---
title: Deploy to a Microsoft Foundry or Azure Machine Learning studio online endpoint using the Azure Developer CLI
description: Learn how to deploy to a Microsoft Foundry or Azure Machine Learning studio online endpoint using the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/27/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Deploy to a Microsoft Foundry or Azure Machine Learning studio online endpoint

The Azure Developer CLI (`azd`) enables you to deploy to an [Azure Machine Learning studio](https://ml.azure.com) or [Microsoft Foundry](https://ai.azure.com) online endpoint. `azd` supports the following features, which are described in the sections ahead:

* Custom environments
  * Environments can be viewed in [Azure Machine Learning studio](https://ml.azure.com/) under the **Environments** section.
* Custom models
  * Models can be viewed in [Azure Machine Learning studio](https://ml.azure.com/) under the **Models** section.
* Prompt flows
  * Flows can be viewed in [Azure Machine Learning studio](https://ml.azure.com/) under the **Flows** section.
  * Flows can be viewed in the [Microsoft Foundry portal](https://ai.azure.com/) under the **Flows** section.
* Online deployments (within online endpoint)
  * Deployments can be viewed in [Azure Machine Learning studio](https://ml.azure.com/) under the **Deployments** section.
  * Deployments can be viewed in the [Microsoft Foundry portal](https://ai.azure.com/) under the **Deployments** section.

## Prerequisites

To work with Microsoft Foundry or Azure Machine Learning studio online endpoints, you need:

* [Azure Subscription](https://signup.azure.com/signup) with OpenAI access enabled
* [AI Hub Resource](/azure/ai-studio/concepts/ai-resources)
* [AI Project](/azure/ai-studio/how-to/create-projects)
* [OpenAI Service](/azure/ai-services/openai/)
* [Online Endpoint](/azure/machine-learning/concept-endpoints-online)
* [AI Search Service](/azure/search/) (Optional, enabled by default)

The [Foundry Starter template](https://github.com/Azure-Samples/azd-aistudio-starter) can help create all the required infrastructure to get started with Foundry endpoints.

## Configure the online endpoint

Configure support for online endpoints in the `services` section of the `azure.yaml` file:

* Set the `host` value to `ai.endpoint`.
* The `config` section for `ai.endpoint` supports the following configurations:
  * **workspace**: The name of the Microsoft Foundry workspace. Supports `azd` environment variable substitutions and syntax.
    * If not specified, `azd` looks for an environment variable with the name `AZUREAI_PROJECT_NAME`.
  * **environment**: Optional custom configuration for ML environments. `azd` creates a new environment version from the referenced YAML file definition.
  * **flow**: Optional custom configuration for flows. `azd` creates a new prompt flow from the specified file path.
  * **model**: Optional custom configuration for ML models. `azd` creates a new model version from the referenced YAML file definition.
  * **deployment**: **Required** configuration for online endpoint deployments. `azd` creates a new online deployment to the associated online endpoint from the referenced YAML file definition.

Consider the following sample `azure.yaml` file that configures these features:

```yaml
name: contoso-chat
metadata:
  template: contoso-chat@0.0.1-beta
services:
  chat:
    # Referenced new ai.endpoint host type
    host: ai.endpoint
    # New config flow for AI project configuration
    config:
      # The name of the Foundry workspace
      workspace: ${AZUREAI_PROJECT_NAME}
      # Optional: Path to custom ML environment manifest
      environment:
        path: deployment/docker/environment.yml
      # Optional: Path to your prompt flow folder that contains the flow manifest
      flow:
        path: ./contoso-chat
      # Optional: Path to custom model manifest
      model:
        path: deployment/chat-model.yaml
        overrides:
          "properties.azureml.promptflow.source_flow_id": ${AZUREAI_FLOW_NAME}
      # Required: Path to deployment manifest
      deployment:
        path: deployment/chat-deployment.yaml
        environment:
          PRT_CONFIG_OVERRIDE: deployment.subscription_id=${AZURE_SUBSCRIPTION_ID},deployment.resource_group=${AZURE_RESOURCE_GROUP},deployment.workspace_name=${AZUREAI_PROJECT_NAME},deployment.endpoint_name=${AZUREAI_ENDPOINT_NAME},deployment.deployment_name=${AZUREAI_DEPLOYMENT_NAME}
```

The `config.deployment` section is required and creates a new online deployment to the associated online endpoint from the referenced YAML file definition. This functionality handles the following:

* Associated environment and model are referenced when available.
* `azd` waits for the deployment to enter a terminal provisioning state.
* On successful deployments, all traffic is shifted to the new deployment version.
* All previous deployments are deleted to free up compute for future deployments.

## Explore configuration options

Each supported feature for AI/ML online endpoints supports customizations for your specific scenario using the options described in the following sections.

### Flow

The `flow` configuration section is optional and supports the following values:

* **name**: The name of the flow. Defaults to `<service-name>-flow-<timestamp>` if not specified.
* **path**: The relative path to a folder that contains the flow manifest.
* **overrides**: Any custom overrides to apply to the flow.

    > [!NOTE]
    > Each call to `azd deploy` creates a new timestamped flow.

### Environment

The `environment` configuration section is optional and supports the following values:

* **name**: The name of the custom environment. Defaults to `<service-name>-environment` if not specified.
* **path**: The relative path to a custom [environment yaml manifest](/azure/machine-learning/reference-yaml-environment?view=azureml-api-2&preserve-view=true).
* **overrides**: Any custom overrides to apply to the environment.

    > [!NOTE]
    > Each call to `azd deploy` creates a new environment version.

### Model

The `model` configuration section is optional and supports the following values:

* **name**: The name of the custom model. Defaults to `<service-name>-model` if not specified.
* **path**: The relative path to a custom [model YAML manifest](/azure/machine-learning/reference-yaml-model?view=azureml-api-2&preserve-view=true).
* **overrides**: Any custom overrides to apply to the model.

    > [!NOTE]
    > Each call to `azd deploy` creates a new model version.

### Deployment

The `deployment` configuration section is **required** and supports the following values:

* **name**: The name of the custom deployment. Defaults to `<service-name>-deployment` if not specified.
* **path**: The relative path to a custom [deployment yaml manifest](/azure/machine-learning/reference-yaml-deployment-managed-online?view=azureml-api-2&preserve-view=true).
* **environment**: A map of key value pairs to set environment variables for the deployment. Supports environment variable substitutions from OS/AZD environment variables using `${VAR_NAME}` syntax.
* **overrides**: Any custom overrides to apply to the deployment.

    > [!NOTE]
    > Only supports managed online deployments.

## AgentSchema and `agent.yaml`

[AgentSchema](https://microsoft.github.io/AgentSchema/) is an open specification for defining AI agents in a code-first YAML format. An `agent.yaml` file describes an agent's configuration, including its model, instructions, tools, and connections. AgentSchema serves as a unified exchange format between Microsoft Copilot Studio, Microsoft Foundry, and other platforms.

AgentSchema supports two primary formats:

- **AgentDefinition** — A complete, concrete specification of an agent that can be executed directly. Use this format for single-purpose agents where all configuration values are known and fixed.
- **AgentManifest** — A parameterized template for creating agents dynamically. Use this format for reusable agent patterns where values like model names, connections, or instructions are configured at runtime using `{{parameter}}` syntax.

### Example `agent.yaml`

The following example shows an AgentDefinition for a customer support agent:

```yaml
kind: prompt
name: customer-support
displayName: "Customer Support Agent"
description: "Handles customer inquiries and support requests"

model: gpt-4o

instructions: |
  You are a helpful customer support agent. Provide clear,
  professional responses to customer inquiries.

tools:
  knowledge_base:
    kind: function
    description: "Search company knowledge base"
    parameters:
      query:
        kind: string
        description: "Search query"
        required: true
```

### Using `agent.yaml` with `azd`

The `azure.yaml` schema supports the `azure.ai.agent` host type for deploying agents to Microsoft Foundry. When `host` is set to `azure.ai.agent`, `azd` uses the agent definition in your project to deploy and manage the agent. For more information, see the [azure.yaml schema reference](azd-schema.md).

For more information about AgentSchema, see the following resources:

- [AgentSchema specification](https://microsoft.github.io/AgentSchema/)
- [AgentSchema reference documentation](https://microsoft.github.io/AgentSchema/reference/)
- [AgentManifest vs AgentDefinition guide](https://microsoft.github.io/AgentSchema/guides/example/)
- [AgentSchema GitHub repository](https://github.com/microsoft/AgentSchema)

## Related content

- [azure.yaml schema reference](azd-schema.md)
- [Azure Developer CLI templates overview](azd-templates.md)

[!INCLUDE [request-help](includes/request-help.md)]
