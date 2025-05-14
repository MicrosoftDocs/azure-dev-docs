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

# Azure Developer CLI Extensions Overview

Azure Developer CLI (`azd`) extensions are modular components that extend the functionality of the Azure Developer CLI. Extensions provide a way to add new capabilities, automate workflows, and integrate with additional services directly from the CLI. Extensions help you tailor `azd` to your team's needs and keep up with evolving Azure scenarios. They can add new commands, support new Azure services, or connect azd to other tools and systems.

## Enable azd extensions

Extensions are currently an alpha feature. To enable extension support, run the following command in your terminal:

```azdeveloper
azd config set alpha.extensions on
```

This command enables extension management and usage in your `azd` environment.

## Manage extension sources

Extensions are distributed and managed through extension sources, making it easy to discover, install, and update them as your requirements grow. Extension sources are registries that provide lists of available azd extensions. By default, `azd` is configured with the official extension registry, but you can add custom sources for private, local, or experimental extensions.

**List extension sources

```azdeveloper
azd extension source list
```

**Add a new extension source:**

```azdeveloper
azd extension source add -n <name> -t url -l <registry-url>
```

Replace `<name>` with a source name and `<registry-url>` with the URL of the extension registry.

**Remove an extension source:**

```azdeveloper
azd extension source remove <name>
```

> [!NOTE]
> The official extension registry is pre-configured and hosted at [https://aka.ms/azd/extensions/registry](https://aka.ms/azd/extensions/registry).

## Install extensions

Once extensions are enabled and your sources are configured, you can install extensions to add new capabilities to `azd`.

**List available extensions:**

```azdeveloper
azd extension list
```

**Install an extension:**

```azdeveloper
azd extension install <extension-name>
```

Replace `<extension-name>` with the name of the extension you want to install.

**List installed extensions:**

```azdeveloper
azd extension list --installed
```

**Upgrade an extension:**

```azdeveloper
azd extension upgrade <extension-name>
```

**Uninstall an extension:**

```azdeveloper
azd extension uninstall <extension-name>
```

## Next steps

- [Quickstart - use the AI extension](quickstart-ai-extension.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extension-framework.md)
