---
title: Configure Passwordless Database Connections for Java Apps on Red Hat JBoss EAP
titleSuffix: Azure
description: Configure passwordless datasource connections for Java apps on Red Hat JBoss EAP.
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: how-to
ms.date: 07/17/2025
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

Before proceeding, ensure that the Azure identity you use to sign in and complete this article has either the [Owner](/azure/role-based-access-control/built-in-roles#owner) role in the current subscription or the [Contributor](/azure/role-based-access-control/built-in-roles#contributor) and [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) roles in the current subscription. For an overview of Azure roles, see [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview) For details on the specific roles required by the Red Hat JBoss EAP marketplace offer, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).

This section shows you how to configure the passwordless data source connection using the Azure Marketplace offers for Red Hat JBoss EAP.

First, begin the process of deploying an offer. The following offers support passwordless database connections:

- [JBoss EAP Standalone on RHEL VM](https://aka.ms/eap-vm-single-portal)
- [JBoss EAP Cluster on RHEL VMs](https://aka.ms/eap-vm-cluster-portal). For more information, see [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm).

Enter the required information in the **Basics** pane and other panes if you want to enable the features. When you reach the **Database** pane, enter the passwordless configuration as shown in the following steps:

1. For **Connect to database?**, select **Yes**.
1. Under **Connection settings**, for **Choose database type**, open the dropdown menu and then select **Azure SQL (supports passwordless connection)**.
1. For **JNDI Name**, enter **testpasswordless** or your expected value.
1. For **DataSource Connection String**, input the connection string you obtained in last section.
1. Select **Use passwordless datasource connection**.
1. For **User assigned managed identity**, select the managed identity you created in previous step. In this example, its name is **myManagedIdentity**.
1. Select **Add**.

The **Connection settings** section should look like the following screenshot:

:::image type="content" source="media/how-to-configure-passwordless-datasource-eap/azure-portal-azure-sql-configuration.png" alt-text="Screenshot of the Azure portal that shows the Choose database type page." lightbox="media/how-to-configure-passwordless-datasource-eap/azure-portal-azure-sql-configuration.png":::

## Verify the database connection

The database connection is configured successfully if the offer deployment completes without error.

After the deployment completes, follow these steps in the Azure portal to find the Admin console URL.

1. Find the resource group in which you deployed JBoss EAP.
1. Under **Settings**, select **Deployments**.
1. Select the deployment with the longest **Duration**. This deployment should be at the bottom of the list.
1. Select **Outputs**.
1. The URL of the admin console is the value of the **adminConsole** output.
1. Copy the value of the output variable **adminConsole**.
1. Paste the value into your browser address bar and press <kbd>Enter</kbd> to open the sign-in page of the Integrated Solutions Console.

Use the following steps to verify the database connection:

1. Sign in to the admin console with the username and password you provided on the **Basics** pane.

   :::image type="content" source="media/how-to-configure-passwordless-datasource-eap/admin-console-login.png" alt-text="Screenshot of admin console login screen." lightbox="media/how-to-configure-passwordless-datasource-eap/admin-console-login.png":::

1. After you sign in, select **Configuration** from the main menu.
1. In the column browser, select **Subsystems**, **Datasources & Drivers**, **Datasources**, **dataSource-mssqlserver**.
1. In the dropdown menu, select **Test connection**
1. You should see a message stating something similar to `Successfully tested connection for data source dataSource-mssqlserver.`

The following screenshot highlights the relevant user interface elements:

:::image type="content" source="media/how-to-configure-passwordless-datasource-eap/screenshot-eap-console-successful-database.png" alt-text="Screenshot of the admin console that shows the test database page." lightbox="media/how-to-configure-passwordless-datasource-eap/screenshot-eap-console-successful-database.png":::

## Clean up resources

If you don't need these resources, you can delete them by using the following commands:

```azurecli-interactive
az group delete --name ${RESOURCE_GROUP_NAME}
az group delete --name <resource-group-name-that-deploys-the-offer>
```

## Next steps

Learn more about running JBoss EAP on  Azure RedHat OpenShift and virtual machines by following these links:

> [!div class="nextstepaction"]
> [Explore JBoss EAP products on Azure](/azure/developer/java/ee/jboss-on-azure)

> [!div class="nextstepaction"]
> [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Quickstart: Deploy JBoss EAP on Azure Red Hat OpenShift](/azure/openshift/howto-deploy-java-jboss-enterprise-application-platform-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Migrate JBoss EAP applications to JBoss EAP on Azure VMs](/azure/developer/java/migration/migrate-jboss-eap-to-jboss-eap-on-azure-vms?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

> [!div class="nextstepaction"]
> [Tutorial: Migrate JBoss EAP Application Server to Azure Virtual Machines with high availability and disaster recovery](/azure/developer/java/migration/migrate-jboss-eap-to-vms-with-ha-dr?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)
