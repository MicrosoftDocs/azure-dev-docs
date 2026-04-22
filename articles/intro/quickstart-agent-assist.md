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

Agent mode lets Copilot autonomously run commands, edit files, and iterate on errors. You provide the goal; Copilot figures out the steps. Plan mode lets Copilot research your codebase and create a structured implementation plan before any code is written, ensuring your requirements are clear and your approach is sound.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [GitHub Copilot](https://github.com/features/copilot) subscription.

# [VS Code for the Web](#tab/vscode-web)

No local installation required. [VS Code for the Web (vscode.dev/azure)](https://vscode.dev/azure) gives you a browser-based VS Code environment with the Azure Developer CLI, Node.js, and several Azure extensions preinstalled.

1. Open [vscode.dev/azure](https://vscode.dev/azure) in your browser.
1. Sign in by using your Azure account when prompted.

# [Local development environment](#tab/local)

Install the following tools locally to get a full development experience on your machine.

- [Visual Studio Code](https://code.visualstudio.com/). Verify: `code --version`
- [GitHub Copilot VS Code extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) . Verify: `code --list-extensions | grep -i github.copilot`
- [Node.js](https://nodejs.org/). Verify: `node --version`
- [Azure Developer CLI (azd)](../azure-developer-cli/install-azd.md). Verify: `azd version`
- [Azure CLI](/cli/azure/install-azure-cli). Verify: `az version`
- [Azure Skills](https://aka.ms/azure-skills) for enhanced Azure development experience. Verify: `code --list-extensions | grep -i ms-azuretools.vscode-azure-mcp-server`

---

## Enable Azure Skills

Azure Skills provide Copilot with curated Azure expertise, workflows, and guardrails so the agent can make informed decisions about Azure services, infrastructure, and deployment. For more information, see the [Azure Skills Plugin repository](https://aka.ms/azure-skills).

1. Open the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
1. Select **MCP: List servers**.
1. If the Azure MCP server is not running, start it by selecting **Azure MCP** > **Start server**.

## Plan your application

# [VS Code for the Web](#tab/vscode-web)

Plan mode is not available in VS Code for the Web. Skip ahead to [Agent mode](#agent-mode) to start building with Copilot agent mode directly.

# [Local development environment](#tab/local)

[Plan mode](https://code.visualstudio.com/docs/copilot/agents/planning) lets Copilot research your project and generate a detailed implementation plan before writing any code. You review and refine the plan, then hand it off to agent mode for execution.

1. Open the terminal from the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) via **Terminal > Create New Terminal**.
1. Create and change into a new directory for your project.

    ```bash
    mkdir todo-app && cd todo-app
    ```

1. Open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the Activity Bar.
1. Select **Plan** from the agents dropdown in the chat panel, or type `/plan` followed by your task description.

    Copy and paste the following prompt into the Copilot chat panel:

    ```text
    /plan Create a React to-do app with a production deployment to Azure.
    Features: Add, complete/incomplete toggle, and remove to-do items.
    To-do items are persisted in localStorage.
    Include an API endpoint with POST, PATCH, and DELETE for to-do operations.
    Add Swagger UI at /swagger with an OpenAPI spec.
    Use Azure Developer CLI (azd) for infrastructure and deployment.
    Choose free or low-cost Azure resources for deployment.
    Create a README file with instructions on how to run and deploy the app.
    ```

1. Answer any clarifying questions the Plan agent asks after researching your task.
1. Review the generated plan. Your plan looks something like this:

    ```Output
    Plan: React Todo App on Azure App Service
    Build a single Node.js + Express + TypeScript app that serves both the React frontend and API, persists todos in Azure Table Storage, exposes Swagger UI at /swagger, and deploys with azd using low-cost defaults. This keeps cost and operational complexity low while meeting all requested features.

    Steps

    1. Phase 1 - Project foundation
    2. Scaffold frontend (React + Vite + TypeScript) and backend (Express + TypeScript) with shared root scripts for local dev and production build.
    3. Configure backend to serve compiled frontend assets so one App Service hosts everything. (depends on step 2)
    4. Add centralized configuration for local and Azure settings (port, storage connection, API base paths). (parallel with step 3 after config contract is set)
    ...
    ```

    The Plan agent produces a high-level summary, implementation steps, and verification steps. You can submit follow-up prompts to iterate on the plan until it meets your requirements.

---

## Agent mode

# [VS Code for the Web](#tab/vscode-web)

Agent mode gives GitHub Copilot the ability to run terminal commands, create and edit files, and self-correct when something goes wrong. You provide a high-level goal, and the agent decides what steps to take.

1. Open the terminal from the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) via **Terminal > Create New Terminal**.
1. Create and change into a new directory for your project.

    ```bash
    mkdir todo-app && cd todo-app
    ```

1. Open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the Activity Bar. You might need to authenticate with GitHub Copilot if you haven't already.
1. Select **Agent** mode, **Auto** model, **Autopilot** in the chat panel. Agent mode and autopilot allow Copilot to run terminal commands and make file changes autonomously. Auto model lets Copilot choose the best model for each step. Autopilot mode gives Copilot the ability to self-correct and iterate without needing further input from you. If you prefer more control, you can choose default approvals mode to approve each step before it executes.

# [Local development environment](#tab/local)

In the chat panel, select or type **Start Implementation** to hand off the plan to agent mode for execution.

Agent mode gives Copilot the ability to run terminal commands, create and edit files, and self-correct when something goes wrong.

When Copilot is finished with the implementation, you should see output in the chat panel similar to this:

```Output
Implemented the full solution end to end and validated a production build successfully.

What is now in place:

1. Full-stack workspace with React frontend and Express TypeScript backend
2. Todo features implemented: add, complete or incomplete toggle, remove, and persisted reads
3. Persistence implemented with Azure Table Storage plus local file fallback for local development
4. API endpoints implemented including required POST, PATCH, DELETE, and supporting GET list
5. OpenAPI spec added and Swagger UI exposed at /swagger
6. Azure deployment assets added for azd with low-cost App Service plus Storage setup
7. Deployment and run instructions documented in README
8. Dependency install and build completed successfully
```

---

## Build the app

# [VS Code for the Web](#tab/vscode-web)

Copy and paste the following prompt into the Copilot chat panel. This prompt instructs the agent to scaffold a React to-do app with Vite, handle version compatibility automatically, and verify the build.

```text
/agent Create a React to-do app using Vite with the JavaScript React template.
First check Node/npm versions, and if latest Vite is incompatible, 
automatically use the newest compatible Vite version and continue.
Implement add, complete/incomplete toggle, and remove. Persist state in localStorage.
Run npm run build and verify success. Return a concise summary of what was done.
```

Select **Send** or press **Enter** to submit the prompt. The agent:

- Checks your Node.js and npm versions.
- Scaffolds a new React project using the Vite JavaScript React template, selecting a compatible Vite version if needed.
- Implements the to-do features: add and remove tasks. Toggle tasks between complete or incomplete.
- Adds localStorage persistence so tasks are saved across page refreshes.
- Runs `npm run build` and reports the result.

Review the agent's output to confirm a successful build and read the summary of changes.

> [!TIP]
> Agent mode iterates automatically. If a build fails, the agent reads the error output and attempts to fix the issue without further input from you.

# [Local development environment](#tab/local)

To build the to-do app, run the following command in the terminal:

```bash
npm run build
```

---

## Test the React app

Test the app locally by running `npm run dev` in the terminal. 

# [VS Code for the Web](#tab/vscode-web)

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in action. Add, toggle, and remove tasks to confirm everything works as expected.

# [Local development environment](#tab/local)


```bash
npm start
```

Builds the React frontend to `dist/` and starts the Express server on `http://localhost:3000`, serving both the UI and API.

Open the provided localhost URL in your browser. 

---

Test the to-do app in the browser. Add, remove and change the completion status of tasks to confirm everything works as expected.

When you're done testing, stop the development server by pressing `Ctrl + C` in the terminal.

## Production configuration and API support

Update the app for production hosting on Azure App Service. Add functionality to support calling an API for to-do functions. With [Azure Skills](https://github.com/microsoft/azure-skills) active, Copilot uses curated Azure workflows and decision trees to make informed choices about service configuration, SKUs, and deployment patterns.

# [VS Code for the Web](#tab/vscode-web)

Copy and paste the following prompt:

```text
Add production behavior and API support:
Persist the to-do items in localStorage.
Create an API endpoint that supports POST, PATCH, and DELETE for to-do functionality.
Add Swagger UI at /swagger with an OpenAPI file configured to use a relative server URL.
The to-do app should fetch from the API endpoint.
Configure it for Azure App Service so npm run build creates production output and npm start serves that output.
Update the README with the changes. Return a concise summary of what was done.
```

The agent:

1. Adds localStorage persistence so your tasks remain after page refreshes.
1. Creates an API endpoint for to-do operations that supports POST, PATCH, and DELETE requests.
1. Adds Swagger UI at `/swagger` and configures the OpenAPI document to use a relative server URL.
1. Updates the client app to fetch to-do data and actions through the API endpoint.
1. Configures the app for Azure App Service so `npm run build` creates production assets and `npm start` serves them, then updates the `README` with the implementation details.

Review the chat output and confirm the local verification passed.

# [Local development environment](#tab/local)

The application created in Plan mode is already configured for production hosting and includes API support.

---

## Test the host configuration and API

Test the production server locally by running `npm start` in the terminal.

# [VS Code for the Web](#tab/vscode-web)

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in action. Add, toggle, and remove tasks to confirm everything works as expected.

# [Local development environment](#tab/local)

Open the provided localhost URL in your browser. For example, `http://localhost:3000/swagger`.

---

1. Test the to-do app in the browser. Add, remove and change the completion status of tasks to confirm everything works as expected.
1. Test the API endpoints using the Swagger UI at the '/swagger' endpoint. For example, `http://localhost:3000/swagger`. Confirm that POST, PATCH, and DELETE requests work as expected.

When you're done testing, stop the development server by pressing `Ctrl + C` in the terminal.

## Ask about Azure services

Now that you have a working app with API support, ask the agent about which Azure services would be a good fit for hosting the app, API, and storage for persistent data.

Copy and paste the following prompt:

```text
I want to change the local persistence to a no-cost or low-cost storage option in Azure.
What's a good fit for this app?
```

```output
A very good fit for this app is Azure Table Storage.

Why this is a strong choice:

Very low cost for simple CRUD to-do data.
Great match for your schema (id, text, completed, timestamps) without needing relational features.
Easy migration path from your current API: swap in table operations behind existing endpoints.
Minimal ops burden since it is fully managed.
...
```

The agent explains that Azure Table Storage is a great fit for your to-do app's storage needs due to its low cost, suitability for your data schema, easy migration path, and fully managed nature.

## Create a deployment template and deploy to Azure

# [VS Code for the Web](#tab/vscode-web)

With the app built and production-ready, use the final prompt to add table storage support and create an Azure Developer CLI template to deploy to Azure. 

Since we're going to use azd to deploy, you need to sign in to Azure in the terminal if you haven't already. Run `azd auth login --use-device-code` and follow the prompts to authenticate.

Copy and paste the following prompt:

```text
Create a deployment template and deploy to Azure:
Change the to-do item persistence to Azure Table Storage.
Create a deployment template that uses Azure Developer CLI.
The template should deploy a resource group, and create free or low-cost resources for the app in Azure.
The template uses environment variables for resource group name, location, and a prefix to prepend to resource names.
Test the template with resource group rg-firstazureexp, location eastus2, and prefix todoapp.
If deployment is misconfigured, diagnose and fix automatically until the live site serves built production files, not source or default pages.
Final verification must confirm HTML references production assets and that the main JS/CSS asset URLs return HTTP 200.
Update the README. Return a concise summary and the app website URL.
```

The agent:

- Creates an Azure Developer CLI (`azd`) infrastructure template with Bicep files that define a resource group, App Service plan, web app, and Azure Table Storage.
- Uses environment variables for the resource group name (`rg-firstazureexp`), location (`eastus2`), and name prefix (`todoapp`).
- Runs `azd up` to provision resources and deploy the application.
- Verifies the live site serves production assets (not source files or default pages).
- Confirms the HTML references production JavaScript and CSS bundles and that those asset URLs return HTTP 200.
- Reports the app name, URL, and a summary of what was deployed.

When the agent finishes, open the URL it reports in your browser. You see your to-do application running on Azure App Service.


# [Local development environment](#tab/local)

Plan mode should have generated an `infra/` directory with an Azure Developer CLI template using Bicep. Review the generated infrastructure code in the `infra/` directory to understand what resources will be deployed.

1. Since we're going to use azd to deploy, you need to sign in to Azure in the terminal if you haven't already. Run:

    ``` azdeveloper
    azd auth login` and follow the prompts to authenticate.
    ```
1. Deploy the application to Azure.

    ``` azdeveloper
    azd up
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
