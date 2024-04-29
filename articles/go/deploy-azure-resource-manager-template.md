---
title: Deploy an Azure Resource Manage Template with the Azure SDK for Go
description: In this tutorial, you learn how to use the Azure SDK for Go to deploy an Azure Resource Manager template.
ms.topic: how-to
ms.date: 12/20/2021
ms.custom: devx-track-go, devx-track-arm-template
---

# Deploy an Azure Resource Manage Template with the Azure SDK for Go

In this tutorial, you use the Azure SDK for Go to deploy an Azure Resource Manager template.

Azure Resource Manager is the deployment and management service for Azure. It enables you to create, update, and delete resources in your Azure account. Azure Resource Manager templates declaratively describe your infrastructure as code in JSON documents.

By the end of this tutorial, you'll have written and deployed an Azure Resource Manager template using Go.

<!-- Screenshot of ARM template & Go code in VS Code -->

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.18 or [above](https://go.dev/dl/)

## Create a new module

Create a new directory called `deployARM-how-to`. Then change into that directory.

```azurecli
mkdir deployARM-how-to
cd deployARM-how-to
```

Run the `go mod init` command to create the `go.mod` and `go.sum` files.

```azurecli
go mod init deployARM-how-to
```

The Azure SDK for Go contains several packages for working with Azure, for this tutorial you need the `azcore/to`, `azidentity`, and `armresources` packages.

Run the `go get` command to download these packages:

```azurecli
go get github.com/Azure/azure-sdk-for-go/sdk/azcore/to
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources
```

Next create a file named `main.go`

```azurecli
touch main.go
```

Open your `main.go` in your editor and add the following code:

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

	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}
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

	template, err := readJSON(templateFile)
	if err != nil {
		return
	}

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

Inside the `deployARM-how-to` directory, create another file named `template.json`.

Open the `template.json` file and add the following code:

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

Replace `<StorageAccountName>` and `<StorageAccountDisplayName>` with a [valid storage name value](/azure/storage/common/storage-account-overview#storage-account-endpoints).

## Sign in to Azure

The code in this article uses the [DefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#DefaultAzureCredential) type from the Azure Identity module for Go to authenticate to Azure. `DefaultAzureCredential` supports many credential types for authentication with Azure using OAuth with Microsoft Entra ID. In this article, you use the user credentials that you sign in to the Azure CLI with.

If you haven't already, sign in to the Azure CLI:

```azurecli
az login
```

If there are multiple subscriptions associated with your account, use the [az account list](/cli/azure/account#az-account-list) command to get a list of those subscriptions and the [az account set](/cli/azure/account#az-account-set) command to set the active subscription. Doing so ensures that any CLI commands you issue in the rest of this article are run against your intended subscription.

## Run the application

Before you can deploy the template, you need to define your Azure subscription ID as an environment variable.

Create an environment variable named `AZURE_SUBSCRIPTION_ID` set to your Azure subscription ID. To get the subscription ID, you can run the following [az account show](/cli/azure/account#az-account-show) command.

```azurecli
az account show --query id --output tsv
```

```azurecli
export AZURE_SUBSCRIPTION_ID=<AzureSubscriptionId>
```

Replace `<AzureSubscriptionId>` with your subscription ID.

Next, run the `go run` command to deploy the template:

```azurecli
go run main.go
```

> [!NOTE]
> If the program returns an error that begins with a timestamp and the following text: "failed to obtain a response: DefaultAzureCredential: failed to acquire a token.", make sure that you signed in to the Azure CLI as instructed in the previous section.

## Verify the resources on Azure

There are several Azure CLI commands you can use to verify that the resources were successfully created on Azure. The following commands are some examples.

To verify that the resource group has been created, run the [az group exists](/cli/azure/group#az-group-exists) command.

```azurecli
az group exists --name deployARM-how-to
```

You can list the resources in the group with the [az resource list](/cli/azure/resource#az-resource-list) command.

```azurecli
az resource list --resource-group deployARM-how-to
```

You can examine the deployment results (outputResources) and properties with the [az deployment group show](/cli/azure/deployment/group#az-deployment-group-show) command.

```azurecli
az deployment group show -g deployARM-how-to -n deployARM-how-to
```

## Clean up resources

Leaving resources in Azure can incur ongoing charges, so be sure to clean up the resources you created in this how-to.

Deploying an empty template in complete mode deletes all the resources within a resource group. It's a neat way to clean up resources without deleting the resource group itself.

Create a new empty template named `empty-template.json`.

Open the `empty-template.json` in your editor and add the following code:

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

Next open your `main.go` file and change the deployment time to _complete_ instead of _incremental_. To learn more about deployment modes, check out [Azure Resource Manager deployment modes](/azure/azure-resource-manager/templates/deployment-modes).

Change the Mode in the deployment properties to `DeploymentModeComplete`. And update the `templateFile` constant value to `empty-template.json`. Be sure to save your changes.

Update the templateFile const:

```go
const (
	resourceGroupName     = "deployARM-how-to"
	resourceGroupLocation = "eastus"
	deploymentName        = "deployARM-how-to"
	templateFile          = "empty-template.json"
)
```

Update the deployment mode:

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

Run the `go run` command to deploy the empty template and delete the storage account you created previously.

```azurecli
go run main.go
```

Optionally, you can delete the resource group and all its resources along with it.

```azurecli
az group delete --resource-group deployARM-how-to
```

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Go Core Concepts](azure-sdk-core-concepts.md)

> [!div class="nextstepaction"]
> [Azure SDK for Go management libraries](management-libraries.md)
