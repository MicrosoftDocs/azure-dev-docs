---
title: Configure CI/CD for a Python web app in Azure Container Apps
description: Set up CI/CD for a Python web app container in Azure Container Apps using GitHub Actions triggered on changes (like PRs( to the main branch of a repo.
ms.topic: conceptual
ms.date: 09/21/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Configure continuous deployment for a Python web app in Azure Container Apps

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enable you to deploy containerized apps without managing complex infrastructure.

In this part of the tutorial, you learn how to configure continuous deployment or delivery (CD) for the container app. CD is part of the DevOps concept of continuous integration / continuous delivery (CI/CD), automation of your software development workflow. Specifically, you use [GitHub Actions][20] for continuous deployment.

The service diagram shown below highlights the components covered in this article: configuration of the CI/CD cycle.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Sections highlighted are parts related to continuous integration - continuous delivery (CI/CD)." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png":::

## Prerequisites

To set up continuous deployment, you'll need:

* The resources created in the previous article of this tutorial series, which includes an [Azure Container Registry][9] and a container app in [Azure Container Apps][8].

* A GitHub account where you forked the sample code ([Django][1] or [Flask][2]) and you can connect to from Azure Container Apps. (If you downloaded the sample code instead of forking, make sure you push your local repo to your GitHub account.)

* Optionally, [Git][14] installed in your development environment to make code changes and push to your repo in GitHub. Alternatively, you can make the changes directly in GitHub with a patch.

## Configure CD for the container

In a previous article of this tutorial, you created and configured a container app in Azure Container Apps. Part of the configuration was pulling a Docker image from an Azure Container Registry. The container image is pulled from the registry when creating a container [*revision*][5], such as when you first set up the container app.

In the steps below, you'll set up continuous deployment, which means a new container image is created based on a defined trigger. The trigger in this tutorial is any change to the *main* branch of a repository, such as with a pull request (PR). When triggered, the workflow creates a new container image, pushes it to the Azure Container Registry, and updates the container app to use the new image.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **Step 1.** In the [Azure portal][3], go to the Container App you want to configure continuous deployment for and select the **Continuous deployment** resource.
    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Sign into GitHub to authorize Azure Container Apps as an application that access the repo.

        Access can always be revoked by going to the repo's security section.

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Specify the repo details.

        * **Organization** &rarr; Your GitHub user name.
        * **Repository** &rarr; A fork of the sample app that is under your user name.
        * **Branch** &rarr; Select *main*. 

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 4.** Configure the Azure Container Registry where new container images will be pushed to.

        * **Name** &rarr; Specify the registry name.
        * **Image** &rarr; If following along in this tutorial, we've used "python-container-app".

    :::column-end:::
    :::column:::
        TBD
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 5.** Select **Create deployment** to configure.

        A few things are done automatically:

        * A [*service principal*][21] is created.
        * The service principal is added to the resource group containing the Container App, with role "Contributor".

    :::column-end:::
    :::column:::
    TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

:::row:::
    :::column span="1":::
        **Step 1.** Create a [*service principal*][21] with the [az ad sp create-for-rbac][10] command.

        ```bash        
        export MSYS_NO_PATHCONV=1
        az ad sp create-for-rbac \
        --name <app-name> \
        --role Contributor \
        --scopes "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>"
        ```

        Where: 
        * *\<app-name>* is an optional display name for the service principal. If you leave off the `--name` option, a GUID is generated as the display name.
        * *\<subscription-ID>* is the GUID that uniquely identifies your subscription in Azure.
        * *\<resource-group-name>* is the name of a resource group that contains the Azure Container Registry. Role-based access control (RBAC) is on the resource group level.

        Save the output of this command for the next step, in  particular, the client ID and client secret.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Configure a GitHub Action with [az containerapp github-action add][11] command.

        ```bash
        az containerapp github-action add \
        --resource-group <resource-group-name> \
        --name python-container-app \
        --repo-url https://github.com/userid/repo \
        --branch main \
        --registry-url <registry-name>.azurecr.io \
        --service-principal-client-id <client-id> \
        --service-principal-tenant-id <tenant-id> \
        --service-principal-client-secret <client-secret> \
        --login-with-github
        ```

        Where:
        * *\<resource-group-name>* is the name of the resource group.If you are following this tutorial, it is "pythoncontainer-rg".
        * *\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.
        * *\<client-id>* is a value from the previous `az ad sp` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<tenant-id>* is a value from the previous `az ad sp` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<client-secret>* is a value from the previous `az ad sp` command.

    :::column-end:::
:::row-end:::

---

In the steps to set up continuous deployment, a [*service principal*][21] is needed to access and modify Azure resources. If you followed the steps for the portal, the service principal was set up automatically for you. If you followed the steps for the Azure CLI, you explicitly created the service principal first before setting up continuous deployment.

Access to resources is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. In the steps above, that role used is the built-in [*Contributor*][12] role, and it was assigned to the resource group containing the container app.

## Redeploy web app with GitHub Actions

In this section, you'll make a small change to your forked copy of the sample repository and confirm that the change is automatically deployed to the web site.

If you haven't already, make a [fork][13] of the sample repository ([Django][1] or [Flask][2]). You can make your code change directly in [GitHub][17] or from you development environment from a command line with [Git][14].

### [GitHub](#tab/git-github)

:::row:::
    :::column span="2":::
        **Step 1.** Go to your fork of the sample repository and start in the *main* branch.
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-container-apps/github-view-repo.png" alt-text="Screenshot showing a fork of the sample repo and starting in the main branch." lightbox="media/tutorial-container-apps/github-view-repo.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 2.** Make a change.

        * Go to the  */templates/base.html* file.
        * Select **Edit** and change the phrase "Azure Restaurant Review" to "Azure Restaurant Review - Redeployed".

    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-container-apps/github-edit-file.png" alt-text="Screenshot showing how to make a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-edit-file.png":::
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="2":::
        **Step 3.** Commit the change directly to the *main* branch.

        * On the bottom of the page you editing, select the **Commit** button.
        * The commit kicks off the GitHub Actions workflow.

    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-container-apps/github-commit-change.png" alt-text="Screenshot showing how to commit a change in a template file in the fork of the sample repo." lightbox="media/tutorial-container-apps/github-commit-change.png":::
    :::column-end:::
:::row-end:::

### [Command line](#tab/git-commandline)

**Step 1.** Start in *main*.

```Bash
git checkout main
git pull
```

If you haven't already, use `git clone` to pull your forked repository to your development environment and change directory to the repository.

**Step 2.** Make a change.

Go to the *./templates/base.html* file and change the phrase "Azure Restaurant Review" to "Azure Restaurant Review - Redeployed".

**Step 3.** Commit and push the change to GitHub.

```Bash
git commit -a -m "Redeploy with title change."
git push
```

The first time using git, you may need to set global variables "user.name" and "user.email". For more information, see the help for [git-config][16].

The push of changes to the *main* branch kicks off the GitHub Actions workflow.

---

> [!NOTE]
> We showed making a change directly in the *main* branch. In typical software workflows, you'll make a change in a branch other than *main* and then create a pull request (PR) to merge those change into *main*. The PR will also kick off the workflow.

## GitHub Actions workflow details

You can view GitHub Actions workflow history in [GitHub][17] or using [GitHub CLI][18] commands.

### [GitHub](#tab/git-github)

:::row:::
    :::column span="2":::
        **Step 1.** Go to your fork of the sample repository and open the **Actions** tab.
    :::column-end:::
    :::column:::
        :::image type="content" source="media/tutorial-container-apps/github-check-action.png" alt-text="Screenshot showing how to view GitHub Actions for a repo and look at workflows." lightbox="media/tutorial-container-apps/github-check-action.png":::
    :::column-end:::
:::row-end:::

### [Command line](#tab/git-commandline)

**Step 1.** Get a summary of your workflow.

```Bash
gh workflow view
```

This command prompts you to select a workflow and then gives an overview of recent runs of that workflow. The first time using `gh` you may be prompted to authentication. Follow the GitHub CLI prompts to authenticate.

**Step 2.** Go to GitHub for details of run of workflow.

```bash
gh workflow view --web
```

---

In the *.github/workflows/\<workflow-name>.yml* workflow file that was added to the repo, you'll see placeholders for credentials that are needed for the build and container app update jobs of the workflow. The credential information is stored encrypted in the repository **Settings** under **Security**/**Actions**.

:::image type="content" source="media/tutorial-container-apps/github-repo-action-secrets.png" alt-text="Screenshot showing how to see where GitHub Action secrets are stored in GitHub." lightbox="media/tutorial-container-apps/github-repo-action-secrets.png":::

If the credential information changes, you can update it here. For example, if the Azure Container Registry passwords are regenerated, you'll need to update the PYTHONCONTAINERAPP_REGISTRY_PASSWORD value shown above. For more information, see [Encrypted secrets][19] in the GitHub documentation.

When you set up continuous deployment, you authorized Azure Container Apps as an authorized OAuth Apps. This is how the GitHub Actions YML file is written to *.github/workflows/\<workflow-name>.yml* when you set up continuous deployment. You can revoke this permission by going to the settings of your GitHub user profile. Under **Integrations**/**Applications**, you can see your authorized apps.

:::image type="content" source="media/tutorial-container-apps/github-authorized-oauth-apps.png" alt-text="Screenshot showing how to see the authorized apps for a user in GitHub." lightbox="media/tutorial-container-apps/github-authorized-oauth-apps.png":::

## Troubleshooting and tips

Errors setting up a service principal with the Azure CLI `az ad sp create-for-rba` command.

* You receive an error containing "InvalidSchema: No connection adapters were found".
  * Check the shell you're running in. If using Bash shell, set the MSYS_NO_PATHCONV variables as follows `export MSYS_NO_PATHCONV=1`. For more information, see the GitHub issue [Unable to create service principal with Azure CLI from git bash shell, no connection adapters were found.][15].

* You receive an error containing "More than one application have the same display name".
  * This error indicates the name is already taken for the service principal. Choose another name or leave off the `--name` argument and a GUID will be automatically generated as a display name.

GitHub Actions workflow failed.

* To check a workflow's status, go to the **Actions** tab of the repo.
* If there's a failed workflow, drill into its workflow file. There should be two jobs "build" and "deploy". For a failed job, look at the output of the job's tasks to look for problems.
* If you see an error message with "TLS handshake timeout", run the workflow manually by selecting **Trigger auto deployment** under the **Actions** tab of the repo to see if this is a temporary issue.
* If you set up continuous deployment for the container app as shown in this tutorial, the workflow file (*.github/workflows/\<workflow-name>.yml*) is created automatically for you. You shouldn't need to modify this file for this tutorial. If you did, revert your changes and try the workflow.

Website doesn't show changes you merged in the *main* branch.

* In GitHub: check that the GitHub Actions workflow ran and that you checked the change into the branch that triggers the workflow.
* In Azure portal: check the Azure Container Registry to see if a new container image was created with a timestamp after your change to the branch.
* In Azure portal: check the logs of container app. If there is a programming error, you'll see it here.
  * Go to the Container App | Revision Management | \<active container> | Revision details | Console logs
  * Choose the order of the columns to show "Time Generated", "Stream_s", and "Log_s". Sort the logs by most-recent first and look for Python *stderr* and *stdout* messages in the "Stream_s" column. Python 'print' output will be *stdout* messages.

How to stop continuous deployment.

* Stopping continuous deployment means disconnecting your container app from your repo.
* How to disconnect:
  * In Azure portal: go the container app, select the **Continuous deployment** resource, select **Disconnect**.
  * With the Azure CLI: use the [az containerapp github-action remove][6] command.
* After disconnecting, in Azure:
  * The container is left with last deployed container and you should reconnect the container app with the Azure Container Registry, so that new revisions pick up the latest image.
  * Service principals created and used for continuous deployment are not deleted.
* After disconnecting, in your GitHub repo:
  * The *.github/workflows/\<workflow-name>.yml* file is removed from your repo.
  * Secret keys aren't removed.


[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: /azure/container-apps/revisions
[6] /cli/azure/containerapp/github-action#az-containerapp-github-action-delete
[7]: /cli/azure/install-azure-cli
[8]: /azure/container-apps/overview
[9]: /azure/container-registry/container-registry-intro
[10]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[11]: /cli/azure/containerapp/github-action#az-containerapp-github-action-add
[12]: /azure/role-based-access-control/built-in-roles#general
[13]: /get-started/quickstart/fork-a-repo
[14]: https://git-scm.com/
[15]: https://github.com/Azure/azure-cli/issues/16317
[16]: https://git-scm.com/docs/git-config
[17]: https://github.com/
[18]: https://cli.github.com/
[19]: https://docs.github.com/actions/security-guides/encrypted-secrets
[20]: /azure/developer/github/github-actions
[21]: /azure/active-directory/fundamentals/service-accounts-principal
