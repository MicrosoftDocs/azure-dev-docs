---
title: Create a hub virtual network appliance in Azure using Terraform
description: Learn how to create a Hub virtual network (VNet) that acts as a common connection point between other networks.
ms.topic: how-to
ms.date: 07/31/2021
ms.custom: devx-track-terraform
---

# Create a hub virtual network appliance in Azure using Terraform

A *VPN device* is a device that provides external connectivity to an on-premises network. The VPN device may be a hardware device or a software solution. One example of a software solution is Routing and Remote Access Service (RRAS) in Windows Server 2012. For more information about VPN appliances, see [About VPN devices for Site-to-Site VPN Gateway connections](/azure/vpn-gateway/vpn-gateway-about-vpn-devices).

Azure supports a broad variety of network virtual appliances from which to select. For this article, an Ubuntu image is used. To learn more about the broad variety of device solutions supported in Azure, see the [Network Appliances home page](https://azure.microsoft.com/solutions/network-appliances/).

In this article, you learn how to:

> [!div class="checklist"]
> * Use HCL (HashiCorp Language) to implement the Hub VNet in hub-spoke topology
> * Use Terraform to create Hub Network Virtual Machine which acts as appliance
> * Use Terraform to enable routes using CustomScript extensions
> * Use Terraform to create Hub and Spoke gateway route tables

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

- [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md).

- [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md).

## 2. Implement the Terraform code

1. In the example directory, create a file named `hub-nva.tf`.

1. Insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/301-hub-spoke/hub-nva.tf)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create a spoke virtual networks with Terraform in Azure](./hub-spoke-spoke-network.md)
