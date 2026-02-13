---
title: Azure Load Testing Tools - Azure MCP Server
description: "Learn how to use Azure MCP Server with Azure Load Testing to create, run, and analyze performance tests. Get started with load testing tools and natural language commands."
keywords: azure mcp server, azmcp, azure load testing, performance testing, stress testing, load tests
ai-usage: ai-generated
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.date: 12/05/2025
ms.topic: concept-article
mcp-cli.version: 2.0.0-beta.19+526b8facdd707f352913f84af0195268a22dea6f
tool_count: 6
---

# Azure Load Testing tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure resources, including Azure Load Testing services, using natural language prompts. This feature helps you quickly create and manage load tests without needing to remember complex syntax.

[Azure Load Testing](/azure/load-testing/overview-what-is-azure-load-testing) is a fully managed load testing service that helps you generate high-scale load to identify application performance bottlenecks. With Azure Load Testing, you can stress test your applications and validate performance, scalability, and capacity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Test: Create test

<!-- @mcpcli loadtesting test create -->

Creates a new load test plan or configuration for performance testing scenarios. This command creates a basic URL-based load test that you can use to evaluate the performance and scalability of your web applications and APIs. The test configuration defines the target endpoint, load parameters, and test duration. Once you create a test plan, you can use it to trigger test runs for the endpoints. This command only sets up your test plan and does not trigger or create any test runs. It also does not create any test resource in Azure; it only creates a test in an already existing load test resource.

- "Create a new load test with ID `test-123` to evaluate my API performance."
- "Set up a load test plan for the endpoint `https://myapi.com/v1` with test ID `test-456`."
- "Can you create a test plan using load test ID `test-789` and set the virtual users to 100?"
- "Set up a load test plan for my application with ID `test-101`, targeting the endpoint `https://example.com`."
- "What do I need to do to create a load test for the ID `test-202` to check its performance?"

| Parameter             | Required or optional | Description                                                                                                                                      |
|-----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| **Test resource name**| Optional             | The name of the load test resource for which you want to fetch the details.                                                                    |
| **Test ID**           | Required             | The ID of the load test for which you want to fetch the details.                                                                              |
| **Description**       | Optional             | The description for the load test run. This provides additional context about the test run.                                                  |
| **Display name**      | Optional             | The display name for the load test run. This is a user-friendly name to identify the test run.                                               |
| **Endpoint**          | Optional             | The endpoint URL to be tested. This is the URL of the HTTP endpoint that will be subjected to load testing.                                    |
| **Virtual users**     | Optional             | Virtual users is a measure of load that is simulated to test the HTTP endpoint. (Default - 50).                                               |
| **Duration**          | Optional             | This is the duration for which the load is simulated against the endpoint. Enter decimals for fractional minutes (for example, 1.5 for 1 minute and 30 seconds). Default is 20 mins. |
| **Ramp up time**      | Optional             | The ramp-up time is the time it takes for the system to ramp-up to the total load specified. Enter decimals for fractional minutes (for example, 1.5 for 1 minute and 30 seconds). Default is 1 min. |

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Test: Get test details

<!-- @mcpcli loadtesting test get -->

Get the configuration and setup details for a load test by its **Test ID** in a Load Testing resource. This command returns only the test definition, which includes duration, ramp-up, virtual users, and endpoint. It does not return any test run results or execution data, nor does it provide resource details. Only the test configuration is fetched.

Example prompts include:
- "Get the configuration for load test with ID `test-id-123`"
- "Show me the details of the load test configuration for ID `loadtest-001`"
- "What are the setup details for load test ID `test-456`?"
- "I need to fetch the configuration for load test with ID `loadtest-abc`"
- "Get the setup info for the load test having ID `loadtest-789`"

| Parameter               | Required or optional | Description                                                               |
|-------------------------|----------------------|---------------------------------------------------------------------------|
| **Test ID**             | Required             | The ID of the load test for which you want to fetch the details.         |
| **Test resource name**  | Optional             | The name of the load test resource for which you want to fetch the details.|


Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Test resources: Get test resources

<!-- @mcpcli loadtesting testresource list -->

Lists all **Azure Load Testing** resources available in the selected subscription and resource group. This command returns metadata for each resource, including name, location, and status. Use this command to discover, manage, or audit load testing resources in your environment. Note that it does not return test plans or test runs.

Example prompts include:
- "Show me all **Azure Load Testing** resources in resource group 'rg-loadtest'"
- "What load testing resources are available under resource group 'prod-resources'?"
- "Get details for load testing resource 'loadtest-prod' in resource group 'rg-staging'"
- "List all load testing resources in resource group 'rg-development'"
- "Can you provide information on load testing resource 'loadtest-123' in 'rg-prod'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Test resource name** |  Optional | The name of the load test resource for which you want to fetch the details. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌


## Test resources: Create test resources

<!-- @mcpcli loadtesting testresource create -->

Returns the created Load Testing resource. This action creates the resource in Azure only; it does not create any test plan or test run. Once the resource is set up, you can configure test plans within the resource and trigger test runs for those plans.

- "Create a new load test with ID `test-123` to evaluate the performance of my API."
- "I want to set up a load test plan for the endpoint `https://myapi.com/v1` with test ID `test-456`."
- "Can you create a test plan using load test ID `test-789` and set the virtual users to 100?"
- "Set up a load test plan for my application with ID `test-101` targeting the endpoint `https://example.com`."
- "What do I need to do to create a load test for the ID `test-202` to check its performance?"

| Parameter             | Required or optional | Description                                                                         |
|-----------------------|----------------------|-------------------------------------------------------------------------------------|
| **Test ID**           | Required             | The ID of the load test for which you want to fetch the details.                  |
| **Test resource name** | Optional             | The name of the load test resource for which you want to fetch the details.       |
| **Description**       | Optional             | The description for the load test run, providing additional context about the test.|
| **Display name**      | Optional             | The user-friendly name for the load test run to help identify it.                 |
| **Endpoint**          | Optional             | The endpoint URL to be tested, which will be subject to load testing.             |
| **Virtual users**     | Optional             | The number of virtual users simulating load on the HTTP endpoint. (Default - 50).  |
| **Duration**          | Optional             | The duration for which the load is simulated against the endpoint, in minutes. Enter decimals for fractional minutes (e.g., 1.5 for 1 minute and 30 seconds). Default is 20 mins. |
| **Ramp up time**      | Optional             | The time it takes for the system to ramp up to the total load specified, in minutes. Enter decimals for fractional minutes (e.g., 1.5 for 1 minute and 30 seconds). Default is 1 min. |

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Test runs: Create or update test run

<!-- @mcpcli loadtesting testrun createorupdate -->

Create or update a load test run execution. This command creates a new test run for a specified test in the load testing resource or updates the metadata and display properties of an existing test run.

When creating, this command triggers a new test run execution based on the existing test configuration. Use the `test run ID` to specify the new run identifier. Create operations are **NOT** idempotent—each call starts a new test run with unique timestamps and execution states.

When updating, this command modifies descriptive information (display name, description) of a completed or in-progress test run for better organization and documentation. Update operations are idempotent—repeated calls with the same values produce the same result. This command does not modify the test plan configuration or create a new test/resource; it only manages test run executions.

Example prompts include:
- "Create a new test run for test ID `12345` in the load testing resource"
- "Update the display name for the test run with ID `run-67890` to `Updated Test Run`"
- "I need to start a new execution for test ID `54321` in the load testing resource"
- "What details can you provide for the test run ID `run-98765` in the load testing resource?"
- "Modify the description of the load test run with ID `run-13579` to `This is a critical performance test`"

| Parameter             | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Test ID**           | Required             | The ID of the load test for which you want to fetch the details. |
| **Test resource name** | Optional             | The name of the load test resource for which you want to fetch the details. |
| **Testrun ID**        | Optional             | The ID of the load test run for which you want to fetch the details. |
| **Display name**      | Optional             | The display name for the load test run. This is a user-friendly name to identify the test run. |
| **Description**       | Optional             | The description for the load test run. This provides additional context about the test run. |
| **Old testrun ID**    | Optional             | The ID of an existing test run to update. If provided, the command will trigger a rerun of the given test run ID. |

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Test runs: Get test run details

<!-- @mcpcli loadtesting testrun get -->

Get load test run details by test run ID, or list all test runs by test ID. This command returns execution details, including status, start and end times, progress, metrics, and artifacts. It does not return test configuration or resource details.

Example prompts include:
- "Get the details of the load test run with ID `test-id-123`."
- "Show me the execution status for the load test with ID `loadtest-001`."
- "What are the metrics for the load test run ID `test-456`?"
- "I need to retrieve the execution details for load test `loadtest-abc`."
- "Get the progress information for the load test run with ID `loadtest-789`."

| Parameter                | Required or optional | Description                                                                 |
|--------------------------|----------------------|-----------------------------------------------------------------------------|
| **Test ID**              | Required             | The ID of the load test for which you want to fetch the details.           |
| **Test resource name**   | Optional             | The name of the load test resource for which you want to fetch the details. |

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Load Testing documentation](/azure/load-testing/)
- - [Create and run a load test](/azure/load-testing/quickstart-create-and-run-load-test)