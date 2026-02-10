---
title: "Quickstart: Integrate Azure MCP Server with GitHub Copilot SDK"
description: Learn how to configure the GitHub Copilot SDK to use Azure MCP tools for interacting with Azure resources programmatically.
ms.topic: quickstart
ms.date: 02/10/2026
ai-usage: ai-generated
---

# Quickstart: Integrate Azure MCP Server with GitHub Copilot SDK

This guide explains how to configure the [GitHub Copilot SDK](https://github.com/github/copilot-sdk) to use Azure Model Context Protocol (MCP) tools for interacting with Azure resources.

Azure MCP provides a set of tools that enable AI assistants to interact with Azure resources directly. When integrated with the Copilot SDK, you can build applications that leverage natural language to manage Azure subscriptions, resource groups, storage accounts, and more.

## Prerequisites

- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) installed.
- [Node.js](https://nodejs.org/) installed (for running the server via `npx`).
- [Azure CLI](/cli/azure/install-azure-cli) installed and authenticated (`az login`).

[!INCLUDE [sign-in-local-development](../includes/sign-in-local-development.md)]

## Azure MCP Server configuration example

Regardless of the programming SDK you use, Azure MCP server must be configured in the app context for tools to be available. The essential configuration resembles the following:

```json
{
  "mcp_servers": {
    "azure-mcp": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@azure/mcp@latest", "server", "start"],
      "tools": ["*"]
    }
  }
}
```

The `tools: ["*"]` parameter is essential - it enables all tools from the MCP server for the session.

## Integration examples

The following examples show how to integrate the SDK in different languages.

> [!NOTE]
> For faster startup, you can install Azure MCP Server globally using `npm install -g @azure/mcp@latest`.

# [Python](#tab/python)

### Installation

Install the Python SDK package using pip.

```bash
pip install github-copilot-sdk
```

### Sample code

The following code demonstrates a complete flow:

```python
import asyncio
from copilot import CopilotClient
from copilot.generated.session_events import SessionEventType

async def main():
    # Initialize the Copilot client
    client = CopilotClient({
        "cli_args": [
            "--allow-all-tools",
            "--allow-all-paths",
        ]
    })

    await client.start()

    # Configure Azure MCP server in session config
    azure_mcp_config = {
        "azure-mcp": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@azure/mcp@latest", "server", "start"],
            "tools": ["*"],  # Enable all Azure MCP tools
        }
    }

    # Create session with MCP servers
    session = await client.create_session({
        "model": "gpt-4.1",  # Default model; BYOK can override
        "streaming": True,
        "mcp_servers": azure_mcp_config,
    })

    # Handle events
    def handle_event(event):
        if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
            if hasattr(event.data, 'delta_content') and event.data.delta_content:
                print(event.data.delta_content, end="", flush=True)
        elif event.type == SessionEventType.TOOL_EXECUTION_START:
            tool_name = getattr(event.data, 'tool_name', 'unknown')
            print(f"\n[TOOL: {tool_name}]")

    session.on(handle_event)

    # Send prompt
    await session.send_and_wait({
        "prompt": "List all resource groups in my Azure subscription"
    })

    await client.stop()

if __name__ == "__main__":
    asyncio.run(main())
```

The preceding code:

- Initializes the Copilot client.
- Configures the Azure MCP server using `npx`.
- Creates a session with the GPT-4.1 model and streaming enabled.
- Handles events to print assistant responses and tool execution logs.
- Sends a prompt to list Azure resource groups.

# [Node.js / TypeScript](#tab/nodejs)

### Installation

Install the Node.js SDK package using npm.

```bash
npm install @github/copilot-sdk
```

### Sample code

The following TypeScript code demonstrates a complete flow:

```typescript
import { CopilotClient, SessionEventType } from '@github/copilot-sdk';

async function main() {
  // Initialize the Copilot client
  const client = new CopilotClient({
    cliArgs: [
      '--allow-all-tools',
      '--allow-all-paths',
    ]
  });

  await client.start();

  // Configure Azure MCP server in session config
  const azureMcpConfig = {
    'azure-mcp': {
      type: 'local' as const,
      command: 'npx',
      args: ['-y', '@azure/mcp@latest', 'server', 'start'],
      tools: ['*'],  // Enable all Azure MCP tools
    }
  };

  // Create session with MCP servers
  const session = await client.createSession({
    model: 'gpt-4.1',  // Default model; BYOK can override
    streaming: true,
    mcpServers: azureMcpConfig,
  });

  // Handle events
  session.on((event) => {
    if (event.type === SessionEventType.ASSISTANT_MESSAGE_DELTA) {
      if (event.data?.deltaContent) {
        process.stdout.write(event.data.deltaContent);
      }
    } else if (event.type === SessionEventType.TOOL_EXECUTION_START) {
      const toolName = event.data?.toolName || 'unknown';
      console.log(`\n[TOOL: ${toolName}]`);
    }
  });

  // Send prompt
  await session.sendAndWait({
    prompt: 'List all resource groups in my Azure subscription'
  });

  await client.stop();
}

main().catch(console.error);
```

The preceding code:

- Initializes the Copilot client.
- Configures the Azure MCP server using `npx`.
- Creates a session with the GPT-4.1 model and streaming enabled.
- Handles events to print assistant responses and tool execution logs.
- Sends a prompt to list Azure resource groups.

# [.NET](#tab/dotnet)

### Installation

Add the contents of the NuGet package to your project.

```bash
dotnet add package GitHub.Copilot.SDK
```

### Sample code

The following C# code demonstrates a complete flow:

```csharp
using GitHub.Copilot.SDK;
using GitHub.Copilot.SDK.Models;

class Program
{
    static async Task Main(string[] args)
    {
        // Initialize the Copilot client
        var client = new CopilotClient(new CopilotClientOptions
        {
            CliArgs = new[] { "--allow-all-tools", "--allow-all-paths" }
        });

        await client.StartAsync();

        // Configure Azure MCP server in session config
        var azureMcpConfig = new Dictionary<string, MCPServerConfig>
        {
            ["azure-mcp"] = new MCPServerConfig
            {
                Type = "local",
                Command = "npx",
                Args = new[] { "-y", "@azure/mcp@latest", "server", "start" },
                Tools = new[] { "*" }  // Enable all Azure MCP tools
            }
        };

        // Create session with MCP servers
        var session = await client.CreateSessionAsync(new SessionConfig
        {
            Model = "gpt-4.1",  // Default model; BYOK can override
            Streaming = true,
            McpServers = azureMcpConfig
        });

        // Handle events
        session.OnEvent += (sender, e) =>
        {
            switch (e.Type)
            {
                case SessionEventType.AssistantMessageDelta:
                    if (!string.IsNullOrEmpty(e.Data?.DeltaContent))
                    {
                        Console.Write(e.Data.DeltaContent);
                    }
                    break;
                case SessionEventType.ToolExecutionStart:
                    Console.WriteLine($"\n[TOOL: {e.Data?.ToolName}]");
                    break;
            }
        };

        // Send prompt
        await session.SendAndWaitAsync(new Message
        {
            Prompt = "List all resource groups in my Azure subscription"
        });

        await client.StopAsync();
    }
}
```

The preceding code:

- Initializes the Copilot client.
- Configures the Azure MCP server using `npx`.
- Creates a session with the GPT-4.1 model and streaming enabled.
- Handles events to print assistant responses and tool execution logs.
- Sends a prompt to list Azure resource groups.

# [Go](#tab/go)

### Installation

Get the Go SDK package using `go get`.

```bash
go get github.com/github/copilot-sdk/go
```

### Sample code

The following code demonstrates a complete flow:

```go
package main

import (
    "context"
    "fmt"
    "log"

    copilot "github.com/github/copilot-sdk/go"
)

func main() {
    ctx := context.Background()

    // Initialize the Copilot client
    client, err := copilot.NewClient(copilot.ClientOptions{
        CLIArgs: []string{
            "--allow-all-tools",
            "--allow-all-paths",
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    if err := client.Start(ctx); err != nil {
        log.Fatal(err)
    }
    defer client.Stop(ctx)

    // Configure Azure MCP server in session config
    azureMcpConfig := map[string]copilot.MCPServerConfig{
        "azure-mcp": {
            Type:    "local",
            Command: "npx",
            Args:    []string{"-y", "@azure/mcp@latest", "server", "start"},
            Tools:   []string{"*"}, // Enable all Azure MCP tools
        },
    }

    // Create session with MCP servers
    session, err := client.CreateSession(ctx, copilot.SessionConfig{
        Model:      "gpt-4.1",  // Default model; BYOK can override
        Streaming:  true,
        MCPServers: azureMcpConfig,
    })
    if err != nil {
        log.Fatal(err)
    }

    // Handle events
    session.OnEvent(func(event copilot.SessionEvent) {
        switch event.Type {
        case copilot.AssistantMessageDelta:
            if event.Data.DeltaContent != "" {
                fmt.Print(event.Data.DeltaContent)
            }
        case copilot.ToolExecutionStart:
            fmt.Printf("\n[TOOL: %s]\n", event.Data.ToolName)
        }
    })

    // Send prompt
    err = session.SendAndWait(ctx, copilot.Message{
        Prompt: "List all resource groups in my Azure subscription",
    })
    if err != nil {
        log.Fatal(err)
    }
}
```

The preceding code:

- Initializes the Copilot client.
- Configures the Azure MCP server using `npx`.
- Creates a session with the GPT-4.1 model and streaming enabled.
- Handles events to print assistant responses and tool execution logs.
- Sends a prompt to list Azure resource groups.

---
