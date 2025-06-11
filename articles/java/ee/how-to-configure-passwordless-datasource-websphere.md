---
title: Configure Passwordless Database Connections for Java Apps on IBM WebSphere Application Server
titleSuffix: Azure
description: Configure passwordless datasource connection using marketplace offers.
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.topic: how-to
ms.date: 06/10/2025 
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-javaee-wls-vm, has-azure-ad-ps-ref, passwordless-java
---

# Configure passwordless database connections for Java apps on IBM WebSphere Application Server

This article shows you how to configure passwordless database connections for Java apps on IBM WebSphere Application Server offers with the Azure portal.

In this guide, you accomplish the following tasks:

> [!div class="checklist"]
> - Provision database resources using Azure CLI.
> - Enable the Microsoft Entra administrator in the database.
> - Provision a user-assigned managed identity and create a database user for it.
> - Configure a passwordless database connection in IBM WebSphere Application Server offers with the Azure portal.
> - Validate the database connection.

The offers support passwordless connections for PostgreSQL, MySQL, and Azure SQL databases.

[!INCLUDE [how-to-configure-passwordless-datasource-non-appserver](includes/how-to-configure-passwordless-datasource-non-appserver.md)]

## Configure a passwordless database connection for IBM WebSphere Application Server on Azure VMs

Before proceeding, Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

## Clean up resources

If you don't need these resources, you can delete them by using the following commands:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP_NAME}
az group delete --name <resource-group-name-that-deploys-the-offer>
```

## Next steps

Learn more about running WebSphere Application Server on AKS, Azure RedHat OpenShift or virtual machines by following these links:

> [!div class="nextstepaction"]
> [Explore IBM WebSphere products on Azure](/azure/developer/java/ee/websphere-family)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to AKS](/azure/developer/java/migration/migrate-websphere-to-azure-kubernetes-service?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to Azure Red Hat OpenShift](/azure/developer/java/migration/migrate-websphere-to-azure-redhat-openshift?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to Azure Virtual Machines](/azure/developer/java/migration/migrate-websphere-to-virtual-machines?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
