---
title: Use JavaScript on Azure MariaDB 
description: To create or move your MariaDB database to Azure, you need a MariaDB resource. 
ms.topic: include
ms.date: 02/04/2021
ms.custom: devx-track-js, devx-track-azurecli
---

## Create an Azure Database for MariaDB resource 

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.MariaDBServer)
* [@azure/arm-mariadb](https://www.npmjs.com/package/@azure/arm-mariadb)

[!INCLUDE [Azure CLI commands](azure-cli-mariadb.md)]

## View and use your MariaDB on Azure
While developing your MariaDB database with JavaScript, use one of the following tools:

* [Azure Cloud Shell](https://shell.azure.com/)'s _mysql_ CLI
* [MySQL Workbench](https://www.mysql.com/products/workbench/)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)

## Use SDK packages to develop your MariaDB on Azure

The Azure MariaDB uses npm packages already available, such as:

* [mariadb](https://www.npmjs.com/package/mariadb)

## Use MariaDB SDK to connect to MariaDB on Azure

To connect and use your MariaDB on Azure with JavaScript, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir mariaDbDemo && \
        cd mariaDbDemo && \
        npm init -y && \
        npm install mariadb && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `mariaDbDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * installs the mariadb npm package
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/mariadb/index.js" :::

1. Replace the host, user, and password with your values in the script for your connection configuration object, `config`. 

1. Run the script.

    ```bash
    [
      { Database: 'information_schema' },
      { Database: 'mysql' },
      { Database: 'performance_schema' },
      { Database: 'quickstartdb' },
      { Database: 'tutorial' },
      meta: [
        ColumnDef {
          _parse: [StringParser],
          collation: [Collation],
          columnLength: 256,
          columnType: 253,
          flags: 1,
          scale: 0,
          type: 'VAR_STRING'
        }
      ]
    ]
    [
      { Tables_in_mysql: '__az_action_history__' },
      { Tables_in_mysql: '__az_changed_static_configs__' },
      { Tables_in_mysql: '__az_replica_information__' },
      { Tables_in_mysql: '__az_replication_current_state__' },
      { Tables_in_mysql: '__az_slave_relay_log_info__' },
      { Tables_in_mysql: '__firewall_rules__' },
      { Tables_in_mysql: '__script_version__' },
      { Tables_in_mysql: 'column_stats' },
      { Tables_in_mysql: 'columns_priv' },
      { Tables_in_mysql: 'db' },
      { Tables_in_mysql: 'event' },
      { Tables_in_mysql: 'func' },
      { Tables_in_mysql: 'general_log' },
      { Tables_in_mysql: 'gtid_slave_pos' },
      { Tables_in_mysql: 'help_category' },
      { Tables_in_mysql: 'help_keyword' },
      { Tables_in_mysql: 'help_relation' },
      { Tables_in_mysql: 'help_topic' },
      { Tables_in_mysql: 'host' },
      { Tables_in_mysql: 'index_stats' },
      { Tables_in_mysql: 'innodb_index_stats' },
      { Tables_in_mysql: 'innodb_table_stats' },
      { Tables_in_mysql: 'plugin' },
      { Tables_in_mysql: 'proc' },
      { Tables_in_mysql: 'procs_priv' },
      { Tables_in_mysql: 'proxies_priv' },
      { Tables_in_mysql: 'roles_mapping' },
      { Tables_in_mysql: 'servers' },
      { Tables_in_mysql: 'slow_log' },
      { Tables_in_mysql: 'table_stats' },
      { Tables_in_mysql: 'tables_priv' },
      { Tables_in_mysql: 'time_zone' },
      { Tables_in_mysql: 'time_zone_leap_second' },
      { Tables_in_mysql: 'time_zone_name' },
      { Tables_in_mysql: 'time_zone_transition' },
      { Tables_in_mysql: 'time_zone_transition_type' },
      { Tables_in_mysql: 'transaction_registry' },
      { Tables_in_mysql: 'user' },
      meta: [
        ColumnDef {
          _parse: [StringParser],
          collation: [Collation],
          columnLength: 292,
          columnType: 253,
          flags: 1,
          scale: 0,
          type: 'VAR_STRING'
        }
      ]
    ]
    [
      { User: 'azureAdmin' },
      { User: 'azure_superuser' },
      { User: 'azure_superuser' },
      { User: 'azure_superuser' },
      meta: [
        ColumnDef {
          _parse: [StringParser],
          collation: [Collation],
          columnLength: 320,
          columnType: 254,
          flags: 16515,
          scale: 0,
          type: 'STRING'
        }
      ]
    ]
    done
    ```

## Next steps

* How to [deploy a JavaScript web app](../how-to/deploy-web-app.md)
* [Azure Database for MariaDB](/azure/mariadb/)
* [Migration guide to move to Azure Database for MariaDB](/azure/mariadb/howto-migrate-dump-restore)