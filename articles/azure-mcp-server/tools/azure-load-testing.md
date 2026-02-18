---
title: Azure Load Testing Tools - Azure MCP Server
description: "Learn how to use Azure MCP Server with Azure Load Testing to create, run, and analyze performance tests. Get started with load testing tools and natural language commands."
keywords: azure mcp server, azmcp, azure load testing, performance testing, stress testing, load tests
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.date: 02/18/2026
ms.topic: concept-article
---

# Azure Load Testing tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure resources, including Azure Load Testing services, using natural language prompts. This feature helps you quickly create and manage load tests without needing to remember complex syntax.

[Azure Load Testing](/azure/load-testing/overview-what-is-azure-load-testing) is a fully managed load testing service that helps you generate high-scale load to identify application performance bottlenecks. With Azure Load Testing, you can stress test your applications and validate performance, scalability, and capacity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Test: Create test

<!-- loadtesting test create -->

Creates a new load test in Azure Load Testing. Use this command to define and configure a load test for your application.

Example prompts include:

- **Create load test**: "Create a new load test with test resource 'loadtest-resource' test ID 'api-stress-001' display name 'API Stress Test' description 'Stress testing API endpoints' endpoint 'https://api.example.com' with 100 virtual users for 300 seconds duration and 60 seconds ramp-up time"
- **Set up test**: "Configure load test using test resource 'perf-test' test ID 'cart-load-001' display 'Shopping Cart Load Test' description 'Load test for cart API' endpoint 'https://cart.example.com/api' with 500 virtual users duration 600 seconds ramp-up 120 seconds"
- **New performance test**: "Create load test with test resource 'test-res' test ID 'peak-sim-001' display 'Peak Traffic Simulation' description 'Simulate peak traffic' endpoint 'https://app.example.com' 1000 virtual users 900 seconds duration 180 seconds ramp-up"
- **Initialize test**: "Set up load test with test resource 'ecommerce-test' test ID 'ecom-load-001' display 'E-commerce Load Test' description 'Load test for e-commerce site' endpoint 'https://shop.example.com' 200 virtual users 300 seconds duration 60 seconds ramp-up"
- **Test definition**: "Create test with test resource 'webapp-test' test ID 'web-load-001' display 'Web App Load Test' description 'Concurrent user simulation' endpoint 'https://webapp.example.com' 1000 virtual users 600 seconds duration 120 seconds ramp-up"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource to use. |
| **Test ID** | Required | A unique identifier for the test. |
| **Display** | Required | A user-friendly name for the new load test. |
| **Description** | Required | A description of the test and its purpose. |
| **Endpoint** | Required | The URL endpoint to test. |
| **Virtual users** | Required | The number of concurrent virtual users for the load test. |
| **Duration** | Required | The total duration of the test in seconds. |
| **Ramp-up time** | Required | The time period over which to gradually increase load to the specified number of virtual users. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting test create](../includes/tools/annotations/azure-load-testing-test-create-annotations.md)]

## Test: Get test details

<!-- loadtesting test get -->

Gets details about a specific load test in Azure Load Testing. Use this command to view the configuration and properties of an existing test.


Example prompts include:

- **View test details**: "Show me the configuration of load test with test resource 'loadtest-resource' and test ID 'api-stress-001'"
- **Check test setup**: "Get the details of test resource 'perf-test' with test ID 'peak-load-001' in resource group 'perf-testing'"
- **Test configuration**: "What are the settings for test resource 'prod-test' with test ID 'prod-readiness-001'?"
- **Examine test**: "Let me see the configuration of test resource 'test-res' with test ID 'recent-test-001'"
- **Test parameters**: "Show the parameters for test resource 'db-test' with test ID 'database-benchmark-001'"


| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource. |
| **Test ID** | Required | The unique identifier of the test. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting test get](../includes/tools/annotations/azure-load-testing-test-get-annotations.md)]

## Test resources: List test resources

<!-- loadtesting testresource list -->

Lists all test resources in the specified Azure subscription. Use this command to track and manage your load testing resources.
    
Example prompts include:

- **List test resources**: "Show me test resource 'loadtest-resource' in my subscription"
- **View available resources**: "What is test resource 'dev-loadtest' in my dev subscription?"
- **Resource inventory**: "List test resource 'perf-test-resource' in resource group 'performance-testing'"
- **Check environment**: "Show me test resource 'prod-test-resource' we provisioned in our subscription"
- **Find resources**: "Where is test resource 'webapp-test-resource' deployed?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of a specific test resource to filter by. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testresource list](../includes/tools/annotations/azure-load-testing-test-resource-list-annotations.md)]

## Test resources: Create test resource

<!-- loadtesting testresource create -->

Creates a test resource in Azure Load Testing. Use this command to set up resources needed for running load tests.

Example prompts include:

- **Create test resource**: "Create a new test resource 'loadtest-resource' for my load testing in resource group 'load-test-rg'"
- **Provision resources**: "Set up test resource 'perf-test-resource' for my performance testing in subscription 'test-sub'"
- **Initialize resource**: "Create test resource 'api-test-resource' for my 'api-load-test' in resource group 'perf-resources'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | A name for the new test resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testresource create](../includes/tools/annotations/azure-load-testing-test-resource-create-annotations.md)]

## Test runs: Create or update test run

<!-- @mcpcli loadtesting testrun createorupdate -->

Create or update a load test run execution. This command creates a new test run for a specified test in the load testing resource or updates metadata and display properties of an existing test run. This command does not modify the test plan configuration or create a new test/resource; it solely manages test run executions.

When creating, it triggers a new test run execution based on the existing test configuration. Use the `testrun ID` to specify the new run identifier. Note that create operations are NOT idempotent—each call starts a new test run with unique timestamps and execution states. 

When updating, this command modifies descriptive information (like display name and description) of a completed or in-progress test run for better organization and documentation. Update operations are idempotent, meaning repeated calls with the same values produce the same result. 

Example prompts include:
- "Create a new test run for the load test with ID 'test-id-123'"
- "Update the display name of test run ID 'testrun-456' to 'Updated Test Run'"
- "I need to create a new load test run for the test ID 'test-id-789'"
- "How can I update the description for test run ID 'testrun-101' to 'New test execution with changes'?"
- "Show me how to create a test run for load test 'test-id-112' with a better display name"

| Parameter          | Required or optional | Description                                                                 |
|--------------------|----------------------|-----------------------------------------------------------------------------|
| **Test ID**        | Required             | The ID of the load test for which you want to fetch the details.           |
| **Description**    | Optional             | The description for the load test run, providing additional context.       |
| **Display name**   | Optional             | A user-friendly display name to identify the load test run.               |
| **Old testrun ID** | Optional             | The ID of an existing test run to update. If provided, it will trigger a rerun of the specified test run ID. |
| **Test resource name** | Optional         | The name of the load test resource for which you want to fetch the details. |
| **Testrun ID**     | Optional             | The ID of the load test run for which you want to fetch the details.       |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌


## Test runs: Get or list test runs

<!-- @mcpcli loadtesting testrun get -->

Retrieve load test run details by `testrun` ID or list all test runs by `test` ID. This command returns execution details, including status, start and end times, progress, metrics, and artifacts. It does not return test configuration or resource details.

Example prompts include:
- "Show me all load test runs for test ID `test123`"
- "List all the test runs associated with load test ID `loadtest456`"
- "Get details for load test run ID `testrun789`"
- "What are the results for test run `testrun101` under load test ID `loadtest202`?"
- "Can you fetch the details for test run `testrun303`?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Test ID** | Optional | The ID of the load test for which you want to fetch the details. |
| **Test resource name** | Optional | The name of the load test resource for which you want to fetch the details. |
| **Testrun ID** | Optional | The ID of the load test run for which you want to fetch the details. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):
Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Test runs: List test runs

<!-- loadtesting testrun list -->

Lists all test runs for a specific load test in Azure Load Testing. Use this command to track the history and performance of your load tests.


Example prompts include:

- **View test history**: "Show me all test runs for test resource 'api-test' with test ID 'api-perf-001'"
- **Check recent tests**: "List test runs for test resource 'perf-test' with test ID 'load-001' in resource group 'perf-testing'"
- **View test results**: "What test runs exist for test resource 'webapp-test' with test ID 'web-load-001'?"
- **Test execution history**: "Show me test runs for test resource 'monthly-test' with test ID 'exec-001'"
- **Monitor test runs**: "List test runs for test resource 'prod-test' with test ID 'monitor-001'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource used for the test runs. |
| **Test ID** | Required | The ID of a specific test to filter test runs by. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testrun list](../includes/tools/annotations/azure-load-testing-test-run-list-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Load Testing documentation](/azure/load-testing/)
- [Create and run a load test](/azure/load-testing/quickstart-create-and-run-load-test)