---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy WebLogic Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: jiangma
ms.topic: how-to
ms.date: 12/05/2023
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java,, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Virtual Machines with high availability and disaster recovery

This tutorial shows you how to deploy the Oracle WebLogic Server (WLS) on Azure Virtual Machines (VMs) that integrates with Azure SQL Database and Azure Traffic Manager for high availability and disaster recovery.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png" alt-text="Solution architecture of WLS on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/solution-architecture.png":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Set up an Azure SQL Database failover group in paired regions, which allows you to manage the replication and failover of databases to another Azure region.
> - Set up paired WLS clusters on Azure VMs, where your application workload is deployed and running.
> - Set up an Azure Traffic Manager, which allows you to distribute traffic to your public facing applications across the global Azure regions.
> - Configure WLS clusters for high availability and disaster recovery.
> - Test failover.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Make sure you've been assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).
* Prepare a local machine with either Windows, Linux or macOS installed.
* Install and set up [Git](/devops/develop/git/install-and-set-up-git).
* Install a Java SE implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.9.3 or higher.

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your WLS clusters and app.

Create a single database in Azure SQL Database and add it to an auto-failover group by following the Azure portal steps in [Tutorial: Add an Azure SQL Database to an auto-failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal). Execute the steps up to, but not including **Clean up resources**. Use the following directions as you go through the article, then return to this document after you create and configure the Azure SQL Database failover group.

1. When you reach the section [1 - Create a database](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal#1---create-a-database):
   1. In step 7 for creating new resource group, write down **Resource group name**. For example, *myResourceGroup*.
   1. In step 8 for database details, write down **Database name**. For example, *mySampleDatabase*.
   1. In step 9 for creating the primary server:
      * Select **(US) West US** for **Location**.
      * Write down **Server admin login**. For example, *azureuser*.
      * Write down **Password**.
   1. In step 12 for **Networking** configuration, select **Yes** for **Allow Azure services and resources to access this server**.
   1. After the deployment completes, select **Go to resource** to open **SQL database** page.
      1. In the **Query editor (preview)** pane, enter **azureuser** for **Login**, server admin login password you wrote down before for **Password**, and select **OK**. You should see **Query editor** window after successful login.

      > [!NOTE]
      > If login failed with the similar error message **Client with IP address 'xx.xx.xx.xx' is not allowed to access the server**, select **Allowlist IP xx.xx.xx.xx on server \<your-sqlserver-name\>** at the end of the error message. Wait until server firewall rules updates complete and select **OK** again.

      1. Copy and paste the following SQL query to the editor, and select **Run**. You should see message **Query succeeded: Affected rows: 0** after successful run.

      ```sql
      create table TLOG_msp1_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp2_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp3_primary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp1_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp2_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table TLOG_msp3_secondary_WLStore (ID DECIMAL(38) NOT NULL, TYPE DECIMAL(38) NOT NULL, HANDLE DECIMAL(38) NOT NULL, RECORD VARBINARY(MAX) NOT NULL, PRIMARY KEY (ID));
      create table wl_servlet_sessions (wl_id VARCHAR(100) NOT NULL, wl_context_path VARCHAR(100) NOT NULL, wl_is_new CHAR(1), wl_create_time DECIMAL(20), wl_is_valid CHAR(1), wl_session_values VARBINARY(MAX), wl_access_time DECIMAL(20), wl_max_inactive_interval INTEGER, PRIMARY KEY (wl_id, wl_context_path));
      ```

      These database tables are used for storing transaction logs and sessions data for your WLS clusters and app later.

1. When you reach the section [2 - Create the failover group](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal#2---create-the-failover-group):
   1. In step 5 for creating the **Failover group**, write down the unique name for **Failover group name**. For example, *failovergroup-ejb120523*.
   1. In step 5 for creating the secondary server, select **(US) East US** for **Location**. Make sure **Allow Azure services to access server** is checked.

1. When you reach the section [3 - Test failover](/azure/azure-sql/database/failover-group-add-single-database-tutorial?view=azuresql-db&preserve-view=true&tabs=azure-portal#3---test-failover):
   1. After you complete all steps, keep the failover group page open and you use it for failover test of the WLS clusters later.

## Set up paired WLS clusters on Azure VMs

In this section, you create two WLS clusters on Azure VMs using [Oracle WebLogic Server Cluster on Azure VMs](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster) offer. The cluster in West US is primary and is configured as active cluster later. Oppositely, the cluster in East US is secondary and is configured as passive cluster later.

### Set up the primary WLS cluster

First, open [Oracle WebLogic Server Cluster on Azure VMs](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster) offer in your browser and select **Create**. You should see **Basics** pane of the offer.

The following steps show you how to fill out the **Basics** pane shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-basics.png":::

1. Ensure that the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group. For example, *wls-cluster-westus-ejb120523*.
1. Under **Instance details**, select **West US** for **Region**.
1. Under **Credentials for Virtual Machines and WebLogic**, provide a password for **admin account of VM** and **WebLogic Administrator**, respectively. Write down username and password for **WebLogic Administrator**.
1. Leave the defaults for other fields.
1. Select **Next** to **TLS/SSL Configuration** pane.

Leave the defaults in **TLS/SSL Configuration** pane, select **Next** to **Azure Application Gateway** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Azure Application Gateway pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-azure-app-gateway.png":::

1. Select **Yes** for **Connect to Azure Application Gateway?**.
1. Select **Generate a self-signed certificate** for **Select desired TLS/SSL certificate option**.
1. Select **Next** to **Networking** pane.

You should see all fields are prepopulated with the defaults, select **Next** to **Database** pane.

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal showing the Oracle WebLogic Server Cluster on Azure VMs Database pane." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/portal-database.png":::

1. Select **Yes** for **Connect to database?**.
1. Select **Microsoft SQL Server (Support passwordless connection)** for **Choose database type**.
1. Enter *jdbc/WebLogicCafeDB* for **JNDI Name**.
1. Replace the placeholders in datasource connection string (*jdbc:sqlserver://\<failover-group-name\>.database.windows.net:1433;database=\<database-name\>*) with valid values you wrote down before, for example, *jdbc:sqlserver://failovergroup-ejb120523.database.windows.net:1433;database=mySampleDatabase*. Enter it for **DataSource Connection String**.
1. Select **None** for **Global transaction protocol**.
1. Replace the placeholders in database username (*\<server-admin-login\>@\<failover-group-name\>*) with valid values you wrote down before, for example, *azureuser@failovergroup-ejb120523*. Enter it for **Database username**.
1. Enter server admin login password you wrote down before for **Database Password**. Enter the same value for **Confirm password**. 
1. Leave the defaults for other fields.
1. Select **Review + create**. 

Wait until **Running final validation...** successfully completes, then select **Create**. After a while, you should see **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment may take up to 50 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.

In the meanwhile, you can set up the secondary WLS cluster in parallel.

### Set up the secondary WLS cluster

Follow the same steps in section [Set up the primary WLS cluster](#set-up-the-primary-wls-cluster) to set up the secondary WLS cluster in East US region, except the following differences:

1. In the "Basics" pane:
   1. In the **Resource group** field, select **Create new** and fill in a different unique value for the resource group. For example, *wls-cluster-eastus-ejb120523*.
   1. Under **Instance details**, select **East US** for **Region**.

### Verify deployments of clusters

Wait until both deployments of WLS clusters complete. In each cluster, there is an Azure Application Gateway and WLS admin server deployed. The Azure Application Gateway acts as load balancer for all managed servers in the cluster. The WLS admin server provides a web console for cluster configuration. 

Follow instructions to verify if the Azure Application Gateway and WLS admin console in each cluster work before moving to next step.

1. Select **Outputs** from the deployment page.
1. Copy the value of property **appGatewayURL**. Append it with *weblogic/ready* and open in a new browser tab. You should see an empty page without any error message. If not, you must troubleshoot and resolve the issue before continuing.
1. Copy and write down the value of property **adminConsole**. Open it in a new browser tab. You should see login page of **WebLogic Server AdministrationConsole**. Sign in to the console with the user name and password for WebLogic administrator you wrote down before. If you aren't able to sign in, you must troubleshoot and resolve the issue before continuing.

Write down the IP address of the Azure Application Gateway for each cluster, you use them when you set up the Azure Traffic Manager later.

1. Open the resource group where your cluster is deployed. For example, select **Overview** to switch back Overview pane of the deployment page, and select **Go to resource group**.
1. Find resource *gwip* with type **Public IP address**. Select to open. Look for **IP address** and write down its value.

## Set up an Azure Traffic Manager

In this section, you create an Azure Traffic Manager for distributing traffic to your public facing applications across the global Azure regions. The primary endpoint points to the Azure Application Gateway in the primary WLS cluster, and the secondary endpoint points to the Azure Application Gateway in the secondary WLS cluster.

Create an Azure Traffic Manager profile by following [Quickstart: Create a Traffic Manager profile using the Azure portal](/azure/traffic-manager/quickstart-create-traffic-manager-profile). You just need to execute some of sections, including **Create a Traffic Manager profile**, **Add Traffic Manager endpoints**, and **Test Traffic Manager profile**. Use the following directions as you go through these sections, then return to this document after you create and configure the Azure Traffic Manager.

1. When you reach the section [Create a Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#create-a-traffic-manager-profile):
   1. In step 2 **Create Traffic Manager profile**:
      * Write down the unique Traffic Manager profile name for **Name**. For example, *tmprofile-ejb120523*.
      * Write down the new resource group name for **Resource group**. For example, *myResourceGroupTM1*.

1. When you reach the section [Add Traffic Manager endpoints](/azure/traffic-manager/quickstart-create-traffic-manager-profile#add-traffic-manager-endpoints):
   1. After you open the Traffic Manager profile in step 2, in the **Configuration** page:
      1. Enter *10* for **DNS time to live (TTL)**.
      1. Under **Endpoint monitor settings**, enter */weblogic/ready* for **Path**.
      1. Under **Fast endpoint failover settings**, enter *10* for **Probing internal**, *3* for **Tolerated number of failures**, *5* for **Probe timeout**.
      1. Select **Save**, wait until it completes.
   1. In step 4 for adding the primary endpoint *myPrimaryEndpoint*:
      * Select **Public IP address** for **Target resource type**.
      * Click dropdown **Choose public IP address** and enter IP address of resource *gwip* deployed in **West US** WLS cluster you wrote down before, you should see one entry matched. Select it for **Public IP address**.
   1. In step 6 for adding a failover / secondary endpoint *myFailoverEndpoint*:
      * Select **Public IP address** for **Target resource type**.
      * Click dropdown **Choose public IP address** and enter IP address of resource *gwip* deployed in **East US** WLS cluster you wrote down before, you should see one entry matched. Select it for **Public IP address**.
   1. Wait for a while, select **Refresh** until **Monitor status** of both endpoints is **Online**. 

1. When you reach the section [Test Traffic Manager profile](/azure/traffic-manager/quickstart-create-traffic-manager-profile#test-traffic-manager-profile):
   1. In subsection [Check the DNS name](/azure/traffic-manager/quickstart-create-traffic-manager-profile#check-the-dns-name):
      * In step 3, write down the DNS name of your Traffic Manager profile, for example, `http://tmprofile-ejb120523.trafficmanager.net`.
   1. In subsection [View Traffic Manager in action](/azure/traffic-manager/quickstart-create-traffic-manager-profile#view-traffic-manager-in-action):
      * In step 1 and 3, append */weblogic/ready* to DNS name of your Traffic Manager profile in your web browser, for example, `http://tmprofile-ejb120523.trafficmanager.net/weblogic/ready`. You should see an empty page without any error message.
      * After completing all steps, make sure **enable** your primary endpoint by referencing step 2, but replace **Disabled** with **Enabled**. Then return to **Endpoints** page.

Now you have both endpoints **Enabled** and **Online** in the Traffic Manager profile, keep the page open and you use it for monitoring the endpoint status later.

## Configure WLS clusters

In this section, you configure WLS clusters for high availability and disaster recovery.

### Prepare sample app

Build and package a sample CRUD Java/JakartaEE EE application that is deployed and running on WLS clusters for failover test later.

1. Check out the repository: `git clone https://github.com/Azure-Samples/azure-cafe.git`.
1. Locate the path where the repository was downloaded: `cd azure-cafe`.
1. Change to its subdirctory *weblogic-cafe*: `cd weblogic-cafe`
1. Compile and package the sample application: `mvn clean package`.

The package should be successfully generated and located at `<parent-path-to-your-local-clone>/azure-cafe/weblogic-cafe/target/weblogic-cafe.war`. If you don't see the package, you must troubleshoot and resolve the issue before continuing.

### Deploy sample app

Now deploy sample app to clusters, starting from the primary cluster.

1. Open *adminConsole* of the cluster in a new tab of your web browser, sign in to WebLogic Server AdministrationConsole with username and password of WebLogic Administrator you wrote down before.
1. Locate to **Domain structure** > **wlsd** > **Deployments** in the left navigation area. Select **Deployments**.
1. Select **Lock & Edit** > **Install** > **Upload your file(s)** > **Choose File**. Select *weblogic-cafe.war* you prepared above. 
1. Select **Next** > **Next** > **Next**. Select **cluster1** with option **All servers in the cluster** for deployment targets. Select **Next** > **Finish**. Select **Activate Changes**.
1. Switch to **Control** tab and check **weblogic-cafe** from deployments table. Select **Start** with option **Servicing all requests** > **Yes**. Wait for a while and refresh the page, until you see the state of deployment *weblogic-cafe* is **Active**. Switch to **Monitoring** tab and verify that the context root of the deployed application is */weblogic-cafe*. Keep the WLS admin console open, you use it later for further configuration.

Repeat the same steps in WebLogic Server AdministrationConsole, but for the secondary cluster.

### Update Frontend Host

Since the Azure Traffic Manager is the entry point for user requests, update the **Front Host** of the WebLogic cluster to the DNS name of the Traffic Manager profile, starting from the primary cluster.

1. Make sure you signed in to WebLogic Server AdministrationConsole.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Clusters** in the left navigation area. Select **Clusters**.
1. Select **cluster1** from clusters table.
1. Select **Lock & Edit** > **HTTP**. Remove the current value for **Frontend Host**, and enter the DNS name of the Traffic Manager profile you wrote down before, without leading `http://`. For example, *tmprofile-ejb120523.trafficmanager.net*. Select **Save** > **Activate Changes**.

Repeat the same steps in WebLogic Server AdministrationConsole, but for the secondary cluster.

### Configure Transaction Log Store

Next, configure JDBC Transaction Log Store for all managed servers of clusters, starting from the primary cluster.

1. Make sure you signed in to WebLogic Server AdministrationConsole.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the left navigation area. Select **Servers**.
1. You should see server *msp1*, *msp2* and *msp3* listed in the servers table. 
1. Select **msp1** > **Services** > **Lock & Edit**. Under **Transaction Log Store**, select **JDBC** for **Type**, select **jdbc/WebLogicCafeDB** for **Data Source**, set *TLOG_msp1_primary_* for **Prefix Name**. Select **Save**.
1. Select **Servers** > **msp2**, and execute the same steps, except that setting *TLOG_msp2_primary_* for **Prefix Name** under **Transaction Log Store** section.
1. Select **Servers** > **msp2**, and execute the same steps, except that setting *TLOG_msp3_primary_* for **Prefix Name** under **Transaction Log Store** section.
1. Select **Activate Changes**.

Repeat the same steps in WebLogic Server AdministrationConsole, but for the secondary cluster, except the following differences:

1. For server **msp1**, set *TLOG_msp1_secondary_* for **Prefix Name** under **Transaction Log Store** section.
1. For server **msp2**, set *TLOG_msp2_secondary_* for **Prefix Name** under **Transaction Log Store** section.
1. For server **msp3**, set *TLOG_msp3_secondary_* for **Prefix Name** under **Transaction Log Store** section.

### Restart managed servers

Then, restart all managed servers for the changes to take effect, starting from the primary cluster.

1. Make sure you have signed in to WebLogic Server AdministrationConsole.
1. Locate to **Domain structure** > **wlsd** > **Environment** > **Servers** in the left navigation area. Select "Servers".
1. Select **Control** tab. Check *msp1*, *msp2* and *msp3*. Select **Shutdown** with option **When work completes** > **Yes**. Select refresh icon. Wait until **Status of Last Action** is *TASK COMPLETED*. You should see **State** for selected servers is *SHUTDOWN*. Select refresh icon again to stop status monitoring.
1. Check *msp1*, *msp2* and *msp3* again. Select **Start** > **Yes**. Select refresh icon. Wait until **Status of Last Action** is *TASK COMPLETED*. You should see **State** for selected servers is *RUNNING*. Select refresh icon again to stop status monitoring.

Repeat the same steps in WebLogic Server AdministrationConsole, but for the secondary cluster.

### Verify app

While the sample app is deployed and running on both clusters, the primary cluster acts as the active cluster and handles all user requests due to its higher priority configured in your Traffic Manager profile.

Open the DNS name of your Azure Traffic Manager profile in a new tab of the browser, appending with the context root */weblogic-cafe* of the deployed app, for example, `http://tmprofile-ejb120523.trafficmanager.net/weblogic-cafe`.
Create a new coffee with name and price (for example, *Coffee 1* with price *10*), which is persisted into both application data table and session table of the database. You should see the similar UI of the sample app:

:::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

If you don't see the similar UI, you must troubleshoot and resolve the issue before continuing.

Keep the page open and you use it for failover test later.

## Test failover

By default, both your Azure SQL database failover group and Azure Traffic Manager supports automatic failover.

To test failover, you manually fail your primary database server and cluster over to the secondary database server and cluster, and then fail back using the Azure portal in this section.

### Failover to the secondary site

Execute the following steps to fail over to the secondary site including database server and cluster.

1. Switch to the browser tab of your Azure SQL Database failover group. 
1. Select **Failover** > **Yes**. Wait until it completes.
1. Switch to the browser tab where two endpoints of your Traffic Manager profile are listed. Select the primary endpoint *myPrimaryEndpoint*.
1. Select **Disabled** for **Status**, select **Save**. Wait until it completes. Wait an extra minute so that the Traffic Manager routes the traffic to the secondary endpoint.
1. Swtich to the browser tab of the sample app, refresh the page, you should see the same data persisted in application data table and session table displayed in the UI.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui-failover.png" alt-text="Screenshot of the sample application UI after failover." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui-failover.png":::

   If you don't see the similar UI, that's may be because the Traffic Manager is taking time to update DNS to point to the failover site, or your browser cached the DNS name resolution result that points to the failed site. Wait for a while and refresh the page again.

### Fail back to the primary site

Execute the following steps to failback to the primary site including database server and cluster.

1. Switch to the browser tab of your Azure SQL Database failover group. 
1. Select **Failover** > **Yes**. Wait until it completes.
1. Switch to the browser tab where the primary endpoint *myPrimaryEndpoint* of your Traffic Manager is displayed.
1. Select **Enabled** for **Status**, select **Save**. Wait until it completes. Wait an extra minute so that the Traffic Manager routes the traffic back to the primary endpoint.
1. Swtich to the browser tab of the sample app, refresh the page, you should see the same data persisted in application data table and session table displayed in the UI.

   :::image type="content" source="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI after fail back." lightbox="media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

   If you don't see the similar UI, that's may be because the Traffic Manager is taking time to update DNS to point to the failover site, or your browser cached the DNS name resolution result that points to the failed site. Wait for a while and refresh the page again.

## Clean up resources

If you're not going to continue to use the WLS clusters and other components, delete the resource groups to clean up the resources used in this tutorial.

1. Enter the resource group name of Azure SQL Database servers (for example, **myResourceGroup**) in the search box at the top of the Azure portal, and select the matched resource group from the search results.
1. Select **Delete resource group**.
1. In **Enter resource group name to confirm deletion**, enter the resource group name.
1. Select **Delete**.
1. Repeat steps 1-4 for the resource group of the Traffic Manager, for example, **myResourceGroupTM1**.
1. Repeat steps 1-4 for the resource group of the primary WLS cluster, for example, **wls-cluster-westus-ejb120523**.
1. Repeat steps 1-4 for the resource group of the secondary WLS cluster, for example, **wls-cluster-eastus-ejb120523**.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure VMs](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
