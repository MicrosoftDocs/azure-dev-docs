---
title: Use the Azure SDK for Go for control plane operations
description: Learn how to provision, configure, and manage Azure resources programmatically by using the Azure SDK for Go. This article focuses on control plane patterns such as creating resource groups and managing infrastructure through the SDK's management libraries.
ms.date: 03/13/2026
ms.topic: overview
ms.custom: devx-track-go
ms.devlang: golang
ai-usage: ai-assisted
---

# Use the Azure SDK for Go for control plane operations

Learn how to provision, configure, and manage Azure resources programmatically by using the Azure SDK for Go management libraries. Common control-plane workflows include creating resource groups, managing storage and networking infrastructure, and handling virtual machine (VM) lifecycle operations such as create, start, stop, resize, update, and delete. If you want the higher-level introduction to how management libraries fit into the Azure SDK for Go, start with [Overview of the Azure SDK for Go management libraries](management-libraries.md). This article focuses on the Go control-plane patterns you reuse across services, and links to [data plane guidance](data-plane.md) when the runtime path moves from resource management to working with service data.

## What is the Azure control plane?

The Azure control plane is the set of APIs that control the lifecycle of Azure resources - creating, updating, configuring, and deleting them. Every operation you perform in the Azure portal, Azure CLI, or infrastructure-as-code tool ultimately calls these control plane APIs.

The Azure SDK for Go exposes the control plane through a family of `arm*` packages under `github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/`. Each package maps to an Azure resource provider and follows a consistent pattern:

1. Authenticate by using the `azidentity` package.
1. Create a typed client for the resource you want to manage.
1. Call methods on the client to create, read, update, or delete resources.
1. Handle long-running operations by using pollers.

Common scenarios for Go control plane automation include:

- Provisioning infrastructure for deployment pipelines
- Managing VM lifecycle operations such as create, update, delete, start, stop, and resize
- Building custom CLIs and operators for platform teams
- Implementing GitOps-style infrastructure reconciliation
- Automating compliance auditing and drift detection

## Authentication

All management operations require an authenticated credential from the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) package. The package provides credential types for every environment including local development, CI/CD pipelines, and production workloads running in Azure. All credential types implement the same `azcore.TokenCredential` interface, so you can swap them without changing client code.

After you get a credential, create a client factory for the package and then ask it for the typed client you need:

```go
// Create credential that auto-discovers authentication (Azure CLI, env vars, managed identity)
cred, err := azidentity.NewDefaultAzureCredential(nil)

// Construct a client factory, then the typed client for management operations
clientFactory, err := armresources.NewClientFactory(subscriptionID, cred, nil)
rgClient := clientFactory.NewResourceGroupsClient()
```

Current `arm*` package docs usually show the client factory pattern because it centralizes shared configuration for related clients. Many packages also expose direct `New<ResourceType>Client(subscriptionID, credential, options)` constructors, but `NewClientFactory(...).New<ResourceType>Client()` is the pattern you'll most often see on pkg.go.dev. For local development, `DefaultAzureCredential` usually picks up your Azure CLI sign-in. In CI/CD and deployed workloads, you can switch to environment-based credentials or managed identity without changing the rest of your client code.

For a full guide on credential types and best practices, see [Authentication with the Azure SDK for Go](./sdk/authentication/authentication-overview.md) and the [azidentity package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity).

## Client packages and typed clients

Management packages are under `github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/<service>/arm<service>`. Install the identity package and only the `arm*` packages you plan to use. For example, if you're only managing VMs and resource groups, you only need `armcompute` and `armresources`. Each package contains clients for the resources in that service. For example, `armcompute` has clients for virtual machines, disks, images, and related compute resources.

A single management package often contains several clients, with each client focused on one resource type or operation group. For example, `armcompute` includes clients for virtual machines, disks, images, and related resources. After you choose the package for a service, create one client factory and reuse it to create the typed clients that match the resources you want to manage.

```go
clientFactory, err := armcompute.NewClientFactory(subscriptionID, cred, nil)
if err != nil {
	return err
}
vmClient := clientFactory.NewVirtualMachinesClient()
```

This package and client factory pattern is consistent across the `resourcemanager` modules. It's a useful shortcut when you're scanning pkg.go.dev or asking an agent to find the right client for a task.

## Long-running operations

Many management operations, such as creating clusters, deleting resource groups, and upgrading infrastructure, run asynchronously. Methods prefixed with `Begin` start the server-side work and return a poller immediately. Your code can decide whether to wait or keep doing other work:

```go
// Start an asynchronous operation (returns immediately)
poller, err := client.BeginCreateOrUpdate(ctx, resourceGroupName, parameters, nil)
if err != nil {
	return err
}

// Block until the operation completes or fails
result, err := poller.PollUntilDone(ctx, nil)
if err != nil {
	return err
}
```

A successful `Begin*` call only means Azure accepted the request. The operation can still fail later while the poller runs. That's why both the initial call and `PollUntilDone` need error handling. Use `PollUntilDone` when you want the simplest flow. Use `poller.Poll` and `poller.Done` when you need custom wait logic or progress reporting.

For more details on patterns, see the [Common usage patterns in Azure SDK for Go](azure-sdk-core-concepts.md).

## Error handling

Management operations return structured errors you can inspect for specific error codes:

```go
import "github.com/Azure/azure-sdk-for-go/sdk/azcore"

// Check if the error is an Azure service error with structured details
var respErr *azcore.ResponseError
if errors.As(err, &respErr) {
	fmt.Printf("Error code: %s\n", respErr.ErrorCode)
	fmt.Printf("Status code: %d\n", respErr.StatusCode)
}
```

Most `CreateOrUpdate` operations are idempotent. Calling them on an existing resource updates the resource instead of failing.

## Provision a resource example

This example shows the common control plane pattern: authenticate, create a resource with tags and timeout, and check the result. Use this pattern as a template for all management operations because the credential, context, and subscription ID pattern applies to all `arm*` clients.

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
)

func main() {
	// Read subscription ID from environment (avoid hardcoding)
	subscriptionID := os.Getenv("AZURE_SUBSCRIPTION_ID")
	if subscriptionID == "" {
		log.Fatal("AZURE_SUBSCRIPTION_ID not set")
	}

	// Create credential that auto-discovers authentication
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to create credential: %v", err)
	}

	// Set a timeout for the entire operation (prevents hanging indefinitely)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	// Create a client factory for this management package
	clientFactory, err := armresources.NewClientFactory(subscriptionID, cred, nil)
	if err != nil {
		log.Fatalf("failed to create client factory: %v", err)
	}

	// Create the typed client for resource groups
	rgClient := clientFactory.NewResourceGroupsClient()

	// Many ARM models use pointer fields for optional values.
	resp, err := rgClient.CreateOrUpdate(ctx, "example-rg", armresources.ResourceGroup{
		Location: to.Ptr("eastus"),
		Tags: map[string]*string{
			"env":  to.Ptr("dev"),
			"team": to.Ptr("platform"),
		},
	}, nil)
	if err != nil {
		log.Fatalf("failed to create or update resource group: %v", err)
	}

	fmt.Printf("resource group %s ready in %s\n", *resp.Name, *resp.Location)
}
```

## Resource groups

The [armresources](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources) package manages resource groups - the fundamental organizational containers in Azure. Every Azure resource exists within a resource group, making this the starting point for any provisioning workflow.

Use it to create and update resource groups with location and tags, list groups across a subscription, and delete groups along with all contained resources. Resource group creation is synchronous and idempotent. Deletion is asynchronous and permanent.

Listing resource groups also introduces an important control-plane pattern: many read operations use pagers. When you enumerate resource groups or other large ARM collections, create a pager and iterate until `pager.More()` returns `false`.

```go
pager := rgClient.NewListPager(nil)
for pager.More() {
	page, err := pager.NextPage(ctx)
	if err != nil {
		return err
	}

	for _, group := range page.ResourceGroupListResult.Value {
		fmt.Println(*group.Name)
	}
}
```

[Resource group management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/resource/resourcegroups).

For a getting started guide, see the [armresources package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources).

## Virtual machines

The [armcompute](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute) package is a canonical control-plane example because VM management is mostly lifecycle work: create or update a VM, start or stop it, resize it, and delete it. In Go, these workflows use the same `DefaultAzureCredential`, `context.Context`, and client factory pattern shown in the resource group example, so once that pattern is in place you can apply it across compute operations without changing your authentication approach.

If you need a quick starting point, create the compute client factory and then ask it for the typed VM client:

```go
clientFactory, err := armcompute.NewClientFactory(subscriptionID, cred, nil)
if err != nil {
	return err
}
vmClient := clientFactory.NewVirtualMachinesClient()
```

For full VM samples and operation-specific guidance, see the existing [virtual machine management samples](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/compute) and the [armcompute package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/compute/armcompute). Use those references for complete request models and long-running operation details instead of duplicating large VM templates in this article.

## Key Vault

The [armkeyvault](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/keyvault/armkeyvault) package manages the lifecycle of Azure Key Vault instances. This package handles the control plane for vault infrastructure. Use the separate `azsecrets`, `azkeys`, and `azcertificates` data plane packages to read and write secrets, keys, and certificates.

Use this package to provision vaults with the appropriate SKU and security settings, such as soft delete and purge protection. You can also manage access policies for principals, configure network access and private endpoints, and enable diagnostic logging. You can integrate vault provisioning into application onboarding workflows.

[Key Vault management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/keyvault).

For runtime-side Key Vault clients, see [Use the Azure SDK for Go for data plane operations](data-plane.md).

For a getting started guide, see the [armkeyvault package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/keyvault/armkeyvault#section-readme).

## AKS clusters

The [armcontainerservice](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/containerservice/armcontainerservice) package manages Azure Kubernetes Service clusters across their full lifecycle.

Use this package to create clusters with configurable networking, Kubernetes version, and managed identity. You can add and scale node pools, upgrade control plane and node versions, enable add-ons like Azure Policy and monitoring, and query cluster health for operational dashboards. All cluster operations are long-running and follow the poller pattern.

[AKS management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/containerservice).

For a getting started guide, see the [armcontainerservice package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/containerservice/armcontainerservice#section-readme).

## RBAC and authorization

The [armauthorization](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/authorization/armauthorization) package manages Azure Role-Based Access Control. Use it to automate least-privilege access policies across subscriptions and resource groups.

Use it to list and search built-in roles, assign roles to principals (users, service principals, managed identities, or groups) at any scope, create custom role definitions with fine-grained permissions, and audit assignments for compliance reporting and drift detection. Assign roles to groups rather than individuals, and use built-in roles where possible.

For a getting started guide, see the [armauthorization package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/authorization/armauthorization#section-readme).

## Virtual networks and network security

The [armnetwork](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork) package manages Azure virtual networking infrastructure.

Use it to create virtual networks and subnets, configure network security groups with inbound and outbound rules, set up private endpoints for PaaS services, automate network peering across regions, and implement hub-and-spoke topologies programmatically.

[Network management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/network).

For a getting started guide, see the [armnetwork package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/network/armnetwork#section-readme).

## Container registry

The [armcontainerregistry](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/containerregistry/armcontainerregistry) package manages Azure Container Registry instances.

Use it to provision registries with the appropriate SKU and geo-replication, configure authentication (admin, service principal, or managed identity), manage webhooks for CI/CD, enable vulnerability scanning, and apply retention policies to images. You often use Container Registry alongside Azure Kubernetes Service. First, provision the registry, and then reference it during cluster creation.

[Container Registry management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/containerregistry).

For a getting started guide, see the [armcontainerregistry package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/containerregistry/armcontainerregistry#section-readme).

## Storage accounts

The [armstorage](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage) package manages Azure Storage accounts. 

Use it to create storage accounts with the right performance tier and redundancy, manage access keys and shared access signatures, configure blob lifecycle policies, and set up diagnostic logging. Storage accounts are a common dependency for many applications, so automating their provisioning and configuration is a common control-plane scenario.

[Storage account management code sample](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/storage).

For a getting started guide, see the [armstorage package documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/storage/armstorage#section-readme).

## Next steps

- [Overview of the Azure SDK for Go management libraries](management-libraries.md)
- [Use the Azure SDK for Go for data plane operations](data-plane.md)
- [Azure SDK for Go authentication](./sdk/authentication/authentication-overview.md)
- [Azure SDK for Go samples on GitHub](https://github.com/Azure-Samples/azure-sdk-for-go-samples)