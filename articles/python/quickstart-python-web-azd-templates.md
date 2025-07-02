---
title: Create and deploy a Python web app to Azure using an azd template
description: Quickstart article featuring the use of an azd template to help you get started with a complete project in 15 minutes.
ms.date: 12/16/2024
ms.topic: quickstart
ms.custom: devx-track-python, devx-track-extended-azdevcli
---

# Quickstart: Create and deploy a Python web app to Azure using an azd template

This quickstart guides you through the easiest and fastest way to create and deploy a Python web and database solution to Azure. By following the instructions in this quickstart, you will:

- Choose an `azd` template based on the Python web framework, Azure database platform, and Azure web hosting platform you want to build on.
- Use CLI commands to run an `azd` template to create a sample web app and database, and create and configure the necessary Azure resources, then deploy the sample web app to Azure.
- Edit the web app on your local computer and use an `azd` command to redeploy.
- Use an `azd` command to clean up Azure resources.

It should take less than 15 minutes to complete this tutorial. Upon completion, you can start modifying the new project with your custom code.

To learn more about these `azd` templates for Python web app development:

- [What are these templates?](./overview-azd-templates.md#what-are-the-python-web-azd-templates)
- [How do the templates work?](./overview-azd-templates.md#how-do-the-templates-work)
- [Why would I want to do this?](./overview-azd-templates.md#why-would-i-want-to-use-this)
- [What are my other options?](./overview-azd-templates.md#what-are-my-other-options)

## Prerequisites

An Azure subscription - [Create one for free](https://azure.microsoft.com/free/?azure-portal=true)

You must have the following installed on your local computer:

- [Azure Developer CLI](../azure-developer-cli/install-azd.md?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Choose a template

Choose an `azd` template based on the Python web framework, Azure web hosting platform, and Azure database platform you want to build on.

1. Select a template name (first column) from the following list of templates in the following tables. You'll use the template name during the `azd init` step in the next section.

   # [Django](#tab/django)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-django-postgres-flexible-aca|Django|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-postgres-flexible-aca)|
   |azure-django-postgres-flexible-appservice|Django|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-django-postgres-flexible-appservice)|
   |azure-django-cosmos-postgres-aca|Django|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-cosmos-postgres-aca)|
   |azure-django-cosmos-postgres-appservice|Django|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-django-cosmos-postgres-appservice)|
   |azure-django-postgres-addon-aca|Django|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-django-postgres-addon-aca)|

   # [FastAPI](#tab/fastapi)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-fastapi-postgres-flexible-aca|FastAPI|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-aca)|
   |azure-fastapi-postgres-flexible-appservice|FastAPI|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-flexible-appservice)|
   |azure-fastapi-cosmos-postgres-aca|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-aca)|
   |azure-fastapi-cosmos-postgres-appservice|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-fastapi-cosmos-postgres-appservice)|
   |azure-fastapi-postgres-addon-aca|FastAPI|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-fastapi-postgres-addon-aca)|

   # [Flask](#tab/flask)

   |Template|Web Framework|Database|Hosting Platform|GitHub Repo|
   |----------|----------|----------|----------|----------|
   |azure-flask-postgres-flexible-aca|Flask|PostgreSQL Flexible Server|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-postgres-flexible-aca)|
   |azure-flask-postgres-flexible-appservice|Flask|PostgreSQL Flexible Server|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-postgres-flexible-appservice)|
   |azure-flask-cosmos-postgres-aca|Flask|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-aca)|
   |azure-flask-cosmos-postgres-appservice|Flask|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-postgres-appservice)|
   |azure-flask-postgres-addon-aca|Flask|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-postgres-addon-aca)|
   |azure-flask-cosmos-mongodb-aca|Flask|Cosmos DB (MongoDB)|Azure Container Apps|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-aca)|
   |azure-flask-cosmos-mongodb-appservice|Flask|Cosmos DB (MongoDB)|Azure App Service|[repo](https://github.com/Azure-Samples/azure-flask-cosmos-mongodb-appservice)|

   ---

   The GitHub repository (last column) is only provided for reference purposes. You should only clone the repository directly if you want to contribute changes to the template. Otherwise, follow the instructions in this quickstart to use the `azd` CLI to interact with the template in a normal workflow.

## Run the template

Running an `azd` template is the same across languages and frameworks. And, the same basic steps apply to all templates. The steps are:

1. At a terminal, navigate to a folder on your local computer where you typically store your local git repositories, then create a new folder named *azdtest*. Then, change into that directory using the `cd` command.

   ```shell
   mkdir azdtest
   cd azdtest
   ```

   Don't use Visual Studio Code's Terminal for this quickstart.

2. To set up the local development environment, enter the following commands in your terminal and answer any prompts:

   ```shell
   azd init --template <template name>
   ```

   Substitute `<template name>` with one of the templates from the [tables](#choose-a-template) you selected in a previous step, such as *azure-django-postgres-aca* for example.

   When prompted for an environment name, use *azdtest* or any other
   name. The environment name is used when naming Azure resource groups and resources. For
   best results, use a short name, lower case latters, no special characters.

3. To authenticate `azd` to your Azure account, enter the following commands in your terminal and follow the prompt:

   ```shell
   azd auth login
   ```

   Follow the instructions when prompted to "Pick an account" or log into your Azure account. Once
   you have successfully authenticated, the following message is displayed in a web page:
   "Authentication complete. You can return to the application. Feel free to close
   this browser tab."

   When you close the tab, the shell displays the message:

   ```output
   Logged in to Azure.
   ```

4. Ensure that Docker Desktop is open and running in the background before attempting the next step.

5. To create the necessary Azure resources, enter the following commands in your
terminal and answer any prompts:

   ```shell
   azd up
   ```

   >[!IMPORTANT]
   >Once `azd up` completes successfully, the sample web app will be available on the public internet and your Azure Subscription will begin accruing charges for all resources that are created. The creators of the `azd` templates intentionally chose inexpensive tiers but not necessarily *free* tiers since free tiers often have restricted availability.

   Follow the instructions when prompted to choose Azure Subscription to use for payment, then
   select an Azure location to use. Choose a region that is close to you geographically.

   Executing `azd up` could take several minutes since it's provisioning and
   deploying multiple Azure services. As progress is displayed, watch for errors. If you see errors, try the following to fix the problem:

   - Delete the *azd-quickstart* folder and the quickstart instructions from the beginning.
   - When prompted, choose a simpler name for your environment. Only use lower-case letters and dashes. No numbers, upper-case letters, or special characters.
   - Choose a different location.

   If you still have problems, see the [Troubleshooting](#troubleshooting) section at the bottom of this document.

   >[!IMPORTANT]
   >Once you have finished working with the sample web app, use `azd down` to remove all of the services that were created by `azd up`.

6. When `azd up` completes successfully, the following output is displayed:

   :::image type="content" source="media/quickstart-python-web-azd-templates/success-endpoint.png" alt-text="Screenshot of successful output from the azd command line interface with a callout around the endpoint URL to view the working Relecloud application deployed in Azure.":::

   Copy the first URL after the word `- Endpoint:` and paste it into the location
   bar of a web browser to see the sample web app project running live in Azure.

7. Open a new tab in your web browser, copy the second URL from the previous step and paste it into
   the location bar. The Azure portal displays all of the services in your new
   resource group that have been deployed to host the sample web app project.

## Edit and redeploy

The next step is to make a small change to the web app and then redeploy.

1. Open Visual Studio Code and open the *azdtest* folder created earlier.

2. This template is configured to optionally use Dev Containers. When you see the Dev Container notification appear in Visual Studio Code, select the "Reopen in Container" button.

3. Use Visual Studio Code's Explorer view to navigate to *src/templates* folder, and open the *index.html* file. Locate the following line of code:

   ```html
   <h1 id="pagte-title">Welcome to ReleCloud</h1>
   ```

   Change the text inside of the H1:

   ```html
   <h1 id="pagte-title">Welcome to ReleCloud - UPDATED</h1>
   ```

   Save your changes.

4. To redeploy the app with your change, in your terminal run the following command:

   ```Shell
   azd deploy
   ```

   Since you're using Dev Containers and are connected remotely into the container's shell, don't use Visual Studio Code's Terminal pane to run `azd` commands.

5. Once the command completes, refresh your web browser to see the update. Depending on the web hosting platform being used, it could take several minutes before your changes are visible.

   You're now ready to edit and delete files in the template. For more information, see [What can I edit or delete in the template?](./overview-azd-templates.md#what-can-i-edit-or-delete)

## Clean up resources

1. Clean up the resources created by the template by running the [`azd down`](/azure/developer/azure-developer-cli/reference#azd-down) command.

   ```Shell
   azd down
   ```

   The `azd down` command deletes the Azure resources and the GitHub Actions workflow.
   When prompted, agree to deleting all resources associated with the resource group.

   You may also delete the *azdtest* folder, or use it as the basis for your own application by modifying the files of the project.

## Troubleshooting

If you see errors during `azd up`, try the following steps:

- Run `azd down` to remove any resources that may have been created. Alternatively, you can delete the resource group that was created in the Azure portal.
- Delete the *azdtest* folder on your local computer.
- In the Azure portal, search for Key Vaults. Select to *Manage deleted vaults*, choose your subscription, select all key vaults that contain the name *azdtest* or whatever you named your environment, and select *Purge*.
- Retry the steps in this quickstart again. This time when prompted, choose a simpler name for your environment. Try a short name, lower-case letters, no numbers, no upper-case letters, no special characters.
- When retrying the quickstart steps, choose a different location.

See the [FAQ](./overview-azd-templates.md#frequently-asked-questions) for a more comprehensive list of possible issues and solutions.

## Related Content

- [Learn more about the Python web `azd` templates](./overview-azd-templates.md)
- [Learn more about the `azd` commands.](./overview-azd-templates.md#how-do-the-templates-work)
- Learn what each of the folders and files in the project do and [what you can edit or delete?](./overview-azd-templates.md#what-can-i-edit-or-delete)
- [Learn more about Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers).
- [Update the Bicep templates to add or remove Azure services](./quickstart-python-scale-bicep.md). Don't know Bicep? Try this [Learning Path: Fundamentals of Bicep](/training/paths/fundamentals-bicep/)
- [Use `azd` to set up a GitHub Actions CI/CD pipeline to redeploy on merge to main branch](./overview-azd-templates.md)
- Set up monitoring so that you can [Monitor your app using the Azure Developer CLI](/azure/developer/azure-developer-cli/monitor-your-app)
