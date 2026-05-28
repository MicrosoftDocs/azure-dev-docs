---
title: Azure SRE Agent tools
description: Learn how to use the Azure MCP Server with Azure SRE Agent resources to manage agents, skills, connectors, incidents, and workflows.
author: diberry
ms.author: diberry
ms.date: 05/28/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-generated
ms.topic: concept-article
ms.custom: build-2025
mcp-cli.version: 3.0.0-beta.13+cd8d1e8f9924440b33e3e908c390c1599700ccba
---
# Azure SRE Agent tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure SRE Agent resources with natural language prompts. You don't need to remember specialized command syntax to orchestrate SRE agents, configure connectors, or investigate incidents.

Azure SRE Agent is a site reliability engineering orchestration surface that helps you create intelligent agents to monitor and respond to service health events. You can build agents with skills, connectors, scheduled tasks, hooks, and incident response plans—then interact with them through conversational threads.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Agents

### Create or update sub-agent

<!-- sreagent agents create -->

Creates or updates a sub-agent on a targeted SRE Agent resource. Use this to add specialized sub-agents with specific instructions, tools, and handoff behaviors to an existing SRE Agent.

Example prompts include:

- **Create sub-agent**: "Create a sub-agent named 'triage-bot' on my SRE Agent 'prod-sre'"
- **Update instructions**: "Update the instructions for sub-agent 'triage-bot' on SRE Agent 'prod-sre'"
- **Attach tools**: "Add sub-agent 'runbook-agent' with tools 'kusto-query' and 'pagerduty-alert' to my SRE Agent"
- **Set handoffs**: "Create sub-agent 'escalation-agent' with a handoff to 'oncall-agent' on SRE Agent 'prod-sre'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the sub-agent to create or update. |
| **Description** | Optional | A description for the sub-agent. |
| **Instructions** | Optional | Instructions for the sub-agent. |
| **Tools** | Optional | Tool names to attach. Multiple values are supported. |
| **Handoffs** | Optional | Sub-agent handoff names. Multiple values are supported. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete sub-agent

<!-- sreagent agents delete -->

Deletes a sub-agent from a targeted SRE Agent resource. This operation requires confirmation.

Example prompts include:

- **Delete sub-agent**: "Delete sub-agent 'triage-bot' from my SRE Agent 'prod-sre'"
- **Remove sub-agent**: "Remove the sub-agent named 'old-agent' from SRE Agent 'prod-sre', confirm deletion"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the sub-agent to delete. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get sub-agent

<!-- sreagent agents get -->

Shows the configuration details of a named SRE Agent, including endpoint, provisioning state, location, and settings.

Example prompts include:

- **Get agent details**: "Show me the configuration for SRE Agent 'prod-sre'"
- **Check provisioning state**: "What's the provisioning state of SRE Agent 'prod-sre'?"
- **View agent endpoint**: "Get the endpoint for my SRE Agent 'monitoring-agent'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List sub-agents

<!-- sreagent agents list -->

Lists Azure SRE Agent resources in a subscription. Each result includes name, ID, location, resource group, provisioning state, and endpoint. Returns an empty list if no resources are found.

Example prompts include:

- **List all agents**: "List all SRE Agents in my subscription"
- **Filter by resource group**: "Show me the SRE Agents in resource group 'prod-rg'"
- **Check available agents**: "What SRE Agents do I have?"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Create or update custom tool

<!-- sreagent agents tools create -->

Creates or updates a custom tool on a targeted SRE Agent resource. Supported tool types include `KustoTool` and `LinkTool`.

Example prompts include:

- **Create Kusto tool**: "Create a KustoTool named 'error-query' on SRE Agent 'prod-sre' with connector 'adx-connector'"
- **Create link tool**: "Add a LinkTool named 'runbook-link' with URL template 'https://runbooks.example.com/{id}' to SRE Agent 'prod-sre'"
- **Update tool parameters**: "Update the custom tool 'error-query' on SRE Agent 'prod-sre' with new parameter definitions"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the custom tool to create or update. |
| **Tool type** | Required | The custom tool type, such as `KustoTool` or `LinkTool`. |
| **Description** | Optional | A description for the custom tool. |
| **Connector** | Optional | The connector name for Kusto tools. |
| **Database** | Optional | The Kusto database for Kusto tools. |
| **URL template** | Optional | The URL template for link tools. |
| **Parameters** | Optional | JSON array of tool parameter definitions. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get custom tool

<!-- sreagent agents tools get -->

Gets a custom tool definition from a targeted SRE Agent resource.

Example prompts include:

- **Get tool details**: "Show me the definition for custom tool 'error-query' on SRE Agent 'prod-sre'"
- **View tool config**: "Get configuration for the 'runbook-link' tool on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the custom tool. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List custom tools

<!-- sreagent agents tools list -->

Lists custom tools on a targeted SRE Agent resource.

Example prompts include:

- **List all tools**: "List all custom tools on SRE Agent 'prod-sre'"
- **View available tools**: "What custom tools are configured on my SRE Agent?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Architecture

### Plan architecture

<!-- sreagent architecture plan -->

Plans and generates an SRE Agent architecture. Analyzes requirements and produces a structured design for agents, tools, connectors, and triggers.

Example prompts include:

- **Design architecture**: "Plan an SRE Agent architecture for monitoring my production services with automated incident response"
- **Generate design**: "Create an architecture for an SRE Agent that uses scheduled tasks and PagerDuty integration"
- **Design with triggers**: "Plan an SRE Agent with scheduled trigger type for the 'prod-monitoring' connector"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Requirements** | Required | Architecture requirements for the SRE Agent design. |
| **Trigger type** | Optional | Trigger type, such as `manual` or `scheduled`. |
| **Kusto connector** | Optional | Kusto connector name to include in the design. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Common prompts

### Create or update common prompt

<!-- sreagent commonprompts create -->

Creates or updates a named common prompt on the SRE Agent. Common prompts are reusable prompt templates that agents can reference.

Example prompts include:

- **Create common prompt**: "Create a common prompt named 'incident-summary' on SRE Agent 'prod-sre'"
- **Update prompt content**: "Update the content for common prompt 'triage-template' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the common prompt to create or update. |
| **Content** | Required | The prompt content. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete common prompt

<!-- sreagent commonprompts delete -->

Permanently removes and irreversibly deletes a named common prompt from an SRE Agent. This action can't be undone.

Example prompts include:

- **Delete prompt**: "Delete common prompt 'old-template' from SRE Agent 'prod-sre', confirm deletion"
- **Remove prompt**: "Remove the common prompt named 'deprecated-prompt' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the common prompt to delete. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get common prompt

<!-- sreagent commonprompts get -->

Shows the content of a specific named common prompt on an SRE Agent. Returns the full prompt text for a single prompt identified by name.

Example prompts include:

- **View prompt content**: "Show me the content of common prompt 'incident-summary' on SRE Agent 'prod-sre'"
- **Get prompt details**: "Get the 'triage-template' common prompt from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the common prompt to retrieve. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List common prompts

<!-- sreagent commonprompts list -->

Lists all common prompts available on an SRE Agent. Returns a collection of all registered prompt names and descriptions.

Example prompts include:

- **List all prompts**: "List all common prompts on SRE Agent 'prod-sre'"
- **Search prompts**: "Find common prompts matching 'incident' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Search** | Optional | Optional search filter to narrow results. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors

### Create Kusto connector

<!-- sreagent connectors create kusto -->

Creates or updates a Kusto connector on an Azure SRE Agent resource, enabling the agent to query Azure Data Explorer clusters.

Example prompts include:

- **Create Kusto connector**: "Create a Kusto connector named 'adx-prod' on SRE Agent 'prod-sre' with cluster URL 'https://mycluster.eastus.kusto.windows.net'"
- **Update connector**: "Update the Kusto connector 'adx-prod' on my SRE Agent with database 'telemetry'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the connector to create or update. |
| **Cluster URL** | Required | The Azure Data Explorer cluster URL. |
| **Database** | Optional | The Kusto database for Kusto tools. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Create MCP connector

<!-- sreagent connectors create mcp -->

Creates or updates an MCP connector on an Azure SRE Agent resource. MCP connectors extend the agent with external tool capabilities using either stdio or HTTP transport.

Example prompts include:

- **Create HTTP connector**: "Create an HTTP MCP connector named 'external-tools' on SRE Agent 'prod-sre' with endpoint 'https://api.example.com/mcp'"
- **Create stdio connector**: "Add a stdio MCP connector named 'local-tools' with command 'python' on SRE Agent 'prod-sre'"
- **Set bearer auth**: "Create an HTTP MCP connector with bearer token auth using env variable 'API_TOKEN'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the MCP connector to create or update. |
| **Type** | Required | The MCP connector type: `stdio` or `http`. |
| **Command** | Optional | The command for stdio MCP connectors. |
| **Args** | Optional | Arguments for stdio MCP connectors. |
| **Envs JSON** | Optional | JSON object of environment variables for stdio MCP connectors. |
| **Endpoint** | Optional | The HTTP MCP connector endpoint. |
| **Auth type** | Optional | The HTTP MCP connector authentication type. |
| **Bearer token env** | Optional | Environment variable containing the bearer token. |
| **Headers JSON** | Optional | JSON object of HTTP headers. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ✅ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

### Delete connector

<!-- sreagent connectors delete -->

Deletes a connector from an Azure SRE Agent resource. This operation requires confirmation.

Example prompts include:

- **Delete connector**: "Delete connector 'adx-prod' from SRE Agent 'prod-sre', confirm deletion"
- **Remove MCP connector**: "Remove the MCP connector named 'external-tools' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the connector to delete. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get connector

<!-- sreagent connectors get -->

Gets details for a connector configured on an Azure SRE Agent resource.

Example prompts include:

- **View connector details**: "Show me the details for connector 'adx-prod' on SRE Agent 'prod-sre'"
- **Get connector config**: "Get configuration for the 'external-tools' connector on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the connector. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List connectors

<!-- sreagent connectors list -->

Lists connectors configured on an Azure SRE Agent resource.

Example prompts include:

- **List connectors**: "List all connectors on SRE Agent 'prod-sre'"
- **View configured connectors**: "What connectors does my SRE Agent 'monitoring-agent' have?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Test connector

<!-- sreagent connectors test -->

Tests a connector and lists the tools it exposes.

Example prompts include:

- **Test connector**: "Test the connector 'adx-prod' on SRE Agent 'prod-sre' and show me the available tools"
- **Verify connection**: "Verify the 'external-tools' MCP connector is working on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the connector to test. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ✅ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Docs and knowledge

### Get reference documentation

<!-- sreagent docs get -->

Returns reference documentation for SRE Agent concepts.

Example prompts include:

- **Get docs**: "Get documentation for the 'skills' topic in SRE Agent"
- **Learn about concepts**: "Show me reference documentation about connectors in Azure SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Topic** | Required | Documentation topic to retrieve. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Add knowledge document

<!-- sreagent docs memories add -->

Adds a document to the SRE Agent knowledge base by name. Uploads markdown content that is indexed for retrieval-augmented generation (RAG)-based knowledge retrieval.

Example prompts include:

- **Add document**: "Add a knowledge document named 'runbook-deploy' to SRE Agent 'prod-sre' with the runbook content"
- **Upload knowledge**: "Upload the deployment guide as knowledge document 'deploy-guide' to my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the knowledge document to add. |
| **Content** | Required | The markdown content to index. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete knowledge document

<!-- sreagent docs memories delete -->

Deletes a knowledge base document after explicit confirmation.

Example prompts include:

- **Delete document**: "Delete knowledge document 'old-runbook' from SRE Agent 'prod-sre', confirm deletion"
- **Remove knowledge**: "Remove the document named 'deprecated-guide' from my SRE Agent's knowledge base"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the knowledge document to delete. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### List knowledge documents

<!-- sreagent docs memories list -->

Retrieves a complete list of all indexed knowledge base documents stored in an SRE Agent's memory. Returns all document names and metadata without filtering. Use this to browse all knowledge before searching.

Example prompts include:

- **List documents**: "List all knowledge base documents in SRE Agent 'prod-sre'"
- **Browse knowledge**: "Show me all documents in my SRE Agent's memory"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Reindex knowledge base

<!-- sreagent docs memories reindex -->

Triggers a knowledge base reindex on an SRE Agent. Use this after adding multiple documents to ensure they're all searchable.

Example prompts include:

- **Reindex**: "Reindex the knowledge base for SRE Agent 'prod-sre'"
- **Rebuild index**: "Trigger a knowledge base reindex on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Search knowledge base

<!-- sreagent docs memories search -->

Searches the SRE Agent knowledge base using semantic search to find relevant documents.

Example prompts include:

- **Search docs**: "Search the knowledge base on SRE Agent 'prod-sre' for deployment procedures"
- **Find documents**: "Find knowledge documents related to incident response in my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Query** | Optional | The search query to use. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks

### Delete hook

<!-- sreagent hooks delete -->

Deletes a hook from an Azure SRE Agent resource. This operation requires confirmation.

Example prompts include:

- **Delete hook**: "Delete hook 'alert-hook' from SRE Agent 'prod-sre', confirm deletion"
- **Remove hook**: "Remove the hook named 'old-trigger' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the hook to delete. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get hook

<!-- sreagent hooks get -->

Gets details for a hook configured on an Azure SRE Agent resource.

Example prompts include:

- **View hook**: "Show me the details for hook 'alert-hook' on SRE Agent 'prod-sre'"
- **Get hook config**: "Get configuration for the 'deployment-hook' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the hook. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List hooks

<!-- sreagent hooks list -->

Lists hooks configured on an Azure SRE Agent resource.

Example prompts include:

- **List hooks**: "List all hooks on SRE Agent 'prod-sre'"
- **View hooks**: "What hooks are configured on my SRE Agent 'monitoring-agent'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Activate thread hook

<!-- sreagent hooks thread activate -->

Activates an on-demand hook for a thread on an Azure SRE Agent resource.

Example prompts include:

- **Activate hook**: "Activate hook 'alert-hook' for thread 'thread-123' on SRE Agent 'prod-sre'"
- **Enable hook for thread**: "Turn on the 'monitoring-hook' for my active investigation thread"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Required | The SRE Agent thread ID. |
| **Hook name** | Required | The hook name to activate. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Deactivate thread hook

<!-- sreagent hooks thread deactivate -->

Deactivates an on-demand hook for a thread on an Azure SRE Agent resource.

Example prompts include:

- **Deactivate hook**: "Deactivate hook 'alert-hook' for thread 'thread-123' on SRE Agent 'prod-sre'"
- **Disable hook**: "Turn off the 'monitoring-hook' for thread 'thread-456' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Required | The SRE Agent thread ID. |
| **Hook name** | Required | The hook name to deactivate. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### List thread hook states

<!-- sreagent hooks thread list -->

Lists hook activation states for a thread on an Azure SRE Agent resource.

Example prompts include:

- **List hook states**: "Show hook activation states for thread 'thread-123' on SRE Agent 'prod-sre'"
- **Check active hooks**: "Which hooks are active for my current investigation thread?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Required | The SRE Agent thread ID. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents

### List active incidents

<!-- sreagent incidents active list -->

Lists active incidents on an SRE Agent. Returns open incident threads with title, status, affected services, and investigation details.

Example prompts include:

- **List active incidents**: "Show me all active incidents on SRE Agent 'prod-sre'"
- **Check ongoing issues**: "What incidents are currently open on my SRE Agent?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Create incident

<!-- sreagent incidents create -->

Creates an incident investigation thread for an agent.

Example prompts include:

- **Create incident**: "Create a high-severity incident 'Payment service degradation' on SRE Agent 'prod-sre' affecting services 'payment-api' and 'checkout-service'"
- **Report issue**: "Open a critical incident 'Database latency spike' affecting 'orders-db' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Severity** | Required | Incident severity: `critical`, `high`, `medium`, or `low`. |
| **Title** | Required | Incident title. |
| **Description** | Required | A description of the incident. |
| **Services** | Required | Affected service names. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Create incident response plan

<!-- sreagent incidents plans create -->

Creates and enables an incident response plan with a filter and handler. The plan automatically triggers when the condition is met.

Example prompts include:

- **Create response plan**: "Create an incident response plan 'high-latency-response' on SRE Agent 'prod-sre' for critical severity affecting 'api-service' with investigation steps"
- **Set up auto-response**: "Add a response plan for 'database-failures' with runbook URL 'https://runbooks.example.com/db'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the incident response plan. |
| **Severity** | Required | Incident severity: `critical`, `high`, `medium`, or `low`. |
| **Trigger condition** | Required | Text that triggers the incident response plan. |
| **Services** | Required | Affected service names. |
| **Steps** | Required | Incident response steps. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Escalation** | Optional | Escalation procedure. |
| **Runbook URL** | Optional | Runbook URL. |
| **Agent mode** | Optional | Agent mode: `autonomous` or `review`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### List incident response plans

<!-- sreagent incidents plans list -->

Lists incident response plans configured on an SRE Agent.

Example prompts include:

- **List plans**: "List all incident response plans on SRE Agent 'prod-sre'"
- **View response plans**: "What incident response plans are configured on my SRE Agent?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Connect to PagerDuty

<!-- sreagent incidents setup pagerduty -->

Connects an SRE Agent to PagerDuty. Creates a PagerDuty MCP connector to enable incident alerting and management integration. The API key is read from an environment variable. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data).

Example prompts include:

- **Connect PagerDuty**: "Connect SRE Agent 'prod-sre' to PagerDuty with API key from env variable 'PAGERDUTY_API_KEY'"
- **Set up alerting**: "Integrate my SRE Agent with PagerDuty subdomain 'mycompany' using API key env 'PD_KEY'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the PagerDuty connector to create. |
| **API key env** | Required | Environment variable containing the PagerDuty API key. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Subdomain** | Optional | PagerDuty subdomain. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

### Connect to ServiceNow

<!-- sreagent incidents setup servicenow -->

Connects an SRE Agent to ServiceNow. Creates a ServiceNow MCP connector to enable incident management integration. Credentials are read from environment variables. This operation requires [user consent](index.md#user-confirmation-for-sensitive-data).

Example prompts include:

- **Connect ServiceNow**: "Connect SRE Agent 'prod-sre' to ServiceNow instance 'https://mycompany.service-now.com' with bearer token auth"
- **Set up ITSM integration**: "Integrate my SRE Agent with ServiceNow using username/password from env variables"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the ServiceNow connector to create. |
| **Instance URL** | Required | ServiceNow instance URL. |
| **Auth type** | Required | The authentication type for the ServiceNow connector. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Token env** | Optional | Environment variable containing bearer token. |
| **Username env** | Optional | Environment variable containing username. |
| **Password env** | Optional | Environment variable containing password. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Scheduled tasks

### Create scheduled task

<!-- sreagent scheduledtasks create -->

Creates an SRE Agent scheduled task that sends a message on a cron schedule.

Example prompts include:

- **Create scheduled task**: "Create a scheduled task 'daily-health-check' on SRE Agent 'prod-sre' to run daily at 8am"
- **Schedule message**: "Set up a task 'weekly-summary' that sends 'Generate a weekly health report' every Monday at 9am"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Name** | Required | The name of the scheduled task. |
| **Cron expression** | Required | The cron expression for the schedule. |
| **Message** | Required | The message to send on schedule. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Description** | Optional | A description for the scheduled task. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete scheduled task

<!-- sreagent scheduledtasks delete -->

Deletes an SRE Agent scheduled task. This operation requires confirmation.

Example prompts include:

- **Delete task**: "Delete scheduled task with ID 'task-abc123' from SRE Agent 'prod-sre', confirm deletion"
- **Remove schedule**: "Remove the scheduled task 'task-abc123' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Task ID** | Required | The scheduled task ID. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get scheduled task

<!-- sreagent scheduledtasks get -->

Gets an SRE Agent scheduled task by ID.

Example prompts include:

- **Get task**: "Show me the details for scheduled task 'task-abc123' on SRE Agent 'prod-sre'"
- **View schedule**: "Get the configuration for my scheduled task 'task-abc123'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Task ID** | Required | The scheduled task ID. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### List scheduled tasks

<!-- sreagent scheduledtasks list -->

Lists SRE Agent scheduled tasks.

Example prompts include:

- **List tasks**: "List all scheduled tasks on SRE Agent 'prod-sre'"
- **View schedules**: "What scheduled tasks are configured on my SRE Agent?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Pause scheduled task

<!-- sreagent scheduledtasks pause -->

Pauses an SRE Agent scheduled task.

Example prompts include:

- **Pause task**: "Pause scheduled task 'task-abc123' on SRE Agent 'prod-sre'"
- **Suspend schedule**: "Pause the scheduled task 'task-abc123' temporarily"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Task ID** | Required | The scheduled task ID. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Resume scheduled task

<!-- sreagent scheduledtasks resume -->

Resumes an SRE Agent scheduled task.

Example prompts include:

- **Resume task**: "Resume scheduled task 'task-abc123' on SRE Agent 'prod-sre'"
- **Restart schedule**: "Re-enable the paused scheduled task 'task-abc123' on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Task ID** | Required | The scheduled task ID. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills

### Create or update skill

<!-- sreagent skills create -->

Creates or updates a custom skill on a targeted SRE Agent resource. Skills define the agent's capabilities and behaviors.

Example prompts include:

- **Create skill**: "Create a skill named 'kusto-analysis' with investigation instructions on SRE Agent 'prod-sre'"
- **Update skill**: "Update the content for skill 'deployment-check' on my SRE Agent"
- **Add skill**: "Add a skill 'anomaly-detection' with description 'Detects anomalies in telemetry' to SRE Agent 'prod-sre'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the skill to create or update. |
| **Content** | Required | The skill content. |
| **Description** | Optional | A description for the skill. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete skill

<!-- sreagent skills delete -->

Deletes a custom skill from a targeted SRE Agent resource. This operation requires confirmation.

Example prompts include:

- **Delete skill**: "Delete skill 'old-analysis' from SRE Agent 'prod-sre', confirm deletion"
- **Remove skill**: "Remove the custom skill 'deprecated-check' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |
| **Name** | Required | The name of the skill to delete. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### List skills

<!-- sreagent skills list -->

Lists custom skills on a targeted SRE Agent resource.

Example prompts include:

- **List skills**: "List all custom skills on SRE Agent 'prod-sre'"
- **View skills**: "What skills are configured on my SRE Agent 'monitoring-agent'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Required | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads

### Create thread

<!-- sreagent threads create -->

Creates a new thread on an SRE Agent and starts a conversation by sending the opening message. Returns the initial agent response.

Example prompts include:

- **Start investigation**: "Create a thread on SRE Agent 'prod-sre' asking 'Is there any unusual activity in the payment service?'"
- **Open conversation**: "Start a new thread with SRE Agent 'monitoring-agent' to investigate current CPU spikes"
- **Begin analysis**: "Create a thread asking my SRE Agent 'prod-sre' to analyze the latest deployment"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Message** | Required | The opening message to send. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Delete thread

<!-- sreagent threads delete -->

Deletes an SRE Agent thread. This operation requires confirmation.

Example prompts include:

- **Delete thread**: "Delete thread 'thread-123' from SRE Agent 'prod-sre', confirm deletion"
- **Remove conversation**: "Remove the investigation thread 'thread-456' from my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Optional | The SRE Agent thread ID. |
| **Confirm** | Optional | Confirm a destructive operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Get thread messages

<!-- sreagent threads get -->

Gets messages for an SRE Agent thread.

Example prompts include:

- **View thread**: "Show me the messages in thread 'thread-123' on SRE Agent 'prod-sre'"
- **Read conversation**: "Get all messages from my investigation thread 'thread-456'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Optional | The SRE Agent thread ID. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Investigate issue

<!-- sreagent threads investigate -->

Investigates an issue or incident using an SRE Agent. Sends your investigation message and automatically follows up on agent questions until the investigation is complete.

Example prompts include:

- **Investigate incident**: "Investigate the high error rate on SRE Agent 'prod-sre' — check the payment service for the last hour"
- **Auto-investigate**: "Use my SRE Agent to investigate why API latency spiked at 2pm today"
- **Follow-up investigation**: "Investigate memory usage anomalies on the web tier with up to 10 follow-up iterations"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Message** | Required | The investigation message. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** | Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** | Optional | The investigation timeout in seconds. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Investigate without approval gates

<!-- sreagent threads investigate yolo -->

Runs an investigation on an SRE Agent and automatically grants all pending approval requests without waiting for human confirmation. Use this when you want the agent to proceed without any approval gates.

Example prompts include:

- **Auto-approve investigation**: "Investigate and auto-approve all actions on SRE Agent 'prod-sre' — resolve the disk space alert"
- **Full auto investigation**: "Run a yolo investigation on my SRE Agent to remediate the service restart loop"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Message** | Required | The investigation message. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** | Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** | Optional | The investigation timeout in seconds. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### List threads

<!-- sreagent threads list -->

Lists SRE Agent chat threads.

Example prompts include:

- **List threads**: "List all threads on SRE Agent 'prod-sre'"
- **View conversations**: "Show me all investigation threads on my SRE Agent"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Send message

<!-- sreagent threads send message -->

Sends a message to an existing SRE Agent thread.

Example prompts include:

- **Send message**: "Send 'Can you check the database connections now?' to thread 'thread-123' on SRE Agent 'prod-sre'"
- **Continue conversation**: "Reply to my investigation thread 'thread-456' with 'Focus on the last 30 minutes of logs'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Message** | Required | The message to send. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** | Optional | The SRE Agent thread ID. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workflows

### Apply workflow

<!-- sreagent workflows apply -->

Applies and deploys a YAML workflow to an SRE Agent. Uploads and activates `ExtendedAgent` or `ExtendedAgentTool` YAML configuration on the specified SRE Agent resource.

Example prompts include:

- **Apply workflow**: "Apply the workflow YAML to SRE Agent 'prod-sre'"
- **Deploy agent config**: "Deploy an ExtendedAgent YAML configuration to my SRE Agent 'prod-sre'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **YAML content** | Required | The YAML workflow content to apply. |
| **Agent** | Optional | The name of the Azure SRE Agent resource to target. |
| **Source name** | Optional | Optional source name for the workflow. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

### Generate workflow

<!-- sreagent workflows generate -->

Generates a YAML workflow definition for a named SRE Agent tool or agent. Creates validated YAML configuration for `ExtendedAgent`, `KustoTool`, or `LinkTool` resources.

Example prompts include:

- **Generate agent YAML**: "Generate a YAML workflow for an ExtendedAgent named 'triage-agent' with a description"
- **Create tool config**: "Generate YAML for a KustoTool named 'error-query' using connector 'adx-prod' and database 'telemetry'"
- **Build link tool**: "Generate YAML for a LinkTool named 'runbook-link' with URL template 'https://runbooks.example.com/{id}'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Kind** | Required | YAML kind: `agent` or `tool`. |
| **Name** | Required | The name of the agent or tool to generate YAML for. |
| **Description** | Required | A description for the agent or tool. |
| **Model or type** | Optional | Tool type, such as `KustoTool` or `LinkTool`. |
| **Tools** | Optional | Tool names to attach. Multiple values are supported. |
| **Handoffs** | Optional | Sub-agent handoff names. Multiple values are supported. |
| **Connector** | Optional | The connector name for Kusto tools. |
| **Database** | Optional | The Kusto database for Kusto tools. |
| **URL template** | Optional | The URL template for link tools. |
| **Parameters** | Optional | Parameters as `name:description` pairs. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

### Validate workflow

<!-- sreagent workflows validate -->

Validates SRE Agent YAML content for common issues.

Example prompts include:

- **Validate YAML**: "Validate this SRE Agent YAML configuration for errors"
- **Check workflow**: "Check my ExtendedAgent YAML for common issues before applying it"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **YAML content** | Required | The YAML content to validate. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌
