---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 3/18/2022
ms.custom: devx-track-terraform
---

# Configure Azure Virtual Desktop with Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.4](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.94.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

In this article, you learn how to build Session Hosts and deploy to an AVD Host Pool with Terraform. Host pools are a collection of one or more identical virtual machines within Azure Virtual Desktop tenant environments. Each host pool can be associated with multiple RemoteApp groups - one desktop app group - and multiple session hosts.

In this article, you learn how to:
> [!div class="checklist"]

> * Use Terraform to create an Azure Virtual Desktop workspace
> * Use Terraform to create an Azure Virtual Desktop host pool
> * Use Terraform to create an Azure Desktop Application Group
> * Associate a Workspace and a Desktop Application Group

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

1. Create a file named `output.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/output.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

Once Terraform completes, your VM infrastructure is ready. Obtain the public IP address of your VM with [az vm show](/cli/azure/vm#az_vm_show):

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)
