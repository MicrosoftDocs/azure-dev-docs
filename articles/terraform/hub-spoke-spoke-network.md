---
title: Create a spoke network in Azure using Terraform
description: Learn how to implement two spoke virtual networks (VNets) connected to a hub in a hub-spoke topology.
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
---

# Create a spoke network in Azure using Terraform

In this article, you implement two separate spoke networks to demonstrate separation of workloads. The networks share common resources using hub virtual network. Spokes can be used to isolate workloads in their own VNets, managed separately from other spokes. Each workload might include multiple tiers, with multiple subnets connected through Azure load balancers.

In this article, you learn how to:
> [!div class="checklist"]

> * Implement the Spoke VNets in hub-spoke topology
> * Create Virtual machines in the spoke networks
> * Establish virtual network peerings with the hub networks

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

- [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md).

- [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md).

- [Create a hub virtual network appliance with Terraform in Azure](./hub-spoke-hub-nva.md).

## 2. Implement the Terraform code

Two spoke scripts are created in this section. Each script defines a spoke virtual network and a virtual machine for the workload. A peered virtual network from hub to spoke is then created.

1. In the example directory, create a file named `spoke1.tf`.

1. Insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/301-hub-spoke/spoke1.tf)]

1. In the example directory, create a file named `spoke2.tf`.

1. Insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/301-hub-spoke/spoke2.tf)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Validate a hub and spoke network with Terraform in Azure](./hub-spoke-validation.md)
