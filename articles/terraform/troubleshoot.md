---
title: Troubleshoot common problems when using Terraform on Azure
description: In this article, troubleshoot common problems when using Terraform on Azure
keywords: terraform azure troubleshoot errors problems
ms.topic: troubleshooting
ms.date: 08/05/2021
ms.custom: devx-track-terraform
# Customer intent: Find solutions to common problems encountered when using Terraform on Azure.
---

# Troubleshoot common problems when using Terraform on Azure

This article lists common problems and possible solutions when using Terraform on Azure. 

If you encounter a problem that is specific to Terraform, use one of [HashiCorp's community support channels](#hashicorp-terraform-specific-support-channels).

- [Unable to list provider registration status](#unable-to-list-provider-registration-status)
- [VPN errors](#vpn-errors)

## HashiCorp Terraform specific support channels

* Questions, use-cases, and useful patterns: [Terraform section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-core)
* Provider-related questions: [Terraform Providers section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-providers)

## Unable to list provider registration status

**Error message:**

*Error: Unable to list provider registration status, it is possible that this is due to invalid credentials or the service principal does not have permission to use the Resource Manager API, Azure error: resources.ProvidersClient#List: Failure responding to request: StatusCode=403 -- Original Error: autorest/azure: Service returned an error. Status=403 Code="AuthorizationFailed" Message="The client '00000000-0000-0000-0000-000000000000' with object id '00000000-0000-0000-0000-000000000000' does not have authorization to perform action 'Microsoft.Resources/subscriptions/providers/read' over scope '/subscriptions/00000000-0000-0000-0000-000000000000' or the scope is invalid. If access was recently granted, please refresh your credentials."*

**Background:** If you're running Terraform commands from the Cloud Shell and you've defined certain [Terraform/Azure environment variables](https://registry.terraform.io/providers/hashicorp/azurerm/2.35.0/docs/guides/service_principal_client_secret#configuring-the-service-principal-in-terraform), you can sometimes see conflicts. The environment variables and the Azure value they represent are listed in the following table:

| Environment variable | Azure value |
|---------------|--------------------------|
| ARM_SUBSCRIPTION_ID | Azure subscription ID |
| ARM_TENANT_ID | Microsoft account tenant ID |
| ARM_CLIENT_ID | Azure service principal app ID |
| ARM_CLIENT_SECRET | Azure service principal password |

**Cause**: As of this writing, the Terraform script that runs in Cloud Shell overwrites the `ARM_SUBSCRIPTION_ID` and `ARM_TENANT_ID` environment variables using values from the current Azure subscription. As a result, if the service principal referenced by the environment variables doesn't have rights to the current Azure subscription, any Terraform operations will fail.

## VPN errors

For information about resolving VPN errors, see the article, [Troubleshoot a hybrid VPN connection](/azure/architecture/reference-architectures/hybrid-networking/troubleshoot-vpn).
