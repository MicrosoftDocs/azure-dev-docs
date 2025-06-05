---
title: "Use reasoning model inferencing with the OpenAI SDK for Python"
description: "Learn how to use inferencing with models like DeepSeek in Azure OpenAI using the OpenAI SDK for Python."
ms.date: 06/05/2025
ms.topic: how-to 
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As an AI app developer, I want to learn how to use inferencing with models like DeepSeek in Azure OpenAI using the OpenAI SDK for Python.
---
# Use reasoning model inferencing with the OpenAI SDK for Python

This article shows you how to use inferencing with reasoning models like DeepSeek in Azure OpenAI using the OpenAI SDK for Python. The article provides a simple chat app that uses the DeepSeek-R1 reasoning model to generate responses to user messages.

This article demonstrates several best practices for integrating reasoning models:

- **Keyless authentication**: Using managed identities or developer credentials instead of API keys
- **Asynchronous operations**: Using async capabilities for better performance
- **Streaming responses**: Providing immediate feedback to users
- **Reasoning separation**: Distinguishing between reasoning steps and final output
- **Proper resource management**: Cleaning up resources after use

## The Reasoning Model Inferencing Building Block

Explore the [Reasoning Model Inference Building Block](https://aka.ms/mcp/aca), an example of using the OpenAI client library to call the DeepSeek-R1 model to generate responses to user messages.

## Architectural overview

A simple architecture of the chat app is shown in the following diagram:
:::image type="content" source="../media/use-reasoning-model-inference/simple-architecture-diagram.png" lightbox="../media/use-reasoning-model-inference/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

The chat app is running as an Azure Container App. The app uses managed identity via Microsoft Entra ID to authenticate with Azure OpenAI, instead of an API key. The chat app uses Azure OpenAI to generate responses to user messages.

The application architecture relies on the following services and components:

- A Python [Quart](https://quart.palletsprojects.com/en/latest/) that uses the [openai client library](https://pypi.org/project/openai/) package to generate responses to user messages.
- A basic HTML/JS frontend that streams responses from the backend using [JSON Lines](http://jsonlines.org/) over a [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream).
- [Bicep files](/azure/azure-resource-manager/bicep/) for provisioning Azure resources, including Azure AI Services, Azure Container Apps, Azure Container Registry, Azure Log Analytics, and RBAC roles.

## Cost

To keep costs low, this sample uses basic or consumption pricing tiers for most resources. Adjust the tier based on your needs. Delete the resources when you're done to avoid charges.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/deepseek-python#costs).

## Prerequisites

A [development container](https://containers.dev/) includes all the dependencies needed for this article. You can run it in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To follow this article, make sure you meet the prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [Role Based Access Control Administrator](/azure/role-based-access-control/built-in-roles#role-based-access-control-administrator-preview), [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator), or [Owner](/azure/role-based-access-control/built-in-roles#owner). If you don't have subscription-level permissions, you must be granted [RBAC](/azure/role-based-access-control/built-in-roles#role-based-access-control-administrator-preview) for an existing resource group and deploy to that group.

  - Your Azure account also needs `Microsoft.Resources/deployments/write` permissions on the subscription level.

- GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- [Azure Developer CLI](/azure/developer/azure-developer-cli)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running

- [Visual Studio Code](https://code.visualstudio.com/)

- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Use these instructions to set up a preconfigured development environment with all the required dependencies for this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the interface. Use GitHub Codespaces for the simplest setup, as it comes with the necessary tools and dependencies preinstalled for this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Use the following steps to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/deepseek-python`](https://github.com/Azure-Samples/deepseek-python) GitHub repository.

1. Right-click on the following button, and select _Open link in new window_. This action allows you to have the development environment and the documentation available for review.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/deepseek-python)

1. On the **Create codespace** page, review and then select **Create new codespace**

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Sign in to Azure with the Azure Developer CLI in the terminal at the bottom of the screen.

    ```azdeveloper
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code needs [Docker](https://docs.docker.com/) installed on your computer. The extension uses Docker to host the development container locally with the necessary tools and dependencies preinstalled for this article.

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-chat-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-chat-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.
1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
     azd init -t deepseek-python
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository has all the code and configuration files needed to deploy the chat app to Azure. Follow these steps to deploy the chat app to Azure.

### Deploy chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section start costing money immediately. These resources might still incur costs even if you stop the command before it finishes.

1. Run the following Azure Developer CLI command for Azure resource provisioning and source code deployment:

    ```azdeveloper
    azd up
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `chat-app`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the DeepSeek model|Select a location near you from the list. If the same location is available as your first location, select that.|

1. Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

### Use chat app to ask questions to the Large Language Model

1. The terminal displays a URL after successful application deployment.

1. Select that URL labeled `Deploying service web` to open the chat application in a browser.

    :::image type="content" source="../media/use-reasoning-model-inference/screenshot-chat-image.png" lightbox="../media/use-reasoning-model-inference/screenshot-chat-image.png" alt-text="Screenshot of chat app in browser with a question in the chat text box along with the response.":::

1. In the browser, ask a question about the uploaded image such as "Who painted the Mona Lisa?".

1. The answer comes from Azure OpenAI via model inference and the result is displayed.

## Exploring the sample code

 While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), small code changes are needed when using Azure OpenAI endpoints. This sample uses a DeepSeek-R1 reasoning model to generate responses to user messages in a simple chat app.

### Setup and authentication

The `src\quartapp\chat.py` file starts with setup and configuring keyless authentication.

#### Infrastructure setup

The script uses **Quart**, an asynchronous web framework, to create a `Blueprint` named `chat`. This `Blueprint` defines the app's routes and manages its lifecycle hooks.

```python
bp = Blueprint("chat", __name__, template_folder="templates", static_folder="static")
```

The `Blueprint` defines the routes (`/` and `/chat/stream`) and lifecycle hooks (`@bp.before_app_serving` and `@bp.after_app_serving`) for the app.

#### Initialization with keyless authentication

The following code snippet handles authentication.

> [!NOTE]
> The `@bp.before_app_serving` hook initializes the OpenAI client and handles **authentication**. This approach is critical for securely accessing Azure-hosted DeepSeek-R1 models.

The authentication strategy adapts to the environment:

- **In production**: Uses **Managed Identity Credential** with an Azure client ID to avoid storing sensitive keys. This method is secure and scalable for cloud-native apps.
- **In development**: Uses **Azure Developer CLI Credential** with an Azure tenant ID to simplify local testing by using the developer's Azure CLI sign in session.

```python
@bp.before_app_serving
async def configure_openai():
    if os.getenv("RUNNING_IN_PRODUCTION"):
        client_id = os.environ["AZURE_CLIENT_ID"]
        bp.azure_credential = ManagedIdentityCredential(client_id=client_id)
    else:
        tenant_id = os.environ["AZURE_TENANT_ID"]
        bp.azure_credential = AzureDeveloperCliCredential(tenant_id=tenant_id)
```

This keyless authentication approach provides:

- **Better security**: No API keys stored in code or environment variables.
- **Easier management**: No need to rotate keys or manage secrets.
- **Smooth transitions**: The same code works in both development and production.

#### Token provider setup

In the following code snippet, the token provider creates a bearer token to authenticate requests to Azure OpenAI services. It automatically generates and refreshes these tokens using the configured credential.

  ```python
  bp.openai_token_provider = get_bearer_token_provider(
      bp.azure_credential, "https://cognitiveservices.azure.com/.default"
  )
  ```

#### Azure OpenAI client configuration

The following code snippet uses the `AsyncAzureOpenAI` client for better performance:

```python
    bp.openai_client = AsyncAzureOpenAI(
        azure_endpoint=os.environ["AZURE_INFERENCE_ENDPOINT"],
        azure_ad_token_provider=openai_token_provider,
        api_version="2025-04-01-preview",  # temporary
    )

```

- **base_url**: Points to the Azure-hosted DeepSeek inference endpoint
- **api_key**: Uses a dynamically generated API key from the token provider.
- **api-version**: Specifies the API version supporting DeepSeek models

#### Model deployment name configuration

The following code snippet sets the DeepSeek model version by getting the deployment name from your environment configuration. It assigns the name to the `bp.openai_model` variable, making it accessible throughout the app. This approach lets you change the model deployment without updating the code.

```python
bp.openai_model = os.getenv("AZURE_DEEPSEEK_DEPLOYMENT")
```

> [!NOTE]
> In Azure OpenAI, you don't directly use model names like `gpt-4o` or `deepseek-r1`. Instead, you create **deployments**, which are named instances of models in your Azure OpenAI resource. This approach offers the following benefits:
> - **Abstraction**: Keeps deployment names out of the code by using environment variables.
> - **Flexibility**: Lets you switch between different DeepSeek deployments without changing the code.
> - **Environment-specific configuration**: Allows using different deployments for development, testing, and production.
> - **Resource management**: Each Azure deployment has its own quota, throttling, and monitoring.

### Lifecycle management

The following code snippet prevents resource leaks by closing the asynchronous Azure OpenAI client when the application shuts down. The `@bp.after_app_serving` hook ensures proper cleanup of resources.

```python
@bp.after_app_serving
async def shutdown_openai():
    await bp.openai_client.close()
```

### Chat handler streaming function

The `chat_handler()` function manages user interactions with the `DeepSeek-R1` model through the `chat/stream` route. It streams responses back to the client in real-time and processes them. The function extracts messages from the JSON payload.

#### Streaming implementation

1. The `response_stream` function starts by accepting messages from the client.

   - request_messages: The route expects a JSON payload containing user messages.

   ```python
   @bp.post("/chat/stream")
   async def chat_handler():
      request_messages = (await request.get_json())["messages"]
   ```

1. Next, the function streams responses from the OpenAI API. It combines system messages like "You are a helpful assistant" with user-provided messages.

      ```python
      @stream_with_context
      async def response_stream():
          all_messages = [
              {"role": "system", "content": "You are a helpful assistant."},
          ] + request_messages
      ```


1. Next, the function creates a streaming chat completion request.

    The `chat.completions.create` method sends the messages to the `DeepSeek-R1` model. The `stream=True` parameter enables real-time response streaming.

    ```python
      chat_coroutine = bp.openai_client.chat.completions.create(
          model=bp.openai_model,
          messages=all_messages,
          stream=True,
      )
    ```

1. The following code snippet processes streaming responses from the `DeepSeek-R1` model and handles errors. It iterates through updates, checks for valid choices, and sends each response chunk as JSON Lines. If an error occurs, it logs the error and sends a JSON error message to the client while continuing the stream.

    ```python
    try:
        async for update in await chat_coroutine:
            if update.choices:
                yield update.choices[0].model_dump_json() + "\n"
        except Exception as e:
            current_app.logger.error(e)
            yield json.dumps({"error": str(e)}, ensure_ascii=False) + "\n"
    
    return Response(response_stream())
    ```

### Reasoning content handling

The backend script in `chat.py` separates reasoning content from response content, while the `submit` event handler in `index.html` processes the streaming response on the frontend. This approach allows developers to access and display the model's reasoning steps alongside the final output.

The frontend code uses a `ReadableStream` to process streaming responses from the backend. It separates reasoning content from regular content, displaying reasoning in an expandable section and the final answer in the main chat area.

#### Step-by-Step Breakdown

1. Initiate streaming request

   This code snippet creates a connection between the JavaScript frontend and the Python backend, enabling DeepSeek-R1's Azure OpenAI integration with keyless authentication.

    ```javascript
    const response = await fetch("/chat/stream", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({messages: messages})
    });
    ```

1. Initialize variables

   The following code snippet initializes variables to store the answer and thoughts separately. This separation helps handle reasoning content effectively.

   ```javascript
   let answer = "";
   let thoughts = "";    
   ```

1. Process each update
   The following code snippet asynchronously iterates through chunks of the model's response.

   ```javascript
   for await (const event of readNDJSONStream(response.body)) {
   ```

1. Detect and route content type

   The script checks if the event contains a `delta` field. If it does, it processes the content based on whether it's reasoning content or regular content.

   ```javascript
   if (!event.delta) {
        continue;
   }
   if (event.delta.reasoning_content) {
        thoughts += event.delta.reasoning_content;
        if (thoughts.trim().length > 0) {
            // Only show thoughts if they are more than just whitespace
            messageDiv.querySelector(".loading-bar").style.display = "none";
            messageDiv.querySelector(".thoughts").style.display = "block";
            messageDiv.querySelector(".thoughts-content").innerHTML = converter.makeHtml(thoughts);
        }
    } else if (event.delta.content) {
        messageDiv.querySelector(".loading-bar").style.display = "none";
        answer += event.delta.content;
        messageDiv.querySelector(".answer-content").innerHTML = converter.makeHtml(answer);
    }
   ```

   - If the content type is `reasoning_content`, the content is added to `thoughts` and displayed in the `.thoughts-content` section.
   - If the content type is `content`, the content is added to `answer` and displayed in the `.answer-content` section.
   - The `.loading-bar` is hidden once content starts streaming, and the `.thoughts` section is displayed if there are any thoughts.

    Unlike traditional language models that only provide final outputs, reasoning models like `DeepSeek-R1` show their intermediate reasoning steps. These steps make them useful for:

    - Solving complex problems
    - Performing mathematical calculations
    - Handling multi-step logical reasoning
    - Making transparent decisions
  
1. Error handling:
   Errors are logged in the backend and returned to the client in JSON format.

    ```python
    except Exception as e:
        current_app.logger.error(e)
        yield json.dumps({"error": str(e)}, ensure_ascii=False) + "\n"
    ```
  
    This frontend code snippet displays the error message in the chat interface.

    ```javascript
    messageDiv.scrollIntoView();
    if (event.error) {
        messageDiv.innerHTML = "Error: " + event.error;
    }
    ```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment helps you maximize the free per-core hours available for your account.

> [!IMPORTANT]
> For more information about your GitHub account's free storage and core hours, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Find your active Codespaces created from the [`Azure-Samples//deepseek-python`](https://github.com/Azure-Samples/deepseek-python) GitHub repository.

1. Open the context menu for the codespace and select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

Stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. You can delete the container instance, image, and volumes from Docker to free up space on your local machine.
---

## Get help

Log your issue to the repository's [Issues](https://github.com/Azure-Samples/deepseek-python/issues).

## Next steps

> [!div class="nextstepaction"]
> [Get started with DeepSeek-R1 reasoning model in Azure AI model inference](/azure/ai-foundry/model-inference/tutorials/get-started-deepseek-r1?tabs=python)