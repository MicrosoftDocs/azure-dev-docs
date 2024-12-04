---
title: Create on-premises virtual network in Azure using Terraform
description: Learn how to implement an on-premises virtual network (VNet) in Azure that houses local resources.
ms.topic: how-to
service: virtual-network
ms.service: azure-virtual-network
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Create on-premises virtual network in Azure using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

This article shows how to implement an on-premises network in Azure. You can replace the sample network with a private virtual network. To do so, modify the subnet IP addresses to suit your environment.

In this article, you learn how to:

> [!div class="checklist"]
> * Implement an on-premises VNet in hub-spoke topology
> * Create hub network appliance resources
> * Create on-premises virtual machine
> * Create on-premises virtual private network gateway

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

## 2. Implement the Terraform code

1. Make the example directory created in the first article of this series the current directory.

1. Create a file named `on-prem.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/301-hub-spoke/on-prem.tf)]
    
## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md)
