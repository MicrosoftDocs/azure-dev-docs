---
title: Remote Environments Support
description: How to use remote environments in `azd` via remote state
author: gkulin
ms.author: gracekulin
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: article
ms.custom: devx-track-azdevcli
---


# Remote Environments Support

## How do remote environments work?
To use remote environments, you can enable remote state to ensure the environment state automatically persists to the configured remote store. Meaning any `azd` command that writes to your `azd` `.env` or `config.json` file will automatically persist. 

## Configure remote state
Remote state for `azd` can be configured globally in `azd`'s `config.json` or by project within the `azure.yaml`. If remote state is not set up, environment values and configuration continue to be stored locally.

You can configure remote state within the `state.remote` element of `azd` configuration

- **backend**: The name of the backend type used for remote state
- **config**: Map of key/value pairs unique to each remote state provider

### Enable by project

#### azure.yaml
```yaml
name: azd-project-name
state:
  remote:
    backend: AzureBlobStorage
    config:
      accountName: saazdremotestate
      containerName: myproject # Defaults to project name if not specified
```

### Enable globally

#### azd config.json
```json
{
  "state": {
    "remote": {
      "backend": "AzureBlobStorage",
      "config": {
        "accountName": "saazdremotestate"
      }
    }
  }
}
```

## Supported Remote state backends

### Azure Blob Storage

`azd` writes `.env` and `config.json` files to an Azure storage blob container

#### Configuration
- **accountName**: Name of the Azure storage account
- **containerName**: Name of the container within the storage account where configuration is stored. Defaults to the current azd project name if not specified
- **endpoint**: Azure Endpoint used when configuring remote state. _Defaults to `core.windows.net`_

## Remote state and `azd` commands

### `azd env list`
Lists all local and remote environments available. For example:

:::image type="content" source="media/remote-environments-support/azd-env-list-exampleOutput.png" alt-text="Example output of `azd env list` with remote environments.":::

### `azd env select`

When selecting an environment that does not exist locally, the remote state is copied to a new local environment. 

For example, consider the output from `azd env list` above. To copy the remote state, `dev` to your local environment you would run the following:

```azdeveloper
azd env select dev
``` 

