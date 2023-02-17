---
title: Deploy an Azure Application Gateway v2 using Terraform to direct web traffic 
description: In this article, you learn how to use Terraform to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
keywords: azure, devops, terraform, application gateway
ms.topic: how-to
ms.date: 02/16/2023
ms.custom: devx-track-terraform
author: vhorne
ms.author: victorh
---

# Deploy an Azure Application Gateway v2 using Terraform to direct web traffic

> [!NOTE]
> View the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-application-gateway/TestRecord.md).

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

In this article, you use Terraform to deploy an Azure Application Gateway v2 and two Windows Server 2019 Datacenter test servers for the backend pool.

> [!div class="checklist"]

> * Deploy an Application Gateway v2 using Terraform
> * Deploy two virtual machines in the Application Gateway backend pool to test
> * Test the Application Gateway to verify the deployment

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

> [!NOTE]
> The example code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-application-gateway). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/variables.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. Get the resource group name by running [terraform state show](https://developer.hashicorp.com/terraform/cli/commands/state/show).

    ```console
    terraform state show azurerm_resource_group.rg
    ```

1. Browse to the [Azure portal](https://portal.azure.com).

1. Under **Azure services**, select **Resource groups**.

1. Select the resource group created in this article.

1. Select the **myAppGateway** resource.

1. On the **Overview** page, copy the **Frontend public IP address** to the clipboard.

1. Paste the public IP address into the address bar of your web browser. Refresh the browser to see the name of the virtual machine. A valid response verifies the application gateway is successfully created and can connect with the backend.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Application Gateway](/azure/application-gateway/overview)
