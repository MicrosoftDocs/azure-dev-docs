---
title: Deploy a Java Application with Open Liberty or WebSphere Liberty on Azure Container Apps
recommendations: false
description: Shows you how to deploy a Java application with Open Liberty or WebSphere Liberty on Azure Container Apps.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 10/30/2023
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aca, devx-track-javaee-websphere, devx-track-azurecli, devx-track-extended-java
---

# Deploy a Java application with Open Liberty or WebSphere Liberty on Azure Container Apps

This article shows you how to run Open Liberty or WebSphere Liberty on Azure Container Apps. You do the following activities in this article:

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty or WebSphere Liberty runtime.
* Build the application Docker image using Liberty container images.
* Deploy the containerized application to Azure Container Apps.

For more information on Open Liberty, see [the Open Liberty project page](https://openliberty.io/). For more information on IBM WebSphere Liberty, see [the WebSphere Liberty product page](https://www.ibm.com/cloud/websphere-liberty).

This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://www.ibm.com/docs/was-liberty/base?topic=tuning-liberty).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

If you're running the commands in this guide locally (instead of Azure Cloud Shell):

* Prepare a local machine with either Windows or Linux installed.
* Install a Java SE implementation, version 17 or later (for example, [Eclipse Open J9](https://www.eclipse.org/openj9/)).
* Install [Maven](https://maven.apache.org/download.cgi) 3.5.0 or higher.
* Install [Docker](https://docs.docker.com/get-docker/) for your OS.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/../articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

* This article requires at least version 2.53.0 of Azure CLI. If you're using Azure Cloud Shell, the latest version is already installed. You can launch Azure CLI commands in either Bash or Azure PowerShell, either locally or in Azure Cloud Shell.

## Sign in to Azure

If you haven't done so already, sign in to your Azure subscription by using the [az login](/cli/azure/authenticate-azure-cli) command and follow the on-screen directions.

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
> If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can do this with the `--tenant` option - for example, `az login --tenant contoso.onmicrosoft.com`.
>
> If you have multiple subscriptions within a single tenant, make sure you are signed in with the one you intend to use by using `az account set --subscription <subscription-id>`.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

Create a resource group called *java-liberty-project* using the [az group create](/cli/azure/group#az-group-create) command in the *eastus* location. This resource group is used later for creating the Azure Container Registry (ACR) instance and the Azure Container Apps instance.

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
az acr create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:REGISTRY_NAME `
    --sku Basic --admin-enabled
```

---

After a short time, you should see a JSON output that contains the following lines:

```output
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "java-liberty-project",
```

## Connect to the ACR instance

You need to sign in to the ACR instance before you can push an image to it. If you choose to run commands locally, ensure the docker daemon is running, and run the following commands to verify the connection:

### [Bash](#tab/in-bash)

```bash
export ACR_LOGIN_SERVER=$(az acr show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv)
export ACR_USER_NAME=$(az acr credential show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --query 'username' \
    --output tsv)
export ACR_PASSWORD=$(az acr credential show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --query 'passwords[0].value' \
    --output tsv)

docker login $ACR_LOGIN_SERVER -u $ACR_USER_NAME -p $ACR_PASSWORD
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:ACR_LOGIN_SERVER = $(az acr show `
    --name $Env:REGISTRY_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --query 'loginServer' `
    --output tsv)
$Env:ACR_USER_NAME=$(az acr credential show `
    --name $Env:REGISTRY_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --query 'username' `
    --output tsv)
$Env:ACR_PASSWORD=$(az acr credential show `
    --name $Env:REGISTRY_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --query 'passwords[0].value' `
    --output tsv)

docker login $Env:ACR_LOGIN_SERVER -u $Env:ACR_USER_NAME -p $Env:ACR_PASSWORD
```

---

You should see `Login Succeeded` at the end of command output if you've logged into the ACR instance successfully.

## Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. Use the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an environment. The following example creates an environment named *youracaenvname*:

### [Bash](#tab/in-bash)

```bash
export ACA_ENV=youracaenvname
az containerapp env create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location eastus \
    --name $ACA_ENV
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:ACA_ENV = "youracaenvname"
az containerapp env create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --location eastus `
    --name $Env:ACA_ENV
```

---

If you're asked to install an extension, answer <kbd>Y</kbd>.

After a short time, you should see a JSON output that contains the following lines:

```output
  "provisioningState": "Succeeded",
  "type": "Microsoft.App/managedEnvironments"
  "resourceGroup": "java-liberty-project",
```

## Create an Azure SQL Database

In this section, you create an Azure SQL Database single database for use with your app.

Create a single database in Azure SQL Database by following the Azure CLI steps in [Quickstart: Create an Azure SQL Database single database](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli). Execute the steps up to, but not including **Query the database**. Use the following steps as you go through the article, then return to this document after you create and configure the database server:

When you reach the [Set parameter values](/azure/azure-sql/database/single-database-create-quickstart?tabs=azure-cli#set-parameter-values) section of the quickstart, output and save aside the values of variables in the code example labeled `Variable block`, including `resourceGroup`,`server`, `database`, `login`, and `password`. Define the following environment variables after replacing placeholders `<resourceGroup>`,`<server>`, `<database>`, `<login>`, and `<password>` with these values.

### [Bash](#tab/in-bash)

```bash
export DB_RESOURCE_GROUP=<resourceGroup>
export DB_SERVER_NAME=<server>.database.windows.net
export DB_NAME=<database>
export DB_USER=<login>
export DB_PASSWORD=<password>
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:DB_RESOURCE_GROUP = "<resourceGroup>"
$Env:DB_SERVER_NAME = "<server>.database.windows.net"
$Env:DB_NAME = "<database>"
$Env:DB_USER = "<login>"
$Env:DB_PASSWORD = "<password>"
```

---

If you want to test the application locally later, use the following steps to ensure your client IPv4 address is allowed to connect:

1. In the portal, search for and select **SQL databases**, and then select your database from the list.
1. Select **Overview**.
1. Ensure the **Getting started** tab is selected in the middle of the page.
1. Under **Configure access**, select **Configure**.
1. Select **Add your client IPv4 address**.
1. Select **Save**.
1. You can find and configure **Firewall rules** in the **Networking** pane and **Public access** tab.

   :::image type="content" source="./media/deploy-java-liberty-app-aca/sql-database-firewall-rules.png" alt-text="Screenshot of firewall rules - allow client access.":::

## Configure and build the application image

To deploy and run your Liberty application on Azure Container Apps, containerize your application as a Docker image using [Open Liberty container images](https://github.com/OpenLiberty/ci.docker) or [WebSphere Liberty container images](https://github.com/WASdev/ci.docker).

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Use the following commands to prepare the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aca).

#### [Bash](#tab/in-bash)

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aca.git
cd open-liberty-on-aca
git checkout 20231026
```

#### [PowerShell](#tab/in-powershell)

```powershell
git clone https://github.com/Azure-Samples/open-liberty-on-aca.git
cd open-liberty-on-aca
git checkout 20231026
```

---

If you see a message about being in `detached HEAD` state, this message is safe to ignore. It just means you have checked out a tag.

This article uses *java-app*. Here's the file structure of the application:

```output
java-app
├─ src/main/
│  ├─ liberty/config/
│  │  ├─ server.xml
│  ├─ java/
│  ├─ resources/
│  ├─ webapp/
├─ Dockerfile
├─ Dockerfile-wlp
├─ pom.xml
```

The directories *java*, *resources*, and *webapp* contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the *java-app* root directory, there are two files to create the application image with either Open Liberty or WebSphere Liberty.

In directory *liberty/config*, the *server.xml* file is used to configure the DB connection for the Open Liberty and WebSphere Liberty cluster.

### Build the project

Use the following command to build the application:

#### [Bash](#tab/in-bash)

```bash
cd <path-to-your-repo>/java-app
mvn clean install
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd <path-to-your-repo>/java-app
mvn clean install
```

---

If the build is successful, you should see output similar to the following at the end of your build.

```output
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  22.651 s
[INFO] Finished at: 2023-10-26T18:58:40-04:00
[INFO] ------------------------------------------------------------------------
```

If you don't see this output, troubleshoot and resolve the problem before continuing.

### (Optional) Test your project locally

You can now use the following steps to run and test the project locally before deploying to Azure. For convenience, use the `liberty-maven-plugin`. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html). For your application, you can do something similar using any other mechanism, such as your local IDE.

> [!NOTE]
> If you selected a "serverless" database deployment, verify that your SQL database has not entered pause mode. One way to do this is to log in to the database query editor as described in [Quickstart: Use the Azure portal query editor (preview) to query Azure SQL Database](/azure/azure-sql/database/connect-query-portal).

1. Start the application using `liberty:run`. `liberty:run` uses the database related environment variables defined in the previous step.

   #### [Bash](#tab/in-bash)

   ```bash
   cd <path-to-your-repo>/java-app
   mvn liberty:run
   ```

   #### [PowerShell](#tab/in-powershell)

   ```powershell
   cd <path-to-your-repo>/java-app
   mvn liberty:run
   ```

1. Verify the application works as expected. You should see a message similar to `[INFO] [AUDIT] CWWKZ0003I: The application javaee-cafe updated in 1.930 seconds.` in the command output if successful. Go to `http://localhost:9080/` in your browser to verify the application is accessible and all functions are working.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Build the image

> [!NOTE]
> If you chose to use the Bash environment in Azure Cloud Shell, use the `az acr build` command to build and push image from a Docker file. For more information, see the [Build and push image from a Dockerfile](/azure/container-registry/container-registry-quickstart-task-cli#build-and-push-image-from-a-dockerfile) section of [Quickstart: Build and run a container image using Azure Container Registry Tasks](/azure/container-registry/container-registry-quickstart-task-cli). After that, go directly to the [Deploy the application to Azure Container Apps](#deploy-the-application-to-azure-container-apps) section. If you chose to run commands locally, use the following guidance.

You can now run the `docker buildx build` command to build the image, as shown in the following example:

#### [Bash](#tab/in-bash)

```bash
cd <path-to-your-repo>/java-app

# If you are running with Open Liberty
docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile .

# If you are running with WebSphere Liberty
docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile-wlp .
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd <path-to-your-repo>/java-app

# If you are running with Open Liberty
docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile .

# If you are running with WebSphere Liberty
docker buildx build --platform linux/amd64 -t javaee-cafe:v1 --pull --file=Dockerfile-wlp .
```

---

### (Optional) Test the Docker image locally

You can now use the following steps to test the Docker image locally before deploying to Azure:

1. Run the image using the following command. This command uses the database related environment variables defined previously.

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
   docker run -it --rm -p 9080:9080 `
    -e DB_SERVER_NAME=$Env:DB_SERVER_NAME `
    -e DB_NAME=$Env:DB_NAME `
    -e DB_USER=$Env:DB_USER `
    -e DB_PASSWORD=$Env:DB_PASSWORD `
    javaee-cafe:v1
   ```

1. After the container starts, go to `http://localhost:9080/` in your browser to access the application.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop.

### Upload image to ACR

Next, upload the built image to the ACR you created in the previous steps.

If you haven't already done so, use the following command to sign in to the ACR:

#### [Bash](#tab/in-bash)

```bash
docker login -u ${ACR_USER_NAME} -p ${ACR_PASSWORD} ${ACR_LOGIN_SERVER}
```

#### [PowerShell](#tab/in-powershell)

```powershell
docker login -u $Env:ACR_USER_NAME -p $Env:ACR_PASSWORD $Env:ACR_LOGIN_SERVER
```

---

Use the following commands to tag and push the container image:

#### [Bash](#tab/in-bash)

```bash
docker tag javaee-cafe:v1 ${ACR_LOGIN_SERVER}/javaee-cafe:v1
docker push ${ACR_LOGIN_SERVER}/javaee-cafe:v1
```

#### [PowerShell](#tab/in-powershell)

```powershell
docker tag javaee-cafe:v1 $Env:ACR_LOGIN_SERVER/javaee-cafe:v1
docker push $Env:ACR_LOGIN_SERVER/javaee-cafe:v1
```

---

## Deploy the application to Azure Container Apps

Use the following commands to create an Azure Container Apps instance to run the app after pulling the image from the ACR. This example creates an Azure Container Apps instance named *youracainstancename*.

### [Bash](#tab/in-bash)

```bash
export ACA_NAME=youracainstancename
az containerapp create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --image ${ACR_LOGIN_SERVER}/javaee-cafe:v1 \
    --environment $ACA_ENV \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-username $ACR_USER_NAME \
    --registry-password $ACR_PASSWORD \
    --target-port 9080 \
    --env-vars \
        DB_SERVER_NAME=${DB_SERVER_NAME} \
        DB_NAME=${DB_NAME} \
        DB_USER=${DB_USER} \
        DB_PASSWORD=${DB_PASSWORD} \
    --ingress 'external'
```

### [PowerShell](#tab/in-powershell)

```powershell
$Env:ACA_NAME = "youracainstancename"
az containerapp create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:ACA_NAME `
    --image $Env:ACR_LOGIN_SERVER/javaee-cafe:v1 `
    --environment $Env:ACA_ENV `
    --registry-server $Env:ACR_LOGIN_SERVER `
    --registry-username $Env:ACR_USER_NAME `
    --registry-password $Env:ACR_PASSWORD `
    --target-port 9080 `
    --env-vars `
        DB_SERVER_NAME=$Env:DB_SERVER_NAME `
        DB_NAME=$Env:DB_NAME `
        DB_USER=$Env:DB_USER `
        DB_PASSWORD=$Env:DB_PASSWORD `
    --ingress 'external'
```

---

Successful output is a JSON object including the property `"type": "Microsoft.App/containerApps"`.

### Test the application

Use the following command to get a fully qualified url to access the application:

#### [Bash](#tab/in-bash)

```bash
echo https://$(az containerapp show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
```

#### [PowerShell](#tab/in-powershell)

```powershell
Write-Host https://$(az containerapp show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:ACA_NAME `
    --query properties.configuration.ingress.fqdn `
    --output tsv)
```

---

Open a web browser to the URL to access and test the application. The following screenshot shows the running application:

:::image type="content" source="./media/deploy-java-liberty-app-aca/deploy-succeeded.png" alt-text="Screenshot that shows the Java liberty application successfully deployed on Azure Container Apps.":::

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container registry, container apps, database server, and all related resources.

### [Bash](#tab/in-bash)

```bash
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $DB_RESOURCE_GROUP --yes --no-wait
```

### [PowerShell](#tab/in-powershell)

```powershell
az group delete --name $Env:RESOURCE_GROUP_NAME --yes --no-wait
az group delete --name $Env:DB_RESOURCE_GROUP --yes --no-wait
```

---

Then, use the following command to remove the container image from your local Docker server:

### [Bash](#tab/in-bash)

```bash
docker rmi -f ${ACR_LOGIN_SERVER}/javaee-cafe:v1
```

### [PowerShell](#tab/in-powershell)

```powershell
docker rmi -f $Env:ACR_LOGIN_SERVER/javaee-cafe:v1
```

---

## Next steps

You can learn more from the references used in this guide:

* [Azure Container Apps](https://azure.microsoft.com/products/container-apps)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
* [WebSphere Liberty Container Images](https://github.com/WASdev/ci.docker)
