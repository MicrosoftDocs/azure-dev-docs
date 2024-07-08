---
title: "Deploy Quarkus on Azure Container Apps"
description: Shows how to quickly stand up Quarkus on Azure Container Apps.
author: KarlErickson
ms.author: jiangma
ms.topic: quickstart
ms.date: 09/29/2023
ms.custom: devx-track-java, devx-track-javaee, devx-track-javaee-quarkus, devx-track-javaee-quarkus-aca, devx-track-extended-java, devx-track-azurecli
---

# Deploy a Java application with Quarkus on an Azure Container Apps

This article shows you how to quickly deploy Red Hat Quarkus on Microsoft Azure Container Apps with a simple CRUD application. The application is a "to do list" with a JavaScript front end and a REST endpoint. Azure Database for PostgreSQL Flexible Server provides the persistence layer for the app. The article shows you how to test your app locally and deploy it to Container Apps.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- Prepare a local machine with Unix-like operating system installed (for example, Ubuntu, macOS, or Windows Subsystem for Linux).
- Install a Java SE implementation version 17 or later (for example, [Microsoft build of OpenJDK](/java/openjdk)).
- Install [Maven](https://maven.apache.org/download.cgi) 3.9.8 or higher.
- Install [Docker](https://docs.docker.com/get-docker/) or [Podman](https://podman.io/docs/installation) for your OS.
- Install [jq](https://jqlang.github.io/jq/download/).
- Install [cURL](https://curl.se/download.html).
- Install the [Quarkus CLI](https://quarkus.io/guides/cli-tooling) 3.12.1 or higher.
- Azure CLI for Unix-like environments. This article requires only the Bash variant of Azure CLI.
  - [!INCLUDE [azure-cli-login](../../includes/azure-cli-login.md)]
  - This article requires at least version 2.61.0 of Azure CLI.

## Create the app project

Use the following command to clone the sample Java project for this article. The sample is on [GitHub](https://github.com/Azure-Samples/quarkus-azure).

```bash
git clone https://github.com/Azure-Samples/quarkus-azure
cd quarkus-azure
git checkout 2024-07-08
cd aca-quarkus
```

If you see a message about being in *detached HEAD* state, this message is safe to ignore. Because this article doesn't require any commits, detached HEAD state is appropriate.

## Test your Quarkus app locally

The steps in this section show you how to run the app locally.

Quarkus supports the automatic provisioning of unconfigured services in development and test mode. Quarkus refers to this capability as dev services. Let's say you include a Quarkus feature, such as connecting to a database service. You want to test the app, but haven't yet fully configured the connection to a real database. Quarkus automatically starts a stub version of the relevant service and connects your application to it. For more information, see [Dev Services Overview](https://quarkus.io/guides/dev-services#databases) in the Quarkus documentation.

Make sure your container environment, Docker or Podman, is running and use the following command to enter Quarkus dev mode:

```bash
quarkus dev
```

Instead of `quarkus dev`, you can accomplish the same thing with Maven by using `mvn quarkus:dev`.

You might be asked if you want to send telemetry of your usage of Quarkus dev mode. If so, answer as you like.

Quarkus dev mode enables live reload with background compilation. If you modify any aspect of your app source code and refresh your browser, you can see the changes. If there are any issues with compilation or deployment, an error page lets you know. Quarkus dev mode listens for a debugger on port 5005. If you want to wait for the debugger to attach before running, pass `-Dsuspend` on the command line. If you don't want the debugger at all, you can use `-Ddebug=false`.

The output should look like the following example:

```output
__  ____  __  _____   ___  __ ____  ______
 --/ __ \/ / / / _ | / _ \/ //_/ / / / __/
 -/ /_/ / /_/ / __ |/ , _/ ,< / /_/ /\ \
--\___\_\____/_/ |_/_/|_/_/|_|\____/___/
INFO  [io.quarkus] (Quarkus Main Thread) quarkus-todo-demo-app-aca 1.0.0-SNAPSHOT on JVM (powered by Quarkus 3.2.0.Final) started in 14.826s. Listening on: http://localhost:8080
INFO  [io.quarkus] (Quarkus Main Thread) Profile dev activated. Live Coding activated.
INFO  [io.quarkus] (Quarkus Main Thread) Installed features: [agroal, cdi, hibernate-orm, hibernate-validator, jdbc-postgresql, narayana-jta, resteasy-reactive, resteasy-reactive-jackson, smallrye-context-propagation, vertx]

--
Tests paused
Press [e] to edit command line args (currently ''), [r] to resume testing, [o] Toggle test output, [:] for the terminal, [h] for more options>
```

Press <kbd>w</kbd> on the terminal where Quarkus dev mode is running. The <kbd>w</kbd> key opens your default web browser to show the `Todo` application. You can also access the application GUI at `http://localhost:8080` directly.

:::image type="content" source="media/deploy-java-quarkus-app/demo.png" alt-text="Screenshot of the Todo sample app." lightbox="media/deploy-java-quarkus-app/demo.png":::

Try selecting a few todo items in the todo list. The UI indicates selection with a strikethrough text style. You can also add a new todo item to the todo list by typing *Verify Todo apps* and pressing <kbd>ENTER</kbd>, as shown in the following screenshot:

:::image type="content" source="media/deploy-java-quarkus-app/demo-local.png" alt-text="Screenshot of the Todo sample app with new items added." lightbox="media/deploy-java-quarkus-app/demo-local.png":::

Access the RESTful API (`/api`) to get all todo items that store in the local PostgreSQL database:

```bash
curl --verbose http://localhost:8080/api | jq .
```

The output should look like the following example:

```output
* Connected to localhost (127.0.0.1) port 8080 (#0)
> GET /api HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/7.88.1
> Accept: */*
>
< HTTP/1.1 200 OK
< content-length: 664
< Content-Type: application/json;charset=UTF-8
<
{ [664 bytes data]
100   664  100   664    0     0  13278      0 --:--:-- --:--:-- --:--:-- 15441
* Connection #0 to host localhost left intact
[
  {
    "id": 1,
    "title": "Introduction to Quarkus Todo App",
    "completed": false,
    "order": 0,
    "url": null
  },
  {
    "id": 2,
    "title": "Quarkus on Azure App Service",
    "completed": false,
    "order": 1,
    "url": "https://learn.microsoft.com/en-us/azure/developer/java/eclipse-microprofile/deploy-microprofile-quarkus-java-app-with-maven-plugin"
  },
  {
    "id": 3,
    "title": "Quarkus on Azure Container Apps",
    "completed": false,
    "order": 2,
    "url": "https://learn.microsoft.com/en-us/training/modules/deploy-java-quarkus-azure-container-app-postgres/"
  },
  {
    "id": 4,
    "title": "Quarkus on Azure Functions",
    "completed": false,
    "order": 3,
    "url": "https://learn.microsoft.com/en-us/azure/azure-functions/functions-create-first-quarkus"
  },
  {
    "id": 5,
    "title": "Verify Todo apps",
    "completed": false,
    "order": 5,
    "url": null
  }
]
```

Press <kbd>q</kbd> to exit Quarkus dev mode.

## Create the Azure resources to run the Quarkus app

The steps in this section show you how to create the following Azure resources to run the Quarkus sample app:

- Azure Database for PostgreSQL Flexible Server
- Azure Container Registry
- Azure Container Apps

Some of these resources must have unique names within the scope of the Azure subscription. To ensure this uniqueness, you can use the *initials, sequence, date, suffix* pattern. To apply this pattern, name your resources by listing your initials, some sequence number, today's date, and some kind of resource specific suffix - for example, `rg` for "resource group". The following environment variables use this pattern. Replace the placeholder values in `UNIQUE_VALUE`, `LOCATION` and `DB_PASSWORD` with your own values and run the commands in your terminal.

```bash
export UNIQUE_VALUE=<your unique value, such as ejb091223>
export RESOURCE_GROUP_NAME=${UNIQUE_VALUE}rg
export LOCATION=<your desired Azure region for deploying your resources. For example, eastus>
export REGISTRY_NAME=${UNIQUE_VALUE}reg
export DB_SERVER_NAME=${UNIQUE_VALUE}db
export DB_NAME=demodb
export DB_ADMIN=demouser
export DB_PASSWORD='<your desired password for the database server. For example, Secret123456>'
export ACA_ENV=${UNIQUE_VALUE}env
export ACA_NAME=${UNIQUE_VALUE}aca
```

### Create an Azure Database for PostgreSQL Flexible Server

Azure Database for PostgreSQL Flexible Server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. This section shows you how to create an Azure Database for PostgreSQL Flexible Server instance using the Azure CLI. For more information, see [Quickstart: Create an Azure Database for PostgreSQL - Flexible Server instance using Azure CLI](/azure/postgresql/flexible-server/quickstart-create-server-cli).

First, create a resource group to contain the database server and other resources:

```azurecli-interactive
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location $LOCATION
```

Next, create an Azure Database for PostgreSQL flexible server instance with the `az postgres flexible-server create` command.

```azurecli-interactive
az postgres flexible-server create \
    --name $DB_SERVER_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --admin-user $DB_ADMIN \
    --admin-password $DB_PASSWORD \
    --database-name $DB_NAME \
    --public-access 0.0.0.0 \
    --yes
```

It takes a few minutes to create the server, database, admin user, and firewall rules. If the command is successful, the output looks similar to the following example:

```output
{
  "connectionString": "postgresql://<DB_ADMIN>:<DB_PASSWORD>@<DB_SERVER_NAME>.postgres.database.azure.com/<DB_NAME>?sslmode=require",
  "databaseName": "<DB_NAME>",
  "firewallName": "AllowAllAzureServicesAndResourcesWithinAzureIps_2024-7-5_14-39-45",
  "host": "<DB_SERVER_NAME>.postgres.database.azure.com",
  "id": "/subscriptions/REDACTED/resourceGroups/<RESOURCE_GROUP_NAME>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<DB_SERVER_NAME>",
  "location": "East US",
  "password": "<DB_PASSWORD>",
  "resourceGroup": "<RESOURCE_GROUP_NAME>",
  "skuname": "Standard_D2s_v3",
  "username": "<DB_ADMIN>",
  "version": "13"
}
```

### Create a Microsoft Azure Container Registry instance

Because Quarkus is a cloud native technology, it has built-in support for creating containers that run in Container Apps. Container Apps is entirely dependent on having a container registry from which it finds the container images to run. Container Apps has built-in support for Azure Container Registry.

Use the [az acr create](/cli/azure/acr#az-acr-create) command to create the Container Registry instance. The following example creates n Container Registry instance named with the value of your environment variable `${REGISTRY_NAME}`:

```azurecli-interactive
az acr create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location ${LOCATION} \
    --name $REGISTRY_NAME \
    --sku Basic \
    --admin-enabled
```

After a short time, you should see JSON output that contains the following lines:

```output
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "<YOUR_RESOURCE_GROUP>",
```

### Connect your docker to the Container Registry instance

Sign in to the Container Registry instance. Signing in lets you push an image. Use the following commands to verify the connection:

```azurecli-interactive
export LOGIN_SERVER=$(az acr show \
    --name $REGISTRY_NAME \
    --query 'loginServer' \
    --output tsv)
echo $LOGIN_SERVER
export USER_NAME=$(az acr credential show \
    --name $REGISTRY_NAME \
    --query 'username' \
    --output tsv)
echo $USER_NAME
export PASSWORD=$(az acr credential show \
    --name $REGISTRY_NAME \
    --query 'passwords[0].value' \
    --output tsv)
echo $PASSWORD
docker login $LOGIN_SERVER -u $USER_NAME -p $PASSWORD
```

If you're using Podman instead of Docker, make the necessary changes to the command.

If you've signed into the Container Registry instance successfully, you should see `Login Succeeded` at the end of command output.

### Create an environment

An environment in Azure Container Apps creates a secure boundary around a group of container apps. Container Apps deployed to the same environment are deployed in the same virtual network and write logs to the same Log Analytics workspace. Use the [az containerapp env create](/cli/azure/containerapp/env#az-containerapp-env-create) command to create an environment, as shown in the following example:

```azurecli-interactive
az containerapp env create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location $LOCATION \
    --name $ACA_ENV
```

If you're asked to install an extension, answer <kbd>Y</kbd>.

### Customize the cloud native configuration

As a cloud native technology, Quarkus offers the ability to automatically generate container images. For more information, see [Container Images](https://quarkus.io/guides/container-image). Developers can then deploy the application image to a target containerized platform, for example, Azure Container Apps.

To generate the container image, use the following command to add the `container-image-jib` extension in your local terminal:

```bash
quarkus ext add container-image-jib
```

Quarkus modifies the POM to ensure the extension is included among the `<dependencies>`. If you're asked to install something called `JBang`, answer *yes* and allow it to be installed.

The output should look like the following example:

```output
[SUCCESS] ✅  Extension io.quarkus:quarkus-container-image-jib has been installed
```

To verify the extensions are added, you can run `git diff` and examine the output.

As a cloud native technology, Quarkus supports the notion of configuration profiles. Quarkus has the following three built-in profiles:

- `dev` - Activated when in development mode.
- `test` - Activated when running tests.
- `prod` - The default profile when not running in development or test mode.

Quarkus supports any number of named profiles, as needed.

The remaining steps in this section direct you to uncomment and customize values in the *src/main/resources/application.properties* file. Ensure that all lines starting with `# %prod.` are uncommented by removing the leading `#`.

The `%prod.` prefix indicates that these properties are active when running in the `prod` profile. For more information on configuration profiles, see the [Quarkus documentation](https://access.redhat.com/search/?q=Quarkus+Using+configuration+profiles).

#### Examine the database configuration

Add the following database configuration variables. The database connection related properties `%prod.quarkus.datasource.jdbc.url`, `%prod.quarkus.datasource.username` and `%prod.quarkus.datasource.password` are intentionally left empty because they're provided at runtime by the Azure Container Apps environment for security reasons.

```yaml
# Database configurations
%prod.quarkus.datasource.db-kind=postgresql
%prod.quarkus.datasource.jdbc.driver=org.postgresql.Driver
%prod.quarkus.datasource.jdbc.url=
%prod.quarkus.datasource.username=
%prod.quarkus.datasource.password=
%prod.quarkus.hibernate-orm.database.generation=create
%prod.quarkus.hibernate-orm.sql-load-script=no-file
```

Generally, you don't expect that the data persisted in the database is dropped and repopulated with the sample data in a production environment. That's why you can see that the schema for `quarkus.hibernate-orm.database.generation` is specified as `create` so that the app only creates the schema when it doesn't exist at the initial startup. Besides, the database isn't pre-populated with any sample data because `hibernate-orm.sql-load-script` is specified as `no-file`. This setting is different than when you ran the app locally in development mode previously. The default values in development mode for `quarkus.hibernate-orm.database.generation` and `hibernate-orm.sql-load-script` are `drop-and-create` and `import.sql` respectively, which means the app always drops and recreates the database schema and loads the data defined in *import.sql*. The *import.sql* file is a convenience facility from Quarkus. If the *src/main/resources/import.sql* file exists in the Quarkus jar, and the value of the `hibernate-orm.sql-load-script` property is `import.sql`, the SQL DML statements in this file are executed at startup time for the app.

#### Customize the container image configuration

As a cloud native technology, Quarkus supports generating OCI container images compatible with Docker and Podman. Add the following container-image variables. Replace the values of `<LOGIN_SERVER_VALUE>` and `<USER_NAME_VALUE>` with the values of the actual values of the `${LOGIN_SERVER}` and `${USER_NAME}` environment variables, respectively.

```yaml
# Container Image Build
%prod.quarkus.container-image.build=true
%prod.quarkus.container-image.registry=<LOGIN_SERVER_VALUE>
%prod.quarkus.container-image.group=<USER_NAME_VALUE>
%prod.quarkus.container-image.name=todo-quarkus-aca
%prod.quarkus.container-image.tag=1.0
```

### Build the container image and push it to Container Registry

Now, use the following command to build the application itself. This command uses the Jib extension to build the container image.

```bash
quarkus build --no-tests
```

The output should end with `BUILD SUCCESS`.

You can verify whether the container image is generated as well by using the `docker` or `podman` command line (CLI). The output looks similar to the following example:

```output
docker images | grep todo-quarkus-aca
<LOGIN_SERVER_VALUE>/<USER_NAME_VALUE>/todo-quarkus-aca   1.0       0804dfd834fd   2 minutes ago   407MB
```

Push the container images to Container Registry by using the following command:

```bash
export TODO_QUARKUS_TAG=$(docker images | grep todo-quarkus-aca | head -n1 | cut -d " " -f1):1.0
echo ${TODO_QUARKUS_TAG}
docker push ${TODO_QUARKUS_TAG}
```

The output should look similar to the following example:

```output
The push refers to repository [<LOGIN_SERVER_VALUE>/<USER_NAME_VALUE>/todo-quarkus-aca]
188a550fce3d: Pushed
4e3afea591e2: Pushed
1db0eba807a6: Pushed
c72d9ccda0b2: Pushed
d7819b8a2d18: Pushed
d0e5cba6b262: Pushed
e0bac91f0f10: Pushed
1.0: digest: sha256:f9ccb476e2388efa0dfdf817625a94f2247674148a69b7e4846793e63c8be994 size: 1789
```

Now that you've pushed the app image to Container Registry, use the following command to create a Container Apps instance to run the app after pulling the image from the Container Registry:

```azurecli-interactive
export DATASOURCE_JDBC_URL=jdbc:postgresql://${DB_SERVER_NAME}.postgres.database.azure.com:5432/${DB_NAME}?sslmode=require
az containerapp create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --image $TODO_QUARKUS_TAG \
    --environment $ACA_ENV \
    --registry-server $LOGIN_SERVER \
    --registry-username $USER_NAME \
    --registry-password $PASSWORD \
    --target-port 8080 \
    --secrets \
        jdbcurl=${DATASOURCE_JDBC_URL} \
        dbusername=${DB_ADMIN} \
        dbpassword=${DB_PASSWORD} \
    --env-vars \
        QUARKUS_DATASOURCE_JDBC_URL=secretref:jdbcurl \
        QUARKUS_DATASOURCE_USERNAME=secretref:dbusername \
        QUARKUS_DATASOURCE_PASSWORD=secretref:dbpassword \
    --ingress 'external'
```

The `--secrets` option is used to create secrets that're referenced by database connection related environment variables `QUARKUS_DATASOURCE_JDBC_URL`, `QUARKUS_DATASOURCE_USERNAME` and `QUARKUS_DATASOURCE_PASSWORD`. The values of these environment variables are passed to properties `%prod.quarkus.datasource.password`, `%prod.quarkus.datasource.username` and `%prod.quarkus.datasource.password`, which are used in the Quarkus application in order to connect to the Azure Database for PostgreSQL Flexible Server.

Successful output is a JSON object including the property `"type": "Microsoft.App/containerApps"`.

Get a fully qualified url to access the Todo application by using the following command:

```azurecli-interactive
export QUARKUS_URL=https://$(az containerapp show \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $ACA_NAME \
    --query properties.configuration.ingress.fqdn -o tsv)
echo $QUARKUS_URL
```

Open a new web browser to the value of `${QUARKUS_URL}`. Then, add a new todo item with the text `Deployed the Todo app to Container Apps`. Select this item to mark it as completed.

:::image type="content" source="media/deploy-java-quarkus-app/demo-updated.png" alt-text="Screenshot of the Todo sample app running in Container Apps." lightbox="media/deploy-java-quarkus-app/demo-updated.png":::

Access the RESTful API (`/api`) to get all todo items stored in the Azure Database for PostgreSQL, as shown in the following example:

```bash
curl --verbose -k ${QUARKUS_URL}/api | jq .
```

The output should look like the following example:

```output
* Connected to <aca-name>.<random-id>.eastus.azurecontainerapps.io (20.231.235.79) port 443 (#0)
> GET /api HTTP/2
> Host: <aca-name>.<random-id>.eastus.azurecontainerapps.io
> user-agent: curl/7.88.1
> accept: */*
>
< HTTP/2 200
< content-length: 88
< content-type: application/json;charset=UTF-8
<
[
  {
    "id": 1,
    "title": "Deployed the Todo app to Container Apps",
    "completed": true,
    "order": 1,
    "url": null
  }
]
```

### Verify that the database has been updated by using Azure Cloud Shell

Open Azure Cloud Shell in the Azure portal by selecting the **Cloud Shell** icon (:::image type="icon" source="media/deploy-java-quarkus-app/cloud-shell.png" border="false":::) next to the search box.

Run the following command locally and paste the result into Azure Cloud Shell:

```bash
echo psql --host=${DB_SERVER_NAME}.postgres.database.azure.com --port=5432 --username=${DB_ADMIN} --dbname=${DB_NAME}
```

When asked for the password, use the value you used when you created the database.

Use the following query to get all the todo items:

```psql
select * from todo;
```

The output should look similar to the following example, and should include the same items in the Todo app GUI shown previously:

:::image type="content" source="media/deploy-java-quarkus-app/query-output.png" alt-text="Screenshot of the query output as an ASCII table." lightbox="media/deploy-java-quarkus-app/query-output.png":::

Enter *\q* to exit from the `psql` program and return to the Cloud Shell.

## Clean up resources

To avoid Azure charges, you should clean up unneeded resources. When the cluster is no longer needed, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, container service, container registry, and all related resources.

```azurecli-interactive
git reset --hard
docker rmi ${TODO_QUARKUS_TAG}
az group delete --name $RESOURCE_GROUP_NAME --yes --no-wait
```

You might also want to use `docker rmi` to delete the `postgres` and `testcontainers` container images generated by Quarkus dev mode.

## Next steps

- [Azure Container Apps](https://azure.microsoft.com/products/container-apps/)
- [Deploy a Java application with Quarkus on an Azure Kubernetes Service cluster](/azure/aks/howto-deploy-java-quarkus-app)
- [Deploy serverless Java apps with Quarkus on Azure Functions](/azure/azure-functions/functions-create-first-quarkus)
- [Quarkus](https://quarkus.io/)
- [Jakarta EE on Azure](./index.yml)
