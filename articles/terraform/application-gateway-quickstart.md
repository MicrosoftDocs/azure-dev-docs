---
title: 'Quickstart: Direct web traffic using Terraform'
description: In this quickstart, you learn how to use Terraform to create an Azure Application Gateway that directs web traffic to virtual machines in a backend pool.
keywords: azure, devops, terraform, application gateway
ms.topic: quickstart
ms.date: 03/11/2022
ms.custom: devx-track-terraform
author: vhorne
ms.author: victorh
---

# Quickstart: Direct web traffic with Azure Application Gateway using Terraform

In this article, you learn how to:

> [!div class="checklist"]
> * Deploy an Application Gateway v2 using Terraform
> * Deploy two virtual machines in the Application Gateway backend pool to test
> * Test the Application Gateway to verify the deployment

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-application-gateway).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/variables.tf)]
1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](../../terraform_samples/quickstart/101-application-gateway/providers.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. On the Azure portal, Select the **myResourceGroupAG** resource group.
1. Select the **myAppGateway** resource.
1. Copy the **Frontend public IP address** on the **Overview** page.
1. Paste the public IP address into the address bar of your web browser. When you refresh the browser, you should see the name of the virtual machine. A valid response verifies that the application gateway was successfully created and it can successfully connect with the backend.

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"]
> [Learn more about using Application Gateway](azure/application-gateway/overview)