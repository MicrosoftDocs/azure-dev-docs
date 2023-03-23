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
>
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

- An admin VM (VM name `adminVM`) runs as the domain controller.
- Two managed VMs (VM names `mspVM1` and `mspVM2`) run as host controller.

The topology of the cluster will look like: 

**Add image here**

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
    --public-ip-sku Standard \
    --nsg mynsg \
    --vnet-name myVnet \
    --subnet mySubnet
```

#### Install OpenJDK 11 and JBoss EAP 7.4

1. Use the following command to get the public IP of `adminVM`

```azurecli
az vm show --resource-group abc1110rg --name adminVM --show-details --query publicIps
```

2. Open a terminal and SSH to the `adminVM` by running the following command:

```bash
ssh azureuser@<adminvm_public_ip>
```

Provide `Secret123456` as password.

3. Configure firewall for ports by running:

```bash
sudo firewall-cmd --zone=public --add-port={9999/tcp,8443/tcp,8009/tcp,8080/tcp,9990/tcp,9993/tcp,45700/tcp,7600/tcp} --permanent
sudo firewall-cmd --reload
sudo iptables-save
```

4. Register the admin host to your Red Hat Subscription Management(RHSM) account

```bash
RHSM_USER=<your rhsm username>
RHSM_PASSWORD=<your rhsm password>
EAP_POOL=<your rhsm pool id>

sudo subscription-manager register --username ${RHSM_USER} --password ${RHSM_PASSWORD} --force
```

5. Attach the admin host to JBoss EAP pool

```bash
sudo subscription-manager attach --pool=${EAP_POOL}
```

6. Install OpenJDK 11

```bash
sudo yum install java-11-openjdk -y
```

7. Install JBoss EAP 7.4

```bash
sudo subscription-manager repos --enable=jb-eap-7.4-for-rhel-8-x86_64-rpms
sudo yum update -y --disablerepo='*' --enablerepo='*microsoft*'
sudo yum groupinstall -y jboss-eap7
```

8. Permission and TCP configurations

```bash
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config
echo 'AllowTcpForwarding no' | sudo tee -a /etc/ssh/sshd_config
sudo systemctl restart sshd
```

9. Environment variables

```bash
echo 'export EAP_RPM_CONF_DOMAIN="/etc/opt/rh/eap7/wildfly/eap7-domain.conf"' >> ~/.bash_profile
echo 'export EAP_HOME="/opt/rh/eap7/root/usr/share"' >> ~/.bash_profile
source ~/.bash_profile
sudo touch /etc/profile.d/eap_env.sh
echo 'export EAP_HOME="/opt/rh/eap7/root/usr/share"' | sudo tee -a /etc/profile.d/eap_env.sh
```

### Create machines for managed servers

You've now installed OpenJDK 11, and JBoss EAP 7.4 on `adminVM`, which will run the domain controller server. You still need to prepare machines to run the two managed servers. Next, you'll create a snapshot of `adminVM` and prepare machines for two managed severs, `mspVM1` and `mspVM2`.

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
    --public-ip-sku Standard \
    --nsg mynsg \
    --vnet-name myVnet \
    --subnet mySubnet
```

You've now created `mspVM1` with OpenJDK 11 and JBoss EAP 7.4 installed. Because the VM was created from a snapshot of the `adminVM` OS disk, the two VMs have the same hostname. Use [az vm run-command invoke](/cli/azure/vm/run-command#az-vm-run-command-invoke) to change the hostname to the value `mspVM1`:

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
    --os-type linux \
    --public-ip-sku Standard \
    --nsg mynsg \
    --vnet-name myVnet \
    --subnet mySubnet

#Set hostname
az vm run-command invoke \
    --resource-group abc1110rg \
    --name mspVM2 \
    --command-id RunShellScript \
    --scripts "sudo hostnamectl set-hostname mspVM2"
```

[!INCLUDE [start-admin-get-ips](includes/wls-manual-guidance-start-admin-and-get-ip.md)]

Now, all three machines are ready. Next, you'll configure a WebLogic cluster.

### Configure managed domain and cluster

In the documentation we will configure a cluster with session replication enabled. For more information, see [Session Replication](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/development_guide/clustering_in_web_applications#session_replication). 

To enable session replication we will use JBoss EAP High Availability for the cluster. Microsoft Azure does not support JGroups discovery protocols that are based on UDP multicast. Although you may use other JGroups discovery protocols (such as a static configuration (`TCPPING`), a shared database (`JDBC_PING`), shared file system-based ping (`FILE_PING`), or `TCPGOSSIP`), we strongly recommend that you use the shared file discovery protocol specifically developed for Azure: `AZURE_PING`. For more information, see [Using JBoss EAP High Availability in Microsoft Azure](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/using_jboss_eap_in_microsoft_azure/using_jboss_eap_high_availability_in_microsoft_azure#doc-wrapper) 

#### Create Azure storage account and Blob container for AZURE_PING

Use the following command to create a storage account and Blob container.

```azurecli
# Define your storage account name
STORAGE_ACCOUNT_NAME=azurepingstg0322

# Create storage account
az storage account create \
  --name ${STORAGE_ACCOUNT_NAME} \
  --resource-group abc1110rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot

# Retrieve the storage account key
STORAGE_ACCOUNT_KEY=$(az storage account keys list \
  --account-name ${STORAGE_ACCOUNT_NAME} \
  --query "[0].value" --output tsv)

# Define your Blob container name
CONTAINER_NAME=azurepingcontainer0322

# Create blob container
az storage container create \
  --name ${CONTAINER_NAME} \
  --account-name ${STORAGE_ACCOUNT_NAME} \
  --account-key ${STORAGE_ACCOUNT_KEY}
```

#### Configure domain controller(admin node)

This tutorial uses the JBoss EAP management CLI commands to configure the domain controller. For more information, see [Management CLI Guide](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html-single/management_cli_guide/index).

1. Setup the domain controller configuration on `adminVM` with the following steps, assuming you're still on `adminVM` and logged in with the `azureuser` user.

```bash
HOST_VM_IP=$(hostname -I)

# Configure the HA profile and JGroups using AZURE_PING protocol
sudo -u jboss $EAP_HOME/wildfly/bin/jboss-cli.sh --echo-command \
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

# Save a copy of the domain.xml, later we need to share it with all host controllers
cp domain.xml /tmp/domain.xml

# Configure the JBoss server and setup EAP service
echo 'WILDFLY_HOST_CONFIG=host-master.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN


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

# Configure JBoss EAP management user
JBOSS_EAP_USER=jbossadmin
JBOSS_EAP_PASSWORD=Secret123456
sudo $EAP_HOME/wildfly/bin/add-user.sh  -u $JBOSS_EAP_USER -p $JBOSS_EAP_PASSWORD -g 'guest,mgmtgroup'
```

After start the JBoss EAP service, you will be able to access the management console via: `http://<adminVM_public_IP>:9990` in your web browser, after login with the configured username: `jbossadmin` and password `Secret123456` you should be able to see the management console like:

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/adminconsole.png" alt-text="Screenshot of domain controller management console." lightbox="media/migrate-jboss-eap-to-vm-manually/adminconsole.png":::

Select `Runtime` and then browser the `Topology` you should see that for now our cluster only contains one domain controller:

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology_only_with_admin.png" alt-text="Screenshot of cluster topology with domain controller only." lightbox="media/migrate-jboss-eap-to-vm-manually/topology_only_with_admin.png":::



#### Configure host controller(worker node)

1. Retrieve the private IP of `adminVM`, we will use it to configure the connection between domain controller and host controllers.
    1. Portal **Fill in steps**

1. Assuming you're on `mspVM1` and logged in with the `azureuser` user, follow the instructions to apply domain configuration to `mspVM1`.

Open a new command prompt, and use the following commands to connect to `mspVM1`:

```bash
ssh azureuser@<mspVM1_public_ip>
```

You'll be asked for the password for the connection. For this example, the password is *Secret123456*.

You're now logged into `mspVM1` with user `azureuser`. Next, use the following commands to fetch the domain configuration file `domain.xml` from `adminVM`.

```bash
# environment variables
DOMAIN_CONTROLLER_PRIVATE_IP=<adminVM_private_IP>
HOST_VM_NAME=$(hostname)
HOST_VM_NAME_LOWERCASES=$(echo "${HOST_VM_NAME,,}")
HOST_VM_IP=$(hostname -I)

JBOSS_EAP_USER=jbossadmin
JBOSS_EAP_PASSWORD=Secret123456

# Save default domain configuration as backup
sudo -u jboss mv $EAP_HOME/wildfly/domain/configuration/domain.xml $EAP_HOME/wildfly/domain/configuration/domain.xml.backup

# Fetch domain.xml from domain controller
sudo -u jboss scp azureuser@<adminVM_private_IP>:/tmp/domain.xml $EAP_HOME/wildfly/domain/configuration/domain.xml

# Setup host controller
sudo -u jboss $EAP_HOME/wildfly/bin/jboss-cli.sh --echo-command \
"embed-host-controller --std-out=echo --domain-config=domain.xml --host-config=host-slave.xml",\
"/host=${HOST_VM_NAME_LOWERCASES}/server-config=server-one:remove",\
"/host=${HOST_VM_NAME_LOWERCASES}/server-config=server-two:remove",\
"/host=${HOST_VM_NAME_LOWERCASES}/server-config=${HOST_VM_NAME_LOWERCASES}-server0:add(group=main-server-group)",\
"/host=${HOST_VM_NAME_LOWERCASES}/subsystem=elytron/authentication-configuration=slave:add(authentication-name=${JBOSS_EAP_USER}, credential-reference={clear-text=${JBOSS_EAP_PASSWORD}})",\
"/host=${HOST_VM_NAME_LOWERCASES}/subsystem=elytron/authentication-context=slave-context:add(match-rules=[{authentication-configuration=slave}])",\
"/host=${HOST_VM_NAME_LOWERCASES}:write-attribute(name=domain-controller.remote.username, value=${JBOSS_EAP_USER})",\
"/host=${HOST_VM_NAME_LOWERCASES}:write-attribute(name=domain-controller.remote, value={host=${DOMAIN_CONTROLLER_PRIVATE_IP}, port=9990, protocol=remote+http, authentication-context=slave-context})",\
"/host=${HOST_VM_NAME_LOWERCASES}/core-service=discovery-options/static-discovery=primary:write-attribute(name=host, value=${DOMAIN_CONTROLLER_PRIVATE_IP})",\
"/host=${HOST_VM_NAME_LOWERCASES}/interface=unsecured:add(inet-address=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASES}/interface=management:write-attribute(name=inet-address, value=${HOST_VM_IP})",\
"/host=${HOST_VM_NAME_LOWERCASES}/interface=public:write-attribute(name=inet-address, value=${HOST_VM_IP})"

# Configure the JBoss server and setup EAP service
echo 'WILDFLY_HOST_CONFIG=host-slave.xml' | sudo tee -a $EAP_RPM_CONF_DOMAIN

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

Repeat the above steps on `mspVM2`, after two host controller are connected to `adminVM`, you should be able to see the cluster topology:

:::image type="content" source="media/migrate-jboss-eap-to-vm-manually/topology_with_cluster.png" alt-text="Screenshot of cluster topology with all hosts." lightbox="media/migrate-jboss-eap-to-vm-manually/topology_with_cluster.png":::

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
