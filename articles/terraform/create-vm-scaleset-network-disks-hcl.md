---
title: Create an Azure virtual machine scale set using Terraform
description: Learn how to use Terraform to configure and version an Azure virtual machine scale set.
ms.topic: how-to
service: virtual-machine-scale-sets
ms.service: azure-virtual-machine-scale-sets
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Create an Azure virtual machine scale set using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

[Azure virtual machine scale sets](/azure/virtual-machine-scale-sets) allow you to configure identical VMs. The number of VM instances can adjust based on demand or a schedule. For more information, see [Automatically scale a virtual machine scale set in the Azure portal](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-portal).

In this article, you learn how to:

> [!div class="checklist"]
> * Set up a Terraform deployment
> * Use variables and outputs for Terraform deployment
> * Create and deploy network infrastructure
> * Create and deploy a virtual machine scale set and attach it to the network
> * Create and deploy a jumpbox to connect to the VMs via SSH

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Create an SSH key pair**: For more information, see [How to create and use an SSH public and private key pair for Linux VMs in Azure](/azure/virtual-machines/linux/mac-create-ssh-keys).

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-vmss-jumpbox/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-vmss-jumpbox/variables.tf)]

1. Create a file named `output.tf` to specify what values Terraform displays and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-vmss-jumpbox/output.tf)]

1. Create a file named `web.conf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-vmss-jumpbox/web.conf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. From the output of the `terraform apply` command, you see values for the following:

    - Virtual machine FQDN
    - Jumpbox FQDN
    - Jumpbox IP address

1. Browse to the virtual machine URL to confirm a default page with the text **Welcome to nginx!**.

1. Use SSH to connect to the jumpbox VM using the user name defined in the variables file and the password you specified when you ran `terraform apply`. For example: `ssh azureuser@<ip_address>`.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
