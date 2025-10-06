---
title: "Tutorial: Install JBoss EAP on Azure Virtual Machines (VMs) manually"
description: Provides step-by-step guidance to install Red Hat JBoss EAP on Azure VMs and set up a cluster, expose it with Azure Application Gateway, and connect with Azure Database for PostgreSQL Flexible Server.
author: KarlErickson
ms.author: karler
ms.topic: how-to
ms.date: 05/29/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-javaee, devx-track-javaee-jbosseap, devx-track-javaee-jbosseap-vm, migration-java, devx-track-azurecli, linux-related-content
---

# Tutorial: Install JBoss EAP on Azure Virtual Machines (VMs) manually

This tutorial shows the steps to install Red Hat JBoss Enterprise Application Platform (EAP) and configure a cluster in domain mode on Azure Virtual Machines (VMs), on Red Hat Enterprise Linux (RHEL).

In this tutorial, you learn how to do the following tasks:

> [!div class="checklist"]
>
> - Create a custom virtual network and create the VMs within the network.
> - Install the desired JDK and Red Hat JBoss EAP on the VMs by using the command line manually.
> - Configure a Red Hat JBoss EAP cluster in domain mode using the command-line interface (CLI).
> - Configure a PostgreSQL datasource connection in the cluster.
> - Deploy and run a sample Java EE application in the cluster.
> - Expose the application to the public internet via Azure Application Gateway.
> - Validate the successful configuration.

If you prefer a fully automated solution that does all of these steps on your behalf on GNU/Linux VMs, directly from the Azure portal, see [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing JBoss EAP on Azure solutions, fill out this short [survey on JBoss EAP migration](https://aka.ms/jboss-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we'll remove it from this article.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- [Install Azure CLI version 2.51.0 or higher](/cli/azure/install-azure-cli) to run Azure CLI commands.
  - When you're prompted, install Azure CLI extensions on first use. For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- Ensure you have the necessary Red Hat licenses. You need to have a Red Hat Account with Red Hat Subscription Management (RHSM) entitlement for Red Hat JBoss EAP. This entitlement lets the fully automated solution (in [Quickstart: Deploy a JBoss EAP cluster on Azure Virtual Machines (VMs)](/azure/virtual-machines/workloads/redhat/jboss-eap-azure-vm?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)) install the Red Hat tested and certified JBoss EAP version.
  > [!NOTE]
  > If you don't have an EAP entitlement, you can sign up for a free developer subscription through the [Red Hat Developer Subscription for Individuals](https://developers.redhat.com/register). Save aside the account details, which is used as the **RHSM username** and **RHSM password** in the next section.
- If you're already registered, or after you complete registration, you can locate the necessary credentials (*Pool IDs*) by using the following steps. These Pool IDs are also used as the **RHSM Pool ID with EAP entitlement** value in subsequent steps.
  1. Sign in to your [Red Hat account](https://sso.redhat.com).
  1. The first time you sign in, you're prompted to complete your profile. Depending on your usage, select either **Personal** or **Corporate** for **Account Type**, as shown in the following screenshot:

     :::image type="content" source="media/migrate-jboss-eap-to-vm-manually/update-account-type-as-personal.png" alt-text="Screenshot of the Red Hat account window that shows the Account Type options with Personal selected." lightbox="media/migrate-jboss-eap-to-vm-manually/update-account-type-as-personal.png":::

  1. Open [Red Hat Developer Subscription for Individuals](https://aka.ms/red-hat-individual-dev-sub). This link takes you to all of the subscriptions in your account for the appropriate SKU.
  1. In the row of controls under **All purchased Subscriptions** table, select **Active**.
  1. Select the sortable column header for **End Date** until the value furthest in the future is shown as the first row.
  1. Select the first row. Then, copy and save aside the value following **Master Pools** from **Pool IDs**.

- A Java Development Kit (JDK), version 11. In this guide, we recommend [Red Hat Build of OpenJDK](https://developers.redhat.com/products/openjdk/download). Ensure that your `JAVA_HOME` environment variable is set correctly in the shells in which you run the commands.
- [Git](https://git-scm.com/downloads); use `git --version` to test whether `git` works. This tutorial was tested with version 2.25.1.
- [Maven](https://maven.apache.org/download.cgi); use `mvn -version` to test whether `mvn` works. This tutorial was tested with version 3.6.3.

## Prepare the environment

In this section, you set up the infrastructure within which you install the JDK, Red Hat JBoss EAP, and the PostgreSQL Java Database Connectivity (JDBC) driver.

### Assumptions

This tutorial configures a Red Hat JBoss EAP cluster in domain mode with an administration server and two managed servers on a total of three VMs. To configure the cluster, you need to create the following three Azure VMs:

- An admin VM (VM name `adminVM`) runs as the domain controller.
- Two managed VMs (VM names `mspVM1` and `mspVM2`) run as host controller.

### Sign in to Azure

If you haven't already, sign in to your Azure subscription by using the [az login](/cli/azure/reference-index) command and following the on-screen directions.

```azurecli
az login
```

> [!NOTE]
> If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this with the `--tenant` option. For example, `az login --tenant contoso.onmicrosoft.com`.

### Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). Resource group names must be globally unique within a subscription. For this reason, consider prepending some unique identifier to any names you create that must be unique. A useful technique is to use your initials followed by today's date in `mmdd` format. This example creates a resource group named `$RESOURCE_GROUP_NAME` in the `westus` location:

```azurecli
export SUBSCRIPTION=$(az account show --query id --output tsv)
export SUFFIX=$(date +%s)
export RESOURCE_GROUP_NAME=rg-$SUFFIX
echo "Resource group name: $RESOURCE_GROUP_NAME"
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location westus
```

### Create a virtual network

The resources comprising your Red Hat JBoss EAP cluster must communicate with each other, and the public internet, using a virtual network. For a complete guide to planning your virtual network, see the Cloud Adoption Framework for Azure guide [Plan virtual networks](/azure/virtual-network/virtual-network-vnet-plan-design-arm). For more information, see [Azure Virtual Network frequently asked questions](/azure/virtual-network/virtual-networks-faq).

The example in this section creates a virtual network with address space `192.168.0.0/16` and creates a subnet used for VMs.

First, create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a network named `myVNet`:

```azurecli
az network vnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myVNet \
    --address-prefixes 192.168.0.0/24
```

Create a subnet for the Red Hat JBoss EAP cluster by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `mySubnet`:

```azurecli
az network vnet subnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mySubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.0.0/25
```

Create a subnet for Application Gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `jbossVMGatewaySubnet`:

```azurecli
az network vnet subnet create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name jbossVMGatewaySubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.0.128/25
```

### Create a network security group and assign subnets to it

Before you create VMs with public IPs, create a network security group (NSG) to secure the virtual network and subnets created previously.

Create a network security group by using [az network nsg create](/cli/azure/network/nsg#az-network-nsg-create). The following example creates a network security group named `mynsg`:

```azurecli
az network nsg create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mynsg
```

Create network security group rules by using [az network nsg rule create](/cli/azure/network/nsg/rule#az-network-nsg-rule-create). The following example creates network security group rules named `ALLOW_APPGW` and `ALLOW_HTTP_ACCESS`. These rules allow App Gateway to accept inbound traffic on the HTTP ports used by Red Hat JBoss EAP:

```azurecli
az network nsg rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --nsg-name mynsg \
    --name ALLOW_APPGW \
    --protocol Tcp \
    --destination-port-ranges 65200-65535 \
    --source-address-prefix GatewayManager \
    --destination-address-prefix '*' \
    --access Allow \
    --priority 500 \
    --direction Inbound

az network nsg rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --nsg-name mynsg \
    --name ALLOW_HTTP_ACCESS \
    --protocol Tcp \
    --destination-port-ranges 22 80 443 9990 8080 \
    --source-address-prefix Internet \
    --destination-address-prefix '*' \
    --access Allow \
    --priority 510 \
    --direction Inbound
```

Associate the subnets created previously to this network security group by using [az network vnet subnet update](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-update), as shown in the following example:

```azurecli
az network vnet subnet update \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name myVNet \
    --name mySubnet \
    --network-security-group mynsg

az network vnet subnet update \
    --resource-group $RESOURCE_GROUP_NAME \
    --vnet-name myVNet \
    --name jbossVMGatewaySubnet \
    --network-security-group mynsg
```

### Create a Red Hat Enterprise Linux machine for admin

### Generate SSH keys 

Use the following command to generate SSH keys for `adminVM`:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/jbosseapvm
ssh-add ~/.ssh/jbosseapvm
```

#### Create the admin VM

The Marketplace image that you use to create the VMs is `RedHat:rhel-raw:86-gen2:latest`. For other images, see [Red Hat Enterprise Linux (RHEL) images available in Azure](/azure/virtual-machines/workloads/redhat/redhat-imagelist).

> [!NOTE]
> You can query all the available Red Hat Enterprise Linux images provided by Red Hat with the [az vm image list](/cli/azure/vm/image#az-vm-image-list) command - for example: `az vm image list --offer RHEL --publisher RedHat --output table --all`. For more information, see [Overview of Red Hat Enterprise Linux images](/azure/virtual-machines/workloads/redhat/redhat-images).
>
> If you use a different image, you may need to install extra libraries to enable the infrastructure used in this guide.

Create a basic VM, install all required tools on it, take a snapshot of it, and then create replicas based on the snapshot.

Create a VM using [az vm create](/cli/azure/vm). You run the Administration Server on this VM.

The following example creates an Azure Managed Identity and a Red Hat Enterprise Linux VM using use TLS/SSL authentication.

### [JBOSS EAP 7.4](#tab/jboss-eap-74)

```azurecli
az identity create \
    --name "passwordless-managed-identity" \
    --resource-group $RESOURCE_GROUP_NAME \
    --location westus

az vm create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminVM \
    --image RedHat:rhel-raw:86-gen2:latest \
    --assign-identity "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/passwordless-managed-identity" \
    --size Standard_DS1_v2  \
    --admin-username azureuser \
    --ssh-key-values ~/.ssh/jbosseapvm.pub \
    --public-ip-sku Standard \
    --nsg mynsg \
    --vnet-name myVnet \
    --subnet mySubnet
```
### [JBOSS EAP 8](#tab/jboss-eap-8)

```azurecli
az identity create \
    --name "passwordless-managed-identity" \
    --resource-group $RESOURCE_GROUP_NAME \
    --location westus

az vm create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminVM \
    --image RedHat:rhel-raw:94_gen2:latest \
    --assign-identity "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/passwordless-managed-identity" \
    --size Standard_DS1_v2  \
    --admin-username azureuser \
    --ssh-key-values ~/.ssh/jbosseapvm.pub \
    --public-ip-sku Standard \
    --nsg mynsg \
    --vnet-name myVnet \
    --subnet mySubnet
```

---

#### Install Red Hat JBoss EAP

Use the following steps to install:

1. Use the following command to get the public IP of `adminVM`:

   ```azurecli
   export ADMIN_VM_PUBLIC_IP=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --show-details \
       --query publicIps | tr -d '"')
   ```

1. Open a terminal and SSH to the `adminVM` by using the following command:

   ```bash
   ssh -i ~/.ssh/jbosseapvm azureuser@$ADMIN_VM_PUBLIC_IP
   ```

1. Configure firewall for ports by using the following command:

   ```bash
   sudo firewall-cmd --zone=public --add-port={9999/tcp,8443/tcp,8009/tcp,8080/tcp,9990/tcp,9993/tcp,45700/tcp,7600/tcp} --permanent
   sudo firewall-cmd --reload
   sudo iptables-save
   ```

   You should see the word `success` after the first two commands. You should see output similar to the following example after the third command:

   ```output
   # Generated by iptables-save v1.8.4 on Wed Mar 29 22:39:23 2023
   *filter
   :INPUT ACCEPT [20:3546]
   :FORWARD ACCEPT [0:0]
   :OUTPUT ACCEPT [24:5446]
   COMMIT
   # Completed on Wed Mar 29 22:39:23 2023
   # Generated by iptables-save v1.8.4 on Wed Mar 29 22:39:23 2023
   *security
   :INPUT ACCEPT [19:3506]
   :FORWARD ACCEPT [0:0]
   :OUTPUT ACCEPT [5:492]
   -A OUTPUT -d 168.63.129.16/32 -p tcp -m tcp --dport 53 -j ACCEPT
   -A OUTPUT -d 168.63.129.16/32 -p tcp -m tcp --dport 53 -j ACCEPT
   -A OUTPUT -d 168.63.129.16/32 -p tcp -m owner --uid-owner 0 -j ACCEPT
   -A OUTPUT -d 168.63.129.16/32 -p tcp -m conntrack --ctstate INVALID,NEW -j DROP
   COMMIT
   # Completed on Wed Mar 29 22:39:23 2023
   # Generated by iptables-save v1.8.4 on Wed Mar 29 22:39:23 2023
   *raw
   :PREROUTING ACCEPT [20:3546]
   :OUTPUT ACCEPT [24:5446]
   COMMIT
   # Completed on Wed Mar 29 22:39:23 2023
   # Generated by iptables-save v1.8.4 on Wed Mar 29 22:39:23 2023
   *mangle
   :PREROUTING ACCEPT [20:3546]
   :INPUT ACCEPT [20:3546]
   :FORWARD ACCEPT [0:0]
   :OUTPUT ACCEPT [24:5446]
   :POSTROUTING ACCEPT [24:5446]
   COMMIT
   # Completed on Wed Mar 29 22:39:23 2023
   # Generated by iptables-save v1.8.4 on Wed Mar 29 22:39:23 2023
   *nat
   :PREROUTING ACCEPT [1:40]
   :INPUT ACCEPT [0:0]
   :POSTROUTING ACCEPT [4:240]
   :OUTPUT ACCEPT [4:240]
   COMMIT
   # Completed on Wed Mar 29 22:39:23 2023
   ```
> [!NOTE]
> The `RHSM_USER` and `RHSM_PASSWORD` values are required to install Red Hat JBoss EAP. We recommend that you use a service account with limited permissions to access the Red Hat Customer Portal. 

2. Use the following commands to register the admin host to your Red Hat Subscription Management (RHSM) account:

   ```bash
   export RHSM_USER=<your-rhsm-username>
   export RHSM_PASSWORD='<your-rhsm-password>'
   export EAP_POOL=<your-rhsm-pool-ID>
 
   sudo subscription-manager register --username ${RHSM_USER} --password ${RHSM_PASSWORD} --force
   ```

   [!INCLUDE [security-note](../includes/security-note.md)]

   You should see output similar to the following example:

   ```output
   Registering to: subscription.rhsm.redhat.com:443/subscription
   The system has been registered with ID: redacted
   The registered system name is: adminVM
   ```

1. Use the following command to attach the admin host to Red Hat JBoss EAP pool:

   ```bash
   sudo subscription-manager attach --pool=${EAP_POOL}
   ```

   > [!NOTE]
   > This command is ignored if you're using [Simple Content Access](https://access.redhat.com/articles/4903191) mode.

1. Use the following commands to install Red Hat JBoss EAP :

   ### [JBOSS EAP 7.4](#tab/jboss-eap-74)

   ```bash
   sudo subscription-manager repos --enable=jb-eap-7.4-for-rhel-8-x86_64-rpms
   sudo yum update -y --disablerepo='*' --enablerepo='*microsoft*'
   sudo yum groupinstall -y jboss-eap7
   ```
   ### [JBOSS EAP 8](#tab/jboss-eap-8)

   ```bash
   sudo subscription-manager repos --enable=jb-eap-8.0-for-rhel-9-x86_64-rpms
   sudo yum update -y --disablerepo='*' --enablerepo='*microsoft*'
   sudo yum groupinstall -y jboss-eap8
   ```

   ---

   For the second and third commands, you should see many lines of output, ending with `Complete!`

1. Use the following commands set permission and network configurations:

   ```bash
   sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config
   echo 'AllowTcpForwarding no' | sudo tee -a /etc/ssh/sshd_config
   sudo systemctl restart sshd
   ```

1. Use the following commands to configure the environment variables:

   ### [JBOSS EAP 7.4](#tab/jboss-eap-74)

   ```bash
   echo 'export EAP_RPM_CONF_DOMAIN="/etc/opt/rh/eap7/wildfly/eap7-domain.conf"' >> ~/.bash_profile
   echo 'export EAP_HOME="/opt/rh/eap7/root/usr/share/wildfly"' >> ~/.bash_profile
   source ~/.bash_profile
   sudo touch /etc/profile.d/eap_env.sh
   echo 'export EAP_HOME="/opt/rh/eap7/root/usr/share/wildfly"' | sudo tee -a /etc/profile.d/eap_env.sh
   ```

    ### [JBOSS EAP 8](#tab/jboss-eap-8)
    
    ```bash
    echo 'export EAP_RPM_CONF_DOMAIN="/etc/opt/rh/eap8/wildfly/eap8-domain.conf"' >> ~/.bash_profile
    echo 'export EAP_HOME="/opt/rh/eap8/root/usr/share/wildfly"' >> ~/.bash_profile
    source ~/.bash_profile
    sudo touch /etc/profile.d/eap_env.sh
    echo 'export EAP_HOME="/opt/rh/eap8/root/usr/share/wildfly"' | sudo tee -a /etc/profile.d/eap_env.sh
    ```

    ---

1. Exit from the SSH connection by typing **exit**.

### Create machines for managed servers

You installed Red Hat JBoss EAP on `adminVM`, which runs as the domain controller server. You still need to prepare machines to run the two host controller servers. Next, you create a snapshot of `adminVM` and prepare machines for two managed severs, `mspVM1` and `mspVM2`.

This section introduces an approach to prepare machines with the snapshot of `adminVM`. Return to your terminal that has Azure CLI signed in, then use the following steps:

1. Use the following command to stop `adminVM`:

   ```azurecli
   az vm stop --resource-group $RESOURCE_GROUP_NAME --name adminVM
   ```

1. Use [az snapshot create](/cli/azure/snapshot#az-snapshot-create) to take a snapshot of the `adminVM` OS disk, as shown in the following example:

   ```azurecli
   export ADMIN_OS_DISK_ID=$(az vm show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name adminVM \
       --query storageProfile.osDisk.managedDisk.id \
       --output tsv)
   az snapshot create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAdminOSDiskSnapshot \
       --source ${ADMIN_OS_DISK_ID}
   ```

1. Use the following command to start `adminVM`:

   ```azurecli
   az vm start --resource-group $RESOURCE_GROUP_NAME --name adminVM
   ```

1. Use the following steps to create `mspVM1`:

   1. First, create a managed disk for `mspVM1` with [az disk create](/cli/azure/disk#az-disk-create):

      ```azurecli
      #Get the snapshot ID
      export SNAPSHOT_ID=$(az snapshot show \
          --name myAdminOSDiskSnapshot \
          --resource-group $RESOURCE_GROUP_NAME \
          --query '[id]' \
          --output tsv)

      #Create a new Managed Disks using the snapshot Id
      #Note that managed disk is created in the same location as the snapshot
      az disk create \
          --resource-group $RESOURCE_GROUP_NAME \
          --name mspVM1_OsDisk_1 \
          --source ${SNAPSHOT_ID}
      ```

   1. Next, use the following commands to create VM `mspVM1`, attaching OS disk `mspVM1_OsDisk_1`:

      ```azurecli
      #Get the resource Id of the managed disk
      export MSPVM1_DISK_ID=$(az disk show \
          --name mspVM1_OsDisk_1 \
          --resource-group $RESOURCE_GROUP_NAME \
          --query '[id]' \
          --output tsv)

      #Create VM by attaching existing managed disks as OS
      az vm create \
          --resource-group $RESOURCE_GROUP_NAME \
          --name mspVM1 \
          --assign-identity "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/passwordless-managed-identity" \
          --attach-os-disk ${MSPVM1_DISK_ID} \
          --os-type linux \
          --public-ip-sku Standard \
          --nsg mynsg \
          --vnet-name myVnet \
          --subnet mySubnet
      ```

   1. You created `mspVM1` with Red Hat JBoss EAP installed. Because the VM was created from a snapshot of the `adminVM` OS disk, the two VMs have the same hostname. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the hostname to the value `mspVM1`:

      ```azurecli
      az vm run-command invoke \
          --resource-group $RESOURCE_GROUP_NAME \
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

1. Use the same commands to create `mspVM2`:

   ```azurecli
   #Create a new Managed Disks for mspVM2
   az disk create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2_OsDisk_1 \
       --source ${SNAPSHOT_ID}

   #Get the resource Id of the managed disk
   export MSPVM2_DISK_ID=$(az disk show \
       --name mspVM2_OsDisk_1 \
       --resource-group $RESOURCE_GROUP_NAME \
       --query '[id]' \
       --output tsv)

   #Create VM by attaching existing managed disks as OS
   az vm create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --assign-identity "/subscriptions/$SUBSCRIPTION/resourceGroups/$RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/passwordless-managed-identity" \
       --attach-os-disk ${MSPVM2_DISK_ID} \
       --os-type linux \
       --public-ip-sku Standard \
       --nsg mynsg \
       --vnet-name myVnet \
       --subnet mySubnet

   #Set hostname
   az vm run-command invoke \
       --resource-group $RESOURCE_GROUP_NAME \
       --name mspVM2 \
       --command-id RunShellScript \
       --scripts "sudo hostnamectl set-hostname mspVM2"
   ```

[!INCLUDE [start-admin-get-ips](includes/wls-manual-guidance-start-admin-and-get-ip.md)]

Now, all three machines are ready. Next, you configure a Red Hat JBoss EAP cluster in managed domain mode.

### Configure managed domain and cluster

Configure the cluster with session replication enabled. For more information, see [Session Replication](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/development_guide/clustering_in_web_applications#session_replication).

To enable session replication, use Red Hat JBoss EAP High Availability for the cluster. Microsoft Azure doesn't support JGroups discovery protocols that are based on multicast. Although you may use other JGroups discovery protocols (such as a static configuration (`TCPPING`), a shared database (`JDBC_PING`), shared file system-based ping (`FILE_PING`), or `TCPGOSSIP`), we strongly recommend that you use the shared file discovery protocol developed for Azure: `AZURE_PING`. For more information, see [Using JBoss EAP High Availability in Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/using_jboss_eap_in_microsoft_azure/using_jboss_eap_high_availability_in_microsoft_azure#doc-wrapper).

#### Create Azure storage account and Blob container for AZURE_PING

Use the following commands to create a storage account and Blob container:

```azurecli
# Define your storage account name
export STORAGE_ACCOUNT_NAME=azurepingstgabc1111rg
# Define your Blob container name
export CONTAINER_NAME=azurepingcontainerabc1111rg

# Create storage account
az storage account create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name ${STORAGE_ACCOUNT_NAME} \
    --location westus \
    --sku Standard_LRS \
    --kind StorageV2 \
    --access-tier Hot
```

Then, retrieve the storage account key for later use by using the following command. If you see an error, wait a few minutes and try again. The previous command to create the storage account might not be done yet.

```azurecli
export STORAGE_ACCESS_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --query "[0].value" \
    --output tsv)

# Create blob container
az storage container create \
    --name ${CONTAINER_NAME} \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --account-key ${STORAGE_ACCESS_KEY}
```

You should see the following output:

```output
{
  "created": true
}
```

#### Configure domain controller (admin node)

This tutorial uses the Red Hat JBoss EAP management CLI commands to configure the domain controller. For more information, see [Management CLI Guide](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html-single/management_cli_guide/index).

The following steps set up the domain controller configuration on `adminVM`. Use SSH to connect to the `adminVM` as the `azureuser` user. Recall that the public IP address of `adminVM` was captured previously into the `ADMIN_VM_PUBLIC_IP` environment variable.

```bash
ssh -i ~/.ssh/jbosseapvm azureuser@$ADMIN_VM_PUBLIC_IP
```

First, use the following commands to configure the HA profile and JGroups using the `AZURE_PING` protocol:


### [JBOSS EAP 7.4](#tab/jboss-eap-74)

```bash
export HOST_VM_IP=$(hostname -I)
export STORAGE_ACCOUNT_NAME=azurepingstgabc1111rg
export CONTAINER_NAME=azurepingcontainerabc1111rg
export STORAGE_ACCESS_KEY=<the-value-from-before-you-connected-with-SSH>


#-Configure the HA profile and JGroups using AZURE_PING protocol
sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --echo-command \
'embed-host-controller --std-out=echo --domain-config=domain.xml --host-config=host-master.xml',\
':write-attribute(name=name,value=domain1)',\
'/profile=ha/subsystem=jgroups/stack=tcp:remove',\
'/profile=ha/subsystem=jgroups/stack=tcp:add()',\
'/profile=ha/subsystem=jgroups/stack=tcp/transport=TCP:add(socket-binding=jgroups-tcp,properties={ip_mcast=false})',\
"/profile=ha/subsystem=jgroups/stack=tcp/protocol=azure.AZURE_PING:add(properties={storage_account_name=\"${STORAGE_ACCOUNT_NAME}\", storage_access_key=\"${STORAGE_ACCESS_KEY}\", container=\"${CONTAINER_NAME}\"})",\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=MERGE3:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FD_SOCK:add(socket-binding=jgroups-tcp-fd)',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FD_ALL:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=VERIFY_SUSPECT:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.NAKACK2:add(properties={use_mcast_xmit=false,use_mcast_xmit_req=false})',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=UNICAST3:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.STABLE:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.GMS:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=MFC:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FRAG3:add',\
'/profile=ha/subsystem=jgroups/channel=ee:write-attribute(name="stack", value="tcp")',\
'/server-group=main-server-group:write-attribute(name="profile", value="ha")',\
'/server-group=main-server-group:write-attribute(name="socket-binding-group", value="ha-sockets")',\
"/host=master/subsystem=elytron/http-authentication-factory=management-http-authentication:write-attribute(name=mechanism-configurations,value=[{mechanism-name=DIGEST,mechanism-realm-configurations=[{realm-name=ManagementRealm}]}])",\
"/host=master/interface=unsecure:add(inet-address=${HOST_VM_IP})",\
"/host=master/interface=management:write-attribute(name=inet-address, value=${HOST_VM_IP})",\
"/host=master/interface=public:add(inet-address=${HOST_VM_IP})"

# Save a copy of the domain.xml, later you need to share it with all host controllers
cp $EAP_HOME/domain/configuration/domain.xml /tmp/domain.xml
```

The last stanza of output should look similar to the following example. If it doesn't, troubleshoot and resolve the problem before continuing.

```output
[domain@embedded /] /host=master/interface=public:add(inet-address=192.168.0.4 )
{
    "outcome" => "success",
    "result" => undefined,
    "server-groups" => undefined,
    "response-headers" => {"process-state" => "reload-required"}
}
02:05:55,019 INFO  [org.jboss.as] (MSC service thread 1-1) WFLYSRV0050: JBoss EAP 7.4.10.GA (WildFly Core 15.0.25.Final-redhat-00001) stopped in 28ms
```

Then, use the following commands to configure the JBoss server and set up the EAP service:

> [!NOTE]
> The `JBOSS_EAP_USER` and `JBOSS_EAP_PASSWORD` values are required to configure the JBoss EAP management user. 

```bash
# Configure the JBoss server and setup EAP service
echo 'WILDFLY_HOST_CONFIG=host-master.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN

# Configure JBoss EAP management user
export JBOSS_EAP_USER=jbossadmin
export JBOSS_EAP_PASSWORD=Secret123456
sudo $EAP_HOME/bin/add-user.sh  -u $JBOSS_EAP_USER -p $JBOSS_EAP_PASSWORD -g 'guest,mgmtgroup'
```

   [!INCLUDE [security-note](../includes/security-note.md)]

The output should look similar to the following example:

```output
Added user 'jbossadmin' to file '/etc/opt/rh/eap7/wildfly/standalone/mgmt-users.properties'
Added user 'jbossadmin' to file '/etc/opt/rh/eap7/wildfly/domain/mgmt-users.properties'
Added user 'jbossadmin' with groups guest,mgmtgroup to file '/etc/opt/rh/eap7/wildfly/standalone/mgmt-groups.properties'
Added user 'jbossadmin' with groups guest,mgmtgroup to file '/etc/opt/rh/eap7/wildfly/domain/mgmt-groups.properties'
```

Finally, use the following commands to start the EAP service:

```bash
# Start the JBoss server and setup EAP service
sudo systemctl enable eap7-domain.service

# Edit eap7-domain.services
sudo sed -i 's/After=syslog.target network.target/After=syslog.target network.target NetworkManager-wait-online.service/' /usr/lib/systemd/system/eap7-domain.service
sudo sed -i 's/Before=httpd.service/Wants=NetworkManager-wait-online.service \nBefore=httpd.service/' /usr/lib/systemd/system/eap7-domain.service

# Reload and restart EAP service
sudo systemctl daemon-reload
sudo systemctl restart eap7-domain.service

# Check the status of EAP service
systemctl status eap7-domain.service
```

The output should look similar to the following example:

```output
● eap7-domain.service - JBoss EAP (domain mode)
   Loaded: loaded (/usr/lib/systemd/system/eap7-domain.service; enabled; vendor>
   Active: active (running) since Thu 2023-03-30 02:11:44 UTC; 5s ago
 Main PID: 3855 (scl)
    Tasks: 82 (limit: 20612)
   Memory: 232.4M
   CGroup: /system.slice/eap7-domain.service
           ├─3855 /usr/bin/scl enable eap7 -- /opt/rh/eap7/root/usr/share/wildf>
           ├─3856 /bin/bash /var/tmp/sclfYu7yW
           ├─3858 /bin/sh /opt/rh/eap7/root/usr/share/wildfly/bin/launch.sh /us>
           ├─3862 /bin/sh /opt/rh/eap7/root/usr/share/wildfly/bin/domain.sh --h>
           ├─3955 /usr/lib/jvm/jre/bin/java -D[Process Controller] -server -Xms>
           └─3967 /usr/lib/jvm/jre/bin/java -D[Host Controller] -Dorg.jboss.boo>

Mar 30 02:11:44 adminVM systemd[1]: Started JBoss EAP (domain mode).
```

Type <kbd>q</kbd> to exit the pager. Exit from the SSH connection by typing **exit**.

### [JBOSS EAP 8](#tab/jboss-eap-8)

```bash
export HOST_VM_IP=$(hostname -I)
export STORAGE_ACCOUNT_NAME=azurepingstgabc1111rg
export CONTAINER_NAME=azurepingcontainerabc1111rg
export STORAGE_ACCESS_KEY=<the-value-from-before-you-connected-with-SSH>


#-Configure the HA profile and JGroups using AZURE_PING protocol
sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --echo-command \
'embed-host-controller --std-out=echo --domain-config=domain.xml --host-config=host-primary.xml',\
':write-attribute(name=name,value=domain1)',\
'/profile=ha/subsystem=jgroups/stack=tcp:remove',\
'/profile=ha/subsystem=jgroups/stack=tcp:add()',\
'/profile=ha/subsystem=jgroups/stack=tcp/transport=TCP:add(socket-binding=jgroups-tcp,properties={ip_mcast=false})',\
"/profile=ha/subsystem=jgroups/stack=tcp/protocol=azure.AZURE_PING:add(properties={storage_account_name=\"${STORAGE_ACCOUNT_NAME}\", storage_access_key=\"${STORAGE_ACCESS_KEY}\", container=\"${CONTAINER_NAME}\"})",\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=MERGE3:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FD_SOCK:add(socket-binding=jgroups-tcp-fd)',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FD_ALL:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=VERIFY_SUSPECT:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.NAKACK2:add(properties={use_mcast_xmit=false,use_mcast_xmit_req=false})',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=UNICAST3:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.STABLE:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=pbcast.GMS:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=MFC:add',\
'/profile=ha/subsystem=jgroups/stack=tcp/protocol=FRAG3:add',\
'/profile=ha/subsystem=jgroups/channel=ee:write-attribute(name="stack", value="tcp")',\
'/server-group=main-server-group:write-attribute(name="profile", value="ha")',\
'/server-group=main-server-group:write-attribute(name="socket-binding-group", value="ha-sockets")',\
"/host=primary/subsystem=elytron/http-authentication-factory=management-http-authentication:write-attribute(name=mechanism-configurations,value=[{mechanism-name=DIGEST,mechanism-realm-configurations=[{realm-name=ManagementRealm}]}])",\
"/host=primary/interface=unsecure:add(inet-address=${HOST_VM_IP})",\
"/host=primary/interface=management:write-attribute(name=inet-address, value=${HOST_VM_IP})",\
"/host=primary/interface=public:add(inet-address=${HOST_VM_IP})"

# Save a copy of the domain.xml, later you need to share it with all host controllers
cp $EAP_HOME/domain/configuration/domain.xml /tmp/domain.xml
```

The last stanza of output should look similar to the following example. If it doesn't, troubleshoot and resolve the problem before continuing.

```output
[domain@embedded /] /host=primary/interface=public:add(inet-address=192.168.0.4 )
{
    "outcome" => "success",
    "result" => undefined,
    "server-groups" => undefined,
    "response-headers" => {"process-state" => "reload-required"}
}
06:22:54,381 INFO  [org.jboss.as] (MSC service thread 1-2) WFLYSRV0050: JBoss EAP 8.0 Update 3.0 (WildFly Core 21.0.10.Final-redhat-00001) stopped in 24ms
```

Then, use the following commands to configure the JBoss server and set up the EAP service:

> [!NOTE]
> The `JBOSS_EAP_USER` and `JBOSS_EAP_PASSWORD` values are required to configure the JBoss EAP management user.
 
```bash
# Configure the JBoss server and setup EAP service
echo 'WILDFLY_HOST_CONFIG=host-primary.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN

# Configure JBoss EAP management user
export JBOSS_EAP_USER=jbossadmin
export JBOSS_EAP_PASSWORD=Secret123456
sudo $EAP_HOME/bin/add-user.sh  -u $JBOSS_EAP_USER -p $JBOSS_EAP_PASSWORD -g 'guest,mgmtgroup'
```

   [!INCLUDE [security-note](../includes/security-note.md)]

The output should look similar to the following example:

```output
Added user 'jbossadmin' to file '/etc/opt/rh/eap8/wildfly/standalone/mgmt-users.properties'
Added user 'jbossadmin' to file '/etc/opt/rh/eap8/wildfly/domain/mgmt-users.properties'
Added user 'jbossadmin' with groups guest,mgmtgroup to file '/etc/opt/rh/eap8/wildfly/standalone/mgmt-groups.properties'
Added user 'jbossadmin' with groups guest,mgmtgroup to file '/etc/opt/rh/eap8/wildfly/domain/mgmt-groups.properties'
```

Finally, use the following commands to start the EAP service:

```bash
# Start the JBoss server and setup EAP service
sudo systemctl enable eap8-domain.service

# Edit eap8-domain.services
sudo sed -i 's/After=syslog.target network.target/After=syslog.target network.target NetworkManager-wait-online.service/' /usr/lib/systemd/system/eap8-domain.service
sudo sed -i 's/Before=httpd.service/Wants=NetworkManager-wait-online.service \nBefore=httpd.service/' /usr/lib/systemd/system/eap8-domain.service

# Reload and restart EAP service
sudo systemctl daemon-reload
sudo systemctl restart eap8-domain.service

# Check the status of EAP service
systemctl status eap8-domain.service
```

The output should look similar to the following example:

```output
● eap8-domain.service - JBoss EAP (domain mode)
     Loaded: loaded (/usr/lib/systemd/system/eap8-domain.service; enabled; pres>
     Active: active (running) since Mon 2024-09-23 15:52:06 UTC; 42ms ago
   Main PID: 2018 (scl)
      Tasks: 5 (limit: 20044)
     Memory: 1.9M
        CPU: 15ms
     CGroup: /system.slice/eap8-domain.service
             ├─2018 /usr/bin/scl enable eap8 -- /opt/rh/eap8/root/usr/share/wil>
             ├─2019 /bin/bash /var/tmp/sclTMatKT
             ├─2022 /bin/sh /opt/rh/eap8/root/usr/share/wildfly/bin/launch.sh />
             ├─2024 /bin/sh /opt/rh/eap8/root/usr/share/wildfly/bin/launch.sh />
             └─2026 "[sed]"

Sep 23 15:52:06 adminVM systemd[1]: Started JBoss EAP (domain mode).
```

Type <kbd>q</kbd> to exit the pager. Exit from the SSH connection by typing **exit**.

---

After starting the Red Hat JBoss EAP service, you can access the management console via `http://$ADMIN_VM_PUBLIC_IP:9990` in your web browser. Sign in with the configured username `jbossadmin` and password `Secret123456`.

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/adminconsole.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform domain controller management console." lightbox="media/migrate-jboss-eap-to-vm-manually/adminconsole.png":::

Select the **Runtime** tab. In the navigation pane, select **Topology**. You should see that for now your cluster only contains one domain controller:

### [JBOSS EAP 7.4](#tab/jboss-eap-74)

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology-only-with-admin.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform that shows the Runtime tab and the Topology pane with domain controller only." lightbox="media/migrate-jboss-eap-to-vm-manually/topology-only-with-admin.png":::

### [JBOSS EAP 8](#tab/jboss-eap-8)

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology-only-with-admin-eap8.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform that shows the Runtime tab and the Topology pane with domain controller only." lightbox="media/migrate-jboss-eap-to-vm-manually/topology-only-with-admin-eap8.png":::

---

#### Configure host controllers (worker nodes)

Use SSH to connect to `mspVM1` as the `azureuser` user. Get the public IP address of the VM with the following command:

```bash
MSPVM_PUBLIC_IP=$(az vm show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM1 \
    --show-details \
    --query publicIps | tr -d '"' )

ssh -A -i ~/.ssh/jbosseapvm azureuser@$MSPVM_PUBLIC_IP
```


Use the following commands to set up the host controller on `mspVM1`:

```bash
# environment variables
export DOMAIN_CONTROLLER_PRIVATE_IP=<adminVM-private-IP>
export HOST_VM_NAME=$(hostname)
export HOST_VM_NAME_LOWERCASE=$(echo "${HOST_VM_NAME,,}")
export HOST_VM_IP=$(hostname -I)

export JBOSS_EAP_USER=jbossadmin
export JBOSS_EAP_PASSWORD=Secret123456

# Save default domain configuration as backup
sudo -u jboss mv $EAP_HOME/domain/configuration/domain.xml $EAP_HOME/domain/configuration/domain.xml.backup

# Fetch domain.xml from domain controller
scp azureuser@${DOMAIN_CONTROLLER_PRIVATE_IP}:/tmp/domain.xml /tmp/domain.xml
sudo mv /tmp/domain.xml $EAP_HOME/domain/configuration/domain.xml
sudo chown jboss:jboss $EAP_HOME/domain/configuration/domain.xml
```

   [!INCLUDE [security-note](../includes/security-note.md)]

Use the following commands to apply host controller changes to `mspVM1`:

### [JBOSS EAP 7.4](#tab/jboss-eap-74)

```bash
# Setup host controller
sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --echo-command \
"embed-host-controller --std-out=echo --domain-config=domain.xml --host-config=host-slave.xml",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=server-one:remove",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=server-two:remove",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=${HOST_VM_NAME_LOWERCASE}-server0:add(group=main-server-group)",\
"/host=${HOST_VM_NAME_LOWERCASE}/subsystem=elytron/authentication-configuration=slave:add(authentication-name=${JBOSS_EAP_USER}, credential-reference={clear-text=${JBOSS_EAP_PASSWORD}})",\
"/host=${HOST_VM_NAME_LOWERCASE}/subsystem=elytron/authentication-context=slave-context:add(match-rules=[{authentication-configuration=slave}])",\
"/host=${HOST_VM_NAME_LOWERCASE}:write-attribute(name=domain-controller.remote.username, value=${JBOSS_EAP_USER})",\
"/host=${HOST_VM_NAME_LOWERCASE}:write-attribute(name=domain-controller.remote, value={host=${DOMAIN_CONTROLLER_PRIVATE_IP}, port=9990, protocol=remote+http, authentication-context=slave-context})",\
"/host=${HOST_VM_NAME_LOWERCASE}/core-service=discovery-options/static-discovery=primary:write-attribute(name=host, value=${DOMAIN_CONTROLLER_PRIVATE_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=unsecured:add(inet-address=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=management:write-attribute(name=inet-address, value=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=public:write-attribute(name=inet-address, value=${HOST_VM_IP})"
```

The last stanza of output should look similar to the following example. If it doesn't, troubleshoot and resolve the problem before continuing.

```output
[domain@embedded /] /host=mspvm1/interface=public:write-attribute(name=inet-address, value=192.168.0.5 )
{
    "outcome" => "success",
    "result" => undefined,
    "server-groups" => undefined,
    "response-headers" => {"process-state" => "reload-required"}
}
02:58:59,388 INFO  [org.jboss.as] (MSC service thread 1-2) WFLYSRV0050: JBoss EAP 7.4.10.GA (WildFly Core 15.0.25.Final-redhat-00001) stopped in 58ms
```

Then, use the following commands to configure the JBoss server and setup EAP service:

```bash
echo 'WILDFLY_HOST_CONFIG=host-slave.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN

# Enable the JBoss server and setup EAP service
sudo systemctl enable eap7-domain.service

# Edit eap7-domain.services
sudo sed -i 's/After=syslog.target network.target/After=syslog.target network.target NetworkManager-wait-online.service/' /usr/lib/systemd/system/eap7-domain.service
sudo sed -i 's/Before=httpd.service/Wants=NetworkManager-wait-online.service \nBefore=httpd.service/' /usr/lib/systemd/system/eap7-domain.service

# Reload and restart EAP service
sudo systemctl daemon-reload
sudo systemctl restart eap7-domain.service

# Check the status of EAP service
systemctl status eap7-domain.service
```

The output should look similar to the following example:

```output
● eap7-domain.service - JBoss EAP (domain mode)
   Loaded: loaded (/usr/lib/systemd/system/eap7-domain.service; enabled; vendor>
   Active: active (running) since Thu 2023-03-30 03:02:15 UTC; 7s ago
 Main PID: 9699 (scl)
    Tasks: 51 (limit: 20612)
   Memory: 267.6M
   CGroup: /system.slice/eap7-domain.service
           ├─9699 /usr/bin/scl enable eap7 -- /opt/rh/eap7/root/usr/share/wildf>
           ├─9700 /bin/bash /var/tmp/sclgJ1hRD
           ├─9702 /bin/sh /opt/rh/eap7/root/usr/share/wildfly/bin/launch.sh /us>
           ├─9706 /bin/sh /opt/rh/eap7/root/usr/share/wildfly/bin/domain.sh --h>
           ├─9799 /usr/lib/jvm/jre/bin/java -D[Process Controller] -server -Xms>
           └─9811 /usr/lib/jvm/jre/bin/java -D[Host Controller] -Dorg.jboss.boo>

Mar 30 03:02:15 mspVM1 systemd[1]: Started JBoss EAP (domain mode).
```

Type <kbd>q</kbd> to exit the pager. Exit from the SSH connection by typing **exit**.

### [JBOSS EAP 8](#tab/jboss-eap-8)

```bash
# Setup host controller
sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --echo-command \
"embed-host-controller --std-out=echo --domain-config=domain.xml --host-config=host-secondary.xml",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=server-one:remove",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=server-two:remove",\
"/host=${HOST_VM_NAME_LOWERCASE}/server-config=${HOST_VM_NAME_LOWERCASE}-server0:add(group=main-server-group)",\
"/host=${HOST_VM_NAME_LOWERCASE}/subsystem=elytron/authentication-configuration=secondary:add(authentication-name=${JBOSS_EAP_USER}, credential-reference={clear-text=${JBOSS_EAP_PASSWORD}})",\
"/host=${HOST_VM_NAME_LOWERCASE}/subsystem=elytron/authentication-context=secondary-context:add(match-rules=[{authentication-configuration=secondary}])",\
"/host=${HOST_VM_NAME_LOWERCASE}:write-attribute(name=domain-controller.remote.username, value=${JBOSS_EAP_USER})",\
"/host=${HOST_VM_NAME_LOWERCASE}:write-attribute(name=domain-controller.remote, value={host=${DOMAIN_CONTROLLER_PRIVATE_IP}, port=9990, protocol=remote+http, authentication-context=secondary-context})",\
"/host=${HOST_VM_NAME_LOWERCASE}/core-service=discovery-options/static-discovery=primary:write-attribute(name=host, value=${DOMAIN_CONTROLLER_PRIVATE_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=unsecured:add(inet-address=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=management:write-attribute(name=inet-address, value=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASE}/interface=public:write-attribute(name=inet-address, value=${HOST_VM_IP})"
```

The last stanza of output should look similar to the following example. If it doesn't, troubleshoot and resolve the problem before continuing.

```output
[domain@embedded /] /host=mspvm1/interface=public:write-attribute(name=inet-address, value=192.168.0.5 )
{
    "outcome" => "success",
    "result" => undefined,
    "server-groups" => undefined,
    "response-headers" => {"process-state" => "reload-required"}
}
06:33:43,528 INFO  [org.jboss.as] (MSC service thread 1-1) WFLYSRV0050: JBoss EAP 8.0 Update 3.0 (WildFly Core 21.0.10.Final-redhat-00001) stopped in 24ms
```

Then, use the following commands to configure the JBoss server and setup EAP service:

```bash
echo 'WILDFLY_HOST_CONFIG=host-secondary.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN

# Enable the JBoss server and setup EAP service
sudo systemctl enable eap8-domain.service

# Edit eap8-domain.service
sudo sed -i 's/After=syslog.target network.target/After=syslog.target network.target NetworkManager-wait-online.service/' /usr/lib/systemd/system/eap8-domain.service
sudo sed -i 's/Before=httpd.service/Wants=NetworkManager-wait-online.service \nBefore=httpd.service/' /usr/lib/systemd/system/eap8-domain.service

# Reload and restart EAP service
sudo systemctl daemon-reload
sudo systemctl restart eap8-domain.service

# Check the status of EAP service
systemctl status eap8-domain.service
```

The output should look similar to the following example:

```output
● eap8-domain.service - JBoss EAP (domain mode)
   Loaded: loaded (/usr/lib/systemd/system/eap8-domain.service; enabled; vendor>
   Active: active (running) since Thu 2023-03-30 03:02:15 UTC; 7s ago
 Main PID: 9699 (scl)
    Tasks: 51 (limit: 20612)
   Memory: 267.6M
   CGroup: /system.slice/eap8-domain.service
           ├─9699 /usr/bin/scl enable eap8 -- /opt/rh/eap8/root/usr/share/wildf>
           ├─9700 /bin/bash /var/tmp/sclgJ1hRD
           ├─9702 /bin/sh /opt/rh/eap8/root/usr/share/wildfly/bin/launch.sh /us>
           ├─9706 /bin/sh /opt/rh/eap8/root/usr/share/wildfly/bin/domain.sh --h>
           ├─9799 /usr/lib/jvm/jre/bin/java -D[Process Controller] -server -Xms>
           └─9811 /usr/lib/jvm/jre/bin/java -D[Host Controller] -Dorg.jboss.boo>

Sep 30 03:02:15 mspVM1 systemd[1]: Started JBoss EAP (domain mode).
```

Type <kbd>q</kbd> to exit the pager. Exit from the SSH connection by typing **exit**.

---

Use SSH to connect to `mspVM2` as the `azureuser` user. Get the public IP address of the VM with the following command:

```bash
az vm show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM2 \
    --show-details \
    --query publicIps | tr -d '"'
```

Repeat the previous steps on `mspVM2`, and then exit the SSH connection by typing **exit**.

After two host controllers are connected to `adminVM`, you should be able to see the cluster topology, as shown in the following screenshot:

### [JBOSS EAP 7.4](#tab/jboss-eap-74)

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology-with-cluster.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform that shows the Runtime tab and the Topology pane with all hosts." lightbox="media/migrate-jboss-eap-to-vm-manually/topology-with-cluster.png":::

### [JBOSS EAP 8](#tab/jboss-eap-8)

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology-with-cluster-eap8.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform that shows the Runtime tab and the Topology pane with all hosts." lightbox="media/migrate-jboss-eap-to-vm-manually/topology-with-cluster-eap8.png":::

---

## Expose Red Hat JBoss EAP cluster with Azure Application Gateway

Now that you created the cluster on Azure VMs, this section walks you through exposing JBoss EAP to the internet with Azure Application Gateway.

### Create the Azure Application Gateway

To expose Red Hat JBoss EAP to the internet, a public IP address is required. Create the public IP address and then associate an Azure Application gateway with it. Use [az network public-ip create](/cli/azure/network/public-ip#az-network-public-ip-create) to create it, as shown in the following example:

```azurecli
az network public-ip create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myAGPublicIPAddress \
    --allocation-method Static \
    --sku Standard
```

Next, add the backend servers to Application Gateway backend pool. Query for backend IP addresses by using the following commands. You only have the host controllers (work nodes) configured as backend servers.

```azurecli
export MSPVM1_NIC_ID=$(az vm show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM1 \
    --query networkProfile.networkInterfaces'[0]'.id \
    --output tsv)
export MSPVM1_IP=$(az network nic show \
    --ids ${MSPVM1_NIC_ID} \
    --query ipConfigurations'[0]'.privateIPAddress \
    --output tsv)
export MSPVM2_NIC_ID=$(az vm show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM2 \
    --query networkProfile.networkInterfaces'[0]'.id \
    --output tsv)
export MSPVM2_IP=$(az network nic show \
    --ids ${MSPVM2_NIC_ID} \
    --query ipConfigurations'[0]'.privateIPAddress \
    --output tsv)
```

Next, create an Azure Application Gateway. The following example creates an application gateway with host controllers in the default backend pool:

```azurecli
az network application-gateway create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name myAppGateway \
    --public-ip-address myAGPublicIPAddress \
    --location westus \
    --capacity 2 \
    --http-settings-port 8080 \
    --http-settings-protocol Http \
    --frontend-port 80 \
    --sku Standard_V2 \
    --subnet jbossVMGatewaySubnet \
    --vnet-name myVNet \
    --priority 1001 \
    --servers ${MSPVM1_IP} ${MSPVM2_IP}
```

> [!NOTE]
> This example sets up simple access to the Red Hat JBoss EAP servers with HTTP. If you want secure access, configure TLS/SSL termination by follow the instructions in [End to end TLS with Application Gateway](/azure/application-gateway/ssl-overview).
>
> This example exposes the host controllers at port 8080. You deploy a sample application with a database connection to the cluster in later steps.

## Connect Azure Database for PostgreSQL Flexible Server

This section shows you how to create an Azure Database for PostgreSQL Flexible Server instance and configure a connection to PostgreSQL on your Red Hat JBoss EAP cluster.

### Create an Azure Database for PostgreSQL Flexible Server instance

Use the following steps to create the database instance:

1. Use [az postgres flexible-server create ](/cli/azure/postgres/server#az-postgres-flexible-server-create) to provision an Azure Database for PostgreSQL Flexible Server instance, as shown in the following example:

   ```azurecli
   export DATA_BASE_USER=jboss

   DB_SERVER_NAME="jbossdb$(date +%s)"
   echo "DB_SERVER_NAME=${DB_SERVER_NAME}"
   az postgres flexible-server create \
       --active-directory-auth Enabled \
       --resource-group $RESOURCE_GROUP_NAME \
       --name ${DB_SERVER_NAME}  \
       --location westus \
       --version 16 \
       --public-access 0.0.0.0 \
       --tier Burstable \
       --sku-name Standard_B1ms \
       --yes
   objectId=$(az identity show --name passwordless-managed-identity --resource-group $RESOURCE_GROUP_NAME --query principalId -o tsv)
   az postgres flexible-server ad-admin create \
     --resource-group $RESOURCE_GROUP_NAME \
     --server-name ${DB_SERVER_NAME}  \
     --display-name "passwordless-managed-identity"  \
     --object-id $objectId \
     --type ServicePrincipal 
   ```

1. Use the following commands to allow access from Azure services:

   ```azurecli
   # Save aside the following names for later use
   export fullyQualifiedDomainName=$(az postgres flexible-server show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name ${DB_SERVER_NAME} \
       --query "fullyQualifiedDomainName" \
       --output tsv)
   export name=$(az postgres flexible-server show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name ${DB_SERVER_NAME} \
       --query "name" \
       --output tsv)

   az postgres flexible-server firewall-rule create \
       --resource-group $RESOURCE_GROUP_NAME \
       --name ${DB_SERVER_NAME} \
       --rule-name "AllowAllWindowsAzureIps" \
       --start-ip-address "0.0.0.0" \
       --end-ip-address "0.0.0.0"
   ```

1. Use the following command to create the database:

   ```azurecli
   az postgres flexible-server db create \
       --resource-group $RESOURCE_GROUP_NAME \
       --server-name ${DB_SERVER_NAME} \
       --database-name testdb
   ```

### Install driver

Use the following steps to install the JDBC driver with the JBoss management CLI:

1. SSH to `adminVM` by using the following command. You can skip this step if you already have a connection opened.

   ```bash
   ssh -A -i ~/.ssh/jbosseapvm azureuser@$ADMIN_VM_PUBLIC_IP
   ```

1. Use the following commands to download JDBC driver on adminVM:

   ```bash
   # Create JDBC driver and module directory
   jdbcDriverModuleDirectory=$EAP_HOME/modules/com/postgresql/main
   
   sudo mkdir -p "$jdbcDriverModuleDirectory"
   
   # Download JDBC driver and passwordless extensions
   
   extensionJarName=azure-identity-extensions-1.1.20.jar
   extensionPomName=azure-identity-extensions-1.1.20.pom
   sudo curl --retry 5 -Lo ${jdbcDriverModuleDirectory}/${extensionJarName} https://repo1.maven.org/maven2/com/azure/azure-identity-extensions/1.1.20/$extensionJarName
   sudo curl --retry 5 -Lo ${jdbcDriverModuleDirectory}/${extensionPomName} https://repo1.maven.org/maven2/com/azure/azure-identity-extensions/1.1.20/$extensionPomName
   
   sudo yum install maven -y
   sudo mvn dependency:copy-dependencies  -f ${jdbcDriverModuleDirectory}/${extensionPomName} -Ddest=${jdbcDriverModuleDirectory}
   
   # Create module for JDBC driver
   jdbcDriverModule=module.xml
   sudo cat <<EOF >${jdbcDriverModule}
   <?xml version="1.0" ?>
   <module xmlns="urn:jboss:module:1.1" name="com.postgresql">
     <resources>
       <resource-root path="${extensionJarName}"/>
   EOF
   
   # Add all jars from target/dependency
   for jar in ${jdbcDriverModuleDirectory}/target/dependency/*.jar; do
   if [ -f "$jar" ]; then
   # Extract just the filename from the path
   jarname=$(basename "$jar")
   echo "    <resource-root path=\"target/dependency/${jarname}\"/>" >> ${jdbcDriverModule}
   fi
   done
   
   # Add the closing tags
   cat <<EOF >> ${jdbcDriverModule}
   </resources>
   <dependencies>
   <module name="javaee.api"/>
   <module name="sun.jdk"/>
   <module name="ibm.jdk"/>
   <module name="javax.api"/>
   <module name="javax.transaction.api"/>
   </dependencies>
   </module>
   EOF
   
   chmod 644 $jdbcDriverModule
   sudo mv $jdbcDriverModule $jdbcDriverModuleDirectory/$jdbcDriverModule
   ```

1. Use the following commands to copy the JDBC driver to the host controllers:

   ```bash
   scp -rp $EAP_HOME/modules/com/postgresql azureuser@mspvm1:/tmp/
   ssh azureuser@mspvm1 "sudo mkdir -p $EAP_HOME/modules/com/postgresql && sudo cp -rp /tmp/postgresql/* $EAP_HOME/modules/com/postgresql && sudo rm -rf /tmp/postgresql"
   
   scp -rp $EAP_HOME/modules/com/postgresql azureuser@mspvm2:/tmp/
   ssh azureuser@mspvm2 "sudo mkdir -p $EAP_HOME/modules/com/postgresql && sudo cp -rp /tmp/postgresql/* $EAP_HOME/modules/com/postgresql && sudo rm -rf /tmp/postgresql"
   ```

   ### [JBOSS EAP 7.4](#tab/jboss-eap-74)

   The server log is located on `mspVM1` and `mspVM2` at `/var/opt/rh/eap7/lib/wildfly/domain/servers/mspvm1-server0/log/server.log`. If the deployment fails, examine this log file and resolve the problem before continuing.

   ### [JBOSS EAP 8](#tab/jboss-eap-8)

   The server log is located on `mspVM1` and `mspVM2` at `/var/opt/rh/eap8/lib/wildfly/domain/servers/mspvm1-server0/log/server.log`. If the deployment fails, examine this log file and resolve the problem before continuing.
   
   ---

2. Use the following commands to register the JDBC driver:

   ```bash
   # Register JDBC driver
   sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --connect --controller=$(hostname -I) --echo-command \
   "/profile=ha/subsystem=datasources/jdbc-driver=postgresql:add(driver-name=postgresql,driver-module-name=com.postgresql,driver-xa-datasource-class-name=org.postgresql.xa.PGXADataSource,driver-class-name=org.postgresql.Driver)"
   ```

### Configure the database connection for the Red Hat JBoss EAP cluster

You started the database server, obtained the necessary resource ID, and installed the JDBC driver. Next, the steps in this section show you how to use the JBoss CLI to configure a datasource connection with the PostgreSQL instance you created previously.

1. Open a terminal and SSH to `adminVM` by using the following command:

   ```bash
   ssh -i ~/.ssh/jbosseapvm azureuser@$ADMIN_VM_PUBLIC_IP
   ```

1. Create data source by using the following commands:

   ```bash
   # Replace the following values with your own
   export DATA_SOURCE_CONNECTION_STRING="jdbc:postgresql://<database-fully-qualified-domain-name>:5432/testdb?sslmode=require&user=passwordless-managed-identity&authenticationPluginClassName=com.azure.identity.extensions.jdbc.postgresql.AzurePostgresqlAuthenticationPlugin"
   export JDBC_DATA_SOURCE_NAME=dataSource-postgresql
   export JDBC_JNDI_NAME=java:jboss/datasources/JavaEECafeDB

   sudo -u jboss $EAP_HOME/bin/jboss-cli.sh --connect --controller=$(hostname -I) --echo-command \
   "data-source add --driver-name=postgresql --profile=ha --name=${JDBC_DATA_SOURCE_NAME} --jndi-name=${JDBC_JNDI_NAME} --connection-url=${DATA_SOURCE_CONNECTION_STRING} "
   ```

You successfully configured a data source named `java:jboss/datasources/JavaEECafeDB`.

## Deploy Java EE Cafe sample application

Use the following steps to deploy Java EE Cafe sample application to the Red Hat JBoss EAP cluster:

1. Use the following steps to build Java EE Cafe. These steps assume you have a local environment with Git and Maven installed:

   1. Use the following command to clone the source code from GitHub:

      ### [JBOSS EAP 7.4](#tab/jboss-eap-74)
       
      ```bash
      git clone https://github.com/Azure/rhel-jboss-templates.git --branch 20240904 --single-branch
      ```
      ### [JBOSS EAP 8](#tab/jboss-eap-8)
       
      ```bash
      git clone https://github.com/Azure/rhel-jboss-templates.git --branch 20240924 --single-branch
      ```

   1. Use the following command to build the source code:

      ```bash
      mvn clean install --file rhel-jboss-templates/eap-coffee-app/pom.xml
      ```

      This command creates the file **eap-coffee-app/target/javaee-cafe.war**. You upload this file in the next step.

1. Open a web browser and go to the management console at `http://<adminVM-public-IP>:9990`, then sign in with username `jbossadmin` and password `Secret123456`.

1. Use the following steps to upload the **javaee-cafe.war** to the **Content Repository**:

   1. From the **Deployments** tab of the Red Hat JBoss EAP management console, select **Content Repository** in the navigation pane.
   1. Select the **Add** button and then select **Upload Content**.

      :::image type="content" source="media/migrate-jboss-eap-to-vm-manually/upload-content.png" alt-text="Screenshot of the Red Hat JBoss Enterprise Application Platform Deployments tab with the Upload Content menu option highlighted." lightbox="media/migrate-jboss-eap-to-vm-manually/upload-content.png":::

   1. Use the browser file chooser to select the **javaee-cafe.war** file.
   1. Select **Next**.
   1. Accept the defaults on the next screen and then select **Finish**.
   1. Select **View content**.

1. Use the following steps to deploy an application to `main-server-group`:

   1. From **Content Repository**, select **javaee-cafe.war**.
   1. On the drop-down menu, select **Deploy**.
   1. Select `main-server-group` as the server group for deploying **javaee-cafe.war**.
   1. Select **Deploy** to start the deployment. You should see a notice similar to the following screenshot:

      :::image type="content" source="media/migrate-jboss-eap-to-vm-manually/successfully-deployed.png" alt-text="Screenshot of the notice of successful deployment." lightbox="media/migrate-jboss-eap-to-vm-manually/successfully-deployed.png":::

## Test the Red Hat JBoss EAP cluster configuration

You configured the JBoss EAP cluster and deployed the application to it. Use the following steps to access the application to validate all the settings:

1. Use the following command to obtain the public IP address of the Azure Application Gateway:

   ```bash
   az network public-ip show \
       --resource-group $RESOURCE_GROUP_NAME \
       --name myAGPublicIPAddress \
       --query '[ipAddress]' \
       --output tsv
   ```

1. Open a web browser.
1. Navigate to the application with the URL `http://<gateway-public-ip-address>/javaee-cafe/`. Don't forget the trailing slash.
1. Try to add and remove coffees.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When you no longer need the Red Hat JBoss EAP cluster deployed on an Azure VM, unregister the Red Hat JBoss EAP servers and remove the Azure resources.

Use the following commands to unregister the Red Hat JBoss EAP servers and VMs from Red Hat subscription management:

```azurecli
# Unregister domain controller
az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name adminVM \
    --command-id RunShellScript \
    --scripts "sudo subscription-manager unregister"

# Unregister host controllers
az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM1 \
    --command-id RunShellScript \
    --scripts "sudo subscription-manager unregister"
az vm run-command invoke \
    --resource-group $RESOURCE_GROUP_NAME \
    --name mspVM2 \
    --command-id RunShellScript \
    --scripts "sudo subscription-manager unregister"
```

Use the following command to delete the resource group `$RESOURCE_GROUP_NAME`:

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

## Next steps

Continue to explore options to run JBoss EAP on Azure.

> [!div class="nextstepaction"]
> [Explore JBoss EAP on Azure](/azure/developer/java/ee/jboss-on-azure)
