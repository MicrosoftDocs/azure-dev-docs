---
title: Use JavaScript on Azure PostgreSQL
description: To create or move your PostgreSQL database to Azure, you need a PostgreSQL resource. 
ms.topic: how-to
ms.date: 02/8/2021
ms.custom: devx-track-js
---

# Develop a JavaScript application with PostgreSQL on Azure

To create, move, or use a PostgreSQL database to Azure, you need an **Azure Database for PostgreSQL server** resource. Learn how to create the resource and use your database.

## Create an Azure Database for PostgreSQL resource 

Create a resource with:

* [Azure CLI](../with-azure-cli/create-postgresql-server-resource.md)
* [Visual Studio Code](../with-visual-studio-code/create-azure-database.md#create-a-postgresql-database)
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.PostgreSQLServer)
* [https://www.npmjs.com/package/@azure/arm-postgresql](https://www.npmjs.com/package/@azure/arm-postgresql)

## View and use your PostgreSQL server on Azure
While developing your PostgreSQL database with JavaScript, use one of the following tools:

* [Azure Cloud Shell](https://shell.azure.com/) - psql CLI is available
* [pgAdmin](https://www.pgadmin.org/)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)

## Use SDK packages to develop your PostgreSQL server on Azure

The Azure PostgreSQL uses npm packages already available, such as:

* [pg](https://www.npmjs.com/package/pg)

## Use pg SDK to connect to PostgreSQL on Azure

To connect and use your PostgreSQL on Azure with JavaScript, use the following procedure.

1. Make sure Node.js and npm are installed.
1. Create a Node.js project in a new folder:

    ```bash
    mkdir DbDemo && \
        cd DbDemo && \
        npm init -y && \
        npm install pg && \
        touch index.js && \
        code .
    ```

    The command:
    * creates a project folder named `DbDemo`
    * changes the Bash terminal into that folder
    * initializes the project, which creates the `package.json` file
    * installs the pg npm package - to use async/await
    * creates the `index.js` script file
    * opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    ```nodejs
    const { Client } = require('pg')
    
    const query = async (connectionString) => {
        
        // create connection
        const connection = new Client(connectionString);
        connection.connect();
        
        // show tables in the postgres database
        const tables = await connection.query('SELECT table_name FROM information_schema.tables where table_type=\'BASE TABLE\';');
        console.log(tables.rows);
    
        // show users configured for the server
        const users = await connection.query('select pg_user.usename FROM pg_catalog.pg_user;');
        console.log(users.rows);
        
        // close connection
        connection.end();
    }
    
    const server='YOURRESOURCENAME';
    const user='YOUR-ADMIN-USER';
    const password='YOUR-PASSWORD';
    const database='postgres';

    const connectionString = `postgres://${user}@${server}:${password}@${server}.postgres.database.azure.com:5432/${database}`;
    
    query(connectionString)
    .then(() => console.log('done'))
    .catch((err) => console.log(err));
    ```

1. Replace the `YOUR-ADMIN-USER`, `YOURRESOURCENAME`, and `YOUR-PASSWORD` with your values in the script for your connection string. 

1. Run the script to connect to the `postgres` server and see the base tables and users.

    ```bash
    node index.js
    ```

1. View the results. 

    ```bash
    [
      { table_name: 'pg_statistic' },
      { table_name: 'pg_type' },
      { table_name: 'pg_authid' },
      { table_name: 'pg_user_mapping' },
      { table_name: 'pg_attribute' },
      { table_name: 'pg_proc' },
      { table_name: 'pg_class' },
      { table_name: 'pg_attrdef' },
      { table_name: 'pg_constraint' },
      { table_name: 'pg_inherits' },
      { table_name: 'pg_index' },
      { table_name: 'pg_operator' },
      { table_name: 'pg_opfamily' },
      { table_name: 'pg_opclass' },
      { table_name: 'pg_am' },
      { table_name: 'pg_amop' },
      { table_name: 'pg_amproc' },
      { table_name: 'pg_language' },
      { table_name: 'pg_largeobject_metadata' },
      { table_name: 'pg_aggregate' },
      { table_name: 'pg_rewrite' },
      { table_name: 'pg_largeobject' },
      { table_name: 'pg_trigger' },
      { table_name: 'pg_event_trigger' },
      { table_name: 'pg_description' },
      { table_name: 'pg_cast' },
      { table_name: 'pg_enum' },
      { table_name: 'pg_namespace' },
      { table_name: 'pg_conversion' },
      { table_name: 'pg_depend' },
      { table_name: 'pg_database' },
      { table_name: 'pg_db_role_setting' },
      { table_name: 'pg_tablespace' },
      { table_name: 'pg_pltemplate' },
      { table_name: 'pg_auth_members' },
      { table_name: 'pg_shdepend' },
      { table_name: 'pg_shdescription' },
      { table_name: 'pg_ts_config' },
      { table_name: 'pg_ts_config_map' },
      { table_name: 'pg_ts_dict' },
      { table_name: 'pg_ts_parser' },
      { table_name: 'pg_ts_template' },
      { table_name: 'pg_extension' },
      { table_name: 'pg_foreign_data_wrapper' },
      { table_name: 'pg_foreign_server' },
      { table_name: 'pg_foreign_table' },
      { table_name: 'pg_policy' },
      { table_name: 'pg_replication_origin' },
      { table_name: 'pg_default_acl' },
      { table_name: 'pg_init_privs' },
      { table_name: 'pg_seclabel' },
      { table_name: 'pg_shseclabel' },
      { table_name: 'pg_collation' },
      { table_name: 'pg_range' },
      { table_name: 'pg_transform' },
      { table_name: 'sql_features' },
      { table_name: 'sql_implementation_info' },
      { table_name: 'sql_languages' },
      { table_name: 'sql_packages' },
      { table_name: 'sql_parts' },
      { table_name: 'sql_sizing' },
      { table_name: 'sql_sizing_profiles' }
    ]
    [ { usename: 'azure_superuser' }, { usename: 'YOUR-ADMIN-USER' } ]
    done
    ```

## Next steps

* How to [deploy a JavaScript web app](../deploy-web-app.md)
* [Azure Database for PostgreSQL server](/azure/postgresql/)