---
title: "Get Started with Entity Extraction Using Azure OpenAI Structured Outputs Mode"
description: "Learn how to improve your Azure OpenAI model responses with structured outputs."
ms.date: 02/20/2025
ms.topic: get-started
ms.subservice: intelligent-apps
ms.custom: devx-track-python, devx-track-python-ai
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
# CustomerIntent: As an AI app developer, I want to learn how to use Azure OpenAI  structured outputs to improve my model responses from a simple example.
---
# Quickstart: Get started with Entity Extraction using Azure OpenAI Structured Outputs Mode

In this quickstart, you explore several examples to extract different types of entities. The app shows how to to define an object schema and get a response from the Azure OpenAI model that conforms to that schema by using Python and Azure OpenAI Structured Outputs Mode.

The sample in the quickstart includes both the infrastructure and Python files needed so that you can create an Azure OpenAI gpt-4o model deployment and then perform entity extraction using the Azure OpenAI structured outputs mode and the Python OpenAI SDK.

This article uses one or more [AI app templates](./intelligent-app-templates.md) as the basis for examples and guidance. AI app templates provide you with well-maintained, easy-to-deploy reference implementations that help to ensure a high-quality starting point for your AI apps.

By following the instructions in this article, you will:

- Explore and understand the app architecture and implementation.
* Provision an Azure OpenAI account with keyless authentication enabled
* Grant the "Cognitive Services OpenAI User" RBAC role to your user account.
* Deploy a gpt-4o model, version 2024-08-06 (the [only version supported for structured outputs](https://learn.microsoft.com/azure/ai-services/openai/how-to/structured-outputs?tabs=python-secure#supported-models)
* Run the example Python files that use the [openai Python package](https://pypi.org/project/openai/) and [Pydantic models](https://docs.pydantic.dev/) to make requests for structured outputs

Structured outputs make a model follow a [JSON Schema](https://json-schema.org/overview/what-is-jsonschema) definition that you provide as part of your inference API call. Structured outputs are recommended for function calling, extracting structured data, and building complex multi-step workflows.

Use this same general approach for entity extraction across many file types, as long as they can be represented in either a text or image form.

> [!NOTE]
> Currently structured outputs are not supported with:
> - [Bring your own data](../concepts/use-your-data.md) scenarios.
> - [Assistants](../how-to/assistant.md) or [Azure AI Agents Service](../../agents/overview.md).
> - `gpt-4o-audio-preview` and `gpt-4o-mini-audio-preview` version: `2024-12-17`.

## Architectural diagram

:::image type="content" source="./media/get-started-structured-output/architecture-diagram.png" lightbox="/media/get-started-structured-output/architecture-diagram.png" alt-text="Diagram that shows Microsoft Entra managed identity connecting to Azure AI services":::

## Cost

To keep pricing as low as possible in this sample, most resources use a Basic or Consumption pricing tier. Alter your tier as needed based on your intended usage. To stop incurring charges, delete the resources when you're done with the article.

Learn more about [cost in the sample repo](https://github.com/Azure-Samples/azure-openai-entity-extraction#costs).

## Prerequisites

A [development container](https://containers.dev/) environment is available with all dependencies required to complete this article. You can run the development container in GitHub Codespaces (in a browser) or locally by using Visual Studio Code.

To use this article, you need to fulfill the following prerequisites:

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/ai-services?azure-portal=true).

- Azure account permissions. Your Azure account must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

---

## Open a development environment

Use the following instructions to deploy a preconfigured development environment that contains all required dependencies to complete this article.

#### [GitHub Codespaces (recommended)](#tab/github-codespaces)

[GitHub Codespaces](https://docs.github.com/codespaces) runs a development container managed by GitHub with [Visual Studio Code for the Web](https://code.visualstudio.com/docs/editor/vscode-web) as the user interface. For the most straightforward development environment, use GitHub Codespaces so that you have the correct developer tools and dependencies preinstalled to complete this article.

> [!IMPORTANT]
> All GitHub accounts can use Codespaces for up to 60 hours free each month with two core instances. For more information, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Use the following steps to create a new GitHub codespace on the `main` branch of the [`Azure-Samples/azure-openai-entity-extraction`](https://github.com/Azure-Samples/azure-openai-entity-extraction) GitHub repository.

1. Right-click the following button, and then select **Open link in new window**. This action makes the development environment and the documentation available for review.

    [![Button that says Open in GitHub Codespaces.](https://github.com/codespaces/badge.svg)](https://codespaces.new/Azure-Samples/azure-openai-entity-extraction)

1. On the **Create codespace** page, review the information and then select **Create new codespace**.

1. Wait for the codespace to start. This startup process can take a few minutes.

1. In the terminal at the bottom of the screen, sign in to Azure by using the Azure Developer CLI:

    ```azdeveloper
    azd auth login
    ```

1. In the terminal at the bottom of the screen, sign in to Azure by using the Azure CLI:

    ```bash
    az login --use-device-code
    ```

1. Open the URL from the terminal, and then copy the code from the terminal and paste it into the URL that you just opened. Follow the instructions to authenticate with your Azure account.

The remaining tasks in this article take place in the context of this development container.

#### [Visual Studio Code](#tab/visual-studio-code)

The [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) for Visual Studio Code requires [Docker](https://docs.docker.com/) to be installed on your local machine. The extension hosts the development container locally using the Docker host with the correct developer tools and dependencies preinstalled to complete this article.

1. Create a new local directory on your computer for the project.

    ```shell
    mkdir my-structured-output-app
    ```

1. Navigate to the directory you created.

    ```shell
    cd my-structured-output-app
    ```

1. Open Visual Studio Code in that directory:

    ```shell
    code .
    ```

1. Open a new terminal in Visual Studio Code.

1. Run the following AZD command to bring the GitHub repository to your local computer.

    ```azdeveloper
    azd init -t azure-openai-entity-extraction
    ```

1. Open the Command Palette, search for and select **Dev Containers: Open Folder in Container** to open the project in a dev container. Wait until the dev container opens before continuing.

1. Sign in to Azure with the Azure Developer CLI.

    ```azdeveloper
    azd auth login
    ```

1. The remaining exercises in this project take place in the context of this development container.
---

## Deploy and run

The sample repository contains all the code and configuration files for an Azure OpenAI gpt-4o model deployment and then perform entity extraction using the [structured outputs mode](/azure/ai-services/openai/how-to/structured-outputs?tabs=python-secure) and the Python `openai` SDK. The following steps walk you through the sample Entity extraction app Azure deployment process.

### Deploy Entity extraction app to Azure

1. Provision the OpenAI account:

    ```shell
    azd provision
    ```

1. Use the following table to answer the prompts:

    |Prompt|Answer|
    |--|--|
    |Environment name|Keep it short and lowercase. Add your name or alias. For example, `struct-output`. It's used as part of the resource group name.|
    |Subscription|Select the subscription to create the resources in. |
    |Location (for hosting)|Select a location near you from the list.|
    |Location for the OpenAI model|Select a location near you from the list. If the same location is available as your first location, select that.|

> [!NOTE]
> If you get an error or timeout with deployment, changing the location can help, as there may be availability constraints for the OpenAI resource. To change the location run:
>    ```shell
>    azd env set AZURE_LOCATION "yournewlocationname"
>    ```

1. Wait until app is deployed. Deployment usually takes between 5 and 10 minutes to complete.

## Run the entity extraction examples

The sample includes the following examples:

| Example filename | Description |
|------------------|-------------|
| `basic_azure.py` | A basic example that uses a deployed Azure OpenAI resource to extract information from an input string. |
| `extract_github_issue.py` | This example fetches a public GitHub issue using the GitHub API and then extracts details. |
| `extract_github_repo.py`| This example fetches a public README using the GitHub API and then extracts details. |
| `extract_image_graph.py`| This example parses a local image of a graph and extracts details like title, axis, legend. |
| `extract_image_table.py`| This example parses a local image with tables and extracts nested tabular data. |
| `extract_pdf_receipt.py` | This example parses a local PDF receipt using the `pymupdf` package to first convert it to Markdown and then extract order details. |
| `extract_webpage.py` | This example parses a blog post using the `BeautifulSoup` package, and extract metadata (title, description, and tags.). |

Run an example by running either `python example_filename.py` or selecting the `Run` button on the opened file.

## Exploring the sample code examples

### Example 1: Use a deployed Azure OpenAI resource to extract information from an input string

### Example 2: Fetch a public GitHub issue using the GitHub API and then extract details

### Example 3: Fetch a public README using the GitHub API and then extract details

### Example 4: Parse a local image of a graph and extract details like title, axis, and legend

### Example 5: Parse a local image with tables and extract nested tabular data

### Example 6: Parses a local PDF receipt by converting to Markdown and then extracting order details

### Example 7: Parse a blog post and extract metadata


## Clean up resources

### Clean up Azure resources

The Azure resources that you created in this article are billed to your Azure subscription. If you don't expect to need these resources in the future, delete them to avoid incurring more charges.

To delete the Azure resources and remove the source code, run the following Azure Developer CLI command:

```azdeveloper
azd down --purge
```

### Clean up GitHub Codespaces

#### [GitHub Codespaces](#tab/github-codespaces)

Deleting the GitHub Codespaces environment helps you maximize the amount of free per-core-hours entitlement that you get for your account.

> [!IMPORTANT]
> For more information about your GitHub account's entitlements, see [GitHub Codespaces monthly included storage and core hours](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

1. Sign in to the [GitHub Codespaces dashboard](https://github.com/codespaces).

1. Locate your currently running codespace sourced from the [`Azure-Samples//azure-openai-entity-extraction`](https://github.com/Azure-Samples/azure-openai-entity-extraction) GitHub repository.

1. Open the context menu for the codespace and select **Delete**.

#### [Visual Studio Code](#tab/visual-studio-code)

Stop the running development container and return to running Visual Studio Code in the context of a local workspace.

Open the **Command Palette**, search for the **Dev Containers** commands, and then select **Dev Containers: Reopen Folder Locally**.

:::image type="content" source="./media/get-started-app-chat-vision/reopen-local-command-palette.png" lightbox="./media/get-started-app-chat-vision/reopen-local-command-palette.png" alt-text="Screenshot of the Command Palette option to reopen the current folder within a local environment.":::

> [!TIP]
> After Visual Studio Code stops the running development container, the container still exists in Docker in a stopped state. You have the option to delete the container instance, container image, and volumes from Docker to free up more space on your local machine.

---

## Get help

Log your issue to the repository's [issues page](https://github.com/Azure-Samples/azure-openai-entity-extraction/issues).

## Resources

- [How to use structured outputs](/azure/ai-services/openai/how-to/structured-outputs?tabs=python-secure#supported-models)