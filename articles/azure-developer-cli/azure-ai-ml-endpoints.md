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

# Deploy to an AI/ML studio online endpoint using the Azure Developer CLI

The Azure Developer CLI enables you to quickly and easily deploy to an [Azure ML Studio](https://ml.azure.com) or [Azure AI Studio](https://ai.azure.com) online endpoint. This feature is enabled and configured using the `azure.yaml` template file. `azd` supports the following AI/ML studio features:

* Custom environments
* Custom models
* Prompt flows
* Online deployments (within Online-Endpoint)

## Configure the template

Configure support for AI/ML online endpoints in the `services` section of the `azure.yaml` file:

- Set the `host` value to `ai.endpoint`.
- The `config` section for `ai.endpoint` supports the following configurations:
  - **workspace**: The name of the AI studio workspace. Supports `azd` environment variable substitutions and syntax.
  - **environment**: Optional custom configuration for ML environments. `azd` creates a new  environment version from the referenced YAML file definition.
  - **flow**: Optional custom configuration for flows. `azd` creates a new prompt flow from the specified file path.
  - **model**: Optional custom configuration for ML models. `azd` creates a new model version from the referenced YAML file definition.
  - **deployment**: **Required** configuration for online endpoint deployments. `azd` creates a new online deployment to the associated online endpoint from the referenced YAML file definition.

Consider the following sample `azure.yaml` file that configures these features:

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
      # The name of the AI studio workspace
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

## Explore configuration options

Each supported feature for AI/ML online endpoints can be customized for your specific scenario using the options described in the following sections.

### Flow (flow)

The flow configuration section is optional and supports the following values:

- **name**: Name of flow (defaults to `<service-name>-flow-<timestamp>` if not specified).
- **path**: Relative path to a flow folder that contains the flow manifest.
- **overrides**: Any custom overrides to apply to the flow.

> [!NOTE]
> Each call to `azd deploy` will create a new timestamped flow.

### Environment (environment)

The environment configuration section is optional and supports the following values:

- **name**: Name of custom environment. Defaults to `<service-name>-environment` if not specified)
- **path**: Relative path to a custom [environment yaml manifest](/azure/machine-learning/reference-yaml-environment?view=azureml-api-2&preserve-view=true).
- **overrides**: Any custom overrides to apply to the environment.

> [!NOTE]
> Each call to `azd deploy` will create a new environment version.

### Model (model)

The model configuration section is optional and supports following values:

- **name**: Name of custom model. Defaults to `<service-name>-model` if not specified.
- **path**: Relative path to a custom [model yaml manifest](/azure/machine-learning/reference-yaml-model?view=azureml-api-2&preserve-view=true).
- **overrides**: Any custom overrides to apply to the model.

> [!NOTE]
> Each call to `azd deploy` will create a new environment version.

### Deployment (deployment)

The deployment configuration section is **required** and supports the following values:

- **name**: Name of custom model. Defaults to `<service-name>-deployment` if not specified.
- **path**: Relative path to a custom [deployment yaml manifest](/azure/machine-learning/reference-yaml-deployment-managed-online?view=azureml-api-2&preserve-view=true).
- **environment**: A map of key value pairs to set environment variables for the deployment. Supports environment variable substitutions from OS/AZD environment variables using `${VAR_NAME}` syntax.
- **overrides**: Any custom overrides to apply to the deployment.

> [!NOTE]
> Only supports managed online deployments.

## Deployment dependencies

The following resources are created in your Azure environment as part of the provisioning and deployment process:

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
