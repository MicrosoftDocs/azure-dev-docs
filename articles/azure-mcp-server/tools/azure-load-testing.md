---
title: Use Azure MCP with Azure Load Testing
description: This article shows how to use Azure MCP to run load tests on your Azure resources.
ms.topic: how-to
ms.date: 07/17/2025
---

# Use Azure MCP with Azure Load Testing

This article describes how to use Azure MCP with Azure Load Testing to set up and run load tests for your applications.

[Azure Load Testing](/azure/load-testing/overview-what-is-azure-load-testing) is a fully managed load testing service that enables you to generate high-scale load and measure the performance of your applications under stress.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Create and run load tests

The Azure MCP load testing capabilities let you create, configure, and run load tests against your applications.

### Command syntax

```
azmcp-load-testing-create --subscription <subscriptionId> --resource-group <resourceGroupName> --name <testName> --endpoint <endpoint> [--method <httpMethod>] [--headers <headers>] [--body <body>] [--virtual-users <numberOfUsers>] [--duration <testDuration>] [--test-description <testDescription>]
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription | string | Yes | The Azure subscription ID or name |
| resource-group | string | Yes | The name of the resource group containing the Azure Load Testing resource |
| name | string | Yes | The name of the load test to create |
| endpoint | string | Yes | The URL endpoint to test |
| method | string | No | The HTTP method to use (GET, POST, PUT, DELETE, etc.). Default is GET |
| headers | string | No | HTTP headers in JSON format |
| body | string | No | HTTP request body for POST/PUT requests |
| virtual-users | integer | No | The number of virtual users to simulate. Default is 50 |
| duration | integer | No | The duration of the test in seconds. Default is 60 |
| test-description | string | No | A description of the test |

### Response

The command returns the details of the created load test including:

- Test ID
- Test status
- Test configuration details
- Virtual user count
- Duration
- Target endpoint

## View test results

Use the `azmcp-load-testing-results` command to retrieve and analyze test results.

### Command syntax

```
azmcp-load-testing-results --subscription <subscriptionId> --resource-group <resourceGroupName> --test-id <testId>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| subscription | string | Yes | The Azure subscription ID or name |
| resource-group | string | Yes | The name of the resource group containing the Azure Load Testing resource |
| test-id | string | Yes | The ID of the load test run |

### Response

The command returns detailed test results including:

- Performance metrics (response time, throughput, error rate)
- Resource utilization data
- Error information
- Test duration statistics

## Example prompts

Here are some example natural language prompts you can use with Azure MCP to work with Azure Load Testing:

- "Create a load test for my web API at https://api.example.com/products"
- "Run a load test with 1000 virtual users against my application"
- "Show me the results of my latest load test"
- "Run a 5-minute load test against my website with a step load pattern"
- "Create a load test that simulates a spike of 2000 users for my Azure Function"
- "What was the average response time in my last load test?"
- "Show me any errors from my recent load test against the payment API"
- "Compare performance metrics between my two latest load tests"

## Best practices

When using Azure Load Testing with Azure MCP:

1. Start with a small number of virtual users and gradually increase to understand your application's scaling behavior
2. Include realistic test scenarios that match expected user behavior
3. Run tests during off-peak hours for production systems
4. Set appropriate test criteria to automatically identify performance issues
5. Monitor server-side metrics during test execution to identify bottlenecks
6. Use environment variables and secrets for sensitive test parameters
7. Integrate load testing into your CI/CD pipelines for continuous performance testing

## Next steps

- [Learn more about Azure Load Testing](https://learn.microsoft.com/en-us/azure/load-testing/overview-what-is-azure-load-testing)
- [Create advanced load tests with JMeter](https://learn.microsoft.com/en-us/azure/load-testing/how-to-create-and-run-load-test-with-jmeter-script)
- [Define test failure criteria](https://learn.microsoft.com/en-us/azure/load-testing/how-to-define-test-criteria)
- [Configure high-scale load tests](https://learn.microsoft.com/en-us/azure/load-testing/how-to-high-scale-load)
