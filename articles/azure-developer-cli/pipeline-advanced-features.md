---
title: Configure advanced pipeline features
description: Learn how to configure advanced features for pipelines created using the Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/12/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, build-2023
---

# Advanced pipeline features and configurations

You can extend the `azd pipeline config` command to support advanced scenarios and custom requirements, as described in the following sections.

## Custom secrets and variables

By default, `azd` sets essential variables and secrets for your pipeline. For example, when you run `azd pipeline config`, it creates variables such as `subscription id`, `environment name`, and `region`. These variables are referenced in your pipeline definition:

```yaml
env:
   AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }}
   AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
   AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
   AZURE_ENV_NAME: ${{ vars.AZURE_ENV_NAME }}
   AZURE_LOCATION: ${{ vars.AZURE_LOCATION }}
```

When the pipeline runs, `azd` retrieves these values from the environment and maps them to the pipeline variables and secrets. Depending on your template, you may want to control additional settings using environment variables. For example, you might set a `KEY_VAULT_NAME` environment variable to define the name of a Key Vault resource in your infrastructure.

To support custom variables and secrets, define them in your template's `azure.yaml` file. For example:

```yaml
pipeline:
  variables:
    - KEY_VAULT_NAME
    - STORAGE_NAME
  secrets:
    - CONNECTION_STRING
```

With this configuration, `azd` checks if any of the listed variables or secrets have a value in the environment. It then creates the corresponding variable or secret in the pipeline, using the environment value.

You can reference these variables and secrets in your `azure-dev.yaml` pipeline definition:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      KEY_VAULT_NAME: ${{ variables.KEY_VAULT_NAME }}
      STORAGE_NAME: ${{ variables.STORAGE_NAME }}
      CONNECTION_STRING: ${{ secrets.CONNECTION_STRING }}
```

> [!NOTE]
> After updating the list of secrets or variables in `azure.yaml`, rerun `azd pipeline config` to update the pipeline values.

## Infrastructure parameters

Consider the following Bicep example:

```bicep
@secure()
param BlobStorageConnection string
```

If the `BlobStorageConnection` parameter has no default value, `azd` prompts you for a value during setup. However, there is no interactive prompt during CI/CD runs. Instead, `azd` requests the value when you run `azd pipeline config`, saves it as a pipeline secret, and retrieves it automatically when the pipeline runs.

`azd` uses a pipeline secret called `AZD_INITIAL_ENVIRONMENT_CONFIG` to store and provide required parameter values. Reference this secret in your pipeline definition:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_INITIAL_ENVIRONMENT_CONFIG }}
```

When the pipeline runs, `azd` uses the secret to supply parameter values, eliminating the need for interactive prompts.

> [!NOTE]
> If you add a new parameter, rerun `azd pipeline config` to update the pipeline configuration.
