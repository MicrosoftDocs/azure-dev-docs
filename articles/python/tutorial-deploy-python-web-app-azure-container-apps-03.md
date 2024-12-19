---
title: Configure CI/CD for a Python web app in Azure Container Apps
description: Set up CI/CD for a Python web app container in Azure Container Apps using GitHub Actions triggered on changes (like PRs) to the main branch of a repo.
ms.topic: conceptual
ms.date: 01/31/2024
ms.custom: devx-track-python
---

# Configure continuous deployment for a Python web app in Azure Container Apps

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enables you to deploy containerized apps without managing complex infrastructure.

In this part of the tutorial, you learn how to configure continuous deployment or delivery (CD) for the container app. CD is part of the DevOps practice of continuous integration / continuous delivery (CI/CD), which is automation of your app development workflow. Specifically, you use [GitHub Actions][20] for continuous deployment.

This service diagram highlights the components covered in this article: configuration of CI/CD.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Sections highlighted are parts related to continuous integration - continuous delivery (CI/CD)." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png":::

## Prerequisites

To set up continuous deployment, you need:

* The resources and their configuration created in the [previous article](./tutorial-deploy-python-web-app-azure-container-apps-02.md) of this tutorial series, which includes an [Azure Container Registry][9] and a container app in [Azure Container Apps][8].

* A GitHub account where you forked the sample code ([Django][1] or [Flask][2]) and you can connect to from Azure Container Apps. (If you downloaded the sample code instead of forking, make sure you push your local repo to your GitHub account.)

* Optionally, [Git][14] installed in your development environment to make code changes and push to your repo in GitHub. Alternatively, you can make the changes directly in GitHub.

## Configure CD for a container

In a previous article of this tutorial, you created and configured a container app in Azure Container Apps. Part of the configuration was pulling a Docker image from an Azure Container Registry. The container image is pulled from the registry when creating a container [*revision*][5], such as when you first set up the container app.

In this section, you set up continuous deployment using a GitHub Actions workflow. With continuous deployment, a new Docker image and container revision are created based on a trigger. The trigger in this tutorial is any change to the *main* branch of your repository, such as with a pull request (PR). When triggered, the workflow creates a new Docker image, pushes it to the Azure Container Registry, and updates the container app to a new revision using the new image.

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

If you're running commands in a Git Bash shell on a Windows computer, enter the following command before proceeding:

```bash
export MSYS_NO_PATHCONV=1
```

1. Create a [*service principal*][21] with the [az ad sp create-for-rbac][10] command.

    ```azurecli        
    az ad sp create-for-rbac \
    --name <app-name> \
    --role Contributor \
    --scopes "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>"
    ```

    Where: 
    * *\<app-name>* is an optional display name for the service principal. If you leave off the `--name` option, a GUID is generated as the display name.
    * *\<subscription-ID>* is the GUID that uniquely identifies your subscription in Azure. If you don't know your subscription ID, you can run the [az account show](/cli/azure/account#az-account-show) command and copy it from the `id` property in the output.
    * *\<resource-group-name>* is the name of a resource group that contains the Azure Container Apps container. Role-based access control (RBAC) is on the resource group level. If you followed the steps in the previous article in this tutorial, the resource group name is `pythoncontainer-rg`.

    Save the output of this command for the next step, in  particular, the client ID (`appId` property), client secret (`password` property), and tenant ID (`tenant` property).

1. Configure GitHub Actions with [az containerapp github-action add][11] command.

    ```azurecli
    az containerapp github-action add \
    --resource-group <resource-group-name> \
    --name python-container-app \
    --repo-url <https://github.com/userid/repo> \
    --branch main \
    --registry-url <registry-name>.azurecr.io \
    --service-principal-client-id <client-id> \
    --service-principal-tenant-id <tenant-id> \
    --service-principal-client-secret <client-secret> \
    --login-with-github
    ```

    Where:
    * *\<resource-group-name>* is the name of the resource group. If you're following this tutorial, it is "pythoncontainer-rg".
    * *\<https://github.com/userid/repo>* is the URL of your GitHub repository. If you're following the steps in this tutorial, it is either `https://github.com/userid/msdocs-python-django-azure-container-apps` or `https://github.com/userid/msdocs-python-flask-azure-container-apps`; where `userid` is your GitHub user ID.
    * *\<registry-name>* is the existing Container Registry you created for this tutorial, or one that you can use.
    * *\<client-id>* is the value of the `appId` property from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
    * *\<tenant-id>* is the value of the `tenant` property from the previous `az ad sp create-for-rbac` command. The ID is also a GUID similar to the client ID.
    * *\<client-secret>* is the value of the `password` property from the previous `az ad sp create-for-rbac` command.

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal][3], go to the Container App you want to configure continuous deployment for and select **Continuous deployment** on the **service menu**.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-signin-github.png" alt-text="Screenshot showing the continuous deployment resource of a Container App and where to sign in with GitHub in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-signin-github.png":::

1. Authorize Azure Container Apps to access your GitHub account.

    1. Select **Sign in with GitHub**.
    1. In the authorization pop-up, select **AuthorizeAppService**.

    Container App access to the GitHub account can be revoked by going to your account's security section and revoking access.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-authorize-github.png" alt-text="Screenshot showing authorizing Container App to access your repo in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-authorize-github.png":::

1. After sign-in with GitHub, configure the continuous deployment details.

    * **Organization** &rarr; Use your GitHub user name.
    * **Repository** &rarr; Select the fork of the sample app. (If you originally downloaded the sample code to your developer environment, push the repo to GitHub.)
    * **Branch** &rarr; Select *main*.
    * **Repository source** &rarr; Select **Azure Container Registry**.
    * **Registry** &rarr; Select the Azure Container Registry you created earlier in the tutorial.
    * **Image** &rarr; Select the Docker image name. If you're following the tutorial, it's "python-container-app".
    * **Service principal** &rarr; Leave **Create new** and let the creation process create a new service principal.

    Select **Start continuous deployment** to finish the configuration.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration.png" alt-text="Screenshot showing the configuration of an Azure Container App in Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration.png":::

1. Review the continuous deployment information.

    After continuous deployment is configured, you can find a link to the GitHub Actions workflow file created. Azure Container Apps checked in the file to your repo.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration-finish.png" alt-text="Screenshot showing the Azure Container App configured for continuous deployment with GitHub Actions." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration-finish.png":::

---

In the configuration of continuous deployment, a [*service principal*][21] is used to enable GitHub Actions to access and modify Azure resources. Access to resources is restricted by the roles assigned to the service principal. The service principal was assigned the built-in [*Contributor*][12] role on the resource group containing the container app.

If you followed the steps for the portal, the service principal was automatically created for you. If you followed the steps for the Azure CLI, you explicitly created the service principal first before configuring continuous deployment.

## Redeploy web app with GitHub Actions

In this section, you make a change to your forked copy of the sample repository and confirm that the change is automatically deployed to the web site.

If you haven't already, make a [fork][13] of the sample repository ([Django][1] or [Flask][2]). You can make your code change directly in [GitHub][17] or in your development environment from a command line with [Git][14].

### [GitHub](#tab/git-github)

1. Go to your fork of the sample repository and start in the *main* branch.

    :::image type="content" source="media/tutorial-container-apps/github-view-repo.png" alt-text="Screenshot showing a fork of the sample repo and starting in the main branch." lightbox="media/tutorial-container-apps/github-view-repo.png":::

1. Make a change.

    1. Go to the */templates/base.html* file. (For Django, the path is: *restaurant_review/templates/restaurant_review/base.html*.)
    1. Select **Edit** and change the phrase "Azure Restaurant Review" to "Azure Restaurant Review - Redeployed".

    :::image type="content" source="media/tutorial-container-apps/github-edit-file.png" alt-text="Screenshot showing how to make a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-edit-file.png":::

1. Commit the change directly to the *main* branch.

    * On the bottom of the page you editing, select the **Commit** button.
    * The commit kicks off the GitHub Actions workflow.

    :::image type="content" source="media/tutorial-container-apps/github-commit-change.png" alt-text="Screenshot showing how to commit a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-commit-change.png":::

### [Command line](#tab/git-commandline)

If you haven't already, use `git clone` to pull your forked repository to your development environment and change directory to the repository.

1. Start in *main*.

    ```console
    git checkout main
    git pull
    ```

1. Make a change.

    Go to the *./templates/base.html* file (*./restaurant_review/templates/restaruant_review/base.html* for Django) and change the phrase "Azure Restaurant Review" to "Azure Restaurant Review - Redeployed".

1. Commit and push the change to GitHub.

    ```console
    git commit -a -m "Redeploy with title change."
    git push
    ```

The first time using git, you might need to set global variables "user.name" and "user.email". For more information, see the help for [git-config][16].

The push of changes to the *main* branch kicks off the GitHub Actions workflow.

---

> [!NOTE]
> We showed making a change directly in the *main* branch. In typical software workflows, you'll make a change in a branch other than *main* and then create a pull request (PR) to merge those change into *main*. PRs also kick off the workflow.

## About GitHub Actions

### Viewing workflow history

### [GitHub](#tab/git-github)

On [GitHub][17], go to your fork of the sample repository and open the **Actions** tab.

:::image type="content" source="media/tutorial-container-apps/github-check-action.png" alt-text="Screenshot showing how to view GitHub Actions for a repo and look at workflows." lightbox="media/tutorial-container-apps/github-check-action.png":::

### [Command line](#tab/git-commandline)

These steps use the [GitHub CLI][18].

1. Get a summary of your workflow. Run the following command in folder that contains your clone:

    ```console
    gh workflow view
    ```

    This command prompts you to select a workflow and then gives an overview of recent runs of that workflow.

    > [!NOTE]
    > The first time using `gh` you may be prompted to authenticate. Follow the GitHub CLI prompts to authenticate.
    >
    > If you have more than one remote configured, you might be asked to run `gh repo set-default` to select a default remote repository. Select your fork from the options presented.
    >
    > You can run the `gh workflow view` command from any folder without the need to set a default repository by adding the `--repo [HOST/]OWNER/REPO` parameter.

1. Go to GitHub for details of run of workflow.

    ```console
    gh workflow view --web
    ```

---

### Workflow secrets

In the *.github/workflows/\<workflow-name>.yml* workflow file that was added to the repo, you'll see placeholders for credentials that are needed for the build and container app update jobs of the workflow. The credential information is stored encrypted in the repository **Settings** under **Security**/**Secrets and variables**/**Actions**.

:::image type="content" source="media/tutorial-container-apps/github-repo-action-secrets.png" alt-text="Screenshot showing how to see where GitHub Actions secrets are stored in GitHub." lightbox="media/tutorial-container-apps/github-repo-action-secrets.png":::

If credential information changes, you can update it here. For example, if the Azure Container Registry passwords are regenerated, you'll need to update the REGISTRY_PASSWORD value. For more information, see [Encrypted secrets][19] in the GitHub documentation.

### OAuth authorized apps

When you set up continuous deployment, you authorize Azure Container Apps as an authorized OAuth App for your GitHub account. Container Apps uses the authorized access to create a GitHub Actions YML file in *.github/workflows/\<workflow-name>.yml*. You can see your authorized apps and revoke permissions under **Integrations**/**Applications** of your account.

:::image type="content" source="media/tutorial-container-apps/github-authorized-oauth-apps.png" alt-text="Screenshot showing how to see the authorized apps for a user in GitHub." lightbox="media/tutorial-container-apps/github-authorized-oauth-apps.png":::

## Troubleshooting tips

Errors setting up a service principal with the Azure CLI `az ad sp create-for-rba` command.

* You receive an error containing "InvalidSchema: No connection adapters were found".
  * Check the shell you're running in. If using Bash shell, set the MSYS_NO_PATHCONV variables as follows `export MSYS_NO_PATHCONV=1`. For more information, see the GitHub issue [Unable to create service principal with Azure CLI from git bash shell, no connection adapters were found.][15].

* You receive an error containing "More than one application have the same display name".
  * This error indicates the name is already taken for the service principal. Choose another name or leave off the `--name` argument and a GUID will be automatically generated as a display name.

GitHub Actions workflow failed.

* To check a workflow's status, go to the **Actions** tab of the repo.
* If there's a failed workflow, drill into its workflow file. There should be two jobs "build" and "deploy". For a failed job, look at the output of the job's tasks to look for problems.
* If you see an error message with "TLS handshake timeout", run the workflow manually by selecting **Trigger auto deployment** under the **Actions** tab of the repo to see if the timeout is a temporary issue.
* If you set up continuous deployment for the container app as shown in this tutorial, the workflow file (*.github/workflows/\<workflow-name>.yml*) is created automatically for you. You shouldn't need to modify this file for this tutorial. If you did, revert your changes and try the workflow.

Website doesn't show changes you merged in the *main* branch.

* In GitHub: check that the GitHub Actions workflow ran and that you checked the change into the branch that triggers the workflow.
* In Azure portal: check the Azure Container Registry to see if a new Docker image was created with a timestamp after your change to the branch.
* In Azure portal: check the logs of the container app. If there's a programming error, you'll see it here.
  * Go to the Container App | Revision Management | \<active container> | Revision details | Console logs
  * Choose the order of the columns to show "Time Generated", "Stream_s", and "Log_s". Sort the logs by most-recent first and look for Python *stderr* and *stdout* messages in the "Stream_s" column. Python 'print' output will be *stdout* messages.
* With the Azure CLI, use the [az containerapp logs show][26] command.

What happens when I disconnect continuous deployment?

* Stopping continuous deployment means disconnecting your container app from your repo. To disconnect:

  1. In Azure portal, go the container app, select **Continuous deployment** on the **service menu**, then select **Disconnect**.
  1. With the Azure CLI, use the [az container app github-action remove][6] command.

* After disconnecting, in your GitHub repo:
  * The *.github/workflows/\<workflow-name>.yml* file is removed from your repo.
  * Secret keys aren't removed.
  * Azure Container Apps remains as an authorized OAuth App for your GitHub account.

* After disconnecting, in Azure:
  * The container is left with last deployed container. You can reconnect the container app with the Azure Container Registry, so that new container revisions pick up the latest image.
  * Service principals created and used for continuous deployment aren't deleted.

## Next steps

If you're done with the tutorial and don't want to incur extra costs, remove the resources used. Removing a resource group removes all resources in the group and is the fastest way to remove resources. For an example of how to remove resource groups, see [Containerize tutorial cleanup][25].

If you plan on building on this tutorial, here are some next steps you can take.

* [Set scaling rules in Azure Container Apps][22]

* [Bind custom domain names and certificates in Azure Container Apps][23]

* [Monitor an app in Azure Container Apps][24]

[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-apps
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-apps
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: /azure/container-apps/revisions
[6]: /cli/azure/containerapp/github-action#az-containerapp-github-action-delete
[7]: /cli/azure/install-azure-cli
[8]: /azure/container-apps/overview
[9]: /azure/container-registry/container-registry-intro
[10]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[11]: /cli/azure/containerapp/github-action#az-containerapp-github-action-add
[12]: /azure/role-based-access-control/built-in-roles#general
[13]: /azure/devops/repos/git/forks
[14]: https://git-scm.com/
[15]: https://github.com/Azure/azure-cli/issues/16317
[16]: https://git-scm.com/docs/git-config
[17]: https://github.com/
[18]: https://cli.github.com/
[19]: https://docs.github.com/actions/security-guides/encrypted-secrets
[20]: ../github/github-actions.md
[21]: /azure/active-directory/fundamentals/service-accounts-principal
[22]: /azure/container-apps/scale-app
[23]: /azure/container-apps/custom-domains-certificates
[24]: /azure/container-apps/monitor
[25]: ./tutorial-containerize-deploy-python-web-app-azure-05.md
[26]: /cli/azure/containerapp/logs#az-containerapp-logs-show
