In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using a custom .NET client
- Run prompts to test Azure MCP Server operations and manage Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Visual Studio Code](https://code.visualstudio.com/download)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) Visual Studio Code extension
- [.NET 9.0](https://dotnet.microsoft.com/en-us/download)
- [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

[!INCLUDE [sign-in-local-development](sign-in-local-development.md)]

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
