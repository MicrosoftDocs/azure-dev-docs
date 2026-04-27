---
title: "Quickstart: Build and deploy to Azure with agentic AI"
description: Use GitHub Copilot Plan mode and agent mode in VS Code to plan, build, configure, and deploy a to-do app to Azure.
ms.service: azure
ms.topic: quickstart
ms.date: 04/20/2026
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Develop Azure applications with agent-assisted AI

In this quickstart, you use GitHub Copilot to build a React to-do application and deploy it to Azure App Service using AI-assisted development. When developing locally, you start with Copilot Plan mode to create a detailed implementation plan, then switch to agent mode to build and deploy. When using VS Code for the Web, you use agent mode throughout. By the end, you have hands-on experience with:

- GitHub Copilot [Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) to research your project and create implementation plans (local development)
- GitHub Copilot agent mode to scaffold, configure, and deploy a full application
- [Azure Skills](https://github.com/microsoft/azure-skills) to enhance Copilot with Azure-specific knowledge and tools
- A working to-do app running on Azure App Service
- An API endpoint for your to-do app
- Azure Developer CLI (azd) to provision and deploy Azure resources from an infrastructure template

Plan mode lets Copilot research your codebase and create a structured implementation plan before any code is written, ensuring your requirements are clear and your approach is sound. Agent mode lets Copilot autonomously run commands, edit files, and iterate on errors. You provide the goal and Copilot determines the steps.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [GitHub Copilot](https://github.com/features/copilot) subscription.

# [VS Code for the Web](#tab/vscode-web)

No local installation required. [VS Code for the Web (vscode.dev/azure)](https://vscode.dev/azure) gives you a browser-based VS Code environment with the Azure Developer CLI, Node.js, and several Azure extensions preinstalled.

# [Local development environment](#tab/local)

Install the following tools locally to get a full development experience.

- [Visual Studio Code](https://code.visualstudio.com/)
- [GitHub Copilot VS Code extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [Node.js](https://nodejs.org/)
- [Azure Developer CLI (azd)](../azure-developer-cli/install-azd.md)
- [Azure CLI](/cli/azure/install-azure-cli)
- [Azure Skills](https://aka.ms/azure-skills) for enhanced Azure development experience

You can verify tool installation with the following commands:

```bash
# Visual Studio Code
code --version
# GitHub Copilot
code --list-extensions | grep -i github.copilot
# Node.js
node --version
# Azure Developer CLI
azd version
# Azure CLI
az version
# Azure Skills
code --list-extensions | grep -i ms-azuretools.vscode-azure-mcp-server
```

---

## Create a new workspace

# [VS Code for the Web](#tab/vscode-web)

1. Open [vscode.dev/azure](https://vscode.dev/azure) in your browser.
1. Sign in by using your Azure account when prompted.
1. Create and change into a new directory for your project.

    ```bash
    mkdir todo-app && cd todo-app
    ```

# [Local development environment](#tab/local)

1. Create and change into a new directory for your project.

    ```bash
    mkdir todo-app && cd todo-app
    ```
1. Open the directory in VS Code.

    ```bash
    code .
    ```

    The command opens a new VS Code window with the current directory as the workspace. You can also open the folder manually from VS Code by selecting **File > Open Folder** from the menu.

---

## Enable Azure Skills

Azure Skills provide Copilot with curated Azure expertise, workflows, and guardrails so the agent can make informed decisions about Azure services, infrastructure, and deployment. For more information, see the [Azure Skills Plugin repository](https://aka.ms/azure-skills).

1. Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Select **MCP: List servers**.
1. If the Azure MCP server is not running, start it by selecting **Azure MCP** > **Start server**.

## Plan your application

[Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) lets Copilot research your project and generate a detailed implementation plan before writing any code. You review and refine the plan, then hand it off to agent mode for execution.

1. Open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the Activity Bar.
1. Select **Plan** from the agents dropdown in the chat panel, or type `/plan` followed by your task description.

    Copy and paste the following prompt into the Copilot chat panel:

    ```text
    /plan Create a React to-do app with the following features:
    Add, complete/incomplete toggle, and remove to-do items.
    Include an API endpoint with POST, PATCH, and DELETE for to-do operations.
    Add Swagger UI at /swagger with an OpenAPI spec.
    Choose free or low-cost Azure resources.
    Create a deployment template for Azure Developer CLI (azd).
    Create a README file with instructions on how to run and deploy the app.
    ```

    > [!NOTE]
    > If you haven't set up GitHub Copilot yet, you are prompted to sign in to your GitHub account and set up Copilot before you can send the prompt. If you don't have a Copilot subscription, you're associated with a free account that gives you a monthly limit of completions and chat interactions.

1. Answer any clarifying questions the Plan agent asks after researching your task. For example, which deployment shape do you prefer for lowest cost with azd?
1. Review the generated plan. Your plan looks something like this:

    ```Output
    Plan: React Todo App with API, Swagger, and azd
    Build a single Node/Express deployment that serves both the React app and API, with Swagger UI at /swagger and in-memory todo storage. This keeps Azure cost and complexity low while meeting all requested features.

    Steps

    1. Phase 1 - Scaffold project and deployment foundation.
    2. Create root azd setup, service structure, and build/start wiring for one deployable service.
    3. Scaffold React frontend for add, toggle complete/incomplete, and remove actions.
    4. Scaffold Express backend with health endpoint and static hosting for built frontend.
    ...
    ```

    The Plan agent produces a high-level summary, implementation steps, and verification steps. You can submit follow-up prompts to iterate on the plan until it meets your requirements.

## Agent mode

Agent mode gives GitHub Copilot the ability to run terminal commands, create and edit files, and self-correct when something goes wrong. You provide a high-level goal, and the agent decides what steps to take.

1. Select **Agent** mode, **Auto** model, **Autopilot** in the chat panel. Agent mode and autopilot allow Copilot to run terminal commands and make file changes autonomously. Auto model lets Copilot choose the best model for each step. Autopilot mode gives Copilot the ability to self-correct and iterate without needing further input from you. If you prefer more control, you can choose default approvals mode to approve each step before it executes.

1. In the chat panel, select **Start Implementation** or **Start with Autopilot** to hand off the plan to agent mode for execution. Autopilot mode gives Copilot the ability to iterate without needing further input from you. If you prefer more control, you can choose default approvals mode to approve each step before it executes.

When Copilot is finished with the implementation, you should see output in the chat panel similar to this:

```Output
Implementation Complete
I've successfully built a full-stack React Todo App with Express API, Swagger UI, and Azure deployment via Azure Developer CLI. Here's what was implemented:

Project Structure
- Backend (api): Express.js + TypeScript with API routes, in-memory todo store, and OpenAPI spec
- Frontend (frontend): React + TypeScript + Vite with responsive UI and error handling
- Infrastructure (infra): Bicep templates for low-cost Azure deployment (App Service F1 tier)
- Deployment: Azure Developer CLI config (azure.yaml) with build/deploy hooks

Core Features Implemented
1. Todo API with POST (create), PATCH (toggle), DELETE, and GET endpoints
2. Swagger UI at /swagger with full OpenAPI 3.0 documentation
3. React Frontend with:
   - Add, toggle completion, and delete todo actions
   - Error handling and loading states
   - Optimistic UI updates with rollback on error
   - Accessibility labels for screen readers
   - Beautiful gradient UI with responsive design
4. In-Memory Storage with deterministic todo IDs
5. Backend Tests (Jest) validating todo CRUD operations (4/4 passing)
6. Docker Support with multi-stage build for efficient deployment
...
```

---



## Test the app

Depending on how you answered questions during planning mode, testing your app locally might depend on the implementation. Review the README file for testing locally.

# [VS Code for the Web](#tab/vscode-web)

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in action. Add, toggle, and remove tasks to confirm everything works as expected.

# [Local development environment](#tab/local)


```bash
npm run dev
```

The command starts the Express server serving both the UI and API. The terminal output includes the localhost URL where the app is running.

```Output
> todo-app@1.0.0 start
> node server/index.js

Server listening on http://localhost:7071
```

---

1. Test the to-do app in the browser. Add, remove and change the completion status of tasks to confirm everything works as expected.
1. Test the API endpoints using the Swagger UI at the '/swagger' endpoint. For example, `http://localhost:3000/swagger`. Confirm that POST, PATCH, and DELETE requests work as expected.

When you're done testing, stop the development server by pressing `Ctrl + C` in the terminal.

## Ask about Azure services

Now that you have a working app with API support, ask the agent about which Azure services would be a good fit for hosting the app, API, and storage for persistent data.

Copy and paste the following prompt:

```text
I want to change the storage persistence. What are my no-cost or low-cost storage options for this app in Azure?
```

The agent uses Azure Skills to analyze your app's architecture, data storage needs, and API patterns to recommend an appropriate Azure service for hosting your to-do data. The agent considers factors like cost, scalability, ease of integration, and suitability for the app's workload. The agent then explains its recommendation like the following example:

``` Output
For this to-do app, these are the best no-cost or low-cost Azure persistence options, ordered from cheapest/simple to stronger capability.

1. Azure Cosmos DB for NoSQL with free tier
- Cost profile: can be zero if you stay within free-tier limits.
- Best for: JSON to-do items, easy API fit, good scaling path.
- Pros: schema-flexible, globally available, SDK support, free tier available.
- Cons: RU-based model can become costly if queries are inefficient.
- Good default choice if you want cloud-native persistence with minimal redesign.

2. Azure Table Storage
- Cost profile: typically very low (often cents to a few dollars at small scale).
- Best for: simple key-based to-do storage.
- Pros: cheapest at low volume, straightforward, durable.
- Cons: limited query features versus Cosmos DB/SQL.
- Great choice if your app only needs basic CRUD by id/user partition.
...
```

## Deploy to Azure

# [VS Code for the Web](#tab/vscode-web)

With the app built and production-ready, use the final prompt to add table storage support and create an Azure Developer CLI template to deploy to Azure. 

Since we're going to use azd to deploy, you need to sign in to Azure in the terminal if you haven't already. Run `azd auth login --use-device-code` and follow the prompts to authenticate.

# [Local development environment](#tab/local)

1. Since we're going to use azd to deploy, you need to sign in to Azure in the terminal if you haven't already. Run:

    ``` azdeveloper
    azd auth login` and follow the prompts to authenticate.
    ```
1. Deploy the application to Azure.

    ``` azdeveloper
    azd up
    ```

## Debug deployment

```text
Deploy the app using `azd up`. If deployment is misconfigured, diagnose and fix automatically until the live site serves built production files, not source or default pages.
Final verification must confirm HTML references production assets and that the main JS/CSS asset URLs return HTTP 200.
Update the README. Return a concise summary and the app website URL.
```

---

## Explore your deployed resources

After deployment, you can explore your Azure resources directly in VS Code.

1. Open the Azure view by selecting the Azure icon in the Activity Bar.
1. Expand **Resources** and find the `rg-firstazureexp` resource group.
1. Expand the resource group to see the App Service plan and web app.
1. Right-click the web app and select **Browse Website** to open your deployed to-do app.
1. Right-click the web app and select **Start Streaming Logs** to see live log output.

## Clean up resources

When you're done exploring, delete the Azure resources to avoid incurring charges:

```azdeveloper
azd down
```

This command deletes all Azure resources created during deployment, including the resource group and App Service.

## Next steps

You built and deployed an application using AI-assisted development. Explore more ways to develop with Azure:

- [GitHub Copilot Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) - Learn more about planning tasks before implementing them.
- [Azure Skills Plugin](https://github.com/microsoft/azure-skills) - Install Azure Skills for enhanced Azure development with Copilot.
- [Azure Skills Plugin blog series](https://devblogs.microsoft.com/all-things-azure/announcing-the-azure-skills-plugin/) - Learn how Azure Skills, MCP servers, and plugins work together.
- [Azure Developer CLI templates](../azure-developer-cli/azd-templates.md) - Find templates for different languages and architectures.
- [GitHub Copilot for Azure documentation](../github-copilot-azure/introduction.md) - Learn more about AI-assisted Azure development.
- [Azure App Service documentation](/azure/app-service/) - Learn about hosting web applications on Azure.
- [VS Code for the Web for Azure development](https://code.visualstudio.com/docs/azure/vscodeforweb) - Learn more about the browser-based development environment.
