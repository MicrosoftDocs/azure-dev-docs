---
title: "Tutorial: Migrate WebLogic Server to Azure with Elastic on Azure as the logging solution"
description: This tutorial walks you through deploying WebLogic Server to Azure with Elastic Stack on Azure as the logging solution
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 12/09/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# Tutorial: Migrate WebLogic Server to Azure with Elastic on Azure as the logging solution

This tutorial walks you through deploying WebLogic Server (WLS) on Azure Virtual Machines (VMs) and integrating with Elastic Cloud (Elasticsearch). The steps show how to configure Elastic Custom Logs to capture log data from WLS. Finally, you use Kibana to search and analyze WLS logs. While each component is documented individually, this tutorial demonstrates how they integrate seamlessly to provide a robust log management solution for WLS on Azure.

:::image type="content" border="false" source="media/migrate-weblogic-with-elk/weblogic-elk.svg" alt-text="Diagram showing the relationship between WLS, App Gateway, and ELK.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Elastic on Azure instance.
> * Deploy WLS on Azure.
> * Configure Elastic Custom Logs to integrate WLS logs.
> * Search WebLogic Server logs from Kibana.

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS on Virtual Machines Azure Applications listed at [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
* A terminal for SSH access to virtual machines.

## Deploy WLS on Azure

Provision WebLogic Server by following the steps in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](https://aka.ms/arm-oraclelinux-wls) Both "Deploy Oracle WebLogic Server With Administration Server on a Single Node" and "Deploy Oracle WebLogic Server Cluster on Microsoft Azure IaaS" are compatible with Elastic on Azure. This tutorial uses [WebLogic on VM](https://aka.ms/wls-vm-admin) as an example.

> [!NOTE]
> The default VM size might not have sufficient memory for the Elastic agent. Ensure that the selected VM size has at least 2.5 GB of memory. `Standard_A2_v2` is the minimum sufficient size

After filling in the required information, select **Create** to initiate the WLS deployment on Azure. The deployment typically takes about 30 minutes. After deployment, go to **Outputs** and record the value of **adminConsoleURL**, which is the URL for accessing the Administration Console.

### Understand WebLogic logs

WebLogic Server subsystems use logging services to track events such as application deployment and subsystem failures. These logs enable server instances to communicate their status and respond to specific events, providing detailed insights that can help in troubleshooting and monitoring. WebLogic's logging services enable you to report errors, listen for log messages from particular subsystems, and capture system status updates. For more detailed information on WebLogic logging services, see [Understanding WebLogic Logging Services](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wllog/logging_services.html).

This tutorial focuses on configuring the following key WebLogic logs:

1. Server Log Files: Typically found in the **logs** directory beneath the server instance's root. The path is usually as **DOMAIN_NAME/servers/SERVER_NAME/logs/SERVER_NAME.log**.

1. Domain Log Files: These logs provide an overview of domain status and are stored in the Administration Server's **logs** directory. The default path is **DOMAIN_NAME/servers/ADMIN_SERVER_NAME/logs/DOMAIN_NAME.log**.

1. HTTP Access Logs: By default, HTTP access logs share the server log's directory and rotation policy. The default path is **DOMAIN_NAME/servers/SERVER_NAME/logs/1access.log**. 

You can configure and manage these logs to facilitate the integration with monitoring tools like Elastic on Azure, enabling centralized log analysis and alerting on WebLogic Server instances.

While the offer deploys, you can skip to and follow the steps in the section [Create an Elasticsearch on Azure instance](#create-an-elasticsearch-on-azure-instance). Return here when the offer is finished deploying.

### Connect to the WLS machine

To access the virtual machine running WebLogic Server (WLS), use the steps in [Connect to the virtual machine](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#connect-to-the-virtual-machine). In this tutorial, you're connecting to the machine that hosts the WebLogic Administration Server, named `adminVM`.

## Create an Elasticsearch on Azure instance

Elastic Cloud (Elasticsearch) for Azure is an Azure Native ISV Services you can get from Azure Marketplace and deploy with the Azure portal. Azure Native ISV Services enable you to easily provision, manage, and tightly integrate independent software vendor (ISV) software and services on Azure. Elastic Cloud - Azure Native ISV Service is developed and managed by Microsoft and Elastic. You create, provision, and manage Elastic resources through the Azure portal. Elastic owns and runs the SaaS application including the Elastic accounts created. For an overview of Elastic Cloud (Elasticsearch) see [What is Elastic Cloud (Elasticsearch) - An Azure Native ISV Service?](/azure/partner-solutions/elastic/overview)

### Create Elastic on Azure 

To create an Elastic application, follow the steps in [QuickStart: Get started with Elastic](/azure/partner-solutions/elastic/create).

In the first step of the section **Create resource**, use the following steps for substitutions:

1. In the **Basics** pane, under **Plan Details**, use the following steps:

   1. For **Resource group**, fill in a unique resource group name. This tutorial uses `elkrg1030`.
   1. For **Resource name**, fill in a unique name for your Elastic instance. You can use the same value you used for **Resource group**.
   1. For **Region**, select your desired region.
   1. Keep the default values for other fields.

1. In the **Logs & metrics** pane, select **Send subscription activity logs** and **Send Azure resource logs for all defined resources** to monitor the Azure resources. However, this tutorial focuses solely on WLS logs and doesn't cover infrastructure logs.

1. You can skip the sections **Azure OpenAI configuration** and **Tags**.

1. Follow the remaining steps in the article.

After the deployment succeeds, continue to the next section in this article.

### Launch Kibana

After Elastic is deployed on Azure, open the Elastic resource from the Azure portal. Locate the **Kibana** URL, next to the label **Deployment URL**, as shown in the following screenshot:

:::image type="content" source="media/migrate-weblogic-with-elk/elastic-portal.png" alt-text="Screenshot of the Azure portal that shows the Elastic page with the Kibana deployment URL highlighted." lightbox="media/migrate-weblogic-with-elk/elastic-portal.png":::

When you launch Kibana, you're prompted to sign in by selecting an Azure account. Choose the Azure account used for creating the Elastic deployment, then review and accept the requested Elasticsearch permissions.

:::image type="content" source="media/migrate-weblogic-with-elk/permission-requested.png" alt-text="Screenshot of the Permissions requested dialog box for Elasticsearch permissions." lightbox="media/migrate-weblogic-with-elk/permission-requested.png":::

After you're signed in, the browser navigates to Kibana's welcome page, as shown in the following screenshot:

:::image type="content" source="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png" alt-text="Screenshot of the Elasticsearch welcome page." lightbox="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png":::

## Configure Elastic Custom Logs and Integrate WLS Logs

Use the following steps to set up custom log integration for WebLogic Server on Kibana:

1. Use the following steps to navigate to Kibana's integration setup:

   1. On the Kibana welcome page, find **Get started by adding integrations** and then select **Add integrations**.

   1. Search for **Custom Logs** and then select it.

      :::image type="content" source="media/migrate-weblogic-with-elk/custom-logs.png" alt-text="Screenshot of the Custom Logs entry." lightbox="media/migrate-weblogic-with-elk/custom-logs.png":::

   1. Select **Add Custom Logs** to view instructions for installing the Elastic Agent and adding integrations.

      :::image type="content" source="media/migrate-weblogic-with-elk/add-custom-logs.png" alt-text="Screenshot of the Add Custom Logs button." lightbox="media/migrate-weblogic-with-elk/add-custom-logs.png":::

1. Use the following steps to install the Elastic Agent:

   1. Select **Install Elastic Agent**, which brings up the steps for installation.

      :::image type="content" source="media/migrate-weblogic-with-elk/install-elastic-agent.png" alt-text="Screenshot of the Install Elastic Agent button." lightbox="media/migrate-weblogic-with-elk/install-elastic-agent.png":::

   1. SSH into the WLS machine and then switch to root privileges by using the following command:

      ```bash
      sudo su -
      ```

   1. From Kibana, copy the **Linux Tar** command from the **Install Elastic Agent on your host** section and execute it on the WLS machine.

   1. In the machine terminal, confirm the installation by entering <kbd>y</kbd> when prompted, as shown in the following example:

      ```output
      Elastic Agent will be installed at /opt/Elastic/Agent and will run as a service. Do you want to continue? [Y/n]:y
      ```

      Look for the text `Elastic Agent has been successfully installed.` This text indicates a successful installation. If you don't see this text, troubleshoot and resolve the problem before continuing.

1. Verify agent enrollment. In Kibana, confirm **Agent enrollment** under **Confirm agent enrollment**.

   :::image type="content" source="media/migrate-weblogic-with-elk/elk-setup-custom-log.png" alt-text="Screenshot of the Set up Custom Logs integration page with the highlighted message 1 agent has been enrolled." lightbox="media/migrate-weblogic-with-elk/elk-setup-custom-log.png":::

1. Use the following steps to add the integration for WLS domain logs:

   1. Select **Add the integration**.

   1. Under **Custom log file**, set the following properties:

      - For **Log file path**, use **/u01/domains/adminDomain/servers/admin/logs/adminDomain.log**.
      - For **Dataset name**, se **generic**.

   1. Expand **Advanced options**. For **Custom configurations**, set the following properties:

      - For **multiline.type**, use **pattern**.
      - For **multiline.pattern**, use **'^####'**.
      - For **multiline.negate**, use **true**.
      - For **multiline.match**, use **after**.

   1. Expand **Advanced options**. For **Integration name**, fill in **log-weblogic-domain-log**.

   1. Select **Confirm incoming data** to preview the logs. Then, select **View assets** -> **Assets** -> **Views** -> **Logs** to view the domain logs in Kibana.

   1. In the textarea containing the text **Search for log messages**, enter the string **weblogic** and press <kbd>Enter</kdb>. You should see log messages containing the string **weblogic**.

      :::image type="content" source="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png" alt-text="Screenshot of log messages search pane with the 'weblogic' search term highlighted." lightbox="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png":::

1. Use the following steps to add integrations for server logs and HTTP access logs:

   1. In Kibana, search for **Integrations** and then select it.

   1. Select **Installed integrations** > **Custom Logs** > **Add Custom Logs**.

   1. Enter the appropriate configurations from the following lists for each log type - server, and HTTP access logs. After filling out all configuration fields, select **Save and continue** then **Save and deploy changes**.

      - For server log, use the following values:

        - For **Integration settings > Integration name:**, use **log-weblogic-server-log**.

        - For **Custom log file > Log file path:**, use **/u01/domains/adminDomain/servers/admin/logs/admin.log**.

        - For **Custom log file > Advanced options > Custom configurations:**, use the following values:

          - For **multiline.type**, use **pattern**.
          - For **multiline.pattern**, use **'^####'**.
          - For **multiline.negate**, use **true**.
          - For **multiline.match**, use **after**.

        - For **Where to add this integration? > Existing hosts**, use **My first agent policy**.

      - For HTTP access logs, use the following values:

        - For **Integration settings > Integration name:**, use **log-http-access-log**.
        - For **Custom log file > Log file path:**, use **/u01/domains/adminDomain/servers/admin/logs/access.log**.
        - For **Custom log file > Advanced options > Custom configurations:**, no configuration is provided.
        - For **Where to add this integration? > Existing hosts**, use **My first agent policy**.

## Searching WLS Logs in Kibana

After integrating, use the following steps to begin analyzing the logs within Kibana:

1. To access the Discover page, open the **hamburger menu**. Then, under **Analytics**, select **Discover**.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-discover-menu.png" alt-text="Screenshot of the Kibana Analytics menu with the Discover option highlighted." lightbox="media/migrate-weblogic-with-elk/elastic-discover-menu.png":::

1. To select the log index, in the **Discover** page, select **logs-\***.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png" alt-text="Screenshot of the Kibana WebLogic logs with the index highlighted." lightbox="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png":::

1. Search and filter the WLS logs. For more information on using **Discover**, see [Discover](https://www.elastic.co/guide/en/kibana/current/discover.html) in the Kibana documentation.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-add-filter.png" alt-text="Screenshot of the Add filter dialog box in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-add-filter.png":::

> [!NOTE]
> If you're running a WLS cluster, you need to install the Elastic Agent on each VM and configure custom logs on the corresponding hosts.

## Clean up resources

If you're no longer using the WLS or Elastic stack, you can clean them up by following the steps in this section.

### Clean up WLS

Use the following steps to clean up WLS:

1. On the Azure portal home page, select **Resource groups**.

1. In the **Filter for any field...** text field, enter the name of the resource group in which you created the WLS deployment.

1. When the list displays your resource group, select it.

1. From the **Resource group** overview, select **Delete resource group**.

1. In the **Are you sure you want to delete** section, type the name of the resource group and then select **Delete**. You can continue to work with the Azure portal while the resource group and its contents are deleted.

### Clean up Elastic on Azure

Follow the same steps as in the preceding section to delete Elastic on Azure, but use the resource group name of the Elastic on Azure deployment as the resource group to delete.

## Next steps

Continue your migration journey by exploring WebLogic Server to Azure Virtual Machines.

> [!div class="nextstepaction"]
> [WebLogic Server to Azure Virtual Machines](./migrate-weblogic-to-virtual-machines.md)
