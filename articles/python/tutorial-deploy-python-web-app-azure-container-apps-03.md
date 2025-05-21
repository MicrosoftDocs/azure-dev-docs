---
title: Configure CI/CD for a Python Web App in Azure Container Apps
description: Set up CI/CD for a Python web app container in Azure Container Apps by using GitHub Actions triggered on changes (like pull requests) to the main branch of a repo.
ms.topic: tutorial
ms.date: 1/03/2025
ms.custom: devx-track-python
---

# Tutorial: Configure continuous deployment for a Python web app in Azure Container Apps

This article is part of a tutorial series about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enables you to deploy containerized apps without managing complex infrastructure.

In this tutorial, you:

> [!div class="checklist"]
>
> * Configure continuous deployment for a container app by using a [GitHub Actions][20] workflow.
> * Make a change to a copy of the sample repository to trigger the GitHub Actions workflow.
> * Troubleshoot problems that you might encounter with configuring continuous deployment.
> * Remove resources that you don't need when you finish the tutorial series.

Continuous deployment is related the DevOps practice of continuous integration and continuous delivery (CI/CD), which is automation of your app development workflow.

The following diagram highlights the tasks in this tutorial.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png" alt-text="Diagram of services involved in deploying a Python app on Azure Container Apps, with the parts about continuous deployment highlighted." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png":::

## Prerequisites

To set up continuous deployment, you need:

* The resources (and their configuration) that you created in the [previous tutorial](./tutorial-deploy-python-web-app-azure-container-apps-02.md), which includes an instance of [Azure Container Registry][9] and a container app in [Azure Container Apps][8].

* A GitHub account where you forked the sample code ([Django][1] or [Flask][2]) and that you can connect to from Azure Container Apps. (If you downloaded the sample code instead of forking, be sure to push your local repo to your GitHub account.)

* Optionally, [Git][14] installed in your development environment to make code changes and push to your repo in GitHub. Alternatively, you can make the changes directly in GitHub.

## Configure continuous deployment for a container

In the previous tutorial, you created and configured a container app in Azure Container Apps. Part of the configuration was pulling a Docker image from an Azure Container Registry instance. The container image is pulled from the registry when you create a container [revision][5], such as when you first set up the container app.

In this section, you set up continuous deployment by using a GitHub Actions workflow. With continuous deployment, a new Docker image and container revision are created based on a trigger. The trigger in this tutorial is any change to the *main* branch of your repository, such as with a pull request. When the workflow is triggered, it creates a new Docker image, pushes it to the Azure Container Registry instance, and updates the container app to a new revision by using the new image.

### [Azure CLI](#tab/azure-cli)

You can run Azure CLI commands in [Azure Cloud Shell][4] or on a workstation where [Azure CLI][7] is installed.

If you're running commands in a Git Bash shell on a Windows computer, enter the following command before proceeding:

```bash
export MSYS_NO_PATHCONV=1
```

1. Create a [service principal][21] by using the [az ad sp create-for-rbac][10] command:

    ```azurecli
    az ad sp create-for-rbac \
    --name <app-name> \
    --role Contributor \
    --scopes "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>"
    ```

    In the command:

    * *\<app-name>* is an optional display name for the service principal. If you leave off the `--name` option, a GUID is generated as the display name.
    * *\<subscription-ID>* is the GUID that uniquely identifies your subscription in Azure. If you don't know your subscription ID, you can run the [az account show](/cli/azure/account#az-account-show) command and copy it from the `id` property in the output.
    * *\<resource-group-name>* is the name of a resource group that contains the Azure Container Apps container. Role-based access control (RBAC) is on the resource group level. If you followed the steps in the previous tutorial, the name of the resource group is `pythoncontainer-rg`.

    Save the output of this command for the next step. In  particular, save the client ID (`appId` property), client secret (`password` property), and tenant ID (`tenant` property).

1. Configure GitHub Actions by using the [az containerapp github-action add][11] command:

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

    In the command:

    * *\<resource-group-name>* is the name of the resource group. In this tutorial, it's `pythoncontainer-rg`.
    * *\<https://github.com/userid/repo>* is the URL of your GitHub repository. In this tutorial, it's either `https://github.com/userid/msdocs-python-django-azure-container-apps` or `https://github.com/userid/msdocs-python-flask-azure-container-apps`. In those URLs, `userid` is your GitHub user ID.
    * *\<registry-name>* is the existing Azure Container Registry instance that you created in the previous tutorial, or one that you can use.
    * *\<client-id>* is the value of the `appId` property from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form `00000000-0000-0000-0000-00000000`.
    * *\<tenant-id>* is the value of the `tenant` property from the previous `az ad sp create-for-rbac` command. The ID is also a GUID that's similar to the client ID.
    * *\<client-secret>* is the value of the `password` property from the previous `az ad sp create-for-rbac` command.

### [Azure portal](#tab/azure-portal)

1. In the [Azure portal][3], go to the container app that you want to configure continuous deployment for. On the service menu, select **Continuous deployment**.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-signin-github.png" alt-text="Screenshot that shows the continuous deployment resource of a container app in the Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-signin-github.png":::

1. Authorize Azure Container Apps to access your GitHub account:

    1. Select **Sign in with GitHub**.
    1. In the authorization dialog, select **Authorize AzureAppService**.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-authorize-github.png" alt-text="Screenshot that shows the dialog for authorizing Azure Container Apps to access a repo in the Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-authorize-github.png":::

    > [!TIP]
    > You can revoke Container Apps access to the GitHub account from your account's security section.

1. Configure the details of the continuous deployment:

    * **Organization**: Use your GitHub username.
    * **Repository**: Select the fork of the sample app. (If you originally downloaded the sample code to your developer environment, push the repo to GitHub.)
    * **Branch**: Select **main**.
    * **Repository source**: Select **Azure Container Registry**.
    * **Registry**: Select the Azure Container Registry instance that you created in the previous tutorial.
    * **Image**: Select the Docker image name. In this tutorial, it's **python-container-app**.
    * **Service principal**: Leave **Create new** and let the creation process create a new service principal.

    Select **Start continuous deployment** to finish the configuration.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration.png" alt-text="Screenshot that shows the configuration of an Azure container app in the Azure portal." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration.png":::

1. Review the information about the continuous deployment.

    The information includes a link to the created GitHub Actions workflow file. Azure Container Apps checked in the file to your repo.

    :::image type="content" source="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration-finish.png" alt-text="Screenshot that shows an Azure container app configured for continuous deployment with GitHub Actions." lightbox="media/tutorial-container-apps/azure-portal-continuous-deployment-configuration-finish.png":::

---

In the configuration of continuous deployment, a [service principal][21] enables GitHub Actions to access and modify Azure resources. The roles assigned to the service principal restrict access to resources. The service principal was assigned the built-in [Contributor][12] role on the resource group that contains the container app.

If you followed the steps for the portal, the service principal was automatically created for you. If you followed the steps for the Azure CLI, you explicitly created the service principal before you configured continuous deployment.

## Redeploy the web app with GitHub Actions

In this section, you make a change to your forked copy of the sample repository. After that, you can confirm that the change is automatically deployed to the website.

If you haven't already, make a [fork][13] of the sample repository ([Django][1] or [Flask][2]). You can make your code change directly in [GitHub][17] or in your development environment from a command line with [Git][14].

### [GitHub](#tab/git-github)

1. Go to your fork of the sample repository and start in the *main* branch.

    :::image type="content" source="media/tutorial-container-apps/github-view-repo.png" alt-text="Screenshot that shows the main branch in a fork of the sample repo." lightbox="media/tutorial-container-apps/github-view-repo.png":::

1. Make a change:

    1. Go to the */templates/base.html* file. (For Django, the path is *restaurant_review/templates/restaurant_review/base.html*.)
    1. Select **Edit** and change the phrase `Azure Restaurant Review` to `Azure Restaurant Review - Redeployed`.

    :::image type="content" source="media/tutorial-container-apps/github-edit-file.png" alt-text="Screenshot that shows how to make a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-edit-file.png":::

1. On the bottom of the page you're editing, make sure that **Commit directly to the main branch** is selected. Then select the **Commit changes** button.

    :::image type="content" source="media/tutorial-container-apps/github-commit-change.png" alt-text="Screenshot that shows selections for committing a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-commit-change.png":::

The commit kicks off the GitHub Actions workflow.

### [Command line](#tab/git-commandline)

If you haven't already, use `git clone` to pull your forked repository to your development environment and change directory to the repository. Then take the following steps:

1. Start in *main*:

    ```console
    git checkout main
    git pull
    ```

1. Make a change.

    Go to the *./templates/base.html* file (*./restaurant_review/templates/restaurant_review/base.html* for Django) and change the phrase `Azure Restaurant Review` to `Azure Restaurant Review - Redeployed`.

1. Commit and push the change to GitHub:

    ```console
    git commit -a -m "Redeploy with title change."
    git push
    ```

The first time that you use Git, you might need to set the global variables `user.name` and `user.email`. For more information, see the [help for git-config][16].

The push of changes to the *main* branch kicks off the GitHub Actions workflow.

---

> [!NOTE]
> This tutorial shows making a change directly in the *main* branch. In typical software workflows, you make a change in a branch other than *main* and then create a pull request to merge the change into *main*. Pull requests also kick off the workflow.

## Understand GitHub Actions

### Viewing workflow history

If you need to view the workflow history, use one of the following procedures.

### [GitHub](#tab/git-github)

On [GitHub][17], go to your fork of the sample repository and open the **Actions** tab.

:::image type="content" source="media/tutorial-container-apps/github-check-action.png" alt-text="Screenshot that shows workflows on the Actions tab for a repo." lightbox="media/tutorial-container-apps/github-check-action.png":::

### [Command line](#tab/git-commandline)

These steps use the [GitHub CLI][18].

1. Get a summary of your workflow. Run the following command in folder that contains your clone:

    ```console
    gh workflow view
    ```

    This command prompts you to select a workflow and then gives an overview of recent runs of that workflow.

    > [!NOTE]
    > The first time that you use `gh`, you might be prompted to authenticate. Follow the GitHub CLI prompts to authenticate.
    >
    > If you have more than one remote configured, you might be asked to run `gh repo set-default` to select a default remote repository. Select your fork from the presented options.
    >
    > You can run the `gh workflow view` command from any folder without the need to set a default repository by adding the `--repo [HOST/]OWNER/REPO` parameter.

1. Go to GitHub for details of a workflow run:

    ```console
    gh workflow view --web
    ```

---

### Workflow secrets

The *.github/workflows/\<workflow-name>.yml* workflow file that was added to the repo includes placeholders for credentials that are needed for the build and container app update jobs of the workflow. The credential information is stored encrypted in the repository's **Settings** area, under **Security** > **Secrets and variables** > **Actions**.

:::image type="content" source="media/tutorial-container-apps/github-repo-action-secrets.png" alt-text="Screenshot that shows credentials as GitHub Actions secrets." lightbox="media/tutorial-container-apps/github-repo-action-secrets.png":::

If credential information changes, you can update it here. For example, if the Azure Container Registry passwords are regenerated, you need to update the `REGISTRY_PASSWORD` value. For more information, see [Encrypted secrets][19] in the GitHub documentation.

### OAuth authorized apps

When you set up continuous deployment, you designate Azure Container Apps as an authorized OAuth app for your GitHub account. Container Apps uses the authorized access to create a GitHub Actions YAML file in *.github/workflows/\<workflow-name>.yml*. You can view your authorized apps, and revoke permissions in your account, under **Integrations** > **Applications**.

:::image type="content" source="media/tutorial-container-apps/github-authorized-oauth-apps.png" alt-text="Screenshot that shows the location of authorized apps for a user in GitHub." lightbox="media/tutorial-container-apps/github-authorized-oauth-apps.png":::

## Troubleshoot

### You get errors while setting up a service principal via the Azure CLI

This section can help you troubleshoot errors that you get while setting up a service principal by using the Azure CLI `az ad sp create-for-rba` command.

If you get an error that contains "InvalidSchema: No connection adapters were found":

* Check the shell that you're running in. If you're using a Bash shell, set the `MSYS_NO_PATHCONV` variables as `export MSYS_NO_PATHCONV=1`.

  For more information, see the GitHub issue [Unable to create service principal with Azure CLI from Git Bash shell][15].

If you get an error that contains "More than one application have the same display name":

* The name is already taken for the service principal. Choose another name, or leave off the `--name` argument. A GUID will be automatically generated as a display name.

### GitHub Actions workflow failed

To check a workflow's status, go to the **Actions** tab of the repo:

* If there's a failed workflow, drill into the workflow file. There should be two jobs: build and deploy. For a failed job, check the output of the job's tasks to look for problems.
* If there's an error message that contains "TLS handshake timeout," run the workflow manually. In the repo, on the **Actions** tab, select **Trigger auto deployment** to see if the timeout is a temporary issue.
* If you set up continuous deployment for the container app as shown in this tutorial, the workflow file (*.github/workflows/\<workflow-name>.yml*) is created automatically for you. You shouldn't need to modify this file for this tutorial. If you did, revert your changes and try the workflow.

### Website doesn't show changes that you merged in the main branch

In GitHub:

* Check that the GitHub Actions workflow ran and that you checked the change into the branch that triggers the workflow.

In the Azure portal:

* Check the Azure Container Registry instance to see if a new Docker image was created with a time stamp after your change to the branch.
* Check the logs of the container app to see if there's a programming error:

  1. Go to the container app, and then go to **Revision Management** > *\<active container>* > **Revision details** > **Console logs**.
  1. Choose the order of the columns to show **Time Generated**, **Stream_s**, and **Log_s**.
  1. Sort the logs by most recent and look for Python `stderr` and `stdout` messages in the **Stream_s** column. Python `print` output is `stdout` messages.

In the Azure CLI:

* Use the [az containerapp logs show][26] command.

### You want to stop continuous deployment

Stopping continuous deployment means disconnecting your container app from your repo.

In the Azure portal:

* Go to the container app. On the service menu, select **Continuous deployment**, and then select **Disconnect**.

In the Azure CLI:

* Use the [az container app github-action remove][6] command.

After you disconnect:

* The *.github/workflows/\<workflow-name>.yml* file is removed from your repo.
* Secret keys aren't removed from the repo.
* Azure Container Apps remains as an authorized OAuth app for your GitHub account.
* In Azure, the container is left with the last deployed container. You can reconnect the container app with the Azure Container Registry instance, so that new container revisions pick up the latest image.
* In Azure, service principals that you created and used for continuous deployment aren't deleted.

## Remove resources

If you're done with the tutorial series and you don't want to incur extra costs, remove the resources that you used.

Removing a resource group removes all resources in the group and is the fastest way to remove resources. For an example of how to remove resource groups, see [Containerize tutorial cleanup][25].

## Related content

If you plan to build on this tutorial, here are some next steps that you can take:

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
