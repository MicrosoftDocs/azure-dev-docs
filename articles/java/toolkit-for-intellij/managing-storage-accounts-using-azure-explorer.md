---
title: Manage storage accounts with Azure Explorer for IntelliJ
description: Learn how to manage your Azure storage accounts by using the Azure Explorer for IntelliJ.
ms.date: 03/14/2022
author: KarlErickson
ms.author: karler
ms.reviewer: jialuogan
ms.topic: how-to
ms.custom: devx-track-java, devx-track-extended-java
---

# Manage storage accounts by using the Azure Explorer for IntelliJ

> [!NOTE]
> The Storage Accounts feature in Azure Explorer is deprecated. You can utilize the Azure portal to create and manage storage accounts and containers. See the [Azure Storage](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation for quickstarts on how to manage storage accounts.

The Azure Explorer, which is part of the Azure Toolkit for IntelliJ, provides Java developers with an easy-to-use solution for managing storage accounts in their Azure account from inside the IntelliJ integrated development environment (IDE).

[!INCLUDE [prerequisites](includes/prerequisites.md)]

[!INCLUDE [show-azure-explorer](includes/show-azure-explorer.md)]

## Create a storage account

To create a storage account by using the Azure Explorer, use the following steps:

1. Sign in to your Azure account by using the steps in [Sign-in instructions for the Azure Toolkit for IntelliJ].

1. In the **Azure Explorer** view, expand the **Azure** node, right-click **Storage Account**, and then click **Create**.

1. In the **Create Storage Account** dialog box, specify the following options:

   * **Project details**:

      * **Subscription**: Specifies the Azure subscription that you want to use for the new storage account.

      * **Resource Group**: Specifies the resource group for your storage account. Select one of the following options:

         * **Create new**: Specifies that you want to create a new resource group by clicking **+** to finish.

         * **Use existing**: Specifies that you'll select from a dropdown list of resource groups that are associated with your Azure account.

   * **Instance details**:

      * **Account name**: Specifies the name for the new storage account, which must be between 3 and 24 characters long, start with a letter, and contain only lowercase letters and numbers.

      * **Account location**:  Specifies the location where your storage account will be created - for example, **West US**.

      * **Performance**: Specifies which storage account offering to use from the selected publisher - for example, **Premium**. For more information, see [Azure storage scalability and performance targets].

      * **Redundancy**: Specifies the replication for the storage account - for example, **Zone-Redundant**. For more information, see [Azure storage replication].

      * **Kind**: Specifies the type of storage account to create - for example, **Block Blobs storage**. And this option will show only if you choose "Premium" in the **Performance**. For more information, see [About Azure storage accounts].

1. When you've specified all of the preceding options, click **OK**.

## Delete a storage account

To delete a storage account by using the Azure Explorer, use the following steps:

1. In the **Azure Explorer** view, right-click the storage account, and then select **Delete**.

1. In the confirmation window, click **Yes**.

## Next steps

For more information about Azure storage accounts, sizes, and pricing, see the following resources:

* [Introduction to Microsoft Azure Storage]
* [About Azure storage accounts]
* Azure storage-account sizes
  * [Sizes for Windows storage accounts in Azure]
  * [Sizes for Linux storage accounts in Azure]
* Azure storage-account pricing
  * [Windows storage-account pricing]
  * [Linux storage-account pricing]

[!INCLUDE [additional-resources](includes/additional-resources.md)]

<!-- URL List -->

[Sign-in instructions for the Azure Toolkit for IntelliJ]: ./sign-in-instructions.md
[Introduction to Microsoft Azure Storage]: /azure/storage/common/storage-introduction
[About Azure storage accounts]: /azure/storage/storage-create-storage-account
[Azure storage replication]: /azure/storage/storage-redundancy
[Azure storage scalability and Performance Targets]: /azure/storage/storage-scalability-targets
[Naming and referencing containers, blobs, and metadata]: /rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata

[Sizes for Windows storage accounts in Azure]: /azure/virtual-machines/sizes
[Sizes for Linux storage accounts in Azure]: /azure/virtual-machines/sizes
[Windows storage-account pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/windows/
[Linux storage-account pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/linux/

<!-- IMG List -->

[CS01]: media/managing-storage-accounts-using-azure-explorer/CS01.png
[CS02]: media/managing-storage-accounts-using-azure-explorer/CS02.png
[CC01]: media/managing-storage-accounts-using-azure-explorer/CC01.png
[CC02]: media/managing-storage-accounts-using-azure-explorer/CC02.png

[DS01]: media/managing-storage-accounts-using-azure-explorer/DS01.png
[DS02]: media/managing-storage-accounts-using-azure-explorer/DS02.png
[DC01]: media/managing-storage-accounts-using-azure-explorer/DC01.png
[DC02]: media/managing-storage-accounts-using-azure-explorer/DC02.png
