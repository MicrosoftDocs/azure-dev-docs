---
title: Configure CI/CD for a Python web app in Azure Container Apps
description: Set up CI/CD for a Python web app container in Azure Container Apps using a GitHub workflow (with actions) triggered on merged PRs to the main branch of a repo.
ms.topic: conceptual
ms.date: 09/21/2022
ms.custom: devx-track-python
ms.prod: azure-python
author: jessmjohnson
ms.author: jejohn
---

# Configure continuous deployment for a Python web app in Azure Container Apps

This article is part of a tutorial about how to containerize and deploy a Python web app to [Azure Container Apps][8]. Container Apps enable you to deploy containerized apps without managing complex infrastructure.

In this part of the tutorial, you learn how to configure continuous deployment or delivery (CD) for the container app. CD is part of the DevOps concept of continuous integration / continuous delivery (CI/CD), automation of your software development workflow.

The service diagram shown below highlights the components covered in this article: configuration of the CI/CD cycle.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Sections highlighted are parts related to continuous integration - continuous delivery (CI/CD)." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png":::

## Prerequisites

To follow set up continuous deployment, you'll need:

* The resources created in the previous article of this tutorial, which includes an [Azure Container Registry][9] and a container app in [Azure Container Apps][8].

* A GitHub account where you forked the sample code ([Django][1] or [Flask][2]) and you can connect to from Azure Container Apps. (If you downloaded the sample code instead of forking, make sure you push your local repo to your GitHub account.)

* Optionally, [Git][14] installed locally to make code changes locally and push to your repo in GitHub. Alternatively, you can make the changes directly in GitHub with a patch.

## Set up continuous deployment for the container

In a previous article of this tutorial, you created and configured a container app in Azure Container Apps. Part of the configuration was pulling a Docker image from an Azure Container Registry. The container image is pulled from the registry when creating a container [*revision*][5], such as when you first set up the container app.

In the steps below, you'll set up continuous deployment, which means a new container image is created based on a defined trigger. The trigger in this tutorial is a pull request (PR) to a *main* branch of your repository. With a new PR, a new container image is built and pushed to the Azure Container Registry, and the container app is updated to use the new image.

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

        * service principal is created
        * service principal is added to the resource group the Container App is in, with role "Contributor"

    :::column-end:::
    :::column:::
    TBD
    :::column-end:::
:::row-end:::

### [Azure CLI](#tab/azure-cli)

Azure CLI commands can be run in the [Azure Cloud Shell][4] or on a workstation with the [Azure CLI][7] installed.

:::row:::
    :::column span="1":::
        **Step 1.** Create a service principal with the [az ad sp create-for-rbac][10] command.

        ```bash        
        export MSYS_NO_PATHCONV=1
        az ad sp create-for-rbac \
        --name <app-name> \
        --role Contributor \
        --scopes "/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>"
        ```

        Where 
        * *\<app-name>* is an optional name for the service principal.
        * *\<subscription-ID>* is TBD.
        * *\<resource-group-name>* is TBD.

    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        **Step 2.** Configure a GitHub workflow with [az containerapp github-action add][11] command.

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
        * *\<client-id>* is a value from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<tenant-id>* is a value from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<client-secret>* is a value from the previous `az ad sp create-for-rbac` command.

    :::column-end:::
:::row-end:::

---

In the steps to set up continuous deployment, a [*service principal*][6] is needed to access and modify Azure resources. If you followed the steps for the portal, the service principal was set up automatically for you. If you followed the steps for the Azure CLI, you explicitly created the service principal first before setting up continuous deployment.

Access to resources is restricted by the roles assigned to the service principal, giving you control over which resources can be accessed and at which level. In the steps above, that role used is the built-in [*Contributor*][12] role, and it was assigned to the resource group containing the container app.

## Create a code change to start GitHub workflow

In this section, you'll make a small change to your forked copy of the sample repository and confirm that the change is automatically deployed to the web site.

**Step 1.** Create a branch to work in and check it out.

If you haven't already, make a [fork][13] of the sample repository (([Django][1] or [Flask][2])). Then, create a branch and checkout that branch.

```Bash
git checkout master
git pull
git push
git checkout -b changes-branch
git merge master
```

**Step 2.** Make a change.

Go to the *./templates/base.html* file and change the phrase "Azure Restaurant Review" to "Azure Restaurant Review - Redeployed".

**Step 2.** Commit and push the change to GitHub.

Then commit and push the changes.

```Bash
git commit -a -m "Redeploy with title change."
git push --set-upstream origin change-branch
```
First time using git, may need to set global variables "user.name" and "user.email". See the help for [git-config][16].

**Step 3.** Create a pull request and merge changes into *main* branch

```Bash
git request-pull main <repo-url> changes
```

## Troubleshooting

Errors setting up a service principal with the Azure CLI `az ad sp create-for-rba` command.

* You receive an error containing "InvalidSchema: No connection adapters were found".
  * Check the shell you're running in. If using Bash shell, set the MSYS_NO_PATHCONV variables as follows `export MSYS_NO_PATHCONV=1`. For more information, see the GitHub issue [Unable to create service principal with Azure CLI from git bash shell, no connection adapters were found.][15].

* You receive an error containing "More than one application have the same display name".
  * This error indicates the name is already taken for the service principal. Choose another name or leave off the `--name` argument and a GUID will be automatically generated as a name.

GitHub Action failed.

* If you set up continuous deployment for the container app, the workflow file (.github/workflows/\<workflow-name>.yml) is created automatically for you. To check the workflow, go to the **Actions** tab of the repo and at a glance you can see if a workflow has failed.
* If there's a failed workflow, drill into its workflow file. There should be two jobs "build" and "deploy". For a failed job, look at the output of the job's tasks to look for problems.
* If you see an error message with "TLS handshake timeout", run the workflow manually by selecting **Trigger auto deployment** under the **Actions** tab of the repo to see if this is a temporary issue.

Website doesn't show changes you merged in the *main* branch.

* In GitHub - Check that the GitHub workflow ran and that you checked the change into the branch that trickers the workflow.
* In Azure portal - Check the Azure Container Registry to see if a new container image was created with a timestamp after your change.
* In Azure portal - Check the logs of container app. If there was a programming error, you'll see it here.
  * Go to the Container App | Revision Management | \<active container> | Revision details | Console logs
  * Choose the order of the columns to show "Time Generated", "Stream_s", and "Log_s". Sort the logs by most-recent first and look for Python *stderr* and *stdout* messages in the "Stream_s" column. Python 'print' output will be *stdout* messages.

[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[5]: /azure/container-apps/revisions
[6]: /azure/active-directory/develop/howto-create-service-principal-portal
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