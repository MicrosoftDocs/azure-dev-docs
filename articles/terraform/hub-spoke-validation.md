---
title: Validate a hub and spoke network in Azure using Terraform
description: Learn how to validate hub and spoke network topology with all virtual networks connected to one another.
ms.topic: how-to
service: virtual-network
ms.service: azure-virtual-network
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Validate a hub and spoke network in Azure using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you execute the terraform files created in the previous article in this series. The result is a validation of the connectivity between the demo virtual networks.

In this article, you learn how to:

> [!div class="checklist"]
> * Implement the Hub VNet in hub-spoke topology
> * Verify the resources to be deployed
> * Create the resources in Azure
> * Verify the connectivity between different networks

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md)

- [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md)

- [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md)

- [Create a hub virtual network appliance with Terraform in Azure](./hub-spoke-hub-nva.md)

- [Create a spoke virtual networks with Terraform in Azure](./hub-spoke-spoke-network.md)

## 2. Verify your configuration

In the example directory, verify that all the files created in this article series are present:

| File name | Article in which file is created |
| - | - |
| main.tf | [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md) |
| variables.tf | [Create a hub and spoke hybrid network topology with Terraform in Azure](./hub-spoke-introduction.md) |
| on-prem.tf | [Create on-premises virtual network with Terraform in Azure](./hub-spoke-on-prem.md) |
| hub-vnet.tf | [Create a hub virtual network with Terraform in Azure](./hub-spoke-hub-network.md) |
| hub-nva.tf | [Create a hub virtual network appliance with Terraform in Azure](./hub-spoke-hub-nva.md) |
| spoke1.tf | [Create a spoke virtual networks with Terraform in Azure](./hub-spoke-spoke-network.md) |
| spoke2.tf | [Create a spoke virtual networks with Terraform in Azure](./hub-spoke-spoke-network.md) |

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

This section shows how to test connectivity from the simulated on-premises environment to the hub VNet.

1. Browse to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, browse to the **onprem-vnet-rg** resource group.

1. In the **onprem-vnet-rg** tab, select the VM named **onprem-vm**.

1. Note the **Public IP Address** value.

1. Return to the command line and run `ssh` to connect to the simulated on-premises environment.

   ```bash
   ssh azureuser@<onprem_vm_ip_address>
   ```

    **Key points:**

    - If you changed the user name from `azureuser` in the `variables.tf` file, make sure to insert that value in the `ssh` command.
    - Use the password you specified when you ran `terraform plan`.

1. Once connected to the **onprem-vm** virtual machine, run the `ping` command to test connectivity to the jumpbox VM in the hub VNet:

   ```bash
   ping 10.0.0.68
   ```

1. Run the `ping` command to test connectivity to the jumpbox VMs in each spoke:

   ```bash
   ping 10.1.0.68
   ping 10.2.0.68
   ```

1. To exit the ssh session on the **onprem-vm** virtual machine, enter `exit` and press &lt;Enter>.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
