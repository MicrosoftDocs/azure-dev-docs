---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to article
ms.date: 06/30/2021
ms.custom: devx-track-terraform
---

# Configure Azure Files with Terraform

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to build Session Hosts and deploy to an AVD Host Pool with Terraform. You can also learn how to [install and configure Terraform](get-started-cloud-shell.md).

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article covers configuring Azure Files storage solutions for Azure Virtual Desktop FSLogix user profile containers using Terraform 

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

This article assumes you've already configured Terraform
* [Configure Terraform using Azure Cloud Shell](../get-started-cloud-shell.md) 
* [Configure the Azure Terraform Visual Studio Code extension](../terraform/configure-vs-code-extension-for-terraform)

## Create Azure connection and resource group

The following code defines the Azure Terraform provider:

```hcl
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}
provider "azurerm" {
  features {}
}
```
The following section creates a resource group in the location:

```hcl
resource "azurerm_resource_group" "<rgStor>" {
  location = var.location
  name     = "${var.prefix}-rg"
}
```
In other sections, you reference the resource group with `azurerm_resource_group.rgStor.name`.

[More details on storage](.../azure/storage/common/storage-account-overview.md)

## Configure a File Storage Account 
```hcl
resource "azurerm_storage_account" "Stor" {
  name                     = "stor${random_string.random.id}"
  resource_group_name      = azurerm_resource_group.rgStor.name
  location                 = azurerm_resource_group.rgStor.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "FileStorage"
  tags = "Terraform Demo"
}
```

## Configure a File Share
```hcl
resource "azurerm_storage_share" "<FSShare>" {
  name                 = "<fslogix>"
  storage_account_name = azurerm_storage_account.Stor.name
  depends_on           = [azurerm_storage_account.Stor]
}

output "storage_account_name" {
  value = azurerm_storage_account.Stor.name

}
```

# Configure RBAC permission on Azure File Storage 
```hcl
resource "azurerm_role_assignment" "storageAccountRoleAssignment" {
  scope                = azurerm_storage_account.example.id
  role_definition_name = "Storage File Data SMB Shared Elevated Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}
```

# Complete Terraform script
To bring all these sections together and see Terraform in action, create a file called main.tf and paste the following content:
```hcl
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "~>2.0"
    }
  }
}
provider "azurerm" {
  features {}
}

## Create a Resource Group for Storage
resource "azurerm_resource_group" "rgStor" {
  location = var.location
  name     = "${var.prefix}-rg"
}

## Create a File Storage Account 
resource "azurerm_storage_account" "Stor" {
  name                     = "stor${random_string.random.id}"
  resource_group_name      = azurerm_resource_group.rgStor.name
  location                 = azurerm_resource_group.rgStor.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "FileStorage"
  tags = "Terraform Demo"
}

resource "azurerm_storage_share" "FSShare2" {
  name                 = "fslogix"
  storage_account_name = azurerm_storage_account.Stor.name
  depends_on           = [azurerm_storage_account.Stor]
}

output "storage_account_name" {
  value = azurerm_storage_account.Stor.name

}

resource "azurerm_role_assignment" "storageAccountRoleAssignment" {
  scope                = azurerm_storage_account.example.id
  role_definition_name = "Storage File Data SMB Shared Elevated Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}
```hcl


## Build and deploy the infrastructure

With your Terraform template created, the first step is to initialize Terraform. This step ensures that Terraform has all the prerequisites to build your template in Azure.

```bash
terraform init
```

The next step is to have Terraform review and validate the template. This step compares the requested resources to the state information saved by Terraform and then outputs the planned execution. The Azure resources aren't created at this point. An execution plan is generated and stored in the file specified by the `-out` parameter.

```bash
terraform plan -out terraform_azure.tfplan
```

When you're ready to build the infrastructure in Azure, apply the execution plan:

```bash
terraform apply terraform_azure.tfplan
```

Once Terraform completes, your VM infrastructure is ready. Obtain the public IP address of your VM with [az vm show](/cli/azure/vm#az_vm_show):


[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)