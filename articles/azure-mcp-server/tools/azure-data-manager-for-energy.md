---
title: Azure MCP Server tools for Azure Data Manager for Energy
description: Azure MCP Server helps you check endpoints, inspect schemas, and search or retrieve OSDU records in Azure Data Manager for Energy.
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 8
mcp-cli.version: 3.0.0-beta.44+32200bb8396d0f7dcbebc7f6d96a38fc147881d1
author: diberry
ms.author: diberry
ms.reviewer: aysriva
ms.date: 09/23/2026
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Data Manager for Energy

By using Azure MCP Server, you can retrieve or search for OSDU records or schemas in Azure Data Manager for Energy by using natural language prompts.

[Azure Data Manager for Energy](/azure/energy-data-services/overview-microsoft-energy-data-services) is a managed cloud data platform for the energy industry. It combines the capabilities of the OSDU® Data Platform with Azure services to help organizations manage, store, search, and share energy data.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Health: Check

Checks an ADME/OSDU endpoint for health, authentication, and connectivity. Returns the service health status, detailed error information, and the HTTP status code.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme health check --endpoint <endpoint> \
                         --data-partition <data-partition>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme health check -->

Example prompts include:

- "Check the health, authentication, and connectivity of the Azure Data Manager for Energy endpoint `https://contoso.energy.azure.com` for data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Schema: Get

Gets one ADME/OSDU schema by exact `Kind`, and returns the full JSON definition, including fields, property types, and structure. It's useful to inspect nested types, arrays, and property metadata to validate schema design or map incoming data.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme schema get --endpoint <endpoint> \
                       --data-partition <data-partition> \
                       --kind <authority:source:entity-type:version> 
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kind` | string | Yes | The fully-qualified kind `authority:source:type:version`, for example `osdu:wks:master-data--Well:1.0.0`. Wildcards aren't supported. Use `azmcp adme schema list` to discover valid kinds and versions. |
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme schema get -->

Example prompts include:

- "Get the schema `osdu:wks:master-data--Well:1.0.0` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Show the fields, property types, and structure of the OSDU schema `osdu:wks:work-product-component--WellLog:1.0.0` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Retrieve the full JSON definition for the OSDU schema `osdu:wks:master-data--Wellbore:1.0.0` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Kind** |  Required | The fully qualified kind `authority:source:type:version`, for example `osdu:wks:master-data--Well:1.0.0`. Wildcards aren't supported. Use `azmcp adme schema list` to discover valid kinds and versions. |
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Schema: List

List multiple ADME and OSDU schema descriptors. Use optional filters for `authority`, `source`, `entity type`, `status`, `scope`, `schema version`, `latest version`, `offset`, and `limit`. The command returns descriptors that match the specified filters.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme schema list --endpoint <endpoint> \
                        --data-partition <data-partition> \
                        [--authority <authority>] \
                        [--source <source>] \
                        [--entity-type <entity-type>] \
                        [--status <PUBLISHED|DEVELOPMENT|OBSOLETE>] \
                        [--scope <SHARED|INTERNAL>] \
                        [--schema-version-major <major>] \
                        [--schema-version-minor <minor>] \
                        [--schema-version-patch <patch>] \
                        [--latest-version <TRUE|FALSE>] \
                        [--offset <offset>] \
                        [--limit <limit>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |
| `authority` | string | No | Filter by the authority segment of the kind, for example `osdu` in `osdu:wks:master-data--Well:1.0.0`. |
| `source` | string | No | Filter by the source segment of the kind, for example `wks` in `osdu:wks:master-data--Well:1.0.0`. |
| `entity-type` | string | No | Filter by the entity type segment of the kind, for example `master-data--Well` or `work-product-component--WellLog`. |
| `status` | enumeration | No | Filter by lifecycle status: `PUBLISHED`, `DEVELOPMENT`, or `OBSOLETE`. Omit to return schemas in all lifecycle statuses. |
| `scope` | enumeration | No | Filter by scope: `SHARED` for system-defined schemas, `INTERNAL` for schemas defined in this data partition. Omit to return both. |
| `schema-version-major` | integer | No | Filter by schema major version, for example `1`. When combined with `--latest-version`, supply version filters in order (major, then minor). |
| `schema-version-minor` | integer | No | Filter by schema minor version, for example `0`. When `--latest-version` is `true`, requires `--schema-version-major`. |
| `schema-version-patch` | integer | No | Filter by schema patch version, for example `0`. When `--latest-version` is `true`, requires `--schema-version-major` and `--schema-version-minor`. |
| `latest-version` | boolean | No | Return only the newest version of each schema entity, collapsing duplicates across scopes. If the switch is included without a value, it defaults to `true`. When filtering by version, supply components in order: major, then minor, then patch. |
| `offset` | integer | No | The starting offset for paging; compare with the response's `totalCount` to decide whether to fetch further pages. |
| `limit` | integer | No | The number of schema descriptors to return in one page. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme schema list -->

Example prompts include:

- "List all shared Well schemas from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "List the latest published shared OSDU schemas for entity type `master-data--Well` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "List development OSDU schemas from authority `osdu` and source `wks` at endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |
| **Authority** |  Optional | Filter by the authority segment of the kind, for example `osdu` in `osdu:wks:master-data--Well:1.0.0`. |
| **Source** |  Optional | Filter by the source segment of the kind, for example `wks` in `osdu:wks:master-data--Well:1.0.0`. |
| **Entity type** |  Optional | Filter by the entity type segment of the kind, for example `master-data--Well` or `work-product-component--WellLog`. |
| **Status** |  Optional | Filter by lifecycle status: `PUBLISHED`, `DEVELOPMENT`, or `OBSOLETE`. Omit to return schemas in all lifecycle statuses. |
| **Scope** |  Optional | Filter by scope: `SHARED` for system-defined schemas, `INTERNAL` for schemas defined in this data partition. Omit to return both. |
| **Schema version major** |  Optional | Filter by schema major version, for example `1`. When combined with `--latest-version`, supply version filters in order (major, then minor). |
| **Schema version minor** |  Optional | Filter by schema minor version, for example `0`. When `--latest-version` is `true`, requires `--schema-version-major`. |
| **Schema version patch** |  Optional | Filter by schema patch version, for example `0`. When `--latest-version` is `true`, requires `--schema-version-major` and `--schema-version-minor`. |
| **Latest version** |  Optional | Return only the newest version of each schema entity, collapsing duplicates across scopes. When filtering by version, supply components in order: major, then minor, then patch. |
| **Offset** |  Optional | The starting offset for paging. Compare with the response's `totalCount` to decide whether to fetch further pages. |
| **Limit** |  Optional | The number of schema descriptors to return in one page. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Search

Searches ADME/OSDU records across one or more exact or wildcard kinds, using indexed criteria. Returns full records, selected fields, or aggregate counts.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme search --endpoint <endpoint> \
                  --data-partition <data-partition> \
                  --kind <authority:source:entity-type:version> [<kind>...] \
                  [--query <lucene-query>] \
                  [--limit <limit>] \
                  [--cursor-pagination-mode <TRUE|FALSE>] \
                  [--search-after <TRUE|FALSE>] \
                  [--cursor <cursor>] \
                  [--offset <offset>] \
                  [--returned-fields <path> [<path>...]] \
                  [--aggregate-by <path>] \
                  [--track-total-count <TRUE|FALSE>] \
                  [--sort <json-object>] \
                  [--spatial-filter <json-object>] \
                  [--query-as-owner <TRUE|FALSE>] \
                  [--excluded-fields <path> [<path>...]] \
                  [--highlighted-fields <path> [<path>...]] \
                  [--suggest-phrase <phrase>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kind` | array of strings | Yes | One or more kind selectors in `authority:source:type:version` format with optional `*` wildcards, for example `["osdu:wks:master-data--Well:1.0.0"]`. Several kinds are searched as a union. Use the narrowest kind; each `*` widens the scan and its cost. |
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |
| `query` | string | No | Optional Lucene filter over indexed fields, for example `data.FieldID:Volve*`. Prefix payload fields with `data.` and add `.keyword` for exact, case-sensitive, or `null` matches. Quote full record IDs. Trailing wildcards are supported; leading wildcard forms such as `*Volve` and `*Volve*` are rejected by ADME. Omit to match all records of the kind. |
| `limit` | integer | No | Page size (`1`-`1000`). Defaults to `10`. Pair a large page with `returnedFields`. |
| `cursor-pagination-mode` | boolean | No | Use cursor pagination for a point-in-time snapshot, bulk processing, or more than `10000` results. If the switch is omitted, it defaults to `false`. If the switch is included without a value, it defaults to `true`. A supplied cursor also selects cursor pagination. |
| `search-after` | boolean | No | Allow index changes to affect later cursor pages instead of using a point-in-time snapshot. If the switch is included without a value, it defaults to `true`. Keep enabled on continuation requests. |
| `offset` | integer | No | Starting offset for query pagination. Cannot be combined with cursor pagination, and `offset` + `limit` must be <= `10000`. |
| `cursor` | string | No | Continuation token from a previous cursor response. Supplying it selects cursor pagination; continue until `results` is empty. Resend all original cursor criteria unchanged because the service does not reliably retain page settings. If a continuation fails, restart from the first page to avoid missing records. Cannot be combined with `offset` or `aggregateBy` and expires after about `1 minute`. |
| `returned-fields` | array of strings | No | Optional field paths to project, for example `["id","kind","data.FacilityName"]`. Omit to return full records. |
| `aggregate-by` | string | No | Optional field to aggregate on for distinct values/counts, for example `kind` or `data.FacilityName.keyword`. Uses query pagination and cannot be combined with cursor. |
| `track-total-count` | boolean | No | Set `true` to request an exact `totalCount`. If the switch is included without a value, it defaults to `true`. Cursor searches always return an exact total count. |
| `sort` | string | No | Optional sort criteria. Provide a JSON object with equal-length `field` and `order` arrays, for example `{"field":["data.Name.keyword","id"],"order":["DESC","ASC"]}`. |
| `spatial-filter` | string | No | Geo-spatial filter (for example, `byBoundingBox` or `byDistance`). Pass a JSON object. A `field` that is not a geo-point yields `0` results rather than an error. |
| `query-as-owner` | boolean | No | If `true`, returns only records the user owns. If the switch is omitted, it defaults to `false`. If the switch is included without a value, it defaults to `true`. |
| `excluded-fields` | array of strings | No | Optional fields to exclude from the payload; may be ignored by the service, so prefer `returnedFields`. |
| `highlighted-fields` | array of strings | No | Optional fields to highlight with matched snippets in the response. |
| `suggest-phrase` | string | No | Optional phrase for `did you mean` spell-check; availability depends on service configuration. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme search -->

Example prompts include:

- "Search records of kind `osdu:wks:master-data--Well:1.0.0` that match the indexed-field Lucene filter `data.FacilityName:Volve*` at endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Search the kinds `osdu:wks:master-data--Well:*` and `osdu:wks:master-data--Wellbore:*` for records that match `data.Name:Volve*`, and return only `id`, `kind`, and `data.Name` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Search more than 10,000 records of kind `osdu:wks:master-data--Wellbore:*` as a cursor-paginated point-in-time snapshot, and return only `id`, `kind`, and `data.Name` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Continue the snapshot search by using the cursor from the previous response and resending the original kind `osdu:wks:master-data--Wellbore:*`, limit, and returned fields `id`, `kind`, and `data.Name` unchanged for endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Search records of kind `osdu:wks:master-data--Well:1.0.0` inside the specified bounding box and sort the results by `id` in descending order at endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Kind** |  Required | One or more kind selectors in `authority:source:type:version` format with optional `*` wildcards, for example `["osdu:wks:master-data--Well:1.0.0"]`. Several kinds are searched as a union. Use the narrowest kind because each `*` widens the scan and its cost. |
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |
| **Query** |  Optional | Optional Lucene filter over indexed fields, for example `data.FieldID:Volve*`. Prefix payload fields with `data.` and add `.keyword` for exact, case-sensitive, or `null` matches. Quote full record IDs. Trailing wildcards are supported, but ADME rejects leading wildcard forms such as `*Volve` and `*Volve*`. Omit to match all records of the kind. |
| **Limit** |  Optional | Page size (`1`-`1000`). Defaults to `10`. Pair a large page with `returnedFields`. |
| **Cursor pagination mode** |  Optional | Use cursor pagination for a point-in-time snapshot, bulk processing, or more than `10000` results. Defaults to `false` for real-time query pagination. A supplied cursor also selects cursor pagination. |
| **Search after** |  Optional | Allow index changes to affect later cursor pages instead of using a point-in-time snapshot. Keep enabled on continuation requests. |
| **Offset** |  Optional | Starting offset for query pagination. It can't be combined with cursor pagination, and `offset` + `limit` must be less than or equal to `10,000`. |
| **Cursor** |  Optional | Continuation token from a previous cursor response. Supplying it selects cursor pagination. Continue until `results` is empty. Resend all original cursor criteria unchanged because the service doesn't reliably retain page settings. If a continuation fails, restart from the first page to avoid missing records. The cursor can't be combined with `offset` or `aggregateBy` and expires after about `1 minute`. |
| **Returned fields** |  Optional | Optional field paths to project, for example `["id","kind","data.FacilityName"]`. Omit to return full records. |
| **Aggregate by** |  Optional | Optional field to aggregate on for distinct values or counts, for example `kind` or `data.FacilityName.keyword`. Uses query pagination and can't be combined with cursor. |
| **Track total count** |  Optional | Set `true` to request an exact `totalCount`. Cursor searches always return an exact total count. |
| **Sort** |  Optional | Optional sort criteria. Provide a JSON object with equal-length `field` and `order` arrays, for example `{"field":["data.Name.keyword","id"],"order":["DESC","ASC"]}`. |
| **Spatial filter** |  Optional | Geospatial filter, such as `byBoundingBox` or `byDistance`. Pass a JSON object. A `field` that isn't a geographic point returns no results instead of an error. |
| **Query as owner** |  Optional | If `true`, returns only records the user owns. Defaults to `false`. |
| **Excluded fields** |  Optional | Optional fields to exclude from the payload; may be ignored by the service, so prefer `returnedFields`. |
| **Highlighted fields** |  Optional | Optional fields to highlight with matched snippets in the response. |
| **Suggest phrase** |  Optional | Optional phrase for a "did you mean" spelling check. Availability depends on the service configuration. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## Storage record: Fetch

Fetches multiple ADME/OSDU records in a single batch by using record IDs. Returns full record content, selected attributes, or conversion status and errors.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme storage record fetch --endpoint <endpoint> \
                                  --data-partition <data-partition> \
                                  --ids <id> [<id>...] \
                                  [--attributes <path> [<path>...]] \
                                  [--frame-of-reference <TRUE|FALSE>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | array of strings | Yes | The fully qualified record IDs to fetch, each in the format `{partition}:{object-type}:{unique-id}`. Specify up to `20` IDs without `--attributes`, or up to `100` with it. |
| `endpoint` | string | Yes | The service endpoint, such as `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, such as `contoso-dp1`. |
| `attributes` | array of strings | No | Dotted-path fields to return instead of whole records, for example `data.Name` and `data.FileSourceInfo`. Use it only when specific fields are requested; it can't be combined with `--frame-of-reference`. |
| `frame-of-reference` | boolean | No | Convert measurements to `SI`, coordinates to `WGS84`, and dates to `UTC` on the server. If the switch is included without a value, it defaults to `true`. The response then includes `conversionStatuses`, which is empty for records without measured or spatial fields. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme storage record fetch -->

Example prompts include:

- "Fetch records `opendes:well:W-99` and `opendes:well:W-100` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Fetch the full content of records `opendes:well:W-99`, `opendes:well:W-100`, and `opendes:well:W-101` in one batch from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Fetch only `data.Name` and `data.Description` for records `opendes:well:W-99` and `opendes:well:W-100` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Fetch record `opendes:well:W-99` with frame-of-reference conversion, and report its conversion status and errors from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **IDs** |  Required | The fully qualified record IDs to fetch, each in the format `{partition}:{object-type}:{unique-id}`. Specify up to `20` IDs without `--attributes`, or up to `100` with it. |
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |
| **Attributes** |  Optional | Dotted-path fields to return instead of whole records, for example `data.Name` and `data.FileSourceInfo`. Use it only when specific fields are requested; it can't be combined with `--frame-of-reference`. |
| **Frame of reference** |  Optional | Convert measurements to `SI`, coordinates to `WGS84`, and dates to `UTC` on the server. The response then includes `conversionStatuses`, which is empty for records without measured or spatial fields. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Storage record: Get

Gets one ADME/OSDU record by record ID and returns the record content.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme storage record get --endpoint <endpoint> \
                                --data-partition <data-partition> \
                                --id <record-id> \
                                [--version <version>] \
                                [--attributes <path> [<path>...]]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The fully-qualified record ID `{partition}:{object-type}:{unique-id}`, such as `opendes:well:W-99`. Pass it verbatim as returned by `azmcp adme storage record list`. |
| `endpoint` | string | Yes | The service endpoint, such as `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, such as `contoso-dp1`. |
| `version` | 64-bit integer | No | The numeric record version to retrieve, such as `1704779151123456`. Omit to get the latest version. Use `azmcp adme storage record version list` to discover valid versions. |
| `attributes` | array of strings | No | Dotted-path fields to return from the requested record instead of the whole record, such as `data.WellID` and `data.Name`. Omit to return the full record. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme storage record get -->

Example prompts include:

- "Get the OSDU record `opendes:well:W-99` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Get version `1704779151123456` of OSDU record `opendes:well:W-99` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Get only `data.WellID` and `data.Name` from OSDU record `opendes:well:W-99` at endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **ID** |  Required | The fully-qualified record ID `{partition}:{object-type}:{unique-id}`, for example `opendes:well:W-99`. Pass it verbatim as returned by `azmcp adme storage record list`. |
| **Endpoint** |  Required | The service endpoint, such as `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, such as `contoso-dp1`. |
| **Version** |  Optional | The numeric record version to retrieve, for example `1704779151123456`. Omit to get the latest version. Use `azmcp adme storage record version list` to discover valid versions. |
| **Attributes** |  Optional | Dotted-path fields to return from the requested record instead of the whole record, for example `data.WellID` and `data.Name`. Omit to return the full record. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Storage record: List

List multiple ADME and OSDU record IDs for a specified kind. This command returns only IDs and supports pagination.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme storage record list --endpoint <endpoint> \
                                 --data-partition <data-partition> \
                                 --kind <authority:source:entity-type:version> \
                                 [--limit <limit>] \
                                 [--cursor <cursor>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `kind` | string | Yes | The fully qualified kind `{authority}:{source}:{entityType}:{version}`, such as `osdu:wks:master-data--Well:1.0.0`. Use `azmcp adme schema list` to discover valid kinds. |
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |
| `limit` | integer | No | The number of record IDs to return in one page, from `1` through `100`. Defaults to `10`. |
| `cursor` | string | No | The cursor returned by a previous page. Omit for the first page. A `null` cursor in the response means there are no more pages. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme storage record list -->

Example prompts include:

- "List record IDs for kind `osdu:wks:master-data--Well:1.0.0` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "List the first 25 record IDs for kind `osdu:wks:master-data--Well:1.0.0` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."
- "Continue listing record IDs for kind `osdu:wks:master-data--Well:1.0.0` by using the cursor from the previous response at endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Kind** |  Required | The fully qualified kind `{authority}:{source}:{entityType}:{version}`, such as `osdu:wks:master-data--Well:1.0.0`. Use `azmcp adme schema list` to find valid kinds. |
| **Endpoint** |  Required | The service endpoint, such as `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, such as `contoso-dp1`. |
| **Limit** |  Optional | The number of record IDs to return in one page, from `1` through `100`. Defaults to `10`. |
| **Cursor** |  Optional | The cursor returned by a previous page. Omit for the first page. A `null` cursor in the response means there are no more pages. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Storage record version: List

Lists versions of a single ADME/OSDU record by `ID`. Returns record versions ordered oldest first. Filters results to the specified `Endpoint` and `Data partition`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp adme storage record version list --endpoint <endpoint> \
                                         --data-partition <data-partition> \
                                         --id <record-id> 
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | The fully qualified record ID `{partition}:{object-type}:{unique-id}`, such as `opendes:well:W-99`. |
| `endpoint` | string | Yes | The service endpoint, for example `https://contoso.energy.azure.com`. |
| `data-partition` | string | Yes | The data partition to target, for example `contoso-dp1`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli adme storage record version list -->

Example prompts include:

- "List all versions of record `opendes:well:W-99` from endpoint `https://contoso.energy.azure.com` in data partition `contoso-dp1`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **ID** |  Required | The fully qualified record ID `{partition}:{object-type}:{unique-id}`, such as `opendes:well:W-99`. |
| **Endpoint** |  Required | The service endpoint, for example `https://contoso.energy.azure.com`. |
| **Data partition** |  Required | The data partition to target, for example `contoso-dp1`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Data Manager for Energy](/azure/energy-data-services/)
