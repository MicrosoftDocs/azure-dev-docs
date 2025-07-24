---
title: "Get started with the Azure OpenAI security building blocks"
description: "Learn how to effectively use keyless connections for authentication and authorization to Azure OpenAI with the Azure OpenAI security building blocks. Get started using a simple chat app sample implemented using Azure OpenAI Service using keyless authentication with Microsoft Entra ID. Easily deploy with Azure Developer CLI. This article uses the Azure AI Template chat quickstart sample."
ms.date: 05/28/2025
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, keyless-python, devx-track-js, devx-track-dotnet
ms.collection: ce-skilling-ai-copilot
zone_pivot_group_filename: developer/intro/intro-zone-pivot-groups.yml
zone_pivot_groups: intelligent-apps-languages-python-dotnet-typescript
# CustomerIntent: As a developer new to Azure OpenAI, I want to learn how to use keyless connections to Azure OpenAI from a simple example so that I don't leak secrets.
---
# Get started with the Azure OpenAI security building block

This article shows you how to create and use the Azure OpenAI security building block sample. The purpose is to demonstrate Azure OpenAI account provisioning with role-based access control (RBAC) for keyless (Microsoft Entra ID) authentication to Azure OpenAI. This chat app sample also includes all the infrastructure and configuration needed to provision Azure OpenAI resources and deploy the app to Azure Container Apps using the Azure Developer CLI.

By following the instructions in this article, you will:

- Deploy a secure Azure Container chat app.
- Use managed identity for Azure OpenAI access.
- Chat with an Azure OpenAI Large Language Model (LLM) using the OpenAI library.

Once you complete this article, you can start modifying the new project with your custom code and data.

> [!NOTE]
> This article uses one or more [AI app templates](./intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained, easy to deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

## Architectural overview

A simple architecture of the chat app is shown in the following diagram:
:::image type="content" source="./media/get-started-securing-your-ai-app/simple-architecture-diagram.png" lightbox="./media/get-started-securing-your-ai-app/simple-architecture-diagram.png" alt-text="Diagram showing architecture from client to backend app.":::

The chat app runs as an Azure Container App. The app uses managed identity via Microsoft Entra ID to authenticate with Azure OpenAI, instead of an API key. The chat app uses Azure OpenAI to generate responses to user messages.

The application architecture relies on the following services and components:

- [Azure OpenAI](/azure/ai-services/openai/) represents the AI provider that we send the user's queries to.
- [Azure Container Apps](/azure/container-apps/) is the container environment where the application is hosted.
- [Managed Identity](/entra/identity/managed-identities-azure-resources/) helps us ensure best-in-class security and eliminates the requirement for you as a developer to securely manage a secret.
- [Bicep files](/azure/azure-resource-manager/bicep/) for provisioning Azure resources, including Azure OpenAI, Azure Container Apps, Azure Container Registry, Azure Log Analytics, and RBAC roles.
:::zone pivot="python"
- [Microsoft AI Chat Protocol](https://github.com/microsoft/ai-chat-protocol/) provides standardized API contracts across AI solutions and languages. The chat app conforms to the Microsoft AI Chat Protocol, which allows the evaluations app to run against any chat app that conforms to the protocol.
- A Python [Quart](https://quart.palletsprojects.com/en/latest/) that uses the [`openai`](https://pypi.org/project/openai/) package to generate responses to user messages.
- A basic HTML/JavaScript frontend that streams responses from the backend using [JSON Lines](http://jsonlines.org/) over a [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream).

:::zone-end

:::zone pivot="dotnet"

- A Blazor web app that uses the [Azure.AI.OpenAI](https://www.nuget.org/packages/Azure.AI.OpenAI/) NuGet package to generate responses to user messages.

:::zone-end

:::zone pivot="typescript"
- A TypeScript web app that uses the [OpenAI](https://www.npmjs.com/package/openai) npm package to generate responses to user messages. 
:::zone-end

## Cost

In an attempt to keep pricing as low as possible in this sample, most resources use a basic or consumption pricing tier. Alter your tier level as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

:::zone pivot="python"

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/openai-chat-app-quickstart#costs).

:::zone-end

:::zone pivot="dotnet"

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/openai-chat-app-quickstart-dotnet#costs).

:::zone-end

:::zone pivot="typescript"

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/openai-chat-app-quickstart-javascript#costs).

:::zone-end

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally using Visual Studio Code.

To use this article, you need to fulfill the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true)

- Azure account permissions - Your Azure Account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

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

Use the following instructions to deploy a preconfigured development environment containing all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with 2 core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

:::zone pivot="python"

Use the following steps to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/openai-chat-app-quickstart`](https://github.com/Azure-Samples/openai-chat-app-quickstart) GitHub repository.

1. Right-click on the following button, and select _Open link in new window_. This action allows you to have the development environment and the documentation available for review.

1. On the **Create codespace** page, review and then select **Create new codespace**

    :::image type="content" source="./media/get-started-securing-your-ai-app/github-create-codespace-python.png" lightbox="./media/get-started-securing-your-ai-app/github-create-codespace-python.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Sign in to Azure with the Azure Developer CLI in the terminal at the bottom of the screen.

    ```azdeveloper
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

:::zone-end

:::zone pivot="dotnet"

Use the following steps to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/openai-chat-app-quickstart-dotnet`](https://github.com/Azure-Samples/openai-chat-app-quickstart-dotnet) GitHub repository.

1. Right-click on the following button, and select _Open link in new window_. This action allows you to have the development environment and the documentation available for review.

1. On the **Create codespace** page, review and then select **Create codespace**

    :::image type="content" source="./media/get-started-securing-your-ai-app/github-create-codespace-dotnet.png" lightbox="./media/get-started-securing-your-ai-app/github-create-codespace-dotnet.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

1. Wait for the codespace to start. This startup process can take a few minutes.

1. Sign in to Azure with the Azure Developer CLI in the terminal at the bottom of the screen.

    ```azdeveloper
    azd auth login
    ```

1. Copy the code from the terminal and then paste it into a browser. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

:::zone-end

:::zone pivot="typescript"

[!INCLUDE [typescript open development environment](../javascript/ai/includes/get-started-securing-your-ai-app/open-development-environment.md)]

:::zone-end

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

:::zone pivot="python"

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-secure-chat-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-secure-chat-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t openai-chat-app-quickstart
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.

:::zone-end

:::zone pivot="dotnet"

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-secure-chat-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-secure-chat-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t openai-chat-app-quickstart-dotnet
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.

:::zone-end

:::zone pivot="typescript"

[!INCLUDE [typescript visual studio setup](../javascript/ai/includes/get-started-securing-your-ai-app/visual-studio-code-setup.md)]

:::zone-end
---

## Deploy and run

The sample repository contains all the code and configuration files for chat app Azure deployment. The following steps walk you through the sample chat app Azure deployment process.

### Deploy chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs. These resources might accrue costs even if you interrupt the command before it's fully executed.

1. Run the following Azure Developer CLI command for Azure resource provisioning and source code deployment:

    ```azdeveloper
    azd up
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `secure-chat`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

1. Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

### Use chat app to ask questions to the Large Language Model

1. The terminal displays a URL after successful application deployment.

1. Select that URL labeled `Deploying service web` to open the chat application in a browser.

    :::image type="content" source="./media/get-started-securing-your-ai-app/browser-chat.png" lightbox="./media/get-started-securing-your-ai-app/browser-chat.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::

1. In the browser, enter a question such as "Why is managed identity better than keys?".

1. The answer comes from Azure OpenAI and the result is displayed.

:::zone pivot="python"

## Exploring the sample code

 While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), small code changes are needed when using Azure OpenAI endpoints. Let's see how this sample configures keyless authentication with Microsoft Entra ID and communicates with Azure OpenAI.

### Configure authentication with managed identity

In this sample, the `src\quartapp\chat.py` file begins with configuring keyless authentication.

The following snippet uses the [azure.identity.aio](/python/api/azure-identity/azure.identity.aio?view=azure-python&preserve-view=true) module to create an asynchronous Microsoft Entra authentication flow.

The following code snippet uses the `AZURE_CLIENT_ID` `azd` environment variable to create a [ManagedIdentityCredential](/python/api/azure-identity/azure.identity.aio.managedidentitycredential?view=azure-python&preserve-view=true) instance capable of authenticating via user-assigned managed identity.

```Python
user_assigned_managed_identity_credential = ManagedIdentityCredential(client_id=os.getenv("AZURE_CLIENT_ID")) 
```

>[!NOTE]
>The `azd` resource environment variables are provisioned during `azd` app deployment.

The following code snippet uses `AZURE_TENANT_ID` `azd` resource environment variable to create an [AzureDeveloperCliCredential](/python/api/azure-identity/azure.identity.aio.azuredeveloperclicredential?view=azure-python&preserve-view=true) instance capable of authenticating with the current Microsoft Entra tenant.

```Python
azure_dev_cli_credential = AzureDeveloperCliCredential(tenant_id=os.getenv("AZURE_TENANT_ID"), process_timeout=60)  
```

The Azure Identity client library provides _credentials_&mdash;public classes that implement the Azure Core library's [TokenCredential](/python/api/azure-core/azure.core.credentials.tokencredential) protocol. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

The following snippet creates a `ChainedTokenCredential` using a `ManagedIdentityCredential` and an `AzureDeveloperCliCredential`:

- The `ManagedIdentityCredential` is used for Azure Functions and Azure App Service. A user-assigned managed identity is supported by passing the `client_id` to `ManagedIdentityCredential`.
- The `AzureDeveloperCliCredential` is used for local development. It was set previously based on the Microsoft Entra tenant to use.

```python
azure_credential = ChainedTokenCredential(
    user_assigned_managed_identity_credential,
    azure_dev_cli_credential
)

```

>[!TIP]
>The order of the credentials is important, as the first valid Microsoft Entra access token is used. For more information, check out the [ChainedTokenCredential Overview](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#usage-guidance-for-defaultazurecredential) article.

The following code snippet gets the Azure OpenAI token provider based on the selected Azure credential.
This value is obtained by calling the [azure.identity.aio.get_bearer_token_provider](/python/api/azure-identity/azure.identity.aio?view=azure-python#azure-identity-aio-get-bearer-token-provider&preserve-view=true) with two arguments:

- `azure_credential`: The `ChainedTokenCredential` instance created earlier to authenticate the request.

- `https://cognitiveservices.azure.com/.default`: Required one or more bearer token scopes. In this case, the **Azure Cognitive Services** endpoint.

```python
token_provider = get_bearer_token_provider(
    azure_credential, "https://cognitiveservices.azure.com/.default"
)
```

The following lines check for the required `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_CHATGPT_DEPLOYMENT` `azd` resource environment variables, which are provisioned during `azd` app deployment. An error is thrown if a value isn't present.

```python
if not os.getenv("AZURE_OPENAI_ENDPOINT"):
    raise ValueError("AZURE_OPENAI_ENDPOINT is required for Azure OpenAI")
if not os.getenv("AZURE_OPENAI_CHATGPT_DEPLOYMENT"):
    raise ValueError("AZURE_OPENAI_CHATGPT_DEPLOYMENT is required for Azure OpenAI")
```

This snippet initializes the Azure OpenAI client, setting the `api_version`, `azure_endpoint`, and `azure_ad_token_provider` (`client_args`) parameters:

```python
bp.openai_client = AsyncAzureOpenAI(
    api_version=os.getenv("AZURE_OPENAI_API_VERSION") or "2024-02-15-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    azure_ad_token_provider=token_provider,
)  
```

The following line sets the Azure OpenAI model deployment name for use in API calls:

```python
bp.openai_model = os.getenv("AZURE_OPENAI_CHATGPT_DEPLOYMENT")
```

>[!NOTE]
>OpenAI uses the `model` keyword argument to specify what model to use. Azure OpenAI has the concept of _unique model deployments_. When you use Azure OpenAI, `model` should refer to the _underlying deployment name_ chosen during Azure OpenAI model deployment.

Once this function completes, the client is properly configured and ready to interact with Azure OpenAI services.

### Response stream using the OpenAI Client and model

The `response_stream` handles the chat completion call in the route. The following code snippet shows how `openai_client` and `model` are used.

```python
async def response_stream():
    # This sends all messages, so API request may exceed token limits
    all_messages = [
        {"role": "system", "content": "You are a helpful assistant."},
    ] + request_messages

    chat_coroutine = bp.openai_client.chat.completions.create(
        # Azure OpenAI takes the deployment name as the model name
        model=bp.openai_model,
        messages=all_messages,
        stream=True,
    )
```

:::zone-end

:::zone pivot="dotnet"

## Explore the sample code

.NET applications rely on the [Azure.AI.OpenAI](https://www.nuget.org/packages/Azure.AI.OpenAI/) client library to communicate with Azure OpenAI services, which takes a dependency on the [OpenAI](https://www.nuget.org/packages/OpenAI/2.1.0-beta.1) library. The sample app configures keyless authentication using Microsoft Entra ID to communicate with Azure OpenAI.

### Configure authentication and service registration

In this sample, keyless authentication is configured in the `program.cs` file. The following code snippet uses the `AZURE_CLIENT_ID` environment variable set by `azd` to create a [ManagedIdentityCredential](/dotnet/api/azure.identity.managedidentitycredential?view=azure-dotnet&preserve-view=true) instance capable of authenticating via user-assigned managed identity.

```csharp
var userAssignedIdentityCredential = 
    new ManagedIdentityCredential(builder.Configuration.GetValue<string>("AZURE_CLIENT_ID"));
```

>[!NOTE]
>The `azd` resource environment variables are provisioned during `azd` app deployment.

The following code snippet uses the `AZURE_TENANT_ID` environment variable set by `azd` to create an [AzureDeveloperCliCredential](/python/api/azure-identity/azure.identity.aio.azuredeveloperclicredential?view=azure-python&preserve-view=true) instance capable of authenticating locally using the account signed-in to `azd`.

```csharp
var azureDevCliCredential = new AzureDeveloperCliCredential(
    new AzureDeveloperCliCredentialOptions()
    { 
        TenantId = builder.Configuration.GetValue<string>("AZURE_TENANT_ID") 
    });
```

The Azure Identity client library provides credential classes that implement the Azure Core library's [TokenCredential](/python/api/azure-core/azure.core.credentials.tokencredential) protocol. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together using `ChainedTokenCredential` to form an ordered sequence of authentication mechanisms to be attempted.

The following snippet registers the `AzureOpenAIClient` for dependency injection and creates a `ChainedTokenCredential` using a `ManagedIdentityCredential` and an `AzureDeveloperCliCredential`:

- The `ManagedIdentityCredential` is used for Azure Functions and Azure App Service. A user-assigned managed identity is supported using the `AZURE_CLIENT_ID` that was provided to the `ManagedIdentityCredential`.
- The `AzureDeveloperCliCredential` is used for local development. It was set previously based on the Microsoft Entra tenant to use.

```csharp
builder.Services.AddAzureClients(
    clientBuilder => {
        clientBuilder.AddClient<AzureOpenAIClient, AzureOpenAIClientOptions>((options, _, _)
            => new AzureOpenAIClient(
                new Uri(endpoint),
                new ChainedTokenCredential(
                    userAssignedIdentityCredential, azureDevCliCredential), options));
    });
```

>[!TIP]
>The order of the credentials is important, as the first valid Microsoft Entra access token is used. For more information, check out the [ChainedTokenCredential Overview](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#usage-guidance-for-defaultazurecredential) article.

### Get chat completions using the Azure OpenAI client

The Blazor web app injects the registered `AzureOpenAIClient` at the top of the `Home.Razor` component:

```csharp
@inject AzureOpenAIClient azureOpenAIClient
```

When the user submits the form, the `AzureOpenAIClient` sends their prompt to the OpenAI model to generate a completion:

```csharp
ChatClient chatClient = azureOpenAIClient.GetChatClient("gpt-4o-mini");

messages.Add(new UserChatMessage(model.UserMessage));

ChatCompletion completion = await chatClient.CompleteChatAsync(messages);
    messages.Add(new SystemChatMessage(completion.Content[0].Text));
```

:::zone-end

:::zone pivot="typescript"

## Explore the sample code

[!INCLUDE [typescript explore sample code](../javascript/ai/includes/get-started-securing-your-ai-app/explore-sample-code.md)]

:::zone-end

## Other security considerations

This article demonstrates how the sample uses `ChainedTokenCredential` for authenticating to the Azure OpenAI service.

The sample also has a [GitHub Action](https://github.com/microsoft/security-devops-action) that scans the infrastructure-as-code files and generates a report containing any detected issues. To ensure continued best practices in your own repository, we recommend that anyone creating solutions based on our templates ensure that the [GitHub secret scanning setting](https://docs.github.com/code-security/secret-scanning/introduction/about-secret-scanning) is enabled.

Consider other security measures, such as:

- [Restrict access to the appropriate set of app users using Microsoft Entra](/entra/identity-platform/howto-restrict-your-app-to-a-set-of-users).

- Protecting the Azure Container Apps instance with a [firewall](/azure/container-apps/waf-app-gateway?tabs=default-domain) and/or [Virtual Network](/azure/container-apps/networking?tabs=workload-profiles-env%2Cazure-cli).

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

:::zone pivot="python"

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/openai-chat-app-quickstart`](https://github.com/Azure-Samples/openai-chat-app-quickstart) GitHub repository.

1. Open the context menu for the codespace and then select **Delete**.

:::zone-end

:::zone pivot="dotnet"

1. Sign into the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/openai-chat-app-quickstart-dotnet`](https://github.com/Azure-Samples/openai-chat-app-quickstart-dotnet) GitHub repository.

1. Open the context menu for the codespace and then select **Delete**.

:::zone-end

:::zone pivot="typescript"

[!INCLUDE [typescript Clean up resources](../javascript/ai/includes/get-started-securing-your-ai-app/clean-up-resources.md)]

:::zone-end

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="./media/get-started-securing-your-ai-app/reopen-local-command-palette.png" lightbox="./media/get-started-securing-your-ai-app/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> After Visual Studio Code stops the running development container, the container still exists in Docker in a stopped state. You can delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

:::zone pivot="python"

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-chat-app-quickstart/issues).

## Next steps

> [!div class="nextstepaction"]
> [Get started with the chat using your own data sample for Python](../python/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

:::zone-end

:::zone pivot="dotnet"

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-chat-app-quickstart-dotnet/issues).

> [!div class="nextstepaction"]
> [Get started with the chat using your own data sample for .NET](/dotnet/ai/get-started-app-chat-template?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)

:::zone-end

:::zone pivot="typescript"

[!INCLUDE [typescript get help](../javascript/ai/includes/get-started-securing-your-ai-app/get-help.md)]

:::zone-end
