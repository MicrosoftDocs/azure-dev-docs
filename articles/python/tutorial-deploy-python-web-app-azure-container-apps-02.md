---
title: Build and deploy a Python web app with Azure Container Apps
description: Describes how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 09/07/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Build and deploy a Python web app with Azure Container Apps and PostgreSQL

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enable you to deploy containerized apps without managing complex infrastructure. 

In this part of the tutorial, you learn how to build containerized Python web app from a sample app (Django or Flask version). You build the container image in the cloud and deploy it to Azure Container Apps.  A [Service Connector][9] enables the container to connect to an [Azure Database for PostgreSQL - Flexible Server][10] instance, where the sample app stores data.

The service diagram shown below highlights the components covered in this article, namely building and deploying a container image.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Section highlighted is what is covered in this article." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png":::

## Get the sample app

Go to the repository of the sample app ([Django][1] or [Flask][2]) and fork the repository.

**Step 1.** Select the Fork button at the top of the sample app repo to fork the repo to your account.

**Step 2.** Now you can clone your fork of the sample repository.

**Step 3.** Use the following git command to clone your forked repo into the *python-code-to-cloud* folder:

```bash
# Django
git clone https://github.com/$GITHUB_USERNAME/msdocs-python-django-azure-container-app.git python-code-to-cloud

# Flask
# git clone https://github.com/$GITHUB_USERNAME/msdocs-python-flask-azure-container-app.git python-code-to-cloud
```

**Step 4.** Change directory:

```bash
cd python-code-to-cloud
```

## Build container image from web app code

After following these steps, you'll have an Azure Container Registry and a Docker container image built from the sample code.

### [Azure portal](#tab/azure-portal)

Sign in to [Azure portal][3] to complete these steps.

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "container registries" and select the **Container Registries** service in the results.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Select **+ Create** to start the create process.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Fill out the form and specify.
        * **Resource group** &rarr; Create a new one named *pythoncontainer-rg*.
        * **Registry name** &rarr; The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. 
        * **Location** &rarr; Select a location to match. 
        * **SKU** &rarr; Select **Standard**.

        When finished, select **Review + create**. After  validation is complete, select **Create**.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** Open [Azure Cloud Shell][4].

        You can also open Azure Cloud Shell selecting the Cloud Shell icon in the top menu bar of any portal window.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 5.** Use the [az acr build][5] command to build the image from the repo.

        Specify the registry name and resource group you created above. For `\<repo-path>`, choose either the [Django][1] or [Flask][2] repo path.

        ```azurecli
        az acr build -r <registry-name> -g <res-group> -t pythoncontainer:latest <repo-path>
        ```

        Go to the registry and confirm the image shows up.
    :::column-end:::
:::row-end:::

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension][6] for VS Code.

:::row:::
    :::column span="2":::
        **Step 1.** Start the build image task.

        * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
        * Type "images".
        * Select the task **Azure Container Registry: Build Image in Azure**
        
        Alternatively, right-click the *Dockerfile* and select **Build Image in Azure**. This UI action starts the same create registry task.

        If you don't see the **Build Image in Azure** task, check if you are signed into Azure.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Follow the prompts to create a registry, a resource group, and build the image.
        
        * **Tag image as** &rarr; Enter *pythoncontainer:latest*.
        * **Create new registry** &rarr; Select this option to create new registry.
        * **Registry name** &rarr; The registry name must be unique within Azure, and contain 5-50 alphanumeric characters. 
        * **Select a SKU** &rarr; Select **Basic**.
        * **Create a new resource group** &rarr; Select this option to create resource group.
        * **Resource group** &rarr; Create a new resource group named *pythoncontainer-rg*.
        * **Location** &rarr; Select a location and wait a few seconds for the final prompt for the base image OS.
        * **Select OS** &rarr; Select **Linux**.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Confirm the registry was created.
        
        Select the Docker extension and to the **Registries** section. Expand the Azure node to find the new Azure Container Registry.  
      
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

:::row:::
    :::column span="1":::
        **Step 1.** Create a resource group with the [az group create](/cli/azure/group#az-group-create) command.

        ```azurecli
        az group create -n pythoncontainer-rg -l <location>
        ```

        *\<location>* is one of the Azure location *Name* values from the output of the command `az account list-locations -o table`.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Create a container registry with the [az acr create](/cli/azure/acr#az-acr-create) command.

        ```azurecli
        az acr create -g pythoncontainer-rg -n <registry-name> --sku Basic --admin-enabled
        ```

        *\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 3.** Sign in to the registry using the [az acr login](/cli/azure/acr#az-acr-login) command.

        ```azurecli
        az acr login -n <registry-name>
        ```
        
        The above command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded". If you're accessing the registry from a subscription different from the one in which the registry was created, use the `--suffix` switch.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 4.** Build the image with the [az acr build](/cli/azure/acr#az-acr-build) command.

        ```azurecli
        az acr build -r <registry-name> -g <res-group> -t pythoncontainer:latest .
        ```
        
        Note:

        * The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, specify the path to the code.

        * If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. Building without pushing can be useful to check that the image builds.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 5.** Confirm the container image was created with the [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) command.

        ```azurecli
        az acr repository list -n <registry-name>
        ```
        :::column-end:::
:::row-end:::

---

## Create a PostgreSQL Flexible Server

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "postgres" and select the **Azure Database for PostgreSQL flexible servers** service in the results.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Select **+ Create** to start the create process.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Fill out the **Basics** form as follows:

        * **Resource group** &rarr; The resource group you created for the Azure Container Registry.
        * **Server name** &rarr; Use *postgres-instance*.
        * **Region** &rarr; The same region you used for the resource group.
        * **Admin username** &rarr; Use *demoadmin*.
        * **Password** and **Confirm password** &rarr; A password that you'll use later when connecting the container app to this database.

        All other settings, leave as defaults. When done, select **Networking** to go to the networking page.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Fill out the **Networking** form as follows:

        * **Connectivity method** &rarr; Select **Public access**.
        * **Allow public access from any Azure service** &rarr; Select the checkbox, that is, allow access. 
        * **Add current client IP address** &rarr; Select (add) if you plan on accessing the database from your local server.

        All other settings, leave as defaults. Select **Review + Create**.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Review the information and when satisfied, select **Create**.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [VS Code](#tab/vscode-aztools)

:::row:::
    :::column span="2":::
        **Step 1.** Sign into Azure using the Visual Studio Code Azure Tools Extension and call the create task.

        1. Select the **Azure** extension from the [activity bar](https://code.visualstudio.com/docs/getstarted/userinterface).

        1. Under **RESOURCES**, expand your subscription. (Make sure you viewing resources by **Group by Resource Type**.)

        1. Right-click **PostgreSQL servers** and select  **Create server**.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step X.** A series of prompts will guide you through the process of creating the database. Fill in the information as follows.

        1. Select **PostgreSQL Flexible Server**.
        
        1. Specify a **name** for the server.
        
           Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example: *postgres-db-\<unique-id>*.<br><br>
        
        1. Select the **B1 Basic** SKU (1 vCore, 2 GiB Memory, 5-GB storage).
        
        1. Create an administrator user name.
        
           This name for an administrator account on the database server. Record this name and password as you'll need them later in this tutorial.<br><br>
        
        1. Create a password for the administrator and confirm it.
        
        1. Select a user group to put the database in.
        
           Use the same resource group that you created the App Service in.<br><br>
        
        1. Select a location for the database.
        
           Select the same location as the resource group and App Service.
        

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Once the database is created, configure access from your local environment to the Azure Database for PostgreSQL server. 

        1. Open the Command Palette (**F1** or **Ctrl** + **Shift** + **P**).
        
        1. Search for and select **PostgreSQL: Configure Firewall**.  (Select a subscription if prompted.)
        
        1. Select the database you created above. If the database name doesn't appear in the list, it's likely it hasn't finished being created.
        
        1. Select **Yes** in the dialog box to add your IP address to the firewall rules of the PostgreSQL server.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

TBD

---

## Create a database

The sample code requires a PostgreSQL database to store data in. In the previous step, you created a PostgreSQL database instance. In this step, you'll add the "restaurants_reviews" database.

### [psql](#tab/create-database-psql)

In your local environment, or anywhere you can use the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html) such as the [Azure Cloud Shell](/azure/cloud-shell/overview), connect to the PostgreSQL database server to create the `restaurants_reviews` database.

Start psql:

```bash
psql --host=<postgres-instance-name>.postgres.database.azure.com \
     --port=5432 \
     --username=demoadmin@<postgres-instance-name> \
     --dbname=postgres
```

The command above will prompt you for the admin password. If you have trouble connecting, restart the database and try again. If you're connecting from your local environment, your IP address must be added to the firewall rule list for the database service.

At the `postgres=>` prompt, create the database:

```sql
CREATE DATABASE restaurants_reviews;
```

The semicolon (";") at the end of the command is necessary. To verify that the `restaurants_reviews` database was successfully created, use the command `\c restaurants_reviews` to change the prompt from `postgres=>` (default) to the `restaurant->`. Type `\?` to show help or `\q` to quit.

You can also create a database using [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or any other IDE, and Visual Studio Code with the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed.

### [VS Code](#tab/create-database-vscode-aztools)

After the firewall rule allowing local access has been successfully added, you can create the `restaurants_reviews` database.

**Step 1.** In the **Azure** extension, find the PostgreSQL Server you created, right-click it, and select **Create Database**.

**Step 2.** At the prompt, enter *restaurants_reviews* as the **Database Name**.

If you have trouble creating the database, the server may still be processing the firewall rule from the previous step. Wait a moment and try again.

---

## Deploy web app to Container Apps

Container apps are deployed to Container Apps environments, which act as a secure boundary. These steps will create both the environment and the container inside the environment, and configure the environment so that the website is visible externally.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **Step 1.** In the portal search at the top of the screen, search for "container apps" and select the **Container Apps** service in the results.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Select **+ Create** to start the create process.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Specify the **Basics** of the container app.
        
        * **Resource group** &rarr; Use the group created earlier and contains the Azure Container Registry.        
        * **Container app name** &rarr; *python-container-app*.        
        * **Region** &rarr; Use the same region/location as the resource group.
        * **Container Apps Environment** &rarr; Enter *python-container-env*.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** On the **Basics** page, select **Next: App Settings** to go to configure app settings.

        On the **App settings** page:
        
        * **Use quickstart image** &rarr; Unselect checkbox.        
        * **Name** &rarr; *python-container-app*.
        * **Image Source** &rarr; Select *Azure Container Registry*.        
        * **Registry** &rarr; Select the name of registry you created earlier.        
        * **Image name** &rarr; Select *pythoncontainer* (the name of the image you built).
        * **Image tag** &rarr; Select *latest*.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5.** Configure HTTP Ingress.
        
        * **HTTP Ingress** &rarr;  Select checkbox (enabled).        
        * **Ingress traffic** &rarr; Select **Accepting traffic from anywhere**.        
        * **Target port**&rarr; Set to 8000 (Django) or 5000 (Flask).
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 6.** Review and create.

        * Select **Review and create** to go to review page.
        * Select **Create** to create the container app.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 7.** Create container environment variables.

        * AZURE_POSTGRESQL_HOST=\<postgres-instance-name>.postgres.database.azure.com
        * AZURE_POSTGRESQL_DATABASE=restaurants_reviews
        * AZURE_POSTGRESQL_USERNAME=demoadmin
        * AZURE_POSTGRESQL_PASSWORD=\<db-password>
        * RUNNING_IN_PRODUCTION=1

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 8.** Get the Application Url for the website.

        * Go the newly created container app and select the **Overview** resource.
        * Under **Essentials** find the **Application Url**.
        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Container Apps extension][11] for VS Code.

:::row:::
    :::column span="1":::
        **Step 1.** Create an *.env* file that you'll reference during the creation of the container app.

        In the sample repo there is an *.env.example* file you can start from. Create an *.env* file with the following values:
        
        ```bash
        AZURE_POSTGRESQL_HOST=<postgres-instance-name>.postgres.database.azure.com
        AZURE_POSTGRESQL_DATABASE=restaurants_reviews
        AZURE_POSTGRESQL_USERNAME=demoadmin
        AZURE_POSTGRESQL_PASSWORD=<db-password>
        RUNNING_IN_PRODUCTION=1
        ```
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Start the container apps create task.

        * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
        * Type "containers apps".
        * Select the task **Azure Container Apps: Create Container App**

        Alternatively, you can open the Azure extension, find the **Container Apps** section and select **+** icon to start. 

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Follow the steps to create the container environment.

        * **Select Container Apps environment** &rarr; Select **Create new Container Apps environment**.
        * **Select a location for new resources** &rarr; Choose the same location that resource group you created previously.        
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** After creating the environment, you should be prompted to create a container app.

        * **Enter a new from the new container app** &rarr; Enter *python-container-app*.
        * **Select a container registry** &rarr; Select **Azure Container Registries**.
        * **Select an Azure Container Registry** &rarr; Select the name of the registry you create previously.
        * **Select a repository** &rarr; Select **pythoncontainer**.
        * **Select a tag** &rarr; Select **latest**.
        * **Set with environment variables file** &rarr; Select the *.env* file you created above.
        * **Enable ingress for applications** &rarr; Select **Enable**.
        * **Select the HTTP traffic that the endpoint will accept** &rarr; Select **External**.
        * **Port the container is listening on** &rarr; Set to 8000 (Django) or 5000 (Flask).

        If you missed the prompt to create the container app, go to the Azure extension, Container Apps section, select the environment, right-click and select **Create Container App**.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5.** Browse to the website.

        * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
        * Find and start the task **Azure Container Apps: Browse**.
        * Select the container environment and container app you just created.

        Alternatively, go to the Azure extension, Container Apps section, container environment and right-click the container app and select **Browse**.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

:::row:::
    :::column:::
        **Step 1.** Sign in to Azure and authenticate, if needed.

        ```azurecli
        az login
        ```
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Install or upgrade the extension for Azure Container Apps withe [az extension add][14] command.
        
        ```azurecli
        az extension add --name containerapp --upgrade
        ```
        
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 3.** Create a Container Apps environment with the [az containerapp env create][13] command.

        ```azurecli
        az containerapp env create \
        --name python-container-env \
        --resource-group pythoncontainer-rg \
        --location <location>
        ```
        *\<location>* is one of the Azure location *Name* values from the output of the command `az account list-locations -o table`.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 4.** Get the login credentials for the Azure Container Registry.

        ```azurecli
        az acr credentials show -n <registry-name>
        ```

        Use the username and one of the passwords returned from the output of the above command.

    :::column-end:::
:::row-end:::

:::row:::
    :::column span="1":::
        **Step 5.** Create a container app in the environment with the [az containerapp create][12] command.

        ```azurecli
        az containerapp create \
        --name python-container-app \
        --resource-group pythoncontainer-rg \
        --image <registry-name>.azurecr.io/pythoncontainer:latest \
        --environment python-container-env \
        --ingress external \
        --target-port 8000 \
        --registry-server <registry-name>.azurecr.io \
        --registry-username <registry-username> \
        --registry-password <registry-password> \
        --env-vars <env-variable-string>
        --query properties.configuration.ingress.fqdn
        ```

        `<env-variable-string>` is a string composed of space-separated values in the key="value" format with the following values.

        * AZURE_POSTGRESQL_HOST=\<postgres-instance-name>.postgres.database.azure.com
        * AZURE_POSTGRESQL_DATABASE=restaurants_reviews
        * AZURE_POSTGRESQL_USERNAME=demoadmin
        * AZURE_POSTGRESQL_PASSWORD=\<db-password>
        * RUNNING_IN_PRODUCTION=1

        Here's an example: `--env-vars AZURE_POSTGRESQL_HOST="my-postgres-instance.postgres.database.azure.com" AZURE_POSTGRESQL_DATABASE="restaurants_reviews" AZURE_POSTGRESQL_USERNAME="demoadmin" AZURE_POSTGRESQL_PASSWORD="somepassword" RUNNING_IN_PRODUCTION="1"`.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 7.** Test the website.

        The create command above outputs an application Url you can use to browse to. The Url ends in "azurecontainerapps.io".

    :::column-end:::
:::row-end:::

---

## Troubleshoot deployment

* You forgot the Application Url to access the website.
  * In the Azure portal, go to the **Overview** page of the Container App and look for the **Application Url**.
  * In VS Code, go to the Azure extension and select the **Container Apps** section. Expand the subscription, expand the container environment, and when you find the container app, right-click **python-container-app** and select **Browse**.
  * With Azure CLI, use the command `az containerapp show -g <res-group> -n python-container-app --query properties.configuration.ingress.fqdn`.

* Image doesn't appear in the Azure Container Registry.
  * Check the output of the Azure CLI command or VS Code Output and look for messages to confirm success.
  * Check that the name of the registry was specified correctly in your build command with the Azure CLI or in the VS Code prompts.
  * Make sure your credentials haven't expired. For example, in VS Code, find the target registry in the Docker extension and refresh. In Azure CLI, run `az login`.

* Website returns "Bad Request (400)".
  * Check the PostgreSQL environment variables passed in to the container. This error often indicates that the Python code can't connect to the PostgreSQL instance.
  * Check that there's a container environment variable `RUNNING_IN_PRODUCTION` and it is set to 1.

* Website returns "Not Found (404)".
  * Check the **Application Url** on the **Overview** page for the container. If the Application Url contains the word "internal", then ingress isn't set correctly.
  * Go to the **Ingress** resource of the container and make sure **HTTP Ingress** is enabled and **Accepting traffic from anywhere** is selected.

[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: /cli/azure/acr#az-acr-build
[6]: https://code.visualstudio.com/docs/containers/overview
[7]: /cli/azure/install-azure-cli
[8]: /azure/container-apps/overview
[9]: /azure/service-connector/overview
[10]: /azure/postgresql/flexible-server/overview
[11]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurecontainerapps
[12]: /cli/azure/containerapp#az-containerapp-create
[13]: /cli/azure/containerapp/env#az-containerapp-env-create
[14]: /cli/azure/extension#az-extension-add
[15]: /cli/azure/containerapp#az-containerapp-up