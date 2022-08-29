---
title: Quickstart - Configure a Linux virtual machine in Azure using Terraform
description: Learn how to use Terraform to configure a complete Linux virtual machine environment in Azure.
keywords: azure devops terraform linux vm virtual machine
ms.topic: quickstart
ms.date: 08/29/2022
ms.custom: devx-track-terraform
---

# Quickstart: Configure a Linux virtual machine in Azure using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article shows you how to create a complete Linux environment and supporting resources with Terraform. Those resources include a virtual network, subnet, public IP address, and more.

In this article, you learn how to:
> [!div class="checklist"]

> * Create a virtual network
> * Create a subnet
> * Create a public IP address
> * Create a network security group and SSH inbound rule
> * Create a virtual network interface card
> * Connect the network security group to the network interface
> * Create a storage account for boot diagnostics
> * Create SSH key
> * Create a virtual machine
> * Use SSH to connect to virtual machine

> [!NOTE]
> The example code in this article is located in the [Microsoft Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-vm-with-infrastructure).

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[UserStory1982922](../../terraform_samples/quickstart/101-vm-with-infrastructure/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[UserStory1982922](../../terraform_samples/quickstart/101-vm-with-infrastructure/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[UserStory1982922](../../terraform_samples/quickstart/101-vm-with-infrastructure/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[UserStory1982922](../../terraform_samples/quickstart/101-vm-with-infrastructure/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## Verify the results

To use SSH to connect to the virtual machine, do the following steps:

1. Run [terraform output](https://www.terraform.io/cli/commands/output) to get the SSH private key and save it to a file.

    ```console
    terraform output -raw tls_private_key > id_rsa
    ```

1. Run [terraform output](https://www.terraform.io/cli/commands/output) to get the virtual machine public IP address.


    ```console
    terraform output public_ip_address
    ```

1. Use SSH to connect to the virtual machine.

    ```console
    ssh -i id_rsa azureuser@<public_ip_address>
    ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)