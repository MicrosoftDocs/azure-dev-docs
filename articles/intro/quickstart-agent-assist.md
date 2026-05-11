---
title: "Quickstart: Build and deploy to Azure with agentic AI"
description: Use GitHub Copilot Plan mode and agent mode in VS Code to plan, build, configure, and deploy a to-do app to Azure.
ms.service: azure
ms.topic: quickstart
ms.date: 05/05/2026
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Develop Azure applications with agent-assisted AI

In this quickstart, use GitHub Copilot to build a React to-do application and deploy it to Azure App Service by using AI-assisted development. When developing locally, start with Copilot Plan mode to create a detailed implementation plan, then switch to agent mode to build and deploy. When using VS Code for the Web, use agent mode throughout. By the end, you have hands-on experience with:

- GitHub Copilot [Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) to research your project and create implementation plans (local development)
- GitHub Copilot agent mode to scaffold, configure, and deploy a full application
- [Azure Skills](https://github.com/microsoft/azure-skills) to enhance Copilot with Azure-specific knowledge and tools
- A working to-do app running on Azure App Service
- An API endpoint for your to-do app
- Azure Developer CLI (azd) to provision and deploy Azure resources from an infrastructure template

Plan mode lets Copilot research your codebase and create a structured implementation plan before you write any code, ensuring your requirements are clear and your approach is sound. Agent mode lets Copilot autonomously run commands, edit files, and iterate on errors. You provide the goal and Copilot determines the steps.

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

# Azure Skills
code --list-extensions | grep -i ms-azuretools.vscode-azure-mcp-server
```

---

## Create a new workspace

# [VS Code for the Web](#tab/vscode-web)

1. Open [vscode.dev/azure](https://vscode.dev/azure) in your browser.
1. Sign in by using your Azure account when prompted.
1. In the **Terminal** window, create a new directory for your project, and change into it.

    ```bash
    mkdir todo-app && cd todo-app
    ```

# [Local development environment](#tab/local)

1. In the **Terminal** window, create a new directory for your project, and change into it.

    ```bash
    mkdir todo-app && cd todo-app
    ```
1. Open the directory in VS Code.

    ```bash
    code .
    ```

    The command opens a new VS Code window with the current directory as the workspace. You can also open the folder manually from VS Code by selecting **File** > **Open Folder** from the menu.

---

## Enable Azure Skills

Azure Skills provides Copilot with curated Azure expertise, workflows, and guardrails so the agent can make informed decisions about Azure services, infrastructure, and deployment. The Azure MCP extension installs a companion extension that brings the Azure skills into VS Code. Together they configure the Azure MCP Server, Foundry MCP, and the full skills layer automatically. For more information, see the [Azure Skills Plugin repository](https://aka.ms/azure-skills).

# [VS Code for the Web](#tab/vscode-web)

1. Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Select **MCP: List servers**.
1. If the Azure MCP server isn't running, start it by selecting **Azure MCP** > **Start server**.

# [Local development environment](#tab/local)

1. Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Select **MCP: List Servers**.
1. If the Azure MCP server isn't running, start it by selecting **Azure MCP** > **Start Server**.

---

## Plan your application

[Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) lets Copilot research your project and generate a detailed implementation plan before writing any code. You review and refine the plan, then hand it off to agent mode for execution.

1. Open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the Activity Bar.
1. Sign in to GitHub Copilot if you haven't already. Select the GitHub Copilot logo **Sign-in** button in the Visual Studio Code status bar and follow the prompts to authenticate with your GitHub account.
1. Select **Plan** from the agents dropdown in the chat panel, or type `/plan` followed by your task description.

    Copy and paste the following prompt into the Copilot chat panel:

    ``` Prompt
    /plan 
    Create a Vite + React single-page application (SPA) to-do app
    with the following features:
    - Add, remove, and mark complete/incomplete to-do items.
    - Use localStorage to persist to-do items between sessions.
    - Choose low-cost Azure resources.
    - Create a deployment template for Azure Developer CLI (azd).
    - Create a README file with instructions on how to test, run, and deploy the app.
    ```

    > [!NOTE]
    > If you didn't set up GitHub Copilot yet, you're prompted to sign in to your GitHub account and set up Copilot before you can send the prompt. If you don't have a Copilot subscription, you're associated with a free account that gives you a monthly limit of completions and chat interactions.

1. Answer any clarifying questions the Plan agent asks after researching your task. For example:
    TypeScript or JavaScript for the React app?
    What styling approach should be used?
    Should the azd template include a GitHub Actions CI/CD workflow?

1. Review the generated plan. Your plan looks something like this:

    ```Output
    Plan: Vite + React To-Do SPA with Azure Deployment
    A Vite + React + TypeScript SPA scaffolded inside todo-app, with localStorage persistence,
    and deployed to Azure Static Web Apps (Free tier) via azd. 
    No backend required — all state is client-side.
   ... 
    ```

    The Plan agent produces a high-level summary, implementation steps, and verification steps. You can submit follow-up prompts to iterate on the plan until it meets your requirements.

## Agent mode

Agent mode gives GitHub Copilot the ability to run terminal commands, create and edit files, and self-correct when something goes wrong. You provide a high-level goal, and the agent decides what steps to take.

1. Select **Claude Sonnet 4.6** model, **Agent** mode, and **Autopilot (Preview)** in the chat panel. 
    - The default **Auto** model lets Copilot choose the best model for each step dynamically. For this quickstart, use a specific model like Claude Sonnet 4.6 for more deterministic behavior so that the steps Copilot takes to implement your plan are more predictable. 
    - Agent mode and autopilot allow Copilot to run terminal commands and make file changes autonomously. Autopilot mode gives Copilot the ability to self-correct and iterate without needing further input from you. If you prefer more control, choose default approvals mode to approve each step before it executes.

1. In the chat panel, select **Start Implementation** or **Start with Autopilot** to hand off the plan to agent mode for execution. Autopilot mode gives Copilot the ability to iterate without needing further input from you. If you prefer more control, choose default approvals mode to approve each step before it executes.

When Copilot finishes the implementation, you see output in the chat panel similar to this:

```Output
All done. Here's a summary of what was built:

App (src/)

src/types.ts — Todo interface
src/hooks/useTodos.ts — addTodo, removeTodo, toggleTodo with localStorage persistence
src/components/TodoForm.tsx, TodoItem.tsx, TodoList.tsx — UI components
src/App.tsx — wired together with task remaining counter
src/App.css / src/index.css — vanilla CSS, light/dark mode
Azure / azd

azure.yaml — host: staticwebapp, dist: dist
infra/main.bicep — subscription-scoped resource group + Static Web App (Free tier)
infra/staticwebapp.bicep, main.parameters.json, abbreviations.json
Docs — README.md with local dev, build, azd up deploy, and azd down teardown instructions.

Build passes with no errors (tsc + Vite). Run npm run dev to start locally, 
or azd up to provision and deploy to Azure.
```

---

The app is now scaffolded with the specified features, and the Azure infrastructure template is ready for deployment. The README file includes instructions on how to test and deploy the app. Before deploying to Azure, test the app locally to confirm it works as expected.

## Test the app

Depending on how you answered questions during planning mode, testing your app locally might depend on the implementation. Review the README file for testing locally.

# [VS Code for the Web](#tab/vscode-web)

Assuming the application is a Vite + React SPA as generated in the planning steps, start the development server with the following command:

```bash
npm install && npm run dev
```

The command starts the Vite development server. The terminal output includes the localhost URL where the app is running.

```Output
  VITE v5.4.21  ready in 271 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in a browser. 

:::image type="content" source="media/quickstart-agent-assist/test-app-web.png" alt-text="Screenshot of VS Code Ports tab with the Forwarded Address URL highlighted for port 5173." lightbox="media/quickstart-agent-assist/test-app-web.png":::

Test the functionality by adding, toggling, and removing tasks to confirm everything works as expected.

:::image type="content" source="media/quickstart-agent-assist/test-todo.png" alt-text="Screenshot of To-Do app showing 2 of 3 tasks remaining with one completed task and an input field to add new tasks.":::

# [Local development environment](#tab/local)

Assuming the application is a Vite + React SPA as generated in the planning steps, start the development server with the following command:

```bash
npm install && npm run dev
```

The command starts the Vite development server. The terminal output includes the localhost URL where the app is running.

```Output
  VITE v5.4.21  ready in 271 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

:::image type="content" source="media/quickstart-agent-assist/test-app-local.png" alt-text="Screenshot of the To-Do app running locally in a browser at localhost:5173 with tasks listed and an Add input field." lightbox="media/quickstart-agent-assist/test-app-local.png":::

Test the functionality by adding, toggling, and removing tasks to confirm everything works as expected.

---

When you're done testing, stop the development server by pressing `Ctrl + C` in the terminal.

## Ask about Azure services

Now that you have a working app, ask the agent about which Azure services would be a good fit for hosting the app and storage for persistent data.

Copy and paste the following prompt:

``` Prompt
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

After testing the app locally and confirming it works as expected, deploy it to Azure so you can see it running in the cloud.

1. Since you're using `azd` to deploy, sign in to Azure in the terminal if you aren't already. Run:

    ```azdeveloper
    azd auth login
    ```
1. Deploy the application to Azure.

    ```azdeveloper
    azd up
    ```

    Choose A unique environment name for the deployment when prompted. This name is used to create a resource group in Azure and must be globally unique.

    Select the Azure subscription you want to deploy to when prompted.

The `azd up` command provisions the Azure resources defined in the `infra/` folder, builds the application, and deploys it to Azure. The terminal output includes the URL of your deployed app.

## Troubleshooting

If the deployment fails or the live site doesn't serve the built production files, use the following prompt to have the agent diagnose and fix the deployment automatically.

```Prompt
Deploy the app using `azd up`. If deployment is misconfigured, diagnose and fix automatically until the live site serves built production files, not source or default pages.
Final verification must confirm HTML references production assets and that the main JS/CSS asset URLs return HTTP 200.
Update the README. Return a concise summary and the app website URL.
```

During development, you can use GitHub Copilot to help you debug issues. If you encounter an error, copy and paste the error output in the chat window and ask the agent to help you understand and fix the issue.

## Explore your deployed resources

After deployment, you can explore your Azure resources directly in VS Code.

1. Open the Azure view by selecting the Azure icon in the Activity Bar.
1. On Resources node, select the **Group by** icon and choose **Group by Resource Group** to organize resources by their resource groups.
1. Expand **Resources** and find the resource group for the deployment created by `azd up`.
1. Expand the resource group to see the deployed services, such as the App Service hosting your web app and any other resources created by `azd up`.
1. Right-click the web app and select **Browse Website** to open your deployed to-do app or select **View in Portal** to see the resource in the Azure Portal.

## Clean up resources

When you're done exploring, delete the Azure resources to avoid incurring charges:

```azdeveloper
azd down
```

This command deletes all Azure resources created during deployment, including the resource group and App Service.

## Next steps

You used GitHub Copilot Plan mode and agent mode to plan, scaffold, and deploy a React to-do app to Azure without writing code manually. Continue building on what you learned:

- [GitHub Copilot for Azure documentation](../github-copilot-azure/introduction.md) - Learn more about AI-assisted Azure development.
- [VS Code for the Web for Azure development](https://code.visualstudio.com/docs/azure/vscodeforweb) - Learn more about the browser-based development environment.
- [Azure Skills Plugin](https://github.com/microsoft/azure-skills) - Install Azure Skills for enhanced Azure development with Copilot.
- [Azure Developer CLI templates](../azure-developer-cli/azd-templates.md) - Find templates for different languages and architectures.
