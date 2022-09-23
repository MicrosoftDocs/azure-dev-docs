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

The service diagram shown below highlights the components covered in this article, configuration of the CI/CD cycle.

:::image type="content" source="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png" alt-text="A screenshot of the services in the Tutorial - Deploy a Python App on Azure Container Apps. Section highlighted is are parts related to continuous integration - continuous delivery (CI/CD)." lightbox="./media/tutorial-container-apps/service-diagram-overview-for-tutorial-deploy-python-azure-container-apps-cicd.png":::

## Prerequisites

Required:

* Have the resources created in the previous article of this tutorial, which include an [Azure Container Registry][9] and a container app in [Azure Container Apps][8].

* A GitHub account where you forked the sample rep (([Django][1] or [Flask][2])) and that you can connect to from Azure Container Apps.

## Set up continuous deployment for the container

What happens here? We replace pull of container image from registry (one time) to continuous deployment.

### [Azure portal](#tab/azure-portal)

:::row:::
    :::column span="2":::
        **Step 1.** In the [Azure portal][3], go to the Container App you want to configure continuous deployment and select the **Continuous deployment** resource.
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
        * *\<app-name>* is TBD.
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
        * *\<resource-group-name>* is TBD
        * *\<registry-name>* must be unique within Azure, and contain 5-50 alphanumeric characters.
        * *\<client-id>* is a value from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<tenant-id>* is a value from the previous `az ad sp create-for-rbac` command. The ID is a GUID of the form 00000000-0000-0000-0000-00000000.
        * *\<client-secret> is a value from the previous `az ad sp create-for-rbac` command.

    :::column-end:::
:::row-end:::

---

## Create a code change to start Github workflow

**Step 1.** Create a branch to work in and check it out.

```Bash
git branch -b changes
git checkout change-branch
```

**Step 2.** Make a change and push change to branch.

```Bash
git push branch to origin (not remote)
git commit -a "Some change"
git push
```

**Step 3.** Create a pull request and merge changes into *main* branch

## Troubleshooting

Continuous deployment problems using the CLI

* Error occurred in request., InvalidSchema: No connection adapters were found  => NEED MSYS_NO_PATHCONV=1
* More than one application have the same display name 'myApp'

GitHub Action failed.

* If you set up continuous deployment for the container app, the workflow file is created automatically for you.
* Check the Actions tab of the repo and at a glance you can see if a workflow has failed.
* For a failed workflow, view it's workflow file. 
* There should be two jobs "build" and "deploy".
* For a failed job look at the output of the job's tasks to look for problems.

Website doesn't show change

* In GitHub - Check that the GitHub workflow ran and that you checked the change into the branch that trickers the workflow.
* In Azure Portal - Check the Azure Container Registry to see if a new container image was created with a timestamp after your change.
* In Azure Portal - Check the logs of container app. If there was a programming error, you'll see it here.
  * Go to the Container App | Revision Management | \<active container> | Revision details | Console logs
  * Choose the order of the columns to show "Time Generated", "Stream_s", and "Log_s". Sort the logs by most-recent first and look for Python stderr and stdout messages in the "Stream_s" column. Python 'print' output will be stdout messages.

[1]: https://github.com/Azure-Samples/msdocs-python-django-azure-container-app
[2]: https://github.com/Azure-Samples/msdocs-python-flask-azure-container-app
[3]: https://portal.azure.com/
[4]: https://shell.azure.com/
[7]: /cli/azure/install-azure-cli
[8]: /azure/container-apps/overview
[9]: /azure/container-registry/container-registry-intro
[10]: /cli/azure/ad/sp#az-ad-sp-create-for-rbac
[11]: /cli/azure/containerapp/github-action#az-containerapp-github-action-add
