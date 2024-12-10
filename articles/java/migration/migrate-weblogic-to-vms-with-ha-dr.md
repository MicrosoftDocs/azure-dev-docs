---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebLogic Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: tutorial
ms.date: 12/05/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you a simple and effective way to implement high availability and disaster recovery (HA/DR) for Java using Oracle WebLogic Server (WLS) on Azure Virtual Machines (VMs). The solution illustrates how to achieve a low Recovery Time Objective (RTO) and Recovery Point Objective (RPO) using a simple database driven Jakarta EE application running on WLS. HA/DR is a complex topic, with many possible solutions. The best solution depends on your unique requirements. For other ways to implement HA/DR, see the resources at the end of this article.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up paired WLS clusters on Azure VMs.
> * Set up an Azure Traffic Manager.
> * Configure WLS clusters for high availability and disaster recovery.
> * Test failover from primary to secondary.

The following diagram illustrates the architecture you build:

<!-- Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/weblogic-on-vms-ha-dr-solution-architecture.pptx -->
:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png" alt-text="Diagram of the solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png" border="false":::

Azure Traffic Manager checks the health of your regions and routes the traffic accordingly to the application tier. Both the primary region and the secondary region have a full deployment of the WLS cluster. However, only the primary region is actively servicing network requests from the users. The secondary region is passive and activated to receive traffic only when the primary region experiences a service disruption. Azure Traffic Manager uses the health check feature of the Azure Application Gateway to implement this conditional routing. The primary WLS cluster is running and the secondary cluster is shut down. The geo-failover RTO of the application tier depends on the time for starting VMs and running the secondary WLS cluster. The RPO depends on the Azure SQL Database because the data is persisted and replicated in the Azure SQL Database failover group.

[!INCLUDE [ha-dr-for-wls-overview](includes/ha-dr-for-wls-overview.md)]

## Prerequisites

* An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you have either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with Windows, Linux, or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [the Microsoft build of OpenJDK](/java/openjdk)).
* Install [Maven](https://maven.apache.org/download.cgi), version 3.9.3 or later.

## Set up an Azure SQL Database failover group in paired regions

[!INCLUDE [ha-dr-for-wls-azure-sql-database-creation](includes/ha-dr-for-wls-azure-sql-database-creation.md)]
[!INCLUDE [ha-dr-for-wls-azure-sql-database-schema-vms](includes/ha-dr-for-wls-azure-sql-database-schema-vms.md)]
[!INCLUDE [ha-dr-for-wls-azure-sql-database-failover-group](includes/ha-dr-for-wls-azure-sql-database-failover-group.md)]

> [!NOTE]
> This article guides you to create an Azure SQL Database single database with SQL authentication for simplicity because the HA/DR setup this article focuses on is already very complex. A more secure practice is to use [Microsoft Entra authentication for Azure SQL](/azure/azure-sql/database/authentication-aad-overview?preserve-view=true&view=azuresql-db) for authenticating the database server connection. Consider referencing the article [Configure passwordless database connections for Java apps on Oracle WebLogic Server](../ee/how-to-configure-passwordless-datasource.md) for how to configure the database connection with Microsoft Entra authentication for your needs.

## Set up paired WLS clusters on Azure VMs

In this section, you create two WLS clusters on Azure VMs using the [Oracle WebLogic Server Cluster on Azure VMs](https://aka.ms/wls-vm-cluster) offer. The cluster in East US is primary and is configured as the active cluster later. The cluster in West US is secondary and is configured as the passive cluster later.

### Set up the primary WLS cluster

First, open the [Oracle WebLogic Server Cluster on Azure VMs](https://aka.ms/wls-vm-cluster) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

Use the following steps to fill out the **Basics** pane:

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, *wls-cluster-eastus-ejb120623*.
1. Under **Instance details**, for **Region**, select **East US**.
1. Under **Credentials for Virtual Machines and WebLogic**, provide a password for **admin account of VM** and **WebLogic Administrator**, respectively. Save aside the username and password for **WebLogic Administrator**. Consider using **SSH Public Key** as VM authentication type for better security.
1. Leave the defaults for other fields.
1. Select **Next** to go to the **TLS/SSL Configuration** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png":::

Leave the defaults in the **TLS/SSL Configuration** pane, select **Next** to go to **Azure Application Gateway** pane, and then use the following steps.

1. For **Connect to Azure Application Gateway?**, select **Yes**.
1. For **Select desired TLS/SSL certificate option**, select **Generate a self-signed certificate**.
1. Select **Next** to go to the **Networking** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on Azure VMs Azure Application Gateway pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png":::

You should see all fields pre-populated with the defaults in the **Networking** pane. Use the following steps to save the network configuration:

1. Select **Edit virtual network**. Save aside the address space of the virtual network - for example, *10.1.4.0/23*.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on Azure VMs Virtual Network pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet.png":::

1. Select `wls-subnet` to edit the subnet. Under **Subnet details**, save aside the starting address and subnet size - for example, *10.1.5.0* and */28*.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet-wls-subnet.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on Azure VMs WLS Subnet of Virtual Network pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-networking-vnet-wls-subnet.png":::

1. If you make any modifications, save the changes.
1. Return to **Networking** pane.
1. Select **Next** to go to the **Database** pane.

The following steps show you how to fill out the **Database** pane:

1. For **Connect to database?**, select **Yes**.
1. For **Choose database type**, select **Microsoft SQL Server (Support passwordless connection)** .
1. For **JNDI Name**, enter *jdbc/WebLogicCafeDB*.
1. For **DataSource Connection String**, replace the placeholders with the values you saved aside in the preceding section for the primary SQL Database - for example, *jdbc:sqlserver://sqlserverprimary-ejb120623.database.windows.net:1433;database=mySampleDatabase*.
1. For **Global transaction protocol**, select **None**.
1. For **Database username**, replace the placeholders with the values you saved aside in the preceding section for the primary SQL Database - for example, *azureuser@sqlserverprimary-ejb120623*.
1. Enter the server admin sign-in password that you saved aside previously for **Database Password**. Enter the same value for **Confirm password**.
1. Leave the defaults for the other fields.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal that shows the Oracle WebLogic Server Cluster on Azure VMs Database pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png":::

> [!NOTE]
> This article guides you to connect to an Azure SQL Database with SQL authentication for simplicity because the HA/DR setup this article focuses on is already very complex. A more secure practice is to use [Microsoft Entra authentication for Azure SQL](/azure/azure-sql/database/authentication-aad-overview?preserve-view=true&view=azuresql-db) for authenticating the database server connection. Consider referencing the article [Configure passwordless database connections for Java apps on Oracle WebLogic Server](../ee/how-to-configure-passwordless-datasource.md) for how to configure the database connection with Microsoft Entra authentication for your needs.

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 50 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

In the meantime, you can set up the secondary WLS cluster in parallel.

### Set up the secondary WLS cluster

Follow the same steps in as in the section [Set up the primary WLS cluster](#set-up-the-primary-wls-cluster) to set up the secondary WLS cluster in West US region, except for the following differences:

1. In the **Basics** pane, use the following steps:
   1. In the **Resource group** field, select **Create new** and fill in a different unique value for the resource group - for example, *wls-cluster-westtus-ejb120623*.
   1. Under **Instance details**, for **Region**, select **West US**.

1. In the **Networking** pane, use the following steps:
   1. For **Edit virtual network**, enter same address space of the virtual network as your primary WLS cluster - for example, *10.1.4.0/23*.

      > [!NOTE]
      > You should see a warning message similar to the following one: **Address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)' overlaps with address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)' of virtual network 'wls-vnet'. Virtual networks with overlapping address space cannot be peered. If you intend to peer these virtual networks, change address space '10.1.4.0/23 (10.1.4.0 - 10.1.5.255)'**. You can ignore this message because you need two WLS clusters with the same network configuration.

   1. For `wls-subnet`, enter same starting address and subnet size as your primary WLS cluster - for example, *10.1.5.0* and */28*.

1. In the **Database** pane, use the following steps:
   1. For **DataSource Connection String**, replace the placeholders with the values you saved aside in the preceding section for the secondary SQL Database - for example, *jdbc:sqlserver://sqlserversecondary-ejb120623.database.windows.net:1433;database=mySampleDatabase*.
   1. For **Database username**, replace the placeholders with the values you saved aside in the preceding section for the secondary SQL Database - for example, *azureuser@sqlserversecondary-ejb120623*.

### Mirror the network settings for the two clusters

During the phase of resuming pending transactions in the secondary WLS cluster after a failover, WLS checks the ownership of the TLOG store. To successfully pass the check, all managed servers in the secondary cluster must have same private IP address as the primary cluster.

This section shows you how to mirror the network settings from the primary cluster to the secondary cluster.

First, use the following steps to configure network settings for the primary cluster after its deployment completes:

1. In **Overview** pane of the **Deployment** page, select **Go to resource group**.
1. Select the network interface `adminVM_NIC_with_pub_ip`.
   1. Under **Settings**, select **IP configurations**.
   1. Select `ipconfig1`.
   1. Under **Private IP address settings**, select **Static** for **Allocation**. Save aside the private IP address.
   1. Select **Save**.
1. Return to the resource group of the primary WLS cluster, then repeat step 3 for the network interfaces `mspVM1_NIC_with_pub_ip`, `mspVM2_NIC_with_pub_ip`, and `mspVM3_NIC_with_pub_ip`.
1. Wait until all updates complete. You can select the notifications icon in the Azure portal to open the **Notifications** pane for status monitoring.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-notifications-icon.png" alt-text="Screenshot of the Azure portal notifications icon.":::

1. Return to the resource group of the primary WLS cluster, then copy the name for the resource with type **Private endpoint** - for example, *7e8c8bsaep*. Use that name to find the remaining network interface - for example, *7e8c8bsaep.nic.c0438c1a-1936-4b62-864c-6792eec3741a*. Select it and follow the preceding steps to get its private IP address.

Then, use the following steps to configure the network settings for the secondary cluster after its deployment completes:

1. In the **Overview** pane of the **Deployment** page, select **Go to resource group**.
1. For the network interfaces `adminVM_NIC_with_pub_ip`, `mspVM1_NIC_with_pub_ip`, `mspVM2_NIC_with_pub_ip`, and `mspVM3_NIC_with_pub_ip`, follow the preceding steps to update the private IP address allocation to *Static*.
1. Wait until all updates complete.
1. For the network interfaces `mspVM1_NIC_with_pub_ip`, `mspVM2_NIC_with_pub_ip`, and `mspVM3_NIC_with_pub_ip`, follow the preceding steps but update the private IP address to the same value used with the primary cluster. Wait until the current update of network interface completes before proceeding to next one.

   > [!NOTE]
   > You can't change the private IP address of the network interface that is part of a private endpoint. To easily mirror the private IP addresses of network interfaces for managed servers, consider updating the private IP address for `adminVM_NIC_with_pub_ip` to an IP address that isn't used. Depending on the allocation of private IP addresses in your two clusters, you might need to update the private IP address in the primary cluster as well.

The following table shows an example of mirroring the network settings for two clusters:

| Cluster   | Network interface                                     | Private IP address (before) | Private IP address (after) | Update sequence |
|-----------|-------------------------------------------------------|-----------------------------|----------------------------|-----------------|
| Primary   | `7e8c8bsaep.nic.c0438c1a-1936-4b62-864c-6792eec3741a` | `10.1.5.4`                  | `10.1.5.4`                 |                 |
| Primary   | `adminVM_NIC_with_pub_ip`                             | `10.1.5.7`                  | `10.1.5.7`                 |                 |
| Primary   | `mspVM1_NIC_with_pub_ip`                              | `10.1.5.5`                  | `10.1.5.5`                 |                 |
| Primary   | `mspVM2_NIC_with_pub_ip`                              | `10.1.5.8`                  | `10.1.5.9`                 | 1               |
| Primary   | `mspVM3_NIC_with_pub_ip`                              | `10.1.5.6`                  | `10.1.5.6`                 |                 |
| Secondary | `1696b0saep.nic.2e19bf46-9799-4acc-b64b-a2cd2f7a4ee1` | `10.1.5.8`                  | `10.1.5.8`                 |                 |
| Secondary | `adminVM_NIC_with_pub_ip`                             | `10.1.5.5`                  | `10.1.5.4`                 | 4               |
| Secondary | `mspVM1_NIC_with_pub_ip`                              | `10.1.5.7`                  | `10.1.5.5`                 | 5               |
| Secondary | `mspVM2_NIC_with_pub_ip`                              | `10.1.5.6`                  | `10.1.5.9`                 | 2               |
| Secondary | `mspVM3_NIC_with_pub_ip`                              | `10.1.5.4`                  | `10.1.5.6`                 | 3               |

Check the set of private IP addresses for all managed servers, which consists of the backend pool of the Azure Application Gateway you deployed in each cluster. If it's updated, use the following steps to update the Azure Application Gateway backend pool accordingly:

1. Open the resource group of the cluster.
1. Find the resource *myAppGateway* with the type **Application gateway**. Select it to open it.
1. In the **Settings** section, select **Backend pools**, then select `myGatewayBackendPool`.
1. Change the **Backend targets** values with the updated private IP address or addresses, then select **Save**. Wait until it completes.
1. In the **Settings** section, select **Health probes**, then select **HTTPhealthProbe**.
1. Make sure **I want to test the backend health before adding the health probe** is selected, then select **Test**. You should see that the **Status** value of the backend pool `myGatewayBackendPool` is marked as healthy. If it isn't, check whether private IP addresses are updated as expected and the VMs are running, then test the health probe again. You must troubleshoot and resolve the issue before you continue.

In the following example, the Azure Application Gateway backend pool for each cluster is updated:

| Cluster   | Azure Application Gateway backend pool | Backend targets (before)             | Backend targets (after)              |
|-----------|----------------------------------------|--------------------------------------|--------------------------------------|
| Primary   | `myGatewayBackendPool`                 | (`10.1.5.5`, `10.1.5.8`, `10.1.5.6`) | (`10.1.5.5`, `10.1.5.9`, `10.1.5.6`) |
| Secondary | `myGatewayBackendPool`                 | (`10.1.5.7`, `10.1.5.6`, `10.1.5.4`) | (`10.1.5.5`, `10.1.5.9`, `10.1.5.6`) |

To automate the network settings mirroring, consider using Azure CLI. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

### Verify the deployments of the clusters

You deployed an Azure Application Gateway and a WLS admin server in each cluster. The Azure Application Gateway acts as load balancer for all managed servers in the cluster. The WLS admin server provides a web console for cluster configuration.

Use the following steps to verify whether the Azure Application Gateway and WLS admin console in each cluster work before moving to next step:

1. Return to the **Deployment** page, then select **Outputs**.
1. Copy the value of the property **appGatewayURL**. Append the string *weblogic/ready* and then open that URL in a new browser tab. You should see an empty page without any error message. If you don't, you must troubleshoot and resolve the issue before you continue.
1. Copy and save aside the value of the property **adminConsole**. Open it in a new browser tab. You should see the sign-in page of the **WebLogic Server Administration Console**. Sign in to the console with the user name and password for WebLogic administrator you saved aside previously. If you aren't able to sign in, you must troubleshoot and resolve the issue before you continue.

Use the following steps to get the IP address of the Azure Application Gateway for each cluster. You use these values when you set up the Azure Traffic Manager later.

1. Open the resource group where your cluster is deployed - for example, select **Overview** to switch back to the Overview pane of the deployment page. Then, select **Go to resource group**.
1. Find the resource `gwip` with the type **Public IP address**, then select it to open it. Look for the **IP address** field and save aside its value.

## Set up an Azure Traffic Manager

[!INCLUDE [ha-dr-for-wls-vm-azure-traffic-manager](includes/ha-dr-for-wls-vm-azure-traffic-manager.md)]

## Configure the WLS clusters for high availability and disaster recovery

In this section, you configure WLS clusters for high availability and disaster recovery.

### Prepare the sample app

[!INCLUDE [ha-dr-for-wls-azure-prepare-sample-app](includes/ha-dr-for-wls-azure-prepare-sample-app.md)]

### Deploy the sample app

Now use the following steps to deploy the sample app to the clusters, starting from the primary cluster:

1. Open the *adminConsole* of the cluster in a new tab of your web browser. Sign in to the WebLogic Server Administration Console with the username and password of the WebLogic Administrator you saved aside previously.
1. Locate **Domain structure** > **wlsd** > **Deployments** in the navigation pane. Select **Deployments**.
1. Select **Lock & Edit** > **Install** > **Upload your file(s)** > **Choose File**. Select the *weblogic-cafe.war* file that you prepared previously.
1. Select **Next** > **Next** > **Next**. Select `cluster1` with option **All servers in the cluster** for the deployment targets. Select **Next** > **Finish**. Select **Activate Changes**.
1. Switch to the **Control** tab and select `weblogic-cafe` from the deployments table. Select **Start** with the option **Servicing all requests** > **Yes**. Wait for a while and refresh the page until you see that the state of the deployment `weblogic-cafe` is **Active**. Switch to the **Monitoring** tab and verify that the context root of the deployed application is */weblogic-cafe*. Keep the WLS admin console open so you can use it later for further configuration.

Repeat the same steps in WebLogic Server Administration Console, but for the secondary cluster in the West US region.

### Update the front end host

Use the following steps to make your WLS clusters aware of the Azure Traffic Manager. Because the Azure Traffic Manager is the entry point for user requests, update the **Front Host** of the WebLogic Server cluster to the DNS name of the Traffic Manager profile, starting from the primary cluster.

1. Make sure you're signed in to WebLogic Server Administration Console.
1. Navigate to **Domain structure** > **wlsd** > **Environment** > **Clusters** in the navigation pane. Select **Clusters**.
1. Select `cluster1` from the clusters table.
1. Select **Lock & Edit** > **HTTP**. Remove the current value for **Frontend Host**, and enter the DNS name of the Traffic Manager profile you saved aside previously, without the leading `http://` - for example, *tmprofile-ejb120623.trafficmanager.net*. Select **Save** > **Activate Changes**.

Repeat the same steps in the WebLogic Server Administration Console, but for the secondary cluster in the West US region.

### Configure the Transaction Log Store

Next, configure the JDBC Transaction Log Store for all managed servers of clusters, starting from the primary cluster. This practice is described in [Using Transaction Log Files to Recover Transactions](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wljta/trxcon.html#GUID-7EFC9496-CC51-440D-885D-7E8B3C85FA15).

Use the following steps on the primary WLS cluster in the US East region:

1. Make sure you're signed in to the WebLogic Server Administration Console.
1. Navigate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the navigation pane. Select **Servers**.
1. You should see servers `msp1`, `msp2`, and `msp3` listed in the servers table.
1. Select `msp1` > **Services** > **Lock & Edit**. Under **Transaction Log Store**, select **JDBC**.
1. For **Type** > **Data Source**, select `jdbc/WebLogicCafeDB`.
1. Confirm that the value for **Prefix Name** is *TLOG_msp1_*, which is the default value. If the value is different, change it to *TLOG_msp1_*.
1. Select **Save**.
1. Select **Servers** > `msp2`, and repeat the same steps, except that the default value for **Prefix Name** is *TLOG_msp2_*.
1. Select **Servers** > `msp3`, and repeat the same steps, except that the default value for **Prefix Name** is *TLOG_msp3_*.
1. Select **Activate Changes**.

Repeat the same steps in WebLogic Server Administration Console, but for the secondary cluster in the West US region.

### Restart the managed servers of the primary cluster

Then, use the following steps to restart all the managed servers of the primary cluster for the changes to take effect:

1. Ensure that you're signed in to WebLogic Server Administration Console.
1. Navigate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the navigation pane. Select **Servers**.
1. Select the **Control** tab. Select `msp1`, `msp2`, and `msp3`. Select **Shutdown** with the option **When work completes** > **Yes**. Select the refresh icon. Wait until the **Status of Last Action** value is *TASK COMPLETED*. You should see that the **State** value for the selected servers is *SHUTDOWN*. Select the refresh icon again to stop status monitoring.
1. Select `msp1`, `msp2`, and `msp3` again. Select **Start** > **Yes**. Select the refresh icon. Wait until the **Status of Last Action** value is *TASK COMPLETED*. You should see that the **State** value for the selected servers is *RUNNING*. Select the refresh icon again to stop status monitoring.

### Stop the VMs in the secondary cluster

Now, use the following steps to stop all VMs in the secondary cluster to make it passive:

1. Open the Azure portal home in a new tab of your browser, then select **All resources**. In the **Filter for any field...** box, enter the resource group name where the secondary cluster is deployed - for example, *wls-cluster-westus-ejb120623*.
1. Select **Type equals all** to open the **Type** filter. For **Value**, enter *Virtual machine*. You should see one entry matched. Select it for **Value**. Select **Apply**. You should see 4 VMs listed, including `adminVM`, `mspVM1`, `mspVM2`, and `mspVM3`.
1. Select to open each of the VMs. Select **Stop** and confirm for each VM.
1. Select the notifications icon from the Azure portal to open the **Notifications** pane.
1. Monitor the event **Stopping virtual machine** for each VM until the value becomes **Successfully stopped virtual machine**. Keep the page open so you can use it for the failover test later.

Now, switch to the browser tab where you monitor the endpoints' status of the Traffic Manager. Refresh the page until you see that the endpoint `myFailoverEndpoint` is *Degraded* and the endpoint `myPrimaryEndpoint` is *Online*.

> [!NOTE]
> A production-ready HA/DR solution would probably want to achieve a lower RTO by leaving the VMs running but only stopping the WLS software running on the VMs. Then, in the event of failover, the VMs would already be running and the WLS software would take less time to start. This article chose to stop the VMs because the software deployed by [Oracle WebLogic Server Cluster on Azure VMs](https://aka.ms/wls-vm-cluster) automatically starts the WLS software when the VMs start.

### Verify the app

[!INCLUDE [ha-dr-for-wls-azure-verify-sample-app](includes/ha-dr-for-wls-azure-verify-sample-app.md)]

## Test failover from primary to secondary

To test failover, you manually fail your primary database server and cluster over to the secondary database server and cluster, and then fail back using the Azure portal in this section.

### Failover to the secondary site

First, use the following steps to shut down the VMs in the primary cluster:

1. Find the name of your resource group where the primary WLS cluster is deployed - for example, *wls-cluster-eastus-ejb120623*. Then follow the steps in the [Stop VMs in the secondary cluster](#stop-the-vms-in-the-secondary-cluster) section, but change the target resource group to your primary WLS cluster, to stop all VMs in that cluster.
1. Switch to the browser tab of your Traffic Manager, refresh the page until you see that the **Monitor status** value of the endpoint *myPrimaryEndpoint* becomes *Degraded*.
1. Switch to the browser tab of the sample app and refresh the page. You should see *504 Gateway Time-out* or *502 Bad Gateway* because none of endpoints is accessible.

Next, use the following steps to failover the Azure SQL Database from the primary server to the secondary server:

1. Switch to the browser tab of your Azure SQL Database failover group.
1. Select **Failover** > **Yes**.
1. Wait until it completes.

Then, use the following steps to start all servers in the secondary cluster:

1. Switch to the browser tab where you stopped all the VMs in the secondary cluster.
1. Select the VM `adminVM`. Select **Start**.
1. Monitor the event **Starting virtual machine** for `adminVM` in the **Notifications** pane, and wait until the value becomes **Started virtual machine**.
1. Switch to the browser tab of the WebLogic Server Administration Console for the secondary cluster, then refresh the page until you see the welcome page for sign in.
1. Switch back to the browser tab where all the VMs in the secondary cluster are listed. For the VMs `mspVM1`, `mspVM2`, and `mspVM3`, select each one to open it and then select **Start**.
1. For the VMs `mspVM1`, `mspVM2`, and `mspVM3`, monitor the event **Starting virtual machine** in the **Notifications** pane, and wait until the values become **Started virtual machine**.

[!INCLUDE [ha-dr-for-wls-azure-verify-sample-app-test-failover](includes/ha-dr-for-wls-azure-verify-sample-app-test-failover.md)]

### Fail back to the primary site

Use the same steps in the [Failover to the secondary site](#failover-to-the-secondary-site) section to fail back to the primary site including database server and cluster, except for the following differences:

1. First, shut down the VMs in the secondary cluster. You should see that endpoint `myFailoverEndpoint` becomes *Degraded*.
1. Next, failover the Azure SQL Database from the secondary server to the primary server.
1. Then, start all servers in the primary cluster.
1. Finally, verify the sample app after the endpoint `myPrimaryEndpoint` is *Online*.

## Clean up resources

If you're not going to continue to use the WLS clusters and other components, use the following steps to delete the resource groups to clean up the resources used in this tutorial:

1. Enter the resource group name of Azure SQL Database servers (for example, `myResourceGroup`) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 1-4 for the resource group of the Traffic Manager - for example, `myResourceGroupTM1`.
1. Repeat steps 1-4 for the resource group of the primary WLS cluster - for example, `wls-cluster-eastus-ejb120623`.
1. Repeat steps 1-4 for the resource group of the secondary WLS cluster - for example, `wls-cluster-westus-ejb120623`.

## Next steps

In this tutorial, you set up an HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is shut down, and the secondary database is on standby.

Continue to explore the following references for more options to build HA/DR solutions and run WLS on Azure:

> [!div class="nextstepaction"]
> [Disaster Recovery solutions for Oracle Fusion Middleware products](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.4/asdrg/index.html#Oracle%C2%AE-Fusion-Middleware)
> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
