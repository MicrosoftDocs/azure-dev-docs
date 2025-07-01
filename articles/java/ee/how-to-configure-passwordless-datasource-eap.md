---
title: Configure Passwordless Database Connections for Java Apps on Red Hat JBoss EAP
titleSuffix: Azure
description: Configure passwordless datasource connections for Java apps on Red Hat JBoss EAP.
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.topic: how-to
ms.date: 07/01/2025
ms.custom: devx-track-azurecli, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-javaee-wls-vm, has-azure-ad-ps-ref, passwordless-java
---

# Configure passwordless database connections for Java apps on Red Hat JBoss EAP

This article shows you how to configure passwordless database connections for Java apps on Red Hat JBoss EAP offers with the Azure portal.

In this guide, you accomplish the following tasks:

> [!div class="checklist"]
> - Provision database resources using Azure CLI.
> - Enable the Microsoft Entra administrator in the database.
> - Provision a user-assigned managed identity and create a database user for it.
> - Configure a passwordless database connection in Red Hat JBoss EAP offers with the Azure portal.
> - Validate the database connection.

The offers support passwordless connections for Azure database for PostgreSQL and Azure SQL databases.

[!INCLUDE [how-to-configure-passwordless-datasource-non-appserver](includes/how-to-configure-passwordless-datasource-non-appserver.md)]

## Configure a passwordless database connection for Red Hat JBoss EAP on Azure VMs

Before proceeding, ensure that the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

This section shows you how to configure the passwordless data source connection using the Azure Marketplace offers for Red Hat JBoss EAP.

First, begin the process of deploying an offer. The following offers support passwordless database connections:

- [JBoss EAP Standalone on RHEL VM](https://aka.ms/eap-vm-single-portal)
- [JBoss EAP Cluster on RHEL VMs](https://aka.ms/eap-vm-cluster-portal). For more information, see [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm).

Enter the required information in the **Basics** pane and other panes if you want to enable the features. When you reach the **Database** pane, enter the passwordless configuration as shown in the following steps:

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure SQL (with support for passwordless connection)**.
1. For **JNDI Name**, enter **testpasswordless** or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is **myManagedIdentity**.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot:

:::image type="content" source="media/how-to-configure-passwordless-datasource-websphere/azure-portal-azure-sql-configuration.png" alt-text="Screenshot of the Azure portal that shows the Choose database type page." lightbox="media/how-to-configure-passwordless-datasource-websphere/azure-portal-azure-sql-configuration.png":::

## Verify the database connection

The database connection is configured successfully if the offer deployment completes without error.

After the deployment completes, follow these steps in the Azure portal to find the Admin console URL.

1. Find the resource group in which you deployed WebSphere.
1. Under **Settings**, select **Deployments**.
1. Select the deployment with the longest **Duration**. This deployment should be at the bottom of the list.
1. Select **Outputs**.
1. The URL of the Integrated Solutions Console is the value of the **adminSecuredConsole** output.
1. Copy the value of the output variable **adminSecuredConsole**.
1. Paste the value into your browser address bar and press <kbd>Enter</kbd> to open the sign-in page of the Integrated Solutions Console.

Use the following steps to verify the database connection:

1. Sign in to the Integrated Solutions Console with the username and password you provided on the **Basics** pane.
1. In the navigation pane, expand **Resources** then **JDBC**.
1. Select **Data sources**.
1. Select the check box next to the row with the **JNDI name** value matching the value you entered in the **Database** tab.
1. Select **Test connection**.
1. You should see a message stating something similar to `The test connection operation for data source dataSource-sqlserver on server server1 at node was0aef4a-vmNode01 was successful.`

The following screenshot highlights the relevant user interface elements:

:::image type="content" source="media/how-to-configure-passwordless-datasource-websphere/screenshot-twas-console-successful-database.png" alt-text="Screenshot of the Integrated solutions console that shows the test database page." lightbox="media/how-to-configure-passwordless-datasource-websphere/screenshot-twas-console-successful-database.png":::

## Clean up resources

If you don't need these resources, you can delete them by using the following commands:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP_NAME}
az group delete --name <resource-group-name-that-deploys-the-offer>
```

## Next steps

Learn more about running WebSphere Application Server on AKS, Azure RedHat OpenShift, or virtual machines by following these links:

> [!div class="nextstepaction"]
> [Explore IBM WebSphere products on Azure](websphere-family.md)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to AKS](../migration/migrate-websphere-to-azure-kubernetes-service.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to Azure Red Hat OpenShift](../migration/migrate-websphere-to-azure-redhat-openshift.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Migrate WebSphere applications to Azure Virtual Machines](../migration/migrate-websphere-to-virtual-machines.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
