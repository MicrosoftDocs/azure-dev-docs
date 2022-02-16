---
title: Deploy a PostgreSQL Flexible Server Database using Terraform
description: Learn how to deploy a PostgreSQL Flexible Server Database using Terraform
keywords: azure, devops, terraform, postgresql, flexible server, database
ms.topic: how-to
ms.date: 02/16/2022
ms.custom: devx-track-terraform
---

# Deploy a PostgreSQL Flexible Server Database using Terraform

Article tested with following software/versions:
- [Terraform v1.1.4](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.94.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

This article shows how to deploy a [PostgreSQL Flexible Server Database](/azure/postgresql/flexible-server/overview) using Terraform.

In this article, you learn how to:

> [!div class="checklist"]

> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure virtual network (VNet) using [azurerm_virtual_network](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_network)
> * Create an Azure Network Security Group (NSG) using [azurerm_network_security_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/network_security_group)
> * Create an Azure [subnet azurerm_subnet](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet)
> * Create an Azure subnet Network Security Group (NSG) using [azurerm_subnet_network_security_group_association](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/subnet_network_security_group_association)
> * Define a private DNS zone within an Azure DNS using [azurerm_private_dns_zone](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone)
> * Define a private DNS zone VNet link using using [azurerm_private_dns_zone_virtual_network_link](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/private_dns_zone_virtual_network_link)
> * Deploy an Azure PostgreSQL Flexible Server on which the database runs using [azurerm_postgresql_flexible_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server)
> * Instantiate an Azure PostgreSQL database using [azurerm_postgresql_flexible_server_database](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/postgresql_flexible_server_database)

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/neil-yechenwei/terraform-1/tree/examplepostgresqlfsdb/quickstart/201-postgresql-fs-db).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/providers.tf)]

1. Create a file named `main.tf` and insert the following code to deploy the PostgreSQL Flexible Server on which the database runs.

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/main.tf)]

1. Create a file named `postgresql-fs-db.tf` and insert the following code to instantiate the database:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/postgresql-fs-db.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/variables.tf)]

1. Create a file named `output.tf` to display the randomly generated resource group name and insert the following code:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/output.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

<!-- 
Customers have consistently requested that they have the ability to verify if the steps worked. 
Here you would specify steps to do that task.
For example, you might tell the user to run a specific command and what they should see as output 
or go to the portal to view a resource that should have been created.
-->

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about PostgreSQL Flexible Server](/azure/postgresql/flexible-server/overview)
