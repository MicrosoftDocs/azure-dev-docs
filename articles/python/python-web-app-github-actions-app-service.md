---
title: Use GitHub Actions to deploy a Python web app to Azure App Service on Linux
description: Use CI/CD with GitHub Actions to automatically build, test, and deploy Python web apps to Azure App Service on Linux.
ms.topic: conceptual
ms.date: 10/29/2022
ms.custom: devx-track-python
ms.prod: azure-python
---

# Use CI/CD with GitHub Actions to deploy a Python web app to Azure App Service on Linux

Use GitHub Actions continuous integration and continuous delivery (CI/CD) to deploy a Python web app to Azure App Service on Linux. Your GitHub Actions workflow automatically builds the code and deploys it to the App Service whenever there's a commit to the repository. You can add other functionalities in your GitHub action workflow, such as test scripts, security checks, and multistages deployment.

## Create a repository for your app code

If you already have a Python web app to use, make sure it's committed to a GitHub repository.

If you need an app to work with, you can fork and clone the repository at https://github.com/Microsoft/python-sample-vscode-flask-tutorial. The code is from the tutorial [Flask in Visual Studio Code][1].

> [!NOTE]
> If your app uses Django and a SQLite database, it won't work for this tutorial. If your Django app uses a separate database like PostgreSQL, you can use it with this tutorial. For more information about Django, see [considerations for Django](#considerations-for-django) later in this article.

## Create the target Azure App Service

The quickest way to create an App Service instance is to use the [Azure command-line interface][16] (CLI) through the interactive Azure Cloud Shell. In the following steps, you'll use [az webapp up][2] to both create the App Service and do the first deployment of your app. You'll use the CLI command in an [Azure Cloud Shell][17], which has the CLI installed and can be accessed in a browser.

**Step 1.** Sign in to the Azure portal at https://portal.azure.com.

**Step 2.** Open the Azure CLI by selecting the Cloud Shell button on the portal's toolbar.

:::image type="content" source="media/github-actions-app-service/azure-portal-cloud-shell-icon.png" alt-text="Screenshot showing how to open Azure Cloud Shell in Azure portal." lightbox="media/github-actions-app-service/azure-portal-cloud-shell-icon.png":::

**Step 3.** In the Cloud Shell, select Bash from the dropdown.

:::image type="content" source="media/github-actions-app-service/azure-portal-cloud-shell-bash.png" alt-text="Screenshot showing an Azure Cloud Shell Bash shell in Azure portal." lightbox="media/github-actions-app-service/azure-portal-cloud-shell-bash.png":::

**Step 4.** In the Cloud Shell, clone your repository using [git clone][18]. For the example app, use:

```bash
git clone https://github.com/<github-user>/python-sample-vscode-flask-tutorial
```

Replace \<github-user> with the name of the GitHub account where you forked the repo. If you are using a different repository, this is where you'll set up GitHub actions.

> [!NOTE]
> The Cloud Shell is backed by an Azure Storage account in a resource group called *cloud-shell-storage-\<your-region>*. That storage account contains an image of the Cloud Shell's file system, which stores the cloned repository. There's a small cost for this storage. You can delete the storage account at the end of this article, along with other resources you create.

**Step 5.** In the Cloud Shell, change directory into the repository folder that has your Python app, so the [az webapp up][2] command will recognize the app as Python. For the example app:

```bash
cd python-sample-vscode-flask-tutorial
```

**Step 6.** In the Cloud Shell, use [az webapp up][2] to create an App Service and initially deploy your app.

```bash
az webapp up -n <app-service-name>
```

> [!TIP]
> If you encounter a "Permission denied" error with a *.zip* file, you may have tried to run the command from a folder that doesn't contain a Python app. The `az webapp up` command then tries to create a Windows app service plan, and fails.

**Step 7.** If your app uses a custom startup command, set the [az webapp config][3] property. For example, the *python-sample-vscode-flask-tutorial* app contains a file named *startup.txt* that contains its specific startup command, so you set the `az webapp config` property to *startup.txt*.

* From the first line of output from the previous `az webapp up` command, copy the name of your resource group, which is similar to *\<your-name>_rg_<random_numbers>*.
* Enter the following command, using your resource group name, your app service name, and your startup file or command (*startup.txt*).

```bash
az webapp config set -g <resource-group-name> -n <app-service-name> --startup-file <startup-file-or-command>
```

**Step 8.** To see the running app, open a browser and go to *http://\<app-service-name>.azurewebsites.net*. If you see a generic page, wait a few seconds for the App Service to start, and refresh the page.

## Set up continuous deployment in App Service

In the steps below, you'll set up continuous deployment (CD), which means a new code deployment happens when a trigger is fired. The trigger in this tutorial is any change to the main branch of your repository, such as with a pull request (PR).

**Step 1.** Add GitHub Action with the [az webapp deployment github-actions add][4] command.

```bash
az webapp deployment github-actions add --repo "<github-user>/<github-repo>" -g <resource-group-name> -b <branch-name> -n <app-service-name> --login-with-github
```

The `--login-with-github` uses an interactive method to retrieves a personal access token. Follow the prompts to complete the authentication.

If there's an existing workflow file that conflicts with the name App Service used, add the `--force` option to overwrite that file.

What the command does:

* Creates new workflow file: *.github/workflows/\<workflow-name>.yml*; the name of the file will contain the name of your App Service.
* Fetches a publish profile with secrets for your App Service and add it as a GitHub as a secret. The name of the secret will start with AZUREAPPSERVICE_PUBLISHPROFILE_. This secret is referenced in the workflow file.

**Step 2.** Get the details of a source control deployment configuration with the [az webapp deployment source show][5] command.

```bash
az webapp deployment source show --name <app-service-name> --resource-group <resource-group-name>
```

## GitHub workflow and actions explained

A workflow is defined by a YAML (*.yml*) file in the */.github/workflows/* path in your repository. This YAML file contains the various steps and parameters that make up the workflow, an automated process that associated with a GitHub repository. You can build, test, package, release, and deploy any project on GitHub with a workflow.

Each workflow is made up of one or more jobs. Each job in turn is a set of steps. And finally, each step is a shell script or an action.

In terms of the workflow set up with your Python code for deployment to App Service, the workflow has the following actions:

|Action|Description|
|------|-----------|
|[checkout][6]|Check out the repository on a *runner*, a GitHub Actions agent.|
|[setup-python][7]|Install Python on the runner.|
|[appservice-build][8]|Builds the web app.|
|[webapps-deploy][9]|Deploys the web app using a publish profile credential to authenticate in Azure. The credential is stored in a [GitHub secret][10].|

The workflow template that is used to create the workflow check [Azure/actions-workflow-samples][11].

The workflow is triggered on push event to the specified branch, in this case main/master. The event is defined at the beginning of the workflow file.

```yml
on:
  push:
    branches:
    - master
```

### OAuth authorized apps

When you set up continuous deployment, you authorize Azure App Service  as an authorized OAuth App for your GitHub account. Container Apps uses the authorized access to create a GitHub action YML file in *.github/workflows/\<workflow-name>.yml*. You can see your authorized apps and revoke permissions under Integrations/Applications of your account.

[IMAGE]

### Workflow publish profile secret

In the *.github/workflows/\<workflow-name>.yml* workflow file that was added to the repo, you'll see a placeholder for publish profile credentials that are needed for the deploy job of the workflow. The publish profile information is stored encrypted in the repository **Settings**, under **Security/Actions**.

[IMAGE]

In this article, the GitHub action authenticates with a publish profile credential. There are other ways to authenticate such as with a service principal or OpenID Connect. For more information, see [Deploy to App Service using GitHub Actions][12].

## Run the workflow

Now you'll test the workflow by making a change to the repo.

**Step 1.** Go to your fork of the sample repository (or the repository you used) and select the branch you set as the trigger.

[IMAGE]

For example, if you used the VS Code Flask tutorial, you can

* Go to the /hello-app/templates/home.html file.
* Select **Edit** and add the text "Redeployed!".

**Step 3.** Commit the change directly to the branch you're working in.

* On the bottom of the page you editing, select the **Commit** button.
* The commit kicks off the GitHub action workflow.

> [!NOTE]
> We showed making a change directly in the main branch. In typical software workflows, you'll make a change in a branch other than main and then create a pull request (PR) to merge those change into main. PRs also kick off the workflow.

You can also kick off the workflow manually.

**Step 1.** Go to the **Actions** tab of the repo set up for continuous deployment.

**Step 2.** Select the workflow in the list of workflows and then select **Run workflow**.

### Troubleshooting a failed workflow

To check a workflow's status, go to the Actions tab of the repo. If there's a failed workflow, drill into its workflow file. There should be two jobs "build" and "deploy". For a failed job, look at the output of the job's tasks to look for problems.

* If your app fails because of a missing dependency, then your *requirements.txt* file wasn't processed during deployment. This behavior happens if you created the web app directly on the portal rather than using the `az webapp up` command as shown in this article.

* The `az webapp up` command specifically sets the build action SCM_DO_BUILD_DURING_DEPLOYMENT to true. If you provisioned the app service through the portal, however, this action isn't automatically set.

* If you see an error message with "TLS handshake timeout", run the workflow manually by selecting Trigger auto deployment under the Actions tab of the repo to see if the timeout is a temporary issue.

* If you set up continuous deployment for the container app as shown in this tutorial, the workflow file (*.github/workflows/\<workflow-name>.yml*) is initially created automatically for you. If you modified it, remove the modifications to see if they're causing the failure.

## Run a post-deployment script

A post-deployment script can, for example, define environment variables expected by the app code. Add the script as part of the app code and execute it using startup command.

To avoid hard-coding variable values in your workflow YML file, you can instead them in the GitHub web interface and then refer to the variable name in the script. You can create encrypted secrets for a repository or for an environment (account repository). For more information, see [Encrypted secrets in GitHub Docs][13].

## Considerations for Django

As noted earlier in this article, you can use GitHub Actions to deploy Django apps to Azure App Service on Linux, if you're using a separate database. You can't use a SQLite database, because App Service locks the db.sqlite3 file, preventing both reads and writes. This behavior doesn't affect an external database.

As described in the article [Configure Python app on App Service - Container startup process][14], App Service automatically looks for a *wsgi.py* file within your app code, which typically contains the app object. If you want to customize the startup command in any way, use the StartupCommand parameter in the AzureWebApp@1 step of your YAML pipeline file, as described in the previous section.

When using Django, you typically want to migrate the data models using manage.py migrate after deploying the app code. You can add startUpCommand with post-deployment script for this purpose:

```yml
startUpCommand: python3.7manage.pymigrate
```

## Disconnect GitHub Actions

Disconnecting GitHub Actions from your App Service allows you to reconfigure the app deployment. You can choose what happens to your workflow file after you disconnect, whether to save or delete the file.

Disconnecting with Azure CLI [az webapp deployment github-actions remote][15] command.

```bash
az webapp deployment github-actions remote --repo "<github-user>/<github-repo>" -g <resource-group-name> -b <branch-name> -n <app-service-name> --login-with-github
```

## Clean up resources

To avoid incurring charges on the Azure resources created in this tutorial, delete the resource group that contains the App Service and the App Service Plan.

### [Azure CLI](#tab/azure-cli-clean)

Anywhere the Azure CLI is installed including the Azure Cloud Shell, you can use the [az group delete][19] command to delete the resource group.

```bash
az group delete --name <resource-group-name>
```

### [Azure portal](#tab/azure-portal-clean)

To delete the resource group from the Azure portal, find the resources by searching for it's name and then in the **Overview** resource select **Delete resource group** and follow the prompts.

:::image type="content" source="media/github-actions-app-service/azure-portal-delete-resource-group.png" alt-text="Screenshot showing how to delete a resource group in Azure portal." lightbox="media/github-actions-app-service/azure-portal-delete-resource-group.png":::

---

To delete the storage account that maintains the file system for Cloud Shell, which incurs a small monthly charge, delete the resource group that begins with *cloud-shell-storage-*. If you are the only user of the group, it's safe to delete the resource group. If there are other users, you can delete the storage account from the resource group.

If you deleted the Azure resource group, consider also make the following modifications to the account and repo that was connected for continuous deployment:

* In the repository, remove the *.github/workflows/\<workflow-name>.yml* file.
* In the repository settings, remove the AZUREAPPSERVICE_PUBLISHPROFILE_ secret key created for the workflow.
* In the GitHub account settings, remove Azure App Service as an authorized Oauth App for your GitHub account.

[1]: https://code.visualstudio.com/docs/python/tutorial-flask
[2]: /cli/azure/webapp#az-webapp-up
[3]: /cli/azure/webapp/config#az-webapp-config-set
[4]: /cli/azure/webapp/deployment/github-actions#az-webapp-deployment-github-actions-add
[5]: /cli/azure/webapp/deployment/source#az-webapp-deployment-source-show
[6]: https://github.com/actions/checkout
[7]: https://github.com/actions/setup-python
[8]: https://github.com/azure/appservice-build
[9]: https://github.com/azure/webapps-deploy
[10]: https://docs.github.com/actions/reference/encrypted-secrets
[11]: https://github.com/Azure/actions-workflow-samples/blob/master/AppService/python-webapp-on-azure.yml
[12]: /azure/app-service/deploy-github-actions
[13]: https://docs.github.com/actions/security-guides/encrypted-secrets
[14]: /azure/app-service/containers/how-to-configure-python#container-startup-process
[15]: /cli/azure/webapp/deployment/github-actions#az-webapp-deployment-github-actions-remove
[16]: /cli/azure/what-is-azure-cli
[17]: /azure/cloud-shell/overview
[18]: https://git-scm.com/docs/git-clone
[19]: /cli/azure/group#az-group-delete