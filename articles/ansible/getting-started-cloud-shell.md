---
title: Quickstart - Getting started with Terraform - Azure Cloud Shell
description: In this quickstart, learn how to carry out various Ansible tasks with Bash in Azure Cloud Shell
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
ms.topic: quickstart
ms.date: 06/01/2020
---

# Quickstart: Getting started with Ansible - Azure Cloud Shell

Azure Cloud Shell is a shell for managing Azure resources. Cloud Shell is accessed from the Azure portal and supports both Bash and PowerShell. In this article, you use the Bash environment and the Azure CLI to configure and run an Ansible playbook.

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
- **Configure Azure Cloud Shell** - If you're new to Azure Cloud Shell, see [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart).
[!INCLUDE [cloud-shell-try-it.md](../includes/cloud-shell-try-it.md)]

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

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Configure virtual machine in Azure using Ansible](./vm-configure.md)