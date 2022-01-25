---
title: Deploy WebSphere Application Server (traditional) with High Availability on Azure Virtual Machines
description: Shows you how to deploy WebSphere Application Server (traditional) with High Availability on Azure Virtual Machines.
ms.author: zhengchang
ms.topic: tutorial
ms.date: 01/26/2022
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-was
---

# Deploy WebSphere Application Server (traditional) with High Availability on Azure Virtual Machines

This article shows you how to quickly deploy a cluster of WebSphere Application Server (WAS) instances on Azure Virtual Machines (VMs).

## Prerequisites

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.com/free/).
- An IBMid with necessary entitlement for WebSphere Traditional. This offer is Bring-Your-Own-License. To deploy this offer, you must enter your registered IBMid and your IBMid must have active WebSphere entitlements associated with it. If provisioning fails due to lack of entitlements, ask the primary or secondary contacts for your IBM Passport Advantage site to grant you access. Alternately, follow steps at IBM eCustomer Care for further assistance. This offer also assumes you're properly licensed to run offers in Microsoft Azure. For more information, see [IBM eCustomer Care](https://ibm.biz/IBMidEntitlement).

## Provision a cluster

For background regarding the offer and also a video tutorial on how to set up and access the VMs, see the Azure portal offer for [IBM WebSphere Application Server Cluster](https://aka.ms/websphere-on-azure-portal).

You can start creating your deployment on the **IBM WebSphere Application Server Cluster** deployment page. By default, the deployment will consist of the following VMs:

- One Deployment Manager instance for managing the applications and application servers.
- One IBM HTTP Server instance for managing load balancing if you answer *yes* to **Configure an IBM HTTP Server**.
- One or more WebSphere Application Server instances (nodes) for running your applications (defaults to 3 for High Availability).

Each of these VMs is automatically created with the necessary networking and storage to support the deployment. The following diagram shows the default configuration.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/default-configuration-cluster-deployment.png" alt-text="Diagram showing default configuration of WebSphere Application Server (traditional) Cluster deployment.":::

To begin defining your deployment, select **Create** on the deployment page.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-create-page.png" alt-text="Azure portal screenshot showing IBM WebSphere Application Server Cluster offering.":::

You'll then be shown the **Create IBM WebSphere Application Server Cluster** page where you can start configuring the deployment, as shown in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab.png" alt-text="Azure portal screenshot with IBM WebSphere Application Server Cluster offering showing Basics configuration pane." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab.png":::

Each field on this page has an information icon that gives you more information to help with filling it out. The offer is Bring-Your-Own-License (BYOL), so requires you to have purchased entitlements to WAS. Your entitlement is checked during installation into the VMs. You must provide an IBMid that is associated with the entitlements. If the ID you provide doesn't have entitlements, then the deployment will fail to install WAS. You'll see error messages that include the following text: `The provided IBMid does not have entitlement to install WebSphere Application Server.`

After you’ve completed this configuration, select **Next: Cluster configuration**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-configuration-tab.png" alt-text="Azure portal screenshot with IBM WebSphere Application Server Cluster offering showing 'Cluster configuration' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-configuration-tab.png":::

The **Cluster configuration** pane lets you configure the virtual machines and WebSphere Application Server cluster. The latest version of WebSphere will be installed along with the most recent fixes to ensure your deployment is up to date.

When you specify the cluster configuration, you have the option of creating a Dynamic Cluster. A Dynamic Cluster is a server cluster that uses weights and workload management to balance the workloads of its cluster members dynamically. The weights are based on performance information collected from the cluster members. For this exercise, keep the default Static Cluster option.

After you've completed this configuration, select **Next: IBM HTTP Server Load Balancer**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-load-balancer-configuration-tab.png" alt-text="Azure portal screenshot with IBM WebSphere Application Server Cluster offering showing 'IBM HTTP Server Load Balancer' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-load-balancer-configuration-tab.png":::

The **IBM HTTP Server Load Balancer** pane gives you the option to deploy the **IBM HTTP Server (IHS) load balancer** into its own VM. IHS is the web server front end for the cluster of application servers. IHS receives requests and routes them to one of the server instances, allowing you to have more than one instance of the application processing requests. By using IHS, your deployment can scale to higher workloads and be resilient to failures and highly available. Without IHS, you'll have to set up your own load balancing across your cluster.

Complete the configuration for IHS and select **Review + create**. You'll see a summary of the deployment so you can validate the configuration. Fix any configuration problems, then select **Create** to start the deployment. You'll be taken to a page where you can view the progress of the deployment, which usually takes around 20 minutes.

## Access the WAS Administrative Console and IHS Console

After the cluster deployment has successfully completed, select the **Outputs** section on the left panel to see the administrative console and IHS console URLs, along with other details.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-outputs.png" alt-text="Azure portal screenshot of cluster Deployment showing Outputs page with adminSecuredConsole and ihsConsole fields highlighted.":::

Use the copy icon to copy these URLs, then paste them into browser address bars. After the Administrative Console page has loaded you should see the sign-in page, as shown in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/admin-console-login-page.png" alt-text="Screenshot of IBM WebSphere Integrated Solutions Console sign-in page.":::

Sign in using the WebSphere administrator credentials you provided when setting up the **Cluster configuration**. After logging in, you'll see the following **WebSphere Administrative console** page.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/admin-console-page.png" alt-text="Screenshot of IBM WebSphere administrative console page." lightbox="media/traditional-websphere-application-server-virtual-machines/admin-console-page.png":::

After the IHS console has loaded, you should see the following page:

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/ibm-http-server-console-page.png" alt-text="Screenshot of IBM WebSphere Integrated Solutions Console page.":::

## Trying out an application

Follow these instructions if you’d like to try out an application in the cluster.

1. On the administrative console that you logged into earlier, select **Applications > New Application** and then select **New Enterprise Application**.

2. On the next panel, select **Remote file system** and then select **Browse…**. You'll see the option to browse the file systems of your installed servers.

3. Select the system that begins with **Dmgr**. You'll see the Deployment Manager’s file system. From there, select **V9** and then **installableApps**. In that directory, you should see many applications available to install. Select **DefaultApplication.ear** and then select **OK**.

You'll be taken back to the page for selecting the application, which should look like the following screenshot:

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/select-test-app-page.png" alt-text="Screenshot of IBM WebSphere 'Specify the EAR, WAR, JAR, or SAR module to upload and install' dialog.":::

Select **Next** and then **Next** to go with the **Fast Path** deployment process.

In the **Fast Path** wizard, use the defaults for everything except **Step 2: map modules to servers**. On that page, select the checkbox for the **Default Web Application Module** row, then hold Ctrl and select the options under **Clusters and servers**. Finally, select **Apply**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png":::

You should see new entries in the table under the **Server** column. These entries should look similar to the ones in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane showing and 'Server' table column highlighted." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png":::

After you’ve completed all the steps, select **Finish** and then on the next page select **Save**.

Next, you need to start the application. Go to **Applications > All Applications**. Select the checkbox for **DefaultApplication.ear**, ensure the **Action** is set to **Start**, and then select **Submit Action**.

You should see success messages that look similar to the ones in the following screenshot. If you see errors, it may be that you were too quick and the app and configuration haven't reached the nodes yet.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png" alt-text="Screenshot of IBM WebSphere Messages pane." lightbox="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png":::

When you see the success messages, you can try the app. In your browser, navigate to the DNS name of the IHS deployment and add `/snoop`. You should see information similar to the following about the server instance that processed the request.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/test-app-running-page.png" alt-text="Screenshot of test application running in a browser.":::

Refreshing the browser will cycle through the server instances using the **Round Robin load-balancing policy**, which is the default policy for the Static Cluster deployment.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az_group_delete) command. The following command will remove the resource group, container service, container registry, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

Now that you've learned how to deploy a WebSphere Application Server (traditional) cluster to Azure Virtual Machines, feel free to review and provide feedback on the [offering](https://aka.ms/websphere-on-vms-review). If you’re interested in keeping up to date with latest developments, select **Contact Me** on the [offering overview page](https://ibm.biz/WASAzureContactMe) and register to be notified when new offers are made available.
