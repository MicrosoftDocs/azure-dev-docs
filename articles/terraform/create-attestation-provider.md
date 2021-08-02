---
title: Configure an Azure Attestation provider using Terraform
description: Learn how to use Terraform to create an Attestation provider on Azure.
keywords: azure devops terraform attestation
ms.topic: how-to
ms.date: 08/01/2021
ms.custom: devx-track-terraform
---

# Configure an Azure Attestation policy using Terraform

This article shows example Terraform code for creating an [Attestation provider](/azure/attestation/overview) on Azure.

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- **Policy Signing Certificate:** A PEM file defines a set of trusted signing keys. As there are many scenarios in which to have a PEM file, this article assumes you have access to one. For example, you can download a PEM during the process of creating a virtual machine in the [Azure portal](https://portal.azure.com).

## 2. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code.

1. In the example directory, create your main Terraform configuration file. By convention, the name of this file is `main.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the main Terraform configuration file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-attestation-provider/main.tf)]

1. In the example directory, create a variables file that will contain the values for Terraform. By convention, the name of this file is `variables.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the variables file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-attestation-provider/variables.tf)]

    **Key points:**

    - Adjust the `policy_file` field as needed to point to your PEM file.

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Clean up resources

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)