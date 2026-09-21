---

title: Azure MCP Server tools for Azure Resilience
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Azure Resilience resources.
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 16
mcp-cli.version: 3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5
author: diberry
ms.author: diberry
ms.reviewer: vigera
ms.date: 08/24/2026
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Resilience

The Azure MCP Server uses natural language prompts to manage Azure Resilience resources. You can use it to create, delete, get, and update resources.

Azure Resiliency is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Resiliency](/azure/resiliency/resiliency-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Drill: Get or list drills

Gets or lists resilience drills in a service group. A resilience drill is a scheduled fault-injection exercise. Provide a drill name to return that drill's definition: its schedule, configuration, and metadata. Omit the name to list every resilience drill by ID and name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience drill get \
  --service-group <service-group> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `name` | string | No | The name of the resilience drill. Provide this argument to get the details of a particular drill; omit it to list all drills in the service group (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience drill get -->

Example prompts include:

- "List all resilience drills in service group `prod-service-group`."
- "Get the details of drill `quarterly-failover-test` in service group `prod-service-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the resilience drill. Provide this argument to get the details of a particular drill; omit it to list all drills in the service group (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Drill resource: Get or list drill resources

Lists or gets the drill resources, also called drill targets, for a resilience drill in a service group. List all drill resources for a resilience drill, or get the details of a single drill resource by name, including its Azure Resource Manager properties. Requires the parent drill name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience drill resource get \
  --service-group <service-group> \
  --drill <drill> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `drill` | string | Yes | The name of the resilience drill. |
| `name` | string | No | The name of the drill resource (target). Provide this argument to get the details of a particular drill resource. Omit it to list all resources (targets) of the drill, showing only the ID and name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience drill resource get -->

Example prompts include:

- "List all resources (targets) of drill `quarterly-failover-test` in service group `prod-service-group`."
- "Get the drill resource `db-primary-01` for drill `quarterly-failover-test` in service group `prod-service-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Drill** |  Required | The name of the resilience drill. |
| **Name** |  Optional | The name of the drill resource (target). Provide this argument to get the details of a particular drill resource. Omit it to list all resources (targets) of the drill, showing only the ID and name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Goal assignment: Get or list assignments

Gets resilience goal assignments in the specified `Service group`. Provide a goal assignment name to get the full details for that assignment: ID, name, goal assignment type, goal template ID, and provisioning state. Omit the name to list all goal assignments in the `Service group`, returning only their ID and name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience goal assignment get \
  --service-group <service-group> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `name` | string | No | The name of the goal assignment. Provide this argument to get the details of a particular goal assignment; omit it to list all goal assignments in the service group (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience goal assignment get -->

Example prompts include:

- "List all resilience goal assignments in service group `prod-service-group`."
- "Get the details of goal assignment `ha-goal` in service group `prod-service-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the goal assignment. Provide this argument to get the details of a particular goal assignment; omit it to list all goal assignments in the service group (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Goal resource: Get or list assignment resources

Gets the resources (members) of a resilience goal assignment. When you specify a goal resource name, it returns full details for that resource, including ID, name, disaster recovery and high availability attestation status, goal participation, exclusion reasons, provisioning state, the Azure Resource Manager resource ID, and service group memberships. When you omit the name, it lists all resources in the goal assignment and returns each resource's ID and name only.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience goal resource get \
  --service-group <service-group> \
  --goal-assignment <goal-assignment> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `goal-assignment` | string | Yes | The name of the goal assignment. |
| `name` | string | No | The name of the goal resource. Provide this argument to get details for a specific goal resource; omit it to list all resources (members) of the goal assignment (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience goal resource get -->

Example prompts include:

- "List all resources (members) of goal assignment `regional-failover` in service group `storage-services`."
- "Get the goal resource `db-primary-01` for goal assignment `regional-failover` in service group `storage-services`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Goal assignment** |  Required | The name of the goal assignment. |
| **Name** |  Optional | The name of the goal resource. Provide this argument to get details for a specific goal resource. Omit it to list all resources (members) of the goal assignment (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Goal template: Get or list templates

Gets resilience goal templates in the specified service group. Provide a template `name` to get its full details, such as ID, name, goal type, provisioning state, recovery point objective (RPO), recovery time objective (RTO), and high availability and disaster recovery requirements. Omit the `name` to list all templates in the service group. In that case, the tool returns only each template's ID and name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience goal template get \
  --service-group <service-group> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `name` | string | No | The name of the goal template. Provide this argument to get details for a specific goal template; omit it to list all goal templates in the service group (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience goal template get -->

Example prompts include:

- "List all resilience goal templates in service group `core-services`."
- "Get the details of goal template `high-availability` in service group `web-services`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the goal template. Provide this argument to get details for a specific goal template; omit it to list all goal templates in the service group (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery job: Get or list recovery jobs

Lists the recovery jobs for a resilience recovery plan. Provide a recovery job name to get full details for that job. Omit the name to return only the ID and name for each recovery job in the plan. View job status and identifiers for troubleshooting or tracking recovery operations.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery job get \
  --service-group <service-group> \
  --recovery-plan <recovery-plan> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan. |
| `name` | string | No | The name of the recovery job. Provide this argument to get the details of a particular recovery job; omit it to list all recovery jobs of the recovery plan (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery job get -->

Example prompts include:

- "List all recovery jobs of recovery plan `prod-recovery-plan` in service group `backend-services`."
- "Get the details of recovery job `api-failover-job` for recovery plan `staging-recovery` in service group `api-sg`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Name** |  Optional | The name of the recovery job. Provide this argument to get the details of a particular recovery job; omit it to list all recovery jobs of the recovery plan (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery job resource: Get or list job resources

Lists the resources (targets) of a resilience recovery job. Specify the recovery job name to return full details for that resource. Omit the name to list all resources for the recovery job. The tool returns each resource's ID and name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery job resource get \
  --service-group <service-group> \
  --recovery-plan <recovery-plan> \
  --recovery-job <recovery-job> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan. |
| `recovery-job` | string | Yes | The name of the recovery job. |
| `name` | string | No | The name of the recovery job resource (target). Provide this argument to get the details of a particular recovery job resource. Omit it to list all resources (targets) of the recovery job (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery job resource get -->

Example prompts include:

- "List all resources (targets) of recovery job `rjob-prod` for recovery plan `rp-finance` in service group `sg-payments`."
- "Get the recovery job resource name `db-vm-01` for recovery job `rjob-prod` of recovery plan `rp-finance` in service group `sg-payments`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Recovery job** |  Required | The name of the recovery job. |
| **Name** |  Optional | The name of the recovery job resource (target). Provide this argument to get the details of a particular recovery job resource. Omit it to list all resources (targets) of the recovery job (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery plan: Create or update a recovery plan

Creates a new zone-resilient recovery plan in a service group, or fully updates an existing one. Creation requires a plan description and a managed identity type (`SystemAssigned`, `UserAssigned`, or `SystemAndUserAssigned`); don't assume an identity type if you don't specify one. Updates can switch identity types, but can't replace an existing user-assigned identity with a different one. Updates preserve the default recovery group ID, additional recovery groups, and any omitted descriptions.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery plan create \
  --service-group <service-group> \
  --recovery-plan <recovery-plan> \
  --plan-type Zonal \
  [--plan-description <plan-description>] \
  --identity-type <SystemAssigned|UserAssigned|SystemAndUserAssigned> \
  [--user-assigned-identity <user-assigned-identity-resource-id>] \
  [--default-group-description <default-group-description>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan to create or fully update. |
| `plan-type` | string | Yes | The recovery plan type. Supported value: `Zonal`. You can't change the type after creation. |
| `plan-description` | string | No | The recovery plan description, from 5 to 50 characters. Required when creating a plan; on update, the existing description remains if you omit it. |
| `identity-type` | string | Yes | The managed identity type for the recovery plan. Supported values: `SystemAssigned`, `UserAssigned`, `SystemAndUserAssigned`. |
| `user-assigned-identity` | string | No | The full resource ID of the user-assigned managed identity. Required when `identity-type` is `UserAssigned` or `SystemAndUserAssigned`. |
| `default-group-description` | string | No | The default recovery group description, from 5 to 50 characters. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery plan create -->

Example prompts include:

- "Create a zone-resilient recovery plan `app-failover-plan` with description `Primary app failover plan` and a system-assigned identity in service group `prod-service-group`."
- "Update recovery plan `app-failover-plan` in service group `prod-service-group` to use a user-assigned identity `/subscriptions/.../userAssignedIdentities/my-identity`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan to create or fully update. |
| **Plan type** |  Required | The recovery plan type. Supported value: `Zonal`. You can't change the type after creation. |
| **Plan description** |  Optional | The recovery plan description, from 5 to 50 characters. Required when creating a plan; on update, the existing description remains if you omit it. |
| **Identity type** |  Required | The managed identity type for the recovery plan. Supported values: `SystemAssigned`, `UserAssigned`, `SystemAndUserAssigned`. Updates can switch identity types but can't replace an existing user-assigned identity with a different one. |
| **User-assigned identity** |  Optional | The full resource ID of the user-assigned managed identity. Required when **Identity type** is `UserAssigned` or `SystemAndUserAssigned`. Not allowed when it's `SystemAssigned`. |
| **Default group description** |  Optional | The default recovery group description, from 5 to 50 characters. On update, the existing description remains if you omit it. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Recovery plan: Delete a recovery plan

Deletes a resilience recovery plan from a service group, and reports whether the plan existed.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery plan delete \
  --service-group <service-group> \
  --recovery-plan <recovery-plan>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan to delete. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery plan delete -->

Example prompts include:

- "Delete recovery plan `app-failover-plan` in service group `prod-service-group`."
- "Remove the recovery plan named `staging-recovery` from service group `staging-service-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan to delete. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Recovery plan: Get or list recovery plans

Retrieves resilience recovery plans in the specified `Service group`. Provide a recovery plan name to get the plan's full details, including its properties and provisioning state. Omit the name to list all recovery plans in the `Service group`; the tool returns each plan's ID and name only.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery plan get \
  --service-group <service-group> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `name` | string | No | The name of the recovery plan. Provide this argument to get the details of a particular recovery plan; omit it to list all recovery plans in the service group (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery plan get -->

Example prompts include:

- "List all resilience recovery plans in service group `prod-service-group`."
- "Get the details of recovery plan `app-failover-plan` in service group `staging-service-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Name** |  Optional | The name of the recovery plan. Provide this argument to get the details of a particular recovery plan; omit it to list all recovery plans in the service group (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery plan resource: Get or list plan resources

Lists resources (members) of a resilience recovery plan. Provide a `recovery resource name` to get full details for that resource. Omit the `recovery resource name` to list all resources in the recovery plan. The tool returns only each resource's ID and name.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery plan resource get \
  --service-group <service-group> \
  --recovery-plan <recovery-plan> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan. |
| `name` | string | No | The name of the recovery resource (member). Provide this argument to get the details of a particular recovery resource; omit it to list all resources (members) of the recovery plan (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery plan resource get -->

Example prompts include:

- "List all resources (members) of recovery plan `prod-rp` in service group `core-services`."
- "Get the recovery resource `db-server-01` for recovery plan `prod-rp` in service group `core-services`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan. |
| **Name** |  Optional | The name of the recovery resource (member). Provide this argument to get the details of a particular recovery resource. Omit it to list all resources (members) of the recovery plan (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Recovery plan resource: Update plan resources

Updates recovery resources in a resilience recovery plan. You can include and configure a resource with protection settings, keep a resource in the plan but exclude it from recovery operations, or remove a resource from the plan while retaining the plan and all other resources. Supports `CustomRunbook` (failover and reprotect runbooks) and `AzureSiteRecovery` (virtual machines only, with disk reprotection, staging storage, and a test failover virtual network).

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience recovery plan resource update \
  --service-group <service-group> \
  --recovery-plan <recovery-plan> \
  [--resources-to-update '<json-array>'] \
  [--resources-to-remove '<json-array>']
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `service-group` | string | Yes | The name of the service group. |
| `recovery-plan` | string | Yes | The name of the recovery plan to update. |
| `resources-to-update` | string | No | A JSON array of recovery resources to include, exclude, or configure. Each item must contain its `recoveryResourceUniqueId`. |
| `resources-to-remove` | string | No | A JSON array of full recovery resource IDs to remove from the recovery plan. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience recovery plan resource update -->

Example prompts include:

- "Include resource `db-server-01` in recovery plan `prod-rp` in service group `core-services` with its protection settings."
- "Exclude resource `db-server-01` from recovery operations in recovery plan `prod-rp` in service group `core-services`, but keep it in the plan."
- "Remove resource `db-server-01` from recovery plan `prod-rp` in service group `core-services`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Service group** |  Required | The name of the service group. |
| **Recovery plan** |  Required | The name of the recovery plan to update. |
| **Resources to update** |  Optional | A JSON array of recovery resources to include, exclude, or configure. Each item must contain its `recoveryResourceUniqueId`. |
| **Resources to remove** |  Optional | A JSON array of full recovery resource IDs to remove from the recovery plan. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Usage plan: Create or update a usage plan

Creates or updates a resilience usage plan in the specified resource group with the given plan type, and returns the usage plan information including ID, name, resource type, location, tags, plan type, and provisioning state. If the usage plan already exists, the operation updates its properties.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience usageplan create \
  --resource-group <resource-group> \
  --usage-plan <usage-plan> \
  --plan-type <plan-type>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | Yes | The Azure resource group name. |
| `usage-plan` | string | Yes | The name of the usage plan. |
| `plan-type` | string | Yes | The plan type of the usage plan. Supported values: `Basic`, `Standard`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience usageplan create -->

Example prompts include:

- "Create a resilience usage plan `contoso-plan-01` with plan type Basic in resource group `rg-resilience`."
- "Update resilience usage plan `contoso-plan-01` in resource group `rg-resilience` to use the Standard plan type."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The Azure resource group name. |
| **Usage plan** |  Required | The name of the usage plan. |
| **Plan type** |  Required | The plan type of the usage plan. Supported values: `Basic`, `Standard`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Usage plan enrollment: Create or update an enrollment

Creates or updates an enrollment under a resilience usage plan, associates it with the specified service group, and returns the enrollment information, including `id`, `name`, the associated service group `id`, `provisioningState`, and `error` details.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience usageplan enrollment create \
  --resource-group <resource-group> \
  --usage-plan <usage-plan> \
  --enrollment <enrollment> \
  --service-group <service-group>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | Yes | The Azure resource group name. |
| `usage-plan` | string | Yes | The name of the usage plan. |
| `enrollment` | string | Yes | The name of the usage plan enrollment. |
| `service-group` | string | Yes | The name of the service group to associate with the enrollment. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience usageplan enrollment create -->

Example prompts include:

- "Create a usage plan enrollment `enroll-01` for usage plan `prod-usageplan` associated with service group `sg-payments` in resource group `rg-resilience`."
- "Update enrollment `enroll-01` under usage plan `prod-usageplan` to use service group `sg-payments` in resource group `rg-resilience`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The Azure resource group name. |
| **Usage plan** |  Required | The name of the usage plan. |
| **Enrollment** |  Required | The name of the usage plan enrollment. |
| **Service group** |  Required | The name of the service group to associate with the enrollment. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Usage plan enrollment: Get or list enrollments

Lists enrollments in a resilience usage plan. Provide an enrollment name to retrieve full details for that enrollment, including its `id`, `name`, associated service group ID, `provisioningState`, and any `error` details. Omit the enrollment name to list all enrollments in the usage plan. The tool returns only each enrollment's `id` and `name`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience usageplan enrollment get \
  --resource-group <resource-group> \
  --usage-plan <usage-plan> \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | Yes | The Azure resource group name. |
| `usage-plan` | string | Yes | The name of the usage plan. |
| `name` | string | No | The name of the usage plan enrollment. Provide this argument to get the details of a particular enrollment; omit it to list all enrollments of the usage plan (ID and name only). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience usageplan enrollment get -->

Example prompts include:

- "List all enrollments of usage plan `prod-usageplan` in resource group `rg-resilience`."
- "Get the details of usage plan enrollment `enroll-01` for usage plan `prod-usageplan` in resource group `rg-resilience`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Usage plan** |  Required | The name of the usage plan. |
| **Name** |  Optional | The name of the usage plan enrollment. Provide this argument to get the details of a particular enrollment. Omit it to list all enrollments of the usage plan (ID and name only). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Usage plan: Get or list usage plans

Gets resilience usage plans. Provide the `name` and `resource-group` to return full details for a specific usage plan, including ID, name, resource type, location, tags, plan type, and provisioning state. Omit the `name` to list usage plans for the specified `resource-group`, or across the subscription when you don't supply a `resource-group`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp resilience usageplan get \
  [--resource-group <resource-group>] \
  [--name <name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | The name of the usage plan. Provide this argument to get the details of a particular usage plan (requires a resource group); omit it to list usage plans (ID and name only) for the resource group, or for the whole subscription when you don't provide a resource group. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli resilience usageplan get -->

Example prompts include:

- "List all resilience usage plans in my subscription."
- "List all resilience usage plans in resource group `rg-resilience`."
- "Get details of usage plan `resilience-plan-1` in resource group `rg-resilience`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Optional | The name of the usage plan. Provide this argument to get the details of a particular usage plan (requires a resource group); omit it to list usage plans (ID and name only) for the resource group, or for the whole subscription when you don't provide a resource group. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)