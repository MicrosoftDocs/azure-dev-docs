---
title: Migrate Azure Firewall Standard to Premium using Terraform
description: Learn how to migrate an existing standard Azure Firewall to Azure Firewall Premium.
keywords: azure, devops, terraform, firewall, migrate
ms.topic: how-to
service: firewall
ms.service: azure-firewall
ms.date: 10/26/2023
ms.custom: devx-track-terraform
author: vhorne
ms.author: victorh
---

# Migrate Azure Firewall Standard to Premium using Terraform

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

If you use Terraform to deploy standard Azure Firewall with classic rules, you can modify your Terraform configuration file to migrate your firewall to Azure Firewall Premium using a Premium firewall policy.

In this article, you learn how to:

> [!div class="checklist"]
> * Deploy a standard Azure Firewall with classic rules using Terraform
> * Import the firewall rules into a premium firewall policy
> * Edit the Terraform configuration file to migrate the firewall

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-firewall-standard/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-firewall-standard/variables.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Import the firewall rules into a premium policy

Now you have a standard firewall with classic rules. Next, create a premium Firewall Policy and import the rules from the firewall.

1. On the Azure portal, select **Create a resource**.
1. Search for **firewall policy** and select it.
1. Select **Create**.
1. For Resource group select **test-resources** .
1. For Name, type **prem-pol**.
1. For Region, select **East US**.
1. For Policy tier, select **Premium**.
1. Select **Next: DNS Settings**, and continue until you reach the Rules page.
1. On the Rules page, select **Import rules from an Azure Firewall**.
1. Select **testfirewall**, and then select **Import**.
1. Select **Review + create**.
1. Select **Create**.

## 7. Edit the Terraform configuration file to migrate the firewall

Open the `main.tf` file, and make the following changes:

1. Add the following 'data' section:

   ```terraform
   data "azurerm_firewall_policy" "prem-pol" {
     name                 = "prem-pol"
     resource_group_name  = azurerm_resource_group.rg.name
   }
   ```

2. Modify the firewall resource:

   ```terraform
    resource "azurerm_firewall" "fw" {
        name                = "testfirewall"
        location            = azurerm_resource_group.rg.location
        resource_group_name = azurerm_resource_group.rg.name
        firewall_policy_id  = data.azurerm_firewall_policy.prem-pol.id
        sku_tier            = "Premium"

    ip_configuration {
        name                 = "configuration"
        subnet_id            = azurerm_subnet.subnet.id
        public_ip_address_id = azurerm_public_ip.pip.id
    }
   }
   ```

3. Delete the classic rule collections:

   ```terraform
   resource "azurerm_firewall_application_rule_collection" "app-rc" {
     name                = "apptestcollection"
     azure_firewall_name = azurerm_firewall.fw.name
     resource_group_name = azurerm_resource_group.rg.name
     priority            = 100
     action              = "Allow"
   
     rule {
       name = "testrule"
   
       source_addresses = [
         "10.0.0.0/16",
       ]
   
       target_fqdns = [
         "*.google.com",
       ]
   
       protocol {
         port = "443"
         type = "Https"
       }
     }
   }
   
   resource "azurerm_firewall_network_rule_collection" "net-rc" {
     name                = "nettestcollection"
     azure_firewall_name = azurerm_firewall.fw.name
     resource_group_name = azurerm_resource_group.rg.name
     priority            = 100
     action              = "Allow"
   
     rule {
       name = "dnsrule"
   
       source_addresses = [
         "10.0.0.0/16",
       ]
   
       destination_ports = [
         "53",
       ]
   
       destination_addresses = [
         "8.8.8.8",
         "8.8.4.4",
       ]
   
       protocols = [
         "TCP",
         "UDP",
       ]
     }
   }
   ```

## 8. Apply the modified Terraform execution plan

1. `terraform plan -out main.tfplan`
1. `terraform apply main.tfplan`

## 9. Verify the results

1. Select the **test-resources** resource group.
1. Select the **testfirewall** resource.
1. Verify the Firewall sku is **Premium**.
1. Verify the firewall is using the **prem-pol** firewall policy.
:::image type="content" source="media/firewall-upgrade-premium/firewall-premium.png" alt-text="Azure Firewall Premium with a Premium policy.":::

## 10. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)