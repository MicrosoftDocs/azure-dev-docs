---
title: How to run Azure Developer CLI using Windows Subsystem for Linux on Windows 11
description: How to run the Azure Developer using Bash on Ubuntu, in Widows 11
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---

# How to run Azure Developer CLI using Windows Subsystem for Linux on Windows 11

> [!NOTE]
> This is a work in progress

We'll use the [Todo Application with Node.js and Azure Cosmo DB API for MongoDB](https://github.com/azure-samples/todo-nodejs-mongo) for this walkthrough. For more information including architecture diagram and the Azure resources you'll deploy, see the [README](https://github.com/azure-samples/todo-nodejs-mongo).

## Enable the Windows Subsystem for Linux (WSL) on Windows 11
- Open the **Windows Features** dialogue and make sure the **Windows Subsystem for Linux** and **Virtual Machine Platform** features are enabled
- Reboot your machine

## Install the Ubuntu app from the Microsoft store
- Once WSL is enabled, you'll find `bash.exe` on the *Start Menu*
- Go to Microsoft Store, search for **Ubuntu**
- select "Get" to install the app

## Install the Azure Developer CLI

You'll need npm to install the Azure Developer CLI. For detailed steps, see [Install Node.js on Windows Subsystem for Linux](https://docs.microsoft.com/windows/dev-environment/javascript/nodejs-on-wsl). On a high level, run the following commands:

```
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

## Set up an SSH key pair

For more detailed information, see [GitHub docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent):

```sh
ssh-keygen -t rsa -b 2048 -C "azd" -f $HOME/.ssh/azd
```

* Add the contents of your public key file (`$HOME/.ssh/azd.pub) to your GitHub account (see [GitHub docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) for this step):

* Install dependencies for ToDo App for Node.js and Mongo DB (refer to the app [Dockerfile](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.devcontainer/Dockerfile.)

## Set up SSH agent

Set up SSH agent to cache your SSH private key for `git clone` using a SSH URI.

```sh
eval $(ssh-agent)
ssh-add -t 28800 $HOME/.ssh/azd
# Optional: Enter passphrase if your private key is protected by a passphrase
```

## Project folder

Create an empty folder and set your current directory to the newly created folder
```sh
mkdir <newfolder>
cd <newfolder>
```

## Initialize a project

Initialize a starter project using a template:

```sh
azd init --template git@github.com:azure-samples/todo-nodejs-mongo

git init
git add .
git commit -m "initial commit"

ls -1
```

Output:

```sh
LICENSE
NOTICE.txt
README-wsl2.md
README.md
assets
azure.yaml
infra
openapi.yaml
src
```

Fill in the values when prompted:

```txt
? Please enter a new environment name: dev-fbe1240cb3
? Please select an Azure location to use: 44. (US) East US 2 (eastus2)
? Please select an Azure Subscription to use: 14. Clarence's Azure Internal Consumption (xxxxxx-xxxxx-xxxxx-xxxxxx-xxxxxxxxxx)
```
## Provision

Deploy the Azure infrastructure:

```sh
azd provision
```

Sample output/progress:

```txt
View progress in Azure Portal: https://portal.azure.com/#blade/HubsExtension/DeploymentDetailsBlade/overview/id/%2Fsubscriptions%2Fxxxxxx-xxxxx-xxxxx-xxxxxx-xxxxxxxxxx%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2Fdev-fbe1240cb3
Creating Azure resources (Running: 2, Succeeded: 9) -
```

## Deploy the app

```sh
azd deploy
```

## Sample output/progress:

```sh
Deployed service dev-fbe1240cb3web
 - Endpoint: https://dev-fbe1240cb3web.azurewebsites.net/
Deployed service dev-fbe1240cb3api
 - Endpoint: https://dev-fbe1240cb3api.azurewebsites.net/
```

Access the web frontend to try out the app: https://dev-fbe1240cb3web.azurewebsites.net/

## Monitoring the app

To view the monitoring dashboard:

```sh
az dev monitor --overview
```

Sample output:

```txt
Opening https://portal.azure.com/#@72f988bf-86f1-41af-91ab-2d7cd011db47/dashboard/arm/subscriptions/xxxxxx-xxxxx-xxxxx-xxxxxx-xxxxxxxxxx/resourceGroups/dev-fbe1240cb3rg/providers/Microsoft.Portal/dashboards/dev-fbe1240cb3aidash in the default browser...
```

To view the app logs:

```sh
az dev monitor --logs
```

Sample output:

```txt
Opening https://app.azure.com/72f988bf-86f1-41af-91ab-2d7cd011db47/subscriptions/xxxxxx-xxxxx-xxxxx-xxxxxx-xxxxxxxxxx/resourceGroups/dev-fbe1240cb3rg/providers/Microsoft.Insights/components/dev-fbe1240cb3ai/logs in the default browser...
```

## Cleanup

Delete Azure infrastructure:

```sh
az dev infra delete
```

## Explore more samples

To learn more about how to use the Azure Developer CLI, see our [sample templates](azure-dev-cli-templates.md).

## Reference

A [reference](azure-cli-ref) is available.

## Get help and give feedback

Post questions to the community on [Discussions](https://github.com/Azure/azure-dev/discussions). Report bugs and open issues against the Azure Developer CLI in the [GitHub repository](https://github.com/Azure/azure-dev).