---
title: Use GitHub Actions to deploy a Python web app to Azure App Service on Linux
description: Use CI/CD with GitHub Actions to automatically build, test, and deploy Python web apps to Azure App Service on Linux.
ms.topic: conceptual
ms.date: 10/29/2022
ms.custom: devx-track-python
ms.prod: azure-python
---

# Use CI/CD with GitHub Actions to deploy a Python web app to Azure App Service on Linux

Use GitHub Actions continuous integration and continuous delivery (CI/CD) to deploy a Python web app to Azure App Service on Linux. Your Github Actions workflow automatically builds the code and deploys it to the App Service whenever there's a commit to the repository. You can add other functionalities in your pipeline, such as test scripts, security checks, and multistages deployment.

## Create a repository for your app code

If you already have a Python web app to use, make sure it's committed to a GitHub repository.

If you need an app to work with, you can fork and clone the repository at https://github.com/Microsoft/python-sample-vscode-flask-tutorial. The code is from the tutorial [Flask in Visual Studio Code][1].

> [!NOTE]
> If your app uses Django and a SQLite database, it won't work for this tutorial. For more information, see considerations for Django later in this article. If your Django app uses a separate database, you can use it with this tutorial.

## Provision the target Azure App Service

The quickest way to create an App Service instance is to use the Azure command-line interface (CLI) through the interactive Azure Cloud Shell. In the following steps, you use [az webapp up][2] to both provision the App Service and do the first deployment of your app.

**Step 1.** Sign in to the Azure portal at https://portal.azure.com.

**Step 2.** Open the Azure CLI by selecting the Cloud Shell button on the portal's toolbar.

[IMAGE]

**Step 3.** In the Cloud Shell, select Bash from the dropdown.

[IMAGE]

**Step 4.** In the Cloud Shell, clone your repository using git clone. For the example app, use:

```bash
git clone https://github.com/<your-alias>/python-sample-vscode-flask-tutorial
```

Replace \<your-alias> with the name of the GitHub account you used to fork the repository.

> [!NOTE]
> The Cloud Shell is backed by an Azure Storage account in a resource group called *cloud-shell-storage-\<your-region>*. That storage account contains an image of the Cloud Shell's file system, which stores the cloned repository. There's a small cost for this storage. You can delete the storage account at the end of this article, along with other resources you create.

**Step 5.** In the Cloud Shell, change directories into the repository folder that has your Python app, so the az webapp up command will recognize the app as Python.

```bash
cd python-sample-vscode-flask-tutorial
```

**Step 6.** In the Cloud Shell, use az webapp up to create an App Service and initially deploy your app.

```bash
az webapp up -n <app-service-name>
```

> [!TIP]
> If you encounter a "Permission denied" error with a *.zip* file, you may have tried to run the command from a folder that doesn't contain a Python app. The `az webapp up` command then tries to create a Windows app service plan, and fails.

**Step 7.** If your app uses a custom startup command, set the [az webapp config][3] property. For example, the *python-sample-vscode-flask-tutorial* app contains a file named *startup.txt* that contains its specific startup command, so you set the `az webapp config` property to *startup.txt*.

* From the first line of output from the previous `az webapp up` command, copy the name of your resource group, which is similar to *\<your-name>_rg_<random_numbers>*.
* Enter the following command, using your resource group name, your app service name (*\<your-appservice>*), and your startup file or command (*startup.txt*).

```bash
az webapp config set -g <resource-group-name> -n <app-service-name> --startup-file <startup-file-or-command>
```

**Step 8.** To see the running app, open a browser and go to *http://\<your-appservice>.azurewebsites.net*. If you see a generic page, wait a few seconds for the App Service to start, and refresh the page.

## Set up continuous deployment in App Service 

In the steps below, you'll set up continuous deployment (CD), which means a new code deployment happens when a trigger is fired. The trigger in this tutorial is any change to the main branch of your repository, such as with a pull request (PR).

[1]: https://code.visualstudio.com/docs/python/tutorial-flask
[2]: /cli/azure/webapp#az-webapp-up
[3]: /cli/azure/webapp/config#az-webapp-config-set
