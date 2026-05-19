---
title: Use the Azure SDK for Go for data plane operations
description: Learn how to work with application data in Azure services by using the Azure SDK for Go client libraries. This article covers runtime operations such as reading, writing, querying, and streaming data—performed against existing Azure resources after they've been provisioned.
ms.date: 03/13/2026
ms.topic: overview
ms.custom: devx-track-go
ms.devlang: golang
ai-usage: ai-assisted
---

# Use the Azure SDK for Go for data plane operations

Learn how to interact with data stored in Azure services programmatically by using the Azure SDK for Go client libraries. For a higher-level introduction to how management libraries and client libraries fit together, see [Overview of the Azure SDK for Go management libraries](management-libraries.md). This article focuses on the Go data-plane patterns you use after a resource already exists, and points back to [control plane operations](control-plane.md) for provisioning and configuration work.

## What is the Azure data plane?

The Azure data plane is the set of APIs that you use to interact with data inside Azure services, including uploading blobs, sending messages, querying databases, and retrieving secrets. While the control plane provisions and configures resources, the data plane is what your application code calls at runtime. A common Go workflow is to use control plane code once in setup or automation, and then keep data plane clients in the application path that runs every day.

The Azure SDK for Go exposes the data plane through service-specific packages such as **azblob**, **azservicebus**, **azeventhubs**, **azsecrets**, and **azcosmos**. Each package connects to an already-provisioned resource and follows a consistent pattern:

1. Authenticate by using the `azidentity` package.
1. Create a typed client by using a service endpoint or connection string.
1. Call methods on the client to read, write, or process data.
1. Handle paginated results and errors.

Common scenarios for Go data plane operations include:

- Uploading and downloading files from Blob Storage
- Sending and receiving messages with Service Bus or Event Hubs
- Storing and querying documents in Cosmos DB
- Retrieving secrets, keys, and certificates from Key Vault
- Monitoring application performance with Application Insights

## Authentication

Data plane operations support the same credential types from the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package used for control plane operations. All credential types implement the `azcore.TokenCredential` interface, so you can swap them without changing client code.

Data plane clients take a service endpoint (URL or namespace) and a credential, rather than a subscription ID:

```go
// Create credential that auto-discovers authentication
cred, err := azidentity.NewDefaultAzureCredential(nil)

// Blob Storage - pass the storage account URL
blobClient, err := azblob.NewClient("https://mystorageaccount.blob.core.windows.net/", cred, nil)

// Key Vault secrets - pass the vault URL
secretClient, err := azsecrets.NewClient("https://mykeyvault.vault.azure.net/", cred, nil)

// Service Bus - pass the fully qualified namespace
sbClient, err := azservicebus.NewClient("mynamespace.servicebus.windows.net", cred, nil)
```

Some services also support connection strings for environments where token-based authentication isn't available:

```go
// Connection string authentication (when token auth is not available)
client, err := azservicebus.NewClientFromConnectionString(connectionString, nil)
```

For production workloads running in Azure, use managed identity. For local development, `DefaultAzureCredential` automatically discovers credentials from `az login`, environment variables, or other sources.

For a full guide on credential types and best practices, see [Authentication with the Azure SDK for Go](./sdk/authentication/authentication-overview.md) and the [azidentity package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity).

## Pagination

Many data plane operations return collections that can be large. The SDK uses a pager pattern for these operations:

```go
// Create a pager for listing large result sets
pager := client.NewListSecretPropertiesPager(nil)

// Iterate through pages until no more results
for pager.More() {
	page, err := pager.NextPage(ctx)
	if err != nil {
		return err
	}

	for _, item := range page.Value {
		fmt.Println(*item.ID)
	}
}
```

Methods that return `*Pager` types follow this same iteration pattern across all data plane packages.

For more details on pagination and other common patterns, see the [Common usage patterns in Azure SDK for Go](azure-sdk-core-concepts.md).

## Error handling

Data plane operations return structured errors you can inspect for specific error codes:

```go
import "github.com/Azure/azure-sdk-for-go/sdk/azcore"

// Check if the error is an Azure service error with structured details
var respErr *azcore.ResponseError
if errors.As(err, &respErr) {
	fmt.Printf("Error code: %s\n", respErr.ErrorCode)
	fmt.Printf("Status code: %d\n", respErr.StatusCode)
}
```

Common data plane error codes include `BlobNotFound`, `MessageLockLost`, `SecretNotFound`, and `RequestEntityTooLarge`. Check the documentation for each service for the full list of error codes.

## Upload a blob example

This example shows a production-ready pattern: authenticate by using `DefaultAzureCredential`, create a blob client, upload data with a timeout, and verify. This pattern applies to all data plane clients. Swap the service endpoint and client type to adapt it for Service Bus, Event Hubs, Cosmos DB, or Key Vault.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
)

func main() {
	accountURL := "https://<storage-account-name>.blob.core.windows.net/"
	containerName := "demo"
	blobName := "hello.txt"
	data := []byte("hello from Go")

	// Create credential that auto-discovers authentication
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to create credential: %v", err)
	}

	// Set a timeout to prevent hanging on network issues
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	// Create a client for the storage account
	client, err := azblob.NewClient(accountURL, cred, nil)
	if err != nil {
		log.Fatalf("failed to create blob client: %v", err)
	}

	// Upload data directly from a byte slice
	_, err = client.UploadBuffer(ctx, containerName, blobName, data, nil)
	if err != nil {
		log.Fatalf("failed to upload blob: %v", err)
	}

	fmt.Printf("uploaded %s to container %s\n", blobName, containerName)
}
```

## Blob Storage

The [azblob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob) package provides data plane access to Azure Blob Storage, a massively scalable object storage service. This package is what your application uses at runtime to read and write data. Use the separate `armstorage` control plane package to provision storage accounts and containers.

Use it to upload and download files and documents, list and manage blobs and containers, set metadata and content properties, implement parallel uploads for large files, and build data processing pipelines.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/storage/azblob
```

To get started, see [Quickstart: Azure Blob Storage client module for Go](/azure/storage/blobs/storage-quickstart-blobs-go).

For the package documentation, see the [azblob package reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

## Cosmos DB

The [azcosmos](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos) package provides data plane access to Azure Cosmos DB, a globally distributed, multi-model database. Use it to build applications that need low-latency reads and writes at any scale.

Use it to perform CRUD operations on documents, run SQL queries against containers, manage partitioning strategies for efficient data access, handle pagination over large result sets, and execute multi-item batch operations.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos
```

To get started, see [Quickstart: Use Azure Cosmos DB for NoSQL with Azure SDK for Go](/azure/cosmos-db/quickstart-go).

For the package documentation, see the [azcosmos package reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos#section-readme).

## Event Hubs

The [azeventhubs](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs) package provides data plane access to Azure Event Hubs - a real-time data ingestion service for high-throughput event streaming.

Use it to send events with batching for efficient throughput, receive and process events by using consumer groups, manage partition assignment and checkpointing, route events by using partition keys for ordering guarantees, and build log ingestion and telemetry pipelines.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs
```

To get started, see [Quickstart: Send events to or receive events from Event Hubs using Go](/azure/event-hubs/event-hubs-go-get-started-send).

For the package documentation, see the [azeventhubs package reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs#section-readme).

## Key Vault

The [azsecrets](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets), [azkeys](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azkeys), and [azcertificates](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azcertificates) packages provide data plane access to Azure Key Vault. These packages your application uses at runtime to retrieve secrets and perform cryptographic operations. Use the separate `armkeyvault` control plane package to provision and configure vault instances.

Use them to retrieve and set secrets (database passwords, API keys), create and manage cryptographic keys for signing and encryption, manage TLS/SSL certificates with automatic renewal, track secret versions and implement rotation strategies, and cache secrets to reduce latency and API calls.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets
go get github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azkeys
go get github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azcertificates
```

To get started with Key Vault, see [Quickstart: Azure Key Vault certificate client library for Go](/azure/key-vault/certificates/quick-create-go).

For the package documentation, see the [azsecrets](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets#section-readme), [azkeys](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azkeys#section-readme), and [azcertificates](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azcertificates#section-readme) package references.

## Service Bus

The [azservicebus](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus) package provides data plane access to Azure Service Bus - a fully managed message broker for reliable asynchronous communication.

Use it to send and receive messages on queues for point-to-point communication, publish and subscribe to topics for fan-out patterns, send batches of messages for efficient throughput, schedule messages for future delivery, and implement long-polling consumers with message completion and abandonment.

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus
```

To get started with Azure Service Bus, see [Quickstart: Send messages to and receive messages from Azure Service Bus queues (Go)](/azure/service-bus-messaging/service-bus-go-how-to-use-queues).

For the package documentation, see the [azservicebus package reference](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus#section-readme).

## Application Insights

The [ApplicationInsights-Go](https://github.com/microsoft/ApplicationInsights-Go) module provides telemetry integration with Azure Application Insights - Azure's application performance monitoring (APM) service.

Use it to track custom events and metrics, monitor API response times and failures, implement distributed tracing across services, log exceptions with contextual properties, and control telemetry volume with sampling.

```bash
go get github.com/microsoft/ApplicationInsights-Go
```

For the service documentation, see the [Application Insights overview](/azure/azure-monitor/app/app-insights-overview).

## Next steps

- [Overview of the Azure SDK for Go management libraries](management-libraries.md)
- [Use the Azure SDK for Go for control plane operations](control-plane.md)
- [Azure SDK for Go authentication](./sdk/authentication/authentication-overview.md)
- [Azure SDK for Go samples on GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples)