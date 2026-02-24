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

> [!NOTE]
> `azd` extensions are currently in beta.

## Manage extension sources

Extensions are distributed and managed through extension sources, making it easy to discover, install, and update them as your requirements grow.

- Extension sources are file or URL based manifests that provide lists of available `azd` extensions.
- Users can add custom extension sources that connect to private, local, or public registries.
- Extension sources are an equivalent concept to NuGet or Node Package Manager (NPM) feeds and must adhere to the [official extension registry schema](https://github.com/Azure/azure-dev/blob/main/cli/azd/extensions/registry.schema.json).

`azd` provides two extension source registries to help you get started with extensions:

- The **official extension source registry** is preconfigured in `azd` and is hosted at [https://aka.ms/azd/extensions/registry](https://aka.ms/azd/extensions/registry).
- The **development extension registry** can also be added to your `azd` configuration. This opt-in registry contains experimental extensions for internal testing that may or may not become official extensions.

To opt-in for the development registry run the following command:

```bash
# Add a new extension source name 'dev' to your `azd` configuration.
azd extension source add -n dev -t url -l "https://aka.ms/azd/extensions/registry/dev"
```

> [!CAUTION]
> Extensions hosted in the dev registry DO NOT contain signed binaries at the moment.

### Extension source commands

Use the following commands to manage extension sources for your `azd` installation.

**List installed extension sources**

```azdeveloper
azd extension source list
```

**Add a new extension source**

```azdeveloper
azd extension source add -n <name> -t url -l <registry-url>
```

- `-l, --location`: The location of the extension source.
- `-n, --name`: The name of the extension source.
- `-t, --type`: The type of extension source. Supported types are file and url.

**Remove an extension source**

```azdeveloper
azd extension source remove <name>
```

## Manage extensions

Once extensions are enabled and your extension sources are configured, you can install extensions to add new capabilities to `azd`. Visit the [Quickstart - use the AI extension](quickstart-ai-extension.md) article for an example of working with extensions.

**List extensions**

```azdeveloper
`azd extension list [flags]
```

- `--installed` Displays a list of installed extensions.
- `--source` Only list extensions from the specified source.
- `--tags` Allows filtering extensions by tags (AI, test)

**Install an extension**

```azdeveloper
azd extension install <extension-names> [flags]
```

Replace `<extension-name>` with the name of the extension you want to install.

- `-v, --version` Specifies the version constraint to apply when installing extensions.
- `-s, --source` Specifies the extension source used for installations.

**Upgrade an extension**

```azdeveloper
azd extension upgrade <extension-name>
```

- `--all` Upgrades all previously installed extensions when specified.
- `-v, --version` Upgrades a specified extension using a version constraint, if provided.
- `-s, --source` Specifies the extension source used for installations.

**Uninstall an extension**

```azdeveloper
azd extension uninstall <extension-name>
```

- `--all` Removes all installed extensions when specified.

## Next steps

- [Quickstart - use the AI extension](quickstart-ai-extension.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
