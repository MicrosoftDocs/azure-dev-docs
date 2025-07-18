---
title: Azure MCP Best Practices
description: This article provides best practices for using the Azure SDK with Azure MCP Server.
ms.topic: conceptual
ms.date: 07/17/2025
---

# Azure MCP Best Practices

This article provides best practices and recommendations for developing secure, production-grade applications using Azure SDK with Azure MCP Server.

## SDK Usage

### Use the latest SDK version

- **Always use the latest version** of the Azure SDK to ensure you have the latest security updates, bug fixes, and performance improvements.
- Check for SDK updates regularly and integrate them into your applications.
- Review release notes to understand what's changed between versions.

### Use singleton clients

- Create a **single client instance** for each Azure service and reuse it throughout your application's lifecycle.
- Clients are thread-safe and designed for reuse.
- Creating a new client for each operation is inefficient and can lead to resource exhaustion and connection issues.

Example:

```csharp
// DO: Create a singleton client
private static readonly BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);

// DON'T: Create a new client for each operation
public async Task UploadBlob(string containerName, string blobName, Stream content)
{
    // This is inefficient
    var client = new BlobServiceClient(connectionString); 
    var containerClient = client.GetBlobContainerClient(containerName);
    // ...
}
```

## Network Resilience

### Implement retry policies

- Use the built-in **retry policies** in the Azure SDK to handle transient failures.
- Configure appropriate retry delays, max retries, and retry modes based on your operation criticality.
- For critical operations, use exponential backoff with jitter to prevent "thundering herd" problems.

Example parameters:

| Parameter | Description | Recommendation |
|-----------|-------------|---------------|
| retry-delay | Initial delay in seconds between retry attempts | 1-2 seconds |
| retry-max-delay | Maximum delay between retries | 30-60 seconds |
| retry-max-retries | Maximum number of retry attempts | 3-5 attempts |
| retry-mode | Retry strategy | exponential |
| retry-network-timeout | Network operation timeout | 30-60 seconds |

### Handle connection issues

- Set appropriate connection timeouts to avoid long-running operations that block resources.
- Implement circuit breakers to prevent cascading failures when a service is unavailable.
- Monitor connection metrics to identify and address issues before they impact users.

## Authentication

### Use secure authentication methods

- Prefer **managed identities** when running in Azure environments.
- Use **Azure AD authentication** rather than access keys or connection strings when possible.
- If using access keys or connection strings, store them securely in Azure Key Vault or another secure secret store.

### Follow the principle of least privilege

- Grant minimal required permissions to your application identities.
- Regularly audit and rotate credentials used by your applications.
- Use role-based access control (RBAC) to manage permissions at a fine-grained level.

## Performance Optimization

### Optimize batch operations

- Use batch operations when working with multiple items to reduce the number of network requests.
- For large datasets, implement pagination to process data in manageable chunks.
- Consider using parallel operations for independent tasks but be mindful of rate limits.

### Minimize resource usage

- Release resources properly by disposing clients when they're no longer needed.
- Use asynchronous APIs to avoid blocking threads and improve scalability.
- Implement proper connection pooling to reuse connections efficiently.

## Monitoring and Diagnostics

### Enable logging and diagnostics

- Configure appropriate logging levels in your application.
- Use Azure Monitor to track performance metrics and detect anomalies.
- Set up alerts for critical errors and performance degradation.

### Track request metrics

- Monitor request latency, success rates, and error rates.
- Implement distributed tracing to track requests across different services.
- Use correlation IDs to link related operations for easier debugging.

## Error Handling

### Implement proper error handling

- Catch and handle service-specific exceptions appropriately.
- Distinguish between transient and non-transient errors to determine retry strategy.
- Provide meaningful error messages to help with troubleshooting.

### Use structured logging

- Log structured data to make it easier to query and analyze logs.
- Include relevant context in log entries, such as operation IDs, tenant IDs, and user information.
- Mask sensitive information before logging.

## Next steps

- [Install Azure MCP Server](../install-mcp-server.md)
- [Azure SDK documentation](https://learn.microsoft.com/en-us/azure/developer/sdk/)
- [Azure architecture best practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/)
