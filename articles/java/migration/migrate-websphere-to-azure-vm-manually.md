---
title: "Tutorial: Manually install WebSphere Application Server Network Deployment (traditional) on Azure virtual machines (VMs)"
description: Get step-by-step guidance to install IBM WebSphere Application Server on Azure VMs, set up a cluster, and expose the cluster with Azure Application Gateway.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 05/29/2024
recommendations: false
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-was-vm, devx-track-javaee-was, devx-track-javaee-websphere, migration-java, linux-related-content
---

# Tutorial: Manually install WebSphere Application Server Network Deployment (traditional) on Azure virtual machines (VMs)

This tutorial shows you how to install IBM WebSphere Application Server (WAS) Network Deployment (ND) traditional and configure a WAS cluster on Azure virtual machines (VMs) on GNU/Linux.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create a custom virtual network and create the VMs within the network.
> - Manually install WebSphere Application Server Network Deployment traditional (V9 or V8.5) on the VMs by using the graphical interface.
> - Configure a WAS cluster by using the Profile Management Tool.
> - Deploy and run a Java Platform Enterprise Edition (Java EE) application in the cluster.
> - Expose the application to the public internet via Azure Application Gateway.
> - Validate the successful configuration.

If you prefer a fully automated solution that does all of these steps on your behalf on GNU/Linux VMs, directly from the Azure portal, see [Quickstart: Deploy WebSphere Application Server Network Deployment Cluster on Azure Virtual Machines](/azure/developer/java/ee/traditional-websphere-application-server-virtual-machines). A less automated, but still accelerated, option is to skip the steps of installing Java Development Kit (JDK) and WebSphere on the operating system by using a pre-configured Red Hat Linux base image. You can find these offers in Azure Marketplace by using a [query for WebSphere Application Server image 9.0.5.x](https://aka.ms/was-vm-base-images).

If you're interested in working closely on your migration scenario with the engineering team developing WebSphere on Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Install Azure CLI version 2.46.0 or later](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - This article provides instructions for invoking Azure CLI commands on Windows PowerShell or UNIX Bash. Either way, you must install the Azure CLI.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- You must have an IBMid. If you don't have one, create an IBM account at [Log in to IBM](https://myibm.ibm.com/dashboard/) and select **Create an IBMid**. Make note of your IBMid password and email.
  - If you plan to use version 8.5.5 of IBM WebSphere Application Server Network Deployment, this IBMid must be entitled to use that version of the software. To learn about entitlements, ask the primary or secondary contacts for your IBM Passport Advantage site to grant you access, or follow the steps at [IBM eCustomer Care](https://ibm.biz/IBMidEntitlement).

## Prepare the environment

In this section, you set up the infrastructure within which you install IBM Installation Manager and WebSphere Application Server Network Deployment traditional.

### Assumptions

This tutorial configures a WAS cluster with a deployment manager and two managed servers on a total of three VMs. To configure the cluster, you must create the following three Azure VMs within the same availability set:

- The admin VM (VM name `adminVM`) has the deployment manager running.
- The managed VMs (VM names `mspVM1` and `mspVM2`) have two managed servers running.

[!INCLUDE [sign-in-to-azure](includes/sign-in-to-azure.md)]

### Create a resource group

Create a resource group by using [az group create](/cli/azure/group#az-group-create). Resource group names must be globally unique within a subscription. For this reason, consider prepending a unique identifier to any names you create that must be unique. A useful technique is to use your initials, followed by today's date in `mmdd` format. This example creates a resource group named `abc1110rg` in the `eastus` location:

### [Bash](#tab/in-bash)

```bash
export RESOURCE_GROUP_NAME=abc1110rg
az group create --name $RESOURCE_GROUP_NAME --location eastus
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:RESOURCE_GROUP_NAME = "abc1110rg"
az group create `
    --name $Env:RESOURCE_GROUP_NAME `
    --location eastus
```

---

### Create a virtual network

> [!NOTE]
> By default, the Azure CLI commands in this section follow the Bash style unless otherwise specified.
>
> If you run these commands in PowerShell, be sure to declare environment parameters as indicated in the earlier commands.
>
> To break a command line into multiple lines in PowerShell, you can use the backtick character (`) at the end of each line.

The resources that compose your WebSphere Application Server cluster must communicate with each other, and with the public internet, by using a virtual network. For a complete guide to planning your virtual network, see the Cloud Adoption Framework for Azure guide [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm). For more information, see [Azure Virtual Network frequently asked questions](/azure/virtual-network/virtual-networks-faq).

Use the following steps to create the virtual network. The example in this section creates a virtual network with address space `192.168.0.0/16` and creates a subnet for VMs.

1. Create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a network named `myVNet`:

   ### [Bash](#tab/in-bash)

   ```bash
   az network vnet create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myVNet \
       --address-prefixes 192.168.0.0/24
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network vnet create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name myVNet `
       --address-prefixes 192.168.0.0/24
   ```

1. Create a subnet for the WAS cluster by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `mySubnet`:

   ### [Bash](#tab/in-bash)

   ```bash
   az network vnet subnet create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mySubnet \
       --vnet-name myVNet \
       --address-prefixes 192.168.0.0/25
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network vnet subnet create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mySubnet `
       --vnet-name myVNet `
       --address-prefixes 192.168.0.0/25
   ```

1. Create a subnet for Application Gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `wasGateway`:

   ### [Bash](#tab/in-bash)

   ```bash
   az network vnet subnet create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name wasGateway \
       --vnet-name myVNet \
       --address-prefixes 192.168.0.128/25
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network vnet subnet create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name wasGateway `
       --vnet-name myVNet `
       --address-prefixes 192.168.0.128/25
   ```

[!INCLUDE [create-an-availability-set](includes/create-an-availability-set.md)]

## Get or install WAS on GNU/Linux

The following sections describe the steps for getting or installing WAS on GNU/Linux. You can choose the operating system and WAS version according to your requirements, but you should verify that they're available in the [IBM WebSphere Application Server Network Deployment documentation](https://www.ibm.com/docs/en/was-nd).

### [WAS ND V9](#tab/was-nd-v9)

If you want to use WAS V9, the instructions use an Azure VM image that contains the latest supported version of the software. IBM and Microsoft maintain the image. For the full list of WAS base images that IBM and Microsoft maintain, see [Azure Marketplace](https://aka.ms/was-vm-base-images).

IBM and Microsoft maintain a VM base image that has WAS V9 preinstalled on the recommended version of Red Hat Enterprise Linux. For more information about this image, see [the Azure portal](https://aka.ms/twas-base-vm-portal). If you take this approach, the Azure Marketplace image that you use to create the VMs is `ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2021-04-27-twas-cluster-base-image:2021-04-27-twas-cluster-base-image:latest`. Use the following command to save the image name in an environment variable:

```azurecli
export VM_URN="ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2023-03-27-twas-cluster-base-image:2023-03-27-twas-cluster-base-image:latest"
```

```powershell
$Env:ADMIN_OS_DISK_ID="ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2023-03-27-twas-cluster-base-image:2023-03-27-twas-cluster-base-image:latest"
```

### [WAS ND V85](#tab/was-nd-v85)

If you want to use WAS V8.5, the instructions start with a base Red Hat Enterprise Linux VM and walk you through the steps of installing all of the necessary dependencies.

The Azure Marketplace image that you use to create the VMs is `RedHat:rhel-raw:86-gen2:latest`. Use the following command to save the image name in an environment variable.

> [!NOTE]
> You can query all the available Red Hat Enterprise Linux images provided by Red Hat by using [az vm image list](/cli/azure/vm/image#az-vm-image-list), as shown in the following example:
>
> ```azurecli
> az vm image list \
>     --offer RHEL \
>     --publisher RedHat \
>     --output table \
>     --all
> ```
>
> For more information, see [Overview of Red Hat Enterprise Linux images](/azure/virtual-machines/workloads/redhat/redhat-images).
>
> If you use a different image, you might need to install extra libraries to enable the infrastructure that this guide uses.

```azurecli
export VM_URN="RedHat:rhel-raw:86-gen2:latest"
```

```powershell
$Env:VM_URN="RedHat:rhel-raw:86-gen2:latest"
```

---

### Create a Red Hat Enterprise Linux machine

Use the following steps to create a basic VM, ensure the installation of required tools, take a snapshot of its disk, and create replicas based on that snapshot:

1. Create a VM by using [az vm create](/cli/azure/vm). You run the deployment manager on this VM.

   The following example creates a Red Hat Enterprise Linux machine by using a username/password pair for the authentication. You can choose to use TLS/SSL authentication instead.

   ### [Bash](#tab/in-bash)

   ```bash
   az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --availability-set myAvailabilitySet \
       --image $VM_URN \
       --size Standard_DS1_v2  \
       --admin-username azureuser \
       --admin-password Secret123456 \
       --public-ip-address "" \
       --nsg ""
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # For `public-ip-address` and `nsg`, be sure to wrap the value "" in '' in PowerShell.
   az vm create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name adminVM `
       --availability-set myAvailabilitySet `
       --image $Env:VM_URN `
       --size Standard_DS1_v2 `
       --admin-username azureuser `
       --admin-password Secret123456 `
       --public-ip-address '""' `
       --nsg '""'
   ```

1. Create and attach a new disk for WAS files by using the following command:

   ### [WAS ND V9](#tab/was-nd-v9)

   This step is already performed for you when you use the VM base image.

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   az vm disk attach \
       --resource-group $RESOURCE_GROUP_NAME \
       --vm-name adminVM \
       --name adminVM_Data_Disk_1 \
       --new \
       --size-gb 100 \
       --sku StandardSSD_LRS
   ```

   ```powershell
   az vm disk attach `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --vm-name adminVM `
       --name adminVM_Data_Disk_1 `
       --new `
       --size-gb 100 `
       --sku StandardSSD_LRS
   ```

### Create a Windows VM and set up an X server

This tutorial uses the graphical interface of WAS to complete the installation and configuration. You use a Windows VM as a *jump box* and run an [X Window System server](https://sourceforge.net/projects/vcxsrv/) to view the graphical installers on the three VMs of the WAS cluster.

Use the following steps to provision a Windows 10 machine and install an X server. If you already have a Windows machine within the same network as the Red Hat Enterprise Linux machine, you don't need to provision a new one from Azure. You can go directly to the section that installs the X server.

[!INCLUDE [create-windows-vm-and-set-up-xserver](includes/create-windows-vm-and-set-up-xserver.md)]

You're now ready to connect to the Red Hat Enterprise Linux machine and install the required tools by using the graphical interface. The following sections guide you to install IBM Installation Manager and WebSphere Application Server Network Deployment traditional. You use `myWindowsVM` for the installation and configuration.

### Install dependencies

Use the following steps to install the required dependencies to allow the connection from the X server and enable graphical installation:

1. Use the following steps to get the private IP address of `adminVM`:

   1. In the Azure portal, select the resource group `abc1110rg`.
   1. In the list of resources, select `adminVM`.
   1. On the overview pane, select **Properties**.
   1. In the **Networking** section, copy the value of **Private IP address**. In this example, the value is `192.168.0.4`.

1. Open a command prompt from `myWindowsVM`, and then connect to `adminVM` by using `ssh`, as shown in the following example:

   ```cmd
   set ADMINVM_IP="192.168.0.4"
   ssh azureuser@%ADMINVM_IP%
   ```

1. Enter the password *Secret123456*.

1. Use the following command to switch to the `root` user. This tutorial installs all the tools with the `root` user.

   ```bash
   sudo su -
   ```

1. Use the following commands to install dependencies:

   ```bash
   # dependencies for X server access
   yum install -y libXtst libSM libXrender

   # dependencies for GUI installation
   yum install -y gtk2 gtk3 libXtst xorg-x11-fonts-Type1 mesa-libGL
   ```

Later, you continue to mount the data disk on `adminVM`, so keep this terminal open.

### Mount the data disk

### [WAS ND V9](#tab/was-nd-v9)

This step is already performed for you when you use the VM base image. Set the following environment variables in the shell on `adminVM`.

### [WAS ND V85](#tab/was-nd-v85)

You store all the installation files and configurations to the data disk. Use the following steps to mount the disk. Run the commands as the `root` user. If you aren't working with `root`, run `sudo su -` to switch users.

1. Use the following command to check for the last-created disk device that you format for holding WAS files:

   ```bash
   ls -alt /dev/sd*|head -1
   ```

   The output is similar to the following example:

   ```output
   brw-rw----. 1 root disk 8, 32 Jan 28 09:04 /dev/sdc
   ```

1. Use the following steps to format the device. As the `root` user, run `parted` on the device.

   1. Use the following command to create a primary partition that spans the whole disk:

      ```bash
      parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%
      ```

   1. Use the following command to check the device details by printing its metadata:

      ```bash
      parted /dev/sdc print
      ```

      The output should look similar to the following example:

      ```output
      Model: Msft Virtual Disk (scsi)
      Disk /dev/sdc: 107GB
      Sector size (logical/physical): 512B/4096B
      Partition Table: gpt
      Disk Flags:

      Number  Start   End    Size   File system  Name     Flags
      1      1049kB  107GB  107GB               xfspart
      ```

1. Use the following commands to create a file system on the device partition:

   ```bash
   mkfs.xfs /dev/sdc1
   partprobe /dev/sdc1
   ```

1. Use the following command to create a mount point:

   ```bash
   mkdir /datadrive
   ```

1. Use the following command to mount the disk:

   ```bash
   mount /dev/sdc1 /datadrive
   ```

1. Use the following command to add the mount to the */etc/fstab* file:

   ```bash
   echo "UUID=$(blkid | grep -Po "(?<=\/dev\/sdc1\: UUID=\")[^\"]*(?=\".*)")   /datadrive   xfs   defaults,nofail   1   2" >> /etc/fstab
   ```

1. Use the following commands to create directories for installation files and configuration files:

   ```bash
   export IM_INSTALL_DIRECTORY=/datadrive/IBM/InstallationManager/V1.9
   export WAS_ND_INSTALL_DIRECTORY=/datadrive/IBM/WebSphere/ND/V85
   export IM_SHARED_DIRECTORY=/datadrive/IBM/IMShared
   mkdir -p ${IM_INSTALL_DIRECTORY}
   mkdir -p ${WAS_ND_INSTALL_DIRECTORY}
   mkdir -p ${IM_SHARED_DIRECTORY}
   ```

Later, you continue to install IBM Installation Manager on `adminVM`, so keep this terminal open.

### Download and install IBM Installation Manager

Use the following steps to download and install IBM Installation Manager by using the X server on `myWindowsVM`:

1. Download IBM Installation Manager by using the `curl` command, as shown in the following example. Save the installer file to */datadrive/tmp*, and then unzip the file to */datadrive/installer*.

   ```bash
   mkdir /datadrive/tmp
   cd /datadrive/tmp
   curl -LO https://public.dhe.ibm.com/ibmdl/export/pub/software/im/zips/agent.installer.linux.gtk.x86_64.zip
   unzip -o agent.installer.linux.gtk.x86_64.zip -d /datadrive/installer
   ```

1. Before you open the installer, set the `DISPLAY` variable, as shown in the following example. This variable allows the graphical installer to run on the Red Hat Linux VM but appear on `myWindowsVM`. The value of the `DISPLAY` variable includes the private IP address of `myWindowsVM`.

   In this example, the IP address is `192.168.0.5`. The display number follows the IP address of `myWindowsVM`. In the X Window System, the most common display number is `:0.0`.

   ```bash
   export DISPLAY=<my-windows-VM-private-IP>:0.0
   # export DISPLAY=192.168.0.5:0.0
   ```

   You can find the IP address by using the following steps:

   1. In the Azure portal, select `myWindowsVM`.
   1. On the overview pane, under **Properties**, in the **Networking** section, find **Private IP address**.

1. Use the following commands to start the process of installing IBM Installation Manager:

   ```bash
   cd /datadrive/installer
   ./install
   ```

1. After a while, the installer appears. If you don't see the user interface, troubleshoot the problem before proceeding. Keep the default settings and select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-select-packages-to-install.png" alt-text="Screenshot of IBM Installation Manager setup." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-select-packages-to-install.png":::

1. Accept the license agreement by selecting **I accept the terms in the license agreement**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-accept-license.png" alt-text="Screenshot of the IBM Installation Manager license agreement." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-accept-license.png":::

1. Set the Installation Manager directory to */datadrive/IBM/InstallationManager/V1.9*, and then select **Next**.

   > [!NOTE]
   > Many of the steps in this guidance require you to copy values from this text and paste them directly into the installer UI. A typo in one of these values can cause the process to fail completely. We strongly recommend that you open a Notepad instance within the Windows jump box VM and use that as an intermediate place to paste values from this guidance. Then, inside the VM, do a separate copy/paste operation from Notepad to the installer UI. This action minimizes the chances of a simple typo causing the guidance to fail.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-directory.png" alt-text="Screenshot of the IBM Installation Manager directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-directory.png":::

1. Review the summary information, and then select **Install**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-summary.png" alt-text="Screenshot of the IBM Installation Manager summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-summary.png":::

1. Wait for the verification that the installation finished without error.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-complete.png" alt-text="Screenshot that shows successful installation of IBM Installation Manager." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-complete.png":::

1. Close the installer. IBM Installation Manager is now installed in the directory */datadrive/IBM/InstallationManager/V1.9*.

Next, you continue to install WebSphere Application Server on `adminVM`, so keep this terminal open.

---

### Install WebSphere Application Server Network Deployment traditional

### [WAS ND V9](#tab/was-nd-v9)

When you use the base image, WebSphere Application Server Network Deployment is already installed in the directory */datadrive/IBM/WebSphere/ND/V9*.

### [WAS ND V85](#tab/was-nd-v85)

In this section, you use the X server on `myWindowsVM` to view the graphical installer for WebSphere Application Server Network Deployment traditional V8.5 running on `adminVM`. Use the following steps to view the installer and install the server:

1. If you aren't using the previous terminal, set the `DISPLAY` variable by running `export DISPLAY=<my-windows-vm-private-ip>:0.0`.

1. Use the following commands to start the process to install WAS:

   ```bash
   cd /datadrive/IBM/InstallationManager/V1.9/eclipse/
   ./IBMIM
   ```

1. After a while, the installer appears. If you don't see the user interface, troubleshoot the problem before proceeding.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png" alt-text="Screenshot of IBM WebSphere Application Server installation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png":::

1. Select **Files** > **Preferences** to begin configuring a repository connection.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-edit-preferences.png" alt-text="Screenshot of IBM WebSphere Application Server edit preferences." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-edit-preferences.png":::

1. On the **Repositories** pane, select **Add Repository**. Find the repository URL from [the online product repository of IBM WebSphere Application Server offerings](https://www.ibm.com/docs/en/was/8.5.5?topic=installing-online-product-repositories-websphere-application-server-offerings). For WebSphere Application Server Network Deployment V8.5, the URL should be `https://www.ibm.com/software/repositorymanager/com.ibm.websphere.ND.v85`. Fill in the URL in the **Repository** box, and then select **OK**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-add-the-product-repository.png" alt-text="Screenshot of the box for adding the product repository for IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-add-the-product-repository.png":::

1. After a while, the **Password Required** pane asks you to enter your IBMid. Fill in your username and password, select **Save password**, and then select **OK**.

   > [!NOTE]
   > The IBMid must be entitled to run WebSphere 8.5.5. If you need help obtaining this entitlement, contact [IBM eCustomer Care](https://www-112.ibm.com/software/howtobuy/passportadvantage/homepage/ecarec).

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png" alt-text="Screenshot of the Password Required pane for IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png":::

1. It takes a while to connect to the repository. If you get an error, make sure that the IBMid and password are correct. Also make sure that your IBMid is entitled to access the product repository for IBM WebSphere Application Server Network Deployment V8.5.

1. After the connection is complete, the product repository URL is in the **Repositories** list. Select **OK** to close the **Preferences** pane.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-the-product-repository-added.png" alt-text="Screenshot of a product repository added to IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-the-product-repository-added.png":::

1. Back on the landing page of IBM Installation Manager, select **Install**. It takes a while to prepare the installer. You might see a message similar to `Waiting for www-147.ibm.com.`

1. After the connection is established, the **Install Packages** pane appears. Select the top-level IBM WebSphere Application Server Network Deployment version 8.5.5.x. The exact version number can be different, but it must be the latest 8.5.5 version shown. Be sure to select the nested checkboxes. Then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation.png" alt-text="Screenshot of the Install Packages pane and IBM WebSphere Application Server WAS 8.5.5 installation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation.png":::

1. It takes a while to prepare the installer. You might see a message similar to `Waiting for www-147.ibm.com.` If you're prompted to install fixes, accept the installation of the recommended fixes and proceed.

1. Accept the license agreement by selecting **I accept the terms in the license agreement**, and then select **Next**.

1. Set **Shared Resources Directory** to */datadrive/IBM/IMShared*, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-shared-resources-directory.png" alt-text="Screenshot of the Shared Resources Directory box for IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-shared-resources-directory.png":::

1. Set **Installation Directory** to */datadrive/IBM/WebSphere/ND/V85*, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-directory.png" alt-text="Screenshot of the Installation Directory box for IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-directory.png":::

1. Keep **Translations** with the default value and select **Next**.

1. Keep the default value of **IBM JDK** and select **Next**.

1. On the **Summary** tab, select **Install**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-summary.png" alt-text="Screenshot of an IBM WebSphere Application Server summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-summary.png":::

1. The installation process should finish without errors. For **Which program do you want to start?**, select **None**. Then select **Finish**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-complete.png" alt-text="Screenshot of completed package installation for IBM WebSphere Application Server." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-complete.png":::

1. If the WebSphere Customization Toolbox appears, close it. Close IBM Installation Manager.

1. Go back to the shell from which you started IBM Installation Manager. Verify the correct installation path by using the following command to test for the existence of the Profile Management Tool:

   ```bash
   ls -la /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement/pmt.sh
   ```

   If this file doesn't exist, correct the problem before proceeding.

You finished installing WebSphere Application Server Network Deployment in the directory */datadrive/IBM/WebSphere/ND/V85*.

---

### Create machines for managed servers

You installed WebSphere Application Server Network Deployment on `adminVM`, which runs the deployment manager. You still need to prepare machines to run the two managed servers. Next, you create a snapshot from disks of `adminVM` and prepare machines for managed severs `mspVM1` and `mspVM2`.

This section introduces an approach to prepare machines with the snapshot of `adminVM`. Return to your terminal where you're signed in to the Azure CLI, and then use the following steps. This terminal isn't the Windows jump box.

1. Use the following command to stop `adminVM`:

   ### [Bash](#tab/in-bash)

   ```bash
   # export RESOURCE_GROUP_NAME=abc1110rg
   az vm stop --resource-group $RESOURCE_GROUP_NAME --name adminVM
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # $Env:RESOURCE_GROUP_NAME = "abc1110rg"
   az vm stop --resource-group $Env:RESOURCE_GROUP_NAME --name adminVM
   ```

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` OS disk:

   ### [Bash](#tab/in-bash)

   ```bash
   export ADMIN_OS_DISK_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --query storageProfile.osDisk.managedDisk.id \
       --output tsv)
   az snapshot create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAdminOSDiskSnapshot \
       --source $ADMIN_OS_DISK_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   $Env:ADMIN_OS_DISK_ID=$(az vm show `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name adminVM `
       --query storageProfile.osDisk.managedDisk.id `
       --output tsv)
   az snapshot create  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAdminOSDiskSnapshot  `
       --source $Env:ADMIN_OS_DISK_ID
   ```

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` data disk:

   ### [Bash](#tab/in-bash)

   ```bash
   export ADMIN_DATA_DISK_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --query 'storageProfile.dataDisks[0].managedDisk.id' \
       --output tsv)
   az snapshot create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAdminDataDiskSnapshot \
       --source $ADMIN_DATA_DISK_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   $Env:ADMIN_DATA_DISK_ID=$(az vm show `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name adminVM  `
       --query 'storageProfile.dataDisks[0].managedDisk.id' `
       --output tsv)
   az snapshot create  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAdminDataDiskSnapshot `
       --source $Env:ADMIN_DATA_DISK_ID
   ```

1. Use the following commands to query for the snapshot IDs that you use later:

   ### [Bash](#tab/in-bash)

   ```bash
   # Get the snapshot ID.
   export OS_SNAPSHOT_ID=$(az snapshot show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAdminOSDiskSnapshot \
       --query '[id]' \
       --output tsv)
   export DATA_SNAPSHOT_ID=$(az snapshot show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAdminDataDiskSnapshot \
       --query '[id]' \
       --output tsv)
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Get the snapshot ID.
   $Env:OS_SNAPSHOT_ID=$(az snapshot show `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAdminOSDiskSnapshot `
       --query '[id]' `
       --output tsv)
   $Env:DATA_SNAPSHOT_ID=$(az snapshot show  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAdminDataDiskSnapshot `
       --query '[id]' `
       --output tsv)
   ```

Next, create `mspVM1` and `mspVM2`.

#### Create mspVM1

Use the following steps to create `mspVM1`:

1. Create an OS disk for `mspVM1` by using [az disk create](/cli/azure/disk#az-disk-create):

   ### [Bash](#tab/in-bash)

   ```bash
   # Create a new managed disk by using the OS snapshot ID.
   # Note that the managed disk is created in the same location as the snapshot.
   az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_OsDisk_1 \
       --source $OS_SNAPSHOT_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Create a new managed disk by using the OS snapshot ID.
   # Note that the managed disk is created in the same location as the snapshot.
   az disk create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name mspVM1_OsDisk_1 `
       --source $Env:OS_SNAPSHOT_ID
   ```

1. Use the following commands to create the `mspVM1` VM by attaching OS disk `mspVM1_OsDisk_1`:

   ### [Bash](#tab/in-bash)

   ```bash
   # Get the resource ID of the managed disk.
   export MSPVM1_OS_DISK_ID=$(az disk show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_OsDisk_1 \
       --query '[id]' \
       --output tsv)
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Get the resource ID of the managed disk.
   $Env:MSPVM1_OS_DISK_ID=$(az disk show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1_OsDisk_1 `
       --query '[id]' `
       --output tsv)
   ```

    ---

   ### [WAS ND V9](#tab/was-nd-v9)

   ```bash
   # Create the VM by attaching the existing managed disk as an OS.
   az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1 \
       --attach-os-disk $MSPVM1_OS_DISK_ID \
       --plan-publisher ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops \
       --plan-product 2023-03-27-twas-cluster-base-image \
       --plan-name 2023-03-27-twas-cluster-base-image \
       --os-type linux \
       --availability-set myAvailabilitySet \
       --public-ip-address "" \
       --nsg ""
   ```

   ```powershell
   # Create the VM by attaching the existing managed disk as an OS.
   # For `public-ip-address` and `nsg`, be sure to wrap the value "" in '' in PowerShell.
   az vm create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1 `
       --attach-os-disk $Env:MSPVM1_OS_DISK_ID `
       --plan-publisher ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops `
       --plan-product 2023-03-27-twas-cluster-base-image `
       --plan-name 2023-03-27-twas-cluster-base-image `
       --os-type linux `
       --availability-set myAvailabilitySet `
       --public-ip-address '""' `
       --nsg '""'
   ```

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   # Create the VM by attaching the existing managed disk as an OS.
   az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1 \
       --attach-os-disk $MSPVM1_OS_DISK_ID \
       --os-type linux \
       --availability-set myAvailabilitySet \
       --public-ip-address "" \
       --nsg ""
   ```

   ```powershell
   # Create the VM by attaching the existing managed disk as an OS.
   # For `public-ip-address` and `nsg`, be sure to wrap the value "" in '' in PowerShell.
   az vm create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1 `
       --attach-os-disk $Env:MSPVM1_OS_DISK_ID `
       --os-type linux `
       --availability-set myAvailabilitySet `
       --public-ip-address '""' `
       --nsg '""'
   ```

1. Create a managed disk from the data disk snapshot and attach it to `mspVM1`:

   ### [Bash](#tab/in-bash)

   ```bash
   az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_Data_Disk_1 \
       --source $DATA_SNAPSHOT_ID

   export MSPVM1_DATA_DISK_ID=$(az disk show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_Data_Disk_1 \
       --query '[id]' \
       --output tsv)

   az vm disk attach \
       --resource-group $RESOURCE_GROUP_NAME \
       --vm-name mspVM1 \
       --name $MSPVM1_DATA_DISK_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az disk create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1_Data_Disk_1 `
       --source $Env:DATA_SNAPSHOT_ID

   $Env:MSPVM1_DATA_DISK_ID=$(az disk show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1_Data_Disk_1 `
       --query '[id]' `
       --output tsv)

   az vm disk attach `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --vm-name mspVM1 `
       --name $Env:MSPVM1_DATA_DISK_ID
   ```

1. You created `mspVM1` with WAS installed. Because you created the VM from a snapshot of the `adminVM` disks, the two VMs have the same host name. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the host name to the value `mspVM1`:

   ### [Bash](#tab/in-bash)

   ```bash
   az vm run-command invoke \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1 \
       --command-id RunShellScript \
       --scripts "sudo hostnamectl set-hostname mspVM1"
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az vm run-command invoke `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1 `
       --command-id RunShellScript `
       --scripts "sudo hostnamectl set-hostname mspVM1"
   ```

    ---

   When the command finishes successfully, you get output similar to the following example:

   ```json
   {
       "value": [
           {
           "code": "ProvisioningState/succeeded",
           "displayStatus": "Provisioning succeeded",
           "level": "Info",
           "message": "Enable succeeded: \n[stdout]\n\n[stderr]\n",
           "time": null
           }
       ]
   }
   ```

#### Create mspVM2

Use the following steps to create `mspVM2`:

1. Create an OS disk for `mspVM2` by using [az disk create](/cli/azure/disk#az-disk-create):

   ### [Bash](#tab/in-bash)

   ```bash
   # Create a new managed disk by using the OS snapshot ID.
   # Note that the managed disk is created in the same location as the snapshot.
   az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_OsDisk_1 \
       --source $OS_SNAPSHOT_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Create a new managed disk by using the OS snapshot ID.
   # Note that the managed disk is created in the same location as the snapshot.
   az disk create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name mspVM2_OsDisk_1 `
       --source $Env:OS_SNAPSHOT_ID
   ```

1. Use the following commands to create the `mspVM2` VM by attaching OS disk `mspVM2_OsDisk_1`:

   ### [Bash](#tab/in-bash)

   ```bash
   # Get the resource ID of the managed disk.
   export MSPVM2_OS_DISK_ID=$(az disk show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_OsDisk_1 \
       --query '[id]' \
       --output tsv)

   # Create the VM by attaching the existing managed disk as an OS.
   az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --attach-os-disk $MSPVM2_OS_DISK_ID \
       --plan-publisher ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops \
       --plan-product 2023-03-27-twas-cluster-base-image \
       --plan-name 2023-03-27-twas-cluster-base-image \
       --os-type linux \
       --availability-set myAvailabilitySet \
       --public-ip-address "" \
       --nsg ""
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Get the resource ID of the managed disk.
   $Env:MSPVM2_OS_DISK_ID=$(az disk show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2_OsDisk_1 `
       --query '[id]' `
       --output tsv)

   # Create the VM by attaching the existing managed disk as an OS.
   # For `public-ip-address` and `nsg`, be sure to wrap the value "" in '' in PowerShell.
   az vm create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2 `
       --attach-os-disk $Env:MSPVM2_OS_DISK_ID `
       --plan-publisher ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops `
       --plan-product 2023-03-27-twas-cluster-base-image `
       --plan-name 2023-03-27-twas-cluster-base-image `
       --os-type linux `
       --availability-set myAvailabilitySet `
       --public-ip-address '""' `
       --nsg '""'
   ```

1. Create a managed disk from the data snapshot and attach it to `mspVM2`:

   ### [Bash](#tab/in-bash)

   ```bash
   az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_Data_Disk_1 \
       --source $DATA_SNAPSHOT_ID

   export MSPVM2_DATA_DISK_ID=$(az disk show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_Data_Disk_1 \
       --query '[id]' \
       --output tsv)

   az vm disk attach \
       --resource-group $RESOURCE_GROUP_NAME \
       --vm-name mspVM2 \
       --name $MSPVM2_DATA_DISK_ID
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az disk create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2_Data_Disk_1 `
       --source $Env:DATA_SNAPSHOT_ID

   $Env:MSPVM2_DATA_DISK_ID=$(az disk show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2_Data_Disk_1 `
       --query '[id]' `
       --output tsv)

   az vm disk attach `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --vm-name mspVM2 `
       --name $Env:MSPVM2_DATA_DISK_ID
   ```

1. You created `mspVM2` with WAS installed. Because you created the VM from a snapshot of the `adminVM` disks, the two VMs have the same host name. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the host name to the value `mspVM2`:

   ### [Bash](#tab/in-bash)

   ```bash
   az vm run-command invoke \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --command-id RunShellScript \
       --scripts "sudo hostnamectl set-hostname mspVM2"
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az vm run-command invoke `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2 `
       --command-id RunShellScript `
       --scripts "sudo hostnamectl set-hostname mspVM2"
   ```

    ---

   When the command finishes successfully, you get output similar to the following example:

   ```json
   {
       "value": [
           {
           "code": "ProvisioningState/succeeded",
           "displayStatus": "Provisioning succeeded",
           "level": "Info",
           "message": "Enable succeeded: \n[stdout]\n\n[stderr]\n",
           "time": null
           }
       ]
   }
   ```

Make sure that you completed the previous steps for both `mspVM1` and `mspVM2`. Then, use the following steps to finish preparing the machines:

1. Use the [az vm start](/cli/azure/vm#az-vm-start) command to start `adminVM`, as shown in the following example:

   ### [Bash](#tab/in-bash)

   ```bash
   az vm start --resource-group $RESOURCE_GROUP_NAME --name adminVM
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az vm start --resource-group $Env:RESOURCE_GROUP_NAME --name adminVM
   ```

1. Use the following commands to get and show the private IP addresses, which you use in later sections:

   ### [Bash](#tab/in-bash)

   ```bash
   export ADMINVM_NIC_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --query networkProfile.networkInterfaces'[0]'.id \
       --output tsv)
   export ADMINVM_IP=$(az network nic show \
       --ids $ADMINVM_NIC_ID \
       --query ipConfigurations'[0]'.privateIPAddress \
       --output tsv)
   export MSPVM1_NIC_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1 \
       --query networkProfile.networkInterfaces'[0]'.id \
       --output tsv)
   export MSPVM1_IP=$(az network nic show \
       --ids $MSPVM1_NIC_ID \
       --query ipConfigurations'[0]'.privateIPAddress \
       --output tsv)
   export MSPVM2_NIC_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --query networkProfile.networkInterfaces'[0]'.id \
       --output tsv)
   export MSPVM2_IP=$(az network nic show \
       --ids $MSPVM2_NIC_ID \
       --query ipConfigurations'[0]'.privateIPAddress \
       --output tsv)
   echo "Private IP of adminVM: $ADMINVM_IP"
   echo "Private IP of mspVM1: $MSPVM1_IP"
   echo "Private IP of mspVM2: $MSPVM2_IP"
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   $Env:ADMINVM_NIC_ID=$(az vm show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name adminVM `
       --query networkProfile.networkInterfaces'[0]'.id `
       --output tsv)
   $Env:ADMINVM_IP=$(az network nic show `
       --ids $Env:ADMINVM_NIC_ID `
       --query ipConfigurations'[0]'.privateIPAddress `
       --output tsv)
   $Env:MSPVM1_NIC_ID=$(az vm show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM1 `
       --query networkProfile.networkInterfaces'[0]'.id `
       --output tsv)
   $Env:MSPVM1_IP=$(az network nic show `
       --ids $Env:MSPVM1_NIC_ID `
       --query ipConfigurations'[0]'.privateIPAddress `
       --output tsv)
   $Env:MSPVM2_NIC_ID=$(az vm show `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name mspVM2 \
       --query networkProfile.networkInterfaces'[0]'.id `
       --output tsv)
   $Env:MSPVM2_IP=$(az network nic show `
       --ids $Env:MSPVM2_NIC_ID `
       --query ipConfigurations'[0]'.privateIPAddress `
       --output tsv)
   echo "Private IP of adminVM: $Env:ADMINVM_IP"
   echo "Private IP of mspVM1: $Env:MSPVM1_IP"
   echo "Private IP of mspVM2: $Env:MSPVM2_IP"
   ```

Now, all three machines are ready. Next, you configure a WAS cluster.

## Create WAS profiles and a cluster

This section shows you how to create and configure a WAS cluster. In terms of creating WAS profiles and a cluster, there's no significant difference between the 9.x series and the 8.5.x series. All the screenshots in this section show V9 as the basis.

### Configure a deployment manager profile

In this section, you use the X server on `myWindowsVM` to create a management profile for the deployment manager to administer servers within the deployment manager cell by using the Profile Management Tool. For more information about profiles, see [Profile concepts](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=mpdios-profile-concepts). For more information about creating the deployment manager profile, see [Creating management profiles with deployment managers](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=interface-creating-management-profiles-deployment-managers).

Use the following steps to create and configure the management profile:

1. Make sure you're still on your Windows machine. If you aren't, use the following commands to remotely connect to `myWindowsVM`, and then connect to `adminVM` from a command prompt:

   ```bash
   set ADMINVM_IP="192.168.0.4"
   ssh azureuser@%ADMINVM_IP%
   ```

1. Use the following commands to become the `root` user and set the `DISPLAY` variable:

   ```bash
   sudo su -

   export DISPLAY=<my-windows-vm-private-ip>:0.0
   # export DISPLAY=192.168.0.5:0.0
   ```

1. Use the following commands to start the Profile Management Tool:

   ### [WAS ND V9](#tab/was-nd-v9)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V9/bin/ProfileManagement
   ./pmt.sh
   ```

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement
   ./pmt.sh
   ```

1. After a while, the Profile Management Tool appears. If you don't see the user interface, check behind the command prompt. Select **Create**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool.png" alt-text="Screenshot of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool.png":::

1. On the **Environment Selection** pane, select **Management**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile.png" alt-text="Screenshot of the Environment Selection pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile.png":::

1. On the **Server Type Selection** pane, select **Deployment manager**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-deployment-manager.png" alt-text="Screenshot of the Server Type Selection pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-deployment-manager.png":::

1. On the **Profile Creation Options** pane, select **Advanced profile creation**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-options-advanced.png" alt-text="Screenshot of the Profile Creation Options pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-options-advanced.png":::

1. On the **Optional Application Deployment** pane, ensure that **Deploy the administrative console (recommended)** is selected, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-deploy-console.png" alt-text="Screenshot of the Optional Application Deployment pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-deploy-console.png":::

1. On the **Profile Name and Location** pane, enter your profile name and location. In this example, the profile name is `Dmgr01`. The location depends on your WAS version:

   - In WAS V9, the location is */datadrive/IBM/WebSphere/ND/V9/profiles/Dmgr01*.
   - In WAS V8.5, the location is */datadrive/IBM/WebSphere/ND/V85/profiles/Dmgr01*.

   When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-profilename-location.png" alt-text="Screenshot of the Profile Name and Location pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-profilename-location.png":::

1. On the **Node, Host, and Cell Names** pane, enter your node name, host name, and cell name. The host is the private IP address of `adminVM`. In this example, the node name is `adminvmCellManager01`, the host value is `192.168.0.4`, and the cell name is `adminvmCell01`. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-node-host-cell.png" alt-text="Screenshot of the Node, Host, and Cell Names pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-node-host-cell.png":::

1. On the **Administrative Security** pane, enter your admin username and password. In this example, the username is `websphere`, and the password is `Secret123456`. Note down the username and password so you can use them to sign in to the IBM console. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-admin-security.png" alt-text="Screenshot of the Administrative Security pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-admin-security.png":::

1. For the security certificate (part 1), enter your certificate if you have one. This example uses the default self-signed certificate. Then select **Next**.

1. For the security certificate (part 2), enter your certificate if you have one. This example uses the default self-signed certificate. Then select **Next**.

1. On the **Port Values Assignment** pane, keep the default ports and select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-ports.png" alt-text="Screenshot of the Port Values Assignment pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-ports.png":::

1. On the **Linux Service Definition** pane, don't select **Run the deployment manager process as a Linux service**. Later, you create the Linux service. Select **Next**.

1. On the **Profile Creation Summary** pane, make sure that the information is correct, and then select **Create**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile-summary.png" alt-text="Screenshot of the Profile Creation Summary pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile-summary.png":::

1. It takes a while to finish the profile creation. When the **Profile Creation Complete** pane appears, select **Launch the First steps console**. Then select **Finish**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-profile-complete.png" alt-text="Screenshot of the Profile Creation Complete pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-profile-complete.png":::

1. The **First steps** console appears. Select **Installation verification**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps.png" alt-text="Screenshot of the First steps console of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps.png":::

1. The verification process starts, and output similar to the following example appears. If there are errors, you must resolve them before moving on.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps-output.png" alt-text="Screenshot of First steps console output for the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps-output.png":::

1. The deployment manager process starts. You can close the **First steps** console by closing the output pane and selecting **Exit** in the console.

   You finished the profile creation. You can close the WebSphere Customization Toolbox.

1. To access the IBM console, open the firewall ports by using the following commands:

   ```bash
   firewall-cmd --zone=public --add-port=9060/tcp --permanent
   firewall-cmd --zone=public --add-port=9043/tcp --permanent
   firewall-cmd --zone=public --add-port=9809/tcp --permanent
   firewall-cmd --zone=public --add-port=7277/tcp --permanent
   firewall-cmd --zone=public --add-port=9402/tcp --permanent
   firewall-cmd --zone=public --add-port=9403/tcp --permanent
   firewall-cmd --zone=public --add-port=9352/tcp --permanent
   firewall-cmd --zone=public --add-port=9632/tcp --permanent
   firewall-cmd --zone=public --add-port=9100/tcp --permanent
   firewall-cmd --zone=public --add-port=9401/tcp --permanent
   firewall-cmd --zone=public --add-port=8879/tcp --permanent
   firewall-cmd --zone=public --add-port=5555/tcp --permanent
   firewall-cmd --zone=public --add-port=7060/tcp --permanent
   firewall-cmd --zone=public --add-port=11005/udp --permanent
   firewall-cmd --zone=public --add-port=11006/tcp --permanent
   firewall-cmd --zone=public --add-port=9420/tcp --permanent

   firewall-cmd --reload
   ```

1. To start the deployment manager automatically at startup, create a Linux service for the process. Run the following commands to create a Linux service:

   ### [WAS ND V9](#tab/was-nd-v9)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V9/profiles/Dmgr01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service.
   ${PROFILE_PATH}/bin/wasservice.sh -add adminvmCellManager01 -servername dmgr -profilePath ${PROFILE_PATH}
   ```

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V85/profiles/Dmgr01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service.
   ${PROFILE_PATH}/bin/wasservice.sh -add adminvmCellManager01 -servername dmgr -profilePath ${PROFILE_PATH}
   ```

1. Confirm that the following output appears:

   ```bash
   CWSFU0013I: Service [adminvmCellManager01] added successfully.
   ```

   If the output doesn't appear, troubleshoot and resolve the problem before continuing.

The deployment manager is running on `adminVM`. From the jump box Windows VM, you can access the IBM console at the URL `http://<admin-vm-private-ip>:9060/ibm/console/`.

### Configure custom profiles

In this section, you use the X server on `myWindowsVM` to create custom profiles for the managed servers `mspVM1` and `mspVM2.`

Make sure you're still on your Windows machine. If you're not, remotely connect to `myWindowsVM`.

#### Configure the custom profile for mspVM1

Use the following steps to configure a custom profile for `mspVM1`:

1. Use the following commands to connect to `mspVM1` from a command prompt:

   ```bash
   set MSPVM1VM_IP="192.168.0.6"
   ssh azureuser@%MSPVM1VM_IP%
   ```

1. Use the following commands to become the `root` user and set the `DISPLAY` variable:

   ```bash
   sudo su -

   export DISPLAY=<my-windows-vm-private-ip>:0.0
   # export DISPLAY=192.168.0.5:0.0
   ```

1. To access the deployment manager on `adminVM`, open firewall ports by using the following commands:

   ```bash
   firewall-cmd --zone=public --add-port=9080/tcp --permanent
   firewall-cmd --zone=public --add-port=9443/tcp --permanent
   firewall-cmd --zone=public --add-port=2809/tcp --permanent
   firewall-cmd --zone=public --add-port=9405/tcp --permanent
   firewall-cmd --zone=public --add-port=9406/tcp --permanent
   firewall-cmd --zone=public --add-port=9353/tcp --permanent
   firewall-cmd --zone=public --add-port=9633/tcp --permanent
   firewall-cmd --zone=public --add-port=5558/tcp --permanent
   firewall-cmd --zone=public --add-port=5578/tcp --permanent
   firewall-cmd --zone=public --add-port=9100/tcp --permanent
   firewall-cmd --zone=public --add-port=9404/tcp --permanent
   firewall-cmd --zone=public --add-port=7276/tcp --permanent
   firewall-cmd --zone=public --add-port=7286/tcp --permanent
   firewall-cmd --zone=public --add-port=5060/tcp --permanent
   firewall-cmd --zone=public --add-port=5061/tcp --permanent
   firewall-cmd --zone=public --add-port=8880/tcp --permanent
   firewall-cmd --zone=public --add-port=11003/udp --permanent
   firewall-cmd --zone=public --add-port=11004/tcp --permanent
   firewall-cmd --zone=public --add-port=2810/tcp --permanent
   firewall-cmd --zone=public --add-port=9201/tcp --permanent
   firewall-cmd --zone=public --add-port=9202/tcp --permanent
   firewall-cmd --zone=public --add-port=9354/tcp --permanent
   firewall-cmd --zone=public --add-port=9626/tcp --permanent
   firewall-cmd --zone=public --add-port=9629/tcp --permanent
   firewall-cmd --zone=public --add-port=7272/tcp --permanent
   firewall-cmd --zone=public --add-port=5001/tcp --permanent
   firewall-cmd --zone=public --add-port=5000/tcp --permanent
   firewall-cmd --zone=public --add-port=9900/tcp --permanent
   firewall-cmd --zone=public --add-port=9901/tcp --permanent
   firewall-cmd --zone=public --add-port=8878/tcp --permanent
   firewall-cmd --zone=public --add-port=7061/tcp --permanent
   firewall-cmd --zone=public --add-port=7062/tcp --permanent
   firewall-cmd --zone=public --add-port=11001/udp --permanent
   firewall-cmd --zone=public --add-port=11002/tcp --permanent
   firewall-cmd --zone=public --add-port=9809/tcp --permanent
   firewall-cmd --zone=public --add-port=9402/tcp --permanent
   firewall-cmd --zone=public --add-port=9403/tcp --permanent
   firewall-cmd --zone=public --add-port=9352/tcp --permanent
   firewall-cmd --zone=public --add-port=9632/tcp --permanent
   firewall-cmd --zone=public --add-port=9401/tcp --permanent
   firewall-cmd --zone=public --add-port=11005/udp --permanent
   firewall-cmd --zone=public --add-port=11006/tcp --permanent
   firewall-cmd --zone=public --add-port=8879/tcp --permanent
   firewall-cmd --zone=public --add-port=9060/tcp --permanent
   firewall-cmd --zone=public --add-port=9043/tcp --permanent

   firewall-cmd --reload
   ```

1. Use the following commands to start the Profile Management Tool:

   ### [WAS ND V9](#tab/was-nd-v9)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V9/bin/ProfileManagement
   ./pmt.sh
   ```

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement
   ./pmt.sh
   ```

1. After a while, the Profile Management Tool appears. If you don't see the user interface, troubleshoot and resolve the problem before continuing. Select **Create**.

1. On the **Environment Selection** pane, select **Custom profile**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile.png" alt-text="Screenshot of the Environment Selection pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile.png":::

1. On the **Profile Creation Options** pane, select **Advanced profile creation**, and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-advanced-creation-1.png" alt-text="Screenshot of the Profile Creation Options pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-advanced-creation-1.png":::

1. On the **Profile Name and Location** pane, enter your profile name and location. In this example, the profile name is `Custom01`. The location depends on your WAS version:

   - In WAS V9, the location is */datadrive/IBM/WebSphere/ND/V9/profiles/Custom01*.
   - In WAS V8.5, the location is */datadrive/IBM/WebSphere/ND/V85/profiles/Custom01*.

   When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-name-location.png" alt-text="Screenshot of the Profile Name and Location pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-name-location.png":::

1. On the **Node and Host Names** pane, enter your node name and host. The value of host is the private IP address of `mspVM1`. In this example, the host is `192.168.0.6` and the node name is `mspvm1Node01`. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-node-host-name.png" alt-text="Screenshot of the Node and Host Names pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-node-host-name.png":::

1. On the **Federation** pane, enter the deployment manager's host name and authentication. For **Deployment manager host name or IP address**, the value is the private IP address of `adminVM`, which is `192.168.0.4` here. For **Deployment manager authentication**, in this example, the username is `websphere` and the password is `Secret123456`. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-deployment-manager.png" alt-text="Screenshot of the Federation pane of the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-deployment-manager.png":::

1. For the security certificate (part 1), enter your certificate if you have one. This example uses the default self-signed certificate. Then select **Next**.

1. For the security certificate (part 2), enter your certificate if you have one. This example uses the default self-signed certificate. Then select **Next**.

1. On the **Port Values Assignment** pane, keep the default ports and select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-ports.png" alt-text="Screenshot of the Port Values Assignment pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-ports.png":::

1. On the **Profile Creation Summary** pane, make sure that the information is correct, and then select **Create**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-summary.png" alt-text="Screenshot of the Profile Creation Summary pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-summary.png":::

1. It takes a while to create the custom profile. On the **Profile Creation Complete** pane, clear the **Launch the First steps console** checkbox. Then select **Finish** to complete profile creation and close the Profile Management Tool.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-complete.png" alt-text="Screenshot of the Profile Creation Complete pane in the IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-complete.png":::

1. To start the server automatically at startup, create a Linux service for the process. The following commands create a Linux service to start `nodeagent`:

   ### [WAS ND V9](#tab/was-nd-v9)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V9/profiles/Custom01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service to start nodeagent.
   ${PROFILE_PATH}/bin/wasservice.sh -add mspvm1Node01 -servername nodeagent -profilePath ${PROFILE_PATH}
   ```

   ### [WAS ND V85](#tab/was-nd-v85)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V85/profiles/Custom01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service to start nodeagent.
   ${PROFILE_PATH}/bin/wasservice.sh -add mspvm1Node01 -servername nodeagent -profilePath ${PROFILE_PATH}
   ```

1. Confirm that the following output appears:

   ```bash
   CWSFU0013I: Service [mspvm1Node01] added successfully.
   ```

   If the output doesn't appear, troubleshoot and resolve the problem before continuing.

You created a custom profile and `nodeagent` running on `mspVM1`. Stop being the `root` user, and close the SSH connection to `mspVM1`.

#### Configure the custom profile for mspVM2

Go back to the beginning of the [Configure the custom profile for mspVM1](#configure-the-custom-profile-for-mspvm1) section and do the same steps for `mspVM2`. That is, wherever you used `mspVM1` or similar, do the same for `mspVM2`.

On the **Node and Host Names** pane, enter `mspvm2Node01` for **Node name** and `192.168.0.7` for **Host name**.

You prepared the custom profile for two managed servers: `mspVM1` and `mspVM2`. Continue ahead to create a WAS cluster.

### Create a cluster and start servers

In this section, you use the IBM console to create a WAS cluster and start managed servers by using the browser on `myWindowsVM`. Make sure you're still on your Windows machine. If you aren't, remotely connect to `myWindowsVM`. Then, use the following steps:

1. Open the Microsoft Edge browser and go to `http://<adminvm-private-ip>:9060/ibm/console/`. In this example, the IBM console URL is `http://192.168.0.4:9060/ibm/console/`. Find the sign-in pane. Sign in to the IBM console using your administrative username and password (`websphere/Secret123456`). You can now administer clusters and servers.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-portal-overview.png" alt-text="Screenshot of welcome information in the IBM console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-portal-overview.png":::

1. On the navigation pane, select **Servers** > **Clusters** > **WebSphere application server clusters**. Then select **New** to create a new cluster.

1. In the **Create a new cluster** dialog, for **Step 1: Enter basic cluster information**, enter your cluster name. In this example, the cluster name is `cluster1`. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-new-cluster.png" alt-text="Screenshot of the step for entering basic cluster information in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-new-cluster.png":::

1. For **Step 2: Create first cluster member**, enter your member name, and select the node `mspvm1Node01`. In this example, the member name is `msp1`. The node depends on your WAS version:

   - In WAS V9, the node is `mspvm1Node01 (ND 9.0.5.12)`.
   - In WAS V8.5, the node is `mspvm1Node01 (ND 8.5.5.24)`.

   When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp1.png" alt-text="Screenshot of the step for creating a first cluster member in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp1.png":::

1. For **Step 3: Create additional cluster members**, enter your second member name, and select node `mspvm2Node01`. In this example, the member name is `msp2`. The node depends on your WAS version:

   - In WAS V9, the node is `mspvm2Node01 (ND 9.0.5.12)`.
   - In WAS V8.5, the node is `mspvm2Node01 (ND 8.5.5.24)`.

1. Select **Add Member** to add the second node. The table lists two members. When you finish, select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp2.png" alt-text="Screenshot of the step for creating an additional cluster member in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp2.png":::

1. For **Step 4: Summary**, select **Finish**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-summary.png" alt-text="Screenshot of the summary of actions for creating a cluster in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-summary.png":::

   It takes a while to create the cluster. After the cluster is created, `cluster1` appears in the table.

1. Select **cluster1**, and then select **Review** to review the information.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-review.png" alt-text="Screenshot of the link for reviewing changes in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-review.png":::

1. Select **Synchronize changes with Nodes**, and then select **Save**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-save.png" alt-text="Screenshot of the checkbox for synchronizing changes with nodes in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-save.png":::

1. The creation should finish without error. Select **OK** to continue.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-status.png" alt-text="Screenshot of the IBM Console that shows successful completion of synchronization." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-status.png":::

1. Select **cluster1** in the table, and then select the **Start** button to start the cluster.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-start-cluster.png" alt-text="Screenshot of selections to start a newly created cluster in the IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-start-cluster.png":::

1. It takes a while to start the two managed servers. In the **Status** column, select the refresh icon (two arrows pointing to each other) to refresh the status.

   Hover over the refresh icon. When the tooltip shows **Started**, you can trust that the cluster is formed. Continue to periodically refresh and check until the tooltip shows **Started**.

1. Use the following steps to configure the Application Server Monitoring Policy settings to automatically start the managed server after the Node Agent starts.

   Use the following steps to configure `msp1`:

   1. On the navigation pane, select **Servers**, select **Server Types**, and then select **WebSphere application servers**.
   1. Select the hyperlink for application server `msp1`.
   1. In the **Server Infrastructure** section, select **Java and process management**.
   1. Select **Monitoring policy**.
   1. Ensure that **Automatic restart** is selected, and then select **RUNNING** as the node restart state. Select **OK**.

      :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-application-automatic-restart.png" alt-text="Screenshot of the IBM Console that shows configuration of a monitoring policy." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-application-automatic-restart.png":::

   1. Go back to the **Middleware services** pane. On the **Messages** panel, select the **Review** link, and then select **Synchronize changes with Nodes**. Select **Save** to save and synchronize changes.
   1. The following message appears: `The configuration synchronization complete for cell.` Select **OK** to exit the configuration.

   Use the following steps to configure `msp2`:

   1. On the navigation pane, select **Servers**, select **Server Types**, and then select **WebSphere application servers**.
   1. Select the hyperlink for application server `msp2`.
   1. In the **Server Infrastructure** section, select **Java and process management**.
   1. Select **Monitoring policy**.
   1. Ensure that **Automatic restart** is selected, and then select **RUNNING** as the node restart state. Select **OK**.
   1. Go back to the **Middleware services** pane. On the **Messages** panel, select the **Review** link, and then select **Synchronize changes with Nodes**. Select **Save** to save and synchronize changes.
   1. The following message appears: `The configuration synchronization complete for cell.` Select **OK** to exit the configuration.

You configured `cluster1` with two managed servers, `msp1` and `msp2`. The cluster is up and running.

## Deploy an application

Use the following steps to deploy the application:

1. In the administrative console where you signed in earlier, select **Applications** > **New Application**, and then select **New Enterprise Application**.

1. On the next panel, select **Remote file system**, and then select **Browse** to browse through the file systems of your installed servers.

1. Select the system that begins with **adminvm**. The VM's file system appears. From there, select **V9** (or **V85**), and then select **installableApps**.

1. In the list of applications that are available to install, select **DefaultApplication.ear**. Then select **OK**.

1. You're back on the panel for selecting the application. Select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/select-test-app-page.png" alt-text="Screenshot of the IBM WebSphere dialog for specifying a module to upload and install.":::

1. Select **Next** for all the remaining steps in the **Install New Application** workflow. Then select **Finish**.

1. The following message should appear: `Application DefaultApplication.ear installed successfully.` If this message doesn't appear, troubleshoot and resolve the problem before continuing.

1. Select the **Save directly to the master configuration** link.

1. You need to start the application. Go to **Applications** > **All Applications**. Select the **DefaultApplication.ear** checkbox, ensure that **Action** is set to **Start**, and then select **Submit Action**.

1. In the **All Applications** table, in the **Status** column, select the refresh icon. After a few times refreshing the table in this way, a green arrow should appear in the **Status** column for **DefaultApplication.ear**.

The application is now installed in your WAS cluster.

## Expose WAS by using Azure Application Gateway

Now that you finished creating the WAS cluster on GNU/Linux virtual machines, this section walks you through the process of exposing WAS to the internet by using Azure Application Gateway.

### Create the application gateway

Use the following steps to create the application gateway:

1. To expose WAS to the internet, you need a public IP address. In the shell with the Azure CLI installed, create the IP address by using [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create), as shown in the following example:

   ### [Bash](#tab/in-bash)

   ```bash
   az network public-ip create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAGPublicIPAddress \
       --allocation-method Static \
       --sku Standard

   export APPGATEWAY_IP=$(az network public-ip show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAGPublicIPAddress \
       --query '[ipAddress]' \
       --output tsv)
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network public-ip create `
       --resource-group $Env:RESOURCE_GROUP_NAME `
       --name myAGPublicIPAddress `
       --allocation-method Static  `
       --sku Standard

   $Env:APPGATEWAY_IP=$(az network public-ip show  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAGPublicIPAddress `
       --query '[ipAddress]' `
       --output tsv)
   ```

1. Create the application gateway to associate with the IP address. The following example creates an application gateway with the WebSphere managed servers in the default back-end pool:

   ### [Bash](#tab/in-bash)

   ```bash
   az network application-gateway create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAppGateway \
       --public-ip-address myAGPublicIPAddress \
       --location eastus \
       --capacity 2 \
       --http-settings-port 80 \
       --http-settings-protocol Http \
       --frontend-port 80 \
       --sku Standard_V2 \
       --subnet wasGateway \
       --vnet-name myVNet \
       --priority 1001 \
       --servers ${MSPVM1_IP} ${MSPVM2_IP}
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network application-gateway create  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --name myAppGateway `
       --public-ip-address myAGPublicIPAddress `
       --location eastus `
       --capacity 2 `
       --http-settings-port 80 `
       --http-settings-protocol Http `
       --frontend-port 80 `
       --sku Standard_V2 `
       --subnet wasGateway `
       --vnet-name myVNet `
       --priority 1001 `
       --servers $Env:MSPVM1_IP $Env:MSPVM2_IP
   ```

1. The managed servers expose their workloads with port `9080`. Use the following commands to update `appGatewayBackendHttpSettings` by specifying back-end port `9080` and creating a probe for it:

   ### [Bash](#tab/in-bash)

   ```bash
   az network application-gateway probe create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --name clusterProbe \
       --protocol http \
       --host-name-from-http-settings true \
       --match-status-codes 404 \
       --path "/"

   az network application-gateway http-settings update \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --name appGatewayBackendHttpSettings \
       --host-name-from-backend-pool true \
       --port 9080 \
       --probe clusterProbe
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az network application-gateway probe create  `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway  `
       --name clusterProbe `
       --protocol http `
       --host-name-from-http-settings true `
       --match-status-codes 404 `
       --path "/"

   az network application-gateway http-settings update `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --name appGatewayBackendHttpSettings `
       --host-name-from-backend-pool true `
       --port 9080 `
       --probe clusterProbe
   ```

1. Use the following commands to provision a rewrite rule for redirections:

   ### [Bash](#tab/in-bash)

   ```bash
   # Create a rewrite rule set.
   az network application-gateway rewrite-rule set create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --name myRewriteRuleSet

   # Associated routing rules.
   az network application-gateway rule update \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --name rule1 \
       --rewrite-rule-set myRewriteRuleSet

   # Create a rewrite rule 1.
   az network application-gateway rewrite-rule create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --rule-set-name myRewriteRuleSet \
       --name myRewriteRule01 \
       --sequence 100 \
       --response-headers Location=http://${APPGATEWAY_IP}{http_resp_Location_2}

   # Create a rewrite rule condition.
   az network application-gateway rewrite-rule condition create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --rule-name myRewriteRule01 \
       --rule-set-name myRewriteRuleSet \
       --variable "http_resp_Location" \
       --ignore-case true \
       --negate false \
       --pattern "(https?):\/\/192.168.0.6:9080(.*)$"

   # Create a rewrite rule 2.
   az network application-gateway rewrite-rule create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --rule-set-name myRewriteRuleSet \
       --name myRewriteRule02 \
       --sequence 100 \
       --response-headers Location=http://${APPGATEWAY_IP}{http_resp_Location_2}

   # Create a rewrite rule condition.
   az network application-gateway rewrite-rule condition create \
       --resource-group $RESOURCE_GROUP_NAME \
       --gateway-name myAppGateway \
       --rule-name myRewriteRule02 \
       --rule-set-name myRewriteRuleSet \
       --variable "http_resp_Location" \
       --ignore-case true \
       --negate false \
       --pattern "(https?):\/\/192.168.0.7:9080(.*)$"
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   # Create a rewrite rule set.
   az network application-gateway rewrite-rule set create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --name myRewriteRuleSet

   # Associated routing rules.
   az network application-gateway rule update `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --name rule1 `
       --rewrite-rule-set myRewriteRuleSet

   # Create a rewrite rule 1.
   az network application-gateway rewrite-rule create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --rule-set-name myRewriteRuleSet `
       --name myRewriteRule01 `
       --sequence 100 `
       --response-headers Location="http://${Env:APPGATEWAY_IP}{http_resp_Location_2}"

   # Create a rewrite rule condition.
   az network application-gateway rewrite-rule condition create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --rule-name myRewriteRule01 `
       --rule-set-name myRewriteRuleSet `
       --variable "http_resp_Location" `
       --ignore-case true `
       --negate false `
       --pattern '"(https?):\/\/192.168.0.6:9080(.*)$"'
       # Be sure to wrap the "" in ''

   # Create a rewrite rule 2.
   az network application-gateway rewrite-rule create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --rule-set-name myRewriteRuleSet `
       --name myRewriteRule02 `
       --sequence 100 `
       --response-headers Location="http://${Env:APPGATEWAY_IP}{http_resp_Location_2}"

   # Create a rewrite rule condition.
   az network application-gateway rewrite-rule condition create `
       --resource-group $Env:RESOURCE_GROUP_NAME  `
       --gateway-name myAppGateway `
       --rule-name myRewriteRule02 `
       --rule-set-name myRewriteRuleSet `
       --variable "http_resp_Location" `
       --ignore-case true `
       --negate false `
       --pattern '"(https?):\/\/192.168.0.7:9080(.*)$"'
       # Be sure to wrap the "" in ''
   ```

You can now access the application by using the URL that the following command produces:

### [Bash](#tab/in-bash)

```bash
echo "http://${APPGATEWAY_IP}/snoop/"
```

### [PowerShell](#tab/in-powershell)

```powershell
echo "http://${Env:APPGATEWAY_IP}/snoop/"
```

---

> [!NOTE]
> This example sets up simple access to the WAS servers with HTTP. If you want secure access, configure TLS/SSL termination by following the instructions in [End-to-end TLS with Application Gateway](/azure/application-gateway/ssl-overview).
>
> This example doesn't expose the IBM console via Application Gateway. To access the IBM console, you can use the Windows machine `myWindowsVM` or assign a public IP address to `adminVM`.

If you don't want to use the jump box `myWindowsVM` to access the IBM console, but you want to expose it to a public network, use the following commands to assign a public IP address to `adminVM`:

### [Bash](#tab/in-bash)

```bash
# Create a public IP address.
az network public-ip create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myAdminVMPublicIPAddress \
    --allocation-method Static \
    --sku Standard

# Create a network security group.
az network nsg create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminnsg

# Create an inbound rule for the network security group.
az network nsg rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --nsg-name adminnsg \
    --name ALLOW_IBM_CONSOLE \
    --access Allow \
    --direction Inbound \
    --source-address-prefixes '["*"]' \
    --destination-port-ranges 9043 \
    --protocol Tcp \
    --priority 500

# Update the network adapter with the network security group.
az network nic update \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminVMVMNic \
    --network-security-group adminnsg

# Update the network adapter with the public IP address.
az network nic ip-config update \
    --resource-group $RESOURCE_GROUP_NAME \
    --name ipconfigadminVM \
    --nic-name adminVMVMNic \
    --public-ip-address myAdminVMPublicIPAddress

export ADMIN_PUBLIC_IP=$(az network public-ip show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myAdminVMPublicIPAddress \
    --query '[ipAddress]' \
    --output tsv)

echo "IBM Console public URL: https://${ADMIN_PUBLIC_IP}:9043/ibm/console/"
```

### [PowerShell](#tab/in-powershell)

```powershell
# Create a public IP address.
az network public-ip create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name myAdminVMPublicIPAddress `
    --allocation-method Static `
    --sku Standard

# Create a network security group.
az network nsg create `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --name adminnsg

# Create an inbound rule for the network security group.
az network nsg rule create `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --nsg-name adminnsg `
    --name ALLOW_IBM_CONSOLE `
    --access Allow `
    --direction Inbound `
    --source-address-prefixes '["*"]' `
    --destination-port-ranges 9043 `
    --protocol Tcp `
    --priority 500

# Update the network adapter with the network security group.
az network nic update `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --name adminVMVMNic `
    --network-security-group adminnsg

# Update the network adapter with the public IP address.
az network nic ip-config update `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name ipconfigadminVM `
    --nic-name adminVMVMNic `
    --public-ip-address myAdminVMPublicIPAddress

$Env:ADMIN_PUBLIC_IP=$(az network public-ip show `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --name myAdminVMPublicIPAddress `
    --query '[ipAddress]' `
    --output tsv)

echo "IBM Console public URL: https://${Env:ADMIN_PUBLIC_IP}:9043/ibm/console/"
```

---

## Test the WAS cluster configuration

You finished configuring the WAS cluster and deploying the Java EE application to it. Use the following steps to access the application to validate all the settings:

1. Open a web browser.
1. Go to the application by using the URL `http://<gateway-public-ip-address>/snoop/`.
1. When you continually refresh the browser, the app cycles through the server instances. Look at the value of the **Host** request header and note that it changes after reloading several times.

## Clean up resources

You completed the WAS cluster configuration. The following sections describe how to remove the resources that you created.

### Clean up the Windows machine

You can remove the Windows machine `myWindowsVM` by using the following commands. Alternatively, you could shut down the Windows machine and continue to use it as a jump box for ongoing cluster maintenance tasks.

[!INCLUDE [clean-up-windows-xserver-machine](includes/clean-up-windows-xserver-machine.md)]

### Clean up all the resources

Delete `abc1110rg` by using the following command:

### [Bash](#tab/in-bash)

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

### [PowerShell](#tab/in-powershell)

```powershell
az group delete --name $Env:RESOURCE_GROUP_NAME --yes --no-wait
```

---

## Next steps

Continue to explore options to run WebSphere products on Azure.

> [!div class="nextstepaction"]
> [Learn more about the IBM WebSphere family of products on Azure](../ee/websphere-family.md)
