---
title: Storage account conversion drift warning
ms.author: vranade
ms.topic: include
ms.date: 09/02/2026
ms.custom: devx-track-terraform
---
 
> [!WARNING]
> Azure Storage account conversions can change storage account properties outside of Terraform. If Terraform detects these changes before you update your configuration, it might plan to delete and recreate the storage account. This action can cause application downtime or data loss.
>
> Before starting a storage account conversion:
> - Disable automatic approval for Terraform deployments and review every `terraform plan` for unexpected resource replacement.
> - Set `prevent_destroy = true` in the storage account resource's `lifecycle` block to help prevent accidental deletion.
> - Temporarily set `ignore_changes` for `account_replication_type` during the redundancy conversion.
> - After the conversion is complete, reconcile your Terraform configuration and state: run `terraform apply -refresh-only`, update your configuration to match the converted values, remove `ignore_changes`, then run `terraform plan` and confirm it reports no unexpected changes.
>
> For more information, see [Prevent Terraform drift for stateful Azure resources](../prevent-terraform-drift-stateful-resources.md).
