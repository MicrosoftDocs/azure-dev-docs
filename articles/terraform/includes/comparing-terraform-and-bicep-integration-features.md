---
ms.author: tarcher
ms.topic: conceptual
ms.date: 04/22/2023
ms.custom: devx-track-terraform, devx-track-bicep
---

To achieve scale, DevOps teams are always looking for ways to quickly deploy code with a trusted and repeatable process. When it comes to the cloud and infrastructure, this process is increasingly accomplished with infrastructure-as-code (IaC). IaC tools range from general-purpose tools to tools intended for specific environments. Terraform is an example of the former, while Bicep is designed to handle Azure-related tasks.

In this article, we compare nine infrastructure and integration features of Bicep and Terraform. Understanding these differences helps you decide which tool best supports your infrastructure and processes.  

## State and backend

Both Terraform and Bicep are desired state configuration (DSC) which makes it easy to manage IT and development infrastructure as code. Terraform stores state about your managed infrastructure and configuration. Terraform uses this information to map real-world resources to your configuration, track metadata, and improve the performance of larger infrastructures. State is stored in a local file named `terraform.tfstate`, but can also be [stored remotely](../store-state-in-azure-storage.md). It's critical to back up and secure your state files.  Like Terraform, Bicep is declarative and goal-seeking. However, Bicep doesn't store state. Instead, Bicep relies on incremental deployment.

## Infrastructure targets

When comparing Bicep to Terraform for managing cloud infrastructure, it's important to consider your target cloud environment:

- Azure-only
- Multi or hybrid-clouds

Bicep is Azure-specific and not designed to work with other cloud services.

If your goal is to automate deployments to any of the following environments, Terraform is likely the better option:

- Virtualization environments
- Multicloud scenarios - such as Azure and other cloud(s)
- On-premises workloads

Terraform interacts with other cloud providers or APIs using plugins called *providers*. There are several [Terraform Azure providers](../overview.md#terraform-providers-for-azure-infrastructure) that enable the management of Azure infrastructure. When coding a Terraform configuration, you specify the required providers you're using. When you run [terraform init](https://www.terraform.io/docs/commands/init.html), the specified provider is installed and usable from your code.

## CLI tools

Command Line Interface (CLI) tools play a key role in orchestration through the implementation and management of automation technology. Both Bicep and Terraform offer CLI tools.

Bicep integrates with Azure CLI, allowing developers to use `az` commands such as:

- `az bicep`: The [az bicep](/cli/azure/bicep) commands allow you to perform such tasks as installing Bicep, and building and publishing Bicep files.
- `az deployment`: The article [How to deploy resources with Bicep and Azure CLI](/azure/azure-resource-manager/bicep/deploy-cli) explains how to use Azure CLI with Bicep files to deploy your resources to Azure.

The Terraform CLI allows you to perform such tasks as validate and format your Terraform code, and create and apply an execution plan.

- The article [Quickstart: Create an Azure resource group using Terraform](../create-resource-group.md) shows you how to use several of the Terraform commands to create an Azure resource group.

Bicep also provides a feature that makes it easy to integrate Bicep with Azure Pipelines. There's a similar feature available for Terraform but you must download and install the [Azure Pipelines Terraform Tasks extension for Visual Studio](https://marketplace.visualstudio.com/items?itemName=charleszipp.azure-pipelines-tasks-terraform). Once installed, you can run Terraform CLI commands from Azure Pipelines. Moreover, both Terraform and Bicep support [GitHub Actions](https://github.com/features/actions) to automate software builds, tests, and deployments.

## Processing

There are some important differences between Bicep and Terraform in terms of the efficiency and optimizations of deployments. With Bicep, processing occurs within the core Azure infrastructure service side. This feature offers advantages such as preflight processing to check policy or the availability for deploying multiple instances within a region. With Terraform, processing is done within the Terraform client. Thus, preprocessing involves no calls to Azure since it uses state and HCL (HashiCorp Language) to determine the required changes.

## Authentication

The Azure authentication features vary between Bicep and Terraform. With Bicep, an authorization token is supplied during the request to submit a Bicep file and ARM Template. ARM ensures that you have permission to both create the deployment and deploy resources within the specified template. Terraform authenticates each API based on provider credentials – such as Azure CLI, service principal, or [managed identities for Azure resources](/azure/active-directory/managed-identities-azure-resources/overview). Moreover, multiple provider credentials can be utilized in a single configuration.

## Azure integrations

You should also consider your use of Azure features such as [Azure Policy](/azure/governance/policy/overview) and how each interacts with other tools and languages. Bicep's preflight validation determines whether a resource doesn't comply with a policy so that it fails before a deployment. Thus, developers can remediate resources with policy using provided ARM templates. The ARM template can be used to create a policy assignment to another resource for automated remediation. Terraform, however, fails when a resource is deployed that is disallowed due to policy.

## Portal integration

One major advantage that Bicep has over Terraform is the ability to automate portal actions. With Bicep, you can use the Azure portal to export templates. Exporting a template helps you to understand the syntax and properties that deploy your resources. You can automate future deployments by starting with the exported template and modifying it to meet your needs. Until Terraform templates are supported, you need to translate the exported template manually.

Although Terraform doesn't provide the same portal integrations as Bicep, existing Azure infrastructure can be taken under Terraform management using [Azure Export for Terraform](../azure-export-for-terraform/export-terraform-overview.md). (Azure Export for Terraform is an open-source tool owned and maintained by Microsoft on the [Azure/aztfexport GitHub repo](https://github.com/Azure/aztfexport).)

## Out-of-band changes

Out-of-band configuration changes are changes made to a device configuration outside the context of the tool. For example, let's say you deploy a Virtual Machine Scale Set using Bicep or Terraform. If you change that Virtual Machine Scale Set using the portal, the change would be "out-of-band" and unknown to your IaC tool.

If you're using Bicep, out-of-band changes should be reconciled with Bicep and the ARM Template code to avoid having those changes overwritten on the next deployment. These changes don't block the deployment.

If you're using Terraform, you need to import the out-of-band changes into the Terraform state and update the HCL.

Thus, if an environment involves frequent out-of-band changes, Bicep is more user-friendly. When you use Terraform, you should minimize out-of-band changes.

## Cloud frameworks

The [Cloud Adoption Framework (CAF)](/azure/cloud-adoption-framework/) is a collection of documentation, best practices, and tools to accelerate cloud adoption throughout your cloud journey. Azure provides native services for deploying landing zones. Bicep simplifies this process with a portal experience based on ARM templates and landing-zone implementation. Terraform utilizes an [Enterprise-Scale Landing Zones module](/azure/cloud-adoption-framework/ready/landing-zone/terraform-module) to deploy, manage, and operationalize with Azure.

## Summary

Bicep and Terraform offer many user-friendly infrastructure and integration features. These features make it easier to implement and manage automation technology. When deciding which is best for your environment, it's important to consider if you're deploying to more than one cloud or whether your infrastructure consists of a multi or hybrid-cloud environment. Moreover, be sure to consider the nine features discussed in this article to make the best choice for your organization.
