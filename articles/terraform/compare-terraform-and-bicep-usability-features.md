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

In this article, we will compare nine key user-experience features to identify similarities and differences between Terraform and Bicep.

## Language syntax

Bicep and Terraform are domain-specific languages (DSL) that are easy to use and save developer time. Both tools incorporate similar keywords and concepts. Some of these concepts are parameterization, support for multi-file projects, and support for external modules. Terraform, however, offers a richer library of built-in functionality for certain tasks. Deciding between the two is a matter of preference and experience. The following are brief overviews and some of the user-friendly features that each language syntax offers.

|Bicep|Terraform|
|Bicep is a declarative language. This means that elements can appear in any order which does not impact how deployment is processed. Bicep’s default target scope is the resourceGroup.  Users can use variables to encapsulate complex expressions and make Bicep files more readable. And modules save developers time by allowing them to reuse code from a Bicep file in other Bicep files.|Terraform is also a declarative language that requires developers to write programs in the HashiCorp Configuration Language (HCL). Its primary purpose is to declare resources. Other language features serve to make defining resources more convenient. And like Bicep, the ordering of blocks and files in Terraform is generally not significant.

## Language Helpers

Both Bicep and Terraform provide language helpers that simplify coding and save time. Since both are user-friendly, the choice largely depends on preferences and requirements.

|Bicep|Terraform|
|Bicep supports expressions to make your code more dynamic and flexible. For instance, functions and loops. Many different types of functions can be used in a Bicep file. For example, logical, numeric, and objection functions. Loops can define multiple copies of a resource, module, property, variable, or output. They help to avoid repeating syntax in a Bicep file.|Terraform also offers built-in functions that are called from within expressions to transform and combine values. . Like Bicep, Expressions can be widely used throughout the Terraform language and can include complex expressions such as references to data that is exported by resources and conditional evaluation. Loops can handle collections and can produce multiple instances of a resource without the need to repeat code.|

Modules 

Both Bicep and Terraform offer modules that make it easy to wrap resources into reusable components. Modules play a key role in scaling infrastructure and keeping configuration clean. Since modules encapsulate groups of resources, they reduce the amount of code that must be developed for similar infrastructure components. While modules function similarly in Bicep and Terraform, they vary in implementation. 

Bicep 

A module is simply a Bicep file that is deployed from another Bicep file. They serve to improve the readability of Bicep files. They are also scalable. Users can create and share modules with other people within an organization and utilize them for different deployments. To create a module, you must first define it using the right syntax.

The specified path can be either a local file or a file in a registry. It is generally not necessary to set dependencies since they are determined implicitly. 

Terraform 

Modules are the primary means of packaging and reusing resource configurations within Terraform. Each Terraform configuration has at least one module that is referred to as its root module. This consists of resources that are defined in the .tf files within the main working directory. In addition to modules from the local filesystem, Terraform can also load modules from various sources, such as a registry, local path, modules, or GitHub. This makes it easy to create and share re-usable modules within an organization. 

Provisioning Lifecycle 

Both Terraform and Bicep allow developers to validate a configuration before deployment and subsequently apply the changes. Terraform provides more flexibility to destroy all remote objects that are managed by a particular configuration. This is particularly useful to clean up temporary objects once your work is completed. It is crucial to consider the lifecycle requirements of typical infrastructure deployments when choosing the best option. 

Bicep 

Bicep offers a what-if operation that allows you to preview changes before deploying a Bicep file. The Azure Resource Manager provides the what-if operation and does not make any changes to existing resources. It is then possible to use Azure PowerShell or Azure CLI with your Bicep files to deploy your resources to Azure. To accomplish this, you will need a local Bicep file and Azure PowerShell or Azure CLI must be connected to Azure. Note that Azure PowerShell and Azure CLI do not support deploying remote Bicep files. But you can use Bicep CLI to build your Bicep file to a JSON template and then load the JSON file to a remote location. 

Note that it is possible for properties to be incorrectly reported as deleted when they are not in the Bicep file, but are automatically set during deployment as default values. When this occurs, the result is considered “noise” in the what-if response. Bicep tracks these occurrences. 

Terraform 

The terraform plan command is similar to Bicep’s what-if operation. It allows you to preview proposed changes to your infrastructure. The command will not, however, execute the proposed changes. You can deploy the changes with the terraform apply command. The apply command is an integral Terraform features since it highlights the changes, improvements, and deletions that must occur to align the current state to the desired state. 

Getting Started 

Bicep and Terraform both offer resources to help you get up and running relatively quickly. Microsoft Learn offers a module on Bicep. The module will help you to define how your Azure resources should be configured and walk you through the deployments of several Azure resources to give you hands-on experience. 

Likewise, HashiCorp Learn provides users with a variety of training resources to learn how to install and use Terraform, as well as resources that will show you how to use Terraform to provision infrastructure on Azure. 

Authoring

The authoring experience is dependent on the number of add-ins that are available for your editor of choice. Fortunately, both Bicep and Terraform offer resources to improve authoring efficiency. 

Bicep 

One of the most effective add-ins is the Bicep VS Code extension. The extension provides user friendly features such as code validation and navigation. 


Terraform 

The Terraform Visual Studio Code extension with the Terraform Language Server offers many of the same features as the Bicep VS Code extension. For example, syntax highlighting, IntelliSense, code navigation, and a module explorer. Terraform also offers detailed installation instructions for popular IDEs and how to configure your settings. 

Community 

The community plays a key role in helping us to learn and overcome challenges. Both the Terraform and Bicep communities offer a high level of engagement and support. Since Terraform has been around longer, it has a larger community than Bicep. The Azure Terraform community is active but is generally not as large as other providers. While the Bicep community is smaller, it is also very passionate and active. 

Azure Coverage 

Bicep has an advantage over Terraform when it comes to configuring Azure resources. Bicep is deeply integrated with Azure services. Moreover, it offers immediate support for new Azure features. Terraform provides two providers that allow users to manage Azure: AzureRM and AzAPI. The AzureRM provider offers a fully tailored experience for stable Azure services. Sometimes getting to this tailored experience can result in a bit of a delay. The AzAPI provider is a very thin layer on top of the Azure ARM REST APIs, which like Bicep, enables immediate support for new Azure features. It is important to consider your organization’s infrastructure requirements and whether they are fully supported before making a decision. 

Support

Both Bicep and Az Provider for Terraform are supported by Microsoft Support. Since Terraform is not a Microsoft product, users must seek support from HashiCorp for Terraform and HCL.. 

Conclusion

Bicep and Terraform are two leading IaC options that make it easy to configure and deploy Azure resources. Both offer user-friendly features that help organizations boost efficiency and productivity. When assessing the best fit for your organization, carefully consider your infrastructure requirements and preferences. 


