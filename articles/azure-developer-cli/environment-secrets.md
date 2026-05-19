---
title: Use environment secrets with Azure Developer CLI
description: Learn how to reference Azure Key Vault secrets within your Azure Developer CLI project environment for Bicep parameters, hooks, and CI/CD pipelines.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 03/09/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Use environment secrets with the Azure Developer CLI

The Azure Developer CLI (`azd`) supports referencing Azure Key Vault secrets within your project environment (the `.env` file). This provides a secure option for working with sensitive data in your `azd` projects. These secrets integrate with various `azd` features, such as hooks and CI/CD pipeline configurations.

## Prerequisites

- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd) installed.
- An [Azure Key Vault](/azure/key-vault/general/quick-create-portal) instance that you have access to, or permissions to create one.

## Set a Key Vault secret

To set a Key Vault secret, run the `azd env set-secret <name>` command, where `<name>` is the key in the environment that references the Key Vault secret. After you set the secret, `azd` automatically retrieves the value from the Key Vault in the following scenarios.

## Bicep parameters

To associate a Bicep parameter with the value of an Azure Key Vault secret, follow these steps:

1. Annotate the Bicep parameter as secured by using the `@secure()` keyword.
1. Create a mapping in the `main.parameters.json` file that links the Bicep parameter to the corresponding key name in the environment that references the Azure Key Vault secret.

> [!NOTE]
> Environment secrets aren't currently supported when you use Bicep parameter files (`.bicepparam`).

### Example

From an `azd` project, run `azd env set-secret MY_SECRET` and follow the prompts to either select an existing Azure Key Vault secret or create a new one. After the command completes, the key `MY_SECRET` holds a reference to a Key Vault secret. Add or select the Bicep parameter that you want to use the value with and designate it as secure:

```bicep
@secure()
param secureParameter string
```

Create the mapping in the `main.parameters.json` file:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "secureParameter": {
        "value": "${MY_SECRET}"
      }
    }
}
```

The next time you run `azd up` or `azd provision`, `azd` uses the Azure Key Vault secret as the value for your parameter.

## Hooks

`azd` can automatically retrieve Azure Key Vault secrets when a hook runs. By default, when `azd` runs a hook, all key-value pairs from the project environment (the `.env` file) are set in the hook's environment. However, references to Key Vault secrets aren't automatically resolved to their corresponding secret values.

To resolve these references, follow these steps:

1. Create a mapping from the key in the environment to a new key where the Key Vault secret is resolved.
1. Use the `secrets` field in the hook definition to create this mapping.

### Example

From an `azd` project, run `azd env set-secret MY_SECRET` and follow the prompts to either select an existing Azure Key Vault secret or create a new one. After the command completes, the key `MY_SECRET` references a Key Vault secret. Create a hook definition appropriate for your operating system.

#### [Linux](#tab/linux)

```yaml
hooks:
  preprovision: 
    run: 'echo ".env value: $MY_SECRET \nResolved secret: $SECRET_RESOLVE"'
    shell: sh
    interactive: true
    secrets:
      SECRET_RESOLVE: MY_SECRET
```

#### [Windows](#tab/windows)

```yaml
hooks:
  preprovision: 
    run: 'Write-Host ".env value: $env:MY_SECRET `nResolved secret: $env:SECRET_RESOLVE"'
    shell: pwsh
    interactive: true
    secrets:
      SECRET_RESOLVE: MY_SECRET
```

---

The next time you run `azd provision`, the `preprovision` hook runs and resolves `MY_SECRET` into `SECRET_RESOLVE`.

## Pipeline config

`azd` simplifies the process of setting up continuous integration (CI) for your application. Whether you use GitHub or Azure DevOps, run `azd pipeline config` and follow the guided steps to configure CI/CD.

As part of the automatic configuration, `azd` creates secrets and variables for your CI/CD deployment workflow. You can also define your own variables and secrets using the `pipeline` configuration in `azure.yaml`. The names you define correspond to keys in your `azd` environment (`.env`). If a key holds a secret reference (`akvs`), `azd` applies different behavior depending on whether you add it as a variable or a secret:

| Approach | CI/CD value stored | Secret rotation | Best for |
|---|---|---|---|
| `variables` | Key Vault *reference* (`akvs://...`) | Automatic — pipeline always reads latest value from Key Vault. | When the CI/CD service principal has Key Vault read access. |
| `secrets` | Actual secret *value* | Manual — rerun `azd pipeline config` after rotation. | When you can't assign Key Vault read access to the service principal. |

> [!NOTE]
> When you use `variables`, `azd` attempts to assign a read-access role to the service principal used by the CI/CD workflow. If you don't have sufficient permissions to assign the read role for the Key Vault, the operation fails. Use `secrets` instead.

### Example

From an initialized `azd` project, run `azd env set-secret SECURE_KEY` and follow the prompts. After the command completes, `azd env get-values` shows the reference:

```
SECURE_KEY="akvs://faa080af-c1d8-40ad-9cce-000000000000/vivazqu-kv/SECURE-KEY-kv-secret"
```

Add `SECURE_KEY` to either the `variables` or `secrets` list in `azure.yaml`:

#### [Variable (reference)](#tab/pipeline-variable)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: your-project-name
pipeline:
  variables:
    - SECURE_KEY
```

When you run `azd pipeline config`, `SECURE_KEY` is set as a CI/CD variable with the Key Vault reference as its value. If `SECURE_KEY` is also mapped to a Bicep input parameter or a hook definition, `azd` automatically resolves the secret value at runtime.

#### [Secret (resolved value)](#tab/pipeline-secret)

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/main/schemas/v1.0/azure.yaml.json
name: your-project-name
pipeline:
  secrets:
    - SECURE_KEY
```

When you run `azd pipeline config`, `SECURE_KEY` is set as a CI/CD secret with the actual Key Vault secret value.

---
