---
title: Create an Azure MySQL database using the Azure SDK libraries
description: Use the management libraries in the Azure SDK libraries for Python to create an Azure MySQL, PostgreSQL, or MariaDB database.
ms.date: 02/27/2023
ms.topic: conceptual
ms.custom: devx-track-python, py-fresh-zinc
---

# Example: Use the Azure libraries to create a database

This example demonstrates how to use the Azure SDK management libraries in a Python script to create an Azure MySQL database. It also provides a simple script to query the database using the mysql-connector library (not part of the Azure SDK). You can use similar code to create a PostgreSQL or MariaDB database.

[Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are at later in this article. If you prefer to use the Azure portal, see [Create a PostgreSQL server](/azure/postgresql/quickstart-create-server-database-portal) or [Create a MariaDB server](/azure/mariadb/quickstart-create-mariadb-server-database-using-azure-portal).

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](../../configure-local-development-environment.md).

Be sure to create and activate a virtual environment for this project.

## 2: Install the needed Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="txt" source="~/../python-sdk-docs-examples/db/requirements.txt":::

In a terminal with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

> [!NOTE]
> On Windows, attempting to install the mysql library into a 32-bit Python library produces an error about the *mysql.h* file. In this case, install a 64-bit version of Python and try again.

## 3: Write code to create the database

Create a Python file named *provision_db.py* with the following code. The comments explain the details. In particular, specify environment variables for `AZURE_SUBSCRIPTION_ID` and `PUBLIC_IP_ADDRESS`. The latter variable is your workstation's IP address for this sample to run. You can use [WhatsIsMyIP](https://www.whatsmyip.org/) to find your IP address.

:::code language="python" source="~/../python-sdk-docs-examples/db/provision_db.py":::

[!INCLUDE [cli-auth-note](../../includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
- [MySQLManagementClient (azure.mgmt.rdbms.mysql)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.mysqlmanagementclient)
- [ServerForCreate (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverforcreate)
- [ServerPropertiesForDefaultCreate (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverpropertiesfordefaultcreate)
- [ServerVersion (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverversion)

For other database types, see:

- [PostgreSQLManagementClient (azure.mgmt.rdbms.postgresql)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.postgresql.postgresqlmanagementclient)
- [MariaDBManagementClient (azure.mgmt.rdbms.mariadb)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mariadb.mariadbmanagementclient)

## 4: Run the script

```cmd
python provision_db.py
```

## 5: Insert a record and query the database

Create a file named *use_db.py* with the following code. Note the dependencies on the `DB_SERVER_NAME`, `DB_ADMIN_NAME`, and `DB_ADMIN_PASSWORD` environment variables. You get these values from the output of running the previous code *provision_db.py* or in the code itself.

This code works only for MySQL; you use different libraries for PostgreSQL and MariaDB.

:::code language="python" source="~/../python-sdk-docs-examples/db/use_db.py":::

All of this code uses the mysql.connector API. The only Azure-specific part is the full host domain for MySQL server (mysql.database.azure.com).

Next, Download the certificate needed to communicate over TSL/SSL with your Azure Database for MySQL server from https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem and save the certificate file to the same folder as the Python file. For more information, see [Obtain an SSL Certificate](/azure/mysql/howto-configure-ssl#step-1-obtain-ssl-certificate) in the Azure Database for MySQL documentation.

Finally, run the code:

```cmd
python use_db.py
```

If you see an error that your client IP address isn't allowed, check that you defined the environment variable `PUBLIC_IP_ADDRESS` correctly. If you already created the MySQL server with the wrong IP address, you can add another in the [Azure portal](https://portal.azure.com/). In the portal, select the MySQL server, and then select **Connection security**. Add the IP address of your workstation to the list of allowed IP addresses.

## 6: Clean up resources

```azurecli
az group delete -n PythonAzureExample-DB-rg  --no-wait
```

Run the [az group delete](/cli/azure/group#az-group-delete) command if you don't need to keep the resource group (and resources in it) created in this example. The `--no-wait` argument allows the command to return immediately instead of waiting for the operation to finish.

Run this command if you don't need to keep the resources provisioned in this example and would like to avoid ongoing charges in your subscription.

[!INCLUDE [resource_group_begin_delete](../../includes/resource-group-begin-delete.md)]

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script. For a PostgreSQL database, use [`az postgres`](/cli/azure/postgres) commands; for MariaDB, use [`az mariadb`](/cli/azure/mariadb) commands.

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
