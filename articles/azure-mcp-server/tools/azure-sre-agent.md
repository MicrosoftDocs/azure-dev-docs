---
title: Azure MCP Server tools for Azure SRE Agent
description: Use Azure MCP Server tools to manage Azure SRE Agent resources, including agents, skills, connectors, incidents, and workflows.
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
# Azure MCP Server tools for Azure SRE Agent

The Azure MCP Server lets you manage Azure SRE Agent resources, including: activate, add, apply, create, deactivate, delete, generate, get, investigate, kusto, list, mcp, message, pagerduty, pause, plan, reindex, resume, search, servicenow, test, validate, and yolo, with natural language prompts.

Azure SRE Agent is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure SRE Agent documentation](/azure/sreagent/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Agents: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents create -->

This tool creates or updates a sub-agent on a targeted SRE Agent resource. You specify the `subscription`, `agent`, and `name` to identify the sub-agent. The tool applies changes idempotently, so repeated requests with the same values don't create duplicates. Provide the required parameters to create or update the sub-agent.

Example prompts include:

- "Create a sub-agent with name 'sub-agent-01' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Description** |  Optional | A description for the SRE Agent item. |
| **Handoffs** |  Optional | Sub-agent handoff names. Multiple values are supported. |
| **Instructions** |  Optional | Instructions for the sub-agent. |
| **Tools** |  Optional | Tool names to attach. Multiple values are supported. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Creates or updates a sub-agent on a targeted SRE Agent resource. Required: --subscription, --agent, --name.

**Example CLI command**

```console
azmcp sreagent agents create \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--description <description>] \
  [--instructions <instructions>] \
  [--tools <tools>] \
  [--handoffs <handoffs>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--description` | string | No | A description for the SRE Agent item. |
| `--instructions` | string | No | Instructions for the sub-agent. |
| `--tools` | string | No | Tool names to attach. Multiple values are supported. |
| `--handoffs` | string | No | Sub-agent handoff names. Multiple values are supported. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Agents: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents delete -->

This tool deletes a sub-agent from a targeted SRE Agent resource. This tool is part of the Model Context Protocol (MCP) tools. You specify the subscription, `Agent`, and `Name`, and set `confirm` to `true` to perform the deletion.

Examples

- For example, delete the sub-agent named 'telemetry-agent' from the SRE Agent 'prod-sre' in subscription '12345-abcde'.
- For example, delete the sub-agent 'backup-monitor' from the SRE Agent 'staging-sre' in subscription 'my-subscription-id'.

Example prompts include:

- "Delete sub-agent name 'subagent-01' from SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Deletes a sub-agent from a targeted SRE Agent resource. Required: --subscription, --agent, --name, --confirm true.

**Example CLI command**

```console
azmcp sreagent agents delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Agents: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents get -->

Show the configuration details for a named SRE Agent. This tool returns the endpoint, provisioning state, location, and settings for the specified SRE Agent. You can filter results by resource group. This tool is part of the Model Context Protocol (MCP) suite. You specify the subscription and the `Agent` name to run the tool.

Example prompts include:

- "Show details for SRE Agent 'sre-agent-north' in resource group 'rg-sre-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |



Examples

- Check configuration for SRE Agent 'sre-agent-eastus' in resource group 'prod-rg'.
- Show the endpoint and provisioning state for SRE Agent 'ops-agent-west' across the specified subscription.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Show the configuration details of a named SRE Agent. Retrieves endpoint, provisioning state, location, and settings for a specific SRE Agent by name, optionally filtered by resource group. Required: --subscription, --agent.

**Example CLI command**

```console
azmcp sreagent agents get \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents list -->

This tool lists Azure SRE Agent resources in a subscription, using the Model Context Protocol (MCP). You can filter results by resource group. Each result includes `name`, `id`, `location`, `resourceGroup`, `provisioningState`, and `endpoint`. If the tool finds no SRE Agent resources, it returns an empty list.

Example prompts include:

- "List Azure SRE Agent resources in my subscription."

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List Azure SRE Agent resources in a subscription. Optionally filter by resource group.
Each result includes: name, id, location, resourceGroup, provisioningState, endpoint.
If no SRE Agent resources are found the tool returns an empty list.

**Example CLI command**

```console
azmcp sreagent agents list \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents tools: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools create -->

This Model Context Protocol (MCP) tool creates or updates a custom tool on a target SRE Agent resource. You specify the `subscription`, `agent`, `name`, and `tool type` parameters. If a tool with the specified `name` exists, this tool updates its configuration; otherwise, it creates a new tool. Provide configuration values according to the parameter table.

For example, to create a collector tool named 'log-collector' on agent 'sre-agent-prod' in subscription 'contoso-sub', use a prompt like:
- Create custom tool 'log-collector' on agent 'sre-agent-prod' in subscription 'contoso-sub' with tool type 'collector'.

For example, to update an existing tool named 'file-watcher' on agent 'sre-agent-stage', use a prompt like:
- Update tool 'file-watcher' on agent 'sre-agent-stage' in subscription 'contoso-sub' to set tool type 'watcher'.

Example prompts include:

- "Create a custom tool with name 'custom-kusto-tool', tool type 'KustoTool', on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Tool type** |  Required | The custom tool type, such as KustoTool or LinkTool. |
| **Connector** |  Optional | The connector name for Kusto tools. |
| **Database name** |  Optional | The Kusto database for Kusto tools. |
| **Description** |  Optional | A description for the SRE Agent item. |
| **Parameters** |  Optional | JSON array of tool parameter definitions. |
| **Query** |  Optional | The Kusto query for Kusto tools. |
| **URL template** |  Optional | The URL template for link tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Creates or updates a custom tool on a targeted SRE Agent resource. Required: --subscription, --agent, --name, --tool-type.

**Example CLI command**

```console
azmcp sreagent agents tools create \
  --agent <agent> \
  --name <name> \
  --tool-type <tool-type> \
  [--resource-group <resource-group>] \
  [--description <description>] \
  [--connector <connector>] \
  [--database <database>] \
  [--query <query>] \
  [--url-template <url-template>] \
  [--parameters <parameters>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--tool-type` | string | Yes | The custom tool type, such as KustoTool or LinkTool. |
| `--description` | string | No | A description for the SRE Agent item. |
| `--connector` | string | No | The connector name for Kusto tools. |
| `--database` | string | No | The Kusto database for Kusto tools. |
| `--query` | string | No | The Kusto query for Kusto tools. |
| `--url-template` | string | No | The URL template for link tools. |
| `--parameters` | string | No | JSON array of tool parameter definitions. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Agents tools: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools get -->

Gets a custom tool definition from a targeted SRE Agent resource for the Model Context Protocol (MCP). This tool requires the `Subscription`, `Agent`, and `Name` parameters. It returns the custom tool definition for the specified `Agent` and `Name`.

Example prompts include:

- "Get the definition of custom tool name 'deploy-helper' from SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Gets a custom tool definition from a targeted SRE Agent resource. Required: --subscription, --agent, --name.

**Example CLI command**

```console
azmcp sreagent agents tools get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents tools: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools list -->

This tool, part of the Model Context Protocol (MCP), lists custom tools on a targeted SRE Agent resource. You must specify the subscription and the `Agent`. This tool returns the name, version, and status for each custom tool, so you can verify deployments and troubleshoot issues.

Example prompts include:

- "List custom tools on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Lists custom tools on a targeted SRE Agent resource. Required: --subscription and --agent.

**Example CLI command**

```console
azmcp sreagent agents tools list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Architecture: Plan
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent architecture plan -->

Plan and generate a site reliability engineering (SRE) agent architecture using the Model Context Protocol (MCP). This tool analyzes your requirements and produces a structured design for agents, tools, connectors, and triggers. You provide high-level requirements and constraints, and this tool returns component responsibilities, interaction patterns, deployment considerations, security and access control recommendations, and observability suggestions. Use the output to guide implementation, tooling selection, and integration planning.

Outputs include:
- A component list with responsibilities and boundaries.
- Connector and trigger definitions for integrations.
- Deployment and scalability considerations, including regional and orchestration recommendations.
- Security and role-based access control (RBAC) guidance.
- Observability and incident response patterns, including monitoring and alerting suggestions.

Example prompts include:

- "Plan an SRE Agent architecture for requirements 'multi-tenant observability with automated incident triage and Kusto integration'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Requirements** |  Required | Architecture requirements. |
| **Kusto connector** |  Optional | Kusto connector name. |
| **Trigger type** |  Optional | Trigger type, such as manual or scheduled. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Plan and generate an SRE Agent architecture. Analyzes requirements and produces a structured design for agents, tools, connectors, and triggers.

**Example CLI command**

```console
azmcp sreagent architecture plan \
  --requirements <requirements> \
  [--trigger-type <trigger-type>] \
  [--kusto-connector <kusto-connector>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--requirements` | string | Yes | Architecture requirements. |
| `--trigger-type` | string | No | Trigger type, such as manual or scheduled. |
| `--kusto-connector` | string | No | Kusto connector name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Commonprompts: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts create -->

Model Context Protocol (MCP) tool. This tool creates or updates a named common prompt on the SRE Agent. It saves reusable prompt templates, so teams can centralize guidance and reduce duplication. The tool returns the created or updated prompt object.

Example prompts include:

- "Create a common prompt with name 'restart-service' and content 'Describe how to restart the app service during an incident' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Content** |  Required | Skill content. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create or update a named common prompt on the SRE Agent.

**Example CLI command**

```console
azmcp sreagent commonprompts create \
  --name <name> \
  --content <content> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Commonprompts: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts delete -->

This tool permanently removes the prompt identified by `Name` from an SRE Agent. You confirm the deletion before the tool erases the prompt definition. This action isn't reversible.

Example prompts include:

- "Permanently delete common prompt name 'cpu-throttle-guidance' from SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Permanently remove and irreversibly delete a named common prompt from an SRE Agent. Erases the prompt definition after explicit user confirmation. This action cannot be undone.

**Example CLI command**

```console
azmcp sreagent commonprompts delete \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Commonprompts: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts get -->

This Model Context Protocol (MCP) tool shows the full text of a specific named common prompt on a site reliability engineering (SRE) agent. You provide the `Name` value, and this tool returns the prompt text so you can inspect or audit prompts for debugging or review.

Example prompts include:

- "Show me the common prompt with name 'deploy-checklist' on SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |



Examples

- Retrieve the full prompt text for the common prompt 'incident-response'.
- Show the prompt text for 'deploy-checklist'.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Show the content of a specific named common prompt on an SRE Agent. Returns the full prompt text for a single prompt identified by name.

**Example CLI command**

```console
azmcp sreagent commonprompts get \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Commonprompts: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts list -->

This Model Context Protocol (MCP) tool lists all common prompts available on an SRE Agent. It returns a collection of registered prompt names and descriptions. The results help you discover available prompts and review their descriptions.

Example prompts include:

- "List common prompts for SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Search** |  Optional | Optional search filter. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List all common prompts available on an SRE Agent. Returns a collection of all registered prompt names and descriptions.

**Example CLI command**

```console
azmcp sreagent commonprompts list \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--search <search>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--search` | string | No | Optional search filter. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors create: Kusto
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors create kusto -->

This tool, part of the Model Context Protocol (MCP) tools, creates or updates a connector to Azure Data Explorer (Kusto) on an Azure SRE Agent resource. The connector lets the agent ingest and query data from an Azure Data Explorer cluster.

Example prompts include:

- "Create a Kusto connector on SRE Agent 'sre-agent-01' with cluster URL 'https://adx-prod.eastus.kusto.windows.net' and name 'kusto-connector-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Cluster URL** |  Required | The Azure Data Explorer cluster URL. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Database name** |  Optional | The Kusto database for Kusto tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create or update a Kusto connector on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent connectors create kusto \
  --agent <agent> \
  --name <name> \
  --cluster-url <cluster-url> \
  [--resource-group <resource-group>] \
  [--database <database>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--cluster-url` | string | Yes | The Azure Data Explorer cluster URL. |
| `--database` | string | No | The Kusto database for Kusto tools. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Connectors create: Mcp
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors create mcp -->

This tool creates or updates a Model Context Protocol (MCP) connector on an Azure SRE Agent resource. You specify the agent with `Agent`, the connector name with `Name`, and the connector type with `Type`. You can also provide connection credentials and additional configuration settings. On success, this tool returns the connector resource.

Follow Azure naming conventions for resource names, and ensure role-based access control (RBAC) permissions allow connector updates. Use realistic names such as `sre-agent-prod` for the agent and `rg-sre-prod` for the resource group.

Example prompts include:

- "Create an MCP connector on SRE Agent 'sreagent-prod' with name 'mcp-connector' and type 'http'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Type** |  Required | The MCP connector type: stdio or http. |
| **Args** |  Optional | Arguments for stdio MCP connectors. |
| **Auth type** |  Optional | The HTTP MCP connector authentication type. |
| **Bearer token env** |  Optional | Environment variable containing the bearer token. |
| **Command** |  Optional | The command for stdio MCP connectors. |
| **Endpoint** |  Optional | The HTTP MCP connector endpoint. |
| **Envs JSON** |  Optional | JSON object of environment variables for stdio MCP connectors. |
| **Headers JSON** |  Optional | JSON object of HTTP headers. |



Examples

- Create a Kafka connector named 'connector-kafka-main' on agent 'sre-agent-prod' in resource group 'rg-sre-prod':
  sreagent connectors create mcp --agent 'sre-agent-prod' --name 'connector-kafka-main' --type 'kafka' --resource-group 'rg-sre-prod'

- Update an HTTP connector named 'connector-http-01' on agent 'sre-agent-prod' with new credentials in resource group 'rg-sre-prod':
  sreagent connectors create mcp --agent 'sre-agent-prod' --name 'connector-http-01' --type 'http' --resource-group 'rg-sre-prod' --credentials 'new-credentials'

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create or update an MCP connector on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent connectors create mcp \
  --agent <agent> \
  --name <name> \
  --type <type> \
  [--resource-group <resource-group>] \
  [--command <command>] \
  [--args <args>] \
  [--envs-json <envs-json>] \
  [--endpoint <endpoint>] \
  [--auth-type <auth-type>] \
  [--bearer-token-env <bearer-token-env>] \
  [--headers-json <headers-json>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--type` | string | Yes | The MCP connector type: stdio or http. |
| `--command` | string | No | The command for stdio MCP connectors. |
| `--args` | string | No | Arguments for stdio MCP connectors. |
| `--envs-json` | string | No | JSON object of environment variables for stdio MCP connectors. |
| `--endpoint` | string | No | The HTTP MCP connector endpoint. |
| `--auth-type` | string | No | The HTTP MCP connector authentication type. |
| `--bearer-token-env` | string | No | Environment variable containing the bearer token. |
| `--headers-json` | string | No | JSON object of HTTP headers. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ✅ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Connectors: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors delete -->

This tool, part of the Model Context Protocol (MCP) tools, deletes a connector from an Azure SRE Agent resource. Requires `subscription`, `agent`, `name`, and `confirm` set to `true`.

Example prompts include:

- "Delete connector 'metrics-collector' from SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Delete a connector from an Azure SRE Agent resource. Required: --subscription, --agent, --name, --confirm true.

**Example CLI command**

```console
azmcp sreagent connectors delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Connectors: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors get -->

This tool retrieves details for a connector that is configured on an Azure SRE Agent resource. You can view connector properties, configuration, and status to help troubleshoot or document the connector. Specify the `Agent` and `Name` parameters to identify the Azure SRE Agent resource and the connector.

Example prompts include:

- "Show the details of connector 'github-connector' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Get details for a connector configured on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent connectors get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors list -->

This Model Context Protocol (MCP) tool lists connectors that are configured on an Azure SRE Agent resource. It returns connector names, connector types, and registration status so you can review integrations and troubleshoot issues.

Example prompts include:

- "List the connectors configured on SRE Agent 'sreagent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |



Examples

- List connectors for agent 'sre-agent-01'.
- List connectors for agent 'sre-agent-prod' in resource group 'rg-sre-prod'.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List connectors configured on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent connectors list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors: Test
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors test -->

Test a connector and list the tools it exposes.

This tool tests a connector in the Model Context Protocol (MCP) server and lists the tools the connector exposes. You can verify connector connectivity and inspect available tools, including each tool's name and capabilities. To test a connector, provide the `Agent` and `Name` parameters.

Example prompts include:

- "Test connector name 'my-connector' on SRE Agent 'sre-agent-prod' and list its tools."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |



Examples

- Test connector 'sreagent' with name 'github-connector' to list available tools.
- Test connector 'sreagent' with name 'sales-crm-connector' to verify connectivity and enumerate its tools.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Test a connector and list the tools it exposes.

**Example CLI command**

```console
azmcp sreagent connectors test \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ✅ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Docs: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs get -->

This tool returns reference documentation for Site Reliability Engineering (SRE) Agent concepts used with the Model Context Protocol (MCP). You can get definitions, configuration details, and usage examples for SRE Agent topics such as alerting, incident response, health checks, and telemetry. Specify the `Topic` to retrieve a topic's reference entry.

Examples

- Get the incident response reference: get Topic 'incident-response'
- Get the alerting rules reference: get Topic 'alerting-rules'

Example prompts include:

- "Show me the SRE Agent documentation for topic 'incident-response'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Topic** |  Required | Documentation topic. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Return reference documentation for SRE Agent concepts.

**Example CLI command**

```console
azmcp sreagent docs get \
  --topic <topic>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--topic` | string | Yes | Documentation topic. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Docs memories: Add
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories add -->

This Model Context Protocol (MCP) tool adds a document to the SRE Agent knowledge base by name. You upload Markdown content, and the tool indexes it for retrieval-augmented generation (RAG) based knowledge retrieval. Use clear, descriptive names so documents are easy to find.

Example prompts include:

- "Add a document named 'incident-runbook' with content 'Runbook: steps to triage service outage and contact on-call' to the SRE Agent knowledge base."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Content** |  Required | Skill content. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Add a document to the SRE Agent knowledge base by name. Uploads markdown content that will be indexed for RAG-based knowledge retrieval.

**Example CLI command**

```console
azmcp sreagent docs memories add \
  --name <name> \
  --content <content> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Docs memories: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories delete -->

This tool deletes a knowledge base document from the Model Context Protocol (MCP) server after you confirm. You specify the document by `Name`. Deletion is permanent and can't be undone. Confirm the document before you run this tool.

Example prompts include:

- "Confirm and delete knowledge base document name 'sre-kb-doc-01' from SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Delete a knowledge base document after explicit confirmation.

**Example CLI command**

```console
azmcp sreagent docs memories delete \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Docs memories: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories list -->

This tool, part of the Model Context Protocol (MCP) suite, lists all indexed knowledge base documents that an SRE Agent stores in memory. It returns every document name and its metadata, with no search filter or query. Browsing the complete knowledge base helps you discover available documents before you run targeted searches.

Example prompts include:

- "Get a complete list of all indexed knowledge base documents stored in SRE Agent 'sre-agent-prod' memory without filtering."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Retrieve a complete list of all indexed knowledge base documents stored in an SRE Agent's memory. Returns all document names and metadata without any search filter or query. Use this to browse everything in the knowledge base before searching.

**Example CLI command**

```console
azmcp sreagent docs memories list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Docs memories: Reindex
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories reindex -->

This Model Context Protocol (MCP) tool triggers a reindex of a knowledge base. You use it to reprocess stored documents, update embeddings, and rebuild search indexes so search results reflect recent content and metadata changes. Reindexing time depends on dataset size and server load; it can take minutes or longer. After the tool starts, monitor reindex progress with the server's management endpoints.

Example prompts include:

- "Reindex the knowledge base documents for SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Trigger a knowledge base reindex.

**Example CLI command**

```console
azmcp sreagent docs memories reindex \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Docs memories: Search
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories search -->

The Model Context Protocol (MCP) tool searches the SRE Agent knowledge base using semantic search, and returns the most relevant documents for your query. It helps you find troubleshooting steps, runbooks, postmortems, and monitoring playbooks related to incidents or alerts.

Example prompts include:

- "Search the SRE Agent knowledge base for 'disk IO latency'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Query** |  Optional | The Kusto query for Kusto tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Search the SRE Agent knowledge base. Uses semantic search to find relevant documents stored in the agent's knowledge base.

**Example CLI command**

```console
azmcp sreagent docs memories search \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--query <query>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--query` | string | No | The Kusto query for Kusto tools. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks delete -->

This tool, part of the Model Context Protocol (MCP) tools, deletes a hook from an Azure SRE Agent resource. It requires a subscription, the `Agent`, the `Name`, and `confirm` set to `true`.

Example prompts include:

- "Delete hook name 'backup-trigger' from SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Delete a hook from an Azure SRE Agent resource. Required: --subscription, --agent, --name, --confirm true.

**Example CLI command**

```console
azmcp sreagent hooks delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks get -->

Model Context Protocol (MCP). This tool returns details for a hook that's configured on an Azure SRE Agent resource. You can review the hook's configuration, check its current status, and confirm trigger settings or destination endpoints.

Example prompts include:

- "Show me the details of hook 'deploy-hook' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Get details for a hook configured on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent hooks get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks list -->

Lists hooks configured on an Azure SRE Agent resource. This tool is part of the Model Context Protocol (MCP) tools. Use this tool to view hook names, hook types, and their current status for a specified `Agent`. You can use the output to inspect deployment, monitoring, and cleanup hooks that apply to the `Agent`.

Example prompts include:

- "List the hooks configured for SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List hooks configured on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent hooks list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks thread: Activate
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread activate -->

This tool activates an on-demand hook for a thread on an Azure SRE Agent resource. It is part of the Model Context Protocol (MCP) suite, and it triggers the hook's configured actions immediately. Specify the `Agent`, `Hook name`, and `Thread ID` to identify the target thread and hook.

Example prompts include:

- "Activate hook 'health-check' on thread 'thread-42' of SRE Agent 'sreagent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Hook name** |  Required | The hook name. |
| **Thread ID** |  Required | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Activate an on-demand hook for a thread on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent hooks thread activate \
  --agent <agent> \
  --thread-id <thread-id> \
  --hook-name <hook-name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |
| `--hook-name` | string | Yes | The hook name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks thread: Deactivate
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread deactivate -->

This Model Context Protocol (MCP) tool deactivates an on-demand hook for a thread on an Azure SRE Agent resource. You provide `Agent`, `Hook name`, and `Thread ID` to identify the hook and target thread. The tool stops the hook from running on the specified thread without removing the hook configuration. You need appropriate permissions on the Azure SRE Agent resource to apply the change.

Example prompts include:

- "Deactivate hook 'on-demand-restart' on thread ID 'thread-7' of SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Hook name** |  Required | The hook name. |
| **Thread ID** |  Required | The SRE Agent thread ID. |



Examples

- Deactivate the on-demand snapshot hook named 'on-demand-snapshot' for thread 'thread-42' on agent 'sre-agent-eastus'.
- Deactivate the emergency rollback hook named 'emergency-rollback' for thread 'ops-thread-7' on agent 'sre-agent-westus2'.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Deactivate an on-demand hook for a thread on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent hooks thread deactivate \
  --agent <agent> \
  --thread-id <thread-id> \
  --hook-name <hook-name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |
| `--hook-name` | string | Yes | The hook name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks thread: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread list -->

This tool, part of the Model Context Protocol (MCP) tools, lists the hook activation state for a thread on an Azure SRE Agent resource. It returns whether hooks are enabled, disabled, or pending for the specified thread. Results help you verify hook configuration and troubleshoot thread behavior.

Example prompts include:

- "List the hook activation states for thread ID 'thread-42' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Required | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List hook activation state for a thread on an Azure SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent hooks thread list \
  --agent <agent> \
  --thread-id <thread-id> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents active: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents active list -->

This tool, part of the Model Context Protocol (MCP), lists active incidents on a site reliability engineering (SRE) Agent. It returns open incident threads with the title, status, affected services, and investigation details. You use the output to review ongoing investigations and see which services are impacted.

Example prompts include:

- "List the active incidents on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List active incidents on an SRE Agent. Returns open incident threads with title, status, affected services, and investigation details.

**Example CLI command**

```console
azmcp sreagent incidents active list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents create -->

Use this tool to create an incident investigation thread for an agent. You can log the incident details, associate affected services, and set severity to help prioritize response. You specify the incident description, services, severity, and title when you run this tool.

Example prompts include:

- "Create an incident with title 'Database latency spike', description 'High latency observed in SQL reads', services 'payments-api, auth-service', severity 'high', agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Description** |  Required | A description for the SRE Agent item. |
| **Services** |  Required | Affected service names. |
| **Severity** |  Required | Incident severity: critical, high, medium, or low. |
| **Title** |  Required | Incident title. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create an incident investigation thread for an agent.

**Example CLI command**

```console
azmcp sreagent incidents create \
  --severity <severity> \
  --title <title> \
  --description <description> \
  --services <services> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--severity` | string | Yes | Incident severity: critical, high, medium, or low. |
| `--title` | string | Yes | Incident title. |
| `--description` | string | Yes | A description for the SRE Agent item. |
| `--services` | string | Yes | Affected service names. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Incidents plans: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents plans create -->

This Model Context Protocol (MCP) tool creates and enables an incident response plan that uses a filter to scope incidents and a handler to define response steps. You specify plan metadata, the services to monitor, severity, response steps, and a trigger condition. This tool validates the input and activates the plan so it starts handling matched incidents.

Example prompts include:

- "Create and enable incident response plan Name 'db-failover-plan' Services 'payments-api' Severity 'critical' Steps 'notify on-call;run db failover' Trigger condition 'database connection lost'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Services** |  Required | Affected service names. |
| **Severity** |  Required | Incident severity: critical, high, medium, or low. |
| **Steps** |  Required | Incident response steps. |
| **Trigger condition** |  Required | Text that triggers the incident response plan. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Agent mode** |  Optional | Agent mode: autonomous or review. |
| **Escalation** |  Optional | Escalation procedure. |
| **Runbook URL** |  Optional | Runbook URL. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create and enable an incident response plan with a filter and handler.

**Example CLI command**

```console
azmcp sreagent incidents plans create \
  --name <name> \
  --severity <severity> \
  --trigger-condition <trigger-condition> \
  --services <services> \
  --steps <steps> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--escalation <escalation>] \
  [--runbook-url <runbook-url>] \
  [--agent-mode <agent-mode>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--severity` | string | Yes | Incident severity: critical, high, medium, or low. |
| `--trigger-condition` | string | Yes | Text that triggers the incident response plan. |
| `--services` | string | Yes | Affected service names. |
| `--steps` | string | Yes | Incident response steps. |
| `--escalation` | string | No | Escalation procedure. |
| `--runbook-url` | string | No | Runbook URL. |
| `--agent-mode` | string | No | Agent mode: autonomous or review. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Incidents plans: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents plans list -->

This Model Context Protocol (MCP) tool lists incident response plans configured on an SRE Agent. You can view each plan's name, ID, and status. This helps you identify active plans and review their configuration.

Example prompts include:

- "List the incident response plans configured on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List incident response plans configured on an SRE Agent.

**Example CLI command**

```console
azmcp sreagent incidents plans list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents setup: Pagerduty
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents setup pagerduty -->

Connect a site reliability engineering (SRE) Agent to PagerDuty. This tool creates a PagerDuty Model Context Protocol (MCP) connector that enables incident alerting and incident management. The connector uses an API key stored in an environment variable.

Example prompts include:

- "Connect SRE Agent 'sre-agent-prod' to PagerDuty with API key env 'PAGERDUTY_API_KEY' and Name 'pagerduty-connector'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **API key env** |  Required | Environment variable containing the API key. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Subdomain** |  Optional | PagerDuty subdomain. |



Examples

- Connect a production SRE Agent to PagerDuty using the API key in environment variable 'PAGERDUTY_API_KEY' and name 'prod-pagerduty'.
- Connect a staging SRE Agent to PagerDuty using the API key in environment variable 'STAGE_PD_KEY' and name 'staging-pagerduty'.
- Create a connector named 'team-alpha-pagerduty' and keep the API key in environment variable 'TEAM_ALPHA_PD_KEY'.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Connect an SRE Agent to PagerDuty. Creates a PagerDuty MCP connector to enable incident alerting and management integration using an API key from an environment variable.

**Example CLI command**

```console
azmcp sreagent incidents setup pagerduty \
  --name <name> \
  --api-key-env <api-key-env> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--subdomain <subdomain>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--api-key-env` | string | Yes | Environment variable containing the API key. |
| `--subdomain` | string | No | PagerDuty subdomain. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Incidents setup: Servicenow
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents setup servicenow -->

Connect an SRE Agent to ServiceNow using the Model Context Protocol (MCP). This tool creates a ServiceNow MCP connector that enables incident management integration. It uses credentials stored in environment variables and enables incident creation, updates, and resolution between ServiceNow and the SRE Agent.

Example prompts include:

- "Connect SRE Agent to ServiceNow with auth type 'basic', instance URL 'https://dev-instance.service-now.com', name 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Auth type** |  Required | The HTTP MCP connector authentication type. |
| **Instance URL** |  Required | ServiceNow instance URL. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Password env** |  Optional | Environment variable containing password. |
| **Token env** |  Optional | Environment variable containing bearer token. |
| **Username env** |  Optional | Environment variable containing username. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Connect an SRE Agent to ServiceNow. Creates a ServiceNow MCP connector to enable incident management integration using credentials from environment variables.

**Example CLI command**

```console
azmcp sreagent incidents setup servicenow \
  --name <name> \
  --instance-url <instance-url> \
  --auth-type <auth-type> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--token-env <token-env>] \
  [--username-env <username-env>] \
  [--password-env <password-env>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--instance-url` | string | Yes | ServiceNow instance URL. |
| `--auth-type` | string | Yes | The HTTP MCP connector authentication type. |
| `--token-env` | string | No | Environment variable containing bearer token. |
| `--username-env` | string | No | Environment variable containing username. |
| `--password-env` | string | No | Environment variable containing password. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Scheduledtasks: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks create -->

This tool creates a scheduled task for an SRE Agent in the Model Context Protocol (MCP) server. It sends a specified message on the schedule you define with a cron expression, so the agent can run automated work. You provide the task details when you create the scheduled task.

Example prompts include:

- "Schedule a recurring task on SRE Agent 'sre-agent-west' that runs every Monday with cron expression '0 9 * * 1', name 'weekly-restart', and message 'Restart service'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cron expression** |  Required | The cron expression for the schedule. |
| **Message** |  Required | The message to send. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Description** |  Optional | A description for the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create an SRE Agent scheduled task.

**Example CLI command**

```console
azmcp sreagent scheduledtasks create \
  --name <name> \
  --cron-expression <cron-expression> \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--description <description>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--cron-expression` | string | Yes | The cron expression for the schedule. |
| `--message` | string | Yes | The message to send. |
| `--description` | string | No | A description for the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduledtasks: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks delete -->

This Model Context Protocol (MCP) tool deletes an SRE Agent scheduled task. You must set `confirm=true` to confirm the deletion.

Example prompts include:

- "Delete the scheduled task 'task-12345' from SRE Agent 'sre-agent-west' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Delete an SRE Agent scheduled task. Requires confirm=true.

**Example CLI command**

```console
azmcp sreagent scheduledtasks delete \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduledtasks: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks get -->

This Model Context Protocol (MCP) tool retrieves an SRE Agent scheduled task by `Task ID`. You can view details such as the task configuration and current status.

Example prompts include:

- "Show me the scheduled task with task ID 'task-1234' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Get an SRE Agent scheduled task.

**Example CLI command**

```console
azmcp sreagent scheduledtasks get \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Scheduledtasks: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks list -->

This tool, part of the Model Context Protocol (MCP) tools, lists scheduled tasks that the SRE Agent manages. You can inspect scheduled jobs, confirm schedules, and view task metadata such as status, next run time, and last run time. This tool returns a read-only list of scheduled tasks with fields for task name, status, schedule, next run time, and last run time.

Examples

- List all scheduled tasks for SRE Agent 'sre-agent-prod'.
- List scheduled tasks in resource group 'sre-management' with status 'Failed'.
- List scheduled tasks for SRE Agent 'sre-agent-stage' and include next run times.

Example prompts include:

- "List the scheduled tasks on SRE Agent 'sre-agent-01'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List SRE Agent scheduled tasks.

**Example CLI command**

```console
azmcp sreagent scheduledtasks list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Scheduledtasks: Pause
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks pause -->

Pauses a scheduled task for a site reliability engineering (SRE) agent registered with the Model Context Protocol (MCP) server. This tool returns the task's updated status and related metadata. You pause scheduled tasks to temporarily stop automated activity during maintenance or troubleshooting.

Example prompts include:

- "Pause the scheduled task with task ID 'task-1234' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Pause an SRE Agent scheduled task.

**Example CLI command**

```console
azmcp sreagent scheduledtasks pause \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduledtasks: Resume
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks resume -->

This tool resumes a scheduled task for an SRE Agent that's registered with the Model Context Protocol (MCP) server. After you run the tool, the agent resumes executing the scheduled task according to its schedule.

Example prompts include:

- "Resume the scheduled task with task ID 'task-123' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Resume an SRE Agent scheduled task.

**Example CLI command**

```console
azmcp sreagent scheduledtasks resume \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills create -->

This Model Context Protocol (MCP) tool creates or updates a custom skill on a targeted SRE Agent resource. You must specify the subscription, agent, name, and content.

Example prompts include:

- "Add a new skill with name 'auto-scale-skill' to SRE Agent 'sreagent-prod' with content '{"type":"script","script":"scale.sh"}'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Content** |  Required | Skill content. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Description** |  Optional | A description for the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Creates or updates a custom skill on a targeted SRE Agent resource. Required: --subscription, --agent, --name, --content.

**Example CLI command**

```console
azmcp sreagent skills create \
  --agent <agent> \
  --name <name> \
  --content <content> \
  [--resource-group <resource-group>] \
  [--description <description>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |
| `--description` | string | No | A description for the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills delete -->

This tool deletes a custom skill from an SRE Agent resource. You must specify the `subscription`, `agent`, and `name`, and set `confirm` to `true`. Deletion is destructive and irreversible.

Example prompts include:

- "Delete the skill with name 'error-logger' from SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Optional | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Deletes a custom skill from a targeted SRE Agent resource. Required: --subscription, --agent, --name, --confirm true.

**Example CLI command**

```console
azmcp sreagent skills delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills list -->

Lists custom skills on a targeted SRE Agent resource for the Model Context Protocol (MCP) server. You specify a subscription and the `Agent`. The tool returns details for each custom skill registered on the specified SRE Agent, including name, version, and status. Use the output to review or audit custom skill configurations.

Example prompts include:

- "List all skills available on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Lists custom skills on a targeted SRE Agent resource. Required: --subscription and --agent.

**Example CLI command**

```console
azmcp sreagent skills list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads: Create
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads create -->

Part of the Model Context Protocol (MCP) tools, this tool creates a new thread on a Site Reliability Engineering (SRE) Agent and starts a conversation by sending the opening message. It returns the agent's initial response.

Example prompts include:

- "Start a new thread on SRE Agent 'sre-agent-01' with message 'Investigate increased latency in API gateway'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create a new thread on an SRE Agent and start a conversation by sending the opening message. Returns the initial agent response.

**Example CLI command**

```console
azmcp sreagent threads create \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Delete
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads delete -->

Part of the Model Context Protocol (MCP) tools, this tool deletes a site reliability engineering (SRE) agent thread. You must set `confirm=true` to proceed.

Example prompts include:

- "Delete thread ID 'thread-12345' from SRE Agent 'sreagent-prod' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Optional | Confirm a destructive operation. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Delete an SRE Agent thread. Requires confirm=true.

**Example CLI command**

```console
azmcp sreagent threads delete \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>] \
  [--confirm <confirm>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |
| `--confirm` | string | No | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Get
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads get -->

The Model Context Protocol (MCP) provides tools to interact with SRE Agent threads. This tool gets messages for a specific SRE Agent thread and returns message content and metadata, such as timestamps and sender identity. You can use the returned messages to review conversation history or troubleshoot agent behavior.

Example prompts include:

- "Show messages for thread ID '42' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Get messages for an SRE Agent thread.

**Example CLI command**

```console
azmcp sreagent threads get \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads investigate: Yolo
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads investigate yolo -->

Yolo investigation mode runs an investigation on an SRE Agent and automatically grants all pending approval requests without waiting for human confirmation. This tool starts an investigation on the specified SRE Agent and grants all pending approvals, so the agent proceeds without human approval gates. The tool records investigation actions and granted approvals for auditing.

Example prompts include:

- "Investigate with message 'Investigate service crash in frontend' on SRE Agent 'sre-agent-prod' in yolo mode, automatically granting all pending approvals."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** |  Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** |  Optional | The investigation timeout in seconds. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Yolo investigation mode: runs an investigation on an SRE Agent and automatically grants all pending approval requests without waiting for human confirmation. Use this when you want the agent to proceed without any approval gates.

**Example CLI command**

```console
azmcp sreagent threads investigate yolo \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--max-iterations <max-iterations>] \
  [--timeout-seconds <timeout-seconds>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |
| `--max-iterations` | string | No | The maximum number of automatic follow-up iterations. |
| `--timeout-seconds` | string | No | The investigation timeout in seconds. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Investigate
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads investigate -->

Investigate an issue or incident with a Site Reliability Engineering (SRE) agent that uses the Model Context Protocol (MCP). Use this tool to send an investigation message, and the agent asks follow-up questions until the investigation completes. You provide the investigation details in the `Message` parameter. Include relevant context, such as affected resources, timestamps, error messages, recent configuration changes, and steps to reproduce. Keep messages concise and focused to help the agent reach a resolution more efficiently.

Example prompts include:

- "Investigate the following issue with SRE Agent 'sre-agent-prod': message 'Primary API returning 500 errors after deployment'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** |  Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** |  Optional | The investigation timeout in seconds. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Investigate an issue or incident using an SRE Agent. Sends your investigation message and automatically follows up on agent questions until the investigation is complete.

**Example CLI command**

```console
azmcp sreagent threads investigate \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--max-iterations <max-iterations>] \
  [--timeout-seconds <timeout-seconds>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |
| `--max-iterations` | string | No | The maximum number of automatic follow-up iterations. |
| `--timeout-seconds` | string | No | The investigation timeout in seconds. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: List
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads list -->

Model Context Protocol (MCP). This tool lists SRE Agent chat threads. It returns a read-only list of thread objects that include thread ID, participants, metadata, and the latest message, so you can review active and past conversations.

Example prompts include:

- "List the active threads on SRE Agent 'sreagent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List SRE Agent chat threads.

**Example CLI command**

```console
azmcp sreagent threads list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads send: Message
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads send message -->

This tool sends a message to an existing site reliability engineering (SRE) agent thread on the Model Context Protocol (MCP) server. It posts the specified message to the thread and returns the thread's updated state. Use concise messages to add context, status updates, or troubleshooting notes to an ongoing thread.

Example prompts include:

- "Send message 'Restart completed, monitoring logs' to thread ID 'thread-12345' on agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |



Examples

- "Send message 'Investigating memory leak on web-prod-01. Restarting app service and collecting logs.' to thread 'thread-1234'"
- "Post message 'Deployment caused API 500s, rolling back to previous version' to thread 'inc-9876'"
- "Add message 'User reports timeout when uploading files larger than 50 MB' to thread 'thread-550'"

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Send a message to an existing SRE Agent thread.

**Example CLI command**

```console
azmcp sreagent threads send message \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |
| `--message` | string | Yes | The message to send. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workflows: Apply
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows apply -->

Apply and deploy a YAML workflow to an SRE Agent. This tool uploads and activates ExtendedAgent or ExtendedAgentTool YAML configuration on the specified SRE Agent resource.

Example prompts include:

- "Apply the workflow YAML with content 'apiVersion: sre/v1\nkind: ExtendedAgent\nmetadata:\n  name: deploy-workflow' to SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **YAML content** |  Required | YAML content. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Source name** |  Optional | Optional source name. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Apply and deploy a YAML workflow to an SRE Agent. Uploads and activates ExtendedAgent or ExtendedAgentTool YAML configuration on the specified SRE Agent resource.

**Example CLI command**

```console
azmcp sreagent workflows apply \
  --yaml-content <yaml-content> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--source-name <source-name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--yaml-content` | string | Yes | YAML content. |
| `--source-name` | string | No | Optional source name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workflows: Generate
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows generate -->

Generate a YAML workflow definition for a named site reliability engineering (SRE) Agent tool or agent for the Model Context Protocol (MCP) server. This tool creates validated YAML configuration for `ExtendedAgent`, `KustoTool`, and `LinkTool` resources. The generated workflow helps you deploy and manage SRE Agent tools consistently across environments.

Example prompts include:

- "Generate a YAML workflow with description 'Kusto query tool for incident search', kind 'tool', name 'kusto-search-tool'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Description** |  Required | A description for the SRE Agent item. |
| **Kind** |  Required | YAML kind: agent or tool. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Connector** |  Optional | The connector name for Kusto tools. |
| **Database name** |  Optional | The Kusto database for Kusto tools. |
| **Handoffs** |  Optional | Sub-agent handoff names. Multiple values are supported. |
| **Model or type** |  Optional | Tool type, such as KustoTool or LinkTool. |
| **Parameters** |  Optional | Parameters as name:description. |
| **Query** |  Optional | The Kusto query for Kusto tools. |
| **Tools** |  Optional | Tool names to attach. Multiple values are supported. |
| **URL template** |  Optional | The URL template for link tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Generate a YAML workflow definition for a named SRE Agent tool or agent. Creates validated YAML configuration for ExtendedAgent, KustoTool, or LinkTool resources.

**Example CLI command**

```console
azmcp sreagent workflows generate \
  --kind <kind> \
  --name <name> \
  --description <description> \
  [--model-or-type <model-or-type>] \
  [--tools <tools>] \
  [--handoffs <handoffs>] \
  [--connector <connector>] \
  [--database <database>] \
  [--query <query>] \
  [--url-template <url-template>] \
  [--parameters <parameters>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--kind` | string | Yes | YAML kind: agent or tool. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--description` | string | Yes | A description for the SRE Agent item. |
| `--model-or-type` | string | No | Tool type, such as KustoTool or LinkTool. |
| `--tools` | string | No | Tool names to attach. Multiple values are supported. |
| `--handoffs` | string | No | Sub-agent handoff names. Multiple values are supported. |
| `--connector` | string | No | The connector name for Kusto tools. |
| `--database` | string | No | The Kusto database for Kusto tools. |
| `--query` | string | No | The Kusto query for Kusto tools. |
| `--url-template` | string | No | The URL template for link tools. |
| `--parameters` | string | No | Parameters as name:description. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Workflows: Validate
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows validate -->

This tool validates Model Context Protocol (MCP) SRE Agent workflow YAML and flags common issues in structure and syntax. It checks for invalid YAML, malformed steps, incorrect `run` strings, and missing required keys. You provide `YAML content`, and the tool returns identified issues with line numbers and suggested fixes. See the example below for a typical error the tool detects.

Example prompts include:

- "Validate the following SRE Agent workflow YAML content 'apiVersion: v1
kind: Workflow
metadata:
  name: example-workflow
spec:
  steps:
    - name: check
      run: "echo hello"'." 

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **YAML content** |  Required | YAML content. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Validate SRE Agent YAML content for common issues.

**Example CLI command**

```console
azmcp sreagent workflows validate \
  --yaml-content <yaml-content>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--yaml-content` | string | Yes | YAML content. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)