---
title: Use Azure Managed Disks through the Azure Libraries for Python
description: Use the Azure SDK to create, resize, and update managed disks.
ms.topic: conceptual
ms.date: 11/18/2020
ms.custom: devx-track-python
---

# Use Azure Managed Disks with the Azure libraries (SDK) for Python

Azure Managed Disks provide a simplified disk management, enhanced scalability, better security, and better scaling without having to work directly with storage accounts.

You use the [`azure-mgmt-compute`](/python/api/overview/azure/virtualmachines) library to administer Managed Disks. (For an example of provisioning a virtual machine with the `azure-mgmt-compute` library, see [Example - Provision a virtual machine](azure-sdk-example-virtual-machines.md).)

## Standalone Managed Disks

You can create standalone Managed Disks in a number of ways as illustrated in the following sections.

### Create an empty Managed Disk

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/empty_disk.py":::

### Create a Managed Disk from blob storage

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_from_blob.py":::

### Create a Managed Disk image from blob storage

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_image_from_blob.py":::

### Create a Managed Disk from your own image

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_from_image.py":::

## Virtual machine with Managed Disks

You can create a Virtual Machine with an implicit Managed Disk for a specific disk image, which relieves you from specifying all the details.

A Managed Disk is created implicitly when creating VM from an OS image in Azure. In the `storage_profile` parameter, the `os_disk` is optional and you don't have to create a storage account as required precondition to create a Virtual Machine.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_with_managed_disks.py":::

For a complete example on how to create a virtual machine using the Azure management libraries, for Python, see [Example - Provision a virtual machine](azure-sdk-example-virtual-machines.md).

You can also create a `storage_profile` from your own image:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/storage_profile_from_image.py":::

You can easily attach a previously provisioned Managed Disk.:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/attach_disk_to_vm.py":::

## Virtual machine scale sets with Managed Disks

Before Managed Disks, you needed to create a storage account manually for all the VMs you wanted inside your Scale Set, and then use the list parameter `vhd_containers` to provide all the storage account name to the Scale Set RestAPI. (For a migration guide, see [Convert a scale set template to a manage disk scale set template](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-convert-template-to-md).)

Because you don't need to manage storage accounts with Azure Managed Disks, your `storage_profile` can now be exactly the same as the one used in VM creation:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_scale_set.py" range="15-22":::

The full sample is as follows:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_scale_set.py":::

## Other operations with Managed Disks

### Resizing a Managed Disk

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/resize_disk.py":::

### Update the storage account type of the Managed Disks

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/update_storage_type.py":::

### Create an image from blob storage

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/create_image_from_blob.py":::

### Create a snapshot of a Managed Disk that is currently attached to a virtual machine

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/create_snapshot.py":::

## See also

- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision and use a MySQL database](azure-sdk-example-database.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
