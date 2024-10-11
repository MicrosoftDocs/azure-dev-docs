---
title: "Tutorial: Migrate JBoss EAP Application Server to Azure Virtual Machines with high availability and disaster recovery"
description: Shows how to deploy JBoss EAP Application Server to Azure Virtual Machines with high availability and disaster recovery.
author: KarlErickson
ms.author: zhihaoguo
ms.topic: tutorial
ms.date: 05/07/2024
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm, migration-java
---

# Tutorial: Migrate JBoss EAP Application Server to Azure Virtual Machines with high availability and disaster recovery

[!INCLUDE [ha-dr-for-jboss-vms-intro-head.md](includes/ha-dr-for-jboss-vms-intro-head.md)]

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Set up the JBoss EAP cluster on Azure VMs.
> * Use Azure optimized best practices to achieve high availability and disaster recovery.
> * Set up a Microsoft Azure SQL Database failover group in paired regions.
> * Set up disaster recovery for the cluster using Azure Site Recovery.
> * Set up an Azure Traffic Manager.
> * Test failover from primary to secondary.

The following diagram illustrates the architecture you build:

<!-- Diagram source https://github.com/Azure-Samples/azure-cafe/blob/main/diagrams/jboss-eap-on-vms-ha-dr-solution-architecture.pptx -->

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/solution-architecture.png" alt-text="Diagram of the solution architecture of JBoss EAP on Azure VMs with high availability and disaster recovery." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/solution-architecture.png" border="false":::

[!INCLUDE [ha-dr-for-jboss-vms-intro-end.md](includes/ha-dr-for-jboss-vms-intro-end.md)]

[!INCLUDE [ha-dr-for-jboss-prerequistes.md](includes/ha-dr-for-jboss-prerequistes.md)]

> [!NOTE]
    > It may take over 24 hours to complete the steps in this guidance. If your Azure subscription has automatic resource deletion policies in place, add a **Delete** lock as described in [Lock your resources to protect your infrastructure](/azure/azure-resource-manager/management/lock-resources).

## Set up an Azure SQL Database failover group in paired regions

In this section, you create an Azure SQL Database failover group in paired regions for use with your JBoss EAP clusters and app. 

[!INCLUDE [ha-dr-for-jboss-azure-sql-database.md](includes/ha-dr-for-jboss-azure-sql-database.md)]

## Set up the primary JBoss EAP cluster on Azure VMs

In this section, you create the primary JBoss EAP clusters on Azure VMs using the [JBoss EAP Cluster on VMs](https://aka.ms/eap-vm-cluster-portal) offer. The secondary cluster is restored from the primary cluster during the failover using Azure Site Recovery later.

### Deploy the primary JBoss EAP cluster

First, open the [JBoss EAP Cluster on VMs](https://aka.ms/eap-vm-cluster-portal) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

Use the following steps to fill out the **Basics** pane:

1. Ensure that the value shown for **Subscription** is the same one that has the roles listed in the prerequisites section.
1. You must deploy the offer in an empty resource group. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, `jboss-eap-cluster-eastus-gzh032124`.
1. Under **Instance details**, for **Region**, select **East US**.
1. Provide a password for **Password** and Use the same value for **Confirm password**.
1. For **Number of virtual machines to create**, input `3`.
1. Leave other fields as default.
1. Select **Next** to go to the **JBoss EAP Settings** pane.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-basics.png" alt-text="Screenshot of the Azure portal that shows the JBoss EAP Application Server Cluster on Azure VMs Basics pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-basics.png":::

Use the following steps to fill out the **JBoss EAP Settings** pane:

1. Provide a JBoss EAP password for **JBoss EAP password**. Use the same value for **Confirm password**. Write down the value for later use.
1. Leave other fields as default.
1. Select **Next** to go to the **Azure Application Gateway** pane.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-jboss-eap-setting.png" alt-text="Screenshot of the Azure portal that shows the JBoss EAP Application Settings configuration pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-jboss-eap-setting.png":::

Use the following steps to fill out the **Azure Application Gateway** pane:

1. Select **Yes** for **Connect to Azure Application Gateway?**.
1. Leave other fields as default.
1. Select **Next** to go to the **Networking** pane.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-application-gateway.png" alt-text="Screenshot of the Azure portal that shows the Azure Application Gateway pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-application-gateway.png":::

You should see all fields pre-populated with the defaults in the **Networking** pane. Select **Next** to go to the **Database** pane.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-networking.png" alt-text="Screenshot of the Azure portal that shows the Networking pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-networking.png":::

Use the following steps to fill out the **Database** pane:

1. For **Connect to database?**, select **Yes**.
1. For **Choose database type**, select **Microsoft SQL Server** .
1. For **JNDI Name**, enter *java:jboss/datasources/JavaEECafeDB*.
1. For **Data source connection string (jdbc:sqlserver://\<host\>:\<port\>;database=\<database\>)**, replace the placeholders with the values you wrote down from the preceding section for the failover group of Azure SQL Database - for example, `jdbc:sqlserver://failovergroup-gzh032124.database.windows.net:1433;database=mySampleDatabase`.
1. For **Database username**, enter the server admin sign-in name and the failover group name you wrote down from the preceding section - for example, `azureuser@failovergroup-gzh032124`.
1. Enter the server admin sign-in password that you wrote down before for **Database Password**. Enter the same value for **Confirm password**.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-database.png" alt-text="Screenshot of the Azure portal that shows the Database pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-database.png":::

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

> [!NOTE]
> If you see any problems during **Running final validation...**, fix them and try again.

Depending on network conditions and other activity in your selected region, the deployment can take up to 35 minutes to complete. After that, you should see the text **Your deployment is complete** displayed on the deployment page.


## Verify the functionality of the deployment

Use the following steps to verify the functionality of the deployment for a JBoss EAP cluster on Azure VMs from the **Red Hat JBoss Enterprise Application Platform** management console:

1. On the page **Your deployment is complete**, select **Outputs**.
1. Select the copy icon next to **adminConsole**.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/rg-deployments-outputs.png" alt-text="Screenshot of the Azure portal showing the deployment outputs with the adminConsole URL highlighted." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/rg-deployments-outputs.png":::

1. Paste the URL into an internet-connected web browser and press <kbd>Enter</kbd>. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console sign-in screen, as shown in the following screenshot.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-login.png" alt-text="Screenshot of the JBoss EAP management console sign-in screen." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-login.png":::

1. Fill in *jbossadmin* for **JBoss EAP Admin username** Provide the value for **JBoss EAP password** that you specified before for **Password**, then select **Sign in**.
1. You should see the familiar **Red Hat JBoss Enterprise Application Platform** management console welcome page as shown in the following screenshot.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-welcome.png" alt-text="Screenshot of JBoss EAP management console welcome page." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-welcome.png":::

1. Select the **Runtime** tab. In the navigation pane, select **Topology**. You should see that the cluster contains one domain controller **master** and two worker nodes, as shown in the following screenshot:

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-runtime-topology.png" alt-text="Screenshot of the JBoss EAP management console Runtime topology." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-runtime-topology.png":::

Leave the management console open. You use it to deploy a sample app to the JBoss EAP cluster in the next section.

## Configure the cluster 
Use the following steps to configure database distributed sessions for all application servers:
1. Select **Configuration** in the navigation panel. Then select **Profiles** > **ha** > **Infinspan** > **Web**.
1. In the **Cache** column, select **Add Distributed Cache**.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-add-distributed-cache.png" alt-text="Screenshot of the JBoss EAP management console Add Distributed Cache." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-add-distributed-cache.png":::

1. For **Name** enter *azure-session* and select **Add**.
1. You see a message, **Distributed Cache azure-session successfully added**. If you miss the message, check the notification center. You must see this message before proceeding.
1. After the cache is added, select **azure-session** > **View**.
1. Select **Store**.
1. Change the drop down menu to show **JDBC** and select **Add**.
1. Select **dataSource-mssqlserver** for **Data source** and then select **Add**.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-store-jdbc.png" alt-text="Screenshot of the JBoss EAP management console Store JDBC." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-store-jdbc.png":::
   
1. You see a message, **JDBC successfully added**. If you miss the message, check the notification center. You must see this message before proceeding.
1. On the **Store: JDBC** page, select **Edit**. Set the following property values.
   - **Dialect** to **SQL_SERVER**.
   - **Passivation** to **OFF**.
   - **Purge** to **OFF**.
   - Shared to **ON**.
1. Select **Save**.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-store-jdbc.png" alt-text="Screenshot of the JBoss EAP management console Edit Store JDBC." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-store-jdbc.png":::
1. You see a message, **JDBC successfully modified**. If you miss the message, check the notification center. You must see this message before proceeding.
1. Edit String Table by selecting **String Table** > **Edit**. Fill in the following values and then select **Save**:
   - **Prefix** is `ispn_entry_sessions`
   - **ID Column / ID Column Name** is `id`
   - **ID Column / ID Column Type** is `VARCHAR(255)`
   - **Data Column / Data Column Name** is `data`
   - **Data Column / Data Column Type** is `VARBINARY(MAX)`
   - **Timestamp Column / Timestamp Column Name** is `timestamp`
   - **Timestamp Column / Timestamp Column Type** is `BIGINT`

    :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-string-table.png" alt-text="Screenshot of the JBoss EAP management console Edit String Table." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-string-table.png":::
    
    Any typos here will cause the whole system to fail. Inspect your filled-in values carefully before proceeding.
1. Select **Save**.
1. You see a message, **String Table successfully modified**. If you miss the message, check the notification center. You must see this message before proceeding.
1. Select **Configuration** in the top navigation panel. Then select **Profiles** > **ha** > **Distributable Web** > **View**.
   
    :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-view-distributable-web.png" alt-text="Screenshot of the JBoss EAP management console View Distributable Web." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-view-distributable-web.png":::

1. Select **Infinspan SSO** > **default** > **Edit**.

    :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-infinispan-sso.png" alt-text="Screenshot of the JBoss EAP management console Edit Infinspan SSO." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-edit-infinispan-sso.png":::
1. Set the value of **Cache** to *azure-session* and select **Save**.
1. You see a message **Infinispan Single Sign On Management default successfully modified**. If you miss the message, check the notification center. You must see this message before proceeding.
1. Use the topology to reload or restart affected servers.
1. Select **Runtime** in the navigation panel. Then select **Topology**.
1. For each row in the **main-server-group** column, select the server and then select **Reload**.

    :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-reload-servers.png" alt-text="Screenshot of the JBoss EAP management console Reload servers." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-reload-servers.png":::
    
    The reloaded cells should now show the color green.

## Deploy the app to the JBoss EAP cluster

Use the following steps to deploy the JavaEE Cafe sample application to the Red Hat JBoss EAP cluster:

[!INCLUDE [ha-dr-for-jboss-build-javaee-cafe.md](includes/ha-dr-for-jboss-build-javaee-cafe.md)]
1. Use the following steps in the **Red Hat JBoss Enterprise Application Platform** management console to upload the *javaee-cafe.war* to the **Content Repository**.

   1. From the **Deployments** tab of the Red Hat JBoss EAP management console, select **Content Repository** in the navigation panel.
   1. Select **Add** and then select **Upload Content**.

      :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-upload-content.png" alt-text="Screenshot of the JBoss EAP management console Deployments tab with Upload Content menu item highlighted." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-upload-content.png":::

   1. Use the browser file chooser to select the *javaee-cafe.war* file.
   1. Select **Next**.
   1. Accept the defaults on the next screen and then select **Finish**.
   1. Select **View content**.

1. Use the following steps to deploy an application to the `main-server-group`:

   1. From **Content Repository**, select *javaee-cafe.war*.
   1. Open the drop-down menu and select **Deploy**.
   1. Select **main-server-group** as the server group for deploying *javaee-cafe.war*.
   1. Select **Deploy** to start the deployment. You should see a notice similar to the following screenshot:

      :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-app-successfully-deployed.png" alt-text="Screenshot of the notice of successful deployment." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/jboss-eap-console-app-successfully-deployed.png":::

You're now finished deploying the JavaEE application. Use the following steps to access the application and validate all the settings:
1. In the search box at the top of the Azure portal, enter **Resource groups** and select **Resource groups** in the search results.
1. Select the name of resource group - for example, `jboss-eap-cluster-eastus-gzh032124`. 
2. Select the Application Gateway resource in the resource group.
3. Copy the **Frontend public IP address** from the **Overview** pane.
4. Construct url with the IP address and path - for example, `http://40.88.26.22/javaee-cafe`.
4. Paste the url into a web browser and press <kbd>Enter</kbd>. You should see the JavaEE Cafe application home page.
5. Create two coffees with a different name and price. You should see page similar in the following screenshot:

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/javaee-cafe-app-home-page-session.png" alt-text="Screenshot of the JavaEE Cafe application home page." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/javaee-cafe-app-home-page-session.png":::


## Set up the secondary JBoss EAP cluster on Azure VMs

### Deploy the secondary JBoss EAP cluster
Follow the steps in [Deploy the primary JBoss EAP cluster](#deploy-the-primary-jboss-eap-cluster) to deploy the secondary JBoss EAP cluster in the West US region.
Open the [JBoss EAP Cluster on VMs](https://aka.ms/eap-vm-cluster-portal) offer in your browser and select **Create**. You should see the **Basics** pane of the offer.

Use the following steps to fill out the **Basics** pane:
1. In the **Resource group** field, select **Create new** and fill in a unique value for the resource group - for example, `jboss-eap-cluster-westus-gzh032124`.
1. Under **Instance details**, for **Region**, select **West US**.
1. Leave others the same as the primary cluster.

For the **JBoss EAP Settings** pane:
1. Keep it same as the primary cluster.

For the **Azure Application Gateway** pane:  
1. Keep it same as the primary cluster.

For the **Networking** pane. 
1. Open the Virtual network setting and input the address space which is the same as the primary cluster.

:::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-secondary-networking.png" alt-text="Screenshot in secondary cluster that shows the Networking pane." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/portal-secondary-networking.png":::

For the **Database** pane:

1. Keep it same as the primary cluster.
1. Select **Review + create**.
1. Wait until **Running final validation...** successfully completes, then select **Create**.

After a while, you should see the **Deployment** page where **Deployment is in progress** is displayed.

### Clean up unused resources in the secondary region

Clean up resources in the resource group named `jboss-eap-cluster-westus-gzh032124` that are not used and are going to be replicated by Azure Site Recovery service in the primary region later.

[!INCLUDE [ha-dr-for-jboss-cleanup-unused-resource.md](includes/ha-dr-for-jboss-steps-cleanup-unused-resource.md)]

## Set up disaster recovery for the cluster using Azure Site Recovery

[!INCLUDE [ha-dr-for-jboss-setup-disaster-recovery.md](includes/ha-dr-for-jboss-setup-disaster-recovery.md)]
 
## Set up an Azure Traffic Manager

In this section, you create an Azure Traffic Manager for distributing traffic to your public facing applications across the global Azure regions. The primary endpoint points to the public IP address of the ApplicationGateWay in the primary region, and the secondary endpoint points to the public IP address of the ApplicationGateWay in the secondary region.

[!INCLUDE [ha-dr-for-jboss-create-azure-traffic.md](includes/ha-dr-for-jboss-create-azure-traffic.md)]

Next, verify if the sample app deployed to the primary JBoss EAP cluster can be accessed from the Traffic Manager profile:

1. Select **Overview** of the Traffic Manager profile you created.
1. Check and copy the DNS name of the Traffic Manager profile, append it with */javaee-cafe/*. For example, `http://tm-profile-gzh032124.trafficmanager.net/javaee-cafe/`.
1. Open the URL in a new tab of the browser. You should see the coffee you created before is listed in the page.

   :::image type="content" source="media/migrate-jboss-eap-to-vms-with-ha-dr/javaee-cafe-app-home-page-session.png" alt-text="Screenshot of the sample application UI." lightbox="media/migrate-jboss-eap-to-vms-with-ha-dr/javaee-cafe-app-home-page-session.png":::

If your UI doesn't look similar, troubleshoot and resolve the problem before you continue. Keep the console open and use it for failover test later.

Now you set up the Traffic Manager profile. Keep the page open and you use it for monitoring the endpoint status change in a failover event later.

## Test failover from primary to secondary

To test failover, you manually failover your Azure SQL Database server and cluster, and then fail back using the Azure portal in this section.

### Failover to the secondary site

[!INCLUDE [ha-dr-for-jboss-fail-over-to-secondary-site.md](includes/ha-dr-for-jboss-fail-over-to-secondary-site.md)]

### Commit the failover

[!INCLUDE [ha-dr-for-jboss-steps-commit-failover.md](includes/ha-dr-for-jboss-steps-commit-failover.md)]

### Disable the replication

[!INCLUDE [ha-dr-for-jboss-steps-disable-replication.md](includes/ha-dr-for-jboss-steps-disable-replication.md)]

### Re-protect the failover site

Now the secondary region is the failover site and active, you should re-protect it in your primary region.

First, clean up resources in the resource group named `jboss-eap-cluster-eastus-gzh032124` that are not used any more.

[!INCLUDE [ha-dr-for-jboss-cleanup-unused-resource.md](includes/ha-dr-for-jboss-steps-cleanup-unused-resource.md)]

Next, use the same steps in the [Set up disaster recovery for the cluster using Azure Site Recovery](#set-up-disaster-recovery-for-the-cluster-using-azure-site-recovery) in the primary region, except for the following differences:

1. For **Create a Recovery Services vault**:
   1. Select resource group deployed in the primary region - for example, `jboss-eap-cluster-eastus-gzh032124`.
   1. Enter a different name for service vault - for example, `recovery-service-vault-eastus-gzh032124`.
   1. Select **East US** for **Region**.
1. For **Enable replication**:
   1. Select **West US** for **Region** in **Source**.
   1. In **Replication settings**,
      1. Select existing resource group deployed in the primary region for **Target resource group** - for example, `jboss-eap-cluster-eastus-gzh032124`.
      1. Select existing virtual network in the primary region for **Failover virtual network**.
1. For **Create a recovery plan**:
   1. Select **West US** for **Source** and **East US** for **Target**.

> [!NOTE]
> You may notice Azure Site Recovery supports [re-protect VMs](/azure/site-recovery/azure-to-azure-tutorial-failover-failback?reprotect-the-vm) when the target VM exists. However, it doesn't work when only changes between the source disk and the target disk are synchronized for the JBoss EAP cluster, based on the verification result. This tutorial establishes a new replication from the secondary site to the primary site after failover, in which the entire disks are copied from the failed over region to the primary region. See [What happens during reprotection?](/azure/site-recovery/azure-to-azure-how-to-reprotect#what-happens-during-reprotection) for more information.

### Fail back to the primary site

Use the same steps in the [Failover to the secondary site](#failover-to-the-secondary-site) section to fail back to the primary site including database server and cluster, except for the following differences:

[!INCLUDE [ha-dr-for-jboss-steps-fail-back.md](includes/ha-dr-for-jboss-steps-fail-back.md)]

## Clean up resources

If you're not going to continue to use the JBoss EAP clusters and other components, use the following steps to delete the resource groups to clean up the resources used in this tutorial:

[!INCLUDE [ha-dr-for-jboss-steps-cleanup-resources.md](includes/ha-dr-for-jboss-steps-cleanup-resources.md)]

## Next steps

[!INCLUDE [ha-dr-for-jboss-next-step-head.md](includes/ha-dr-for-jboss-next-step-head.md)]

Continue to explore the following references for more options to build HA/DR solutions and run JBoss EAP on Azure:

> [!div class="nextstepaction"]
> [Azure reliability documentation](/azure/reliability)
> [!div class="nextstepaction"]
> [Build solutions for high availability](/azure/architecture/high-availability/building-solutions-for-high-availability)
> [!div class="nextstepaction"]
> [Automatic failover using Azure Traffic Manager](/azure/networking/disaster-recovery-dns-traffic-manager#automatic-failover-using-azure-traffic-manager)
> [!div class="nextstepaction"]
> [Learn more about Red Hat JBoss EAP on Azure](../ee/jboss-on-azure.md).
