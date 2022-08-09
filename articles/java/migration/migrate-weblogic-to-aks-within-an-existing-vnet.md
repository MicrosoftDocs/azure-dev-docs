---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service within a custom virtual network"
description: In this how-to guide, you walk through deploying WebLogic Server to Azure Kubernetes Service within a custom virtual network.
author: KarlErickson
ms.author: haiche
ms.topic: conceptual
ms.date: 08/09/2022
recommendations: false
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service within a custom virtual network

This tutorial shows you how to deploy Oracle WebLogic Server (WLS) on Azure Kubernetes Service (AKS) offer that integrates with a custom virtual network in the consumer's subscription.
The WLS on AKS offer lets the consumer decide whether to create a new virtual network or use an existing one.

In this tutorial, you learn how to:

- Create a custom virtual network and create the infrastructure within the network.
- Run Oracle WebLogic Server on AKS in the custom virtual network.
- Expose Oracle WebLogic Server with Azure Application Gateway as a load balancer.
- Validate successful deployment.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Use [Azure Cloud Shell](/azure/cloud-shell/quickstart) using the bash environment; make sure the Azure CLI version is 2.37.0 and above.

   [![Launch Cloud Shell in a new window](../../includes/media/hdi-launch-cloud-shell.png)](https://shell.azure.com)
- If you prefer, [install the Azure CLI 2.37.0 and above](/cli/azure/install-azure-cli) to run CLI reference commands.
  - If you're using a local install, sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.  To finish the authentication process, follow the steps displayed in your terminal.  See [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli) for other sign-in options.
  - When you're prompted, install Azure CLI extensions on first use.  For more information about extensions, see [Use extensions with Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

- The WLS on AKS marketplace offer requires permission to create user-assign managed identity and assign Azure roles. To assign Azure roles, you must have:
  - `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).

- An Oracle account. The steps in [Oracle Container Registry](https://aka.ms/wls-aks-ocr) will direct you to accept the license agreement for WebLogic Server images. Make note of your Oracle Account password and email.

## Create a resource group

Create a resource group with [`az group create`](/cli/azure/group#az-group-create). This example creates a resource group named **myResourceGroup** in the **Eastus** location:

```azurecli-interactive
RESOURCE_GROUP_NAME="myResourceGroup"
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location eastus
```

## Create custom virtual network

There are constraints when creating a custom virtual network, go through the following documents before you create the virtual network in your environment:

1. [Virtual network consideration for AKS](/azure/aks/concepts-network).
2. [Virtual network consideration for Application Gateway](/azure/application-gateway/configuration-infrastructure).

This example creates a virtual network with address space `192.168.0.0/16`, and creates two subnets used for AKS and Application Gateway.

Now create a virtual network with [`az network vnet create`](/cli/azure/network/vnet#az-network-vnet-create). This example creates a default virtual network named **myVNet** :

```azurecli-interactive
az network vnet create \
  --name myVNet \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --address-prefixes 192.168.0.0/16
```

Create a subnet with [`az network vnet subnet create`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) for AKS cluster. This example creates a subnet named **myAKSSubnet**:

```azurecli-interactive
az network vnet subnet create \
  --name myAKSSubnet \
  --vnet-name myVNet \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --address-prefixes 192.168.1.0/24
```

Create a subnet with [`az network vnet subnet create`](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) for Application Gateway. This example creates a subnet named **myAppGatewaySubnet**:

```azurecli-interactive
az network vnet subnet create \
  --name myAppGatewaySubnet \
  --vnet-name myVNet \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --address-prefixes 192.168.2.0/24
```

Get the AKS subnet resource ID and store as a variable, which will be used in the following steps:

```azurecli-interactive
AKS_SUBNET_ID=$(az network vnet subnet show --resource-group ${RESOURCE_GROUP_NAME} --vnet-name myVNet --name myAKSSubnet --query id -o tsv)
```

## Create an AKS cluster in the virtual network

Now create an AKS cluster in your virtual network and subnet using the [`az aks create`](/cli/azure/aks#az-aks-create) command.

> [!NOTE]
> This example creates an AKS cluster using *kubenet* and system-assigned identity, azure-cli will grant Network Contributor role to the system-assigned identity after the cluster is created.
> If you wish to use *Azure CNI*, you can follow [Configure Azure CNI networking in AKS](/azure/aks/configure-azure-cni) to create an *Azure CNI* enabled AKS cluster.
> If you wish to use user-assigned managed identity, you can follow [Create an AKS cluster with system-assigned managed identities](/azure/aks/configure-kubenet#create-an-aks-cluster-with-user-assigned-managed-identities).

```azurecli-interactive
az aks create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myAKSCluster \
    --generate-ssh-keys \
    --enable-managed-identity \
    --node-count 3 \
    --network-plugin kubenet \
    --vnet-subnet-id $AKS_SUBNET_ID \
    --yes
```

## Store Java EE applications in a Storage Account

You can deploy a Java EE Application along with the WLS on AKS offer deployment. You have to upload the application file (.war, .ear, or .jar) to a pre-existing Azure Storage Account and Storage Container within that account.

Create an Azure Storage Account using the [`az storage account create`](/cli/azure/storage/account#az-storage-account-create) command.

```azurecli-interactive
STORAGE_ACCOUNT_NAME="stgwlsaks$(date +%s)"
az storage account create \
  --name ${STORAGE_ACCOUNT_NAME} \
  --resource-group ${RESOURCE_GROUP_NAME} \
  --location eastus \
  --sku Standard_RAGRS \
  --kind StorageV2
```

Create a container for storing blobs with the [`az storage container create`](/cli/azure/storage/container#az-storage-container-create) command. This example uses the storage account key to authorize the operation to create the container. You can also use your Azure AD account to authorize the operation to create the container. For more information about authorizing data operations with Azure CLI, see [Authorize access to blob or queue data with Azure CLI](/azure/storage/blobs/authorize-data-operations-cli).

```azurecli-interactive
KEY=$(az storage account keys list \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --query [0].value -o tsv)

az storage container create \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --name mycontainer \
    --account-key ${KEY} \
    --auth-mode key
```

Now, upload your Java EE application to a blob using the [`az storage blob upload`](/cli/azure/storage/blob#az-storage-blob-upload) command. This example uploads a test application from [testwebapp.war](https://aka.ms/wls-aks-testwebapp).

```azurecli-interactive
curl -fsL https://aka.ms/wls-aks-testwebapp -o testwebapp.war

az storage blob upload \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --container-name mycontainer \
    --name testwebapp.war \
    --file testwebapp.war \
    --account-key ${KEY} \
    --auth-mode key
```

To upload multiple files at the same time, you can follow [Create, download, and list blobs with Azure CLI](/azure/storage/blobs/storage-quickstart-blobs-cli).

## Deploy WLS on AKS offer

This section will show you how to provision a WLS cluster with the AKS created previously within the custom virtual network and export cluster nodes using Azure Application Gateway as the load balancer. The offer will automatically generate a self-signed certificate for Application Gateway TLS/SSL termination. For advanced usage of TLS/SSL termination with Application Gateway, see [Application Gateway Ingress Controller](https://aka.ms/wls-aks-app-gateway-ic).

To create the WLS cluster and Application Gateway, use the following steps.

First, begin the process of deploying a WebLogic Server as described in [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs), but come back to this page when you reach **Configure AKS cluster**, as shown here.

:::image type="content" source="media/migrate-weblogic-to-aks-within-existing-vnet/configure-aks-cluster.png" alt-text="Azure portal screenshot showing the Configure AKS cluster.":::

### Configure AKS cluster

Now that you have an AKS cluster within the virtual network, select the AKS cluster for the deployment.

1. For **Create a new AKS cluster?**, select **No**.
1. Under **Select AKS cluster**, select the dropdown, you should find the AKS cluster you created, named `myAKSCluster` in this example.
1. For **Use a pre-existing, WebLogic Server Docker image from Oracle Container Registry?**, select **Yes**.
1. For **Create a new Azure Container Registry to store application images?**, select **Yes**.
1. Under **Username for Oracle Single Sign-on authentication**, input your Oracle Single Sign-on account user name.
1. Under **Password for Oracle Single Sign-on authentication**, input the password for that account.
1. Under **Confirm password**, reenter the value of the preceding field.
1. For **Select desired combination of WebLogic Server, JDK and Operator System or fully qualified Docker tag**, keep the default value.
1. For **Deploy your application package**, select **Yes**.
1. For **Application package (.war,.ear,.jar)**, hit **Browse** button:
    - Select the storage account you created, whose name starts with `stgwlsaks` in this example.
    - Select your container in **Containers** page, this example uses `mycontainer`.
    - Check your application listed in the container, this example uses `testwebapp.war`.
    - Select **Select** button.
1. For other fields, keep the default values.

Now you've finished configured the AKS cluster, WebLogic base image and Java EE application. You're able to configure end to end TLS/SSL to WebLogic Server Administration Console and cluster on HTTPS (Secure) port, with your own certificate in **TLS/SSL Configuration** blade following [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs). Come back to this page when you reach **Networking**, as shown here.

:::image type="content" source="media/migrate-weblogic-to-aks-within-existing-vnet/networking-agic-custom-vnet.png" alt-text="Azure portal screenshot showing the Networking.":::

### Configure Application Gateway Ingress Controller

This section shows how to configure Application Gateway Ingress Controller within the virtual network.

1. For **Connect to Azure Application Gateway?**, select **Yes**.
1. Under **Configurate virtual networks**, for **Virtual network**, select the virtual network you created, this example uses `myVNet` in `myResourceGroup`; for **Subnet**, select the subnet for Application Gateway, this example uses `myAppGatewaySubnet`.
1. For **Select desired TLS/SSL certificate option**, select **Generate a self-signed front-end certificate**.
1. For **Create ingress for Administration Console**, select **Yes** to expose WebLogic Administration Console.
1. For other fields, keep the default values.

You can now continue with the other aspects of the WLS deployment as described [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs).

## Validate successful deployment of WLS

This section shows how to quickly validate the successful deployment of the WLS cluster and Application Gateway Ingress Controller.

After the deployment completes, select **Outputs**, you'll find the external URL of the WebLogic Administration Console and the cluster. You should be able to access:

1. The WebLogic Administration Console: copy the value of output variable `adminConsoleExternalUrl`; paste the value to your browser address bar and press **Enter**, you'll open the sign-in page of WebLogic Administration Console.
1. The WebLogic cluster: copy the value of output variable `clusterExternalUrl`, and the sample application URL is `${clusterExternalUrl}testwebapp/`; paste the application URL to your browser address bar and press **Enter**, you'll find the sample application shows private address and hostname of the pod that the Application Gateway Ingress Controller is routing to.

## Clean up resources

If you're not going to continue to use the WLS cluster, delete the virtual network and the WLS Cluster with the following steps:

1. Visit the overview page for resource group `myResourceGroup`, select **Delete resource group**.
1. Visit the overview page for resource group that you deployed the WLS on AKS offer, select **Delete resource group**.

## Next steps

Continue to explore options to run WLS on Azure.
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)