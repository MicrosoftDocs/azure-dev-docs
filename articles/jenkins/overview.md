---
title: Overview of Jenkins and Azure
description: Host the Jenkins build and deploy automation server in Azure and use Azure compute and storage resources to extend your continuous integration and deployment (CI/CD) pipelines.
keywords: jenkins, azure, devops, overview
ms.topic: overview
ms.date: 11/10/2020
ms.custom: devx-track-jenkins
---

# Azure and Jenkins

[Jenkins](https://jenkins.io/) is a popular open-source automation server used to set up continuous integration and delivery (CI/CD) for your software projects. You can host your Jenkins deployment in Azure or extend your existing Jenkins configuration using Azure resources. Jenkins plugins are also available to simplify CI/CD of your applications to Azure.

This article is an introduction to using Azure with Jenkins, detailing the core Azure features available to Jenkins users. For more information about getting started with your own Jenkins server in Azure, see [Create a Jenkins server on Azure](configure-on-linux-vm.md).

## Host your Jenkins servers in Azure

Host Jenkins in Azure to centralize your build automation and scale your deployment as the needs of your software projects grow. See [Quickstart - Get started with Jenkins](configure-on-linux-vm.md) to learn how to install and configure Jenkins on a Linux VM. Monitor and manage your Azure Jenkins deployment using [Azure Monitor logs](/azure/log-analytics/log-analytics-overview) and the [Azure CLI](/cli/azure).

## Scale your build automation on demand

Add build agents to your existing Jenkins deployment to scale your Jenkins build capacity as the number of builds and complexity of your jobs and pipelines increase. You can run these build agents on Azure virtual machines by using the [Azure VM Agents plug-in](https://plugins.jenkins.io/azure-vm-agents). See our [tutorial](/azure/jenkins/jenkins-azure-vm-agents) for more details.

Once configured with an [Azure service principal](/azure/azure-resource-manager/resource-group-overview), Jenkins jobs and pipelines can use this credential to:

- Securely store and archive build artifacts in [Azure Storage](/azure/storage/common/storage-introduction) using the [Azure Storage plug-in](https://plugins.jenkins.io/windows-azure-storage). Review the [Jenkins storage how-to](azure-storage-blobs-as-build-artifact-repository.md) to learn more.
- Manage and configure Azure resources with the [Azure CLI](deploy-to-azure-app-service-using-azure-cli.md).

## Deploy your code into Azure services

Use Jenkins plugins to deploy your applications to Azure as part of your Jenkins CI/CD pipelines. Deploying into [Azure App Service](/azure/app-service/) and [Azure Container Service](/azure/container-service/kubernetes/) lets you stage, test, and release updates to your applications without managing the underlying infrastructure.

 Plug-ins are available to deploy to the following services and environments:

- [Azure App Service on Linux](/azure/app-service/containers/app-service-linux-intro). See the [tutorial](deploy-to-azure-app-service-using-azure-cli.md) to get started.