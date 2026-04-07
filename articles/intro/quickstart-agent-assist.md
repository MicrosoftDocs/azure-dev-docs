---
title: "Quickstart: Build and deploy to Azure with agentic AI"
description: Use GitHub Copilot agent mode in VS Code to build, configure, and deploy a to-do app to Azure using prompts.
ms.service: azure
ms.topic: quickstart
ms.date: 04/06/2026
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Quickstart: Develop Azure applications with agent-assisted AI

In this quickstart, you use GitHub Copilot agent mode to build a React to-do application and deploy it to Azure App Service using AI prompts. By the end, you have hands-on experience with:

- GitHub Copilot agent mode to scaffold, configure, and deploy a full application
- A working to-do app running on Azure App Service
- An API endpoint for your to-do app
- Azure Developer CLI (azd) to provision and deploy Azure resources from an infrastructure template

Agent mode lets Copilot autonomously run commands, edit files, and iterate on errors. You provide the goal; Copilot figures out the steps.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [GitHub Copilot](https://github.com/features/copilot) subscription

# [VS Code for the Web](#tab/vscode-web)

No local installation required. [VS Code for the Web (vscode.dev/azure)](https://vscode.dev/azure) gives you a browser-based VS Code environment with the Azure Developer CLI, Node.js, and several Azure extensions preinstalled.

1. Open [vscode.dev/azure](https://vscode.dev/azure) in your browser.
1. Sign in by using your Azure account when prompted.

# [Local development environment](#tab/local)

Install the following tools locally to get a full development experience on your machine.

1. [Visual Studio Code](https://code.visualstudio.com/)
1. [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) VS Code extension.
1. [Node.js](https://nodejs.org/) (LTS version recommended).
1. [Azure Developer CLI (azd)](../azure-developer-cli/install-azd.md).
1. [Azure CLI](../cli/azure/install-azure-cli.md).
1. [Azure Skills](https://github.com/microsoft/azure-skills) for enhanced Azure development experience.

---

## Agent mode

Agent mode gives GitHub Copilot the ability to run terminal commands, create and edit files, and self-correct when something goes wrong. You provide a high-level goal, and the agent decides what steps to take.

1. Open the terminal from the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) via **Terminal > Create New Terminal**.
1. Create and change into a new directory for your project.

    ```bash
    mkdir todo-app && cd todo-app
    ```

1. Open the [Copilot Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) view by selecting the chat icon in the Activity Bar.
1. Select **Agent** mode, **Auto** model, **Autopilot** in the chat panel. Agent mode and autopilot allow Copilot to run terminal commands and make file changes autonomously. Auto model lets Copilot choose the best model for each step.

## Build the to-do app

Copy and paste the following prompt into the Copilot chat panel. This prompt instructs the agent to scaffold a React to-do app with Vite, handle version compatibility automatically, and verify the build.

```text
Create a React to-do app using Vite with the JavaScript React template.
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

## Test the React app

Test the app locally by running `npm run dev` in the terminal. 

# [VS Code for the Web](#tab/vscode-web)

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in action. Add, toggle, and remove tasks to confirm everything works as expected.

# [Local development environment](#tab/local)

Open the provided localhost URL in your browser to see the to-do app in action. 

---

Test the to-do app in the browser. Add, remove and change the completion status of tasks to confirm everything works as expected.

When you're done testing, stop the development server by pressing `Ctrl + C` in the terminal.

## Production configuration and API support

Since we're going to use more Azure services, verify that the Azure MCP server is started. This lets the agent use Azure Skills to create and manage Azure resources.

1. Open the command palette.
1. Select **MCP: List servers**.
1. If the Azure MCP server is not running, start it by selecting **Azure MCP** > **Start server**.

Update the app for production hosting on Azure App Service. Add functionality to support calling an API for to-do functions.

Copy and paste the following prompt:

```text
Add production behavior and API support:
Persist the to-do items in localStorage.
Create an API endpoint that supports POST, PATCH, and DELETE for to-do functionality.
Add Swagger UI at /swagger with an OpenAPI file configured to use a relative server URL.
The to-do app should fetch from the API endpoint.
onfigure it for Azure App Service so npm run build creates production output and npm start serves that output.
Update the README with the changes. Return a concise summary of what was done.
```

The agent:

1. Adds localStorage persistence so your tasks remain after page refreshes.
1. Creates an API endpoint for to-do operations that supports POST, PATCH, and DELETE requests.
1. Adds Swagger UI at `/swagger` and configures the OpenAPI document to use a relative server URL.
1. Updates the client app to fetch to-do data and actions through the API endpoint.
1. Configures the app for Azure App Service so `npm run build` creates production assets and `npm start` serves them, then updates the `README` with the implementation details.

Review the chat output and confirm the local verification passed.

## Test the host configuration and API

Test the production server locally by running `npm start` in the terminal.

# [VS Code for the Web](#tab/vscode-web)

In the **Ports** tab, open the **Forwarded Address** port URL in your browser to see the to-do app in action. Add, toggle, and remove tasks to confirm everything works as expected.

# [Local development environment](#tab/local)

Open the provided localhost URL in your browser. For example, `http://localhost:3000`.

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

You built and deployed an application using three prompts. Explore more ways to develop with Azure:

- [Azure Developer CLI templates](../azure-developer-cli/azd-templates.md) - Find templates for different languages and architectures.
- [GitHub Copilot for Azure documentation](../github-copilot-azure/introduction.md) - Learn more about AI-assisted Azure development.
- [Azure App Service documentation](/azure/app-service/) - Learn about hosting web applications on Azure.
- [VS Code for the Web for Azure development](https://code.visualstudio.com/docs/azure/vscodeforweb) - Learn more about the browser-based development environment.
