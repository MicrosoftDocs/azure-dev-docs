---
title: "Walkthrough, Part 4: Authenticate Python apps with Azure services"
description: An overview of the main app's implementation, including all its code.
ms.date: 05/28/2025
ms.topic: how-to
ms.custom: devx-track-python
---

# Part 4: Example main application implementation

[Previous part: Third-party API implementation](walkthrough-tutorial-authentication-03.md)

The main app in our scenario is a simple Flask app that's deployed to Azure App Service. The app provides a public API endpoint named */api/v1/getcode*, which generates a code for some other purpose in the app (for example, with two-factor authentication for human users). The main app also provides a simple home page that displays a link to the API endpoint.

The sample's provisioning script performs the following steps:

1. Create the App Service host and deploy the code with the Azure CLI command, [`az webapp up`](/cli/azure/webapp#az-webapp-up).

1. Create an Azure Storage account for the main app (using [`az storage account create`](/cli/azure/storage/account#az-storage-account-create)).

1. Create a Queue in the storage account named "code-requests" (using [`az storage queue create`](/cli/azure/storage/queue#az-storage-queue-create)).

1. To ensure that the app is allowed to write to the queue, use [`az role assignment create`](/cli/azure/role/assignment#az-role-assignment-create) to assign the "Storage Queue Data Contributor" role to the app. For more information about roles, see [How to assign role permissions using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

The main app code is as follows; explanations of important details are given in the next parts of this series.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py":::

> [!div class="nextstepaction"]
> [Part 5 - Dependencies and environment variables >>>](walkthrough-tutorial-authentication-05.md)
