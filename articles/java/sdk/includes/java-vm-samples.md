| Sample  | Description |
|---|---|
| [Create a virtual machine from a custom image][1] | Create a custom virtual machine image and use it to create new virtual machines. | 
| [Create a virtual machine using specialized VHD from a snapshot][2] | Create snapshot from the virtual machine's OS and data disks, create managed disks from the snapshots, and then create a virtual machine by attaching the managed disks. |  
| [Create virtual machines in parallel in the same network][3] | Create virtual machines in the same region on the same virtual network with two subnets in parallel. |

[1]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/compute/samples/CreateVirtualMachineUsingCustomImageFromVM.java
[2]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/compute/samples/CreateVirtualMachineUsingSpecializedDiskFromSnapshot.java
[3]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/resourcemanager/azure-resourcemanager/src/samples/java/com/azure/resourcemanager/compute/samples/ManageVirtualMachinesInParallel.java
