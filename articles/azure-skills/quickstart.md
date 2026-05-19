---
title: Get started with Azure Skills
description: "Azure Skills quickstart: Deploy your first Azure application in minutes. Learn how to prepare, validate, and launch Node.js apps with step-by-step guidance."
ms.topic: quickstart
ms.date: 03/16/2026
author: diberry
ms.author: diberry
ms.reviewer: alexwolf
ms.service: azure-mcp-server
---

# Get started with Azure Skills

In this quickstart, you prepare, validate, and deploy an application to Azure by using Azure Skills.

## Prerequisites

- Azure Skills installed ([Install and configure Azure Skills](install.md))
- Azure CLI authenticated (`az login` completed successfully)
- GitHub Copilot CLI or Claude Code ready to use
- A sample application (or create a Node.js app)

## Scenario

You have a Node.js application. You want to deploy it to Azure with:

- Web application hosting (Azure App Service)
- A storage account for application data
- Monitoring with Application Insights

## Prepare your application

In your AI assistant, go to your project directory and ask:

```text
Prepare my application for Azure deployment
```

The `azure-prepare` skill:

1. Analyzes your codebase
1. Identifies technology stack (Node.js, npm, and so on)
1. Creates `.azure/plan.md` with a deployment strategy
1. Generates infrastructure as code
1. Waits for your approval

### Review the generated plan

Open `.azure/plan.md` and review:

- **Project Information**—Application name and deployment mode
- **Requirements**—Classification and scale (small, medium, large)
- **Components**—Technologies detected
- **Deployment Strategy**—Technology used to deploy your application (Azure Developer CLI, Bicep, Terraform, or Azure CLI).
- **Architecture**—Azure services selected
- **Implementation Plan**—Step-by-step tasks

Example plan content:

```yaml
# Azure Deployment Plan

## Project Information
- Application: my-app
- Mode: NEW

## Requirements
- Classification: Web Application
- Scale: Small
- Environment: Production

## Components
- Runtime: Node.js 18+
- Package Manager: NPM
- Application Type: Express web server

## Recipe
- Type: AZD (Azure Developer CLI)

## Azure Services
- Azure App Service (web app hosting)
- Azure Storage Account (data)
- Application Insights (monitoring)

## Status: Awaiting Approval
```

### Approve the plan

If the plan looks correct, tell your AI assistant:

```text
Approve this plan and proceed to validation
```

The skill updates the plan status to `Approved` and moves to the next step.

> [!TIP]
> If the skill doesn't recognize your project type, make sure you're in the project root directory with a recognizable project file (`package.json`, `requirements.txt`, `.csproj`, or similar).

## Validate the deployment plan

Your AI assistant runs the `azure-validate` skill to check:

- Azure CLI access and permissions
- Bicep or Terraform template syntax, if applicable
- Azure subscription and region availability
- Service quota limits
- Required permissions for your account

Validation finishes and records proof of all checks in the plan. The plan status updates to `Validated`.

### Review validation results

Check `.azure/plan.md` for the **Validation Proof** section, which shows:

- Commands executed
- Timestamp
- Results (passed or failed)

Example:

```yaml
## Validation Proof
- Command: azd provision --preview
- Timestamp: 2026-03-16T14:22:00Z
- Result: ✓ All validation checks passed
```

If validation fails, review errors and ask your AI assistant to fix issues:

```text
Fix the validation errors and try again
```

> [!TIP]
> If validation fails, check that your Azure account has the required permissions and that the resources specified in the plan are available in your selected region.

## Deploy to Azure

When your plan is validated, tell your AI assistant:

```text
Deploy my application to Azure
```

The `azure-deploy` skill:

1. Confirms plan status is `Validated`
1. Provisions Azure resources (storage, app service, monitoring)
1. Deploys your application code
1. Configures application settings
1. Provides your application endpoint

Deployment typically takes 3-5 minutes.

### View your deployed application

After successful deployment, your AI assistant provides:

- Application URL (for App Service)
- Storage account name and access keys
- Application Insights instrumentation key

Example:

```output
Deployment complete! 

Your app is live at: https://my-app-abcd1234.azurewebsites.net

Resources deployed:
- App Service: my-app-prod
- Storage Account: mystorageabcd1234
- Application Insights: my-app-insights

Monitor your app: https://portal.azure.com/...
```

To verify that your app is running, visit your application URL in a browser.

> [!TIP]
> If deployment fails, check the error output for permission or quota issues. Run `az account show` to verify you're authenticated to the correct subscription.

## Verify your deployment

Test your application:

1. **Visit your URL**—Open the application URL in a browser.
1. **Check monitoring**—View logs in Application Insights.
1. **Test functionality**—Use key features of your app.

Ask your AI assistant for monitoring status:

```text
Show me the application logs and performance metrics
```

Your AI assistant queries Application Insights and displays recent activity, errors, and performance data.

## Update and redeploy

If you make code changes, redeploy easily:

1. **Update your code** in your editor.
1. **Ask your AI assistant:**

   ```text
   Update the deployment with my latest changes
   ```

1. The skill runs `azure-prepare` to check for changes, then `azure-deploy` to update your resources.

Updated resources reuse existing infrastructure. Only changed components redeploy.

## Clean up resources

When you no longer need your application, delete Azure resources to avoid charges:

```text
Delete all Azure resources for this application
```

Your AI assistant:

1. Lists resources to be deleted (for your confirmation)
1. Deletes the resource group and all contents
1. Confirms cleanup complete

Example:

```output
Resources to delete:
- Resource Group: my-app-rg
- All contained resources

Are you sure? (yes/no)
```

Type `yes` to confirm deletion.

## Troubleshooting

### Deployment fails with authentication error

**Problem:** Your AI assistant can't authenticate to Azure.

**Solution:** Reauthenticate by using `az login` and try again.

### Plan validation fails

**Problem:** Azure Skills reports validation errors.

**Solution:** Ask your AI assistant to review and fix issues:

```text
Why did validation fail? Fix the errors.
```

### Application not accessible after deployment

**Problem:** The provided URL returns an error or times out.

**Solution:**

1. Verify the URL is correct.
1. Wait 1-2 minutes for DNS propagation.
1. Check Application Insights logs for errors.

   ```text
   Show me recent errors in Application Insights
   ```

## Next steps

- [Azure Model Context Protocol (MCP) Server documentation](../azure-mcp-server/overview.md)—Deeper technical details
