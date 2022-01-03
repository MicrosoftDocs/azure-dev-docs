---
title: Configure Azure Compute Gallery using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to article
ms.date: 06/30/2021
ms.custom: devx-track-terraform
---

# Configure Azure Compute Gallery with Terraform

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to build Session Hosts and deploy to an AVD Host Pool with Terraform. You can also learn how to [install and configure Terraform](get-started-cloud-shell.md).

Azure offers multiple storage solutions that you can use to store your FSLogix profile container. This article covers configuring Azure Files storage solutions for Azure Virtual Desktop FSLogix user profile containers using Terraform 

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

This article assumes you've already configured Terraform
* [Configure Terraform using Azure Cloud Shell](../get-started-cloud-shell.md) 
* [Configure the Azure Terraform Visual Studio Code extension](../terraform/configure-vs-code-extension-for-terraform)

## 1. Define providers and create resource group

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
resource "azurerm_resource_group" "<rg>" {
  location = var.location
  name     = "${var.prefix}-rg"
}
```
In other sections, you reference the resource group with `azurerm_resource_group.<rg>.name`.



## 2. Configure Azure Compute Gallery formerly Shared Image Gallery
```hcl
resource "azurerm_shared_image_gallery" "<sig>" {
  name                = "<AVDsig>"
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  description         = "<Shared images and things>"

  tags = {
    Environment = "<Demo>"
    Tech        = "<Terraform>"
  }
}
```

## 3. Configure an Image Definition
```hcl

resource "azurerm_shared_image" "<example>" {
  name                = "<avd-image>"
  gallery_name        = azurerm_shared_image_gallery.<sig>.name
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  os_type             = "<Windows>"

  identifier {
    publisher = "<MicrosoftWindowsDesktop>"
    offer     = "<office-365>"
    sku       = "<20h2-evd-o365pp>"
  }
}
```

# 4. Complete Terraform script
To bring all these sections together and see Terraform in action, create a file called main.tf and paste the following content:
```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "<rg>" {
  location = var.location
  name     = "${var.prefix}-rg"
}


## Created Azure Compute Gallery formerly Shared Image Gallery
resource "azurerm_shared_image_gallery" "<sig>" {
  name                = "<AVDsig>"
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  description         = "<Shared images and things>"

  tags = {
    Environment = "<Demo>"
    Tech        = "<Terraform>"
  }
}

resource "azurerm_shared_image" "<example>" {
  name                = "<avd-image>"
  gallery_name        = azurerm_shared_image_gallery.<sig>.name
  resource_group_name = azurerm_resource_group.<rg>.name
  location            = azurerm_resource_group.<rg>.location
  os_type             = "<Windows>"

  identifier {
    publisher = "<MicrosoftWindowsDesktop>"
    offer     = "<office-365>"
    sku       = "<20h2-evd-o365pp>"
  }
}
```


## 5. Build and deploy the infrastructure

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

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
