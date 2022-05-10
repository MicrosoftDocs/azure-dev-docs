---
title: How to run Azure Developer CLI using Windows Subsystem for Linux on Windows 11
description: How to run the Azure Deveveloper using Bash on Ubuntu, in Widows 11
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---

> [!NOTE]
> Work in progress

# How to run Azure Developer CLI using Windows Subsystem for Linux on Windows 11

## Enable the Windows Subsystem for Linux (WSL) on Windows 11
- Open the **Windows Features** diaglogue and make sure the **Windows Subsystem for Linux** feature is turned on
- Reboot your machine

## Install the Ubuntu app from the Microsoft store
- Once WSL is enabled, you'll find `bash.exe` on the *Start Menu*
- Go to Microsoft Store, search for **Ubuntu**
- select "Get" to install the app

## Install the Azure Developer CLI

You'll need `npm` to install the Azure Developer CLI. For detailed steps, see [Install Node.js on Windows Subsystem for Linux](https://docs.microsoft.com/windows/dev-environment/javascript/nodejs-on-wsl). On a high level, run the following commands:

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts
npm install -g https://azuresdkreleasepreview.blob.core.windows.net/azd/standalone/latest/azure-az-dev-cli-latest.tgz
```

## Set up an SSH key pair

For more detailed information, see [GitHub docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent):

```sh
ssh-keygen -t rsa -b 2048 -C "Azure Dev CLI" -f $HOME/.ssh/azure-dev-cli
```

* Add the contents of your public key file (`$HOME/.ssh/azure-dev-cli.pub) to your GitHub account (see [GitHub docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) for this step):

* Install dependencies for Azure Dev CLI to work (see [Azure Dev CLI docs](https://github.com/Azure/azure-dev/wiki/How-to-install-the-new-Azure-Dev-CLI) for this step)

Steps
-----

Setup SSH agent to cache your SSH private key so that Git clone using a SSH URI works (and you won't be prompted for a username or password like when usoing `https` protocol).

```sh
eval $(ssh-agent)
ssh-add -t 28800 $HOME/.ssh/azure-dev-cli
# Optional: Enter passphrase if your private key is protected by a passphrase
```

Initialize a starter project using a template:

```sh
az dev init --template git@github.com:azure-samples/todo-nodejs-mongo

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

Provision the Azure infrastructure:

```sh
az dev provision
```

Sample output/progress:

```txt
View progress in Azure Portal: https://portal.azure.com/#blade/HubsExtension/DeploymentDetailsBlade/overview/id/%2Fsubscriptions%2Fxxxxxx-xxxxx-xxxxx-xxxxxx-xxxxxxxxxx%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2Fdev-fbe1240cb3
Creating Azure resources (Running: 2, Succeeded: 9) -
```

Deploy the app:

```sh
az dev deploy
```

Sample output/progress:

```sh
Deployed service dev-fbe1240cb3web
 - Endpoint: https://dev-fbe1240cb3web.azurewebsites.net/
Deployed service dev-fbe1240cb3api
 - Endpoint: https://dev-fbe1240cb3api.azurewebsites.net/
```

Access the web frontend to try out the app: https://dev-fbe1240cb3web.azurewebsites.net/

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

Cleanup
-------

Delete Azure infrastructure:

```sh
az dev infra delete
```
