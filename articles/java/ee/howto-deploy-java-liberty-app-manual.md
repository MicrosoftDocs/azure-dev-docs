---
title: Manually Deploy a Java Application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) Cluster
description: Shows you how to manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster.
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.topic: install-set-up-deploy
ms.date: 05/05/2025
ms.service: azure-kubernetes-service
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, devx-track-azurecli
---

# Manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article provides step-by-step guidance for manually deploying Open/WebSphere Liberty on Azure.

Specifically, this article explains how to accomplish the following tasks:

* Run your Java, Java Enterprise Edition (EE), Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime.
* Build the application Docker image with `az acr build` using Liberty container images.
* Deploy the containerized application to an Azure Kubernetes Service (AKS) cluster using a Liberty Operator.

A Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With the Open Liberty Operator or WebSphere Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

For a more automated solution that accelerates your journey to AKS using a Marketplace solution available on the Azure portal, see [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-liberty-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WebSphere on Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

* An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* [Azure CLI](/cli/azure/install-azure-cli) version 2.71.0+
* Java Standard Edition (SE), version 17 - for example, [Eclipse Open J9](https://www.eclipse.org/openj9/).
* [Maven](https://maven.apache.org/download.cgi) version 3.5.0+
* [Git](https://git-scm.com)
* The `Owner` role or the `Contributor` and `User Access Administrator` roles in the Azure subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).

## Sign in to Azure

If you didn't do so already, use the following steps to sign in to your Azure subscription:

1. Open the Azure CLI or PowerShell and then sign in by using [`az login`](/cli/azure/reference-index#az-login). To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign into Azure with Azure CLI](/cli/azure/authenticate-azure-cli#sign-into-azure-with-azure-cli).

    > [!NOTE]
    > If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can specify a tenant with the `--tenant` option - for example, `az login --tenant contoso.onmicrosoft.com`.

1. Find the version and dependent libraries that are installed by using [`az version`](/cli/azure/reference-index?#az-version).

1. Upgrade to the latest version by using [`az upgrade`](/cli/azure/reference-index?#az-upgrade).

> [!NOTE]
> When using the Azure CLI, if you're prompted to install an Azure CLI extension, do so. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
>
> You can run most Azure CLI commands in PowerShell the same as in Bash. The difference exists only when using variables. In the following sections, the difference is addressed in different tabs when needed.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

Create a resource group called `java-liberty-project` by using [`az group create`](/cli/azure/group#az-group-create) in the `eastus2` location. This resource group is used later for creating the Azure Container Registry instance and the AKS cluster.

### [Bash](#tab/in-bash)

```azurecli
export RESOURCE_GROUP_NAME=java-liberty-project
az group create --name $RESOURCE_GROUP_NAME --location eastus2
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:RESOURCE_GROUP_NAME = "java-liberty-project"
az group create --name $Env:RESOURCE_GROUP_NAME --location eastus2
```

---

## Create a container registry instance

Use [`az acr create`](/cli/azure/acr#az-acr-create) to create the container registry instance. The following example creates a container registry instance named `<your-unique-ACR-name>`. Replace this placeholder with a value that is unique across Azure.

> [!NOTE]
> This article uses the recommended passwordless authentication mechanism for Azure Container Registry. It's still possible to use a username and password with `docker login` after using `az acr credential show` to obtain the username and password. Using a username and password is less secure than passwordless authentication, however.

### [Bash](#tab/in-bash)

```azurecli
export REGISTRY_NAME=<your-unique-ACR-name>
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --sku Basic
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:REGISTRY_NAME = "<your-unique-ACR-name>"
az acr create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:REGISTRY_NAME `
    --sku Basic
```

---

After a short time, you should see JSON output that contains the following lines:

```output
"provisioningState": "Succeeded",
"publicNetworkAccess": "Enabled",
"resourceGroup": "java-liberty-project",
```

Retrieve the sign-in server name for the container registry instance. You need this value when you deploy the application image to the AKS cluster later.

### [Bash](#tab/in-bash)

```azurecli
export LOGIN_SERVER=$(az acr show \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv)
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:LOGIN_SERVER = $(az acr show `
    --name $Env:REGISTRY_NAME `
    --query 'loginServer' `
    --output tsv)
```

---

## Create an AKS cluster

Use [`az aks create`](/cli/azure/aks#az-aks-create) to create an AKS cluster, as shown in the following example. This example creates an AKS cluster named `myAKSCluster` with one node and attaches the container registry instance to it. The command takes several minutes to complete.

### [Bash](#tab/in-bash)

```azurecli
export CLUSTER_NAME=myAKSCluster
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --node-vm-size Standard_DS2_V2 \
    --generate-ssh-keys \
    --enable-managed-identity \
    --attach-acr $REGISTRY_NAME
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:CLUSTER_NAME = "myAKSCluster"
az aks create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:CLUSTER_NAME `
    --node-count 1 `
    --node-vm-size Standard_DS2_V2 `
    --generate-ssh-keys `
    --enable-managed-identity `
    --attach-acr $Env:REGISTRY_NAME
```

---

After the command completes, it returns JSON-formatted information about the cluster, including the following output:

```output
"nodeResourceGroup": "MC_java-liberty-project_myAKSCluster_eastus2",
"privateFqdn": null,
"provisioningState": "Succeeded",
"resourceGroup": "java-liberty-project",
```

## Connect to the AKS cluster

Use the following steps to manage your Kubernetes cluster:

1. Install [`kubectl`](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client, by using [`az aks install-cli`](/cli/azure/aks#az-aks-install-cli), as shown in the following example:

    ### [Bash](#tab/in-bash)

    ```azurecli
    az aks install-cli
    ```

    ### [PowerShell](#tab/in-powershell)

    ```azurepowershell
    az aks install-cli
    ```

    ---

1. Use [`az aks get-credentials`](/cli/azure/aks#az-aks-get-credentials) to configure `kubectl` to connect to your Kubernetes cluster. This command downloads credentials and configures the Kubernetes CLI to use them, as shown in the following example:

    > [!NOTE]
    > The command uses the default location for the [Kubernetes configuration file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/), which is **~/.kube/config**. You can specify a different location for your Kubernetes configuration file by using `--file`.

    ### [Bash](#tab/in-bash)

    ```azurecli
    az aks get-credentials \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $CLUSTER_NAME \
        --overwrite-existing \
        --admin
    ```

    ### [PowerShell](#tab/in-powershell)

    ```azurepowershell
    az aks get-credentials `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name $Env:CLUSTER_NAME `
        --overwrite-existing `
        --admin
    ```

    ---

1. Verify the connection to your cluster by using [`kubectl get`]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to return a list of the cluster nodes, as shown in the following example:

    ### [Bash](#tab/in-bash)

    ```bash
    kubectl get nodes
    ```

    ### [PowerShell](#tab/in-powershell)

    ```powershell
    kubectl get nodes
    ```

    ---

    The following example output shows the single node created in the previous steps. Make sure that the status of the node is `Ready`:

    ```output
    NAME                                STATUS   ROLES   AGE     VERSION
    aks-nodepool1-xxxxxxxx-yyyyyyyyyy   Ready    <none>  76s     v1.29.9
    ```

## Create an Azure SQL Database

Create an Azure SQL Database single database for your app by using the following steps:

### [Bash](#tab/in-bash)

1. Use the following commands to set database-related environment variables. Replace `<your-unique-sql-server-name>` with a unique name for your Azure SQL Database server.

    ```bash
    export SQL_SERVER_NAME=<your-unique-sql-server-name>
    export DB_NAME=demodb
    ```

1. Use the following commands to create a single database and set the current signed-in user as a Microsoft Entra admin. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-cli).

    ```azurecli
    export ENTRA_ADMIN_NAME=$(az account show \
        --query user.name \
        --output tsv)

    az sql server create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $SQL_SERVER_NAME \
        --enable-ad-only-auth \
        --external-admin-principal-type User \
        --external-admin-name $ENTRA_ADMIN_NAME \
        --external-admin-sid $(az ad signed-in-user show --query id --output tsv)

    az sql db create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $DB_NAME \
        --server $SQL_SERVER_NAME \
        --edition GeneralPurpose \
        --compute-model Serverless \
        --family Gen5 \
        --capacity 2
    ```

### [PowerShell](#tab/in-powershell)

1. Use the following commands to set database-related environment variables. Replace `<your-unique-sql-server-name>` with a unique name for your Azure SQL Database server.

    ```powershell
    $Env:SQL_SERVER_NAME = "<your-unique-sql-server-name>"
    $Env:DB_NAME = "demodb"
    ```

1. Use the following commands to create a single database and set the current signed-in user as a Microsoft Entra admin. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-cli).

    ```azurepowershell
    $Env:ENTRA_ADMIN_NAME = $(az account show `
        --query user.name `
        --output tsv)
    
    az sql server create `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name $Env:SQL_SERVER_NAME `
        --enable-ad-only-auth `
        --external-admin-principal-type User `
        --external-admin-name $Env:ENTRA_ADMIN_NAME `
        --external-admin-sid $(az ad signed-in-user show --query id --output tsv)

    az sql db create `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name $Env:DB_NAME `
        --server $Env:SQL_SERVER_NAME `
        --edition GeneralPurpose `
        --compute-model Serverless `
        --family Gen5 `
        --capacity 2
    ```

---

> [!NOTE]
> You create an Azure SQL server with SQL authentication disabled for security considerations. Only Microsoft Entra ID is used to authenticate to the server. For more information on enabling SQL authentication, see [`az sql server create`](/cli/azure/sql/server#az-sql-server-create).

## Create a service connection in AKS with Service Connector

Use the following commands to create a connection between the AKS cluster and the SQL database using Microsoft Entra Workload ID with Service Connector. For more information, see [Create a service connection in AKS with Service Connector](/azure/service-connector/tutorial-python-aks-sql-database-connection-string?tabs=azure-cli&pivots=workload-id#create-a-service-connection-in-aks-with-service-connector).

### [Bash](#tab/in-bash)

```azurecli
# Register the Service Connector and Kubernetes Configuration resource providers
az provider register --namespace Microsoft.ServiceLinker --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait

# Install the Service Connector passwordless extension
az extension add \
    --name serviceconnector-passwordless \
    --upgrade \
    --allow-preview true

# Retrieve the AKS cluster and Azure SQL Server resource IDs
export AKS_CLUSTER_RESOURCE_ID=$(az aks show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --query id \
    --output tsv)

export AZURE_SQL_SERVER_RESOURCE_ID=$(az sql server show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $SQL_SERVER_NAME \
    --query id \
    --output tsv)

# Create a user-assigned managed identity used for workload identity
export USER_ASSIGNED_IDENTITY_NAME=workload-identity-uami
az identity create \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name ${USER_ASSIGNED_IDENTITY_NAME}

# Retrieve the user-assigned managed identity resource ID
export UAMI_RESOURCE_ID=$(az identity show \
    --resource-group ${RESOURCE_GROUP_NAME} \
    --name ${USER_ASSIGNED_IDENTITY_NAME} \
    --query id \
    --output tsv)

# Create a service connection between your AKS cluster and your SQL database using Microsoft Entra Workload ID
az aks connection create sql \
    --connection akssqlconn \
    --client-type java \
    --source-id $AKS_CLUSTER_RESOURCE_ID \
    --target-id $AZURE_SQL_SERVER_RESOURCE_ID/databases/$DB_NAME \
    --workload-identity $UAMI_RESOURCE_ID
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
# Register the Service Connector and Kubernetes Configuration resource providers
az provider register --namespace Microsoft.ServiceLinker --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait

# Install the Service Connector passwordless extension
az extension add --name serviceconnector-passwordless --upgrade --allow-preview true

# Retrieve the AKS cluster and Azure SQL Server resource IDs
$Env:AKS_CLUSTER_RESOURCE_ID = $(az aks show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:CLUSTER_NAME `
    --query id --output tsv)

$Env:AZURE_SQL_SERVER_RESOURCE_ID = $(az sql server show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:SQL_SERVER_NAME `
    --query id `
    --output tsv)

# Create a user-assigned managed identity used for workload identity
$Env:USER_ASSIGNED_IDENTITY_NAME = "workload-identity-uami"
az identity create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:USER_ASSIGNED_IDENTITY_NAME

# Retrieve the user-assigned managed identity resource ID
$Env:UAMI_RESOURCE_ID = $(az identity show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:USER_ASSIGNED_IDENTITY_NAME `
    --query id `
    --output tsv)

# Create a service connection between your AKS cluster and your SQL database using Microsoft Entra Workload ID
az aks connection create sql `
    --connection akssqlconn `
    --client-type java `
    --source-id $Env:AKS_CLUSTER_RESOURCE_ID `
    --target-id $Env:AZURE_SQL_SERVER_RESOURCE_ID/databases/$Env:DB_NAME `
    --workload-identity $Env:UAMI_RESOURCE_ID
```

---

### Troubleshoot error messages

If the `az aks connection create sql` command produces an error message, find the error message in the following list and then use the instructions to troubleshoot the issue:

* `Dependency pyodbc can't be installed, please install it manually`

    This error message indicates that the `pyodbc` package can't be installed, most likely because of permissions issues. Fix the problem by using the following steps:

    #### [Bash](#tab/in-bash)

    1. Find the location of Python that works with the Azure CLI by running the following command:

        ```azurecli
        az --version
        ```

        The output should contain `Python location` - for example, `Python location '/opt/az/bin/python3'`.

    1. Copy the `Python location` value.

    1. Use the following command to install the `pyodbc` package in `sudo` mode. Replace `<python-location>` with the Python location you copied in the previous step.

        ```azurecli
        sudo <python-location> -m pip install pyodbc
        ```

    #### [PowerShell](#tab/in-powershell)

    1. Find the location of Python that works with the Azure CLI by using the following command:

        ```powershell
        az --version
        ```

       The output should contain `Python location` - for example, `Python location 'C:\Program Files\Microsoft SDKs\Azure\CLI2\python.exe'`.

    1. Copy the `Python location` value.

    1. Open Windows PowerShell with administrator privileges. For more information, see the [Run with administrative privileges](/powershell/scripting/windows-powershell/starting-windows-powershell#run-with-administrative-privileges) section of [Starting Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell).

    1. Use the following command to install the `pyodbc` package. Replace `<python-location>` with the Python location you copied in the previous step.

        ```powershell
        & '<python-location>' -m pip install pyodbc
        ```

    ---

* libodbc.so: cannot open shared object file: No such file or directory
* Please manually install odbc 17/18 for SQL server

    These errors indicate that the `odbc` driver isn't installed. Fix the problem by using the following steps:

    > [!NOTE]
    > You should use Microsoft Entra Workload ID for secure access to your Azure SQL Database without using SQL authentication. If you need to use SQL authentication, ignore the steps in this section and use the username and password to connect to the Azure SQL Database.

    #### [Bash](#tab/in-bash)

    1. If you're using Linux, open [Install the Microsoft ODBC driver for SQL Server (Linux)](/sql/connect/odbc/linux-mac/installing-the-microsoft-odbc-driver-for-sql-server?view=azuresqldb-current&preserve-view=true). If you're using MacOS, open [Install the Microsoft ODBC driver for SQL Server (macOS)](/sql/connect/odbc/linux-mac/install-microsoft-odbc-driver-sql-server-macos?view=azuresqldb-current&preserve-view=true).

    1. Follow the instructions to install the Microsoft ODBC Driver (18 or 17) for SQL Server.

    1. Use `az aks connection create sql` again to create the service connection, as shown in the following example:

        ```azurecli
        az aks connection create sql \
            --connection akssqlconn \
            --client-type java \
            --source-id $AKS_CLUSTER_RESOURCE_ID \
            --target-id $AZURE_SQL_SERVER_RESOURCE_ID/databases/$DB_NAME \
            --workload-identity $UAMI_RESOURCE_ID
        ```

    #### [PowerShell](#tab/in-powershell)

    1. Open [Download ODBC Driver for SQL Server](/sql/connect/odbc/download-odbc-driver-for-sql-server?view=azuresqldb-current&preserve-view=true) in your browser.

    1. From the [Download for Windows](/sql/connect/odbc/download-odbc-driver-for-sql-server?view=azuresqldb-current&preserve-view=true#download-for-windows) section, find and download the appropriate installer for Microsoft ODBC Driver for SQL Server.

    1. Follow the instructions, run the installer, and install the driver.

    1. Use `az aks connection create sql` again to create the service connection, as shown in the following example:

        ```powershell
        az aks connection create sql `
            --connection akssqlconn `
            --client-type java `
            --source-id $Env:AKS_CLUSTER_RESOURCE_ID `
            --target-id $Env:AZURE_SQL_SERVER_RESOURCE_ID/databases/$Env:DB_NAME `
            --workload-identity $Env:UAMI_RESOURCE_ID
        ```

    ---

## Get the service account and secret created by Service Connector

To authenticate with Azure SQL Database, use the following steps:

1. Get the service account and secret created by Service Connector by following the instructions in the [Update your container](/azure/service-connector/tutorial-python-aks-sql-database-connection-string?tabs=azure-cli#update-your-container) section of [Tutorial: Connect an AKS app to Azure SQL Database](/azure/service-connector/tutorial-python-aks-sql-database-connection-string?tabs=azure-cli). Use the option to directly create a deployment using the YAML sample code snippet provided.

    > [!NOTE]
    > The secret created by Service Connector contains an `AZURE_SQL_CONNECTIONSTRING` value, which is a password-free connection string to the Azure SQL Database. For more information, see the sample value from the [User-assigned managed identity](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java#user-assigned-managed-identity) section of [Integrate Azure SQL Database with Service Connector](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java).

1. From the highlighted sections in the sample Kubernetes deployment YAML, copy the `serviceAccountName` and `secretRef.name` values, as shown in the following example:

    ```yaml
    serviceAccountName: <service-account-name>
    containers:
    - name: raw-linux
       envFrom:
          - secretRef:
             name: <secret-name>
    ```

1. Define environment variables by using the following commands. Be sure to replace `<service-account-name>` and `<secret-name>` with the values you copied in the previous step:

    ### [Bash](#tab/in-bash)

    ```bash
    export SERVICE_ACCOUNT_NAME=<service-account-name>
    export SECRET_NAME=<secret-name>
    ```

    ### [PowerShell](#tab/in-powershell)

    ```powershell
    $Env:SERVICE_ACCOUNT_NAME = "<service-account-name>"
    $Env:SECRET_NAME = "<secret-name>"
    ```

    ---

    These values are used in the next section to deploy the Liberty application to the AKS cluster.

## Install the Open Liberty Operator

In this section, you install the Open Liberty Operator on the AKS cluster to host the Liberty application.

Install the [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator/tree/main/deploy/releases/1.2.2) by using the following commands:

> [!NOTE]
> This guide directs you to install the Open Liberty Operator. To use the WebSphere Liberty Operator, see [Installing WebSphere Liberty operator with the Kubernetes CLI](https://www.ibm.com/docs/en/was-liberty/nd?topic=operator-installing-kubernetes-cli).

### [Bash](#tab/in-bash)

```bash
# Install cert-manager Operator
export CERT_MANAGER_VERSION=v1.11.2
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml

# Install the Open Liberty Operator
export OPERATOR_VERSION=1.4.2
mkdir -p overlays/watch-all-namespaces
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/overlays/watch-all-namespaces/olo-all-namespaces.yaml -q -P ./overlays/watch-all-namespaces
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/overlays/watch-all-namespaces/cluster-roles.yaml -q -P ./overlays/watch-all-namespaces
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/overlays/watch-all-namespaces/kustomization.yaml -q -P ./overlays/watch-all-namespaces
mkdir base
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/base/kustomization.yaml -q -P ./base
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/base/open-liberty-crd.yaml -q -P ./base
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/base/open-liberty-operator.yaml -q -P ./base
wget https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/${OPERATOR_VERSION}/kustomize/base/open-liberty-roles.yaml -q -P ./base
kubectl create namespace open-liberty
kubectl apply --server-side -k overlays/watch-all-namespaces

# Remove the downloaded files
rm -rf overlays base
```

### [PowerShell](#tab/in-powershell)

```powershell
# Install cert-manager Operator
$Env:CERT_MANAGER_VERSION = "v1.11.2"
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/$Env:CERT_MANAGER_VERSION/cert-manager.yaml

# Install the Open Liberty Operator
$Env:OPERATOR_VERSION = "1.4.2"
mkdir -p overlays/watch-all-namespaces
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/overlays/watch-all-namespaces/olo-all-namespaces.yaml -OutFile ./overlays/watch-all-namespaces/olo-all-namespaces.yaml
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/overlays/watch-all-namespaces/cluster-roles.yaml -OutFile ./overlays/watch-all-namespaces/cluster-roles.yaml
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/overlays/watch-all-namespaces/kustomization.yaml -OutFile ./overlays/watch-all-namespaces/kustomization.yaml
mkdir base
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/base/kustomization.yaml -OutFile ./base/kustomization.yaml
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/base/open-liberty-crd.yaml -OutFile ./base/open-liberty-crd.yaml
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/base/open-liberty-operator.yaml -OutFile ./base/open-liberty-operator.yaml
Invoke-WebRequest https://raw.githubusercontent.com/OpenLiberty/open-liberty-operator/main/deploy/releases/$Env:OPERATOR_VERSION/kustomize/base/open-liberty-roles.yaml -OutFile ./base/open-liberty-roles.yaml
kubectl create namespace open-liberty
kubectl apply --server-side -k overlays/watch-all-namespaces

# Remove the downloaded files
Remove-Item -Recurse -Force overlays, base
```

---

## Configure and build the application image

To deploy and run your Liberty application on the AKS cluster, containerize your application as a Docker image using [Open Liberty Images](https://github.com/OpenLiberty/ci.docker) or [WebSphere Liberty container images](https://www.ibm.com/docs/was-liberty/base?topic=images-liberty-container#cntr_r_images__wlicr__title__1).

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Clone the sample code for this guide by using the following commands. The sample is in the [Open Liberty/WebSphere Liberty on Azure Kubernetes Service Samples](https://github.com/Azure-Samples/open-liberty-on-aks) GitHub repo, which contains a few samples. This article uses the `java-app` sample.

#### [Bash](#tab/in-bash)

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
export BASE_DIR=$PWD
git checkout 20250424
```

#### [PowerShell](#tab/in-powershell)

```powershell
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
$Env:BASE_DIR = $PWD
git checkout 20250424
```

---

If you see a message about being in `detached HEAD` state, this message is safe to ignore. It just means you checked out a tag. Cloning the repo creates the following file structure:

```
java-app
├─ src/main/
│  ├─ aks/
│  │  ├─ openlibertyapplication-passwordless-db.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-wlp
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
├─ pom-azure-identity.xml
```

The directories **java**, **resources**, and **webapp** contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the **aks** directory, the file **openlibertyapplication-passwordless-db.yaml** is used to deploy the application image. In the **docker** directory, there are two files to create the application image with either Open Liberty or WebSphere Liberty.

In the **liberty/config** directory, the **server.xml** file is used to configure the database connection for the Open Liberty and WebSphere Liberty cluster. It defines an `azure.sql.connectionstring` variable that is used to connect to the Azure SQL Database.

The **pom.xml** file is the Maven project object model (POM) file that contains the configuration information for the project. The **pom-azure-identity.xml** file declares the `azure-identity` dependency, which is used to authenticate to Azure services using Microsoft Entra ID.

> [!NOTE]
> This sample uses the `azure-identity` library to authenticate to Azure SQL Database using Microsoft Entra authentication, which is recommended for security considerations. For more information on using SQL authentication in your Liberty application, see [Relational database connections with Java Database Connectivity (JDBC)](https://openliberty.io/docs/latest/relational-database-connections-JDBC.html).

### Build the project

Now that you gathered the necessary properties, build the application by using the following commands. The POM file for the project reads many variables from the environment. As part of the Maven build, these variables are used to populate values in the YAML files located in **src/main/aks**. You can do something similar for your application outside Maven if you prefer.

#### [Bash](#tab/in-bash)

```bash
cd $BASE_DIR/java-app

# The following variables are used for deployment file generation into target/
export LOGIN_SERVER=${LOGIN_SERVER}
export SC_SERVICE_ACCOUNT_NAME=${SERVICE_ACCOUNT_NAME}
export SC_SECRET_NAME=${SECRET_NAME}

mvn clean install
mvn dependency:copy-dependencies -f pom-azure-identity.xml -DoutputDirectory=target/liberty/wlp/usr/shared/resources
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd $Env:BASE_DIR/java-app

# The following variables are used for deployment file generation into target/
$Env:LOGIN_SERVER = $Env:LOGIN_SERVER
$Env:SC_SERVICE_ACCOUNT_NAME = $Env:SERVICE_ACCOUNT_NAME
$Env:SC_SECRET_NAME = $Env:SECRET_NAME

mvn clean install
mvn dependency:copy-dependencies -f pom-azure-identity.xml -DoutputDirectory=target/liberty/wlp/usr/shared/resources
```

---

### Build the image for AKS deployment

Use [`az acr build`](/cli/azure/acr#az-acr-build) to build the image, as shown in the following example:

#### [Bash](#tab/in-bash)

```azurecli
cd $BASE_DIR/java-app/target

az acr build \
    --registry ${REGISTRY_NAME} \
    --image javaee-cafe:v1 \
    .
```

#### [PowerShell](#tab/in-powershell)

```azurepowershell
cd $Env:BASE_DIR/java-app/target

az acr build `
    --registry $Env:REGISTRY_NAME `
    --image javaee-cafe:v1 `
    .
```

---

The `az acr build` command uploads the artifacts specified in the **Dockerfile** to the container registry instance, builds the image, and stores it in the container registry instance.

## Deploy the application to the AKS cluster

Use the following steps to deploy the Liberty application on the AKS cluster:

1. Apply the deployment file by using the following commands:

    ### [Bash](#tab/in-bash)

    ```bash
    cd $BASE_DIR/java-app/target

    # Apply deployment file
    kubectl apply -f openlibertyapplication-passwordless-db.yaml
    ```

    ### [PowerShell](#tab/in-powershell)

    ```powershell
    cd $Env:BASE_DIR/java-app/target

    # Apply deployment file
    kubectl apply -f openlibertyapplication-passwordless-db.yaml
    ```

    ---

1. Determine whether the `OpenLibertyApplication` instance is created by using the following command:

    ### [Bash](#tab/in-bash)

    ```bash
    kubectl get openlibertyapplication javaee-cafe-cluster --watch
    ```

    ### [PowerShell](#tab/in-powershell)

    ```powershell
    kubectl get openlibertyapplication javaee-cafe-cluster --watch
    ```

     ---

    The following output is typical. Use <kbd>Ctrl</kbd>+<kbd>C</kbd> to exit.

    ```output
    NAME                  IMAGE                                        EXPOSED   RECONCILED   RESOURCESREADY   READY   WARNING   AGE
    javaee-cafe-cluster   <registry-name>.azurecr.io/javaee-cafe:v1              True         True             True              57s
    ```

1. Determine whether the deployment created by the operator is ready by using the following command:

    ### [Bash](#tab/in-bash)

    ```bash
    kubectl get deployment javaee-cafe-cluster --watch
    ```

    ### [PowerShell](#tab/in-powershell)

    ```powershell
    kubectl get deployment javaee-cafe-cluster --watch
    ```

    ---

    The following output is typical:

    ```output
    NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
    javaee-cafe-cluster         0/3     3            0           20s
    ```

1. Wait until you see `3/3` under the `READY` column and `3` under the `AVAILABLE` column, then use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the `kubectl` watch process.

## Test the application

When the application runs, a Kubernetes load balancer service exposes the application front end to the internet. This process can take some time to complete.

Use [`kubectl get service`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) to get the external IP address of the service when it's available, as shown in the following example:

### [Bash](#tab/in-bash)

```bash
export APP_URL=http://$(kubectl get service javaee-cafe-cluster -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo $APP_URL
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:APP_URL = "http://$(kubectl get service javaee-cafe-cluster -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
echo $Env:APP_URL
```

---

> [!NOTE]
> If you don't see a valid URL from the output, wait for a while and run the command again.

Open the URL in a web browser and check the application home page. If the page doesn't load correctly, refresh the page later, after the app starts. You should see the pod name of your application replicas displayed at the top-left of the page. Wait for a few minutes and refresh the page to see a different pod name displayed due to load balancing provided by the AKS cluster.

:::image type="content" source="./media/howto-deploy-java-liberty-app-manual/deployment-succeeded.png" alt-text="Screenshot of the Java liberty application home page.":::

> [!NOTE]
> Currently, the application doesn't use HTTPS. We recommend that you enable Transport Layer Security (TLS) with your own certificates. For more information, see [Use TLS with an ingress controller on Azure Kubernetes Service (AKS)](/azure/aks/ingress-tls).

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use [`az group delete`](/cli/azure/group#az-group-delete) to remove the resource group, container service, container registry, database, and all related resources.

### [Bash](#tab/in-bash)

```azurecli
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
az group delete --name $Env:RESOURCE_GROUP_NAME --yes --no-wait
```

---

## Next steps

You can learn more from the following references used in this guide:

* [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks)
* [Tutorial: Connect an AKS app to Azure SQL Database](/azure/service-connector/tutorial-python-aks-sql-database-connection-string?tabs=azure-cli)
* [Integrate Azure SQL Database with Service Connector](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java%2Csql-secret-java)
* [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication?view=azuresqldb-current&preserve-view=true)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server configuration overview](https://openliberty.io/docs/latest/reference/config/server-configuration-overview.html)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Images](https://github.com/OpenLiberty/ci.docker)
* [WebSphere Liberty container images](https://www.ibm.com/docs/was-liberty/base?topic=images-liberty-container#cntr_r_images__wlicr__title__1)

To incorporate Azure Cache for Redis into a Java app, see [Quickstart: Use Azure Cache for Redis in Java with Redisson Redis client](/azure/redis/java-redisson-get-started).

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)
