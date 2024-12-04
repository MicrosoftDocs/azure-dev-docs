---
title: Deploy a PostgreSQL Flexible Server Database using Terraform
description: Learn how to deploy a PostgreSQL Flexible Server Database using Terraform
keywords: azure, devops, terraform, postgresql, flexible server, database
ms.topic: how-to
service: postgresql
ms.service: azure-database-postgresql
ms.date: 10/26/2023
ms.custom: devx-track-terraform
---

# Deploy a PostgreSQL Flexible Server Database using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.4](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.94.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

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
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/201-postgresql-fs-db).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-postgresql-fs-db/providers.tf)]

1. Create a file named `main.tf` and insert the following code to deploy the PostgreSQL Flexible Server on which the database runs.

    [!code-terraform[master](../../terraform_samples/quickstart/201-postgresql-fs-db/main.tf)]

1. Create a file named `postgresql-fs-db.tf` and insert the following code to instantiate the database:

    [!code-terraform[master](../../terraform_samples/quickstart/201-postgresql-fs-db/postgresql-fs-db.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/201-postgresql-fs-db/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code to output the resource group name, Azure PostgreSQL server name, and Azure PostgreSQL database name:

    [!code-terraform[master](../../terraform_samples/quickstart/201-postgresql-fs-db/outputs.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

#### [Azure CLI](#tab/azure-cli)

Run [az postgres flexible-server db show](/cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-show) to display the Azure PostgreSQL database.

```azurecli
az postgres flexible-server db show --resource-group <resource_group_name> --server-name <server_name> --database-name <database_name>
```

**Key points:**

- The values for the `<resource_group_name>`, `<server_name>`, and `<database_name>` are displayed in the `terraform apply` output.

#### [Azure PowerShell](#tab/azure-powershell)

Run [Get-AzPostgreSqlFlexibleServerDatabase](/powershell/module/az.postgresql/get-azpostgresqlflexibleserverdatabase) to display the Azure PostgreSQL database.

```azurepowershell
Get-AzPostgreSqlFlexibleServerDatabase -ResourceGroupName <resource_group_name> -ServerName <server_name> -Name <database_name>
```

**Key points:**

- The values for the `<resource_group_name>`, `<server_name>`, and `<database_name>` are displayed in the `terraform apply` output.

---

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about PostgreSQL Flexible Server](/azure/postgresql/flexible-server/overview)
