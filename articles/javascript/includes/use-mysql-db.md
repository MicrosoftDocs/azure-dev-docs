---
title: Use JavaScript on Azure MySQL 
description: To create or move your MySQL database to Azure, you need a MySQL resource. 
ms.topic: include
ms.date: 02/8/2021
ms.custom: devx-track-js, devx-track-azurecli
---

## Create an Azure Database for MySQL resource 

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.MySQLServer)
* [@azure/arm-mysql](https://www.npmjs.com/package/@azure/arm-mysql)

[!INCLUDE [Azure CLI commands](azure-cli-mysql-db.md)]

## View and use your MySQL on Azure
While developing your MySQL database with JavaScript, use one of the following tools:

* [Azure Cloud Shell](https://shell.azure.com/)'s _mysql_ CLI
* [MySQL Workbench](https://www.mysql.com/products/workbench/)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)

## Use SDK packages to develop your MySQL on Azure

The Azure MySQL uses npm packages already available, such as:

* [MySQL](https://www.npmjs.com/package/mysql)
* [Promise-mysql](https://www.npmjs.com/package/promise-mysql)

## Use Promise-mysql SDK to connect to MySQL on Azure

To connect and use your MySQL on Azure with JavaScript, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir MySQLDemo && \
        cd MySQLDemo && \
        npm init -y && \
        npm install promise-mysql && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `MySQLDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * installs the promise-mysql npm package - to use async/await
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/mysql/index.js" :::


1. Replace the host, user, and password with your values in the script for your connection configuration object, `config`. 

1. Run the script.

    ```bash
    [
      RowDataPacket { Database: 'information_schema' },
      RowDataPacket { Database: 'defaultdb' },
      RowDataPacket { Database: 'dbproducts' },
      RowDataPacket { Database: 'mysql' },
      RowDataPacket { Database: 'performance_schema' },
      RowDataPacket { Database: 'sys' }
    ]
    [
      RowDataPacket { Tables_in_mysql: '__az_action_history__' },
      RowDataPacket { Tables_in_mysql: '__az_changed_static_configs__' },
      RowDataPacket { Tables_in_mysql: '__az_replica_information__' },
      RowDataPacket { Tables_in_mysql: '__az_replication_current_state__' },
      RowDataPacket { Tables_in_mysql: '__firewall_rules__' },
      RowDataPacket { Tables_in_mysql: '__querystore_event_wait__' },
      RowDataPacket { Tables_in_mysql: '__querystore_query_metrics__' },
      RowDataPacket { Tables_in_mysql: '__querystore_query_text__' },
      RowDataPacket {
        Tables_in_mysql: '__querystore_wait_stats_procedure_errors__'
      },
      RowDataPacket {
        Tables_in_mysql: '__querystore_wait_stats_procedure_status__'
      },
      RowDataPacket { Tables_in_mysql: '__recommendation__' },
      RowDataPacket { Tables_in_mysql: '__recommendation_session__' },
      RowDataPacket { Tables_in_mysql: '__script_version__' },
      RowDataPacket { Tables_in_mysql: 'columns_priv' },
      RowDataPacket { Tables_in_mysql: 'db' },
      RowDataPacket { Tables_in_mysql: 'engine_cost' },
      RowDataPacket { Tables_in_mysql: 'event' },
      RowDataPacket { Tables_in_mysql: 'func' },
      RowDataPacket { Tables_in_mysql: 'general_log' },
      RowDataPacket { Tables_in_mysql: 'gtid_executed' },
      RowDataPacket { Tables_in_mysql: 'help_category' },
      RowDataPacket { Tables_in_mysql: 'help_keyword' },
      RowDataPacket { Tables_in_mysql: 'help_relation' },
      RowDataPacket { Tables_in_mysql: 'help_topic' },
      RowDataPacket { Tables_in_mysql: 'innodb_index_stats' },
      RowDataPacket { Tables_in_mysql: 'innodb_table_stats' },
      RowDataPacket { Tables_in_mysql: 'ndb_binlog_index' },
      RowDataPacket { Tables_in_mysql: 'plugin' },
      RowDataPacket { Tables_in_mysql: 'proc' },
      RowDataPacket { Tables_in_mysql: 'procs_priv' },
      RowDataPacket { Tables_in_mysql: 'proxies_priv' },
      RowDataPacket { Tables_in_mysql: 'query_store' },
      RowDataPacket { Tables_in_mysql: 'query_store_wait_stats' },
      RowDataPacket { Tables_in_mysql: 'recommendation' },
      RowDataPacket { Tables_in_mysql: 'server_cost' },
      RowDataPacket { Tables_in_mysql: 'servers' },
      RowDataPacket { Tables_in_mysql: 'slave_master_info' },
      RowDataPacket { Tables_in_mysql: 'slave_relay_log_info' },
      RowDataPacket { Tables_in_mysql: 'slave_worker_info' },
      RowDataPacket { Tables_in_mysql: 'slow_log' },
      RowDataPacket { Tables_in_mysql: 'tables_priv' },
      RowDataPacket { Tables_in_mysql: 'time_zone' },
      RowDataPacket { Tables_in_mysql: 'time_zone_leap_second' },
      RowDataPacket { Tables_in_mysql: 'time_zone_name' },
      RowDataPacket { Tables_in_mysql: 'time_zone_transition' },
      RowDataPacket { Tables_in_mysql: 'time_zone_transition_type' },
      RowDataPacket { Tables_in_mysql: 'user' }
    ]
    [
      RowDataPacket { User: 'mySqlAdmin' },
      RowDataPacket { User: 'azure_superuser' },
      RowDataPacket { User: 'azure_superuser' },
      RowDataPacket { User: 'mysql.session' },
      RowDataPacket { User: 'mysql.sys' }
    ]
    done
    ```

## Next steps

* How to [deploy a JavaScript web app](../how-to/deploy-web-app.md)
* [Azure Database for MySQL](/azure/mysql/)
* [Migration with dump and restore](/azure/mysql/concepts-migrate-dump-restore)
* [Migration with MySQL Workbench](/azure/mysql/concepts-migrate-import-export)
