---
title: Define the extension manifest
description: Learn how to configure the extension.yaml manifest for an Azure Developer CLI (azd) extension, including properties, capabilities, dependencies, and extension packs.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/10/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Define the extension manifest

Every Azure Developer CLI (`azd`) extension includes an `extension.yaml` manifest that describes its metadata and capabilities. `azd` uses this metadata in the extension registry to help users discover, install, and understand your extension. This article explains the manifest properties using the Contoso Resource Tagger sample extension from the [Build a sample extension quickstart](quickstart-build-extension.md). You can apply the same concepts to any extension.

> [!NOTE]
> `azd` extensions are currently in beta.

## Manifest properties

The `extension.yaml` manifest supports the following properties.

### Required properties

Every manifest must include the following properties:

| Property | Description |
| --- | --- |
| `id` | Unique identifier for the extension, such as `contoso.azd.tagger`. |
| `version` | Semantic version in `MAJOR.MINOR.PATCH` format. |
| `displayName` | Human-readable name of the extension. |
| `description` | Detailed description of the extension. |

Each manifest must also include either `capabilities` or `dependencies`. An extension that provides commands or providers declares `capabilities`. An [extension pack](#group-extensions-with-extension-packs) declares `dependencies` instead.

### Optional properties

The manifest also supports the following optional properties:

| Property | Description |
| --- | --- |
| `namespace` | Command namespace that groups the extension's commands, such as `tagger`. |
| `entryPoint` | Executable or script that serves as the entry point. |
| `language` | Programming language the extension is written in, such as `go`. |
| `capabilities` | Array of extension capabilities. |
| `usage` | Instructions on how to use the extension. |
| `examples` | Array of usage examples with a name, description, and usage. |
| `tags` | Keywords for categorization and filtering. |
| `dependencies` | Other extensions this extension depends on. |
| `providers` | List of providers the extension registers. |
| `platforms` | Platform-specific metadata. |
| `mcp` | Model Context Protocol server configuration. |
| `requiredAzdVersion` | Semantic version constraint on the `azd` version required to use the extension, such as `>= 1.24.0`. |

## Example manifest

The following example shows an `extension.yaml` manifest for the Contoso Resource Tagger sample extension:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/refs/heads/main/cli/azd/extensions/extension.schema.json

id: contoso.azd.tagger
namespace: tagger
displayName: Contoso Resource Tagger
description: Standardize and report Azure resource tags for an azd project.
usage: azd tagger <command> [options]
version: 0.1.0
language: go
capabilities:
  - custom-commands

examples:
  - name: show
    description: Displays a greeting from the extension.
    usage: azd tagger show

tags:
  - tags
  - governance
  - example
```

The `$schema` comment at the top of the file enables validation and IntelliSense in editors that support the YAML language server.

## Declare capabilities

The `capabilities` array declares what your extension can do. `azd` grants the corresponding permissions at runtime, and some framework services fail with a permission error if the matching capability isn't declared. The sample extension starts with only `custom-commands`:

```yaml
capabilities:
  - custom-commands
```

As you add functionality in the other articles, you add more capabilities. For example, [Add extension capabilities](extension-capabilities.md) adds `lifecycle-events`, and [Add an MCP server to an extension](extension-mcp-server.md) adds `mcp-server`. The available capabilities are:

- `custom-commands`: Add new commands to `azd` under your namespace, such as `azd tagger show`.
- `lifecycle-events`: Run custom logic when `azd` raises events like `preprovision` or `postdeploy`.
- `mcp-server`: Expose Model Context Protocol tools that AI agents can call.
- `service-target-provider`: Add a custom deployment target for a `host` that `azd` doesn't support by default.
- `framework-service-provider`: Add build and package support for a `language` that `azd` doesn't recognize by default.
- `provisioning-provider`: Replace how `azd` provisions infrastructure with a custom implementation.
- `validation-provider`: Add checks that run in the `azd` validation pipeline.
- `metadata`: Provide richer command and configuration metadata for help output and IntelliSense.

For a fuller explanation of each capability with examples, see [Add extension capabilities](extension-capabilities.md).

## Add usage examples

The `examples` array documents common ways to use your extension. `azd` surfaces these examples when users view details about your extension:

```yaml
examples:
  - name: show
    description: Displays a greeting from the extension.
    usage: azd tagger show
```

## Register providers

When your extension provides custom service targets or framework services, declare them in the `providers` section so `azd` knows what your extension offers:

```yaml
providers:
  - name: tagger
    type: service-target
    description: Deploys tagged resources to Azure.
```

## Add platform-specific configuration

Use the `platforms` property to provide platform-specific metadata, such as the executable name for each operating system.


```yaml
platforms:
  windows:
    executable: tagger.exe
  linux:
    executable: tagger
  darwin:
    executable: tagger
```

## Declare dependencies

Extensions can depend on other extensions by using the `dependencies` array. Dependencies support semantic versioning constraints:

```yaml
dependencies:
  - id: microsoft.azd.core
    version: "^1.0.0"
```

`azd` installs or upgrades to the highest published version that satisfies each constraint. Common constraint formats include:

- `^1.0.0`: Compatible with version 1.x.x.
- `~1.2.0`: Compatible with version 1.2.x.
- `>=1.0.0 <2.0.0`: A version range.

## Group extensions with extension packs

An extension pack is a manifest that groups related extensions so users can install them with a single command. A pack declares `dependencies` but doesn't provide an executable, command namespace, or capabilities of its own. Use a pack to publish a curated set of extensions, such as a product family or scenario bundle:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Azure/azure-dev/refs/heads/main/cli/azd/extensions/extension.schema.json

id: contoso.tools
displayName: Contoso Tools Extension Pack
description: Installs the Contoso azd extensions.
version: 0.1.0

dependencies:
  - id: contoso.azd.tagger
    version: "~0.1.0"
```

Installing a pack recursively installs its dependencies from the same extension source as the pack.

## Related content

- [Add extension capabilities](extension-capabilities.md)
- [Communicate with azd by using the SDK](extension-sdk.md)
- [Publish an extension](publish-extensions.md)
- [Extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
