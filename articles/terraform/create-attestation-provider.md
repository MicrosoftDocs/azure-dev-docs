---
title: Configure an Azure Attestation provider using Terraform
description: Learn how to use Terraform to create an Attestation provider on Azure.
keywords: azure devops terraform attestation
ms.topic: tutorial
ms.date: 08/23/2021
ms.custom: devx-track-terraform
---

# Configure an Azure Attestation provider using Terraform

Article tested with the following Terraform and Terraform provider versions:

- [Terraform v1.1.7](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.2.99.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Learn more about using Terraform in Azure](/azure/terraform)

This article shows how to use Terraform create an [Attestation provider](/azure/attestation/overview) on Azure.

In this article, you learn how to:
> [!div class="checklist"]

> * Configure an Azure Attestation provider

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-attestation-provider).

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Policy Signing Certificate:** A PEM file defines a set of trusted signing keys. As there are many scenarios in which to have a PEM file, this article assumes you have access to one. For example, you can download a PEM during the process of creating a virtual machine in the [Azure portal](https://portal.azure.com).

## 2. Implement the Terraform code

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-attestation-provider/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-attestation-provider/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-attestation-provider/variables.tf)]
    
    **Key points:**
    
    - Adjust the `policy_file` field as needed to point to your PEM file.
    
1. Create a file named `output.tf` and insert the following code:

    [!code-terraform[master](~/../terraform_samples/quickstart/101-attestation-provider/output.tf)]

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Verify the results

1. Get the Azure resource name in which the Attestation provider was created.

    ```azurecli
    echo "$(terraform output resource_group_name)"
    ```

1. Run the [az attestation list](/cli/azure/attestation#az-attestation-list) command to list the providers for the specified resource group name.

    ```azurecli
    az attestation list --resource-group <resource_group_name>
    ```

## 7. Clean up resources

[!INCLUDE [terraform-plan-destroy.md](includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)