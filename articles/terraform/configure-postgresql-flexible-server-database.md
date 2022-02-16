---
title: Configure a PostgreSQL Flexible Server Database using Terraform
description: Learn how to configure a PostgreSQL Flexible Server Database using Terraform
keywords: azure, devops, terraform, postgresql, flexible server, database
ms.topic: how-to
ms.date: 02/16/2022
ms.custom: devx-track-terraform
---

# Configure a PostgreSQL Flexible Server Database using Terraform

<!-- 
Introductory paragraph. Keep it short and to the point. 
Link to devhub index page of underlying technology where appropriate.
-->

In this article, you learn how to:

> [!div class="checklist"]

<!-- 
Add several bullets to highlight what the customer will do in the article. 
-->
> * Task 1
> * Task 2
> * Task n

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/neil-yechenwei/terraform-1/tree/examplepostgresqlfsdb/quickstart/201-postgresql-fs-db).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[examplepostgresqlfsdb](../../terraform_samples/quickstart/201-postgresql-fs-db/main.tf)]

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
> [Learn more about using PostgreSQL in Azure](/azure/postgresql/)
