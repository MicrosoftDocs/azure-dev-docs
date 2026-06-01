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

The Azure MCP Server helps you manage Azure SRE Agent resources, including: activate, add, apply, create, deactivate, delete, generate, get, investigate, kusto, list, mcp, message, pagerduty, pause, plan, reindex, resume, search, servicenow, test, validate, and yolo, by using natural language prompts.

Azure SRE Agent is an AI-powered reliability assistant that helps teams diagnose and resolve production issues, reduce operational toil, and lower mean time to resolution (MTTR). For more information, see [Azure SRE Agent documentation](/azure/sre-agent/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Agents: Create or update a subagent

This tool creates or updates a subagent on a targeted SRE Agent resource. Specify the subscription, agent, and name to identify the subagent. The tool applies changes idempotently, so repeated requests with the same values don't create duplicates. Provide the required parameters to create or update the subagent.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents create -->

Example prompts include:

- "Create a subagent with name 'subagent-01' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Description** |  Optional | A description for the SRE Agent item. |
| **Instructions** |  Optional | Instructions for the subagent. |
| **Tools** |  Optional | Tool names to attach. Multiple values are supported. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents create \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  [--description <description>] \
  [--instructions <instructions>] \
  [--tools <tools>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--description` | string | No | A description for the SRE Agent item. |
| `--instructions` | string | No | Instructions for the subagent. |
| `--tools` | string | No | Tool names to attach. Multiple values are supported. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Agents: Delete a subagent

This tool deletes a subagent from a targeted SRE Agent resource. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents delete -->

Example prompts include:

- "Delete the subagent named 'telemetry-agent' from the SRE Agent 'prod-sre' in subscription '12345-abcde' with confirm 'true'."
- "Delete the subagent 'backup-monitor' from the SRE Agent 'staging-sre' in subscription 'my-subscription-id' with confirm 'true'."
- "Delete subagent name 'subagent-01' from SRE Agent 'sre-agent-prod' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Agents: Get configuration details

Show the configuration details for a named SRE Agent. This tool returns the endpoint, provisioning state, location, and settings for the specified SRE Agent. You can filter results by resource group. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents get -->

Example prompts include:

- "Show details for SRE Agent 'sre-agent-north' in resource group 'rg-sre-prod'."
- "Check configuration for SRE Agent 'sre-agent-eastus' in resource group 'prod-rg'."
- "Show the endpoint and provisioning state for SRE Agent 'ops-agent-west' across the specified subscription."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents get \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents: List resources

This tool lists Azure SRE Agent resources. You can filter results by resource group. Each result includes `name`, `id`, `location`, `resourceGroup`, `provisioningState`, and `endpoint`. If the tool finds no SRE Agent resources, it returns an empty list.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents list -->


Example prompts include:

- "List Azure SRE Agent resources in my subscription."

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents list \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents tools: Create or update custom tool

This tool creates or updates a custom tool on a target SRE Agent resource. You specify the agent, name, and tool type. If a tool with the specified name exists, this tool updates its configuration; otherwise, it creates a new tool. Provide configuration values according to the parameter table.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools create -->

Example prompts include:

- "Create custom tool 'log-collector' on agent 'sre-agent-prod' in subscription 'contoso-sub' with tool type 'collector'."
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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
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

## Agents tools: Get custom tool definition

Gets a custom tool definition from a targeted SRE Agent resource. This tool requires the agent and name parameters and returns the custom tool definition for the specified agent and name.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools get -->

Example prompts include:

- "Get the definition of custom tool name 'deploy-helper' from SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents tools get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Agents tools: List tools

This tool lists custom tools on a targeted SRE Agent resource. It returns the name, version, and status for each custom tool, so you can verify deployments and troubleshoot issues.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent agents tools list -->

Example prompts include:

- "List custom tools on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent agents tools list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Architecture: Plan an architecture

Plan and generate a site reliability engineering (SRE) agent architecture. This tool analyzes your requirements and produces a structured design for agents, tools, connectors, and triggers. You provide high-level requirements and constraints, and this tool returns component responsibilities, interaction patterns, deployment considerations, security and access control recommendations, and observability suggestions. Use the output to guide implementation, tooling selection, and integration planning.

Outputs include:
- A component list with responsibilities and boundaries.
- Connector and trigger definitions for integrations.
- Deployment and scalability considerations, including regional and orchestration recommendations.
- Security and role-based access control (RBAC) guidance.
- Observability and incident response patterns, including monitoring and alerting suggestions.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent architecture plan -->

Example prompts include:

- "Plan an SRE Agent architecture for requirements 'multi-tenant observability with automated incident triage and Kusto integration'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Requirements** |  Required | Architecture requirements. |
| **Kusto connector** |  Optional | Kusto connector name. |
| **Trigger type** |  Optional | Trigger type, such as manual or scheduled. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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

## Common prompts: Create or update a prompt

This tool creates or updates a named common prompt on the SRE Agent. It saves reusable prompt templates, so teams can centralize guidance and reduce duplication. The tool returns the created or updated prompt object.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts create -->

Example prompts include:

- "Create a common prompt with name 'restart-service' and content 'Describe how to restart the app service during an incident' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Content** |  Required | The prompt content. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent commonprompts create \
  --name <name> \
  --content <content> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Common prompts: Delete a prompt

This tool permanently removes the prompt identified by name from an SRE Agent. You confirm the deletion before the tool erases the prompt definition. This action isn't reversible.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts delete -->

Example prompts include:

- "Permanently delete common prompt name 'cpu-throttle-guidance' from SRE Agent 'sre-agent-westus' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent commonprompts delete \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Common prompts: Get prompt text

This tool shows the full text of a specific named common prompt on a site reliability engineering (SRE) agent. You provide the name, and this tool returns the prompt text so you can inspect or audit prompts for debugging or review.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts get -->

Example prompts include:

- "Show me the common prompt with name 'deploy-checklist' on SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent commonprompts get \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Common prompts: List prompts

This tool lists all common prompts available on an SRE Agent. It returns a collection of registered prompt names and descriptions. The results help you discover available prompts and review their descriptions.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent commonprompts list -->

Example prompts include:

- "List common prompts for SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Search** |  Optional | Optional search filter. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent commonprompts list \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--search <search>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--search` | string | No | Optional search filter. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors: Create or update Kusto connector

This tool creates or updates a connector to Azure Data Explorer (Kusto) on an Azure SRE Agent resource. The connector lets the agent ingest and query data from an Azure Data Explorer cluster.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors create kusto -->

Example prompts include:

- "Create a Kusto connector on SRE Agent 'sre-agent-01' with cluster URL 'https://my-resource.eastus.kusto.windows.net' and name 'kusto-connector-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Cluster URL** |  Required | The Azure Data Explorer cluster URL. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Database name** |  Optional | The Kusto database for Kusto tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--cluster-url` | string | Yes | The Azure Data Explorer cluster URL. |
| `--database` | string | No | The Kusto database for Kusto tools. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Connectors: Create or update connector

This tool creates or updates a connector on an Azure SRE Agent resource. You specify the agent, the connector name, and the connector type. You can also provide connection credentials and additional configuration settings. On success, this tool returns the connector resource.

Follow Azure naming conventions for resource names, and ensure role-based access control (RBAC) permissions allow connector updates. Use realistic names such as `sre-agent-prod` for the agent and `rg-sre-prod` for the resource group.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors create mcp -->

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

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
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

## Connectors: Delete connector

This tool deletes a connector from an Azure SRE Agent resource. 
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors delete -->

Example prompts include:

- "Delete connector 'metrics-collector' from SRE Agent 'sre-agent-prod' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent connectors delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Connectors: Get connector details

This tool retrieves details for a connector that you configure on an Azure SRE Agent resource. You can view connector properties, configuration, and status to help troubleshoot or document the connector. Specify the agent and name parameters to identify the Azure SRE Agent resource and the connector.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors get -->

Example prompts include:

- "Show the details of connector 'github-connector' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent connectors get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors: List connectors

This tool lists connectors that you configure on an Azure SRE Agent resource. It returns connector names, connector types, and registration status so you can review integrations and troubleshoot issues.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors list -->

Example prompts include:

- "List the connectors configured on SRE Agent 'sreagent-prod'."


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent connectors list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Connectors: Test connector

This tool tests a connector and lists the tools the connector exposes. You can verify connector connectivity and inspect available tools, including each tool's name and capabilities. To test a connector, provide the agent and name parameters.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent connectors test -->

Example prompts include:

- "Test connector name 'my-connector' on SRE Agent 'sre-agent-prod' and list its tools."


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent connectors test \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ✅ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Documentation: Get reference documentation

This tool returns reference documentation for Site Reliability Engineering (SRE) Agent concepts. You can get definitions, configuration details, and usage examples for SRE Agent topics such as alerting, incident response, health checks, and telemetry. Specify the topic to retrieve a topic's reference entry.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs get -->

Example prompts include:

- "Show me the SRE Agent documentation for topic 'incident-response'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Topic** |  Required | Documentation topic. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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

## Documentation memories: Add document to knowledge base

This tool adds a document to the SRE Agent knowledge base by name. You upload markdown (*.md) content, and the tool indexes it for retrieval-augmented generation (RAG) based knowledge retrieval. Use clear, descriptive names so you can easily find documents.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories add -->

Example prompts include:

- "Add a document named 'incident-runbook' with content 'Runbook: steps to triage service outage and contact on-call' to the SRE Agent knowledge base."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Content** |  Required | The document content to add to the knowledge base. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent docs memories add \
  --name <name> \
  --content <content> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Documentation memories: Delete knowledge base document

Specify the document by name. This tool deletes a knowledge base document after you confirm. Deletion is permanent and can't be undone. Confirm the document exists before you run this tool.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories delete -->

Example prompts include:

- "Delete knowledge base document name 'sre-kb-doc-01' from SRE Agent 'sre-agent-westus' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent docs memories delete \
  --name <name> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Documentation memories: List indexed knowledge base documents

This tool lists all indexed knowledge base documents that an SRE Agent stores in memory. It returns every document name and its metadata, with no search filter or query. Browsing the complete knowledge base helps you discover available documents before you run targeted searches.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories list -->

Example prompts include:

- "Get a complete list of all indexed knowledge base documents stored in SRE Agent 'sre-agent-prod' memory without filtering."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent docs memories list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Documentation memories: Reindex knowledge base

This tool triggers a reindex of a knowledge base. Use it to reprocess stored documents, update embeddings, and rebuild search indexes so search results reflect recent content and metadata changes. Reindexing time depends on dataset size and server load. It can take minutes or longer. After the tool starts, monitor reindex progress by using the server's management endpoints.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories reindex -->

Example prompts include:

- "Reindex the knowledge base documents for SRE Agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent docs memories reindex \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Documentation memories: Search knowledge base

This tool searches the SRE Agent knowledge base using semantic search, and returns the most relevant documents for your query. It helps you find troubleshooting steps, runbooks, postmortems, and monitoring playbooks related to incidents or alerts.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent docs memories search -->

Example prompts include:

- "Search the SRE Agent knowledge base for 'disk IO latency'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Query** |  Optional | The search query used to find relevant knowledge base documents. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent docs memories search \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--query <query>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--query` | string | No | The search query used to find relevant knowledge base documents. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks: Delete hook

This tool deletes a hook from an Azure SRE Agent resource. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks delete -->

Example prompts include:

- "Delete hook name 'backup-trigger' from SRE Agent 'sre-agent-prod' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks: Get details

This tool returns details for a hook that you configure on an Azure SRE Agent resource. You can review the hook's configuration, check its current status, and confirm trigger settings or destination endpoints.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks get -->

Example prompts include:

- "Show me the details of hook 'deploy-hook' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks get \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks: List hooks

Lists hooks configured on an Azure SRE Agent resource. Use this tool to view hook names, hook types, and their current status for a specified agent. Use the output to inspect deployment, monitoring, and cleanup hooks that apply to the `Agent`.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks list -->

Example prompts include:

- "List the hooks configured for SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Hooks: Activate hook thread

This tool activates an on-demand hook for a thread on an Azure SRE Agent resource. It triggers the hook's configured actions immediately. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread activate -->

Example prompts include:

- "Activate hook 'health-check' on thread 'thread-42' of SRE Agent 'sreagent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Hook name** |  Required | The hook name. |
| **Thread ID** |  Required | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks thread activate \
  --agent <agent> \
  --thread-id <thread-id> \
  --hook-name <hook-name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |
| `--hook-name` | string | Yes | The hook name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks: Deactivate hook thread

This tool deactivates an on-demand hook for a thread on an Azure SRE Agent resource. You provide agent, hook name, and thread ID to identify the hook and target thread. The tool stops the hook from running on the specified thread without removing the hook configuration. You need appropriate permissions on the Azure SRE Agent resource to apply the change.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread deactivate -->

Example prompts include:

- "Deactivate hook 'on-demand-restart' on thread ID 'thread-7' of SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Hook name** |  Required | The hook name. |
| **Thread ID** |  Required | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks thread deactivate \
  --agent <agent> \
  --thread-id <thread-id> \
  --hook-name <hook-name> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |
| `--hook-name` | string | Yes | The hook name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Hooks: List hook thread state

This tool lists the hook activation state for a thread on an Azure SRE Agent resource. It returns whether hooks are enabled, disabled, or pending for the specified thread. Use the results to verify hook configuration and troubleshoot thread behavior.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent hooks thread list -->

Example prompts include:

- "List the hook activation states for thread ID 'thread-42' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Required | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent hooks thread list \
  --agent <agent> \
  --thread-id <thread-id> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | Yes | The SRE Agent thread ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents: List active incidents

This tool lists active incidents on a site reliability engineering (SRE) Agent. It returns open incident threads with the title, status, affected services, and investigation details. Use the output to review ongoing investigations and see which services are impacted.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents active list -->

Example prompts include:

- "List the active incidents on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent incidents active list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents: Create incident

Use this tool to create an incident investigation thread for an agent. You can log the incident details, associate affected services, and set severity to help prioritize response. You specify the incident description, services, severity, and title when you run this tool.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents create -->

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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--severity` | string | Yes | Incident severity: critical, high, medium, or low. |
| `--title` | string | Yes | Incident title. |
| `--description` | string | Yes | A description for the SRE Agent item. |
| `--services` | string | Yes | Affected service names. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Incidents: Create plan

This tool creates and enables an incident response plan that uses a filter to scope incidents and a handler to define response steps. You specify plan metadata, the services to monitor, severity, response steps, and a trigger condition. This tool validates the input and activates the plan so it starts handling matched incidents.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents plans create -->

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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
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

## Incidents: List plans

This tool lists incident response plans configured on an SRE Agent. You can view each plan's name, ID, and status. This information helps you identify active plans and review their configuration.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents plans list -->

Example prompts include:

- "List the incident response plans configured on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent incidents plans list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Incidents: Connect agent to PagerDuty

Connect a site reliability engineering (SRE) Agent to PagerDuty. This tool creates a PagerDuty connector that enables incident alerting and incident management. The connector uses an API key stored in an environment variable.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents setup pagerduty -->

Example prompts include:

- "Connect SRE Agent 'sre-agent-prod' to PagerDuty with API key env 'PAGERDUTY_API_KEY' and Name 'pagerduty-connector'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **API key env** |  Required | Environment variable containing the API key. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Subdomain** |  Optional | PagerDuty subdomain. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--api-key-env` | string | Yes | Environment variable containing the API key. |
| `--subdomain` | string | No | PagerDuty subdomain. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Incidents: Set up ServiceNow connector

This tool creates a ServiceNow MCP connector that enables incident management integration. It uses credentials stored in environment variables and enables incident creation, updates, and resolution between ServiceNow and the SRE Agent.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent incidents setup servicenow -->

Example prompts include:

- "Connect SRE Agent to ServiceNow with auth type 'basic', instance URL 'https://my-resource.service-now.com', name 'sre-agent-prod'."

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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
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

## Scheduled tasks: Create scheduled task

This tool creates a scheduled task for an SRE Agent. It sends a specified message on the schedule you define with a cron expression, so the agent can run automated work. You provide the task details when you create the scheduled task.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks create -->

Example prompts include:

- "Schedule a recurring task on SRE Agent 'sre-agent-west' that runs every Monday with cron expression '0 9 * * 1', name 'weekly-restart', and message 'Restart service'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cron expression** |  Required | The cron expression for the schedule. |
| **Message** |  Required | The prompt the agent runs on the defined schedule. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Description** |  Optional | A description for the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--cron-expression` | string | Yes | The cron expression for the schedule. |
| `--message` | string | Yes | The prompt the agent runs on the defined schedule. |
| `--description` | string | No | A description for the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduled tasks: Delete scheduled task

This tool deletes an SRE Agent scheduled task. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks delete -->

Example prompts include:

- "Delete the scheduled task 'task-12345' from SRE Agent 'sre-agent-west' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent scheduledtasks delete \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduled tasks: Get scheduled task

This tool retrieves an SRE Agent scheduled task by task ID. You can view details such as the task configuration and current status.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks get -->

Example prompts include:

- "Show me the scheduled task with task ID 'task-1234' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent scheduledtasks get \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Scheduled tasks: List scheduled tasks

This tool lists scheduled tasks that the SRE Agent manages. You can inspect scheduled jobs, confirm schedules, and view task metadata such as status, next run time, and last run time. This tool returns a read-only list of scheduled tasks with fields for task name, status, schedule, next run time, and last run time.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks list -->

Example prompts include:

- "List the scheduled tasks on SRE Agent 'sre-agent-01'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent scheduledtasks list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Scheduled tasks: Pause scheduled task

Pauses a scheduled task for a site reliability engineering (SRE) agent. This tool returns the task's updated status and related metadata. Pause scheduled tasks to temporarily stop automated activity during maintenance or troubleshooting.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks pause -->

Example prompts include:

- "Pause the scheduled task with task ID 'task-1234' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent scheduledtasks pause \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Scheduled tasks: Resume scheduled task

This tool resumes a scheduled task for an SRE Agent. After you run the tool, the agent resumes executing the scheduled task according to its schedule.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent scheduledtasks resume -->

Example prompts include:

- "Resume the scheduled task with task ID 'task-123' on SRE Agent 'sre-agent-west'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Task ID** |  Required | The scheduled task ID. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent scheduledtasks resume \
  --task-id <task-id> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--task-id` | string | Yes | The scheduled task ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: Create skill

This tool creates or updates a custom skill on a targeted SRE Agent resource. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills create -->

Example prompts include:

- "Add a new skill with name 'auto-scale-skill' to SRE Agent 'sreagent-prod' with content '{"type":"script","script":"scale.sh"}'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Content** |  Required | Skill content. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Description** |  Optional | A description for the SRE Agent item. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--content` | string | Yes | Skill content. |
| `--description` | string | No | A description for the SRE Agent item. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: Delete skill

This tool deletes a custom skill from an SRE Agent resource.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills delete -->

Example prompts include:

- "Delete the skill with name 'error-logger' from SRE Agent 'sre-agent-west' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Confirm** |  Required | Confirm a destructive operation. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent skills delete \
  --agent <agent> \
  --name <name> \
  [--resource-group <resource-group>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |
| `--name` | string | Yes | The name of the SRE Agent item. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Skills: List skills

Lists custom skills on a targeted SRE Agent resource. The tool returns details for each custom skill registered on the specified SRE Agent, including name, version, and status. Use the output to review or audit custom skill configurations.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent skills list -->

Example prompts include:

- "List all skills available on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent skills list \
  --agent <agent> \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | Yes | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads: Create thread

This tool creates a new thread on a Site Reliability Engineering (SRE) Agent and starts a conversation by sending the opening message. It returns the agent's initial response.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads create -->

Example prompts include:

- "Start a new thread on SRE Agent 'sre-agent-01' with message 'Investigate increased latency in API gateway'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent threads create \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Delete thread

This tool deletes a site reliability engineering (SRE) agent thread. 

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads delete -->

Example prompts include:

- "Delete thread ID 'thread-12345' from SRE Agent 'sreagent-prod' with confirm 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Confirm** |  Required | Confirm a destructive operation. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent threads delete \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>] \
  --confirm <confirm>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |
| `--confirm` | string | Yes | Confirm a destructive operation. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Get messages

This tool gets messages for a specific SRE Agent thread and returns message content and metadata, such as timestamps and sender identity. Use the returned messages to review conversation history or troubleshoot agent behavior.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads get -->

Example prompts include:

- "Show messages for thread ID '42' on SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent threads get \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads: YOLO mode

This tool starts an investigation on the specified SRE Agent and grants all pending approvals, so the agent proceeds without human approval gates. The tool records investigation actions and granted approvals for auditing.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads investigate yolo -->

Example prompts include:

- "Investigate with message 'Investigate service crash in frontend' on SRE Agent 'sre-agent-prod' in yolo mode, automatically granting all pending approvals."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** |  Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** |  Optional | The investigation timeout in seconds. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |
| `--max-iterations` | string | No | The maximum number of automatic follow-up iterations. |
| `--timeout-seconds` | string | No | The investigation timeout in seconds. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: Investigate incident

Investigate an issue or incident with a Site Reliability Engineering (SRE) agent. Use this tool to send an investigation message, and the agent asks follow-up questions until the investigation completes. You provide the investigation details in the message. Include relevant context, such as affected resources, timestamps, error messages, recent configuration changes, and steps to reproduce. Keep messages concise and focused to help the agent reach a resolution more efficiently.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads investigate -->

Example prompts include:

- "Investigate the following issue with SRE Agent 'sre-agent-prod': message 'Primary API returning 500 errors after deployment'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Max iterations** |  Optional | The maximum number of automatic follow-up iterations. |
| **Timeout seconds** |  Optional | The investigation timeout in seconds. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--message` | string | Yes | The message to send. |
| `--max-iterations` | string | No | The maximum number of automatic follow-up iterations. |
| `--timeout-seconds` | string | No | The investigation timeout in seconds. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Threads: List agent chat threads

This tool lists SRE Agent chat threads. It returns a read-only list of thread objects that include thread ID, participants, metadata, and the latest message, so you can review active and past conversations.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads list -->

Example prompts include:

- "List the active threads on SRE Agent 'sreagent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent threads list \
  [--resource-group <resource-group>] \
  [--agent <agent>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Threads: Send message to thread

This tool sends a message to an existing site reliability engineering (SRE) agent thread. It posts the specified message to the thread and returns the thread's updated state. Use concise messages to add context, status updates, or troubleshooting notes to an ongoing thread.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent threads send message -->

Example prompts include:

- "Send message 'Restart completed, monitoring logs' to thread ID 'thread-12345' on agent 'sre-agent-westus'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Message** |  Required | The message to send. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Thread ID** |  Optional | The SRE Agent thread ID. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent threads send message \
  --message <message> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--thread-id <thread-id>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--thread-id` | string | No | The SRE Agent thread ID. |
| `--message` | string | Yes | The message to send. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ✅ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workflows: Apply and deploy workflow

Apply and deploy a YAML workflow to an SRE Agent. This tool uploads and activates ExtendedAgent or ExtendedAgentTool YAML configuration on the specified SRE Agent resource.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows apply -->

Example prompts include:

- "Apply the workflow YAML with content 'apiVersion: sre/v1\nkind: ExtendedAgent\nmetadata:\n  name: deploy-workflow' to SRE Agent 'sre-agent-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **YAML content** |  Required | YAML content. |
| **Agent** |  Optional | The name of the Azure SRE Agent resource to target. |
| **Source name** |  Optional | Optional source name. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent workflows apply \
  --yaml-content <yaml-content> \
  [--resource-group <resource-group>] \
  [--agent <agent>] \
  [--source-name <source-name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | No | The name of the Azure resource group. This name is a logical container for Azure resources. |
| `--agent` | string | No | The name of the Azure SRE Agent resource to target. |
| `--yaml-content` | string | Yes | YAML content. |
| `--source-name` | string | No | Optional source name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workflows: Generate workflow definition

Generate a YAML workflow definition for a named site reliability engineering (SRE) Agent tool or agent. This tool creates validated YAML configuration for `ExtendedAgent`, `KustoTool`, and `LinkTool` resources. The generated workflow helps you deploy and manage SRE Agent tools consistently across environments.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows generate -->

Example prompts include:

- "Generate a YAML workflow with description 'Kusto query tool for incident search', kind 'tool', name 'kusto-search-tool'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Description** |  Required | A description for the SRE Agent item. |
| **Kind** |  Required | YAML kind: agent or tool. |
| **Name** |  Required | The name of the SRE Agent item. |
| **Connector** |  Optional | The connector name for Kusto tools. |
| **Database name** |  Optional | The Kusto database for Kusto tools. |
| **Model or type** |  Optional | Tool type, such as KustoTool or LinkTool. |
| **Parameters** |  Optional | Parameters as name:description. |
| **Query** |  Optional | The Kusto query for Kusto tools. |
| **Tools** |  Optional | Tool names to attach. Multiple values are supported. |
| **URL template** |  Optional | The URL template for link tools. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


```console
azmcp sreagent workflows generate \
  --kind <kind> \
  --name <name> \
  --description <description> \
  [--model-or-type <model-or-type>] \
  [--tools <tools>] \
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
| `--connector` | string | No | The connector name for Kusto tools. |
| `--database` | string | No | The Kusto database for Kusto tools. |
| `--query` | string | No | The Kusto query for Kusto tools. |
| `--url-template` | string | No | The URL template for link tools. |
| `--parameters` | string | No | Parameters as name:description. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Workflows: Validate workflow

This tool validates SRE Agent workflow YAML and flags common issues in structure and syntax. It checks for invalid YAML, malformed steps, incorrect `run` strings, and missing required keys. You provide `YAML content`, and the tool returns identified issues with line numbers and suggested fixes. See the following example for a typical error the tool detects.

#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli sreagent workflows validate -->

Example prompts include:

- "Validate the following SRE Agent workflow YAML content 'apiVersion: sre/v1\nkind: ExtendedAgent\nmetadata:\n  name: deploy-workflow'." 

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **YAML content** |  Required | YAML content. |

#### [Azure MCP CLI](#tab/azure-mcp-cli)


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





