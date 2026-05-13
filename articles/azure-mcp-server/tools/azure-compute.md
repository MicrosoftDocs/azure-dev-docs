---
title: Azure MCP Server Tools for Azure Compute
description: Discover compute tools for managing virtual machines, virtual machine scale sets, and disks in Azure MCP Server. Explore features and start optimizing your resources.
#customer intent: As a system admin, I want to list all virtual machine scale sets in a subscription so I can manage their capacity and upgrade policies.
ms.date: 05/13/2026
ms.service: azure-mcp-server
ms.topic: concept-article
reviewer: audreytoney
tool_count: 12
mcp-cli.version: 3.0.0-beta.10+7287903f962dd029489594e2ae68842f3e10ac30
---

# Azure MCP Server tools for Azure compute overview

The Azure MCP Server tools help you manage virtual machines (VMs), virtual machine scale sets, and disks by using natural language prompts. By using key capabilities such as creating, retrieving, and updating resources, you can efficiently control your cloud environment.

Azure compute provides scalable computing resources for applications and workloads. For more information, see [Azure Compute documentation](/azure/virtual-machines/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Managed disk: create

<!-- @mcpcli compute disk create -->

With this tool, you can create a new Azure managed disk in the specified resource group. You can create empty disks (specify `size-gb`), disks from a source such as a snapshot, another managed disk, or a blob URI (specify `source`). You can also create disks from a shared image gallery image version (specify `gallery-image-reference`), or disks ready for upload (specify `upload-type` and `upload-size-bytes`). If you don't specify the location, it defaults to the resource group's location.

You can configure disk size, storage SKU (for example, `Premium_LRS`, `Standard_LRS`, or `UltraSSD_LRS`), OS type, availability zone, and hypervisor generation. Other configurations possible include tags, encryption settings, performance tier, shared disk, on-demand bursting, and IOPS/throughput limits for UltraSSD disks. Create a disk with network access policy `DenyAll`, `AllowAll`, or `AllowPrivate`, and associate a disk access resource during creation.

Example prompts include:

- "Create a 128 GB managed disk named `<disk-name>` in resource group `<resource-group>`."

- "Create a new `Premium_LRS` disk called `<disk-name>` in resource group `<resource-group>` with 256 GB."

- "Create a disk from snapshot `<snapshot-resource-id>` in resource group `<resource-group>`."

- "Create a 64-GB `Standard_LRS` Linux disk named `<disk-name>` in resource group `<resource-group>` in zone 1."

- "Create a managed disk from gallery image version `<image-version-resource-id>` in resource group `<resource-group>`."

- "Create a data disk from LUN 0 of gallery image version `<image-version-resource-id>` in resource group `<resource-group>`."

- "Create a disk ready for upload named `<disk-name>` in resource group `<resource-group>` with upload size 20,972,032 bytes."

- "Create a trusted launch upload disk named `<disk-name>` in resource group `<resource-group>` with `UploadWithSecurityData` type and security type `TrustedLaunch`."

- "Create a shared managed disk named `<disk-name>` in resource group `<resource-group>` with 512 GB and max shares set to 3."

- "Create a managed disk `<disk-name>` in resource group `<resource-group>` with network access policy `DenyAll` and disk access `<disk-access-resource-id>`."

- "Create a V2 hypervisor generation disk named `<disk-name>` in resource group `<resource-group>` with 128 GB."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Disk name** | Required | The name of the disk. |
| **Resource group** | Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **Disk access** | Optional | The resource ID of the disk access resource for using private endpoints on disks. |
| **Disk encryption set** | Optional | The resource ID of the disk encryption set to use for enabling encryption at rest. |
| **Disk iops read write** | Optional | The number of IOPS allowed for this disk. Only settable for UltraSSD disks. |
| **Disk mbps read write** | Optional | The bandwidth allowed for this disk in MBps. Only settable for UltraSSD disks. |
| **Enable bursting** | Optional | Enable on-demand bursting beyond the provisioned performance target of the disk. Doesn't apply to Ultra disks. Accepted values: `true` or `false`. |
| **Encryption type** | Optional | Encryption type of the disk. Accepted values: `EncryptionAtRestWithCustomerKey`, `EncryptionAtRestWithPlatformAndCustomerKeys`, or `EncryptionAtRestWithPlatformKey`. |
| **Gallery image reference** | Optional | The resource ID of a shared image gallery image version to use as the source for the disk. Format: /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Compute/galleries/{gallery}/images/{image}/versions/{version}. |
| **Gallery image reference lun** | Optional | The LUN (logical unit number) of the data disk in the gallery image version. If you specify this parameter, you create the disk from the data disk at this LUN. If you don't specify this parameter, you create the disk from the OS disk of the image. |
| **Hyper v generation** | Optional | The hypervisor generation of the VM. Applicable to OS disks only. Accepted values: `V1`, `V2`. |
| **Location** | Optional | The Azure region/location. The resource group's location is the default if you don't specify this parameter. |
| **Max shares** | Optional | The maximum number of VMs that can attach to the disk at the same time. A value greater than one indicates a shared disk. |
| **Network access policy** | Optional | The policy for accessing the disk via network. Accepted values: `AllowAll`, `AllowPrivate`, or `DenyAll`. |
| **Os type** | Optional | The operating system type of the disk. Accepted values: `Linux` or `Windows`. |
| **Security type** | Optional | The security type of the managed disk. Accepted values: `ConfidentialVM_DiskEncryptedWithCustomerKey`, `ConfidentialVM_DiskEncryptedWithPlatformKey`, `ConfidentialVM_VMGuestStateOnlyEncryptedWithPlatformKey`, `Standard`, or `TrustedLaunch`. This parameter is required when `upload-type` is `UploadWithSecurityData`. |
| **Size gb** | Optional | The size of the disk in GB. Max size: 4,095 GB. |
| **SKU** | Optional | The underlying storage SKU. Accepted values: `Premium_LRS`, `PremiumV2_LRS`, `Premium_ZRS`, `StandardSSD_LRS`, `StandardSSD_ZRS`, `Standard_LRS`, or `UltraSSD_LRS`. |
| **Source** | Optional | The source to create the disk from, including a resource ID of a snapshot or disk, or a blob URI of a virtual hard disk (VHD). When you provide a source, `size-gb` is optional and defaults to the source size. |
| **Tags** | Optional | The space-separated tags in 'key=value' format. Use '' to clear existing tags. |
| **Tier** | Optional | The performance tier of the disk (for example, `P10`, `P15`, `P20`, `P30`, `P40`, `P50`, `P60`, `P70`, or `P80`). Applicable to Premium SSD disks only. |
| **Upload size bytes** | Optional | The size in bytes (including the VHD footer of 512 bytes) of the content to be uploaded. This parameter is required when you specify `upload-type`. |
| **Upload type** | Optional | The type of upload for the disk. Accepted values: `Upload` or `UploadWithSecurityData`. When you specify this parameter, you create the disk in a `ReadyToUpload` state. |
| **Zone** | Optional | The availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Managed disk: delete

<!-- @mcpcli compute disk delete -->

Delete an Azure managed disk from the specified resource group. This operation is idempotent; it returns *success* whether the disk was removed or didn't exist.

Example prompts include:

- "Delete the managed disk `temp-data-disk` in resource group `dev-rg`."

- "Remove managed disk `old-backup-disk` from resource group `prod-rg`."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Disk name** | Required | The name of the disk to delete. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Managed disk: list or get

<!-- @mcpcli compute disk get -->

You can list available Azure managed disks or retrieve detailed information about a specific disk. You can view all disks in a subscription or in a specific resource group, including disk size, SKU, provisioning state, and OS type. The tool supports wildcard patterns in disk names (for example, `win_OsDisk*`).

If you provide a disk name without specifying a resource group, the tool searches across the entire subscription. Specify a resource group to scope the search to that resource group. Both parameters are optional.

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

Update or modify properties of an existing Azure managed disk that you previously created. If you don't specify the resource group, the disk is located by name within the subscription.

This operation supports increasing the disk size, and modifying the storage SKU, IOPS and throughput limits (for UltraSSD only), and the maximum shares for shared disk attachments. You can also change on-demand bursting, tags, encryption settings, disk access, and the performance tier.

You can modify the network access policy to `DenyAll`, `AllowAll`, or `AllowPrivate` on an existing disk. Only specified properties are updated; unspecified properties remain unchanged.

Example prompts include:

- "Update disk `<disk-name>` in resource group `<resource-group>` to 1,024 GB."

- "Change the SKU of disk `<disk-name>` to `UltraSSD_LRS`."

- "Resize disk `<disk-name>` in resource group `<resource-group>` to 2,048 GB."

- "Set the max shares on disk `<disk-name>` to 3."

- "Change the network access policy of disk `<disk-name>` to `AllowPrivate`."

- "Update disk `<disk-name>` in resource group `<resource-group>` with tags `env=production`."

- "Set the IOPS limit on Ultra disk `<disk-name>` in resource group `<resource-group>` to 15,000."

- "Update disk `<disk-name>` in resource group `<resource-group>` to use disk encryption set `<disk-encryption-set-id>`."

- "Set disk access on disk `<disk-name>` in resource group `<resource-group>` to `<disk-access-resource-id>` with network access policy `DenyAll`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Disk name** |  Required | The name of the disk. |
| **Disk access** |  Optional | The resource ID of the disk access resource for using private endpoints on disks. |
| **Disk encryption set** |  Optional | The resource ID of the disk encryption set to use for enabling encryption at rest. |
| **Disk iops read write** |  Optional | The number of IOPS allowed for this disk. Only settable for UltraSSD disks. |
| **Disk mbps read write** |  Optional | The bandwidth allowed for this disk in MBps. Only settable for UltraSSD disks. |
| **Enable bursting** |  Optional | Enable on-demand bursting beyond the provisioned performance target of the disk. Doesn't apply to Ultra disks. Accepted values: `true` or `false`. |
| **Encryption type** |  Optional | The encryption type of the disk. Accepted values: `EncryptionAtRestWithCustomerKey`, `EncryptionAtRestWithPlatformAndCustomerKeys`, or `EncryptionAtRestWithPlatformKey`. |
| **Max shares** |  Optional | The maximum number of VMs that can attach to the disk at the same time. A value greater than one indicates a shared disk. |
| **Network access policy** |  Optional | The policy for accessing the disk via network. Accepted values: `AllowAll`, `AllowPrivate`, or `DenyAll`. |
| **Size gb** |  Optional | The size of the disk in GB. Max size: 4,095 GB. |
| **SKU** |  Optional | The underlying storage SKU. Accepted values: `Premium_LRS`, `PremiumV2_LRS`, `Premium_ZRS`, `StandardSSD_LRS`, `StandardSSD_ZRS`, `Standard_LRS`, or `UltraSSD_LRS`. |
| **Tags** |  Optional | Space-separated tags in `key=value` format. Use `''` to clear existing tags. |
| **Tier** |  Optional | The performance tier of the disk (for example, `P10`, `P15`, `P20`, `P30`, `P40`, `P50`, `P60`, `P70`, or `P80`). Applicable to Premium SSD disks only. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Virtual machine: create

<!-- @mcpcli compute vm create -->

Create, deploy, or provision a single virtual machine. This command launches a new Linux or Windows VM with either SSH key or password authentication. If you don't specify networking resources (such as a virtual network or subnet), this tool automatically creates them. The default VM size is `Standard_DS1_v2`, and the default OS is Ubuntu 24.04 LTS if you don't specify otherwise.

You can create a Linux VM by using an SSH public key. You provide the key content or the path to the key file. For example, you can specify your public key file at `~/.ssh/id_rsa.pub`.

This command doesn't support creating virtual machine scale sets with multiple identical instances. Instead, use `VMSS create`.

Example prompts include:

- "Create a new Linux VM named `<vm-name>` with SSH key in resource group `<resource-group>`."

- "Launch a virtual machine with the Ubuntu2404 image in `<resource-group>`."

- "Create a Windows VM named `<vm-name>` with an admin password in resource group `<resource-group>`."

- "Deploy VM `<vm-name>` in `<location>` with `Standard_DS1_v2` size."

- "Spin up a VM with `Standard_B2s` size and no public IP in resource group `<resource-group>`."

- "Create a Linux VM named `<vm-name>` in `<location>` with a custom network security group."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Admin username** |  Required | The admin username for the VM. Required for VM creation. |
| **Location** |  Required | The Azure region or location. Defaults to the resource group's location if you don't specify it. |
| **Resource group** |  Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **VM name** |  Required | The name of the virtual machine. |
| **Admin password** |  Optional | The admin password for Windows VMs or when the SSH key isn't provided for Linux VMs. |
| **Image** |  Required | The OS image to use. Can be a URN (publisher:offer:SKU:version), or an alias like `Ubuntu2404` or `Win2022Datacenter`. Defaults to Ubuntu 24.04 LTS. |
| **Network security group** |  Optional | The name of the network security group to use or create. |
| **No public IP** |  Optional | The instruction not to create or assign a public IP address. |
| **OS disk size GB** |  Optional | The OS disk size in GB. Defaults are based on image requirements. |
| **OS disk type** |  Optional | The OS disk type: `Premium_LRS`, `StandardSSD_LRS`, or `Standard_LRS`. Defaults are based on VM size. |
| **OS type** |  Optional | The operating system type of the disk. Accepted values: `Linux` or `Windows`. |
| **Public IP address** |  Optional | The name of the public IP address to use or create. |
| **Source address prefix** |  Optional | The source IP address range for NSG inbound rules (for example, `203.0.113.0/24` or a specific IP). Defaults to `*` (any source). |
| **SSH public key** |  Optional | The SSH public key for Linux VMs. Can be the key content or path to a file. |
| **Subnet** |  Optional | The name of the subnet within the virtual network. |
| **Virtual network** |  Optional | The name of an existing virtual network to use. If you don't specify it, the command creates a new one. |
| **VM size** |  Optional | The VM size (for example, `Standard_D2s_v3` or `Standard_B2s`). Defaults to `Standard_DS1_v2` if you don't specify it. |
| **Zone** |  Optional | The availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine: delete

<!-- @mcpcli compute vm delete -->

Delete a virtual machine permanently. This operation is irreversible and the VM data is lost. Use the `Force deletion` parameter to delete a VM that's in a running or failed state.

Example prompts include:

- "Delete VM `test-vm-01` in resource group `dev-rg`."

- "Remove virtual machine `staging-web` from resource group `staging-rg`."

- "Force delete VM `stuck-vm` in resource group `prod-rg`."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **VM name** | Required | The name of the virtual machine to delete. |
| **Force deletion** | Optional | Delete the resource even if it's in a running or failed state. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine: list or get

<!-- @mcpcli compute vm get -->

List or get virtual machines in a subscription or resource group. This command returns VM details, including the name, location, size, provisioning state, OS type, and instance view with runtime status and power state.

Example prompts include:

- "List all virtual machines in my subscription."

- "Show me all VMs in my subscription."

- "List virtual machines in resource group `resource-group-name`."

- "Get details for virtual machine `vm-name` in resource group `resource-group-name`."

- "Get virtual machine `vm-name` with instance view in resource group `resource-group-name`."

- "Show me VM `vm-name` with runtime status in resource group `resource-group-name`."

- "What is the power state of virtual machine `vm-name` in resource group `resource-group-name`?"

- "Get VM `vm-name` status and provisioning state in resource group `resource-group-name`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Instance view** |  Optional | Include instance view details (only available when retrieving a specific VM). |
| **VM name** |  Optional | The name of the virtual machine. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Virtual machine: update

<!-- @mcpcli compute vm update -->

Update, modify, or reconfigure an existing virtual machine. You can resize a VM, update tags, configure boot diagnostics, or change user data. You might need to deallocate the VM before resizing it to certain sizes.

Example prompts include:

- "Add license type `Windows_Server` to VM `<vm-name>` in resource group `<resource-group-name>`."

- "Update user data for VM `<vm-name>` in resource group `<resource-group-name>`."

- "Resize VM `<vm-name>` in resource group `<resource-group-name>` to `Standard_B2s`."

- "Enable boot diagnostics for VM `<vm-name>` in resource group `<resource-group-name>`."

| Parameter            | Required or optional | Description                                                                                                                    |
|----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **Resource group**   | Required             | The name of the Azure resource group. This name is a logical container for Azure resources.                                    |
| **VM name**          | Required             | The name of the virtual machine.                                                                                               |
| **Boot diagnostics** | Optional             | Enable or disable boot diagnostics: `true` or `false`.                                                                         |
| **License type**     | Optional             | The license type for Azure hybrid benefit: `Windows_Server`, `Windows_Client`, `RHEL_BYOS`, `SLES_BYOS`, or `None` to disable. |
| **Tags**             | Optional             | The space-separated tags in `key=value` format. Use `''` to clear existing tags.                                               |
| **User data**        | Optional             | The base64-encoded user data for the VM. Use to update custom data scripts.                                                    |
| **VM size**          | Optional             | The VM size (for example, `Standard_D2s_v3` or `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified.                |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Virtual machine scale set: create

<!-- @mcpcli compute vmss create -->

Create, deploy, or provision a virtual machine scale set to run multiple identical VM instances. This tool helps you deploy workloads that require horizontal scaling, load balancing, or high availability across instances. The default configuration creates two instances of size Standard_DS1_v2, running Ubuntu 24.04 LTS.

Create a scale set by specifying the `resource group`, `VMSS name`, and `admin username`, along with other optional settings. Here are some example commands:

- "Create a virtual machine scale set named `my-vmss` in resource group `my-rg`."

- "Create a virtual machine scale set with four instances in `my-rg`."

- "Deploy a scale set with a manual upgrade policy and two instances in `my-rg`."

- "Create a Linux virtual machine scale set with SSH public key from '`~/.ssh/id_rsa.pub`' in `my-rg`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Admin username** | Required | The admin username for the VM. Required for VM creation. |
| **Location** | Required | The Azure region or location. Defaults to the resource group's location if you don't specify it. |
| **Resource group** | Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **VMSS name** | Required | The name of the virtual machine scale set. |
| **Admin password** | Optional | The admin password for Windows VMs or when an SSH key isn't provided for Linux VMs. |
| **Image** | Required | The OS image to use. Can be a URN (publisher:offer:SKU:version) or alias like `Ubuntu2404`, `Win2022Datacenter`. Defaults to Ubuntu 24.04 LTS. |
| **Instance count** | Optional | The number of VM instances in the scale set. Default is 2. |
| **OS disk size gb** | Optional | OS disk size in GB. Defaults based on image requirements. |
| **OS disk type** | Optional | OS disk type: `Premium_LRS`, `StandardSSD_LRS`, or `Standard_LRS`. Defaults based on VM size. |
| **OS type** | Optional | The operating system type of the disk. Accepted values: Linux or Windows. |
| **Ssh public key** | Optional | The SSH public key for Linux VMs. Can be the key content or path to a file. |
| **Subnet** | Optional | The name of the subnet within the virtual network. |
| **Upgrade policy** | Optional | The upgrade policy mode: `Automatic`, `Manual`, or `Rolling`. Default is `Manual`. |
| **Virtual network** | Optional | The name of an existing virtual network to use. If you don't specify it, the tool creates a new one. |
| **VM size** | Optional | The VM size (for example, `Standard_D2s_v3` or `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified. |
| **Zone** | Optional | The availability zone into which to provision the resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine scale set: delete

<!-- @mcpcli compute vmss delete -->

Delete a virtual machine scale set and all its VM instances permanently. This operation is irreversible. Use the `Force deletion` parameter to delete a scale set that's in a running or failed state.

Example prompts include:

- "Delete scale set `web-frontend-vmss` in resource group `prod-rg`."

- "Remove virtual machine scale set `test-scaleset` from resource group `dev-rg`."

- "Force delete virtual machine scale set `stuck-vmss` in resource group `staging-rg`."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **VMSS name** | Required | The name of the virtual machine scale set to delete. |
| **Force deletion** | Optional | Force delete the resource even if it's in a running or failed state. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ✅ | Local Required: ❌

## Virtual machine scale set: list or get

<!-- @mcpcli compute vmss get -->

List or get virtual machine scale sets and their instances in a subscription or resource group. This tool returns scale set details, including name, location, SKU, capacity, upgrade policy, and individual VM instance information.

Example prompts include:

- "List all virtual machine scale sets in my subscription."

- "List virtual machine scale sets in resource group `<resource-group-name>`."

- "What scale sets are in resource group `<resource-group-name>`?"

- "Get details for virtual machine scale set `<vmss-name>` in resource group `<resource-group-name>`."

- "Show me virtual machine scale set `<vmss-name>` in resource group `<resource-group-name>`."

- "Show me instance `<instance-id>` of virtual machine scale set `<vmss-name>` in resource group `<resource-group-name>`."

- "What is the status of instance `<instance-id>` in scale set `<vmss-name>`?"

| Parameter                          | Required or optional | Description                                              |
|------------------------------------|----------------------|----------------------------------------------------------|
| **Instance ID**                    | Optional             | The instance ID of the virtual machine in the scale set. |
| **Virtual machine scale set name** | Optional             | The name of the virtual machine scale set.               |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Virtual machine scale set: update

<!-- @mcpcli compute vmss update -->

Update, modify, or reconfigure an existing virtual machine scale set. You can scale the instance count, resize VMs, change the upgrade policy, or update tags on a scale set. Some changes require `update-instances` to roll out to existing VMs. This tool doesn't create a new virtual machine scale set. Use `VMSS create` instead. To update a single VM, use `VM update`.

Example prompts include:

- "Update the capacity of virtual machine scale set `myScaleSet` to 15."

- "Enable overprovisioning on the scale set `myScaleSet`."

- "Change the VM size to `Standard_D4s_v3` for `myScaleSet`."

- "Clear existing tags on scale set `myScaleSet` in resource group `myResourceGroup`."

| Parameter                  | Required or optional | Description                                                                                                                         |
|----------------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **Resource group**         | Required             | The name of the Azure resource group. This name is a logical container for Azure resources.                                         |
| **VMSS name**              | Required             | The name of the virtual machine scale set.                                                                                          |
| **Capacity**               | Optional             | The number of VM instances (capacity) in the scale set.                                                                             |
| **Enable auto OS upgrade** | Optional             | Enable automatic OS image upgrades. Requires health probes or the application health extension.                                     |
| **Overprovision**          | Optional             | Enable or disable overprovisioning. When enabled, Azure provisions more VMs than requested, and deletes extra VMs after deployment. |
| **Scale in policy**        | Optional             | The scale-in policy to determine which VMs to remove: `Default`, `NewestVM`, or `OldestVM`.                                         |
| **Tags**                   | Optional             | The space-separated tags in `key=value` format. Use `''` to clear existing tags.                                                    |
| **Upgrade policy**         | Optional             | The upgrade policy mode: `Automatic`, `Manual`, or `Rolling`. Default is `Manual`.                                                  |
| **VM size**                | Optional             | The VM size (for example, `Standard_D2s_v3` or `Standard_B2s`). Defaults to `Standard_DS1_v2` if not specified.                     |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Virtual Machines documentation](/azure/virtual-machines/)
