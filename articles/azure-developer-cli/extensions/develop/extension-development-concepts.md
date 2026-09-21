---
title: Extension development concepts
description: Learn the core concepts for developing Azure Developer CLI (azd) extensions, including the developer extension, the azdext SDK, and the gRPC communication model.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/03/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Extension development concepts

Azure Developer CLI (`azd`) [extensions](../overview.md) add new commands, automate workflows, and integrate other services with `azd`. This article explains the concepts you need to understand before you build an extension, such as the developer tooling, the software development kit (SDK), and how `azd` communicates with a running extension. To learn what extensions are from a user perspective, see the [extensions overview](../overview.md).

## The developer extension

The fastest way to build extensions is to use the `azd` developer extension (`microsoft.azd.extensions`). The developer extension adds a suite of commands under the `azd x` namespace that scaffold, build, package, and publish your extension:

| Command | Description |
| --- | --- |
| `azd x init` | Scaffolds a new extension project in the language of your choice. |
| `azd x build` | Builds the extension binary for local development. |
| `azd x watch` | Watches the project for changes and automatically rebuilds and installs the extension. |
| `azd x pack` | Packages the extension artifacts to prepare for publishing. |
| `azd x release` | Creates a GitHub release for the extension. |
| `azd x publish` | Updates an extension registry with the new extension metadata. |

The [Build a sample extension quickstart](quickstart-build-extension.md) shows you how to install the developer extension and scaffold your first extension.

The developer extension supports registry-based publishing workflows and portable bundle distribution. Use `azd x pack` to create platform artifacts for release and registry publication, or create a self-contained `.zip` bundle when you need to share an extension without hosting a registry. Bundles can be installed from a local file or hosted remotely at an HTTPS URL. For step-by-step guidance, see [Publish an extension](publish-extensions.md).

## The extension framework and gRPC

`azd` and extensions run as separate processes that communicate through [gRPC](https://grpc.io/). When you invoke an extension command, the following steps occur:

1. `azd` starts a gRPC server on a random port and sets the `AZD_SERVER` environment variable with the server address.
1. `azd` sets the `AZD_ACCESS_TOKEN` environment variable, which is a signed JSON Web Token (JWT) that grants the extension access to `azd` services for the lifetime of the command.
1. `azd` invokes your extension command and passes the current arguments, flags, and environment variables.
1. Your extension uses a gRPC client to communicate back to `azd` through the framework services, such as prompting the user or reading project configuration.
1. `azd` waits for the command to complete and reports a nonzero exit code as an error.

This model lets extensions interact with `azd` in a consistent, secure way without directly accessing internal `azd` state.

## Project-level extension requirements

Projects can declare the extensions they require in `azure.yaml`. Use the `requiredVersions.extensions` section to list extension IDs and version constraints so `azd` can resolve the versions that satisfy the project.

```yaml
requiredVersions:
  extensions:
    azure.ai.agents: ">=1.0.0"
    contoso.azd.tagger: "^2.0.0"
```

Declare required extensions when a project depends on extension-provided hosts, providers, lifecycle handlers, validation, or commands. For the exact schema and supported version syntax, see [`requiredVersions`](../../azd-schema.md#requiredversions).

## The azdext SDK

The `azdext` package is the Go SDK for the extension framework. It provides a gRPC client and helpers that handle the communication details for you, so you can focus on your extension logic. The SDK includes helpers to:

- Build a root command that registers the standard `azd` flags and environment variable handling.
- Attach the `azd` access token to outgoing requests.
- Call `azd` framework services, such as the Project, Environment, Account, and Prompt services.
- Report named usage events through the `TelemetryService.ReportUsage` gRPC API for official-source extensions. For API usage details, see [Communicate with azd by using the SDK](extension-sdk.md).
- Register lifecycle event handlers and custom providers through an extension host.

To learn how to call `azd` services from your extension, see [Communicate with azd by using the SDK](extension-sdk.md).

## Extension capabilities

Capabilities declare what an extension can do. List an extension's capabilities in its `extension.yaml` manifest, and `azd` grants the corresponding permissions at runtime. Available capabilities include:

- `custom-commands`: Add new command groups and commands to `azd`.
- `lifecycle-events`: Subscribe to project and service lifecycle events, such as `preprovision` and `postdeploy`.
- `mcp-server`: Provide Model Context Protocol (MCP) tools for AI agents.
- `service-target-provider`: Provide custom service deployment targets.
- `framework-service-provider`: Provide custom language and framework build support.
- `provisioning-provider`: Provide a custom infrastructure provisioning experience.
- `validation-provider`: Contribute validation checks to the `azd` validation pipeline.
- `metadata`: Provide rich command and configuration metadata for help output and IntelliSense.

To learn how to add capabilities to an extension, see [Add extension capabilities](extension-capabilities.md).

## Supported languages

You can build `azd` extensions in any language that supports gRPC, and `azd x init` includes starter templates for several languages. Go has the most complete support, including first-class `azdext` SDK helpers, so the articles in this section use Go for all examples.

| Language | Support level |
| --- | --- |
| Go | Best support and first-class SDK helpers. |
| .NET (C#) | Strong integration with a starter template. |
| Python | Good integration with a starter template. |
| JavaScript | Basic integration with a starter template. |

For extensions authored in languages other than Go, you can generate gRPC clients from the [proto files](https://github.com/Azure/azure-dev/blob/main/cli/azd/grpc/proto) in the `azure/azure-dev` repository. For the current state of language support, see the upstream [extension framework documentation](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md).

## Extension registries

You distribute extensions through registry sources or extension bundles. Registry sources are URL-based or file-based manifests that describe available extensions and their artifacts. Extension bundles are portable `.zip` packages that you can install directly from a local file or host remotely at an HTTPS URL when you don't want to host a registry.

- The **official registry** is preconfigured in `azd` and hosts vetted, first-party extensions. Official extensions are developed in a fork of the [azure/azure-dev](https://github.com/azure/azure-dev) repository.
- **URL-based sources** let you install from remote public or private registry manifests.
- **File-based sources** let you install from local registry manifests for development, testing, or offline scenarios.
- The **development** and **nightly** registries are opt-in sources for work-in-progress and automatically built first-party extensions. Extensions in the dev registry are unsigned, not covered by Azure support, and can change or be removed without notice.

To learn how to publish an extension to a registry, see [Publish an extension](publish-extensions.md).

## Related content

- [Build a sample extension](quickstart-build-extension.md)
- [Define the extension manifest](extension-manifest.md)
- [Add extension capabilities](extension-capabilities.md)
