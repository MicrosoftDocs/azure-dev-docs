---
title: Use Java EE JCache with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster
description: Use Java EE JCache with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster.
author: KarlErickson
ms.author: jiangma
ms.topic: how-to
ms.date: 09/21/2022
ms.custom: template-how-to, devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aks, devx-track-javaee-websphere, devx-track-azurecli, devx-track-extended-java
#Customer intent: As a Java developer, I want to build a Java, Java EE, Jakarta EE, or MicroProfile application with JCache session enabled and deploy it on Azure Kubernetes Service cluster so that customers can store session data in the Azure Cache for Redis for session management.
---

# Use Java EE JCache with Open Liberty or WebSphere Liberty on an Azure Kubernetes Service (AKS) cluster

This article describes how to use Java EE JCache in a containerized application deployed to AKS.

In this guide, you'll:

* Create the infrastructure to run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime.
* Use Java EE JCache backed by Azure Cache for Redis as session cache.
* Build the application Docker image using Open Liberty or WebSphere Liberty container images.
* Deploy the containerized application to an AKS cluster using the Open Liberty Operator.

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing WebSphere on Azure solutions, fill out this short [survey on WebSphere migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [include](~/../articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* This article requires the latest version of Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed.
* If you're running the commands in this guide locally (instead of Azure Cloud Shell):
  * Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, Windows Subsystem for Linux).
  * Install a Java SE implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
  * Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
  * Install [Docker](https://docs.docker.com/get-docker/) for your OS.
* Be sure you've been assigned either `Owner` role or `Contributor` and `User Access Administrator` roles for the subscription. You can verify your assignments by following steps in [List role assignments for a user or group](/azure/role-based-access-control/role-assignments-list-portal#list-role-assignments-for-a-user-or-group).

## Create the infrastructure

The steps in this section guide you to create the application infrastructure on Azure. After completing these steps, you'll have an Azure Container Registry, an Azure Kubernetes Service cluster, and an Azure Cache for Redis instance for running the sample application.

### Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

Create a resource group called *java-liberty-project* using the [az group create](/cli/azure/group#az_group_create) command  in the *eastus* location. This resource group is used later for creating the Azure Container Registry (ACR) instance and the AKS cluster.

```azurecli-interactive
export RESOURCE_GROUP_NAME=java-liberty-project
az group create --name $RESOURCE_GROUP_NAME --location eastus
```

### Create an ACR instance

Use the [az acr create](/cli/azure/acr#az_acr_create) command to create the ACR instance. The following example creates an ACR instance named *youruniqueacrname*. Make sure *youruniqueacrname* is unique within Azure.

```azurecli-interactive
export REGISTRY_NAME=youruniqueacrname
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --sku Basic \
    --admin-enabled
```

After a short time, you should see a JSON output that contains:

```output
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "java-liberty-project",
```

Alternatively, you can create an Azure container registry instance by following the steps in [Quickstart: Create an Azure container registry using the Azure portal](/azure/container-registry/container-registry-get-started-portal).

#### Connect to the ACR instance

You'll need to sign in to the ACR instance before you can push an image to it. Run the following commands to verify the connection:

```azurecli-interactive
export LOGIN_SERVER=$(az acr show \
    --name $REGISTRY_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'loginServer' \
    --output tsv)
export USER_NAME=$(az acr credential show \
    --name $REGISTRY_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'username' \
    --output tsv)
export PASSWORD=$(az acr credential show \
    --name $REGISTRY_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --query 'passwords[0].value' \
    --output tsv)

docker login $LOGIN_SERVER -u $USER_NAME -p $PASSWORD
```

You should see `Login Succeeded` at the end of command output if you've signed into the ACR instance successfully.

If you see a problem signing in to the Azure container registry, see [Troubleshoot registry login](/azure/container-registry/container-registry-troubleshoot-login).

### Create an AKS cluster

Use the [az aks create](/cli/azure/aks#az_aks_create) command to create an AKS cluster and grant it image pull permission from the ACR instance. The following example creates a cluster named *myAKSCluster* with one node. This command takes several minutes to complete.

```azurecli-interactive
export CLUSTER_NAME=myAKSCluster
az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --generate-ssh-keys \
    --enable-managed-identity \
    --attach-acr $REGISTRY_NAME
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster, including the following lines:

```output
  "nodeResourceGroup": "MC_java-liberty-project_myAKSCluster_eastus",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "java-liberty-project",
```

#### Connect to the AKS cluster

To manage a Kubernetes cluster, you use [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), the Kubernetes command-line client. If you use Azure Cloud Shell, `kubectl` is already installed. To install `kubectl` locally, use the [az aks install-cli](/cli/azure/aks#az_aks_install_cli) command:

```azurecli-interactive
az aks install-cli
```

To configure `kubectl` to connect to your Kubernetes cluster, use the [az aks get-credentials](/cli/azure/aks#az_aks_get_credentials) command. This command downloads credentials and configures the Kubernetes CLI to use them.

```azurecli-interactive
az aks get-credentials \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --overwrite-existing
```

To verify the connection to your cluster, use the [kubectl get](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command to return a list of the cluster nodes.

```azurecli-interactive
kubectl get nodes
```

The following example output shows the single node created in the previous steps. Make sure that the status of the node is *Ready*.

```output
NAME                                STATUS   ROLES   AGE     VERSION
aks-nodepool1-xxxxxxxx-yyyyyyyyyy   Ready    agent   76s     v1.18.10
```

### Install Open Liberty Operator

After creating and connecting to the cluster, install the [Open Liberty Operator](https://github.com/OpenLiberty/open-liberty-operator/tree/main/deploy/releases/1.2.2#option-2-install-using-kustomize) by running the following commands.

```azurecli-interactive
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

### Create an Azure Cache for Redis instance

[Azure Cache for Redis](/azure/azure-cache-for-redis/) backs the persistence of the `HttpSession` for a Java application running within an Open Liberty or WebSphere Liberty server. Follow the steps in this section to create an Azure Cache for Redis instance and note down its connection information. We'll use this information later.

1. Follow the steps in [Quickstart: Use Azure Cache for Redis in Java](/azure/azure-cache-for-redis/cache-java-get-started) up to, but not including **Understanding the Java sample**.
1. Copy **Host name** and **Primary access key** for your Azure Cache for Redis instance, and then run the following commands to add environment variables:

   ```azurecli-interactive
   export REDISCACHEHOSTNAME=<YOUR_HOST_NAME>
   export REDISCACHEKEY=<YOUR_PRIMARY_ACCESS_KEY>
   ```

## Build the application

Follow the steps in this section to build and containerize the sample application. These steps use Maven, `liberty-maven-plugin`, and [az acr build](/cli/azure/acr#az_acr_build). To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html).

### Check out the application

Use the following commands to clone the sample code for this guide. The sample is in the [open-liberty-on-aks](https://github.com/Azure-Samples/open-liberty-on-aks) repository on GitHub. There are a few samples in the repository. This article uses *java-app-jcache*.

```azurecli-interactive
git clone https://github.com/Azure-Samples/open-liberty-on-aks.git
cd open-liberty-on-aks
git checkout 20230906
```

If you see a message about being in "detached HEAD" state, this message is safe to ignore. It just means you have checked out a tag.

The application has the following file structure:

```text
java-app-jcache/
├── pom.xml
└── src
    └── main
        ├── aks
        │   └── openlibertyapplication.yaml
        ├── docker
        │   ├── Dockerfile
        │   └── Dockerfile-wlp
        ├── java
        ├── liberty
        │   └── config
        │       └── server.xml
        ├── redisson
        │   └── redisson-config.yaml
        ├── resources
        └── webapp
```

The *java*, *resources*, and *webapp* directories contain the source code of the sample application.

In the *aks* directory, the deployment file *openlibertyapplication.yaml* is used to deploy the application image.

In the *docker* directory, we place two Dockerfiles. *Dockerfile* is used to build image with Open Liberty and *Dockerfile-wlp* is used to build image with WebSphere Liberty.

In the *liberty/config* directory, the *server.xml* file is used to configure session cache for the Open Liberty and WebSphere Liberty cluster.

In the *redisson* directory, the *redisson-config.yaml* file is used to configure the connection of the Azure Cache for Redis instance.

### Containerize the application

To deploy and run your Liberty application on the AKS cluster, use the following steps to containerize your application as a Docker image. You can use [Open Liberty container images](https://github.com/OpenLiberty/ci.docker) or [WebSphere Liberty container images](https://github.com/WASdev/ci.docker).

1. Change directory to *java-app-jcache* of your local clone.
1. Run `mvn clean package` to package the application.
1. Run `mvn -Predisson validate` to copy the Redisson configuration file to the specified location. This step inserts the values of the environment variables `REDISCACHEHOSTNAME` and `REDISCACHEKEY` into the *redisson-config.yaml* file, which is referenced by the *server.xml* file.
1. Run `mvn liberty:dev` to test the application. If the test is successful, you should see `The defaultServer server is ready to run a smarter planet.` in the command output.
   You should see output similar to the following if the Redis connection is successful.

   ```output
   [INFO] [err] [Default Executor-thread-5] INFO org.redisson.Version - Redisson 3.16.7
   [INFO] [err] [redisson-netty-2-2] INFO org.redisson.connection.pool.MasterPubSubConnectionPool - 1 connections initialized for redacted.redis.cache.windows.net/20.25.90.239:6380
   [INFO] [err] [redisson-netty-2-20] INFO org.redisson.connection.pool.MasterConnectionPool - 24 connections initialized for redacted.redis.cache.windows.net/20.25.90.239:6380
   ```

1. You can visit `http://localhost:9080/` to see the application running, but the proof of Redis working is the output listed in the preceding step.
1. Use Ctrl+C to stop the application.
1. Use the following commands to retrieve values for properties `artifactId` and `version` defined in the *pom.xml* file.

   ```azurecli-interactive
   export artifactId=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.artifactId}' --non-recursive exec:exec)
   export version=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)
   ```

1. Run `cd target` to change directory to the build of the sample.
1. Run one of the following commands to build the application image and push it to the ACR instance.
   * Use the following command to build with an Open Liberty base image if you prefer to use Open Liberty as a lightweight open source Java&trade; runtime:

     ```azurecli-interactive
     # Build and tag application image. This causes the ACR instance to pull the necessary Open Liberty base images.
     az acr build -t ${artifactId}:${version} -r $REGISTRY_NAME --resource-group $RESOURCE_GROUP_NAME .
     ```

   * Use the following command to build with a WebSphere Liberty base image if you prefer to use a commercial version of Open Liberty:

     ```azurecli-interactive
     # Build and tag application image. This causes the ACR instance to pull the necessary WebSphere Liberty base images.
     az acr build -t ${artifactId}:${version} -r $REGISTRY_NAME --resource-group $RESOURCE_GROUP_NAME --file=Dockerfile-wlp .
     ```

## Deploy the application

Follow the steps in this section to deploy the containerized sample application on the AKS cluster.

1. Verify the current working directory is *java-app-jcache/target* in your local clone.
1. Use the following commands to create a secret with Redisson configuration information. With this secret, the application can connect to the created Azure Cache for Redis instance.

   ```azurecli-interactive
   export REDISSON_CONFIG_SECRET_NAME=redisson-config-secret
   kubectl create secret generic ${REDISSON_CONFIG_SECRET_NAME} --from-file=$(pwd)/liberty/wlp/usr/servers/defaultServer/redisson-config.yaml
   ```

1. Use the following commands to deploy your Liberty application with three replicas to the AKS cluster. The command output is also shown inline.

   ```azurecli-interactive
   # Set number of application replicas
   export REPLICAS=3

   # Create OpenLibertyApplication "javaee-cafe-jcache-cluster"
   envsubst < openlibertyapplication.yaml | kubectl create -f -

   openlibertyapplication.openliberty.io/javaee-cafe-jcache-cluster created

   # Check if OpenLibertyApplication instance is created
   kubectl get openlibertyapplication ${artifactId}-cluster

   NAME                               IMAGE                                                         EXPOSED      RECONCILED   AGE
   javaee-cafe-jcache-cluster         youruniqueacrname.azurecr.io/javaee-cafe-jcache:1.0.0                      True         59s

   # Check if deployment created by Operator is ready
   kubectl get deployment ${artifactId}-cluster --watch

   NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
   javaee-cafe-jcache-cluster         0/3     3            0           20s
   ```

1. Wait until you see `3/3` under the `READY` column and `3` under the `AVAILABLE` column, then use Ctrl+C to stop the `kubectl` watch process.

### Test the application

When the application runs, a Kubernetes load balancer service exposes the application front end to the internet. This process can take a while to complete.

To monitor progress, use the [kubectl get service](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get) command with the `--watch` argument.

```azurecli-interactive
kubectl get service ${artifactId}-cluster --watch

NAME                               TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
javaee-cafe-jcache-cluster         LoadBalancer   10.0.50.29     20.84.16.169    80:31732/TCP     68s
```

Once the *EXTERNAL-IP* address changes from *pending* to an actual public IP address, use Ctrl+C to stop the `kubectl` watch process.

Open a web browser to the external IP address of your service (`20.84.16.169` for the above example) to see the application home page. If the page isn't loaded correctly, that's because the app is starting. You can wait for a while and refresh the page later. You should see the pod name of your application replicas displayed at the top-left of the page (`javaee-cafe-jcache-cluster-77d54bccd4-5xnzx` for this case).

:::image type="content" source="media/how-to-deploy-java-liberty-jcache/deploy-succeeded.png" alt-text="Screenshot of Java liberty application successfully deployed on A K S.":::

In the form **New coffee in session**, set values for fields **Name** and **Price**, and then select **Submit**. After a few seconds,  you'll see **Submit count: 1** displayed at the left bottom of the page.

:::image type="content" source="media/how-to-deploy-java-liberty-jcache/new-coffee-in-session.png" alt-text="Screenshot of sample application showing new coffee created and persisted in the session of the application.":::

To demonstrate that the session cache is persisted across all replicas of the application, run the following command to delete the current replica with pod name `javaee-cafe-jcache-cluster-<pod id from your running app>`:

```azurecli-interactive
kubectl delete pod javaee-cafe-jcache-cluster-77d54bccd4-5xnzx

pod "javaee-cafe-jcache-cluster-77d54bccd4-5xnzx" deleted
```

Then, refresh the application home page. You'll see the same data displayed in the section **New coffee in session** but a different pod name displayed at the top-left of the page.

Finally, use the following steps to demonstrate that the session data is persisted in the Azure Cache for Redis instance. You can issue commands to your Azure Cache for Redis instance using the [Redis Console](/azure/azure-cache-for-redis/cache-configure#redis-console).

1. Find your Azure Cache for Redis instance from the Azure portal.
1. Select **Console** to open Redis console.
1. Run the following commands to view the session data:

   ```text
   scan 0 count 1000 match '*'

   hgetall "com.ibm.ws.session.attr.default_host%2F"
   ```

1. Search for *cafe.model.entity.Coffee[id=1, name=Coffee 3, price=30.0]* from the web page, which is the coffee you created and persisted in the Azure Cache for Redis instance.

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

To delete the Azure Cache for Redis instance, find its resource group name and run the following command:

```azurecli-interactive
az group delete --name <AZURE_CACHE_FOR_REDIS_RESOURCE_GROUP_NAME> --yes --no-wait
```

## Next steps

You can learn more from references used in this guide:

* [Configuring Liberty session persistence with JCache](https://www.ibm.com/docs/en/was-liberty/base?topic=manually-configuring-liberty-session-persistence-jcache)
* [JCache support of Redisson](https://redisson.org/glossary/jcache.html)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)
