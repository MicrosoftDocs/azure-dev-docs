---
title: Create an Azure Database for MySQL - Flexible Server instance and database using the Azure SDK libraries
description: Use the management libraries in the Azure SDK libraries for Python to create an Azure Database for MySQL or Azure Database for PostgreSQL database.
ms.date: 05/21/2025
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to create a database

This example demonstrates how to use the Azure SDK management libraries in a Python script to create an Azure Database for MySQL flexible server instance and database. It also provides a simple script to query the database using the mysql-connector library (not part of the Azure SDK). You can use similar code to create an Azure Database for PostgreSQL flexible server instance and database.

[Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are at later in this article. If you prefer to use the Azure portal, see [Create a MySQL server](/azure/mysql/flexible-server/quickstart-create-server-portal) or [Create a PostgreSQL server](/azure/postgresql/flexible-server/quickstart-create-server-portal).

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, set up an environment where you can run the code. Here are some options:

[!INCLUDE [create_environment_options](../../includes/create-environment-options.md)]

## 2: Install the needed Azure library packages

1. In your console, create a *requirements.txt* file that lists the management libraries used in this example:

    ```console
    azure-mgmt-resource
    azure-mgmt-rdbms
    azure-identity
    mysql-connector-python
    ```

    > [!NOTE]
    > The `mysql-connector-python` library is not part of the Azure SDK. It is a third-party library that you can use to connect to MySQL databases. You can also use other libraries, such as `PyMySQL` or `SQLAlchemy`, to connect to MySQL databases.

1. In your console with the virtual environment activated, install the requirements:

    ```console
    pip install -r requirements.txt
    ```

> [!NOTE]
> On Windows, attempting to install the mysql library into a 32-bit Python library produces an error about the *mysql.h* file. In this case, install a 64-bit version of Python and try again.

## 3: Write code to create the database

Create a Python file named *provision_db.py* with the following code. The comments explain the details. In particular, specify environment variables for `AZURE_SUBSCRIPTION_ID` and `PUBLIC_IP_ADDRESS`. The latter variable is your workstation's IP address for this sample to run. You can use [WhatsIsMyIP](https://www.whatsmyip.org/) to find your IP address.

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

# Constants we need in multiple places: the resource group name and the region
# in which we provision resources. You can change these values however you want.
RESOURCE_GROUP_NAME = 'PythonAzureExample-DB-rg'
LOCATION = "southcentralus"

# Step 1: Provision the resource group.
resource_client = ResourceManagementClient(credential, subscription_id)

rg_result = resource_client.resource_groups.create_or_update(RESOURCE_GROUP_NAME,
    { "location": LOCATION })

print(f"Provisioned resource group {rg_result.name}")

# For details on the previous code, see Example: Provision a resource group
# at https://docs.microsoft.com/azure/developer/python/azure-sdk-example-resource-group


# Step 2: Provision the database server

# We use a random number to create a reasonably unique database server name.
# If you've already provisioned a database and need to re-run the script, set
# the DB_SERVER_NAME environment variable to that name instead.
#
# Also set DB_USER_NAME and DB_USER_PASSWORD variables to avoid using the defaults.

db_server_name = os.environ.get("DB_SERVER_NAME", f"python-azure-example-mysql-{random.randint(1,100000):05}")
db_admin_name = os.environ.get("DB_ADMIN_NAME", "azureuser")
db_admin_password = os.environ.get("DB_ADMIN_PASSWORD", "ChangePa$$w0rd24")

# Obtain the management client object
mysql_client = MySQLManagementClient(credential, subscription_id)

# Provision the server and wait for the result
poller = mysql_client.servers.begin_create(RESOURCE_GROUP_NAME,
    db_server_name, 
    Server(
        location=LOCATION,
        administrator_login=db_admin_name,
        administrator_login_password=db_admin_password,
        version=ServerVersion.FIVE7
    )
)

server = poller.result()

print(f"Provisioned MySQL server {server.name}")

# Step 3: Provision a firewall rule to allow the local workstation to connect

RULE_NAME = "allow_ip"
ip_address = os.environ["PUBLIC_IP_ADDRESS"]

# For the above code, create an environment variable named PUBLIC_IP_ADDRESS that
# contains your workstation's public IP address as reported by a site like
# https://whatismyipaddress.com/.

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

Later in this article, you sign in to Azure with the Azure CLI to run the sample code. If your account has permissions to create resource groups and storage resources in your Azure subscription, the code will run successfully.

To use such code in a production script, you can set environment variables to use a service principal-based method for authentication. To learn more, see [How to authenticate Python apps with Azure services](../authentication-overview.md). You need to ensure that the service principal has sufficient permissions to create resource groups and storage resources in your subscription by assigning it an appropriate [role in Azure](/azure/role-based-access-control/overview); for example, the *Contributor* role on your subscription.

### Reference links for classes used in the code

- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
- [MySQLManagementClient (azure.mgmt.rdbms.mysql_flexibleservers)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.mysqlmanagementclient)
- [Server (azure.mgmt.rdbms.mysql_flexibleservers.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.models.server)
- [ServerVersion (azure.mgmt.rdbms.mysql_flexibleservers.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql_flexibleservers.models.serverversion)

For PostreSQL database server, see:

- [PostgreSQLManagementClient (azure.mgmt.rdbms.postgresql_flexibleservers)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.postgresql_flexibleservers.postgresqlmanagementclient)

## 4: Run the script

1. If you haven't already, sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Set the `AZURE_SUBSCRIPTION_ID` and `PUBLIC_IP_ADDRESS` environment variables. You can run the [az account show](/cli/azure/account#az-account-show) command to get your subscription ID from the `id` property in the output. You can use [WhatsIsMyIP](https://www.whatsmyip.org/) to find your IP address.

    # [Bash](#tab/bash)

    ```console
    #!/bin/bash
    AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    export AZURE_SUBSCRIPTION_ID
    # Get your public IP address from https://www.whatsmyip.org/
    export PUBLIC_IP_ADDRESS=<Your public IP address>
    ```

    # [PowerShell](#tab/powershell)

    ```console
    # PowerShell syntax
    $AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    $env:AZURE_SUBSCRIPTION_ID = $AZURE_SUBSCRIPTION_ID
    $env:PUBLIC_IP_ADDRESS=<Your public IP address>
    ```

    ---

1. Optionally, set the `DB_SERVER_NAME`, `DB_ADMIN_NAME`, and `DB_ADMIN_PASSWORD`  environment variables; otherwise, code defaults are used.

1. Run the script:

    ```console
    python provision_db.py
    ```

## 5: Insert a record and query the database

Create a file named *use_db.py* with the following code. Note the dependencies on the `DB_SERVER_NAME`, `DB_ADMIN_NAME`, and `DB_ADMIN_PASSWORD` environment variables. You get these values from the output of running the previous code *provision_db.py* or in the code itself.

This code works only for MySQL; you use different libraries for PostgreSQL.

```Python
import os
import mysql.connector

db_server_name = os.environ["DB_SERVER_NAME"]
db_admin_name = os.getenv("DB_ADMIN_NAME", "azureuser")
db_admin_password = os.getenv("DB_ADMIN_PASSWORD", "ChangePa$$w0rd24")

db_name = os.getenv("DB_NAME", "example-db1")
db_port = os.getenv("DB_PORT", 3306)

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

Next, download the certificate needed to communicate over TSL/SSL with your Azure Database for MySQL server from https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem and save the certificate file to the same folder as the Python file. For more information, see [Obtain an SSL Certificate](/azure/mysql/howto-configure-ssl#step-1-obtain-ssl-certificate) in the Azure Database for MySQL documentation.

Finally, run the code:

```cmd
python use_db.py
```

If you see an error that your client IP address isn't allowed, check that you defined the environment variable `PUBLIC_IP_ADDRESS` correctly. If you already created the MySQL server with the wrong IP address, you can add another in the [Azure portal](https://portal.azure.com/). In the portal, select the MySQL server, and then select **Connection security**. Add the IP address of your workstation to the list of allowed IP addresses.

## 6: Clean up resources

 Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group and storage resources created in this example.

Resource groups don't incur any ongoing charges in your subscription, but resources, like storage accounts, in the resource group might continue to incur charges. It's a good practice to clean up any group that you aren't actively using. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

```azurecli
az group delete -n PythonAzureExample-DB-rg  --no-wait
```

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script. For a PostgreSQL database, use [`az postgres flexible-server`](/cli/azure/postgres/flexible-server) commands.

# [cmd](#tab/cmd)

:::code language="azurecli" source="~/../python-sdk-docs-examples/db/provision.cmd":::

# [bash](#tab/bash)

:::code language="azurecli" source="~/../python-sdk-docs-examples/db/provision.sh":::

---

## See also

- [Example: Create a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Create Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Create and deploy a web app](azure-sdk-example-web-app.md)
- [Example: Create a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
