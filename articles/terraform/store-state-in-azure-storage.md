---
title: Store Terraform state in Azure Storage
description: Learn how to store Terraform state in Azure Storage.
ms.topic: how-to
ms.date: 05/08/2023
ms.custom: devx-track-terraform, devx-track-azurecli
---

# Store Terraform state in Azure Storage

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Terraform state is used to reconcile deployed resources with Terraform configurations. State allows Terraform to know what Azure resources to add, update, or delete.

By default, Terraform state is stored locally, which isn't ideal for the following reasons:

- Local state doesn't work well in a team or collaborative environment.
- Terraform state can include sensitive information.
- Storing state locally increases the chance of inadvertent deletion.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure storage account
> * Use Azure storage to store remote Terraform state.
> * Understand state locking
> * Understand *encryption at rest*

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Configure remote state storage account

Before you use Azure Storage as a backend, you must create a storage account.

Run the following commands or configuration to create an Azure storage account and container:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
#!/bin/bash

RESOURCE_GROUP_NAME=tfstate
STORAGE_ACCOUNT_NAME=tfstate$RANDOM
CONTAINER_NAME=tfstate

# Create resource group
az group create --name $RESOURCE_GROUP_NAME --location eastus

# Create storage account
az storage account create --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT_NAME --sku Standard_LRS --encryption-services blob

# Create blob container
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME
```

# [PowerShell](#tab/powershell)

```powershell-interactive
$RESOURCE_GROUP_NAME='tfstate'
$STORAGE_ACCOUNT_NAME="tfstate$(Get-Random)"
$CONTAINER_NAME='tfstate'

# Create resource group
New-AzResourceGroup -Name $RESOURCE_GROUP_NAME -Location eastus

# Create storage account
$storageAccount = New-AzStorageAccount -ResourceGroupName $RESOURCE_GROUP_NAME -Name $STORAGE_ACCOUNT_NAME -SkuName Standard_LRS -Location eastus -AllowBlobPublicAccess $false

# Create blob container
New-AzStorageContainer -Name $CONTAINER_NAME -Context $storageAccount.context
```

# [Terraform](#tab/terraform)

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "random_string" "resource_code" {
  length  = 5
  special = false
  upper   = false
}

resource "azurerm_resource_group" "tfstate" {
  name     = "tfstate"
  location = "East US"
}

resource "azurerm_storage_account" "tfstate" {
  name                     = "tfstate${random_string.resource_code.result}"
  resource_group_name      = azurerm_resource_group.tfstate.name
  location                 = azurerm_resource_group.tfstate.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  allow_nested_items_to_be_public = false

  tags = {
    environment = "staging"
  }
}

resource "azurerm_storage_container" "tfstate" {
  name                  = "tfstate"
  storage_account_name  = azurerm_storage_account.tfstate.name
  container_access_type = "private"
}
```

Save the configuration as `create-remote-storage.tf`.

Run the command `terraform init`, then `terraform apply` to configure the Azure storage account and container.

---

**Key points:**
* Azure storage accounts require a globally unique name. To learn more about troubleshooting storage account names, see [Resolve errors for storage account names](/azure/azure-resource-manager/templates/error-storage-account-name).
* Terraform state is stored in plain text and may contain secrets. If the state is incorrectly secured, unauthorized access to systems and data loss can result.
* In this example, Terraform authenticates to the Azure storage account using an Access Key. In a production deployment, it's recommended to evaluate the available [authentication options](https://developer.hashicorp.com/terraform/language/settings/backends/azurerm) supported by the azurerm backend and to use the most secure option for your use case.
* In this example, public network access is allowed to this Azure storage account. In a production deployment, it's recommended to restrict access to this storage account using a [storage firewall, service endpoint, or private endpoint](/azure/storage/common/storage-network-security).

## 3. Configure terraform backend state

To configure the backend state, you need the following Azure storage information:

- **storage_account_name**: The name of the Azure Storage account.
- **container_name**: The name of the blob container.
- **key**: The name of the state store file to be created.
- **access_key**: The storage access key.

Each of these values can be specified in the Terraform configuration file or on the command line. We recommend that you use an environment variable for the `access_key` value. Using an environment variable prevents the key from being written to disk.

Run the following commands to get the storage access key and store it as an environment variable:

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP_NAME --account-name $STORAGE_ACCOUNT_NAME --query '[0].value' -o tsv)
export ARM_ACCESS_KEY=$ACCOUNT_KEY
```

# [PowerShell](#tab/powershell)

```azurepowershell
$ACCOUNT_KEY=(Get-AzStorageAccountKey -ResourceGroupName $RESOURCE_GROUP_NAME -Name $STORAGE_ACCOUNT_NAME)[0].value
$env:ARM_ACCESS_KEY=$ACCOUNT_KEY
```

# [Terraform](#tab/terraform)
```terraform
```

Terraform prevents sensitive information from being displayed within the terminal. It's recommended to use Azure CLI or Azure PowerShell to retrieve the access key.

---

**Key points:**
* To further protect the Azure Storage account access key, store it in Azure Key Vault. The environment variable can then be set by using a command similar to the following. For more information on Azure Key Vault, see the [Azure Key Vault documentation](/azure/key-vault/secrets/quick-create-cli).

    ```bash
    export ARM_ACCESS_KEY=$(az keyvault secret show --name terraform-backend-key --vault-name myKeyVault --query value -o tsv)
    ```

Create a Terraform configuration with a `backend` configuration block.

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  backend "azurerm" {
      resource_group_name  = "tfstate"
      storage_account_name = "<storage_account_name>"
      container_name       = "tfstate"
      key                  = "terraform.tfstate"
  }

}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "state-demo-secure" {
  name     = "state-demo"
  location = "eastus"
}
```

Replace `<storage_account_name>` with the name of your Azure storage account.

Run the following command to initialize the configuration:

```bash
terraform init
```

Run the following command to run the configuration:

```bash
terraform apply
```

You can now find the state file in the Azure Storage blob.

## 4. Understand state locking

Azure Storage blobs are automatically locked before any operation that writes state. This pattern prevents concurrent state operations, which can cause corruption.

For more information, see [State locking](https://www.terraform.io/docs/state/locking.html) in the Terraform documentation.

You can see the lock when you examine the blob through the Azure portal or other Azure management tooling.

![Azure blob with lock](media/store-state-in-azure-storage/lock.png)

## 5. Understand encryption-at-rest

Data stored in an Azure blob is encrypted before being persisted. When needed, Terraform retrieves the state from the backend and stores it in local memory. If you use this pattern, state is never written to your local disk.

For more information on Azure Storage encryption, see [Azure Storage service encryption for data at rest](/azure/storage/common/storage-service-encryption).

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
