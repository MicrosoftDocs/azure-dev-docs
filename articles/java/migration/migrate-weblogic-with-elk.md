---
title: "Tutorial: Migrate WebLogic Server to Azure with Elastic on Azure as the logging solution"
description: This tutorial walks you through deploying WebLogic Server to Azure with Elastic Stack on Azure as the logging solution
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 10/30/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# Tutorial: Migrate WebLogic Server to Azure with Elastic on Azure as the logging solution

This tutorial walks you through deploying WebLogic Server (WLS) on Azure Virtual Machines and integrating with Elastic Cloud (Elasticsearch). The steps show how to configure Elastic Custom Logs to capture log data from WLS. Finally, you’ll use Kibana to search and analyze WLS logs. While each component is documented individually, this tutorial demonstrates how they integrate seamlessly to provide a robust log management solution for WLS on Azure.

:::image type="content" border="false" source="media/migrate-weblogic-with-elk/weblogic-elk.svg" alt-text="Diagram showing the relationship between WLS, App Gateway, and ELK.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Elastic on Azure instance
> * Deploy WLS on Azure
> * Configure Elastic Custom Logs to integrate WLS logs
> * Search WebLogic Server logs from Kibana

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS on Virtual Machines Azure Applications listed at [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
* A terminal for SSH access to virtual machines.

## Deploy WLS on Azure

Provision WebLogic Server by following the steps in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](https://aka.ms/arm-oraclelinux-wls). Both "Deploy Oracle WebLogic Server With Administration Server on a Single Node" and "Deploy Oracle WebLogic Server Cluster on Microsoft Azure IaaS" are compatible with Elastic on Azure. This tutorial uses [WebLogic on VM](https://aka.ms/wls-vm-admin) as an example.

> [!NOTE]
> The default VM size may not have sufficient memory for the Elastic agent. Ensure the selected VM size has at least 2.5 GB of memory. `Standard_A2_v2` is the minimum sufficient size

After filling in required information, selecting **Create** will initiate the WLS deployment on Azure, which typically takes about 30 minutes. After deployment, go to **Outputs** and record the value of **adminConsoleURL**, which is the URL for accessing the Administration Console.

### Understand WebLogic logs

WebLogic Server subsystems use logging services to track events such as application deployment and subsystem failures. These logs allow server instances to communicate their status and respond to specific events, providing detailed insights that can help in troubleshooting and monitoring. WebLogic’s logging services allow you to report errors, listen for log messages from particular subsystems, and capture system status updates. For more detailed information on WebLogic logging services, see [Understanding WebLogic Logging Services](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wllog/logging_services.html).

This tutorial focuses on configuring the following key WebLogic logs:

1. **Server Log Files**: Typically found in the `logs` directory beneath the server instance’s root. The path is usually as *DOMAIN_NAME/servers/SERVER_NAME/logs/SERVER_NAME.log*.

2. **Domain Log Files**: These logs provide an overview of domain status and are stored in the Administration Server’s `logs` directory. The default path is *DOMAIN_NAME/servers/ADMIN_SERVER_NAME/logs/DOMAIN_NAME.log*.

3. **HTTP Access Logs**: By default, HTTP access logs share the server log’s directory and rotation policy. The default path is *DOMAIN_NAME/servers/SERVER_NAME/logs/1access.log*. 

These logs can be configured and managed to facilitate the integration with monitoring tools like Elastic on Azure, allowing for centralized log analysis and alerting on WebLogic Server instances.

You can skip to and follow the steps in the section [Create an Elasticsearch on Azure instance](#create-an-elasticsearch-on-azure-instance) while the offer deploys. Return here when the offer has completed deployment.

### Connect to the WLS machine

To access the virtual machine running WebLogic Server (WLS), use the steps in [Connect to the virtual machine](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#connect-to-the-virtual-machine). In this tutorial, you are connecting to the machine that hosts the WebLogic Administration Server, named `adminVM`.

## Create an Elasticsearch on Azure instance

Elastic Cloud (Elasticsearch) for Azure is an Azure Native ISV Services you can get from Azure Marketplace and deploy with the Azure portal. Azure Native ISV Services enable you to easily provision, manage, and tightly integrate independent software vendor (ISV) software and services on Azure. Elastic Cloud - Azure Native ISV Service is developed and managed by Microsoft and Elastic. You create, provision, and manage Elastic resources through the Azure portal. Elastic owns and runs the SaaS application including the Elastic accounts created. For an overview of Elastic Cloud (Elasticsearch) see [What is Elastic Cloud (Elasticsearch) - An Azure Native ISV Service?](/azure/partner-solutions/elastic/overview).

### Create Elastic on Azure 

To create an Elastic application, follow the steps in [QuickStart: Get started with Elastic](/azure/partner-solutions/elastic/create).

In the first step of the section **Create resource** use the following substitutions:

1. In the **Basics** blade, under **Plan Details**:

  1. For **Resource group**, fill in a unique resource group name. This tutorial uses `elkrg1030`.
  1. For **Resource name**, fill in a unique name for your Elastic instance. You can use the same value you used for **Resource group**.
  1. For **Region**, select your desired region.
  1. Keep default values for other fields.

1. In the **Logs & metrics** blade, select **Send subscription activity logs** and **Send Azure resource logs for all defined resources** to monitor the Azure resources. However, this tutorial focuses solely on WLS logs and doesn't cover infrastructure logs.
1. You can skip the sections **Azure OpenAI configuration** and **Tags**.
1. Follow the remaining steps in the article.

After the deployment succeeds, continue to the next section in this article, [Launch Kibana](#launch-kibana).

### Launch Kibana

Once Elastic is deployed on Azure, open the Elastic resource from Azure portal. Locate the **Kibana URL**, next to the label **Deployment URL**, as shown in the image.

:::image type="content" source="media/migrate-weblogic-with-elk/elastic-portal.png" alt-text="The Kibana launch URL in Azure portal." lightbox="media/migrate-weblogic-with-elk/elastic-portal.png":::

When you launch Kibana, you are prompted to sign in by selecting an Azure account. Choose the Azure account used for creating the Elastic deployment, then review and accept the requested Elasticsearch permissions.

:::image type="content" source="media/migrate-weblogic-with-elk/permission-requested.png" alt-text="Elasticsearch permissions requested." lightbox="media/migrate-weblogic-with-elk/permission-requested.png":::

Once signed in, the browser navigates to Kibana’s welcome page.

:::image type="content" source="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png" alt-text="Elasticsearch welcome page." lightbox="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png":::

## Configure Elastic Custom Logs and Integrate WLS Logs

This section guides you through setting up custom log integration for WebLogic Server on Kibana.

1. **Navigate to Kibana’s Integration Setup:**
   - In the Kibana welcome page, find **Get started by adding integrations** and select **Add integrations**.
   - Search for **Custom Logs** and select it.
   - Select **Add Custom Logs** to view instructions for installing the Elastic Agent and adding integrations.
   
2. **Install the Elastic Agent:**
   - Select **Install Elastic Agent**, which will bring up the steps for installation.
   
     :::image type="content" source="media/migrate-weblogic-with-elk/install-elastic-agent.png" alt-text="Install Elastic Agent." lightbox="media/migrate-weblogic-with-elk/install-elastic-agent.png":::

   - SSH into the WLS machine and switch to root privileges:

     ```bash
     sudo su -
     ```
   
   - From Kibana, copy the **Linux Tar** command from the **Install Elastic Agent on your host** section and execute it on the WLS machine. 
   - In the machine terminal, confirm the installation by entering `y` when prompted.

     ```bash
     Elastic Agent will be installed at /opt/Elastic/Agent and will run as a service. Do you want to continue? [Y/n]:y
     ```

3. **Verify Agent Enrollment:**
   - In Kibana, confirm **Agent enrollment** under **Confirm agent enrollment**.

     :::image type="content" source="media/migrate-weblogic-with-elk/elk-setup-custom-log.png" alt-text="Elastic Set up Custom Logs step 1 and step 2." lightbox="media/migrate-weblogic-with-elk/elk-setup-custom-log.png":::

4. **Add the Integration for WLS Domain Logs:**
   - Select **Add the integration**.
   - Under **Custom log file**, set:
     - **Log file path**: for example, `/u01/domains/adminDomain/servers/admin/logs/adminDomain.log`.
     - **Dataset name**: `generic`.
     - Expand **Advanced options**. For **Custom configurations**, set:

       ```text
       multiline.type: pattern
       multiline.pattern: '^####'
       multiline.negate: true
       multiline.match: after
       ```

   - Expand **Advanced options**. For **Integration name**, fill in `log-weblogic-domain-log`.
   - Select **Confirm incoming data** to preview the logs. Then select **View assets** -> **Assets** -> **Views** -> **Logs** to view the domain logs in Kibana.

      :::image type="content" source="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png" alt-text="WebLogic domain log in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png":::

5. **Add Integrations for Server Logs and HTTP Access Logs:**
   - In Kibana, search **Integrations** and select it. 
   - Select **Installed integrations** -> **Custom Logs** -> **Add Custom Logs**.
   - Enter the appropriate configurations as listed below for each log type (Server, and HTTP access logs).
   - After filling out all configuration fields, select **Save and deploy changes** to finalize.

      **Server Log**

      - **Integration settings → Integration name:** `log-weblogic-server-log`
      - **Custom log file → Log file path:** `/u01/domains/adminDomain/servers/admin/logs/admin.log`
      - **Custom log file → Advanced options → Custom configurations:**
        ```
        multiline.type: pattern
        multiline.pattern: '^####'
        multiline.negate: true
        multiline.match: after
        ```
      - **Where to add this integration? → Existing hosts:** My first agent policy

      **HTTP Access Log**

      - **Integration settings → Integration name:** `log-http-access-log`
      - **Custom log file → Log file path:** `/u01/domains/adminDomain/servers/admin/logs/access.log`
      - **Custom log file → Advanced options → Custom configurations:** *(No configuration provided)*
      - **Where to add this integration? → Existing hosts:** My first agent policy


## Searching WLS Logs in Kibana

After integrating, you can begin analyzing the logs within Kibana.

1. **Access the Discover Page:**
   - Open the **hamburger menu**. Under **Analytics**, select **Discover**.

     :::image type="content" source="media/migrate-weblogic-with-elk/elastic-discover-menu.png" alt-text="Elastic Discover menu in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-discover-menu.png":::

2. **Select the Log Index:**
   - In the **Discover** page, choose the `logs-*` index.

     :::image type="content" source="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png" alt-text="WebLogic logs in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png":::

3. **Search and Filter:**
   - Add filters to search the WLS logs. For further information on using **Discover**, see [Discover in Kibana documentation](https://www.elastic.co/guide/en/kibana/current/discover.html).

     :::image type="content" source="media/migrate-weblogic-with-elk/elastic-add-filter.png" alt-text="Add a filter in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-add-filter.png":::

> [!NOTE]
> If you are running a WLS cluster, you need to install the Elastic Agent on each VM and configure Custom Logs on the corresponding hosts.

## Clean up resources

If you're no longer using the WLS or Elastic stack, you can clean them up by following the steps in this section.

### Clean up WLS

1. From the portal home, select **Resource groups**.
1. In the **Filter for any field...** text field, enter the name of the resource group in which you created the WLS deployment.
1. When the list displays your resource group, select it.
1. From the **Resource group** overview, select **Delete resource group**.
1. In the **Are you sure you want to delete** section, type the name of the resource group and select **Delete**. You can continue to work with the portal while the resource group and its contents are deleted.

### Clean up Elastic on Azure

Follow the same steps as in the preceding section to delete Elastic on Azure, but use the resource group name of the Elastic on Azure deployment as the resource group to delete.

## Next steps

Continue your migration journey by exploring WebLogic Server to Azure Virtual Machines.

> [!div class="nextstepaction"]
> [WebLogic Server to Azure Virtual Machines](./migrate-weblogic-to-virtual-machines.md)
