---
title: Build and deploy a Python web app with Azure Container Apps
description: Describes how to create a container from a Python web app and deploy it to Azure Container Apps, a serverless platform for hosting containerized applications.
ms.topic: conceptual
ms.date: 01/31/2024
ms.custom: devx-track-python, devx-track-azurecli
---

# Build and deploy a Python web app with Azure Container Apps and PostgreSQL

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enables you to deploy containerized apps without managing complex infrastructure.

In this part of the tutorial, you learn how to containerize and deploy a Python sample web app (Django or Flask). Specifically, you build the container image in the cloud and deploy it to Azure Container Apps. You define environment variables that enable the container app to connect to an [Azure Database for PostgreSQL - Flexible Server][10] instance, where the sample app stores data.

This service diagram highlights the components covered in this article: building and deploying a container image.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Section highlighted is what is covered in this article." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-deploy.png":::

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

If you're running locally, follow these steps to sign in and install the necessary modules for this tutorial.

1. Sign in to Azure and authenticate, if needed:

    ```azurecli
    az login
    ```

1. Make sure you're running the latest version of the Azure CLI:

    ```azurecli
    az upgrade
    ```

1. Install or upgrade the *containerapp* and *rdbms-connect* Azure CLI extensions with the [az extension add][14] command.

    ```azurecli
    az extension add --name containerapp --upgrade
    az extension add --name rdbms-connect --upgrade
    ```

    > [!Note]
    > To list the extensions installed on your system, you can use the [az extension list](/cli/azure/extension#az-extension-list) command. For example,
    >
    > ```azurecli
    > az extension list --query [].name --output tsv
    > ```

### [VS Code](#tab/vscode-aztools)

Make sure the following extensions are installed:

* [Docker extension][6] for VS Code.
* [Azure Databases extension][26] for VS Code.
* [Azure Container Apps extension][11] for VS Code.

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal][3].

---

## Get the sample app

Fork and clone the sample code to your developer environment.

1. Go to the GitHub repository of the sample app ([Django][1] or [Flask][2]) and select **Fork**.

    Follow the steps to fork the directory to your GitHub account. You can also download the code repo directly to your local machine without forking or a GitHub account, however, you won't be able to set up CI/CD discussed later in the tutorial.

1. Use the [git clone][21] command to clone the forked repo into the *python-container* folder:

    ```console
    # Django
    git clone https://github.com/$USERNAME/msdocs-python-django-azure-container-apps.git python-container
    
    # Flask
    # git clone https://github.com/$USERNAME/msdocs-python-flask-azure-container-apps.git python-container
    ```

1. Change directory.

    ```console
    cd python-container
    ```

## Build a container image from web app code

After following these steps, you'll have an Azure Container Registry that contains a Docker container image built from the sample code.

### [Azure CLI](#tab/azure-cli)

1. Create a resource group with the [az group create][17] command.

    ```azurecli
    az group create \
        --name pythoncontainer-rg \
        --location <location>
    ```

    *\<location>* is one of the Azure location *Name* values from the output of the command `az account list-locations -o table`.

1. Create a container registry with the [az acr create][18] command.

    ```azurecli
    az acr create \
        --resource-group pythoncontainer-rg \
        --name <registry-name> \
        --sku Basic \
        --admin-enabled
    ```

    *\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.

1. Sign in to the registry using the [az acr login][19] command.

    ```azurecli
    az acr login --name <registry-name>
    ```

    The command adds "azurecr.io" to the name to create the fully qualified registry name. If successful, you'll see the message "Login Succeeded". If you're accessing the registry from a subscription different from the one in which the registry was created, use the `--suffix` switch.

    If sign-in fails, make sure the Docker daemon is running on your system.

1. Build the image with the [az acr build][5] command.

    ```azurecli
    az acr build \
        --registry <registry-name> \
        --resource-group pythoncontainer-rg \
        --image pythoncontainer:latest .
    ```

    Note that:

    * The dot (".") at the end of the command indicates the location of the source code to build. If you aren't running this command in the sample app root directory, specify the path to the code.

    * If you're running the command in Azure Cloud Shell, use `git clone` to first pull the repo into the Cloud Shell environment first and change directory into the root of the project so that dot (".") is interpreted correctly.

    * If you leave out the `-t` (same as `--image`) option, the command queues a local context build without pushing it to the registry. Building without pushing can be useful to check that the image builds.

1. Confirm the container image was created with the [az acr repository list][20] command.

    ```azurecli
    az acr repository list --name <registry-name>
    ```

### [VS Code](#tab/vscode-aztools)

These steps require the [Docker extension][6] for VS Code.

1. Create an Azure Container Registry.

    Start the Create Registry task:

    * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
    * Type "Azure Container Registry".
    * Select the task **Azure Container Registry: Create Registry**.

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-registry.png" alt-text="Screenshot showing how to start creating a new Azure Container Registry in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-build-image-01.png":::

    Follow the prompts to create a registry and a resource group:

    * If you're prompted, select the subscription you want to create resources in for this tutorial.
    * **Registry name**: The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
    * **Select a SKU**: Select **Basic**.
    * **Create a new resource group**: Select this option to create the resource group.
    * **Resource group**: Create a new resource group named *pythoncontainer-rg*.
    * **Location**: Select a location and wait until the notification that indicates the registry has been created.

1. Build the image.

    Start the Build Image in Azure task:

    * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
    * Type "Azure Container Registry".
    * Select the task **Azure Container Registry: Build Image in Azure**.

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-build-image-01.png" alt-text="Screenshot showing how to start building a new container image in an Azure Container Registry with Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-build-image-01.png":::

    Alternatively, you can right-click the *Dockerfile* and select **Build Image in Azure** to start the same task to build the image. If you don't see the **Build Image Azure** task, make sure you're signed into Azure.

    Follow the prompts to build the image.

    * **Tag image as**: Enter *pythoncontainer:latest*.
    * **Registry provider**: Select **Azure**.
    * If you're prompted, select your subscription.
    * **Registry**: Select the Container registry from the list.
    * **Select OS**: Select **Linux**.

    Monitor progress in the **Output** window and confirm that the image builds successfully. If an error occurs, see the [Troubleshooting section](#troubleshoot-deployment).

1. Confirm the registry was created.

    Select the Docker extension and to the **Registries** section. Expand the Azure node to find the new Azure Container Registry.  

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-build-image-03.png" alt-text="Screenshot showing how to confirm the Azure Container Registry was created in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-build-image-03.png":::

1. Use the [az acr update][29] command to enable the administrator user account for the registry. You can run the command in Visual Studio Code terminal window or the Azure [Cloud Shell][4].

    ```azurecli
    az acr update --name <registry-name> \
        --resource-group pythoncontainer-rg \
        --admin-enabled true
    ```

    Alternatively, you can select the registry in the Docker extension, right-click, and select **Open in Portal**. Then you can follow the instructions in the Azure portal tab of this article to enable the administrator user account.

    You can view the credentials created for admin with:

    ```azurecli
    az acr credential show \
        --name  <registry-name> \
        --resource-group pythoncontainer-rg
    ```

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal][3], search for **container registry**. Under **Marketplace** in the results, select **Container Registry**.

1. On the **Basics** tab, enter the following fields:

    * **Resource group**: Select **Create new** and enter **pythoncontainer-rg**.
    * **Registry name**: The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
    * **Location**: Select a location near you.
    * **SKU**: Select **Basic**.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-build-image-01.png" alt-text="Screenshot showing how to specify a new Azure Container Registry in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-build-image-01.png":::

    When finished, select **Review + create**. After  validation is complete, select **Create**.

1. When deployment completes, select **Go to resource**. If you miss this notification, you can search **container registry** and select your registry under **Resources** in the results.

1. Enable the administrator user account.
    1. Under **Settings** on the **service menu**, select **Access Keys**.
    1. Select the **Admin user** checkbox.

1. Select the Azure Cloud Shell icon in the top menu bar to finish configuration and build an image.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-build-image-02.png" alt-text="Screenshot showing how to access Azure Cloud Shell in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-build-image-02.png":::

    You can also go directly to [Azure Cloud Shell][4].

1. Use the [az acr build][5] command to build the image from the repo.

    ```azurecli
    az acr build --registry <registry-name> \
        --resource-group pythoncontainer-rg \ 
        --image pythoncontainer:latest <repo-path>
    ```

    Specify *\<registry-name>* as the name of the registry you created. For *\<repo-path>*, choose either the [Django][1] or [Flask][2] repo path.

1. After the command completes, under **Services**, select **Repositories** and confirm the image shows up.

---

> [!NOTE]
> The steps in this section create a container registry in the Basic service tier. This tier is cost-optimized, with a feature set and throughput targeted for developer scenarios, and is suitable for the requirements of this tutorial. In production scenarios, you would most likely use either the Standard or Premium service tier. These tiers provide enhanced levels of storage and throughput. To learn more, see [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus). For information about pricing, see [Azure Container Registry pricing](https://azure.microsoft.com/pricing/details/container-registry/).

## Create a PostgreSQL Flexible Server instance

The sample app ([Django][1] or [Flask][2]) stores restaurant review data in a PostgreSQL database. In these steps, you create the server that will contain the database.

### [Azure CLI](#tab/azure-cli)

1. Use the [az postgres flexible-server create][22] command to create the PostgreSQL server in Azure. It isn't uncommon for this command to run for a few minutes to complete.

    ```azurecli
    az postgres flexible-server create \
       --resource-group pythoncontainer-rg \
       --name <postgres-server-name>  \
       --location <location> \
       --admin-user demoadmin \
       --admin-password <admin-password> \
       --active-directory-auth Enabled \
       --tier burstable \
       --sku-name standard_b1ms \
       --public-access 0.0.0.0 
    ```

    * "pythoncontainer-rg": The resource group name used in this tutorial. If you used a different name, change this value.

    * *\<postgres-server-name>*: The PostgreSQL database server name. This name must be **unique across all Azure**. The server endpoint is "https://\<postgres-server-name>.postgres.database.azure.com". Allowed characters are "A"-"Z", "0"-"9", and "-".

    * *\<location>*: Use the same location used for the web app. *\<location>* is one of the Azure location *Name* values from the output of the command `az account list-locations -o table`.

    * *\<admin-username>*: Username for the administrator account. It can't be "azure_superuser", "admin", "administrator", "root", "guest", or "public". Use "demoadmin" for this tutorial.

    * *\<admin-password>*: Password of the administrator user. It must contain 8 to 128 characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.

        > [!IMPORTANT]
        > When creating usernames or passwords **do not** use the "$" character. Later you create environment variables with these values where the "$" character has special meaning within the Linux container used to run Python apps.

    * *--active-directory-auth*: Specifies whether Microsoft Entra ID authentication is enabled on the PostreSQL server. Set to `Enabled`.

    * *--sku-name*: The name of the pricing tier and compute configuration, for example "Standard_B1ms". For more information, see [Azure Database for PostgreSQL pricing][24]. To list available SKUs, use `az postgres flexible-server list-skus --location <location>`.

    * *--public-access*: Use "0.0.0.0", which allows public access to the server from any Azure service, such as Container Apps.

    > [!NOTE]
    > If you plan on working the PostgreSQL server from your local workstation with tools, you'll need to add a firewall rule for your workstation's IP address with the [az postgres flexible-server firewall-rule create][28] command.

1. Use the [az ad signed-in-user show](/cli/azure/ad/signed-in-user#az-ad-signed-in-user-show) command to get the object ID of your user account to use in the next command.

    ```azurecli
    az ad signed-in-user show --query id --output tsv
    ```

1. Use the [az postgres flexible-server ad-admin create](/cli/azure/postgres/flexible-server/ad-admin#az-postgres-flexible-server-ad-admin-create) command to add your user account as a Microsoft Entra administrator on the PostgreSQL server.

    ```azurecli
    az postgres flexible-server ad-admin create \
       --resource-group pythoncontainer-rg \
       --server-name <postgres-server-name>  \
       --display-name <your-email-address> \
       --object-id <your-account-object-id>
    ```

    For your account object ID, use the value you got in the previous step.

### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Databases extension][26] for VS Code.

1. Start the PostgreSQL create task.

    * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
    * Type "Azure Databases".
    * Select the task **Azure Databases: Create Server**.

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-postgres-server-01.png" alt-text="Screenshot showing how to search for the task to create an Azure PostgreSQL Flexible Server instance in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-postgres-server-01.png":::

    Alternatively, you can select the **Azure** extension, **RESOURCES**, and expand your subscription. (Make sure you viewing resources by **Group by Resource Type**.). Then,
    right-click **PostgreSQL servers** and select  **Create server** to start the same create server task.

1. A series of prompts guides you through the process of creating the server. Fill in the information as follows.

    * If you're asked  to select a subscription, select the subscription you're using for this tutorial.

    * **Select an Azure Database Server**: Select **PostgreSQL Flexible Server**.

    * **Server name**: Specify a **name** for the server.
        Enter a name for the database server that's unique across all Azure (the database server's URL becomes `https://<server-name>.postgres.database.azure.com`). Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example: *postgres-db-\<unique-id>*.

    * **Select the Postgres SKU and options**: Select the **B1ms Basic** SKU (1 vCore, 2 GiB Memory, 5-GB storage).

    * **Administrator Username**: Create an administrator user name. This name for an administrator account on the database server. Use *demoadmin* for this tutorial.

    * **Administrator Password**: Create a password for the administrator and confirm it.

    * **Select a resource group for new resources**: Select a resource group to put the server in. Use the same resource group that you created the container registry in, **pythoncontainer-rg**.

    * **Select a location for new resources**: Select the same location as the resource group and container registry.

    Monitor progress in the **Azure** window and confirm that the server is created successfully. If an error occurs, see the [Troubleshooting section](#troubleshoot-deployment).

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-postgres-server-02.gif" alt-text="Screenshot showing how to complete the task to create an Azure PostgreSQL Flexible Server instance in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-postgres-server-02.gif":::

1. After the server is created, configure access from your local environment to the Azure Database for PostgreSQL server.

    First, confirm that the server was created by checking the **Azure: Activity Log** window. When you're sure the server exists then:

    * Open the Command Palette (**F1** or **Ctrl** + **Shift** + **P**).

    * Search for and select **PostgreSQL: Configure Firewall**. (Select a subscription if prompted.)

    * Select **PostgreSQL servers (Flexible)**, then select the server you created in the previous step. If the server doesn't appear in the list, it's likely it hasn't finished being created.

    * Select **Yes** in the dialog box to add your IP address to the firewall rules of the PostgreSQL server.

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-postgres-server-04.png" alt-text="Screenshot showing how to Confirm adding local workstation IP as firewall rule for Azure PostgreSQL Flexible Server instance in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-postgres-server-04.png":::

1. The following steps require the Azure CLI. If you have the Azure CLI installed locally, you can run them in a terminal prompt; otherwise, open the [Azure Cloud Shell][4] in a browser.

1. Use the [az postgres flexible-server firewall-rule create](/cli/azure/postgres/flexible-server/firewall-rule#az-postgres-flexible-server-firewall-rule-create) command to add a rule to allow your web app to access the PostgreSQL Flexible server. In the following command, you configure the server's firewall to accept connections from all Azure resources.

    ```azurecli
    az postgres flexible-server firewall-rule create \
        --name <postgres-server_name> \
        --resource-group pythoncontainer-rg \
        --rule-name AllowAllAzureServices \
        --start-ip-address 0.0.0.0 \
        --end-ip-address 0.0.0.0
    ```

1. Use the [az postgres flexible-server update](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-update) command to enable Microsoft Entra authentication on the server.

    ```azurecli
    az postgres flexible-server update \
        --resource-group pythoncontainer-rg \
        --name <postgres-server-name> 
        --active-directory-auth Enabled
    ```

1. Use the [az ad signed-in-user show](/cli/azure/ad/signed-in-user#az-ad-signed-in-user-show) command to get the object ID of your user account to use in the next command.

    ```azurecli
    az ad signed-in-user show --query id --output tsv
    ```

1. Use the [az postgres flexible-server ad-admin create](/cli/azure/postgres/flexible-server/ad-admin#az-postgres-flexible-server-ad-admin-create) command to add your user account as a Microsoft Entra administrator on the PostgreSQL server.

    ```azurecli
    az postgres flexible-server ad-admin create \
       --resource-group pythoncontainer-rg \
       --server-name <postgres-server-name>  \
       --display-name <your-email-address> \
       --object-id <your-account-object-id>
    ```

    For your account object ID, use the value you got in the previous step.

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal][3], search for **postgresql flexible**. Under **Marketplace** in the results, select **Azure Database for PostgreSQL Flexible Server**.

1. On the **Basics** tab, enter the following values:

    * **Resource group**: The resource group used in this tutorial "pythoncontainer-rg".
    * **Server name**: Enter a name for the database server that's unique across Azure. The database server's URL becomes `https://<server-name>.postgres.database.azure.com`. Allowed characters are `A`-`Z`, `0`-`9`, and `-`. For example: *postgres-db-\<unique-id>*.
    * **Region**: The same region you used for the resource group.
    * **Workload Type**: Select **Development**.
    * **Authentication Method**: Select **PostgreSQL and Microsoft Entra authentication**.
    * **Set Microsoft Entra admin**: Select **Set admin**. On the **Select Microsoft Entra Admins** page, search for your Azure user account, select it in the results, and then click **Select**.
    * **Admin username**: Use *demoadmin*.
    * **Password** and **Confirm password**: A password for the admin account.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-postgres-server-basics-tab.png" alt-text="Screenshot showing how to specify basic settings of an Azure PostgreSQL Flexible Server instance in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-postgres-server-basics-tab.png":::

    For all other settings, leave the defaults. When done, select **Next: Networking**.

1. On the **Networking** tab, enter the following values:

    * **Connectivity method**: Make sure **Public access (allowed IP addresses) and Private endpoint** is selected.
    * **Allow public access to this resrouce through the internet using a public IP address**: Make sure the checkbox is selected.
    * **Allow public access from any Azure service within Azure to this service**: Select the checkbox.
    * **Add current client IP address**: Select (add) if you plan on accessing the database from your local server.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-postgres-server-networking-tab.png" alt-text="Screenshot showing how to specify networking settings of an Azure PostgreSQL Flexible Server instance in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-postgres-server-networking-tab.png":::

    For all other settings, leave the defaults. Select **Review + Create** to continue.

1. Review the settings and, when satisfied, select **Create**.

---

> [!NOTE]
> The steps in this section create a PostgreSQL server with a single vCore and limited memory in the Burstable pricing tier. The Burstable tier is a lower cost option for workloads that don't need the full CPU continuously, and is suitable for the requirements of this tutorial. For production workloads, you might upgrade to either the General Purpose or Memory Optimized pricing tier. These tiers provide higher performance, but increase costs. To learn more, see [Compute options in Azure Database for PostgreSQL - Flexible Server](/azure/postgresql/flexible-server/concepts-compute). For information about pricing, see [Azure Database for PostgreSQL pricing](https://azure.microsoft.com/en-us/pricing/details/postgresql/flexible-server/).

## Create a database on the server

At this point, you have a PostgreSQL server. In this section, you create a database on the server.

### [Azure CLI](#tab/azure-cli)

Use the [az postgres flexible-server db create][27] command to create a database named *restaurants_reviews*.

```azurecli
az postgres flexible-server db create \
   --resource-group pythoncontainer-rg \
   --server-name <postgres-server-name> \
   --database-name restaurants_reviews
```

Where:

* "pythoncontainer-rg": The resource group name used in this tutorial. If you used a different name, change this value.
* `<postgres-server-name>`: The name of the PostgreSQL server.

You could also use the [az postgres flexible-server connect][16] command to connect to the database and then work with [psql][15] commands. When working with psql, it's often easier to use the Azure [Cloud Shell][4] because all the dependencies are included for you in the shell.

### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Databases extension][26] for VS Code.

1. In the **Azure** extension, find the PostgreSQL Server you created, right-click it, and select **Create Database**.

1. At the prompt, enter **restaurants_reviews** as the **Database Name**.

If you have trouble creating the database, the server might still be processing the firewall rule from the previous step. Wait a moment and try again. If you're prompted to enter credentials to access the database, use the "demoadmin" username, and password you entered when you created the database.

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your PostgreSQL server. For example, you can enter the name of your PostgreSQL server in the search bar and select it under **Resources** in the results.
1. Under **Settings** on the **service menu**, select **Databases**.
1. Select **Add** on the top menu of the **Databases** page.
1. On the  **Create Database** page, enter **restaurants_reviews** for the **Name**, then select **Save**.
1. When the operation completes, you're returned to the **Databases** page. Verify that **restaurants_reviews** appears in the list of databases. You might need to refresh the page for it to appear.

---

You can also connect to Azure PostgreSQL Flexible server and create a database using [psql][15] or an IDE that supports PostgreSQL like [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio). For steps using psql, see [Configure the managed identity on the postgresql database](#configure-the-managed-identity-on-the-postgresql-database).

## Create a user-assigned managed identity

Create a user-assigned managed identity. This managed identity will be used as the identity for the container app when running in Azure.

> [!NOTE]
> To create a user-assigned managed identity, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.

### [Azure CLI](#tab/azure-cli)

Use the [az identity create](/cli/azure/identity#az-identity-create) command to create a user-assigned managed identity.

```azurecli
az identity create --name my-ua-managed-id --resource-group pythoncontainer-rg
```

### [VS Code](#tab/vscode-aztools)

There isn't currently a VS Code extension that supports creating user-assigned managed identities.  Follow the steps for Azure CLI or the Azure portal.

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), search for **managed identity**. Under **Marketplace** in the results, select **User Assigned Managed Identity**.
1. On the **Basics** tab, enter the following values:

    * **Subscription**: Choose the subscription you're using for the resources in this tutorial.
    * **Resource group**: Enter the resource group for this tutorial; **pythoncontainer-rg**.
    * **Region**: Choose the region you're using for the resources in this tutorial.
    * **Name**: Enter the name for your user-assigned managed identity. For this tutorial, use: **my-ua-managed-id**. You can use a different name, but the commands in this tutorial assume **my-ua-managed-id**. If you use a different name, you'll have to change it in other commands.

    :::image type="content" source="media/tutorial-container-apps/create-user-assigned-managed-identity-portal.png" alt-text="Screenshot that shows the Create User Assigned Managed Identity pane." lightbox="media/tutorial-container-apps/create-user-assigned-managed-identity-portal.png":::

1. Select **Review + create** to review the changes.
1. Select **Create**.

---

## Configure the managed identity on the PostgreSQL database

Configure the managed identity as a role on the PostgreSQL server and then grant it necessary permissions for the *restaurants_reviews* database. Whether using the Azure CLI or psql, you must connect to the Azure PostgreSQL server with a user that is configured as a Microsoft Entra admin on your server instance. Only Microsoft Entra accounts configured as a PostreSQL admin can configure managed identities and other Microsoft Admin roles on your server.

### [Azure CLI](#tab/configure-database-azure-cli)

1. Get an access token for your Azure account with the [az account get-access-token](/cli/azure/account#az-account-get-access-token) command. You use the access token in the following steps.

    ```azurecli
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    ```

    The returned token is long. Set its value in an environment variable to use in the commands in the following step:

    ```bash
    MY_ACCESS_TOKEN=<your-access-token>
    ```

1. Add the user-assigned managed identity as database role on your PostgreSQL server with the [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command.

    ```azurecli
    az postgres flexible-server execute \
        --name <postgres-server-name> \
        --database-name postgres \
        --querytext "select * from pgaadauth_create_principal('"my-ua-managed-id"', false, false);select * from pgaadauth_list_principals(false);" \
        --admin-user <your-Azure-account-email> \
        --admin-password $MY_ACCESS_TOKEN
    ```

    * If you used a different name for your managed identity, replace `my-ua-managed-id` in the `pgaadauth_create_principal` command with the name of your managed identity.

    * For the `--admin-user` value, use your Azure account email address.

    * For the `--admin-password` value, use the access token output by the previous command, unquoted.

    * Make sure the database name is `postgres`.

    > [!NOTE]
    > If you're running the *az postgres flexible-server execute* command on your local workstation, make sure you've added a firewall rule for your workstation's IP address. You can add a rule with the [az postgres flexible-server firewall-rule create][28] command. The same requirement also exists for the command in the next step.

1. Grant the user-assigned managed identity necessary permissions on the *restaurants_reviews* database with the following [az postgres flexible-server execute](/cli/azure/postgres/flexible-server#az-postgres-flexible-server-execute) command.

    ```azurecli
    az postgres flexible-server execute \
        --name <postgres-server-name> \
        --database-name restaurants_reviews \
        --querytext "GRANT CONNECT ON DATABASE restaurants_reviews TO \"my-ua-managed-id\";GRANT USAGE ON SCHEMA public TO \"my-ua-managed-id\";GRANT CREATE ON SCHEMA public TO \"my-ua-managed-id\";GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO \"my-ua-managed-id\";ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO \"my-ua-managed-id\";" \
        --admin-user <your-Azure-account-email> \
        --admin-password $MY_ACCESS_TOKEN
    ```

    * If you used a different name for your managed identity, replace all instances of `my-ua-managed-id` in the command with the name of your managed identity. There are five instances in the query string.

    * For the `--admin-user` value, use your Azure account email address.

    * For the `--admin-password` value, use the access token output previously, unquoted.

    * Make sure the database name is `restaurants_reviews`.

    The Azure CLI command above connects to the restaurants_reviews database on the server and issues the following SQL commands:

    ```sql
    GRANT CONNECT ON DATABASE restaurants_reviews TO "my-ua-managed-id";
    GRANT USAGE ON SCHEMA public TO "my-ua-managed-id";
    GRANT CREATE ON SCHEMA public TO "my-ua-managed-id";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "my-ua-managed-id";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "my-ua-managed-id";
    ```

### [psql](#tab/configure-database-psql)

You can use the PostgreSQL interactive terminal [psql][15] in your local environment, or in the [Azure Cloud Shell][4], which is also accessible in the [Azure portal][3]. When working with psql, it's often easier to use the [Cloud Shell][4] because all the dependencies are included for you in the shell.

1. Connect to the database with psql with an Azure account previously configured as a Microsoft Entra admin on your server. If you've been following the steps in this tutorial, your Azure account is already configured as an admin on the server.

    ```bash
    psql --host=<postgres-server-name>.postgres.database.azure.com \
         --port=5432 \
         --username=<your-azure-email-address> \
         --dbname=postgres \
         --set sslmode=require
    ```

    Where *\<postgres-server-name>* is the name of the PostgreSQL server and *\<your-azure-email-address>* is the email address of your Azure account. The command prompts you for your Azure account password.

    If you're working in Azure Cloud Shell or if you have the Azure CLI installed on your local system, you can use the [az account get-access-token](/cli/azure/account#az-account-get-access-token) command to get an access token that you can copy and enter as the password.

    ```azurecli
    az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken
    ```

    Or, you can combine the psql and Azure CLI commands:

    ```bash
    psql "host=<postgres-server-name>.postgres.database.azure.com port=5432 dbname=postgres user=<your-azure-email-address> password='$(az account get-access-token --resource-type oss-rdbms --output tsv --query accessToken)' sslmode=require"
    ```

    Be sure to replace the *\<postgres-server-name>* and *\<your-azure-email-address>* placeholders before running the command.

    If you have trouble connecting, restart the database and try again. If you're connecting from your local environment, your IP address must be added to the firewall rule list for the database service.

1. Add the user-assigned managed identity as database role on your PostgreSQL server.

    At the `postgres=>` prompt enter:

    ```sql
    SELECT * FROM pgaadauth_create_principal('my-ua-managed-id', false, false);SELECT * FROM pgaadauth_list_principals(false);
    ```

    The semicolon (";") at the end of each command is necessary. To verify that the database was successfully created, use the command `\c restaurants_reviews`. Type `\?` to show help or `\q` to quit.

1. Connect to the *restaurants_reviews* database using the `\c` (Connect) command.

    ```SQL
    \c restaurants_reviews
    ```

    > [!NOTE]
    > If you haven't yet created the *restaurants_reviews* database, you can do so with the following command:
    >
    > ```sql
    > CREATE DATABASE resaurants_reviews
    > ```

1. Grant the user-assigned managed identity necessary permissions on the *restaurants_reviews* database.

    At the `restaurants_reviews_=>` prompt, enter the following commands:

    ```sql
    GRANT CONNECT ON DATABASE restaurants_reviews TO "my-ua-managed-id";
    GRANT USAGE ON SCHEMA public TO "my-ua-managed-id";
    GRANT CREATE ON SCHEMA public TO "my-ua-managed-id";
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "my-ua-managed-id";
    ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "my-ua-managed-id";
    ```

1. Quit psql using the `\q` command:

    ```SQL
    \q
    ```

---

## Deploy the web app to Container Apps

Container apps are deployed to Container Apps [*environments*][30], which act as a secure boundary. In the following steps, you create the environment, a container inside the environment, and configure the container so that the website is visible externally.

### [Azure CLI](#tab/azure-cli)

These steps require the Azure Container Apps extension, *containerapp*.

1. Create a Container Apps environment with the [az containerapp env create][13] command.

    ```azurecli
    az containerapp env create \
    --name python-container-env \
    --resource-group pythoncontainer-rg \
    --location <location>
    ```

    *\<location>* is one of the Azure location *Name* values from the output of the command `az account list-locations -o table`.

1. Get the sign-in credentials for the Azure Container Registry with the [az acr credential show](/cli/azure/acr/credential#az-acr-credential-show) command.

    ```azurecli
    az acr credential show -n <registry-name>
    ```

    You use the username and one of the passwords returned from the output of the command when you create the container app in step 5.

1. Use the [az identity show](/cli/azure/identity#az-identity-show) command to get the client ID and resource ID of the user-assigned managed identity.

    ```azurecli
    az identity show --name my-ua-managed-id --resource-group pythoncontainer-rg --query "[clientId, id]" --output tsv
    ```

    You use the value of the client ID (GUID) and the resource ID output by the command when you create the container app in step 5. The resource ID has the following form: `/subscriptions/<subscription-id>/resourcegroups/pythoncontainer-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-ua-managed-id`

1. Run the following command to generate a secret key value.

    ```bash
    python -c 'import secrets; print(secrets.token_hex())'
    ```

    You use the secret key value to set an environment variable when you create the container app in step 5.

    > [!NOTE]
    > The command shown is for a bash shell. Depending on your environment, you might need to invoke python using  `python3`. On Windows, you need to enclose the command in the `-c` parameter in double quotes, rather than single quotes. You also might need to invoke python using `py` or `py -3` depending on your environment.

1. Create a container app in the environment with the [az containerapp create][12] command.

    ```azurecli
    az containerapp create \
    --name python-container-app \
    --resource-group pythoncontainer-rg \
    --image <registry-name>.azurecr.io/pythoncontainer:latest \
    --environment python-container-env \
    --ingress external \
    --target-port <5000 for Flask or 8000 for Django> \
    --registry-server <registry-name>.azurecr.io \
    --registry-username <registry-username> \
    --registry-password <registry-password> \
    --user-assigned <managed-identity-resource-id> \
    --query properties.configuration.ingress.fqdn \
    --env-vars DBHOST="<postgres-server-name>" \
    DBNAME="restaurants_reviews" \
    DBUSER="my-ua-managed-id" \
    RUNNING_IN_PRODUCTION="1" \
    AZURE_CLIENT_ID="<managed-identity-client-id>" \
    AZURE_SECRET_KEY="<your-secret-key>"
    ```

    Make sure you replace all of the values in angle brackets with values you're using in this tutorial. Be aware that the name of your container app must be unique across Azure.

    The value of the `--env-vars` parameter is a string composed of space-separated values in the key="value" format with the following values:

    * DBHOST="\<postgres-server-name>"
    * DBNAME="restaurants_reviews"
    * DBUSER="my-ua-managed-id"
    * RUNNING_IN_PRODUCTION="1"
    * AZURE_CLIENT_ID="\<managed-identity-client-id>"
    * AZURE_SECRET_KEY="\<your-secret-key>"

    The value for `DBUSER` is the name of your user-assigned managed identity.

    The value for `AZURE_CLIENT_ID` is the client ID of your user-assigned managed identity. You got this value in a previous step.

    The value for `AZURE_SECRET_KEY` is the secret key value you generated in a previous step.

1. For Django only, migrate and create database schema. (In the Flask sample app, it's done automatically, and you can skip this step.)

    Connect with the [az containerapp exec][31] command:

    ```azurecli
        az containerapp exec \
            --name python-container-app \
            --resource-group pythoncontainer-rg
    ```

    Then, at the shell command prompt type `python manage.py migrate`.

    You don't need to migrate for revisions of the container.

1. Test the website.

    The `az containerapp create` command you entered previously outputs an application URL you can use to browse to the app. The URL ends in "azurecontainerapps.io". Navigate to the URL in a browser. Alternatively, you can use the [az containerapp browse](/cli/azure/containerapp#az-containerapp-browse) command.

### [VS Code](#tab/vscode-aztools)

These steps require the [Azure Container Apps extension][11] for VS Code.

1. Get values you need for environment variables:

    * Open a terminal in VS Code and enter the following commands. You can also enter the commands from Azure Cloud Shell.

    * Get the client ID of the managed identity with the [az identity show](/cli/azure/identity#az-identity-show) command.

        ```azurecli
        az identity show --name my-ua-managed-id --resource-group pythoncontainer-rg --query clientId -o tsv
        ```

        The client ID is a GUID. You use it to set an environment variable in the next step.

    * Generate a secret key value:

        ```bash
        python -c 'import secrets; print(secrets.token_hex())'
        ```

        You use the secret key value to set an environment variable in the next step.

        > [!NOTE]
        > The command shown is for a bash shell. Depending on your environment, you might need to invoke python using  `python3`. On Windows, you need to enclose the command in the `-c` parameter in double quotes, rather than single quotes. You also might need to invoke python using `py` or `py -3`.

1. Create an *.env* file that you'll reference during the creation of the container app.

    In the sample repo, there's an *.env.example* file you can start from. Create the *.env* file with the following values:

    ```python
    DBHOST="<postgres-server-name>"
    DBNAME="restaurants_reviews"
    DBUSER="my-ua-managed-id"
    RUNNING_IN_PRODUCTION="1"
    AZURE_CLIENT_ID="<managed-identity-client-id>"
    AZURE_SECRET_KEY="<your-secret-key>"
    ```

    The `DBUSER` value is the name of your user-assigned managed identity.

    The `AZURE_CLIENT_ID` value is the client ID of your user-assigned managed identity. You got it in the previous step.

    The `AZURE_SECRET_KEY` value is the secret key value you generated in the previous step.

1. Create a container apps environment.

    Start the container apps environment create task:

    * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
    * Type "container apps".
    * Select the task **Azure Container Apps: Create Container Apps Environment**

    Alternatively, you can open the Azure extension and select **+** icon in the **Resources** section. 

    Follow the prompts to create the container app environment:

    * If you're prompted, select your subscription.
    * **Enter a container apps environment name**: Enter "python-container-env".
    * **Select a location for new resources**: Choose the same location that resource group you created previously.

    It takes several minutes to create the environment. A notification shows the progress of the operation. Look for "Successfully created new Container Apps environment" before going to the next step. The environment is created in a resource group of the same name "python-container-env".

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-container-app-02.gif" alt-text="Screenshot showing how to create an environment for Azure Container Apps in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-container-app-02.gif":::

1. After the environment is created, create a container app in it. by finding the **Azure Container Apps: Create Container App** task in the command palette.

    Start the container app create task:

    * Select **F1** or **CTRL+SHIFT+P** to open the command palette.
    * Type "container apps".
    * Select the task **Azure Container Apps: Create Container App**

    Alternatively, you can go to the Azure extension, Container Apps section, select the environment, right-click, and select **Create Container App** to start the create container app task.

    Follow the prompts to create the container app:

    * **Select subscription**: Select the subscription you're using for this tutorial.
    * **Select a container apps environment**: Select the environment created in the previous step.
    * **Enter a container app name**: Enter *python-container-app*.
    * **Select an image source for the container app**: Select **Container Registry**.
    * **Select a container registry**: Select **Azure Container Registry**.
    * **Select an Azure Container Registry**: Select the name of the registry you created previously.
    * **Select a repository**: Select **pythoncontainer**.
    * **Select a tag**: Select **latest**.
    * **Select a .env file to set the environment variables for the container instance**: Select the *.env* file you created in step two.
    * **Enable ingress for applications that need an HTTP endpoint**: Select **Enable**.
    * **Select the HTTP traffic that the endpoint will accept**: Select **External**.
    * **Port the container is listening on**: Set to 8000 (Django) or 5000 (Flask).

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-container-app-03.gif" alt-text="Screenshot showing how to create an Azure Container app in an environment in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-container-app-03.gif":::

    A notification shows the progress of the operation. Look for "Successfully created new Container App environment" before going to the next step. The container app is created in the same resource group as the container app environment "python-container-env".

1. After the container app is created, configure the user-assigned managed identity on it.

    * Open a terminal in VS Code and enter the following Azure CLI commands. You can also enter the commands from Azure Cloud Shell.

    * Get the resource ID of the managed identity.

        ```azurecli
        az identity show --name my-ua-managed-id --resource-group pythoncontainer-rg --query id -o tsv
        ```

        The resource ID has the following form: */subscriptions/\<subscription ID>/resourcegroups/pythoncontainer-rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/my-ua-managed-id*

    * Assign the managed identity to the container app with the [az containerapp identity assign](/cli/azure/containerapp/identity#az-containerapp-identity-assign) command.

        ```azurecli
        az containerapp identity assign  \
            --name python-container-app \
            --resource-group container-app-environment  \
            --user-assigned <managed-identity-resource-id>      
        ```

        Replace the `<managed-identity-resource-id>` placeholder with the resource ID output by the previous command.

        The resource group in this commmand is the same resource group that the container apps environment and container app were created in, *python-container-app*.

1. For Django only, migrate and create database schema. (In the Flask sample app, it's done automatically, and you can skip this step.)

    * Go to the **Azure** extension, expand the **Container Apps** section, find and expand your container environment, and right-click the container app you created and select **Open Console in Portal**.
    * Choose a startup command and select **Connect**.
    * At the shell prompt, type `python manage.py migrate`.

    You don't need to migrate for revisions of the container.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-container-app-11.png" alt-text="Screenshot showing how to connect to an Azure Container Apps container in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-container-app-11.png":::

1. Test the website.

    After the create container task completes, you'll see a notification with a **Browse** button to go to the website.

    :::image type="content" source="media/tutorial-container-apps/visual-studio-code-create-container-app-04.png" alt-text="Screenshot showing how to browse to an Azure Container app after it's created in Visual Studio Code." lightbox="media/tutorial-container-apps/visual-studio-code-create-container-app-04.png":::

    If you miss the notification, go to the **Azure** extension, expand the **Container Apps** section, find and expand your container environment, and right-click the container app and select **Browse**. You can also enter the **Azure Container Apps: Browse** task in the command palette and follow the prompts.

### [Azure portal](#tab/azure-portal)

1. Get the client ID for the user-assigned managed identity. You use it in a later step.

    1. In the [Azure portal](https://portal.azure.com), search for **my-ua-managed-id** and select it under **Resources** in the results.
    1. Select **Overview** on the **service menu** and note down the **Client ID** value.

1. Open Azure Cloud Shell and enter the following command to get a secret key value.

    ```python
    python -c 'import secrets; print(secrets.token_hex())'
    ```

    You use the secret key value to set an environment variable in a later step.

1. In the portal, search for **container apps**. Under **Marketplace** in the results, select **Container App**.

1. On the **Basics** tab, enter the following values:

    * **Resource group**: Use the group created previously that contains the Azure Container Registry.
    * **Container app name**: *python-container-app*.
    * **Region**: Use the same region/location as the resource group.
    * **Container Apps Environment**: Select **Create new** to create a new environment named *python-container-env*.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-containerapp-basics-tab.png" alt-text="Screenshot showing how to configure basic settings for an Azure Container Apps service in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-containerapp-basics-tab.png":::

    Select **Next: Container** to continue configuration.

1. On the **Container** tab, continue configuring the container app.

    * **Use quickstart image**: Unselect checkbox.
    * **Name**: *python-container-app*.
    * **Image Source**: Select *Azure Container Registry*.
    * **Registry**: Select the name of registry you created earlier.
    * **Image name**: Select *pythoncontainer* (the name of the image you built).
    * **Image tag**: Select *latest*.
    * **HTTP Ingress**:  Select checkbox (enabled).
    * **Ingress traffic**: Select **Accepting traffic from anywhere**.
    * **Target port**: Set to 8000 for Django or 5000 for Flask.

    Under **Environment variables**, enter values for the following variables:

    * DBHOST="\<postgres-server-name>"
    * DBNAME="restaurants_reviews"
    * DBUSER="my-ua-managed-id"
    * RUNNING_IN_PRODUCTION="1"
    * AZURE_CLIENT_ID="\<managed-identity-client-id>"
    * AZURE_SECRET_KEY="\<your-secret-key>"

    For `AZURE_CLIENT_ID`, use the client ID you copied for the user-assigned managed identity.

    For `AZURE_SECRET_KEY`, use the secret key value you generated in a previous step.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-containerapp-container-tab.png" alt-text="Screenshot showing how to the configure container settings for an Azure Container Apps service in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-containerapp-container-tab.png":::

    Select **Next: Ingress** to continue.

1. Under the **Ingress** tab, continue configuring the container app.

    * **Ingress**:  Select checkbox (enabled).
    * **Ingress traffic**: Select **Accepting traffic from anywhere**.
    * **Target port**: Set to 8000 for Django or 5000 for Flask.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-containerapp-ingress-tab.png" alt-text="Screenshot showing how to the configure ingress settings for an Azure Container Apps service in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-containerapp-ingress-tab.png":::

    Select **Review and create** to go to review page. After reviewing the settings, select **Create** to kick off deployment.

1. After the deployment finishes, select **Go to resource**.

1. Add the user-assigned managed identity to the container app.

    1. Under **Settings** on the **service menu**, select **Identity**, then select the **User assigned** tab.
    1. Under the **User assigned** tab, select **Add**.
    1. On the **Add user assigned managed identity** page, select **my-ua-managed-identity** then select **Add**.
    1. When the operation completes, you're returned to the **User assigned** tab. Verify that **my-ua-managed-id** appears in the list of identities.

    > [!TIP]
    > Instead of defining environment variables as shown above, you can use [Service Connector][9]. Service Connector helps you connect to Azure compute services to other backing services by configuring connection information and generating and storing environment variables for you. If you use a service connector, make sure you synchronize the environment variables in the sample code to the environment variables created with Service Connector.

1. Django only, migrate and create database schema. (In the Flask sample app, it's done automatically, and you can skip this step.)

    1. Under **Monitoring** on the **service menu**, select **Console**.
    1. Choose a startup command and select **Connect**.
    1. At the shell prompt, type `python manage.py migrate`.

    You don't need to migrate for revisions of the container.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-container-app-11.png" alt-text="Screenshot showing how to connect to an Azure Container Apps container in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-container-app-11.png":::

1. Test the website.

    1. Select **Overview** on the **service menu**.
    1. Under **Essentials**, select **Application Url** to open the website in a browser.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-create-container-app-10.png" alt-text="Screenshot showing how to find the website Url of an Azure Container Apps container in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-create-container-app-10.png":::

---

Here's an example of the sample website after adding a restaurant and two reviews.

:::image type="content" source="media/tutorial-container-apps/final-website-example-400px.png" alt-text="Screenshot showing an example of the sample website built in this tutorial." lightbox="media/tutorial-container-apps/final-website-example.png":::

## Troubleshoot deployment

* You forgot the Application Url to access the website.
  * In the Azure portal, go to the **Overview** page of the Container App and look for the **Application Url**.
  * In VS Code, go to the **Azure view** (Ctrl+Shift+A) and expand the subscription that you're working in. Expand the **Container Apps** node, then expand the managed environment and right-click **python-container-app** and select **Browse**. It opens the browser with the **Application Url**.
  * With Azure CLI, use the command `az containerapp show -g pythoncontainer-rg -n python-container-app --query properties.configuration.ingress.fqdn`.

* In VS Code, the **Build Image in Azure** task returns an error.
  * If you see the message "Error: failed to download context. Please check if the URL is incorrect." in the VS Code **Output** window, then refresh the registry in the Docker extension. To refresh, select the Docker extension, go to the Registries section, find the registry, and select it.
  * If you run the **Build Image in Azure** task again, check to see if your registry from a previous run exists and if so, use it.

* In the Azure portal during the creation of a Container App, you see an access error that contains "Cannot access ACR '\<name>.azurecr.io'".
  * This error occurs when admin credentials on the ACR are disabled. To check admin status in the portal, go to your Azure Container Registry, select the **Access keys** resource, and ensure that **Admin user** is enabled.

* Your container image doesn't appear in the Azure Container Registry.
  * Check the output of the Azure CLI command or VS Code Output and look for messages to confirm success.
  * Check that the name of the registry was specified correctly in your build command with the Azure CLI or in the VS Code task prompts.
  * Make sure your credentials aren't expired. For example, in VS Code, find the target registry in the Docker extension and refresh. In Azure CLI, run `az login`.

* Website returns "Bad Request (400)".
  * Check the PostgreSQL environment variables passed in to the container. The 400 error often indicates that the Python code can't connect to the PostgreSQL instance.
  * The sample code used in this tutorial checks for the existence of  the container environment variable `RUNNING_IN_PRODUCTION`, which can be set to any value like "1".

* Website returns "Not Found (404)".
  * Check the **Application Url** on the **Overview** page for the container. If the Application Url contains the word "internal", then ingress isn't set correctly.
  * Check the ingress of the container. For example, in Azure portal, go to the **Ingress** resource of the container and make sure **HTTP Ingress** is enabled and **Accepting traffic from anywhere** is selected.

* Website doesn't start, you see "stream timeout", or nothing is returned.
  * Check the logs.
    * In the Azure portal, go to the Container App's Revision management resource and check the **Provision Status** of the container.
      * If "Provisioning", then wait until provisioning has completed.
      * If "Failed", then select the revision and view the console logs. Choose the order of the columns to show "Time Generated", "Stream_s", and "Log_s". Sort the logs by most-recent first and look for Python *stderr* and *stdout* messages in the "Stream_s" column. Python 'print' output will be *stdout* messages.
    * With the Azure CLI, use the [az containerapp logs show][32] command.
  * If using the Django framework, check to see if the *restaurants_reviews* tables exist in the database. If not, use a console to access the container and run `python manage.py migrate`.

## Next step

> [!div class="nextstepaction"]
> [Configure continuous deployment](tutorial-deploy-python-web-app-azure-container-apps-03.md)

[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-apps
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-apps
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
[15]: https://www.postgresql.org/docs/13/app-psql.html
[16]: /cli/azure/postgres/flexible-server#az-postgres-flexible-server-connect
[17]: /cli/azure/group#az-group-create
[18]: /cli/azure/acr#az-acr-create
[19]: /cli/azure/acr#az-acr-login
[20]: /cli/azure/acr/repository#az-acr-repository-list
[21]: https://git-scm.com/docs/git-clone
[22]: /cli/azure/postgres/flexible-server#az-postgres-flexible-server-create
[23]: https://www.whatsmyip.org/
[24]: https://azure.microsoft.com/pricing/details/postgresql/flexible-server/
[25]: https://techcommunity.microsoft.com/t5/itops-talk-blog/how-to-use-cloud-shell-in-visual-studio-code/ba-p/663431
[26]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb
[27]: /cli/azure/postgres/flexible-server/db#az-postgres-flexible-server-db-create
[28]: /cli/azure/postgres/flexible-server/firewall-rule#az-postgres-flexible-server-firewall-rule-create
[29]: /cli/azure/acr#az-acr-update
[30]: /azure/container-apps/environment
[31]: /azure/container-apps/revisions
[32]: /cli/azure/containerapp/logs#az-containerapp-logs-show
[33]: /cli/azure/containerapp#az-containerapp-exec
