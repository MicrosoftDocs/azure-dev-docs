---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform log analytics
ms.topic: how-to article
ms.date: 06/30/2021
ms.custom: devx-track-terraform
---

# Create an Azure Log Analytics Workspace using Terraform

Terraform allows you to define and create complete infrastructure deployments in Azure. You build Terraform templates in a human-readable format that create and configure Azure resources in a consistent, reproducible manner. This article shows you how to create a Log Analytics workspace using Terraform. You can also learn how to [install and configure Terraform](get-started-cloud-shell.md).

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
resource "azurerm_resource_group" "<rg>" {
  location = var.location
  name     = "${var.prefix}-rg"
}
```
In other sections, you reference the resource group with `azurerm_resource_group.<rg>.name`.

## Configure Azure Log Analytics Workspace with Terraform
```hcl
resource "azurerm_log_analytics_workspace" "<lawksp>" {
  name                = "log${random_string.random.id}"
  location            = azurerm_resource_group.<rg>.location
  resource_group_name = azurerm_resource_group.<rg>.name
  sku                 = "PerGB2018"
}
```

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
> [Learn more about using Terraform in Azure](/azure/terraform)
