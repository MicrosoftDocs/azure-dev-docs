---

title: Azure MCP Server tools for Azure Resilience
description: Use Azure MCP Server tools to manage Azure Resilience resources with natural language prompts from your IDE.
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 9
mcp-cli.version: 3.0.0-beta.23+a497e6eafc2ef4dfb88776c24592d4260b907b82
author: diberry
ms.author: diberry
ms.reviewer: vigera
ms.date: 07/09/2026
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Resilience

The Azure MCP Server lets you manage Azure Resilience resources, including: get, with natural language prompts.

Azure Resiliency is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Resiliency](/azure/resiliency/resiliency-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Goal assignment: Get or list assignments

<!-- @mcpcli resilience goal assignment get -->

Gets resilience goal assignments in the specified `Service group`. Provide a goal assignment name to get the full details for that assignment: id, name, goal assignment type, goal template id, and provisioning state. Omit the name to list all goal assignments in the `Service group`, returning only their id and name.

Example prompts include:

- "List all resilience goal assignments in service group 'prod-service-group'."
- "Get the details of goal assignment 'ha-goal' in service group 'prod-service-group'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the goal assignment. Provide this argument to get the details of a particular goal assignment; omit it to list all goal assignments in the service group (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Goal resource: Get or list assignment resources

<!-- @mcpcli resilience goal resource get -->

Gets the resources (members) of a resilience goal assignment. When you specify a goal resource name, it returns full details for that resource, including ID, name, disaster recovery and high availability attestation status, goal participation, exclusion reasons, provisioning state, the resource ARM ID, and service group memberships. When you omit the name, it lists all resources in the goal assignment and returns each resource's ID and name only.

Example prompts include:

- "List all resources (members) of goal assignment 'regional-failover' in service group 'storage-services'."
- "Get the goal resource 'db-primary-01' for goal assignment 'regional-failover' in service group 'storage-services'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Goal assignment** |  Required | The name of the goal assignment. |
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the goal resource. Provide this argument to get the details of a particular goal resource. Omit it to list all resources (members) of the goal assignment (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Goal template: Get or list templates

<!-- @mcpcli resilience goal template get -->

Gets resilience goal templates in the specified service group. Provide a template `name` to get full details for that template, such as `id`, `name`, goal type, provisioning state, recovery point objective (RPO), recovery time objective (RTO), and high availability and disaster recovery requirements. Omit the `name` to list all templates in the service group. In that case, the tool returns only each template's `id` and `name`.

Example prompts include:

- "List all resilience goal templates in service group 'core-services'."
- "Get the details of goal template 'high-availability' in service group 'web-services'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the goal template. Provide this argument to get the details of a particular goal template; omit it to list all goal templates in the service group (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery job: Get or list recovery jobs

<!-- @mcpcli resilience recovery job get -->

Lists the recovery jobs for a resilience recovery plan. Provide a recovery job name to get full details for that job. Omit the name to return only the ID and name for each recovery job in the plan. View job status and identifiers for troubleshooting or tracking recovery operations.

Example prompts include:

- "List all recovery jobs of recovery plan 'prod-recovery-plan' in service group 'backend-services'."
- "Get the details of recovery job 'api-failover-job' for recovery plan 'staging-recovery' in service group 'api-sg'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the recovery job. Provide this argument to get the details of a particular recovery job; omit it to list all recovery jobs of the recovery plan (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery job resource: Get or list job resources

<!-- @mcpcli resilience recovery job resource get -->

Lists the resources (targets) of a resilience recovery job. Specify the recovery job name to return full details for that resource. Omit the name to list all resources for the recovery job. The tool returns each resource's ID and name.

Example prompts include:

- "List all resources (targets) of recovery job 'rjob-prod' for recovery plan 'rp-finance' in service group 'sg-payments'."
- "Get the recovery job resource name 'db-vm-01' for recovery job 'rjob-prod' of recovery plan 'rp-finance' in service group 'sg-payments'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recovery job** |  Required | The name of the recovery job. |
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the recovery job resource (target). Provide this argument to get the details of a particular recovery job resource. Omit it to list all resources (targets) of the recovery job (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery plan: Get or list recovery plans

<!-- @mcpcli resilience recovery plan get -->

Retrieves resilience recovery plans in the specified `Service group`. Provide a recovery plan name to get the plan's full details, including its properties and provisioning state. Omit the name to list all recovery plans in the `Service group`; the tool returns each plan's ID and name only.

Example prompts include:

- "List all resilience recovery plans in service group 'prod-service-group'."
- "Get the details of recovery plan 'app-failover-plan' in service group 'staging-service-group'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the recovery plan. Provide this argument to get the details of a particular recovery plan; omit it to list all recovery plans in the service group (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery plan resource: Get or list plan resources

<!-- @mcpcli resilience recovery plan resource get -->

Lists resources (members) of a resilience recovery plan. Provide a `recovery resource name` to get full details for that resource. Omit the `recovery resource name` to list all resources in the recovery plan. The tool returns only each resource's ID and name.

Example prompts include:

- "List all resources (members) of recovery plan 'prod-rp' in service group 'core-services'."
- "Get the recovery resource 'db-server-01' for recovery plan 'prod-rp' in service group 'core-services'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the recovery resource (member). Provide this argument to get the details of a particular recovery resource. Omit it to list all resources (members) of the recovery plan (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Usage plan enrollment: Get or list enrollments

<!-- @mcpcli resilience usageplan enrollment get -->

Lists enrollments in a resilience usage plan. Provide an enrollment name to retrieve full details for that enrollment, including its `id`, `name`, associated service group ID, `provisioningState`, and any `error` details. Omit the enrollment name to list all enrollments in the usage plan. The tool returns only each enrollment's `id` and `name`.

Example prompts include:

- "List all enrollments of usage plan `prod-usageplan` in resource group `rg-resilience`."
- "Get the details of usage plan enrollment `enroll-01` for usage plan `prod-usageplan` in resource group `rg-resilience`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Usage plan** |  Required | The name of the usage plan. |
| **Name** |  Optional | The name of the usage plan enrollment. Provide this argument to get the details of a particular enrollment. Omit it to list all enrollments of the usage plan (ID and name only). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Usage plan: Get or list usage plans

<!-- @mcpcli resilience usageplan get -->

Gets resilience usage plans. Provide the `name` and `resource-group` to return full details for a specific usage plan, including ID, name, resource type, location, tags, plan type, and provisioning state. Omit the `name` to list usage plans for the specified `resource-group`, or across the subscription when no `resource-group` is supplied.

Example prompts include:

- "List all resilience usage plans in my subscription."
- "List all resilience usage plans in resource group 'rg-resilience'."
- "Get details of usage plan 'resilience-plan-1' in resource group 'rg-resilience'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Optional | The name of the usage plan. Provide this argument to get the details of a particular usage plan (requires a resource group); omit it to list usage plans (ID and name only) for the resource group, or for the whole subscription when no resource group is given. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)