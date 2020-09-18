---
title: Manage storage accounts with Azure Explorer for Eclipse
description: Learn how to manage your Azure storage accounts by using the Azure Explorer for Eclipse.
documentationcenter: java
ms.date: 08/25/2020
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
---

# Manage storage accounts by using the Azure Explorer for Eclipse

> [!NOTE]
> The Storage Accounts feature in Azure Explorer is deprecated. You can utilize the Azure portal to create and manage storage accounts and containers. See the [Azure Storage](/azure/storage/blobs/storage-quickstart-blobs-portal) documentation for quickstarts on how to manage storage accounts.

Azure Explorer, which is part of the Azure Toolkit for Eclipse, provides Java developers with an easy-to-use solution for managing storage accounts in their Azure account from inside the Eclipse integrated development environment (IDE).

[!INCLUDE [prerequisites](includes/prerequisites.md)]

[!INCLUDE [show-azure-explorer](includes/show-azure-explorer.md)]

## Create a storage account

1. Sign in to your Azure account by using the [Sign-in instructions for the Azure Toolkit for Eclipse](./sign-in-instructions.md).

1. In the **Azure Explorer** view, expand the **Azure** node, right-click **Storage Accounts**, and then click **Create Storage Account**.

1. In the **Create Storage Account** dialog box, specify the following options:

   * **Name**: Specifies the name for the new storage account.

   * **Subscription**: Specifies the Azure subscription that you want to use for the new storage account.

   * **Resource Group**: Specifies the resource group for your virtual machine. Select one of the following options:
      * **Create New**: Specifies that you want to create a new resource group.
      * **Use Existing**: Specifies that you will select from a list of resource groups that are associated with your Azure account.

   * **Region**: Specifies the location where your storage account will be created (for example, "West US").

   * **Account kind**: Specifies the type of storage account to create (for example, "General purpose v1"). For more information, see [About Azure storage accounts].

   * **Performance**: Specifies which storage account offering to use from the selected publisher (for example, "Standard"). For more information, see [Azure storage scalability and performance targets].

   * **Replication**: Specifies the replication for the storage account (for example, "Locally Redundant"). For more information, see [Azure storage replication].

1. When you have specified all of the preceding options, click **Create**.

## Create and manage storage containers

To create and manage storage containers, visit the Azure portal or programatically provision your resources.

See [Upload, download, and list blobs with the Azure portal](/azure/storage/blobs/storage-quickstart-blobs-portal) for a step-by-step tutorial on how to use the Azure portal to create a container in Azure Storage, and to upload and download block blobs in that container.

## Delete a storage account

1. In the **Azure Explorer** view, right-click the storage account, and then click **Delete**.

1. In the confirmation window, click **OK**.


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

[Introduction to Microsoft Azure Storage]: /azure/storage/common/storage-introduction
[About Azure storage accounts]: /azure/storage/storage-create-storage-account
[Azure storage replication]: /azure/storage/storage-redundancy
[Azure storage scalability and Performance Targets]: /azure/storage/storage-scalability-targets
[Naming and referencing containers, blobs, and metadata]: https://go.microsoft.com/fwlink/?LinkId=255555

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