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

Several Terraform providers enable the management of Azure infrastructure:

- [AzureRM](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs): Manage stable Azure resources and functionality such as virtual machines, storage accounts, and networking interfaces.
- [AzAPI](https://registry.terraform.io/providers/Azure/azapi/latest/docs): Manage Azure resources and functionality by using the Azure Resource Manager APIs directly. This provider enables consistency with Azure's latest functionality without requiring provider updates. For more information about the AzAPI provider, see [Terraform AzAPI provider](overview-azapi-provider.md).
- [AzureAD](https://registry.terraform.io/providers/hashicorp/azuread/latest/docs): Manage Microsoft Entra resources such as groups, users, service principals, and applications.
- [AzureDevops](https://registry.terraform.io/providers/microsoft/azuredevops/latest/docs): Manage Azure DevOps resources such as agents, repositories, projects, pipelines, and queries.
- [AzureStack](https://registry.terraform.io/providers/hashicorp/azurestack/latest/docs): Manage Azure Stack Hub resources such as virtual machines, DNS, virtual networks, and storage.

### Using AzAPI vs AzureRM
To understand when to use AzAPI vs AzureRM, read the [joint statement with HashiCorp](https://aka.ms/tf/providermessaging).

## Benefits of Terraform with Azure

This section describes the benefits of using Terraform to manage Azure infrastructure.

### Common IaC tool

Terraform Azure providers enable you to manage all of your Azure infrastructure by using the same declarative syntax and tooling. By using these providers, you can:

1. Configure core platform capabilities such as management groups, policies, users, groups, and policies. For more information, see [Terraform implementation of Cloud Adoption Framework Enterprise-scale](https://github.com/Azure/terraform-azurerm-caf-enterprise-scale#readme).
1. Configure Azure DevOps projects and pipelines to automate regular infrastructure and application deployments.
1. Deploy Azure resources required by your applications.

### Automate infrastructure management

Use the Terraform template-based configuration file syntax to configure Azure resources in a repeatable and predictable way. Automating infrastructure management offers the following benefits:

- Reduces the potential for human errors when deploying and managing infrastructure.
- Deploys the same template multiple times to create identical development, test, and production environments.
- Cuts the cost of development and test environments by creating them on demand.

### Understand infrastructure changes before applying them

As a resource topology becomes more complex, it can be difficult to understand the meaning and impact of infrastructure changes.

The Terraform CLI enables you to validate and preview infrastructure changes before applying the plan. Previewing infrastructure changes in a safe manner offers several benefits:

- Team members can collaborate more effectively by understanding proposed changes and their impact.
- You can catch unintended changes early in the development process.

## Next steps

Based on your environment, install and configure Terraform:

> [!NOTE]
> Azure Storage account conversions can introduce supported out-of-band changes that cause Terraform to plan a storage account replacement. For guidance on preventing unexpected recreation during these conversions, see [Prevent Terraform drift for stateful Azure resources](prevent-terraform-drift-stateful-resources.md).

[!INCLUDE [configure-terraform.md](includes/configure-terraform.md)]
