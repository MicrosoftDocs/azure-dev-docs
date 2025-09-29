---
title: Logging and telemetry in Azure SDK for Rust crates
description: Learn how to implement logging and telemetry in Rust applications using Azure crates for visibility into SDK inner workings.
ms.date: 09/29/2025
ms.topic: how-to
ms.custom: devx-track-rust
ai-usage: ai-generated
---

# Logging and telemetry in Azure SDK for Rust crates

When working with Azure SDK for Rust crates, having visibility into SDK operations is essential for debugging issues, monitoring performance, and understanding how your application interacts with Azure services. This article shows you how to implement effective logging and telemetry strategies that provide insights into the inner workings of Azure SDK operations.


## Built-in tracing vs. OpenTelemetry

The Azure SDK for Rust crates provide comprehensive observability through two main approaches: built-in tracing with the `tracing` crate for immediate debugging needs, and OpenTelemetry integration for production monitoring and distributed tracing scenarios. Whether you're troubleshooting authentication flows, monitoring API request cycles, or analyzing performance bottlenecks, this guide covers the tools and techniques you need to gain visibility into your Azure SDK operations.

Azure SDK for Rust crates provide two complementary approaches to observability:

| Approach | When to use | Benefits | Limitations |
|----------|-------------|----------|-------------|
| **Built-in tracing** (`tracing` crate) | - Local development and debugging<br>- Simple logging to console or files<br>- Quick troubleshooting of SDK issues<br>- Applications with basic observability needs | - Zero additional dependencies<br>- Automatic SDK instrumentation<br>- Simple setup<br>- Structured logging support | - Limited export options<br>- No distributed tracing across services<br>- Fewer integration options |
| **OpenTelemetry integration** | - Production environments<br>- Microservices architectures<br>- Need for distributed tracing<br>- Integration with observability platforms<br>- Compliance with OpenTelemetry standards | - Industry-standard telemetry<br>- Distributed tracing support<br>- Wide range of exporters<br>- Integration with monitoring platforms<br>- Correlation across services | - Additional dependencies required<br>- More complex setup<br>- Potential performance overhead |


**Use both together**: Most production applications benefit from using the `tracing` crate for local development and debugging, while adding OpenTelemetry for production observability and monitoring.


## How to log with built-in tracing

Set up logging with Azure SDK for Rust crates using the built-in `tracing` crate:

1. Add these dependencies to your `Cargo.toml`:

    ```toml
    [dependencies]
    azure_security_keyvault_secrets = "0.20"
    azure_identity = "0.20"
    tracing = "0.1"
    tracing-subscriber = "0.3"
    tokio = { version = "1.0", features = ["full"] }
    ```

2. Initialize logging in your `main` function:

    ```rust
    use tracing::{info, debug, error, Level};
    use tracing_subscriber::{fmt, EnvFilter};
    use azure_security_keyvault_secrets::prelude::*;
    use azure_identity::DefaultAzureCredential;
    
    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        // Initialize tracing subscriber with environment filter
        tracing_subscriber::fmt()
            .with_env_filter(
                EnvFilter::try_from_default_env()
                    .unwrap_or_else(|_| EnvFilter::new("info,azure_security_keyvault_secrets=debug"))
            )
            .init();
    
        run_keyvault_example().await
    }
    ```

3. Use Azure SDK with automatic logging

    ```rust
    async fn run_keyvault_example() -> Result<(), Box<dyn std::error::Error>> {
        info!("Starting Azure Key Vault example");
    
        let credential = DefaultAzureCredential::default();
        let keyvault_url = "https://mykeyvault.vault.azure.net/";
        
        // Create secrets client - this will automatically log SDK operations
        let secrets_client = SecretClient::new(keyvault_url, credential)?;
        
        info!("Connecting to Key Vault: {}", keyvault_url);
        
        // Get a secret - SDK will automatically log the HTTP requests
        match secrets_client.get_secret("my-secret").await {
            Ok(secret) => {
                info!("Successfully retrieved secret");
                debug!("Secret name: {}", secret.name());
                debug!("Secret version: {}", secret.properties().version().unwrap_or("latest"));
            }
            Err(e) => {
                error!("Failed to get secret: {}", e);
                return Err(e.into());
            }
        }
    
        Ok(())
    }
    ```

4. Run with different log levels

    ```bash
    # See only basic application logs
    RUST_LOG=info cargo run
    
    # See detailed Azure SDK operations
    RUST_LOG=debug cargo run
    
    # See all HTTP request/response details
    RUST_LOG=trace cargo run
    
    # Filter to specific Azure services
    RUST_LOG=info,azure_security_keyvault_secrets=debug cargo run
    ```

    Azure SDK for Rust crates use consistent target names that you can filter on:
    
    | Filter pattern | What it captures |
    |----------------|------------------|
    | `azure_core=debug` | All HTTP requests and authentication across all Azure services |
    | `azure_security_keyvault=debug` | All Azure Key Vault operations (secrets, keys, certificates) |
    | `azure_security_keyvault_secrets=debug` | Only Azure Key Vault secret operations |
    | `azure_storage=debug` | All Azure Storage operations (blobs, queues, tables) |
    | `azure_identity=debug` | Authentication and credential acquisition |
    

5. Review the console output to see structured logs from both your application and the Azure SDK operations.


    ```console
    INFO  keyvault_example: Starting Azure Key Vault example
    INFO  keyvault_example: Connecting to Key Vault: https://mykeyvault.vault.azure.net/
    DEBUG azure_security_keyvault_secrets: Making request to get secret
    DEBUG azure_core: HTTP GET https://mykeyvault.vault.azure.net/secrets/my-secret?api-version=7.4
    DEBUG azure_core: Response: 200 OK
    INFO  keyvault_example: Successfully retrieved secret
    DEBUG keyvault_example: Secret name: my-secret
    DEBUG keyvault_example: Secret version: abc123def456
    ```

## Logging levels with the `tracing` crate

The Azure SDK for Rust crates provide structured logging that includes:

- **Target-based filtering**: Filter logs using crate names like `azure_security_keyvault_secrets`, `azure_storage_blobs`, or service families like `azure_security_keyvault` for all Key Vault operations
- **Consistent log levels**: SDK operations use levels include:
    
| Logging level | Typical use |
| --- | --- |
| ERROR | Failures where the application is unlikely to recover (such as network timeouts, authentication failures). Azure SDK errors include structured information about the failure, including HTTP status codes, error codes, and retry attempts. Logging this context helps you understand whether errors are configuration issues, service problems, or transient failures. |
| WARN | A function fails to perform its intended task (but not when the function can recover, such as retrying a REST API call). |
| INFO | Function operates normally or a service call is completed. Info events typically include requests, responses, and headers. |
| DEBUG | Detailed information commonly used for troubleshooting, including HTTP request/response details. |
| TRACE | Most verbose level, includes internal SDK state and detailed execution flow. |

## Enabling HTTP logging

Azure SDK for Rust crates don't log HTTP request/response details by default to avoid performance overhead and potential security issues. However, when troubleshooting connectivity issues or analyzing API behavior, you can enable detailed HTTP logging.

To enable HTTP logging for better visibility into SDK network operations:

- **Configure appropriate log levels**: Set DEBUG or TRACE level for the specific Azure crates you want to monitor
- **Use environment variables**: Set `RUST_LOG=azure_core=debug` to enable HTTP logging for all Azure SDK operations
- **Enable request/response body logging**: Set `RUST_LOG=azure_core=trace` to see complete request and response bodies. Be aware this can expose sensitive data like authentication tokens and personal information in the logs

## How to log with OpenTelemetry

While Azure SDK for Rust crates include excellent built-in tracing support, OpenTelemetry provides additional capabilities for production environments:

- **Distributed tracing**: Track requests across multiple services and Azure resources
- **Standardized telemetry**: Use industry-standard formats compatible with monitoring platforms
- **Advanced exporters**: Send data to Azure Monitor, Jaeger, Prometheus, Grafana, and other observability platforms
- **Correlation across services**: Automatically propagate trace context between microservices
- **Production monitoring**: Built for high-scale production environments with sampling and performance optimizations

To use OpenTelemetry, you need the `azure_core_opentelemetry` crate. The `azure_core` package alone does not include OpenTelemetry support.

1. Create Azure Monitor resources using Azure CLI:
    
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

2. Configure your Rust project. Add the required dependencies to your `Cargo.toml`:
    
    ```toml
    [dependencies]
    azure_core = "0.20"
    azure_core_opentelemetry = "0.1"
    azure_security_keyvault_secrets = "0.20"
    azure_identity = "0.20"
    opentelemetry = "0.23"
    opentelemetry-appinsights = "0.31"
    opentelemetry_sdk = "0.23"
    tracing = "0.1"
    tracing-opentelemetry = "0.24"
    tracing-subscriber = "0.3"
    tokio = { version = "1.0", features = ["full"] }
    anyhow = "1.0"
    ```

3. Create your main application with OpenTelemetry configuration:
    
    ```rust
    use azure_core_opentelemetry::OpenTelemetryTracingPolicy;
    use azure_identity::DefaultAzureCredential;
    use azure_security_keyvault_secrets::prelude::*;
    use opentelemetry::{global, KeyValue};
    use opentelemetry_appinsights::Exporter;
    use opentelemetry_sdk::{
        trace::{self, Tracer},
        Resource,
    };
    use tracing::{info, warn, error, instrument};
    use tracing_opentelemetry::OpenTelemetryLayer;
    use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
    use std::env;
    
    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        // Get connection string from environment variable
        let connection_string = env::var("APPLICATIONINSIGHTS_CONNECTION_STRING")
            .expect("APPLICATIONINSIGHTS_CONNECTION_STRING environment variable must be set");
    
        // Initialize OpenTelemetry tracer
        let tracer = init_telemetry(&connection_string)?;
    
        // Initialize tracing subscriber with OpenTelemetry layer
        tracing_subscriber::registry()
            .with(
                tracing_subscriber::fmt::layer()
                    .with_target(false)
            )
            .with(OpenTelemetryLayer::new(tracer))
            .init();
    
        // Run your application
        run_azure_operations().await?;
    
        // Shutdown telemetry to ensure all data is sent
        global::shutdown_tracer_provider();
        
        Ok(())
    }
    
    fn init_telemetry(connection_string: &str) -> Result<Tracer, Box<dyn std::error::Error>> {
        let exporter = Exporter::new_from_connection_string(connection_string)?;
        
        let tracer = opentelemetry_sdk::trace::TracerProvider::builder()
            .with_batch_exporter(exporter, opentelemetry_sdk::runtime::Tokio)
            .with_resource(Resource::new(vec![
                KeyValue::new("service.name", "rust-azure-app"),
                KeyValue::new("service.version", "1.0.0"),
            ]))
            .build()
            .tracer("azure-rust-sdk");
    
        global::set_tracer_provider(tracer.provider().unwrap().clone());
        
        Ok(tracer)
    }
    
    #[instrument]
    async fn run_azure_operations() -> Result<(), Box<dyn std::error::Error>> {
        info!("Starting Azure operations");
    
        // Configure Azure SDK client with OpenTelemetry policy
        let credential = DefaultAzureCredential::default();
        let keyvault_url = env::var("AZURE_KEYVAULT_URL")
            .unwrap_or_else(|_| "https://mykeyvault.vault.azure.net/".to_string());
    
        let secrets_client = SecretClient::builder(keyvault_url, credential)
            .with_policy(OpenTelemetryTracingPolicy::new())
            .build()?;
    
        // Perform operations that will generate telemetry
        match get_keyvault_secrets(&secrets_client).await {
            Ok(_) => info!("Key Vault operations completed successfully"),
            Err(e) => error!("Key Vault operations failed: {}", e),
        }
    
        // Custom telemetry data
        warn!("This is a custom warning message");
        info!("Application completed processing");
    
        Ok(())
    }
    
    #[instrument]
    async fn get_keyvault_secrets(
        secrets_client: &SecretClient,
    ) -> Result<(), Box<dyn std::error::Error>> {
        info!("Retrieving secrets from Key Vault");
        
        let secret_names = vec!["database-password", "api-key", "connection-string"];
        let mut retrieved_count = 0;
        
        // This will generate spans for the Azure SDK operations
        for secret_name in secret_names {
            match secrets_client.get_secret(&secret_name).await {
                Ok(secret) => {
                    retrieved_count += 1;
                    info!("Retrieved secret: {}", secret.name());
                    debug!("Secret version: {}", secret.properties().version().unwrap_or("latest"));
                }
                Err(e) => {
                    warn!("Failed to retrieve secret {}: {}", secret_name, e);
                    // Continue with other secrets instead of failing completely
                }
            }
        }
        
        info!("Total secrets retrieved: {}", retrieved_count);
        Ok(())
    }
    ```

4. Set the required environment variables and run your application:

    ```bash
    # Set the connection string (replace with your actual connection string)
    export APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=your-key;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/"
    
    # Set Key Vault URL (replace with your actual Key Vault URL)
    export AZURE_KEYVAULT_URL="https://mykeyvault.vault.azure.net/"
    
    # Run the application
    cargo run
    ```


## How to combine built-in tracing with OpenTelemetry

Most production applications benefit from using both approaches:

- **Development**: Use `tracing` crate for console output and local debugging
- **Production**: Add OpenTelemetry for distributed tracing and monitoring platforms
- **Hybrid setup**: Configure both simultaneously - `tracing` for immediate feedback and OpenTelemetry for long-term observability

```rust
// Example: Setting up both tracing and OpenTelemetry
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

// Console logging for development
let console_layer = tracing_subscriber::fmt::layer()
    .with_target(false);

// OpenTelemetry for production monitoring
let otel_tracer = init_opentelemetry_tracer()?;
let otel_layer = tracing_opentelemetry::layer().with_tracer(otel_tracer);

// Combine both layers
tracing_subscriber::registry()
    .with(console_layer)
    .with(otel_layer)
    .init();
```

## Advanced diagnostics with tracing

Beyond basic logging, the `tracing` crate provides powerful diagnostic capabilities that help you understand complex Azure SDK behavior and troubleshoot sophisticated issues.

### Instrumenting your application code

Adding custom instrumentation to your application code helps correlate your business logic with Azure SDK operations, making it easier to understand the complete flow of operations.

| Technique | Purpose | Implementation |
|-----------|---------|----------------|
| **Custom spans for Azure operations** | Create clear hierarchy showing how application logic relates to Azure operations | Wrap Azure SDK calls using `#[instrument]` attribute or `tracing::span!` macro |
| **Correlate application logic with SDK calls** | Connect business operations with underlying Azure SDK calls | Use span context to link business operations with triggered Azure service calls |
| **Create diagnostic breadcrumbs** | Capture important context for tracing across workflows | Add structured fields (user IDs, request IDs, business object identifiers) to spans |

### Performance analysis

Structured logging and tracing provide detailed insights into Azure SDK performance patterns, helping you identify and resolve performance bottlenecks.

| Analysis Type | What It Reveals | How to Use |
|---------------|-----------------|------------|
| **SDK operation duration** | How long different Azure operations take | Use span timing captured automatically by `tracing` crate to identify slow operations |
| **Service call bottlenecks** | Where your application spends time waiting for Azure responses | Compare timing across Azure services and operations to find performance issues |
| **Concurrent operation patterns** | Overlap and dependencies between operations | Analyze tracing data to understand parallelization opportunities when making multiple Azure calls |

### Error diagnosis

The `tracing` crate captures rich error context that goes beyond simple error messages, helping you understand not just what failed, but why and under what circumstances.

**Understand SDK error propagation**: Trace how errors bubble up through your application code and the Azure SDK layers. This helps you understand the complete error path and identify the root cause.

**Log transient vs. permanent failures**: Distinguish between temporary failures (like network timeouts that might succeed on retry) and permanent failures (like authentication errors that require configuration changes). This distinction is crucial for building resilient applications.

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

## Monitor telemetry data in Azure Monitor

### View the telemetry data in Azure Monitor:

1. **Navigate to Application Insights** in the Azure portal:
   ```bash
   az monitor app-insights component show \
     --app $APP_INSIGHTS_NAME \
     --resource-group $RESOURCE_GROUP \
     --query "{name:name,appId:appId,instrumentationKey:instrumentationKey}"
   ```

2. **View traces and logs**:
   - Go to **Application Insights** > **Transaction search**
   - Look for traces with operation names like `get_keyvault_secrets`
   - Check **Logs** section and run KQL queries:

   ```kusto
   traces
   | where timestamp > ago(1h)
   | where message contains "Azure operations" or message contains "secrets"
   | order by timestamp desc
   ```

3. **View distributed traces**:
   - Go to **Application Map** to see service dependencies
   - Click on **Performance** to see operation timing
   - Use **End-to-end transaction details** to see complete request flows

4. **Custom KQL queries for your Rust application**:
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

- **Use appropriate log levels**: Set production log levels to INFO or WARN to reduce volume
- **Implement sampling**: Configure OpenTelemetry sampling for high-volume applications
- **Filter sensitive data**: Avoid logging secrets, tokens, or large payloads that increase costs
- **Monitor data ingestion**: Regularly review your Application Insights data usage and costs

## Resources and next steps

- [Azure SDK for Rust guidelines](https://azure.github.io/azure-sdk/rust_introduction.html)
- [Tracing crate documentation](https://docs.rs/tracing/)
- [OpenTelemetry Rust documentation](https://docs.rs/opentelemetry/)
