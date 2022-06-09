---
title: What is the Azure Developer CLI?
description: Overview of the features and capabilities of the Azure Developer CLI that helps developers be more productive when building and deploying applications to Azure.
author: puicchan
ms.author: puichan
ms.date: 06/09/2022
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---

# What is the Azure Developer CLI?

The Azure Developer CLI (azd) is a developer-centric command-line tool for building cloud applications. The azd is a set of commands that allows you to work consistently across azd templates, DevOps workflows, and your IDE (intergrated development environment).

The azd offers the following features:

- Reduces the time required for a developer to be productive.
- Helps developers quickly onboard and understand core Azure development constructs.
- Demonstrates opinionated best practices for Azure development.

The following 2-minute video presents a high level overview of `azd`:

<a href="https://msit.microsoftstream.com/video/9e850840-98dc-b654-ecea-f1ecd7ca302a?referrer=https:%2F%2Fstatics.teams.cdn.office.net%2F"><img src="media/azure-dev-cli-overview/video.png" alt="Click to watch video"></a>

## Recommended azd workflow

The following steps are the recommended workflow to using azd:

1. Select an [Azure Developer CLI template](azure-dev-cli-templates.md).
1. Download (clone) the sample by running `azd up`.
1. Customize the cloned template to meet your needs.

The following image shows a graphical representation of the suggested workflow:

![The standard azd workflow](media/azure-dev-cli-overview/azd-dev-workflow.png)

## azd templates

The [azd templates](azure-dev-cli-templates.md) are sample repositories created using azd conventions. Each template includes the application code, tools, infrastructure code, and CI/CD pipelines that serve as a foundation. Once you download (clone) a template, you can customize the code to create your own solutions. In addition, you can use azd subcommands to manage cloud resources, configure CI/CD, and monitor application health.

## Next steps

> [!div class="nextstepaction"] 
> [Azure Developer CLI (azd) supported environments and Azure services](development-environment-options.md)
