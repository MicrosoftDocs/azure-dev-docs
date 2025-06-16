---
title: Manage virtual machines with Azure Explorer for IntelliJ
description: Learn how to manage your Azure virtual machines by using the Azure Explorer for IntelliJ.
ms.date: 03/14/2022
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
---

# Manage virtual machines by using the Azure Explorer for IntelliJ

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing virtual machines in their Azure account from inside the IntelliJ integrated development environment (IDE).

This article demonstrates how to create and manage virtual machines through the Azure Explorer on IntelliJ.

[!INCLUDE [prerequisites](includes/prerequisites.md)]

[!INCLUDE [show-azure-explorer](includes/show-azure-explorer.md)]

## Create a virtual machine

To create a virtual machine by using the Azure Explorer, use the following steps:

1. Sign in to your Azure account by using the steps in [Sign-in instructions for the Azure Toolkit for IntelliJ].

1. In the **Azure Explorer** view, expand the **Azure** node, right-click **Virtual Machines**, and then click **Create**.

   :::image type="content" source="media/managing-virtual-machines-using-azure-explorer/CR01.png" alt-text="Create VM option in Azure Explorer.":::

1. In the **Basic** window, enter the following information:

   * **Project Details**:

      * **Subscription**: Specifies the subscriptions that you'll use for your virtual machine.

      * **Resource group**: Specifies the resource group for your virtual machine. Select one of the following options:

         * **Create new**: Specifies that you want to create a new resource group and click **+** to finish.

         * **Use existing**: Specifies that you want to select from a list of resource groups that are associated with your Azure account.

      * **Instance Details**:

         * **Virtual machine name**: Specifies the name for your new virtual machine, which must start with a letter and contain only letters, numbers, and hyphens.

         * **Region**: Specifies where your virtual machine will be created - for example, **West US**.

         * **Availability options**: Specifies an optional availability set that your virtual machine can belong to. You can select an existing availability set, or if your virtual machine won't belong to an availability set, select **(No infrastructure redundancy required)**.

         * **Image**: Specifies that you'll choose a marketplace image by providing the following information (use Shift+Enter to navigate between fields):

            * **Publisher**: Specifies the publisher that created the image that you'll use for your virtual machine - for example, **Microsoft**.

            * **Offer**: Specifies the virtual machine offering to use from the selected publisher - for example, **JDK**.

            * **Sku**: Specifies the stockkeeping unit (SKU) to use from the selected offering - for example, **JDK_8**.

            * **Image**: Specifies which version of the selected image to use.

         * **Size**: Specifies the number of cores and memory to allocate for your virtual machine.

      * **Administrator  Account**:

         * **Authentication type**: Specifies the administrator account will use SSH public key or password for authentication.

         * **User name**: Specifies the administrator account to create for managing your virtual machine.

         * **Password**: Specifies the password for your administrator account. Re-enter your password in the **Confirm password** box to validate the credential if you use password for authentication.

      * **Inbound Port Rules**:

         * **Select inbound ports**:  Specifies which virtual machine network ports are accessible from the public internet.

1. In the **Networking** window, enter the following information:

   * **Network Interface**:

      * **Virtual Network** and **Subnet**: Specifies the virtual network and subnet that your virtual machine will connect to. You can use an existing network and subnet, or you can create a new network and subnet.

      * **Public IP**: Specifies an external-facing IP address for your virtual machine. You can choose to create a new IP address or, if your virtual machine won't have a public IP address, you can select **(None)**.

      * **Security group**: Specifies an optional networking firewall for your virtual machine. You can select an existing firewall or, if your virtual machine won't use a network firewall, you can select **(None)**.

      * **Select inbound ports**: Specifies which virtual machine network ports are accessible from the public internet.

1. In the **Advanced** window, enter the following information:

   * **Storage account**:

      * **Storage account**: Specifies the storage account to use for storing your virtual machine. You can choose an existing storage account or create a new account. If you choose **Create New**, you need to specify all necessary options. For more information, you can see [Storage Account].

   * **Azure Spot Instance**:

      * **Enable Azure Spot instance**: Specifies Azure Spot Virtual Machines to take advantage of your unused capacity at a significant cost savings. For more information, you can see [Use Azure Spot Virtual Machines].

1. Click **Finish**. Your new virtual machine appears in the Azure Explorer tool window.

## Restart a virtual machine

To restart a virtual machine by using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Restart**.

   ![The restart virtual machine confirmation window.][RE01]

## Stop a virtual machine

To stop a running virtual machine by using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Stop**.

## Delete a virtual machine

To delete a virtual machine by using the Azure Explorer in IntelliJ, use the following steps:

1. In the **Azure Explorer** view, right-click the virtual machine, and then select **Delete**.

1. In the confirmation window, click **Yes**.

   ![The delete virtual machine confirmation window.][DE02]

## Next steps

For more information about Azure virtual-machine sizes and pricing, see the following resources:

* Azure virtual-machine sizes
  * [Sizes for Windows virtual machines in Azure]
  * [Sizes for Linux virtual machines in Azure]
* Azure virtual-machine pricing
  * [Windows virtual-machine pricing]
  * [Linux virtual-machine pricing]

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

[Sign-in instructions for the Azure Toolkit for IntelliJ]: ./sign-in-instructions.md
[Storage Account]: ./managing-storage-accounts-using-azure-explorer.md
[Use Azure Spot Virtual Machines]:/azure/virtual-machines/spot-vms
[Sizes for Windows virtual machines in Azure]: /azure/virtual-machines/sizes
[Sizes for Linux virtual machines in Azure]: /azure/virtual-machines/sizes
[Windows virtual-machine pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/windows/
[Linux virtual-machine pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/linux/

<!-- IMG List -->

[RE01]: media/managing-virtual-machines-using-azure-explorer/RE01.png
[RE02]: media/managing-virtual-machines-using-azure-explorer/RE02.png

[SH01]: media/managing-virtual-machines-using-azure-explorer/SH01.png

[DE01]: media/managing-virtual-machines-using-azure-explorer/DE01.png
[DE02]: media/managing-virtual-machines-using-azure-explorer/DE02.png

[CR01]: media/managing-virtual-machines-using-azure-explorer/CR01.png
[CR02]: media/managing-virtual-machines-using-azure-explorer/CR02.png
[CR03]: media/managing-virtual-machines-using-azure-explorer/CR03.png
[CR04]: media/managing-virtual-machines-using-azure-explorer/CR04.png
[CR05]: media/managing-virtual-machines-using-azure-explorer/CR05.png
[CR06]: media/managing-virtual-machines-using-azure-explorer/CR06.png
[CR07]: media/managing-virtual-machines-using-azure-explorer/CR07.png
[CR08]: media/managing-virtual-machines-using-azure-explorer/CR08.png
