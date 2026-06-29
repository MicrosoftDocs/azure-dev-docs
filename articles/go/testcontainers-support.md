---
title: Testcontainers for Go support for Azure services
description: How to use Testcontainers for Go to write integration tests against real Azure service emulators without a cloud subscription.
ms.date: 06/29/2026
ms.topic: how-to
ms.custom: devx-track-go
---

# Testcontainers for Go support for Azure services

This article shows how to use [Testcontainers for Go](https://golang.testcontainers.org/) to write integration tests for applications that use Azure services. Testcontainers for Go provides lightweight, throwaway Docker containers that run real Azure service emulators — the same emulators available in the Azure portal — so your tests talk to a real protocol stack rather than a mock or stub.

Because the Go SDK client libraries work identically against the emulators, you can run the full integration test suite locally and in CI without a live Azure subscription or any cloud credentials.

## Prerequisites

- [Go](https://go.dev/dl/) 1.21 or later
- [Docker Engine](https://docs.docker.com/engine/install/) running locally (or a remote Docker host)
- Testcontainers for Go v0.36.0 or later

## Install the Azure module

All Azure sub-packages ship under a single Go module. Add it to your project with:

```bash
go get github.com/testcontainers/testcontainers-go/modules/azure@v0.43.0
```

The testcontainers-go Azure module is tested against specific versions of the Azure SDK for Go. Pin these versions in your `go.mod` to ensure compatibility with the emulator images shown in this article:

```
require (
    github.com/testcontainers/testcontainers-go/modules/azure v0.43.0
    github.com/Azure/azure-sdk-for-go/sdk/azcore             v1.21.0
    github.com/Azure/azure-sdk-for-go/sdk/azidentity         v1.13.1
    github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos     v1.4.1
    github.com/Azure/azure-sdk-for-go/sdk/data/aztables      v1.3.0
    github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs  v1.3.0
    github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus v1.8.0
    github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets v1.4.0
    github.com/Azure/azure-sdk-for-go/sdk/storage/azblob     v1.6.0
    github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue    v1.0.0
)
```

This gives you access to the following import paths, each covering a different Azure service:

| Import path | Emulated service |
|---|---|
| `github.com/testcontainers/testcontainers-go/modules/azure/azurite` | Azure Blob, Queue, and Table Storage |
| `github.com/testcontainers/testcontainers-go/modules/azure/cosmosdb` | Azure Cosmos DB |
| `github.com/testcontainers/testcontainers-go/modules/azure/eventhubs` | Azure Event Hubs |
| `github.com/testcontainers/testcontainers-go/modules/azure/servicebus` | Azure Service Bus |
| `github.com/testcontainers/testcontainers-go/modules/azure/lowkeyvault` | Azure Key Vault (via Lowkey Vault) |

Each package follows the same pattern:

```go
container, err := someservice.Run(ctx, "image:tag", opts...)
testcontainers.CleanupContainer(t, container)
require.NoError(t, err)
```

`CleanupContainer` is registered with `t.Cleanup` immediately after `Run` — **before** the error check — so the container is always terminated even when `Run` returns a partial error. The container exposes a `ConnectionString(ctx)` or service-specific URL method that you pass directly to the regular Azure SDK for Go client constructor.

## Azure Storage (Azurite)

[Azurite](https://github.com/Azure/Azurite) is the official Microsoft emulator for Azure Blob, Queue, and Table Storage. The `azurite` package starts an Azurite container and exposes per-service URLs you can pass directly to the Azure SDK for Go client libraries.

### Default credentials

Azurite ships with well-known testing credentials that the module exposes as constants:

```go
azurite.AccountName // "devstoreaccount1"
azurite.AccountKey  // the well-known base64-encoded test key
```

These values are identical to the [official Azurite documentation](https://github.com/Azure/Azurite#default-storage-account).

### Blob Storage

```go
import (
    "context"
    "strings"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/azurite"
)

func TestBlobStorage(t *testing.T) {
    ctx := context.Background()

    ctr, err := azurite.Run(
        ctx,
        "mcr.microsoft.com/azure-storage/azurite:3.33.0",
        azurite.WithEnabledServices(azurite.BlobService),
        azurite.WithInMemoryPersistence(64),
    )
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    serviceURL, err := ctr.BlobServiceURL(ctx)
    require.NoError(t, err)

    cred, err := azblob.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
    require.NoError(t, err)

    client, err := azblob.NewClientWithSharedKeyCredential(serviceURL+"/"+azurite.AccountName, cred, nil)
    require.NoError(t, err)

    _, err = client.CreateContainer(ctx, "mycontainer", nil)
    require.NoError(t, err)

    _, err = client.UploadStream(ctx, "mycontainer", "hello.txt", strings.NewReader("Hello, Azure!"), nil)
    require.NoError(t, err)
}
```

`WithEnabledServices` restricts Azurite to only the storage service you need, reducing exposed ports and startup time. `WithInMemoryPersistence` keeps data in memory rather than writing to disk.

### Queue Storage

```go
import (
    "context"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    "github.com/Azure/azure-sdk-for-go/sdk/storage/azqueue"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/azurite"
)

func TestQueueStorage(t *testing.T) {
    ctx := context.Background()

    ctr, err := azurite.Run(
        ctx,
        "mcr.microsoft.com/azure-storage/azurite:3.33.0",
        azurite.WithEnabledServices(azurite.QueueService),
    )
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    serviceURL, err := ctr.QueueServiceURL(ctx)
    require.NoError(t, err)

    cred, err := azqueue.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
    require.NoError(t, err)

    client, err := azqueue.NewServiceClientWithSharedKeyCredential(serviceURL+"/"+azurite.AccountName, cred, nil)
    require.NoError(t, err)

    _, err = client.CreateQueue(ctx, "myqueue", &azqueue.CreateOptions{
        Metadata: map[string]*string{"env": to.Ptr("test")},
    })
    require.NoError(t, err)
}
```

### Table Storage

```go
import (
    "context"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/data/aztables"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/azurite"
)

func TestTableStorage(t *testing.T) {
    ctx := context.Background()

    ctr, err := azurite.Run(
        ctx,
        "mcr.microsoft.com/azure-storage/azurite:3.33.0",
        azurite.WithEnabledServices(azurite.TableService),
    )
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    serviceURL, err := ctr.TableServiceURL(ctx)
    require.NoError(t, err)

    cred, err := aztables.NewSharedKeyCredential(azurite.AccountName, azurite.AccountKey)
    require.NoError(t, err)

    client, err := aztables.NewServiceClientWithSharedKey(serviceURL+"/"+azurite.AccountName, cred, nil)
    require.NoError(t, err)

    _, err = client.CreateTable(ctx, "mytable", nil)
    require.NoError(t, err)
}
```

## Azure Cosmos DB

The `cosmosdb` package starts the [Azure Cosmos DB Linux Emulator](https://learn.microsoft.com/azure/cosmos-db/how-to-develop-emulator). The `vnext-preview` image exposes an HTTP endpoint and handles TLS internally, so Go tests don't need a JVM truststore or custom certificate loading.

The module ships a `NewContainerPolicy` helper that returns a client policy configured to trust the emulator's self-signed certificate:

```go
import (
    "context"
    "net/http"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/data/azcosmos"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/cosmosdb"
)

func TestCosmosDB(t *testing.T) {
    ctx := context.Background()

    ctr, err := cosmosdb.Run(ctx, "mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:vnext-preview")
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    connStr, err := ctr.ConnectionString(ctx)
    require.NoError(t, err)

    policy, err := cosmosdb.NewContainerPolicy(ctx, ctr)
    require.NoError(t, err)

    client, err := azcosmos.NewClientFromConnectionString(connStr, policy.ClientOptions())
    require.NoError(t, err)

    resp, err := client.CreateDatabase(ctx, azcosmos.DatabaseProperties{ID: "mydb"}, nil)
    require.NoError(t, err)
    require.Equal(t, http.StatusCreated, resp.RawResponse.StatusCode)
}
```

`ConnectionString` returns a value in the form `AccountEndpoint=<host>:<port>;AccountKey=<key>;` — the same format accepted by the production `azcosmos` client.

## Azure Event Hubs

> [!IMPORTANT]
> The Azure Event Hubs emulator requires you to accept a license agreement. Pass `eventhubs.WithAcceptEULA()` to `Run`. The container fails to start without it.

The `eventhubs` package starts the [Azure Event Hubs emulator](https://learn.microsoft.com/azure/event-hubs/test-locally-with-event-hub-emulator). Event Hubs requires Azure Storage for checkpoint state, so **the module automatically creates a private Docker network and an Azurite container** alongside the Event Hubs container. Both are torn down when you call `Terminate`.

### Configure entities with a typed config builder

The emulator enforces hard limits (1 namespace, up to 10 entities, 1–32 partitions, up to 20 consumer groups per entity). Use `eventhubs.NewConfig` to build and validate the configuration before the container starts:

```go
import (
    "context"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/messaging/azeventhubs"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/eventhubs"
)

func TestEventHubs(t *testing.T) {
    ctx := context.Background()

    cfg, err := eventhubs.NewConfig(
        eventhubs.WithNamespace(eventhubs.EmulatorNamespaceName,
            eventhubs.WithEntity("orders", 2,
                eventhubs.WithConsumerGroup("$Default"),
            ),
        ),
    )
    require.NoError(t, err)

    ctr, err := eventhubs.Run(
        ctx,
        "mcr.microsoft.com/azure-messaging/eventhubs-emulator:2.1.0",
        eventhubs.WithAcceptEULA(),
        eventhubs.WithConfigObject(cfg),
    )
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    connStr, err := ctr.ConnectionString(ctx)
    require.NoError(t, err)

    producer, err := azeventhubs.NewProducerClientFromConnectionString(connStr, "orders", nil)
    require.NoError(t, err)
    defer producer.Close(ctx)

    batch, err := producer.NewEventDataBatch(ctx, nil)
    require.NoError(t, err)

    err = batch.AddEventData(&azeventhubs.EventData{Body: []byte("hello")}, nil)
    require.NoError(t, err)

    err = producer.SendEventDataBatch(ctx, batch, nil)
    require.NoError(t, err)
}
```

> [!NOTE]
> The emulator creates event hub entities from the config file asynchronously after startup. If `NewEventDataBatch` or `SendEventDataBatch` returns an error on the first attempt, retry with a short delay. The examples in the testcontainers-go repository show a simple retry loop for this pattern.

### Bring your own Azurite container

If your test already manages an Azurite container (for example, to test both Storage and Event Hubs in the same suite), pass it to the Event Hubs container with `WithAzuriteContainer`. The Event Hubs container will use that Azurite instance instead of creating its own:

```go
eventHubsCtr, err := eventhubs.Run(
    ctx,
    "mcr.microsoft.com/azure-messaging/eventhubs-emulator:2.1.0",
    eventhubs.WithAcceptEULA(),
    eventhubs.WithAzuriteContainer(azuriteCtr, existingNetwork, "azurite"),
)
testcontainers.CleanupContainer(t, eventHubsCtr)
require.NoError(t, err)
```

When `WithAzuriteContainer` is used, `Terminate` on the Event Hubs container does **not** stop the Azurite container or the network — the caller manages their lifecycle.

## Azure Service Bus

> [!IMPORTANT]
> The Azure Service Bus emulator requires you to accept a license agreement. Pass `servicebus.WithAcceptEULA()` to `Run`. The container fails to start without it.

The `servicebus` package starts the [Azure Service Bus emulator](https://learn.microsoft.com/azure/service-bus-messaging/overview-emulator). Service Bus requires SQL Server for state storage, so **the module automatically creates a private Docker network and a Microsoft SQL Server container** alongside the Service Bus container. Both are torn down when you call `Terminate`.

```go
import (
    "context"
    "strings"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/messaging/azservicebus"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/servicebus"
)

func TestServiceBus(t *testing.T) {
    ctx := context.Background()

    cfg := `{
        "UserConfig": {
            "Namespaces": [{
                "Name": "sbemulatorns",
                "Queues": [{
                    "Name": "orders",
                    "Properties": {
                        "DeadLetteringOnMessageExpiration": false,
                        "DefaultMessageTimeToLive": "PT1H",
                        "DuplicateDetectionHistoryTimeWindow": "PT20S",
                        "LockDuration": "PT1M",
                        "MaxDeliveryCount": 10,
                        "RequiresDuplicateDetection": false,
                        "RequiresSession": false
                    }
                }]
            }],
            "Logging": {"Type": "File"}
        }
    }`

    ctr, err := servicebus.Run(
        ctx,
        "mcr.microsoft.com/azure-messaging/servicebus-emulator:1.1.2",
        servicebus.WithAcceptEULA(),
        servicebus.WithConfig(strings.NewReader(cfg)),
    )
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    connStr, err := ctr.ConnectionString(ctx)
    require.NoError(t, err)

    client, err := azservicebus.NewClientFromConnectionString(connStr, nil)
    require.NoError(t, err)
    defer client.Close(ctx)

    sender, err := client.NewSender("orders", nil)
    require.NoError(t, err)
    defer sender.Close(ctx)

    // Retry because queue creation from config is asynchronous.
    var sendErr error
    for range 3 {
        sendErr = sender.SendMessage(ctx, &azservicebus.Message{Body: []byte("order-1")}, nil)
        if sendErr == nil {
            break
        }
    }
    require.NoError(t, sendErr)

    receiver, err := client.NewReceiverForQueue("orders", nil)
    require.NoError(t, err)
    defer receiver.Close(ctx)

    messages, err := receiver.ReceiveMessages(ctx, 1, nil)
    require.NoError(t, err)
    require.Len(t, messages, 1)

    err = receiver.CompleteMessage(ctx, messages[0], nil)
    require.NoError(t, err)
}
```

`ConnectionString` returns a value in the form `Endpoint=sb://<host>:<port>;SharedAccessKeyName=…;SharedAccessKey=…;UseDevelopmentEmulator=true;` — compatible with the production `azservicebus` client.

## Azure Key Vault

> [!NOTE]
> The `lowkeyvault` package uses [Lowkey Vault](https://github.com/nagyesta/lowkey-vault), a community open-source Key Vault emulator, not an official Microsoft emulator. It supports the Secrets, Keys, and Certificates APIs and does not require EULA acceptance.

The `lowkeyvault` package is particularly useful when testing code that reads secrets, signs data with keys, or manages certificates — without provisioning a real Key Vault or granting cloud permissions.

The module has two access modes:

- **Local mode** (default): both the Key Vault API and the token endpoint are exposed on random host ports. Use this for standalone integration tests.
- **Network mode**: the container is attached to a named Docker network and accessible from other containers using its alias. Use this when your application under test runs in a container itself.

```go
import (
    "context"
    "testing"

    "github.com/Azure/azure-sdk-for-go/sdk/azcore/cloud"
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/policy"
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/tracing"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
    "github.com/stretchr/testify/require"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/azure/lowkeyvault"
)

func TestKeyVaultSecrets(t *testing.T) {
    ctx := context.Background()

    ctr, err := lowkeyvault.Run(ctx, "nagyesta/lowkey-vault:7.0.9-ubi10-minimal")
    testcontainers.CleanupContainer(t, ctr)
    require.NoError(t, err)

    // Simulate managed-identity authentication used in production.
    identityEndpoint, err := ctr.IdentityEndpoint(ctx, lowkeyvault.Local)
    require.NoError(t, err)
    t.Setenv("IDENTITY_ENDPOINT", identityEndpoint)
    t.Setenv("IDENTITY_HEADER", ctr.IdentityHeader())

    vaultURL, err := ctr.ConnectionURL(ctx, lowkeyvault.Local)
    require.NoError(t, err)

    httpClient, err := ctr.Client(ctx)
    require.NoError(t, err)

    // azidentity.NewDefaultAzureCredential picks up IDENTITY_ENDPOINT / IDENTITY_HEADER.
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    require.NoError(t, err)

    secretsClient, err := azsecrets.NewClient(vaultURL, cred, &azsecrets.ClientOptions{
        ClientOptions: struct {
            APIVersion                      string
            Cloud                           cloud.Configuration
            InsecureAllowCredentialWithHTTP bool
            Logging                         policy.LogOptions
            Retry                           policy.RetryOptions
            Telemetry                       policy.TelemetryOptions
            TracingProvider                 tracing.Provider
            Transport                       policy.Transporter
            PerCallPolicies                 []policy.Policy
            PerRetryPolicies                []policy.Policy
        }{Transport: &httpClient},
        DisableChallengeResourceVerification: true,
    })
    require.NoError(t, err)

    _, err = secretsClient.SetSecret(ctx, "db-password", azsecrets.SetSecretParameters{
        Value: to.Ptr("s3cr3t"),
    }, nil)
    require.NoError(t, err)

    resp, err := secretsClient.GetSecret(ctx, "db-password", "", nil)
    require.NoError(t, err)
    require.Equal(t, "s3cr3t", *resp.Value)
}
```

`ctr.Client(ctx)` returns an `*http.Client` pre-configured to trust the emulator's self-signed certificate. Pass it as the `Transport` in the Azure SDK client options so TLS verification succeeds.

## CI/CD considerations

### GitHub Actions

The `ubuntu-latest` runner includes Docker Engine. No additional setup is required:

```yaml
- name: Run integration tests
  run: go test ./... -count=1 -timeout 5m
```

### Azure Pipelines

Use a `ubuntu-latest` Microsoft-hosted agent. Docker is pre-installed:

```yaml
- task: GoTool@0
  inputs:
    version: '1.23'

- script: go test ./... -count=1 -timeout 5m
  displayName: Run integration tests
```

### Resource consumption

Some containers pull in additional dependencies at startup:

| Test | Containers started | Approximate RAM |
|---|---|---|
| Azurite (single service) | 1 | ~300 MB |
| Cosmos DB | 1 | ~1 GB |
| Event Hubs | 2 (Event Hubs + Azurite) | ~1.5 GB |
| Service Bus | 2 (Service Bus + SQL Server) | ~2 GB |

For pipelines with limited memory, run these test packages sequentially or in separate jobs.

### Automatic cleanup

Testcontainers for Go runs a [Ryuk](https://github.com/testcontainers/moby-ryuk) reaper container that removes dangling containers and networks even if the test process exits unexpectedly. This is enabled by default. Set `TESTCONTAINERS_RYUK_DISABLED=true` only if your pipeline enforces its own Docker cleanup policy.

### Parallel test packages

Each `Run` call creates an isolated container bound to randomly assigned ports. Running multiple test packages in parallel is safe:

```bash
go test ./... -p 4 -count=1
```

## Next steps

- [Testcontainers for Go documentation](https://golang.testcontainers.org/)
- [Azure module source and examples](https://github.com/testcontainers/testcontainers-go/tree/main/modules/azure)
- [Azure SDK for Go](overview.md)
- [Key Azure services for Go developers](key-azure-services-for-go.md)
