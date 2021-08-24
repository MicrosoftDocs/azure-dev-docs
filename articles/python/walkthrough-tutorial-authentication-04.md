---
title: "Walkthrough, Part 4: Authenticate Python apps with Azure services"
description: An overview of the main app's implementation, including all its code.
ms.date: 08/24/2020
ms.topic: conceptual
ms.custom: devx-track-python
---

# Part 4: Example main application implementation

[Previous part: Example third-party API implementation](walkthrough-tutorial-authentication-03.md)

The main app in our scenario is a simple Flask app that's deployed to Azure App Service. The app provides a public API endpoint named */api/v1/getcode*, which generates a code for some other purpose in the app (say, with two-factor authentication for human users).

To see the endpoint in action, visit [https://msdocs-example-main-app.azurewebsites.net/api/v1/getcode](https://msdocs-example-main-app.azurewebsites.net/api/v1/getcode) in a browser or make a request using curl.

The main app also provides a simple home page that displays a link to the API endpoint. You can see this part of the app on [https://msdocs-example-main-app.azurewebsites.net](https://msdocs-example-main-app.azurewebsites.net).

The sample's provisioning script performs the following steps:

1. Create the App Service host and deploy the code with the Azure CLI command, [`az webapp up`](/cli/azure/webapp#az_webapp_up).

1. Provision an Azure Storage account for the main app (using [`az storage account create`](/cli/azure/storage/account#az_storage_account_create)).

1. Create a Queue in the storage account named "code-requests" (using [`az storage queue create`](/cli/azure/storage/queue#az_storage_queue_create)).

1. To ensure that the app is allowed to write to the queue, use [`az role assignment create`](/cli/azure/role/assignment#az_role_assignment_create) to assign the "Storage Queue Data Contributor" role to the app. For more information about roles, see [How to assign role permissions using the Azure CLI](/azure/role-based-access-control/role-assignments-cli).

The main app code is as follows; explanations of important details are given in the next parts of this series.

:::code language="python" source="~/../python-integrated-authentication/main_app/app.py":::

> [!div class="nextstepaction"]
> [Part 5 - Main app dependencies, imports, and environment variables >>>](walkthrough-tutorial-authentication-05.md)
