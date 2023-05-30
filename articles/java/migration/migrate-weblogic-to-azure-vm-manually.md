---
title: "Tutorial: Manually install Oracle WebLogic Server on Azure Virtual Machines"
description: Provides step-by-step guidance to install Oracle WebLogic Server on Azure VMs and form a cluster, expose it with Azure Application Gateway, and connect with Azure Database for PostgreSQL.
author: KarlErickson
ms.author: haiche
ms.topic: how-to
ms.date: 12/09/2022
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-vm, migration-java, devx-track-azurecli, devx-track-extended-java
---

# Tutorial: Manually install Oracle WebLogic Server on Azure Virtual Machines

This tutorial shows the steps to install Oracle WebLogic Server (WLS) and configure a WebLogic cluster on Azure Virtual Machines (VMs), on Windows or GNU/Linux.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a custom virtual network and create the VMs within the network.
> - Install the desired JDK and WLS on the VMs by using the graphical interface manually.
> - Configure a WLS domain and a WLS cluster using the Oracle Configuration Wizard.
> - Configure a PostgreSQL datasource connection in the cluster.
> - Configure JMS in the cluster.
> - Deploy and run a domain-driven Java EE application in the cluster.
> - Expose the application to the public internet via Azure Application Gateway.
> - Validate the successful configuration.

If you prefer a fully automated solution that does all of these steps on your behalf on GNU/Linux VMs, directly from the Azure portal, see [Quickstart: Deploy WebLogic Server on Azure Virtual Machine using the Azure portal](../ee/weblogic-server-azure-virtual-machine.md). A less automated, but still accelerated option is to skip the steps of installing JDK and WLS on the operating system by using a preconfigured Oracle or Red Hat Linux base image. You can find these offers in Azure Marketplace with a [query for "WebLogic base image"](https://aka.ms/wls-vm-base-images).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Install Azure CLI version 2.37.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- You must have an Oracle account. To create an Oracle account and accept the license agreement for WebLogic Server images, follow the steps in [Oracle Container Registry](https://aka.ms/wls-aks-ocr). Make note of your Oracle Account password and email.
- A Java JDK, Version 11. Azure recommends [Microsoft Build of OpenJDK](/java/openjdk/download). Ensure that your `JAVA_HOME` environment variable is set correctly in the shells in which you run the commands.
- [Git](https://git-scm.com/downloads); use `git --version` to test whether `git` works. This tutorial was tested with version 2.25.1.
- [Maven](https://maven.apache.org/download.cgi); use `mvn -version` to test whether `mvn` works. This tutorial was tested with version 3.6.3.

## Prepare the environment

In this section, you set up the infrastructure within which you install the JDK, WLS, and the PostgreSQL JDBC driver.

### Assumptions

In this tutorial, you configure a WLS cluster with an administration server and two managed servers on a total of three VMs. To configure the cluster, you need to create the following three Azure VMs within the same availability set:

- The admin VM (VM name `adminVM`) has the administration server running.
- The managed VMs (VM names `mspVM1` and `mspVM2`) have two managed servers running.

[!INCLUDE [sign-in-to-azure](includes/sign-in-to-azure.md)]

### Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). Resource group names must be globally unique within a subscription. For this reason, consider prepending some unique identifier to any names you create that must be unique. A useful technique is to use your initials followed by today's date in `mmdd` format. This example creates a resource group named `abc1110rg` in the `eastus` location:

```azurecli
az group create \
    --name abc1110rg \
    --location eastus
```

### Create a virtual network

The resources comprising your WebLogic Server cluster must communicate with each other, and the public internet, using a virtual network. For a complete guide to planning your virtual network, see the Cloud Adoption Framework for Azure guide [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm). For more information, see [Azure Virtual Network frequently asked questions](/azure/virtual-network/virtual-networks-faq).

The example in this section creates a virtual network with address space `192.168.0.0/16` and creates a subnet used for VMs.

First, create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a network named `myVNet`:

```azurecli
az network vnet create \
    --resource-group abc1110rg \
    --name myVNet \
    --address-prefixes 192.168.0.0/24
```

Create a subnet for the WLS cluster by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `mySubnet`:

```azurecli
az network vnet subnet create \
    --resource-group abc1110rg \
    --name mySubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.0.0/25
```

Create a subnet for Application Gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `wlsVMGateway`:

```azurecli
az network vnet subnet create \
    --resource-group abc1110rg \
    --name wlsVMGateway \
    --vnet-name myVNet \
    --address-prefixes 192.168.0.128/25
```

[!INCLUDE [create-an-availability-set](includes/create-an-availability-set.md)]

The following sections describe the steps for installing WLS on either GNU/Linux or Windows Server. You can choose the operating system, JDK version, and WLS version according to your requirements, but you should verify that they're available in [Oracle Fusion Middleware Supported System Configurations](https://www.oracle.com/middleware/technologies/fusion-certification.html). Also, consider system and platform-specific requirements carefully before proceeding. For more information, see [System Requirements and Specifications](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/sysrs/system-requirements-and-specifications.html#GUID-A077A2B4-5967-42E0-A063-0F7A0A2254FB). Select the tab for your chosen operating system.

#### [Oracle Linux](#tab/oracle-linux)

The Marketplace image that you use to create the VMs is `Oracle:Oracle-Linux:8:latest`.

> [!NOTE]
> You can query all the available Oracle Linux images provided by Oracle with [az vm image list](/cli/azure/vm/image#az-vm-image-list) `az vm image list --offer Oracle-Linux --publisher oracle --output table --all`. For more information, see [Oracle VM images and their deployment on Microsoft Azure](/azure/virtual-machines/workloads/oracle/oracle-vm-solutions).
>
> If you use a different image, you may need to install extra libraries to enable the infrastructure used in this guide.

### Create an Oracle Linux machine

In this section, you create a basic VM, install all required tools on it, take a snapshot of it, and then create replicas based on the snapshot.

Create a VM using [az vm create](/cli/azure/vm). You run the Administration Server on this VM.

The following example creates an Oracle Linux VM using user name and password pair for the authentication. If desired, you can use SSL authentication instead.

```azurecli
az vm create \
    --resource-group abc1110rg \
    --name adminVM \
    --availability-set myAvailabilitySet \
    --image Oracle:Oracle-Linux:8:latest \
    --size Standard_DS1_v2  \
    --admin-username azureuser \
    --admin-password Secret123456 \
    --public-ip-address "" \
    --nsg ""
```

### Create Windows VM and set up X-server

This tutorial uses the graphical interface of WebLogic Server to complete the installation and configuration. You use a Windows VM as a "jump box" and run an [X Windows System server](https://sourceforge.net/projects/vcxsrv/) to view the graphical installers on the three VMs of the WLS cluster.

Follow these steps to provision a Windows 10 machine and install an X-server. If you already have a Windows machine within the same network as the Oracle Linux machine, you don't need to provision a new one from Azure. You can jump to the section that installs the X-server.

[!INCLUDE [create-windows-vm-and-set-up-xserver](includes/create-windows-vm-and-set-up-xserver.md)]

Now, you're ready to connect to the Oracle Linux machine and install the required tools with graphical the interface. The following sections guide you to install Oracle GraalVM and Oracle WebLogic 14c Enterprise Edition. You use `myWindowsVM` for the installation and configuration.

> [!NOTE]
> Although this guide uses Oracle GraalVM Enterprise Edition, WLS is certified to run on the standard Java VM from Oracle as well.

### Download Oracle GraalVM and Oracle WebLogic 14c

Oracle WebLogic 14c is certified to run on Oracle GraalVM Enterprise Edition. In general, you can anticipate up to a 5-10% performance improvement over non-GraalVM. For more information, see [About Oracle WebLogic Server on GraalVM Enterprise Edition](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/wlgvm/index.html#WLGVM-GUID-F6B2A95F-11A6-4594-99BE-D2E7C1A4747F).

1. Download the archive by using the following steps on `myWindowsVM`.

   1. Open a web browser, navigate to the [Oracle GraalVM downloads page](https://www.oracle.com/downloads/graalvm-downloads.html), accept the Oracle License Agreement, and then download the appropriate version for your platform. This example uses Oracle GraalVM Enterprise Edition 22.2.0 Linux x86 for Java 11 with the file *graalvm-ee-java11-linux-amd64-22.2.0.1.tar.gz*.

   1. Navigate to the [Oracle Fusion Middleware Software downloads page](https://www.oracle.com/middleware/technologies/fusionmiddleware-downloads.html). Select the **Generic Installer**, accept the Oracle License Agreement, and then download the ZIP archive. You get a file with the name *fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip*.

   > [!NOTE]
   > If you want to use JDK 11, download it from the [Oracle JDK 11 download page](https://www.oracle.com/in/java/technologies/javase/jdk11-archive-downloads.html).

1. Use the following steps to copy the files to `adminVM`.

   1. Get the private IP address of `adminVM`. From the Azure portal, select the resource group `abc1110rg`. In the list of resources, select `adminVM`. On the overview page, select **Properties**. In the **Networking**, copy the value of **Private IP address**. In this example, the value is `192.168.0.4`.

   1. Open a command prompt from `myWindowsVM` and then use the following instructions to copy the files to `adminVM` using Secure Copy Protocol.

      The following example uploads `graalvm-ee-java11-linux-amd64-22.2.0.1.tar.gz`. Replace the file name with the name of the file you downloaded.

      > [!NOTE]
      > You may find it helpful to copy the commands from this article into Notepad, change the values to match your actual values, and then copy the updated commands from Notepad back to the command line.

      ```cmd
      cd Downloads
      set ADMINVM_IP="192.168.0.4"
      set GRAALVM_FILE_NAME="graalvm-ee-java11-linux-amd64-22.2.0.1.tar.gz"
      scp %GRAALVM_FILE_NAME% azureuser@%ADMINVM_IP%:/tmp/%GRAALVM_FILE_NAME%
      ```

      Type `yes` and enter the password *Secret123456*.

      Use the following command to upload *fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip*.

      ```cmd
      scp fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip azureuser@%ADMINVM_IP%:/tmp/fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip
      ```

      Enter the password *Secret123456*.

1. Use the following steps to SSH into `adminVM` and create the `oracle` user.

   1. First, SSH into your Oracle VM in Azure in order to create `oracle` user and change the owner of the files. In the same command prompt for `myWindowsVM`, SSH into `adminVM` with `ssh`, as shown in the following example.

   ```cmd
   ssh azureuser@%ADMINVM_IP%
   ```

   1. Input the password *Secret123456*.

   1. Next, use the following instructions to create the `oracle` user and group, and move the files. You install Oracle GraalVM to */u01/app/jdk* and install Oracle WebLogic Server to */u01/app/wls*.

      Many of the commands in this guide must be run as root, use the following command to become the root user.

      ```bash
      sudo su
      ```

      Then, use the following commands to add the `oracle` user and group.

      ```bash
      groupname="oracle"
      username="oracle"
      user_home_dir="/u01/oracle"
      sudo mkdir -p ${user_home_dir}
      sudo groupadd $groupname
      sudo useradd -d ${user_home_dir} -g $groupname $username
      sudo chown ${username}:${groupname} ${user_home_dir} -R

      JDK_PATH="/u01/app/jdk"
      WLS_PATH="/u01/app/wls"
      sudo mkdir -p $JDK_PATH
      sudo mkdir -p $WLS_PATH

      #Replace the version with yours
      export GRAALVM_VERSION="22.2.0.1"
      export GRAALVM_FILE_NAME="graalvm-ee-java11-linux-amd64-${GRAALVM_VERSION}.tar.gz"
      sudo mv /tmp/${GRAALVM_FILE_NAME} $JDK_PATH/${GRAALVM_FILE_NAME}
      sudo mv /tmp/fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip $WLS_PATH/fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip
      ```

### Install Oracle GraalVM

This section shows you how to install Oracle GraalVM on `adminVM` under the `oracle` user.

First, run the following commands:

```bash
sudo tar -zxvf $JDK_PATH/${GRAALVM_FILE_NAME} --directory $JDK_PATH
sudo chown -R $username:$groupname $JDK_PATH

export JAVA_HOME=$JDK_PATH/graalvm-ee-java11-${GRAALVM_VERSION}
export PATH=$JAVA_HOME/bin:$PATH
```

Next, verify your JDK install.

```bash
java --version
```

In this example, the output is:

```output
java 11.0.16.1 2022-08-18 LTS
Java(TM) SE Runtime Environment GraalVM EE 22.2.0.1 (build 11.0.16.1+1-LTS-jvmci-22.2-b08)
Java HotSpot(TM) 64-Bit Server VM GraalVM EE 22.2.0.1 (build 11.0.16.1+1-LTS-jvmci-22.2-b08, mixed mode, sharing)
```

If you don't see output similar to this example, troubleshoot and resolve the problem before continuing. You continue to install Oracle WebLogic 14c on `adminVM`, so keep this terminal.

### Install Oracle WebLogic Server 14c Enterprise Edition

In this section, you use the X-server on `myWindowsVM` to view the graphical installer for WLS 14c running on `adminVM`.

You install WLS 14c as the `oracle` user. Use the following commands to unzip the installer and change its owner:

```bash
sudo unzip -o $WLS_PATH/fmw_*.zip -d $WLS_PATH
sudo chown -R $username:$groupname $WLS_PATH
```

Next, use the following commands to install dependencies：

```bash
# install dependencies for X-server
sudo yum install -y libXtst libSM libXrender
# install dependencies to run a Java GUI client
sudo yum install -y fontconfig urw-base35-fonts
```

Then use the following command to become the `oracle` user:

```bash
sudo su - oracle
```

Before launching the installer, use the following command to set the `DISPLAY` variable. This variable allows the graphical installer to run on the Oracle Linux VM, but display on `myWindowsVM`. The value of the `DISPLAY` variable includes the private IP address of `myWindowsVM`. You can find this IP address by going to the Azure portal. In the portal, select `myWindowsVM`. On the overview page, under **Properties**, in the **Networking** section, see **Private IP address**. In this example, the IP address is `192.168.0.5`. Following the IP address of `myWindowsVM` is the display number. In the X Windows System, the most common display number is `:0.0`.

```bash
export DISPLAY=<my-windows-vm-private-ip>:0.0
#export DISPLAY=192.168.0.5:0.0
```

Next, use the following commands to start the process to install WLS 14c. If you're using a different JVM, replace the `JAVA_HOME` value with your appropriate value. Make sure the X server is running on `myWindowsVM`, with access control disabled.

```bash
#Replace the version with yours
export GRAALVM_VERSION="22.2.0.1"
export JAVA_HOME=/u01/app/jdk/graalvm-ee-java11-${GRAALVM_VERSION}
${JAVA_HOME}/bin/java -jar /u01/app/wls/fmw_14.1.1.0.0_wls_lite_generic.jar
```

This command produces output similar to the following example:

```output
Launcher log file is /tmp/OraInstall2022-09-22_06-29-26AM/launcher2022-09-22_06-29-26AM.log.
Extracting the installer . . . . . . . Done
Checking if CPU speed is above 300 MHz. Actual 2294.687 MHz    Passed
Checking monitor: must be configured to display at least 256 colors. Actual unknown. Failed <<<<
Checking swap space: must be greater than 512 MB. Actual 2047 MB    Passed
Checking temp space: must be greater than 300 MB. Actual 23650 MB    Passed

Some system prerequisite checks failed.
You must fulfill these requirements before continuing.

Continue? (yes [y] / no [n]) [n]
```

Press <kbd>y</kbd> to continue.

After a while, the installer displays, as shown in the following screenshot. If you don't see the user interface, check behind the command prompt.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-inventory-setup.png" alt-text="Screenshot of Oracle WebLogic Server Installation Inventory Setup." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-inventory-setup.png":::

Select **OK**.

When the fusion middleware installer appears, select **Next**. On the **Auto Updates** page, select **Next**. On the next screen, set **Oracle Home** to */u01/app/wls/install/oracle/middleware/oracle_home*, as shown in the following screenshot. This value is different from the default value.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-location.png" alt-text="Screenshot of Oracle WebLogic Server Installation Location." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-location.png":::

Select **Next**. Select the installation type **WebLogic Server**. Select **Next**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-type.png" alt-text="Screenshot of Oracle WebLogic Server Installation Type." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-type.png":::

You should find that all the prerequisite checks successfully pass. If not, you must resolve the error before proceeding.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-prerequisite-checks.png" alt-text="Screenshot of Oracle WebLogic Server Installation Prerequisite Checks." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-prerequisite-checks.png":::

Select **Next**, then select **Install**. The installation progress is shown.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-progress.png" alt-text="Screenshot of Oracle WebLogic Server Installation Progress." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-progress.png":::

All of the listed installation should complete without error. Select **Next** and you're shown the installation summary.

Finally, you see the **Installation Complete** page. Unselect the **Next Steps**, as shown in the following screenshot. You configure the WebLogic domain after all the machines are ready.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-complete.png" alt-text="Screenshot of Oracle WebLogic Server Installation Complete." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-complete.png":::

Select **Finish**.

You've finished installing WLS 14c on `adminVM`. Next, you install the database driver for PostgreSQL.

> [!NOTE]
> If you want to install Oracle Weblogic Server Critical Patch updates, download the patches from [My Oracle Support](https://support.oracle.com/) and apply them following the instructions at [Installing WebLogic PSU in Linux Environment Videos](https://www.youtube.com/playlist?list=PLH9MtFwUgY2KwO4Z5hJmZoXG9x1KcfcBY). To install the patches to all the machines running WLS, make sure you've patched `adminVM` before taking a snapshot from it's OS disk.

### Install the PostgreSQL JDBC driver

The steps in this section show you how to connect PostgreSQL to the Oracle WebLogic Server cluster.

This section shows you how to download PostgreSQL JDBC driver and install it. This section assumes you're still on `adminVM` and signed in with the `oracle` user. If you're working with any other user, run `sudo su - oracle` to switch to `oracle`.

```bash
DRIVER_PATH="/u01/app/wls/install/oracle/middleware/oracle_home/wlserver/server/lib/postgresql-42.2.8.jar"

curl -L https://jdbc.postgresql.org/download/postgresql-42.2.8.jar -o ${DRIVER_PATH}
```

To load the driver successfully, you must include the driver jar in the classpath. For more information, see [Adding Third-Party JDBC Drivers Not Installed with WebLogic Server](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/jdbca/third_party_drivers.html). The following example adds the path to *commExtEnv.sh*, so all domains created on the servers are able to load the driver.

```bash
#Replace with your version
GRAALVM_VERSION="22.2.0.1"
JAVA_HOME=/u01/app/jdk/graalvm-ee-java11-${GRAALVM_VERSION}
WL_HOME="/u01/app/wls/install/oracle/middleware/oracle_home/wlserver"
sed -i 's;^WEBLOGIC_CLASSPATH=\"${JAVA_HOME}.*;&\nWEBLOGIC_CLASSPATH="${WL_HOME}/server/lib/postgresql-42.2.8.jar:${WEBLOGIC_CLASSPATH}";' ${WL_HOME}/../oracle_common/common/bin/commExtEnv.sh
```

### Create machines for managed servers

You've now installed Oracle GraalVM (or another approved JVM), Oracle WebLogic Server 14c Enterprise Edition, and PostgreSQL JDBC driver on `adminVM`, which runs the WLS Administration Server. You still need to prepare machines to run the two managed servers. Next, you create a snapshot of `adminVM` and prepare machines for two managed severs, `mspVM1` and `mspVM2`.

This section introduces an approach to prepare machines with the snapshot of `adminVM`. Return to your terminal that has Azure CLI signed in, then follow these steps:

1. Use the following command to stop `adminVM`:

   ```azurecli
   az vm stop --resource-group abc1110rg --name adminVM
   ```

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` OS disk.

   ```azurecli
   ADMIN_OS_DISK_ID=$(az vm show \
       --resource-group abc1110rg \
       --name adminVM \
       --query storageProfile.osDisk.managedDisk.id \
       --output tsv)
   az snapshot create \
       --resource-group abc1110rg \
       --name myAdminOSDiskSnapshot \
       --source ${ADMIN_OS_DISK_ID}
   ```

1. Create `mspVM1`.

   First, create a managed disk for `mspVM1` with [az disk create](/cli/azure/disk#az-disk-create):

   ```azurecli
   # Get the snapshot ID.
   SNAPSHOT_ID=$(az snapshot show \
       --name myAdminOSDiskSnapshot \
       --resource-group abc1110rg \
       --query [id] \
       --output tsv)

   # Create a new Managed Disks using the snapshot ID.
   # Note that managed disk is created in the same location as the snapshot.
   az disk create \
       --resource-group abc1110rg \
       --name mspVM1_OsDisk_1 \
       --source ${SNAPSHOT_ID}
   ```

   Next, create VM `mspVM1`, attaching OS disk `mspVM1_OsDisk_1`:

   ```azurecli
   # Get the resource Id of the managed disk.
   MSPVM1_DISK_ID=$(az disk show \
       --name mspVM1_OsDisk_1 \
       --resource-group abc1110rg \
       --query [id] \
       --output tsv)

   # Create the VM by attaching the existing managed disk as an OS.
   az vm create \
       --resource-group abc1110rg \
       --name mspVM1 \
       --attach-os-disk ${MSPVM1_DISK_ID} \
       --os-type linux \
       --availability-set myAvailabilitySet \
       --public-ip-address "" \
       --nsg ""
   ```

   You've now created `mspVM1` with JDK and WLS installed. Because the VM was created from a snapshot of the `adminVM` OS disk, the two VMs have the same hostname. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the hostname to the value `mspVM1`:

   ```azurecli
   az vm run-command invoke \
       --resource-group abc1110rg \
       --name mspVM1 \
       --command-id RunShellScript \
       --scripts "sudo hostnamectl set-hostname mspVM1"
   ```

   When the command completes successfully, you see output similar to the following example:

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

1. Create `mspVM2`.

   The steps to create `mspVM2` are the same as creating `mspVM1`.

   ```azurecli
   #Create a new Managed Disks for mspVM2
   az disk create --resource-group abc1110rg --name mspVM2_OsDisk_1 --source ${SNAPSHOT_ID}

   #Get the resource Id of the managed disk
   MSPVM2_DISK_ID=$(az disk show \
   --name mspVM2_OsDisk_1 \
   --resource-group abc1110rg \
   --query [id] \
   --output tsv)

   #Create VM by attaching existing managed disks as OS
   az vm create \
       --resource-group abc1110rg \
       --name mspVM2 \
       --attach-os-disk ${MSPVM2_DISK_ID} \
       --availability-set myAvailabilitySet \
       --os-type linux \
       --public-ip-address "" \
       --nsg ""

   #Set hostname
   az vm run-command invoke \
       --resource-group abc1110rg \
       --name mspVM2 \
       --command-id RunShellScript \
       --scripts "sudo hostnamectl set-hostname mspVM2"
   ```

[!INCLUDE [start-admin-get-ips](includes/wls-manual-guidance-start-admin-and-get-ip.md)]

Now, all three machines are ready. Next, you configure a WebLogic cluster.

### Configure WebLogic Server domain and cluster

[!INCLUDE [configure-domain](includes/wls-manual-guidance-configure-domain.md)]

#### Create the domain using the configuration wizard

You keep using the X-server and Oracle Configuration Wizard to create the WLS domain.

The following section shows how to create a new WLS domain on the `adminVM`. Make sure you're still on your Windows machine, if not, remote connect to `myWindowsVM`.

1. Connect to `adminVM` from a command prompt.

   Run the following commands on your Windows machine `myWindowsVM`.

   ```cmd
   set ADMINVM_IP="192.168.0.4"
   ssh azureuser@%ADMINVM_IP%
   ```

1. Use the following commands to initialize the folder for domain configuration.

   ```bash
   sudo su

   DOMAIN_PATH="/u01/domains"
   mkdir -p ${DOMAIN_PATH}
   chown oracle:oracle -R ${DOMAIN_PATH}
   ```

1. Use the following commands to become the `oracle` user and set the `DISPLAY` variable.

   ```bash
   sudo su - oracle

   export DISPLAY=<my-windows-vm-private-ip>:0.0
   #export DISPLAY=192.168.0.5:0.0
   ```

1. Run the following command to launch the Oracle Configuration Wizard:

   ```bash
   bash /u01/app/wls/install/oracle/middleware/oracle_home/oracle_common/common/bin/config.sh
   ```

The Oracle Configuration Wizard starts and directs you to configure the domain. The following page asks for domain type and location. Select **Create a new domain** and set domain location to */u01/domains/wlsd*. The domain configuration is saved to this folder.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-location.png" alt-text="Screenshot of Oracle Configuration Wizard - Create Domain." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-location.png":::

Select **Next**, then select **Create Domain Using Product Templates**. Keep the default selected template, as shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-templates.png" alt-text="Screenshot of Oracle Configuration Wizard - Templates." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-templates.png":::

Select **Next**, then input **Administration Account**. Set the **Name** as *weblogic* and **Password** as *Secret123456*.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-account.png" alt-text="Screenshot of Oracle Configuration Wizard - Administration Account." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-account.png":::

Select **Next**. For domain mode, select **Production**. For JDK, keep the default option.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-mode.png" alt-text="Screenshot of Oracle Configuration Wizard - Domain Mode and JDK." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-mode.png":::

Select **Next**. For advanced configurations, select **Administration Server**, **Node Manager**, and **Topology**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-advanced-configuration.png" alt-text="Screenshot of Oracle Configuration Wizard - Advanced Configurations." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-advanced-configuration.png":::

Select **Next** and fill in the **Administration Server** name with *admin*. Fill in the **Listen IP Address** with the private IP of `adminVM`. The value is *192.168.0.4* in this example.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-server.png" alt-text="Screenshot of Oracle Configuration Wizard - Administration Server." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-server.png":::

Select **Next**. For **Node Manager Type**, select **Per Domain Custom Location**, and fill in location with */u01/domains/wlsd/nodemanager*. For **Node Manager Credentials**, the username is *weblogic* and the password is *Secret123456*.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-node-manager.png" alt-text="Screenshot of Oracle Configuration Wizard - Node Manager." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-node-manager.png":::

Select **Next**. For managed servers, add the following items. Use the IP addresses you discovered earlier:

| Server name | Listen address                      | Listen port |
|-------------|-------------------------------------|-------------|
| `msp1`      | The private IP address of `mspVM1`. | `8001`      |
| `msp2`      | The private IP address of `mspVM2`. | `8001`      |

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-managed-server.png" alt-text="Screenshot of Oracle Configuration Wizard - Managed Servers." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-managed-server.png":::

Select **Next**, then create a cluster with the name `cluster1`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-cluster.png" alt-text="Screenshot of Oracle Configuration Wizard - Cluster." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-cluster.png":::

Select **Next**. Don't change the values for **Server Templates** and **Dynamic Servers**. The defaults are acceptable for a dynamic cluster.

For **Assign Servers to Clusters**, assign both `msp1` and `msp2` to `cluster1`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-cluster.png" alt-text="Screenshot of Oracle Configuration Wizard - Assign Servers to Clusters." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-cluster.png":::

Select **Next**. Add the machines `adminVM`, `mspVM1`, and `mspVM2`. Use the IP addresses you discovered earlier.

| Name      | Node manager listen address          | Node manager listen port |
|-----------|--------------------------------------|--------------------------|
| `mspVM1`  | The private IP address of `mspVM1`.  | `5556`                   |
| `mspVM2`  | The private IP address of `mspVM2`.  | `5556`                   |
| `adminVM` | The private IP address of `adminVM`. | `5556`                   |

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-machines.png" alt-text="Screenshot of Oracle Configuration Wizard - Machines." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-machines.png":::

Select **Next**. For **Assign Servers to Machines**, assign server `admin` to `adminVM`, `msp1` to `mspVM1`, and `msp2` to `mspVM2`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-machines.png" alt-text="Screenshot of Oracle Configuration Wizard - Assign Servers to Machines." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-machines.png":::

Select **Next**. You're shown the **Configuration Summary**, which should look like the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-gnu-linux-configuration-summary.png" alt-text="Screenshot of Oracle Configuration Wizard - Configuration Summary." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-gnu-linux-configuration-summary.png":::

Select **Create**. The **Configuration Progress** page shows the progress. All the listed items should be configured successfully.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png" alt-text="Screenshot of Oracle Configuration Wizard - Configuration Progress." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png":::

Finally, there's an **End of Configuration** page to show the URL of the Administration Server.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-end.png" alt-text="Screenshot of Oracle Configuration Wizard - End." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-end.png":::

The Administration Server isn't running, so the URL doesn't resolve. Select **Next**, then **Finish**. You've now finished configuring the `wlsd` domain with a cluster `cluster1` including two managed servers.

Next, apply the domain configuration to `mspVM1` and `mspVM2`.

You use the pack and unpack command to extend the domain.

#### Create replicas using the pack and unpack command

This tutorial uses the WLS pack and unpack command to extend the domain. For more information, see [Overview of the Pack and Unpack Commands](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.3/wldpu/overview-pack-and-unpack-commands.html#GUID-D37A439D-EB49-40AC-BDA8-0E362E35827F).

1. Pack the domain configuration on `adminVM` with the following steps, assuming you're still on `adminVM` and logged in with the `oracle` user.

   ```bash
   cd /u01/app/wls/install/oracle/middleware/oracle_home/oracle_common/common/bin
   bash pack.sh -domain=/u01/domains/wlsd -managed=true -template=/tmp/cluster.jar -template_name="wlsd"
   ```

   If the command is completed successfully, you see output similar the following example.

   ```output
   [oracle@adminVM bin]$ bash pack.sh -domain=/u01/domains/wlsd -managed=true -template=/tmp/cluster.jar -template_name="wlsd"
   << read domain from "/u01/domains/wlsd"
   >>  succeed: read domain from "/u01/domains/wlsd"
   << set config option Managed to "true"
   >>  succeed: set config option Managed to "true"
   << write template to "/tmp/cluster.jar"
   ..............................
   >>  succeed: write template to "/tmp/cluster.jar"
   << close template
   >>  succeed: close template
   ```

   Use the following commands to copy */tmp/cluster.jar* to `mspVM1` and `mspVM2` using `scp`. If prompted for key fingerprint, type `yes`. Enter the password *Secret123456* when prompted.

   ```bash
   scp /tmp/cluster.jar azureuser@<mspvm1-private-ip>:/tmp/cluster.jar
   scp /tmp/cluster.jar azureuser@<mspvm2-private-ip>:/tmp/cluster.jar
   #scp /tmp/cluster.jar azureuser@192.168.0.6:/tmp/cluster.jar
   #scp /tmp/cluster.jar azureuser@192.168.0.7:/tmp/cluster.jar
   ```

1. Use the following instructions to apply domain configuration to `mspVM1`.

   Open a new command prompt, and use the following commands to connect to `mspVM1`. Replace `192.168.0.6` with your `mspVM1` private IP address:

   ```cmd
   set MSPVM1_IP="192.168.0.6"
   ssh azureuser@%MSPVM1_IP%
   ```

   You're asked for the password for the connection. For this example, the password is *Secret123456*.

   You're now logged into `mspVM1` with user `azureuser`. Next, use the following commands to become the root user and update file ownership of */tmp/cluster.jar* to be owned by `oracle`.

   ```bash
   sudo su

   chown oracle:oracle /tmp/cluster.jar

   DOMAIN_PATH="/u01/domains"
   mkdir -p ${DOMAIN_PATH}
   chown oracle:oracle -R ${DOMAIN_PATH}
   ```

   As the `oracle` user, use the following commands to apply the domain configuration.

   ```bash
   sudo su - oracle

   cd /u01/app/wls/install/oracle/middleware/oracle_home/oracle_common/common/bin
   bash unpack.sh -domain=/u01/domains/wlsd -template=/tmp/cluster.jar
   ```

   If the command completes successfully, you see output similar to the following example.

   ```output
   [oracle@mspVM1 bin]$ bash unpack.sh -domain=/u01/domains/wlsd -template=/tmp/cluster.jar
   << read template from "/tmp/cluster.jar"
   >>  succeed: read template from "/tmp/cluster.jar"
   << set config option DomainName to "wlsd"
   >>  succeed: set config option DomainName to "wlsd"
   >>  validateConfig "KeyStorePasswords"
   >>  succeed: validateConfig "KeyStorePasswords"
   << write Domain to "/u01/domains/wlsd"
   ..................................................
   >>  succeed: write Domain to "/u01/domains/wlsd"
   << close template
   >>  succeed: close template
   ```

1. Use the following instructions to apply domain configuration to `mspVM2`.

   Connect `mspVM2` in a new command prompt. Replace `192.168.0.7` with your `mspVM2` private IP address:

   ```cmd
   set MSPVM2_IP="192.168.0.7"
   ssh azureuser@%MSPVM2_IP%
   ```

   You're asked for a password for the connection. For this example, the password is *Secret123456*.

   You're now logged into `mspVM2` with user `azureuser`. Use the following commands to change to the root user and update the file ownership of */tmp/cluster.jar* and initialize the folder for domain configuration.

   ```bash
   sudo su

   chown oracle:oracle /tmp/cluster.jar

   DOMAIN_PATH="/u01/domains"
   mkdir -p ${DOMAIN_PATH}
   chown oracle:oracle -R ${DOMAIN_PATH}

   sudo su - oracle

   cd /u01/app/wls/install/oracle/middleware/oracle_home/oracle_common/common/bin
   bash unpack.sh -domain=/u01/domains/wlsd -template=/tmp/cluster.jar
   ```

You've now replicated the domain configuration on `mspVM1` and `mspVM2`, and you're ready to start the servers.

### Start servers

The steps in this section direct you to perform the following two tasks:

1. Make it so the admin and managed servers start automatically after server reboot.
1. Start the servers for immediate use.

These two tasks aren't easily separated, so the steps for the two tasks are intermixed.

#### Start admin

Go back to the command prompt that connects to `adminVM`. If you've lost it, run the following command to connect to it:

```cmd
set ADMINVM_IP="192.168.0.4"
ssh azureuser@%ADMINVM_IP%
```

If you aren't working with the `oracle` user, log in with `oracle`:

```bash
sudo su - oracle
```

The following command persists the `admin` account to */u01/domains/wlsd/servers/admin/security/boot.properties* to enable automatically starting the `admin` server without asking for credentials.

Replace the username and password with yours.

```bash
mkdir -p /u01/domains/wlsd/servers/admin/security

cat <<EOF >/u01/domains/wlsd/servers/admin/security/boot.properties
username=weblogic
password=Secret123456
EOF
```

Use the following commands to inspect the file. Be sure it has the correct ownership, permissions, and contents.

```bash
ls -la /u01/domains/wlsd/servers/admin/security/boot.properties
cat /u01/domains/wlsd/servers/admin/security/boot.properties
```

The output should look nearly identical to the following example.

```output
[oracle@adminVM bin]$ ls -la /u01/domains/wlsd/servers/admin/security/boot.properties
-rw-rw-r--. 1 oracle oracle 40 Nov 28 17:00 /u01/domains/wlsd/servers/admin/security/boot.properties
[oracle@adminVM bin]$ cat /u01/domains/wlsd/servers/admin/security/boot.properties
username=weblogic
password=Secret123456
```

#### Enable the admin server and node manager to start automatically after VM restart

Create a Linux service for the WLS admin server and node manager, to start the process automatically after reboot. For more information, see [Use systemd on Oracle Linux](https://docs.oracle.com/en/learn/use_systemd/index.html).

Exit the `oracle` user and sign in with the `root` user.

```bash
exit

sudo su
```

Create the Linux service for the node manager:

```bash
cat <<EOF >/etc/systemd/system/wls_nodemanager.service
[Unit]
Description=WebLogic nodemanager service
After=network-online.target
Wants=network-online.target
[Service]
Type=simple
# Note that the following three parameters should be changed to the correct paths
# on your own system
WorkingDirectory=/u01/domains/wlsd
ExecStart="/u01/domains/wlsd/bin/startNodeManager.sh"
ExecStop="/u01/domains/wlsd/bin/stopNodeManager.sh"
User=oracle
Group=oracle
KillMode=process
LimitNOFILE=65535
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
```

Create the Linux service for the admin server:

```bash
cat <<EOF >/etc/systemd/system/wls_admin.service
[Unit]
Description=WebLogic Adminserver service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/u01/domains/wlsd
ExecStart="/u01/domains/wlsd/startWebLogic.sh"
ExecStop="/u01/domains/wlsd/bin/stopWebLogic.sh"
User=oracle
Group=oracle
KillMode=process
LimitNOFILE=65535
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF
```

You're now ready to start the node manager and admin server on `adminVM` by using the following commands:

```bash
sudo systemctl enable wls_nodemanager
sudo systemctl enable wls_admin
sudo systemctl daemon-reload
sudo systemctl start wls_nodemanager
sudo systemctl start wls_admin
```

Check the admin server state with `sudo systemctl status wls_admin -l`. The Administration Server should be ready when you find similar logs:

```output
[root@adminVM wlsd]# sudo systemctl status wls_admin -l
● wls_admin.service - WebLogic Adminserver service
Loaded: loaded (/etc/systemd/system/wls_admin.service; enabled; vendor preset: disabled)
Active: active (running) since Mon 2022-09-26 07:47:34 UTC; 54s ago
Main PID: 26738 (startWebLogic.s)
    Tasks: 61 (limit: 20654)
Memory: 649.2M

... ...

Sep 26 07:48:15 adminVM startWebLogic.sh[26802]: <Sep 26, 2022, 7:48:15,411 AM Coordinated Universal Time> <Notice> <WebLogicServer> <BEA-000365> <Server state changed to RUNNING.>
```

Press <kbd>Q</kbd> to exit the log monitoring mode.

You can't access admin server before opening ports `7001` and `5556`. Run the following command to open ports:

```bash
sudo firewall-cmd --zone=public --add-port=7001/tcp
sudo firewall-cmd --zone=public --add-port=5556/tcp
sudo firewall-cmd --runtime-to-permanent
sudo systemctl restart firewalld
```

At this point, you can access the admin server on the browser of `myWindowsVM` with the URL `http://<adminvm-private-ip>:7001/console`. Verify that you can view the admin server, but don't sign in yet. If the admin server isn't running, troubleshoot and resolve the problem before proceeding. The admin server isn't accessible outside of Azure.

#### Start msp1

Go back to the command prompt that connects to `mspVM1`. If you've lost it, run the following command to connect to it:

```cmd
set MSPVM1_IP="192.168.0.6"
ssh azureuser@%MSPVM1_IP%
```

If you aren't working with `oracle` user, log in with `oracle`:

```bash
sudo su - oracle
```

Persist the `admin` account to */u01/domains/wlsd/servers/msp1/security/boot.properties* to enable automatically starting `msp1` without asking for credentials. Replace the username and password with yours.

```bash
mkdir -p /u01/domains/wlsd/servers/msp1/security

cat <<EOF >/u01/domains/wlsd/servers/msp1/security/boot.properties
username=weblogic
password=Secret123456
EOF
```

Now, you create a Linux service for node manager, to start the process automatically on machine reboot. For more information, see [Use systemd on Oracle Linux](https://docs.oracle.com/en/learn/use_systemd/index.html).

Exit the `oracle` user and sign in with the `root` user.

```bash
exit

#Skip this command if you are root
sudo su
```

Create the Linux service for the node manager:

```bash
cat <<EOF >/etc/systemd/system/wls_nodemanager.service
[Unit]
Description=WebLogic nodemanager service
After=network-online.target
Wants=network-online.target
[Service]
Type=simple
# Note that the following three parameters should be changed to the correct paths
# on your own system
WorkingDirectory=/u01/domains/wlsd
ExecStart="/u01/domains/wlsd/bin/startNodeManager.sh"
ExecStop="/u01/domains/wlsd/bin/stopNodeManager.sh"
User=oracle
Group=oracle
KillMode=process
LimitNOFILE=65535
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
```

Next, start the node manager.

```bash
sudo systemctl enable wls_nodemanager
sudo systemctl daemon-reload
sudo systemctl start wls_nodemanager
```

If the node manager is running successfully, you see logs similar to the following example:

```output
[root@mspVM1 azureuser]# systemctl status wls_nodemanager -l
● wls_nodemanager.service - WebLogic nodemanager service
Loaded: loaded (/etc/systemd/system/wls_nodemanager.service; enabled; vendor preset: disabled)
Active: active (running) since Tue 2022-09-27 01:23:42 UTC; 19s ago
Main PID: 107544 (startNodeManage)
    Tasks: 15 (limit: 20654)
Memory: 146.7M

... ...

Sep 27 01:23:45 mspVM1 startNodeManager.sh[107592]: <Sep 27, 2022 1:23:45 AM Coordinated Universal Time> <INFO> <Server Implementation Class: weblogic.nodemanager.server.NMServer$ClassicServer.>
Sep 27 01:23:46 mspVM1 startNodeManager.sh[107592]: <Sep 27, 2022 1:23:46 AM Coordinated Universal Time> <INFO> <Secure socket listener started on port 5556, host /192.168.0.6>
```

Press <kbd>Q</kbd> to exit log monitoring mode.

You must open port `8001` to access application that deployed to the cluster and `5556` for communication inside the domain. Run the following command to open ports:

```bash
sudo firewall-cmd --zone=public --add-port=8001/tcp
sudo firewall-cmd --zone=public --add-port=5556/tcp
sudo firewall-cmd --runtime-to-permanent
sudo systemctl restart firewalld
```

#### Start msp2

Go back to the command prompt that connects to `mspVM2`. If you've lost it, run the following command to connect to it:

```cmd
set MSPVM2_IP="192.168.0.7"
ssh azureuser@%MSPVM2_IP%
```

If you aren't working with the `oracle` user, sign in with `oracle`:

```bash
sudo su - oracle
```

Persist the `admin` account to */u01/domains/wlsd/servers/msp2/security/boot.properties* to enable automatically starting `msp2` without asking for credentials. Replace the username and password with yours.

```bash

mkdir -p /u01/domains/wlsd/servers/msp2/security

cat <<EOF >/u01/domains/wlsd/servers/msp2/security/boot.properties
username=weblogic
password=Secret123456
EOF
```

Next, create a Linux service for the node manager.

Exit the `oracle` user and sign in with the `root` user.

```bash
exit

#SKip this command if you are in root
sudo su
```

Create the Linux service for the node manager:

```bash
cat <<EOF >/etc/systemd/system/wls_nodemanager.service
[Unit]
Description=WebLogic nodemanager service
After=network-online.target
Wants=network-online.target
[Service]
Type=simple
# Note that the following three parameters should be changed to the correct paths
# on your own system
WorkingDirectory=/u01/domains/wlsd
ExecStart="/u01/domains/wlsd/bin/startNodeManager.sh"
ExecStop="/u01/domains/wlsd/bin/stopNodeManager.sh"
User=oracle
Group=oracle
KillMode=process
LimitNOFILE=65535
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
```

Start the node manager.

```bash
sudo systemctl enable wls_nodemanager
sudo systemctl daemon-reload
sudo systemctl start wls_nodemanager
```

If the node manager is running successfully, you see logs similar to the following example:

```output
[root@mspVM2 azureuser]# systemctl status wls_nodemanager -l
● wls_nodemanager.service - WebLogic nodemanager service
Loaded: loaded (/etc/systemd/system/wls_nodemanager.service; enabled; vendor preset: disabled)
Active: active (running) since Tue 2022-09-27 01:23:42 UTC; 19s ago
Main PID: 107544 (startNodeManage)
    Tasks: 15 (limit: 20654)
Memory: 146.7M

... ...

Sep 27 01:23:45 mspVM2 startNodeManager.sh[107592]: <Sep 27, 2022 1:23:45 AM Coordinated Universal Time> <INFO> <Server Implementation Class: weblogic.nodemanager.server.NMServer$ClassicServer.>
Sep 27 01:23:46 mspVM2 startNodeManager.sh[107592]: <Sep 27, 2022 1:23:46 AM Coordinated Universal Time> <INFO> <Secure socket listener started on port 5556, host /192.168.0.6>
```

Press <kbd>Q</kbd> to exit log monitoring mode.

Open port `8001` and `5556`.

```bash
sudo firewall-cmd --zone=public --add-port=8001/tcp
sudo firewall-cmd --zone=public --add-port=5556/tcp
sudo firewall-cmd --runtime-to-permanent
sudo systemctl restart firewalld
```

#### Start managed servers

Now, open the Administration Console portal from a browser in your Windows machine `myWindowsVM`, and use the following steps to start the managed servers:

[!INCLUDE [start-managed-server](includes/wls-manual-guidance-start-managed-server.md)]

### Clean up the Windows machine

You've now completed the WLS cluster configuration. If desired, remove the Windows machine with the following commands. Alternatively, you could shut down the Windows machine `myWindowsVM` and continue to use it as a jump box for ongoing cluster maintenance tasks.

[!INCLUDE [clean-up-windows-xserver-machine](includes/clean-up-windows-xserver-machine.md)]

#### [Windows Server](#tab/windows-server)

The Marketplace image that you use to create the VMs is `MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest`.

> [!NOTE]
> You can query all the available Windows Server images by using [az vm image list](/cli/azure/vm/image#az-vm-image-list), as shown in the following command: `az vm image list --offer WindowsServer --all --output table`. For more information, see [Comparison of Standard, Datacenter, and Datacenter: Azure Edition editions of Windows Server 2022](/windows-server/get-started/editions-comparison-windows-server-2022?tabs=full-comparison).

### Create a Windows Server machine

Next, you create a basic VM, install all the required tools on it, then take a snapshot from it and create replicas based on the snapshot.

Create the basic VM using [az vm create](/cli/azure/vm). You run the WebLogic Administration Server on it.

The following example creates a Windows Server 2022 Datacenter Azure Edition machine named `adminVM`. This example uses `azureuser` for an administrative user name and `Secret123456` for the password.

```azurecli
az vm create \
    --resource-group abc1110rg \
    --name adminVM \
    --availability-set myAvailabilitySet \
    --image MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest \
    --size Standard_B2S \
    --public-ip-sku Standard \
    --vnet-name myVNet \
    --subnet mySubnet \
    --admin-username azureuser \
    --admin-password Secret123456
```

It takes a few minutes to create the VM and supporting resources.

After the deployment completes, connect to the machine. For a detailed guide on remote connection, see [How to connect using Remote Desktop and sign on to an Azure virtual machine running Windows](/azure/virtual-machines/windows/connect-rdp). 

After you're connected, search for and open **Windows Defender Firewall**. Select **Turn Windows Defender Firewall on or off** and select **Turn off Windows Defender Firewall** for both private and public network settings. Select **OK**. Close **Windows Defender Firewall**. Because numerous ports must be opened during the configuration, this step greatly simplifies the process of setting up the cluster.

After the configuration is complete, lock down the WebLogic Server by following an authoritative guide on the topic, such as [Securing a Production Environment for Oracle WebLogic Server](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/lockd/secure.html).

> [!NOTE]
> To stand up the WLS cluster, open the ports to access Administration Server, Managed Servers, and form the cluster. This tutorial turns off **Windows Defender Firewall** to enable the required ports. If you don't want to turn off the firewall, make sure those ports are available inside the private virtual network: `7001` for Administration Server, `8001` for Managed Servers, and `5556` for Node Manager.

Next, you install the required tools with the graphical installer. The following sections guide you to install Oracle JDK 11 and Oracle WebLogic 14c Enterprise Edition.

### Download Oracle JDK 11 and Oracle WebLogic 14c

Oracle WebLogic Server 14c (14.1.1.0.0) is certified for use with JDK 11. Supported Oracle WebLogic Server 14c (14.1.1.0.0) clients are certified for use with JDK 11.0.6. For more information, see [JDK 11 Certification](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/notes/whatsnew.html#GUID-960100E8-DFC1-49E5-8CED-1EC1D883A42F).

To download the Oracle JDK 11 and Oracle WebLogic 14c Windows installer, follow these steps:

1. If you're not already connected, connect to `adminVM`, and open the Microsoft Edge browser.

1. Navigate to the [Oracle JDK 11 downloads page](https://www.oracle.com/in/java/technologies/javase/jdk11-archive-downloads.html). Select the **Windows x64 Installer**, accept the Oracle License Agreement, and download EXE file. You get a file similar to *jdk-11.\*_windows-x64_bin.exe*.

1. Navigate to the [Oracle Fusion Middleware Software downloads page](http://www.oracle.com/technetwork/middleware/weblogic/downloads/index.html). Select the **Generic Installer**, and accept the Oracle License Agreement and download the ZIP archive. You get a file similar to *fmw_14.\*_wls_lite_Disk1_1of1.zip*.

### Install Oracle JDK 11

This section shows you how to install Oracle JDK 11 on Windows Server.

Open the download folder that contains JDK installer. Here the installer name is *jdk-11.0.16_windows-x64_bin.exe*. Right click the file and select **Run as administrator**. Install the JDK to the default folder *C:\Program Files\Java\jdk-11.0.16\\*.

After the installation finishes, you can validate its version in a command prompt by running the command `java -version`, with output similar to the following.

```output
java version "11.0.16" 2022-07-19 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.16+11-LTS-199)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.16+11-LTS-199, mixed mode)
```

### Install Oracle WebLogic Server 14c Enterprise Edition

This section shows you how to install WLS 14c on Windows Server.

Open the download folder that contains WLS installer ZIP file. Here the file name is *fmw_14.1.1.0.0_wls_lite_Disk1_1of1.zip*. Right click the file and select **Extract all** to the default path.

Open a command prompt, then run the following command to install WLS.

```cmd
java -jar C:\Users\azureuser\Downloads\fmw_14.1.1.0.0_wls_lite_Disk1_1of1\fmw_14.1.1.0.0_wls_lite_generic.jar
```

The command launches the WLS installer, as shown in the following screenshot:

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-welcome.png" alt-text="Screenshot of Oracle WebLogic Server Installation Welcome." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-welcome.png":::

Select **Next**. Allow **Skip Auto Updates** to remain selected and select **Next**. Set **Oracle Home** to *C:\Oracle\Middleware\Oracle_Home*, which should be the default value. Select **Next**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-location.png" alt-text="Windows - Oracle WebLogic Server Installation Location." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-location.png":::

Select installation type **WebLogic Server**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-type.png" alt-text="Windows - Oracle WebLogic Server Installation Type." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-type.png":::

Select **Next**. You're shown operating system warnings in the **Prerequisite Checks** page. Windows Server 2022 OS versions are supported on all Windows Server editions. To fix the warnings, you need to apply [Patch 34500720](https://support.oracle.com/epmos/faces/PatchDetail?patchId=34500720) after the installation.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-prerequisite-checks.png" alt-text="Windows - Oracle WebLogic Server Installation Prerequisite Checks." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-prerequisite-checks.png":::

Select **Next**, then **Install**. You're shown the installation progress as shown in the following screenshot:

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-installation-progress.png" alt-text="Windows - Oracle WebLogic Server Installation Progress." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-installation-progress.png":::

All of the listed installs should complete without error. Select the **Next** button. You're shown the **Installation Complete** page. Unselect any actions in the **Next Steps** section. You perform those steps after all the machines are ready.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-complete.png" alt-text="Windows - Oracle WebLogic Server Installation Complete." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-installation-complete.png":::

Select **Finished**. You've now finished installing Oracle WebLogic 14c and its dependencies on `adminVM`. Next, you create snapshot of `adminVM` and prepare machines for two managed severs.

> [!NOTE]
> For Oracle Weblogic Server Critical Patch, download the patches from [My Oracle Support](https://support.oracle.com/) and apply them following "Patch an existing installation" in [Install Patch and Upgrade](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/index.html). Make sure you've patched `adminVM` before taking a snapshot from it's OS disk. If you run into problems unzipping the patch file, see this [MyOracleSupport document](https://support.oracle.com/epmos/faces/DocumentDisplay?_afrLoop=311444465901186&parent=EXTERNAL_SEARCH&sourceId=PROBLEM&id=2259579.1&_afrWindowMode=0&_adf.ctrl-state=14u0vzw8om_162). You can skip this step for experimentation, but do not go to production with an unpatched WLS.

### Create machines for managed servers

Now you've installed Oracle JDK 11 and Oracle WebLogic Server 14c Enterprise Edition on `adminVM`, which runs the WLS Administration Server. You still need to prepare machines to run two managed servers.

This section introduces an approach to prepare machines with the snapshot of `adminVM`. You create the machines from the Azure portal.

1. Stop `adminVM`. Open `adminVM` from the Azure portal, then select **Stop** to stop the machine. Make sure the machine is stopped completely before doing the next step.

1. Use the following steps to take a snapshot of the `adminVM` OS disk.

   1. Open `adminVM` from the Azure portal. Under **Settings**, select **Disks**, then **OS Disk**. Select the OS disk starting with *adminVM_OsDisk_*.
   1. Select **Create snapshot**. Under **Instance details**, fill in **Name** with *snapshotAdminVMOsDisk*.
   1. Select **Review and create** then **Create**. It takes several seconds to take the snapshot.

1. Use the following steps to create `mspVM1`.

   1. First, create the OS disk for `mspVM1`. Open the snapshot you created in previous step, **snapshotAdminVMOsDisk**. Select **Create disk**. Under **Disk details**, fill in **Disk name** with *mspVM1_Os_Disk_1*. Select **Review and create**, then **Create**. It takes several seconds. When the process is complete, select **Go to resource**.
   1. Create the virtual machine `mspVM1`. Open the OS disk you created previously. In this example, its name is `mspVM1_Os_Disk_1`. Select **Create VM**. Under **Instance details**, fill in **Virtual machine name** with *mspVM1*. Select **Review and create** then **Create**. Ensure you have no errors before proceeding. The process takes several minutes.
   1. The machine is created from the snapshot of `adminVM`, it has the same computer name as `adminVM`. To change computer name to `mspVM1`, first remote connect to the machine. The user name and password are the same as with `adminVM`. Open a PowerShell terminal, and run the following command.

      ```powershell
      Rename-Computer -NewName mspvm1 -Restart
      ```

1. Use the following steps to create `mspVM2`.

   1. Create the OS disk for `mspVM2`. Open the snapshot you created previously. In this example, its name is `snapshotAdminVMOsDisk`. If you can't find the disk, search for *snapshotAdminVMOsDisk* in the **Search resources, services and docs**. Select **Create disk**. Under **Disk details**, fill in **Name** with *mspVM2_Os_Disk_1*. Select **Review and create**, then **Create**. It takes several seconds. When the process is complete, select **Go to resource**.
   1. Create virtual machine `mspVM2`. Open the OS disk you created previously, `mspVM2_Os_Disk_1`， select **Create VM**. Under **Instance details**, fill in **Virtual machine name** with *mspVM2*. Select **Review + create** then **Create**. It takes several minutes.
   1. Remote connect to the machine, the user name and password are the same as with `adminVM`. Open a PowerShell terminal, and run the following command to change computer name.

      ```powershell
      Rename-Computer -NewName mspvm2 -Restart
      ```

[!INCLUDE [start-admin-get-ip](includes/wls-manual-guidance-start-admin-and-get-ip.md)]

Now, all the machines are ready. Next, you configure a WebLogic cluster.

### Configure the WebLogic Server domain and cluster

[!INCLUDE [configure-domain](includes/wls-manual-guidance-configure-domain.md)]

#### Create the domain using configuration wizard

This section shows the steps to create a new WLS domain on `adminVM`.

Connect to `adminVM`, open a command prompt, and run the following command to start Oracle Configuration Wizard.

```cmd
cd C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin
config.cmd
```

The Oracle Configuration Wizard directs you to configure the domain. The following page asks for domain type and location. Select **Create a new domain** and set domain location to *C:\domains\wlsd*. The domain configuration is saved to this folder.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-location.png" alt-text="Windows - Oracle Configuration Wizard - Domain Location." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-location.png":::

Select **Next**, select **Create Domain Using Product Templates**, and keep the default selected template, as shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-templates.png" alt-text="Windows - Oracle Configuration Wizard - Templates." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-templates.png":::

Select **Next**, then input the **Administration Account** name as *weblogic* and the password as *Secret123456*, as shown in the following screenshot:

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-account.png" alt-text="Windows - Oracle Configuration Wizard - Administration Account." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-account.png":::

Select **Next**. For domain mode, select **Production**; for JDK, keep the default option.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-jdk.png" alt-text="Windows - Oracle Configuration Wizard - Domain Mode and JDK." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-jdk.png":::

Select **Next**. For advanced configurations, select **Administration Server**, **Node Manager**, and **Topology**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-advanced-configuration.png" alt-text="Windows - Oracle Configuration Wizard - Advanced Configurations." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-advanced-configuration.png":::

Select **Next**, fill in the administration **Server Name** with *admin*. Fill in the **Listen IP Address** with the private IP for the  `adminVM` you obtained previously. In this example, the value is `192.168.0.4`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-server.png" alt-text="Windows - Oracle Configuration Wizard - Administration Server." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-admin-server.png":::

Select **Next**. For **Node Manager Type**, select **Per Domain Custom Location**, and fill in the location with *C:\domains\wlsd\nodemanager*. This location should be filled in as the default. For **Node Manager Credentials**, the username is *weblogic* and the password is *Secret123456*.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-nodemanager.png" alt-text="Windows - Oracle Configuration Wizard - Node Manager." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-nodemanager.png":::

Select **Next**. For managed servers, add the following items:

| Server name | Listen address                      | Listen port |
|-------------|-------------------------------------|-------------|
| `msp1`      | The private IP address of `mspVM1`. | `8001`      |
| `msp2`      | The private IP address of `mspVM2`. | `8001`      |

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-domain-configuration-managed-servers.png" alt-text="Windows - Oracle Configuration Wizard - Managed Servers." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-domain-configuration-managed-servers.png":::

Select **Next**. Create a cluster with name `cluster1`. You can leave the **Cluster Address**, **Frontend Host**, and other values blank.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-cluster.png" alt-text="Windows - Oracle Configuration Wizard - Cluster." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-cluster.png":::

Select **Next**. Don't change the values for **Server Templates** or **Dynamic Servers**.

For **Assign Servers to Clusters**, assign both `msp1` and `msp2` to `cluster1`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-cluster.png" alt-text="Windows - Oracle Configuration Wizard - Assign Servers to Clusters." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-cluster.png":::

Select **Next**. Add machines `adminVM`, `mspVM1`, and `mspVM2`.

| Name      | Node manager listen address          | Node manager listen port |
|-----------|--------------------------------------|--------------------------|
| `mspVM1`  | The private IP address of `mspVM1`.  | `5556`                   |
| `mspVM2`  | The private IP address of `mspVM2`.  | `5556`                   |
| `adminVM` | The private IP address of `adminVM`. | `5556`                   |

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-domain-configuration-machines.png" alt-text="Windows - Oracle Configuration Wizard - Machines." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-domain-configuration-machines.png":::

Select **Next**. For **Assign Servers to Machines**, assign server `admin` to `adminVM`, `msp1` to `mspVM1`, and `msp2` to `mspVM2`.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-machines.png" alt-text="Windows - Oracle Configuration Wizard - Assign Servers to Machines." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-assign-servers-to-machines.png":::

Select **Next**. You're shown the **Configuration Summary**, as shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-summary.png" alt-text="Windows - Oracle Configuration Wizard - Configuration Summary" lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-summary.png":::

Carefully examine the summary to verify everything looks as expected. Select **Create**. The **Configuration Progress** page shows the progress. All the listed items should be configured successfully.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png" alt-text="Windows - Oracle Configuration Wizard - Configuration Progress." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png":::

Select **Next**. Finally, the URL of the Administration Server is shown. The server isn't yet running, and you don't need this URL anyway, so select **Finish**.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-end.png" alt-text="Windows - Oracle Configuration Wizard - End." lightbox="media/migrate-weblogic-to-vm-manually/winserv22-wls-configure-domain-end.png":::

You've now finished configuring the `wlsd` domain with a cluster `cluster1` including two managed servers.

#### Install the PostgreSQL JDBC driver

This tutorial shows you how to connect PostgreSQL within the Oracle WebLogic cluster. First, you install the PostgreSQL JDBC driver.

Assuming you're still on `adminVM`, download [postgresql-42.2.8.jar](https://jdbc.postgresql.org/download/postgresql-42.2.8.jar) and save it to *C:\domains\wlsd\lib*. Libraries in this folder are added to the server classpath when it's booted. Then, run the following commands in a command prompt.

```cmd
C:
cd C:\domains\wlsd\lib
curl --output postgresql-42.2.8.jar https://jdbc.postgresql.org/download/postgresql-42.2.8.jar
```

Next, apply the domain configuration to `mspVM1` and `mspVM2`.

#### Create replicas using the pack and unpack command

This tutorial uses the WLS pack and unpack command to extend the domain. For more information, see [Overview of the Pack and Unpack Commands](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.3/wldpu/overview-pack-and-unpack-commands.html#GUID-D37A439D-EB49-40AC-BDA8-0E362E35827F). Use the following steps to create the replicas.

1. First, pack the domain configuration on `adminVM` by following these instructions:

   Remote connect to the machine and run the following command.

   ```cmd
   cd C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin
   pack.cmd -domain=C:\domains\wlsd -managed=true -template=C:\Temp\cluster.jar -template_name="wlsd"
   ```

   You're shown output similar to the following example if the command completes successfully.

   ```output
   C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin>pack.cmd -domain=C:\domains\wlsd -managed=true -template=C:\Temp\cluster.jar -template_name="wlsd"
   << read domain from "C:/domains/wlsd"
   >>  succeed: read domain from "C:/domains/wlsd"
   << set config option Managed to "true"
   >>  succeed: set config option Managed to "true"
   << write template to "C:/Temp/cluster.jar"
   ..............................
   >>  succeed: write template to "C:/Temp/cluster.jar"
   << close template
   >>  succeed: close template
   ```

   Then, copy *C:\Temp\cluster.jar* to `mspVM1` and `mspVM2` and save to the same path.

1. Next, apply the domain configuration to `mspVM1`.

   Remote connect to the machine and run the following command.

   ```cmd
   cd C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin
   unpack.cmd -domain=C:\domains\wlsd -template=C:\Temp\cluster.jar
   ```

   You're shown output similar to the following example if the command completes successfully.

   ```output
   C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin>unpack.cmd -domain=C:\domains\wlsd -template=C:\Temp\cluster.jar
   << read template from "C:/Temp/cluster.jar"
   >>  succeed: read template from "C:/Temp/cluster.jar"
   << set config option DomainName to "wlsd"
   >>  succeed: set config option DomainName to "wlsd"
   >>  validateConfig "KeyStorePasswords"
   >>  succeed: validateConfig "KeyStorePasswords"
   << write Domain to "C:\domains\wlsd"
   ..................................................
   >>  succeed: write Domain to "C:\domains\wlsd"
   << close template
   >>  succeed: close template
   ```

   Next, rename the configuration file *config_bootstrap.xml* to *config.xml*. In the command prompt, run the following commands:

   ```cmd
   cd C:\domains\wlsd\config
   ren config_bootstrap.xml config.xml
   ```

1. Next, apply the domain configuration to `mspVM2`.

   Remote connect to the machine and run the following command.

   ```cmd
   cd C:\Oracle\Middleware\Oracle_Home\oracle_common\common\bin
   unpack.cmd -domain=C:\domains\wlsd -template=C:\Temp\cluster.jar
   ```

   Then, rename the configuration file *config_bootstrap.xml* to *config.xml*:

   ```cmd
   cd C:\domains\wlsd\config
   ren config_bootstrap.xml config.xml
   ```

> [!NOTE]
> The unpack command generates the *config_bootstrap.xml* file based on the *config.xml* file in the template, which may cause error `java.io.FileNotFoundException: C:\domains\wlsd\.\config\config.xml (The system cannot find the file specified)` when starting the managed server. This tutorial renames *config_bootstrap.xml* to *config.xml* to avoid this problem.

You've now replicated the domain configuration on `mspVM1` and `mspVM2`, so you're ready to start the servers.

### Set up the WebLogic Server as a Windows service

This section uses a Windows service to configure Oracle WebLogic Server to start automatically when you boot a Windows host computer. For more information, see [Setting Up a WebLogic Server Instance as a Windows Service](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/start/winservice.html#GUID-6A5A23B2-2EAB-4C3E-8711-B7BA49C50D75).

> [!NOTE]
> This section doesn't enable graceful shutdowns. If you use the Microsoft Management Console to stop a server instance, it kills the server's Java Virtual Machine (JVM). If you kill the JVM, the server immediately stops all processing. To set up graceful shutdowns, see [Enabling Graceful Shutdowns](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/start/winservice.html#GUID-3F42708A-EC0C-451F-B8C7-68C9EAE2BD8B).

#### Set up the Administration Server as Windows service

You're now ready to start the Administration Server. Use the following instructions to create a Windows service to start the Administration Server.

Remote connect to `adminVM`. In the command prompt, change to the directory *C:\domains\wlsd*. Enter *startWebLogic.cmd*. For the credentials of the admin account, enter *weblogic* for the username and *Secret123456* for the password. If the server is running, it prints a line to standard out that is similar to the following output:

```output
... ...
Enter username to boot WebLogic server:weblogic
Enter password to boot WebLogic server:Secret123456

... ...
<Oct 18, 2022, 6:48:56,997 AM Coordinated Universal Time> <Notice> <WebLogicServer> <BEA-000365> <Server state changed to RUNNING.>
```

Create a Boot Identity file *C:\domains\wlsd\servers\admin\security\boot.properties* and save the admin account user name and password to the file. For more information, see [Boot Identity Files](https://docs.oracle.com/en/middleware/standalone/weblogic-server/14.1.1.0/start/overview.html#GUID-FAA04F2F-41F3-4632-8B40-620B8A67E856). Paste the following text into a command prompt.

```cmd
MKDIR C:\domains\wlsd\servers\admin\security
TYPE CON > C:\domains\wlsd\servers\admin\security\boot.properties
username=weblogic
password=Secret123456
```

Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

Next, create a Windows service for the Administration Server. Paste the following text into a command prompt. Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

```cmd
TYPE CON > C:\domains\wlsd\autoStartup.cmd
echo off
SETLOCAL
set MW_HOME=C:\Oracle\Middleware\Oracle_Home
set DOMAIN_NAME=wlsd
set USERDOMAIN_HOME=C:\domains\wlsd
set SERVER_NAME=admin
set WL_HOME=C:\Oracle\Middleware\Oracle_Home\wlserver
set DOMAIN_PRODUCTION_MODE=true
call "C:\domains\wlsd\bin\setDomainEnv.cmd"
call "C:\Oracle\Middleware\Oracle_Home\wlserver\server\bin\installSvc.cmd"
ENDLOCAL
```

Run the newly created file. Enter *C:\domains\wlsd\autoStartup.cmd*. The command prompt runs the script as a batch file.

If the script runs successfully, it creates a Windows service named `wlsd_admin` and prints a line to standard out that is similar to the following output:

```output
... ...
wlsvc wlsd_admin installed.
```

This example uses node manager to control managed servers. Create a Windows service for node manager on `adminVM`.

In the command prompt, change to the directory *C:\domains\wlsd\bin*. Enter *installNodeMgrSvc.cmd*. If the service is created successfully, it prints a line to standard out that is similar to the following output:

```output
... ...
Oracle Weblogic wlsd NodeManager (C_Oracle_MIDDLE~1_ORACLE~1_wlserver) installed.
```

Finally, restart the machine to activate the Windows services.

#### Configure and start the managed servers

Next, set up the node manager as a Windows service on `mspVM1` and `mspVM2`.

Remote connect to `mspVM1` and `mspVM2`, open a command prompt, and then change to directory *C:\domains\wlsd\bin*. Enter *installNodeMgrSvc.cmd*. If the service is created successfully, it prints a line to standard out that is similar to the following output:

```output
... ...
Oracle Weblogic wlsd NodeManager (C_Oracle_MIDDLE~1_ORACLE~1_wlserver) installed.
```

Restart `mspVM1` and `mspVM2` to start the node manager.

Next, start the managed server from the Administration Console portal. Open a browser on `adminVM` and use the following steps to start the server:

[!INCLUDE [start-managed-server](includes/wls-manual-guidance-start-managed-server.md)]

#### Set up the managed server as a Windows service

The steps in this section show how to create a Windows service for each of the managed servers. This service starts the managed server automatically when the machine is rebooted.

1. Use the following instructions to set up `msp1` as a Windows service.

   Remote connect to `mspVM1`. Open a command prompt and paste the following text, replacing `ADMIN_URL` with the actual value. Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

   ```cmd
   TYPE CON > C:\domains\wlsd\autoStartup.cmd
   echo off
   SETLOCAL
   set MW_HOME=C:\Oracle\Middleware\Oracle_Home
   set DOMAIN_NAME=wlsd
   set USERDOMAIN_HOME=C:\domains\wlsd
   set SERVER_NAME=msp1
   set ADMIN_URL=http://192.168.0.4:7001
   set WL_HOME=C:\Oracle\Middleware\Oracle_Home\wlserver
   set DOMAIN_PRODUCTION_MODE=true
   call "C:\domains\wlsd\bin\setDomainEnv.cmd"
   call "C:\Oracle\Middleware\Oracle_Home\wlserver\server\bin\installSvc.cmd"
   ENDLOCAL
   ```

   Enter *C:\domains\wlsd\autoStartup.cmd*. The command prompt runs the script as a batch file.

   Create a Boot Identity file *C:\domains\wlsd\servers\msp1\security\boot.properties* and save the admin account user name and password to the file.

   Paste the following text into a command prompt.

   ```cmd
   MKDIR C:\domains\wlsd\servers\msp1\security
   TYPE CON > C:\domains\wlsd\servers\msp1\security\boot.properties
   username=weblogic
   password=Secret123456
   ```

   Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

1. Set up `msp2` as a Windows service

   Remote connect to `mspVM2`. Open a command prompt and paste the following text, replacing `ADMIN_URL` with the actual value. Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

   ```cmd
   TYPE CON > C:\domains\wlsd\autoStartup.cmd
   echo off
   SETLOCAL
   set MW_HOME=C:\Oracle\Middleware\Oracle_Home
   set DOMAIN_NAME=wlsd
   set USERDOMAIN_HOME=C:\domains\wlsd
   set SERVER_NAME=msp2
   set ADMIN_URL=http://192.168.0.4:7001
   set WL_HOME=C:\Oracle\Middleware\Oracle_Home\wlserver
   set DOMAIN_PRODUCTION_MODE=true
   call "C:\domains\wlsd\bin\setDomainEnv.cmd"
   call "C:\Oracle\Middleware\Oracle_Home\wlserver\server\bin\installSvc.cmd"
   ENDLOCAL
   ```

   Enter *C:\domains\wlsd\autoStartup.cmd*. The command prompt runs the script as a batch file.

   Create a Boot Identity file *C:\domains\wlsd\servers\msp1\security\boot.properties* and save the admin account user name and password to the file.

   Paste the following text into a command prompt.

   ```cmd
   MKDIR C:\domains\wlsd\servers\msp2\security
   TYPE CON > C:\domains\wlsd\servers\msp2\security\boot.properties
   username=weblogic
   password=Secret123456
   ```

   Press <kbd>Enter</kbd>, <kbd>Ctrl</kbd>+<kbd>Z</kbd>, <kbd>Enter</kbd>.

Now, the managed servers start up automatically when the machine restarts.

### Remove the public IPs

In order to remote connect to the Windows Server machines, all of them are assigned a public IP address. Now that the configuration is done, there's no need to keep the public IP address. For security, remove the public IP addresses from `adminVM`, `mspVM1`, and `mspVM2`, as shown in the following example. For more information, see [Dissociate a public IP address from an Azure VM](/azure/virtual-network/ip-services/remove-public-ip-address-vm).

```azurecli
ADMINVM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name adminVM \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
ADMINVM_NIC_NAME=$(az network nic show \
    --ids ${ADMINVM_NIC_ID} \
    --query name \
    --output tsv)
ADMINVM_NIC_IP_CONFIG=$(az network nic show \
    --ids $ADMINVM_NIC_ID \
    --query ipConfigurations[0].name \
    --output tsv)
ADMINVM_PUBLIC_IP=$(az network nic show \
    --ids ${ADMINVM_NIC_ID} \
    --query ipConfigurations[0].publicIpAddress.id \
    --output tsv)
ADMINVM_NSG_ID=$(az network nic show \
    --ids ${ADMINVM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)

az network nic ip-config update \
   --name ${ADMINVM_NIC_IP_CONFIG} \
   --resource-group abc1110rg \
   --nic-name ${ADMINVM_NIC_NAME} \
   --remove PublicIpAddress
az network public-ip delete --ids ${ADMINVM_PUBLIC_IP}
az network nic update \
   --resource-group abc1110rg \
   --name ${ADMINVM_NIC_NAME} \
   --remove networkSecurityGroup
az network nsg delete --ids ${ADMINVM_NSG_ID}

MSPVM1VM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name mspVM1 \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
MSPVM1VM_NIC_NAME=$(az network nic show \
    --ids ${MSPVM1VM_NIC_ID} \
    --query name \
    --output tsv)
MSPVM1VM_NIC_IP_CONFIG=$(az network nic show \
    --ids ${MSPVM1VM_NIC_ID} \
    --query ipConfigurations[0].name \
    --output tsv)
MSPVM1VM_PUBLIC_IP=$(az network nic show \
    --ids ${MSPVM1VM_NIC_ID} \
    --query ipConfigurations[0].publicIpAddress.id \
    --output tsv)
MSPVM1VM_NSG_ID=$(az network nic show \
    --ids ${MSPVM1VM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)

az network nic ip-config update \
 --name ${MSPVM1VM_NIC_IP_CONFIG} \
 --resource-group abc1110rg \
 --nic-name ${MSPVM1VM_NIC_NAME} \
 --remove PublicIpAddress
az network public-ip delete --ids ${MSPVM1VM_PUBLIC_IP}
az network nic update \
   --resource-group abc1110rg \
   --name ${MSPVM1VM_NIC_NAME} \
   --remove networkSecurityGroup
az network nsg delete --ids ${MSPVM1VM_NSG_ID}

MSPVM2VM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name mspVM2 \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
MSPVM2VM_NIC_NAME=$(az network nic show \
    --ids ${MSPVM2VM_NIC_ID} \
    --query name \
    --output tsv)
MSPVM2VM_NIC_IP_CONFIG=$(az network nic show \
    --ids ${MSPVM2VM_NIC_ID} \
    --query ipConfigurations[0].name \
    --output tsv)
MSPVM2VM_PUBLIC_IP=$(az network nic show \
    --ids ${MSPVM2VM_NIC_ID} \
    --query ipConfigurations[0].publicIpAddress.id \
    --output tsv)
MSPVM2VM_NSG_ID=$(az network nic show \
    --ids ${MSPVM2VM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)

az network nic ip-config update \
    --name ${MSPVM2VM_NIC_IP_CONFIG} \
    --resource-group abc1110rg \
    --nic-name ${MSPVM2VM_NIC_NAME} \
    --remove PublicIpAddress
az network public-ip delete --ids ${MSPVM2VM_PUBLIC_IP}
az network nic update \
   --resource-group abc1110rg \
   --name ${MSPVM2VM_NIC_NAME} \
   --remove networkSecurityGroup
az network nsg delete --ids ${MSPVM2VM_NSG_ID}
```

---

## Expose WLS with Azure Application Gateway

Now that you've created the WebLogic Server (WLS) cluster on either Windows or GNU/Linux virtual machines, this section walks you through the process of exposing WLS to the internet with Azure Application Gateway.

### Create the Azure Application Gateway

To expose WLS to the internet, a public IP address is required. Create the public IP address and then associate an Azure Application gateway with it. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create it, as shown in the following example:

```azurecli
az network public-ip create \
    --resource-group abc1110rg \
    --name myAGPublicIPAddress \
    --allocation-method Static \
    --sku Standard
```

You add the backend servers to Application Gateway backend pool. Query backend IP addresses using the following commands.

```azurecli
ADMINVM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name adminVM \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
ADMINVM_IP=$(az network nic show \
    --ids ${ADMINVM_NIC_ID} \
    --query ipConfigurations[0].privateIpAddress \
    --output tsv)
MSPVM1_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name mspVM1 \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
MSPVM1_IP=$(az network nic show \
    --ids ${MSPVM1_NIC_ID} \
    --query ipConfigurations[0].privateIpAddress \
    --output tsv)
MSPVM2_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name mspVM2 \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
MSPVM2_IP=$(az network nic show \
    --ids ${MSPVM2_NIC_ID} \
    --query ipConfigurations[0].privateIpAddress \
    --output tsv)
```

Next, create an Azure Application Gateway. The following example creates an application gateway with managed servers in the default backend pool.

```azurecli
az network application-gateway create \
    --resource-group abc1110rg \
    --name myAppGateway \
    --public-ip-address myAGPublicIPAddress \
    --location eastus \
    --capacity 2 \
    --http-settings-port 80 \
    --http-settings-protocol Http \
    --frontend-port 80 \
    --sku Standard_V2 \
    --subnet wlsVMGateway \
    --vnet-name myVNet \
    --priority 1001 \
    --servers ${MSPVM1_IP} ${MSPVM2_IP}
```

After the application gateway is created, you can see these new features:

- `appGatewayBackendPool` - A backend address pool includes the managed servers.
- `appGatewayBackendHttpSettings` - Specifies that port 80 and an HTTP protocol is used for communication.
- `rule1` - The default routing rule that's associated with *appGatewayHttpListener*.

The managed servers expose their workloads with port `8001`. Use the following commands to update the `appGatewayBackendHttpSettings` by specifying backend port `8001` and creating a probe for it.

```azurecli
az network application-gateway probe create \
    --resource-group abc1110rg \
    --gateway-name myAppGateway \
    --name clusterProbe \
    --protocol http \
    --host 127.0.0.1 \
    --path /weblogic/ready

az network application-gateway http-settings update \
    --resource-group abc1110rg \
    --gateway-name myAppGateway \
    --name appGatewayBackendHttpSettings \
    --port 8001 \
    --probe clusterProbe
```

The next commands provision a basic rule `rule1`. This example adds a path to the Administration Server. First, use the following commands to create a URL path map:

```azurecli
az network application-gateway address-pool create \
    --resource-group abc1110rg \
    --gateway-name myAppGateway \
    --name adminServerAddressPool \
    --servers ${ADMINVM_IP}

az network application-gateway probe create \
    --resource-group abc1110rg \
    --gateway-name myAppGateway \
    --name adminProbe \
    --protocol http \
    --host 127.0.0.1 \
    --path /weblogic/ready

az network application-gateway http-settings create \
    --resource-group abc1110rg \
    --gateway-name myAppGateway \
    --name adminBackendSettings \
    --port 7001 \
    --protocol Http \
    --probe adminProbe

az network application-gateway url-path-map create \
    --gateway-name myAppGateway \
    --name urlpathmap \
    --paths /console/* \
    --resource-group abc1110rg \
    --address-pool adminServerAddressPool \
    --default-address-pool appGatewayBackendPool \
    --default-http-settings appGatewayBackendHttpSettings \
    --http-settings adminBackendSettings \
    --rule-name consolePathRule
```

Next, use [az network application-gateway rule update](/cli/azure/network/application-gateway/rule#az-network-application-gateway-rule-update) to update the rule type to be `PathBasedRouting`.

```azurecli
az network application-gateway rule update \
    --gateway-name myAppGateway \
    --name rule1 \
    --resource-group abc1110rg \
    --http-listener appGatewayHttpListener \
    --rule-type PathBasedRouting \
    --url-path-map urlpathmap \
    --priority 1001 \
    --address-pool appGatewayBackendPool \
    --http-settings appGatewayBackendHttpSettings
```

You're now able to access the Administration Server with the URL `http://<gateway-public-ip-address>/console/`. Run the following commands to get the URL.

```azurecli
APPGATEWAY_IP=$(az network public-ip show \
    --resource-group abc1110rg \
    --name myAGPublicIPAddress \
    --query [ipAddress] \
    --output tsv)
echo "admin console URL is http://${APPGATEWAY_IP}/console/"
```

Verify that you can log into the Administration Server console. If you can't, troubleshoot and resolve the problem before proceeding.

> [!NOTE]
> This example sets up simple access to the WebLogic servers with HTTP. If you want secure access, configure SSL/TLS termination by follow the instructions in [End to end TLS with Application Gateway](/azure/application-gateway/ssl-overview).
>
> This example exposes the Administration Server console via the Application Gateway. Don't do this in a production environment.

## Connect Azure Database for PostgreSQL

This section shows you how to create a PostgreSQL instance on Azure and configure a connection to PostgreSQL on your WLS cluster. Remember that you installed the PostgreSQL JDBC driver in an earlier step. This driver is required.

### Create an Azure Database for PostgreSQL instance

Use [az postgres server create](/cli/azure/postgres/server#az-postgres-server-create) to provision a PostgreSQL instance on Azure.

```azurecli
DB_SERVER_NAME="wlsdb$(date +%s)"
az postgres server create \
    --resource-group abc1110rg \
    --name ${DB_SERVER_NAME}  \
    --location eastus \
    --admin-user weblogic \
    --ssl-enforcement Enabled \
    --admin-password Secret123456 \
    --sku-name GP_Gen5_2
```

[!INCLUDE [create-azure-database-for-postgresql](includes/create-azure-database-for-postgresql.md)]

### Configure the database connection for the WLS cluster

Now that you've started the database server and obtained the necessary resource ID, the steps in this section use the WebLogic Administration Console portal to configure a datasource connection with the PostgreSQL instance created previously.

1. Open a web browser.
1. Navigate to the Administration Console portal with the URL `http://<gateway-public-ip-address>/console/`, then sign in with your admin account and password. In this example, they're `weblogic/Secret123456`.
1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
1. Expand **Services**, then select **Data Sources**. Select **New**, then **Generic Data Source**.

   1. For **JDBC Data Source Properties**, fill in **Name** with the value *CargoTrackerDB*, and **JNDI Name** with the value *jdbc/CargoTrackerDB*. For **Database Type**, select **PostgreSQL**. These values are specific to the sample application you deploy later. If you're deploying a different application, use the correct values for that application. Select **Next**.
   1. For **Database Driver**, ensure that **PostgreSQL's Driver** is selected. There should be only one value matching that description. Select **Next**.
   1. Under **Transaction Options**:
      1. Leave **Supports Global Transactions** at its default value.
      1. Select **Emulate Two-Phase Commit**. Select **Next**.
   1. For **Connection Properties**, fill in **Database Name** with the value *postgres*. Fill in **Host Name** with the host name of the PostgreSQL instance. The value is `${DB_PRIVATE_IP}` in this example.
   1. Leave **Port** at its default value.
   1. Fill in **Database Username** with the user name of the PostgreSQL server. In this example, the value is `weblogic@${DB_SERVER_NAME}`.
   1. For password, in this example, the value is *Secret123456*. Select **Next**.
   1. Select **Test configuration**. You're shown a message saying "Connection test succeeded", as the following screenshot shows. If you don't see this message, troubleshoot and resolve the problem before continuing.

      :::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection.png" alt-text="Screenshot of Oracle Configuration Wizard - Create Datasource." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection.png":::

   1. Select **Finish**.

1. You can determine that there's a datasource named **CargoTrackerDB** listed in **Summary of JDBC Data Sources**, **Configuration** page. Select **CargoTrackerDB** and **Targets**. Under **Clusters**, select `cluster1`, then select **Save**.
1. Under the **Change Center**, if such a button exists, select **Activate Changes**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.

   :::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection-activate-changes.png" alt-text="Screenshot of Oracle Configuration Wizard - Create JDBC Datasource - Activate Changes." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection-activate-changes.png":::

1. You should see the message "All changes have been activated. No restarts are necessary.".

## Configure the JMS servers

The steps in this section use the WebLogic Administration Console portal to configure JMS for the sample app. Follow these steps to add JMS Servers to the cluster.

1. Select the home of the administration console.
1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
1. Expand **Services** then **Messaging**. Select **JMS Servers**. Select **New**. Add the five JMS servers in the following table to `cluster1`. These values are specific to the sample application you deploy later. If you're deploying a different application, use the correct values for that application. For each server listed in the table, follow these steps:

   1. Enter the name and select **Next**.
   1. Leave the **Persistent Store** at its default value. Select **Next**.
   1. Set the **Target** to `cluster1`.
   1. Select **Finish**.

   Complete this process for all rows in the following table. It's essential that there are no typos in the **Name** field.

   | Name                                    | Persistent store | Target     |
   |-----------------------------------------|------------------|------------|
   | `CargoHandledQueue`                     | None             | `cluster1` |
   | `DeliveredCargoQueue`                   | None             | `cluster1` |
   | `HandlingEventRegistrationAttemptQueue` | None             | `cluster1` |
   | `MisdirectedCargoQueue`                 | None             | `cluster1` |
   | `RejectedRegistrationAttemptsQueue`     | None             | `cluster1` |

1. Under the **Change Center**, if such a button exists, select **Activate Changes**. If this button exists, you must complete this step. Failure to complete this step causes the changes you made to not take effect. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**. To minimize the chance of error, compare your values with the following screenshot.

   :::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-jms-activate-changes.png" alt-text="Screenshot of Oracle Configuration Wizard - Create JMS Datasource - Activate Changes." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-jms-activate-changes.png":::

1. You should see the message "All changes have been activated. No restarts are necessary.".

## Deploy Eclipse Cargo Tracker

This section shows how to deploy Eclipse Cargo Tracker to the WLS cluster. Eclipse Cargo Tracker is an applied Domain-Driven Design Blueprints for Jakarta EE.

1. Following these instructions to build Eclipse Cargo Tracker:

   Use the following command to clone the source code from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/cargotracker-azure --branch=20221123
   ```

   Build the source code.

   ```bash
   mvn -DskipTests clean install -PweblogicVmCluster --file cargotracker-azure/pom.xml
   ```

   This command creates the file *cargotracker-azure/target/cargo-tracker.war*. You upload this file in the next step.

1. Use the following steps to deploy Eclipse Cargo Tracker:

   1. Open a web browser.
   1. Navigate to the Administration Console portal with the URL `http://<gateway-public-ip-address>/console/`, then sign in with your admin account and password. In this example, they're `weblogic/Secret123456`.
   1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
   1. Under **Domain Structure**, select **Deployments**. If you see an error message similar to `Unexpected error encountered while obtaining monitoring information for applications.`, you can safely ignore it. Select **Configuration** then **Install**. Nestled within the text is a hyperlink with the text **Upload your files**. Select it. Select **Choose file** , then select the *cargo-tracker.war* built in the preceding step. Select **Next** then **Next**.
   1. Ensure that **Install this deployment as an application** is selected. Select **Next**.
   1. Under **Available targets for cargo-tracker**, select deployment target `cluster1`, and then select **Next** then **Finish**.
   1. Under the **Change Center**, if such a button exists, select **Activate Changes**. You must complete this step. Failure to complete this step causes the changes you made to not take effect. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
   1. Under **Domain Structure**, select **Deployments** then **Control**. Select **cargo-tracker** then select **Start**, **Servicing all requests**.
   1. Select **Yes**.
   1. You're shown a message saying "Start requests have been sent to the selected deployments." The status of the application must be **Active**.

## Test the WLS cluster configuration

You've now finished configuring the WLS cluster and deploying the Java EE application to it. Use the following steps to access the application to validate all the settings.

1. Open a web browser.
1. Navigate to the application with the URL `http://<gateway-public-ip-address>/cargo-tracker/`.
1. To explore the application, follow the steps in [Exploring the Application](https://github.com/Azure-Samples/cargotracker-azure#exploring-the-application).

## Clean up resources

Delete `abc1110rg` with the following command:

```azurecli
az group delete --name abc1110rg --yes --no-wait
```

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
