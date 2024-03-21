---
title: "Tutorial: Migrate WebSphere Liberty/Open Liberty to Azure Kubernetes Service with high availability and disaster recovery"
description: Shows how to deploy WebSphere Liberty/Open Liberty to Azure Kubernetes Service with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: tutorial
ms.date: 03/25/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-websphere, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, migration-java, devx-track-extended-java
---

# Tutorial: Migrate WebSphere Liberty/Open Liberty to Azure Kubernetes Service with high availability and disaster recovery

This tutorial shows you a simple and effective way to implement high availability and disaster recovery (HA/DR) for Java using WebSphere Liberty/Open Liberty on Azure Kubernetes Service (AKS). The solution illustrates how to achieve a low Recovery Time Objective (RTO) and Recovery Point Objective (RPO) using a simple database driven Jakarta EE application running on WebSphere Liberty/Open Liberty. HA/DR is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement HA/DR, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up the primary WebSphere Liberty/Open Liberty cluster on AKS.
> * Set up disaster recovery for the cluster using Azure Backup.
> * Set up an Azure Traffic Manager.
> * Test failover from primary to secondary.

The following diagram illustrates the architecture you build:

<!-- Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/liberty-on-aks-ha-dr-solution-architecture.pptx -->
:::image type="content" source="media/migrate-liberty-to-aks-with-ha-dr/solution-architecture.png" alt-text="Diagram of the solution architecture of WebSphere Liberty/Open Liberty on AKS with high availability and disaster recovery." lightbox="media/migrate-liberty-to-aks-with-ha-dr/solution-architecture.png" border="false":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. The primary region has a full deployment of the WebSphere Liberty/Open Liberty cluster. After the primary region is protected, the secondary region is restored during the failover using the Azure Backup. As a result, the primary region is actively servicing network requests from the users. The secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption. Azure Traffic Manager detects the health of the app endpoint to implement the conditional routing. The geo-failover RTO of the application tier depends on the time for restoring and starting the secondary cluster. The RPO depends on the backup policy of the Azure Backup and Azure SQL Database because the cluster data is stored and replicated in the local storage connected to the AKS and application data is persisted and replicated in the Azure SQL Database failover group.

The database tier consists of an Azure SQL Database failover group with a primary server and a secondary server. The read/write listener endpoint always points to the primary server and is connected to WebSphere Liberty/Open Liberty cluster in each region. A geo-failover switches all secondary databases in the group to the primary role. For geo-failover RPO and RTO of Azure SQL Database, see [Overview of Business Continuity](/azure/azure-sql/database/business-continuity-high-availability-disaster-recover-hadr-overview?view=azuresql-db&preserve-view=true).

This tutorial was written with the Azure Backup and Azure SQL Database service because the tutorial relies on the HA features of these services. Other database choices are possible, but the HA features of whatever database you chose must be considered.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you're assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify it by following steps in [List role assignments for a user or group](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with Windows, Linux, or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [the Microsoft build of OpenJDK](/java/openjdk)).
* Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WebSphere Liberty/Open Liberty clusters and app. In a later section, you configure WebSphere Liberty/Open Liberty to store its session data to this database. This practice references [Creating a table for session persistence](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=persistence-creating-table-session).

First, create the primary Azure SQL Database by following the Azure portal steps in [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal). Follow the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this article after you create and configure the Azure SQL Database:

1. When you reach the section [Create a single database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-portal#create-a-single-database), use the following steps:
   1. In step 4 for creating new resource group, write down the **Resource group name** value - for example, *myResourceGroup*.
   1. In step 5 for database name, write down the **Database name** value - for example, *mySampleDatabase*.
   1. In step 6 for creating the server, use the following steps:
      1. Fill in a unique server name - for example, *sqlserverprimary-mjg032524*.
      1. For **Location**, select **(US) East US**.
      1. For **Authentication method**, select **Use SQL authentication**.
      1. Write down the **Server admin login** value - for example, *azureuser*.
      1. Write down the **Password** value.
   1. In step 8, for **Workload environment**, select **Development**. Look at the description and consider other options for your workload.
   1. In step 11, for **Backup storage redundancy**, select **Locally-redundant backup storage**. Consider other options for your backups. For more information, see the [Backup storage redundancy](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true#backup-storage-redundancy) section of [Automated backups in Azure SQL Database](/azure/azure-sql/database/automated-backups-overview?view=azuresql-db&preserve-view=true).
   1. In step 14, in the **Firewall rules** configuration, for **Allow Azure services and resources to access this server**, select **Yes**.

Then, create an Azure SQL Database failover group by following the Azure portal steps in [Configure a failover group for Azure SQL Database](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db). You just need the following sections: [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group) and [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover). Use the following steps as you go through the article, then return to this article after you create and configure the Azure SQL Database failover group:

1. When you reach the section [Create failover group](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#create-failover-group), use the following steps:
   1. In step 5 for creating the failover group, enter and write down the unique failover group name - for example, *failovergroup-mjg032524*. 
   1. In step 5 for configuring the server, select the option to create a new secondary server and then use the following steps:
      1. Enter a unique server name - for example, *sqlserversecondary-mjg032524*.
      1. Enter the same server admin and password as your primary server.
      1. For **Location**, select **(US) West US**.
      1. Make sure **Allow Azure services to access server** is selected.
   1. In step 5 for configuring the **Databases within the group**, select the database you created in the primary server - for example, *mySampleDatabase*.

1. After you complete all the steps in the section [Test planned failover](/azure/azure-sql/database/failover-group-configure-sql-db?view=azuresql-db&preserve-view=true&tabs=azure-portal&pivots=azure-sql-single-db#test-planned-failover), keep the failover group page open and use it for the failover test of the WebSphere Liberty/Open Liberty clusters later.

## Set up the primary WebSphere Liberty/Open Liberty cluster on AKS

In this section, you create the primary WebSphere Liberty/Open Liberty cluster on AKS using the [](https://aka.ms/liberty-aks) offer. The secondary cluster is restored from the primary cluster during the failover using the Azure Backup later.

### Deploy the primary WebSphere Liberty/Open Liberty cluster

First, open the [IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service](https://aka.ms/twas-cluster-portal) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

Use the following steps to fill out the **Basics** pane:

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *liberty-aks-eastus-mjg032524*.
1. Under **Instance details**, for **Region**, select **East US**.
1. Select **Next** to go to the **AKS** pane.

:::image type="content" source="media/migrate-liberty-to-aks-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service Basics pane." lightbox="media/migrate-liberty-to-aks-with-ha-dr/portal-basics.png":::

Wait for a while, you should see all fields pre-populated with the defaults in the **AKS** pane. Select **Next** to go to the **Load balancing** pane.

:::image type="content" source="media/migrate-liberty-to-aks-with-ha-dr/portal-aks.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service AKS pane." lightbox="media/migrate-liberty-to-aks-with-ha-dr/portal-aks.png":::

Use the following steps to fill out the **Load balancing** pane:

1. For **Connect to Azure Application Gateway?**, select **Yes**.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **Operator and application** pane.

:::image type="content" source="media/migrate-liberty-to-aks-with-ha-dr/portal-load-balancing.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service Load balancing pane." lightbox="media/migrate-liberty-to-aks-with-ha-dr/portal-load-balancing.png":::

The following steps show you how to fill out the **Operator and application** pane:

1. Leave the defaults for all fields.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

:::image type="content" source="media/migrate-liberty-to-aks-with-ha-dr/portal-operator-and-application.png" alt-text="Screenshot of the Azure portal that shows the IBM WebSphere Liberty and Open Liberty on Azure Kubernetes Service Operator and application pane." lightbox="media/migrate-liberty-to-aks-with-ha-dr/portal-operator-and-application.png":::

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 25 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

