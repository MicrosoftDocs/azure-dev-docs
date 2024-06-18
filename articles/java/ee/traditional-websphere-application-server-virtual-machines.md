---
title: "Quickstart: Deploy WebSphere Application Server Network Deployment Cluster on Azure Virtual Machines"
description: Shows you how to deploy a traditional WebSphere Application Server cluster on Azure Virtual Machines using Azure Marketplace offer.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 06/18/2024
ms.custom: devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-was-vm, devx-track-javaee-was, devx-track-javaee-websphere

---

# Quickstart: Deploy WebSphere Application Server Network Deployment Cluster on Azure Virtual Machines

This article shows you how to quickly deploy a cluster of traditional WebSphere Application Server (tWAS) Network Deployment (ND) instances on Azure Virtual Machines (VMs).

This article uses the Azure Marketplace offer for WebSphere Application Server Cluster to accelerate your journey to Azure VMs. The offer automatically provisions a number of resources including latest Red Hat Enterprise Linux (RHEL) VMs with fixes, latest WebSphere Application Server ND 9.0.5.x on each VM with fixes, latest IBM JDK 8 with fixes on each VM, a Deployment Manager on one of the VMs with Administrative Console enabled, and optionally an IBM HTTP Server (IHS) or Azure Application Gateway as load balancer. Visit Azure portal to see the offer [IBM WebSphere Application Server Network Deployment Cluster on Azure VMs](https://ibm.biz/twas-cluster-portal). 

If you prefer manual step-by-step guidance for installing WebSphere Application Server Cluster that doesn't utilize the automation enabled by the offer, see [Tutorial: Manually install IBM WebSphere Application Server Network Deployment traditional on Azure Virtual Machines](../migration/migrate-websphere-to-azure-vm-manually.md?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

If you're interested in providing feedback or working closely on your migration scenario with the engineering team developing WebSphere on WebSphere on Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

- An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/) or sign up for a [free account](https://azure.microsoft.com/free/).
- An IBMid with necessary entitlement for WebSphere Traditional (optional). If you create the deployment with an evaluation license, you don't need to provide an IBMid with entitlement for WebSphere Traditional. To get the benefit, you need to accept the [IBM WebSphere Application Server License Agreement](https://ibm.biz/tWASNDLicenseAzureVMs) during the deployment creation steps. Otherwise, you must enter your registered IBMid and your IBMid must have active WebSphere entitlements associated with it. If provisioning with IBMid fails due to lack of entitlements, ask the primary or secondary contacts for your IBM Passport Advantage site to grant you access. Alternately, follow steps at IBM eCustomer Care for further assistance. This offer also assumes you're properly licensed to run offers in Microsoft Azure. For more information, see [IBM eCustomer Care](https://ibm.biz/IBMidEntitlement).

## Deploy a cluster

In this article, we use the Azure Marketplace offer [IBM WebSphere Application Server ND Cluster on Azure VMs](https://ibm.biz/twas-cluster-portal) from the Azure portal. The offer automates common steps for deploying a traditional WebSphere Application Server Network Deployment cluster. You can find more background and a demo video on the offer page.

You can start creating your deployment from the page. By default, the deployment consists of the following VMs:

- One Deployment Manager instance for managing the applications and application servers.
- One IBM HTTP Server instance for managing load balancing if you answer *yes* to **Configure an IBM HTTP Server**.
- One or more WebSphere Application Server instances (nodes) for running your applications (defaults to 3 for High Availability).

Each of these VMs is automatically created with the necessary networking and storage to support the deployment. The following diagram shows the default configuration.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/default-configuration-cluster-deployment.png" alt-text="Diagram showing default configuration of WebSphere Application Server (traditional) Cluster deployment.":::

To start your deployment, select **Create** on the deployment page.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-create-page.png" alt-text="Azure portal screenshot showing IBM WebSphere Application Server Cluster offering.":::

Then, you're shown the **Create IBM WebSphere Application Server Cluster** page where you can start configuring the deployment, as shown in the following screenshot.

### [Deploy with an evaluation license](#tab/basic)

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab-evaluation-license.png" alt-text="Screenshot of Azure portal with IBM WebSphere Application Server Cluster offering showing Basics configuration pane using evaluation license." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab-evaluation-license.png":::

You need to select the checkbox to accept [IBM License Agreement](https://ibm.biz/tWASNDLicenseAzureVMs).

Consider selecting the checkbox labeled **I agree to IBM contacting my company or organization**. Selecting this checkbox indicates that you're willing to let IBM and Microsoft contact you for further offer development.

### [Deploy with IBMid](#tab/standard)

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab.png" alt-text="Screenshot of Azure portal with IBM WebSphere Application Server Cluster offering showing Basics configuration pane using IBMid." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-basics-tab.png":::

Each field on this page has an information icon that gives you more information to help with filling it out. The offer is Bring-Your-Own-License (BYOL), so requires you to have purchased entitlements to tWAS. Your entitlement is checked during installation into the VMs. You must provide an IBMid that is associated with the entitlements. If the ID you provide doesn't have entitlements, then the deployment fails to install tWAS. You're shown error messages that include the following text: `The provided IBMid does not have entitlement to install WebSphere Application Server.`

---

After you've completed this configuration, select **Next: Cluster configuration**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-configuration-tab.png" alt-text="Azure portal screenshot with IBM WebSphere Application Server Cluster offering showing 'Cluster configuration' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-configuration-tab.png":::

The **Cluster configuration** pane lets you configure the virtual machines and WebSphere Application Server cluster. The latest version of WebSphere is installed along with the most recent fixes to ensure your deployment is up to date.

When you specify the cluster configuration, you have the option of creating a Dynamic Cluster. A Dynamic Cluster is a server cluster that uses weights and workload management to balance the workloads of its cluster members dynamically. The weights are based on performance information collected from the cluster members. For this exercise, keep the default Static Cluster option.

After you've completed this configuration, select **Next: Load Balancer**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-load-balancer-configuration-tab.png" alt-text="Azure portal screenshot with IBM WebSphere Application Server Cluster offering showing 'IBM HTTP Server Load Balancer' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-load-balancer-configuration-tab.png":::

The **Load Balancer** pane gives you the option to deploy the **IBM HTTP Server (IHS) load balancer** into its own VM or to deploy **Azure Application Gateway**. IHS is the web server front end for the cluster of application servers. IHS receives requests and routes them to one of the server instances, enabling you to have more than one instance of the application processing requests. By using IHS, your deployment can scale to higher workloads and be resilient to failures and highly available. Without IHS, you have to set up your own load balancing across your cluster and ensure that it correctly points to the worker nodes.

This article is written to use IHS. However, Azure Application Gateway is a great option for a more cloud-native load-balancing solution. For more information on Azure Application Gateway, see [What is Azure Application Gateway?](/azure/application-gateway/overview)

Complete the configuration for IHS and select **Next: Networking**. This pane enables you to select the virtual network and subnet into which tWAS and IHS are deployed. Accept the defaults and then select **Next: Database**.

The **Database** pane enables you to configure your tWAS deployment with a JNDI connection to an existing database, assumed to be network accessible from the VMs for tWAS. Accept the defaults and then select **Next: Review + create**.

A summary of the deployment appears so you can validate the configuration. Fix any configuration problems, then select **Create** to start the deployment. You're taken to a page where you can view the progress of the deployment, which usually takes around 20 minutes.

## Access the WAS Administrative Console and IHS Console

After the cluster deployment has successfully completed, select the **Outputs** section on the left panel to see the administrative console and IHS console URLs, along with other details.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/cluster-deployment-outputs.png" alt-text="Azure portal screenshot of cluster Deployment showing Outputs page with adminSecuredConsole and ihsConsole fields highlighted.":::

Use the copy icon to copy these URLs for the **WebSphere Integrated Solutions Console** and the **IBM HTTP Server**, then paste them into two different browser address bars to sign in to both consoles, separately. After the administrative console page loads, you should see the sign in page, as shown in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/admin-console-login-page.png" alt-text="Screenshot of IBM WebSphere Integrated Solutions Console sign-in page.":::

Sign in using the WebSphere administrator credentials you provided when setting up the **Cluster configuration**. After signing in, you see the following page.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/admin-console-page.png" alt-text="Screenshot of IBM WebSphere administrative console page." lightbox="media/traditional-websphere-application-server-virtual-machines/admin-console-page.png":::

Then, sign in to the IHS console. After the IHS console loads, you should see the following page:

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/ibm-http-server-console-page.png" alt-text="Screenshot of IBM WebSphere Integrated Solutions Console page.":::

## Trying out an application

Follow these instructions if you'd like to try out an application in the cluster.

1. On the administrative console that you signed into earlier, select **Applications > New Application** and then select **New Enterprise Application**.

2. On the next panel, select **Remote file system** and then select **Browse…**. You're given the option to browse the file systems of your installed servers.

3. Select the system that begins with **Dmgr**. You're shown the Deployment Manager's file system. From there, select **V9** and then **installableApps**. In that directory, you should see many applications available to install. Select **DefaultApplication.ear** and then select **OK**.

Then, you're taken back to the page for selecting the application, which should look like the following screenshot:

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/select-test-app-page.png" alt-text="Screenshot of IBM WebSphere 'Specify the EAR, WAR, JAR, or SAR module to upload and install' dialog.":::

Select **Next** and then **Next** to go with the **Fast Path** deployment process.

In the **Fast Path** wizard, use the defaults for everything except **Step 2: map modules to servers**. On that page, select the checkbox for the **Default Web Application Module** row, then hold Ctrl and select the options under **Clusters and servers**. Finally, select **Apply**.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-configuration-page.png":::

You should see new entries in the table under the **Server** column. These entries should look similar to the ones in the following screenshot.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png" alt-text="Screenshot of IBM WebSphere 'Install New Application' dialog with 'Step 2: Map modules to servers' pane showing and 'Server' table column highlighted." lightbox="media/traditional-websphere-application-server-virtual-machines/map-modules-to-servers-outcome-page.png":::

After you've completed all the steps, select **Finish**, and then on the next page select **Save**.

Next, you need to start the application. Go to **Applications > All Applications**. Select the checkbox for **DefaultApplication.ear**, ensure the **Action** is set to **Start**, and then select **Submit Action**.

You should see success messages that look similar to the ones in the following screenshot. If you see errors, it may be that you were too quick, and the app and configuration haven't reached the nodes yet.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png" alt-text="Screenshot of IBM WebSphere Messages pane." lightbox="media/traditional-websphere-application-server-virtual-machines/start-app-message-page.png":::

When you see the success messages, you can try the app. In your browser, navigate to the DNS name of the IHS deployment and add `/snoop`. You should see information similar to the following about the server instance that processed the request.

:::image type="content" source="media/traditional-websphere-application-server-virtual-machines/test-app-running-page.png" alt-text="Screenshot of test application running in a browser.":::

When you refresh the browser, the app cycles through the server instances using the **Round Robin load-balancing policy**, which is the default policy for the Static Cluster deployment.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the cluster, use the [az group delete](/cli/azure/group#az-group-delete) command. The following command removes the resource group, container service, container registry, and all related resources.

```azurecli
az group delete --name <resource-group-name> --yes --no-wait
```

## Next steps

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)
