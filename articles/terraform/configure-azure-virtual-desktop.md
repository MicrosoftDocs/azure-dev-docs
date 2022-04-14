---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 4/12/2022
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop with Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

This article provides an overview of how to use Terraform to deploy an ARM Azure Virtual Desktop environment, not AVD Classic.

There are several pre-requisites [requirements for Azure Virtual Desktop](/azure/virtual-desktop/overview)

New to Azure Virtual Desktop? Start with [What is Azure Virtual Desktop?](/azure/virtual-desktop/prerequisites)

It is assumed that an appropriate platform foundation is already setup which may or may not be the [Enterprise Scale Landing Zone platform foundation.](/azure/cloud-adoption-framework/ready/enterprise-scale/implementation)

In this article, you learn how to:
> [!div class="checklist"]

> - Use Terraform to create an Azure Virtual Desktop workspace
> - Use Terraform to create an Azure Virtual Desktop host pool
> - Use Terraform to create an Azure Desktop Application Group
> - Associate a Workspace and a Desktop Application Group
> - Use Terraform to create NIC for each session host
> - Use Terraform to create VM for session host
> - Join VM to domain
> - Register VM with Azure Virtual Desktop
> - Use Terraform to read Azure Active Directory existing users
> - Use Terraform to create Azure Active Directory group
> - Role assignment for Azure Virtual Desktop
> - Use Terraform to Azure File Storage account
> - Use Terraform to configure File Share
> - Use Terraform to configure RBAC permission on Azure File Storage
> - Use Terraform to configure Azure Log Analytics Workspace
> - Use Terraform to configure Azure Compute Gallery (formerly Shared Image Gallery)
> - Use variables file

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/provider.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/main.tf)]

     **Key points:**

    - Use `count` to indicate how many resources will be created
    - References resources that were created when the infrastructure was built - such as `azurerm_subnet.subnet.id` and `azurerm_virtual_desktop_host_pool.hostpool.name`.  If you  changed the name of these resources from that section, you also need to update the references here.

1. Create a file named `host.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/host.tf)]

1. Create a file named `rbac.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/rbac.tf)]

1. Create a file named `networking.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/networking.tf)]

1. Create a file named `afstorage.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/afstorage.tf)]

1. Create a file named `loganalytics.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/loganalytics.tf)]

1. Create a file named `sig.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/sig.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/variables.tf)]

1. Create a file named `terraform.tfvars` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/environments/sample.tfvars)]

1. Create a file named `output.tf` and insert the following code:

    [!code-terraform [master](../../terraform_samples/quickstart/101-azure-virtual-desktop/outputs.tf)]

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
