---
title: Working with the Azure SDK for Go Management Libraries 
description: In this article, you learn the basic tasks of working with the Azure SDK for Go Management Libraries.
ms.date: 08/10/2021
ms.topic: conceptual
ms.custom: devx-track-go
---

# Working with the Azure SDK for Go Management Libraries

As explained in the article [What is the Azure SDK for Go?](overview.md), the Azure SDK for Go contains a set of management and client libraries.
The management libraries share many features such as Azure Identity support, HTTP pipeline, and error-handling.
You can find the full list of the management libraries on the [Azure SDK for Go module page](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk).

In this article, you'll learn the basic steps of how to use the Management Libraries to interact with Azure resources.

## Installing modules

In most projects, you'll install the Go modules for versioning and dependency management.

To install a Go module, use the `go get <module>` command.

For example, to install the `armcompute` module, you run the following at the command line:

```cmd
go get github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute
```

In most Go apps, you'll install the following modules for authentication and core functionality:

- github.com/Azure/azure-sdk-for-go/sdk/armcore
- github.com/Azure/azure-sdk-for-go/sdk/azcore
- github.com/Azure/azure-sdk-for-go/sdk/azidentity
- github.com/Azure/azure-sdk-for-go/sdk/to

## Importing modules in to your Go code

Once downloaded, the modules are imported into your app via the `import` statement:

```go
import {
    "github.com/Azure/azure-sdk-for-go/sdk/armcore"
    "github.com/Azure/azure-sdk-for-go/sdk/resources/armresources"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/to"
}
```

## Authenticating to Azure

To run code against an Azure subscription, you need to authenticate to Azure. The [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) module provides facilities for various ways of authenticating with Azure including client/secret, certificate, and managed identity.

The default authentication option is **DefaultAzureCredential**, which uses the environment variables set earlier in this article. In your Go code, you'll create an `azidentity` object as follows:

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
```

## Connecting to Azure

Once you have a credential - such as an `azidentity` object - you create a connection to the desired Azure Resource Management endpoint. The [armcore](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/armcore) module provides facilities for connecting with Azure Resource Manager endpoints. These endpoints include public and sovereign clouds, and [Azure Stack](https://azure.microsoft.com/overview/azure-stack/).

```go
con := armcore.NewDefaultConnection(cred, nil)
```

## Creating a Resource Management Client

Once you have a connection to the Azure Resource Manager, create a client to connect to the desired Azure service.

For example, let's say you want to connect to the [Azure Compute](https://azure.microsoft.com/product-categories/compute/) service. The [Compute module](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute@v0.1.0) consist of one or more clients. A client groups a set of related APIs, providing access to its functionality within the specified subscription. You create one or more clients to access the APIs you require using an `armcore.Connection` object.

In the following code snippet, the [armcompute.NewVirtualMachinesClient type](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute@v0.1.0#VirtualMachinesClient) is used to create a client to manage virtual machines:

```go
client := armcompute.NewVirtualMachinesClient(con, "<subscription ID>")
```

The same pattern is used to connect with other Azure services. For example, install the [armnetwork](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/network/armnetwork) module and create a [VirtualNetwork](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/network/armnetwork#VirtualNetworksClient) client to manage virtual network (VNET) resources.

```go
client := armnetwork.NewVirtualNetworksClient(acon, "<subscription ID>")
```

## Using the Azure SDK for Go reference documentation

Once instantiated, clients are used to make API calls against your Azure resources. For resource management scenarios, most of the use-cases are CRUD (Create/Read/Update/Delete) operations.

To look up types, parameters, and the response body for a given operation, you can:

1. Browse to the [Azure SDK for Go reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk).
1. Search the page for the desired type. (Pressing **&lt;F>** automatically expands all nodes on the page for searching.)
1. Select the module.
1. Search the module's page for the desired type.
1. Read the type's description and information about its usage in your Go code.

You can also manually build the URL by appending the name of the module to `github.com/Azure/azure-sdk-for-go/sdk/`. 

For example, if you're looking for the `compute/armcompute` reference documentation, the URL is `github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute`.

The following example shows how to find the reference documentation for Azure resource group operations:

1. You know you want to work with resource groups, but don't know the name of the library or module.
1. You browse to the main [Azure SDK for Go reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk) page.
1. You click **&lt;F>** and enter `resource`. Since you're searching for a module, you know that no spaces are allowed.
1. As you type the search term, you see a close match with the [resource/armresources](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resources/armresources) module.
1. You select the appropriate module for your application.
1. You now either read through "Getting Started" sections or search for the specific operation.
1. For example, searching for the term "create" (if you want to create a resource group) leads you to the [CreateOrUpdate function](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resources/armresources#ResourceGroupsClient.CreateOrUpdate).
1. At this point, you can read how to make the API call to create an Azure resource group.

## Long-running operations

As some operations can take a long time to complete, the Management Libraries contain functions to support long-running operations (LRO) via asynchronous calls. These function names start with `Begin`. Examples of this pattern are `BeginCreate` and `BeginDelete`. 

As these functions are asynchronous, your code doesn't block until the function finishes its task. Instead, the function returns a *poller* object immediately. Your code then calls a synchronous poller function that returns when the original asynchronous function has completed.

The following code snippet shows an example of this pattern.

```go
// Call an asynchronous function to create a client. The return value is a poller object.
poller, err := client.BeginCreate(context.Background(), "resource_identifier", "additonal_parameter")
if err != nil {
	// handle error...
}

// Call the poller object's PollUntilDone function that will block until the poller object
// has been updated to indicate the task has completed.
resp, err = poller.PollUntilDone(context.Background(), 5*time.Second)
if err != nil {
	// handle error...
}

// Print the fact that the LRO completed.
fmt.Printf("LRO done")

// Work with the response ("resp") object.
```

**Key points:**

- The `PollUntilDone` function requires a polling interval that specifies how often it should try to get the status.
- The interval is typically short. Refer to the documentation for the specific Azure resource for best practices and recommended intervals.
- The [LRO section of the Go Azure SDK Design Guidelines page](https://azure.github.io/azure-sdk/golang_introduction.html#methods-invoking-long-running-operations) has a move advanced example and general guidelines for LRO.

## Next steps

> [!div class="nextstepaction"]
> [Manage Azure resource groups](manage-resource-groups.md)
