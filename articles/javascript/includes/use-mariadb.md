---
title: Use JavaScript on Azure MariaDB 
description: To create or move your MariaDB database to Azure, you need a MariaDB resource. 
ms.topic: include
ms.date: 08/08/2022
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

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we’ll remove it from this article.

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

## MariaDB resources

* How to [deploy a JavaScript web app](../how-to/deploy-web-app.md)
* [Azure Database for MariaDB](/azure/mariadb/)
* [Migration guide to move to Azure Database for MariaDB](/azure/mariadb/howto-migrate-dump-restore)
