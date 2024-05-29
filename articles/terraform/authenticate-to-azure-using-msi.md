---
title: Authenticate Terraform using Managed Identity
description: Learn the various options to configure and authenticate Terraform to Azure using Managed Identity for Azure services
keywords: azure devops terraform cli powershell authentication microsoft account subscription environment variables provider block
ms.topic: how-to
ms.date: 05/28/2024
ms.custom: devx-track-terraform, devx-track-azurepowershell
# Customer intent: I want to authenticate Terraform to Azure.
---

# Authenticate Terraform using Managed Identity

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

[Managed identities for Azure resources](/azure/entra/identity/managed-identities-azure-resources/overview) is used to authenticate to Azure Active Directory. HashiCorp recommends using either a Service Principal or managed identity if you are running Terraform in a non-interactive manner. In this article, we'll cover examples using the two types of managed identities: [system-assigned](using-a-system-assigned-managed-identity) and [user-assigned](using-a-user-assigned-managed-identity).

## Using a system-assigned managed identity


## Using a user-assigned managed identity


## Next steps
