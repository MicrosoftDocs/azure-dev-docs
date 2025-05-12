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

You can extend the `azd pipeline config` command for specific template scenarios or requirements, as described in the following sections.

### Custom secrets or variables

By default, `azd` sets variables and secrets for the pipeline. For example, the `azd pipeline config` command creates the `subscription id`, `environment name` and the `region` as pipeline variables whenever it executes. The pipeline definition then references those variables:

```yaml
env:
   AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }}
   AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
   AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
   AZURE_ENV_NAME: ${{ vars.AZURE_ENV_NAME }}
   AZURE_LOCATION: ${{ vars.AZURE_LOCATION }}
```

When the pipeline runs, `azd` gets the values from the environment, which is mapped to the variables and secrets. Depending on the template, there might be settings which you can control using environment variables. For example, an environment variable named `KEY_VAULT_NAME` could be set to define the name of a Key Vault resource within the template infrastructure. For such cases, define the list of variables and secrets in the template, using the `azure.yaml`. For example, consider the following `azure.yaml` configuration:

```yaml
pipeline:
  variables:
    - KEY_VAULT_NAME
    - STORAGE_NAME
  secrets:
    - CONNECTION_STRING
```

With this configuration, `azd` checks if any of the variables or secrets have a nonempty value in the environment. `azd` then creates either a variable or a secret for the pipeline using the name of the key in the configuration as the name of the variable or secret, and the nonstring value from the environment for the value.

The `azure-dev.yaml` pipeline definition can then reference the variables or secrets:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      KEY_VAULT_NAME: ${{ variables.KEY_VAULT_NAME }}
      STORAGE_NAME: ${{ variables.STORAGE_NAME }}
      CONNECTION_STRING: ${{ secrets.CONNECTION_STRING }}
```

> [!NOTE]
> You must run `azd pipeline config` after updating the list of secrets or variables in `azure.yaml` for azd to reset the pipeline values.

### Infrastructure parameters

Consider the following bicep example:

```bicep
@secure()
param BlobStorageConnection string
```

The parameter `BlobStorageConnection` has no default value set, so `azd` prompts the user to enter a value. However, there's no interactive prompt during CI/CD. `azd` must request the value for the parameter when you run `azd pipeline config`, save the value in the pipeline, and then fetch the value again when the pipeline runs.

`azd` uses a pipeline secret called `AZD_INITIAL_ENVIRONMENT_CONFIG` to automatically save and set the value of all the required parameters in the pipeline. You only need to reference this secret in your pipeline:

```yaml
- name: Provision Infrastructure
   run: azd provision --no-prompt
   env:
      AZD_INITIAL_ENVIRONMENT_CONFIG: ${{ secrets.AZD_INITIAL_ENVIRONMENT_CONFIG }}
```

When the pipeline runs, `azd` takes the values for the parameters from the secret, removing the need for an interactive prompt.

> [!NOTE]
> You must rerun `azd pipeline config` if you add a new parameter.
