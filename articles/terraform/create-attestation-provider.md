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

- **Policy Signing Certificate:** File specifying a set of trusted signing keys in the form of a *.pem file.

## 2. Getting a PEM fil

There are many ways in which you might have a PEM file. If you don't already have a PEM file to use with the code in this article, do the following:

1. Browse to the [Azure portal](https://portal.azure.com).

1. Create a resource group named `myResourceGroup`. Input the values appropriate for your environment.

1. Within the resource group from the previous step, create a virtual machine. Specify the following values:

    - **Authentication type** = **SSH Public key**
    - **SSH Public key source** = **Generate new key pair**
    - Specify the remaining values as appropriate for your environment.

1. Select **Review + Create**.

1. Select **Create**.

1. A window titled **Generate new key pair** displays. Select **Download private key and create resource**.

    **Key points:**

    - Based on your environment, the PEM file for the virtual machine is downloaded. For example, in Windows, the PEM file is downloaded to the `Downloads` folder.

## 3. Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code.

1. In the example directory, create your main Terraform configuration file. By convention, the name of this file is `main.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the main Terraform configuration file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-attestation-provider/main.tf)]

1. In the example directory, create a variables file that will contain the values for Terraform. By convention, the name of this file is `variables.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the variables file.

    [!code-terraform[tarcher-move-sample-code-to-github](../../terraform_samples/quickstart/101-attestation-provider/variables.tf)]

    **Key points:**

    - Adjust the `policy_file` field as needed to point to your PEM file.

## 4. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 5. Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](includes/terraform-plan.md)]

## 6. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 7. Verify the results


## 8. Clean up resources

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)