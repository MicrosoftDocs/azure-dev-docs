---
title: Version history for Terraform provider for Azure Resource Manager
description: View the change log (version history) for the Terraform provider for Azure Resource Manager
keywords: azure devops terraform change log release history what's new
ms.topic: reference
ms.date: 10/15/2021
ms.custom: devx-track-terraform
# Customer intent: I want to view the change log (version history) for the Terraform provider for Azure Resource Manager.
---

# Version history for Terraform provider for Azure Resource Manager

This article contains the [changelog from the HashiCorp site](https://github.com/hashicorp/terraform-provider-azurerm/blob/main/CHANGELOG.md) showing the version history for the Terraform provider for Azure Resource Manager.

:::row:::
   :::column span="":::
        **Version**
   :::column-end:::
   :::column span="":::
        **Features**
   :::column-end:::
   :::column span="":::
        **Improvements**
:::column-end:::
   :::column span="":::
        **Bug fixes**
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
        2.82.0 (Unreleased)
   :::column-end:::
   :::column span="":::
   :::column-end:::
   :::column span="":::
        - dependencies: upgrading to `v58.0.0` of `github.com/Azure/azure-sdk-for-go` ([#13613](https://github.com/hashicorp/terraform-provider-azurerm/issues/13613))
        - `azurerm_lb_nat_pool` - support for the `floating_ip_enabled`, `tcp_reset_enabled`, and `idle_timeout_in_minutes` properties ([#12538](https://github.com/hashicorp/terraform-provider-azurerm/issues/12538))
   :::column-end:::
   :::column span="":::
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
        2.81.0 (October 14, 2021)
   :::column-end:::
        * **New Data Source:** `azurerm_consumption_budget_resource_group`([#12538](https://github.com/hashicorp/terraform-provider-azurerm/issues/12538))
        * **New Data Source:** `azurerm_consumption_budget_subscription`([#12540](https://github.com/hashicorp/terraform-provider-azurerm/issues/12540))
        * **New Resource:** `azurerm_data_factory_linked_service_cosmosdb_mongoapi` ([#13636](https://github.com/hashicorp/terraform-provider-azurerm/issues/13636))
        * **New Resource:** `azurerm_mysql_flexible_server` ([#13678](https://github.com/hashicorp/terraform-provider-azurerm/issues/13678))
   :::column span="":::
        * upgrading `batch` to API Version `2021-06-01`([#13718](https://github.com/hashicorp/terraform-provider-azurerm/issues/13718))
        * upgrading `mssql` to API Version `v5.0`([#13622](https://github.com/hashicorp/terraform-provider-azurerm/issues/13622))
        * Data Source: `azurerm_key_vault` - exports the `enable_rbac_authorization` attribute ([#13717](https://github.com/hashicorp/terraform-provider-azurerm/issues/13717))
        * `azurerm_app_service` - support for the `key_vault_reference_identity_id` property ([#13720](https://github.com/hashicorp/terraform-provider-azurerm/issues/13720))
        * `azurerm_lb` - support for the `sku_tier` property ([#13680](https://github.com/hashicorp/terraform-provider-azurerm/issues/13680))
        * `azurerm_eventgrid_event_subscription` - support the `delivery_property` block ([#13595](https://github.com/hashicorp/terraform-provider-azurerm/issues/13595))
        * `azurerm_mssql_server` - support for the `user_assigned_identity_ids` and `primary_user_assigned_identity_id` properties ([#13683](https://github.com/hashicorp/terraform-provider-azurerm/issues/13683))
        * `azurerm_network_connection_monitor` - add support for the `destination_port_behavior` property ([#13518](https://github.com/hashicorp/terraform-provider-azurerm/issues/13518))
        * `azurerm_security_center_workspace` - now supports the `Free` pricing tier ([#13710](https://github.com/hashicorp/terraform-provider-azurerm/issues/13710))
        * `azurerm_kusto_attached_database_configuration` - support for the `sharing` property ([#13487](https://github.com/hashicorp/terraform-provider-azurerm/issues/13487))
   :::column-end:::
   :::column span="":::
        * Data Source: `azurerm_cosmosdb_account`- prevent a panic from an index out of range error ([#13560](https://github.com/hashicorp/terraform-provider-azurerm/issues/13560))
        * `azurerm_function_app_slot` - the `client_affinity` property has been deprecated as it is no longer configurable in the service's API ([#13711](https://github.com/hashicorp/terraform-provider-azurerm/issues/13711))
        * `azurerm_kubernetes_cluster` - the `kube_config` and `kube_admin_config` blocks can now be marked entirely as `Sensitive` via an environment variable ([#13732](https://github.com/hashicorp/terraform-provider-azurerm/issues/13732))
        * `azurerm_logic_app_workflow` - will not check for `nil` and empty access control properties ([#13689](https://github.com/hashicorp/terraform-provider-azurerm/issues/13689))
        * `azurerm_management_group` - will not nil check child management groups when deassociating a subscription from a management group ([#13540](https://github.com/hashicorp/terraform-provider-azurerm/issues/13540))
        * `azurerm_subnet_resource` - will now lock the virtual network and subnet on updates ([#13726](https://github.com/hashicorp/terraform-provider-azurerm/issues/13726))
        * `azurerm_app_configuration_key` - can now mix labeled and unlabeled keys ([#13736](https://github.com/hashicorp/terraform-provider-azurerm/issues/13736))
   :::column-end:::
:::row-end:::
