---
ms.topic: include
ms.custom: devx-track-azurecli
ms.date: 06/01/2022
---

### [Azure portal](#tab/managed-identity-azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Assign managed identity to PostgreSQL database step 1](<./assign-azure-active-directory-user-to-postgres-azure-portal-1.md>)] | :::image type="content" source="../../media/python-web-app-managed-identity/assign-azure-active-directory-user-to-postgres-azure-portal-1-240px.png" lightbox="../../media/python-web-app-managed-identity/assign-azure-active-directory-user-to-postgres-azure-portal-1.png" alt-text="A screenshot showing how to navigate to set Azure Active Directory admin in PostgreSQL." :::  |
| [!INCLUDE [Assign managed identity to PostgreSQL database step 2](<./assign-azure-active-directory-user-to-postgres-azure-portal-2.md>)] | :::image type="content" source="../../media/python-web-app-managed-identity/assign-azure-active-directory-user-to-postgres-azure-portal-2-240px.png" lightbox="../../media/python-web-app-managed-identity/assign-azure-active-directory-user-to-postgres-azure-portal-2.png" alt-text="A screenshot showing how to navigate to add a user as Azure Active Directory admin in PostgreSQL." ::: |
| [!INCLUDE [Assign managed identity to PostgreSQL database step 3](<./assign-azure-active-directory-user-to-postgres-azure-portal-3.md>)] |  |

### [Azure CLI](#tab/managed-identity-azure-cli)

Find the object ID of the Azure Active Directory user using the [az ad user list](/cli/azure/ad/user#az_ad_user_list) command.

Replace *\<user-principal-name>* with an Azure Active Directory admin email.

[!INCLUDE [Create role with CLI](<./assign-azure-active-directory-user-to-postgres-azure-cli-1.md>)]

Add the user as an Active Directory administrator for the PostgreSQL server with the [az postgres server ad-admin create command](/cli/azure/postgres/server/ad-admin#az_postgres_server_ad_admin_create).

[!INCLUDE [Create role with CLI](<./assign-azure-active-directory-user-to-postgres-azure-cli-2.md>)]
