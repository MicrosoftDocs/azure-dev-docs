---
title: Overview of Pulumi on Azure - What is Pulumi?
description: Learn how Pulumi can help you deploy and version your infrastructure on Azure.
ms.topic: overview
ms.date: 12/19/2022
ms.custom: devx-track-pulumi
adobe-target: true
---

# Overview of Pulumi on Azure - What is Pulumi?

[Pulumi](https://www.pulumi.com/) is a cloud-native infrastructure as code (IaC) platform that allows developers to use familiar programming languages to define and manage infrastructure resources across multiple cloud and on-premises providers. With Pulumi, you can define infrastructure resources such as virtual machines, databases, and networking components using code, which makes it easy to automate the provisioning and management of infrastructure. This helps developers to be more productive, and it also enables organizations to adopt a more agile and efficient approach to infrastructure management. Pulumi supports a wide range of programming languages, including JavaScript, TypeScript, Python, C#, Java, and Go. Pulumi integrates seamlessly with Azure and also has support for a wide range of public clouds, private clouds, and SaaS services.

## Pulumi providers for Azure

There are several Pulumi providers that enable the management of Azure infrastructure:

- [Azure Native](https://www.pulumi.com/registry/packages/azure-native/): The Azure Native provider for Pulumi can be used to provision all of the cloud resources available in Azure. It manages and provisions resources using the Azure Resource Manager (ARM) APIs.
- [AzureAD](https://www.pulumi.com/registry/packages/azuread/): The AzureAD provider for Pulumi can be used to provision any of the Azure Active Directory resources available in Azure.
- [Azure DevOps](https://www.pulumi.com/registry/packages/azuredevops/): The Azure DevOps provider for Pulumi can be used to provision any of the cloud resources available in Azure DevOps.
- [Azure Classic](https://www.pulumi.com/registry/packages/azure/): Azure Classic is based on the Terraform AzureRM provider. It has fewer resources and resource options and receives new Azure features more slowly than Azure Native. However, Azure Classic remains fully supported for existing usage.

## Benefits of using Pulumi with Azure

This section describes the benefits of using Pulumi to manage Azure infrastructure.

### Common IaC tool

Pulumi Azure providers enable you to manage all of your Azure infrastructure using real programming languages and declarative syntax and tooling. Using these providers you can:

1. Provision core platform capabilities such as management groups, policies, users, groups, and policies.
1. Provision Azure DevOps Projects and pipelines to automate regular infrastructure and application deployments.
1. Provision Azure resources required by your applications.

### Automate infrastructure management

Pulumi's declarative model enables you to configure Azure resources in a repeatable and predictable manner. By using features of real programming languages like for loops, functions, and classes, you can enjoy significant productivity gains compared to DSL-based infrastructure as code tools. Automating infrastructure includes the following benefits:

- Lowers the potential for human errors while deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Reduces the cost of development and test environments by creating them on-demand.

### Understand infrastructure changes before being applied

As a resource topology becomes complex, understanding the meaning and impact of infrastructure changes can be difficult.

The Pulumi CLI enables users to validate and preview infrastructure changes before application of the plan. Previewing infrastructure changes in a safe manner has several benefits:

- Team members can collaborate more effectively by understanding proposed changes and their impact.
- Unintended changes can be caught early in the development process.
