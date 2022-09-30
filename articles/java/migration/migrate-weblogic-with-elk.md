---
title: "Tutorial: Migrate a WebLogic Server cluster to Azure with Elastic on Azure as the logging solution"
description: This tutorial walks you through deploying WebLogic Server to Azure with Elastic Stack on Azure as the logging solution
author: KarlErickson
ms.author: edburns
ms.topic: tutorial
ms.date: 04/28/2021
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java
---

# Tutorial: Migrate a WebLogic Server cluster to Azure with Elastic on Azure as the logging solution

This tutorial walks you through the process of deploying WebLogic Server (WLS) with Elastic on Azure. It covers the specific steps for creating a managed Elastic stack on Azure. First you deploy WLS to connect to that Elastic stack. Then you create the search index in the managed Kibana. Finally, you search the WLS logs from within Kibana. All of these elements are well documented individually in other documentation. This tutorial shows the specific way all of these elements come together to create a powerful log management solution for WLS on Azure.

:::image type="content" border="false" source="media/migrate-weblogic-with-elk/weblogic-elk.svg" alt-text="Diagram showing the relationship between WLS, App Gateway, and ELK.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Elastic on Azure instance
> * Deploy WLS with integration to Elastic on Azure
> * Create an index in Kibana that enables searching the WebLogic Server logs
> * Search WebLogic Server logs from Kibana

## Prerequisites

* An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
* The ability to deploy one of the WLS Azure Applications listed at [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic)

## Create an Elastic on Azure instance

Elastic on Azure is a service you can get from Azure Marketplace and deploy with the Azure portal. You have two options for deploying Elastic on Azure: Elasticsearch managed service and Elasticsearch (Self-Managed). Elasticsearch managed service uses a Pay as you Go license model. Elasticsearch (Self-Managed) uses a Bring Your Own License (BYOL) license model. The BYOL model gives users the option to add more Elastic Stack features through an Elastic subscription purchased directly from Elastic. Choose the right Elasticsearch offer to suit your technical and business needs. Either option works with WLS. The steps in the next sections will show how to provision Elastic on Azure with either option.

### Elasticsearch managed service

Follow these steps to get access to Elasticsearch managed service, or see the next section for steps on getting access to Elasticsearch (Self-Managed).

1. Visit the main page for [Elasticsearch managed service on Azure](https://www.elastic.co/azure).

1. Select **Try Free**.

1. Under **Elasticsearch**, select **Launch on Elastic Cloud**.
1. If you already have an account, sign in to it and continue to the next step. If you don't have an account, fill in an email address and password and select **Create account**. You'll be sent a verification email.

   1. Select the **Verify and Accept** button in the email.
   1. After logging in, select **Start your free trial**.

   The email address and password are for your Elasticsearch managed service. You can get back to the Elasticsearch managed service by visiting [https://cloud.elastic.co/login](https://cloud.elastic.co/login) and signing in with this email address and password.

1. Select **Elastic Stack**.
1. In **Deployment settings**, make sure you have selected **Azure** and then choose the same data center where your WLS will be deployed.
1. Accept the default values for the rest of the settings.
1. Select **Create deployment**.
1. Note down your deployment credentials. You'll need them later in this tutorial.

Continue to the section [Note down the Elasticsearch and Kibana URLs](#note-down-the-elasticsearch-and-kibana-urls).

### Elasticsearch (Self-Managed)

To deploy Elastic on Azure, follow the steps in [Getting started with the Azure Marketplace](https://aka.ms/elastic-on-azure). Complete that tutorial and return here after you have successfully deployed Elastic on Azure. Note down the Elastic credentials required by WLS. After you've deployed your chosen Elastic on Azure offer, note down the following information from the deployed offer:

* The username and password of the Elastic on Azure service.
* The username and password of the Elasticsearch and Kibana endpoints.

### Note down the Elasticsearch and Kibana URLs

Now that you've deployed Elastic on Azure, save aside the Elasticsearch endpoint URI and Kibana launch URL for use in the following sections, by following these steps.

1. Sign in to Elastic on Azure using the username and password.
1. In the **Applications** section in the middle of the page, select the link **Copy endpoint** next to **Elasticsearch**. Paste the result into a file. For discussion, let's call the pasted value the Elasticsearch endpoint URL.
1. In the **Applications** section in the middle of the page, copy the value of the **Launch** hyperlink next to **Kibana**. Paste the result into a file. For discussion, let's call the pasted value the Kibana launch URL.

:::image type="content" source="media/migrate-weblogic-with-elk/elasticsearch-endpoint.png" alt-text="The Elasticsearch endpoint URL and Kibana launch URL.":::

## Deploy WLS with integration to Elastic on Azure

This section will show you how to use the Elastic on Azure resource created in the preceding section. You'll provision a WLS server configured to send its logs to Elastic on Azure.

To create the WLS server with integration to Elastic on Azure, follow these steps:

1. Provision a WebLogic Server as described in [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](https://aka.ms/arm-oraclelinux-wls) The instructions for "Deploy Oracle WebLogic Server With Administration Server on a Single Node" and "Deploy Oracle WebLogic Server Cluster on Microsoft Azure IaaS" are all suitable for use with Elastic on Azure. The default VM size for WLS doesn't have enough memory, so be sure the selected VM size has at least 2.5 GB of memory. Use at least `Standard_A2_v2`. Come back to this page when you reach the **Elasticsearch and Kibana** section shown in the following image.

   :::image type="content" source="media/migrate-weblogic-with-elk/elasticsearch-portal-blade.png" alt-text="The Elasticsearch and Kibana blade within the Azure portal.":::

1. In the **Elasticsearch and Kibana** section, next to **Export logs to Elasticsearch server?** select **Yes**.
1. In the text field labeled **Elasticsearch endpoint URL**, paste the Elasticsearch endpoint URL you saved previously.
1. In the text field labeled **Elasticsearch User Name**, paste the username of the Elastic on Azure service you used when you created the service.
1. In the two text fields for password, paste the password of the Elastic on Azure service you used when you created the service.
1. In the **WebLogic Server logs to export** field, select the drop-down menu and select the logs you want. For this tutorial, select all logs.
1. Select **Review + Create**.
1. Select **Create**. The values you entered are now validated. If this validation step fails, review the fields in the Elasticsearch and Kibana section and the other sections, and be sure you provided the correct values.
1. After you see **Validation passed**, select **Create**.

Selecting **Create** will start the process of creating the WLS server and configuring the link to Elastic on Azure, which may take about 15 minutes. When the deployment completes, select **Go to resource group**.

### Save the search index output by the completed deployment

The act of deploying WLS with ELK integration causes a Kibana search index to be output by the template. This pre-created index saves you time in creating the index yourself. Follow the steps in this section to configure Kibana for use in searching your WLS logs.

1. Go to the resource group in which you deployed WLS. If you selected **Go to resource group** in the previous section, you'll already be there. Otherwise, follow these steps.
   1. Navigate to **Home** in the portal, then select **Resource groups**. In the search box that says **Filter for any field...**, enter the name of your resource group. Make sure the **Subscription** filter is set to the subscription you used when you deployed WLS. If the filter is not set correctly, the resource group won't be visible.
   1. When the resource group appears, select it.
1. In the left panel, under **Settings**, select **Deployments**. You'll be taken to a page that shows the result of the deployment actions taken to create WLS.
1. In the search box that says **Filter by deployment name**, type *elk*.
1. The list of deployment actions should show one entry. Select it.

   :::image type="content" source="media/migrate-weblogic-with-elk/weblogic-portal-resource-group-deployments-01.png" alt-text="The ELK integration deployment.":::

1. On the pane for ELK deployment, in the left panel, select **Outputs**.
1. To the right of the output labeled **logindex**, select the copy icon. Paste the result into a text file and save it aside for use in the next section.

   :::image type="content" source="media/migrate-weblogic-with-elk/weblogic-portal-resource-group-deployments-02.png" alt-text="The outputs and logindex buttons.":::

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
