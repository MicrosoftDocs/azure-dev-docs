---
title: Deploy to an AI/ML studio online endpoint using the Azure Developer CLI
description: Learn how to deploy to an AI/ML studio online endpoint using the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/06/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---


The Azure Developer CLI supports the ability to quickly and easily deploy to an AI/ML studio online endpoint from `azd`. 

* When `config.flow` section is defined `azd` will create a new prompt flow from the specified file path
* When `config.environment` section is defined `azd` will create a new  environment version using the referenced yaml file definition
* When `config.model` section is defined `azd` will create a new model version using the referenced yaml file definition

The `config.deployment` section is **required** and will create a new online deployment to the associated online endpoint from the referenced yaml file definition.

* Associates environment and model will be referenced when available
* `azd` waits for deployment to enter a terminal provisioning state
* On successful deployments all traffic is shifted to the new deployment version
* All previous deployments are deleted to free up compute for future deployments.

## Supported AI online endpoint features

* Custom Environments
  * Environments can be viewed with [Azure ML Studio](https://ml.azure.com) under the `Environments` section

* Custom models
  * Models can be viewed with [Azure ML Studio](https://ml.azure.com) under the `Models` section

* Prompt flows
  * Flows can be viewed in [Azure ML Studio](https://ml.azure.com) under the `Prompt flow` section
  * Flows can be viewed in [Azure AI Studio](https://ai.azure.com) under the `Prompt flow` section

* Online Deployments (within Online-Endpoint)
  * Deployments can be viewed in [Azure ML Studio](https://ml.azure.com) under the `Endpoints` section
  * Deployments can be viewed in [Azure AI Studio](https://ai.azure.com) under the `Deployments` section

## Requirements

The following resources will included within your deployed Azure resources.

1. AI Hub Resource  (Azure ML Workspace) & Required dependencies.
   * Key Vault
   * Storage Account
   * Container Registry (optional)
   * App Insights (optional)
   * Azure Open AI Services
   * Azure AI Search (If required by your app)
2. AI Project Resource (Azure ML Workspace)
3. Online Endpoint (ML Online Endpoint)
   * Should be tagged with `azd-service-name` tag
   * This is the target of the azd deployment
4. AI Hub Connections

   * Any required connections that may be referenced in your flow/model

## Example azure.yaml

```yaml
name: contoso-chat
metadata:
  template: contoso-chat@0.0.1-beta
hooks:
  # Post provision hooks are still required to seed any data sources or create required search indexes
  postprovision:
    shell: sh
    run: ./infra/hooks/postprovision.sh
services:
  chat:
    # Referenced new ai.endpoint host type
    host: ai.endpoint
    # New config flow for AI project configuration
    config:
      # The name of the AI studio project / workspace
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

## AI Endpoint Configuration

The `config` section for `ai.endpoint` supports the following configurations:

**workspace**: The name of the AI studio project / workspace (supports env var substitutions).
**flow**: Custom configuration for flows.
**environment**: Custom configuration for ML environments.
**model**: Custom configuration for ML models.
**deployment**: Custom configuration for online endpoint deployments.

Details for each of these configurations are provided in the following sections.

### Flow (flow)

The flow configuration section is optional and supports the following values:

- **name**: Name of flow (defaults to `<service-name>-flow-<timestamp>` if not specified).
- **path**: Relative path to a flow folder that contains the flow manifest.
- **overrides**: Any custom overrides to apply to the flow.

> [!NOTE]
> Each call to `azd deploy` will create a new timestamped flow.

### Environment (environment)

The environment configuration section is optional and supports the following values:

- **name**: Name of custom environment (defaults to `<service-name>-environment` if not specified).
- **path**: Relative path to a custom [environment yaml manifest](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-environment?view=azureml-api-2).
- **overrides**: Any custom overrides to apply to the environment.

> [!NOTE]
> Each call to `azd deploy` will create a new environment version.

### Model (model)

The model configuration section is optional and supports following values:

- **name**: Name of custom model (defaults to `<service-name>-model` if not specified).
- **path**: Relative path to a custom [model yaml manifest](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-model?view=azureml-api-2).
- **overrides**: Any custom overrides to apply to the model.

> [!NOTE]
> Each call to `azd deploy` will create a new environment version.

### Deployment (deployment)

The deployment configuration section is **required** and supports the following values:

- **name**: Name of custom model(defaults to `<service-name>-deployment` if not specified).
- **path**: Relative path to a custom [deployment yaml manifest](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-deployment-managed-online?view=azureml-api-2).
- **environment**: A map of key value pairs to set environment variables for the deployment. Supports environment variable substitutions from OS/AZD environment variables using `${VAR_NAME}` syntax.
- **overrides**: Any custom overrides to apply to the deployment.

> [!NOTE]
> Only supports managed online deployments.

