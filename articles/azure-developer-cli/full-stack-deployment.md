---
title: Full-stack deployment with Azure Developer CLI
description: Learn how to deploy full-stack applications with front-end and back-end services using Azure Developer CLI (azd). Discover deployment strategies and best practices..
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/20/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Full-stack deployment with Azure Developer CLI

Full-stack applications that combine front-end and back-end services are a common pattern in modern web development. The Azure Developer CLI (`azd`) supports deploying full-stack applications where the front end and back end are hosted as separate services. This article explains how to deploy full-stack applications using `azd` and highlights strategies and benefits for effective deployment.

## What is a full-stack deployment?

A full-stack deployment with `azd` typically consists of:

- **Front-end service**: A user-facing web application, often built with frameworks like React, Angular, Vue, or Blazor. The front end might be hosted as a static site or as a containerized application.
- **Back-end service**: An API or service layer that handles business logic, data access, and integrations. The back end is typically hosted in containers or as serverless functions.
- **Shared resources**: Databases, storage accounts, key vaults, and other Azure resources that both services might use.

By using `azd`, you can define both services in a single [`azure.yaml`](./azd-schema.md) file and provision them together using infrastructure as code ([Bicep](/azure/azure-resource-manager/bicep/overview) or [Terraform](/azure/developer/terraform/overview)).

## Azure Developer CLI lifecycle

The Azure Developer CLI follows a structured workflow with distinct lifecycle events:

:::image type="content" source="./media/full-stack-deployment/full-stack-deployment-lifecycle.png" alt-text="Diagram showing the Azure Developer CLI lifecycle with package, provision, and deploy phases." :::

1. **Package**: Build your application source code and prepare artifacts for deployment.
1. **Provision**: Create or update Azure infrastructure resources by using Bicep or Terraform.
1. **Deploy**: Deploy your packaged application code to the provisioned infrastructure.

The `azd up` command runs all three phases sequentially. You can also run each phase independently by using `azd package`, `azd provision`, and `azd deploy` for more granular control. Understanding this lifecycle is essential for managing dependencies between services, especially in full-stack deployments where timing and order matter.

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

## Understand configuration strategies

Azure Developer CLI handles these interdependencies through two approaches: 
- Deploy-time configuration: Resolve dependencies during provisioning and deployment
- Runtime configuration: Defer dependency configuration to when the application runs 

These approaches represent design decisions you make when building your application. You can use one strategy exclusively or combine both depending on your architecture and requirements.

:::image type="content" source="./media/full-stack-deployment/full-stack-dependency-resolution.png" alt-text="Diagram comparing deploy-time versus runtime configuration strategies for full-stack deployments." :::

### Deploy-time configuration

Deploy-time configuration means that service connections and configurations are determined and locked in during the `azd provision` and `azd deploy` phases. By using this approach, you configure services with specific endpoint URLs, connection strings, and other dependency information before they start running. This configuration becomes part of the deployed service's environment, either as environment variables or in configuration files packaged with the deployment.

**Infrastructure-first provisioning**: When you run `azd up` or `azd provision`, the infrastructure is created first. This step generates the necessary URLs and connection strings before deployment begins, ensuring dependent services have the information they need.

**Output variables**: Bicep and Terraform can output values, like URLs and connection strings, after provisioning. These outputs become available as environment variables during the deployment phase, so you can configure services with the correct endpoints before they start.

**Sequential deployment**: For complex scenarios, you might need to deploy services in a specific order. Use `azd` [hooks](./azd-extensibility.md) to control deployment sequence, ensuring that prerequisite services are running before dependent services are deployed.

**Container upsert pattern**: Azure Verified Modules (AVM) provide container app patterns like `container-app-upsert` that work seamlessly with `azd`'s two-phase workflow. During provisioning, the infrastructure and initial container are created. During deployment, `azd` upserts the container image with updated environment variables that include values generated during provisioning, such as database connection strings or service URLs. This pattern resolves the chicken-and-egg problem by allowing the infrastructure to exist first, then updating the container configuration with all required dependency information.

**Example workflow for a React front-end with a container API back-end**:

1. Run `azd up`, which executes package, provision, and deploy phases sequentially.
1. During provisioning, Bicep creates Azure Container Apps infrastructure using AVM `container-app-upsert` modules and outputs the back-end API URL.
1. During deployment, `azd` automatically upserts both containers with the correct environment variables, including the API URL for the front-end.
1. Both services start with the correct configuration. Future runs of `azd up` or `azd deploy` update the containers with any new configuration values.

### Runtime configuration

Runtime configuration enables applications to load configuration when the application runs instead of during deployment. This approach provides flexibility to update service endpoints, connection strings, and policies without redeploying your application.

**Configuration sources**: Applications can load runtime configuration from two primary sources:

- **Local configuration files**: Deploy a configuration file, such as `config.json`, alongside your application. The application loads this file at startup to get current endpoint URLs, authentication settings, and other configuration values. This approach works well for client-side frameworks like React, Angular, Vue, and Blazor WebAssembly that can fetch configuration when the application starts in the browser.

- **Cloud configuration services**: Use [Azure App Configuration](/azure/azure-app-configuration/overview) or similar services to centrally manage configuration across all environments. Applications query the configuration service at startup or on-demand to retrieve current values. This approach is useful for microservices architectures where multiple services need coordinated configuration updates.

**Benefits**: With either approach, configuration changes become available immediately without redeployment. Update the configuration file through your deployment pipeline, or change values in [Azure App Configuration](/azure/azure-app-configuration/overview) through the Azure portal. When the application restarts or refreshes its configuration, it picks up the new values. This pattern is especially useful for:

- Front-end applications that need to discover back-end API URLs, authentication endpoints, and microservice locations
- Back-end services that need to update CORS policies as front-end URLs change
- Services that need different configuration across development, staging, and production environments

**Example workflow for a React front-end discovering a back-end API**:

1. Run `azd up` to provision infrastructure and deploy both services.
1. A post-deploy hook generates a `config.json` file containing the back-end URL and uploads it to the front-end's storage location.
1. The React app fetches `config.json` at startup to discover the API endpoint.
1. To update the endpoint later, modify `config.json` without redeploying the front-end.

This approach doesn't work for statically generated sites where all content is pre-rendered at build time.

## Plan your deployment workflow

Consider these factors when designing your full-stack deployment:

1. **Identify dependencies**: Map out which services need information from other services. For one-directional dependencies (such as an API depending on a database), the provisioning platform (Bicep or Terraform) handles the ordering automatically. For circular dependencies (such as front-end and back-end services that both need each other's URLs at startup), you must design coordination using deploy-time or runtime configuration strategies.
1. **Provision before deploy**: Ensure all infrastructure exists before deploying application code. 
1. **Use environment variables**: Pass configuration between infrastructure and application layers by using [azd environment variables](./manage-environment-variables.md).
1. **Design for multiple environments**: Plan how configuration differs across development, staging, and production environments.
1. **Consider deployment order**: Some scenarios might require deploying services in a specific sequence.

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

  - **Separate provision and deploy**: Instead of using [`azd up`](./azd-commands.md), run `azd provision` and `azd deploy` as separate commands. This separation is useful when you need to verify infrastructure configuration before deploying application code, or when troubleshooting deployment issues. You can provision infrastructure once, then deploy and redeploy application code multiple times without reprovisioning.

  - **Customize with hooks**: Add pre and post [hooks](./azd-extensibility.md) in your [`azure.yaml`](./azd-schema.md) file to execute custom logic between provisioning and deployment phases. Use hooks to populate configuration files, validate environment state, or coordinate complex deployment sequences.

## Best practices

When building full-stack applications with `azd`, follow these best practices:

1. **Map dependencies early**: Identify which services need information from other services during your design phase. Distinguish between one-directional dependencies that Bicep or Terraform handles automatically and circular dependencies that require deploy-time or runtime configuration strategies.
1. **Choose the right configuration strategy**: Use deploy-time configuration when services need configuration locked in at deployment. Use runtime configuration when you need flexibility to update configuration without redeployment. Combine both strategies when appropriate.
1. **Use Azure Verified Modules (AVM)**: Leverage [Azure Verified Modules](/azure/azure-resource-manager/bicep/modules#azure-verified-modules) Bicep modules like [`container-app-upsert`](https://github.com/Azure/bicep-registry-modules/tree/main/avm/ptn/azd/container-app-upsert) for container apps. These patterns work seamlessly with `azd`'s two-phase workflow to resolve circular dependencies.
1. **Customize workflows when needed**: For simple deployments, use [`azd up`](./azd-commands.md) with default settings. For complex scenarios with circular dependencies, customize the `workflows` property in your [`azure.yaml`](./azd-schema.md) file to control the order of package, provision, and deploy steps.
1. **Leverage runtime configuration**: For maximum flexibility across environments, use Azure App Configuration or local configuration files to manage service endpoints and settings that you can update without redeployment.
1. **Test across environments**: Ensure your configuration strategy works correctly across development, staging, and production environments where service URLs and configurations differ.

## Next steps

- [Deploy to Azure Container Apps using the Azure Developer CLI](./container-apps-workflows.md)
- [Full-stack deployment templates](./full-stack-templates.md)
- [Azure Developer CLI templates overview](./azd-templates.md)
- [Explore the azd up workflow](./azd-up-workflow.md)
