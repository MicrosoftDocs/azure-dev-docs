---
title: Quickstart - Install Ansible on an Azure VM
description: In this quickstart, learn how to install and configure Ansible on an Azure VM for managing Azure resources.
keywords: ansible, azure, devops, bash, cloudshell, playbook, azure cli, azure powershell, powershell
ms.topic: quickstart
ms.date: 05/07/2021
ms.custom: devx-track-ansible, devx-track-azurecli, devx-track-azurepowershell
---

# Quickstart - Install Ansible on an Azure VM

This quickstart, shows how to install [Ansible](https://docs.ansible.com/) on an Centos Azure VM using Azure CLI or Azure PowerShell.

In this quickstart, you'll complete these tasks:

> [!div class="checklist"]
> * Create a resource group
> * Create a CentOS virtual machine
> * Connect to the Centos virtual machine via SSH
> * Install Ansible on the virtual machine
> * Configure Ansible on the virtual machine

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-sp.md](../includes/open-source-devops-prereqs-create-service-principal.md)]  <!-- todo, update with new ansible service principal article -->

## Create an Azure virtual machine

