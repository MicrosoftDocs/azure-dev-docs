---
title: Create an Azure VM cluster with Terraform using the Module Registry
description: Learn how to use Terraform modules to create a Windows virtual machine cluster in Azure.
keywords: azure devops terraform vm virtual machine cluster module registry
ms.topic: how-to
ms.date: 09/22/2020
ms.custom: devx-track-terraform
---

# Create an Azure VM cluster with Terraform using the Module Registry

This article walks you through creating a small VM cluster with the Terraform [Azure compute module](https://registry.terraform.io/modules/Azure/compute/azurerm/1.0.2). In this article you learn how to:

> [!div class="checklist"]
> * Set up authentication with Azure
> * Create the Terraform template
> * Visualize the changes with plan
> * Apply the configuration to create the VM cluster

[!INCLUDE [hashicorp-support.md](includes/hashicorp-support.md)]

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

## Configure your environment

Based on your environment, install and configure Terraform:

- [Configure Terraform using Azure Cloud Shell and Azure CLI](terraform/get-started-cloud-shell.md)
- [Configure Terraform using Azure PowerShell](terraform/get-started-powershell.md)

## Create the template

Create a new Terraform template named `main.tf` with the following code:

```hcl
module mycompute {
    source = "Azure/compute/azurerm"
    resource_group_name = "myResourceGroup"
    location = "East US 2"
    admin_password = "ComplxP@assw0rd!"
    vm_os_simple = "WindowsServer"
    is_windows_image = "true"
    remote_port = "3389"
    nb_instances = 2
    public_ip_dns = ["unique_dns_name"]
    vnet_subnet_id = module.network.vnet_subnets[0]
}

module "network" {
    source = "Azure/network/azurerm"
    location = "East US 2"
    resource_group_name = "myResourceGroup"
}

output "vm_public_name" {
    value = module.mycompute.public_ip_dns_name
}

output "vm_public_ip" {
    value = module.mycompute.public_ip_address
}

output "vm_private_ips" {
    value = module.mycompute.network_interface_private_ip
}
```

Run `terraform init` in your configuration directory. Using a Terraform version of at least 0.10.6 shows the following output:

![Terraform Init](media/create-vm-cluster-module/terraform-init-with-modules.png)

## Visualize the changes with plan

Run `terraform plan` to preview the virtual machine infrastructure created by the template.

![Terraform Plan](media/create-vm-cluster-with-infrastructure/terraform-plan.png)


## Create the virtual machines with apply

Run `terraform apply` to provision the VMs on Azure.

![Terraform Apply](media/create-vm-cluster-with-infrastructure/terraform-apply.png)

## Next steps

> [!div class="nextstepaction"] 
> [Browse the list of Azure Terraform modules](https://registry.terraform.io/modules/Azure)