---
title: "8-Clean up: Remove resources"
description: Clean up all resources created in this article series.
ms.topic: how-to
ms.date: 08/31/2021
ms.custom: devx-track-js
---

# 8. Clean up all resources used in this article series

Clean up all resources created in this article series.

## Remove the Azure Static Web app resource


# [Visual Studio Code](#tab/remove-swa-vscode)

In VS Code, find the Azure Explorer's Static Web App section, right-click on the Static Web app and select **Delete**. In the pop-up window, **Are you sure...**, select **Delete** again. 

# [Azure CLI](#tab/remove-swa-azure-cli)


In the VS Code integrated terminal, where you logged into the Azure CLI in a previous section of this article series, use the following Azure CLI command, [az staticwebapp delete](/cli/azure/staticwebapp/appsettings#az_staticwebapp_appsettings_delete), to delete your Static Web App:

```azurecli
az staticwebapp delete \
    --subscription YOUR-SUBSCRIPTION-ID-OR-NAME \
    --resource-group YOUR-RESOURCE-GROUP-NAME \
    --name YOUR-ALIAS-staticwebapp-with-api \
    --no-wait
    --yes
```

---

## Delete your GitHub repo

Delete your GitHub repo, and all the files associated with it.

1. In a web browser, open your repo's settings with a URL like: `https://github.com/YOUR-ACCOUNT/staticwebapp-with-api/settings`.
1. At the bottom of the page, in the **Danger Zone**, select **Delete this repository** and complete that process.

## Remove your authentication from the authentication provider

If you deploy your app to the remote Static Web app, then want to remove your personal authentication approvals, you need to purge these approvals. This step isn't needed if you haven't deployed to Azure.

Purge your authentication from your providers, using the following links:

* [Twitter](https://identity.azurestaticapps.net/.auth/purge/twitter)
* [GitHub](https://identity.azurestaticapps.net/.auth/purge/github)
* [AAD](https://identity.azurestaticapps.net/.auth/purge/aad)

## Next steps

* [Add search to your web site](/azure/search/tutorial-javascript-overview)