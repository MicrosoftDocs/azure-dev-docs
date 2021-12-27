---
title: Deploy an Azure Resource Manage Template with the Azure SDK for Go
description: In this tutorial, you'll learn how to use the Azure SDK for Go to deploy an Azure Resource Manager template.
ms.topic: how-to
ms.date: 12/20/2021
ms.custom: devx-track-go
---

# Deploy an Azure Resource Manage Template with the Azure SDK for Go

In this tutorial, you'll use the Azure SDK for Go to deploy an Azure Resource Manager template.

Azure Resource Manager is the deployment and management service for Azure. It enables you to create, update, and delete resources in your Azure account. Azure Resource Manager templates declaratively describe your infrastructure as code in JSON documents.

By the end of this tutorial, you'll have written and deployed an Azure Resource Manager template using Go that deploys an Azure Storage Account.

<!-- Screenshot of ARM template & Go code in VS Code -->

## Prerequisites

[!INCLUDE [azure-subscription.md](includes/azure-subscription.md)]
- **Go installed**: Version 1.16 or [above](https://golang.org/dl/)

## Create a new module

Create a new directory called `deployARM-how-to`. Then change into that directory.

```azurecli
mkdir deployARM-how-to
cd deployARM-how-to
```

The Azure SDK for Go contains several packages for working with Azure. For this tutorial you'll need the `azcore/to`, `azidentity, and `armresources` packages:

Run the `go get` command to download these packages:

```azurecli
go get github.com/Azure/azure-sdk-for-go/sdk/azcore/to
go get github.com/Azure/azure-sdk-for-go/sdk/azidentity
go get github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources
```

Run the `go mod init` command to create the `go.mod` and `go.sum` files.

```azurecli
go mod init deployARM-how-to
```

Next create a file named `main.go`

```azurecli
nano main.go
```

Open your `main.go` in your editor and add the following code:

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/resources/armresources"
)

const (
	resourceGroupName     = "GoVMQuickstart"
	resourceGroupLocation = "eastus"
	deploymentName        = "deployARM-how-to"
	templateFile          = "template.json"
)

var (
	ctx = context.Background()
)

func readJSON(path string) (map[string]interface{}, error) {
	data, err := ioutil.ReadFile(path)
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
	client := armresources.NewResourceGroupsClient(subscriptionId, cred, nil)
	resp, err := client.CreateOrUpdate(context.Background(), resourceGroupName, armresources.ResourceGroup{
		Location: to.StringPtr(resourceGroupLocation),
	}, nil)
	if err != nil {
		log.Fatalf("failed to obtain a response: %v", err)
	}
	log.Printf("resource group ID: %s\n", *resp.ResourceGroup.ID)

	template, err := readJSON(templateFile)
	if err != nil {
		return
	}

	deploymentsClient := armresources.NewDeploymentsClient(subscriptionId, cred, nil)
	deploy, err := deploymentsClient.BeginCreateOrUpdate(
		ctx,
		resourceGroupName,
		deploymentName,
		armresources.Deployment{
			Properties: &armresources.DeploymentProperties{
				Template: template,
				Mode:     armresources.DeploymentModeIncremental.ToPtr(),
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

Inside the `deployARM-how-to` directory create another file named `template.json`.

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

## Run the application

Before you can deploy the template with GO, you have to define the subscription Id. Without the subscription Id, the Resource Manager will not know where to deploy the template.

Create an environment named `AZURE_SUBSCRIPTION_ID` and your Azure subscription Id. To get the subscription Id, run the AzureCLI command `az account list`.

```azurecli
export AZURE_SUBSCRIPTION_ID=<AzureSubscriptionId>
```

Replace `<AzureSubscriptionId>` with your subscription Id.

Next, run the `go run` command to deploy the template:

```azurecli
go run main.go
```

## Clean up resources

Leaving resources in Azure costs you money. So, be sure to cleanup the resources you created in this how-to.

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
	resourceGroupName     = "GoHowTo"
	resourceGroupLocation = "eastus"
	deploymentName        = "deployARM-how-to"
	templateFile          = "empty-template.json"
)
```

Update the deployment mode:

```go
_, err = deploymentsClient.BeginCreateOrUpdate(
    ctx,
    resourceGroupName,
    deploymentName,
    armresources.Deployment{
        Properties: &armresources.DeploymentProperties{
            Template: template,
            Mode:     armresources.DeploymentModeComplete.ToPtr(), //Deployment Mode is here
        },
    },
    nil,
)nil,
)
```

Run the `go run` command to deploy the empty template and delete the storage account you created previously.

```azurecli
go run main.go
```

Optionally, you can delete the resource group and all its resources along with it.

```azurecli
az group delete --resource-group GoHowTo
```

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Go Core Concepts](azure-sdk-core-concepts.md)

> [!div class="nextstepaction"]
> [Azure SDK for Go management libraries](management-libraries.md)
