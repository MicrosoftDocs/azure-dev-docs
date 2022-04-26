---
title: Comparing Terraform and Bicep - Usability features
description: Learn how Terraform and Bicep usability features compare 
ms.topic: conceptual
ms.date: 04/26/2022
ms.custom: devx-track-terraform
adobe-target: true
---

# Comparing Terraform and Bicep - Usability features

Today's organizations face dynamic challenges that require a great deal of flexibility and agility. Public cloud environments meet these needs through automation - particularly via infrastructure as code (IaC). Two leading IaC options are Hashicorp Terraform and Bicep. Terraform is an open-source tool that helps DevOps professionals manage on-premises and cloud services using declarative code. Microsoft Bicep utilizes declarative syntax to simplify the deployment of Azure resources.

In this article, we will compare several key user-experience features to identify similarities and differences between Terraform and Bicep.

## Language syntax

Bicep and Terraform are domain-specific languages (DSL) that are easy to use and save developer time. Both tools incorporate similar keywords and concepts. Some of these concepts are parameterization, support for multi-file projects, and support for external modules. Terraform, however, offers a richer library of built-in functionality for certain tasks. Deciding between the two is a matter of preference and experience. The following are brief overviews and some of the user-friendly features that each language syntax offers.

Bicep is a declarative language. As such, the order in which the elements are defined in the code doesn't impact how deployment is processed. Bicep's default target scope is the `resourceGroup`. Users can employ variables to encapsulate complex expressions and make Bicep files more readable. The concept of modules enables the reuse of Bicep code across projects or teams.

Terraform is also a declarative language that leverages the HashiCorp Configuration Language (HCL). The primary purpose of HCL is to declare resources. Other language features serve to make defining resources more convenient. And like Bicep, the ordering of code in Terraform configuration files isn't significant.

## Language helpers

Both Bicep and Terraform provide *language helpers* to simplify coding tasks. Since both are user-friendly, the choice largely depends on preferences and requirements.

Bicep supports expressions to make your code more dynamic and flexible. Different types of functions can be used in a Bicep file. Some of these function types are logical, numeric, and objection functions. Loops can define multiple copies of a resource, module, property, variable, or output. Loops help to avoid repeating syntax in a Bicep file.

Terraform also offers built-in functions that are called from within expressions to transform and combine values. Like Bicep, Terraform expressions can include complex expressions such as references to data exported by resources and conditional evaluation. Loops can handle collections and can produce multiple instances of a resource without the need to repeat code.

## Modules

Both Bicep and Terraform support the concept of modules. Modules allow you to create reusable components from your code. Modules play a key role in scaling infrastructure and keeping configuration clean. Since modules encapsulate groups of resources, they reduce the amount of code that must be developed for similar infrastructure components. While modules function similarly in Bicep and Terraform, they vary in implementation.

In Bicep, a module is simply a Bicep file that is deployed from another Bicep file. Bicep modules serve to improve the readability of Bicep files. These modules are also scalable. Users can share modules across teams to avoid code duplication and reduce errors. For more information about defining a Bicep module, see [Bicep modules](/azure/azure-resource-manager/bicep/modules).

In Terraform, [modules](https://www.terraform.io/language/modules) are the primary means of packaging and reusing resource configurations. Each Terraform configuration has at least one module that is referred to as its root module. This consists of resources that are defined in the `.tf` files within the main working directory. In addition to modules from the local filesystem, Terraform can also load modules from various sources, such as a registry, local path, modules, or GitHub. This makes it easy to create and share re-usable modules within an organization.

## Provisioning lifecycle

Both Terraform and Bicep allow developers to validate a configuration before deployment and subsequently apply the changes. Terraform provides more flexibility to destroy all remote objects that are managed by a particular configuration. This is particularly useful to clean up temporary objects once your work is completed. It is crucial to consider the lifecycle requirements of typical infrastructure deployments when choosing the best option.

Bicep offers a [what-if](/azure/azure-resource-manager/bicep/deploy-what-if?tabs=azure-powershell%2CCLI) operation that allows you to preview changes before deploying a Bicep file. The Azure Resource Manager provides the `what-if` operation and does not make any changes to existing resources. It is then possible to use Azure PowerShell or Azure CLI with your Bicep files to [deploy your resources to Azure](/azure/azure-resource-manager/bicep/deploy-powershell). To accomplish this, you will need a local Bicep file and Azure PowerShell or Azure CLI must be authenticated to Azure. Note that neither Azure PowerShell nor Azure CLI support deploying remote Bicep files. However, you can use Bicep CLI to build your Bicep file to a JSON template and then load the JSON file to a remote location.

In Terraform, the [terraform plan](https://www.terraform.io/cli/commands/plan) command is similar to the Bicep `what-if` operation. With the `terraform plan` command, you create an *execution plan* to preview before applying it. You then apply the execution plan via the [terraform apply](https://www.terraform.io/cli/commands/apply) command. The apply command is an integral Terraform features since it highlights the changes, additions, and deletions done to align the current cloud-infrastructure state to the desired state.

## Getting started

Bicep and Terraform both offer resources to help you get you started. Microsoft Learn offers a [Bicep learning module](/azure/azure-resource-manager/bicep/learn-bicep). The module helps you define how your Azure resources should be configured and guides you through the deployments of several Azure resources to give you hands-on experience.

Likewise, HashiCorp Learn provides users with a variety of [Terraform training resources](https://learn.hashicorp.com/tutorials/terraform/infrastructure-as-code?in=terraform/azure-get-started) to teach you how to install and use Terraform. These resources include information showing how to use Terraform to provision infrastructure on Azure.

## Code authoring

The code-authoring experience is dependent on the number of add-ins that are available for your editor of choice. Fortunately, both Bicep and Terraform offer resources to improve code-authoring efficiency.

For Bicep, one of the most effective add-ins is the [Bicep Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). The extension provides such features as code validation, Intellisense, dot-property access, and property auto-completion.

For Terraform, the [Terraform Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=HashiCorp.terraform) with the [Terraform Language Server](https://github.com/hashicorp/terraform-ls) offers many of the same features as the Bicep Visual Studio Code extension. For example, the extension also supports syntax highlighting, IntelliSense, code navigation, and a module explorer. HashiCorp also offers [detailed installation instructions] on its GitHub repo (https://github.com/hashicorp/terraform-ls/blob/main/docs/USAGE.md) for configuring and using the Terraform Language Server.

## Azure coverage

Bicep has an advantage over Terraform when it comes to configuring Azure resources. Bicep is deeply integrated with Azure services. Moreover, it offers immediate support for new Azure features. Terraform provides two providers that allow users to manage Azure: AzureRM and AzAPI. The AzureRM provider offers a fully tailored experience for stable Azure services. Sometimes getting to this tailored experience can result in a bit of a delay. The AzAPI provider is a very thin layer on top of the Azure ARM REST APIs, which like Bicep, enables immediate support for new Azure features. It is important to consider your organization’s infrastructure requirements and whether they are fully supported before making a decision.

## Community and Support

The community plays a key role in helping to learn and overcome challenges. Both the Terraform and Bicep communities offer a high level of engagement and support.

For Terraform support, where you go for help depends on the nature of the issue:

- For issues with [Terraform documentation on the Microsoft Docs site](/azure/developer/terraform/), each article has a Feedback section.
- For questions, use-cases, and useful patterns, visit the [Terraform section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-core).
- For Terraform provider-related questions, visit the [Terraform Providers section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-providers).

## Summary

Bicep and Terraform are two leading IaC options that make it easy to configure and deploy Azure resources. Both offer user-friendly features that help organizations boost efficiency and productivity. When assessing the best fit for your organization, carefully consider your infrastructure requirements and preferences.
