---
title: Configure Azure Virtual Desktop Session Hosts using Terraform
description: Learn how to use Terraform to configure session hosts and add them to a host pool.
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 12/17/2021
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop session hosts using Terraform

This article shows you how to build Session Hosts and deploy them to an AVD Host Pool with Terraform. This article assumes you've already deployed the [Azure Virtual Desktop Infrastructure](../terraform/create-azure-virtual-desktop.md).

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to create NIC for each session host
> * Use Terraform to create VM for session host
> * Join VM to domain
> * Register VM with Azure Virtual Desktop
> * Use variables file

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    [!code-terraform](../../quickstart/101-azure-virtual-desktop/provider.tf)

    **Key points:**

    * Use `count` to indicate how many resources will be created
    * References resources that were created when the infrastructure was built - such as `azurerm_subnet.subnet.id` and `azurerm_virtual_desktop_host_pool.hostpool.name`.  If you  changed the name of these resources from that section, you also need to update the references here.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform](../../quickstart/101-azure-virtual-desktop/host.tf)

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform](../../quickstart/101-azure-virtual-desktop/variables.tf)

1. Create a file named `output.tf` and insert the following code.

    [!code-terraform](../../quickstart/101-azure-virtual-desktop/outputs.tf)

1. Create a file named `terraform.tfvars` and insert the following code.

    [!code-terraform](../../quickstart/101-azure-virtual-desktop/environments/sample.tfvars)

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. On the Azure portal, Select **Azure Virtual Desktop**.
1. Select **Host pools** and then the **Name of the pool created** resource.
1. Select **Session hosts** and then verify the session host is listed.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Terraform in Azure](/azure/terraform)
