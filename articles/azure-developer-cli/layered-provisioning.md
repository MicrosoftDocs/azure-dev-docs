---
title: Layered provisioning with the Azure Developer CLI
description: Learn how to use layered provisioning with the Azure Developer CLI (azd) to solve complex infrastructure dependency scenarios.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 02/12/2026
ms.service: azure-dev-cli
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
---

# Layered provisioning

Azure Developer CLI (`azd`) supports layered provisioning, which you can use to define multiple provisioning layers in your `azure.yaml` file. Each layer points to its own set of Infrastructure as Code (IaC) templates. The CLI provisions layers sequentially in the order you define them. You can also provision or tear down individual layers independently.

This feature solves complex dependency scenarios where resources in one layer depend on resources from another layer. Instead of mixing IaC with imperative hook scripts, layered provisioning keeps everything declarative.

> [!NOTE]
> Layered provisioning is currently a beta feature.
> [Learn more about the versioning strategy](./feature-versioning.md).

## When to use layered provisioning

Use layered provisioning when a single `azd provision` deployment can't handle all of your infrastructure needs in one step. Consider using layered provisioning when:

- **Circular dependencies**: Some resources need to reference other resources that must be created first, such as a virtual network that must exist before a private endpoint can be configured.
- **Foundational infrastructure differs from application infrastructure**: You manage shared networking, security, or identity resources separately from per-application resources.
- **Independent lifecycle management is needed**: You update and tear down different infrastructure components at different times. For example, a networking layer might be long-lived, while an application layer is frequently redeployed.
- **Monorepo projects with distinct infrastructure groups**: A single repository contains multiple independent services (such as an Event Hub, a Container App, and a Function App), each with its own infrastructure templates.

## Configure layers in azure.yaml

Define layers under the `infra` section of your `azure.yaml` file. Each layer requires a `name` and a `path` pointing to the directory that contains the IaC templates for that layer.

```yaml
name: my-app
infra:
  layers:
    - name: networking
      path: ./infra/networking
    - name: application
      path: ./infra/application
services:
  api:
    project: ./src/api
    language: js
    host: containerapp
```

> [!IMPORTANT]
> **Layer processing order:** `azd provision` processes layers **top to bottom** in the order they're listed in `azure.yaml`. `azd down` processes layers in **reverse order** (bottom to top). Define your layers so that foundational resources appear first, followed by layers that depend on them. This order ensures you create dependencies before the resources that need them, and remove dependencies after those resources.

### Layer properties

Each layer supports the following properties:

| Property | Required | Description |
| -------- | -------- | ----------- |
| `name` | Yes | A unique name for the layer. Use this name when targeting a specific layer with commands. |
| `path` | Yes | The relative path to the directory containing the IaC templates for this layer. |
| `module` | No | The name of the module within the layer's directory. Defaults to `main`. |
| `provider` | No | The IaC provider for this layer (`bicep` or `terraform`). Inherits from the root `infra.provider` if you don't specify it. |

> [!IMPORTANT]
> When you define `infra.layers`, you can't declare other properties on the `infra` section (`path`, `module`, `deploymentStacks`) at the root level. You must specify all infrastructure configuration within each layer.

### Directory structure

A typical project using layered provisioning might have the following directory structure:

```text
my-app/
├── azure.yaml
├── infra/
│   ├── networking/
│   │   └── main.bicep
│   └── application/
│       └── main.bicep
└── src/
    └── api/
        └── ...
```

Each layer directory contains its own complete set of IaC templates, just as a standard `azd` project's `infra` directory would.

## Provision and manage layers

You can provision all layers at once or target a specific layer by name. The following sections describe common commands for provisioning, tearing down, and refreshing layer state.

### Provision all layers

Run `azd provision` without arguments to provision all layers sequentially in the order they're defined in `azure.yaml`:

```bash
azd provision
```

`azd` processes each layer one at a time, ensuring the first layer completes before the second layer begins. This process guarantees that dependent resources exist before layers that reference them are deployed.

### Provision a specific layer

To provision only a specific layer, pass the layer name as an argument:

```bash
azd provision networking
```

This command deploys only the resources defined in the `networking` layer. Provisioning a specific layer is useful when:

- You're iterating on a single layer during development.
- You need to update one layer without redeploying others.
- You're setting up a new layer on top of existing infrastructure.

### Tear down all layers

Run `azd down` without arguments to tear down resources from all layers. When multiple layers exist, `azd` processes them in **reverse order**, so dependent resources are removed before the foundational resources they depend on:

```bash
azd down
```

### Tear down a specific layer

To tear down only a specific layer, pass the layer name as an argument:

```bash
azd down application
```

This command removes only the resources deployed by the `application` layer, leaving the other layers intact.

### Refresh environment state

You can refresh the environment state from a specific layer by using the `--layer` flag with `azd env refresh`:

```bash
azd env refresh --layer networking
```

This command updates the environment variables and outputs based on the most recent deployment of the specified layer.

## Example: Monorepo with multiple services

The following example demonstrates layered provisioning for a monorepo that contains an Event Hub, a Container App running multiple containers, and an Azure Function App:

```yaml
name: logging-app
infra:
  layers:
    - name: eventhub
      path: ./infra/eventhub
    - name: aca
      path: ./infra/aca
    - name: functionapp
      path: ./infra/functionapp
services:
  functionapp:
    resourceName: ${site_name}
    language: dotnet
    project: ./src/function/functionapp.csproj
    host: appservice
    resourceGroup: ${rg_name}
```

The corresponding directory structure:

```text
logging-app/
├── azure.yaml
├── infra/
│   ├── eventhub/
│   │   └── main.bicep
│   ├── aca/
│   │   └── main.bicep
│   └── functionapp/
│       └── main.bicep
└── src/
    └── function/
        └── functionapp.csproj
```

With this configuration, you can:

1. Provision only the Event Hub infrastructure: `azd provision eventhub`
1. Provision only the Container App infrastructure: `azd provision aca`
1. Provision everything in order: `azd provision`
1. Tear down only the Function App layer: `azd down functionapp`

## Example: Base and application layers

A common pattern separates shared or foundational infrastructure from per-application infrastructure:

```yaml
name: my-app
infra:
  layers:
    - name: base
      path: ./infra/base
    - name: app
      path: ./infra/app
services:
  web:
    project: ./src/web
    language: js
    host: containerapp
```

The `base` layer creates shared resources like networking, identity, and monitoring. The `app` layer creates the application-specific resources (such as a Container App environment and container apps) that reference the base resources.

During development, you might provision the base layer once and iterate on the application layer:

```bash
azd provision base
azd provision app
azd provision app  # re-provision only the app layer after changes
```

## Example: Mixed IaC providers

Each layer can use a different IaC provider. For example, you might use Bicep for networking and Terraform for the application layer:

```yaml
name: my-app
infra:
  layers:
    - name: networking
      path: ./infra/networking
      provider: bicep
    - name: application
      path: ./infra/application
      provider: terraform
```

## Considerations and limitations

- When provisioning all layers, `azd` processes them sequentially in the order you define.  Plan your layer order so that foundational resources are provisioned first.
- When tearing down all layers, `azd` processes them in reverse order.
- You can't use the `--preview` flag when provisioning multiple layers at once. Specify a `<layer>` name to use preview mode.
- Layers operate independently in terms of IaC. To reference outputs from one layer in another layer, use environment variables that `azd` sets after each layer's deployment.
- All standard `azd` provisioning features (deployment state caching, hooks, parameters, Bicep, or Terraform) work within each individual layer.

## Next steps

> [!div class="nextstepaction"]
> [azure.yaml schema reference](./azd-schema.md)

- [Feature versioning and release strategy](./feature-versioning.md)
- [Manage environment variables](./manage-environment-variables.md)
- [Customize workflows using command and event hooks](./azd-extensibility.md)
