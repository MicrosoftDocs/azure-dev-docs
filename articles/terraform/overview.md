---
title: Overview of Terraform on Azure - What is Terraform?
description: Learn how Terraform can help you deploy and version your infrastructure on Azure.
ms.topic: overview
ms.date: 02/02/2024
ms.custom: devx-track-terraform
adobe-target: true
---

# Overview of Terraform on Azure - What is Terraform?

[Hashicorp Terraform](https://www.terraform.io/) is an open-source IaC (Infrastructure-as-Code) tool for configuring and deploying cloud infrastructure. It codifies infrastructure in configuration files that describe the desired state for your topology. Terraform enables the management of any infrastructure - such as public clouds, private clouds, and SaaS services - by using [Terraform providers](https://www.terraform.io/language/providers).  

## Terraform providers for Azure infrastructure

There are several Terraform providers that enable the management of Azure infrastructure:

- [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs): Manage stable Azure resources and functionality such as virtual machines, storage accounts, and networking interfaces.
- [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs): Manage Microsoft Entra resources such as groups, users, service principals, and applications.
- [AzureDevops](https://registry.terraform.io/providers/microsoft/azuredevops/latest/docs): Manage Azure DevOps resources such as agents, repositories, projects, pipelines, and queries.
- [AzAPI](https://registry.terraform.io/providers/Azure/azapi/latest/docs): Manage Azure resources and functionality using the Azure Resource Manager APIs directly. This provider compliments the AzureRM provider by enabling the management of Azure resources that aren't released. For more information about the AzAPI provider, see [Terraform AzAPI provider](overview-azapi-provider.md).
- [AzureStack](https://registry.terraform.io/providers/hashicorp/azurestack/latest/docs): Manage Azure Stack Hub resources such as virtual machines, DNS, virtual networks, and storage.

## Benefits of Terraform with Azure

This section describes the benefits of using Terraform to manage Azure infrastructure.

### Common IaC tool

Terraform Azure providers enable you to manage all of your Azure infrastructure using the same declarative syntax and tooling. Using these providers you can:

1. Configure core platform capabilities such as management groups, policies, users, groups, and policies. For more information, see [Terraform implementation of Cloud Adoption Framework Enterprise-scale](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale#readme).
1. Configure Azure DevOps projects and pipelines to automate regular infrastructure and application deployments.
1. Deploy Azure resources required by your applications.

### Automate infrastructure management

The Terraform template-based configuration file syntax enables you to configure Azure resources in a repeatable and predictable manner. Automating infrastructure includes the following benefits:

- Lowers the potential for human errors while deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Reduces the cost of development and test environments by creating them on-demand.

### Understand infrastructure changes before being applied

As a resource topology becomes complex, understanding the meaning and impact of infrastructure changes can be difficult.

The Terraform CLI enables users to validate and preview infrastructure changes before application of the plan. Previewing infrastructure changes in a safe manner has several benefits:

- Team members can collaborate more effectively by understanding proposed changes and their impact.
- Unintended changes can be caught early in the development process.

## Next steps

Based on your environment, install and configure Terraform:

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]
