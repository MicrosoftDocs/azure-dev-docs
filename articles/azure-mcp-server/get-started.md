---
title: Get started using the Azure MCP Server
description: Learn how to connect to and consume Azure MCP Server operations
keywords: azure developer cli, azd
author: alexwolfmsft
ms.author: alexwolf
ms.date: 05/06/2025
ms.topic: get-started
ms.custom: build-2025
zone_pivot_group_filename: developer/azure-mcp-server/azure-mcp-zone-pivot-groups.json
zone_pivot_groups: azure-mcp-server-tools-frameworks
---

# Quickstart: Get started with Azure MCP Server

The Model Context Protocol (MCP) is an open protocol designed to standardize integrations between AI apps and external tools and data sources. Developers can create MCP clients and servers that enhance the capabilities of AI models for more accurate, relevant, and context-aware responses. [Azure MCP Server](https://github.com/Azure/azure-mcp) exposes prebuilt operations to interact with Azure services for agentic usage, allowing for AI systems to perform operations that are context-aware of your Azure resources.

In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using popular tools and frameworks
- Run prompts to test Azure MCP Server operations and manage Azure resources

## Prerequisites

::: zone pivot="mcp-github-copilot"

- [Visual Studio Code](https://code.visualstudio.com/download)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension

::: zone-end

::: zone pivot="mcp-csharp"

- [Visual Studio Code](https://code.visualstudio.com/download)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension
- [.NET 9.0](https://dotnet.microsoft.com/en-us/download)
- [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Sign-in for local development

The Azure MCP Server provides a seamless authentication experience using token-based authentication via Microsoft Entra ID. Internally, Azure MCP Server uses [`DefaultAzureCredential`](/dotnet/azure/sdk/authentication/credential-chains?tabs=dac) from the [Azure Identity library](/dotnet/api/overview/azure/identity-readme?view=azure-dotnet&preserve-view=true) to authenticate users.

You'll need to sign-in to one of the tools supported by `DefaultAzureCredential` locally with your Azure account to work with Azure MCP Server. Sign-in using a terminal window, such as the Visual Studio Code terminal:

## [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

## [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

## [Azure Developer CLI](#tab/azure-developer-cli)

```azdeveloper
azd auth login
```

---

Once you have signed-in successfully to one of the preceding tools, Azure MCP Server can automatically discover your credentials and use them to authenticate and perform operations on Azure services.

> [!NOTE]
> You can also sign-in to Azure through Visual Studio.
> Azure MCP Server is only able to run operations that the signed-in user has permissions to perform.

::: zone-end

::: zone pivot="mcp-github-copilot"

## Install the Azure MCP Server

Select one of the following options to install the Azure MCP Server in Visual Studio Code:

## [Global install](#tab/one-click)

1. To install the Azure MCP Server for Visual Studio Code in your user settings, select the following link:

    [![Install with NPX in Visual Studio Code](https://img.shields.io/badge/VS_Code-Install_Azure_MCP_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=Azure%20MCP%20Server&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40azure%2Fmcp%40latest%22%2C%22server%22%2C%22start%22%5D%7D)

    A list of installation options opens inside Visual Studio Code. Select **Install Server** to add the server configuration to your user settings.

1. Open GitHub Pilot and select Agent Mode. To learn more about Agent Mode, visit the [Visual Studio Code Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).
1. Refresh the tools list to see Azure MCP Server as an available option:

    :::image type="content" source="../azure-developer-cli/media/azure-mcp-server/github-copilot-integration.png" alt-text="A screenshot showing Azure MCP Server as GitHub Copilot tool.":::

## [Directory install](#tab/manual)

You can also manually install Azure MCP Server for a specific directory:

1. Open an empty directory or an existing project directory in Visual Studio Code.
1. At the root of the folder, create a `.vscode` folder if there isn't one already.
1. Inside the `.vscode` folder, create a new file named `mcp.json` add the following JSON:

    ```json
    {
      "servers": {
        "Azure MCP Server": {
          "command": "npx",
          "args": [
            "-y",
            "@azure/mcp@latest",
            "server",
            "start"
          ]
        }
      }
    }
    ```

1. Save your changes to `mcp.json`.
1. Open GitHub Copilot and select Agent Mode.
1. Select the tools icon to view the available tools. Search for *Azure MCP Server* to filter the results.

    :::image type="content" source="../azure-developer-cli/media/azure-mcp-server/github-copilot-integration.png" alt-text="A screenshot showing Azure MCP Server as GitHub Copilot tool.":::

    To learn more about Agent Mode, visit the [Visual Studio Code Documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

---

## Use prompts to test the Azure MCP Server

1. Open GitHub Copilot and select Agent Mode.
1. Enter a prompt that causes the agent to use Azure MCP Server tools, such as *List my Azure resource groups*.
1. In order to authenticate Azure MCP Server, Copilot will prompt you to sign-in to Azure using the browser.

    > [!NOTE]
    > Copilot will not prompt you to sign-in to Azure if you are already authenticated via other local tooling such as the Azure CLI.

1. Copilot requests permission to run the necessary Azure MCP Server operation for your prompt. Select **Continue** or use the arrow to select a more specific behavior:
    - **Current session** always runs the operation in the current GitHub Copilot Agent Mode session.
    - **Current workspace** always runs the command for current Visual Studio Code workspace.
    - **Always allow** sets the operation to always run for any GitHub Copilot Agent Mode session or any Visual Studio Code workspace.

    :::image type="content" source="../azure-developer-cli/media/azure-mcp-server/run-command-prompt.png" alt-text="A screenshot showing the options available to run Azure MCP Server operations.":::

    The output for the previous prompt should resemble the following text:

    ```output
    The following resource groups are available for your subscription:

    1. **DefaultResourceGroup-EUS** (Location: `eastus`)
    2. **rg-testing** (Location: `centralus`)
    3. **rg-azd** (Location: `eastus2`)
    4. **msdocs-sample** (Location: `southcentralus`)
    14. **ai-testing** (Location: `eastus2`)
    
    Let me know if you need further details or actions related to any of these resource groups!
    ```

1. Explore and test the Azure MCP operations using other relevant prompts, such as:

    ```
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    ```

::: zone-end

::: zone pivot="mcp-csharp"

## Create the .NET host app

Complete the following steps to create a .NET console app. The app connects to an AI model and acts as a host for an MCP client that connects to an Azure MCP Server.

### Create the project

1. Open a terminal to an empty folder where you want to create the project.
1. Run the following command to create a new .NET console application:

   ```bash
   dotnet new console -n MCPHostApp
   ```

1. Navigate into the newly created project folder:

   ```bash
   cd MCPHostApp
   ```

1. Open the project folder in Visual Studio Code by running:

   ```bash
   code .
   ```

### Add the NuGet Packages

1. In the terminal, run the following commands to add the necessary NuGet packages:

   ```bash
   dotnet add package Azure.AI.OpenAI --prerelease
   dotnet add package Azure.Identity
   dotnet add package Microsoft.Extensions.AI --prerelease
   dotnet add package Microsoft.Extensions.AI.OpenAI --prerelease
   dotnet add package ModelContextProtocol --prerelease
   ```

1. Verify that the packages were added by checking the `MCPHostApp.csproj` file.

1. Run the following command to build the project and ensure everything is set up correctly:

   ```bash
   dotnet build
   ```

### Add the app code

Replace the contents of `Program.cs` with the following code:

```csharp
using Azure.AI.OpenAI;
using Azure.Identity;
using Microsoft.Extensions.AI;
using ModelContextProtocol.Client;
using ModelContextProtocol.Protocol.Transport;

// Create an IChatClient
IChatClient client =
    new ChatClientBuilder(
        new AzureOpenAIClient(new Uri("<your-Azure-OpenAI-endpoint>"), 
        new DefaultAzureCredential(
            new DefaultAzureCredentialOptions()))
        .GetChatClient("gpt-4o").AsIChatClient())
    .UseFunctionInvocation()
    .Build();

// Create the MCP client
var mcpClient = await McpClientFactory.CreateAsync(
    new StdioClientTransport(new()
    {
        Command = "npx",
        Arguments = ["-y", "@azure/mcp@latest", "server", "start"],
        Name = "Azure MCP",
    }));

// Get all available tools from the MCP server
Console.WriteLine("Available tools:");
var tools = await mcpClient.ListToolsAsync();
foreach (var tool in tools)
{
    Console.WriteLine($"{tool}");
}
Console.WriteLine();

// Conversational loop that can utilize the tools
List<ChatMessage> messages = [];
while (true)
{
    Console.Write("Prompt: ");
    messages.Add(new(ChatRole.User, Console.ReadLine()));

    List<ChatResponseUpdate> updates = [];
    await foreach (var update in client
        .GetStreamingResponseAsync(messages, new() { Tools = [.. tools] }))
    {
        Console.Write(update);
        updates.Add(update);
    }
    Console.WriteLine();

    messages.AddMessages(updates);
}
```

The preceding code accomplishes the following tasks:

- Initializes an `IChatClient` abstraction using the [`Microsoft.Extensions.AI`](/dotnet/ai/microsoft-extensions-ai) libraries.
- Creates an MCP client to interact with the Azure MCP Server using a standard I/O transport. The provided `npx` command and corresponding arguments download and start the Azure MCP Server.
- Retrieves and displays a list of available tools from the MCP server, which is a standard MCP function.
- Implements a conversational loop that processes user prompts and utilizes the tools for responses.

## Run and test the app

Complete the following steps to test your .NET host app:

1. In a terminal window open to the root of your project, run the following command to start the app:

   ```bash
   dotnet run
   ```

1. Once the app is running, enter the following test prompt:

   ```
   List all of the resource groups in my subscription
   ```

      The output for the previous prompt should resemble the following text:
    
      ```output
      The following resource groups are available for your subscription:
    
      1. **DefaultResourceGroup-EUS** (Location: `eastus`)
      2. **rg-testing** (Location: `centralus`)
      3. **rg-azd** (Location: `eastus2`)
      4. **msdocs-sample** (Location: `southcentralus`)
      14. **ai-testing** (Location: `eastus2`)
      
      Let me know if you need further details or actions related to any of these resource groups!
      ```

1. Explore and test the Azure MCP operations using other relevant prompts, such as:

    ```
    List all of the storage accounts in my subscription
    Get the available tables in my storage accounts
    ```

::: zone-end

::: zone pivot="mcp-python"

## Python TBD

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Azure MCP Server overview](overview.md)
> [Azure MCP Server tools](commands/use-tools.md)
