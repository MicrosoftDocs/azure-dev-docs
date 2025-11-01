---
title: "Get started with multimodal chat apps using Azure OpenAI"
description: "Learn how to effectively use Azure OpenAI multimodal models to generate responses to user messages and uploaded images. Easily deploy with Azure Developer CLI."
ms.date: 10/31/2025
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
ms.collection: ce-skilling-ai-copilot
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
# CustomerIntent: As a developer new to Azure OpenAI, I want to learn how to use Azure OpenAI multimodal models to add uploaded images to the chat stream from a simple example.
---
# Get started with multimodal vision chat apps using Azure OpenAI

This article shows you how to use Azure OpenAI multimodal models to generate responses to user messages and uploaded images in a chat app. This chat app sample also includes all the infrastructure and configuration needed to provision Azure OpenAI resources and deploy the app to Azure Container Apps using the Azure Developer CLI.

By following the instructions in this article, you will:

- Deploy an Azure Container chat app that uses managed identity for authentication.
- Upload images to be used as part of the chat stream.
- Chat with an Azure OpenAI multimodal Large Language Model (LLM) using the OpenAI library.

Once you complete this article, you can start modifying the new project with your custom code.

> [!NOTE]
> This article uses one or more [AI app templates](./intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Architectural overview

A simple architecture of the chat app is shown in the following diagram:
:::image type="content" source="./media/get-started-app-chat-vision/simple-architecture-diagram.png" lightbox="./media/get-started-securing-your-ai-app/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

The chat app is running as an Azure Container App. The app uses managed identity via Microsoft Entra ID to authenticate with Azure OpenAI in production, instead of an API key. During development, the app supports multiple authentication methods including Azure Developer CLI credentials, API keys, and GitHub models for testing without Azure resources.

The application architecture relies on the following services and components:

- [Azure OpenAI](/azure/ai-services/openai/) represents the AI provider that we send the user's queries to.
- [Azure Container Apps](/azure/container-apps/) is the container environment where the application is hosted.
- [Managed Identity](/entra/identity/managed-identities-azure-resources/) helps us ensure best-in-class security and eliminates the requirement for you as a developer to securely manage a secret.
- [Bicep files](/azure/azure-resource-manager/bicep/) for provisioning Azure resources, including Azure OpenAI, Azure Container Apps, Azure Container Registry, Azure Log Analytics, and role-based access control (RBAC) roles.
- [Microsoft AI Chat Protocol](https://github.com/microsoft/ai-chat-protocol/) provides standardized API contracts across AI solutions and languages. The chat app conforms to the Microsoft AI Chat Protocol.
- A Python [Quart](https://quart.palletsprojects.com) that uses the [`openai`](https://pypi.org/project/openai/) package to generate responses to user messages with uploaded image files.
- A basic HTML/JavaScript frontend that streams responses from the backend using [JSON Lines](http://jsonlines.org/) over a [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream).

## Cost

In an attempt to keep pricing as low as possible in this sample, most resources use a basic or consumption pricing tier. Alter your tier level as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/openai-chat-vision-quickstart#costs).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need to fulfill the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- GitHub account

#### [Visual Studio Code](#tab/visual-studio-code)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- [Azure Developer CLI](/azure/developer/azure-developer-cli)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - start Docker Desktop if it's not already running

- [Visual Studio Code](https://code.visualstudio.com/)

- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

---

## Open development environment

Use the following instructions to deploy a preconfigured development environment containing all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Use the following steps to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/openai-chat-vision-quickstart`](https://github.com/Azure-Samples/openai-chat-vision-quickstart) GitHub repository.

1. Right-click on the following button, and select _Open link in new window_. This action allows you to have the development environment and the documentation available for review.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/openai-chat-vision-quickstart)

1. On the **Create codespace** page, review and then select **Create new codespace**

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Sign in to Azure with the Azure Developer CLI in the terminal at the bottom of the screen.

    ```azdeveloper
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-chat-vision-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-chat-vision-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.
1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t openai-chat-vision-quickstart
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.

---

## Deploy and run

The sample repository contains all the code and configuration files for the chat app Azure deployment. The following steps walk you through the sample chat app Azure deployment process.

### Deploy chat app to Azure

> [!IMPORTANT]
> To keep costs low, this sample uses basic or consumption pricing tiers for most resources. Adjust the tier as needed, and delete resources when you're done to avoid charges.

1. Run the following Azure Developer CLI command for Azure resource provisioning and source code deployment:

    ```azdeveloper
    azd up
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `chat-vision`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the Azure OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

1. Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

### Use chat app to ask questions to the Large Language Model

1. The terminal displays a URL after successful application deployment.

1. Select that URL labeled `Deploying service web` to open the chat application in a browser.

    :::image type="content" source="./media/get-started-app-chat-vision/chat-speech.png" lightbox="./media/get-started-app-chat-vision/chat-speech.png" alt-text="Screenshot showing an uploaded image, a question about the image, the AI's response, and the text box.":::

1. In the browser, upload an image by clicking on **Choose File** and selecting an image.
1. Ask a question about the uploaded image such as "What is the image about?".

1. The answer comes from Azure OpenAI and the result is displayed.

## Exploring the sample code

 While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), small code changes are needed when using Azure OpenAI endpoints. This sample uses an Azure OpenAI multimodal model to generate responses to user messages and uploaded images.

### Base64 Encoding the uploaded image in the frontend

The uploaded image needs to be Base64 encoded so that it can be used directly as a Data URI as part of the message.

In the sample, the following frontend code snippet in the `script`tag of the `src/quartapp/templates/index.html` file handles that functionality. The `toBase64` arrow function uses the `readAsDataURL` method of the`FileReader` to asynchronously read in the uploaded image file as a base64 encoded string.  

```javascript
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
```

The `toBase64` function is called by a listener on the form's `submit` event.

The `submit` event listener handles the complete chat interaction flow. When the user submits a message, the following flow occurs:

1. Hides the "no-messages-heading" element to show the conversation started
1. Gets and Base64 encodes the uploaded image file (if present)
1. Creates and displays the user's message in the chat, including the uploaded image
1. Prepares an assistant message container with a "Typing..." indicator
1. Adds the user's message to the message history array
1. Calls the AI Chat Protocol Client's `getStreamedCompletion()` method with the message history and context (including the Base64 encoded image and filename)
1. Processes the streamed response chunks and converts Markdown to HTML using Showdown.js
1. Handles any errors during streaming
1. Adds a speech output button after receiving the complete response so users can hear the response
1. Clears the input field and returns focus for the next message

```javascript
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    // Hide the no-messages-heading when a message is added
    document.getElementById("no-messages-heading").style.display = "none";

    const file = document.getElementById("file").files[0];
    const fileData = file ? await toBase64(file) : null;

    const message = messageInput.value;

    const userTemplateClone = userTemplate.content.cloneNode(true);
    userTemplateClone.querySelector(".message-content").innerText = message;
    if (file) {
        const img = document.createElement("img");
        img.src = fileData;
        userTemplateClone.querySelector(".message-file").appendChild(img);
    }
    targetContainer.appendChild(userTemplateClone);

    const assistantTemplateClone = assistantTemplate.content.cloneNode(true);
    let messageDiv = assistantTemplateClone.querySelector(".message-content");
    targetContainer.appendChild(assistantTemplateClone);

    messages.push({
        "role": "user",
        "content": message
    });

    try {
        messageDiv.scrollIntoView();
        const result = await client.getStreamedCompletion(messages, {
            context: {
                file: fileData,
                file_name: file ? file.name : null
            }
        });

        let answer = "";
        for await (const response of result) {
            if (!response.delta) {
                continue;
            }
            if (response.delta.content) {
                // Clear out the DIV if its the first answer chunk we've received
                if (answer == "") {
                    messageDiv.innerHTML = "";
                }
                answer += response.delta.content;
                messageDiv.innerHTML = converter.makeHtml(answer);
                messageDiv.scrollIntoView();
            }
            if (response.error) {
                messageDiv.innerHTML = "Error: " + response.error;
            }
        }
        messages.push({
            "role": "assistant",
            "content": answer
        });

        messageInput.value = "";

        const speechOutput = document.createElement("speech-output-button");
        speechOutput.setAttribute("text", answer);
        messageDiv.appendChild(speechOutput);
        messageInput.focus();
    } catch (error) {
        messageDiv.innerHTML = "Error: " + error;
    }
});
```

### Handling the image with the backend

In the `src\quartapp\chat.py` file, the backend code for image handling starts after configuring keyless authentication.

> [!NOTE]
> For more information on how to use keyless connections for authentication and authorization to Azure OpenAI, check out the [Get started with the Azure OpenAI security building block](get-started-securing-your-ai-app.md) Microsoft Learn article.

#### Authentication configuration

The `configure_openai()` function sets up the OpenAI client before the app starts serving requests. It uses Quart's `@bp.before_app_serving` decorator to configure authentication based on environment variables. This flexible system lets developers work in different contexts without changing code:
##### Authentication modes explained
- **Local development** (`OPENAI_HOST=local`): Connects to a local OpenAI-compatible API service (like Ollama or LocalAI) without authentication. Use this mode for testing without internet or API costs.
- **GitHub Models** (`OPENAI_HOST=github`): Uses GitHub's AI model marketplace with a `GITHUB_TOKEN` for authentication. When using GitHub models, prefix the model name with `openai/` (for example, `openai/gpt-4o`). This mode lets developers try models before provisioning Azure resources.
- **Azure OpenAI with API key** (`AZURE_OPENAI_KEY_FOR_CHATVISION` environment variable): Uses an API key for authentication. Avoid this mode in production because API keys require manual rotation and pose security risks if exposed. Use it for local testing inside a Docker container without Azure CLI credentials.
- **Production with Managed Identity** (`RUNNING_IN_PRODUCTION=true`): Uses `ManagedIdentityCredential` to authenticate with Azure OpenAI through the container app's managed identity. This method is recommended for production because it removes the need to manage secrets. Azure Container Apps automatically provide the managed identity and grant permissions during deployment via Bicep.
- **Development with Azure CLI** (default mode): Uses `AzureDeveloperCliCredential` to authenticate with Azure OpenAI using locally signed-in Azure CLI credentials. This mode simplifies local development without managing API keys.

##### Key implementation details

- The `get_bearer_token_provider()` function refreshes Azure credentials and uses them as bearer tokens.
- The Azure OpenAI endpoint path includes `/openai/v1/` to match the OpenAI client library's requirements.
- Logging shows which authentication mode is active.
- The function is async to support Azure credential operations.

Here's the complete authentication setup code from `chat.py`:

```python
@bp.before_app_serving
async def configure_openai():
    bp.model_name = os.getenv("OPENAI_MODEL", "gpt-4o")
    openai_host = os.getenv("OPENAI_HOST", "github")

    if openai_host == "local":
        bp.openai_client = AsyncOpenAI(api_key="no-key-required", base_url=os.getenv("LOCAL_OPENAI_ENDPOINT"))
        current_app.logger.info("Using local OpenAI-compatible API service with no key")
    elif openai_host == "github":
        bp.model_name = f"openai/{bp.model_name}"
        bp.openai_client = AsyncOpenAI(
            api_key=os.environ["GITHUB_TOKEN"],
            base_url="https://models.github.ai/inference",
        )
        current_app.logger.info("Using GitHub models with GITHUB_TOKEN as key")
    elif os.getenv("AZURE_OPENAI_KEY_FOR_CHATVISION"):
        bp.openai_client = AsyncOpenAI(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.getenv("AZURE_OPENAI_KEY_FOR_CHATVISION"),
        )
        current_app.logger.info("Using Azure OpenAI with key")
    elif os.getenv("RUNNING_IN_PRODUCTION"):
        client_id = os.environ["AZURE_CLIENT_ID"]
        azure_credential = ManagedIdentityCredential(client_id=client_id)
        token_provider = get_bearer_token_provider(azure_credential, "https://cognitiveservices.azure.com/.default")
        bp.openai_client = AsyncOpenAI(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"] + "/openai/v1/",
            api_key=token_provider,
        )
        current_app.logger.info("Using Azure OpenAI with managed identity credential for client ID %s", client_id)
    else:
        tenant_id = os.environ["AZURE_TENANT_ID"]
        azure_credential = AzureDeveloperCliCredential(tenant_id=tenant_id)
        token_provider = get_bearer_token_provider(azure_credential, "https://cognitiveservices.azure.com/.default")
        bp.openai_client = AsyncOpenAI(
            base_url=os.environ["AZURE_OPENAI_ENDPOINT"] + "/openai/v1/",
            api_key=token_provider,
        )
        current_app.logger.info("Using Azure OpenAI with az CLI credential for tenant ID: %s", tenant_id)
```

#### Chat handler function

The `chat_handler()` function processes chat requests sent to the `/chat/stream` endpoint. It receives a POST request with a JSON payload that follows the Microsoft AI Chat Protocol.

The JSON payload includes:
- **messages**: A list of conversation history. Each message has a `role` ("user" or "assistant") and `content` (the message text).
- **context**: Extra data for processing, including:
  - **file**: Base64-encoded image data (for example, `data:image/png;base64,...`).
  - **file_name**: The uploaded image's original filename (useful for logging or identifying the image type).
- **temperature** (optional): A float that controls response randomness (default is 0.5).

The handler extracts the message history and image data. If no image is uploaded, the image value is `null`, and the code handles this case.

```python
@bp.post("/chat/stream")
async def chat_handler():
    request_json = await request.get_json()
    request_messages = request_json["messages"]
    # Get the base64 encoded image from the request context
    # This will be None if no image was uploaded
    image = request_json["context"]["file"]
    # The context also includes the filename for reference
    # file_name = request_json["context"]["file_name"]
```

### Building the message array for vision requests

The `response_stream()` function prepares the message array that is sent to the Azure OpenAI API. The `@stream_with_context` decorator keeps the request context while streaming the response.

#### Message preparation logic

1. **Start with conversation history**: The function begins with `all_messages`, which includes a system message and all previous messages except the most recent one (`request_messages[0:-1]`).
1. **Handle the current user message based on image presence**:
   - **With image**: Format the user's message as a multi-part content array with text and image_url objects. The `image_url` object contains the Base64-encoded image data and a `detail` parameter.
   - **Without image**: Append the user's message as plain text.
1. **The `detail` parameter**: Set to "auto" to let the model choose between "low" and "high" detail based on the image size. Low detail is faster and cheaper, while high detail provides more accurate analysis for complex images.

```python
    @stream_with_context
    async def response_stream():
        # This sends all messages, so API request may exceed token limits
        all_messages = [
            {"role": "system", "content": "You are a helpful assistant."},
        ] + request_messages[0:-1]
        all_messages = request_messages[0:-1]
        if image:
            user_content = []
            user_content.append({"text": request_messages[-1]["content"], "type": "text"})
            user_content.append({"image_url": {"url": image, "detail": "auto"}, "type": "image_url"})
            all_messages.append({"role": "user", "content": user_content})
        else:
            all_messages.append(request_messages[-1])
```

> [!NOTE]
> For more information on the image `detail` parameter and related settings, check out the [Detail parameter settings](/azure/ai-foundry/openai/how-to/gpt-with-vision?tabs=python#detail-parameter-settings) section in the "Use vision-enabled chat models" Microsoft Learn article.

Next, `bp.openai_client.chat.completions` gets chat completions via an Azure OpenAI API call and streams the response.

```python
        chat_coroutine = bp.openai_client.chat.completions.create(
            # Azure OpenAI takes the deployment name as the model name
            model=bp.model_name,
            messages=all_messages,
            stream=True,
            temperature=request_json.get("temperature", 0.5),
        )
```

Finally, the response is streamed back to the client, with error handling for any exceptions.

```python
        try:
            async for event in await chat_coroutine:
                event_dict = event.model_dump()
                if event_dict["choices"]:
                    yield json.dumps(event_dict["choices"][0], ensure_ascii=False) + "\n"
        except Exception as e:
            current_app.logger.error(e)
            yield json.dumps({"error": str(e)}, ensure_ascii=False) + "\n"

    return Response(response_stream())
```

#### Frontend libraries and features

The frontend uses modern browser APIs and libraries to create an interactive chat experience. Developers can customize the interface or add features by understanding these components:

1. **Speech Input/Output**: Custom web components use the browser's Speech APIs:

   - **`<speech-input-button>`**: Converts speech to text using the Web Speech API's `SpeechRecognition`. It provides a microphone button that listens for voice input and emits a `speech-input-result` event with the transcribed text.
   
   - **`<speech-output-button>`**: Reads text aloud using the `SpeechSynthesis` API. It appears after each assistant response with a speaker icon, letting users hear the response.

   **Why use browser APIs instead of Azure Speech Services?**
   - No cost - runs entirely in the browser
   - Instant response - no network latency
   - Privacy - voice data stays on the user's device
   - No need for extra Azure resources

   These components are in `src/quartapp/static/speech-input.js` and `speech-output.js`.

1. **Image Preview**: Displays the uploaded image in the chat before analysis submission for confirmation. The preview updates automatically when a file is selected.

   ```javascript
   fileInput.addEventListener("change", async function() {
       const file = fileInput.files[0];
       if (file) {
           const fileData = await toBase64(file);
           imagePreview.src = fileData;
           imagePreview.style.display = "block";
       }
   });
   ```

1. **Bootstrap 5 and Bootstrap Icons**: Provides responsive UI components and icons. The app uses the Cosmo theme from Bootswatch for a modern look.

1. **Template-based Message Rendering**: Uses HTML `<template>` elements for reusable message layouts, ensuring consistent styling and structure.

## Other sample resources to explore

In addition to the chat app sample, there are other resources in the repo to explore for further learning. Check out the following notebooks in the `notebooks` directory:

|Notebook|Description|
|--|--|
|chat_pdf_images.ipynb|This notebook demonstrates how to convert PDF pages to images and send them to a vision model for inference.|
|chat_vision.ipynb|This notebook is provided for manual experimentation with the vision model used in the app.|

**Localized Content**: Spanish versions of the notebooks are in the `notebooks/Spanish/` directory, offering the same hands-on learning for Spanish-speaking developers. Both English and Spanish notebooks show:
- How to call vision models directly for experimentation
- How to convert PDF pages to images for analysis
- How to adjust parameters and test prompts

## Clean up resources

### Clean up Azure resources

The Azure resources created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

To delete the Azure resources and remove the source code, run the following Azure Developer CLI command:

```azdeveloper
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment ensures that you can maximize the amount of free per-core hours entitlement you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples//openai-chat-vision-quickstart`](https://github.com/Azure-Samples/openai-chat-vision-quickstart) GitHub repository.

1. Open the context menu for the codespace and select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

Stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="./media/get-started-app-chat-vision/reopen-local-command-palette.png" lightbox="./media/get-started-app-chat-vision/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code stops the running development container, but the container still exists in Docker in a stopped state. Free up space on your local machine by deleting the container instance, image, and volumes from Docker.

---

## Get help

Log your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-chat-vision-quickstart/issues).

## Next steps

> [!div class="nextstepaction"]
> [Get started with the chat using your own data sample for Python](../python/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
