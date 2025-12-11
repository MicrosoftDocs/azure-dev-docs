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
ms.date: 12/05/2025
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

## Test runs: Create a test run

<!--  loadtesting testrun create -->

Creates a new test run for an existing load test in Azure Load Testing. Use this command to run the defined load test and generate performance metrics.

Example prompts include:

- **Run load test**: "Start test run with test resource 'loadtest-resource' test ID 'api-stress-001' testrun ID 'run-001' display 'API Stress Test Run' description 'First stress test run' old testrun ID 'baseline-run'"
- **Execute test**: "Run test with test resource 'perf-test' test ID 'peak-sim-001' testrun ID 'run-002' display 'Peak Simulation Run' description 'Peak traffic test execution' old testrun ID 'run-001'"
- **Initiate test run**: "Create test run with test resource 'webapp-test' test ID 'web-load-001' testrun ID 'run-003' display 'Web App Test Run' description 'Production load test' old testrun ID 'run-002'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource to use. |
| **Test ID** | Required | The ID of the test to run. |
| **Testrun ID** | Required | A custom ID to assign to this test run. |
| **Display** | Required | A user-friendly name for the test run. |
| **Description** | Required | A description of the test run and its purpose. |
| **Old testrun ID** | Required | The ID of a previous test run to compare results with. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testrun create](../includes/tools/annotations/azure-load-testing-test-run-create-annotations.md)]

## Test runs: Get test run details

<!-- loadtesting testrun get -->

Gets details about a specific test run in Azure Load Testing. Use this command to view the results and metrics of a completed or running test.

Example prompts include:

- **View test run details**: "Show me the results of test resource 'api-test' with testrun ID 'run-001'"
- **Check test run status**: "Get the status of test resource 'webapp-test' with testrun ID 'run-002'"
- **Test run metrics**: "What were the results of test resource 'checkout-test' with testrun ID 'run-003'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource used for the test run. |
| **Testrun ID** | Required | The ID of the test run. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testrun get](../includes/tools/annotations/azure-load-testing-test-run-get-annotations.md)]

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

## Test runs: Update test run

<!-- loadtesting testrun update -->

Updates an existing test run in Azure Load Testing. Use this command to modify a running or scheduled test run, such as stopping or adjusting test parameters.

Example prompts include:

- **Stop a test run**: "Stop test run with test resource 'prod-test' test ID 'api-001' testrun ID 'run-001' display 'Stopped API Test' description 'Test stopped due to errors'"
- **Cancel testing**: "Cancel test with test resource 'loadtest-resource' test ID 'load-001' testrun ID 'run-123456' display 'Cancelled Test' description 'Test cancelled by user'"
- **Abort test**: "Stop test with test resource 'test-env-resource' test ID 'perf-001' testrun ID 'run-002' display 'Aborted Test' description 'Test aborted'"
- **Update test parameters**: "Modify test with test resource 'webapp-test' test ID 'web-001' testrun ID 'run-003' display 'Modified Test' description 'Reduced virtual users to 100'"
- **Terminate run**: "Cancel test with test resource 'prod-resource' test ID 'cpu-001' testrun ID 'run-004' display 'Terminated Test' description 'Test causing high CPU usage'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of the test resource associated with the test run. |
| **Test ID** | Required | The ID of the test associated with the test run. |
| **Testrun ID** | Required | The ID of the test run to update. |
| **Display** | Required | A new display name for the test run. |
| **Description** | Required | A new description for the test run. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testrun update](../includes/tools/annotations/azure-load-testing-test-run-update-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Load Testing documentation](/azure/load-testing/)
- [Create and run a load test](/azure/load-testing/quickstart-create-and-run-load-test)
