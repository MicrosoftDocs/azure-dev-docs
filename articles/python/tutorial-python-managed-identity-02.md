---
title: Configure and run a Python app locally with PostgreSQL
description: How to run a Python (Django or Flask) web app locally with local PostgreSQL and a local storage emulator, as a first step before deploying to Azure.
ms.devlang: python
ms.topic: tutorial
ms.date: 06/01/2022
ms.custom: devx-track-python
---

# Configure and run the Python app locally with a PostgreSQL instance and a storage emulator

This article is part of a tutorial about deploying a Python app to Azure App Service. The web app uses managed identity to authenticate to other Azure resources. In this article, you'll learn how to run the Python app locally. This ***optional step*** requires a local PostgreSQL instance, a local storage emulator, and other setup steps. If you skip this step now, you can return to it after you've completed the rest of the tutorial.

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-local-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-local.png" alt-text="A screenshot showing the Azure services in the tutorial used with running locally highlighted." :::

To run the app locally, you'll need:

* A virtual environment and install the requirements as shown in the previous article. You'll add two more packages to the environment: [django-sslserver](https://pypi.org/project/django-sslserver/) (Django only) and [python-certifi-win32](https://pypi.org/project/python-certifi-win32/).
* PostgreSQL installed locally to which the Python app can connect.
* [Azurite](/azure/storage/common/storage-use-azurite) local storage emulator installed and running. 
* [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer) installed to connect to local storage and create a container.
* A way to create a trusted development certificate, such as with [mkcert](https://github.com/FiloSottile/mkcert).

The steps shown in this article apply to both Django and Flask frameworks except where noted.

> [!Tip]
> Instead of using local storage emulation, you could use Azure Storage and authenticate locally with developer account or AD group. For more information, see [Authenticate Python apps to Azure services during local development using developer accounts](./sdk/authentication-local-development-dev-accounts.md). The rest of this article shows local emulation of storage with Azurite.

## 1. Create a database in local PostgreSQL

In a local [PostgreSQL](https://www.postgresql.org/download/) instance, create a database for the sample app. For example, 
using the PostgreSQL interactive terminal `psql`, connect to the PostgreSQL database server and create the restaurant database.

```sql
psql --host=<LOCAL_SERVER_NAME> \
     --port=5432 \
     --username=<LOCAL_ADMIN_USERNAME> \
     --dbname=postgres

postgres=> CREATE DATABASE restaurant;
postgres=> \c restaurant
restaurant=>
```

Type `\?` to show help or `\q` to quit.

Alternatively, you can use a tool like [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) to connect to your local PostgreSQL instance and run the commands above.

## 2. Create a development certificate

Use [mkcert](https://github.com/FiloSottile/mkcert) to create a locally trusted development certificate. Run the following commands in the root of the Python app's project folder:

```Console
mkcert -install
mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1
```
The last command creates a *cert.pem* and *key.pem* file. `mkcert` creates certificates signed by your own private CA that your machine is automatically configured to trust when you run `mkcert -install`. 

## 3. Configure SSL-enabled dev environment (Django)

To add TLS (SSL) capabilities to the local development environment for Django, install the [django-sslserver](https://pypi.org/project/django-sslserver/) package. If you're using Flask, go to the next step.

```Console
pip install django-sslserver
```

With this package, you can run the app locally using the certificate and key you created as shown in a later step.

## 4. Use machine CA certificates

In a virtual environment, the default Certificate Authority (CA) certificates come with the environment and are stored in the *cacert.pem* file. You can verify the location of the certificates for an environment by running `python -m certifi`. However, in this tutorial you'll use the machine CA certificates that contain the locally trusted certificate created above. 

Solutions for using machine CA certificates are described in [Fixing your SSL Verify Errors in Python](https://levelup.gitconnected.com/fixing-your-ssl-verify-errors-in-python-71c2201db4b2). For example, to use the Windows certificate install the [python-certifi-win32](https://pypi.org/project/python-certifi-win32/) package, while on macOS/Linux you can specify an environment variable.

[!INCLUDE [Virtual environment use machine CA certificate](<./includes/python-web-app-managed-identity/virtual-environment-use-root-ca.md>)]

## 5. Start Azurite and create a container

In your local setup, start [Azurite](/azure/storage/common/storage-use-azurite) from the command line to emulate blob storage that can be used by the Python app.

#### [bash](#tab/terminal-bash)

```
azurite-blob \
    --location "<folder-path>" \
    --debug "<folder-path>\debug.log" \
    --oauth basic \
    --cert "<project-root>\cert.pem" \
    --key "<project-root\key.pem"
```

#### [PowerShell terminal](#tab/terminal-powershell)

```
azurite-blob `
    --location "<folder-path>" `
    --debug "<folder-path>\debug.log" `
    --oauth basic `
    --cert "<project-root>\cert.pem" `
    --key "<project-root\key.pem"
```

---

The command creates a service listening on `https://127.0.0.1:10000`.

In the command above, replace:

* *\<folder-path>* with a location where Azurite will store data and write a debug log.  
* *\<project-root>* with the directory of the Python project where you ran `mkcert` to create the certificate and key files.

Finally, create a container in Azurite and configure it with [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer). Use Storage Explorer to connect to Azurite using HTTPS. To connect using HTTPS, import the certificate you created with `mkcert`.

> [!Tip]
> One way of getting the correct certificates into Azure Storage Explorer, is to get them from your browser. First, make sure the Python app is running locally with TLS (SSL). (See the next step for details.) Then, select the lock icon next to URL in the browser. Export all certificates in the certification path to *.cer* files. If you followed the steps above with `mkcert`, there should be two items in the path. Import these *.cer* files into Storage Explorer.

Connecting Azure Storage Explorer to Azurite is covered in the article [Use the Azurite emulator for local Azure Storage development](/azure/storage/common/storage-use-azurite?tabs=visual-studio#microsoft-azure-storage-explorer). If you encounter errors connecting, refer to the [SSL certificate issues](/azure/storage/common/storage-explorer-troubleshooting#ssl-certificate-issues) section of the Storage Explorer Troubleshooting guide. 

| Instructions    | Screenshot |
|:----------------|-----------:|
| 1. Open Azure Storage Explorer and connect to Azurite. <br> 2. Create a container named *photos* in the local storage account. | :::image type="content" source="./media/python-web-app-managed-identity/local-development-azure-storage-explorer-azurite-240px.png" lightbox="./media/python-web-app-managed-identity/local-development-azure-storage-explorer-azurite.png" alt-text="A screenshot showing the Azure Storage Explorer connected to Azure local storage emulator." ::: |
| 1. Right select the *photos* container and select **Set Public Access Level...**. <br> 2. Select **Public read access for blobs only** and **Apply**. | :::image type="content" source="./media/python-web-app-managed-identity/local-development-azure-storage-explorer-access-level-240px.png" lightbox="./media/python-web-app-managed-identity/local-development-azure-storage-explorer-access-level.png" alt-text="A screenshot showing the Azure Storage Explorer and setting the access level for blobs." ::: |

## 6. Configure and test the app

If you started with one of the sample apps, copy the *.env.sample* file to *.env*. If you didn't start with one of the sample apps, create an *.env* file and make sure you have the dependencies in the *requirements.txt*. Add other packages as needed such as [django-sslserver](https://pypi.org/project/django-sslserver/) or [python-certifi-win32](https://pypi.org/project/python-certifi-win32/).

The *.env* file is only used in local development and should look like the example below. The *.env* file contains info about connecting to your local PostgreSQL and Azurite instances:

```
# Local PostgreSQL connection info
DBNAME=<local-database name>
DBHOST=<local-database-hostname>
DBUSER=<local-db-user-name>
DBPASS=<local-db-password>
SECRET_KEY=<your-secret-key>

# Emulator storage connection info
STORAGE_URL=https://127.0.0.1:10000/devstoreaccount1
STORAGE_CONTAINER_NAME=photos
```

A `SECRET_KEY` key you can use for this tutorial can be generated with the following Python code: `python -c "import secrets; print(secrets.token_hex())"`.

The sample app uses the [python-dotenv](https://pypi.org/project/python-dotenv/) to read environment variables from the *.env* file.

Next, create the `restaurant` and `review` database tables:

### [Flask](#tab/flask)

```Console
flask db init
flask db migrate -m "initial migration"
```

### [Django](#tab/django)

```Console
python manage.py migrate
```

---

Run the app with HTTPS using the certificate and key files you created:

### [Flask](#tab/flask)

```Console
flask run --cert=cert.pem --key=key.pem
```

### [Django](#tab/django)

```Console
 python manage.py runsslserver --certificate cert.pem --key key.pem
```

---

The sample Flask and Django apps use the [azure.identity](https://pypi.org/project/azure-identity/) package, which contains the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential). The DefaultAzureCredential can be used with Azurite and the Azure Python SDK.

To test your Python app locally, go to `https://127.0.0.1:8000` (Django) or `http://127.0.0.1:5000` (Flask). Your Python app is running locally with local PostgreSQL instance and Azurite storage emulator. 

If you run into `DefaultAzureCredential` issues, make sure you're signed in to Azure. For example, in the Azure CLI, you can use `az login`, in Visual Studio Code use the command palette (Ctrl+Shift+P) to run the **Azure: Sign In** command, and in Azure PowerShell use `Connect-AzAccount`.

Here's an example screenshot of the sample app:

:::image type="content" source="./media/python-web-app-managed-identity/example-of-review-sample-app-local-small.png" lightbox="./media/python-web-app-managed-identity/example-of-review-sample-app-local.png" alt-text="An example of the sample app showing restaurant review functionality running locally." :::

## Next step

> [!div class="nextstepaction"]
> [Create an App Service to host the Python app >>>](./tutorial-python-managed-identity-03.md)
