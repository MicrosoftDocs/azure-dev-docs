In this article, you learn how to complete the following tasks:

- Install and authenticate to the Azure MCP Server
- Connect to Azure MCP Server using a custom Python client
- Run prompts to test Azure MCP Server operations and manage Azure resources

## Prerequisites

- An [Azure account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) with an active subscription
- [Python 3.9 or higher](https://www.python.org/downloads/) installed locally
- [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed locally

[!INCLUDE [sign-in-local-development](sign-in-local-development.md)]

## Create the Python app

Complete the following steps to create a Python app. The app connects to an AI model and acts as a host for an MCP client that connects to an Azure MCP Server.

### Create the project

1. Open an empty folder inside your editor of choice.
1. Create a new file named `requirements.txt` and add the following library dependencies:

    ```output
    mcp
    azure-identity
    openai
    logging
    ```

1. In the same folder, create a new file named `.env` and add the following environment variables:

    ```output
    AZURE_OPENAI_ENDPOINT=<your-azure-openai-endpoint>
    AZURE_OPENAI_MODEL=<your-model-deployment-name>
    ```

1. Create an empty file named `main.py` to hold the code for your app.

### Create the environment and install dependencies

1. Open a terminal in your new folder and create a Python virtual environment for the app:

    ```bash
    python -m venv venv
    ```

1. Activate the virtual environment:

    ```bash
    venv\Scripts\activate
    ```

1. Install the dependencies from `requirements.txt`:

   ```bash
   pip install -r requirements.txt
   ```

### Add the app code

Update the contents of `Main.py` with the following code:

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
import json, os, logging, asyncio
from dotenv import load_dotenv

# Setup logging and load environment variables
logger = logging.getLogger(__name__)
load_dotenv()

# Azure OpenAI configuration
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_MODEL = os.getenv("AZURE_OPENAI_MODEL", "gpt-4o")

# Initialize Azure credentials
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

async def run():
    # Initialize Azure OpenAI client
    client = AzureOpenAI(
            azure_endpoint=AZURE_OPENAI_ENDPOINT, 
            api_version="2024-04-01-preview", 
            azure_ad_token_provider=token_provider
        )

    # MCP client configurations
    server_params = StdioServerParameters(
        command="npx",
        args=["-y", "@azure/mcp@latest", "server", "start"],
        env=None
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # List available tools
            tools = await session.list_tools()
            for tool in tools.tools: print(tool.name)

            # Format tools for Azure OpenAI
            available_tools = [{
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,
                    "parameters": tool.inputSchema
                }
            } for tool in tools.tools]

            # Start conversational loop
            messages = []
            while True:
                try:
                    user_input = input("\nPrompt: ")
                    messages.append({"role": "user", "content": user_input})

                    # First API call with tool configuration
                    response = client.chat.completions.create(
                        model = AZURE_OPENAI_MODEL,
                        messages = messages,
                        tools = available_tools)

                    # Process the model's response
                    response_message = response.choices[0].message
                    messages.append(response_message)

                    # Handle function calls
                    if response_message.tool_calls:
                        for tool_call in response_message.tool_calls:
                                function_args = json.loads(tool_call.function.arguments)
                                result = await session.call_tool(tool_call.function.name, function_args)

                                # Add the tool response to the messages
                                messages.append({
                                    "tool_call_id": tool_call.id,
                                    "role": "tool",
                                    "name": tool_call.function.name,
                                    "content": result.content,
                                })
                    else:
                        logger.info("No tool calls were made by the model")

                    # Get the final response from the model
                    final_response = client.chat.completions.create(
                        model = AZURE_OPENAI_MODEL,
                        messages = messages,
                        tools = available_tools)

                    for item in final_response.choices:
                        print(item.message.content)
                except Exception as e:
                    logger.error(f"Error in conversation loop: {e}")
                    print(f"An error occurred: {e}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(run())
```

The preceding code accomplishes the following tasks:

- Sets up logging and loads environment variables from a `.env` file.
- Configures Azure OpenAI client using `azure-identity` and `openai` libraries.
- Initializes an MCP client to interact with the Azure MCP Server using a standard I/O transport.
- Retrieves and displays a list of available tools from the MCP server.
- Implements a conversational loop to process user prompts, utilize tools, and handle tool calls.

## Run and test the app

Complete the following steps to test your .NET host app:

1. In a terminal window open to the root of your project, run the following command to start the app:

   ```bash
   python main.py
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
