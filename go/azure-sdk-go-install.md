---
title: Install the Azure SDK for Go
description: How to install, vendor, and configure the Azure SDK for Go.
ms.date: 03/14/2018
ms.topic: conceptual
---

# Install the Azure SDK for Go

Welcome to the Azure SDK for Go! The SDK allows you to manage and interact with Azure services from your Go applications.

## Get the Azure SDK for Go

[!INCLUDE [azure-sdk-go-get](includes/azure-sdk-go-get.md)]

Some Azure services have their own Go SDK and aren't included in the core Azure SDK for Go package. The
following table lists the services with their own SDKs and their package names. These packages are
all considered to be in preview.

| Service | Package |
|---------|---------|
| Blob Storage | [github.com/Azure/azure-storage-blob-go](https://github.com/Azure/azure-storage-blob-go) |
| File Storage | [github.com/Azure/azure-storage-file-go](https://github.com/Azure/azure-storage-file-go) |
| Storage Queue | [github.com/Azure/azure-storage-queue-go](https://github.com/Azure/azure-storage-queue-go) |
| Event Hub | [github.com/Azure/azure-event-hubs-go](https://github.com/Azure/azure-event-hubs-go) |
| Service Bus | [github.com/Azure/azure-service-bus-go](https://github.com/Azure/azure-service-bus-go) |

## Vendor the Azure SDK for Go

The Azure SDK for Go may be vendored through [dep](https://github.com/golang/dep). For stability reasons, vendoring is recommended. To use `dep`
in your own project, add `github.com/Azure/azure-sdk-for-go` to a `[[constraint]]` section of your `Gopkg.toml`. For example, to vendor on version `14.0.0`, add the following entry:

```toml
[[constraint]]
name = "github.com/Azure/azure-sdk-for-go"
version = "14.0.0"
```

## Include the Azure SDK for Go in your project

To use Azure services from your Go code, import any services you interact with and the required `autorest` modules.
 You get a complete list of the available modules from GoDoc for 
[available services](https://godoc.org/github.com/Azure/azure-sdk-for-go) and 
[AutoRest packages](https://godoc.org/github.com/Azure/go-autorest). The most common packages you need from `go-autorest`
are:

| Package | Description |
|---------|-------------|
| [github.com/Azure/go-autorest/autorest][autorest] | Objects for handling service client authentication |
| [github.com/Azure/go-autorest/autorest/azure][autorest/azure] | Constants for interactions with Azure services |
| [github.com/Azure/go-autorest/autorest/adal][autorest/adal] | Authentication mechanisms for accessing Azure services |
| [github.com/Azure/go-autorest/autorest/to][autorest/to] | Type assertion helpers for working with Azure SDK data structures |

[autorest]: https://godoc.org/github.com/Azure/go-autorest/autorest
[autorest/azure]: https://godoc.org/github.com/Azure/go-autorest/autorest/azure
[autorest/adal]: https://godoc.org/github.com/Azure/go-autorest/autorest/adal
[autorest/to]: https://godoc.org/github.com/Azure/go-autorest/autorest/to

Go packages and Azure services are versioned independently. The service versions are part of the module import path, underneath
the `services` module. The full path for the module is the name of the service, followed by
the version in `YYYY-MM-DD` format, followed by the service name again. For example, to import the `2017-03-30` version of the Compute service:

```go
import "github.com/Azure/azure-sdk-for-go/services/compute/mgmt/2017-03-30/compute"
```

It's recommended that you use the latest version of a service when starting development and keep it consistent.
Service requirements may change between versions that could break your code, even if there are no Go SDK updates during
that time.

If you need a collective snapshot of services, you can also select a single profile version. Right now, the only locked profile is version 
`2017-03-09`, which may not have the latest features of services. Profiles are located under the `profiles` module, with their version in the `YYYY-MM-DD` format. 
Services are grouped under their profile version. For example, to import the Azure Resources management module from the `2017-03-09` profile:

```go
import "github.com/Azure/azure-sdk-for-go/profiles/2017-03-09/resources/mgmt/resources"
```

> [!WARNING]
> There are also `preview` and `latest` profiles available. Using them is not recommended. These profiles are rolling versions and service behavior may change at any time.

## Next steps

To begin using the Azure SDK for Go, try out a quickstart.

* [Deploy a virtual machine from a template](azure-sdk-go-qs-vm.md)
* [Transfer objects to Azure Blob Storage with the Azure Blob SDK for Go](/azure/storage/blobs/storage-quickstart-blobs-go?toc=%2fgo%2fazure%2ftoc.json)
* [Connect to Azure Database for PostgreSQL](/azure/postgresql/connect-go?toc=%2fgo%2fazure%2ftoc.json)

If you want to get started with other services in the Go SDK immediately,
take a look at some of the available sample code.

* [Authenticate with Azure services](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/internal/iam)
* [Deploy new virtual machines with SSH authentication](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/compute)
* [Deploy a container image to Azure Container Instances](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/compute)
* [Create a cluster in Azure Kubernetes Service](https://github.com/Azure-Samples/azure-sdk-for-go-samples/blob/master/compute)
* [Work with Azure Storage services](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/master/storage)
* [All samples for the Azure SDK for Go](https://github.com/azure-samples/azure-sdk-for-go-samples)
