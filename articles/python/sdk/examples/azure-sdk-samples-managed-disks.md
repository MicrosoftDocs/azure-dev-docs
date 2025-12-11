---
title: Use Azure Managed Disks through the Azure SDK for Python
description: Use the Azure Python SDK to create, resize, and update Managed Disks standalone, in a virtual machine, or in a Virtual Machine Scale Set.
ms.topic: article
ms.date: 06/11/2025
ms.custom: devx-track-python, py-fresh-zinc
---

# Use Azure Managed Disks with the Azure libraries (SDK) for Python

Azure Managed Disks are high-performance, durable block storage designed for use with Azure Virtual Machines and Azure VMware Solution. They simplify disk management, offer greater scalability, enhance security, and eliminate the need to manage storage accounts directly. For more information, see [Azure Managed Disks](/azure/virtual-machines/managed-disks-overview).

For operations on Managed Disks associated with an existing VM, use the [`azure-mgmt-compute`](/python/api/overview/azure/virtualmachines) library.

The code examples in this article demonstrate common operations with Managed Disks using the `azure-mgmt-compute` library. These examples are not meant to be run as standalone scripts, but rather to be integrated into your own code. To learn how to create a `ComputeManagementClient` instance from `azure.mgmt.compute` in your script, see [Example - Create a virtual machine](azure-sdk-example-virtual-machines.md).

For more complete examples of how to use the `azure-mgmt-compute` library, see [Azure SDK for Python samples for compute](https://github.com/Azure-Samples/azure-samples-python-management/tree/main/samples/compute) in GitHub.

## Standalone Managed Disks

The following examples show different ways to provision standalone Managed Disks.

### Create an empty Managed Disk

This example shows how to create a new empty Managed Disk. You can use it as a blank disk to attach to a virtual machine or as a starting point for creating snapshots or images.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/empty_disk.py":::

### Create a Managed Disk from blob storage

This example shows how to create a Managed Disk from a VHD file stored in Azure Blob Storage. This is helpful when you want to reuse or move an existing virtual hard disk into Azure.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_from_blob.py":::

### Create a Managed Disk image from blob storage

This example shows how to create a Managed Disk image from a VHD file stored in Azure Blob Storage. This is useful when you want to make a reusable image that can be used to create new virtual machines.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_image_from_blob.py":::

### Create a Managed Disk from your own image

This example shows how to create a new Managed Disk by copying an existing one. This is helpful when you want to make a backup or use the same disk setup on another virtual machine.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/disk_from_image.py":::

## Virtual machine with Managed Disks

You can create a virtual machine with an implicitly created Managed Disk based on a specific disk image, eliminating the need to manually define all disk details.

A Managed Disk is created implicitly when creating a VM from an OS image in Azure. Azure automatically handles the storage account, so you don't need to specify `storage_profile.os_disk` or create a storage account manually.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_with_managed_disks.py":::

For a complete example showing how to create a virtual machine using the Azure management libraries for Python, see [Example - Create a virtual machine](azure-sdk-example-virtual-machines.md). This example demonstrates how to use the `storage_profile` parameter.

You can also create a `storage_profile` from your own image:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/storage_profile_from_image.py":::

You can easily attach a previously provisioned Managed Disk:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/attach_disk_to_vm.py":::

## Virtual Machine Scale Sets with Managed Disks

Before Azure Managed Disks, you had to manually create a storage account for each VM in your Virtual Machine Scale Set and use the `vhd_containers` parameter to specify those storage accounts in the Scale Set REST API.

With Azure Managed Disks, storage account management is no longer required. As a result, the `storage_profile` for [Virtual Machine Scale Sets](/azure/virtual-machine-scale-sets/overview) used for Virtual Machine Scale Sets can now match the one used for individual VM creation:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_scale_set.py" range="15-22":::

The full sample is as follows:

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/vm_scale_set.py":::

## Other operations with Managed Disks

### Resizing a Managed Disk

This example shows how to make an existing Managed Disk larger. This is useful when you need more space for your data or applications.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/resize_disk.py":::

### Update the storage account type of the Managed Disks

This example shows how to change the storage type of a Managed Disk and make it larger. This is helpful when you need more space or better performance for your data or applications.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/update_storage_type.py":::

### Create an image from blob storage

This example shows how to create a Managed Disk image from a VHD file stored in Azure Blob Storage. This is useful when you want to make a reusable image that you can use to create new virtual machines.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/create_image_from_blob.py":::

### Create a snapshot of a Managed Disk that is currently attached to a virtual machine

This example shows how to take a snapshot of a Managed Disk that's attached to a virtual machine. You can use the snapshot to back up the disk or restore it later if needed.

:::code language="python" source="~/../python-sdk-docs-examples/managed_disk/create_snapshot.py":::

## See also

- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Create and use a MySQL database](azure-sdk-example-database.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
