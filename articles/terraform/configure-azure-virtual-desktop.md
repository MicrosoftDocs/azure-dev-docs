---
title: Configure Azure Virtual Desktop using Terraform - Azure
description: Learn how to use Terraform to configure Azure Virtual Desktop with Terraform
keywords: azure devops terraform avd virtual desktop session host
ms.topic: how-to
ms.date: 3/19/2022
ms.custom: devx-track-terraform, devx-track-azurecli
---

# Configure Azure Virtual Desktop with Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

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

    [!code-terraform[UserStory1913529](../../terraform_samples/quickstart/101-azure-virtual-desktop-configure/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[UserStory1913529](../../terraform_samples/quickstart/101-azure-virtual-desktop-configure/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[UserStory1913529](../../terraform_samples/quickstart/101-azure-virtual-desktop-configure/variables.tf)]

1. Create a file named `output.tf` and insert the following code:

    [!code-terraform[UserStory1913529](../../terraform_samples/quickstart/101-azure-virtual-desktop-configure/output.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

> [!NOTE]
> At the time of this writing, the Azure CLI command groups - `config`, `desktopvirtualization applicationgroup`, `desktopvirtualization workspace` are experimental and under development.

1. Get the randomized resource group name. The name is output when you run `terraform apply`. You can also get the name by running the following `terraform output` command.

    ```console
    echo "$(terraform output resource_group_name)"
    ```

1. Get the name of the Azure Virtual Desktop Application Group you created. The name is output when you run `terraform apply`. You can also get the name by running the following `terraform output` command.

    ```console
    echo "$(terraform output azurerm_virtual_desktop_application_group)"
    ```

1. Run [az desktopvirtualization applicationgroup show](/cli/azure/desktopvirtualization/applicationgroup#az-desktopvirtualization-applicationgroup-show) to show the workspace details.

    ```azurecli
    az desktopvirtualization applicationgroup show \
    --name <azure_virtual_desktop_application_group_name> \
    --resource-group <resource_group_name>
    ```

1. Get the name of the Azure Virtual Desktop Workspace you created. The name is output when you run `terraform apply`. You can also get the name by running the following `terraform output` command.

    ```console
    echo "$(terraform output azurerm_virtual_desktop_workspace)"
    ```

1. Run [az desktopvirtualization workspace show](/cli/azure/desktopvirtualization/workspace#az-desktopvirtualization-workspace-show) to show the workspace details.

    ```azurecli
    az desktopvirtualization workspace show \
    --name <azure_virtual_desktop_workspace_name> \
    --resource-group <resource_group_name>
    ```

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Configuring Azure Virtual Desktop session hosts using Terraform in Azure](/articles/terraform/create-avd-session-host.md)
