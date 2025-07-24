---
title: Configure Passwordless Database Connections for Java Apps on Oracle WebLogic Server
titleSuffix: Azure
description: Configure passwordless datasource connection using marketplace offers.
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.topic: how-to
ms.date: 04/01/2025 
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, devx-track-javaee-wls-vm, has-azure-ad-ps-ref, passwordless-java
---

# Configure passwordless database connections for Java apps on Oracle WebLogic Server

This article shows you how to configure passwordless database connections for Java apps on Oracle WebLogic Server offers with the Azure portal.

In this guide, you accomplish the following tasks:

> [!div class="checklist"]
> - Provision database resources using Azure CLI.
> - Enable the Microsoft Entra administrator in the database.
> - Provision a user-assigned managed identity and create a database user for it.
> - Configure a passwordless database connection in Oracle WebLogic offers with the Azure portal.
> - Validate the database connection.

The offers support passwordless connections for PostgreSQL, MySQL, and Azure SQL databases.

[!INCLUDE [how-to-configure-passwordless-datasource-non-appserver](includes/how-to-configure-passwordless-datasource-non-appserver.md)]

## Configure a passwordless database connection for Oracle WebLogic Server on Azure VMs

Before proceeding, Ensure the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by Oracle WebLogic marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

This section shows you how to configure the passwordless data source connection using the Azure Marketplace offers for Oracle WebLogic Server.

First, begin the process of deploying an offer. The following offers support passwordless database connections:

- [Oracle WebLogic Server on Azure Kubernetes Service (AKS)](https://aka.ms/wls-aks-portal)
    - [Quickstart](/azure/aks/howto-deploy-java-wls-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/ee/breadcrumb/toc.json)
- [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster)
    - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Oracle WebLogic Server with Admin Server on VMs](https://aka.ms/wls-vm-admin)
    - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
- [Oracle WebLogic Server Dynamic Cluster on VMs](https://aka.ms/wls-vm-dynamic-cluster)
    - [Quickstart](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

Enter the required information in the **Basics** pane and other panes if you want to enable the features. When you reach the **Database** pane, enter the passwordless configuration as shown in the following steps:

### [MySQL Flexible Server](#tab/mysql-flexible-server)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, from the dropdown menu select **MySQL (with support for passwordless connection)**.
1. For **JNDI Name**, enter **testpasswordless** or your expected value.
1. For **DataSource Connection String**, enter the connection string you obtained in the last section.
1. For **Database username**, enter the database user name of your managed identity, which is the value of `${IDENTITY_LOGIN_NAME}`. In this example, the value is **identity-contoso**.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created previously. In this example, its name is **myManagedIdentity**.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource-wls/screenshot-database-portal.png" alt-text="Screenshot of the Azure portal showing the Configure database pane of the Create Oracle WebLogic Server on VMs page." lightbox="media/how-to-configure-passwordless-datasource-wls/screenshot-database-portal.png":::

### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure Database for PostgreSQL (with support for passwordless connection)**.
1. For **JNDI Name**, enter **testpasswordless** or your expected value.
1. For **DataSource Connection String**, enter the connection string you obtained in last section.
1. For **Database username**, enter your managed identity name. In this example, the value is **myManagedIdentity**.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is **myManagedIdentity**.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example:

:::image type="content" source="media/how-to-configure-passwordless-datasource-wls/azure-portal-postgresql-configuration.png" alt-text="Screenshot of the Azure portal showing the Configure PostgreSQL database page." lightbox="media/how-to-configure-passwordless-datasource-wls/azure-portal-postgresql-configuration.png":::

### [Azure SQL Database](#tab/azure-sql-database)

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure SQL (with support for passwordless connection)**.
1. For **JNDI Name**, enter **testpasswordless** or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is **myManagedIdentity**.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot, which uses [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example.

:::image type="content" source="media/how-to-configure-passwordless-datasource-wls/azure-portal-azure-sql-configuration.png" alt-text="Screenshot of the Azure portal showing the Configure Azure SQL database page." lightbox="media/how-to-configure-passwordless-datasource-wls/azure-portal-azure-sql-configuration.png":::

---

You finished configuring the passwordless connection. You can continue to fill in the following panes or select **Review + create**, then **Create** to deploy the offer.

## Verify the database connection

The database connection is configured successfully if the offer deployment completes without error.

Continuing to take [Oracle WebLogic Server Cluster on VMs](https://aka.ms/wls-vm-cluster) as an example, after the deployment completes, follow these steps in the Azure portal to find the Admin console URL.

1. Find the resource group in which you deployed WLS.
1. Under **Settings**, select **Deployments**.
1. Select the deployment with the longest **Duration**. This deployment should be at the bottom of the list.
1. Select **Outputs**.
1. The URL of the WebLogic Administration Console is the value of the **adminConsoleUrl** output.
1. Copy the value of the output variable **adminConsoleUrl**.
1. Paste the value into your browser address bar and press <kbd>Enter</kbd> to open the sign-in page of the WebLogic Administration Console.

Use the following steps to verify the database connection:

1. Sign in to the WebLogic Administration Console with the username and password you provided on the **Basics** pane.
1. Under the **Domain Structure**, select **Services**, **Data Sources**, then **testpasswordless**.
1. Select the **Monitoring** tab, where the state of the data source is **Running**, as shown in the following screenshot:

   ### [MySQL Flexible Server](#tab/mysql-flexible-server)

   :::image type="content" source="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-datasource-state.png" alt-text="Screenshot of the WebLogic Console portal showing the MySQL datasource state." lightbox="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-datasource-state.png":::

   ### [PostgreSQL Flexible Server](#tab/postgresql-flexible-server)

   :::image type="content" source="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-postgresql-state.png" alt-text="Screenshot of the WebLogic Console portal showing the PostgreSQL datasource state." lightbox="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-postgresql-state.png":::

   ### [Azure SQL Database](#tab/azure-sql-database)

   :::image type="content" source="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-sql-server-state.png" alt-text="Screenshot of the WebLogic Console portal showing the SQL Server datasource state." lightbox="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-sql-server-state.png":::

1. Select the **Testing** tab, and then select the radio button next to the desired server.
1. Select **Test Data Source**. You should see a message indicating a successful test, as shown in the following screenshot:

   :::image type="content" source="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-successful-database.png" alt-text="Screenshot of the WebLogic Console portal showing a successful test of the datasource." lightbox="media/how-to-configure-passwordless-datasource-wls/screenshot-weblogic-console-successful-database.png":::

## Clean up resources

If you don't need these resources, you can delete them by using the following commands:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP_NAME}
az group delete --name <resource-group-name-that-deploys-the-offer>
```

## Next steps

Learn more about running WLS on AKS or virtual machines by following these links:

> [!div class="nextstepaction"]
> [Explore WebLogic Server on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Explore WebLogic Server on Azure Virtual Machines](/azure/virtual-machines/workloads/oracle/oracle-weblogic?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Passwordless Connections Samples for Java Apps](https://github.com/Azure-Samples/Passwordless-Connections-for-Java-Apps)
