---
title: Deploying to Azure Container Apps
description: Learn how to deploy container apps using either image-based or revision-based deployment strategies with Azure Developer CLI (azd).
author: alexwolfmsft
ms.author: alexwolf
ms.date: 11/07/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-`azd`evcli
---

# Deploying to Azure Container Apps

This document describes the two supported deployment strategies for container apps when using `azd`:

- **Image-based strategy** — separates container app configuration updates from image deployments.
- **Revision-based strategy** — unifies both into a single deployment and supports advanced rollout patterns.

---

## Image-Based Deployment Strategy

### Overview

In this strategy, the container app **configuration** is created and updated during `azd provision`, while the **container image** is updated during `azd deploy`.

- The container app definition (resources, environment variables, health probes, etc.) resides in a **Bicep module** applied during provisioning.  
- Only the container image reference (`containers[0].image`) changes during deployment.

### Revision Behavior

Each change to the app configuration or image triggers a new revision:

| Step | Command | Applies changes to | Notes |
|------|----------|--------------------|-------|
| 1 | `azd provision` | Environment variables, resources, mounts, probes, load balancers | Creates a new revision |
| 2 | `azd deploy` | Container image | Creates another revision |

Each revision allocates additional replicas in the Container Apps environment, which may temporarily increase resource usage and cost.

> [!NOTE]
> Advanced rollout patterns (e.g., blue-green or canary) are **not supported** in this strategy.

---

### Enabling Image-Based Strategy

To ensure that `azd provision` correctly updates an existing container app without overwriting the latest deployed image, you must perform an **upsert** operation.  
This pattern is implemented by the **AVM [`container-app-upsert`](https://github.com/Azure/bicep-registry-modules/tree/main/avm/ptn/azd/container-app-upsert)** module.

---

#### Step 1 — Configure the `SERVICE_{NAME}_RESOURCE_EXISTS` variable

In your `main.parameters.json`, define a parameter that references the azd-provided variable `SERVICE_{NAME}_RESOURCE_EXISTS`.  
This variable is automatically set by `azd` at provision time to indicate whether the resource already exists.

```jsonc
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": {
      "value": "${AZURE_ENV_NAME}"
    },
    "location": {
      "value": "${AZURE_LOCATION}"
    },
    // ... other parameters
    "apiExists": {
      "value": "${SERVICE_API_RESOURCE_EXISTS}"
    }
  }
}
```

---

#### Step 2 — Reference the `exists` parameter in your Bicep module

In your Bicep file, reference the `exists` parameter to control whether the container app should be created or updated.  
The [`container-app-upsert`](https://github.com/Azure/bicep-registry-modules/tree/main/avm/ptn/azd/container-app-upsert) module encapsulates this logic internally.

```bicep
@description('Indicates whether the container app resource already exists.')
param apiExists bool

module api 'br/public:avm/ptn/azd/container-app-upsert:0.1.2' = {
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

This allows `azd provision` to **upsert** (update if exists, create if not) the container app resource safely without requiring manual checks.

> [!TIP]
> Keep the `apiVersion` in `azure.yaml` aligned with the Bicep module’s `apiVersion` for `Microsoft.App/containerApps` to avoid mismatches.

---

## Revision-Based Deployment Strategy

### Overview

In this strategy, both the container app **definition** and **image** are deployed together during `azd deploy`.

- The container app configuration resides in a **dedicated Bicep module** applied during deployment.  
- Changes to environment variables, images, resources, or load-balancing settings are rolled out as a **single revision**.

> [!TIP]
> This strategy supports blue-green, canary, and other advanced rollout patterns.

---

### Configuration

#### Step 1 — Define the container app deployment

Create an infra file for your service, e.g. `infra/api.bicep`.  
You can define your container app either by using the **AVM-based module** or by defining the **resource directly**.

::: zone pivot="avm-module"

##### Option 1: AVM-based module

```bicep
@description('Unique environment name used for resource naming.')
param environmentName string

@description('Primary location for all resources.')
param location string

param containerRegistryName string
param containerAppsEnvironmentName string
param imageName string
param identityId string

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: containerRegistryName
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' existing = {
  name: containerAppsEnvironmentName
}

module api 'br/public:avm/res/app/container-app:0.8.0' = {
  name: 'api'
  params: {
    name: 'api'
    ingressTargetPort: 80
    scaleMinReplicas: 1
    scaleMaxReplicas: 10
    containers: [
      {
        name: 'main'
        image: imageName
        resources: {
          cpu: json('0.5')
          memory: '1.0Gi'
        }
      }
    ]
    managedIdentities: {
      systemAssigned: false
      userAssignedResourceIds: [identityId]
    }
    registries: [
      {
        server: containerRegistry.properties.loginServer
        identity: identityId
      }
    ]
    environmentResourceId: containerAppsEnvironment.id
    location: location
    tags: {
      'azd-env-name': environmentName
      'azd-service-name': 'api'
    }
  }
}
```

::: zone-end

::: zone pivot="bicep-resource"

##### Option 2: Direct Bicep resource

If you prefer not to depend on the AVM module, you can define the container app resource directly.

```bicep
@description('Unique environment name used for resource naming.')
param environmentName string

@description('Primary location for all resources.')
param location string

param containerRegistryName string
param containerAppsEnvironmentName string
param imageName string
param identityId string

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: containerRegistryName
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2022-03-01' existing = {
  name: containerAppsEnvironmentName
}

resource api 'Microsoft.App/containerApps@2025-02-02-preview' = {
  name: 'api'
  location: location
  tags: {
    'azd-env-name': environmentName
    'azd-service-name': 'api'
  }
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        transport: 'http'
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          identity: identityId
        }
      ]
      activeRevisionsMode: 'Single'
    }
    template: {
      containers: [
        {
          image: imageName
          name: 'main'
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identityId}': {}
    }
  }
}
```

::: zone-end

---

#### Step 2 — Provide parameters at deploy time

Create a parameters file (e.g. `api.parameters.json`):

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "environmentName": { "value": "${AZURE_ENV_NAME}" },
    "location": { "value": "${AZURE_LOCATION}" },
    "containerRegistryName": { "value": "${AZURE_CONTAINER_REGISTRY_NAME}" },
    "containerAppsEnvironmentName": { "value": "${AZURE_CONTAINER_ENVIRONMENT_NAME}" },
    "imageName": { "value": "${SERVICE_API_IMAGE_NAME}" },
    "identityId": { "value": "${SERVICE_API_IDENTITY_ID}" }
  }
}
```

> [!NOTE]
> `SERVICE_API_IMAGE_NAME` is dynamically set during deploy and not part of the provision outputs.

Pass any additional outputs from `azd provision` as parameters to `azd deploy` if your container app references other provisioned resources.

When you run `azd deploy`, the container app revision is applied using the resource definition defined above.

---

### Comparison Summary

| Aspect | Image-Based | Revision-Based |
|--------|--------------|----------------|
| Update command | `azd provision` + `azd deploy` | `azd deploy` only |
| Rollout type | Two revisions | Single revision |
| Rollout control | Managed by `azd` | Configurable (blue-green, canary) |
| Use case | Simple environments | Advanced deployments |
| Container app definition location | Provision-time Bicep | Deploy-time Bicep |

## Additional resources

- [Azure Container Apps Overview](/azure/container-apps/overview)
- [Azure Container Apps Bicep Reference](/azure/templates/microsoft.app/containerapps)
- [.NET Aspire Overview](/dotnet/aspire/get-started/aspire-overview)
- [Todo Application Templates](https://github.com/Azure-Samples/todo-nodejs-mongo-aca) (using image-based)
