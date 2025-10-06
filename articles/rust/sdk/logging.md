---
title: OpenTelemetry in Azure SDK for Rust crates
description: Learn how to implement OpenTelemetry in Rust applications using Azure crates for comprehensive observability.
ms.date: 10/01/2025
ms.topic: how-to
ms.custom: devx-track-rust
ai-usage: ai-generated
---

# OpenTelemetry in Azure SDK for Rust crates

When you work with Azure SDK for Rust crates, you need visibility into SDK operations to debug issues, monitor performance, and understand how your application interacts with Azure services. This article shows you how to implement effective OpenTelemetry-based logging and telemetry strategies that provide insights into the inner workings of Rust applications on Azure.


## Telemetry for Azure developers

The Azure SDK for Rust crates provide comprehensive observability through OpenTelemetry integration, which we recommend for monitoring and distributed tracing scenarios. Whether you're troubleshooting authentication flows, monitoring API request cycles, or analyzing performance bottlenecks, this guide covers the OpenTelemetry tools and techniques you need to gain visibility into your Azure SDK operations.

Azure SDK for Rust crates use OpenTelemetry as the standard approach to observability, providing:

- **Industry-standard telemetry**: Use OpenTelemetry formats compatible with monitoring platforms
- **Distributed tracing**: Track requests across multiple services and Azure resources  
- **Advanced exporters**: Send data to Azure Monitor, Jaeger, Prometheus, Grafana, and other observability platforms
- **Correlation across services**: Automatically propagate trace context between microservices
- **Production monitoring**: Built for high-scale production environments with sampling and performance optimizations

## How to log with OpenTelemetry

To use OpenTelemetry, you need the `azure_core_opentelemetry` crate. The `azure_core` package alone doesn't include OpenTelemetry support.

1. Log in to Azure CLI:

    ```bash
    az login
    ```

1. Create Azure Monitor resources by using Azure CLI:
    
    ```bash
    # Set variables
    RESOURCE_GROUP="rust-telemetry-rg"
    LOCATION="eastus"
    APP_INSIGHTS_NAME="rust-app-insights"
    LOG_ANALYTICS_WORKSPACE="rust-logs-workspace"
    
    # Create resource group
    az group create --name $RESOURCE_GROUP --location $LOCATION
    
    # Create Log Analytics workspace
    WORKSPACE_ID=$(az monitor log-analytics workspace create \
      --resource-group $RESOURCE_GROUP \
      --workspace-name $LOG_ANALYTICS_WORKSPACE \
      --location $LOCATION \
      --query id -o tsv)
    
    # Create Application Insights instance
    az extension add --name application-insights
    INSTRUMENTATION_KEY=$(az monitor app-insights component create \
      --app $APP_INSIGHTS_NAME \
      --location $LOCATION \
      --resource-group $RESOURCE_GROUP \
      --workspace $WORKSPACE_ID \
      --query instrumentationKey -o tsv)
    
    # Get connection string
    CONNECTION_STRING=$(az monitor app-insights component show \
      --app $APP_INSIGHTS_NAME \
      --resource-group $RESOURCE_GROUP \
      --query connectionString -o tsv)
    
    echo "Application Insights Connection String: $CONNECTION_STRING"
    ```

1. Configure your Rust project. Add the required dependencies to your `Cargo.toml`:
    
    ```toml
    [dependencies]
    azure_core_opentelemetry = "*"
    azure_security_keyvault_secrets = "*"
    azure_identity = "*"
    opentelemetry = "0.31"
    opentelemetry_sdk = "0.31"
    tokio = { version = "1.47.1", features = ["full"] }
    ```

1. Create your main application with OpenTelemetry configuration. See the [azure_core_opentelemetry](https://docs.rs/azure_core_opentelemetry/latest/azure_core_opentelemetry/) documentation for details.

1. Set the required environment variables and run your application:

    ```bash
    # Set Key Vault URL (replace with your actual Key Vault URL)
    export AZURE_KEYVAULT_URL="https://mykeyvault.vault.azure.net/"
    
    # Run the application
    cargo run
    ```

After you configure OpenTelemetry in your application and run it, you can add custom instrumentation and monitor the telemetry data.

## Customize your telemetry

OpenTelemetry provides a flexible framework for customizing telemetry data to suit your application's needs. Use these strategies to enhance your telemetry:

### Instrumenting your application code

Adding custom instrumentation to your application code helps you correlate your business logic with Azure SDK operations. This correlation makes it easier to understand the complete flow of operations.

| Technique | Purpose | Implementation |
|-----------|---------|----------------|
| **Custom spans for Azure operations** | Create a clear hierarchy that shows how application logic relates to Azure operations | Wrap Azure SDK calls by using OpenTelemetry span creation methods |
| **Correlate application logic with SDK calls** | Connect business operations with underlying Azure SDK calls | Use span context to link business operations with triggered Azure service calls |
| **Create diagnostic breadcrumbs** | Capture important context for telemetry across workflows | Add structured fields (user IDs, request IDs, business object identifiers) to spans |

### Performance analysis

OpenTelemetry provides detailed insights into Azure SDK performance patterns. These insights help you identify and resolve performance bottlenecks.

| Analysis Type | What It Reveals | How to Use |
|---------------|-----------------|------------|
| **SDK operation duration** | How long different Azure operations take | Use span timing that OpenTelemetry captures automatically to identify slow operations |
| **Service call bottlenecks** | Where your application spends time waiting for Azure responses | Compare timing across Azure services and operations to find performance issues |
| **Concurrent operation patterns** | Overlap and dependencies between operations | Analyze telemetry data to understand parallelization opportunities when making multiple Azure calls |

### Error diagnosis

OpenTelemetry captures rich error context that goes beyond simple error messages. This context helps you understand not just what failed, but why and under what circumstances.

**Understand SDK error propagation**: Trace how errors bubble up through your application code and the Azure SDK layers. This trace helps you understand the complete error path and identify the root cause.

**Log transient vs. permanent failures**: Distinguish between temporary failures (like network timeouts that might succeed on retry) and permanent failures (like authentication errors that need configuration changes). This distinction helps you build resilient applications.

## Understand logs, metrics, and alerts

Your applications and services generate telemetry data to help you monitor their health, performance, and usage. Azure categorizes this telemetry into logs, metrics, and alerts.

Azure offers four kinds of telemetry:

| Telemetry type  | What it gives you                               | Where to find it for each service                 |
| --------------- | ----------------------------------------------- | ------------------------------------------------- |
| Metrics         | Numeric, time-series data (CPU, memory, etc.)   | **Metrics** in portal or `az monitor metrics` CLI |
| Alerts          | Proactive notifications when thresholds hit     | **Alerts** in portal or `az monitor metrics alert` CLI |
| Logs            | Text-based events and diagnostics (web, app)    | App Service **Logs**, Functions **Monitor**, Container Apps **Diagnostics** |
| Custom logs     | Your own application telemetry via App Insights | Your Application Insights resource's **Logs (Trace)** table |

Pick the right telemetry for your question:

| Scenario                                                                               | Use logs…                                         | Use metrics…                                       | Use alerts…                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| "Did my web app start and respond?"                                                     | App Service web-server logs (Logs)          | N/A                                                | N/A                                                   |
| "Is my function timing out or failing?"                                                | Function invocation logs (Monitor)          | Function execution duration metric                 | Alert on "Function Errors >0"                         |
| "How busy is my service and can it scale?"                                             | N/A                                               | Service throughput/CPU in Metrics             | Autoscale alert on CPU% > 70%                         |
| "What exceptions is my code throwing?"                                                 | Custom Trace logs in Application Insights         | N/A                                                | Alert on "ServerExceptions >0"                        |
| "Have I exceeded my transaction or quota limits?"                                      | N/A                                               | Quota-related metrics (Transactions, Throttling)   | Alert on "ThrottlingCount >0"                         |

## View the telemetry data in Azure Monitor

After setting up OpenTelemetry in your Rust application and running it, you can view the telemetry data in Azure Monitor through Application Insights.

1. **Navigate to Application Insights** in the Azure portal:
   ```bash
   az monitor app-insights component show \
     --app $APP_INSIGHTS_NAME \
     --resource-group $RESOURCE_GROUP \
     --query "{name:name,appId:appId,instrumentationKey:instrumentationKey}"
   ```

1. **View traces and logs**:
   - Go to **Application Insights** > **Transaction search**
   - Look for traces with operation names like `get_keyvault_secrets`
   - Check **Logs** section and run KQL queries:

   ```kusto
   traces
   | where timestamp > ago(1h)
   | where message contains "Azure operations" or message contains "secrets"
   | order by timestamp desc
   ```

1. **View distributed traces**:
   - Go to **Application Map** to see service dependencies
   - Select **Performance** to see operation timing
   - Use **End-to-end transaction details** to see complete request flows

1. **Custom KQL queries for your Rust application**:
   ```kusto
   // View all custom logs from your Rust app
   traces
   | where customDimensions.["service.name"] == "rust-azure-app"
   | order by timestamp desc
   
   // View Azure SDK HTTP operations
   dependencies
   | where type == "HTTP"
   | where target contains "vault.azure.net"
   | order by timestamp desc
   
   // Monitor error rates
   traces
   | where severityLevel >= 3  // Warning and above
   | summarize count() by bin(timestamp, 1m), severityLevel
   | render timechart
   ```

## Monitor in real-time

Set up live monitoring to see data as it arrives:

```bash
# Stream live logs (requires Azure CLI)
az monitor app-insights events show \
  --app $APP_INSIGHTS_NAME \
  --resource-group $RESOURCE_GROUP \
  --event traces \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S)
```

## Cost optimization

You can significantly reduce your [cost for Azure Monitor](/azure/azure-monitor/fundamentals/cost-usage) by understanding [best practices](/azure/azure-monitor/fundamentals/best-practices-cost) for configuration options and opportunities to reduce the amount of data Azure Monitor collects.

Key strategies for Rust applications:

- **Use appropriate log levels**: Configure OpenTelemetry log levels appropriately for production to reduce volume
- **Implement sampling**: Configure OpenTelemetry sampling for high-volume applications
- **Filter sensitive data**: Avoid logging secrets, tokens, or large payloads that increase costs
- **Monitor data ingestion**: Regularly review your Application Insights data usage and costs

## Resources and next steps

- [Azure SDK for Rust guidelines](https://azure.github.io/azure-sdk/rust_introduction.html)
- [OpenTelemetry Rust documentation](https://docs.rs/opentelemetry/)
- [Azure Monitor service](/azure/azure-monitor)
