---
title: Use JavaScript on Azure PostgreSQL
description: To create or move your PostgreSQL database to Azure, you need a PostgreSQL resource. 
ms.topic: how-to
ms.date: 02/8/2022
ms.custom: devx-track-js
---

# Develop a JavaScript application with PostgreSQL on Azure

To create, move, or use a PostgreSQL database to Azure, you need an **Azure Database for PostgreSQL server** resource. Learn how to create the resource and use your database.

## Create an Azure Database for PostgreSQL resource 

Create a resource with:

* [Azure CLI command](/cli/azure/postgres/server#az-postgres-server-create) = `az postgres server create`
* [Visual Studio Code](../with-visual-studio-code/create-azure-database.md#create-a-postgresql-database)
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.PostgreSQLServer)
* [@azure/arm-postgresql](https://www.npmjs.com/package/@azure/arm-postgresql)

## Get the postgresql connection string with Azure cli

Use the following command to get the PostgreSQL connection string using the [az postgres server key show](/cli/azure/postgres/server/key#az-postgres-server-key-show):

```azurecli
az postgres show-connection-string 
```

This returns the formats to build the connection string. You still need to know the server name, database name, admin account, and password:

```json
{
  "connectionStrings": {
    "ado.net": "Server={server}.postgres.database.azure.com;Database={database};Port=5432;User Id={login}@{server};Password={password};",
    "jdbc": "jdbc:postgresql://{server}.postgres.database.azure.com:5432/{database}?user={login}@{server}&password={password}",
    "jdbc Spring": "spring.datasource.url=jdbc:postgresql://{server}.postgres.database.azure.com:5432/{database}  spring.datasource.username={login}@{server}  spring.datasource.password={password}",
    "node.js": "var client = new pg.Client('postgres://{login}@{server}:{password}@{server}.postgres.database.azure.com:5432/{database}');",
    "php": "host={server}.postgres.database.azure.com port=5432 dbname={database} user={login}@{server} password={password}",
    "psql_cmd": "psql --host={server}.postgres.database.azure.com --port=5432 --username={login}@{server} --dbname={database}",
    "python": "cnx = psycopg2.connect(database='{database}', user='{login}@{server}', host='{server}.postgres.database.azure.com', password='{password}', port='5432')",
    "ruby": "cnx = PG::Connection.new(:host => '{server}.postgres.database.azure.com', :user => '{login}@{server}', :dbname => '{database}', :port => '5432', :password => '{password}')",
    "webapp": "Database={database}; Data Source={server}.postgres.database.azure.com; User Id={login}@{server}; Password={password}"
  },
  "host": "{server}.postgres.database.azure.com",
  "password": {
    "isDefault": true
  },
  "username": "{login}@{server}"
}
```

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
    * Creates a project folder named `DbDemo`
    * Changes the Bash terminal into that folder
    * Initializes the project, which creates the `package.json` file
    * Installs the pg npm package - to use async/await
    * Creates the `index.js` script file
    * Opens the project in Visual Studio Code

1. Copy the following JavaScript code into `index.js`:

    :::code language="JavaScript" source="~/../js-e2e/database/postgresql/index.js" :::

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