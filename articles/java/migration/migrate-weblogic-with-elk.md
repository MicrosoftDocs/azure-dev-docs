---
title: "Tutorial: Migrate a WebLogic Server cluster to Azure with Elastic on Azure as the logging solution"
description: This tutorial walks you through deploying WebLogic Server to Azure with Elastic Stack on Azure as the logging solution
author: KarlErickson
ms.author: haiche
ms.topic: tutorial
ms.date: 10/30/2024
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# Tutorial: Migrate a WebLogic Server cluster to Azure with Elastic on Azure as the logging solution

This tutorial walks you through deploying WebLogic Server (WLS) with an integrated Elastic stack on Azure. It covers the detailed steps for setting up a managed Elastic stack on Azure, beginning with the creation of Elastic and deployment of WLS. You’ll then configure Logstash to export WLS logs and set up a search index in the managed Kibana. Finally, you’ll use Kibana to search and analyze WLS logs. While each component is documented individually, this tutorial demonstrates how they integrate seamlessly to provide a robust log management solution for WLS on Azure.

:::image type="content" border="false" source="media/migrate-weblogic-with-elk/weblogic-elk.svg" alt-text="Diagram showing the relationship between WLS, App Gateway, and ELK.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Elastic on Azure instance
> * Deploy WLS on Azure
> * Configure Logstash to export WLS to Elastic
> * Create an index in Kibana that enables searching the WebLogic Server logs
> * Search WebLogic Server logs from Kibana

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS Azure Applications listed at [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

## Deploy WLS on Azure

Provision a WebLogic Server as described in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](https://aka.ms/arm-oraclelinux-wls) The instructions for "Deploy Oracle WebLogic Server With Administration Server on a Single Node" and "Deploy Oracle WebLogic Server Cluster on Microsoft Azure IaaS" are all suitable for use with Elastic on Azure. The default VM size for WLS doesn't have enough memory, so be sure the selected VM size has at least 2.5 GB of memory. Use at least `Standard_A2_v2`.

Selecting **Create** will start the process of creating the WLS server on Azure, which may take about 30 minutes. When the deployment completes, select **Ouputs** and write down value of **adminConsoleAddress**, the address to access the Administration Console.

### Understand WebLogic logs

WebLogic Server subsystems use logging services to provide information about events such as the deployment of new applications or the failure of one or more subsystems. A server instance uses them to communicate its status and respond to specific events. For example, you can use WebLogic logging services to report error conditions or listen for log messages from a specific subsystem. For more information, see [Understanding WebLogic Logging Services](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wllog/logging_services.html).

This tutorial considers the following logs:

1. Server Log Files. By default, the server log file is located in the logs directory below the server instance root directory; for example, *DOMAIN_NAME\servers\SERVER_NAME\logs\SERVER_NAME.log*.
1. Domain Log Files. The domain log file provides a central location from which to view the overall status of the domain. The domain log resides in the Administration Server `logs` directory. The default name and location for the domain log file is *DOMAIN_NAME\servers\ADMIN_SERVER_NAME\logs\DOMAIN_NAME.log*.
1. HTTP access logs. The default location and rotation policy for HTTP access logs is the same as the server log, for example, *DOMAIN_NAME\servers\SERVER_NAME\logs\access.log*.

### Connect to the WLS machine

Follow [Connect to the virtual machine](/azure/virtual-machines/workloads/oracle/weblogic-server-azure-virtual-machine#connect-to-the-virtual-machine) to connect to the machine that runs WLS.

## Create an Elasticsearch on Azure instance

Elasticsearch (Elastic Cloud) for Azure is an Azure Native ISV Services you can get from Azure Marketplace and deploy with the Azure portal. Azure Native ISV Services enable you to easily provision, manage, and tightly integrate independent software vendor (ISV) software and services on Azure. Elastic Cloud - Azure Native ISV Service is developed and managed by Microsoft and Elastic. You create, provision, and manage Elastic resources through the Azure portal. Elastic owns and runs the SaaS application including the Elastic accounts created.

Follow [QuickStart: Get started with Elastic](/azure/partner-solutions/elastic/create) to create an Elastic application.
1. Visit the main page for [Elastic Cloud (Elasticsearch) – An Azure Native ISV Service](https://portal.azure.com/#browse/Microsoft.Elastic%2Fmonitors).
1. Select **Create**.
1. In the **Basics** blade, under **Plan Details**:

  1. For **Resource group**, fill in a unique resource group name. This tutorial uses `elkrg1030`.
  1. For **Resource name**, fill in a unique name for your Elastic instance.  This tutorial uses `elkforwlsonazure1030`.
  1. For **Region**, select your desired region.
  1. Keep default values for other fields.

1. In the **Logs & metrics** blade, you can select **Send subscription activity logs** and **Send Azure resource logs for all defined resources** to monitor the Azure resources. However, this tutorial focuses solely on WLS logs and does not cover infrastructure logs.
1. Select **Create** to start the deployment.

After the deployment succeeds, continue to the section [Note down the Elasticsearch and Kibana URLs](#note-down-the-elasticsearch-and-kibana-urls).

### Launch Kibana

Now that you've deployed Elastic on Azure, you can find the Kibana URL next to label **Deployment URL** from Azure portal, as the following screen shows.

:::image type="content" source="media/migrate-weblogic-with-elk/elastic-portal.png" alt-text="The Kibana launch URL in Azure portal." lightbox="media/migrate-weblogic-with-elk/elastic-portal.png":::

After you launch the Kibana URL, you are required to login by picking an account. Select the Azure account that was used to create Elastic. Then you are asked to accept the Elasticsearch permissions requested.

:::image type="content" source="media/migrate-weblogic-with-elk/permission-requested.png" alt-text="Elasticsearch permissions requested." lightbox="media/migrate-weblogic-with-elk/permission-requested.png":::

After the Kibana launches, the browser will navigate to the welcome page.

:::image type="content" source="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png" alt-text="Elasticsearch welcome page." lightbox="media/migrate-weblogic-with-elk/setup-elastic-welcome-page.png":::

## Configure Elastic Custom Logs

This section shows you how configure Elastic Custom Logs and integrate WLS logs.

1. In the welcome page, find section **Get started by adding integrations**, select **Add integrations**.
1. Search **Custom Logs** and select **Custom Logs**.
1. Select button **Add Custom Logs**, you will find instructions to install Elastic Agent and add integrations.
1. Select button **Install Elastic Agent**, as the screenshot shows. This will open the page with detailed steps to intall the agent.

   :::image type="content" source="media/migrate-weblogic-with-elk/install-elastic-agent.png" alt-text="Install Elastic Agent." lightbox="media/migrate-weblogic-with-elk/install-elastic-agent.png":::

1. In the **Install Elastic Agent on your host** page, copy the command from **Linux Tar** and run the command in the WebLogic machine. 

   Make sure you have root privileges by switching user using command `sudo su -`.

   During the agent installation, you will be asked to confirm to continue, input `y`.

   ```bash
   Elastic Agent will be installed at /opt/Elastic/Agent and will run as a service. Do you want to continue? [Y/n]:y
   ```

1. After the agent is installed successfully, you should find the step **Confirm agent enrollment** is done. 

   :::image type="content" source="media/migrate-weblogic-with-elk/elk-setup-custom-log.png" alt-text="Elastic Set up Custom Logs step 1 and step 2." lightbox="media/migrate-weblogic-with-elk/elk-setup-custom-log.png":::

   The WebLogic machine shows **Elastic Agent has been successfully installed.**

   ```bash
   [   =] Service Started  [14s] Elastic Agent successfully installed, starting enrollment.
   [=== ] Waiting For Enroll...  [15s] {"log.level":"info","@timestamp":"2024-11-01T06:05:35.060Z","log.origin":{"function":"github.com/elastic/elastic-agent/internal/pkg/agent/cmd.(*enrollCmd).enrollWithBackoff","file.name":"cmd/enroll_cmd.go","file.line":518},"message":"Starting enrollment to URL: https://910798ae8980595d6a8ae50fc4a3470c.fleet.westus2.azure.elastic-cloud.com:443/","ecs.version":"1.6.0"}
   [   =] Waiting For Enroll...  [18s] {"log.level":"info","@timestamp":"2024-11-01T06:05:37.899Z","log.origin":{"function":"github.com/elastic/elastic-agent/internal/pkg/agent/cmd.(*enrollCmd).daemonReloadWithBackoff","file.name":"cmd/enroll_cmd.go","file.line":481},"message":"Restarting agent daemon, attempt 0","ecs.version":"1.6.0"}
   [  ==] Waiting For Enroll...  [18s] {"log.level":"info","@timestamp":"2024-11-01T06:05:38.011Z","log.origin":{"function":"github.com/elastic/elastic-agent/internal/pkg/agent/cmd.(*enrollCmd).Execute","file.name":"cmd/enroll_cmd.go","file.line":299},"message":"Successfully triggered restart on running Elastic Agent.","ecs.version":"1.6.0"}
   Successfully enrolled the Elastic Agent.
   [ ===] Done  [18s]
   Elastic Agent has been successfully installed.
   ```
1. Select button **Add the integration** to continue.
   - Under the **Custom log file**, for **Log file path**, input domain log path. This example uses the admin offer as example, the domain log path is `/u01/domains/adminDomain/servers/admin/logs/adminDomain.log`. 
   - Dataset name, select **generic**.
   - Expand **Advanced options**.
   - For **Custom configurations**, fill in the multiplelines parser, with content:

      ```text
      multiline.type: pattern
      multiline.pattern: '^####'
      multiline.negate: true
      multiline.match: after
      ```
   - Select **Advanced options**, which shows **Integration settings**.
   - For **Integration name**, fill in `log-weblogic-domain-log`.
1. Select **Comfirm incoming data**. This shows the preview of incoming data.
1. Select **View assets**. And select **Logs**, you are able to view the WebLogic domain logs. The follow screenshot shows an exception log entry.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png" alt-text="WebLogic domain log in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-weblogic-domain-log.png":::

1. Use the same approach to import WebLogic server log and HTTP access log. Search **Integrations** in the Kibana portal, select **Integrations**. Select **Install integrations** -> **Custom Logs** -> **Add Custom Logs**. For configuration, see the following table.

   |  Configuration name | Value for Server Log | Value for HTTP Log |
   |---------------|---------------|--------------------|
   | **Configure integration** -> **Integration settings** -> **Integration name** | `log-weblogic-server-log` | `log-http-access-log` |
   | **Custom log file** -> **Log file path** | `/u01/domains/adminDomain/servers/admin/logs/admin.log` | `/u01/domains/adminDomain/servers/admin/logs/access.log` |
   | **Custom log file** -> **Custom configurations** | <pre><code>multiline.type: pattern</code><br><code>multiline.pattern: '^####'</code><br><code>multiline.negate: true</code><br><code>multiline.match: after</code></pre> | |
   | **Where to add this integration?** -> **Existing hosts** | My first agent policy | My first agent policy |

1. Select **Save and deploy changes** to include the integrations.

## Search WebLogic Server logs from Kibana

After you've successfully integrated the logs, you can finally search the WLS logs using Kibana. Follow the steps in this section to get started searching the logs.

1. Select the hamburger menu. In the **Analytics** section, select **Discover**.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-discover-menu.png" alt-text="Elastic Discover menu in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-discover-menu.png":::

1. On the **Discover** page, select the dropdown menu on the left and then select the index `logs-*`.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png" alt-text="WebLogic logs in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-logs-in-kibana.png":::

1. After the **Discover** page loads, you can add a filter to search the WLS Logs using Kibana. For more information on what you can do with the **Discover** page, see [Discover](https://www.elastic.co/guide/en/kibana/current/discover.html) in the Kibana documentation.

   :::image type="content" source="media/migrate-weblogic-with-elk/elastic-add-filter.png" alt-text="Add a filter in Kibana." lightbox="media/migrate-weblogic-with-elk/elastic-add-filter.png":::

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
