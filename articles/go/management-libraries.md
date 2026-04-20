---
title: Overview of the Azure SDK for Go management and client libraries
description: In this article, you learn the basic tasks of working with the Azure SDK for Go management and client libraries.
ms.date: 03/13/2026
ms.topic: overview
ms.custom: devx-track-go
ms.devlang: golang
ai-usage: ai-assisted
---

# Overview of the Azure SDK for Go libraries

The Azure SDK for Go includes both management libraries and data plane client libraries. This article provides an overview so you can understand what the libraries are, how they fit into Azure workflows, and where to go next for Go-specific patterns.

## Management libraries

Use the management libraries to provision, configure, and govern Azure resources. They focus on managing the resources themselves rather than the data stored inside them. Management libraries perform *control plane* operations, which manage Azure resources and service configuration. Typical tasks include:

- Creating or updating resource groups, virtual networks, or virtual machines.
- Configuring security settings, identities, access policies, and diagnostics.
- Listing, tagging, and deleting Azure resources across a subscription.
- Automating deployment, cleanup, compliance, and platform operations.

Management library packages have names like `armcompute`, `armnetwork`, and `armkeyvault`. Use management libraries during the setup, configuration, and governance phases of an application lifecycle. For detailed package documentation, search for the package on [pkg.go.dev](https://pkg.go.dev/).

## Client libraries

Use the client libraries when your Go application needs to work with data or runtime surfaces inside an already provisioned Azure service. Client libraries perform *data plane* operations, which work with the data stored in or flowing through a service. Typical tasks include:

- Uploading and downloading blobs from a storage account.
- Sending and receiving messages with Service Bus or Event Hubs.
- Reading, writing, or deleting records in a database.
- Retrieving secrets from Key Vault.
- Executing queries or operations against provisioned resources.

Client library packages have names like `azblob`, `azstorage`, `azsecrets`, `azservicebus`, and `azeventhubs`. Use client libraries after you already provisioned the underlying Azure service by using management libraries. For detailed package documentation, search for the package on [pkg.go.dev](https://pkg.go.dev/).

## Using both management and client libraries

A single Go solution can use both management and client libraries across control and data planes. For example, you might use a management library during setup to create a storage account (control plane), and then use a client library in the application to upload and download blobs (data plane). Understanding the distinction helps you choose the right library for each task in your workflow.

For Go-specific patterns and examples for each plane, see these articles:

- [Use the Azure SDK for Go for control plane operations](control-plane.md).
- [Use the Azure SDK for Go for data plane operations](data-plane.md).

## Installing Go packages

In most projects, you install the Go packages for versioning and dependency management.

To install a Go package, run the `go get` command.

For example, to install the `armcompute` package, run the following command:

```azurecli
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute
```

In most Go apps, install the following packages for authentication:

- github.com/Azure/azure-sdk-for-go/sdk/azcore/to
- github.com/Azure/azure-sdk-for-go/sdk/azidentity

## Importing packages into your Go code

After downloading the packages, import them into your app by using the `import` statement:

```go
import (
    "github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute"
)
```

## Authenticating to Azure

Go apps that use Azure SDK libraries should authenticate by using Microsoft Entra ID with the [Azure Identity library](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity). Token-based authentication is more secure and manageable than connection strings or keys. The recommended credential depends on where the app runs: use managed identities for Azure-hosted apps, developer credentials or a service principal for local development, and a service principal for most on-premises scenarios.

The default authentication option is **DefaultAzureCredential**, which uses the environment variables set earlier in this article. In your Go code, create an `azidentity` object as follows:

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
if err != nil {
  // handle error
}
```

For more information about authentication, see [Azure SDK for Go authentication](./sdk/authentication/authentication-overview.md).

## Creating a Resource Management client

After you get a credential from Azure Identity, create a client to connect to the target Azure service.

For example, suppose you want to connect to the [Azure Compute](https://azure.microsoft.com/product-categories/compute/) service. The [Compute package](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute) consists of one or more clients. A client groups a set of related APIs, providing access to its functionality within the specified subscription. You create one or more clients to access the APIs you require.

The following code uses the [armcompute.NewVirtualMachinesClient type](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute#VirtualMachinesClient) to create a client to manage virtual machines:

```go
client, err := armcompute.NewVirtualMachinesClient("<subscription ID>", cred, nil)
if err != nil {
  // handle error
}
```

For more information about managing Azure resources with Go, see [Use the Azure SDK for Go for control plane operations](control-plane.md).

Use the same pattern to connect with other Azure services. For example, install the [`armnetwork`](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork) package and create a [virtual network](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork#VirtualNetworksClient) client to manage virtual network resources.

```go
client, err := armnetwork.NewVirtualNetworksClient("<subscription ID>", cred, nil)
if err != nil {
  // handle error
}
```

**Code sample**:

```go
package main

import (
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute"
)

func main() {
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        // handle error
    }
    client, err := armcompute.NewVirtualMachinesClient("<subscription ID>", cred, nil)
    if err != nil {
        // handle error
    }
}
```

For more information about using the Azure SDK for Go for Azure services, see [Use the Azure SDK for Go for data plane operations](data-plane.md).

## Using the Azure SDK for Go repository

After you instantiate a client, use it to make API calls to your Azure resources. For resource management scenarios, most use cases are CRUD (create, read, update, delete) operations.

To find operations for a specific type, browse the source in the [Azure SDK for Go GitHub repository](https://github.com/Azure/azure-sdk-for-go). The SDK source is organized under the [`sdk/`](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk) directory, with management libraries under [`sdk/resourcemanager/`](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager) and client libraries in service-specific folders such as `sdk/storage/` and `sdk/security/keyvault/`.

To locate the source for a specific type, follow these steps:

1. Go to the [Azure SDK for Go repository](https://github.com/Azure/azure-sdk-for-go) on GitHub.
1. Navigate to `sdk/resourcemanager/` for management libraries, or `sdk/` for client libraries.
1. Open the service folder and then the package folder. For example, `sdk/resourcemanager/compute/armcompute/`.
1. Find the source file that contains the type you need. Client types and their methods are typically in files named after the client, such as `virtualmachines_client.go`.
1. Read the type's comments and method signatures for usage information.

You can also build the URL directly. For example, to find the resource group operations source, navigate to `https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/resources/armresources`.

This example shows how to find the source for Azure resource group operations:

1. Go to the [Azure SDK for Go repository](https://github.com/Azure/azure-sdk-for-go) on GitHub.
1. Navigate to [`sdk/resourcemanager/resources/armresources/`](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/resources/armresources).
1. Open `resource_groups_client.go` to find the [`ResourceGroupsClient`](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/resourcemanager/resources/armresources/resourcegroups_client.go) type and its `CreateOrUpdate` method.
1. Read the method's comments and parameters to understand how to make the API call.

For generated reference documentation, search for the package on [pkg.go.dev](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go).

## Long-running operations

Some operations take a long time to finish. To handle these operations, the management libraries provide functions that support long-running operations (LRO) through asynchronous calls. These function names start with `Begin`, such as `BeginCreate` and `BeginDelete`.

Because these functions are asynchronous, your code doesn't block while the function finishes its task. Instead, the function returns a *poller* object immediately. Your code then calls a synchronous poller function that returns when the original asynchronous function completes.

The following code snippet shows an example of this pattern.

```go
ctx := context.Background()
// Call an asynchronous function to create a client. The return value is a poller object.
poller, err := client.BeginCreate(ctx, "resource_identifier", "additional_parameter")

if err != nil {
    // handle error...
}

// Call the poller object's PollUntilDone function that will block until the poller object
// has been updated to indicate the task has completed.
resp, err = poller.PollUntilDone(ctx, nil)
if err != nil {
    // handle error...
}

// Print the fact that the LRO completed.
fmt.Printf("LRO done")

// Work with the response ("resp") object.
```

**Key points:**

- The `PollUntilDone` function requires a polling interval that specifies how often it should try to get the status. The [interval defaults to 30 seconds](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azcore/runtime/poller.go) if you pass `nil` for the options parameter, but you can adjust it based on your needs.
- The interval is typically short. See the documentation for the specific Azure resource for recommended intervals.
- The [LRO section of the Go Azure SDK Design Guidelines page](https://azure.github.io/azure-sdk/golang_introduction.html#methods-invoking-long-running-operations) has a more advanced example and general guidelines for LRO.

For more details on patterns, see the [Common usage patterns in Azure SDK for Go](azure-sdk-core-concepts.md).

## Next steps

For more information about authentication, client construction, long-running operation, and service walkthrough patterns, see the plane-specific articles:

- [Use the Azure SDK for Go for control plane operations](control-plane.md) for management-oriented Go workflows.
- [Use the Azure SDK for Go for data plane operations](data-plane.md) for runtime data access patterns that often follow provisioning.

For examples, see [Azure SDK for Go samples on GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples).