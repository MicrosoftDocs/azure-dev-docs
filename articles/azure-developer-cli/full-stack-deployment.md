---
title: Full-stack deployment with Azure Developer CLI
description: Learn how to design and build full-stack applications with front-end and back-end services using Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/13/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Full-stack deployment with Azure Developer CLI

Full-stack applications that combine front-end and back-end services are a common pattern in modern web development. The Azure Developer CLI (`azd`) supports deploying full-stack applications where the front-end (static content or single-page application) and back-end (API or service layer) are hosted as separate services. This article provides guidance on designing and building full-stack deployments with `azd`.

## What is a full-stack deployment?

A full-stack deployment with `azd` typically consists of:

- **Front-end service**: A user-facing web application, often built with frameworks like React, Angular, Vue, or Blazor. The front-end might be hosted as a static site or as a containerized application.
- **Back-end service**: An API or service layer that handles business logic, data access, and integrations. The back-end is typically hosted in containers or as serverless functions.
- **Shared resources**: Databases, storage accounts, key vaults, and other Azure resources that both services might use.

With `azd`, you can define both services in a single [`azure.yaml`](./azd-schema.md) file and provision them together using infrastructure-as-code ([Bicep](/azure/azure-resource-manager/bicep/overview) or [Terraform](/azure/developer/terraform/overview)).

## Azure Developer CLI lifecycle

The Azure Developer CLI follows a structured workflow with distinct lifecycle events:

:::image type="content" source="./media/full-stack-deployment/full-stack-deployment-lifecycle.png" alt-text="Diagram showing the Azure Developer CLI lifecycle with package, provision, and deploy phases." :::

1. **Package**: Build your application source code and prepare artifacts for deployment
1. **Provision**: Create or update Azure infrastructure resources using Bicep or Terraform
1. **Deploy**: Deploy your packaged application code to the provisioned infrastructure

The `azd up` command runs all three phases sequentially. You can also run each phase independently using `azd package`, `azd provision`, and `azd deploy` for more granular control. Understanding this lifecycle is essential for managing dependencies between services, especially in full-stack deployments where timing and order matter.

For more information about the `azd` lifecycle and workflow customization, see [Explore the azd up workflow](./azd-up-workflow.md).

## Infrastructure design considerations

When designing a full-stack application with `azd`, choose the appropriate Azure hosting services for your front-end and back-end:

| Service type | Hosting options | Use case |
|-------------|----------------|----------|
| Front-end | [Azure Static Web Apps](/azure/static-web-apps/), [Azure App Service](/azure/app-service/), [Azure Container Apps](/azure/container-apps/) | Static sites, SPAs, server-rendered apps |
| Back-end | [Azure Container Apps](/azure/container-apps/), [Azure App Service](/azure/app-service/), [Azure Functions](/azure/azure-functions/), [Azure Kubernetes Service](/azure/aks/) | APIs, microservices, serverless functions |

Learn more about [hosting applications on Azure](/azure/developer/intro/hosting-apps-on-azure).

## Understand interdependency between front-end and back-end applications

Full-stack deployments often encounter circular dependency challenges where each service needs information about the other before it can be fully configured. Understanding these interdependencies helps you design effective deployment workflows.

:::image type="content" source="./media/full-stack-deployment/full-stack-circular-dependency.png" alt-text="Diagram illustrating circular dependency between front-end and back-end services in full-stack deployments." :::

**Front-end needs back-end URL**: Your front-end application typically needs to know the back-end API endpoint URL at build time or runtime. However, the back-end service doesn't have a URL until it's deployed to Azure.

**Back-end needs front-end URL**: Your back-end service might need the front-end URL to configure CORS policies, but the front-end doesn't have a URL until it's deployed.

**Shared resource dependencies**: Both services might depend on shared resources like databases, key vaults, or storage accounts. These resources must be provisioned before either service can be configured to use them.

**Environment-specific configuration**: Different environments (development, staging, production) require different endpoint URLs and configurations, but these values aren't known until provisioning completes.

## Understand Configuration resolution strategies

Azure Developer CLI handles these interdependencies through two approaches: 
- Resolve immediate dependencies configuration during provisioning and deployment
- Defer dependency configuration to runtime. 

These approaches represent design decisions you make when building your application. You can use one strategy exclusively or combine both depending on your architecture and requirements.

:::image type="content" source="./media/full-stack-deployment/full-stack-dependency-resolution.png" alt-text="Diagram comparing immediate versus deferred dependency resolution strategies for full-stack deployments." :::

### Immediate dependency resolution

Immediate dependency resolution means that service connections and configurations are determined and locked in during the `azd provision` and `azd deploy` phases. With this approach, services are configured with specific endpoint URLs, connection strings, and other dependency information before they start running. This configuration becomes part of the deployed service's environment, either as environment variables or in configuration files packaged with the deployment.

**Infrastructure-first provisioning**: When you run `azd up` or `azd provision`, the infrastructure is created first. This generates the necessary URLs and connection strings before deployment begins, ensuring dependent services have the information they need.

**Output variables**: Bicep and Terraform can output values (like URLs and connection strings) after provisioning. These outputs become available as environment variables during the deployment phase, allowing services to be configured with the correct endpoints before they start.

**Sequential deployment**: For complex scenarios, you might need to deploy services in a specific order. Use `azd` [hooks](./azd-extensibility.md) to control deployment sequence, ensuring that prerequisite services are running before dependent services are deployed.

**Container upsert pattern**: Azure Verified Modules (AVM) provide container app patterns like `container-app-upsert` that work seamlessly with `azd`'s two-phase workflow. During provisioning, the infrastructure and initial container are created. During deployment, `azd` upserts the container image with updated environment variables that include values generated during provisioning (such as database connection strings or service URLs). This pattern resolves the chicken-and-egg problem by allowing the infrastructure to exist first, then updating the container configuration with all required dependency information.

### Deferred dependency resolution

Deferred dependency resolution allows applications to load configuration at runtime rather than during deployment. This approach provides flexibility to update service endpoints, connection strings, and policies without redeploying your application.

**Configuration sources**: Applications can load runtime configuration from two primary sources:

- **Local configuration files**: Deploy a configuration file (such as `config.json`) alongside your application. The application loads this file at startup to get current endpoint URLs, authentication settings, and other configuration values. This works well for client-side frameworks like React, Angular, Vue, and Blazor WebAssembly that can fetch configuration when the application starts in the browser.

- **Cloud configuration services**: Use [Azure App Configuration](/azure/azure-app-configuration/overview) or similar services to centrally manage configuration across all environments. Applications query the configuration service at startup or on-demand to retrieve current values. This approach is useful for microservices architectures where multiple services need coordinated configuration updates.

**Benefits**: With either approach, configuration changes become available immediately without redeployment. Update the configuration file through your deployment pipeline, or change values in [Azure App Configuration](/azure/azure-app-configuration/overview) through the Azure portal. When the application restarts or refreshes its configuration, it picks up the new values. This pattern is especially useful for:

- Front-end applications that need to discover back-end API URLs, authentication endpoints, and microservice locations
- Back-end services that need to update CORS policies as front-end URLs change
- Services that need different configuration across development, staging, and production environments

This approach doesn't work for statically generated sites where all content is pre-rendered at build time.

## Plan your deployment workflow

Consider these factors when designing your full-stack deployment:

1. **Identify dependencies**: Map out which services need information from other services. For one-directional dependencies (such as an API depending on a database), the provisioning platform (Bicep or Terraform) handles the ordering automatically. For circular dependencies (such as front-end and back-end services that both need each other's URLs at startup), you must design coordination using immediate or deferred dependency resolution strategies.
1. **Provision before deploy**: Ensure all infrastructure exists before deploying application code. 
1. **Use environment variables**: Pass configuration between infrastructure and application layers using [azd environment variables](./manage-environment-variables.md)
1. **Design for multiple environments**: Plan how configuration differs across development, staging, and production environments
1. **Consider deployment order**: Some scenarios might require deploying services in a specific sequence

  The `azd up` command handles most deployment scenarios by automatically running provisioning followed by deployment in a single workflow. For standard single applications, this approach works well and requires minimal configuration. 

  For more complicated deployments, such as full stack with circular dependencies: 

  - **Configure service order**: In your [`azure.yaml`](./azd-schema.md) file, define services in the order you want them deployed. While `azd` deploys services in parallel by default, you can use [hooks](./azd-extensibility.md) to enforce sequential deployment when needed.

  - **Customize workflow steps**: Override the default [`azd up`](./azd-commands.md) workflow by defining a custom `workflows` property in your [`azure.yaml`](./azd-schema.md) file. For example, you can change the default behavior to run provisioning before building your application source code:

    ```yaml
    name: todo-nodejs-mongo
    metadata:
      template: todo-nodejs-mongo@0.0.1-beta
    workflows:
      up: 
        steps:
          - azd: provision
          - azd: package
          - azd: deploy
    ```

    This pattern is useful when your build process needs configuration values that are only available after provisioning completes.

  - **Separate provision and deploy**: Instead of using [`azd up`](./azd-commands.md), run [`azd provision`](./azd-commands.md#azd-provision) and [`azd deploy`](./azd-commands.md#azd-deploy) as separate commands. This separation is useful when you need to verify infrastructure configuration before deploying application code, or when troubleshooting deployment issues. You can provision infrastructure once, then deploy and redeploy application code multiple times without reprovisioning.

  - **Customize with hooks**: Add pre and post [hooks](./azd-extensibility.md) in your [`azure.yaml`](./azd-schema.md) file to execute custom logic between provisioning and deployment phases. Use hooks to populate configuration files, validate environment state, or coordinate complex deployment sequences.

## Best practices

When building full-stack applications with `azd`, follow these best practices:

1. **Map dependencies early**: Identify which services need information from other services during your design phase. Distinguish between one-directional dependencies that Bicep/Terraform handles automatically and circular dependencies that require immediate or deferred resolution strategies.
1. **Choose the right resolution strategy**: Use immediate dependency resolution when services need configuration at deployment time. Use deferred dependency resolution when you need flexibility to update configuration without redeployment. Combine both strategies when appropriate.
1. **Use Azure Verified Modules (AVM)**: Leverage [Azure Verified Modules](/azure/azure-resource-manager/bicep/modules#azure-verified-modules) Bicep modules like [`container-app-upsert`](https://github.com/Azure/bicep-registry-modules/tree/main/avm/ptn/azd/container-app-upsert) for container apps. These patterns work seamlessly with `azd`'s two-phase workflow to resolve circular dependencies.
1. **Customize workflows when needed**: For simple deployments, use [`azd up`](./azd-commands.md) with default settings. For complex scenarios with circular dependencies, customize the `workflows` property in your [`azure.yaml`](./azd-schema.md) file to control the order of package, provision, and deploy steps.
1. **Leverage runtime configuration**: For maximum flexibility across environments, use Azure App Configuration or local configuration files to manage service endpoints and settings that can be updated without redeployment.
1. **Test across environments**: Ensure your dependency resolution strategy works correctly across development, staging, and production environments where service URLs and configurations differ.

## Next steps

- [Deploy to Azure Container Apps using the Azure Developer CLI](./container-apps-workflows.md)
- [Full-stack deployment templates](./full-stack-templates.md)
- [Azure Developer CLI templates overview](./azd-templates.md)
- [Explore the azd up workflow](./azd-up-workflow.md)
