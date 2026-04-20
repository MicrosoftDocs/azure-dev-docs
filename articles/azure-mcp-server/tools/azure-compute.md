---
title: Azure MCP Server tools for Azure Compute
description: Discover Azure Compute tools for managing virtual machines, virtual machine scale sets, and disks in Azure MCP Server. Explore features and start optimizing your resources.
#customer intent: As a system admin, I want to list all Virtual Machine Scale Sets in a subscription so I can manage their capacity and upgrade policies.
ms.date: 04/07/2026
ms.service: azure-mcp-server
ms.topic: concept-article
reviewer: audreytoney
tool_count: 12
mcp-cli.version: 2.0.0-beta.39
---

# Azure MCP Server tools for Azure Compute overview

The Azure MCP Server tools help you manage virtual machines, virtual machine scale sets, and disks by using natural language prompts. By using key capabilities such as creating, retrieving, and updating resources, you can efficiently control your cloud environment.

Azure Compute provides scalable computing resources for applications and workloads. For more information, see [Azure Compute documentation](/azure/virtual-machines/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Managed disk: create

<!-- @mcpcli compute disk create -->

Creates a new Azure managed disk in the specified resource group. You can create empty disks (specify `size-gb`), disks from a source such as a snapshot, another managed disk, or a blob URI (specify `source`), disks from a Shared Image Gallery image version (specify `gallery-image-reference`), or disks ready for upload (specify `upload-type` and `upload-size-bytes`). If you don't specify the location, it defaults to the resource group's location. You can configure disk size, storage SKU (for example, `Premium_LRS`, `Standard_LRS`, `UltraSSD_LRS`), OS type, availability zone, hypervisor generation, tags, encryption settings, performance tier, shared disk, on-demand bursting, and IOPS/throughput limits for UltraSSD disks. Create a disk with network access policy `DenyAll`, `AllowAll`, or `AllowPrivate`, and associate a disk access resource during creation.

Example prompts include:
- "Create a 128 GB managed disk named `<disk-name>` in resource group `<resource-group>`"
- "Create a new `Premium_LRS` disk called `<disk-name>` in resource group `<resource-group>` with 256 GB"
- "Create a managed disk `<disk-name>` in resource group `<resource-group>` in `eastus`"
- "Create a disk from snapshot `<snapshot-resource-id>` in resource group `<resource-group>`"
- "Create a managed disk `<disk-name>` in resource group `<resource-group>` from blob `<blob-uri>`"
- "Create a 64 GB `Standard_LRS` Linux disk named `<disk-name>` in resource group `<resource-group>` in zone 1"
- "Create a managed disk `<disk-name>` in resource group `<resource-group>` with tags env=prod team=infra"
- "Create a 128 GB `Premium_LRS` disk named `<disk-name>` in resource group `<resource-group>` with performance tier `P30`"
- "Create a disk `<disk-name>` in resource group `<resource-group>` with customer-managed encryption using disk encryption set `<disk-encryption-set-id>`"
- "Create a managed disk from gallery image version `<image-version-resource-id>` in resource group `<resource-group>`"
- "Create a data disk from LUN 0 of gallery image version `<image-version-resource-id>` in resource group `<resource-group>`"
- "Create a disk ready for upload named `<disk-name>` in resource group `<resource-group>` with upload size 20972032 bytes"
- "Create a Trusted Launch upload disk named `<disk-name>` in resource group `<resource-group>` with `UploadWithSecurityData` type and security type `TrustedLaunch`"
- "Create an `UltraSSD_LRS` disk named `<disk-name>` in resource group `<resource-group>` with 256 GB, 10000 IOPS, and 500 MBps throughput"
- "Create a shared managed disk named `<disk-name>` in resource group `<resource-group>` with 512 GB and max shares set to 3"
- "Create a managed disk `<disk-name>` in resource group `<resource-group>` with network access policy `DenyAll` and disk access `<disk-access-resource-id>`"
- "Create a 128 GB managed disk named `<disk-name>` in resource group `<resource-group>` with on-demand bursting enabled"
- "Create a managed disk `<disk-name>` in resource group `<resource-group>` with encryption type `EncryptionAtRestWithPlatformAndCustomerKeys`"
- "Create a V2 hypervisor generation disk named `<disk-name>` in resource group `<resource-group>` with 128 GB"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Disk name** | Required | The name of the disk. |
| **Resource group** | Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **Disk access** | Optional | Resource ID of the disk access resource for using private endpoints on disks. |
| **Disk encryption set** | Optional | Resource ID of the disk encryption set to use for enabling encryption at rest. |
| **Disk iops read write** | Optional | The number of IOPS allowed for this disk. Only settable for UltraSSD disks. |
| **Disk mbps read write** | Optional | The bandwidth allowed for this disk in MBps. Only settable for UltraSSD disks. |
| **Enable bursting** | Optional | Enable on-demand bursting beyond the provisioned performance target of the disk. Doesn't apply to Ultra disks. Accepted values: `true`, `false`. |
| **Encryption type** | Optional | Encryption type of the disk. Accepted values: `EncryptionAtRestWithCustomerKey`, `EncryptionAtRestWithPlatformAndCustomerKeys`, `EncryptionAtRestWithPlatformKey`. |
| **Gallery image reference** | Optional | Resource ID of a Shared Image Gallery image version to use as the source for the disk. Format: /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/galleries/{gallery}/images/{image}/versions/{version}. |
| **Gallery image reference lun** | Optional | LUN (Logical Unit Number) of the data disk in the gallery image version. If specified, the disk is created from the data disk at this LUN. If not specified, the disk is created from the OS disk of the image. |
| **Hyper v generation** | Optional | The hypervisor generation of the Virtual Machine. Applicable to OS disks only. Accepted values: `V1`, `V2`. |
| **Location** | Optional | The Azure region/location. Defaults to the resource group's location if not specified. |
| **Max shares** | Optional | The maximum number of VMs that can attach to the disk at the same time. A value greater than one indicates a shared disk. |
| **Network access policy** | Optional | Policy for accessing the disk via network. Accepted values: `AllowAll`, `AllowPrivate`, `DenyAll`. |
| **Os type** | Optional | The Operating System type of the disk. Accepted values: `Linux`, `Windows`. |
| **Security type** | Optional | Security type of the managed disk. Accepted values: `ConfidentialVM_DiskEncryptedWithCustomerKey`, `ConfidentialVM_DiskEncryptedWithPlatformKey`, `ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey`, `Standard`, `TrustedLaunch`. Required when `upload-type` is `UploadWithSecurityData`. |
| **Size gb** | Optional | Size of the disk in GB. Max size: 4095 GB. |
| **SKU** | Optional | Underlying storage SKU. Accepted values: `Premium_LRS`, `PremiumV2_LRS`, `Premium_ZRS`, `StandardSSD_LRS`, `StandardSSD_ZRS`, `Standard_LRS`, `UltraSSD_LRS`. |
| **Source** | Optional | Source to create the disk from, including a resource ID of a snapshot or disk, or a blob URI of a VHD. When a source is provided, `size-gb` is optional and defaults to the source size. |
| **Tags** | Optional | Space-separated tags in 'key=value' format. Use '' to clear existing tags. |
| **Tier** | Optional | Performance tier of the disk (for example, `P10`, `P15`, `P20`, `P30`, `P40`, `P50`, `P60`, `P70`, `P80`). Applicable to Premium SSD disks only. |
| **Upload size bytes** | Optional | The size in bytes (including the VHD footer of 512 bytes) of the content to be uploaded. Required when `upload-type` is specified. |
| **Upload type** | Optional | Type of upload for the disk. Accepted values: `Upload`, `UploadWithSecurityData`. When specified, the disk is created in a `ReadyToUpload` state. |
| **Zone** | Optional | Availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Managed disk: delete

<!-- @mcpcli compute disk delete -->

Delete an Azure managed disk from the specified resource group. This operation is idempotent - it returns success whether the disk was removed or didn't exist.

Example prompts include:

- "Delete the managed disk 'temp-data-disk' in resource group 'dev-rg'."
- "Remove managed disk 'old-backup-disk' from resource group 'prod-rg'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Disk name** | Required | The name of the disk to delete. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Managed disk: list or get

<!-- @mcpcli compute disk get -->

Lists available Azure managed disks or retrieves detailed information about a specific disk. You can view all disks in a subscription or in a specific resource group, including disk size, SKU, provisioning state, and OS type. The tool supports wildcard patterns in disk names (for example, `win_OsDisk*`). If you provide a disk name without specifying a resource group, it searches across the entire subscription. Specifying a resource group scopes the search to that resource group. Both parameters are optional.

Example prompts include:
- "List all managed disks in my subscription."
- "Show me all disks in resource group `<resource-group>`."
- "Get details of disk `<disk-name>`."
- "What are the available disk sizes?"
- "Show me the disks with name pattern `win_OsDisk*` in resource group `<resource-group>`."
- "Get information about disk `<disk-name>` in resource group `<resource-group>`."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Disk name** | Optional | The name of the disk. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Managed disk: update

<!-- @mcpcli compute disk update -->

Update or modify properties of an existing Azure managed disk that you previously created. If you don't specify the resource group, the disk is located by name within the subscription. This operation supports changing disk size (only increases are allowed), storage SKU, IOPS and throughput limits (for UltraSSD only), maximum shares for shared disk attachments, on-demand bursting, tags, encryption settings, disk access, and performance tier. You can modify the network access policy to `DenyAll`, `AllowAll`, or `AllowPrivate` on an existing disk. Only specified properties are updated; unspecified properties remain unchanged.

Example prompts include:
- "Update disk `<disk-name>` in resource group `<resource-group>` to 1024 GB"
- "Change the SKU of disk `<disk-name>` to `UltraSSD_LRS`"
- "Resize disk `<disk-name>` in resource group `<resource-group>` to 2048 GB"
- "Update disk `<disk-name>` to disable bursting"
- "Set the max shares on disk `<disk-name>` to 3"
- "Change the network access policy of disk `<disk-name>` to `AllowPrivate`"
- "Update disk `<disk-name>` in resource group `<resource-group>` with tags `env=production`"
- "Set the IOPS limit on Ultra disk `<disk-name>` in resource group `<resource-group>` to 15000"
- "Update the throughput of disk `<disk-name>` in resource group `<resource-group>` to 1000 MBps"
- "Change the performance tier of disk `<disk-name>` in resource group `<resource-group>` to `P50`"
- "Update disk `<disk-name>` in resource group `<resource-group>` to use disk encryption set `<disk-encryption-set-id>`"
- "Change the encryption type of disk `<disk-name>` in resource group `<resource-group>` to `EncryptionAtRestWithCustomerKey`"
- "Set disk access on disk `<disk-name>` in resource group `<resource-group>` to `<disk-access-resource-id>` with network access policy `DenyAll`"
- "Update disk `<disk-name>` to `PremiumV2_LRS` SKU with 256 GB size and tags `env=test`"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Disk name** |  Required | The name of the disk. |
| **Disk access** |  Optional | Resource ID of the disk access resource for using private endpoints on disks. |
| **Disk encryption set** |  Optional | Resource ID of the disk encryption set to use for enabling encryption at rest. |
| **Disk iops read write** |  Optional | The number of IOPS allowed for this disk. Only settable for UltraSSD disks. |
| **Disk mbps read write** |  Optional | The bandwidth allowed for this disk in MBps. Only settable for UltraSSD disks. |
| **Enable bursting** |  Optional | Enable on-demand bursting beyond the provisioned performance target of the disk. Doesn't apply to Ultra disks. Accepted values: `true`, `false`. |
| **Encryption type** |  Optional | Encryption type of the disk. Accepted values: `EncryptionAtRestWithCustomerKey`, `EncryptionAtRestWithPlatformAndCustomerKeys`, `EncryptionAtRestWithPlatformKey`. |
| **Max shares** |  Optional | The maximum number of VMs that can attach to the disk at the same time. Value greater than one indicates a shared disk. |
| **Network access policy** |  Optional | Policy for accessing the disk via network. Accepted values: `AllowAll`, `AllowPrivate`, `DenyAll`. |
| **Size gb** |  Optional | Size of the disk in GB. Max size: 4095 GB. |
| **SKU** |  Optional | Underlying storage SKU. Accepted values: `Premium_LRS`, `PremiumV2_LRS`, `Premium_ZRS`, `StandardSSD_LRS`, `StandardSSD_ZRS`, `Standard_LRS`, `UltraSSD_LRS`. |
| **Tags** |  Optional | Space-separated tags in `key=value` format. Use `''` to clear existing tags. |
| **Tier** |  Optional | Performance tier of the disk (for example, `P10`, `P15`, `P20`, `P30`, `P40`, `P50`, `P60`, `P70`, `P80`). Applicable to Premium SSD disks only. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Virtual machine: create

<!-- @mcpcli compute vm create -->

Create, deploy, or provision a single Azure Virtual Machine (VM). This command launches a new Linux or Windows VM with either SSH key or password authentication. It automatically creates networking resources (VNet, subnet, NSG, NIC, public IP) if you don't specify them. The default VM size is `Standard_DS1_v2`, and the default OS is Ubuntu 24.04 LTS if you don't specify otherwise.

You can create a Linux VM using an SSH public key by providing the key content or the path to the key file. For example, you can specify your public key file at `~/.ssh/id_rsa.pub`. 

This command doesn't support creating Virtual Machine Scale Sets with multiple identical instances. Instead, use `VMSS create`. 

Example prompts include:
- "Create a new Linux VM named `<vm-name>` with SSH key in resource group `<resource-group>`"
- "Launch a virtual machine with the Ubuntu2404 image in `<resource-group>`"
- "Create a Windows VM named `<vm-name>` with an admin password in resource group `<resource-group>`"
- "Deploy VM `<vm-name>` in `<location>` with `Standard_DS1_v2` size"
- "Spin up a VM with `Standard_B2s` size and no public IP in resource group `<resource-group>`"
- "Create a Linux VM named `<vm-name>` in `<location>` with a custom network security group"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Admin username** |  Required | The admin username for the VM. Required for VM creation. |
| **Location** |  Required | The Azure region or location. Defaults to the resource group's location if you don't specify it. |
| **Resource group** |  Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **VM name** |  Required | The name of the virtual machine. |
| **Admin password** |  Optional | The admin password for Windows VMs or when the SSH key isn't provided for Linux VMs. |
| **Image** |  Optional | The OS image to use. Can be URN (publisher:offer:SKU:version) or an alias like `Ubuntu2404` or `Win2022Datacenter`. Defaults to Ubuntu 24.04 LTS. |
| **Network security group** |  Optional | Name of the network security group to use or create. |
| **No public IP** |  Optional | Don't create or assign a public IP address. |
| **OS disk size GB** |  Optional | OS disk size in GB. Defaults based on image requirements. |
| **OS disk type** |  Optional | OS disk type: `Premium_LRS`, `StandardSSD_LRS`, `Standard_LRS`. Defaults based on VM size. |
| **OS type** |  Optional | The Operating System type of the disk. Accepted values: `Linux`, `Windows`. |
| **Public IP address** |  Optional | Name of the public IP address to use or create. |
| **Source address prefix** |  Optional | Source IP address range for NSG inbound rules (for example, `203.0.113.0/24` or a specific IP). Defaults to `*` (any source). |
| **SSH public key** |  Optional | SSH public key for Linux VMs. Can be the key content or path to a file. |
| **Subnet** |  Optional | Name of the subnet within the virtual network. |
| **Virtual network** |  Optional | Name of an existing virtual network to use. If you don't specify it, the command creates a new one. |
| **VM size** |  Optional | The VM size (for example, `Standard_D2s_v3` or `Standard_B2s`). Defaults to `Standard_DS1_v2` if you don't specify it. |
| **Zone** |  Optional | Availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine: delete

<!-- @mcpcli compute vm delete -->

Delete an Azure virtual machine permanently. This operation is irreversible and the VM data is lost. Use the `Force deletion` parameter to force-delete a VM that is in a running or failed state.

Example prompts include:

- "Delete VM 'test-vm-01' in resource group 'dev-rg'."
- "Remove virtual machine 'staging-web' from resource group 'staging-rg'."
- "Force delete VM 'stuck-vm' in resource group 'prod-rg'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **VM name** | Required | The name of the virtual machine to delete. |
| **Force deletion** | Optional | Force delete the resource even if it's in a running or failed state. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine: list or get

<!-- @mcpcli compute vm get -->

List or get Azure Virtual Machines (VMs) in a subscription or resource group. This command returns VM details, including the name, location, size, provisioning state, OS type, and instance view with runtime status and power state.

Example prompts include:
- "List all virtual machines in my subscription."
- "Show me all VMs in my subscription."
- "What virtual machines do I have?"
- "List virtual machines in resource group `resource-group-name`."
- "Show me VMs in resource group `resource-group-name`."
- "What VMs are in resource group `resource-group-name`?"
- "Get details for virtual machine `vm-name` in resource group `resource-group-name`."
- "Show me virtual machine `vm-name` in resource group `resource-group-name`"
- "What are the details of VM `vm-name` in resource group `resource-group-name`?"
- "Get virtual machine `vm-name` with instance view in resource group `resource-group-name`."
- "Show me VM `vm-name` with runtime status in resource group `resource-group-name`."
- "What is the power state of virtual machine `vm-name` in resource group `resource-group-name`?"
- "Get VM `vm-name` status and provisioning state in resource group `resource-group-name`."
- "Show me the current status of VM `vm-name`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Instance view** |  Optional | Include instance view details (only available when retrieving a specific VM). |
| **VM name** |  Optional | The name of the virtual machine. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Virtual machine: update

<!-- @mcpcli compute vm update -->

Update, modify, or reconfigure an existing Azure virtual machine (VM). You can resize a VM, update tags, configure boot diagnostics, or change user data. You might need to deallocate the VM before resizing it to certain sizes.

Here are some example prompts for using this tool:
- "Add license type `Windows_Server` to VM `<vm-name>` in resource group `<resource-group-name>`"
- "Update user data for VM `<vm-name>` in resource group `<resource-group-name>`"
- "Resize VM `<vm-name>` in resource group `<resource-group-name>` to `Standard_B2s`"
- "Enable boot diagnostics for VM `<vm-name>` in resource group `<resource-group-name>`"

| Parameter            | Required or optional | Description |
|----------------------|----------------------|-------------|
| **Resource group**    | Required             | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **VM name**           | Required             | The name of the virtual machine. |
| **Boot diagnostics**   | Optional             | Enable or disable boot diagnostics: `true` or `false`. |
| **License type**      | Optional             | License type for Azure Hybrid Benefit: `Windows_Server`, `Windows_Client`, `RHEL_BYOS`, `SLES_BYOS`, or `None` to disable. |
| **Tags**              | Optional             | Space-separated tags in `key=value` format. Use `''` to clear existing tags. |
| **User data**         | Optional             | Base64-encoded user data for the VM. Use to update custom data scripts. |
| **VM size**           | Optional             | The VM size (for example, `Standard_D2s_v3`, `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Virtual machine scale set: create

<!-- @mcpcli compute vmss create -->

Create, deploy, or provision an Azure Virtual Machine Scale Set (VMSS) for running multiple identical VM instances. This tool helps you deploy workloads that require horizontal scaling, load balancing, or high availability across instances. The default configuration creates two instances of size Standard_DS1_v2 running Ubuntu 24.04 LTS.

Create a scale set by specifying the `resource group`, `VMSS name`, and `admin username`, along with other optional settings. Here are some example commands:

- "Create a virtual machine scale set named `my-vmss` in resource group `my-rg`."
- "Create a VMSS with four instances in `my-rg`."
- "Deploy a scale set with a Manual upgrade policy and two instances in `my-rg`."
- "Create a Linux VMSS with SSH public key from '`~/.ssh/id_rsa.pub`' in `my-rg`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Admin username** | Required | The admin username for the VM. Required for VM creation. |
| **Location** | Required | The Azure region or location. Defaults to the resource group's location if you don't specify it. |
| **Resource group** | Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **Virtual machine scale set (VMSS) name** | Required | The name of the virtual machine scale set. |
| **Admin password** | Optional | The admin password for Windows VMs or when an SSH key isn't provided for Linux VMs. |
| **Image** | Optional | The OS image to use. Can be a URN (publisher:offer:SKU:version) or alias like `Ubuntu2404`, `Win2022Datacenter`. Defaults to Ubuntu 24.04 LTS. |
| **Instance count** | Optional | Number of VM instances in the scale set. Default is 2. |
| **Os disk size gb** | Optional | OS disk size in GB. Defaults based on image requirements. |
| **Os disk type** | Optional | OS disk type: `Premium_LRS`, `StandardSSD_LRS`, `Standard_LRS`. Defaults based on VM size. |
| **Os type** | Optional | The Operating System type of the disk. Accepted values: Linux, Windows. |
| **Ssh public key** | Optional | SSH public key for Linux VMs. Can be the key content or path to a file. |
| **Subnet** | Optional | Name of the subnet within the virtual network. |
| **Upgrade policy** | Optional | Upgrade policy mode: `Automatic`, `Manual`, or `Rolling`. Default is `Manual`. |
| **Virtual network** | Optional | Name of an existing virtual network to use. If you don't specify it, the tool creates a new one. |
| **VM size** | Optional | The VM size (for example, `Standard_D2s_v3`, `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified. |
| **Zone** | Optional | Availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine scale set: delete

<!-- @mcpcli compute vmss delete -->

Delete an Azure Virtual Machine Scale Set and all its VM instances permanently. This operation is irreversible. Use the `Force deletion` parameter to force-delete a scale set that is in a running or failed state.

Example prompts include:

- "Delete scale set 'web-frontend-vmss' in resource group 'prod-rg'."
- "Remove VMSS 'test-scaleset' from resource group 'dev-rg'."
- "Force delete virtual machine scale set 'stuck-vmss' in resource group 'staging-rg'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **VMSS name** | Required | The name of the virtual machine scale set to delete. |
| **Force deletion** | Optional | Force delete the resource even if it's in a running or failed state. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine scale set: list or get

<!-- @mcpcli compute vmss get -->

List or get Azure Virtual Machine Scale Sets (VMSS) and their instances in a subscription or resource group. This tool returns scale set details, including name, location, SKU, capacity, upgrade policy, and individual VM instance information.

Example prompts include:
- "List all virtual machine scale sets in my subscription."
- "List virtual machine scale sets in resource group `<resource-group-name>`."
- "What scale sets are in resource group `<resource-group-name>`?"
- "Get details for virtual machine scale set `<vmss-name>` in resource group `<resource-group-name>`."
- "Show me VMSS `<vmss-name>` in resource group `<resource-group-name>`."
- "Show me instance `<instance-id>` of VMSS `<vmss-name>` in resource group `<resource-group-name>`."
- "What is the status of instance `<instance-id>` in scale set `<vmss-name>`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Instance ID** |  Optional | The instance ID of the virtual machine in the scale set. |
| **Virtual machine scale set (VMSS) name** |  Optional | The name of the virtual machine scale set. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Virtual machine scale set: update

<!-- @mcpcli compute vmss update -->

Update, modify, or reconfigure an existing Azure Virtual Machine Scale Set (VMSS). You can scale the instance count, resize VMs, change the upgrade policy, or update tags on a scale set. Some changes require `update-instances` to roll out to existing VMs. This tool doesn't create a new VMSS. Use `VMSS create` instead. To update a single VM, use `VM update`.

Example prompts include:
- "Update the capacity of VMSS `myScaleSet` to 15."
- "Enable overprovisioning on the scale set `myScaleSet`."
- "Change the VM size to `Standard_D4s_v3` for `myScaleSet`."
- "Clear existing tags on scale set `myScaleSet` in resource group `myResourceGroup`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **Virtual machine scale set (VMSS) name** |  Required | The name of the virtual machine scale set. |
| **Capacity** |  Optional | Number of VM instances (capacity) in the scale set. |
| **Enable auto os upgrade** |  Optional | Enable automatic OS image upgrades. Requires health probes or the Application Health extension. |
| **Overprovision** |  Optional | Enable or disable overprovisioning. When enabled, Azure provisions more VMs than requested and deletes extra VMs after deployment. |
| **Scale in policy** |  Optional | Scale-in policy to determine which VMs to remove: `Default`, `NewestVM`, or `OldestVM`. |
| **Tags** |  Optional | Space-separated tags in `key=value` format. Use `''` to clear existing tags. |
| **Upgrade policy** |  Optional | Upgrade policy mode: `Automatic`, `Manual`, or `Rolling`. Default is `Manual`. |
| **VM size** |  Optional | The VM size (for example, `Standard_D2s_v3`, `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Virtual Machines documentation](/azure/virtual-machines/)