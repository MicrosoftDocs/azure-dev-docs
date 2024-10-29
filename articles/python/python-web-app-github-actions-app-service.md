---
title: "GitHub Actions - Deploy Python app to App Service"
description: Use CI/CD with GitHub Actions to automatically build, test, and deploy Python web apps to Azure App Service on Linux.
ms.topic: how-to
ms.date: 10/29/2023
ms.custom: devx-track-python, devx-track-azurecli, linux-related-content
# CustomerIntent: As a python developer, I want to use CI/CD with GitHub Actions, so I can build, test, and deploy Python web apps to Azure App Service on Linux.
---

# Deploy Python web apps to App Service by using GitHub Actions (Linux)

This article describes how to use the continuous integration and continuous delivery (CI/CD) platform in GitHub Actions to deploy a Python web app to Azure App Service on Linux. Your GitHub Actions workflow automatically builds the code and deploys it to the App Service instance whenever there's a commit to the repository. You can add other automation in your GitHub Actions workflow, such as test scripts, security checks, and multistages deployment.

## Create repository for app code

To complete the procedures in this article, you need a Python web app committed to a GitHub repository.

- **Existing app**: To use an existing Python web app, make sure the app is committed to a GitHub repository.

- **New app**: If you need a new Python web app, you can fork and clone the https://github.com/Microsoft/python-sample-vscode-flask-tutorial GitHub repository. The sample code supports the [Flask in Visual Studio Code][1] tutorial, and provides a functioning Python application.

> [!NOTE]
> If your app uses [Django][20] and a [SQLite][21] database, it won't work for these procedures. If your Django app uses a separate database like PostgreSQL, you can use it. For more information, see [considerations for Django](#considerations-for-django) later in this article.

## Create target App Service instance

The quickest way to create an App Service instance is to use the [Azure command-line interface][15] (CLI) through the interactive [Azure Cloud Shell][16]. The Cloud Shell includes [Git][19] and the Azure CLI. In the following procedure, you use the [az webapp up][2] command to both create the App Service instance and do the initial deployment of your app.

1. Sign in to the Azure portal at https://portal.azure.com.

1. Open the Azure CLI by selecting the Cloud Shell option on the portal toolbar:

   :::image type="content" source="media/github-actions-app-service/azure-portal-cloud-shell-icon.png" alt-text="Screenshot that shows how to open Azure Cloud Shell by using the icon action on the Azure portal toolbar.":::

1. In Cloud Shell, select the **Bash** option from the dropdown menu:

   :::image type="content" source="media/github-actions-app-service/azure-portal-cloud-shell-bash.png" alt-text="Screenshot that shows how to select the Bash option in Cloud Shell.":::

1. In Cloud Shell, clone your repository by using the [git clone][17] command.

   > [!TIP]
   > To paste commands or text into Cloud Shell, use **Ctrl**+**Shift**+**V**, or right-click and select **Paste** from the context menu.

   - For the Flask sample app, you can use the following command. Replace the `<github-user>` portion with the name of the GitHub account where you forked the repo:

      ```bash
      git clone https://github.com/<github-user>/python-sample-vscode-flask-tutorial.git
      ```

   - If your app is in a different repo, set up GitHub Actions for the particular repo. Replace the `<github-user>` portion with the name of the GitHub account where you forked the repo, and provide the actual repo name in the `<repo-name>` placeholder:

      ```bash
      git clone https://github.com/<github-user>/<Repo-name>.git
      ```

   > [!NOTE]
   > Cloud Shell is backed by an Azure Storage account in a resource group named **cloud-shell-storage-\<your-region>**. That storage account contains an image of the Cloud Shell file system, which stores the cloned repository. There's a small cost for this storage. You can delete the storage account after you complete this article, along with other resources you create.

1. In Cloud Shell, change directory into the repository folder for your Python app, so the [az webapp up][2] command recognizes the app as Python. For the Flask sample app, you use the following command:

   ```bash
   cd python-sample-vscode-flask-tutorial
   ```

1. In Cloud Shell, use the [az webapp up][2] command to create an App Service instance and do the initial deployment for your app:

   ```bash
   az webapp up --name <app-service-name> --runtime "PYTHON:3.9"
   ```

   - For the `<app-service-name>` placeholder, specify an App Service name that's unique in Azure. The name must be 3-60 characters long and can contain only letters, numbers, and hyphens. The name must start with a letter and end with a letter or number.

   - For a list of available runtimes on your system, use the `az webapp list-runtimes` command.
   
   - When you enter the runtime value in the command, use the `PYTHON:X.Y` format, where `X.Y` is the Python major and minor version.

   - You can also specify the region location of the App Service instance by using the `--location` parameter. For a list of available locations, use the `az account list-locations --output table` command.

1. If your app has a custom startup script, use the [az webapp config][3] command to initiate the script.

   - If your app doesn't have a custom startup script, continue to the next step.

   - For the Flask sample app, you need to access the startup script in the *startup.txt* file by running the following command:

      ```bash
      az webapp config set \
        --resource-group <resource-group-name> \
        --name <app-service-name> \
        --startup-file startup.txt
      ```

      Provide your resource group name and App Service instance name in the `<resource-group-name>` and `<app-service-name>` placeholders. To find the resource group name, check the output from the previous `az webapp up` command. The resource group name includes the Azure account name followed by the *_rg* suffix,  *\<azure-account-name>\_rg\_*.

1. To view the running app, open a browser and go to the deployment endpoint for your App Service instance:

   ```html
   http://<app-service-name>.azurewebsites.net
   ```

   If you see a generic page, wait a few seconds for the App Service instance to start, and refresh the page.
   
   - If you continue to see a generic page, confirm you deployed from the correct folder.
   
   - For the Flask sample app, confirm you deployed from the *python-sample-vscode-flask-tutorial* folder. Also check that you set the startup command correctly.

## Set up continuous deployment in App Service

In the next procedure, you set up continuous delivery (CD), which means a new code deployment occurs whenever a workflow triggers. The trigger in the article example is any change to the _main_ branch of your repository, such as with a pull request (PR).

1. In Cloud Shell, confirm you're in the root directory for your system (`~`) and not in an app subfolder, such as *python-sample-vscode-flask-tutorial*. 

1. Add GitHub Actions with the [az webapp deployment github-actions add][4] command. Replace any placeholders with your specific values:

   ```bash
   az webapp deployment github-actions add \
     --repo "<github-user>/<github-repo>" \
     --resource-group <resource-group-name> \
     --branch <branch-name> \
     --name <app-service-name> \
     --login-with-github
   ```

   - The `--login-with-github` parameter uses an interactive method to retrieve a personal access token. Follow the prompts and complete the authentication.

   - If the system encounters an existing workflow file with the same App Service instance name, follow the prompts to choose whether to overwrite the workflow. You can use the `--force` parameter with the command to automatically overwrite any conflicting workflows.

   The `add` command completes the following tasks:

   * Creates a new workflow file at the *.github/workflows/\<workflow-name>.yml* path in your repo. The file name contains the name of your App Service instance.
   * Fetches a publish profile with secrets for your App Service instance and adds it as a GitHub action secret. The name of the secret begins with *AZUREAPPSERVICE\_PUBLISHPROFILE\_*. This secret is referenced in the workflow file.

1. Get the details of a source control deployment configuration with the [az webapp deployment source show][5] command. Replace the placeholder parameters with your specific values:

   ```bash
   az webapp deployment source show \
     --name <app-service-name> \
     --resource-group <resource-group-name>
   ```

1. In the command output, confirm the values for the `repoUrl` and `branch` properties. These values should match the values you specified with the `add` command.

## Examine GitHub workflow and actions

A workflow definition is specified in a YAML (*.yml*) file in the */.github/workflows/* path in your repository. This YAML file contains the various steps and parameters that make up the workflow, an automated process associated with a GitHub repository. You can build, test, package, release, and deploy any project on GitHub with a workflow. 

Each workflow is made up of one or more jobs, and each job is a set of steps. Each step is a shell script or an action. Each job has an **Action** section in the workflow file.

In terms of the workflow set up with your Python code for deployment to Azure App Service, the workflow has the following actions:

| Action | Description |
| --- | --- |
| [checkout][6]         | Check out the repository on a *runner*, a GitHub Actions agent. |
| [setup-python][7]     | Install Python on the runner. |
| [appservice-build][8] | Build the web app. |
| [webapps-deploy][9]   | Deploy the web app by using a publish profile credential to authenticate in Azure. The credential is stored in a [GitHub secret][10]. |

The workflow template used to create the workflow is [Azure/actions-workflow-samples][11].

The workflow is triggered on push events to the specified branch. The event and branch are defined at the beginning of the workflow file. For example, the following code snippet shows the workflow is triggered on push events to the *main* branch:

```yml
on:
  push:
    branches:
    - main
```

### OAuth authorized apps

When you set up continuous deployment, you authorize Azure App Service as an authorized OAuth App for your GitHub account. App Service uses the authorized access to create a GitHub action YAML file at the *.github/workflows/\<workflow-name>.yml* path in your repo.

- To see your authorized apps and revoke permissions under your GitHub accounts, go to **Settings** > **Integrations/Applications**:

:::image type="content" source="media/github-actions-app-service/github-authorized-oauth-apps.png" alt-text="Screenshot that shows how to view authorized OAuth Apps for a GitHub account.":::

### Workflow publish profile secret

In the *.github/workflows/\<workflow-name>.yml* workflow file added to your repo, there's a placeholder for publish profile credentials required for the deploy job of the workflow. The publish profile information is stored encrypted in the repository.

- To view the secret, go to **Settings** > **Security** > **Secret and variables** > **Actions**:

:::image type="content" source="media/github-actions-app-service/github-repo-action-secrets.png" alt-text="Screenshot that shows how to view action secrets for a repository in GitHub.":::

In this article, the GitHub action authenticates with a publish profile credential. There are other ways to authenticate, such as with a service principal or OpenID Connect. For more information, see [Deploy to App Service using GitHub Actions][12].

## Run and test workflow

The last step is to test the workflow by making a change to the repo.

1. In a browser, go to your fork of the sample repository (or the repository you used), and select the branch you set as part of the trigger:

   :::image type="content" source="media/github-actions-app-service/github-repo-make-small-change.png" alt-text="Screenshot that shows how to go to the repo and branch where GitHub Actions workflow is defined." lightbox="media/github-actions-app-service/github-repo-make-small-change.png":::

1. Make a small change to your Python web app.

   For the Flask tutorial, here's a simple change:

   1. Go to the */hello-app/templates/home.html* file of the trigger branch.
   
   1. Select **Edit** (pencil).
   
   1. In the Editor, locate the print `<p>` statement, and add the text "Redeployed!"

1. Commit the change directly to the branch you're working in.

   1. In the Editor, select **Commit changes** at the top right. The **Commit changes** window opens.
      
   1. In the **Commit changes** window, modify the commit message as desired, and select **Commit changes**.

   The commit process triggers the GitHub Actions workflow.

You can also trigger the workflow manually:

1. Go to the **Actions** tab of the repo set up for continuous deployment.

1. Select the workflow in the list of workflows, and then select **Run workflow**.

### Troubleshoot failed workflow

You can check the status of a workflow on the **Actions** tab for the app repo. When you examine the workflow file created in this article, you see two jobs: **build** and **deploy**. As a reminder, the workflow is based on the [Azure/actions-workflow-samples][11] template.

For a failed job, look at the output of job tasks for an indication of the failure.

Here are some common issues to investigate:

* If the app fails because of a missing dependency, then your *requirements.txt* file wasn't processed during deployment. This behavior happens if you created the web app directly on the portal rather than by using the `az webapp up` command as shown in this article.

* If you provisioned the app service through the portal, the build action `SCM_DO_BUILD_DURING_DEPLOYMENT` setting might not be set. This setting must be set to `true`. The `az webapp up` command sets the build action automatically.

* If you see an error message regarding "TLS handshake timeout," run the workflow manually by selecting **Trigger auto deployment** under the **Actions** tab of the app repo. You can determine if the timeout is a temporary issue.

* If you set up continuous deployment for the container app as shown in this article, the initial workflow file *.github/workflows/\<workflow-name>.yml* is created automatically for you. If you modified the file, remove the modifications to see if they're causing the failure.

## Run post-deployment script

A post-deployment script can complete several tasks, such as defining environment variables expected by the app code. You add the script as part of the app code and execute the script by using the startup command.

To avoid hard-coding variable values in your workflow YAML file, consider configuring the variables in GitHub and referring to the variable names in the script. You can create encrypted secrets for a repository or for an environment (account repository). For more information, see [Using secrets in GitHub Actions][10].

## Review Django considerations

As noted earlier in this article, you can use GitHub Actions to deploy Django apps to Azure App Service on Linux, if you use a separate database. You can't use a SQLite database because App Service locks the *db.sqlite3* file, which prevents both reads and writes. This behavior doesn't affect an external database.

The [Configure Python app on App Service - Container startup process][13] article describes how App Service automatically looks for a *wsgi.py* file within your app code, which typically contains the app object. When you used the `webapp config set` command to set the startup command, you used the `--startup-file` parameter to specify the file that contains the app object. The `webapp config set` command isn't available in the webapps-deploy action. Instead, you can use the `startup-command` parameter to specify the startup command. For example, the following code shows how to specify the startup command in the workflow file:

```yml
startup-command: startup.txt
```

When you use Django, you typically want to migrate the data models by using the `python manage.py migrate` command after you deploy the app code. You can run the migrate command in a post-deployment script.

## Disconnect GitHub Actions

Disconnecting GitHub Actions from your App Service instance allows you to reconfigure the app deployment. You can choose what happens to your workflow file after you disconnect, and whether to save or delete the file.

### [Azure CLI](#tab/azure-cli)

Disconnect GitHub Actions with the following Azure CLI [az webapp deployment github-actions remove][14] command. Replace any placeholders with your specific values:

```bash
az webapp deployment github-actions remove \
  --repo "<github-user>/<github-repo>" \
  --resource-group <resource-group-name> \
  --branch <branch-name> \
  --name <app-service-name> \
  --login-with-github
```

### [Azure portal](#tab/azure-portal)

In the Azure portal, go to your App Service instance, select **Deployment Center**, and then select **Disconnect** for the instance:

:::image type="content" source="media/github-actions-app-service/azure-portal-disconnect-github-actions.png" alt-text="Screenshot that shows how to disconnect GitHub Actions from an App Service instance in the Azure portal." lightbox="media/github-actions-app-service/azure-portal-disconnect-github-actions.png":::

---

## Clean up resources

To avoid incurring charges on the Azure resources created in this article, delete the resource group that contains the App Service instance and the App Service Plan.

### [Azure CLI](#tab/azure-cli)

Anywhere the Azure CLI is installed, including the Azure Cloud Shell, you can use the [az group delete][18] command to delete a resource group:

```bash
az group delete --name <resource-group-name>
```

### [Azure portal](#tab/azure-portal)

To delete a resource group in the Azure portal, search for the resource by name, and select the resource to go to the **Overview** page. On the **Overview** page, select **Delete resource group** and follow the prompts:

:::image type="content" source="media/github-actions-app-service/azure-portal-delete-resource-group.png" alt-text="Screenshot that shows how to delete a resource group in the Azure portal." lightbox="media/github-actions-app-service/azure-portal-delete-resource-group.png":::

---

### Delete storage account

To delete the storage account that maintains the file system for Cloud Shell, which incurs a small monthly charge, delete the resource group that begins with *cloud-shell-storage-*. If you're the only user of the group, it's safe to delete the resource group. If there are other users, you can delete a storage account in the resource group.

### Update GitHub account and repo

If you delete the Azure resource group, consider making the following modifications to the GitHub account and repo that was connected for continuous deployment:

* In the app repository, remove the *.github/workflows/\<workflow-name>.yml* file.
* In the app repository settings, remove the *AZUREAPPSERVICE\_PUBLISHPROFILE\_* secret key created for the workflow.
* In the GitHub account settings, remove Azure App Service as an authorized Oauth App for your GitHub account.

## Related content

- [Common repositories and workflows for GitHub Actions][22]
- [Command reference - az webapp deployment github-actions][23]

[1]: https://code.visualstudio.com/docs/python/tutorial-flask
[2]: /cli/azure/webapp#az-webapp-up
[3]: /cli/azure/webapp/config#az-webapp-config-set
[4]: /cli/azure/webapp/deployment/github-actions#az-webapp-deployment-github-actions-add
[5]: /cli/azure/webapp/deployment/source#az-webapp-deployment-source-show
[6]: https://github.com/actions/checkout
[7]: https://github.com/actions/setup-python
[8]: https://github.com/azure/appservice-build
[9]: https://github.com/azure/webapps-deploy
[10]: https://docs.github.com/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
[11]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/python-webapp-on-azure.yml
[12]: /azure/app-service/deploy-github-actions
[13]: /azure/app-service/containers/how-to-configure-python#container-startup-process
[14]: /cli/azure/webapp/deployment/github-actions#az-webapp-deployment-github-actions-remove
[15]: /cli/azure/what-is-azure-cli
[16]: /azure/cloud-shell/overview
[17]: https://git-scm.com/docs/git-clone
[18]: /cli/azure/group#az-group-delete
[19]: https://git-scm.com/
[20]: https://www.djangoproject.com/
[21]: https://sqlite.org/about.html
[22]: https://github.com/actions/
[23]: /cli/azure/webapp/deployment/github-actions