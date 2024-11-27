---
title: Quickstart - Export a Resource in the Azure portal
description: Learn how to use the Azure portal to Generate Terraform Configurations
keywords: azure devops terraform lab resource
ms.topic: quickstart
ms.date: 10/01/2024
ms.custom: devx-track-terraform
author: stema
ms.author: stema
---

# Quickstart: Export a virtual machine in the Azure portal

**Applies to:** :heavy_check_mark: Any management plane resources from the [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) or [AzAPI](/azure/templates/) provider.

Existing Azure resources can be exported to Terraform through the Azure portal. This quickstart shows you how to use the Azure portal to export a resource group.

> [!div class="checklist"]
> * Create a test Azure resource group using Azure CLI or Azure PowerShell.
> * Create a test Linux virtual machine using Azure CLIor Azure PowerShell.
> * Export the state for the resource group and virtual machine from Azure to Terraform.
> * Test that the local state matches the state of the resources in Azure.

## Prerequisites

- [Set up an Azure account](https://azure.microsoft.com/)
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Sign in to Azure

Sign in to the [Azure portal with the experimental Terraform feature flag enabled](https://ms.portal.azure.com/?exp.terraformEnabled=true#home).

## Setup Virtual Machine

### Azure CLI or Azure PowerShell
[!INCLUDE [Create sample virtual machine](../includes/create-vm.md)]

### Azure portal
1. Under **Azure Services**, select **Virtual machines**. If you don't see **Virtual machines**, search for it in the search bar.
1. In the **Virtual machines** page, select **Create**, to see a dropdown. Select **Azure virtual machine**.
1. Under **Virtual Machine Name**, type in **myVM**.
1. Under **Resource Group Name**, select **Create new**, and type in **myResourceGroup**.
1. Leave everything else as default. Select **Review + create**.
1. Verify everything is configured properly, then select **Create**.

## Register resource provider

### Azure CLI or Azure PowerShell
1. Run the command `az provider register -n Microsoft.AzureTerraform`
1. Register the feature flag: `az feature register --namespace Microsoft.AzureTerraform -n private`. This is a private preview feature thus you need to wait for manual approval from Microsoft internal team to use the feature. Check the status of your feature registration by running `az feature show --namespace Microsoft.AzureTerraform --name private`.

## Export resource group

Export the existing resource group to Terraform.

1. On the overview page for your resource group, expand the **Automation** tab, and select **Export Template**.

2. In the **Export Template** page, select Terraform.

3. Select either the `AzureRM` or `AzAPI` provider. Code can also be generated for both providers at once for side by side comparison.

4. Review the generated code.

5. Use the copy template button to paste directly into your code editor. Alternatively, use the download button to get a ZIP folder with the terraform configuration file.

## Clean up resources

### Delete resources
When no longer needed, you can delete the resource group, virtual machine, and all related resources.

1. At the top of the page for the resource group, select **Delete resource group**. 
1. A page opens warning you that you're about to delete resources. Type the name of the resource group and select **Delete** to finish deleting the resources and the resource group.

### Auto-shutdown
If the virtual machine is still needed, Azure provides an Auto-shutdown feature for virtual machines to help manage costs and ensure you're not billed for unused resources.

1. On the **Operations** section for the virtual machine, select the **Auto shutdown** option.
1. A page opens where you can configure the auto shutdown time. Select the **On** option to enable and then set a time that works for you.
1. Once you set the time, select **Save**  at the top to enable your Auto-shutdown configuration.

> [!NOTE]
> Remember to configure the time zone correctly to match your requirements, as (UTC) Coordinated Universal Time is the default setting in the Time zone dropdown.

For more information, see [Auto shutdown](/azure/virtual-machines/auto-shutdown-virtual machine).

## Next steps

In this quickstart, you deployed a simple virtual machine and exported the configuration to Terraform code.

> [!div class="nextstepaction"]
> [Learn more about Terraform on Azure](../overview.md)