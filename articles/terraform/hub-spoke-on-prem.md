---
title: Create on-premises virtual network in Azure using Terraform
description: Learn how to implement an on-premises virtual network (VNet) in Azure that houses local resources.
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
---

# Create on-premises virtual network in Azure using Terraform

This article shows how to implement an on-premises network in Azure. You can replace the sample network with a private virtual network. To do so, modify the subnet IP addresses to suit your environment.

In this article, you learn how to:
> [!div class="checklist"]

> * Use HCL (HashiCorp Language) to implement an on-premises VNet in hub-spoke topology
> * Use Terraform to create hub network appliance resources
> * Use Terraform to create on-premises virtual machine
> * Use Terraform to create on-premises virtual private network gateway

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md).

## 2. Implement the Terraform code

1. In the example directory, create a file named `on-prem.tf`.

1. Insert the following code:

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/301-hub-spoke/on-prem.tf)]
    
## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md)
