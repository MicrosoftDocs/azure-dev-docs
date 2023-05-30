---
ms.topic: include
ms.custom:
ms.date: 06/01/2022
---

Before you can create the role, you need to get the *application ID* that was created when you configured the system-assigned managed identity in a previous step in this tutorial. The *application ID* is different than the *Object (principal) ID* create when you configure managed identity for the App Service.

### [Azure portal](#tab/managed-identity-azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Get the system assigned identity managed identity application id step 1](<./get-application-id-managed-identity-azure-portal-1.md>)] | :::image type="content" source="../../media/python-web-app-managed-identity/get-application-id-managed-identity-azure-portal-1-240px.png" lightbox="../../media/python-web-app-managed-identity/get-application-id-managed-identity-azure-portal-1.png" alt-text="A screenshot showing how to find web application with managed identity in Azure Active Directory." :::   |
| [!INCLUDE [Get the system assigned identity managed identity application id step 2](<./get-application-id-managed-identity-azure-portal-2.md>)] | :::image type="content" source="../../media/python-web-app-managed-identity/get-application-id-managed-identity-azure-portal-2-240px.png" lightbox="../../media/python-web-app-managed-identity/get-application-id-managed-identity-azure-portal-2.png" alt-text="A screenshot showing how to find web application ID in Azure Active Directory." :::  |

Next, you need to grant the identity permission to access the database. This grant is done by creating a new role that identifies the managed identity as one that can access the database. If you are already in the Azure portal, you can use the [Azure Cloud Shell](https://shell.azure.com/) to complete this task.

> [!TIP]
> Alternatively, you can connect to the database with a local instance of PostgreSQL or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio). For the PostgreSQL interactive terminal [psql](https://www.postgresql.org/docs/13/app-psql.html) used locally, you still need to generate a token with [az account get-access-token](/cli/azure/account#az-account-get-access-token). Azure Data Studio is integrated with Azure Active Directory such that the token is generated automatically. Regardless of how you connect, make sure you specify the user name as *\<azure-ad-user-name>@\<server-name>*.

[!INCLUDE [Log in to PostgreSQL database using Azure Cloud Shell](<./postgres-database-log-in-azure-cloud-shell.md>)]

### [Azure CLI](#tab/managed-identity-azure-cli)

Find the app ID using the [az ad sp show command](/cli/azure/ad/sp#az-ad-sp-show).

[!INCLUDE [Create role with CLI](<./get-application-id-managed-identity-azure-cli.md>)]

Grant the identity permission to access the database. This grant is done by creating a new role that identifies the managed identity as one that can access the database. Note that this time the psql command `user` parameter uses the Azure Active Directory admin user, not the admin user specified during the creation of the PostgreSQL server.

[!INCLUDE [Create role with CLI](<./create-managed-identity-role-in-database-cli.md>)]

---

In the PostgreSQL database, run the following commands to create a role that the web app will use to access the database.

[!INCLUDE [Log in to PostgreSQL database using Azure Cloud Shell](<./postgres-database-create-role.md>)]
