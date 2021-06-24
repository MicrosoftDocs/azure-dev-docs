---
title: Provision an Azure MySQL database using the Azure SDK libraries
description: Use the management libraries in the Azure SDK libraries for Python to provision an Azure MySQL, PostgresSQL, or MariaDB database.
ms.date: 06/24/2021
ms.topic: conceptual
ms.custom: devx-track-python, devx-track-azurecli
---

# Example: Use the Azure libraries to provision a database

This example demonstrates how to use the Azure SDK management libraries in a Python script to provision an Azure MySQL database. It also provides a simple script to query the database using the mysql-connector library (not part of the Azure SDK). ([Equivalent Azure CLI commands](#for-reference-equivalent-azure-cli-commands) are given at later in this article. If you prefer to use the Azure portal, see [Create a PostgreSQL server](/azure/postgresql/quickstart-create-server-database-portal) or [Create a MariaDB server](/azure/mariadb/quickstart-create-mariadb-server-database-using-azure-portal).)

You can use similar code to provision a PostgreSQL or MariaDB database.

All the commands in this article work the same in Linux/macOS bash and Windows command shells unless noted.

## 1: Set up your local development environment

If you haven't already, **follow all the instructions** on [Configure your local Python dev environment for Azure](configure-local-development-environment.md).

Be sure to create a service principal for local development, and create and activate a virtual environment for this project.

## 2: Install the needed Azure library packages

Create a file named *requirements.txt* with the following contents:

:::code language="text" source="~/../python-sdk-examples/db/requirements.txt":::

The specific version requirement for azure-mgmt-resource is to ensure that you use a version compatible with the current version of azure-mgmt-web. These versions are not based on azure.core and therefore use older methods for authentication.

In a terminal or command prompt with the virtual environment activated, install the requirements:

```cmd
pip install -r requirements.txt
```

> [!NOTE]
> On Windows, attempting to install the mysql library into a 32-bit Python library produces an error about the *mysql.h* file. In this case, install a 64-bit version of Python and try again.

## 3: Write code to provision the database

Create a Python file named *provision_db.py* with the following code. The comments explain the details.

:::code language="python" source="~/../python-sdk-examples/db/provision_db.py":::

You must create an environment variable named `PUBLIC_IP_ADDRESS` with your workstation's IP address for this sample to run.

[!INCLUDE [cli-auth-note](includes/cli-auth-note.md)]

### Reference links for classes used in the code

- [ResourceManagementClient (azure.mgmt.resource)](/python/api/azure-mgmt-resource/azure.mgmt.resource.resourcemanagementclient)
- [MySQLManagementClient (azure.mgmt.rdbms.mysql)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.mysqlmanagementclient)
- [ServerForCreate (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverforcreate)
- [ServerPropertiesForDefaultCreate (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverpropertiesfordefaultcreate)
- [ServerVersion (azure.mgmt.rdbms.mysql.models)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mysql.models.serverversion)

Also see:
    - [PostgreSQLManagementClient (azure.mgmt.rdbms.postgresql)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.postgresql.postgresqlmanagementclient)
    - [MariaDBManagementClient (azure.mgmt.rdbms.mariadb)](/python/api/azure-mgmt-rdbms/azure.mgmt.rdbms.mariadb.mariadbmanagementclient)

## 4: Run the script

```cmd
python provision_db.py
```

## 5: Insert a record and query the database

1. Create a file named *use_db.py* with the following code. Note the dependencies on the `DB_SERVER_NAME`, `DB_ADMIN_NAME`, and `DB_ADMIN_PASSWORD` environment variables, which should be populated with the values from the provisioning code. This code work only for MySQL; you use different libraries for PostgreSQL and MariaDB.

    :::code language="python" source="~/../python-sdk-examples/db/use_db.py":::

    All of this code uses the mysql.connector API. The only Azure-specific part is the full host domain for MySQL server (mysql.database.azure.com).

1. Download the certificate needed to communicate over SSL with your Azure Database for MySQL server from https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem and save the certificate file to the same folder as the Python file. (This step is described on [Obtain an SSL Certificate](https://docs.microsoft.com/en-us/azure/mysql/howto-configure-ssl#step-1-obtain-ssl-certificate) in the Azure Database for MySQL documentation.)

1. Run the code:

    ```cmd
    python use_db.py
    ```

## 6: Clean up resources

```azurecli
az group delete -n PythonAzureExample-DB-rg  --no-wait
```

Run this command if you don't need to keep the resources provisioned in this example and would like to avoid ongoing charges in your subscription.

[!INCLUDE [resource_group_begin_delete](includes/resource-group-begin-delete.md)]

### For reference: equivalent Azure CLI commands

The following Azure CLI commands complete the same provisioning steps as the Python script. For a PostgreSQL database, use [`az postgres`](/cli/azure/postgres) commands; for MariaDB, use [`az mariadb`](/cli/azure/mariadb) commands.

# [cmd](#tab/cmd)

:::code language="azurecli" source="~/../python-sdk-examples/db/provision.cmd":::

# [bash](#tab/bash)

:::code language="azurecli" source="~/../python-sdk-examples/db/provision.sh":::

---

## See also

- [Example: Provision a resource group](azure-sdk-example-resource-group.md)
- [Example: List resource groups in a subscription](azure-sdk-example-list-resource-groups.md)
- [Example: Provision Azure Storage](azure-sdk-example-storage.md)
- [Example: Use Azure Storage](azure-sdk-example-storage-use.md)
- [Example: Provision and deploy a web app](azure-sdk-example-web-app.md)
- [Example: Provision a virtual machine](azure-sdk-example-virtual-machines.md)
- [Use Azure Managed Disks with virtual machines](azure-sdk-samples-managed-disks.md)
- [Complete a short survey about the Azure SDK for Python](https://microsoft.qualtrics.com/jfe/form/SV_bNFX0HECjzPWMiG?Q_CHL=docs)
