---
title: "Tutorial: Manually install IBM WebSphere Application Server Network Deployment traditional on Azure Virtual Machines"
description: Provides step-by-step guidance to install IBM WebSphere Application Server on Azure VMs and form a cluster and expose it with Azure Application Gateway.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 04/27/2023
recommendations: false
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-was, devx-track-javaee-websphere, migration-java
---

# Tutorial: Manually install IBM WebSphere Application Server Network Deployment traditional on Azure Virtual Machines

This tutorial shows you how to install traditional IBM WebSphere Application Server (WAS) Network Deployment and configure a WAS cluster on Azure Virtual Machines (VMs) on GNU/Linux.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a custom virtual network and create the VMs within the network.
> - Install WebSphere Application Server Network Deployment traditional (V9 or V8.5) on the VMs by using the graphical interface manually.
> - Configure a WAS cluster by using the Profile Management Tool.
> - Deploy and run a Java EE application in the cluster.
> - Expose the application to the public internet via Azure Application Gateway.
> - Validate the successful configuration.

If you prefer a fully automated solution that does all of these steps on your behalf on GNU/Linux VMs, directly from the Azure portal, see [Deploy WebSphere Application Server (traditional) Cluster on Azure Virtual Machines](../ee/traditional-websphere-application-server-virtual-machines.md). A less automated, but still accelerated option is to skip the steps of installing JDK and WebSphere on the operating system by using a preconfigured Red Hat Linux base image. You can find these offers in Azure Marketplace with a [query for "WebSphere Application Server image 9.0.5.x"](https://aka.ms/was-vm-base-images).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Install Azure CLI version 2.46.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - This article provides instructions for invoking Azure CLI commands on Windows PowerShell or UNIX Bash, but either way, you must install Azure CLI.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- You must have an IBMid. If you don't have one, create an IBM account at [Log in to IBM](https://myibm.ibm.com/dashboard/) and select **Create an IBMid**. Make note of your IBMid password and email.
   - If you plan to use Version 8.5.5 of IBM WebSphere Application Server Network deployment, this IBMid must be entitled to use that version of the software. To learn about entitlements, ask the primary or secondary contacts for your IBM Passport Advantage site to grant you access or follow steps at [IBM eCustomer Care](https://ibm.biz/IBMidEntitlement). 

## Prepare the environment

In this section, you set up the infrastructure within which you install IBM Installation Manager and WebSphere Application Server Network Deployment traditional.

### Assumptions

This tutorial configures a WAS cluster with a deployment manager and two managed servers on a total of three VMs. To configure the cluster, you need to create the following three Azure VMs within the same availability set:

- The admin VM (VM name `adminVM`) has the deployment manager running.
- The managed VMs (VM names `mspVM1` and `mspVM2`) have two managed servers running.

[!INCLUDE [sign-in-to-azure](includes/sign-in-to-azure.md)]

### Create a resource group

Create a resource group by using [az group create](/cli/azure/group#az-group-create). Resource group names must be globally unique within a subscription. For this reason, consider prepending some unique identifier to any names you create that must be unique. A useful technique is to use your initials followed by today's date in `mmdd` format. This example creates a resource group named `abc1110rg` in the `eastus` location:

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
> By default, the Azure CLI commands provided below follow the Bash style unless otherwise specified. 
> If you run these commands in PowerShell, ensure to declare environment parameters as indicated in the commands above.
> To break a command line into multiple lines, in PowerShell you can use the backtick character (`) at the end of each line.

The resources comprising your WebSphere Server cluster must communicate with each other, and the public internet, by using a virtual network. For a complete guide to planning your virtual network, see the Cloud Adoption Framework for Azure guide [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm). For more information, see [Azure Virtual Network frequently asked questions](/azure/virtual-network/virtual-networks-faq).

Use the following steps to create the virtual network. The example in this section creates a virtual network with address space `192.168.0.0/16` and creates a subnet used for VMs.

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
   ---
    
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
   ---

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
   ---

[!INCLUDE [create-an-availability-set](includes/create-an-availability-set.md)]


## Get or install WAS on GNU/Linux

The following sections describe the steps for getting or installing WAS on GNU/Linux. You can choose the operating system, and WAS version according to your requirements, but you should verify that they're available in the [IBM WebSphere Application Server Network Deployment documentation](https://www.ibm.com/docs/en/was-nd).

If want to use WAS V9, the instructions will use an Azure VM image that is maintained by IBM and Microsoft containing the latest supported version of the software. For the full list of WAS base images maintained by IBM and Microsoft, see [Azure Marketplace](https://aka.ms/was-vm-base-images). If you want to use WAS V8.5, the instructions will start with a base Red Hat Enterprise Linux VM and walk you through the steps of installing all of the necessary dependencies.

### [Install WAS ND V9](#tab/was-nd-v9)

IBM and Microsoft maintain a VM base image that has WAS V9 pre-installed on the recommended version of Red Hat Enterprise Linux. For details on this image, see [the Azure portal](https://aka.ms/twas-base-vm-portal). If you take this approach, the Marketplace image that you use to create the VMs is `ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2021-04-27-twas-cluster-base-image:2021-04-27-twas-cluster-base-image:latest`.

   ### [Bash](#tab/in-bash)
   ```azurecli
   export VM_URN="ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2021-04-27-twas-cluster-base-image:2021-04-27-twas-cluster-base-image:latest"
   ```
   ### [PowerShell](#tab/in-powershell)
   ```powershell
   $Env:ADMIN_OS_DISK_ID="ibm-usa-ny-armonk-hq-6275750-ibmcloud-aiops:2021-04-27-twas-cluster-base-image:2021-04-27-twas-cluster-base-image:latest"
   ```
   ---

### [Install WAS ND V85](#tab/was-nd-v85)

The Marketplace image that you use to create the VMs is `RedHat:rhel-raw:86-gen2:latest`.

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
> If you use a different image, you may need to install extra libraries to enable the infrastructure used in this guide.

   ### [Bash](#tab/in-bash)
   ```azurecli
   export VM_URN="RedHat:rhel-raw:86-gen2:latest"
   ```
   ### [PowerShell](#tab/in-powershell)
   ```powershell
   $Env:VM_URN="RedHat:rhel-raw:86-gen2:latest"
   ```
   ---

---

### Create a Red Hat Enterprise Linux machine

Next, use the following steps to create a basic VM, ensure all the required tools are installed on it on it, take snapshot of its disk, and then create replicas based on the snapshot:

1. Create a VM by using [az vm create](/cli/azure/vm). You run the deployment manager on this VM.

   The following example creates a Red Hat Enterprise Linux machine by using a user name and password pair for the authentication. If desired, you can use TLS/SSL authentication instead.

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
    # For `public-ip-address`` and `nsg`, ensure to wrap the value "" in '' in PowerShell.
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
    ---

1. Create and attach a new disk for WAS files by using the following command:

    ### [Bash](#tab/in-bash)
    ```bash
    az vm disk attach \
          --resource-group $RESOURCE_GROUP_NAME \
          --vm-name adminVM \
          --name adminVM_Data_Disk_1 \
          --new \
          --size-gb 100 \
          --sku StandardSSD_LRS
    ```
    ### [PowerShell](#tab/in-powershell)
        
    ```powershell
    az vm disk attach `
          --resource-group $Env:RESOURCE_GROUP_NAME `
          --vm-name adminVM `
          --name adminVM_Data_Disk_1 `
          --new `
          --size-gb 100 `
          --sku StandardSSD_LRS
    ```
    
    ---

### Create Windows VM and set up X-server

This tutorial uses the graphical interface of WAS to complete the installation and configuration. You use a Windows VM as a *jump box* and run an [X Windows System server](https://sourceforge.net/projects/vcxsrv/) to view the graphical installers on the three VMs of the WAS cluster.

Use the following steps to provision a Windows 10 machine and install an X-server. If you already have a Windows machine within the same network as the Red Hat Enterprise Linux machine, you don't need to provision a new one from Azure. You can jump to the section that installs the X-server.

[!INCLUDE [create-windows-vm-and-set-up-xserver](includes/create-windows-vm-and-set-up-xserver.md)]

You're now ready to connect to the Red Hat Enterprise Linux machine and install the required tools with the graphical interface. The following sections guide you to install IBM Installation Manager and WebSphere Application Server Network Deployment traditional. You use `myWindowsVM` for the installation and configuration.

### Install dependencies

Use the following steps to install the required dependencies to allow connection from X-server and enable graphical installation:

1. Use the following steps to get the private IP address of `adminVM`:

   1. From the Azure portal, select the resource group `abc1110rg`.
   1. In the list of resources, select `adminVM`.
   1. On the overview pane, select **Properties**.
   1. In the **Networking**, copy the value of **Private IP address**. In this example, the value is `192.168.0.4`.

1. Open a command prompt from `myWindowsVM`, then SSH into `adminVM` by using `ssh`, as shown in the following example:

   ```cmd
   set ADMINVM_IP="192.168.0.4"
   ssh azureuser@%ADMINVM_IP%
   ```

1. Input the password *Secret123456*.

1. Use the following command to switch to the `root` user. This tutorial installs all the tools with the `root` user.

   ```bash
   sudo su -
   ```

   You've now signed in using the `root` user.

1. Use the following commands to install dependencies:

   ```bash
   # dependencies for XServer access
   yum install -y libXtst libSM libXrender
   
   # dependencies for GUI installation
   yum install -y gtk2 gtk3 libXtst xorg-x11-fonts-Type1 mesa-libGL
   ```

Later, you continue to mount the data disk on `adminVM`, so keep this terminal open.

### Mount the data disk

You store all the installation files and configurations to the data disk. Use the following steps to mount the disk. Run the commands as the `root` user. If you aren't working with `root`, run `sudo su -` to switch users.

1. Use the following command to check for the last created disk device that you format for holding WAS files:

   ```bash
   ls -alt /dev/sd*|head -1
   ```

   The output is similar to the following example:

   ```output
   brw-rw----. 1 root disk 8, 32 Jan 28 09:04 /dev/sdc
   ```

1. Use the following steps to format the device. As the `root` user, run `parted` on the device.

   1. Use the following command to create a primary partition spanning the whole disk:

      ```bash
      parted /dev/sdc --script mklabel gpt mkpart xfspart xfs 0% 100%
      ```

   1. Use the following commands to check the device details by printing its metadata:

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

1. Use the following commands to create a filesystem on the device partition:

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
   export WAS_ND_INSTALL_DIRECTORY=/datadrive/IBM/WebSphere/ND/V9
   # export WAS_ND_INSTALL_DIRECTORY=/datadrive/IBM/WebSphere/ND/V85
   export IM_SHARED_DIRECTORY=/datadrive/IBM/IMShared
   mkdir -p ${IM_INSTALL_DIRECTORY}
   mkdir -p ${WAS_ND_INSTALL_DIRECTORY}
   mkdir -p ${IM_SHARED_DIRECTORY}
   ```

Later, you continue to install IBM Installation Manager on `adminVM`, so keep this terminal open.

### Download and install IBM Installation Manager

Use the following steps to download and install IBM Installation Manager by using the X-server on `myWindowsVM`:

1. Download IBM Installation Manager by using the `curl` command, as shown in the following example. Save the installer file to */datadrive/tmp*, then unzip the file to */datadrive/installer*.

   ```bash
   mkdir /datadrive/tmp
   cd /datadrive/tmp
   curl -LO https://public.dhe.ibm.com/ibmdl/export/pub/software/im/zips/agent.installer.linux.gtk.x86_64.zip
   unzip -o agent.installer.linux.gtk.x86_64.zip -d /datadrive/installer
   ```

1. Before launching the installer, set the `DISPLAY` variable, as shown in the following example. This variable allows the graphical installer to run on the Red Hat Linux VM, but display on `myWindowsVM`. The value of the `DISPLAY` variable includes the private IP address of `myWindowsVM`.

   In this example, the IP address is `192.168.0.5`. Following the IP address of `myWindowsVM` is the display number. In the X Windows System, the most common display number is `:0.0`.

   ```bash
   export DISPLAY=<my-windows-VM-private-IP>:0.0
   # export DISPLAY=192.168.0.5:0.0
   ```

   You can find the IP address by using the following steps:

   1. In the Azure portal, select `myWindowsVM`.
   1. On the overview pane, under **Properties**, in the **Networking** section, find **Private IP address**.

1. Next, use the following commands to start the process of installing IBM Installation Manager:

   ```bash
   cd /datadrive/installer
   ./install
   ```

1. After a while, the installer displays, as shown in the following screenshot. If you don't see the user interface, troubleshoot the problem before proceeding. Keep the default settings.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-select-packages-to-install.png" alt-text="Screenshot of IBM Installation Manager Setup." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-select-packages-to-install.png":::

1. Select **Next**.

1. Accept the license and then select **Next**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-accept-license.png" alt-text="Screenshot of IBM Installation Manager Accept License." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-accept-license.png":::

1. Set the Installation Manager Directory to */datadrive/IBM/InstallationManager/V1.9*, as shown in the following screenshot.

   > [!NOTE]
   > Many of the steps in this guidance require you to copy values from this text and paste them directly into the installer UI. A typo in one of these values can cause the process to fail completely. We strongly recommend you open up a Notepad instance within the Windows jump box VM and use that as an intermediate place to paste values from this guidance. Then, inside the VM, do a separate copy/paste from the Notepad to the installer UI. This action minimizes the chances of a simple typo causing the guidance to fail.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-directory.png" alt-text="Screenshot of IBM Installation Manager Directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-directory.png":::

1. Select **Next** to see the summary, as shown in the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-summary.png" alt-text="Screenshot of IBM Installation Manager Summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-summary.png":::

1. Select **Install**. You're shown that the installation completed without error.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-complete.png" alt-text="Screenshot of IBM Installation Manager Installation complete." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-installation-manager-install-complete.png":::

1. Exit the installer. The IBM Installation Manager is now installed in directory */datadrive/IBM/InstallationManager/V1.9*.

Next, you continue to install WebSphere Application Server on `adminVM`, so keep this terminal open.

### Install WebSphere Application Server Network Deployment traditional

### [Install WAS ND V9](#tab/was-nd-v9)

In this section, you use the X-server on `myWindowsVM` to view the graphical installer for WebSphere Application Server Network Deployment traditional 9.0 running on `adminVM`. Use the following steps to view the installer and install the server:

1. If you aren't using the previous terminal, set the `DISPLAY` variable by running `export DISPLAY=<my-windows-vm-private-ip>:0.0`.

1. Then, use the following commands to start the process to install WAS:

   ```bash
   cd /datadrive/IBM/InstallationManager/V1.9/eclipse/
   ./IBMIM
   ```

   After a while, the installer displays, as shown in the following screenshot. If you don't see the user interface, troubleshoot the problem before proceeding.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png" alt-text="Screenshot of IBM WebSphere Application Server installation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png":::

1. Select **Install**. Because you haven't connected to a repository, the **Install Packages** pane asks you to configure a repository connection.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-install-packages.png" alt-text="Screenshot of IBM WebSphere Application Server install packages." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-install-packages.png":::

1. Select **Passport Advantage** by selecting the link. You can set your IBMid from the **Passport Advantage** pane.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport.png" alt-text="Screenshot of IBM WebSphere Application Server Passport Advantage." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport.png":::

1. Select **Connect to Passport Advantage**, select **Apply**, then select **OK**.

1. After a while, the **Password Required** pane asks you to input your IBMid. Fill in your user name and password and select **Save password**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png" alt-text="Screenshot of IBM WebSphere Application Server Password Required." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png":::

1. Select **OK**. The **Secure Storage** pane asks you to enter a password for secure storage. Select **Use master password** and fill in the same password as in the previous dialog.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-secure-password.png" alt-text="Screenshot of IBM WebSphere Application Server Secure Password." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-secure-password.png":::

1. Select **OK**. It takes a while to connect to the repository. If there's an error, you must make sure the IBMid and password are correct.

1. After the connection is complete, you're shown the **Install Packages** pane. On the **Install Packages** pane, type *network* into the text field. When the results refresh in the table, select the top level **IBM WebSphere Application Server Network Deployment** version **9.0.5.x**, as shown in the following screenshot. The exact version number is different, but it must be the latest 9.0 version shown. Be sure to select the sub-checkboxes.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-select-packages.png" alt-text="Screenshot of IBM WebSphere Application Server Install Packages selected." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-select-packages.png":::

1. Select **Next**. It takes a while to prepare the installer. You may see a message similar to **Waiting for www-147.ibm.com**.

1. If you're shown an option to install fixes, accept installing the fixes and continue.

1. Accept the license by selecting **I accept the terms in the license agreement**.

1. Select **Next**. Set **Shared Resources Directory** to */datadrive/IBM/IMShared*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-shared-directory.png" alt-text="Screenshot of IBM WebSphere Application Server Shared Resources Directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-shared-directory.png":::

1. Select **Next**. Set **Installation Directory** to */datadrive/IBM/WebSphere/ND/V9*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-directory.png" alt-text="Screenshot of IBM WebSphere Application Server Installation Directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-directory.png":::

1. Select **Next**. On the **Install Packages** pane, keep **Translations** with the default value and select **Next**. On the next pane, keep the default value of IBM SDK selected. Select **Next**. Then the **summary** pane shows.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-summary.png" alt-text="Screenshot of IBM WebSphere Application summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-summary.png":::

1. Select **Install**. The install process should complete without errors. For **Which program do you want to start?**, select **None**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-complete.png" alt-text="Screenshot of IBM WebSphere Application Server Install Complete." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-complete.png":::

1. Select **Finish**. If the **WebSphere Customization Toolbox** appears, close it. Exit the IBM Installation Manager.

1. Back in the shell from which you started the installation manager, verify the correct installation path by using the following command to test for the existence of the Profile Management Tool:

   ```bash
   ls -la /datadrive/IBM/WebSphere/ND/V9/bin/ProfileManagement/pmt.sh
   ```

   If this file doesn't exist, correct the problem before proceeding.

You've now installed WebSphere Application Server Network Deployment in directory */datadrive/IBM/WebSphere/ND/V9*.

### [Install WAS ND V85](#tab/was-nd-v85)

In this section, you use the X-server on `myWindowsVM` to view the graphical installer for WebSphere Application Server Network Deployment traditional V8.5 running on `adminVM`. Use the following steps to view the installer and install the server:

1. If you aren't using the previous terminal, set the `DISPLAY` variable by running `export DISPLAY=<my-windows-vm-private-ip>:0.0`.

1. Then, use the following commands to start the process to install WAS:

   ```bash
   cd /datadrive/IBM/InstallationManager/V1.9/eclipse/
   ./IBMIM
   ```

   After a while, the installer displays, as shown in the following screenshot. If you don't see the user interface, troubleshoot the problem before proceeding.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png" alt-text="Screenshot of IBM WebSphere Application Server installation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation.png":::

1. Select **Files** > **Preferences**. Because you haven't connected to a repository, you need to configure a repository connection.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-edit-preferences.png" alt-text="Screenshot of IBM WebSphere Application Server edit preferences." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-edit-preferences.png":::

1. In **Repositories** pane, select **Add Repository...**. Find the repository URL from [the online product repository of IBM WebSphere Application Server offerings](https://www.ibm.com/docs/en/was/8.5.5?topic=installing-online-product-repositories-websphere-application-server-offerings). For WebSphere Application Server Network Deployment V8.5, the URL should be *https://www.ibm.com/software/repositorymanager/com.ibm.websphere.ND.v85*. Fill in with the URL in the **Repository** pane, select **OK**

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-add-the-product-repository.png" alt-text="Screenshot of IBM WebSphere Application Server add the product repository." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-add-the-product-repository.png":::

1. After a while, the **Password Required** pane asks you to input your IBMid. Fill in your user name and password and select **Save password**.

> [!NOTE]
> The IBMid you use must be entitled to run WebSphere 8.5.5. If you need help obtaining this entitlement, please contact [IBM eCustomer Care](https://www-112.ibm.com/software/howtobuy/passportadvantage/homepage/ecarec).

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png" alt-text="Screenshot of IBM WebSphere Application Server Password Required." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-passport-username-password.png":::

1. Select **OK**. It takes a while to connect to the repository. If there's an error, you must make sure the IBMid and password are correct, and your IBMid has been entitled to access the product repository for IBM WebSphere Application Server Network Deployment V8.5.

1. After the connection is complete, the product repository URL is in the **Repositories** list.

    :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-the-product-repository-added.png" alt-text="Screenshot of IBM WebSphere Application Server the product repository added." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-the-product-repository-added.png":::

1. Select **OK** to close **Preferences** pane. You are back to the landing page of IBM Installation Manager.

1. Select **Install**. It takes a while to prepare the installer. You may see a message similar to **Waiting for www-147.ibm.com**.

1. Once the connection is established, the **Install Packages** pane will be displayed. Select the top level IBM WebSphere Application Server Network Deployment version 8.5.5.x, as shown in the following screenshot. The exact version number can be different, but it must be the latest 8.5.5 version shown. Be sure to select the sub-checkboxes.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation.png" alt-text="Screenshot of IBM WebSphere Application Server WAS8.5.5 installation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation.png":::

1. Select **Next**. It takes a while to prepare the installer. You may see a message similar to Waiting for www-147.ibm.com. If you are prompted to install fixes, please accept the installation of the recommended fixes and proceed.

1. Accept the license by selecting **I accept the terms in the license agreement**.

1. Select **Next**. Set **Shared Resources Directory** to */datadrive/IBM/IMShared*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-shared-resources-directory.png" alt-text="Screenshot of IBM WebSphere Application Server Shared Resources Directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-shared-resources-directory.png":::

1. Select **Next**. Set **Installation Directory** to */datadrive/IBM/WebSphere/ND/V85*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-directory.png" alt-text="Screenshot of IBM WebSphere Application Server Installation Directory." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-directory.png":::

1. Select **Next**. On the **Install Packages** pane, keep **Translations** with the default value and select **Next**. On the next pane, keep the default value of IBM JDK selected. Select **Next**. Then the **summary** pane shows.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-summary.png" alt-text="Screenshot of IBM WebSphere Application summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-summary.png":::

1. Select **Install**. The install process should complete without errors. For **Which program do you want to start?**, select **None**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-complete.png" alt-text="Screenshot of IBM WebSphere Application Server Install Complete." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-application-server-installation-was855-installation-complete.png":::

1. Select **Finish**. If the **WebSphere Customization Toolbox** appears, close it. Exit the IBM Installation Manager.

1. Back in the shell from which you started the installation manager, verify the correct installation path by using the following command to test for the existence of the Profile Management Tool:

   ```bash
   ls -la /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement/pmt.sh
   ```

   If this file doesn't exist, correct the problem before proceeding.

You've now installed WebSphere Application Server Network Deployment in directory */datadrive/IBM/WebSphere/ND/V85*.

---

### Create machines for managed servers

You've now installed WebSphere Application Server Network Deployment on `adminVM`, which runs the deployment manager. You still need to prepare machines to run the two managed servers. Next, you create a snapshot from disks of `adminVM` and prepare machines for two managed severs, `mspVM1` and `mspVM2`.

This section introduces an approach to prepare machines with the snapshot of `adminVM`. Return to your terminal that has Azure CLI signed in, then use the following steps. This terminal isn't the Windows jump box.

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
    ---

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` OS disk.

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
    ---

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` data disk.

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
    ---

1. Use the following commands to query for the snapshot IDs that you use later:

    ### [Bash](#tab/in-bash)
   ```bash
    # Get the snapshot ID.
    export OS_SNAPSHOT_ID=$(az snapshot show \
       --name myAdminOSDiskSnapshot \
       --resource-group $RESOURCE_GROUP_NAME \
       --query '[id]' \
       --output tsv)
    export DATA_SNAPSHOT_ID=$(az snapshot show \
       --name myAdminDataDiskSnapshot \
       --resource-group $RESOURCE_GROUP_NAME \
       --query '[id]' \
       --output tsv)
    ```
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    # Get the snapshot ID.
    $Env:OS_SNAPSHOT_ID=$(az snapshot show `
        --name myAdminOSDiskSnapshot `
        --resource-group $Env:RESOURCE_GROUP_NAME  `
        --query '[id]' `
        --output tsv)
    $Env:DATA_SNAPSHOT_ID=$(az snapshot show  `
        --name myAdminDataDiskSnapshot `
        --resource-group $Env:RESOURCE_GROUP_NAME  `
        --query '[id]' `
        --output tsv)
    ```
    ---

Next, create `mspVM1` and `mspVM2`.

### [Create mspVM1](#tab/mspVM1)
Use the following steps to create `mspVM1`:

1. First, create an OS disk for `mspVM1` by using [az disk create](/cli/azure/disk#az-disk-create):

    ### [Bash](#tab/in-bash)
   ```bash
    # Create a new Managed Disk by using the OS snapshot ID.
    # Note that the managed disk is created in the same location as the snapshot.
    az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_OsDisk_1 \
       --source $OS_SNAPSHOT_ID
    ```
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    # Create a new Managed Disk by using the OS snapshot ID.
    # Note that the managed disk is created in the same location as the snapshot.
    az disk create `
        --resource-group $Env:RESOURCE_GROUP_NAME  `
        --name mspVM1_OsDisk_1 `
        --source $Env:OS_SNAPSHOT_ID
    ```
    ---

1. Next, use the following commands to create the VM `mspVM1`, attaching OS disk `mspVM1_OsDisk_1`:

    ### [Bash](#tab/in-bash)
   ```bash
    # Get the resource ID of the managed disk.
    export MSPVM1_OS_DISK_ID=$(az disk show \
       --name mspVM1_OsDisk_1 \
       --resource-group $RESOURCE_GROUP_NAME \
       --query '[id]' \
       --output tsv)

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
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    # Get the resource ID of the managed disk.
    $Env:MSPVM1_OS_DISK_ID=$(az disk show `
        --name mspVM1_OsDisk_1 `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --query '[id]' `
        --output tsv)

    # Create the VM by attaching the existing managed disk as an OS.
    # For `public-ip-address`` and `nsg`, ensure to wrap the value "" in '' in PowerShell.
    az vm create `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name mspVM1 `
        --attach-os-disk $Env:MSPVM1_OS_DISK_ID `
        --os-type linux `
        --availability-set myAvailabilitySet `
        --public-ip-address '""' `
        --nsg '""'
    ```
    ---

1. Next, create a managed disk from the data snapshot and attach to `mspVM1`.

    ### [Bash](#tab/in-bash)
    ```bash
    az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM1_Data_Disk_1 \
       --source $DATA_SNAPSHOT_ID

    export MSPVM1_DATA_DISK_ID=$(az disk show \
       --name mspVM1_Data_Disk_1 \
       --resource-group $RESOURCE_GROUP_NAME \
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
        --name mspVM1_Data_Disk_1 `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --query '[id]' `
        --output tsv)

    az vm disk attach `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --vm-name mspVM1 `
        --name $Env:MSPVM1_DATA_DISK_ID
    ```
    ---

1. You've now created `mspVM1` with WAS installed. Because the VM was created from a snapshot of the `adminVM` disks, the two VMs have the same hostname. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the hostname to the value `mspVM1`:

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

   When the command completes successfully, you're shown output similar to the following example:

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

### [Create mspVM2](#tab/mspVM2)

Use the following steps to create `mspVM2`:

1. First, create an OS disk for `mspVM2` by using [az disk create](/cli/azure/disk#az-disk-create):

    ### [Bash](#tab/in-bash)
   ```bash
    # Create a new Managed Disk by using the OS snapshot ID.
    # Note that the managed disk is created in the same location as the snapshot.
    az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_OsDisk_1 \
       --source $OS_SNAPSHOT_ID
    ```
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    # Create a new Managed Disk by using the OS snapshot ID.
    # Note that the managed disk is created in the same location as the snapshot.
    az disk create `
        --resource-group $Env:RESOURCE_GROUP_NAME  `
        --name mspVM2_OsDisk_1 `
        --source $Env:OS_SNAPSHOT_ID
    ```
    ---

1. Next, use the following commands to create the VM `mspVM2`, attaching OS disk `mspVM2_OsDisk_1`:

    ### [Bash](#tab/in-bash)
    ```bash
    # Get the resource ID of the managed disk.
    export MSPVM2_OS_DISK_ID=$(az disk show \
       --name mspVM2_OsDisk_1 \
       --resource-group $RESOURCE_GROUP_NAME \
       --query '[id]' \
       --output tsv)

    # Create the VM by attaching the existing managed disk as an OS.
    az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --attach-os-disk $MSPVM2_OS_DISK_ID \
       --os-type linux \
       --availability-set myAvailabilitySet \
       --public-ip-address "" \
       --nsg ""
    ```
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    # Get the resource ID of the managed disk.
    $Env:MSPVM2_OS_DISK_ID=$(az disk show `
        --name mspVM2_OsDisk_1 `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --query '[id]' `
        --output tsv)

    # Create the VM by attaching the existing managed disk as an OS.
    # For `public-ip-address`` and `nsg`, ensure to wrap the value "" in '' in PowerShell.
    az vm create `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name mspVM2 `
        --attach-os-disk $Env:MSPVM2_OS_DISK_ID `
        --os-type linux `
        --availability-set myAvailabilitySet `
        --public-ip-address '""' `
        --nsg '""' 
        
    ```
    ---
    

1. Next, create a managed disk from the data snapshot and attach to `mspVM2`.

    ### [Bash](#tab/in-bash)
    ```bash
    az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_Data_Disk_1 \
       --source $DATA_SNAPSHOT_ID

    export MSPVM2_DATA_DISK_ID=$(az disk show \
       --name mspVM2_Data_Disk_1 \
       --resource-group $RESOURCE_GROUP_NAME \
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
        --name mspVM2_Data_Disk_1 `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --query '[id]' `
        --output tsv)

    az vm disk attach `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --vm-name mspVM2 `
        --name $Env:MSPVM2_DATA_DISK_ID
    ```
    ---

1. You've now created `mspVM2` with WAS installed. Because the VM was created from a snapshot of the `adminVM` disks, the two VMs have the same hostname. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the hostname to the value `mspVM2`:

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

   When the command completes successfully, you're shown output similar to the following example:

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
---
 
Make sure you've completed the previous steps for both `mspVM1` and `mspVM2`. Then, use the following steps to finish preparing the machines:

1. To continue, use the [az vm start](/cli/azure/vm#az-vm-start) command to start `adminVM`, as shown in the following example:

    ### [Bash](#tab/in-bash)
    ```bash
    az vm start --resource-group $RESOURCE_GROUP_NAME --name adminVM
    ```
    ### [PowerShell](#tab/in-powershell)        
    ```powershell
    az vm start --resource-group $Env:RESOURCE_GROUP_NAME --name adminVM
    ```
    ---

1. Use the following commands to get and show the private IP addresses, which you use in later sections:

    ### [Bash](#tab/in-bash)
    ```bash
    export ADMINVM_NIC_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --query networkProfile.networkInterfaces'[0]'.id \
       --output tsv)
    export ADMINVM_IP=$(az network nic show \
       --ids $ADMINVM_NIC_ID 
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
       --name mspVM2 --query networkProfile.networkInterfaces'[0]'.id \
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
        --name mspVM2 --query networkProfile.networkInterfaces'[0]'.id `
        --output tsv)
    $Env:MSPVM2_IP=$(az network nic show `
        --ids $Env:MSPVM2_NIC_ID `
        --query ipConfigurations'[0]'.privateIPAddress `
        --output tsv)
    echo "Private IP of adminVM: $Env:ADMINVM_IP"
    echo "Private IP of mspVM1: $Env:MSPVM1_IP"
    echo "Private IP of mspVM2: $Env:MSPVM2_IP"
    ```
    ---   

Now, all three machines are ready. Next, you configure a WAS cluster.

## Create WAS profiles and a cluster

This section shows you how to create and configure a WAS cluster. When it comes to creating WAS profiles and a cluster, there is no significant difference between the 9.x series and the 8.5.x series. All the screenshots in this section have been captured using V9 as the basis.

### Configure a deployment manager profile

In this section, you use the X-server on `myWindowsVM` to create a management profile for the deployment manager to administer servers within the deployment manager cell by using the Profile Management Tool. For more information about profiles, see [Profile concepts](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=mpdios-profile-concepts). For more information about creating the deployment manager profile, see [Creating management profiles with deployment managers](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=interface-creating-management-profiles-deployment-managers).

Use the following steps to create and configure the management profile:

1. Make sure you're still on your Windows machine. If you aren't, use the following commands to remote connect to `myWindowsVM`, then connect to `adminVM` from a command prompt:

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

1. Use the following commands to start Profile Management Tool:

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V9/bin/ProfileManagement
   # cd /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement
   ./pmt.sh
   ```

   After a while, the Profile Management Tool displays, as shown in the following screenshot. If you don't see the user interface, check behind the command prompt.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool.png" alt-text="Screenshot of IBM Profile Management Tool." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool.png":::

1. Select **Create**. On the **Environment Selection** pane, select **Management**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile.png" alt-text="Screenshot of IBM Profile Management Tool, Environment Selection, Management." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile.png":::

1. Select **Next**. On the **Server Type Selection** pane, select **Deployment Manager**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-deployment-manager.png" alt-text="Screenshot of IBM Profile Management Tool, Server Type Selection, Deployment Manager." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-deployment-manager.png":::

1. Select **Next**. On the **Profile Creation Options** pane, select **Advanced profile creation**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-options-advanced.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Creation Options, Advanced profile creation." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-options-advanced.png":::

1. Select **Next**. On the **Optional Application Deployment** pane, ensure that **Deploy the administrative console (recommended).** is selected.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-deploy-console.png" alt-text="Screenshot of IBM Profile Management Tool, Optional Application Deployment, Deploy the administrative console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-deploy-console.png":::

1. Select **Next**. On the **Profile Name and Location** pane, enter your profile name and location. In this example, the profile name is `Dmgr01`, and the location is */datadrive/IBM/WebSphere/ND/V9/profiles/Dmgr01*. Or if you've installed WAS V8.5, the location is */datadrive/IBM/WebSphere/ND/V85/profiles/Dmgr01*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-profilename-location.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Name and Location." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-profilename-location.png":::

1. Select **Next**. On the **Node, Host, and Cell Names** pane, enter your node name, host name, and cell name. The host is the private IP address of `adminVM`. In this example, the host value is `192.168.0.4`, the node name is `adminvmCellManager01`, and the cell name is `adminvmCell01`.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-node-host-cell.png" alt-text="Screenshot of IBM Profile Management Tool, Node, Host, and Cell Name." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-node-host-cell.png":::

1. Select **Next**. On the **Administrative Security** pane, enter your admin user name and password. In this example, the user name is `websphere`, and the password is `Secret123456`. Note down the user name and password so you can use it to sign in to the IBM console.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-admin-security.png" alt-text="Screenshot of IBM Profile Management Tool, Administrative Security." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-admin-security.png":::

1. Select **Next**. For the security certificate (part 1), input your certificate if you have one. This example uses the default self-signed certificate.

1. Select **Next**. For the security certificate (part 2), input your certificate if you have one. This example uses the default self-signed certificate.

1. Select **Next**. On the **Port Values Assignment**, keep the default ports.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-ports.png" alt-text="Screenshot of IBM Profile Management Tool, Port Values Assignment." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-advanced-ports.png":::

1. Select **Next**. On the **Linux Service Definition** pane, don't select **Run the deployment manager process as a Linux service.**. Later, you create the Linux service.

1. Select **Next**. You're shown the **Profile Creation Summary**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile-summary.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Creation Summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-tool-management-profile-summary.png":::

1. Select **Create**. It takes a while to finish the profile creation. After the profile finishes, you see the **Profile Creation Complete** pane, as shown in the following screenshot. Select **Launch the First steps console**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-profile-complete.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Complete." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-profile-complete.png":::

1. Select **Finish**. The **First steps** console shows. Select **Installation verification**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps.png" alt-text="Screenshot of IBM Profile Management Tool, First steps console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps.png":::

   The verification process starts and you're shown output similar to the following screenshot. If there are errors, you must resolve them before moving on.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps-output.png" alt-text="Screenshot of IBM Profile Management Tool, First steps console, Output." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-management-first-steps-output.png":::

1. Now, the deployment manager process starts. You can exit the **First Steps Console** by closing the output pane and selecting **Exit** in the **First Steps Console**.

   You've now finished the profile creation. You can close the WebSphere Customization ToolBox.

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

1. To start the deployment manager automatically at boot, create a Linux service for the process. Run the following commands to create a Linux service:

### [WAS ND V9](#tab/was-nd-v9-service)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V9/profiles/Dmgr01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service.
   ${PROFILE_PATH}/bin/wasservice.sh -add adminvmCellManager01 -servername dmgr -profilePath ${PROFILE_PATH}
   ```
   
### [WAS ND V85](#tab/was-nd-v85-service)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V85/profiles/Dmgr01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service.
   ${PROFILE_PATH}/bin/wasservice.sh -add adminvmCellManager01 -servername dmgr -profilePath ${PROFILE_PATH}
   ```

---

You must see the following output before continuing:

```bash
CWSFU0013I: Service [adminvmCellManager01] added successfully.
```

If you don't see this output, troubleshoot and resolve the problem before continuing.

The deployment manager is running on `adminVM`. From the jump box Windows VM, you can access IBM console at the URL `http://<admin-vm-private-ip>:9060/ibm/console/`.

### Configure custom profiles

In this section, you use the X-server on `myWindowsVM` to create custom profiles for managed servers.

Make sure you're still on your Windows machine. If you're not, remote connect to `myWindowsVM`.

Then, configure custom profiles on `mspVM1` and `mspVM2`.

#### Configure the custom profile for mspVM1

Use the following steps to configure a custom profile on `mspVM1`:

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

1. Use the following commands to start Profile Management Tool:

### [WAS ND V9](#tab/was-nd-v9-pmt)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V9/bin/ProfileManagement
   ./pmt.sh
   ```

### [WAS ND V85](#tab/was-nd-v85-pmt)

   ```bash
   cd /datadrive/IBM/WebSphere/ND/V85/bin/ProfileManagement
   ./pmt.sh
   ```
---

After a while, the Profile Management Tool displays. If you don't see the user interface, troubleshoot and resolve the problem before continuing.

1. Select **Create**. On the **Environment Selection** pane, select **Custom profile**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile.png" alt-text="Screenshot of IBM Profile Management Tool, Custom profile 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile.png":::

1. Select **Next**. On the **Profile Creation Options** pane, select **Advanced profile creation**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-advanced-creation-1.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Creation Options, Advanced profile creation 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-advanced-creation-1.png":::

1. Select **Next**. On the **Profile Name and Location** pane, enter your profile name and location. In this example, the profile name is `Custom01`, and the location is */datadrive/IBM/WebSphere/ND/V9/profiles/Custom01*. Or if you've installed WAS V8.5, the location is */datadrive/IBM/WebSphere/ND/V85/profiles/Custom01*.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-name-location.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Name and Location 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-name-location.png":::

1. Select **Next**. On the **Node and Host Names** pane, enter your node name and host. The value of host is the private IP address of `mspVM1`. In this example, the host is `192.168.0.6` and the node name is `mspvm1Node01`.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-node-host-name.png" alt-text="Screenshot of IBM Profile Management Tool, Node and Host Names 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-node-host-name.png":::

1. Select **Next**. On the **Federation** pane, enter the deployment manager hostname and authentication. For **Deployment manager host name or IP address**, the value is the private IP address of `adminVM`, which is `192.168.0.4` here. For the **Deployment manager authentication**, in this example, the user name is `websphere`, and the password is `Secret123456`.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-deployment-manager.png" alt-text="Screenshot of IBM Profile Management Tool, Federation 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-deployment-manager.png":::

1. Select **Next**. For the security certificate (part 1), input your certificate if you have one. This example uses the default self-signed certificate.

1. Select **Next**. For the security certificate (part 2), input your certificate if you have one. This example uses the default self-signed certificate.

1. Select **Next**. On the **Port Values Assignment**, keep the default ports.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-ports.png" alt-text="Screenshot of IBM Profile Management Tool, Port Values Assignment 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-ports.png":::

1. Select **Next**. You're shown the **Profile Creation Summary**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-summary.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Creation Summary 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-summary.png":::

1. Select **Create**. It takes a while to create the custom profile. On the **Profile Creation Complete** pane, unselect **Launch the First steps console**.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-complete.png" alt-text="Screenshot of IBM Profile Management Tool, Profile Creation Complete 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-profiles-custom-profile-complete.png":::

1. Select **Finish** to exit profile creation and close Profiles Management Tool.

1. To start the server automatically at boot, create a Linux service for the process. The following commands create a Linux service to start `nodeagent`:

### [WAS ND V9](#tab/was-nd-v9-service-vm1)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V9/profiles/Custom01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service to start nodeagent.
   ${PROFILE_PATH}/bin/wasservice.sh -add mspvm1Node01 -servername nodeagent -profilePath ${PROFILE_PATH}
   ```

### [WAS ND V85](#tab/was-nd-v85-service-vm1)

   ```bash
   export PROFILE_PATH=/datadrive/IBM/WebSphere/ND/V85/profiles/Custom01

   # Configure SELinux so systemctl has access on server start/stop script files.
   semanage fcontext -a -t bin_t "${PROFILE_PATH}/bin(/.*)?"
   restorecon -r -v ${PROFILE_PATH}/bin

   # Add service to start nodeagent.
   ${PROFILE_PATH}/bin/wasservice.sh -add mspvm1Node01 -servername nodeagent -profilePath ${PROFILE_PATH}
   ```
---


You must see the following output before continuing:

```bash
CWSFU0013I: Service [mspvm1Node01] added successfully.
```

If you don't see this output, troubleshoot and resolve the problem before continuing.

You've now created a custom profile and `nodeagent` running on `mspVM1`. Exit from being `root` and exit the SSH connection to `mspVM1`.

Make sure to go back to the beginning of this section, **Configure the custom profile for mspVM1** and do the same steps again for mspVM2. That is, wherever you used mspVM1 or similar, do the same, but for mspVM2.

You've now prepared the custom profile for two managed servers - `mspVM1` and `mspVM2`. Continue ahead to create a WAS cluster.

### Create a cluster and start servers

In this section, you use the IBM console to create a WAS cluster and start managed servers by using the browser on `myWindowsVM`. Make sure you're still on your Windows machine. If you aren't, remote connect to `myWindowsVM`. Then, use the following steps:

1. Open the Microsoft Edge browser and navigate to `http://<adminvm-private-ip>:9060/ibm/console/`. In this example, the IBM console URL is `http://192.168.0.4:9060/ibm/console/`. Find the sign-in pane, then enter your administrative user name and password (`websphere/Secret123456`) to sign in to the IBM console. You're now able to administer clusters and servers.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-portal-overview.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-portal-overview.png":::

1. In navigation pane, select **Servers**, **Clusters**, **WebSphere application server clusters**. Select **New** to create a new cluster.

1. For **Create a new cluster** > **Step 1: Enter basic cluster information**, enter your cluster name. In this example, the cluster name is `cluster1`.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-new-cluster.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, New Cluster." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-new-cluster.png":::

   Select **Next** to continue.

1. For **Create a new cluster** > **Step 2: Create first cluster member**, enter your member name, and select node `mspvm1Node01`. In this example, the member name is `msp1` and the node is `mspvm1Node01 (ND 9.0.5.12)`. For V8.5, the node is `mspvm1Node01 (ND 8.5.5.24)` or similar.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp1.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Member 1." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp1.png":::

   Select **Next** to continue.

1. For **Create a new cluster** > **Step 3: Create more cluster members**, enter your second member name, and select node `mspvm2Node01`. In this example, the member name is `msp2` and the node is `mspvm2Node01 (ND 9.0.5.12)`. For V8.5, the node is `mspvm2Node01 (ND 8.5.5.24)` or similar.

1. Select **Add Member** to add the second node. There are two members listed in the table, as shown in the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp2.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Member 2." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-member-msp2.png":::

1. Select **Next** to view **Create a new cluster** > **Step 4: Summary**, as shown in the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-summary.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Summary." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-summary.png":::

1. Select **Finish** to continue. It takes a while to create the cluster. After the cluster is created, you see `cluster1` listed in the table.

1. Select **cluster1**, and select **Review** to review the information for `cluster1`.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-review.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Review." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-review.png":::

1. Select **Synchronize changes with Nodes** and **Save** to save and synchronize changes.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-save.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Save." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-save.png":::

   The creation should complete without error, as shown in the following screenshot:

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-status.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Status." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-status.png":::

1. Select **OK** to continue.

1. Start the cluster. `cluster1` is listed in the cluster table. Select **cluster1**, then select the **Start** button.

   :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-start-cluster.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Cluster, Start." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-cluster-start-cluster.png":::

1. It takes a while to start the two managed servers. Select the refresh button in the **Status** column. This button is the two arrows pointing to each other. Selecting this button causes the status to refresh. Hover the mouse over the icon in the **Status** column. When the tooltip shows **Started**, you can trust that the cluster has been formed. Continue to periodically refresh and check until the tooltip shows **Started**.

1. Use the following steps to configure the Application Server Monitoring Policy settings to automatically start the managed server after the Node Agent starts.

   ### [Configure msp1](#tab/mspVM1)
    1. In the navigation pane, select **Servers**, select **Server Types**, and then select **WebSphere application servers**.
    1. Select the hyperlink for Application Server **msp1**.
    1. Select **Java and process management** under the **Server Infrastructure** section.
    1. Select **Monitoring policy**.
    1. Ensure that **Automatic restart** is selected and then select **RUNNING** as the Node restart state, as shown in the following screenshot.
    1. Select **Ok**. Now, go back to the **Middleware services** pane, in the **Messages** panel, select link **Review**, then select **Synchronize changes with Nodes** and **Save** to save and synchronize changes.
    1. You're shown a message saying "The configuration synchronization complete for cell."
    1. Select **OK** to exit the configuration.
    
    :::image type="content" source="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-application-automatic-restart.png" alt-text="Screenshot of IBM Profile Management Tool, IBM Console, Server, Restart." lightbox="media/migrate-websphere-to-azure-vm-manually/ibm-websphere-console-application-automatic-restart.png":::

   ### [Configure msp2](#tab/mspVM2)
    1. In the navigation pane, select **Servers**, select **Server Types**, and then select **WebSphere application servers**.
    1. Select the hyperlink for Application Server **msp2**.
    1. Select **Java and process management** under the **Server Infrastructure** section.
    1. Select **Monitoring policy**.
    1. Ensure that **Automatic restart** is selected and then select **RUNNING** as Node restart state, as shown in the following screenshot.
    1. Select **Ok**. Now, go back to the **Middleware services** pane, in the **Messages** panel, select link **Review**, then select **Synchronize changes with Nodes** and **Save** to save and synchronize changes.
    1. You're shown a message saying "The configuration synchronization complete for cell."
    1. Select **OK** to exit the configuration.

Go back to the beginning of the section and do the same steps for msp2.

   ---

You've now configured `cluster1` with two managed servers `msp1` and `msp2`, and the cluster is up and running.
    
## Deploy an application

1. On the administrative console that you signed into earlier, select **Applications > New Application** and then select **New Enterprise Application**.

2. On the next panel, select **Remote file system** and then select **Browse…**. You're given the option to browse the file systems of your installed servers.

3. Select the system that begins with **adminvm**. You're shown the VM’s file system. From there, select **V9** (or **V85**) and then **installableApps**. In that directory, you should see many applications available to install. Select **DefaultApplication.ear** and then select **OK**.

Then, you're taken back to the page for selecting the application, which should look like the following screenshot:

:::image type="content" source="media/migrate-websphere-to-azure-vm-manually/select-test-app-page.png" alt-text="Screenshot of IBM WebSphere 'Specify the EAR, WAR, JAR, or SAR module to upload and install' dialog.":::

Select **Next** and then **Next** for all the remaining steps in the **Install New Application** workflow. Then select **Finish**.

You should see a message **Application DefaultApplication.ear installed successfully**. If you do not see this message, troubleshoot and resolve the problem before continuing.

1. Select the hyperlink for **Save directly to the master configuration**.

Next, you need to start the application. Go to **Applications > All Applications**. Select the checkbox for **DefaultApplication.ear**, ensure the **Action** is set to **Start**, and then select **Submit Action**.

1. In the table of **All Applications**, in the **Status** column, select the icon that looks like two arrows pointing to each other. After a few times refreshing the table in this way, a green arrow should show in the **Status** column for **DefaultApplication.ear**.

The application is now installed in your WAS cluster. Next, you expose the application to the public internet by using Azure Application Gateway.

## Expose WAS with Azure Application Gateway

Now that you've created the WAS cluster on GNU/Linux virtual machines, this section walks you through the process of exposing WAS to the internet with Azure Application Gateway.

### Create the Azure Application Gateway

Use the following steps to create the gateway:

1. To expose WAS to the internet, a public IP address is required. Create the public IP address and then associate an Azure Application gateway with it. In the shell with Azure CLI installed, use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create), as shown in the following example.

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
   ---

1. Next, create an Azure Application Gateway. The following example creates an application gateway with the WebSphere managed servers in the default backend pool:

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
   ---

1. The managed servers expose their workloads with port `9080`. Use the following commands to update the `appGatewayBackendHttpSettings` by specifying backend port `9080` and creating a probe for it:

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
   ---

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
        # Ensure to wrap the "" in ''
 
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
        # Ensure to wrap the "" in ''
   ```
   ---

You're now able to access the application with the URL produced by the following command:
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
> This example sets up simple access to the WAS servers with HTTP. If you want secure access, configure TLS/SSL termination by follow the instructions in [End to end TLS with Application Gateway](/azure/application-gateway/ssl-overview).
>
> This example doesn't expose the IBM console via the Application Gateway. To access the IBM console, you can use the Windows machine `myWindowsVM` or assign a public IP address to `adminVM`.

If you don't want to use the jump box `myWindowsVM` to access the IBM console, but want to expose it to a public network, use the following commands to assign a public IP address to `adminVM`:

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

# Create a network security group inbound rule.
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

# Update NIC with nsg.
az network nic update \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminVMVMNic \
    --network-security-group adminnsg

# Update NIC with public IP.
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

# Create a network security group inbound rule.
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

# Update NIC with nsg.
az network nic update `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --name adminVMVMNic `
    --network-security-group adminnsg 

# Update NIC with public IP.
az network nic ip-config update --resource-group $Env:RESOURCE_GROUP_NAME  --name ipconfigadminVM --nic-name adminVMVMNic --public-ip-address myAdminVMPublicIPAddress

$Env:ADMIN_PUBLIC_IP=$(az network public-ip show `
    --resource-group $Env:RESOURCE_GROUP_NAME  `
    --name myAdminVMPublicIPAddress `
    --query '[ipAddress]' `
    --output tsv)

echo "IBM Console public URL: https://${Env:ADMIN_PUBLIC_IP}:9043/ibm/console/"
```
---

## Test the WAS cluster configuration

You've now finished configuring the WAS cluster and deploying the Java EE application to it. Use the following steps to access the application to validate all the settings:

1. Open a web browser.
1. Navigate to the application with the URL `http://<gateway-public-ip-address>/snoop/`.
1. When you continually refresh the browser, the app cycles through the server instances. Look at the value of the **Host** request header and note that it changes after reloading several times.

## Clean up resources

You've now completed the WAS cluster configuration. The following sections describe how to remove the resources you've created.

### Clean up the Windows machine

If desired, remove the Windows machine by using the following commands. Alternatively, you could shut down the Windows machine `myWindowsVM` and continue to use it as a jump box for ongoing cluster maintenance tasks.

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

Learn more about deploying IBM WebSphere family on Azure by following this link:

> [!div class="nextstepaction"]
> [What are solutions to run the IBM WebSphere family of products on Azure?](../ee/websphere-family.md)
