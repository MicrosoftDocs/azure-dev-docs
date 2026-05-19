---
title: Azure for developers overview
description: An overview of Azure from a developer's perspective.
keywords: azure billing, azure portal
ms.service: azure
ms.topic: overview
ms.date: 03/25/2026
ms.custom: overview
---

# Azure for developers overview

If you're new to developing applications for the cloud, start with this seven-article series.

* Part 1: **Azure for developers overview**
* Part 2: [Key Azure services for developers](azure-developer-key-services.md)
* Part 3: [Hosting applications on Azure](hosting-apps-on-azure.md)
* Part 4: [Connect your app to Azure services](connect-to-azure-services.md)
* Part 5: [How do I create and manage resources in Azure?](azure-developer-create-resources.md)
* Part 6: [Key concepts for building Azure apps](azure-developer-key-concepts.md)
* Part 7: [How am I billed?](azure-developer-billing.md)

Azure is a cloud platform designed to simplify the process of building modern applications. Whether you choose to host your applications entirely in Azure or extend your on-premises applications with Azure services, Azure helps you create applications that are scalable, reliable, and maintainable.

Azure supports the most popular programming languages in use today, including .NET, C++, Go, Java, JavaScript, Python, and Rust. With a comprehensive SDK and extensive support in tools you already use like VS Code, Visual Studio, IntelliJ, and Eclipse, Azure builds on the skills you already have and helps you be productive right away.

Azure also provides a suite of developer tools that streamline how you build, deploy, and manage cloud applications.

## Application development scenarios on Azure

Incorporate Azure into your application in different ways depending on your needs. The following video provides a helpful overview of the most popular development scenarios for Azure developers:


> [!VIDEO e882f09e-efff-465d-a72e-1b430631e6bf]


Common software development and deployment scenarios on Azure include the following options:

- **Application hosting on Azure -** Host your entire application stack: web applications, APIs, databases, and storage services. Azure supports various hosting models from fully managed services to containers to virtual machines. When you use fully managed Azure services, your applications take advantage of the scalability, high availability, and security built into Azure.

- **Consuming cloud services from existing on-premises applications -** Extend existing on-premises apps with Azure services. For example, an application can use Azure Blob Storage to store files, Azure Key Vault to securely store application secrets, or [Azure AI Search](/azure/search/search-what-is-azure-search) to add full-text search capability. These fully managed services integrate with your apps without changing your application architecture or deployment model.

- **Container based architectures -** Use container-based services to modernize your apps. Whether you need a private registry for container images, you're containerizing an existing app for easier deployment, deploying microservices-based applications, or managing containers at scale, Azure has solutions that support your needs.

- **AI driven applications -** Build AI-powered applications on your terms, in your preferred programming language, in the cloud, on-premises, or at the edge. Azure provides access to powerful foundation models through Azure OpenAI, prebuilt AI services for speech, vision, and language, and tools for building intelligent agents using the Model Context Protocol (MCP). Get started with [AI app development on Azure](../ai/azure-ai-for-developers.md) or explore [AI resources by programming language](../ai/resources-overview.md).

- **Modern serverless architectures -** Use Azure Functions to simplify building event-driven solutions, whether responding to HTTP requests, handling file uploads in Blob storage, or processing queue events. You write only the code necessary to handle your event without worrying about servers or framework code. Use more than 250 connectors to Azure and other services to tackle integration problems.

- **Developer tools -** Azure provides tools for every stage of the development lifecycle, including the [Azure Developer CLI (`azd`)](../azure-developer-cli/overview.md), [GitHub Copilot for Azure](../github-copilot-azure/introduction.md), [Azure Tools for VS Code](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), and [Azure development with Visual Studio](/visualstudio/azure/overview-azure-integration). For a hands-on walkthrough, see [Quickstart: Azure developer tools](quickstart-developer-tools.md).

How do you implement those scenarios? The next article, "Key Azure services for developers", gives several Azure service options to implement each scenario.

> [!div class="nextstepaction"]
> [Continue to part 2: Key Azure services for developers](azure-developer-key-services.md)
