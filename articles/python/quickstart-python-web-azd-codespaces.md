---
title: Create and deploy a Python web app from GitHub Codespaces to Azure using an azd template
description: Quickstart article featuring the use of GitHub Codespaces to create and publish an azd template.
ms.date: 2/28/2026
ms.topic: quickstart
ms.custom: devx-track-python, devx-track-extended-azdevcli
---

# Quickstart: Create and deploy a Python web app from GitHub Codespaces to Azure using an Azure Developer CLI template

This quickstart guides you through the easiest and fastest way to create and deploy a Python web and database solution to Azure. By following the instructions in this quickstart, you:

- Choose an [Azure Developer CLI](./overview-azd-templates.md) (`azd`) template based on the Python web framework, Azure database platform, and Azure web hosting platform you want to build on.
- Create a new GitHub Codespace containing code generated from the `azd` template you selected.
- Use GitHub Codespaces and the online Visual Studio Code's bash terminal. The terminal allows you to use Azure Developer CLI commands to run an `azd` template to create a sample web app and database, and create and configure the necessary Azure resources, then deploy the sample web app to Azure.
- Edit the web app in a GitHub Codespace and use an `azd` command to redeploy.
- Use an `azd` command to clean up Azure resources.
- Close and reopen your GitHub Codespace.
- Publish your new code to a GitHub repository.

It should take less than 25 minutes to complete this tutorial. Upon completion, you can start modifying the new project with your custom code.

To learn more about these `azd` templates for Python web app development, see:

- [What are these templates?](./overview-azd-templates.md#what-are-the-python-web-azd-templates)
- [How do the templates work?](./overview-azd-templates.md#how-do-the-templates-work)
- [Why would I want to use this?](./overview-azd-templates.md#why-would-i-want-to-use-this)
- [What are my other options?](./overview-azd-templates.md#what-are-my-other-options)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
- A GitHub Account - [Create one for free](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home)

> [!IMPORTANT]
> Both GitHub Codespaces and Azure are paid subscription based services. After some free allotments, you might be charged for using these services. Following this quickstart could affect these allotments or billing. When possible, the `azd` templates use the least expensive tier of options, but some might not be free. Use the [Azure Pricing calculator](https://azure.microsoft.com/pricing/calculator/) to better understand the costs. For more information, see [GitHub Codespaces pricing](https://docs.github.com/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces) for more details.

## Choose a template and create a codespace

Choose an `azd` template based on the Python web framework, Azure web hosting platform, and Azure database platform you want to build on.

1. From the following list of templates, choose one that uses the technologies you want to use in your new web application.

   # [Django](#tab/django)

   |Template|Web Framework|Database|Hosting Platform|New Codespace|
   |----------|----------|----------|----------|----------|
   |azure-django-postgres-flexible-aca|Django|PostgreSQL Flexible Server|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-django-postgres-flexible-aca?quickstart=1)|
   |azure-django-postgres-flexible-appservice|Django|PostgreSQL Flexible Server|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-django-postgres-flexible-appservice?quickstart=1)|
   |azure-django-cosmos-postgres-aca|Django|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-django-cosmos-postgres-aca?quickstart=1)|
   |azure-django-cosmos-postgres-appservice|Django|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-django-cosmos-postgres-appservice?quickstart=1)|
   |azure-django-postgres-addon-aca|Django|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-django-postgres-addon-aca?quickstart=1)|

   # [FastAPI](#tab/fastapi)

   |Template|Web Framework|Database|Hosting Platform|New Codespace|
   |----------|----------|----------|----------|----------|
   |azure-fastapi-postgres-flexible-aca|FastAPI|PostgreSQL Flexible Server|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-fastapi-postgres-flexible-aca?quickstart=1)|
   |azure-fastapi-postgres-flexible-appservice|FastAPI|PostgreSQL Flexible Server|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-fastapi-postgres-flexible-appservice?quickstart=1)|
   |azure-fastapi-cosmos-postgres-aca|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-fastapi-cosmos-postgres-aca?quickstart=1)|
   |azure-fastapi-cosmos-postgres-appservice|FastAPI|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-fastapi-cosmos-postgres-appservice?quickstart=1)|
   |azure-fastapi-postgres-addon-aca|FastAPI|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-fastapi-postgres-addon-aca?quickstart=1)|

   # [Flask](#tab/flask)

   |Template|Web Framework|Database|Hosting Platform|New Codespace|
   |----------|----------|----------|----------|----------|
   |azure-flask-postgres-flexible-aca|Flask|PostgreSQL Flexible Server|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-postgres-flexible-aca?quickstart=1)|
   |azure-flask-postgres-flexible-appservice|Flask|PostgreSQL Flexible Server|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-postgres-flexible-appservice?quickstart=1)|
   |azure-flask-cosmos-postgres-aca|Flask|Cosmos DB (PostgreSQL Adapter)|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-cosmos-postgres-aca?quickstart=1)|
   |azure-flask-cosmos-postgres-appservice|Flask|Cosmos DB (PostgreSQL Adapter)|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-cosmos-postgres-appservice?quickstart=1)|
   |azure-flask-postgres-addon-aca|Flask|Azure Container Apps PostgreSQL Add-on|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-postgres-addon-aca?quickstart=1)|
   |azure-flask-cosmos-mongodb-aca|Flask|Cosmos DB (MongoDB)|Azure Container Apps|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-cosmos-mongodb-aca?quickstart=1)|
   |azure-flask-cosmos-mongodb-appservice|Flask|Cosmos DB (MongoDB)|Azure App Service|[New Codespace](https://codespaces.new/Azure-Samples/azure-flask-cosmos-mongodb-appservice?quickstart=1)|

   ---

2. For your convenience, the last column of each table contains a link that creates a new Codespace and initializes the `azd` template in your GitHub account. Right-click the **New Codespace** link next to the template name you selected and select **Open in new tab** to initiate the setup process.

   During this process, you might be prompted to sign in to your GitHub account. You're also asked to confirm that you want to create the Codespace. Select the **Create Codespace** button to see the **Setting up your codespace** page.

3. After a few minutes, a web-based version of Visual Studio Code loads in a new browser tab with the Python web template loaded as a workspace in the Explorer view.

## Authenticate to Azure and deploy the azd template

Now that you have a GitHub Codespace containing the newly generated code, use the `azd` utility from within the Codespace to publish the code to Azure.

1. In the web-based Visual Studio Code, the terminal is open by default. If it isn't, use the tilde `~` key to open the terminal. By default, the terminal is a bash terminal. If it isn't, change to bash in the upper right hand area of the terminal window.

1. In the bash terminal, enter the following command:

   ```bash
   azd auth login
   ```

   `azd auth login` starts authenticating your Codespace to your Azure account.

   ```output
   Start by copying the next code: XXXXXXXXX
   Then press enter and continue to log in from your browser...
  
   Waiting for you to complete authentication in the browser...
   ```

1. Follow the instructions, which include:

   - Copying a generated code
   - Selecting **enter** to open a new browser tab and pasting the code into the text box
   - Choosing your Azure account from a list
   - Confirming that you're trying to sign in to Microsoft Azure CLI

1. When successful, the following message is displayed back in the Codespaces tab at the terminal:

   ```output
   Device code authentication completed.
   Logged in to Azure.
   ```

1. Deploy your new application to Azure by entering the following command:

   ```bash
   azd up
   ```

   During this process, you're asked to:

   - Enter a new environment name
   - Select an Azure Subscription to use [Use arrows to move, type to filter]
   - Select an Azure location to use: [Use arrows to move, type to filter]

   Once you answer those questions, the output from `azd` indicates the deployment is progressing.

   > [!IMPORTANT]
   > Once `azd up` completes successfully, the sample web app is available on the public internet and your Azure Subscription begins accruing charges for all resources that are created. The creators of the `azd` templates intentionally chose inexpensive tiers but not necessarily *free* tiers since free tiers often have restricted availability. When you finish working with the sample web app, use `azd down` to remove all of the services that `azd up` created.

   Follow the instructions when prompted to choose Azure Subscription to use for payment, then select an Azure location to use. Choose a region that is close to you geographically.

   Executing `azd up` can take several minutes since it's provisioning and deploying multiple Azure services. As progress is displayed, watch for errors. If you see errors, see the [Troubleshooting](#troubleshooting) section at the bottom of this document.

1. When `azd up` completes successfully, similar output is displayed:

   ```output
   (✓) Done: Deploying service web
   - Endpoint: https://xxxxx-xxxxxxxxxxxxx-ca.example-xxxxxxxx.westus.azurecontainerapps.io/

   SUCCESS: Your application was provisioned and deployed to Azure in 11 minutes 44 seconds.
   You can view the resources created under the resource group xxxxx-rg in Azure portal:
   https://portal.azure.com/#@/resource/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/xxxxx-rg/overview
   ```

   If you see a default screen or error screen, the app might be starting up. Wait 5-10 minutes to see if the issue resolves itself before troubleshooting.

   1. Ctrl + click the first URL after the word `- Endpoint:` to see the sample web app project running live in Azure.

1. Ctrl + click the second URL from the previous step to view the provisioned resources in the Azure portal.

## Edit and redeploy

Next, make a small change to the web app and then redeploy it.

1. Go back to the browser tab that contains Visual Studio Code. Use Visual Studio Code's Explorer view to go to the *src/templates* folder. Open the *index.html* file. Find the following line of code:

   ```html
   <h1 id="page-title">Welcome to ReleCloud</h1>
   ```

   Change the text inside the H1:

   ```html
   <h1 id="page-title">Welcome to ReleCloud - UPDATED</h1>
   ```

   Your code is saved as you type.

1. To redeploy the app with your change, run the following command in the terminal:

   ```bash
   azd deploy
   ```

1. When the command finishes, refresh the browser tab with the ReleCloud website to see the update. Depending on the web hosting platform you're using, it might take several minutes before your changes are visible.

   You're now ready to edit and delete files in the template. For more information, see [What can I edit or delete in the template?](./overview-azd-templates.md#what-can-i-edit-or-delete)

## Clean up resources

Clean up the resources that the template created by running the [azd down](/azure/developer/azure-developer-cli/reference#azd-down) command.

```bash
azd down
```

The `azd down` command deletes the Azure resources and the GitHub Actions workflow. When prompted, agree to deleting all resources associated with the resource group.

## Optional: Find your codespace

This section demonstrates how your code is temporarily running and persisted short-term in a Codespace. If you plan on continuing to work on the code, publish the code to a new repository.

1. Close all tabs related to this Quickstart article, or shut down your web browser entirely.

1. Open your web browser and a new tab, and go to [https://github.com/codespaces](https://github.com/codespaces).

1. Near the bottom, you see a list of recent Codespaces. Look for the one you created in a section titled "Owned by Azure-Samples".

1. Select the ellipsis to the right of this Codespace to view a context menu. From here you can rename the codespace, publish to a new repository, change machine type, stop the codespace, and more.

## Optional: Publish a GitHub repository from Codespaces

At this point, you have a Codespace, which is a container hosted by GitHub running your Visual Studio Code development environment with your new code generated from an `azd` template. However, the code isn't stored in a GitHub repository. If you plan on continuing to work on the code, prioritize storing it in a repository.

1. From the context menu for the codespace, select **Publish to a new repository**.
1. In the **Publish to a new repository** dialog, rename your new repo and choose whether you want it to be a public or private repo. Select **Create repository**.
1. After a few moments, the repository is created and the code you generated earlier in this Quickstart is pushed to the new repository. Select the **See repository** button to go to the new repo.
1. To reopen and continue editing code, select the green "< > Code" drop-down, switch to the **Codespaces** tab, and select the name of the Codespace you were working on previously. You return to your Codespace Visual Studio Code development environment.
1. Use the Source Control pane to create new branches and stage and commit new changes to your code.

## Troubleshooting

If you see errors during `azd up`, try the following steps:

- Run `azd down` to remove any resources that the command created. Alternatively, you can delete the resource group that you created in the Azure portal.
- Go to the Codespaces page for your GitHub account, find the Codespace created during this Quickstart, select the ellipsis at the right, and choose **Delete** from the context menu.
- In the Azure portal, search for Key Vaults. Select **Manage deleted vaults**, choose your subscription, select all key vaults that contain the name *azdtest* or whatever you named your environment, and select **Purge**.
- Retry the steps in this quickstart. This time when prompted, choose a simpler name for your environment. Try a short name, lowercase letters, no numbers, no uppercase letters, and no special characters.
- When retrying the quickstart steps, choose a different location.

For a more comprehensive list of possible issues and solutions, see the [FAQ](./overview-azd-templates.md#frequently-asked-questions).

## Related content

- [Learn more about the Python web `azd` templates](./overview-azd-templates.md)
- [Learn more about the `azd` commands](./overview-azd-templates.md#how-do-the-templates-work).
- Learn what each of the folders and files in the project do and [what you can edit or delete](./overview-azd-templates.md#what-can-i-edit-or-delete).
- [Learn more about GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart)
- [Update the Bicep templates to add or remove Azure services](./quickstart-python-scale-bicep.md). Don't know Bicep? Try this [Learning Path: Fundamentals of Bicep](/training/paths/fundamentals-bicep/)
- [Use `azd` to set up a GitHub Actions CI/CD pipeline to redeploy on merge to main branch](./overview-azd-templates.md)
- Set up monitoring so that you can [Monitor your app using the Azure Developer CLI](/azure/developer/azure-developer-cli/monitor-your-app)
