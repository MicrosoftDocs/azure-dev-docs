---
title: Create an Azure virtual machine scale set using Terraform
description: Learn how to use Terraform to configure and version an Azure virtual machine scale set.
ms.topic: how-to
ms.date: 07/28/2021
ms.custom: devx-track-terraform
---

# Create an Azure virtual machine scale set using Terraform

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

1. Create a directory in which to test and run the sample Terraform code.

1. Create your main Terraform configuration file. By convention, the name of this file is `main.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the main Terraform configuration file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/201-vmss-jumpbox/main.tf)]

1. Create a variables file that will contain the values for Terraform. By convention, the name of this file is `variables.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the variables file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/201-vmss-jumpbox/variables.tf)]

    [!INCLUDE [variables-terraform-file-key-points.md](includes/variables-terraform-file-key-points.md)]

1. Create a file to specify what values to output when the Terraform plan is applied. By convention, the name of this file is `output.tf`. However, you can specify any valid name for your environment.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/201-vmss-jumpbox/output.tf)]

1. Create a file named `web.conf`. If you decide to use a different name, change the value in the main configuration file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/201-vmss-jumpbox/web.conf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-create-plan.md](includes/terraform-create-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. From the output of the `terraform apply` command, verify that the FQDN of the public IP addresses corresponds to your configuration.

1. Browse to the URL to see a default page with the text **Welcome to nginx!**.

1. SSH to the jumpbox VM.

## 7. Clean up resources

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
