---
title: Add extension capabilities
description: Learn how to add capabilities such as custom commands and lifecycle events to an Azure Developer CLI (azd) extension.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/10/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Add extension capabilities

Capabilities define what an Azure Developer CLI (`azd`) extension can do, from adding custom commands to hooking into the deployment lifecycle. This article shows you how to add capabilities to the Contoso Resource Tagger sample extension from the [Build a sample extension quickstart](quickstart-build-extension.md). You can apply the same patterns to any extension.

Each capability requires two things: an entry in the `capabilities` array of your [extension manifest](extension-manifest.md), and the corresponding implementation in your extension code.

> [!NOTE]
> `azd` extensions are currently in beta.

## Available capabilities

`azd` extensions can declare the following capabilities:

- **`custom-commands`**: Adds new commands and command groups to `azd` under your extension's namespace. For example, the sample extension adds `azd tagger show`. Use this capability to expose tasks that users run directly from the command line.
- **`lifecycle-events`**: Subscribes to events that `azd` raises as it runs, such as `preprovision`, `postprovision`, or `postdeploy`. Your extension runs custom logic at those points without the user calling it directly. For example, the sample extension checks for required tags on `preprovision` before any resources are created.
- **`service-target-provider`**: Registers a new deployment target so `azd` knows how to package and deploy a service to a host it doesn't support out of the box. A service target maps to the `host` value in `azure.yaml`. For example, you might add a provider that deploys a service to a third-party platform or an internal hosting environment.
- **`framework-service-provider`**: Registers support for a language or framework so `azd` knows how to restore, build, and package that project type. This maps to the `language` value in `azure.yaml`. For example, you might add build support for a language that `azd` doesn't recognize by default.
- **`provisioning-provider`**: Replaces how `azd` provisions infrastructure during `azd provision` and `azd up`. Instead of the built-in Bicep or Terraform flow, your extension defines what happens. For example, you might integrate a different infrastructure-as-code tool or a custom deployment API.
- **`validation-provider`**: Contributes checks to the `azd` validation pipeline that run against a project or environment. For example, you might verify that naming conventions, required tags, or security settings are in place before a deployment proceeds.
- **`mcp-server`**: Exposes your extension's functionality as Model Context Protocol (MCP) tools that AI agents, such as GitHub Copilot, can discover and call. For example, the sample extension can expose a `suggest_tags` tool. For more information, see [Add an MCP server to an extension](extension-mcp-server.md).
- **`metadata`**: Provides richer command and configuration metadata that `azd` uses to describe your extension, such as detailed command descriptions and configuration hints surfaced in help output and IntelliSense.

This article focuses on the two most common capabilities: custom commands and lifecycle events. For the `mcp-server` capability, see [Add an MCP server to an extension](extension-mcp-server.md). For complete details on the provider capabilities, see the [extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md).

## Add custom commands

The `custom-commands` capability lets your extension register new commands under a namespace in `azd`. The sample extension already uses this capability for the `azd tagger show` command.

1. Declare the capability in `extension.yaml`.

    ```yaml
    capabilities:
      - custom-commands
    ```

1. Build your commands by using the `azdext.NewExtensionRootCommand` helper, which registers the standard `azd` flags and environment variable handling so you don't have to declare them manually:

    ```go
    import "github.com/azure/azure-dev/cli/azd/pkg/azdext"

    func NewRootCommand() *cobra.Command {
        rootCmd, extCtx := azdext.NewExtensionRootCommand(azdext.ExtensionCommandOptions{
            Name:  "tagger",
            Use:   "tagger <command> [options]",
            Short: "Standardize and report Azure resource tags.",
        })

        rootCmd.AddCommand(newShowCommand(extCtx))
        // Add other subcommands here.
        return rootCmd
    }
    ```

    The helper returns an `*ExtensionContext` that exposes the resolved values of the standard flags, such as `Environment` and `OutputFormat`. Pass the context into your subcommands and read from it inside their `RunE` handlers instead of redeclaring the standard flags.

## Subscribe to lifecycle events

The `lifecycle-events` capability lets your extension run custom logic during project and service lifecycle events, such as `preprovision` or `postdeploy`. For the sample extension, use a `preprovision` event to verify that required tags are set before `azd` provisions any resources.

1. Declare the capability in `extension.yaml`.

    ```yaml
    capabilities:
      - custom-commands
      - lifecycle-events
    ```

1. Add a `listen` command to your extension. `azd` invokes this command to establish the bidirectional connection used for events. Use the `azdext.NewExtensionHost` builder to register your event handlers:

    ```go
    func newListenCommand() *cobra.Command {
        return &cobra.Command{
            Use:    "listen",
            Short:  "Starts the extension and listens for azd events.",
            Hidden: true,
            RunE: func(cmd *cobra.Command, args []string) error {
                ctx := azdext.WithAccessToken(cmd.Context())

                azdClient, err := azdext.NewAzdClient()
                if err != nil {
                    return fmt.Errorf("failed to create azd client: %w", err)
                }
                defer azdClient.Close()

                host := azdext.NewExtensionHost(azdClient).
                    WithProjectEventHandler(
                        "preprovision",
                        func(ctx context.Context, args *azdext.ProjectEventArgs) error {
                            fmt.Printf("Verifying required tags for project: %s\n", args.Project.Name)
                            // Add your tag validation logic here.
                            return nil
                        },
                    )

                // Run blocks until azd closes the connection.
                if err := host.Run(ctx); err != nil {
                    return fmt.Errorf("failed to run extension: %w", err)
                }

                return nil
            },
        }
    }
    ```

1. Register the `listen` command on your root command:

    ```go
    rootCmd.AddCommand(newListenCommand())
    ```

When a user runs `azd provision` or `azd up`, `azd` invokes your extension and calls the `preprovision` handler before provisioning resources.

### Filter service events

Service event handlers support optional filtering so you only handle specific service types. For example, you can handle the `prepackage` event only for Python container app services:

```go
host := azdext.NewExtensionHost(azdClient).
    WithServiceEventHandler(
        "prepackage",
        func(ctx context.Context, args *azdext.ServiceEventArgs) error {
            fmt.Printf("Packaging service: %s\n", args.Service.Name)
            return nil
        },
        &azdext.ServiceEventOptions{
            Host:     "containerapp",
            Language: "python",
        },
    )
```

## Rebuild and test

After you add a capability, rebuild the extension and test the new behavior:

1. If you're using the watcher, your changes rebuild automatically. Otherwise, build manually:

    ```azdeveloper
    azd x build
    ```

1. Test the capability. For lifecycle events, run a command that triggers the event, such as `azd provision`.

## Related content

- [Communicate with azd by using the SDK](extension-sdk.md)
- [Add an MCP server to an extension](extension-mcp-server.md)
- [Publish an extension](publish-extensions.md)
- [Extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
