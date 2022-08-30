---
title: "Quickstart: Deploy WebLogic Server on Azure Virtual Machine using the Azure portal"
description: Shows how to quickly stand up WebLogic Server on Azure Virtual Machine
author: KarlErickson
ms.author: haiche
ms.topic: quickstart
ms.date: 08/01/2022
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm
---

# Quickstart: Deploy WebLogic Server on Azure Virtual Machine using the Azure portal

This article shows you how to quickly deploy WebLogic Application Server (WLS) on Azure Virtual Machines (VM) with the simplest possible set of configuration choices using the Azure portal. For a more full featured tutorial, including the use of Azure Application Gateway to make WLS cluster on VM securely visible on the public Internet, see [Tutorial: Migrate a WebLogic Server cluster to Azure with Azure Application Gateway as a load balancer](/azure/developer/java/migration/migrate-weblogic-with-app-gateway).

In this quickstart, you will:

- Deploy WLS with Administration Server on VM using the Azure portal.
- Deploy a Java EE sample application with WLS Administration Console portal.

This quickstart assumes a basic understanding of WLS concepts. For more information, see [Oracle WebLogic Server](https://www.oracle.com/java/weblogic/).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Deploy WLS with Administration Server on VM

The steps in this section direct you to deploy WLS on VM in the simplest possible way: using [single node with an admin server](https://aka.ms/wls-vm-admin) offer. Other offers are available to meet different scenarios, including: [single node without an admin server](https://aka.ms/wls-vm-singlenode), [cluster](https://aka.ms/wls-vm-cluster), and [dynamic cluster](https://aka.ms/wls-vm-dynamic-cluster). For more information, see [What are solutions for running Oracle WebLogic Server on Azure Virtual Machines?](/azure/virtual-machines/workloads/oracle/oracle-weblogic).

:::image type="content" source="media/weblogic-server-azure-virtual-machine/portal-start-experience.png" alt-text="WebLogic Server With Admin Server portal experience":::

The steps in this section show you how to find the WLS with Admin Server offer and fill out the **Basics** blade.

1. In the search bar at the top of the portal, enter "weblogic". In the auto-suggested search results, in the **Marketplace** section, select **Oracle WebLogic Server With Admin Server**.
  :::image type="content" source="media/weblogic-server-azure-virtual-machine/search-weblogic-admin-offer-from-portal.png" alt-text="WLS in portal search results":::
  You can also go directly to the offer with this [portal link](https://aka.ms/wls-vm-admin).
1. On the offer page, select **Create**.
1. On the **Basics** blade, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. The offer must be deployed in an empty resource group. In the **Resource group** field, select **Create new** and fill in a value for the resource group. Because resource groups must be unique within a subscription, pick a unique name. An easy way to have unique names is to use a combination of your initials, todays date, and some identifier. For example `ejb0802wls`.
1. Under **Instance details**, select the region for the deployment. For a list of Azure regions how and where VMs operate, see [Regions for virtual machines in Azure](/azure/virtual-machines/regions).
1. Accept the default value in **Oracle WebLogic Image**.
1. Accept the default value in **Virtual machine size**.
   If the default size isn't available in your region, choose an available size by selecting **Change size**, then select one of the listed sizes.
1. Under **Credentials for Virtual Machines and WebLogic** leave the default value for **Username for admin account of VMs**.

You've several options to provide authentication to the VM, but can only choose one. 
The steps in this section explain each option so you can choose the best one for your deployment.

## Choose how to authenticate the virtual machine

### Option 1: Use password

This option configures a simple username/password pair for VM authentication. Follow these steps to provide values:

1. Under **Authentication type**, leave the default value **Password**.
1. Fill in `wlsVmAdmin2022` for **Password**. Use the same value for the confirmation field.

### Option 2: Generate new Key pair

This option generates a public key pair, installing the public key on the server. After the offer passes validation, you'll get a pop-up window to download the SSH key pair.

Follow these steps to provide values for the WLS deployment:

1. Under **Authentication type**, select **SSH Public Key**.
1. Under **SSH public key source**, select **Generate new key pair**.
1. Fill in `wlsKeyAdmin2022` for **Key pair name**.

When you have completed the offer validation, and select **Create**.  You'll then get a pop-up window. Select **Download private key and create resource**. This will download the SSH key as a .pem file.

:::image type="content" source="media/weblogic-server-azure-virtual-machine/download-private-key-and-create-resources.png" alt-text="Download private key and create resource":::

Once the .pem file is downloaded, you might want to move it somewhere on your computer where it's easy to reference from your SSH client.

### Option 3: Use an SSH public key stored in Azure

This option requires you to store the SSH public key in the Azure before continuing. 

The steps in this section show you how to create SSH key from Azure portal and continue your WLS deployment.

1. In the search bar at the top of the portal, enter "ssh key". In the auto-suggested search results, in the **Services** section, select **SSH keys**.
1. On the service page, select **Create**.
1. On the **Basics** blade, ensure the value shown in the **Subscription** field is the same one that has the roles listed in the prerequisites section.
1. You can deploy the SSH key in an existing resource group or by creating a new resource group. To creat a new resource group, in the **Resource group** field, select **Create new** and fill in a value for the resource group name. For example `ejb0802sshkey`.
1. Fill in `ejb0802sshkey-for-wls-machine` for **Key pair name**.
1. Under **SSH public key source**, select **Generate new key pair**.

When you have completed the validation, and select **Create**, you'll then get a pop-up window to, select **Download private key and create resource**. This will download the SSH key as a .pem file.

After the SSH key deployment completed, get back to the WLS deployment and follow the steps to provide values:

1. Under **Authentication type**, select **SSH Public Key**.
1. Under **SSH public key source**, select **Use existing key stored in Azure**.
1. Under **Stored Keys**, select the SSH key name `ejb0802sshkey-for-wls-machine` created earlier.

### Option 4: Provide an existing SSH public key

This option allows you to private an SSH public key for VM authentication. 

If you don't have an SSH key, you can follow [Create an SSH key pair](/azure/virtual-machines/linux/mac-create-ssh-keys#create-an-ssh-key-pair) to create a key pair using RSA encryption and a bit length of 4096. Note that Azure currently supports SSH protocol 2 (SSH-2) RSA public-private key pairs with a minimum length of 2048 bits.

You can display your public key with the following `cat` command, replacing `~/.ssh/id_rsa.pub` with the path and filename of your own public key file if needed:

```bash
cat ~/.ssh/id_rsa.pub
```

A typical public key value looks like this example:

```text
ssh-rsa AAAAB...Q== username@domainname
```

Then, follow the steps to provide values for the WLS deployment:

1. Under **Authentication type**, select **SSH Public Key**.
1. Under **SSH public key source**, select **Use existing public key**.
1. Fill in **SSH public key** with your public key value.

You've finished configurating VM authentication. Continue with the other aspects of the WLS deployment.

1. Leave the default value for **Username for WebLogic Administrator**.
1. Fill in `wlsVmCluster2022` for the **Password for WebLogic Administrator**. Use the same value for the confirmation.
1. Select **Review + create**. Ensure the green **Validation Passed** message appears at the top. If not, fix any validation problems and select **Review + create** again.
1. Select **Create**.
1. Track the progress of the deployment in the **Deployment is in progress** page.

Depending on network conditions and other activity in your selected region, the deployment may take up to 30 minutes to complete.

## Examine the deployment output

The steps in this section show you how to verify the deployment has successfully completed.

If you navigated away from the **Deployment is in progress** page, the following steps will show you how to get back to that page. If you are still on the page that shows **Your deployment is complete**, you can skip to the steps after the image below.

1. In the upper left of any portal page, select the hamburger menu and select **Resource groups**.
1. In the box with the text **Filter for any field**, enter the first few characters of the resource group you created previously. If you followed the recommended convention, enter your initials, then select the appropriate resource group.
1. In the left navigation pane, in the **Settings** section, select **Deployments**. You will see an ordered list of the deployments to this resource group, with the most recent one first.
1. Scroll to the oldest entry in this list. This entry corresponds to the deployment you started in the preceding section. Select the oldest deployment, as shown here.
  :::image type="content" source="media/weblogic-server-azure-virtual-machine/resource-group-deployments.png" alt-text="Resource group deployments list":::

1. In the left panel, select **Outputs**. This list shows the output values from the deployment. Useful information is included in the outputs.
1. The **sshCommand**  value is the fully qualified, SSH command to connect the VM that runs WLS. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.
1. The **adminConsoleURL** value is the fully qualified, public Internet visible link to the WLS admin console. Select the copy icon next to the field value to copy the link to your clipboard. Save this value aside for later.

## Deploy a Java EE application from Administration Console portal

After completing the steps, you can run a sample application in the WLS.

1. Download a sample application as a **.war** or **.ear** file. The sample app should be self contained and not have any database, messaging, or other external connection requirements. The sample app from the WLS Kubernetes Operator documentation is a good choice. You can download it from [Oracle](https://aka.ms/wls-aks-testwebapp). Save the file to your local filesystem.
1. Paste the value of **adminConsoleURL** in an Internet connected web browser. You should see the familiar WLS admin console login screen as shown here.
  :::image type="content" source="media/weblogic-server-azure-kubernetes-service/wls-admin-login.png" alt-text="WLS admin login screen":::

1. Log in with user name `weblogic` and your password (this quick start uses `wlsVmCluster2022`). You will find the WLS Administration Console overview page.
1. Under **Change Center** on the top left corner, hit **Lock & Edit** button, as shown here.
  :::image type="content" source="media/weblogic-server-azure-virtual-machine/admin-console-portal.png" alt-text="Admin Console Portal":::

1. Under **Domain Structure** on the left side, select **Deployments**. 
1. Under **Configuration**, hit **Install** button. There will be an I**nstall Application Assistant** to guide you to finish the installation.
    - Under **Locate deployment to install and prepare for deployment**, select **Upload your file(s)**.
    - Under **Upload a deployment to the Administration Server**, click **Choose File** and upload your sample application. Click **Next**.
    - Select **Finish**.
1. Under **Change Center** on the top left corner, hit **Activate Changes** button. You will find message **All changes have been activated. No restarts are necessary**.
1. Under **Summary of Deployments**, select **Control**. Click the checkbox near the application name to select the application. Hit **Start** and select **Servicing all requests**.
1. Under **Start Application Assistant**, select **Yes**. If no error happens, you'll find a message **Start requests have been sent to the selected deployments.**
1. Construct a fully qualified URL for the sample app, such as `http://<vm-host-name>:<port>/<your-app-path>`. You can get the host name and port from **adminConsoleURL** by removing `/console/`. If you are using the recommended sample app, the URL should be `http://<vm-host-name>:<port>/testwebapp/`. It'll look something like `http://wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com:7001/testwebapp/`.
1. Paste the fully qualified URL in an Internet connected web browser. If you deployed the recommended sample app, you should see the following page.
  :::image type="content" source="media/weblogic-server-azure-virtual-machine/testwebapp.png" alt-text="test web app":::

## Connect to the virtual machine

If you want to manage the VM, you can connect to it with SSH command. Before accessing the machine, make sure you have enabled port 22 for SSH agent.

Follow the steps to enable port 22:

1. Navigate back to your working resource group. In the overview page, you will find a network security group named **wls-nsg**. Select **wls-nsg**.
1. In the left panel, select **Settings** -> **Inbound security rules**. If there is a rule to allow port `22`, then you can jump to step 4.
1. In the top of the page, hit **Add**
    - Under **Destination port ranges**, fill in value `22`.
    - Fill in a rule name `Port_SSH` for **Name**.
    - Leave default value for other fields.
    - Click **Add**. 

    After the deployment completes, you will be able to SSH to the VM.

1. Connect the VM with the value of **sshCommand**. You can specify a key file in the command. 
    - Ensure you have read-only access to the private key:

      ```bash
      chmod 400 <keyname>.pem
      ```
    - Run the command below to connect to your VM, something like:

      ```bash
      ssh -i <private key path> weblogic@wls-5b942e9f2a-admindomain.westus.cloudapp.azure.com
      ```

## Clean up resources

If you're not going to continue to use the WLS, delete resources with the following steps:

1. Navigate back to your working resource group. At the top of the page, under the text Resource group, select the resource group. Select Delete resource group.
2. If you create an SSH key and store it in Azure in [Option 3: Use an SSH public key stored in Azure](#option-3-use-an-ssh-public-key-stored-in-azure), then search the resource group `ejb0802sshkey` in the search bar at the top of the portal. Select your resource group and delete it.

## Next steps

Continue to explore options to run WLS on Azure.
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
> [Explore the official documentation from Oracle](https://aka.ms/wls-vm-docs)
> [Explore the options for day 2 and beyond](https://aka.ms/wls-vms-day2)
