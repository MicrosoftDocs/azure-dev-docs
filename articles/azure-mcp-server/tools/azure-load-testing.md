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
ms.topic: concept-article
ms.date: 11/17/2025
---

# Azure Load Testing tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure resources, including Azure Load Testing services, using natural language prompts. This feature helps you quickly create and manage load tests without needing to remember complex syntax.

[Azure Load Testing](/azure/load-testing/overview-what-is-azure-load-testing) is a fully managed load testing service that helps you generate high-scale load to identify application performance bottlenecks. With Azure Load Testing, you can stress test your applications and validate performance, scalability, and capacity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Test: Create test

<!-- loadtesting test create -->

Creates a new load test in Azure Load Testing. Use this command to define and configure a load test for your application.

Example prompts include:

- **Create load test**: "Create a new load test named 'api-stress-test' in resource group 'performance-rg'"
- **Set up test**: "Configure a new load test using my JMeter file for the shopping cart API"
- **New performance test**: "Create a load test called 'peak-traffic-simulation' in my test subscription"
- **Initialize test**: "Set up a new Azure Load Testing test for my e-commerce site"
- **Test definition**: "Create a test that simulates 1000 concurrent users for my web app"

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

- **View test details**: "Show me the configuration of the 'api-stress-test' load test"
- **Check test setup**: "Get the details of my 'peak-load' test in resource group 'perf-testing'"
- **Test configuration**: "What are the settings for my load test named 'prod-readiness'?"
- **Examine test**: "Let me see the configuration of the load test I created yesterday"
- **Test parameters**: "Show the parameters for my 'database-benchmark' load test"


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

- **List test resources**: "Show me all the load testing resources in my subscription"
- **View available resources**: "What Azure Load Testing resources do I have in my dev subscription?"
- **Resource inventory**: "List all test resources in resource group 'performance-testing'"
- **Check environment**: "Show me the testing resources we provisioned in our subscription"
- **Find resources**: "Where are all my load testing resources deployed?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | The name of a specific test resource to filter by. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testresource list](../includes/tools/annotations/azure-load-testing-test-resource-list-annotations.md)]

## Test resources: Create test resource

<!-- loadtesting testresource create -->

Creates a test resource in Azure Load Testing. Use this command to set up resources needed for running load tests.

Example prompts include:

- **Create test resource**: "Create a new test resource for my load testing in resource group 'load-test-rg'"
- **Provision resources**: "Set up a test resource for my performance testing in subscription 'test-sub'"
- **Initialize resource**: "Create a test resource for my 'api-load-test' in resource group 'perf-resources'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Test resource** | Required | A name for the new test resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [loadtesting testresource create](../includes/tools/annotations/azure-load-testing-test-resource-create-annotations.md)]

## Test runs: Create a test run

<!--  loadtesting testrun create -->

Creates a new test run for an existing load test in Azure Load Testing. Use this command to run the defined load test and generate performance metrics.

Example prompts include:

- **Run load test**: "Start a new test run for my 'api-stress-test' in resource group 'performance-rg'"
- **Execute test**: "Run the load test named 'peak-traffic-simulation'"
- **Initiate test run**: "Create a test run for my 'web-app-load-test' in subscription 'prod-sub'"

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

- **View test run details**: "Show me the results of the last test run for 'api-performance' load test"
- **Check test run status**: "Get the status of the most recent test run for my 'web-app-load-test'"
- **Test run metrics**: "What were the results of the last load test run for 'checkout-service'?"

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

- **View test history**: "Show me all test runs for my 'api-performance' load test"
- **Check recent tests**: "List the last 10 test runs for my load test in resource group 'perf-testing'"
- **View test results**: "What load tests have been run on my 'web-app-load-test'?"
- **Test execution history**: "Show me all load test executions from this month"
- **Monitor test runs**: "List all load test runs for my subscription"

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

- **Stop a test run**: "Stop the current load test run for my 'production-api-test'"
- **Cancel testing**: "Cancel the load test execution with ID 'run-123456'"
- **Abort test**: "Stop the running performance test in my 'test-environment' resource group"
- **Update test parameters**: "Modify the current test run to reduce virtual user count to 100"
- **Terminate run**: "Cancel the load test that's causing high CPU in production"

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
