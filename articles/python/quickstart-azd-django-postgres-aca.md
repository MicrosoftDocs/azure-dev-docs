---
title: Deploy a new Django + PostgreSQL web app to Azure Container Apps using azd templates
description: Quickstart articles featuring the AZD template to help you get started with a complete project in 15 minutes.
ms.date: 8/18/2023
ms.topic: conceptual
ms.custom: devx-track-python
---

# Quickstart: Create and deploy a Django + PostgreSQL app to Azure Container Apps using an azd template

This quickstart guides you through the easiest and fastest way to create and deploy a Python web and database solution to Azure. By following the instructions in this quickstart, you will:

- Use CLI commands to run an azd template to create a sample web app and database, and create and configure the necessary Azure resources, then deploy the sample web app to Azure.
- Edit the web app on your local computer and use an azd command to redeploy.
- Use an azd command to clean up Azure resources.

It should take less than 15 minutes to complete this tutorial. Upon completion, you can start modifying the new project with your custom code.

To learn more about these azd templates for Python web app development:

- [What is this?](./quickstart-azd-templates.md#what-is-this)
- [How does this work?](./quickstart-azd-templates.md#how-does-it-work)
- [Why would I want to do this?](./quickstart-azd-templates.md#why-would-i-want-to-use-this)
- [What are my other options?](./quickstart-azd-templates.md#what-are-my-other-options)

## Prerequisites

Make sure you have an Azure account and available subscription.

You must have the following installed on your local computer:

- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd?tabs=winget-windows%2Cbrew-mac%2Cscript-linux&pivots=os-windows)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
  - [Docker for Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
  - [Dev Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Run the template

Running an azd template is the same across languages and frameworks. And, the same basic steps apply to all templates. The steps are:

1. At a terminal, navigate to a folder on your local computer where you typically store your local git repositories, then create a new folder named *azd-quickstart*. This will store the local git repository containing the project files. Then, change into that directory using the `cd` command.

   ```shell
   mkdir azd-quickstart
   cd azd-quickstart
   ```

   Do not use Visual Studio Code's Terminal for this quickstart.

2. To setup the local development environment, enter the following commands in your terminal and answer any prompts:

   ```shell
   azd init --template azure-django-postgres-aca
   ```

   When prompted for an environment name, use *azd-quickstart-dev* or any other
   name. This will be used when naming Azure resource groups and resources.

3. To authenticate azd to your Azure account, enter the following commands in your terminal and follow the prompt:

   ```shell
   azd auth login
   ```

   You'll be prompted to "Pick an account" or log into your Azure account. Once
   you have successfully authenticated, you will see a web page with the message:
   "Authentication complete. You can return to the application. Feel free to close
   this browser tab."

   When you close the tab, you'll see a message in your shell:

   ```shell
   Logged in to Azure.
   ```

4. To create the necessary Azure resources, enter the following commands in your
terminal and answer any prompts:

   ```shell
   azd up
   ```

   You'll be prompted to select an Azure Subscription to use for payment, then
   select an Azure location to use. Choose a region that is close to you geographically.

   Executing `azd up` could take several minutes since it's provisioning and
   deploying multiple Azure services. You'll see the progress. Look out for errors
   during this process. If you see errors, try the following:

   - Delete the *azd-quickstart* folder and the quickstart instructions from the beginning.
   - When prompted, choose a simpler name for your environment. Only use lower-case letters and dashes. No numbers, upper-case letters, or special characters.
   - Choose a different location.

   If you still have problems, see the Troubleshooting section at the bottom of this document.

5. When `azd up` completes successfully, you should see the following message.

   ```shell
   (✓) Done: Deploying service web
   - Endpoint: https://azd-quickstart-dev-ca.<Unique identifier>.eastus2.azurecontainerapps.io/

   SUCCESS: Your application was provisioned and deployed to Azure in 13 minutes 6 seconds.
   You can view the resources created under the resource group azd-quickstart-dev-rg in Azure Portal:
   https://portal.azure.com/#@/resource/subscriptions/<Unique identifier>/resourceGroups/azd-quickstart-dev-rg/overview
   ```

   Copy the first URL after the word `- Endpoint:` and paste it into the location
   bar of a web browser to see the sample Django project running live in Azure.

6. In a separate tab of your web browser, copy the second URL from the prevous step and paste it into
   the location bar of a web browser to see all of the services in your new
   resource group that have been deployed to host the sample Django project,
   including the database, a key value to securely keep important environment
   variables and connection information private, and more.

## Edit and redeploy

The next step is to make a small change to the Django app and then redeploy.

1. Open Visual Studio Code and open the *azd-quickstart* folder created earlier.

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

   Since you are using Dev Containers and are connected remotely into the container's shell, do not use Visual Studio Code's Terminal pane to run azd commands.

5. Once the command completes, refresh your web browser to see the update.

   You're now ready to edit and delete files in the template. For more information, see [What can I edit or delete in the template?](./quickstart-azd-templates.md#what-can-i-edit-or-delete)

## Clean up resources

1. Clean up the resources created by the template by running the [azd down](/azure/developer/azure-developer-cli/reference#azd-down) command.

   ```Shell
   azd down
   ```

   The `azd down` command deletes the Azure resources and the GitHub Actions workflow.

   You may also delete the *azd-quickstart* folder, or use it as the basis for your own application by modifying the files of the project.

## Troubleshooting

See the [FAQ](./quickstart-azd-templates.md#frequently-asked-questions) for a list of possible issues and solutions.

## Next steps

- [Learn more about the Python azd templates](./quickstart-azd-templates.md)
- [Learn more about the `azd` commands.](./quickstart-azd-templates.md#how-does-it-work)
- Learn what each of the folders and files in the project do and [what you can edit or delete?](./quickstart-azd-templates.md#what-can-i-edit-or-delete)
- [Learn more about Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers).
- Update the Bicep templates to add or remove Azure services. Don't know Bicep? Try this [Learning Path: Fundamentals of Bicep](/training/paths/fundamentals-bicep/)
- [Use azd to set up a GitHub Actions CI/CD pipeline to redeploy on merge to main branch](./quickstart-azd-templates.md)
- Set up monitoring so that you can [Monitor your app using the Azure Developer CLI](/azure/developer/azure-developer-cli/monitor-your-app)