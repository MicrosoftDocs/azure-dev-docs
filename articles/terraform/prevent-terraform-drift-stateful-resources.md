---
title: Prevent Terraform drift for stateful Azure resources
description: Learn how to reduce the risk of unexpected resource replacement, application downtime, and data loss when changes to stateful Azure resources cause Terraform configuration drift.
ms.topic: how-to
ms.date: 08/18/2026
ms.custom:
 - devx-track-terraform
---
# Prevent Terraform drift for stateful Azure resources

[!INCLUDE [Terraform abstract](./includes/abstract.md)]

Changes made to a stateful Azure resource outside of Terraform can cause the deployed resource to differ from its Terraform configuration and state. Terraform detects these differences as configuration drift. If a changed property can't be updated in place, Terraform might plan to delete and recreate the resource.

Replacing a stateful resource can cause application downtime or data loss if you don't review and manage the plan carefully. Azure Storage account conversions are one example of a supported Azure operation that can modify resource properties outside of Terraform.

This article explains how to reduce the risks associated with Terraform drift for stateful resources. It uses Azure Storage account conversions as a specific example.
Examples of stateful Azure resources include Azure Storage accounts, Azure SQL databases, Azure Cosmos DB accounts, and Azure managed disks.

In this article, you learn how to:

> [!div class="checklist"]
> 
> * Identify drift that might cause Terraform to replace a stateful resource.
> * Review Terraform plans for unexpected resource replacement.
> * Use Terraform lifecycle settings to reduce the risk of accidental deletion.
> * Reconcile your Terraform configuration and state after an out-of-band change.

## Understand drift for stateful resources

Terraform compares your configuration and state with the current state of Azure resources to determine whether changes are required. When Azure or another process modifies a resource outside of Terraform, Terraform detects the difference as configuration drift.
Some resource properties require replacement when they change. If Terraform can't update a changed property in place, it plans to delete and recreate the resource. This behavior requires special attention for stateful resources because replacement can interrupt applications or permanently remove stored data.

## Review every Terraform plan

Always review the output of `terraform plan` after an Azure service or another process changes a stateful resource outside of Terraform. Avoid automatically approving deployments that manage stateful resources.
If Terraform plans to replace a stateful resource, investigate the proposed changes before running `terraform apply`. Confirm which property changed, why Terraform considers replacement necessary, and whether the resource contains data or supports a production workload.

For example, after completing an Azure Storage account conversion, review the plan for unexpected changes to the storage account. Terraform might plan to replace the account if the conversion changed a property that can't be updated in place.

## Protect stateful resources from accidental deletion

To reduce the risk of accidental deletion, configure the stateful resource with the `prevent_destroy` lifecycle setting. The following example applies this protection to an Azure Storage account:

```terraform
resource "azurerm_storage_account" "example" {
 ...
 lifecycle {
   prevent_destroy = true
 }
}
```

When you enable `prevent_destroy`, Terraform stops the deployment instead of deleting the storage account. This safeguard gives you time to investigate the planned changes before production resources are affected.

`prevent_destroy` only blocks destroy-and-recreate operations. It doesn't prevent Terraform from updating properties in place, such as reverting a same-family redundancy change back to your configured value. Use `ignore_changes` to handle that case.

## Ignore changes made during a planned operation

When a supported Azure operation is expected to modify a stateful resource outside of Terraform, you can temporarily configure Terraform to ignore only the properties that the operation changes.
The following example ignores the storage account properties that Azure updates during a Storage account conversion:

```terraform
resource "azurerm_storage_account" "example" {
 ...
 lifecycle {
   ignore_changes = [
     account_replication_type
   ]
 }
}
```

Using `ignore_changes` prevents Terraform from attempting to immediately reconcile conversion-related property changes while the conversion is in progress.

## Understand which storage account redundancy changes require replacement

Whether Terraform replaces the storage account depends on the type of redundancy change.

Same-family redundancy changes stay within the non-zonal set (LRS, GRS, RA-GRS) or the zonal set (ZRS, GZRS, RA-GZRS) and can typically be updated without recreating the storage account. For example:

- LRS to GRS
- GRS to RA-GRS
- RA-GRS to GRS

Cross-family redundancy changes move a storage account between the non-zonal set and the zonal set. If Terraform drives this kind of change directly, the AzureRM provider plans a replacement of the storage account. Examples include:

- LRS to ZRS
- GRS to ZRS
- RA-GRS to RA-GZRS

Similarly, upgrading a Storage account to StorageV2 is performed in place and doesn't require recreating the storage account.

## Reconcile Terraform after an out-of-band change

After the planned operation is complete, reconcile your Terraform configuration and state by using the following sequence:
1. Run `terraform apply -refresh-only` to update Terraform state with the actual values that Azure applied during the operation.
1. Update your Terraform configuration to match the converted values.
1. Remove any temporary `ignore_changes` settings.
1. Run `terraform plan` and confirm that Terraform reports no unexpected changes.
   
If the storage account is missing from Terraform state entirely, use `terraform import` to bring it under management. Don't use `import` to reconcile a resource that Terraform already manages. The resource ID doesn't change during a supported redundancy conversion, so importing it again fails with an "already managed" error.

### Storage account conversion example

If the change is a same-family redundancy update and doesn't recreate the storage account, reconcile your Terraform configuration and state by using the same sequence: run `terraform apply -refresh-only`, update your configuration to match the updated values, remove `ignore_changes`, then run `terraform plan` and confirm it reports no unexpected changes.

If the redundancy conversion crosses the zonal boundary, `Start-AzStorageAccountMigration` converts the existing storage account in place and preserves its resource ID. Terraform doesn't automatically detect or reconcile this change. Run `terraform apply -refresh-only`, update your configuration to match the converted values, remove `ignore_changes`, then run `terraform plan` and confirm it reports no unexpected changes.

If Terraform state no longer reflects the deployed storage account for any other reason, run `terraform apply -refresh-only` followed by a configuration update, as described earlier in this section. Only use `terraform import` if the storage account is missing from Terraform state entirely.

## Use supported Azure operations

For example, when you perform a redundancy change that adds or removes zone redundancy, use the Azure conversion workflow `Start-AzStorageAccountMigration`. The supported process helps Azure perform the conversion safely while minimizing operational risk.

For same-family redundancy changes that don't cross the zonal boundary, such as LRS to GRS, use `Set-AzStorageAccount -SkuName` or the equivalent Azure CLI operation instead.

To further protect your resources, consider applying a `CanNotDelete` Azure resource lock before changing a stateful resource to reduce the risk of accidental deletion. A `CanNotDelete` lock blocks deletion while still allowing updates, unlike a `ReadOnly` lock, which would also block the conversion itself. Remove the lock before any intentional replacement of the resource.


## Next steps

> [!div class="nextstepaction"]
> [Store Terraform state in Azure Storage](./store-state-in-azure-storage.md)
