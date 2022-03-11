---
title: Using Terraform with Azure
description: Learn how Terraform can help you deploy and version your infrastructure on Azure.
ms.topic: overview
ms.date: 08/07/2021
ms.custom: devx-track-terraform
adobe-target: true
---

# What is Terraform
[Hashicorp Terraform](https://www.terraform.io/) is an open-source IaC tool for provisioning and managing infrastructure. It codifies infrastructure in configuration files that describe the desired state for the topology. Terraform enables the management of any infrastructure including public clouds, private clouds, SaaS services, etc. through the use of [Terraform providers](https://www.terraform.io/language/providers).  

## Terraform Providers for Azure Infra
There are several Terraform providers that enable the management of Azure infrastructure including:

- [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs): Use this provider to authenticate to and manage stable Azure resources and functionality such as virtual machines, storage accounts, networking interfaces, MySql server, App Service, Azure Functions and many more.
- [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs): Use this provider to authenticate to and manage Azure Active directory resources such as groups, users, service principals, applications, and many more. 
- [AzureDevops](https://registry.terraform.io/providers/microsoft/azuredevops/latest/docs): Use this provider to authenticate to and manage Azure DevOps resources such as agents, repositories, projects, pipelines, queries, and many more.
- [AzApi](https://registry.terraform.io/providers/microsoft/azapi/latest/docs): Use this provider to authenticate to and manage Azure resources and functionality using the Azure Resource Manager APIs directly. This provider compliments the AzureRM provider by enabling the management of Azure resources that are not ye yet GA as well as many other scenarios. [Discover more](overview-azapi-provider.md) about this provider. 
- [AzureStack](https://registry.terraform.io/providers/hashicorp/azurestack/latest/docs): Use this provider to authenticate to and manage Azure Stack resources such as virtual machines, dns, vnet, storage, and many more.

# Benfits of Terraform with Azure

This section describes the benefits of using Terraform to manage Azure infrastructure.

## Common IaC tool

As you may have noticed from the Azure providers listed above , Terraform empowers you to manage ALL of your Azure infrastructure using the same declarative syntax and tooling. This enables scenarios like:
1. Provisioning core platform capabilites like management groups, policies, users, groups, policies, etc. see [Terraform implementation of Cloud Adoption Framework Enterprise-scale](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale#readme)
1. Provision Azure DevOps projects, pipelines, etc. for automating regular infrastructure and application deployments.
1. Provision Azure resources required by your applications.

## Automate infrastructure management

Terraform's template-based configuration files enable you to define, provision, and configure Azure resources in a repeatable and predictable manner. Automating infrastructure has several benefits:

- Lowers the potential for human errors while deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Reduces the cost of development and test environments by creating them on-demand.

## Understand infrastructure changes before being applied

As a resource topology becomes complex, understanding the meaning and impact of infrastructure changes can be difficult.

The Terraform CLI enables users to validate and preview infrastructure changes before application. Previewing infrastructure changes in a safe manner has several benefits:
- Team members can collaborate more effectively by quickly understanding proposed changes and their impact.
- Unintended changes can be caught early in the development process

## Next steps

Now that you have an overview of Terraform and its benefits, here are suggested next steps:

Based on your environment, install and configure Terraform:

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]
