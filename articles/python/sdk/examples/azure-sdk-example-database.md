---
title: Create an Azure Database for MySQL - Flexible Server instance and database using the Azure SDK libraries
description: Use the management libraries in the Azure SDK libraries for Python to create an Azure Database for MySQL or Azure Database for PostgreSQL database.
ms.date: 05/21/2025
ms.topic: how-to
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to create a database

This example demonstrates how to use the Azure SDK for Python management libraries to programmatically create an Azure Database for MySQL flexible server and a corresponding database. It also includes a basic script that uses the mysql-connector-python library (not part of the Azure SDK) to connect to and query the database.

You can adapt this example to create an Azure Database for PostgreSQL flexible server by modifying the relevant SDK imports and API calls.

If you prefer to use the Azure CLI, [Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are provided later in this article. For a graphical experience, refer to the Azure portal documentation:

* [Create a MySQL server](/azure/mysql/flexible-server/quickstart-create-server-portal)
* [Create a PostgreSQL server](/azure/postgresql/flexible-server/quickstart-create-server-portal)

Unless otherwise specified, all examples and commands work consistently across Linux/macOS bash and Windows command shells.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run the code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2: Install the needed Azure library packages

In this step, you install the Azure SDK libraries needed to create the database.

1. In your console, create a *requirements.txt* file that lists the management libraries used in this example:

    ```azurecli
    azure-mgmt-resource
    azure-mgmt-rdbms
    azure-identity
    mysql-connector-python
    ```

    > [!NOTE]
    > The `mysql-connector-python` library isn't part of the Azure SDK. It's a third-party library that you can use to connect to MySQL databases. You can also use other libraries, such as `PyMySQL` or `SQLAlchemy`, to connect to MySQL databases.

1. In your console with the virtual environment activated, install the requirements:

    ```console
    pip install -r requirements.txt
    ```

    > [!NOTE]
    > On Windows, attempting to install the mysql library into a 32-bit Python library produces an error about the *mysql.h* file. In this case, install a 64-bit version of Python and try again.

## 3. Set environment variables

In this step, you set environment variables for use in the code in this article. The code uses the `os.environ` method to retrieve the values.

# [Bash](#tab/bash)

```azurecli
#!/bin/bash
export AZURE_RESOURCE_GROUP_NAME=<ResourceGroupName> # Change to your preferred resource group name
export LOCATION=<Location> # Change to your preferred region
export AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
export PUBLIC_IP_ADDRESS=$(curl -s https://api.ipify.org)
export DB_SERVER_NAME=<DB_Server_Name> # Change to your preferred DB server name
export DB_ADMIN_NAME=<DB_Admin_Name> # Change to your preferred admin name
export DB_ADMIN_PASSWORD=<DB_Admin_Passwrod> # Change to your preferred admin password
export DB_NAME=<DB_Name> # Change to your preferred database name
export DB_PORT=3306
export version=ServerVersion.EIGHT0_21

```

# [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
$random = Get-Random -Maximum 10000
$env:AZURE_RESOURCE_GROUP_NAME = <ResourceGroupName> # Change to your preferred resource group name
$env:LOCATION = <Location> # Change to your preferred region
$env:AZURE_SUBSCRIPTION_ID = $(az account show --query id --output tsv)
$env:PUBLIC_IP_ADDRESS = (Invoke-RestMethod -Uri "https://api.ipify.org")
$env:DB_SERVER_NAME = <DB_Server_Name> # Change to your preferred DB server name
$env:DB_ADMIN_NAME = <DB_Admin_Name> # Change to your preferred admin name
$env:DB_ADMIN_PASSWORD = <DB_Admin_Password> # Change to your preferred admin password
$env:DB_NAME = <DB_Name> # Change to your preferred database name
$env:DB_PORT = 3306
$env:version = "ServerVersion.EIGHT0_21"
```

---

## 4: Write code to create and configure a MySQL Flexible Server with a database

In this step, you create a Python file named *provision_blob.py* with the following code. This Python script uses the Azure SDK for Python management libraries to create a resource group, a MySQL flexible server, and a database on that server.

```Python
import random, os
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.rdbms.mysql_flexibleservers import MySQLManagementClient
from azure.mgmt.rdbms.mysql_flexibleservers.models import Server, ServerVersion

# Acquire a credential object using CLI-based authentication.
credential = DefaultAzureCredential()

# Retrieve subscription ID from environment variable
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]

# Retrieve resource group name and location from environment variables
RESOURCE_GROUP_NAME = os.environ["AZURE_RESOURCE_GROUP_NAME"]
LOCATION = os.environ["LOCATION"]

# Step 1: Provision the resource group.
resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.create_or_update(RESOURCE_GROUP_NAME,
    { "location": LOCATION })

print(f"Provisioned resource group {rg_result.name}")

# For details on the previous code, see Example: Provision a resource group
# at https://docs.microsoft.com/azure/developer/python/azure-sdk-example-resource-group


# Step 2: Provision the database server

# Retrieve server name, admin name, and admin password from environment variables

db_server_name = os.environ.get("DB_SERVER_NAME")
db_admin_name = os.environ.get("DB_ADMIN_NAME")
db_admin_password = os.environ.get("DB_ADMIN_PASSWORD")

# Obtain the management client object
mysql_client = MySQLManagementClient(credential, subscription_id)

# Provision the server and wait for the result
server_version = os.environ.get("DB_SERVER_VERSION") 

poller = mysql_client.servers.begin_create(RESOURCE_GROUP_NAME,
    db_server_name, 
    Server(
        location=LOCATION,
        administrator_login=db_admin_name,
        administrator_login_password=db_admin_password,
        version=ServerVersion[server_version]  # Note: dictionary-style enum access
    )
)

server = poller.result()

print(f"Provisioned MySQL server {server.name}")

# Step 3: Provision a firewall rule to allow the local workstation to connect

RULE_NAME = "allow_ip"
ip_address = os.environ["PUBLIC_IP_ADDRESS"]

# Provision the rule and wait for completion
poller = mysql_client.firewall_rules.begin_create_or_update(RESOURCE_GROUP_NAME,
    db_server_name, RULE_NAME, 
    { "start_ip_address": ip_address, "end_ip_address": ip_address }  
)

firewall_rule = poller.result()

print(f"Provisioned firewall rule {firewall_rule.name}")


# Step 4: Provision a database on the server

db_name = os.environ.get("DB_NAME", "example-db1")
 
poller = mysql_client.databases.begin_create_or_update(RESOURCE_GROUP_NAME,
    db_server_name, db_name, {})

db_result = poller.result()

print(f"Provisioned MySQL database {db_result.name} with ID {db_result.id}")
```

### Authentication in the code

Later in this article, you sign in to Azure using the Azure CLI to execute the sample code. If your account has sufficient permissions to create resource groups and storage resources in your Azure subscription, the script should run successfully without additional configuration.

For use in production environments, we recommend that you authenticate with a service principal by setting the appropriate environment variables. This approach enables secure, non-interactive access suitable for automation. For setup instructions, see [How to authenticate Python apps with Azure services](../authentication-overview.md).

Ensure the service principal is assigned a role with adequate permissions—such as the Contributor role at the subscription or resource group level. For details on assigning roles, refer to [Role-based access control (RBAC) in Azure](/azure/role-based-access-control/overview).

### Reference links for classes used in the code

* [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
* [MySQLManagementClient (azure.mgmt.rdbms.mysql_flexibleservers)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.mysqlmanagementclient)
* [Server (azure.mgmt.rdbms.mysql_flexibleservers.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.models.server)
* [ServerVersion (azure.mgmt.rdbms.mysql_flexibleservers.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.models.serverversion)

For PostreSQL database server, see:

* [PostgreSQLManagementClient (azure.mgmt.rdbms.postgresql_flexibleservers)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.postgresql_flexibleservers.postgresqlmanagementclient)

## 5: Run the script

1. If you haven't already, sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Run the script:

    ```console
    python provision_db.py
    ```

    The script takes a minute or two to complete.

## 6: Insert a record and query the database

In this step, you create a table in the database and insert a record. You can use the mysql-connector library to connect to the database and run SQL commands.

1. Create a file named *use_db.py* with the following code.

    This code works only for MySQL; you use different libraries for PostgreSQL.

    ```Python
    import os
    import mysql.connector
    
    db_server_name = os.environ["DB_SERVER_NAME"]
    db_admin_name = os.getenv("DB_ADMIN_NAME")
    db_admin_password = os.getenv("DB_ADMIN_PASSWORD")
    
    db_name = os.getenv("DB_NAME")
    db_port = os.getenv("DB_PORT")
    
    connection = mysql.connector.connect(user=db_admin_name,
        password=db_admin_password, host=f"{db_server_name}.mysql.database.azure.com",
        port=db_port, database=db_name, ssl_ca='./BaltimoreCyberTrustRoot.crt.pem')
    
    cursor = connection.cursor()
    
    """
    # Alternate pyodbc connection; include pyodbc in requirements.txt
    import pyodbc
    
    driver = "{MySQL ODBC 5.3 UNICODE Driver}"
    
    connect_string = f"DRIVER={driver};PORT=3306;SERVER={db_server_name}.mysql.database.azure.com;" \
                     f"DATABASE={DB_NAME};UID={db_admin_name};PWD={db_admin_password}"
    
    connection = pyodbc.connect(connect_string)
    """
    
    table_name = "ExampleTable1"
    
    sql_create = f"CREATE TABLE {table_name} (name varchar(255), code int)"
    
    cursor.execute(sql_create)
    print(f"Successfully created table {table_name}")
    
    sql_insert = f"INSERT INTO {table_name} (name, code) VALUES ('Azure', 1)"
    insert_data = "('Azure', 1)"
    
    cursor.execute(sql_insert)
    print("Successfully inserted data into table")
    
    sql_select_values= f"SELECT * FROM {table_name}"
    
    cursor.execute(sql_select_values)
    row = cursor.fetchone()
    
    while row:
        print(str(row[0]) + " " + str(row[1]))
        row = cursor.fetchone()
    
    connection.commit()
    ```

    All of this code uses the mysql.connector API. The only Azure-specific part is the full host domain for MySQL server (mysql.database.azure.com).

1. Next, download the certificate needed to communicate over TSL/SSL with your Azure Database for MySQL server. For more information, see [Obtain an SSL Certificate](/azure/mysql/howto-configure-ssl#step-1-obtain-ssl-certificate) in the Azure Database for MySQL documentation.

    # [Bash](#tab/bash)

    ```azurecli
    #!/bin/bash
    # Download Baltimore CyberTrust Root certificate required for Azure MySQL SSL connections
    CERT_URL="https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem"
    CERT_FILE="BaltimoreCyberTrustRoot.crt.pem"
    echo "Downloading SSL certificate..."
    curl -o "$CERT_FILE" "$CERT_URL"
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli
    # PowerShell syntax
    # Download Baltimore CyberTrust Root certificate required for Azure MySQL SSL connections
    $CERT_URL="https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem"
    $CERT_FILE="BaltimoreCyberTrustRoot.crt.pem"
    echo "Downloading SSL certificate..."
    Invoke-WebRequest -Uri $CERT_URL -OutFile $CERT_FILE
    ```

    ---

1. Finally, run the code:

    ```console
    python use_db.py
    ```

If you see an error that your client IP address isn't allowed, check that you defined the environment variable `PUBLIC_IP_ADDRESS` correctly. If you already created the MySQL server with the wrong IP address, you can add another in the [Azure portal](https://portal.azure.com/). In the portal, select the MySQL server, and then select **Connection security**. Add the IP address of your workstation to the list of allowed IP addresses.

## 7: Clean up resources

 Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group and storage resources created in this example.

Resource groups don't incur any ongoing charges in your subscription, but resources, like storage accounts, in the resource group might continue to incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

# [Bash](#tab/bash)

```azurecli
#!/bin/bash
az group delete -n $AZURE_RESOURCE_GROUP_NAME --no-wait
```

# [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
az group delete -n $env:AZURE_RESOURCE_GROUP_NAME --no-wait
```

---

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script. For a PostgreSQL database, use [`az postgres flexible-server`](/cli/azure/postgres/flexible-server) commands.

# [Bash](#tab/bash)

```azurecli
#!/bin/bash
#!/bin/bash

# Set variables
export LOCATION=<Location> # Change to your preferred region
export AZURE_RESOURCE_GROUP_NAME=<ResourceGroupName> # Change to your preferred resource group name
export DB_SERVER_NAME=<DB_Server_Name> # Change to your preferred DB server name
export DB_ADMIN_NAME=<DB_Admin_Name> # Change to your preferred admin name
export DB_ADMIN_PASSWORD=<DB_Admin_Password> # Change to your preferred admin password
export DB_NAME=<DB_Name> # Change to your preferred database name
export DB_SERVER_VERSION="5.7"

# Get public IP address
export PUBLIC_IP_ADDRESS=$(curl -s https://api.ipify.org)

# Provision the resource group
echo "Creating resource group: $AZURE_RESOURCE_GROUP_NAME"
az group create \
    --location "$LOCATION" \
    --name "$AZURE_RESOURCE_GROUP_NAME"

# Provision the MySQL Flexible Server
echo "Creating MySQL Flexible Server: $DB_SERVER_NAME"
az mysql flexible-server create \
    --location "$LOCATION" \
    --resource-group "$AZURE_RESOURCE_GROUP_NAME" \
    --name "$DB_SERVER_NAME" \
    --admin-user "$DB_ADMIN_NAME" \
    --admin-password "$DB_ADMIN_PASSWORD" \
    --sku-name Standard_B1ms \
    --version "$DB_SERVER_VERSION" \
    --yes

# Provision a firewall rule to allow access from the public IP address
echo "Creating firewall rule for public IP: $PUBLIC_IP_ADDRESS"
az mysql flexible-server firewall-rule create \
    --resource-group "$AZURE_RESOURCE_GROUP_NAME" \
    --name "$DB_SERVER_NAME" \
    --rule-name allow_ip \
    --start-ip-address "$PUBLIC_IP_ADDRESS" \
    --end-ip-address "$PUBLIC_IP_ADDRESS"

# Provision the database
echo "Creating database: $DB_NAME"
az mysql flexible-server db create \
    --resource-group "$AZURE_RESOURCE_GROUP_NAME" \
    --server-name "$DB_SERVER_NAME" \
    --database-name "$DB_NAME"

echo "MySQL Flexible Server and database created successfully."

```

# [PowerShell](#tab/powershell)

```azurecli
# PowerShell syntax
# Define variables
$env:LOCATION = <Location> # Change to your preferred region
$env:AZURE_RESOURCE_GROUP_NAME = <ResourceGroupName> # Change to your preferred resource group name
$env:DB_SERVER_NAME = <DB_Server_Name> # Change to your preferred DB server name
$env:DB_ADMIN_NAME = <DB_Admin_Name> # Change to your preferred admin name
$env:DB_ADMIN_PASSWORD = <DB_Admin_Password> # Change to your preferred admin password
$env:DB_NAME = <DB_Name> # Change to your preferred database name
$env:DB_SERVER_VERSION = "5.7"

# Get your public IP
$env:PUBLIC_IP_ADDRESS = (Invoke-RestMethod -Uri "https://api.ipify.org")

# Create resource group
az group create `
    --location $env:LOCATION `
    --name $env:AZURE_RESOURCE_GROUP_NAME

# Create MySQL Flexible Server
az mysql flexible-server create `
    --location $env:LOCATION `
    --resource-group $env:AZURE_RESOURCE_GROUP_NAME `
    --name $env:DB_SERVER_NAME `
    --admin-user $env:DB_ADMIN_NAME `
    --admin-password $env:DB_ADMIN_PASSWORD `
    --sku-name Standard_B1ms `
    --version $env:DB_SERVER_VERSION `
    --yes

# Create firewall rule to allow your current IP
az mysql flexible-server firewall-rule create `
    --resource-group $env:AZURE_RESOURCE_GROUP_NAME `
    --name $env:DB_SERVER_NAME `
    --rule-name allow_ip `
    --start-ip-address $env:PUBLIC_IP_ADDRESS `
    --end-ip-address $env:PUBLIC_IP_ADDRESS

# Create database
az mysql flexible-server db create `
    --resource-group $env:AZURE_RESOURCE_GROUP_NAME `
    --server-name $env:DB_SERVER_NAME `
    --database-name $env:DB_NAME

```

---

## See also

* [Example: Create a resource group](azure-sdk-example-resource-group.md)
* [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
* [Example: Create Azure Storage](azure-sdk-example-storage.md)
* [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
* [Example: Create and deploy a web app](azure-sdk-example-web-app.md)
* [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
* [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
* [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
