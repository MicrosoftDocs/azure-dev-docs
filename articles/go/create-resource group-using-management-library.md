---
title: Create a resource group with the Azure SDK for Go Management Library
description: In this article, you learn how to create a resource group with the Azure SDK for Go Management Library.
ms.date: 08/09/2021
ms.topic: quickstart
ms.custom: devx-track-go
---

# Create a resource group with the Azure SDK for Go Management Library

As explained in the article [What is the Azure SDK for Go?](overview.md), the Azure SDK for Go contains a set of management and client libraries.
The management libraries share many features such as Azure Identity support, HTTP pipeline, and error-handling.
You can find the full list of the management libraries on the [Azure SDK for Go package page](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk).

In this article, you will learn how to authenticate to Azure and start interacting with Azure resources. There are several possible approaches to
authentication. This document illustrates the most common scenario.

> [!IMPORTANT]
> The packages for the current version of the Azure resource management libraries are located in `sdk/**/arm**`. The packages for the previous version of the management libraries are located under [`/services`](https://github.com/Azure/azure-sdk-for-go/tree/main/services). If you're using the older version, see the [this Azure SDK for Go Migration Guide](https://aka.ms/azsdk/go/mgmt/migration).

## Configure your environment

- **Azure subscription:** If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Get authentication values

1. [Get the Azure subscription ID](/azure/media-services/latest/setup-azure-subscription-how-to?tabs=portal).

1. [Get the Azure Active Directory tenant ID](/azure/active-directory/fundamentals/active-directory-how-to-find-tenant).

1. [Create a service principal](/azure/active-directory/develop/howto-create-service-principal-portal). Note the service principal's application (client) ID and secret.

## Set environment variables

Once you have a service principal, you can specify its credentials to authenticate the library to Azure.

#### [Bash](#tab/bash)

1. Edit the `~/.bashrc` file by adding the following environment variables. Replace the placeholders with the appropriate values from the previous section.

    ```bash
    export ARM_SUBSCRIPTION_ID="<azure_subscription_id>"
    export ARM_TENANT_ID="<active_directory_tenant_id"
    export ARM_CLIENT_ID="<service_principal_appid>"
    export ARM_CLIENT_SECRET="<service_principal_password>"
    ```

1. To execute the `~/.bashrc` script, run `source ~/.bashrc` (or its abbreviated equivalent `. ~/.bashrc`).

    ```bash
    . ~/.bashrc
    ```

1. Once the environment variables have been set, you can verify their values as follows:

    ```bash
    printenv | grep ^ARM*
    ```

#### [Windows](#tab/windows)

Add the following environment variables to your Windows system with their appropriate values from the previous section.

- ARM_SUBSCRIPTION_ID
- ARM_TENANT_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET

## Install the packages

This example project presented later in this article uses Go modules for versioning and dependency management.

Install a Go package is done by running `go get <package>`.

For example, to install the `armcompute` package, you include the following in your Go code:

```go
go get github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute
```

In most Go apps, you will install the following packages for authentication and core functionality:

- github.com/Azure/azure-sdk-for-go/sdk/armcore
- github.com/Azure/azure-sdk-for-go/sdk/azcore
- github.com/Azure/azure-sdk-for-go/sdk/azidentity
- github.com/Azure/azure-sdk-for-go/sdk/to

## Authenticate to Azure

Before you can create a client to run code against an Azure subscription, you need to authenticate to Azure. The `azidentity` module provides facilities for various ways of authenticating with Azure including client/secret, certificate, and managed identity.

The default authentication option is **DefaultAzureCredential**, which uses the environment variables set earlier in this article. In your Go code, you'll create an `azidentity` object as follows:

```go
cred, err := azidentity.NewDefaultAzureCredential(nil)
```

For more details on how authentication works in `azidentity`, see [Azure Identity Client Module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity).

## Connect to Azure

Once you have a credential - such as an `azidentity` object - you create a connection to the desired Azure Resource Management endpoint. The `armcore` module provides facilities for connecting with ARM endpoints including public and sovereign clouds as well as Azure Stack.

```go
con := armcore.NewDefaultConnection(cred, nil)
```

For more information on ARM connections, please see the documentation for `armcore` at [pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/armcore](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/armcore).

Creating a Resource Management Client


Once you have a connection to ARM, you will need to decide what service to use and create a client to connect to that service. In this section, we will use `Compute` as our target service. The Compute modules consist of one or more clients. A client groups a set of related APIs, providing access to its functionality within the specified subscription. You will need to create one or more clients to access the APIs you require using your `armcore.Connection`.

To show an example, we will create a client to manage Virtual Machines. The code to achieve this task would be:

```go
client := armcompute.NewVirtualMachinesClient(con, "<subscription ID>")
```
You can use the same pattern to connect with other Azure services that you are using. For example, in order to manage Virtual Network resources, you would install the Network package and create a `VirtualNetwork` Client:

```go
client := armnetwork.NewVirtualNetworksClient(acon, "<subscription ID>")
```

Interacting with Azure Resources


Now that we are authenticated and have created our sub-resource clients, we can use our client to make API calls. For resource management scenarios, most of our cases are centered around creating / updating / reading / deleting Azure resources. Those scenarios correspond to what we call "operations" in Azure. Once you are sure of which operations you want to call, you can then implement the operation call using the management client we just created in previous section.

To write the concrete code for the API call, you might need to look up the information of request parameters, types, and response body for a certain opertaion. We recommend using the following site for SDK reference:

- [Official Go docs for new Azure Go SDK packages](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk) - This web-site contains the complete SDK references for each released package as well as embedded code snippets for some operation

To see the reference for a certain package, you can either click into each package on the web-site, or directly add the SDK path to the end of URL. For example, to see the reference for Azure Compute package, you can use [https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/compute/armcompute). Certain development tool or IDE has features that allow you to directly look up API definitions as well.

Let's illustrate the SDK usage by a few quick examples. In the following sample. we are going to create a resource group using the SDK. To achieve this scenario, we can take the follow steps

- **Step 1** : Decide which client we want to use, in our case, we know that it's related to Resource Group so our choice is the [ResourceGroupsClient](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resources/armresources#ResourceGroupsClient)
- **Step 2** : Find out which operation is responsible for creating a resource group. By locating the client in previous step, we are able to see all the functions under `ResourceGroupsClient`, and we can see [the `CreateOrUpdate` function](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/resources/armresources#ResourceGroupsClient.CreateOrUpdate) is what need. 
- **Step 3** : Using the information about this operation, we can then fill in the required parameters, and implement it using the Go SDK. If we need extra information on what those parameters mean, we can also use the [Azure service documentation](https://docs.microsoft.com/azure/?product=featured) on Microsoft Docs

Let's show our what final code looks like

Example: Creating a Resource Group


***Import the packages***
```go
import {
    "github.com/Azure/azure-sdk-for-go/sdk/armcore"
    "github.com/Azure/azure-sdk-for-go/sdk/resources/armresources"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    "github.com/Azure/azure-sdk-for-go/sdk/to"
}
```

***Define some global variables***
```go
var (
	ctx               = context.Background()
	subscriptionId    = os.Getenv("AZURE_SUBSCRIPTION_ID")
	location          = "westus2"
	resourceGroupName = "resourceGroupName"
)
```

***Write a function to create a resource group***
```go
func createResourceGroup(ctx context.Context, connection *armcore.Connection) (armresources.ResourceGroupResponse, error) {
	rgClient := armresources.NewResourceGroupsClient(connection, subscriptionId)

	param := armresources.ResourceGroup{
		Location: to.StringPtr(location),
	}

	return rgClient.CreateOrUpdate(context.Backgroud(), resourceGroupName, param, nil)
}
```

***Invoking the `createResourceGroup` function in main***
```go
func main() {
    cred, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        log.Fatalf("authentication failure: %+v", err)
    }
    conn := armcore.NewDefaultConnection(cred, &armcore.ConnectionOptions{
        Logging: azcore.LogOptions{
            IncludeBody: true,
        },
    })
    
    resourceGroup, err := createResourceGroup(ctx, conn)
    if err != nil {
        log.Fatalf("cannot create resource group: %+v", err)
    }
    log.Printf("Resource Group %s created", *resourceGroup.ID)
}
```

Let's demonstrate management client's usage by showing additional samples

Example: Managing Resource Groups


***Update a resource group***

```go
func updateResourceGroup(ctx context.Context, connection *armcore.Connection) (armresources.ResourceGroupResponse, error) {
    rgClient := armresources.NewResourceGroupsClient(connection, subscriptionId)
    
    update := armresources.ResourceGroupPatchable{
        Tags: map[string]*string{
            "new": to.StringPtr("tag"),
        },
    }
    return rgClient.Update(ctx, resourceGroupName, update, nil)
}
```

***List all resource groups***

```go
func listResourceGroups(ctx context.Context, connection *armcore.Connection) ([]*armresources.ResourceGroup, error) {
    rgClient := armresources.NewResourceGroupsClient(connection, subscriptionId)
    
    pager := rgClient.List(nil)
    
    var resourceGroups []*armresources.ResourceGroup
    for pager.NextPage(ctx) {
        resp := pager.PageResponse()
        if resp.ResourceGroupListResult != nil {
            resourceGroups = append(resourceGroups, resp.ResourceGroupListResult.Value...)
        }
    }
    return resourceGroups, pager.Err()
}
```

***Delete a resource group***

```go
func deleteResourceGroup(ctx context.Context, connection *armcore.Connection) error {
    rgClient := armresources.NewResourceGroupsClient(connection, subscriptionId)
    
    poller, err := rgClient.BeginDelete(ctx, resourceGroupName, nil)
    if err != nil {
        return err
    }
    if _, err := poller.PollUntilDone(ctx, interval); err != nil {
        return err
    }
    return nil
}
```

***Invoking the update, list and delete of resource group in the main function***
```go
func main() {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("authentication failure: %+v", err)
	}
	conn := armcore.NewDefaultConnection(cred, &armcore.ConnectionOptions{
		Logging: azcore.LogOptions{
			IncludeBody: true,
		},
	})


    resourceGroup, err := createResourceGroup(ctx, conn)
    if err != nil {
        log.Fatalf("cannot create resource group: %+v", err)
    }
    log.Printf("Resource Group %s created", *resourceGroup.ID)

	updatedRG, err := updateResourceGroup(ctx, conn)
	if err != nil {
        log.Fatalf("cannot update resource group: %+v", err)
	}
	log.Printf("Resource Group %s updated", *updatedRG.ID)

	rgList, err := listResourceGroups(ctx, conn)
	if err != nil {
        log.Fatalf("cannot list resource group: %+v", err)
	}
	log.Printf("We totally have %d resource groups", len(rgList))

	if err := deleteResourceGroup(ctx, conn); err != nil {
        log.Fatalf("cannot delete resource group: %+v", err)
	}
	log.Printf("Resource Group deleted")
})
```

Example: Managing Virtual Machines

In addition to resource groups, we will also use Virtual Machine as an example and show how to manage how to create a Virtual Machine which involves three Azure services (Resource Group, Network and Compute)

Due to the complexity of this scenario, please [click here](https://aka.ms/azsdk/go/mgmt/samples) for the complete sample.

Long Running Operations

In the samples above, you might notice that some operations has a ``Begin`` prefix (for example, ``BeginDelete``). This indicates the operation is a Long-Running Operation (In short, LRO). For resource managment libraries, this kind of operation is quite common since certain resource operations may take a while to finish. When you need to use those LROs, you will need to use a poller and keep polling for the result until it is done. To illustrate this pattern, here is an example

```go
poller, err := client.BeginCreate(context.Background(), "resource_identifier", "additonal_parameter")
if err != nil {
	// handle error...
}
resp, err = poller.PollUntilDone(context.Background(), 5*time.Second)
if err != nil {
	// handle error...
}
fmt.Printf("LRO done")
// dealing with `resp`
```
Note that you will need to pass a polling interval to ```PollUntilDone``` and tell the poller how often it should try to get the status. This number is usually small but it's best to consult the [Azure service documentation](https://docs.microsoft.com/azure/?product=featured) on best practices and recommdend intervals for your specific use cases.

For more advanced usage of LRO and design guidelines of LRO, please visit [this documentation here](https://azure.github.io/azure-sdk/golang_introduction.html#methods-invoking-long-running-operations)

## Code Samples

More code samples for using the management library for Go SDK can be found in the following locations
- [Go SDK Code Samples](https://aka.ms/azsdk/go/mgmt/samples)
- Example files under each package. For example, examples for Network packages can be [found here](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/network/armnetwork/example_networkinterfaces_test.go)

Need help?
----------

-   File an issue via [Github
    Issues](https://github.com/Azure/azure-sdk-for-go/issues)
-   Check [previous
    questions](https://stackoverflow.com/questions/tagged/azure+go)
    or ask new ones on StackOverflow using azure and Go tags.

Contributing
------------

For details on contributing to this repository, see the contributing
guide.

This project welcomes contributions and suggestions. Most contributions
require you to agree to a Contributor License Agreement (CLA) declaring
that you have the right to, and actually do, grant us the rights to use
your contribution. For details, visit <https://cla.microsoft.com>.

When you submit a pull request, a CLA-bot will automatically determine
whether you need to provide a CLA and decorate the PR appropriately
(e.g., label, comment). Simply follow the instructions provided by the
bot. You will only need to do this once across all repositories using
our CLA.

This project has adopted the Microsoft Open Source Code of Conduct. For
more information see the Code of Conduct FAQ or contact
<opencode@microsoft.com> with any additional questions or comments.

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Go](/.)