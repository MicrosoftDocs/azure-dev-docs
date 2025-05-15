---
title: Azure Developer CLI (azd) extensions overview
description: Learn what azd extensions are, why to use them, and how to enable, manage, and install extensions in the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/14/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
---

# Azure Developer CLI extensions overview

Azure Developer CLI (`azd`) extensions are modular components that extend the functionality of the Azure Developer CLI. They allow you to add new capabilities, automate workflows, and integrate with other services directly from the CLI. Extensions help you tailor `azd` to evolving team needs and Azure scenarios.

## Enable extensions

Extensions are currently an alpha feature. To enable extension support, run the following command in your terminal:

```azdeveloper
azd config set alpha.extensions on
```

This command enables extension management and usage in your `azd` environment.

## Manage extension sources

Extensions are distributed and managed through extension sources, making it easy to discover, install, and update them as your requirements grow.

- Extension sources are file or URL based manifests that provide lists of available `azd` extensions.
- Users can add custom extension sources that connect to private, local, or public registries.
- Extension sources are an equivalent concept to NuGet or Node Package Manager (NPM) feeds and must adhere to the [official extension registry schema](https://github.com/Azure/azure-dev/blob/main/cli/azd/extensions/registry.schema.json).

### Official extension registry

The official extension source registry is preconfigured in `azd` and is hosted at [https://aka.ms/azd/extensions/registry](https://aka.ms/azd/extensions/registry).

The registry is hosted in the [`azd` GitHub repo](https://github.com/Azure/azure-dev/blob/main/cli/azd/extensions/registry.json).

### Development extension registry

> [!CAUTION]
> Extensions hosted in the dev registry DO NOT contain signed binaries at the moment.

A shared development registry can be added to your `azd` configuration. This registry contains extensions that are experiments and also used for internal testing before shipping official extensions.

To opt-in for the development registry run the following command:

```bash
# Add a new extension source name 'dev' to your `azd` configuration.
azd extension source add -n dev -t url -l "https://aka.ms/azd/extensions/registry/dev"
```

### Extension source commands

Use the following commands to manage extension sources for your `azd` installation.

**List installed extension sources**

Displays a list of installed extension sources.

```azdeveloper
azd extension source list
```

**Add a new extension source**

Adds a new named extension source to the global `azd` configuration.

```azdeveloper
azd extension source add -n <name> -t url -l <registry-url>
```

- `-l, --location`: The location of the extension source.
- `-n, --name`: The name of the extension source.
- `-t, --type`: The type of extension source. Supported types are file and url.

**Remove an extension source**

Removes an extension source with the specified named argument

```azdeveloper
azd extension source remove <name>
```

## Manage extensions

Once extensions are enabled and your extension sources are configured, you can install extensions to add new capabilities to `azd`.

**List extensions**

Lists matching extensions from one or more extension sources:

```azdeveloper
`azd extension list [flags]
```

- `--installed` Displays a list of installed extensions.
- `--source` Only list extensions from the specified source.
- `--tags` Allows filtering extensions by tags (AI, test)

**Install an extension**

Installs one or more extensions from any configured extension source.

```azdeveloper
azd extension install <extension-names> [flags]
```

Replace `<extension-name>` with the name of the extension you want to install.

- `-v, --version` Specifies the version constraint to apply when installing extensions.
- `-s, --source` Specifies the extension source used for installations.

**Upgrade an extension**

Upgrades one or more extensions to the latest versions.

```azdeveloper
azd extension upgrade <extension-name>
```

- `--all` Upgrades all previously installed extensions when specified.
- `-v, --version` Upgrades a specified extension using a version constraint, if provided.
- `-s, --source` Specifies the extension source used for installations.

**Uninstall an extension**

Uninstalls one or more previously installed extensions.

```azdeveloper
azd extension uninstall <extension-name>
```

- `--all` Removes all installed extensions when specified.

## Next steps

- [Quickstart - use the AI extension](quickstart-ai-extension.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extension-framework.md)
