---
ms.custom: devx-track-js
---

AI-powered tools enhance your JavaScript development workflow on Azure by providing intelligent code assistance, resource management, testing automation, and deployment support.

| Tool | Description |
|------|-------------|
| [GitHub Copilot for Azure](/azure/developer/github-copilot-azure/introduction) | AI-assisted coding with Azure-specific context. Ask questions about Azure services, generate infrastructure code, and get help with Azure SDK usage directly in VS Code. |
| [Azure MCP Server](/azure/developer/azure-mcp-server/overview) | Model Context Protocol tools that connect your IDE to Azure resources. Query resource configurations, manage deployments, and validate settings without leaving your editor. |
| [Azure Skills](/azure/developer/azure-skills) | Composable AI capabilities for Azure workflows including diagnostics, compliance scanning, deployment validation, and resource provisioning — usable from GitHub Copilot or any MCP-compatible client. |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Browser automation tools exposed via MCP for end-to-end testing. Run Playwright tests, capture screenshots, and validate web UI interactions with AI assistance. |
| [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/overview) | Streamline your entire development-to-deployment workflow. Initialize projects from templates, provision infrastructure, and deploy code with a single tool. |

These tools work together to reduce context-switching between your editor and the Azure portal. For example:

* Use **GitHub Copilot** to write Azure SDK code with inline suggestions
* Use the **Azure MCP Server** to verify your resource configurations are correct
* Use **Azure Skills** to run compliance scans or troubleshoot failing deployments
* Use **Playwright MCP** to automate browser-based testing of your Azure-hosted apps
* Use **`azd`** to provision and deploy your application in one step
