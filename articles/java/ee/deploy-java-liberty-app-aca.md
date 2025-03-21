---
title: Deploy a Java Application with Open Liberty on Azure Container Apps
recommendations: false
description: Shows you how to deploy a Java application with Open Liberty on Azure Container Apps.
author: KarlErickson
ms.author: karler
ms.reviewer: jiangma
ms.topic: quickstart
ms.date: 03/21/2025
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-liberty, devx-track-javaee-liberty-aca, devx-track-javaee-websphere, devx-track-azurecli, devx-track-extended-java
---

# Deploy a Java application with Open Liberty on Azure Container Apps

This article shows you how to run Open Liberty on Azure Container Apps. You do the following activities in this article:

* Run your Java, Java EE, Jakarta EE, or MicroProfile application on the Open Liberty runtime.
* Build the application Docker image using Liberty container images.
* Deploy the containerized application to Azure Container Apps.

For more information about Open Liberty, see [the Open Liberty project page](https://openliberty.io/). This article is intended to help you quickly get to deployment. Before going to production, you should explore [Tuning Liberty](https://openliberty.io/docs/latest/performance-tuning.html).

If you're interested in providing feedback or working closely on your migration scenarios with the engineering team developing Java on Azure solutions, fill out this short [survey on Azure migration](https://aka.ms/websphere-on-azure-survey) and include your contact information. The team of program managers, architects, and engineers will promptly get in touch with you to initiate close collaboration.

## Prerequisites

* An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
* Prepare a local machine with either Windows or Unix-like operating system installed - for example, Ubuntu, macOS, or Windows Subsystem for Linux.
* [Install the Azure CLI](/cli/azure/install-azure-cli) 2.62.0 or above to run Azure CLI commands.
    * Sign in with Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. See [Sign into Azure with Azure CLI](/cli/azure/authenticate-azure-cli#sign-into-azure-with-azure-cli) for other sign-in options.
    * When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).
    * Run [`az version`](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [`az upgrade`](/cli/azure/reference-index?#az-upgrade).
* Install a Java Platform Standard Edition (SE) implementation version 17 - for example, [Microsoft build of OpenJDK](/java/openjdk).
* Install [Maven](https://maven.apache.org/download.cgi) 3.9.8 or higher.
* Ensure that [Git](https://git-scm.com) is installed.

## Sign in to Azure

Sign in to your Azure subscription by using the [`az login`](/cli/azure/authenticate-azure-cli) command and follow the on-screen directions.

### [Bash](#tab/in-bash)

```azurecli
az login
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
az login
```

---

> [!NOTE]
> You can run most Azure CLI commands in PowerShell the same as in Bash. The difference exists only when using variables. In the following sections, the difference is addressed in different tabs when needed.
>
> If you have multiple Azure tenants associated with your Azure credentials, you must specify which tenant you want to sign in to. You can specify the tenant by using the `--tenant` option - for example, `az login --tenant contoso.onmicrosoft.com`.
>
> If you have multiple subscriptions within a single tenant, make sure you're signed in with the one you intend to use by using `az account set --subscription <subscription-id>`.

## Create a resource group

An Azure resource group is a logical group in which Azure resources are deployed and managed.

Create a resource group called `java-liberty-project` using the [`az group create`](/cli/azure/group#az-group-create) command in the `eastus2` location. This resource group is used later for creating the Azure Container Registry (ACR) instance and the Azure Container Apps instance.

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

## Create an ACR instance

Use the [`az acr create`](/cli/azure/acr#az-acr-create) command to create the ACR instance. The following example creates an ACR instance named `youruniqueacrname`. Make sure `youruniqueacrname` is unique within Azure.

> [!NOTE]
> This article uses the recommended passwordless authentication mechanism for Container Registry. It's still possible to use a username and password with `docker login` after using `az acr credential show` to obtain the username and password. Using a username and password is less secure than passwordless authentication.

### [Bash](#tab/in-bash)

```azurecli
export REGISTRY_NAME=youruniqueacrname
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --sku Basic
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:REGISTRY_NAME = "youruniqueacrname"
az acr create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:REGISTRY_NAME `
    --sku Basic
```

---

After a short time, you should see a JSON output that contains the following lines:

```output
"provisioningState": "Succeeded",
"publicNetworkAccess": "Enabled",
"resourceGroup": "java-liberty-project",
```

Next, use the following command to retrieve the login server for the Container Registry instance. You need this value when you deploy the application image to the Azure Container Apps later.

### [Bash](#tab/in-bash)

```azurecli
export ACR_LOGIN_SERVER=$(az acr show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv)
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:ACR_LOGIN_SERVER = $(az acr show `
    --name $Env:REGISTRY_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --query 'loginServer' `
    --output tsv)
```

---

## Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. Use the [`az containerapp env create`](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an environment. The following example creates an environment named `youracaenvname`:

### [Bash](#tab/in-bash)

```azurecli
export ACA_ENV=youracaenvname
az containerapp env create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_ENV
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:ACA_ENV = "youracaenvname"
az containerapp env create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
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

## Create a single database in Azure SQL Database

In this section, you create a single database in Azure SQL Database, for use with your app.

### [Bash](#tab/in-bash)

First, use the following commands to set database-related environment variables. Replace `<your-unique-sql-server-name>` with a unique name for your Azure SQL Database server.

```bash
export SQL_SERVER_NAME=<your-unique-sql-server-name>
export DB_NAME=demodb
```

Next, use the following commands to create a single database in Azure SQL Database and set the current signed-in user as a Microsoft Entra admin. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-cli).

```azurecli
export ENTRA_ADMIN_NAME=$(az account show --query user.name --output tsv)

az sql server create \
    --name $SQL_SERVER_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --enable-ad-only-auth \
    --external-admin-principal-type User \
    --external-admin-name $ENTRA_ADMIN_NAME \
    --external-admin-sid $(az ad signed-in-user show --query id --output tsv)
az sql db create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server $SQL_SERVER_NAME \
    --name $DB_NAME \
    --edition GeneralPurpose \
    --compute-model Serverless \
    --family Gen5 \
    --capacity 2
```

Then, use the following commands to add the local IP address to the Azure SQL Database server firewall rules to allow your local machine to connect to the database for local testing later.

```azurecli
export AZ_LOCAL_IP_ADDRESS=$(curl -s https://whatismyip.akamai.com)
az sql server firewall-rule create \
    --resource-group $RESOURCE_GROUP_NAME \
    --server $SQL_SERVER_NAME \
    --name AllowLocalIP \
    --start-ip-address $AZ_LOCAL_IP_ADDRESS \
    --end-ip-address $AZ_LOCAL_IP_ADDRESS
```

### [PowerShell](#tab/in-powershell)

First, use the following commands to set database-related environment variables. Replace `<your-unique-sql-server-name>` with a unique name for your Azure SQL Database server.

```powershell
$Env:SQL_SERVER_NAME = "<your-unique-sql-server-name>"
$Env:DB_NAME = "demodb"
```

Next, use the following commands to create a single database in Azure SQL Database and set the current signed-in user as Microsoft Entra admin. For more information, see [Quickstart: Create a single database - Azure SQL Database](/azure/azure-sql/database/single-database-create-quickstart?view=azuresql-db&preserve-view=true&tabs=azure-powershell).

```azurepowershell
$Env:ENTRA_ADMIN_NAME = $(az account show --query user.name --output tsv)

az sql server create `
    --name $Env:SQL_SERVER_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --enable-ad-only-auth `
    --external-admin-principal-type User `
    --external-admin-name $Env:ENTRA_ADMIN_NAME `
    --external-admin-sid $(az ad signed-in-user show --query id --output tsv)
az sql db create `
    --name $Env:DB_NAME `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --server $Env:SQL_SERVER_NAME `
    --edition GeneralPurpose `
    --compute-model Serverless `
    --family Gen5 `
    --capacity 2
```

Then, use the following commands to add the local IP address to the Azure SQL Database server firewall rules to allow your local machine to connect to the database for local testing later.

```azurepowershell
$Env:AZ_LOCAL_IP_ADDRESS = (Invoke-WebRequest https://whatismyip.akamai.com).Content
az sql server firewall-rule create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --server $Env:SQL_SERVER_NAME `
    --name AllowLocalIP `
    --start-ip-address $Env:AZ_LOCAL_IP_ADDRESS `
    --end-ip-address $Env:AZ_LOCAL_IP_ADDRESS
```

---

> [!NOTE]
> You create an Azure SQL server with SQL authentication disabled for security considerations. Only Microsoft Entra ID is used to authenticate to the server. If you need to enable SQL authentication, see [`az sql server create`](/cli/azure/sql/server#az-sql-server-create).

## Configure and build the application image

To deploy and run your Liberty application on Azure Container Apps, containerize your application as a Docker image using [Open Liberty container images](https://github.com/OpenLiberty/ci.docker).

Follow the steps in this section to deploy the sample application on the Liberty runtime. These steps use Maven.

### Check out the application

Use the following commands to prepare the sample code for this guide. The sample is on [GitHub](https://github.com/Azure-Samples/open-liberty-on-aca).

#### [Bash](#tab/in-bash)

```bash
git clone https://github.com/Azure-Samples/open-liberty-on-aca.git
cd open-liberty-on-aca
export BASE_DIR=$PWD
git checkout 20241118
```

#### [PowerShell](#tab/in-powershell)

```powershell
git clone https://github.com/Azure-Samples/open-liberty-on-aca.git
cd open-liberty-on-aca
$Env:BASE_DIR = $PWD
git checkout 20241118
```

---

If you see a message about being in `detached HEAD` state, this message is safe to ignore. It just means you checked out a tag.

This article uses **java-app**. Here's the file structure of the application's important files:

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
├─ pom-azure-identity.xml
```

The directories **java**, **resources**, and **webapp** contain the source code of the sample application. The code declares and uses a data source named `jdbc/JavaEECafeDB`.

In the **java-app** root directory, there are two files to create the application image with either Open Liberty or WebSphere Liberty.

In the **liberty/config** directory, the **server.xml** file is used to configure the database connection for the Open Liberty and WebSphere Liberty cluster. It defines a variable `azure.sql.connectionstring` that is used to connect to the Azure SQL Database.

The **pom.xml** file is the Maven project object model (POM) file that contains the configuration information for the project. The **pom-azure-identity.xml** file declares the `azure-identity` dependency, which is used to authenticate to Azure services using Microsoft Entra ID.

> [!NOTE]
> This sample uses `azure-identity` library to authenticate to Azure SQL Database using Microsoft Entra authentication, which is recommended for security considerations. If you need to use SQL authentication in your Liberty application, see [Relational database connections with JDBC](https://openliberty.io/docs/latest/relational-database-connections-JDBC.html).

### Build the project

Use the following commands to build the application:

#### [Bash](#tab/in-bash)

```bash
cd $BASE_DIR/java-app
mvn clean install
mvn dependency:copy-dependencies -f pom-azure-identity.xml -DoutputDirectory=target/liberty/wlp/usr/shared/resources
```

#### [PowerShell](#tab/in-powershell)

```powershell
cd $Env:BASE_DIR/java-app
mvn clean install
mvn dependency:copy-dependencies -f pom-azure-identity.xml -DoutputDirectory=target/liberty/wlp/usr/shared/resources
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

### Test your project locally

You can now use the following steps to run and test the project locally before deploying to Azure. For convenience, use the `liberty-maven-plugin`. To learn more about the `liberty-maven-plugin`, see [Building a web application with Maven](https://openliberty.io/guides/maven-intro.html). For your application, you can do something similar using any other mechanism, such as your local IDE.

> [!NOTE]
> If you selected a "serverless" database deployment, verify that your SQL database didn't enter pause mode. One way to perform the verification is to sign in to the database query editor as described in [Quickstart: Use the Azure portal query editor (preview) to query Azure SQL Database](/azure/azure-sql/database/connect-query-portal).

1. Start the application using `liberty:run`.

    #### [Bash](#tab/in-bash)

    ```bash
    cd $BASE_DIR/java-app

    # The value of environment variable AZURE_SQL_CONNECTIONSTRING is read by the configuration variable azure.sql.connectionstring in server.xml.
    export AZURE_SQL_CONNECTIONSTRING="jdbc:sqlserver://$SQL_SERVER_NAME.database.windows.net:1433;databaseName=$DB_NAME;authentication=ActiveDirectoryDefault"
    mvn liberty:run
    ```

    #### [PowerShell](#tab/in-powershell)

    ```powershell
    cd $Env:BASE_DIR/java-app

    # The value of environment variable AZURE_SQL_CONNECTIONSTRING is read by configuration variable azure.sql.connectionstring in server.xml.
    $Env:AZURE_SQL_CONNECTIONSTRING = "jdbc:sqlserver://$Env:SQL_SERVER_NAME.database.windows.net:1433;databaseName=$Env:DB_NAME;authentication=ActiveDirectoryDefault"
    mvn liberty:run
    ```

1. Verify that the application works as expected. If successful, you should see a message similar to `[INFO] [AUDIT   ] CWWKZ0001I: Application javaee-cafe started in 11.086 seconds.` in the command output. Go to `http://localhost:9080/` in your browser to verify that the application is accessible and all functions are working.

1. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop. Select <kbd>Y</kbd> if you're asked to terminate the batch job.

When you're finished, delete the firewall rule that allows your local IP address to access the Azure SQL Database by using the following command:

### [Bash](#tab/in-bash)

```azurecli
az sql server firewall-rule delete \
    --resource-group $RESOURCE_GROUP_NAME \
    --server $SQL_SERVER_NAME \
    --name AllowLocalIP
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
az sql server firewall-rule delete `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --server $Env:SQL_SERVER_NAME `
    --name AllowLocalIP
```

---

### Build the image for Azure Container Apps deployment

You can now run the [`az acr build`](/cli/azure/acr#az-acr-build) command to build the image, as shown in the following example:

### [Bash](#tab/in-bash)

```azurecli
cd $BASE_DIR/java-app

az acr build \
    --registry ${REGISTRY_NAME} \
    --image javaee-cafe:v1 \
    .
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
cd $Env:BASE_DIR/java-app

az acr build `
    --registry $Env:REGISTRY_NAME `
    --image javaee-cafe:v1 .
```

---

The `az acr build` command uploads the artifacts specified in the Dockerfile to the Container Registry instance, builds the image, and stores it in the Container Registry instance.

## Deploy the application to Azure Container Apps

Use the following commands to create an Azure Container Apps instance to run the app after pulling the image from the ACR. This example creates an Azure Container Apps instance named `youracainstancename`:

### [Bash](#tab/in-bash)

```azurecli
export ACA_NAME=youracainstancename
az containerapp create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --image ${ACR_LOGIN_SERVER}/javaee-cafe:v1 \
    --environment $ACA_ENV \
    --registry-server $ACR_LOGIN_SERVER \
    --registry-identity system \
    --target-port 9080 \
    --ingress 'external' \
    --min-replicas 1
```

### [PowerShell](#tab/in-powershell)

```azurepowershell
$Env:ACA_NAME = "youracainstancename"
az containerapp create `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:ACA_NAME `
    --image $Env:ACR_LOGIN_SERVER/javaee-cafe:v1 `
    --environment $Env:ACA_ENV `
    --registry-server $Env:ACR_LOGIN_SERVER `
    --registry-identity system `
    --target-port 9080 `
    --ingress 'external' `
    --min-replicas 1
```

---

Successful output is a JSON object including the property `"type": "Microsoft.App/containerApps"`.

Then, connect the Azure SQL Database server to the container app using Service Connector by using the following steps:

#### [Bash](#tab/in-bash)

1. This sample uses Service Connector to facilitate connecting to the database. For more information about Service Connector, see [What is Service Connector?](/azure/service-connector/overview) Install the passwordless extension for the Azure CLI by using the following command:

    ```azurecli
    az extension add --name serviceconnector-passwordless --upgrade --allow-preview true
    ```

1. Connect the database to the container app with a system-assigned managed identity by using the following command:

    ```azurecli
    az containerapp connection create sql \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $ACA_NAME \
        --target-resource-group $RESOURCE_GROUP_NAME \
        --server $SQL_SERVER_NAME \
        --database $DB_NAME \
        --system-identity \
        --container $ACA_NAME \
        --client-type java
    ```

    Successful output is a JSON object including the property `"type": "microsoft.servicelinker/linkers"`.

#### [PowerShell](#tab/in-powershell)

1. Install the [Service Connector](/azure/service-connector/overview) passwordless extension for the Azure CLI by using the following command:

    ```azurepowershell
    az extension add --name serviceconnector-passwordless --upgrade --allow-preview true
    ```

1. Connect the database to the container app with a system-assigned managed identity by using the following command:

    ```azurepowershell
    az containerapp connection create sql `
        --resource-group $Env:RESOURCE_GROUP_NAME `
        --name $Env:ACA_NAME `
        --target-resource-group $Env:RESOURCE_GROUP_NAME `
        --server $Env:SQL_SERVER_NAME `
        --database $Env:DB_NAME `
        --system-identity `
        --container $Env:ACA_NAME `
        --client-type java
    ```

    Successful output is a JSON object including the property `"type": "microsoft.servicelinker/linkers"`.

    > [!NOTE]
    > You must take further action if the command fails with an error message similar to the following example:
    >
    > ```output
    > The command failed with an unexpected error. Here is the traceback:
    > Dependency pyodbc can't be installed, please install it manually with `C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\python.exe -m pip install pyodbc`.
    > ```
    >
    > In this case, install the `pyodbc` package manually by using the following steps:
    >
    > 1. Open Windows PowerShell with administrator privileges. For more information, see the [With Administrative privileges (Run as administrator)](/powershell/scripting/windows-powershell/starting-windows-powershell#with-administrative-privileges-run-as-administrator) section of [Starting Windows PowerShell](/powershell/scripting/windows-powershell/starting-windows-powershell).
    >
    > 1. Run the following command in the PowerShell window:
    >
    >    ```powershell
    >    & "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\python.exe" -m pip install pyodbc
    >    ```
    >
    > After the installation is complete, run the previous `az containerapp connection create sql` command again.

---

> [!NOTE]
> The Service Connector creates a secret in the container app that contains the value for `AZURE_SQL_CONNECTIONSTRING`, which is a password-free connection string to the Azure SQL Database. For more information, see the sample value from the [User-assigned managed identity](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java#user-assigned-managed-identity) section of [Integrate Azure SQL Database with Service Connector](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java).

### Test the application

Use the following command to get a fully qualified URL to access the application:

#### [Bash](#tab/in-bash)

```azurecli
echo https://$(az containerapp show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
```

#### [PowerShell](#tab/in-powershell)

```azurepowershell
Write-Host https://$(az containerapp show `
    --resource-group $Env:RESOURCE_GROUP_NAME `
    --name $Env:ACA_NAME `
    --query properties.configuration.ingress.fqdn `
    --output tsv)
```

---

To access and test the application, open a web browser to the URL. The following screenshot shows the running application:

:::image type="content" source="./media/deploy-java-liberty-app-aca/deploy-succeeded.png" alt-text="Screenshot that shows the Java liberty application successfully deployed on Azure Container Apps.":::

## Clean up resources

To avoid Azure charges, you should clean up unnecessary resources. When the cluster is no longer needed, use the [`az group delete`](/cli/azure/group#az-group-delete) command to remove the resource group, container registry, container apps, database server, and all related resources.

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

You can learn more from the references used in this guide:

* [Azure Container Apps](https://azure.microsoft.com/products/container-apps)
* [Integrate Azure SQL Database with Service Connector](/azure/service-connector/how-to-integrate-sql-database?tabs=sql-me-id-java%2Csql-secret-java)
* [Connect using Microsoft Entra authentication](/sql/connect/jdbc/connecting-using-azure-active-directory-authentication?view=azuresqldb-current&preserve-view=true)
* [Open Liberty](https://openliberty.io/)
* [Open Liberty Server Configuration](https://openliberty.io/docs/ref/config/)
* [Liberty Maven Plugin](https://github.com/OpenLiberty/ci.maven#liberty-maven-plugin)
* [Open Liberty Container Images](https://github.com/OpenLiberty/ci.docker)
* [WebSphere Liberty Container Images](https://www.ibm.com/docs/was-liberty/base?topic=images-liberty-container#cntr_r_images__wlicr__title__1)

To explore options to run WebSphere products on Azure, see [What are solutions to run the WebSphere family of products on Azure?](websphere-family.md)
