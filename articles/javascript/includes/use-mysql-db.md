---
title: Use JavaScript on Azure MySQL 
description: To create or move your MySQL database to Azure, you need a MySQL resource. 
ms.topic: include
ms.date: 08/08/2022
ms.custom: devx-track-js, devx-track-azurecli
---

### Create an Azure Database for MySQL resource 

You can create a resource with:

* Azure CLI
* [Azure portal](https://ms.portal.azure.com/#create/Microsoft.MySQLServer)
* [@azure/arm-mysql](https://www.npmjs.com/package/@azure/arm-mysql)

[!INCLUDE [Azure CLI commands](azure-cli-mysql-db.md)]

### View and use your MySQL on Azure
While developing your MySQL database with JavaScript, use one of the following tools:

* [Azure Cloud Shell](https://shell.azure.com/)'s _mysql_ CLI
* [MySQL Workbench](https://www.mysql.com/products/workbench/)
* Visual Studio Code [extension](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools-driver-mysql)

### Use SDK packages to develop your MySQL on Azure

The Azure MySQL uses npm packages already available, such as:

* [MySQL](https://www.npmjs.com/package/mysql)
* [Promise-mysql](https://www.npmjs.com/package/promise-mysql)

### Use Promise-mysql SDK to connect to MySQL on Azure

To connect and use your MySQL on Azure with JavaScript, use the following procedure.

> [!NOTE]
> This article contains references to the term *slave*, a term that Microsoft no longer uses. When the term is removed from the software, we’ll remove it from this article.

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


### MySql resources

* How to [deploy a JavaScript web app](../how-to/deploy-web-app.md)
* [Azure Database for MySQL](/azure/mysql/)
* [Migration with dump and restore](/azure/mysql/concepts-migrate-dump-restore)
* [Migration with MySQL Workbench](/azure/mysql/concepts-migrate-import-export)
