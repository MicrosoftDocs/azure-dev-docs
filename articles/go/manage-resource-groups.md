---
title: Manage resource groups with the Azure SDK for Go Management Library
description: In this article, you learn how to create a resource group with the Azure SDK for Go Management Library.
ms.date: 08/10/2021
ms.topic: quickstart
ms.custom: devx-track-go
---

# Manage resource groups with the Azure SDK for Go Management Library

> [!IMPORTANT]
> The packages for the current version of the Azure resource management libraries are located in `sdk/**/arm**`. The packages for the previous version of the management libraries are located under [`/services`](https://github.com/Azure/azure-sdk-for-go/tree/main/services). If you're using the older version, see the [this Azure SDK for Go Migration Guide](https://aka.ms/azsdk/go/mgmt/migration).

## 1. Configure your environment

- **Azure subscription:** If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## 2. Get authentication values

1. [Get the Azure subscription ID](/azure/media-services/latest/setup-azure-subscription-how-to?tabs=portal).

1. [Get the Azure Active Directory tenant ID](/azure/active-directory/fundamentals/active-directory-how-to-find-tenant).

1. [Create a service principal](/azure/active-directory/develop/howto-create-service-principal-portal). Note the service principal's application (client) ID and secret.

## 3. Set environment variables

Using your Azure authentication information, set the appropriate environment variables so that your code can authenticate to Azure.

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
