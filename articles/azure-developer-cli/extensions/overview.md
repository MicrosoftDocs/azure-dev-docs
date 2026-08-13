---
title: Azure Developer CLI (azd) extensions overview
description: Learn what azd extensions are, why to use them, and how to enable, manage, and install extensions in the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/13/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
ai-usage: ai-generated
---

# Azure Developer CLI extensions overview

Azure Developer CLI (`azd`) extensions are modular components that extend the functionality of the Azure Developer CLI. They enable you to add new capabilities, automate workflows, and integrate with other services directly from the CLI. Use extensions to tailor `azd` to evolving team needs and Azure scenarios.

> [!NOTE]
> The `azd` extension framework is generally available. Individual extensions or capabilities might have their own preview status.

## Manage extension sources

You can discover, install, and update extensions as your requirements grow. Extension sources handle distribution and management.

- Extension sources are file or URL based manifests that provide lists of available `azd` extensions.
- You can add custom extension sources that connect to private, local, or public registries.
- Extension sources are an equivalent concept to NuGet or Node Package Manager (NPM) feeds and must adhere to the [official extension registry schema](https://github.com/Azure/azure-dev/blob/main/cli/azd/extensions/registry.schema.json).

`azd` supports several ways to resolve extensions:

- The **official extension source registry** is preconfigured in `azd` and is hosted at [https://aka.ms/azd/extensions/registry](https://aka.ms/azd/extensions/registry).
- **URL-based sources** reference remote registry manifests that your team hosts for public or private distribution.
- **File-based sources** reference local registry manifests for offline use or local development.
- The **development** and **nightly** registries are opt-in sources for work-in-progress and automatically built first-party extensions. Use them for testing scenarios instead of production workflows.
- **Self-contained bundle files** provide portable `.zip` packages for direct installation when you don't want to host a registry.

Custom extension source names must contain 1 to 64 lowercase ASCII letters or digits. You can include hyphens (`-`) and underscores (`_`) between letters or digits. Names must start and end with a letter or digit. `azd` returns an error for invalid names; it doesn't normalize them. The names `azd` and `bundle` are reserved and can't be used for custom sources.

The preconfigured `azd` source is the official registry. You can't remove it or change its location.

To opt in to the development registry, run the following command:

```bash
# Add a new extension source name 'dev' to your `azd` configuration.
azd extension source add -n dev -t url -l "https://aka.ms/azd/extensions/registry/dev"
```

> [!CAUTION]
> Extensions hosted in the dev registry are unsigned, not covered by Azure support, and can change or be removed without notice.

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

## Declare required extensions in a project

Projects can declare required extensions in `azure.yaml` so `azd` can resolve and install the extension versions the project needs. Add extension requirements under `requiredVersions.extensions`, and use `latest`, an exact version, or a supported semantic version constraint.

```yaml
requiredVersions:
  extensions:
    azure.ai.agents: ">=1.0.0"
    contoso.azd.tagger: "^2.0.0"
```

Use project-level requirements when a template depends on extension-provided service hosts, lifecycle handlers, validation providers, or commands. For the complete schema and version constraint details, see [`requiredVersions`](../azd-schema.md#requiredversions).

## Understand extension integration points

Extensions can integrate with `azd` in several ways:

- Add command namespaces with metadata, help, and examples.
- Provide configuration schemas and IntelliSense metadata for project files.
- Register lifecycle event handlers for workflows such as provision, package, and deploy.
- Add providers for custom provisioning, validation, service targets, and language or framework support.
- Expose Model Context Protocol (MCP) server capabilities for agents and developer tools.

For implementation guidance, see [Extension development concepts](develop/extension-development-concepts.md).

## Use azd extensions in dev containers

[!INCLUDE [extensions-dev-container](../includes/extensions-dev-container.md)]

## Next steps

- [Quickstart: Use the AI extension](quickstart-ai-extension.md)
- [Extension development concepts](develop/extension-development-concepts.md)
- [Quickstart: Build a sample azd extension](develop/quickstart-build-extension.md)
- [Extension framework readme](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
