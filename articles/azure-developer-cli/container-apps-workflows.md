---
title: Azure Container Apps Deployment Strategies using the Azure Developer CLI
description: Learn about Azure Container Apps deployment strategies using the Azure Developer CLI.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 07/15/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-`azd`evcli
---

# Azure Container Apps deployment strategies using the Azure Developer CLI

The Azure Developer CLI (`azd`) provides multiple strategies to provision and deploy applications to [Azure Container Apps](/azure/container-apps/overview). This document outlines these strategies, including when to use them and how they work.

## Container app upsert strategy

The `container-app-upsert` strategy is a Bicep-based approach for creating or updating Azure Container Apps. It's a flexible option that works well for many types of container applications.

### How it works

The `container-app-upsert` strategy:

1. Uses a Bicep module (`container-app-upsert.bicep`) that detects whether a Container App already exists.
2. If the Container App exists, it updates the existing app while preserving its current container image if no new image is specified.
3. If the Container App doesn't exist, it creates a new one with the specified parameters.

This approach is commonly used in `azd` templates, such as the Todo application templates (nodejs-mongo-aca, python-mongo-aca, etc.).

### When to use it

Use the `container-app-upsert` strategy when:

- You want the ability to incrementally update your Container App without replacing it entirely.
- You need to preserve certain settings during updates.
- You're working with standard container applications that aren't based on the .NET Aspire framework.
- You want a pattern that supports composability across multiple services.

### Example

Here's how to use the `container-app-upsert` strategy in your Bicep files:

```bicep
module api 'br/public:avm/ptn/`azd`/container-app-upsert:0.1.1' = {
  name: 'api'
  params: {
    name: 'my-api'
    location: location
    containerAppsEnvironmentName: containerAppsEnvironment.name
    containerRegistryName: containerRegistry.name
    imageName: !empty(apiImageName) ? apiImageName : ''
    exists: apiExists
    env: [
      {
        name: 'MONGODB_CONNECTION_STRING'
        value: mongodb.outputs.connectionString
      }
    ]
    targetPort: 3100
  }
}
```

In this example:

- The `exists` parameter determines whether to update an existing app or create a new one.
- The `imageName` uses the `!empty()` function to conditionally specify a new image or keep the existing one.
- Application settings are provided via the `env` parameter.

## Delay deployment strategy with .NET Aspire

The `delay-deployment` strategy is specifically designed for .NET Aspire applications. It postpones full container app creation until deployment time, allowing for more flexibility with .NET Aspire's orchestration model.

### How it works

The `delay-deployment` strategy:

1. Delays full provisioning of container resources until deployment time.
2. Uses the .NET Aspire manifest to define container apps and their configurations.
3. Supports two deployment approaches based on the manifest:
   - Bicep-based deployment (when the manifest includes a deployment configuration).
   - YAML-based deployment (direct Container Apps YAML deployment).
4. Handles special features like service binding and configuration sharing across Aspire components.

When using .NET Aspire with `azd`, the Aspire project generates a manifest that `azd` uses during deployment. This approach allows for better integration with .NET Aspire's application model.

### When to use it

Use the `delay-deployment` strategy when:

- Working with .NET Aspire applications.
- Your application has complex service relationships defined in the Aspire manifest.
- You need integration with .NET Aspire's resource binding model.
- You want to leverage .NET Aspire's application hosting capabilities.

### Example

For .NET Aspire applications, `azd` automatically uses the delay-deployment strategy when you specify `"containerapp-dotnet"` as the host type. Typically, this is handled automatically when importing a .NET Aspire project.

When working with a .NET Aspire application:

1. Initialize your `azd` project with a .NET Aspire application:

    ```bash
    # This is typically done automatically by `azd` init for .NET Aspire projects
    azd init
    ```

1. During provisioning, `azd` sets up the necessary Azure resources but delays full Container App configuration.

1. During deployment, `azd` will:

    - Build and publish the container images.
    - Apply the .NET Aspire manifest with proper configuration.
    - Configure service bindings between components.

The delay-deployment strategy is primarily managed internally by `azd` based on the .NET Aspire application structure.

## Choosing the right strategy

| Feature                | container-app-upsert         | delay-deployment (.NET Aspire) |
|------------------------|------------------------------|-------------------------------|
| Application type       | Any containerized application| .NET Aspire applications      |
| Configuration source   | Bicep parameters             | .NET Aspire manifest          |
| Deployment timing      | All configuration during provisioning | Container App specifics during deployment |
| Service binding        | Manual configuration         | Integrated with Aspire binding model |
| Best for               | General container applications | .NET microservices orchestrated with Aspire |

## Additional resources

- [Azure Container Apps Overview](/azure/container-apps/overview)
- [Azure Container Apps Bicep Reference](/azure/templates/microsoft.app/containerapps)
- [.NET Aspire Overview](/dotnet/aspire/get-started/aspire-overview)
- [Todo Application Templates](https://github.com/Azure-Samples/todo-nodejs-mongo) (using container-app-upsert)
