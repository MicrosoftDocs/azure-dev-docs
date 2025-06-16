---
title: Explore Azure Developer CLI Template Galleries
description: Learn about Azure Developer CLI templates and the available template galleries, including Awesome AZD and the AI Template Gallery.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/10/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Explore the Azure Developer CLI template galleries

Azure Developer CLI (`azd`) templates simplify the process of building, provisioning, and deploying applications on Azure. This document explores what these templates are, their purpose, and the available galleries, including [Awesome AZD](#awesome-azd) and the [AI Template Gallery](#the-ai-app-templates-gallery).

## What are Azure Developer CLI templates?

[Azure Developer CLI templates](/azure/developer/azure-developer-cli/azd-templates) are standardized project structures that include application code, infrastructure as code (IaC) files, and deployment configurations. These templates are designed to help developers quickly set up and deploy full-stack applications on Azure. They provide a starting point for common application architectures and integrate seamlessly with Azure services.

Key features of Azure Developer CLI templates:

- Include infrastructure as code to create app resources like Azure App Service or Azure OpenAI
- Define deployment configurations to package and deploy apps built with various languages
- Enable simplified, automated workflows for provisioning resources and deploying applications
- Provide starting points or architectural examples for building cloud-native apps

For more detailed information on `azd` templates, visit the [templates overview](/azure/developer/azure-developer-cli/azd-templates) page.

## What are template galleries?

Template galleries offer curated collections of reusable `azd` templates to help you get started with building and deploying applications on Azure. They provide developers with various ready-to-use templates for different use cases, such as web applications, AI-powered solutions, and microservices architectures.

These galleries help developers:

- Quickly prototype and deploy applications
- Explore sample architectures for specific scenarios
- Learn best practices for Azure app development
- Share and build on community-contributed templates

## Explore the galleries

You can explore templates from different galleries using a local editor like Visual Studio Code, or directly in the browser with GitHub Codespaces. The following sections highlight two key galleries that showcase different types of templates for various use cases.

### Awesome AZD

[**Awesome AZD**](https://azure.github.io/awesome-azd/) is a community-driven collection of Azure Developer CLI templates, tools, and resources. It includes templates for various application types, contributed by both Microsoft and the developer community. The gallery is designed to showcase best practices and innovative use cases for `azd`.

:::image type="content" source="media/get-started/awesome-azd.png" alt-text="A screenshot showing the home page of the Awesome AZD template gallery.":::

Key highlights of Awesome AZD:

- Templates for web apps, APIs, microservices, and more
- Community-contributed examples for real-world scenarios
- Resources for extending and customizing Azure Developer CLI workflows

To learn more or contribute to the Awesome AZD gallery, visit the [Awesome AZD GitHub repository](https://github.com/Azure/awesome-azd).

### The AI App Templates gallery

The [**AI App Templates**](https://azure.github.io/ai-app-templates/) gallery is a specialized collection of Azure Developer CLI templates focused on AI-powered applications. These templates help developers quickly build intelligent solutions by integrating with Azure AI services such as Azure OpenAI and Azure AI Foundry.

:::image type="content" source="media/get-started/ai-template-gallery.png" alt-text="A screenshot showing the home page of the AI App Template gallery.":::

Key highlights of the AI Template Gallery:

- Templates for chatbots, recommendation systems, and other AI use cases.
- Preconfigured infrastructure for integrating Azure AI services.
- Examples of how to use AI capabilities in cloud-native applications.

The AI Template Gallery simplifies the process of building and deploying AI-driven applications by providing ready-to-use templates and best practices.

### Add your own custom template sources

In addition to using the predefined galleries, you can also [add your own template sources](/azure/developer/azure-developer-cli/configure-template-sources) to customize your development workflow. This allows you to create and share templates tailored to your specific needs or organization.

To add a custom template source:

1. Create a repository containing your templates. Each template should follow the Azure Developer CLI template structure, including application code, infrastructure as code files, and deployment configurations.

1. Use the `azd template` command to add your repository as a source. For example:

   ```bash
   azd template add --source <repository-url>
   ```

1. Once added, you can list and use your custom templates just like the predefined ones:

   ```bash
   azd template list
   ```

By adding your own template sources, you can extend the capabilities of the Azure Developer CLI and streamline development for your team or projects.

## Conclusion

Azure Developer CLI template galleries, such as Awesome AZD and the AI Template Gallery, provide developers with powerful starting points for building and deploying applications on Azure. Whether you're creating a web app, exploring AI capabilities, or learning best practices, these galleries offer valuable resources to accelerate your development process.
