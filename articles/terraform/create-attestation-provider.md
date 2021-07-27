---
title: Configure an Azure Attestation provider using Terraform
description: Learn how to use Terraform to create an Attestation provider on Azure.
keywords: azure devops terraform attestation
ms.topic: how-to
ms.date: 07/27/2021
ms.custom: devx-track-terraform
---

# Configure an Azure Attestation policy using Terraform

This article shows example Terraform code for creating an [Attestation provider](/azure/attestation/overview) on Azure.

## 1. Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]

- *Policy Signing Certificate*: a file specifying a set of trusted signing keys in the form of a *.pem file.

## 2. Configure an Azure Attestation provider

1. Create a directory in which to test and run the sample Terraform code.

1. Create your main Terraform configuration file. By convention, the name of this file is `main.tf`. However, you can specify any valid name for your environment.

1. Insert the following code into the main Terraform configuration file.

    [!code-terraform[sample-create-resource-group](../../terraform_samples/quickstart/101-create-resource-group/main.tf)]

    ```hcl
    resource "azurerm_resource_group" "corpAttestation" {
      name                        = "corp-attestation"
      location                    = "westus"
    }
    
    resource "azurerm_attestation_provider" "corpAttestation" {
      name                              = "attestationprovider007"
      resource_group_name               = azurerm_resource_group.corpAttestation.name
      location                          = azurerm_resource_group.corpAttestation.location
    
      policy_signing_certificate_data   = file("./certs/cert.pem")
    }
    ```

## 3. Initialize Terraform

[!INCLUDE [terraform-init.md](includes/terraform-init.md)]

## 4. Create a Terraform execution plan

[!INCLUDE [terraform-create-plan.md](includes/terraform-create-plan.md)]

## 5. Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](includes/terraform-apply-plan.md)]

## 6. Clean up resources

[!INCLUDE [terraform-destroy-plan.md](includes/terraform-destroy-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](troubleshoot.md)

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)