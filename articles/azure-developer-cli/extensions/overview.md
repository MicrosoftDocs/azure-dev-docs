---
title: Azure Developer CLI (azd) extensions overview
description: Learn what azd extensions are, why to use them, and how to enable, manage, and install extensions in the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/30/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
ai-usage: ai-generated
---

# Azure Developer CLI extensions overview

Azure Developer CLI (`azd`) extensions are modular components that extend the functionality of the Azure Developer CLI. They enable you to add new capabilities, automate workflows, and integrate with other services directly from the CLI. Use extensions to tailor `azd` to evolving team needs and Azure scenarios.

> [!NOTE]
> `azd` extensions are currently in beta.

## Manage extension sources

You can discover, install, and update extensions as your requirements grow. Extension sources handle distribution and management.

- Extension sources are file or URL based manifests that provide lists of available `azd` extensions.
- You can add custom extension sources that connect to private, local, or public registries.
- Extension sources are an equivalent concept to NuGet or Node Package Manager (NPM) feeds and must adhere to the [official extension registry schema](https://github.com/Azure/azure-dev/blob/main/cli/azd/extensions/registry.schema.json).

`azd` provides two extension source registries to help you get started with extensions:

- The **official extension source registry** is preconfigured in `azd` and is hosted at [https://aka.ms/azd/extensions/registry](https://aka.ms/azd/extensions/registry).
- The **development extension registry** can also be added to your `azd` configuration. This opt-in registry contains experimental extensions for internal testing that might become official extensions.

Custom extension source names must contain 1 to 64 lowercase ASCII letters or digits. You can include hyphens (`-`) and underscores (`_`) between letters or digits. Names must start and end with a letter or digit. `azd` returns an error for invalid names; it doesn't normalize them. The names `azd` and `bundle` are reserved and can't be used for custom sources.

The preconfigured `azd` source is the official registry. You can't remove it or change its location.

To opt in to the development registry, run the following command:

```bash
# Add a new extension source name 'dev' to your `azd` configuration.
azd extension source add -n dev -t url -l "https://aka.ms/azd/extensions/registry/dev"
```

> [!CAUTION]
> Extensions hosted in the dev registry don't contain signed binaries.

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
- `-n, --name`: The name of the extension source. Use a valid custom source name.
- `-t, --type`: The type of extension source. Supported types are file and url.

**Remove an extension source**

```azdeveloper
azd extension source remove <name>
```

You can't remove the preconfigured `azd` source.

If an upgrade reports a source load error caused by a legacy invalid source name in `~/.azd/config.json`, remove the offending source with `azd extension source remove`, then add it again with a valid name.

## Manage extensions

After you enable extensions and configure your extension sources, install extensions to add new capabilities to `azd`. For an example of working with extensions, see [Quickstart - use the AI extension](quickstart-ai-extension.md).

**List extensions**

```azdeveloper
azd extension list [flags]
```

- `--installed` Displays a list of installed extensions.
- `--source` Only lists extensions from the specified source. The source name must be a valid registered source name.
- `--tags` Filters extensions by tags, such as AI or test.

**Install an extension**

```azdeveloper
azd extension install <extension-names> [flags]
```

Replace `<extension-name>` with the name of the extension you want to install.

- `-v, --version` Specifies the version constraint to apply when installing extensions.
- `-s, --source` Specifies the extension source used for installations. The source name must be a valid registered source name.

**Upgrade an extension**

```azdeveloper
azd extension upgrade <extension-name>
```

- `--all` Upgrades all previously installed extensions when specified.
- `-v, --version` Upgrades a specified extension using a version constraint, if provided.
- `-s, --source` Specifies the extension source used for installations. The source name must be a valid registered source name.

**Uninstall an extension**

```azdeveloper
azd extension uninstall <extension-name>
```

- `--all` Removes all installed extensions when specified.

## Use azd extensions in dev containers

[!INCLUDE [extensions-dev-container](../includes/extensions-dev-container.md)]

## Next steps

- [Quickstart: Use the AI extension](quickstart-ai-extension.md)
- [Extension development concepts](develop/extension-development-concepts.md)
- [Quickstart: Build a sample azd extension](develop/quickstart-build-extension.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
