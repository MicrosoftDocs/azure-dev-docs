---
title: Manage Azure virtual networks with Java | Microsoft Docs
description: Sample code to manage Azure virtual networks in your Java code
author: rloutlaw
manager: douge
ms.assetid: 92736911-3df6-46e7-b751-25bb36bf89b9
ms.devlang: java
ms.topic: article
ms.service: Azure
ms.technology: Azure
ms.date: 3/30/2017
ms.author: routlaw;asirveda
---

# Create and manage Azure virtual networks from your Java apps

[This sample](https://github.com/Azure-Samples/network-java-manage-virtual-network) creates a [virtual network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) to isolate your Azure resources on network segment you control.

## Run the sample

Create an [authentication file](https://github.com/Azure/azure-sdk-for-java/blob/master/AUTH.md) and set an environment variable `AZURE_AUTH_LOCATION` with the full path to the file on your computer. Then run:

```
git clone https://github.com/Azure-Samples/network-java-manage-virtual-network.git
cd network-java-manage-virtual-network
mvn clean compile exec:java
```

View the [complete code sample on GitHub](https://github.com/Azure-Samples/network-java-manage-virtual-network/blob/master/src/main/java/com/microsoft/azure/management/network/samples/ManageVirtualNetwork.java).

## Authenticate with Azure

[!INCLUDE [auth-include](includes/java-auth-include.md)]

## Create a network security group to block Internet traffic

```java
// this NSG definition block traffic to and from the public Internet
NetworkSecurityGroup backEndSubnetNsg = azure.networkSecurityGroups()
              .define(vnet1BackEndSubnetNsgName)
                    .withRegion(Region.US_EAST)
                    .withNewResourceGroup(rgName)
                    .defineRule("DenyInternetInComing")
                        .denyInbound()
                        .fromAddress("INTERNET")
                        .fromAnyPort()
                        .toAnyAddress()
                        .toAnyPort()
                        .withAnyProtocol()
                        .attach()
                    .defineRule("DenyInternetOutGoing")
                        .denyOutbound()
                        .fromAnyAddress()
                        .fromAnyPort()
                        .toAddress("INTERNET")
                        .toAnyPort()
                        .withAnyProtocol()
                        .attach()
                    .create();
```

This [network security rule](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) blocks both inbound and outbound public Internet traffic. This network security group will not have an effect until applied to a subnet in your virtual network.

## Create a virtual network with two subnets

```java
// create the a virtual network with two subnets
// assign the backend subnet a rule blocking public internet traffic
Network virtualNetwork1 = azure.networks().define(vnetName1)
                    .withRegion(Region.US_EAST)
                    .withExistingResourceGroup(rgName)
                    .withAddressSpace("192.168.0.0/16")
                    .withSubnet(vnet1FrontEndSubnetName, "192.168.1.0/24")
                    .defineSubnet(vnet1BackEndSubnetName)
                        .withAddressPrefix("192.168.2.0/24")
                        .withExistingNetworkSecurityGroup(backEndSubnetNsg)
                        .attach()
                    .create();
```

The backend subnet denies Internet access usingfollowing the rules set in the network security group. The front end subnet uses the [default rules](https://docs.microsoft.com/azure/virtual-network/virtual-networks-nsg) which allow outbound traffic to the Internet.

## Create a network security group to allow inbound HTTP traffic
```java
// create a rule that allows inbound HTTP and blocks outbound Internet traffic
NetworkSecurityGroup frontEndSubnetNsg = azure.networkSecurityGroups()
               .define(vnet1FrontEndSubnetNsgName)
                    .withRegion(Region.US_EAST)
                    .withExistingResourceGroup(rgName)
                    .defineRule("AllowHttpInComing")
                        .allowInbound()
                        .fromAddress("INTERNET")
                        .fromAnyPort()
                        .toAnyAddress()
                        .toPort(80)
                        .withProtocol(SecurityRuleProtocol.TCP)
                        .attach()
                    .defineRule("DenyInternetOutGoing")
                        .denyOutbound()
                        .fromAnyAddress()
                        .fromAnyPort()
                        .toAddress("INTERNET")
                        .toAnyPort()
                        .withAnyProtocol()
                        .attach()
                    .create();
```

This network security rule opens up inbound traffic on port 80 from the public Internet, and blocks all outbound traffic from inside the network to the public Internet. 

## Update a virtual network
```java
// update the front end subnet to use the rules in the new network security group
virtualNetwork1.update()
          .updateSubnet(vnet1FrontEndSubnetName)
          .withExistingNetworkSecurityGroup(frontEndSubnetNsg)
          .parent()
          .apply();
```

Update the front end subnet to allow inbound HTTP traffic using the network security rule created in the previous step.

## Create a virtual machine on a subnet
```java
// attach the new VM to the front end subnet on the virtual network
VirtualMachine frontEndVM = azure.virtualMachines().define(frontEndVmName)
                    .withRegion(Region.US_EAST)
                    .withExistingResourceGroup(rgName)
                    .withExistingPrimaryNetwork(virtualNetwork1) 
                    .withSubnet(vnet1FrontEndSubnetName)
                    .withPrimaryPrivateIpAddressDynamic()
                    .withNewPrimaryPublicIpAddress(publicIpAddressLeafDnsForFrontEndVm)
                    .withPopularLinuxImage(KnownLinuxVirtualMachineImage.UBUNTU_SERVER_16_04_LTS)
                    .withRootUsername(userName)
                    .withSsh(sshKey)
                    .withSize(VirtualMachineSizeTypes.STANDARD_D3_V2)
                    .create();
```

`withExistingPrimaryNetwork()` and `withSubnet()` configure the virtual machine to use the front-end subnet on the virtual network created in the previous steps.

## List virtual networks in a resource group
```java
// iterate over every virtual network in the resource group 
for (Network virtualNetwork : azure.networks().listByResourceGroup(rgName)) {
    // for each subnet on the virtual network, log the network address prefix 
    for (Map.Entry<String, Subnet> entry : virtualNetwork.subnets().entrySet()) {
        String subnetName = entry.getKey();
        Subnet subnet = entry.getValue();
        System.out.println("Address prefix for subnet " + subnetName + 
             " is " + subnet.addressPrefix());
    }
}
```       

You can list and inspect `Network` object using the outer collection or iterate through each child resource for each network using the nested for-each loop as seen in this example.

## Delete a virtual network
```java
// if you already have the virtual network object it is easiest to delete by ID
azure.networks().deleteById(virtualNetwork1.id());

// Delete by resource group and name if you don't have the VirtualMachine object
azure.networks().deleteByResourceGroup(rgName,vnetName1);
```

Removing a virtual network deletes the subnets on the network but does not delete the network security group rules applied to the subnets. Those definitions can be reapplied to other subnets.

## Sample explanation

This sample creates a virtual network with two subnets and with one virtual machine on each subnet. The back subnet is cut off from the public Internet. The front-facing subnet accepts inbound HTTP traffic from the Internet. Both virtual machines in the virtual network communicate with each other through the default network security group rules.

| Class used in sample | Notes
|-------|-------|
| [Network](https://docs.microsoft.com/java/api/com.microsoft.azure.management.network._network) | Local object representation of the virtual network created from `azure.networks().define()...create()` . Use the `update()...apply()` fluent chain to update an existing virtual network.
| [Subnet](https://docs.microsoft.com/java/api/com.microsoft.azure.management.network._subnet) | Create subnets on the virtual network when defining or updating the network using `withSubnet()`. Get object representations of a subnet from `Network.subnets().get()` or `Network.subnets().entrySet()`. These objects have methods to query subnet properties.
| [NetworkSecurityGroup](https://docs.microsoft.com/java/api/com.microsoft.azure.management.network._network_security_group) | Created using the `azure.networkSecurityGroups().define()...create()` fluent chain and then applied to subnets through the updating or creating subnets in a virtual network. 

## Next steps

[!INCLUDE [next-steps](includes/java-next-steps.md)]