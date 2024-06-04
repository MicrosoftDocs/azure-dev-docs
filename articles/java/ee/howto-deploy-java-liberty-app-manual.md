---
title: Manually Deploy a Java Application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster
recommendations: false
description: Shows you how to manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster.
author: KarlErickson
ms.author: edburns
ms.topic: conceptual
ms.date: 05/29/2024
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, devx-track-azurecli, devx-track-extended-java
---

# Manually deploy a Java application with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article explains how to:

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime.
* Build the application Docker image using Liberty container images.
* Deploy the containerized application to an Azure Kubernetes Service (AKS) cluster using the Liberty Operator.

The Liberty Operator simplifies the deployment and management of applications running on Kubernetes clusters. With the Open Liberty Operator or WebSphere Liberty Operator, you can also perform more advanced operations, such as gathering traces and dumps.

This article is step-by-step manual guidance for running Open/WebSphere Liberty on Azure. For a more automated solution that accelerates your journey to AKS, see [Deploy a Java application with Open Liberty/WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster](/azure/aks/howto-deploy-java-liberty-app?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing the Azure Marketplace solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Prepare a local machine with Windows, macOS, or Linux installed.
* Install the [Azure CLI](/cli/azure/install-azure-cli). If you're running on Windows or macOS, consider running the Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).
* When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
* Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade). This article requires at least version 2.31.0 of the Azure CLI.
* Install a Java Standard Edition (SE) implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) version 3.5.0 or later.
* Install [Docker](https://docs.docker.com/get-docker/) for your OS.
* Ensure that [Git](https://git-scm.com) is installed.
* Make sure you're assigned either the `Owner` role or the `Contributor` and `User Access Administrator` roles in the subscription. You can verify the assignment by following the steps in [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal).

> [!NOTE]
> You can also run the commands in this article from [Azure Cloud Shell](/azure/cloud-shell/quickstart). This approach has all the prerequisite tools preinstalled, with the exception of Docker.
>
> :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to open Azure Cloud Shell." border="false" link="https://shell.azure.com":::

## Sign in to Azure

If you didn't do so already, sign in to your Azure subscription by using the [az login](/cli/azure/authenticate-azure-cli) command and follow the on-screen directions.

### [Bash](#tab/in-bash)

```bash
az login
```

### [PowerShell](#tab/in-powershell)

```powershell
az login
```

---

> [!NOTE]
> You can run most Azure CLI commands in PowerShell the same as in Bash. The difference exists only when using variables. In the following sections, the difference will be addressed in different tabs when needed.
>
> If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this with the `--tenant` option. For example, `az login --tenant contoso.onmicrosoft.com`.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

Create a resource group called *java-liberty-project* using the [az group create](/cli/azure/group#az-group-create) command in the *eastus* location. This resource group is used later for creating the Azure Container Registry (ACR) instance and the AKS cluster.

### [Bash](#tab/in-bash)

```bash
export RESOURCE_GROUP_NAME=java-liberty-project
az group create --name $RESOURCE_GROUP_NAME --location eastus
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:RESOURCE_GROUP_NAME = "java-liberty-project"
az group create --name $Env:RESOURCE_GROUP_NAME --location eastus
```

---

## Create an ACR instance

Use the [az acr create](/cli/azure/acr#az-acr-create) command to create the ACR instance. The following example creates an ACR instance named *youruniqueacrname*. Make sure *youruniqueacrname* is unique within Azure.

### [Bash](#tab/in-bash)

```bash
export REGISTRY_NAME=youruniqueacrname
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --sku Basic \
    --admin-enabled
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:REGISTRY_NAME = "youruniqueacrname"
az acr create --resource-group $Env:RESOURCE_GROUP_NAME --name $Env:REGISTRY_NAME --sku Basic --admin-enabled
```

---

After a short time, you should see a JSON output that contains the following lines:

```output
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "java-liberty-project",
```

## Connect to the ACR instance

You need to sign in to the ACR instance before you can push an image to it. Use the following commands to verify the connection:

### [Bash](#tab/in-bash)

```bash
export LOGIN_SERVER=$(az acr show \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv)
export USER_NAME=$(az acr credential show \
    --name $REGISTRY_NAME \
    --query 'username' \
    --output tsv)
export PASSWORD=$(az acr credential show \
    --name $REGISTRY_NAME \
    --query 'passwords[0].value' \
    --output tsv)

docker login $LOGIN_SERVER -u $USER_NAME -p $PASSWORD
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:LOGIN_SERVER = $(az acr show --name $Env:REGISTRY_NAME --query 'loginServer' --output tsv)
$Env:USER_NAME=$(az acr credential show --name $Env:REGISTRY_NAME --query 'username' --output tsv)
$Env:PASSWORD=$(az acr credential show --name $Env:REGISTRY_NAME --query 'passwords[0].value' --output tsv)

docker login $Env:LOGIN_SERVER -u $Env:USER_NAME -p $Env:PASSWORD
```

---

You should see `Login Succeeded` at the end of command output if you're logged into the ACR instance successfully.

## Create an AKS cluster

Use the [az aks create](/cli/azure/aks#az-aks-create) command to create an AKS cluster. The following example creates a cluster named *myAKSCluster* with one node. This command takes several minutes to complete.

### [Bash](#tab/in-bash)

```bash
export CLUSTER_NAME=myAKSCluster
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --generate-ssh-keys \
    --enable-managed-identity
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:CLUSTER_NAME = "myAKSCluster"
az aks create --resource-group $Env:RESOURCE_GROUP_NAME --name $Env:CLUSTER_NAME --node-count 1 --generate-ssh-keys --enable-managed-identity
```

---

After a few minutes, the command completes and returns JSON-formatted information about the cluster, including the following output:

```output
  "nodeResourceGroup": "MC_java-liberty-project_myAKSCluster_eastus",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "java-liberty-project",
```

## Connect to the AKS cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az-aks-install-cli) command, as shown in the following example:

### [Bash](#tab/in-bash)

```bash
az aks install-cli
```

### [PowerShell](#tab/in-powershell)

```powershell
az aks install-cli
```

---

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az-aks-get-credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

### [Bash](#tab/in-bash)

```bash
az aks get-credentials \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --overwrite-existing \
    --admin
```

### [PowerShell](#tab/in-powershell)

```powershell
az aks get-credentials --resource-group $Env:RESOURCE_GROUP_NAME --name $Env:CLUSTER_NAME --overwrite-existing --admin
```

---

> [!NOTE]
> The above command uses the default location for the [Kubernetes configuration file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/), which is `~/.kube/config`. You can specify a different location for your Kubernetes configuration file using `--file`.

To verify the connection to your cluster, use the [kubectl get]( https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

### [Bash](#tab/in-bash)

```bash
kubectl get nodes
```

### [PowerShell](#tab/in-powershell)

```powershell
kubectl get nodes
```

---

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*:

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-xxxxxxxx-yyyyyyyyyy   Ready    agent   76s     v1.23.8
```

## Create an Azure SQL Database

In this section, you create an Azure SQL Database single database for use with your app.

Create a single database in Azure SQL Database by following the Azure CLI or PowerShell steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli). Use the following directions as you go through the article, then return to this document after you create and configure the database server.

1. When you reach the [Set parameter values](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli#set-parameter-values) section of the quickstart, copy and save aside the values of all variables in the code example labeled `Variable block`, including `location`, `resourceGroup`,`database`, `server`, `login`, and `password`. This article refers to the database `resourceGroup` as `<db-resource-group>`.

1. After you create the database server, go to the newly created server in the Azure portal. In the **Networking** pane, under the **Connectivity** tab, set the **Minimum TLS version** to **TLS 1.0**.

   :::image type="content" source="media/howto-deploy-java-liberty-app/sql-database-minimum-tls-version.png" alt-text="Screenshot of configuring SQL database networking TLS 1.0.":::

1. In the **Networking** pane, under the **Public access** tab, select **Allow Azure services and resources to access this server**.

   :::image type="content" source="media/howto-deploy-java-liberty-app/sql-database-allow-access.png" alt-text="Screenshot of firewall rules - allow Azure resources access.":::

1. If you want to test the application locally, ensure your client IPv4 address is in the allowlist of **Firewall rules**

   :::image type="content" source="media/howto-deploy-java-liberty-app/sql-database-firewall-rules.png" alt-text="Screenshot of firewall rules - allow client access.":::

1. Save your networking changes.

1. Use the following command to create an environment variable for the resource group name for the database:

   ### [Bash](#tab/in-bash)

   ```bash
   export DB_RESOURCE_GROUP_NAME=<db-resource-group>
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   $Env:DB_RESOURCE_GROUP_NAME="<db-resource-group>"
   ```

Now that you created the database and AKS cluster, you can prepare AKS to host Liberty.

## Install Open Liberty Operator

After creating and connecting to the cluster, install the Open Liberty Operator.

Install the [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator/tree/main/deploy/releases/1.2.2#option-2-install-using-kustomize) by running the following commands:

### [Bash](#tab/in-bash)

```bash
# Install cert-manager Operator
CERT_MANAGER_VERSION=v1.11.2
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/${CERT_MANAGER_VERSION}/cert-manager.yaml

# Install Open Liberty Operator
export OPERATOR_VERSION=1.2.2
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
```

### [PowerShell](#tab/in-powershell)

```powershell
# Install cert-manager Operator
$Env:CERT_MANAGER_VERSION = "v1.11.2"
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/$Env:CERT_MANAGER_VERSION/cert-manager.yaml

# Install Open Liberty Operator
$Env:OPERATOR_VERSION = "1.2.2"
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
```

---

## Configure and build the application image

To deploy and run your Liberty application on the AKS cluster, containerize your application as a Docker image using [Open Liberty container images](https://github.com/OpenLiberty/ci.docker) or [WebSphere Liberty container images](https://github.com/WASdev/ci.docker).

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Clone the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aks). There are a few samples in the repository. This article uses *java-app*. Here's the file structure of the application.

```azurecli-interactive
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
git checkout 20230830
```

If you see a message about being in "detached HEAD" state, this message is safe to ignore. It just means you checked out a tag.

```
java-app
├─ src/main/
│  ├─ aks/
│  │  ├─ db-secret.yaml
│  │  ├─ openlibertyapplication.yaml
│  ├─ docker/
│  │  ├─ Dockerfile
│  │  ├─ Dockerfile-wlp
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ pom.xml
```

The directories *java*, *resources*, and *webapp* contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the *aks* directory, there are two deployment files. *db-secret.xml* is used to create [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) with database connection credentials. The file *openlibertyapplication.yaml* is used to deploy the application image. In the *docker* directory, there are two files to create the application image with either Open Liberty or WebSphere Liberty.

In directory *liberty/config*, the *server.xml* is used to configure the database connection for the Open Liberty and WebSphere Liberty cluster.

### Build the project

Now that you gathered the necessary properties, you can build the application. The POM file for the project reads many variables from the environment. As part of the Maven build, these variables are used to populate values in the YAML files located in *src/main/aks*. You can do something similar for your application outside Maven if you prefer.

#### [Bash](#tab/in-bash)

```bash
cd <path-to-your-repo>/java-app

# The following variables will be used for deployment file generation into target/
export LOGIN_SERVER=${LOGIN_SERVER}
export REGISTRY_NAME=${REGISTRY_NAME}
export USER_NAME=${USER_NAME}
export PASSWORD=${PASSWORD}
export DB_SERVER_NAME=<Server name>.database.windows.net
export DB_NAME=<Database name>
export DB_USER=<Server admin login>@<Server name>
export DB_PASSWORD=<Server admin password>

mvn clean install
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd <path-to-your-repo>/java-app

# The following variables will be used for deployment file generation into target/
$Env:LOGIN_SERVER = $Env:LOGIN_SERVER
$Env:REGISTRY_NAME = $Env:REGISTRY_NAME
$Env:USER_NAME = $Env:USER_NAME
$Env:PASSWORD = $Env:PASSWORD
$Env:DB_SERVER_NAME = "<Server name>.database.windows.net"
$Env:DB_NAME = "<Database name>"
$Env:DB_USER = "<Server admin login>@<Server name>"
$Env:DB_PASSWORD = "<Server admin password>"

mvn clean install
```

---

### (Optional) Test your project locally

You can now run and test the project locally before deploying to Azure. For convenience, use the `liberty-maven-plugin`. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html). For your application, you can do something similar using any other mechanism such as your local IDE. You can also consider using the `liberty:devc` option intended for development with containers. You can read more about `liberty:devc` in the [Liberty docs](https://openliberty.io/docs/latest/development-mode.html#_container_support_for_dev_mode).

> [!NOTE]
> If you selected a "serverless" database deployment, verify that your SQL database has not entered pause mode. One way to do this is to log in to the database query editor as described in [Quickstart: Use the Azure portal query editor (preview) to query Azure SQL Database](/azure/azure-sql/database/connect-query-portal).

1. Start the application using `liberty:run`. `liberty:run` uses the environment variables defined in the previous step.

   ### [Bash](#tab/in-bash)

   ```bash
   cd <path-to-your-repo>/java-app
   mvn liberty:run
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   cd <path-to-your-repo>/java-app
   mvn liberty:run
   ```

1. Verify the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `http://localhost:9080/` in your browser to verify the application is accessible and all functions are working.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Build the image for AKS deployment

You can now run the `docker buildx build` command to build the image, as shown in the following example:

### [Bash](#tab/in-bash)

```bash
cd <path-to-your-repo>/java-app/target

# If you are running with Open Liberty
docker buildx --platform linux/amd64 build -t javaee-cafe:v1 --pull --file=Dockerfile .

# If you are running with WebSphere Liberty
docker buildx --platform linux/amd64 build -t javaee-cafe:v1 --pull --file=Dockerfile-wlp .
```

### [PowerShell](#tab/in-powershell)

```powershell
cd <path-to-your-repo>/java-app/target

# If you are running with Open Liberty
docker build -t javaee-cafe:v1 --pull --file=Dockerfile .

# If you are running with WebSphere Liberty
docker build -t javaee-cafe:v1 --pull --file=Dockerfile-wlp .
```

---

### (Optional) Test the Docker image locally

You can now use the following steps to test the Docker image locally before deploying to Azure.

1. Run the image using the following command. This command uses the environment variables defined previously.

   #### [Bash](#tab/in-bash)

   ```bash
   docker run -it --rm -p 9080:9080 \
       -e DB_SERVER_NAME=${DB_SERVER_NAME} \
       -e DB_NAME=${DB_NAME} \
       -e DB_USER=${DB_USER} \
       -e DB_PASSWORD=${DB_PASSWORD} \
       javaee-cafe:v1
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   docker run -it --rm -p 9080:9080 -e DB_SERVER_NAME=$Env:DB_SERVER_NAME -e DB_NAME=$Env:DB_NAME -e DB_USER=$Env:DB_USER -e DB_PASSWORD=$Env:DB_PASSWORD javaee-cafe:v1
   ```

1. After the container starts, go to `http://localhost:9080/` in your browser to access the application.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Upload the image to ACR

Next, upload the built image to the ACR you created in the previous steps.

If you didn't already do so, sign in to the container registry by using the following command:

#### [Bash](#tab/in-bash)

```bash
docker login -u ${USER_NAME} -p ${PASSWORD} ${LOGIN_SERVER}
```

#### [PowerShell](#tab/in-powershell)

```powershell
docker login -u $Env:USER_NAME -p $Env:PASSWORD $Env:LOGIN_SERVER
```

---

Use the following commands to tag and push the container image:

#### [Bash](#tab/in-bash)

```bash
docker tag javaee-cafe:v1 ${LOGIN_SERVER}/javaee-cafe:v1
docker push ${LOGIN_SERVER}/javaee-cafe:v1
```

#### [PowerShell](#tab/in-powershell)

```powershell
docker tag javaee-cafe:v1 $Env:LOGIN_SERVER/javaee-cafe:v1
docker push $Env:LOGIN_SERVER/javaee-cafe:v1
```

---

## Deploy the application to the AKS cluster

Use the following steps to deploy the Liberty application on the AKS cluster:

1. Attach the ACR instance to the AKS cluster so that the AKS cluster is authenticated to pull image from the ACR instance, as shown in the following example:

   ### [Bash](#tab/in-bash)

   ```bash
   az aks update \
       --resource-group $RESOURCE_GROUP_NAME \
       --name $CLUSTER_NAME \
       --attach-acr $REGISTRY_NAME
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   az aks update --resource-group $Env:RESOURCE_GROUP_NAME --name $Env:CLUSTER_NAME --attach-acr $Env:REGISTRY_NAME
   ```

1. Apply the database secret and deployment file by running the following commands:

   ### [Bash](#tab/in-bash)

   ```bash
   cd <path-to-your-repo>/java-app/target

   # Apply database secret
   kubectl apply -f db-secret.yaml

   # Apply deployment file
   kubectl apply -f openlibertyapplication.yaml
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   cd <path-to-your-repo>/java-app/target

   # Apply database secret
   kubectl apply -f db-secret.yaml

   # Apply deployment file
   kubectl apply -f openlibertyapplication.yaml
   ```

1. Determine whether the `OpenLibertyApplication` instance is created by running the following command:

   ### [Bash](#tab/in-bash)

   ```bash
   kubectl get openlibertyapplication javaee-cafe-cluster
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   kubectl get openlibertyapplication javaee-cafe-cluster
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

   You should see output similar to the following example:

   ```output
   NAME                        IMAGE                                                   EXPOSED   RECONCILED   AGE
   javaee-cafe-cluster         youruniqueacrname.azurecr.io/javaee-cafe:1.0.25         True         59s
   ```

1. Determine whether the deployment created by the Operator is ready by running the following command:

   ### [Bash](#tab/in-bash)

   ```bash
   kubectl get deployment javaee-cafe-cluster --watch
   ```

   ### [PowerShell](#tab/in-powershell)

   ```powershell
   kubectl get deployment javaee-cafe-cluster --watch
   ```

    <!-- NOTE: The tab-block end-delimiter here (the "---") needs a 4-space indentation or it will be rendered as a hard rule. -->
    ---

   You should see output similar to the following example:

   ```output
   NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
   javaee-cafe-cluster         0/3     3            0           20s
   ```

1. Wait until you see `3/3` under the `READY` column and `3` under the `AVAILABLE` column, then use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the `kubectl` watch process.

## Test the application

When the application runs, a Kubernetes load balancer service exposes the application front end to the internet. This process can take a while to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument, as shown in the following example:

### [Bash](#tab/in-bash)

```bash
kubectl get service javaee-cafe-cluster --watch
```

### [PowerShell](#tab/in-powershell)

```powershell
kubectl get service javaee-cafe-cluster --watch
```

---

You should see output similar to the following example:

```output
NAME                        TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
javaee-cafe-cluster         LoadBalancer   10.0.251.169   52.152.189.57   80:31732/TCP     68s
```

After the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop the `kubectl` watch process.

If some time passed between executing the steps in this section and the preceding one, ensure the database is active, if necessary. See the previous note regarding database pause.

Open a web browser to the external IP address of your service (`52.152.189.57` for the above example) to see the application home page. If the page isn't loaded correctly, that's because the app is starting. You can wait for a while and refresh the page later. You should see the pod name of your application replicas displayed at the top-left of the page. Wait for a few minutes and refresh the page to see a different pod name displayed due to load balancing provided by the AKS cluster.

:::image type="content" source="./media/howto-deploy-java-liberty-app/deploy-succeeded.png" alt-text="Java liberty application successfully deployed on AKS.":::

>[!NOTE]
> Currently, the application doesn't use HTTPS. We recommend that you enable TLS with your own certificates. For more information, see [Use TLS with an ingress controller on Azure Kubernetes Service (AKS)](/azure/aks/ingress-tls).

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, container registry, database, and all related resources.

### [Bash](#tab/in-bash)

```bash
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $DB_RESOURCE_GROUP_NAME --yes --no-wait
```

### [PowerShell](#tab/in-powershell)

```powershell
az group delete --name $Env:RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $Env:DB_RESOURCE_GROUP_NAME --yes --no-wait
```

---

## Next steps

You can learn more from references used in this guide:

* [Azure Kubernetes Service](https://azure.microsoft.com/free/services/kubernetes-service/)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
* [WebSphere Liberty Container Images](https://github.com/WASdev/ci.docker)

To incorporate Azure Cache for Redis into a Java app

> [!div class="nextstepaction"]
> [Use Azure Cache for Redis in Java with Redisson Redis client](/azure/azure-cache-for-redis/cache-java-redisson-get-started?toc=/azure/developer/java/ee/toc.json&bc=/azure/developer/java/breadcrumb/toc.json)

Continue to explore options to run WebSphere products on Azure.

> [!div class="nextstepaction"]
> [Learn more about the IBM WebSphere family of products on Azure](../ee/websphere-family.md)