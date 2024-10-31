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

## Create an Elasticsearch on Azure instance

Elasticsearch (Elastic Cloud) for Azure is an Azure Native ISV Services you can get from Azure Marketplace and deploy with the Azure portal. Azure Native ISV Services enable you to easily provision, manage, and tightly integrate independent software vendor (ISV) software and services on Azure. Elastic Cloud - Azure Native ISV Service is developed and managed by Microsoft and Elastic. You create, provision, and manage Elastic resources through the Azure portal. Elastic owns and runs the SaaS application including the Elastic accounts created.

### Elastic on Azure

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

### Create and note down the API key to access Elastic

Now that you've deployed Elastic on Azure, you can find the Kibana URL next to label **Deployment URL** from Azure portal, as the following screen shows.

:::image type="content" source="media/migrate-weblogic-with-elk/elastic-portal.png" alt-text="The Kibana launch URL.":::

After you launch the Kibana URL, you are required to login by picking an account. Select the Azure account that was used to create Elastic. Then you are asked to select a platform to host the Elastic deployment, select Azure and your desired region.

After the Elastic deployment finishes, the browser will navigate to the depoyment.



1. Sign in to Elastic on Azure using the username and password.
1. In the **Applications** section in the middle of the page, select the link **Copy endpoint** next to **Elasticsearch**. Paste the result into a file. For discussion, let's call the pasted value the Elasticsearch endpoint URL.
1. In the **Applications** section in the middle of the page, copy the value of the **Launch** hyperlink next to **Kibana**. Paste the result into a file. For discussion, let's call the pasted value the Kibana launch URL.

:::image type="content" source="media/migrate-weblogic-with-elk/elasticsearch-endpoint.png" alt-text="The Elasticsearch endpoint URL and Kibana launch URL.":::

## Deploy WLS on Azure

Provision a WebLogic Server as described in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](https://aka.ms/arm-oraclelinux-wls) The instructions for "Deploy Oracle WebLogic Server With Administration Server on a Single Node" and "Deploy Oracle WebLogic Server Cluster on Microsoft Azure IaaS" are all suitable for use with Elastic on Azure. The default VM size for WLS doesn't have enough memory, so be sure the selected VM size has at least 2.5 GB of memory. Use at least `Standard_A2_v2`.

Selecting **Create** will start the process of creating the WLS server on Azure, which may take about 30 minutes. When the deployment completes, select **Ouputs** and write down value of **adminConsoleAddress**, the address to access the Administration Console.

### Understand WebLogic logs and extend access log

WebLogic Server subsystems use logging services to provide information about events such as the deployment of new applications or the failure of one or more subsystems. A server instance uses them to communicate its status and respond to specific events. For example, you can use WebLogic logging services to report error conditions or listen for log messages from a specific subsystem. For more information, see [Understanding WebLogic Logging Services](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wllog/logging_services.html).

This tutorial considers the following logs:

1. Server Log Files. By default, the server log file is located in the logs directory below the server instance root directory; for example, *DOMAIN_NAME\servers\SERVER_NAME\logs\SERVER_NAME.log*.
1. Domain Log Files. The domain log file provides a central location from which to view the overall status of the domain. The domain log resides in the Administration Server `logs` directory. The default name and location for the domain log file is *DOMAIN_NAME\servers\ADMIN_SERVER_NAME\logs\DOMAIN_NAME.log*.
1. HTTP access logs. The default location and rotation policy for HTTP access logs is the same as the server log, for example, *DOMAIN_NAME\servers\SERVER_NAME\logs\access.log*.

This tutorial extends access log to export more information. Follow the steps to customize the HTTP access log:

1. Log into the Administration Server console.
1. In the Change Center of the Administration Console, click **Lock & Edit**.
1. In the left pane of the Console, expand **Environment** and select **Servers**.
1. In the Servers table, click the **admin** name.
1. In the Settings for admin page, select **Logging** > **HTTP**.
1. On the Logging > HTTP page, make sure that the **HTTP access log file enabled** checkbox is checked.
1. Click Advanced.
1. In the Advanced pane:
  - In the Format list box, select **Extended**.
  - In the Extended Logging Format Fields, enter this space-delimited string:

     ```text
     date time time-taken bytes c-ip  s-ip c-dns s-dns  cs-method cs-uri sc-status sc-comment ctx-ecid ctx-rid
     ```
1. Click Save.
1. In the Change Center of the Administration Console, click **Activate Changes**.

To make the change work, you have to re-start the WebLogic Server:

1. Open Azure portal, go to the resource group that created in [Deploy WLS on Azure](#deploy-wls-on-azure).
1. Stop and then re-start VM that runs the WebLogic Server.

## Install and configure Logstash to export WLS logs

This section shows you how to install and configure Logstash for WLS logs.

## Create an index in Kibana that enables searching the WebLogic Server logs

After you've successfully deployed WLS with ELK integration, follow the steps is this section to create the search index in Kibana.

1. Open the Kibana launch URL in a browser. This URL is the one you saved aside in the section [Create an Elastic on Azure instance](#create-an-elastic-on-azure-instance).
1. Sign in with the credentials you created in the section [Create an Elastic on Azure instance](#create-an-elastic-on-azure-instance).
1. Select the hamburger icon in the upper left corner of the Kibana window, then, in the **Analytics** section, select **Discover**.
1. Select **Create index pattern**.
1. Place the cursor in the text field labeled **Index pattern**, paste the value you saved as the **logindex** in the previous section, then select **Next step**.

   :::image type="content" source="media/migrate-weblogic-with-elk/kibana-index-03.png" alt-text="The logindex insertion text field.":::

1. On the **Create index pattern** page, add fields to the index pattern. Include at least *@timestamp*, then select **Create index pattern**. Creating the index pattern may take a few minutes, but you only need to do it once.

   :::image type="content" source="media/migrate-weblogic-with-elk/kibana-index-04.png" alt-text="The final Create index pattern button.":::

## Search WebLogic Server logs from Kibana

After you've successfully created the index, you can finally search the WLS logs using Kibana. Follow the steps in this section to get started searching the logs.

1. After the index has been created, select the hamburger menu. In the **Analytics** section, select **Discover**.

   :::image type="content" source="media/migrate-weblogic-with-elk/kibana-index-05.png" alt-text="The Discover page.":::

1. On the **Discover** page, select the dropdown menu on the left and then select the index you created.

   :::image type="content" source="media/migrate-weblogic-with-elk/kibana-index-06.png" alt-text="The index on the discover page.":::

1. After the **Discover** page loads, you can search through the WLS Logs using Kibana. For more information on what you can do with the **Discover** page, see [Discover](https://www.elastic.co/guide/en/kibana/7.8/discover.html) in the Kibana documentation.

   :::image type="content" source="media/migrate-weblogic-with-elk/kibana-index-07.png" alt-text="Searching WLS logs with Kibana.":::

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
