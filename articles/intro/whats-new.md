---
title: "Azure developer documentation: What's new"
description: "What's new in the Azure developer documentation."
ms.date: 08/10/2026
ai-usage: ai-generated
author: KarlErickson
ms.author: karler
ms.topic: whats-new
---

# Azure developer documentation: What's new

Welcome to what's new in the [Azure developer documentation](../index.yml) for the last three months. This article lists some of the major changes to docs during this period.

## What's new for July 2026

### Azure Developer CLI (azd)

New articles:

- [Extension development concepts](../azure-developer-cli/extensions/develop/extension-development-concepts.md)
- [Quickstart: Build a sample azd extension](../azure-developer-cli/extensions/develop/quickstart-build-extension.md)
- [Define the extension manifest](../azure-developer-cli/extensions/develop/extension-manifest.md)
- [Add extension capabilities](../azure-developer-cli/extensions/develop/extension-capabilities.md)
- [Communicate with azd by using the SDK](../azure-developer-cli/extensions/develop/extension-sdk.md)
- [Add an MCP server to an extension](../azure-developer-cli/extensions/develop/extension-mcp-server.md)
- [Publish an extension](../azure-developer-cli/extensions/develop/publish-extensions.md)
- [Reminder tool for self-scheduling agents](/azure/foundry/agents/how-to/tools/reminder-tool?pivots=azd)
- [Use a toolbox with a hosted agent](/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent?pivots=azd)

Updated articles:

- [Microsoft Foundry agent extension overview](../azure-developer-cli/extensions/azure-ai-foundry-extension.md) - Rewrote the extension guide around the new `azd ai agent init` workflow for scaffolding and deploying Microsoft Foundry agents.
- [Create an Azure DevOps CI/CD pipeline using the Azure Developer CLI](../azure-developer-cli/pipeline-azure-pipelines.md) - Corrected the docs to reflect that OIDC/federated authentication is now the default for Azure Pipelines integration.
- [Manage Azure development tools with `azd tool`](../azure-developer-cli/development-tools.md) - Documented new non-interactive auto-detection for CI and AI-agent environments, plus overrides and an opt-out for `azd tool` checks.
- [Azure Developer CLI tooling and environment FAQ](../azure-developer-cli/tooling-environment-faq.md) - Updated the FAQ to reflect OIDC/federated authentication as the default for Azure DevOps pipeline configuration.
- [Azure Developer CLI schema reference](../azure-developer-cli/azd-schema.md) - Added new Microsoft Foundry declarative host types (`azure.ai.project`, `azure.ai.connection`, `azure.ai.toolbox`, `azure.ai.skill`, `azure.ai.routine`) and new `azure.ai.agent` properties to the `azure.yaml` schema.
- [Azure Developer CLI reference](../azure-developer-cli/reference.md) - Added the new `azd config sub-filter` and `azd tool uninstall` commands to the generated CLI reference.

### Azure for .NET developers

New articles:

- [Reminder tool for self-scheduling agents](/azure/foundry/agents/how-to/tools/reminder-tool?pivots=programming-language-csharp)
- [Use a toolbox with a hosted agent](/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent?pivots=dotnet)
- [Host Microsoft Agent Framework agents as Foundry hosted agents](/azure/foundry/how-to/develop/framework-hosted-agents?pivots=programming-language-csharp)
- [Migrating legacy .NET and Windows applications to Azure Kubernetes Service (AKS) – a step-by-step guide](/azure/aks/migrate-legacy-dotnet-to-aks)
- [Quickstart: Build a serverless workflow using Durable Functions](/azure/azure-functions/scenario-build-serverless-workflow?pivots=programming-language-csharp)
- [Configure on-demand sandboxes for Durable Task Scheduler (preview)](/azure/durable-task/scheduler/durable-task-scheduler-configure-on-demand-sandboxes?pivots=csharp)

### Azure for Go developers

New articles:

- [Fast transcription containers with Docker (preview)](/azure/ai-services/speech-service/speech-container-ft)

### Azure for Java developers

New articles:

- [Quickstart: Build a serverless workflow using Durable Functions](/azure/azure-functions/scenario-build-serverless-workflow?pivots=programming-language-java)

Updated articles:

- [Tutorial: Connect to PostgreSQL Database from a Java Quarkus Container App without secrets using a managed identity](/azure/container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database) - Replaced the Service Connector-based setup with an explicit system-assigned managed identity workflow, including Microsoft Entra admin and database-role configuration steps.

### Azure for JavaScript developers

New articles:

- [Reminder tool for self-scheduling agents](/azure/foundry/agents/how-to/tools/reminder-tool?pivots=programming-language-javascript)
- [Use a toolbox with a hosted agent](/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent?pivots=javascript)
- [Quickstart: Build a serverless workflow using Durable Functions](/azure/azure-functions/scenario-build-serverless-workflow?pivots=programming-language-javascript)
- [Stream HTTP requests and responses in Node.js Azure Functions](/azure/azure-functions/node-http-stream)
- [Optimize performance and scaling for Node.js Azure Functions](/azure/azure-functions/node-scale-performance)
- [Build and deploy TypeScript Azure Functions apps](/azure/azure-functions/typescript-build-options)

### Azure for Python developers

New articles:

- [Reminder tool for self-scheduling agents](/azure/foundry/agents/how-to/tools/reminder-tool?pivots=programming-language-python)
- [Use a toolbox with a hosted agent](/azure/foundry/agents/how-to/tools/use-toolbox-hosted-agent?pivots=python)
- [Host Microsoft Agent Framework agents as Foundry hosted agents](/azure/foundry/how-to/develop/framework-hosted-agents?pivots=programming-language-python)
- [Quickstart: Build a serverless workflow using Durable Functions](/azure/azure-functions/scenario-build-serverless-workflow?pivots=programming-language-python)
- [Configure on-demand sandboxes for Durable Task Scheduler (preview)](/azure/durable-task/scheduler/durable-task-scheduler-configure-on-demand-sandboxes?pivots=python)
- [Fast transcription containers with Docker (preview)](/azure/ai-services/speech-service/speech-container-ft)
- [Migrate to type-safe serialization in Durable Functions for Python](/azure/durable-task/durable-functions/durable-functions-python-type-safe-serialization-migrate)

Updated articles:

- [Get started with chat private endpoints for Python](../python/get-started-app-chat-private-endpoint.md) - Added a "Clean up Azure resources" section documenting `azd down --purge` and fixed a broken code fence.

### Azure MCP Server

New articles:

- [Secure your Azure MCP Server deployment](../azure-mcp-server/security.md)
- [Azure MCP Server tools for Azure Insights](../azure-mcp-server/tools/azure-insights.md)
- [Azure MCP Server tools for Azure Resilience](../azure-mcp-server/tools/azure-resilience.md)

Updated articles:

- [Azure MCP Server tools for Azure Advisor](../azure-mcp-server/tools/azure-advisor.md) - Added new **Recommendation: summary** and **Recommendation type: list** tools for aggregating and cataloging Azure Advisor recommendations.
- [Azure MCP Server tools for Azure Database for MySQL](../azure-mcp-server/tools/azure-mysql.md) - Made the resource group and user name parameters optional, so a single call can now list all Azure Database for MySQL servers across a subscription.
- [Azure File Sync Tools](../azure-mcp-server/tools/azure-file-sync.md) - Added a **Tags** parameter to the create-service tool and removed the **Cloud endpoint: Trigger change detection** tool.

### Azure Skills

New articles:

- [Azure skill for python-appservice-deploy](../azure-skills/skills/python-app-service-deploy.md)

Updated articles:

- [Install and configure Azure Skills](../azure-skills/install.md) - Added Visual Studio sign-in and VS Installer setup instructions.
- [Azure skill for Azure Cloud Migrate](../azure-skills/skills/azure-cloud-migrate.md) - Expanded migration scenario coverage to include Heroku, Google App Engine, and AWS Fargate/EKS/GKE, plus Spring Boot migrations.
- [Azure Compute](../azure-skills/skills/azure-compute.md) - Removed VM connectivity troubleshooting scope, now covered by the Azure Diagnostics skill.
- [Azure skill for Azure Cost Management](../azure-skills/skills/azure-cost.md) - Added example prompts and removed the AKS prerequisite and related-tools table.
- [Azure skill for diagnostics](../azure-skills/skills/azure-diagnostics.md) - Gained VM connectivity and troubleshooting scope from the Azure Compute skill.
- [Azure skill for Azure Upgrade](../azure-skills/skills/azure-upgrade.md) - Added Azure Cache for Redis-to-Azure Managed Redis migration guidance and expanded Java SDK modernization coverage.
- [Azure skill for Microsoft Foundry](../azure-skills/skills/microsoft-foundry.md) - Added agent routine scheduling (timer, cron, and GitHub issue triggers), real-time voice/streaming support, and model fine-tuning capabilities.

### GitHub Copilot modernization

Updated articles:

- [GitHub Copilot modernization for JavaScript/TypeScript developers](../github-copilot-app-modernization/javascript-typescript-overview.md) - Added Visual Studio support alongside the existing Visual Studio Code support.
- [Quickstart: Upgrade npm packages in a JavaScript or TypeScript project by using GitHub Copilot modernization](../github-copilot-app-modernization/javascript-typescript-quickstart-upgrade-npm-packages.md) - Added Visual Studio support alongside the existing Visual Studio Code support.

### Terraform on Azure

Updated articles:

- [Overview of the Azure Terraform Resource Provider](../terraform/azure-export-for-terraform/resource-provider-overview.md) - Documented a limit of 1,000 resources when exporting in resource group mode.



## What's new for June 2026

### AI apps using Azure services

New articles:

- [Deploy Claude models in Microsoft Foundry using Bicep or Terraform](../ai/how-to/deploy-claude-foundry.md)
- [Upgrade your Azure OpenAI app from Chat Completions to the Responses API](../ai/how-to/azure-openai-to-responses.md)

### AI developer tools

Updated articles:

- [Azure AI developer tools overview](../ai-developer-tools/overview.md) - Added prerequisites and Visual Studio 2022 v17.14.30+ guidance for built-in Azure MCP tools.

### Azure Developer CLI (azd)

New articles:

- [Manage Azure development tools with `azd tool`](../azure-developer-cli/development-tools.md)
- [Agent development with the Azure Developer CLI](/azure/foundry/agents/concepts/cli-agent-development)
- [Hosted agent infrastructure with the Azure Developer CLI](/azure/foundry/agents/concepts/cli-infrastructure)
- [Set the Foundry project context for azd commands](/azure/foundry/agents/how-to/cli-project-context)
- [Initialize a hosted agent project with the Azure Developer CLI](/azure/foundry/agents/how-to/init-agent-project)
- [Install the Azure Developer CLI Foundry extensions](/azure/foundry/agents/how-to/install-cli-foundry-extensions)
- [Invoke a hosted agent with the Azure Developer CLI](/azure/foundry/agents/how-to/invoke-hosted-agent)
- [Isolate hosted agent sessions per user](/azure/foundry/agents/how-to/isolate-sessions-per-user?pivots=azd)
- [Monitor hosted agent logs with the Azure Developer CLI](/azure/foundry/agents/how-to/monitor-hosted-agent-logs)
- [Run a hosted agent locally with the Azure Developer CLI](/azure/foundry/agents/how-to/run-hosted-agent-locally)
- [Set up CI/CD for hosted agents with the Azure Developer CLI](/azure/foundry/agents/how-to/set-up-ci-cd-cli)
- [Add managed MCP servers powered by connector namespaces (preview)](/azure/foundry/agents/how-to/tools/connectors?pivots=azd)
- [Use azd ai with coding agents and scripts](/azure/foundry/agents/how-to/use-cli-with-coding-agents)
- [Quickstart: Build a toolbox and use it with a hosted agent](/azure/foundry/agents/quickstarts/quickstart-toolbox-agent?pivots=azd)
- [Quickstart: Hosted agent CI/CD templates](/azure/foundry/agents/quickstarts/set-up-cicd-hosted-agent)
- [Run agent evaluations with the azd CLI (preview)](/azure/foundry/observability/how-to/azure-developer-cli-evaluation)

Updated articles:

- [Supported languages and environments](../azure-developer-cli/supported-languages-environments.md) - Added preview guidance for deploying Go Azure Functions with `azd`, including `azure.yaml` settings and Go-specific deployment constraints.
- [Deploy an agent to Microsoft Foundry with the Azure Developer CLI AI agent extension](../azure-developer-cli/extensions/azure-ai-foundry-extension.md) - Updated hosted agents regional availability guidance to point to the current Foundry availability list.
- [Deploy to Azure App Service deployment slots with Azure Developer CLI](../azure-developer-cli/app-service-slots.md) - Documented `AZD_DEPLOY_<SERVICE_NAME>_IGNORE_SLOTS` and updated slot-selection behavior for CI and direct-to-main deployments.
- [Deploy to a Microsoft Foundry or Azure Machine Learning studio online endpoint](../azure-developer-cli/azure-ai-ml-endpoints.md) - Replaced the invalid `agent.yaml` example with a hosted schema-based sample and documented the supported `kind` values for `azd`.
- [Use Terraform as an infrastructure as code tool for Azure Developer CLI](../azure-developer-cli/use-terraform-for-azd.md) - Added Azure CLI authentication guidance for Terraform-based `azd` deployments, including the recommended `auth.useAzCliAuth` flow.
- [Customize your Azure Developer CLI workflows using command and event hooks](../azure-developer-cli/azd-extensibility.md) - Documented optional `shell` behavior, OS-specific defaults, and cross-platform inline hook guidance.
- [Azure Developer CLI schema reference](../azure-developer-cli/azd-schema.md) - Added Go language values plus updated hook-shell and Go remote-build behavior in the `azure.yaml` schema reference.
- [Azure Developer CLI reference](../azure-developer-cli/reference.md) - Added `azd tool` command documentation and refreshed auth, extension upgrade, and init behavior details.

### Azure for .NET developers

New articles:

- [Enable telemetry and tracing for Voice Live](/azure/ai-services/speech-service/how-to-voice-live-telemetry?pivots=programming-language-csharp)
- [Getting started with Browser automation tool (preview) in Hosted agents](/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart?pivots=csharp)
- [Quickstart: Build agents using the Responses API](/azure/foundry/agents/quickstarts/responses-api?pivots=csharp)
- [Create an indexed Azure SQL knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-azure-sql?pivots=csharp)
- [Create a Fabric Data Agent knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-fabric-data-agent?pivots=csharp)
- [Create a Fabric Ontology knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-fabric-ontology?pivots=csharp)
- [Create a file knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-file?pivots=csharp)
- [Create an MCP Server knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-mcp-server?pivots=csharp)
- [Create a Work IQ knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-work-iq?pivots=csharp)
- [Configure freshness-aware retrieval in Azure AI Search (preview)](/azure/search/agentic-retrieval-how-to-configure-freshness?pivots=csharp)
- [Use paging with Azure AI Search list APIs](/azure/search/search-how-to-page-list-results?pivots=csharp)
- [Update application client certificates for Azure HorizonDB (Preview)](/azure/horizondb/security/security-update-trusted-root-java)
- [Tutorial: Monitor a multi-agent app on App Service with OpenTelemetry and Application Insights (.NET)](/azure/app-service/tutorial-ai-agent-monitoring-dotnet)
- [Develop Azure Functions locally by using the Azure Functions CLI (preview)](/azure/azure-functions/functions-cli-develop-local?pivots=programming-language-csharp)
- [Use connectors in Azure Functions](/azure/azure-functions/functions-connectors-overview?pivots=programming-language-csharp)
- [Quickstart: Create a C# Durable Functions app](/azure/durable-task/durable-functions/durable-functions-isolated-create-first-csharp)
- [Create Standard workflow projects with C# by using the Azure Logic Apps Standard SDK (preview)](/azure/logic-apps/standard-sdk/create-workflows-with-csharp)
- [Handle timeouts and configure retries in Azure Service Bus](/azure/service-bus-messaging/service-bus-timeouts-retries)

### Azure for Go developers

New articles:

- [Develop Azure Functions locally by using the Azure Functions CLI (preview)](/azure/azure-functions/functions-cli-develop-local?pivots=programming-language-go)
- [Azure Functions Go developer reference](/azure/azure-functions/functions-reference-go)

### Azure for Java developers

New articles:

- [Install GitHub Copilot modernization in your IDE](../java/migration/github-copilot-app-modernization-for-java-ide-install.md)
- [Secure your Java applications with GitHub Copilot modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-secure-your-application.md)
- [Enable telemetry and tracing for Voice Live](/azure/ai-services/speech-service/how-to-voice-live-telemetry?pivots=programming-language-java)
- [Getting started with Browser automation tool (preview) in Hosted agents](/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart?pivots=java)
- [Develop Azure Functions locally by using the Azure Functions CLI (preview)](/azure/azure-functions/functions-cli-develop-local?pivots=programming-language-java)
- [Use connectors in Azure Functions](/azure/azure-functions/functions-connectors-overview?pivots=programming-language-java)
- [Quickstart: Use Java and JDBC for Azure HorizonDB (Preview)](/azure/horizondb/connectivity/connect-java)
- [Quickstart: Create a Java Durable Functions app](/azure/durable-task/durable-functions/quickstart-java)
- [How to install Azure Command Launcher for Java](/java/jaz/install)
- [Reasons to move to Java 25](/java/openjdk/reasons-to-move-to-java-25)

Updated articles:

- [GitHub Copilot modernization for Java developers](../java/migration/migrate-github-copilot-app-modernization-for-java.md) - Added Java 25 support, an embedded video, and Azure Command Launcher guidance for post-upgrade JVM tuning.
- [Modernize Java apps by using GitHub Copilot modernization in the Copilot CLI](../java/migration/github-copilot-app-modernization-for-java-copilot-cli.md) - Added a capability table and clarified the Copilot CLI modernization plugin workflow for upgrade, migration, and deployment tasks.
- [Modernize Java apps by using GitHub Copilot modernization in the cloud agent](../java/migration/github-copilot-app-modernization-for-java-coding-agent.md) - Refreshed the cloud agent workflow with updated naming, prerequisites, and onboarding guidance.
- [Predefined tasks for GitHub Copilot modernization for Java developers](../java/migration/migrate-github-copilot-app-modernization-for-java-predefined-tasks.md) - Expanded predefined migration guidance for RabbitMQ-to-Service Bus scenarios and refreshed the task descriptions.
- [Understand assessment coverage by GitHub Copilot modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-assess-rules.md) - Added dependency CVE scanning coverage, severity controls, and clearer CWE versus CVE assessment guidance.
- [Optimize chat results for migrating Java apps to Azure](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-chat-window.md) - Renamed the custom agent to `modernize` and updated the recommended model guidance to Claude Sonnet 4.6.
- [Quickstart: Deploy your project to Azure by using GitHub Copilot modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-deploy-to-azure.md) - Reworked the deploy quickstart with Visual Studio Code and IntelliJ-specific flows plus improved custom prompt guidance.
- [Re-architect projects by using GitHub Copilot modernization](../java/migration/github-copilot-app-modernization-for-java-rearchitecture.md) - Removed preview-only enablement steps and updated the re-architecture workflow to use the `modernize` agent and new artifact locations.
- [Containerize your Java applications](../java/containers/overview.md) - Added Azure Command Launcher for Java guidance so containerized apps can autotune JVM settings instead of hand-tuning flags.
- [Containerize your Java applications for Kubernetes](../java/containers/kubernetes.md) - Added Azure Command Launcher for Java instructions for Kubernetes deployments and container images.

### Azure for JavaScript developers

New articles:

- [Enable telemetry and tracing for Voice Live](/azure/ai-services/speech-service/how-to-voice-live-telemetry?pivots=programming-language-javascript)
- [Getting started with Browser automation tool (preview) in Hosted agents](/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart?pivots=typescript)
- [Develop Azure Functions locally by using the Azure Functions CLI (preview)](/azure/azure-functions/functions-cli-develop-local?pivots=programming-language-javascript)
- [Use connectors in Azure Functions](/azure/azure-functions/functions-connectors-overview?pivots=programming-language-javascript)
- [Quickstart: Create a JavaScript Durable Functions app](/azure/durable-task/durable-functions/quickstart-js-vscode)
- [Quickstart: Create a TypeScript Durable Functions app](/azure/durable-task/durable-functions/quickstart-ts-vscode)

### Azure for Python developers

New articles:

- [Isolate hosted agent sessions per user](/azure/foundry/agents/how-to/isolate-sessions-per-user?pivots=python)
- [Enable telemetry and tracing for Voice Live](/azure/ai-services/speech-service/how-to-voice-live-telemetry?pivots=programming-language-python)
- [Getting started with Browser automation tool (preview) in Hosted agents](/azure/foundry/agents/how-to/tools/browser-automation-hosted-agent-quickstart?pivots=python)
- [Quickstart: Build agents using the Responses API](/azure/foundry/agents/quickstarts/responses-api?pivots=python)
- [Create an indexed Azure SQL knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-azure-sql?pivots=python)
- [Create a Fabric Data Agent knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-fabric-data-agent?pivots=python)
- [Create a Fabric Ontology knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-fabric-ontology?pivots=python)
- [Create a file knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-file?pivots=python)
- [Create an MCP Server knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-mcp-server?pivots=python)
- [Create a Work IQ knowledge source (preview)](/azure/search/agentic-knowledge-source-how-to-work-iq?pivots=python)
- [Configure freshness-aware retrieval in Azure AI Search (preview)](/azure/search/agentic-retrieval-how-to-configure-freshness?pivots=python)
- [Use paging with Azure AI Search list APIs](/azure/search/search-how-to-page-list-results?pivots=python)
- [Develop Azure Functions locally by using the Azure Functions CLI (preview)](/azure/azure-functions/functions-cli-develop-local?pivots=programming-language-python)
- [Use connectors in Azure Functions](/azure/azure-functions/functions-connectors-overview?pivots=programming-language-python)
- [Deploy open-source models with managed compute (Preview)](/azure/foundry/how-to/deploy-models-managed?pivots=python-sdk)
- [Quickstart: Use Python to connect and query data for Azure HorizonDB (Preview)](/azure/horizondb/connectivity/connect-python)
- [Quickstart: Create a Python Durable Functions app](/azure/durable-task/durable-functions/quickstart-python-vscode)

Updated articles:

- [Deploy Python web apps to App Service by using GitHub Actions (Linux)](../python/python-web-app-github-actions-app-service.md) - Updated the App Service quickstart command to use Python 3.12.

### Azure MCP Server

New articles:

- [Azure MCP Server concepts](../azure-mcp-server/concepts.md)
- [Azure Policy tools for Azure MCP Server overview](../azure-mcp-server/tools/azure-policy.md)
- [Manage Azure Functions with Azure MCP Server](../azure-mcp-server/azure-services/azure-mcp-server-for-functions.md)
- [Manage Azure Key Vault with Azure MCP Server](../azure-mcp-server/azure-services/azure-mcp-server-for-key-vault.md)
- [Manage Azure Redis with Azure MCP Server](../azure-mcp-server/azure-services/azure-mcp-server-for-redis.md)
- [Azure File Sync Tools](../azure-mcp-server/tools/azure-file-sync.md)
- [Azure MCP Server tools for Azure Backup](../azure-mcp-server/tools/azure-backup.md)
- [Azure MCP Server tools for Azure Device Registry](../azure-mcp-server/tools/azure-device-registry.md)

Updated articles:

- [What is the Azure MCP Server?](../azure-mcp-server/overview.md) - Added prerequisites and Visual Studio 2022 built-in Azure MCP tool guidance to the overview.
- [Connect GitHub Copilot cloud agent to the Azure MCP Server](../azure-mcp-server/how-to/github-copilot-coding-agent.md) - Updated the article for the Copilot cloud agent naming and clarified that the existing `coding-agent` extension and CLI command names remain unchanged.
- [Azure Advisor tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-advisor.md) - Added an Advisor recommendation-application tool and expanded the recommendation-listing guidance.
- [Azure MCP Server tools for Azure Cosmos DB](../azure-mcp-server/tools/azure-cosmos-db.md) - Added new Cosmos DB tools for fetching items, listing recent changes, full-text search, vector search, and schema inference.
- [Azure MCP Server tools for Azure Database for MySQL](../azure-mcp-server/tools/azure-mysql.md) - Updated MySQL tool parameters to remove required user-name inputs from several server operations.
- [Azure Database for PostgreSQL tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-database-postgresql.md) - Added optional auth and password inputs and relaxed required authentication fields for PostgreSQL operations.
- [Azure MCP Server tools for Azure Deploy](../azure-mcp-server/tools/azure-deploy.md) - Documented local-required behavior and made several deployment-plan parameters optional.
- [Azure MCP Server tools for Azure File Shares](../azure-mcp-server/tools/azure-file-shares.md) - Added the NFS encryption-in-transit parameter to Azure File Shares operations.
- [Azure Kubernetes Service tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-kubernetes.md) - Updated AKS tool parameters to require a resource group and make node pool selection optional.

### Azure Skills

New articles:

- [Azure skill for reliability](../azure-skills/skills/azure-reliability.md)

Updated articles:

- [Azure skill for App Insights instrumentation](../azure-skills/skills/app-insights-instrumentation.md) - Expanded the skill to cover instrumentation guidance across ASP.NET, Node.js, Python, and Java, with stronger prompts and references.
- [Azure skill for AI Gateway](../azure-skills/skills/azure-ai-gateway.md) - Reworked the skill around API Management as a centralized AI gateway with routing, load balancing, and safety guidance.
- [Azure skill for AI Services](../azure-skills/skills/azure-ai.md) - Expanded the skill to cover Azure AI Search, Speech, OpenAI, and Document Intelligence with new prompts and references.
- [Azure skill for compliance](../azure-skills/skills/azure-compliance.md) - Expanded the skill to combine `azqr`, Key Vault expiration checks, orphaned-resource detection, and compliance references.
- [Azure skill for compute](../azure-skills/skills/azure-compute.md) - Rewrote the skill to cover VM and VMSS sizing, deployment, troubleshooting, capacity reservations, and Essential Machine Management guidance.
- [Azure skill for diagnostics](../azure-skills/skills/azure-diagnostics.md) - Added App Service, Azure Functions, Event Hubs, and Service Bus troubleshooting coverage and prompts.
- [Azure skill for enterprise infrastructure planning](../azure-skills/skills/azure-enterprise-infra-planner.md) - Expanded the skill with environment-aware planning guidance, multiregion patterns, and architecture references.
- [Azure skill for Hosted Copilot SDK](../azure-skills/skills/azure-hosted-copilot-sdk.md) - Expanded the skill with CopilotClient, bring-your-own-model, deployment guidance, when-not-to-use guidance, and automatic activation notes.
- [Azure skill for messaging](../azure-skills/skills/azure-messaging.md) - Expanded Event Hubs and Service Bus troubleshooting guidance across Python, Java, JavaScript, and .NET.
- [Azure skill for quotas](../azure-skills/skills/azure-quotas.md) - Expanded the skill to cover quota requests, regional comparisons, `az quota` prerequisites, and planning scenarios.
- [Azure skill for resource lookup](../azure-skills/skills/azure-resource-lookup.md) - Expanded the skill with Resource Graph, tag and orphan analysis, cross-subscription inventory, and when-not-to-use guidance.
- [Azure skill for storage](../azure-skills/skills/azure-storage.md) - Expanded the skill to cover Blob, Files, Queue, Table, and Data Lake scenarios plus new prerequisites and references.
- [Azure skill for validate](../azure-skills/skills/azure-validate.md) - Broadened predeployment validation guidance for Bicep, Terraform, quotas, RBAC, and policy checks.
- [Azure skill for Entra app registration](../azure-skills/skills/entra-app-registration.md) - Expanded app registration, OAuth, and MSAL guidance with when-not-to-use notes and security references.

### GitHub Copilot for Azure

Updated articles:

- [What is GitHub Copilot for Azure?](../github-copilot-azure/introduction.md) - Added detailed Visual Studio 2022 built-in Azure MCP tool support guidance, including version, enablement, and sign-in requirements.

### GitHub Copilot modernization

New articles:

- [Batch plan with the GitHub Copilot modernization agent](../github-copilot-app-modernization/modernization-agent/batch-plan.md)
- [Customize the modernization plan when using GitHub Copilot modernization](../github-copilot-app-modernization/customize-modernization-plan.md)
- [GitHub Copilot modernization for JavaScript/TypeScript developers](../github-copilot-app-modernization/javascript-typescript-overview.md)
- [Quickstart: Upgrade npm packages in a JavaScript or TypeScript project by using GitHub Copilot modernization](../github-copilot-app-modernization/javascript-typescript-quickstart-upgrade-npm-packages.md)

Updated articles:

- [GitHub Copilot modernization](../github-copilot-app-modernization/overview.md) - Added C++ as a supported modernization ecosystem in the overview.
- [Languages and frameworks supported by GitHub Copilot modernization](../github-copilot-app-modernization/languages.md) - Added C++ support details and JavaScript/TypeScript npm package upgrade support.
- [Quickstart: Install and use the GitHub Copilot modernization agent](../github-copilot-app-modernization/modernization-agent/quickstart.md) - Updated the agent quickstart with the new Assess, Plan, and Execute menu flow and walkthrough.
- [GitHub Copilot modernization agent CLI commands](../github-copilot-app-modernization/modernization-agent/cli-commands.md) - Documented new CLI options such as `--assess-config`, `--assess-file-path`, and expanded cloud-agent execution behavior.
- [Batch assessment with the GitHub Copilot modernization agent](../github-copilot-app-modernization/modernization-agent/batch-assess.md) - Expanded batch assessment to cover JavaScript/TypeScript projects, monorepos, and separate issue-scanning versus codebase-insight outputs.
- [Configure settings for GitHub Copilot modernization to optimize the experience for IntelliJ](../github-copilot-app-modernization/configure-settings-intellij.md) - Simplified IntelliJ setup by removing obsolete MCP auto-approve and model-access steps and focusing on max-requests guidance.
- [Quickstart: Upgrade a Java project with GitHub Copilot modernization](../github-copilot-app-modernization/quickstart-upgrade.md) - Expanded the Java upgrade quickstart for newer targets, IDE and CLI flows, and richer plan and execution guidance.
- [Quickstart: generate Java unit tests with GitHub Copilot modernization](../github-copilot-app-modernization/quickstart-unit-tests.md) - Expanded the unit-test quickstart to cover Visual Studio Code, IntelliJ, and CLI workflows plus the generated work log and result summary.
- [Customize the Java project upgrade plan when using GitHub Copilot modernization](../github-copilot-app-modernization/customize-upgrade-plan.md) - Updated Java upgrade plan customization guidance for the new plan structure and build-option syntax.
- [GitHub Copilot modernization Java utilities](../github-copilot-app-modernization/tools.md) - Renamed the Java utilities to `#appmod-...` prompt tools and streamlined the documented CVE and test-generation workflows.



## What's new for May 2026

### AI apps using Azure services

New articles:

- [Get started with Azure OpenAI and the Responses API](../ai/get-started-azure-openai-starter-kit.md)

Updated articles:

- [Create hosted agent workflows in the Microsoft Foundry Toolkit for Visual Studio Code extension](/azure/foundry/agents/how-to/vs-code-agents-workflow-pro-code) - Added a hosted agent workflow tutorial for the Microsoft Foundry Toolkit in Visual Studio Code, including project creation, local testing, and deployment to Foundry Agent Service.

### Azure Developer CLI (azd)

Updated articles:

- [Use Docker support to deploy containerized apps in any language](../azure-developer-cli/docker-language-support.md) - Expanded Docker language guidance to explicitly cover Go, Rust, Ruby, PHP, Kotlin, and other unsupported or polyglot apps.
- [Azure Developer CLI schema reference](../azure-developer-cli/azd-schema.md) - Documented the `dependsOn` layer property for declaring hook-mediated infrastructure dependencies.
- [Azure Developer CLI reference](../azure-developer-cli/reference.md) - Added `azd exec` and refreshed reference guidance for non-interactive `--no-prompt` behavior and consent actions.

### Azure for .NET developers

New articles:

- [Generate text embeddings with Foundry Local](/azure/foundry-local/how-to/how-to-generate-embeddings?pivots=programming-language-csharp)
- [Live transcribe audio from a microphone with Foundry Local](/azure/foundry-local/how-to/how-to-live-transcribe-audio?pivots=programming-language-csharp)
- [Use Agent Framework in a .NET console app with Azure App Configuration](/azure/azure-app-configuration/howto-ai-agent-config-dotnet)
- [MCP prompt trigger for Azure Functions (public preview)](/azure/azure-functions/functions-bindings-mcp-prompt-trigger?pivots=programming-language-csharp)
- [Quickstart: Vector index with .NET in Azure DocumentDB](/azure/documentdb/quickstart-dotnet-select-algorithm)

### Azure for Go developers

New articles:

- [Quickstart: Vector index with Go in Azure DocumentDB](/azure/documentdb/quickstart-go-select-algorithm)

### Azure for Java developers

New articles:

- [MCP prompt trigger for Azure Functions (public preview)](/azure/azure-functions/functions-bindings-mcp-prompt-trigger?pivots=programming-language-java)
- [Enable features on a schedule in a Spring Boot application](/azure/azure-app-configuration/how-to-time-window-filter-spring-boot)
- [Choose between JMS and the native SDK for Azure Service Bus](/azure/service-bus-messaging/service-bus-jms-versus-native-sdk)
- [Troubleshoot Java applications on AKS with Azure SRE Agent](/azure/sre-agent/troubleshoot-java-aks)
- [Quickstart: Vector index with Java in Azure DocumentDB](/azure/documentdb/quickstart-java-select-algorithm)

Updated articles:

- [Quickstart: Containerize your project by using GitHub Copilot modernization](../java/migration/migrate-github-copilot-app-modernization-for-java-quickstart-containerization.md) - Added Docker image vulnerability scanning as part of the containerization workflow.
- [Re-architect projects by using GitHub Copilot modernization](../java/migration/github-copilot-app-modernization-for-java-rearchitecture.md) - Added rearchitecture scenarios for Struts, WebSphere, WinForms, and ASP.NET MVC migrations.
- [Secure Java Spring Boot apps using Microsoft Entra ID](../java/identity/enable-spring-boot-webapp-authentication-entra-id.md) - Updated the app registration steps to use the current single-tenant option label and client secret duration choices.

### Azure for JavaScript developers

New articles:

- [Generate text embeddings with Foundry Local](/azure/foundry-local/how-to/how-to-generate-embeddings?pivots=programming-language-javascript)
- [Live transcribe audio from a microphone with Foundry Local](/azure/foundry-local/how-to/how-to-live-transcribe-audio?pivots=programming-language-javascript)
- [MCP prompt trigger for Azure Functions (public preview)](/azure/azure-functions/functions-bindings-mcp-prompt-trigger?pivots=programming-language-typescript)
- [Quickstart: Vector index with TypeScript in Azure DocumentDB](/azure/documentdb/quickstart-nodejs-select-algorithm)

Updated articles:

- [What is Azure for JavaScript developers](../javascript/what-is-azure-for-javascript-development.md) - Added AI and developer tools guidance plus new next-step links for learning, samples, SDKs, and deployment options.
- [JavaScript developer tools for Azure overview](../javascript/node-azure-tools.md) - Added an AI and developer productivity tools section through the shared Azure AI developer tools guidance.
- [GraphQL on Azure for JavaScript developers](../javascript/graphql-developer-guide.md) - Added an AI-assisted GraphQL development section with GitHub Copilot for Azure scenarios for schema, resolver, query, and validation work.
- [Training with Azure and JavaScript](../javascript/learn-azure-javascript.md) - Expanded the learning guide with updated Static Web Apps, Azure Functions, AI, and certification resources, plus a new advanced section.

### Azure for Python developers

New articles:

- [Generate text embeddings with Foundry Local](/azure/foundry-local/how-to/how-to-generate-embeddings?pivots=programming-language-python)
- [Live transcribe audio from a microphone with Foundry Local](/azure/foundry-local/how-to/how-to-live-transcribe-audio?pivots=programming-language-python)
- [MCP prompt trigger for Azure Functions (public preview)](/azure/azure-functions/functions-bindings-mcp-prompt-trigger?pivots=programming-language-python)
- [Connect agents to Microsoft Fabric with Fabric IQ (preview)](/azure/foundry/agents/how-to/tools/fabric-iq?pivots=python)
- [Enable tool search in a toolbox (preview)](/azure/foundry/agents/how-to/tools/tool-search?pivots=python)
- [Connect agents to Microsoft 365 with Work IQ (preview)](/azure/foundry/agents/how-to/tools/work-iq?pivots=python)
- [Quickstart: Vector index with Python in Azure DocumentDB](/azure/documentdb/quickstart-python-select-algorithm)

Updated articles:

- [Create a GitHub Codespaces dev environment with FastAPI and Postgres](../python/configure-python-web-app-codespaces.md) - Added troubleshooting guidance for PostgreSQL 18 volume incompatibility in dev containers.
- [Configure a custom startup file for Python apps on Azure App Service](../python/configure-python-web-app-on-app-service.md) - Added prerequisite and deployment guidance plus an Azure CLI command for setting the startup command.
- [Build and run a containerized Python web app locally](../python/tutorial-containerize-deploy-python-web-app-azure-02.md) - Added supported Python version guidance for Dockerfiles and new notes for MongoDB configuration paths and Cosmos DB provisioning.
- [Build a containerized Python web app in Azure](../python/tutorial-containerize-deploy-python-web-app-azure-03.md) - Added prerequisites, a Python 3.8 end-of-life warning, and clearer Azure Container Registry build and verification guidance.

### Azure for Rust developers

New articles:

- [Generate text embeddings with Foundry Local](/azure/foundry-local/how-to/how-to-generate-embeddings?pivots=programming-language-rust)
- [Live transcribe audio from a microphone with Foundry Local](/azure/foundry-local/how-to/how-to-live-transcribe-audio?pivots=programming-language-rust)

Updated articles:

- [Access Azure services using Azure SDK for Rust crates](../rust/sdk/overview.md) - Removed the beta caveat for Azure SDK for Rust crates, reflecting their broader supported status.

### Azure MCP Server

New articles:

- [Azure MCP Server tools for Azure SRE Agent](../azure-mcp-server/tools/azure-sre-agent.md)
- [Azure MCP Server tools for Azure Terraform overview](../azure-mcp-server/tools/azure-terraform.md)

Updated articles:

- [Azure MCP Server tools for Microsoft Foundry Extensions](../azure-mcp-server/tools/azure-foundry.md) - Reworked the article for Microsoft Foundry Extensions, replacing agent-centric coverage with tools for completions, embeddings, models, and knowledge indexes.
- [Azure MCP Server tools for Azure App Service](../azure-mcp-server/tools/azure-app-service.md) - Documented a new web app state-change tool for start, stop, and restart operations and updated diagnostic parameter guidance.
- [Azure MCP Server tools for Azure compute overview](../azure-mcp-server/tools/azure-compute.md) - Added a VM power-state tool and expanded the compute reference with updated managed disk and VM configuration guidance.
- [Azure Database for PostgreSQL tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-database-postgresql.md) - Consolidated server, database, and table listing into a single flow and documented new authentication parameters for database operations.
- [Azure Event Grid tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-event-grid.md) - Added event publishing coverage and expanded topic and subscription guidance, including topic filtering and location-based discovery.
- [Azure File Sync Tools](../azure-mcp-server/tools/azure-file-sync.md) - Added a cloud endpoint change-detection tool for targeted or recursive sync scans.
- [Azure Key Vault tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-key-vault.md) - Updated key creation guidance to reflect the current supported key types and the premium-vault requirement for HSM keys.
- [Azure Load Testing tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-load-testing.md) - Documented the resource group parameter and updated test resource creation inputs.
- [Azure Migrate tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-migrate.md) - Added landing zone request parameters for security subscription ID and location.
- [Azure MCP Server tools for Azure Monitor and Workbooks](../azure-mcp-server/tools/azure-monitor.md) - Documented new required workspace table parameters and added web test configuration input coverage.
- [Azure pricing tools for the Azure MCP Server](../azure-mcp-server/tools/azure-pricing.md) - Added detailed guidance for pricing queries, including required filters, SKU specificity, and savings plan handling.
- [Azure Quick Review CLI tools for the Azure MCP Server overview](../azure-mcp-server/tools/azure-compliance-quick-review.md) - Documented the optional resource group parameter for scoping quick review scans.
- [Azure Redis tools for Azure MCP Server overview](../azure-mcp-server/tools/azure-redis.md) - Added required SKU guidance and documented the new public network access option when creating a Redis resource.
- [Azure MCP Server tools for Azure Storage](../azure-mcp-server/tools/azure-storage.md) - Greatly expanded Azure Storage coverage with new account and container create/get flows, CLI command mappings, and parameter tables.

### Azure Skills

New articles:

- [Azure skill for AI Runway AKS setup](../azure-skills/skills/ai-runway-aks-setup.md)
- [Azure skill for Entra Agent ID](../azure-skills/skills/entra-agent-id.md)

Updated articles:

- [Azure skill for Azure Compute](../azure-skills/skills/azure-compute.md) - Expanded the skill to cover capacity reservations, Essential Machine Management, and richer VM and VMSS guidance.
- [Azure skill for Kusto (Data Explorer)](../azure-skills/skills/azure-kusto.md) - Expanded the skill with schema exploration, cluster and database discovery, and broader analytics guidance.
- [Azure skill for Azure Upgrade](../azure-skills/skills/azure-upgrade.md) - Expanded the skill to cover Azure SDK modernization and Azure Cache for Redis migration scenarios.
- [Azure skill for Microsoft Foundry](../azure-skills/skills/microsoft-foundry.md) - Expanded the skill to cover continuous evaluation, Foundry Agent Optimization Service workflows, dataset curation, and production troubleshooting.

### GitHub Copilot for Azure

New articles:

- [Quickstart: Import data into Azure Cosmos DB by using GitHub Copilot for Azure agent mode](../github-copilot-azure/agent-mode-cosmosdb-import.md)

Updated articles:

- [What is GitHub Copilot for Azure?](../github-copilot-azure/introduction.md) - Added Azure Skills integration details, support for Claude Code, GitHub Copilot CLI, and IntelliJ, and clearer next-step guidance.
- [Troubleshoot Azure applications with GitHub Copilot for Azure](../github-copilot-azure/troubleshoot-examples.md) - Reorganized the article into general and service-specific troubleshooting prompt sets for logs, errors, performance, and health checks.

### GitHub Copilot modernization

Updated articles:

- [GitHub Copilot modernization agent overview](../github-copilot-app-modernization/modernization-agent/overview.md) - Removed the public preview reference from the modernization agent overview.
- [AppCAT 7 release notes](/azure/migrate/appcat/appcat-7-release-notes) - Added AppCAT 7 release notes entries.

### Introduction to Azure for developers

New articles:

- [Quickstart: Develop Azure applications with agent-assisted AI](../intro/quickstart-agent-assist.md)

### Terraform on Azure

New articles:

- [Use the Microsoft Terraform Visual Studio Code extension](../terraform/how-to-use-terraform-vscode-extension.md)
- [Quickstart: Perform Azure resource actions with the AzAPI Terraform provider](../terraform/get-started-azapi-resource-action-mutation.md)
- [Quickstart: Manage Azure Key Vault certificate contacts with the AzAPI Terraform provider](../terraform/get-started-azapi-data-plane-resource.md)
- [Quickstart: List Azure resources with the AzAPI Terraform provider](../terraform/get-started-azapi-resource-list.md)
- [Choose between AzureRM and AzAPI Terraform providers](../terraform/provider-selection-azurerm-vs-azapi.md)
- [Understand the AzAPI data plane framework](../terraform/concept-azapi-data-plane-framework.md)
- [Enable preflight validation in the AzAPI Terraform provider](../terraform/how-to-use-azapi-preflight-validation.md)
- [Use provider functions in the AzAPI Terraform provider](../terraform/how-to-use-azapi-provider-functions.md)
- [Migration paths between Azure, AzureRM, and AzAPI Terraform providers](../terraform/how-to-migrate-between-azurerm-and-azapi.md)

Updated articles:

- [Overview of the Terraform AzAPI provider](../terraform/overview-azapi-provider.md) - Expanded the overview with data plane framework guidance, response export and JMESPath examples, import and migration workflows, provider options, and VS Code tooling.
- [Quickstart: Deploy your first Azure resource_action resource with the AzAPI Terraform provider](../terraform/get-started-azapi-resource-action.md) - Reframed `azapi_resource_action` as a read-only data-source pattern for listing Key Vault keys and added subscription confirmation guidance.
