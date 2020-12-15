---
title: Configure an Azure Attestation provider using Terraform
description: Learn how to use Terraform to create an Attestation provider on Azure.
keywords: azure devops terraform attestation
ms.topic: how-to
ms.date: 11/08/2020
ms.custom: devx-track-terraform
---

# Configure an Azure Attestation policy using Terraform

This article shows example Terraform code for creating an [Attestation provider](https://docs.microsoft.com/azure/attestation/overview) on Azure.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- *Policy Signing Certificate*: a file specifying a set of trusted signing keys in the form of a *.pem file.

[!INCLUDE [terraform-configure-environment.md](includes/terraform-configure-environment.md)]

## Configure an Azure Attestation provider

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

[!INCLUDE [terraform-troubleshooting.md](includes/terraform-troubleshooting.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Learn more about using Terraform in Azure](/azure/terraform)
