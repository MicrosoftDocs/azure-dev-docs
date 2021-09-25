---
title: Configure the Azure Terraform Visual Studio Code extension
description: Learn how to install and use the Azure Terraform extension in Visual Studio Code.
ms.topic: how-to
ms.date: 09/23/2021
ms.custom: devx-track-terraform
---

# Configure the Azure Terraform Visual Studio Code extension

The Azure Terraform Visual Studio Code extension enables you to work with Terraform from the editor. With this extension, you can author, test, and run Terraform configurations. The extension also supports resource graph visualization.

In this article, you learn how to:
> [!div class="checklist"]

> * Automate the provisioning of Azure services using Terraform
> * Install and use the Terraform Visual Studio Code extension for Azure services.
> * Use Visual Studio Code to write, plan, and execute Terraform plans.

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Install Node.js](https://nodejs.org/).

- [Install GraphViz](https://graphviz.org/) to use the Terraform visualize function.

## 2. Exercise: Basic Terraform commands walk-through
In this exercise, you create and execute a basic Terraform configuration file that provisions a new Azure resource group.

### Install the Azure Terraform Visual Studio Code extension

1. Launch Visual Studio Code.

1. From the left menu, select **Extensions**, and enter `Azure Terraform` in the search text box.

	![Search Visual Studio Code extensions in Marketplace](media/configure-vs-code-extension-for-terraform/search-for-azure-terraform-extension.png)

1. Under the **Azure Terraform** Visual Studio extension, Select **Install**.

    **Key points:**
    - When you select **Install** for the Azure Terraform extension, Visual Studio Code automatically installs the Azure Account extension.
    - Azure Account is a dependency file for the Azure Terraform extension. This file is used to authenticate to Azure and Azure-related code extensions.

1. To confirm the installation of the extensions, enter `@installed` in the search text box. Both the Azure Terraform extension and the Azure Account extension will appear in the list of installed extensions.

    ![Installed Terraform extensions](media/configure-vs-code-extension-for-terraform/installed-extensions.png)

You can now run all supported Terraform commands in your Cloud Shell environment from within Visual Studio Code.

### Prepare a test plan file

1. From the **File** menu, select **New File**.

1. Insert the following code into the new file:

    ```terraform
    terraform {
    
      required_version = ">=0.12"
      
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
    
    resource "azurerm_resource_group" "rg" {
      name = var.resource_group_name
      location = var.resource_group_location
    }    
    ```

1. Insert the copied code into the new file you created in Visual Studio Code.

     **Key points:**

    - You can change the **name** and **location** values to values that are appropriate for your environment.

1. From the **File** menu, select **Save As...**.

1. In the **Save As** dialog, navigate to your **home directory** and then select **New folder**. (Change the name of the new folder to something more descriptive than *New folder*.)

    **Key points:**

    - The folder is named `terraform-test-plan` is used in this example.

1. Make sure your new folder is highlighted (selected) and then select **Open**.

1. In the **Save As** dialog, change the default name of the file to `main.tf`.

1. Select **Save**.

1. From the **File** menu, select **Open Folder**.

1. Navigate to the folder your saved the file into, and select **Select Folder**.

### Initialize a Terraform project in Visual Studio Code

1. From the Explorer pane on the left, double-click the `main.tf` file to open it.

1. From the **View** menu, select **Command Palette...**.

1. In the Command Palette text box, start entering `Azure Terraform: Init` and select it when it displays.

1. Follow the prompts to install any dependencies - such as the latest supported version of nodejs.

1. If this is the first time you're using Cloud Shell with your default Azure subscription, follow the prompts to configure the environment.

1. 



1. When the confirmation appears to open Cloud Shell, select **OK**. (The confirmation dialog might display in the lower right corner.)

1. After confirming the dialog, you might see additional messages about installing other tools. Follow those prompts as appropriate for your environment.

    **Key points:**

    - If you need to install a new version of Node, you might need to reboot your operating system, reopen Visual Studio Code, and reopen your test folder (project).

1. When Cloud Shell opens, 




1. If you have not already set up an Azure storage account, the following screen appears. Select **Create storage**.

    ![You have no storage mounted](media/configure-vs-code-extension-for-terraform/you-have-no-storage-mounted.png)

1. Azure Cloud Shell launches in the shell you previously selected and displays information for the cloud drive it just created for you.

    ![Your cloud drive has been created](media/configure-vs-code-extension-for-terraform/your-cloud-drive-has-been-created-in.png)

1. You can now exit the Cloud Shell.

1. From the menu bar, select **View** > **Command Palette** > **Azure Terraform: init**.

    ![Terraform has been successfully initialized](media/configure-vs-code-extension-for-terraform/terraform-has-been-successfully-initialized.png)

### Visualize the plan

Earlier in this article, you installed GraphViz. Terraform can use GraphViz to generate a visual representation of either a configuration or execution plan. The Azure Terraform Visual Studio Code extension implements this feature via the *visualize* command.

From the menu bar, select **View > Command Palette > Azure Terraform: Visualize**.

![Visualize the plan](media/configure-vs-code-extension-for-terraform/graph.png)

### Create the Terraform execution plan from Visual Studio

The [terraform plan](https://www.terraform.io/docs/commands/plan.html) command is used to check whether the execution plan for a set of changes will do what you intended.

From the menu bar, select **View** > **Command Palette** > **Azure Terraform: plan**.

![Terraform plan](media/configure-vs-code-extension-for-terraform/terraform-plan.png)

### Apply the Terraform execution plan from Visual Studio

Once you're ready to apply the execution plan to your cloud infrastructure, you run [terraform apply](https://www.terraform.io/docs/commands/apply.html).

1. From the menu bar, select **View** > **Command Palette** > **Azure Terraform: apply**.

    ![Terraform apply](media/configure-vs-code-extension-for-terraform/terraform-apply.png)

1. Enter `yes`.

    ![Terraform apply yes](media/configure-vs-code-extension-for-terraform/terraform-apply-yes.png)

1. To see if your new Azure resource group was successfully created, open the Azure portal and select **Resource groups** in the left navigation pane.

    ![Verify your new resource](media/configure-vs-code-extension-for-terraform/verify-resource-group-created.png)

### Destroy a Terraform execution plan from Visual Studio

1. From the menu bar, select **View** > **Command Palette** > **Azure Terraform: destroy**.

    ![Terraform destroy](media/configure-vs-code-extension-for-terraform/terraform-destroy.png)

1. Enter *yes*.

    ![Terraform destroy yes](media/configure-vs-code-extension-for-terraform/terraform-destroy-yes.png)

1. To confirm that Terraform successfully destroyed your new resource group, select **Refresh** on the Azure portal **Resource groups** page. Your resource group will no longer be listed.

    ![Verify resource group was destroyed](media/configure-vs-code-extension-for-terraform/refresh-resource-groups-button.png)

## 3. Exercise: Terraform compute module

In this exercise, you learn how to load the Terraform *compute* module into the Visual Studio Code environment.

### Clone the terraform-azurerm-compute module

1. Use [this link](https://github.com/Azure/terraform-azurerm-compute) to access the Terraform Azure Rm Compute module on GitHub.

1. Select **Clone or download**.

    ![Clone or download](media/configure-vs-code-extension-for-terraform/clone-with-https.png)

**Key points:**
- The folder name `terraform-azurerm-compute` was used in the example.

### Open the folder in Visual Studio Code

1. Launch Visual Studio Code.

1. From the menu bar, select **File > Open Folder** and navigate to and select the folder you created in the previous step.

    ![terraform-azurerm-compute folder](media/configure-vs-code-extension-for-terraform/terraform-azurerm-compute-folder.png)

### Initialize Terraform

Before you can begin using the Terraform commands from within Visual Studio Code, you download the plug-ins for two Azure providers: random and azurerm.

1. In the Terminal pane of the Visual Studio Code IDE, enter `terraform init`.

    ![terraform init command](media/configure-vs-code-extension-for-terraform/terraform-init-command.png)

1. Enter `az login`, press **<Enter**, and follow the on-screen instructions.

### Module test: Using the lint test option

1. From the menu bar, select **View > Command Palette > Azure Terraform: Execute Test**.

1. From the list of test-type options, select **lint**.

    ![Select "lint" as the type of test](media/configure-vs-code-extension-for-terraform/select-type-of-test-lint.png)

1. When the confirmation appears, select **OK**, and follow the on-screen instructions.

    **Key points:**
    - When you execute either the **lint** or **end to end** test, Azure uses a container service to provision a test machine to do the actual test. For this reason, your test results may typically take several minutes to be returned.

After a few moments, you see a listing in the Terminal pane similar to this example:

![Lint test results](media/configure-vs-code-extension-for-terraform/lint-test-results.png)

### Test the module

1. From the menu bar, select **View > Command Palette > Azure Terraform: Execute Test**.

1. From the list of test type options, select **end to end**.

    ![Select "end to end" as the type of test](media/configure-vs-code-extension-for-terraform/select-type-of-test-end-to-end.png)

1. When the confirmation appears, select **OK**, and follow the on-screen instructions.

    **Key points:**
    - When you execute either the **lint** or **end to end** test, Azure uses a container service to provision a test machine to do the actual test. For this reason, your test results may typically take several minutes to be returned.

After a few moments, you see a listing in the Terminal pane similar to this example:

![Test results](media/configure-vs-code-extension-for-terraform/end-to-end-test-results.png)

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [List of the Terraform modules available for Azure (and other supported providers)](https://registry.terraform.io/)