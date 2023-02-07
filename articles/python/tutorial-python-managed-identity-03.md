---
title: Create a Python web app in App Service with managed identity
description: Create an Azure App Service that a Python (Django or Flask) web app can be deployed to and configure App Service with managed identity.
ms.devlang: python
ms.topic: tutorial
ms.date: 06/01/2022
ms.custom: devx-track-python, devx-track-azurecli, vscode-azure-extension-update-completed
---

# Create a Python web app in App Service and enable managed identity

This article is part of a tutorial about deploying a Python app to Azure App Service. The web app uses managed identity to authenticate to other Azure resources. In this article, you'll create an Azure App Service to host a Python web app and create a system assigned managed identity for the web app. The managed identity is authenticated with Azure AD, so you don’t have to store credentials in code when accessing other Azure resources.

:::image type="content" source="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-web-app-800px.png" lightbox="./media/python-web-app-managed-identity/system-diagram-local-to-deploy-python-managed-identity-web-app.png" alt-text="A screenshot showing the Azure services in the tutorial used with Azure App Service highlighted." :::

## 1. Create the App Service

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure resource.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use the search box in the top tool bar to find App Services in Azure](<./includes/python-web-app-managed-identity/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-azure-portal-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-azure-portal-1.png" alt-text="A screenshot showing how to use the search box in the toolbar of the Azure portal to find App Services." ::: |
| [!INCLUDE [A screenshot showing the location of the Create button on the App Services page in the Azure portal](<./includes/python-web-app-managed-identity/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-azure-portal-2-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-azure-portal-2.png" alt-text="A screenshot showing the location of the Create button on the App Services page in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to fill out the form to create a new App Service in the Azure portal](<./includes/python-web-app-managed-identity/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-azure-portal-3-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-azure-portal-3.png" alt-text="A screenshot showing how to create a new App Service in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing how to select the basic App Service plan in the Azure portal](<./includes/python-web-app-managed-identity/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-azure-portal-4-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-azure-portal-4.png" alt-text="A screenshot showing how to select the basic App Service plan in the Azure portal." ::: |
| [!INCLUDE [A screenshot showing the location of the Review plus Create button in the Azure portal](<./includes/python-web-app-managed-identity/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-azure-portal-5-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-azure-portal-5.png" alt-text="A screenshot showing the location of the Review plus Create button in the Azure portal." ::: |

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) and the [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) installed and be signed into Azure from VS Code.


| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [A screenshot showing how to use App Services in Visual Studio Code](<./includes/python-web-app-managed-identity/create-app-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-1-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-1.png" alt-text="A screenshot showing how to find the VS Code Azure extension in VS Code and locate App Services." ::: |
| [!INCLUDE [A screenshot showing how to use create an App Service in Visual Studio Code](<./includes/python-web-app-managed-identity/create-app-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-2-240px.gif" lightbox="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-2.gif" alt-text="A screenshot showing how to create a new web app in Visual Studio Code." ::: |
| [!INCLUDE [A screenshot showing what happens after App Service is created in Visual Studio Code](<./includes/python-web-app-managed-identity/create-app-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-3a-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-3a.png" alt-text="A screenshot showing the result of creating an App Service in Visual Studio Code with dialog showing options to deploy or view output." ::: :::image type="content" source="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-3b-240px.png" lightbox="./media/python-web-app-managed-identity/create-app-service-visual-studio-code-3b.png" alt-text="A screenshot showing the default page of a web app with nothing deployed." ::: |

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Create app service with CLI](<./includes/python-web-app-managed-identity/create-app-service-cli.md>)]

----

## 2. Enable managed identity

In this step, you create a system assigned managed identity for the App Service. The managed identity is authenticated with Azure AD, so you don’t have to store any credentials in code. For more information, see [What are managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview).

You can enable managed identity using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/managed-identity-azure-portal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Enable managed identity step 1](<./includes/python-web-app-managed-identity/enable-managed-identity-azure-portal-1.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-1-240px.png" alt-text="A screenshot showing the location of the Identity menu item in the left-hand menu for an Azure resource." lightbox="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-1.png"::: |
| [!INCLUDE [Enable managed identity step 2](<./includes/python-web-app-managed-identity/enable-managed-identity-azure-portal-2.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-2-240px.png" alt-text="A screenshot showing how to enable managed identity on for an App Service." lightbox="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-2.png"::: :::image type="content" source="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-3-240px.png" alt-text="A screenshot showing how to enable managed identity for an Azure resource on the resource's Identity page." lightbox="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-3.png"::: |
| [!INCLUDE [Enable managed identity step 3](<./includes/python-web-app-managed-identity/enable-managed-identity-azure-portal-3.md>)] | :::image type="content" source="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-4-240px.png" alt-text="A screenshot showing how the managed identity object ID on the resource's Identity page." lightbox="./media/python-web-app-managed-identity/enable-managed-identity-azure-portal-4.png"::: |


### [Azure CLI](#tab/managed-identity-azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell](https://shell.azure.com) or on a workstation with the [Azure CLI installed](/cli/azure/install-azure-cli).

[!INCLUDE [Enable managed identity with CLI](<./includes/python-web-app-managed-identity/enable-managed-identity-azure-cli.md>)]

The output will look like the following.

```json
{
  "principalId": "99999999-9999-9999-9999-999999999999",
  "tenantId": "33333333-3333-3333-3333-333333333333",
  "type": "SystemAssigned",
  "userAssignedIdentities": null
}

```

The `principalId` value is the unique ID of the managed identity. Keep a copy of this output as you'll need these values in later steps.

---

## Next step

> [!div class="nextstepaction"]
> [Create a storage account >>>](./tutorial-python-managed-identity-04.md)
