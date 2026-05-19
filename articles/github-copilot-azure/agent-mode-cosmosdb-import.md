---
title: "Quickstart: Import data into Azure Cosmos DB with Copilot agent mode"
description: "Use GitHub Copilot for Azure agent mode to create Azure Cosmos DB resources and import sample data with Python. Get started quickly—no manual infrastructure code needed."
author: bobtabor-msft
ms.author: rotabor
keywords: github, copilot, ai, azure, cosmos db
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 05/18/2026
ms.collection: ce-skilling-ai-copilot
ms.custom: msecd-doc-authoring-108

#customer intent: As a developer, I want to use GitHub Copilot agent mode to create Azure Cosmos DB resources and import data so that I can quickly set up a database without writing infrastructure code manually.
---

# Quickstart: Import data into Azure Cosmos DB by using GitHub Copilot for Azure agent mode

In this quickstart, you use GitHub Copilot for Azure agent mode to create Azure Cosmos DB resources and import sample data by using Python. Agent mode takes action in Visual Studio Code - creating files, executing commands in the terminal, and more.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- An Azure resource group. You use this resource group in the following procedure.
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) extension installed.
- [Python 3.9 or later](https://www.python.org/downloads/).
- [Azure CLI](/cli/azure/install-azure-cli). Sign in before you start: run `az login` and select the subscription you want to use.
- A GitHub Copilot subscription with access to agent mode.
- Familiarity with [getting started with GitHub Copilot for Azure](./get-started.md).

## Set up your environment

1. Create a new directory on your local computer.
1. Open Visual Studio Code from that local directory (workspace). 
1. Download the products data and save it into the new local directory (workspace).

Download the [CosmicWorks product data](https://raw.githubusercontent.com/AzureCosmosDB/CosmicWorks/main/data/database-v4/product) and save it as `products.json` in your workspace folder.

## Build the Azure Cosmos DB import solution

1. In Visual Studio Code, open the GitHub Copilot chat window.
1. Switch from **Default Approvals** to **Autopilot (Preview)**.

    :::image type="content" source="media/agent-mode-cosmosdb-import/github-copilot-continue-always-allow.png" alt-text="Screenshot of GitHub Copilot for Azure agent mode response in Visual Studio Code with the Autopilot approval displayed.":::

1. Switch to agent mode and select your preferred model. Enter the following prompt:
 
    `Using the products.json file in my workspace, create a Python virtual environment, then set up an Azure Cosmos DB for NoSQL environment in West US (resource group named "<resource-group-name>", account, database, and container with partition key "/categoryId"). Write and run a Python script to import all records into the container. Verify the import by querying the first 5 items. If there are errors, fix them and retry.`

Replace `<resource-group-name>` with your own unique value.

Agent mode handles the entire workflow: creating the virtual environment, provisioning each Azure resource, generating the Python import script, installing dependencies, executing the import, and verifying the results. Review the generated code before allowing execution.

## Clean up resources

When you're finished, delete the resource group to avoid ongoing charges:

```text
Use the Azure CLI to delete the resource group `<resource-group-name>` and all its resources.
```

Or run the command directly in your terminal:

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Related content

- [Get started with GitHub Copilot for Azure](get-started.md)
- [Deploy an app with agent mode](quickstart-deploy-app-agent-mode.md)
- [Azure Cosmos DB documentation](/azure/cosmos-db/)
