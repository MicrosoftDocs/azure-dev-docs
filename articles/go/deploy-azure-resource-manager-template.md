---
title: Deploy an Azure Resource Manage Template with the Azure SDK for Go
description: In this tutorial, you learn how to use the Azure SDK for Go to deploy an Azure Resource Manager template.
ms.topic: how-to
ms.date: 12/16/2025
ms.custom: devx-track-go, devx-track-arm-template
---

# Deploy an Azure Resource Manager template by using the Azure SDK for Go

In this tutorial, you use the Azure SDK for Go to deploy an Azure Resource Manager template.

Azure Resource Manager is the deployment and management service for Azure. It enables you to create, update, and delete resources in your Azure account. Azure Resource Manager templates declaratively describe your infrastructure as code in JSON documents.

By the end of this tutorial, you write and deploy an Azure Resource Manager template by using Go.

<!-- Screenshot of ARM template & Go code in VS Code -->

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- [Go version 1.18 or above](https://go.dev/dl/)
- [Azure CLI](/cli/azure/install-azure-cli)

## Create a new module

In this section, you create a new Go module and install the required Azure SDK packages. You then create the main application file and add code that deploys an Azure Resource Manager template.

1. Create a new directory named `deployARM-how-to`. Then change into that directory.

    ```bash
    mkdir deployARM-how-to
    cd deployARM-how-to
    ```

1. Run the `go mod init` command to create the `go.mod` and `go.sum` files.

    ```bash
    go mod init deployARM-how-to
    ```

1. The Azure SDK for Go contains several packages for working with Azure. For this tutorial, you need the `azcore/to`, `azidentity`, and `armresources` packages.

    Run the `go get` command to download these packages:

    ```bash
    go get github.com/Azure/azure-sdk-for-go/sdk/azcore/to
    go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
    go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources
    ```

1. Create a file named `main.go`.

    ```bash
    touch main.go
    ```

1. Open `main.go` in your editor and add the following code that authenticates to Azure, creates a resource group, and deploys an Azure Resource Manager template:

    ```go
    package main
    
    import (
    	"context"
    	"encoding/json"
    	"fmt"
    	"log"
    	"os"
    
    	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
    	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
    	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
    )
    
    const (
    	resourceGroupName     = "deployARM-how-to"
    	resourceGroupLocation = "eastus"
    	deploymentName        = "deployARM-how-to"
    	templateFile          = "template.json"
    )
    
    var (
    	ctx = context.Background()
    )

    // Read a JSON file from the given path.

    func readJSON(path string) (map[string]interface{}, error) {
    	data, err := os.ReadFile(path)
    	if err != nil {
    		log.Fatalf("failed to read file: %v", err)
    	}
    	contents := make(map[string]interface{})
    	_ = json.Unmarshal(data, &contents)
    	return contents, nil
    }
    
    func main() {
    	subscriptionId := os.Getenv("AZURE_SUBSCRIPTION_ID")

    	// Authenticate to Azure
    
    	cred, err := azidentity.NewDefaultAzureCredential(nil)
    	if err != nil {
    		log.Fatalf("failed to obtain a credential: %v", err)
    	}
    
		// Create a resource group.
    
    	client, err := armresources.NewResourceGroupsClient(subscriptionId, cred, nil)
    	if err != nil {
    		log.Fatalf("failed to create client: %v", err)
    	}
    	resp, err := client.CreateOrUpdate(context.Background(), resourceGroupName, armresources.ResourceGroup{
    		Location: to.Ptr(resourceGroupLocation),
    	}, nil)
    	if err != nil {
    		log.Fatalf("failed to obtain a response: %v", err)
    	}
    	log.Printf("resource group ID: %s\n", *resp.ResourceGroup.ID)
    
    	// Read the template file.
    
    	template, err := readJSON(templateFile)
    	if err != nil {
    		return
    	}
    
    	// Deploy the Azure Resource Manager template.
    
    	deploymentsClient, err := armresources.NewDeploymentsClient(subscriptionId, cred, nil)
    	if err != nil {
    		log.Fatalf("failed to create client: %v", err)
    	}
    	deploy, err := deploymentsClient.BeginCreateOrUpdate(
    		ctx,
    		resourceGroupName,
    		deploymentName,
    		armresources.Deployment{
    			Properties: &armresources.DeploymentProperties{
    				Template: template,
    				Mode:     to.Ptr(armresources.DeploymentModeIncremental),
    			},
    		},
    		nil,
    	)
    	if err != nil {
    		log.Fatalf("failed to deploy template: %v", err)
    	}
    
    	fmt.Println(deploy)
    }
    ```

## Create the Azure Resource Manager template

1. In the `deployARM-how-to` directory, create another file named `template.json`.

1. Open the `template.json` file and add the following Azure Resource Manager template code that creates an Azure storage account:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
        },
        "functions": [],
        "variables": {},
        "resources": [{
            "name": "<StorageAccountName>",
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2021-04-01",
            "tags": {
                "displayName": "<StorageAccountDisplayName>"
            },
            "location": "EastUS",
            "kind": "StorageV2",
            "sku": {
                "name": "Premium_LRS",
                "tier": "Premium"
            }
        }],
        "outputs": {}
    }
    ```

1. Replace `<StorageAccountName>` and `<StorageAccountDisplayName>` with a [valid storage name value](/azure/storage/common/storage-account-overview).

For more information about Azure Resource Manager templates, see [Azure Resource Manager templates overview](/azure/azure-resource-manager/templates/overview).

## Sign in to Azure

The code in this article uses the [DefaultAzureCredential](./sdk/authentication/credential-chains.md#defaultazurecredential-overview) type from the Azure Identity module for Go to authenticate to Azure. `DefaultAzureCredential` supports many credential types for authentication with Azure using OAuth with Microsoft Entra ID. In this article, you use the user credentials that you sign in to the Azure CLI with.

If you haven't already, sign in to the Azure CLI:

```azurecli
az login
```

If multiple subscriptions are associated with your account, use the [az account list](/cli/azure/account#az-account-list) command to get a list of those subscriptions. Use the [az account set](/cli/azure/account#az-account-set) command to set the active subscription. By setting the active subscription, you ensure that any CLI commands you run in the rest of this article run against your intended subscription.

> [!NOTE]
> When running locally, `DefaultAzureCredential` also supports Azure Developer CLI (AZD) sign-in credentials or an Azure service principal that you configure in environment variables. To learn more about all the supported credential types, see [Azure authentication with the Azure Identity module for Go](azure-sdk-authentication.md).

## Run the application

Before you can deploy the template, you need to define your Azure subscription ID as an environment variable.

1. To get the subscription ID, run the following [az account show](/cli/azure/account#az-account-show) command.

    ```azurecli
    az account show --query id --output tsv
    ```

1. Set the `AZURE_SUBSCRIPTION_ID` environment variable with your subscription ID. Replace `<AzureSubscriptionId>` with your subscription ID.

    ```azurecli
    export AZURE_SUBSCRIPTION_ID=<AzureSubscriptionId>
    ```

1. Run the `go run` command to deploy the template:

    ```azurecli
    go run main.go
    ```

## Troubleshoot

If the storage account deployment fails, verify you used a [valid storage name value](/azure/storage/common/storage-account-overview#storage-account-endpoints). Storage account names must be between 3 and 24 characters in length and can contain only lowercase letters and numbers.

If the program returns an error related to authentication or authorization, check the following items:

- If the error begins with a timestamp and the following text: "failed to obtain a response: DefaultAzureCredential: failed to acquire a token.", make sure that you signed in to the Azure CLI as instructed previously.

- If the error is an authorization or forbidden error (status code 401 or 403), make sure your user account is in an Azure role that gives it rights to create resource groups and add resources on your subscription. Examples include the *Contributor* or *Owner* [Azure built-in roles](/azure/role-based-access-control/built-in-roles). To learn how to assign Azure roles to your user, see [Assign Azure roles using Azure CLI](/azure/role-based-access-control/role-assignments-cli).

For more detailed troubleshooting guidance, see [Troubleshoot Azure Identity authentication issues](https://github.com/Azure/azure-sdk-for-go/blob/main/sdk/azidentity/TROUBLESHOOTING.md).

## Verify the resources on Azure

You can use several Azure CLI commands to verify that the resources were successfully created on Azure. The following commands are some examples.

To verify that the resource group exists, run the [az group exists](/cli/azure/group#az-group-exists) command.

```azurecli
az group exists --name deployARM-how-to
```

You can list the resources in the group by using the [az resource list](/cli/azure/resource#az-resource-list) command.

```azurecli
az resource list --resource-group deployARM-how-to
```

You can examine the deployment results (outputResources) and properties by using the [az deployment group show](/cli/azure/deployment/group#az-deployment-group-show) command.

```azurecli
az deployment group show -g deployARM-how-to -n deployARM-how-to
```

## Clean up resources

Resources in Azure can incur ongoing charges. Be sure to clean up the resources you created in this article.

Deploying an empty template in complete mode deletes all the resources within a resource group. It's a neat way to clean up resources without deleting the resource group itself.

1. Create a new empty template named `empty-template.json`.

1. Open `empty-template.json` in your editor and add the following code:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-08-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [],
        "outputs": {}
    }
    ```

1. Open your `main.go` file.

1. Update the `templateFile` constant value to `empty-template.json`.

    ```go
    const (
    	resourceGroupName     = "deployARM-how-to"
    	resourceGroupLocation = "eastus"
    	deploymentName        = "deployARM-how-to"
    	templateFile          = "empty-template.json"
    )
    ```

1. Change the deployment time from *incremental* to *complete* by changing the deployment *Mode* properties to `DeploymentModeComplete`. To learn more about deployment modes, see [Azure Resource Manager deployment modes](/azure/azure-resource-manager/templates/deployment-modes).

    ```go
    deploy, err = deploymentsClient.BeginCreateOrUpdate(
    	ctx,
    	resourceGroupName,
    	deploymentName,
    	armresources.Deployment{
    		Properties: &armresources.DeploymentProperties{
    			Template: template,
    			Mode:     to.Ptr(armresources.DeploymentModeComplete), //Deployment Mode is here
    		},
    	},
    	nil,
    )
    ```

1. Run the `go run` command to deploy the empty template and delete the storage account you created previously.

    ```azurecli
    go run main.go
    ```

Instead of using a deployment, you can delete the resource group and all its resources by running the following Azure CLI command:

```azurecli
az group delete --resource-group deployARM-how-to
```

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Go Core Concepts](azure-sdk-core-concepts.md)

> [!div class="nextstepaction"]
> [Azure SDK for Go management libraries](management-libraries.md)
