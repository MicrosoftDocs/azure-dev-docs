---
title: "Quickstart: Import data into Azure Cosmos DB with Copilot agent mode"
description: Learn how to use GitHub Copilot for Azure agent mode to create Azure Cosmos DB resources and import sample data using Python prompts in Visual Studio Code.
author: bobtabor-msft
ms.author: rotabor
keywords: github, copilot, ai, azure, cosmos db
ms.service: github-copilot-for-azure
ms.topic: quickstart
ms.date: 05/04/2026
ms.collection: ce-skilling-ai-copilot
ms.custom: msecd-doc-authoring-108

#customer intent: As a developer, I want to use GitHub Copilot agent mode to create Azure Cosmos DB resources and import data so that I can quickly set up a database without writing infrastructure code manually.
---

# Quickstart: Import data into Azure Cosmos DB using GitHub Copilot for Azure agent mode

In this quickstart, you use GitHub Copilot for Azure agent mode to create Azure Cosmos DB resources and import sample data using Python. Agent mode takes action in Visual Studio Code — creating files, executing commands in the terminal, and more.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Visual Studio Code](https://code.visualstudio.com/) with the [GitHub Copilot for Azure](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azure-github-copilot) extension installed.
- [Python 3.9 or later](https://www.python.org/downloads/)
- [Azure CLI](/cli/azure/install-azure-cli)
- A GitHub Copilot subscription with access to agent mode.
- Familiarity with [getting started with GitHub Copilot for Azure](get-started.md).

## Set up the environment

1. Create a new directory on your local computer.
1. Open Visual Studio Code from that local directory (workspace).
1. In Visual Studio Code, open the GitHub Copilot chat window.
1. Switch to agent mode and select your preferred model.
1. Download the products data and save it into the new local directory (workspace).

To download the products data, navigate to the [CosmicWorks product data](https://github.com/AzureCosmosDB/CosmicWorks/blob/main/data/database-v4/product). Select the **Download raw file** icon to save the file locally. Move the file to your new folder/workspace. Make sure to rename the file to `products.json`.

## Create a Python virtual environment

You can ask GitHub Copilot to help create a new Python environment:

```text
Create a Python virtual environment
```

Alternatively, create the environment yourself. Open the Command Palette with `Ctrl` + `Shift` + `P`, then type/select **Python: Create Environment...**. Choose **Venv** and select your preferred interpreter path.

Or in the Visual Studio Code terminal, run one of the following commands depending on your shell:

# [Git Bash](#tab/bash)

```bash
python -m venv .venv
source .venv/Scripts/activate
```

# [PowerShell](#tab/powershell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

# [macOS/Linux](#tab/linux)

```bash
python -m venv .venv
source .venv/bin/activate
```

---

## Plan the work

It's useful to break up work into smaller executable chunks. For example, this prompt is ambitious and might require several iterations:

```text
I want to create a Cosmos DB database using data from the CosmicWorks sample (https://github.com/AzureCosmosDB/CosmicWorks) but the instructions on that page explain how to do this with .NET and I want to use Python.
```

A better approach is to think about the two high-level tasks:

1. **Create Azure resources** — create a resource group, an Azure Cosmos DB account, a database, and a container.
2. **Create an app to import data** — generate and execute Python code to upload JSON data into the container.

For best results, break down the tasks into smaller, atomic goals and use those to design your prompts:

1. Create a resource group in a specific region.
1. Create an Azure Cosmos DB account in the resource group.
1. Create a database in the account.
1. Create a container in the database.
1. Generate Python code to upload the JSON items to the container.
1. Fix errors or warnings and run the program.

Allow agent mode to do the work. Agent mode performs best when it controls the entire process.

## Build the solution

Use the plan to formulate the prompts needed to create Azure resources and write the code. Specify the outcome you want.

### Sign in to your tenant and choose your subscription

If you work with multiple tenants and subscriptions, make sure you're signed in to the correct one:

```text
How do I log into my Azure tenant and choose an Azure subscription I want to work with?
```

GitHub Copilot responds with steps similar to:

1. Open a terminal.
1. Sign in to Azure: `az login`
1. List available subscriptions: `az account list --output table`
1. Set the subscription: `az account set --subscription "SUBSCRIPTION_NAME_OR_ID"`

Follow these instructions. If you're ever unsure about which tenant and subscription you're working with, you can ask:

```text
Which tenant and subscription am I working with?
```

When agent mode asks to execute a terminal command, select **Continue** or **Always allow** to let it proceed.

:::image type="content" source="media/agent-mode-cosmosdb-import/github-copilot-continue-always-allow.png" alt-text="Screenshot that shows response to a prompt with an option highlighted to always allow.":::

### Create a resource group

Use the prompt:

```text
Use the Azure CLI to create a resource group named `<resource-group-name>` in the `West US` region
```

Replace `<resource-group-name>` with a unique name for your resource group.

### Create an Azure Cosmos DB account in the resource group

```text
Use the Azure CLI to create a new Azure Cosmos DB for NoSQL account named `<cosmos-db-account-name>` in the resource group `<resource-group-name>`
```

### Create a database and container in the account

```text
Use the Azure CLI to create a new database named `<cosmos-db-database-name>` in the Azure Cosmos DB account `<cosmos-db-account-name>`
```

```text
Use the Azure CLI to create a new container named `<container-name>` with partition key `/id` in the `<cosmos-db-database-name>` database
```

### Generate Python code to upload the JSON items to the container

```text
Generate Python code to insert JSON records from the `products.json` file into the `<container-name>` container in my Azure Cosmos DB database. Use the azure-cosmos package.
```

Agent mode creates the Python script and installs required dependencies. Review the generated code before running it.

### Fix errors or warnings

If agent mode encounters errors during execution, it attempts to fix them automatically. You can also prompt it directly:

```text
Fix the error in the terminal and run the script again.
```

Common issues include:
- Missing Python packages (agent mode installs them)
- Incorrect partition key configuration
- Authentication issues (ensure you're signed in with `az login`)

## Verify the import

After the script runs successfully, verify that the data was imported:

```text
Use the Azure CLI to query the first 5 items from the `<container-name>` container in my Cosmos DB database.
```

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

