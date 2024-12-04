---
title: Create a hub virtual network appliance in Azure using Terraform
description: Learn how to create a Hub virtual network (VNet) that acts as a common connection point between other networks.
ms.topic: how-to
service: virtual-network
ms.service: azure-virtual-network
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Create a hub virtual network appliance in Azure using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

A *VPN device* is a device that provides external connectivity to an on-premises network. The VPN device may be a hardware device or a software solution. One example of a software solution is Routing and Remote Access Service (RRAS) in Windows Server 2012. For more information about VPN appliances, see [About VPN devices for Site-to-Site VPN Gateway connections](/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

Azure supports a broad variety of network virtual appliances from which to select. For this article, an Ubuntu image is used. To learn more about the broad variety of device solutions supported in Azure, see the [Network Appliances home page](https://azure.microsoft.com/solutions/network-appliances/).

In this article, you learn how to:

> [!div class="checklist"]
> * Implement the Hub VNet in hub-spoke topology
> * Create Hub Network Virtual Machine which acts as appliance
> * Enable routes using CustomScript extensions
> * Create Hub and Spoke gateway route tables

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

- [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md).

- [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md).

## 2. Implement the Terraform code

1. Make the example directory created in the first article of this series the current directory.

1. Create a file named `hub-nva.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/301-hub-spoke/hub-nva.tf)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create a spoke virtual networks with Terraform in Azure](./hub-spoke-spoke-network.md)
