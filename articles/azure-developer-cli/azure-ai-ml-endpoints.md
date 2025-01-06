---
title: Deploy to an Azure AI Foundry portal/ML studio online endpoint using the Azure Developer CLI
description: Learn how to deploy to an Azure AI Foundry portal/ML studio online endpoint using the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/06/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Deploy to an Azure AI Foundry portal/ML studio online endpoint using the Azure Developer CLI

The Azure Developer CLI enables you to quickly and easily deploy to an [Azure ML Studio](https://ml.azure.com) or [Azure AI Foundry](https://ai.azure.com) online endpoint. `azd` supports the following Azure AI Foundry/ML studio features, which you'll learn to configure in the sections ahead:

* Custom environments
  * Environments can be viewed with [Azure ML Studio](https://ml.azure.com/) under the `Environments` section.
* Custom models
  * Models can be viewed with [Azure ML Studio](https://ml.azure.com/) under the `models` section.
* Prompt flows
  * Flows can be viewed with [Azure ML Studio](https://ml.azure.com/) under the `flows` section.
  * Flows can be viewed with [Azure AI Foundry portal](https://ai.azure.com/) under the `flows` section.
* Online deployments (within Online-Endpoint)
  * Deployments can be viewed with [Azure ML Studio](https://ml.azure.com/) under the `deployments` section.
  * Deployments can be viewed with [Azure AI Foundry portal](https://ai.azure.com/) under the `deployments` section.

## Prerequisites

To work with Azure AI Foundry/ML studio online endpoints, you'll need the following:

* [Azure Subscription](https://signup.azure.com/signup) with OpenAI access enabled
* [AI Hub Resource](/azure/ai-studio/concepts/ai-resources)
* [AI Project](/azure/ai-studio/how-to/create-projects)
* [OpenAI Service](/azure/ai-services/openai/)
* [Online Endpoint](/azure/machine-learning/concept-endpoints-online)
* [AI Search Service](/azure/search/) (Optional, enabled by default)

The [Azure AI Foundry Starter template](https://github.com/Azure-Samples/azd-aistudio-starter) can help create all the required infrastructure to get started with Azure AI Foundry endpoints.

## Configure the Azure AI Foundry/ML studio online endpoint

Configure support for Azure AI Foundry/ML online endpoints in the `services` section of the `azure.yaml` file:

* Set the `host` value to `ai.endpoint`.
* The `config` section for `ai.endpoint` supports the following configurations:
  * **workspace**: The name of the Azure AI Foundry workspace. Supports `azd` environment variable substitutions and syntax.
    * If not specified, `azd` will look for environment variable with name `AZUREAI_PROJECT_NAME`.
  * **environment**: Optional custom configuration for ML environments. `azd` creates a new  environment version from the referenced YAML file definition.
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
      # The name of the Azure AI Foundry workspace
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

The `config.deployment` section is required and creates a new online deployment to the associated online endpoint from the referenced yaml file definition. This functionality handles various concerns for you, including the following:

* Associates environment and model will be referenced when available.
* `azd` waits for deployment to enter a terminal provisioning state.
* On successful deployments, all traffic is shifted to the new deployment version.
* All previous deployments, are deleted to free up compute for future deployments.

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

The `model` configuration section is optional and supports following values:

* **name**: The name of the custom model. Defaults to `<service-name>-model` if not specified.
* **path**: The relative path to a custom [model yaml manifest](/azure/machine-learning/reference-yaml-model?view=azureml-api-2&preserve-view=true).
* **overrides**: Any custom overrides to apply to the model.

    > [!NOTE]
    > Each call to `azd deploy` creates a new environment version.

### Deployment

The `deployment` configuration section is **required** and supports the following values:

* **name**: The name of the custom deployment. Defaults to `<service-name>-deployment` if not specified.
* **path**: The relative path to a custom [deployment yaml manifest](/azure/machine-learning/reference-yaml-deployment-managed-online?view=azureml-api-2&preserve-view=true).
* **environment**: A map of key value pairs to set environment variables for the deployment. Supports environment variable substitutions from OS/AZD environment variables using `${VAR_NAME}` syntax.
* **overrides**: Any custom overrides to apply to the deployment.

    > [!NOTE]
    > Only supports managed online deployments.
