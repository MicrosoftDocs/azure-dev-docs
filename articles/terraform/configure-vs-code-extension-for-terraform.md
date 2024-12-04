---
title: Install the Azure Terraform Visual Studio Code extension
description: Learn how to install and use the Azure Terraform Visual Studio Code extension to create an Azure resource group
ms.topic: how-to
ms.date: 05/08/2023
ms.custom: devx-track-terraform, mode-portal
---

# Install the Azure Terraform Visual Studio Code extension

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

The Visual Studio Code Terraform extension enables you to work with Terraform from the editor. With this extension, you can author, test, and run Terraform configurations.

In this article, you learn how to:

> [!div class="checklist"]
> * Install the Azure Terraform Visual Studio Code extension
> * Use the extension to create an Azure resource group
> * Verify the resource group was created
> * Delete the resource group when finished testing using the extension

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Install Node.js](https://nodejs.org/).

## 2. Install the Azure Terraform Visual Studio Code extension

1. Launch Visual Studio Code.

1. From the left menu, select **Extensions**, and enter `Azure Terraform` in the search text box.

    :::image type="content" source="media/configure-vs-code-extension-for-terraform/search-for-azure-terraform-extension.png" alt-text="Search Visual Studio Code extensions in Marketplace.":::

1. From the list of extensions, locate the `Azure Terraform` extension. (It should be the first extension listed.)

1. If the extension isn't yet installed,  select the extension's **Install** option.

    **Key points:**

    - When you select **Install** for the Azure Terraform extension, Visual Studio Code automatically installs the Azure Account extension.
    - Azure Account is a dependency file for the Azure Terraform extension. This file is used to authenticate to Azure and Azure-related code extensions.

1. To confirm the installation of the extensions, enter `@installed` in the search text box. Both the Azure Terraform extension and the Azure Account extension appear in the list of installed extensions.

    :::image type="content" source="media/configure-vs-code-extension-for-terraform/installed-extensions.png" alt-text="View installed Terraform extensions.":::

You can now run all supported Terraform commands in your Cloud Shell environment from within Visual Studio Code.

## 3. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/main.tf)]

1. Create a file named `variables.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/variables.tf)]

1. Create a file named `outputs.tf` to contain the project variables and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-resource-group/outputs.tf)]

## 4. Push your code to Cloud Shell

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Push` and select it when it displays.

1. Select **OK** to confirm the opening of Cloud Shell.

    :::image type="content" source="media/configure-vs-code-extension-for-terraform/confirm-opening-of-cloud-shell.png" alt-text="Confirm the opening of Cloud Shell.":::

    **Key points:**

    - Your workspace files that meet the filter defined in the `azureTerraform.files` setting in your configuration are copied to Cloud Shell.
    
## 5. Initialize Terraform within Visual Studio Code

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Init` and select it when it displays.

    **Key points:**

    - Selecting this option is the same as running [terraform init](https://www.terraform.io/docs/commands/init.html) from the command line and initializes your Terraform deployment.
    - This command downloads the Azure modules required to create an Azure resource group.

1. Follow the prompts to install any dependencies - such as the latest supported version of nodejs.

1. If you're using Cloud Shell for the first time with your default Azure subscription, follow the prompts to configure the environment.

## 6. Create a Terraform execution plan within Visual Studio Code

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Plan` and select it when it displays.

    **Key points:**

    - This command runs [terraform plan](https://www.terraform.io/docs/commands/plan.html) to create an execution plan from the Terraform configuration files in the current directory.

## 7. Apply a Terraform execution plan within Visual Studio Code

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Apply` and select it when it displays.

1. When prompted for confirmation, enter `yes` and press `<Enter>`.

## 8. Verify the results

#### [Azure CLI](#tab/azure-cli)

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure: Open Bash in Cloud Shell` and select it when it displays.

1. Run [az group show](/cli/azure/group#az-group-show) to display the resource group. Replace the `<resource_group_name>` placeholder with the randomly generated name of the resource group displayed after applying the Terraform execution plan.

```azurecli
az group show --name <resource_group_name>
```

#### [Azure PowerShell](#tab/azure-powershell)

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure: Open PowerShell in Cloud Shell` and select it when it displays.

1. Run [Get-AzResourceGroup](/powershell/module/az.resources/Get-AzResourceGroup) to display the resource group.

```azurepowershell
Get-AzResourceGroup -Name <resource_group_name>
```

---

## 9. Clean up resources

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Destroy` and select it when it displays.

1. When prompted for confirmation, enter `yes` and press `<Enter>`.

1. To confirm that Terraform successfully destroyed your new resource group, run the steps in the section, [Verify the results](#8-verify-the-results).

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Read more about the Azure Terraform Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureterraform)
