---
title: Add an MCP server to an extension
description: Learn how to add a Model Context Protocol (MCP) server to an Azure Developer CLI (azd) extension so AI agents can use its tools.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/10/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Add an MCP server to an extension

An Azure Developer CLI (`azd`) extension can expose tools to AI agents through a Model Context Protocol (MCP) server. When you add the `mcp-server` capability, agents such as GitHub Copilot can discover and call your extension's tools. This article shows you how to add an MCP server to the Contoso Resource Tagger sample extension from the [Build a sample extension quickstart](quickstart-build-extension.md). You can apply the same pattern to any extension.

> [!NOTE]
> `azd` extensions are currently in beta.

## How MCP servers work

The Model Context Protocol is an open standard that lets AI agents discover and call tools provided by external servers. When your extension declares the `mcp-server` capability, `azd` can start your extension as an MCP server and route tool requests from an agent to your extension. Your extension implements tools that the agent calls to perform tasks, such as suggesting standardized tags for a project.

## Declare the capability

Add the `mcp-server` capability to your `extension.yaml` manifest:

```yaml
capabilities:
  - custom-commands
  - mcp-server
```

You can also add an `mcp` section to the manifest to configure how `azd` starts the MCP server. The `serve` property supports `args` and `env`; `azd` already knows the extension executable, so you don't specify a command:

```yaml
mcp:
  serve:
    args:
      - mcp
      - start
```

## Add an MCP command

Add a command that starts the MCP server. `azd` invokes this command to run your extension as an MCP server. Use an MCP server library for Go, such as [mcp-go](https://github.com/mark3labs/mcp-go), to handle the protocol.

1. Create a file named `mcp.go` in your `internal/cmd` directory:

    ```go
    package cmd

    import (
        "context"
        "fmt"

        "github.com/mark3labs/mcp-go/mcp"
        "github.com/mark3labs/mcp-go/server"
        "github.com/spf13/cobra"
    )

    func newMcpCommand() *cobra.Command {
        mcpCmd := &cobra.Command{
            Use:    "mcp",
            Short:  "Model Context Protocol server commands.",
            Hidden: true,
        }

        mcpCmd.AddCommand(newMcpStartCommand())
        return mcpCmd
    }

    func newMcpStartCommand() *cobra.Command {
        return &cobra.Command{
            Use:   "start",
            Short: "Starts the MCP server.",
            RunE: func(cmd *cobra.Command, args []string) error {
                s := server.NewMCPServer(
                    "Contoso Resource Tagger",
                    "0.1.0",
                )

                // Register the suggest_tags tool.
                s.AddTool(newSuggestTagsTool())

                // Serve over stdio so azd and agents can connect.
                return server.ServeStdio(s)
            },
        }
    }
    ```

1. Register the `mcp` command on your root command:

    ```go
    rootCmd.AddCommand(newMcpCommand())
    ```

## Implement a tool

Define the tool that the AI agent calls. Add the following `suggest_tags` tool to the same `internal/cmd/mcp.go` file you created earlier. The `mcp` and `server` identifiers come from the packages already imported in that file (`github.com/mark3labs/mcp-go/mcp` and `github.com/mark3labs/mcp-go/server`), and the handler also uses the `context` and `fmt` imports. Adding the function to `mcp.go` reuses those imports so the code compiles:

```go
func newSuggestTagsTool() (mcp.Tool, server.ToolHandlerFunc) {
    tool := mcp.NewTool(
        "suggest_tags",
        mcp.WithDescription("Suggests standardized Azure resource tags for a project."),
        mcp.WithString("environment",
            mcp.Description("The target environment, such as dev or prod."),
            mcp.Required(),
        ),
    )

    handler := func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
        environment, err := request.RequireString("environment")
        if err != nil {
            return mcp.NewToolResultError(err.Error()), nil
        }

        suggestion := fmt.Sprintf(
            "Suggested tags: environment=%s, managed-by=azd, cost-center=<required>",
            environment,
        )

        return mcp.NewToolResultText(suggestion), nil
    }

    return tool, handler
}
```

## Test the MCP server

After you add the MCP server, rebuild your extension and verify the server starts:

1. Rebuild the extension:

    ```azdeveloper
    azd x build
    ```

1. Start the MCP server directly to verify it runs without errors:

    ```azdeveloper
    azd tagger mcp start
    ```

    The server starts and listens on standard input and output. An MCP client, such as an AI agent configured to use your extension, connects to this server to call your tools.

## Related content

- [Add extension capabilities](extension-capabilities.md)
- [Communicate with azd by using the SDK](extension-sdk.md)
- [Publish an extension](publish-extensions.md)
- [Extension framework reference](https://github.com/Azure/azure-dev/blob/main/cli/azd/docs/extensions/extension-framework.md)
