---
title: Quickstart - Configure Ansible using Azure Cloud Shell
description: In this quickstart, learn how to carry out various Ansible tasks with Bash in Azure Cloud Shell
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
ms.topic: quickstart
ms.date: 09/14/2020
ms.custom: devx-track-ansible
---

# Quickstart: Configure Ansible using Azure Cloud Shell

[!INCLUDE [annsible-intro.md](includes/ansible-intro.md)]

This article describes getting started with Ansible from the [Azure Cloud Shell](/azure/cloud-shell/overview) environment.

## Configure your environment

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Configure Azure Cloud Shell** - If you're new to Azure Cloud Shell, see [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart).

[!INCLUDE [open-cloud-shell.md](../includes/open-cloud-shell.md)]

## Automatic credential configuration

When signed into the Cloud Shell, Ansible authenticates with Azure to manage infrastructure without any additional configuration. 

When working with multiple subscriptions, specify the subscription Ansible uses by exporting the `AZURE_SUBSCRIPTION_ID` environment variable. 

To list all of your Azure subscriptions, run the following command:

```azurecli-interactive
az account list
```

Using your Azure subscription ID, set the `AZURE_SUBSCRIPTION_ID` as follows:

```console
export AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Verify the configuration
To verify the successful configuration, use Ansible to create an Azure resource group.

[!INCLUDE [create-resource-group-with-ansible.md](includes/ansible-snippet-create-resource-group.md)]

[!INCLUDE [ansible-clean-up-resources.md](includes/ansible-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Configure virtual machine in Azure using Ansible](./vm-configure.md)
