---
title: Create a hub virtual network in Azure by using Terraform
description: Learn how to create a hub virtual network in Azure that acts as a common connection point between other networks.
ms.topic: tutorial
ms.date: 07/31/2021
ms.custom: devx-track-terraform
---

# Create a hub virtual network in Azure by using Terraform

The hub virtual network acts as the central point of connectivity to the on-premises network. The virtual network hosts shared services consumed by workloads hosted in the spoke virtual networks. For demo purposes, no shared services are implemented in this article.

This article covers the following tasks:

> [!div class="checklist"]
> * Use the HashiCorp Configuration Language (HCL) to implement the hub virtual network in a hub-and-spoke topology.
> * Use Terraform to create a hub jumpbox virtual machine.
> * Use Terraform to create a hub virtual private network gateway.
> * Use Terraform to create hub and on-premises gateway connections.

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub-and-spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

- [Create an on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md).

## 2. Implement the Terraform code

The hub network consists of the following components:

- A hub virtual network
- A hub virtual network gateway
- Hub gateway connections

1. In the example directory, create a file named `hub-vnet.tf`.

1. Insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/301-hub-spoke/hub-vnet.tf)]
    
## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Create a hub virtual network appliance with Terraform in Azure](./hub-spoke-hub-nva.md)