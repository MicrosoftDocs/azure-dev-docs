---
title: "Tutorial: Install JBoss EAP on Azure Virtual Machines manually"
description: Provides step-by-step guidance to install JBoss EAP on Azure VMs and form a cluster, expose it with Azure Application Gateway, and connect with Azure Database for PostgreSQL.
author: KarlErickson
ms.author: zhengchang
ms.topic: how-to
ms.date: 03/20/2023
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm, migration-java, devx-track-azurecli
---

# Tutorial: Install JBoss EAP on Azure Virtual Machines manually

This tutorial shows the steps to install JBoss EAP and configure a cluster in domain mode on Azure Virtual Machines (VMs), on Red Hat Enterprise Linux(RHEL).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a custom virtual network and create the VMs within the network.
> - Install the desired JDK and JBoss EAP on the VMs by using the command-line manually.
> - Configure a JBoss EAP cluster in domain mode using the command-line interface(CLI).
> - Configure a PostgreSQL datasource connection in the cluster.
> - Deploy and run a sample Java EE application in the cluster.
> - Expose the application to the public internet via Azure Application Gateway.
> - Validate the successful configuration.

If you prefer a fully automated solution that does all of these steps on your behalf on GNU/Linux VMs, directly from the Azure portal, see [Quickstart: Deploy JBoss EAP Server on an Azure virtual machine using the Azure portal](../ee/jboss-eap-single-server-azure-vm.md).

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Install Azure CLI version 2.37.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- Ensure you have the necessary Red Hat licenses. You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for JBoss EAP. This entitlement will let the Azure portal install the Red Hat tested and certified JBoss EAP version.
  > [!NOTE]
  > If you don't have an EAP entitlement, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Write down the account details, which will be used as the *RHSM username* and *RHSM password* in the next section.
- After you're registered, you can find the necessary credentials (*Pool IDs*) by following steps below. The *Pool IDs* will also be used as the *RHSM Pool ID with EAP entitlement* later.
  - Sign in to your [Red Hat account](https://sso.redhat.com).
  - The first time you sign in, you'll be asked to complete your profile. Make sure you select **Personal** for the **Account Type**, as shown in the following screenshot.
    
    :::image type="content" source="media/jboss-eap-single-server-azure-vm/update-account-type-as-personal.png" alt-text="Screenshot of selecting 'Personal' for the 'Account Type'." lightbox="media/jboss-eap-single-server-azure-vm/update-account-type-as-personal.png":::

  - In the tab where you're signed in, open [Red Hat Developer Subscription for Individuals](https://aka.ms/red-hat-individual-dev-sub). This link takes you to all of the subscriptions in your account for the appropriate SKU.
  - Select the first subscription from the **All purchased Subscriptions** table.
  - Copy and write down the value following **Master Pools** from **Pool IDs**.

- A Java JDK, Version 11. In this guide we recommend [Red Hat Build of OpenJDK](https://developers.redhat.com/products/openjdk/download). Ensure that your `JAVA_HOME` environment variable is set correctly in the shells in which you run the commands.
- [Git](https://git-scm.com/downloads); use `git --version` to test whether `git` works. This tutorial was tested with version 2.25.1.
- [Maven](https://maven.apache.org/download.cgi); use `mvn -version` to test whether `mvn` works. This tutorial was tested with version 3.6.3.

## Prepare the environment

In this section, you'll set up the infrastructure within which you'll install the JDK, JBoss EAP, and the PostgreSQL JDBC driver.

### Assumptions

This tutorial will configure a JBoss EAP cluster in domain mode with an administration server and two managed servers on a total of three VMs. To configure the cluster, you need to create the following 3 Azure VMs:

- The admin VM (VM name `adminVM`) has the administration server running.
- The managed VMs (VM names `mspVM1` and `mspVM2`) have two managed servers running.

### Sign in to Azure

If you haven't already, sign in to your Azure subscription by using the [az login](/cli/azure/reference-index) command and follow the on-screen directions.

```azurecli
az login
```

> [!NOTE]
> If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this with the `--tenant` option. For example, `az login --tenant contoso.onmicrosoft.com`.

### Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). Resource group names must be globally unique within a subscription. For this reason, consider prepending some unique identifier to any names you create that must be unique. A useful technique is to use your initials followed by today's date in `mmdd` format. This example creates a resource group named `abc1110rg` in the `eastus` location:

```azurecli
az group create \
    --name abc1110rg \
    --location eastus
```

### Create a virtual network

The resources comprising your JBoss EAP cluster must communicate with each other, and the public internet, using a virtual network. For a complete guide to planning your virtual network, see the Cloud Adoption Framework for Azure guide [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm). For more information, see [Azure Virtual Network frequently asked questions](/azure/virtual-network/virtual-networks-faq).

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

Create a subnet for Application Gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `jbossVMGatewaySubnet`:

```azurecli
az network vnet subnet create \
    --resource-group abc1110rg \
    --name jbossVMGatewaySubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.0.128/25
```

### Create a Network Security Group(NSG) and assign subnets to it

Before we create VMs with public IPs, to secure the virtual network and subnets created above, let create a network security group.

Create a network security group by using [az network nsg create](/cli/azure/network/nsg?view=azure-cli-latest#az-network-nsg-create). The following example creates a network security group named `mynsg`:

```azurecli
az network nsg create \
    --resource-group abc1110rg \
    --name mynsg
```

Create network security group rules by using [az network nsg rule create](/cli/azure/network/nsg/rule?view=azure-cli-latest#az-network-nsg-rule-create). The following example creates network security group rules named `ALLOW_APPGW` and `ALLOW_HTTP_ACCESS`:

```azurecli
az network nsg rule create --resource-group abc1110rg --nsg-name mynsg --name ALLOW_APPGW --protocol Tcp --destination-port-ranges 65200-65535 --source-address-prefix GatewayManager --destination-address-prefix '*' --access Allow --priority 500 --direction Inbound

az network nsg rule create --resource-group abc1110rg --nsg-name mynsg --name ALLOW_HTTP_ACCESS --protocol Tcp --destination-port-ranges 22 80 443 9990 --source-address-prefix Internet --destination-address-prefix '*' --access Allow --priority 510 --direction Inbound
```

Associate the subnets created above to this network security group by using [az network vnet subnet update](/cli/azure/network/vnet/subnet?view=azure-cli-latest#az-network-vnet-subnet-update).

```azurecli
az network vnet subnet update --vnet-name myVNet --name mySubnet --network-security-group mynsg --resource-group abc1110rg

az network vnet subnet update --vnet-name myVNet --name jbossVMGatewaySubnet --network-security-group mynsg --resource-group abc1110rg
```

### Create an Red Hat Enterprise Linux machine for admin

#### Create public IP address for admin VM

```azurecli
az network public-ip create \
    --resource-group abc1110rg \
    --name adminPublicIp \
    --allocation-method static \
    --public-ip-sku Standard
```

#### Create network interface for admin VM

```azurecli
az network nic create \
    --resource-group abc1110rg \
    --name adminNic \
    --vnet-name myVnet \
    --subnet mySubnet \
    --public-ip-address adminPublicIp
```

#### Create the admin VM

The Marketplace image that you use to create the VMs is `RedHat:RHEL:8_6:latest`.

> [!NOTE]
> You can query all the available Red Hat Enterprise Linux images provided by Oracle with [az vm image list](/cli/azure/vm/image#az-vm-image-list) `az vm image list --offer RHEL --publisher RedHat --output table --all`. For more information, see [Oracle VM images and their deployment on Microsoft Azure](/azure/virtual-machines/workloads/oracle/oracle-vm-solutions).
>
> If you use a different image, you may need to install extra libraries to enable the infrastructure used in this guide.

You'll create a basic VM, install all required tools on it, take a snapshot of it, and then create replicas based on the snapshot.

Create a VM using [az vm create](/cli/azure/vm). You'll run the Administration Server on this VM.

The following example creates an Red Hat Enterprise Linux VM using user name and password pair for the authentication. If desired, you can use SSL authentication instead.

```azurecli
az vm create \
    --resource-group abc1110rg \
    --name adminVM \
    --image RedHat:RHEL:8_6:latest \
    --size Standard_DS1_v2  \
    --admin-username azureuser \
    --admin-password Secret123456 \
    --nics adminNic
```

### Create machines for managed servers

You've now installed Oracle GraalVM (or another approved JVM), Oracle WebLogic Server 14c Enterprise Edition, and PostgreSQL JDBC driver on `adminVM`, which will run the WLS Administration Server. You still need to prepare machines to run the two managed servers. Next, you'll create a snapshot of `adminVM` and prepare machines for two managed severs, `mspVM1` and `mspVM2`.

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
   #Get the snapshot ID
   SNAPSHOT_ID=$(az snapshot show \
       --name myAdminOSDiskSnapshot \
       --resource-group abc1110rg \
       --query [id] \
       --output tsv)

   #Create a new Managed Disks using the snapshot Id
   #Note that managed disk will be created in the same location as the snapshot
   az disk create \
       --resource-group abc1110rg \
       --name mspVM1_OsDisk_1 \
       --source ${SNAPSHOT_ID}
   ```

   Next, create VM `mspVM1`, attaching OS disk `mspVM1_OsDisk_1`:

   ```azurecli
   #Get the resource Id of the managed disk
   MSPVM1_DISK_ID=$(az disk show \
       --name mspVM1_OsDisk_1 \
       --resource-group abc1110rg \
       --query [id] \
       --output tsv)

   #Create VM by attaching existing managed disks as OS
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

   When the command completes successfully, you'll see output similar to this:

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

Now, all three machines are ready. Next, you'll configure a WebLogic cluster.

### Configure WebLogic Server domain and cluster

[!INCLUDE [configure-domain](includes/wls-manual-guidance-configure-domain.md)]

#### Create the domain using the configuration wizard

You'll keep using the X-server and Oracle Configuration Wizard to create the WLS domain.

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

The Oracle Configuration Wizard starts and directs you to configure the domain. The following page asks for domain type and location. Select **Create a new domain** and set domain location to */u01/domains/wlsd*. The domain configuration will be saved to this folder.

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

Select **Next**. You'll find the **Configuration Summary**, which should look like the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-gnu-linux-configuration-summary.png" alt-text="Screenshot of Oracle Configuration Wizard - Configuration Summary." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-gnu-linux-configuration-summary.png":::

Select **Create**. The **Configuration Progress** page will show the progress. All the listed items should be configured successfully.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png" alt-text="Screenshot of Oracle Configuration Wizard - Configuration Progress." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-configuration-progress.png":::

Finally, there's an **End of Configuration** page to show the URL of the Administration Server.

:::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-end.png" alt-text="Screenshot of Oracle Configuration Wizard - End." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-end.png":::

The Administration Server isn't running, so the URL will not resolve. Select **Next**, then **Finish**. You've now finished configuring the `wlsd` domain with a cluster `cluster1` including two managed servers.

Next, apply the domain configuration to `mspVM1` and `mspVM2`.

You'll use the pack and unpack command to extend the domain.

#### Create replicas using the pack and unpack command

This tutorial uses the WLS pack and unpack command to extend the domain. For more information, see [Overview of the Pack and Unpack Commands](https://docs.oracle.com/en/middleware/fusion-middleware/12.2.1.3/wldpu/overview-pack-and-unpack-commands.html#GUID-D37A439D-EB49-40AC-BDA8-0E362E35827F).

1. Pack the domain configuration on `adminVM` with the following steps, assuming you're still on `adminVM` and logged in with the `oracle` user.

   ```bash
   cd /u01/app/wls/install/oracle/middleware/oracle_home/oracle_common/common/bin
   bash pack.sh -domain=/u01/domains/wlsd -managed=true -template=/tmp/cluster.jar -template_name="wlsd"
   ```

   If the command is completed successfully, you'll see output similar the following example.

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

   You'll be asked for the password for the connection. For this example, the password is *Secret123456*.

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

   If the command completes successfully, you'll see output similar to the following example.

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

   You'll be asked for a password for the connection. For this example, the password is *Secret123456*.

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

These two tasks are not easily separated, so the steps for the two tasks are intermixed.

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

#### Enable the admin sever and node manager to start automatically after VM restart

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

At this point, you can access the admin server on the browser of `myWindowsVM` with the URL `http://<adminvm-private-ip>:7001/console`. Verify that you can view the admin server, but don't sign in just yet. If the admin server is not running, troubleshoot and resolve the problem before proceeding. The admin server is not accessible outside of Azure.

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

Now, you'll create a Linux service for node manager, to start the process automatically on machine reboot. For more information, see [Use systemd on Oracle Linux](https://docs.oracle.com/en/learn/use_systemd/index.html).

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

If the node manager is running successfully, you'll see logs similar to the following example:

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

If the node manager is running successfully, you'll see logs similar to the following example:

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

```azurecli
WINDOWSVM_NIC_ID=$(az vm show \
    --resource-group abc1110rg \
    --name myWindowsVM \
    --query networkProfile.networkInterfaces[0].id \
    --output tsv)
WINDOWSVM_NSG_ID=$(az network nic show \
    --ids ${WINDOWSVM_NIC_ID} \
    --query networkSecurityGroup.id \
    --output tsv)
WINDOWSVM_DISK_ID=$(az vm show \
    --resource-group abc1110rg \
    --name myWindowsVM \
    --query storageProfile.osDisk.managedDisk.id \
    --output tsv)
WINDOWSVM_PUBLIC_IP=$(az network nic show \
    --ids ${WINDOWS_NIC_ID} \
    --query ipConfigurations[0].publicIpAddress.id \
    --output tsv)

echo "deleting myWindowsVM"
az vm delete --resource-group abc1110rg --name myWindowsVM --yes
echo "deleting nic ${WINDOWSVM_NIC_ID}"
az network nic delete --ids ${WINDOWS_NIC_ID}
echo "deleting public-ip ${WINDOWSVM_PUBLIC_IP}"
az network public-ip delete --ids ${WINDOWSVM_PUBLIC_IP}
echo "deleting disk ${WINDOWSVM_DISK_ID}"
az disk delete --yes --ids ${WINDOWSVM_DISK_ID}
echo "deleting nsg ${WINDOWSVM_NSG_ID}"
az network nsg delete --ids ${WINDOWSVM_NSG_ID}
```

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

You'll add the backend servers to Application Gateway backend pool. Query backend IP addresses using the following commands.

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

The next commands provision a basic rule `rule1`. This example will add a path to the Administration Server. First, use the following commands to create a URL path map:

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

Create a private endpoint for the PostgreSQL server in your Virtual Network:

```azurecli
DB_RESOURCE_ID=$(az resource show \
    --resource-group abc1110rg \
    --name ${DB_SERVER_NAME} \
    --resource-type "Microsoft.DBforPostgreSQL/servers" \
    --query "id" \
    --output tsv)
az network private-endpoint create \
    --name myPrivateEndpoint \
    --resource-group abc1110rg \
    --vnet-name myVNet  \
    --subnet mySubnet \
    --private-connection-resource-id ${DB_RESOURCE_ID} \
    --group-id postgresqlServer \
    --connection-name myConnection
```

This example will use the private IP address of the PostgreSQL server for the datasource connection. The FQDN in the customer DNS setting doesn't resolve to the private IP configured. If you want set up a DNS zone for the configured FQDN, follow the steps in [Configure the Private DNS Zone](/azure/postgresql/single-server/how-to-configure-privatelink-cli#configure-the-private-dns-zone).

Run the following command to get private IP address of the PostgreSQL server:

```azurecli
DB_PRIVATE_IP=$(az network private-endpoint show \
    --resource-group abc1110rg \
    --name myPrivateEndpoint \
    --query customDnsConfigs[0].ipAddresses[0] \
    --output tsv)
echo ${DB_PRIVATE_IP}
```

### Configure the database connection for the WLS cluster

Now that you've started the database server and obtained the necessary resource ID, the steps in this section use the WebLogic Administration Console portal to configure a datasource connection with the PostgreSQL instance created previously.

1. Open a web browser.
1. Navigate to the Administration Console portal with the URL `http://<gateway-public-ip-address>/console/`, then sign in with your admin account and password. In this example, they're `weblogic/Secret123456`.
1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
1. Expand **Services**, then select **Data Sources**. Select **New**, then **Generic Data Source**.

   1. For **JDBC Data Source Properties**, fill in **Name** with the value *CargoTrackerDB*, and **JNDI Name** with the value *jdbc/CargoTrackerDB*. For **Database Type**, select **PostgreSQL**. These values are specific to the sample application you'll deploy later. If you're deploying a different application, use the correct values for that application. Select **Next**.
   1. For **Database Driver**, ensure that **PostgreSQL's Driver** is selected. There should be only one value matching that description. Select **Next**.
   1. Under **Transaction Options**:
      1. Leave **Supports Global Transactions** at its default value.
      1. Select **Emulate Two-Phase Commit**. Select **Next**.
   1. For **Connection Properties**, fill in **Database Name** with the value *postgres*. Fill in **Host Name** with the host name of the PostgreSQL instance. The value is `${DB_PRIVATE_IP}` in this example.
   1. Leave **Port** at its default value.
   1. Fill in **Database Username** with the user name of the PostgreSQL server. In this example, the value is `weblogic@${DB_SERVER_NAME}`.
   1. For password, in this example, the value is *Secret123456*. Select **Next**.
   1. Select **Test configuration**. You'll find a message saying "Connection test succeeded", as the following screenshot shows. If you don't see this message, troubleshoot and resolve the problem before continuing.

      :::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection.png" alt-text="Screenshot of Oracle Configuration Wizard - Create Datasource." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection.png":::

   1. Select **Finish**.

1. You'll find that there's a datasource named **CargoTrackerDB** listed in **Summary of JDBC Data Sources**, **Configuration** page. Select **CargoTrackerDB** and **Targets**. Under **Clusters**, select `cluster1`, then select **Save**.
1. Under the **Change Center**, if such a button exists, select **Activate Changes**. If this button doesn't exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.

   :::image type="content" source="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection-activate-changes.png" alt-text="Screenshot of Oracle Configuration Wizard - Create JDBC Datasource - Activate Changes." lightbox="media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-db-connection-activate-changes.png":::

1. You should see the message "All changes have been activated. No restarts are necessary.".

## Configure the JMS servers

The steps in this section use the WebLogic Administration Console portal to configure JMS for the sample app. Follow these steps to add JMS Servers to the cluster.

1. Select the home of the administration console.
1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button does not exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
1. Expand **Services** then **Messaging**. Select **JMS Servers**. Select **New**. Add the five JMS servers in the following table to `cluster1`. These values are specific to the sample application you'll deploy later. If you're deploying a different application, use the correct values for that application. For each server listed in the table, follow these steps:

   1. Enter the name and select **Next**.
   1. Leave the **Persistent Store** at its default value. Select **Next**.
   1. Set the **Target** to `cluster1`.
   1. Select **Finish**.

   Compelte this process for all rows in the following table. It is absolutely essential that there are no typos in the **Name** field.

   | Name                                    | Persistent store | Target     |
   |-----------------------------------------|------------------|------------|
   | `CargoHandledQueue`                     | None             | `cluster1` |
   | `DeliveredCargoQueue`                   | None             | `cluster1` |
   | `HandlingEventRegistrationAttemptQueue` | None             | `cluster1` |
   | `MisdirectedCargoQueue`                 | None             | `cluster1` |
   | `RejectedRegistrationAttemptsQueue`     | None             | `cluster1` |

1. Under the **Change Center**, if such a button exists, select **Activate Changes**. If this button exists, you must complete this step. Failure to complete this step causes the changes you made to not take effect. If this button does not exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**. To minimize the chance of error, compare your values with the following screenshot.

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

   This creates the file *cargotracker-azure/target/cargo-tracker.war*. You'll upload this file in the next step.

1. Use the following steps to deploy Eclipse Cargo Tracker:

   1. Open a web browser.
   1. Navigate to the Administration Console portal with the URL `http://<gateway-public-ip-address>/console/`, then sign in with your admin account and password. In this example, they're `weblogic/Secret123456`.
   1. Under the **Change Center**, if such a button exists, select **Lock and Edit**. If this button does not exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
   1. Under **Domain Structure**, select **Deployments**. If you see an error message similar to `Unexpected error encountered while obtaining monitoring information for applications.`, you can safely ignore it. Select **Configuration** then **Install**. Nestled within the text is a hyperlink with the text **Upload your files**. Select it. Select **Choose file** , then select the *cargo-tracker.war* built in the preceding step. Select **Next** then **Next**.
   1. Ensure that **Install this deployment as an application** is selected. Select **Next**.
   1. Under **Available targets for cargo-tracker**, select deployment target `cluster1`, and then select **Next** then **Finish**.
   1. Under the **Change Center**, if such a button exists, select **Activate Changes**. You must complete this step. Failure to complete this step causes the changes you made to not take effect. If this button does not exist, verify that some text such as "Future changes will automatically be activated as you modify, add or delete items in this domain" exists under **Change Center**.
   1. Under **Domain Structure**, select **Deployments** then **Control**. Select **cargo-tracker** then select **Start**, **Servicing all requests**.
   1. Select **Yes**.
   1. You'll find a message saying "Start requests have been sent to the selected deployments." The status of the application must be **Active**.

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
