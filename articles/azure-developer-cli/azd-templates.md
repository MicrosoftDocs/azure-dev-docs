---
title: Azure Developer CLI templates
description: Learn more about the role of templates with the Azure Developer CLI (azd).
author: hhunter-ms
ms.author: hannahhunter
ms.date: 08/01/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# Azure Developer CLI templates

The Azure Developer CLI uses idiomatic application templates that include the scaffolding for monitoring and CI/CD for your application.
Each template includes application code,  infra-as-code files (written in Bicep) needed to provision the Azure resources, and an azure.yaml file that describes your application. 

**Azure Developer CLI templates** are sample repositories created using the Azure Developer CLI conventions so that you can use `azd`. Each template includes app code, tools, and infrastructure code. The template configures continuous integration and delivery (CI/CD) pipelines. These pipelines serve as a foundation from which you can build upon and customize to create your own solutions.

The quickest way to get started with azd is to refer to the README in an Azure Developer CLI enabled template.

The Azure Developer CLI uses idiomatic application templates that extend beyond “Hello World!” to include the scaffolding for monitoring and CI/CD for your application.

Each template includes application code, an /infra directory containing all the infra-as-code files (written in Bicep) needed to provision the Azure resources, and an azure.yaml file that describes your application. These templates are extensible and customizable to your specific use case.

For our first preview, we’ve authored an initial set of template applications written in Python, JavaScript/TypeScript, and C# and for hosts such as Azure App Service, Azure Container Apps, and Azure Static Web Apps + Function Apps. Check out our growing list of templates.

For information on authoring your own template or “templatizing” an existing application, see our Developer Hub.