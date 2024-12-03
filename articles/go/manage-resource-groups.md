---
title: Manage resource groups with the Azure SDK for Go
description: In this article, you learn how to create a resource group with the Azure SDK for Go Management Library.
ms.date: 08/05/2024
ms.topic: quickstart
ms.custom: devx-track-go, mode-api
---

# Manage resource groups with the Azure SDK for Go

In this article, you learn how to create and manage a resource group with the Azure SDK for Go management library.

## 1. Set up Azure resources

To complete the steps in this article, you need the following Azure resources and identifiers:

[!INCLUDE [configure-environment.md](includes/configure-environment.md)]

Before moving on to the next section, make sure you've noted down your subscription ID (Guid), tenant ID (Guid), and the client/application ID (Guid) and secret for your service principal.

## 2. Set up authentication

Choose an authentication method which suits your needs. We offer multiple credential-free authentication methods for apps hosted in server and local environments. [Authenticate Go apps to Azure services by using the Azure SDK for Go](sdk/authentication-overview.md) article will help you decide which authentication mechanism is the best fit for your scenario.

## 3. Create a resource group

1. Create a directory in which to test and run the sample Go code and make it the current directory.

1. Run [go mod init](https://go.dev/ref/mod#go-mod-init) to create a module in the current directory.

    ```console
    go mod init <module_path>
    ```

    **Key points:**

    - The `<module_path>` parameter is generally a location in a GitHub repo - such as `github.com/<your_github_account_name>/<directory>`.
    - When you're creating a command-line app as a test and won't publish the app, the `<module_path>` doesn't need to refer to an actual location.

1. Run [go get](https://go.dev/ref/mod#go-get) to download, build, and install the necessary Azure SDK for Go modules.

    ```console
    go get github.com/Azure/azure-sdk-for-go/sdk/azcore
    go get github.com/Azure/azure-sdk-for-go/sdk/azcore/to
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources
    ```

    > [!IMPORTANT]
    > The packages for the current version of the Azure resource management libraries are located in `sdk/**/arm**`. The packages for the previous version of the management libraries are located under [`/services`](https://github.com/Azure/azure-sdk-for-go/tree/legacy/services). If you're using the older version, see the [Azure SDK for Go Migration Guide](https://aka.ms/azsdk/go/mgmt/migration).

1. Create a file named `main.go` and add the following code. Each section of code is commented to explain its purpose.

    ```go
    package main

    // Import key modules.
    import (
    	"context"
    	"log"
    	"os"

    	"github.com/Azure/azure-sdk-for-go/sdk/azcore"
    	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
    )

    // Define key global variables.
    var (
    	subscriptionId    = "<your_subscription_id>"
    	location          = "<your_region>"
    	resourceGroupName = "<your_resource_group_name>" // !! IMPORTANT: Change this to a unique name in your subscription.
    	ctx               = context.Background()
    )

    // Define the function to create a resource group.
    func createResourceGroup(subscriptionId string, credential azcore.TokenCredential) (armresources.ResourceGroupsClientCreateOrUpdateResponse, error) {
    	rgClient, _ := armresources.NewResourceGroupsClient(subscriptionId, credential, nil)

    	param := armresources.ResourceGroup{
    		Location: to.Ptr(location),
    	}

    	return rgClient.CreateOrUpdate(ctx, resourceGroupName, param, nil)
    }

    // Define the standard 'main' function for an app that is called from the command line.
    func main() {

    	// Create a credentials object.
    	cred, err := azidentity.NewDefaultAzureCredential(nil)
    	if err != nil {
    		log.Fatalf("Authentication failure: %+v", err)
    	}

    	// Call your function to create an Azure resource group.
    	resourceGroup, err := createResourceGroup(subscriptionId, cred)
    	if err != nil {
    		log.Fatalf("Creation of resource group failed: %+v", err)
    	}

    	// Print the name of the new resource group.
    	log.Printf("Resource group %s created", *resourceGroup.ResourceGroup.ID)
    }
    ```

    **Key points:**

    - The `subscriptionId` value is retrieved from the `AZURE_SUBSCRIPTION_ID` environment variable.
    - The `location` and `resourceGroupName` strings are set to test values. If necessary, change those values to something appropriate for your location and subscription.

1. Run [go mod tidy](https://go.dev/ref/mod#go-mod-tidy) to clean up the dependencies in the `go.mod` file based on your source code.

    ```console
    go mod tidy
    ```

1. Run [`go run`](https://pkg.go.dev/cmd/go/internal/run) to build and run the app.

    ```console
    go run .
    ```

## 4. Verify the results

#### [Azure portal](#tab/azure-portal)

1. Browse to the [Azure portal](https://portal.azure.com).

1. Sign in and select your Azure subscription.

1. In the left menu, select **Resource groups**.

1. The new resource group is listed among your Azure subscription's resource groups.

#### [Azure CLI](#tab/azure-cli)

Run [az group show](/cli/azure/group#az-group-show) to display the resource group.

```azurecli
az group show --name <resource_group>
```

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

```azurepowershell
Get-AzResourceGroup -Name <resource_group>
```

---

## 5. Update a resource group

1. Return to your `main.go` file.

1. Insert the following code just above the `main` function.

    ```go
    // Update the resource group by adding a tag to it.
    func updateResourceGroup(subscriptionId string, credential azcore.TokenCredential) (armresources.ResourceGroupsClientUpdateResponse, error) {
        rgClient, _ := armresources.NewResourceGroupsClient(subscriptionId, credential, nil)

        update := armresources.ResourceGroupPatchable{
            Tags: map[string]*string{
                "new": to.Ptr("tag"),
            },
        }
        return rgClient.Update(ctx, resourceGroupName, update, nil)
    }
    ```

After you've added the code, move on to the next section. You run the code in a later section.

## 6. List an Azure subscription's resource groups

1. Return to your `main.go` file.

1. Insert the following code just above the `main` function.

    ```go
    // List all the resource groups of an Azure subscription.
    func listResourceGroups(subscriptionId string, credential azcore.TokenCredential) ([]*armresources.ResourceGroup, error) {
        rgClient, _ := armresources.NewResourceGroupsClient(subscriptionId, credential, nil)

        pager := rgClient.NewListPager(nil)

        var resourceGroups []*armresources.ResourceGroup
        for pager.More() {
            resp, err := pager.NextPage(ctx)
            if err != nil {
                return nil, err
            }
            if resp.ResourceGroupListResult.Value != nil {
                resourceGroups = append(resourceGroups, resp.ResourceGroupListResult.Value...)
            }
        }
        return resourceGroups, nil
    }
    ```

After you've added the code, move on to the next section. You run the code in a later section.

## 7. Delete a resource group

1. Return to your `main.go` file.

1. Insert the following code just above the `main` function.

    ```go
    // Delete a resource group.
    func deleteResourceGroup(subscriptionId string, credential azcore.TokenCredential) error {
        rgClient := armresources.NewResourceGroupsClient(subscriptionId, credential, nil)

        poller, err := rgClient.BeginDelete(ctx, resourceGroupName, nil)
        if err != nil {
            return err
        }
        if _, err := poller.PollUntilDone(ctx, nil); err != nil {
            return err
        }
        return nil
    }
    ```

After you've added the code, move on to the next section. You run the code in a later section.

## 8. Update the main function

In previous sections, you added code to `main.go` to create, update, and delete a resource group. You also added code to list all the resource groups in an Azure subscription. To run all these functions sequentially:

1. In `main.go`, replace the `main` function with the following code:

    ```go
    func main() {
    
        // Create a credentials object.
        cred, err := azidentity.NewDefaultAzureCredential(nil)
        if err != nil {
            log.Fatalf("Authentication failure: %+v", err)
        }
    
        // Call your function to create an Azure resource group.
        resourceGroup, err := createResourceGroup(subscriptionId, cred)
        if err != nil {
            log.Fatalf("Creation of resource group failed: %+v", err)
        }
        // Print the name of the new resource group.
        log.Printf("Resource group %s created", *resourceGroup.ResourceGroup.ID)
    
        // Call your function to add a tag to your new resource group.
        updatedRG, err := updateResourceGroup(subscriptionId, cred)
        if err != nil {
            log.Fatalf("Update of resource group failed: %+v", err)
        }
        log.Printf("Resource Group %s updated", *updatedRG.ResourceGroup.ID)
    
        // Call your function to list all the resource groups.
        rgList, err := listResourceGroups(subscriptionId, cred)
        if err != nil {
            log.Fatalf("Listing of resource groups failed: %+v", err)
        }
        log.Printf("Your Azure subscription has a total of %d resource groups", len(rgList))
    
        // Call your function to delete the resource group you created.
        if err := deleteResourceGroup(subscriptionId, cred); err != nil {
            log.Fatalf("Deletion of resource group failed: %+v", err)
        }
        log.Printf("Resource group deleted")
    }
    ```

1. Run the code and observe the output.

    ```console
    go run .
    ```

    ```output
    2024/07/31 15:29:06 Resource group /subscriptions/<subscription ID>/resourceGroups/myResourceGroup created
    2024/07/31 15:29:07 Resource Group /subscriptions/<subscription ID>/resourceGroups/myResourceGroup updated
    2024/07/31 15:29:07 Your Azure subscription has a total of 8 resource groups
    2024/07/31 15:30:25 Resource group deleted
    ```

    > [!NOTE]
    > Deleting the resource group may take a few minutes.

[!INCLUDE [troubleshooting.md](includes/troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using the Azure SDK for Go](/azure/go)
