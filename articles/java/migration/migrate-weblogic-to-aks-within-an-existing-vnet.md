---
title: "Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service (AKS) within a custom virtual network"
description: Shows how to deploy WebLogic Server to Azure Kubernetes Service (AKS) within a custom virtual network.
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: tutorial
ms.date: 05/13/2025
recommendations: false
ms.custom: devx-track-azurecli, devx-track-extended-java, devx-track-java, devx-track-javaee, devx-track-javaee-wls, devx-track-javaee-wls-aks, migration-java
---

# Tutorial: Migrate Oracle WebLogic Server to Azure Kubernetes Service (AKS) within a custom virtual network

This tutorial shows you how to deploy the Oracle WebLogic Server (WLS) on Azure Kubernetes Service (AKS) offer that integrates with a preexisting virtual network in your subscription.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a custom virtual network and create the infrastructure within the network.
> - Create an AKS cluster in the virtual network.
> - Run Oracle WebLogic Server on AKS with the pre-existing AKS cluster in the pre-existing virtual network.
> - Expose Oracle WebLogic Server with Azure Application Gateway as a load balancer.
> - Validate successful deployment.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Prepare a local machine with Unix-like operating system installed - for example, Ubuntu, macOS, or Windows Subsystem for Linux.
- [Install the Azure CLI](/cli/azure/install-azure-cli) 2.73.0 or above to run Azure CLI commands.
  - Sign in with Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign into Azure with Azure CLI](/cli/azure/authenticate-azure-cli#sign-into-azure-with-azure-cli) for other sign-in options.
  - When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).
- The WLS on AKS marketplace offer requires permission to create user-assign managed identity and assign Azure roles. To assign Azure roles, you must have `Microsoft.Authorization/roleAssignments/write` permissions, such as [User Access Administrator](/azure/role-based-access-control/built-in-roles#user-access-administrator) or [Owner](/azure/role-based-access-control/built-in-roles#owner).
- An Oracle account. The steps in [Oracle Container Registry](https://aka.ms/wls-aks-ocr) direct you to accept the license agreement for WebLogic Server images. Make note of your Oracle Account password and email.

## Create a resource group

Create a resource group with [az group create](/cli/azure/group#az-group-create). This example creates a resource group named `myResourceGroup` in the `eastus` location:

```azurecli
export RESOURCE_GROUP_NAME="myResourceGroup"
export LOCATION=eastus
az group create \
    --name ${RESOURCE_GROUP_NAME} \
    --location ${LOCATION}
```

## Create a custom virtual network

There are constraints when creating a custom virtual network. Before you create the virtual network in your environment, read the following articles:

- [Network concepts for applications in Azure Kubernetes Service (AKS)](/azure/aks/concepts-network).
- [Application Gateway infrastructure configuration](/azure/application-gateway/configuration-infrastructure).

The example in this section creates a virtual network with address space `192.168.0.0/16`, and creates two subnets used for AKS and Application Gateway.

First, create a virtual network by using [az network vnet create](/cli/azure/network/vnet#az-network-vnet-create). The following example creates a default virtual network named `myVNet`:

```azurecli
az network vnet create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myVNet \
    --address-prefixes 192.168.0.0/16 \
    --location ${LOCATION}
```

Next, create a subnet by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create) for the AKS cluster. The following example creates a subnet named `myAKSSubnet`:

```azurecli
az network vnet subnet create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myAKSSubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.1.0/24
```

Next, create another subnet for the Application Gateway by using [az network vnet subnet create](/cli/azure/network/vnet/subnet#az-network-vnet-subnet-create). The following example creates a subnet named `myAppGatewaySubnet`:

```azurecli
az network vnet subnet create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myAppGatewaySubnet \
    --vnet-name myVNet \
    --address-prefixes 192.168.2.0/24
```

Next, use the following command to get the AKS subnet resource ID and store it in a variable for use later in this article:

```azurecli
export AKS_SUBNET_ID=$(az network vnet subnet show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --vnet-name myVNet \
    --name myAKSSubnet \
    --query id \
    --output tsv)
```

## Create an AKS cluster in the virtual network

Use the following command to create an AKS cluster in your virtual network and subnet by using the [az aks create](/cli/azure/aks#az-aks-create) command.

```azurecli
az aks create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name myAKSCluster \
    --generate-ssh-keys \
    --enable-managed-identity \
    --node-count 3 \
    --node-vm-size Standard_DS3_v2 \
    --network-plugin azure \
    --vnet-subnet-id $AKS_SUBNET_ID \
    --yes
```

## Store Jakarta EE applications in a Storage account

You can deploy a Jakarta EE Application along with the WLS on AKS offer deployment. You have to upload the application file (**.war**, **.ear**, or **.jar**) to a preexisting Azure Storage Account and Storage Container within that account.

Create an Azure Storage Account using the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command, as shown in the following example:

```azurecli
export STORAGE_ACCOUNT_NAME="stgwlsaks$(date +%s)"
az storage account create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name ${STORAGE_ACCOUNT_NAME} \
    --location ${LOCATION} \
    --sku Standard_RAGRS \
    --kind StorageV2
```

Create a container for storing blobs with the [az storage container create](/cli/azure/storage/container#az-storage-container-create) command. The following example uses the storage account key to authorize the operation to create the container. You can also use your Microsoft Entra account to authorize the operation to create the container. For more information, see [Authorize access to blob or queue data with Azure CLI](/azure/storage/blobs/authorize-data-operations-cli).

```azurecli
export KEY=$(az storage account keys list \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --query \[0\].value \
    --output tsv)

az storage container create \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --name mycontainer \
    --account-key ${KEY} \
    --auth-mode key
```

Next, upload your Jakarta EE application to a blob using the [az storage blob upload](/cli/azure/storage/blob#az-storage-blob-upload) command. The following example uploads the [testwebapp.war](https://aka.ms/wls-aks-testwebapp) test application.

```azurecli
curl -fsL https://aka.ms/wls-aks-testwebapp -o testwebapp.war

az storage blob upload \
    --account-name ${STORAGE_ACCOUNT_NAME} \
    --container-name mycontainer \
    --name testwebapp.war \
    --file testwebapp.war \
    --account-key ${KEY} \
    --auth-mode key
```

To upload multiple files at the same time, see [Create, download, and list blobs with Azure CLI](/azure/storage/blobs/storage-quickstart-blobs-cli).

## Deploy WLS on the AKS offer

This section shows you how to provision a WLS cluster with the AKS instance you created previously. The offer uses the existing cluster within the custom virtual network and export cluster nodes using Azure Application Gateway as the load balancer. The offer automatically generates a self-signed certificate for Application Gateway TLS/SSL termination. For advanced usage of TLS/SSL termination with Application Gateway, see [Application Gateway Ingress Controller](https://aka.ms/wls-aks-app-gateway-ic).

First, begin the process of deploying a WebLogic Server as described in [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs), but come back to this page when you reach the **AKS** pane, as shown in the following screenshot.

:::image type="content" source="media/migrate-weblogic-to-aks-within-existing-vnet/configure-aks-cluster.png" alt-text="Screenshot of Azure portal showing the Configure AKS cluster pane of the Create Oracle WebLogic Server on Azure Kubernetes Service page." lightbox="media/migrate-weblogic-to-aks-within-existing-vnet/configure-aks-cluster.png":::

### Configure the AKS cluster

Now that you have an AKS cluster within the virtual network, select the AKS cluster for the deployment.

1. For **Create a new AKS cluster?**, select **No**.
1. Under **Select AKS cluster**, open the dropdown menu, then select the AKS cluster you created, named `myAKSCluster` in this example.
1. For **Use a pre-existing, WebLogic Server Docker image from Oracle Container Registry?**, select **Yes**.
1. For **Create a new Azure Container Registry to store application images?**, select **Yes**.
1. Under **Username for Oracle Single Sign-on authentication**, input your Oracle single sign-on account user name.
1. Under **Password for Oracle Single Sign-on authentication**, input the password for that account.
1. Under **Confirm password**, reenter the value of the preceding field.
1. For all other fields except **Deploy an application**, keep the default values.
1. For **Deploy an application**, select **Yes**.
1. For **Application package (.war,.ear,.jar)**, select **Browse**.
   - Select the storage account you created. The name starts with `stgwlsaks` in this example.
   - Select your container in **Containers** page. This example uses `mycontainer`.
   - Check your application listed in the container. This example uses **testwebapp.war**.
   - Select **Select**.
1. For other fields, keep the default values.

The AKS cluster, WebLogic base image, and Jakarta EE application are now configured.

Next, you configure load balancing. For this task, continue to follow the steps in the [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs), but come back to this page when you reach **Load balancing**, as shown in the following screenshot. You use the next section to configure the load balancing, then return to the WLS on AKS user guide to complete the deployment.

:::image type="content" source="media/migrate-weblogic-to-aks-within-existing-vnet/networking-agic-custom-vnet.png" alt-text="Screenshot of Azure portal showing the Networking pane of the Create Oracle WebLogic Server on Azure Kubernetes Service page." lightbox="media/migrate-weblogic-to-aks-within-existing-vnet/networking-agic-custom-vnet.png":::

### Configure Application Gateway Ingress Controller

Use the following steps to configure Application Gateway Ingress Controller within the virtual network.

1. For **Connect to Azure Application Gateway?**, select **Yes**.
1. Under **Configure virtual networks**, for **Virtual network**, select the virtual network you created. This example uses `myVNet` in `myResourceGroup`. For **Subnet**, select the subnet for Application Gateway. This example uses `myAppGatewaySubnet`.
1. For **Select desired TLS/SSL certificate option**, select **Generate a self-signed front-end certificate**.
1. For **Create ingress for Administration Console**, select **Yes** to expose the WebLogic Administration Console.
1. For the other fields, keep the default values.

You can now continue with the other aspects of the WLS deployment as described in the [Oracle WebLogic Server on AKS user guide](https://aka.ms/wls-aks-docs).

## Validate successful deployment of WLS

This section shows you how to quickly validate the successful deployment of the WLS cluster and Application Gateway Ingress Controller.

After the deployment completes, select **Outputs**, then find the external URL of the WebLogic Administration Console and the cluster. Use the following instructions to access these resources:

- To view the WebLogic Administration Console, first copy the value of the output variable `adminConsoleExternalUrl`. Next, paste the value into your browser address bar and press **Enter** to open the sign-in page of the WebLogic Administration Console.
- To view the WebLogic cluster, first copy the value of the output variable `clusterExternalUrl`. Next, use this value to construct the sample application URL by applying it to the following template: `${clusterExternalUrl}testwebapp/`. Now paste the application URL into your browser address bar and press **Enter**. The sample application shows the private address and hostname of the pod that the Application Gateway Ingress Controller is routing to.

## Clean up resources

If you're not going to continue to use the WLS cluster, delete the virtual network and the WLS Cluster with the following Azure portal steps:

1. Visit the overview page for the resource group `myResourceGroup`, then select **Delete resource group**.
1. Visit the overview page for the resource group that you deployed the WLS on AKS offer, then select **Delete resource group**.

## Next steps

Continue to explore options to run WLS on Azure.

> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on AKS](/azure/virtual-machines/workloads/oracle/weblogic-aks)
> [!div class="nextstepaction"]
> [Learn more about Oracle WebLogic on Azure](/azure/virtual-machines/workloads/oracle/oracle-weblogic)
