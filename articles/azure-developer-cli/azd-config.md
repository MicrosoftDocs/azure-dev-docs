---
title: Explore azd config functionality
description: Learn how to use the azd config command and related functionality
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/17/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Explore Azure Developer CLI configuration

The Azure Developer CLI (`azd`) allows you to manage `azd` user configurations using a set of `azd config` commands, such as `azd config get` and `azd config set`. These configuration values include useful defaults such as your Azure subscription and location and other settings. You can also get and set your own custom values and use them in scripts or custom functionality.

In this article, you learn:

- Key concepts about `azd config`
- How to work with `azd config` commands
- How `azd config` integrates with other `azd` features

## Explore Azure Developer CLI configurations

When you first install the Azure Developer CLI, a file named `config.json` is added in the following location:

- `$HOME/.azd` on Linux and macOS
- `%USERPROFILE%.azd` on Windows

> [!TIP]
> The configuration directory can be overridden by specifying a path in the `AZD_CONFIG_DIR` environment variable.

The settings in this file manage functionality such as:

- The default Azure subscription or location to use when you provision or deploy resources
- Which alpha features are enabled
- Which template source locations are configured
- Custom values set by the user for scripts or other purposes

By default, the `config.json` file contains only a few configurations for the default `azd` template source locations. As you use various features of the Azure Developer CLI, some values are populated in `config.json` automatically. For example, the first time you run the `azd up` command, the subscription and location you select for provisioning and deployment will be stored in the `defaults` section of the file.

A simple `config.json` file might resemble the following:

```json
{
  "defaults": {
    "location": "eastus2",
    "subscription": "your-subscription-id"
  },
  "template": {
    "sources": {
      "awesome-azd": {
        "key": "awesome-azd",
        "location": "https://aka.ms/awesome-azd/templates.json",
        "name": "Awesome AZD",
        "type": "awesome-azd"
      },
      "default": {
        "key": "default",
        "name": "default"
      }
    }
  }
}
```

`azd` also provides a set of commands to manage the settings in this file manually:

- `azd config get`: Gets a configuration.
- `azd config list-alpha`: Display the list of available features in alpha stage.
- `azd config reset`: Resets configuration to default.
- `azd config set`: Sets a configuration.
- `azd config show`: Show all the configuration values.
- `azd config unset`: Unsets a configuration.

> [!TIP]
> Visit the [Azure Developer CLI commands](/azure/developer/azure-developer-cli/reference) reference page to learn more about `azd` commands.


## Available configuration commands

The Azure Developer CLI provides several different commands to manage the settings in the `config.json` file, which are explored more in the [work with Azure Developer CLI commands](#work-with-azure-developer-cli-commands) section:



## Work with configuration commands



### Display configurations

View the current contents of the entire `config.json` file at any time by running the `azd show` command:

```azdeveloper
azd config show
```

Sample output:

```json
{
  "alpha": {
    "compose": "on"
  },
  "defaults": {
    "location": "eastus2",
    "subscription": "your-subscription-id"
  },
  "customVal": "hello-world"
}
```

Display a specific configuration value using the `azd get` command:

```azdeveloper
azd config get defaults
```

Sample output:

```json
"defaults": {
    "location": "eastus2",
    "subscription": "your-subscription-id"
}
```

`azd` also includes a convenience command to view which alpha features are enabled since they are one of the most commonly updated configurations:

```azdeveloper
azd config list-alpha
```

Sample output:

```json
  "alpha": {
    "compose": "on"
  }
```

### Get and set configurations

You can get, set, or unset values in the `config.json` file using `azd config` commands. Some specific configurations are used by other `azd` features and commands, such as when enabling alpha features or setting template sources, but you can also set your own custom values as well.

### Manage configurations used by `azd`

Use the `azd config set` command to enable the `azd compose` alpha feature:

```azdeveloper
azd config set alpha.compose on
```

> [!NOTE]
> Use `.` syntax to traverse JSON object structures when you get and set configuration values, such as in the case of `alpha.compose`.

Verify the setting was enabled using the `azd config get alpha` command:

```azdeveloper
azd config get alpha.compose
```

```json
on
```

You can also run `azd config get alpha` to view the entire JSON object in the `config.json` file:

```azdeveloper
azd config get alpha
```

Sample output:

```json
{
  "compose": "on"
}
```

### Manage custom configurations

Set a custom configuration value:

```azdeveloper
azd config get customVal hello-world
```

Get the custom configuration value:

```azdeveloper
azd config get customVal
```

Sample output:

```json
hello-world
```

### Reset configurations

You can reset the Azure Developer CLI `config.json` file back to its defaults using the `azd config reset` command, which essentially deletes the contents of the file:

```azdeveloper
azd config reset
```

## Next steps

> [!div class="nextstepaction"]
> [Create Azure Developer CLI templates overview](/azure/developer/azure-developer-cli/make-azd-compatible)
