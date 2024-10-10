---
title: "Get started with the Azure OpenAI security building blocks"
description: "Learn how to effectively use keyless connections for authentication and authorization to Azure OpenAI with the Azure OpenAI security building blocks. Get started using a simple chat app sample implemented using Azure OpenAI Service using keyless authentication with Microsoft Entra ID. Easily deploy with Azure Developer CLI. This article uses the Azure AI Template chat quickstart sample."
ms.date: 10/10/2024
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, keyless-python
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As a developer new to Azure OpenAI, I want to learn how to use keyless connections to Azure OpenAI from a simple example so that I don't leak secrets.
---
# Get started with the Azure OpenAI security building block

This article shows you how to create and use the Azure OpenAI security building block sample. The purpose is to demonstrate Azure OpenAI account provisioning with a role-based access control (RBAC) role permission for keyless (Microsoft Entra ID) authentication to Azure OpenAI. This Python chat app sample also includes all the infrastructure and configuration needed to provision Azure OpenAI resources and deploy the app to Azure Container Apps using the Azure Developer CLI.

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

The Python chat app is running as an Azure Container App. The app uses managed identity via Microsoft Entra ID to authenticate with Azure OpenAI, instead of an API key. The chat app uses Azure OpenAI to generate responses to user messages.

The application architecture relies on the following services and components:

- [Azure OpenAI](/azure/ai-services/openai/) represents the AI provider that we send the user's queries to.
- [Azure Container Apps](/azure/container-apps/) is the container environment where the application is hosted.
- [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/) helps us ensure best-in-class security and eliminates the requirement for you as a developer to securely manage a secret.

- A Python [Quart](https://quart.palletsprojects.com/en/latest/) that uses the [`openai`](https://pypi.org/project/openai/) package to generate responses to user messages.
- A basic HTML/JavaScript frontend that streams responses from the backend using [JSON Lines](http://jsonlines.org/) over a [ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream).
- [Bicep files](/azure/azure-resource-manager/bicep/) for provisioning Azure resources, including Azure OpenAI, Azure Container Apps, Azure Container Registry, Azure Log Analytics, and RBAC roles.
- [Microsoft AI Chat Protocol](https://github.com/microsoft/ai-chat-protocol/) provides standardized API contracts across AI solutions and languages. The chat app conforms to the Microsoft AI Chat Protocol, which allows the evaluations app to run against any chat app that conforms to the protocol.

## Cost

In an attempt to keep pricing as low as possible in this sample, most resources use a basic or consumption pricing tier. Alter your tier level as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/openai-chat-app-quickstart#costs).

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

Use the following steps to create a new GitHub Codespace on the `main` branch of the [`Azure-Samples/openai-chat-app-quickstart`](https://github.com/Azure-Samples/openai-chat-app-quickstart) GitHub repository.

1. Right-click on the following button, and select _Open link in new window_. This action allows you to have the development environment and the documentation available for review.

    [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/openai-chat-app-quickstart)

1. On the **Create codespace** page, review and then select **Create new codespace**

:::image type="content" source="./media/get-started-securing-your-ai-app/github-create-codespace.png" lightbox="./media/get-started-securing-your-ai-app/github-create-codespace.png" alt-text="Screenshot of the confirmation screen before creating a new codespace.":::

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

---

## Deploy and run

The sample repository contains all the code and configuration files for chat app Azure deployment. The following steps walk you through the sample chat app Azure deployment process. You can also [deploy with existing Azure resources](#deploy-with-existing-azure-resources).  

### Deploy chat app to Azure

> [!IMPORTANT]
> Azure resources created in this section incur immediate costs. These resources may accrue costs even if you interrupt the command before it is fully executed.

1. Run the following Azure Developer CLI command to provision the Azure resources and deploy the source code:

    ```azdeveloper
    azd up
    ```

Use the following table to answer the prompts:

|Prompt|Answer|
|--|--|
|Environment name|Keep it short and lowercase. Add your name or alias. For example, `secure-chat`. It's used as part of the resource group name.|
|Subscription|Select the subscription to create the resources in. |
|Location (for hosting)|Select a location near you from the list.|
|Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

### Use chat app to ask questions to the Large Language Model

1. The terminal displays a URL after successful application deployment.

1. Select that URL labeled `Deploying service web` to open the chat application in a browser.

    :::image type="content" source="./media/get-started-securing-your-ai-app/browser-chat.png" lightbox="./media/get-started-securing-your-ai-app/browser-chat.png" alt-text="Screenshot of chat app in browser showing several suggestions for chat input and the chat text box to enter a question.":::

1. In the browser, enter a question such as "Why is managed identity better than keys?".

1. The answer comes from Azure OpenAI and the result is displayed.

## Exploring the sample code

 While OpenAI and Azure OpenAI Service rely on a [common Python client library](https://github.com/openai/openai-python), small code changes are needed when using Azure OpenAI endpoints. Let's see how this sample configures keyless authentication with Microsoft Entra ID and communicates with Azure OpenAI.

### Configure authentication with managed identity

In this sample, the `src\quartapp\chat.py` file begins with configuring keyless authentication.

The following snippet uses the [azure.identity.aio](/python/api/azure-identity/azure.identity.aio?view=azure-python&preserve-view=true) module to create an asynchronous Microsoft Entra authentication flow.

The following code snippet checks for the required `AZURE_CLIENT_ID` `azd` resource environment variable, which is provisioned during `azd` app deployment. An error is thrown if a value isn't present.
The `AZURE_CLIENT_ID` environment variable is used to create a [ManagedIdentityCredential](/python/api/azure-identity/azure.identity.aio.managedidentitycredential?view=azure-python&preserve-view=true) instance capable of authenticating via user-assigned managed identity.

```Python
    if not os.getenv("AZURE_CLIENT_ID"):
        raise ValueError("AZURE_CLIENT_ID is required for Authentication.")

    user_managed_identity_credential = ManagedIdentityCredential(client_id=os.getenv("AZURE_CLIENT_ID")) 
```

The following code snippet checks for the optional `AZURE_TENANT_ID` `azd` resource environment variable, which is provisioned during `azd` app deployment.
The check is used to determine which Microsoft Entra tenant to use for creating the Azure OpenAI client.
It sets `azure_developer_cli_credential` with the default Microsoft Entra tenant if a value isn't present, or uses that tenant ID instead.

```Python
    if os.getenv("AZURE_TENANT_ID"):
        azure_developer_cli_credential = AzureDeveloperCliCredential(process_timeout=60)
    else:
        azure_developer_cli_credential = AzureDeveloperCliCredential(tenant_id=os.getenv("AZURE_TENANT_ID"), process_timeout=60)    
```

The Azure Identity client library provides _credentials_&mdash;public classes that implement the Azure Core library's [TokenCredential](/python/api/azure-core/azure.core.credentials.tokencredential) protocol. A credential represents a distinct authentication flow for acquiring an access token from Microsoft Entra ID. These credentials can be chained together to form an ordered sequence of authentication mechanisms to be attempted.

The following snippet creates a `ChainedTokenCredential` using a `ManagedIdentityCredential` and an `AzureDeveloperCliCredential`:

- The `ManagedIdentityCredential` is used for Azure Functions and Azure App Service. A user-assigned managed identity is supported by passing the `client_id` to `ManagedIdentityCredential`.
- The `AzureDeveloperCliCredential` is used for local development. It was set previously based on the Microsoft Entra tenant to use.

```python
    azure_credential = ChainedTokenCredential(
        user_managed_identity_credential,
        azure_developer_cli_credential
    )

```
>[!TIP]
>The order of the credentials is important, as the first valid Microsoft Entra access token is used. For more information, check out the [ChainedTokenCredential Overview](/azure/developer/python/sdk/authentication/credential-chains?tabs=dac#usage-guidance-for-defaultazurecredential) article.

The following code snippet gets the Azure OpenAI token provider based on the selected Azure credential.
This value is obtained by calling the [azure.identity.aio.get_bearer_token_provider](/python/api/azure-identity/azure.identity.aio?view=azure-python#azure-identity-aio-get-bearer-token-provider&preserve-view=true) with two arguments:

- `azure_credential`: The `ChainedTokenCredential` instance created earlier to authenticate the request.

- "https://cognitiveservices.azure.com/.default": Required one or more bearer token scopes. In this case, the **Azure Cognitive Services** endpoint.

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

This snippet initializes the Azure OpenAI client, setting the `api_version`, `azure_endpoint`, and `azure_ad_token_provider`(`client_args`) parameters:

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
            # Azure Open AI takes the deployment name as the model name
            model=bp.openai_model,
            messages=all_messages,
            stream=True,
        )
```

## Deploy with existing Azure resources

Set `azd` environment values to use existing Azure resources or to specify the new Azure Resource name.

### Use an existing Azure resource group

To use an existing Azure resource group during sample deployment, run `azd env set` to specify the existing resource group name and location values. In the following snippet, copy and replace the `<>` delimited placeholder values in each statement with your values and then run.

```azdeveloper
azd env set AZURE_RESOURCE_GROUP  <Existing Azure resource group name>
azd env set AZURE_LOCATION <Azure resource group location>
```

### Use an existing Azure OpenAI resource

To reuse an OpenAI resource during sample deployment, run `azd env set` to specify the existing OpenAI resource values. In the following snippet, copy and replace the `<>` delimited placeholder values in each statement with your values and then run.

```azdeveloper
azd env set AZURE_OPENAI_RESOURCE <OpenAI resource name>
azd env set AZURE_OPENAI_RESOURCE_GROUP <Azure resource group name that contains the OpenAI resource>
azd env set AZURE_OPENAI_RESOURCE_GROUP_LOCATION <Azure resource group location>
azd env set AZURE_OPENAI_SKU_NAME <SKU name, defaults to "S0">
```

> [!TIP]
> For more information, check out the [frequently asked questions](/azure/developer/azure-developer-cli/environment-variables-faq) about working with environment variables and the Azure Developer CLI (`azd`).

Set these values before running `azd up`. Once set, return to the [Deployment steps](#deploy-and-run).

## Other security considerations

This article demonstrates how the sample uses `ChainedTokenCreadential` for authenticating to the Azure OpenAI service.

The sample also has a [GitHub Action](https://github.com/microsoft/security-devops-action) that scans the infrastructure-as-code files and generates a report containing any detected issues. To ensure continued best practices in your own repository, we recommend that anyone creating solutions based on our templates ensure that the [GitHub secret scanning setting](https://docs.github.com/code-security/secret-scanning/introduction/about-secret-scanning) is enabled.

Consider other security measures, such as:

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

1. Sign into the GitHub Codespaces dashboard (<https://github.com/codespaces>).

1. Locate your currently running Codespaces sourced from the [`Azure-Samples/azure-search-openai-demo`](https://github.com/Azure-Samples/azure-search-openai-demo) GitHub repository.

1. Open the context menu for the codespace and then select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

You aren't necessarily required to clean up your local environment, but you can stop the running development container and return to running Visual Studio Code in the context of a local workspace.

1. Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

    :::image type="content" source="./media/get-started-securing-your-ai-app/reopen-local-command-palette.png" lightbox="./media/get-started-securing-your-ai-app/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within your local environment.":::

> [!TIP]
> Visual Studio Code will stop the running development container, but the container still exists in Docker in a stopped state. You always have the option to deleting the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

If your issue isn't addressed, log your issue to the repository's [Issues](https://github.com/Azure-Samples/openai-chat-app-quickstart/issues).

## Next steps

> [!div class="nextstepaction"]
> [Get started with the chat using your own data sample for Python](../python/get-started-app-chat-template.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)
