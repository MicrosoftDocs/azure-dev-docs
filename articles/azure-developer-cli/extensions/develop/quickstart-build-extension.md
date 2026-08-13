---
title: "Quickstart: Build a sample azd extension"
description: Use the Azure Developer CLI (azd) developer extension to scaffold, build, and run your first custom extension in Go.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 08/13/2026
ms.service: azure-dev-cli
ms.topic: quickstart
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Build a sample azd extension

In this quickstart, you build a sample Azure Developer CLI (`azd`) extension named Contoso Resource Tagger. You use the `azd` developer extension to scaffold a Go project, add a custom command, and run the extension locally. The sample extension you create is the starting point for the other articles in this section, which show you how to add capabilities, communicate with `azd`, add a Model Context Protocol (MCP) server, and publish your work.

To learn the concepts behind extension development before you start, see [Extension development concepts](extension-development-concepts.md).

> [!NOTE]
> The `azd` extension framework is generally available. Individual extensions or capabilities might have their own preview status.

## Prerequisites

- [Install the Azure Developer CLI](../../install-azd.md).
- [Install Go 1.26 or later](https://go.dev/dl/).
- A code editor, such as [Visual Studio Code](https://code.visualstudio.com/).

`azd` includes the official extension source by default. You can also install extensions from URL-based or file-based sources, local development registries, opt-in development or nightly registries, and portable `.zip` bundles. For details, see [Extension development concepts](extension-development-concepts.md#extension-registries).

> [!TIP]
> If an `azd` project depends on extension-provided hosts, providers, validation, lifecycle handlers, or commands, declare those required extensions in `azure.yaml` with version constraints. For details, see [`requiredVersions`](../../azd-schema.md#requiredversions).

## Install the developer extension

The `azd` developer extension (`microsoft.azd.extensions`) provides the `azd x` commands you use to build extensions.

1. Install the developer extension from the official extension source:

    ```azdeveloper
    azd extension install microsoft.azd.extensions
    ```

1. Verify the extension is installed:

    ```azdeveloper
    azd extension list --installed
    ```

    The developer extension registers a suite of commands under the `x` namespace. Run `azd x` to see the available commands.

## Scaffold the sample extension

Use the `azd x init` command to scaffold a new extension project.

1. Create and change into a directory for your extensions:

    ```azdeveloper
    mkdir azd-extensions
    cd azd-extensions
    ```

1. Initialize a git repository and create an initial commit. The `azd x init` command requires the extension folder to be tracked by git:

    ```azdeveloper
    git init
    git commit --allow-empty -m "Initial commit"
    ```

1. Run the `azd x init` command to scaffold the extension:

    ```azdeveloper
    azd x init
    ```

1. When prompted, provide the following values:

    | Prompt | Value |
    | --- | --- |
    | Extension ID | `contoso.azd.tagger` |
    | Display name | `Contoso Resource Tagger` |
    | Description | `Standardize and report Azure resource tags for an azd project.` |
    | Namespace | `tagger` |
    | Capabilities | `Custom commands` |
    | Language | `Go` |

The command scaffolds the extension, builds the initial binaries, packages the extension, publishes it to a local extension source, and installs it locally for immediate use.

## Explore the project structure

The `azd x init` command generates a project with the following key files:

```output
contoso.azd.tagger/
├── bin/                    # Contains built binaries
├── build.ps1               # Windows build script
├── build.sh                # Unix build script
├── CHANGELOG.md            # Version history and release notes
├── extension.yaml          # Extension metadata and capabilities
├── main.go                 # Entry point for the extension
├── go.mod                  # Go module definition
└── internal/               # Internal implementation code
```

The most important files are:

- `extension.yaml`: Defines the metadata, capabilities, and commands for your extension. To learn more, see [Define the extension manifest](extension-manifest.md).
- `main.go`: The entry point that runs your extension's root command.
- `build.sh` and `build.ps1`: Cross-platform build scripts that compile a separate binary for each supported platform (Linux, Windows, and macOS).
- `CHANGELOG.md`: Documents changes between versions and provides release notes when you publish.

## Add a custom command

Add a `show` command that prints a greeting to verify your extension works. The exact file layout depends on the starter template, but the pattern is the same: define a [Cobra](https://github.com/spf13/cobra) command and register it on the root command.

1. In the `internal/cmd` directory, create a file named `show.go` with the following content:

    ```go
    package cmd

    import (
        "fmt"

        "github.com/spf13/cobra"
    )

    func newShowCommand() *cobra.Command {
        return &cobra.Command{
            Use:   "show",
            Short: "Displays a greeting from the Contoso Resource Tagger extension.",
            RunE: func(cmd *cobra.Command, args []string) error {
                fmt.Println("Hello from the Contoso Resource Tagger extension!")
                return nil
            },
        }
    }
    ```

1. Register the command on the root command. In the `internal/cmd/root.go` file, add the following line towards the bottom of the file after the other `AddCommand` functions:

    ```go
    rootCmd.AddCommand(newShowCommand())
    ```

## Run the extension

Before running the extension, package it and publish it to your local extension source to register your changes.

1. Package the extension:

    ```azdeveloper
    azd x pack
    ```

1. Publish the extension to register it:

    ```azdeveloper
    azd x publish
    ```

1. Run your new command:

    ```azdeveloper
    azd tagger show
    ```

    The output resembles the following example:

    ```output
    Hello from the Contoso Resource Tagger extension!
    ```

You now have a working extension that you can build on.

## Watch for changes during development

Instead of manually running `azd x pack` and `azd x publish` after each change, use `azd x watch` to automatically build and install the extension as you develop.

1. From the extension directory, start the watcher:

    ```azdeveloper
    azd x watch
    ```

1. In a second terminal, run your command to test changes as you make them:

    ```azdeveloper
    azd tagger show
    ```

To build the extension manually instead of using the watcher, run `azd x build`.

## Clean up resources

When you finish experimenting, uninstall the sample extension:

```azdeveloper
azd extension uninstall contoso.azd.tagger
```

## Related content

To continue building on the sample extension, see the following articles. Each article is independent, so you can complete them in any order:

- [Define the extension manifest](extension-manifest.md)
- [Add extension capabilities](extension-capabilities.md)
- [Communicate with azd by using the SDK](extension-sdk.md)
- [Add an MCP server to an extension](extension-mcp-server.md)
- [Publish an extension](publish-extensions.md)
