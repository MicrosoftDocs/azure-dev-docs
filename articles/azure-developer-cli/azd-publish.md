---
title: azd publish command
description: Learn how to use the azd publish command to build and push container images to a registry without deploying them immediately.
ai-usage: ai-generated
---

# `azd publish` command

The `azd publish` command allows you to build and push container images to a container registry (like Azure Container Registry or Docker Hub) without immediately deploying them to an Azure resource.

By separating the "build and push" step from the "deploy" step, you can implement more advanced deployment workflows, such as the "build once, deploy everywhere" pattern. This is particularly useful for containerized applications targeting **Azure Container Apps** or **Azure Kubernetes Service (AKS)**.

## Why use `azd publish`?

In a standard `azd` workflow, running `azd deploy` performs three actions in sequence:

1. **Build**: Builds your application code into a container image.
1. **Push**: Pushes that image to a registry.
1. **Deploy**: Updates your Azure service (like Container Apps) to run the new image.

While convenient for inner-loop development, this approach assumes that every deployment requires a new build. In production scenarios, you often want to:

* **Build once, deploy everywhere**: Build a single artifact (image), test it in a development environment, and then promote that *exact same artifact* to production without rebuilding it.
* **Centralize artifacts**: Use a single shared Azure Container Registry (ACR) to store images for all your environments.
* **Improve security**: ensuring that only verified and tested images are deployed to production.

`azd publish` enables these scenarios by handling only steps 1 and 2 (Build and Push). You can then use `azd deploy` with specific flags to handle step 3 (Deploy) using the pre-published image.

## Key features

* **Independent Publishing**: Publish images to a registry without triggering a deployment.
* **Custom Targets**: Use the `--to` flag to specify exactly where the image should be pushed (`[registry/]repository[:tag]`), overriding default naming conventions.
* **Third-Party Registry Support**: Push to external registries (like Docker Hub) in addition to Azure Container Registry.
* **Hook Support**: Supports `prepublish` and `postpublish` hooks for custom automation.
* **Service Targeting**: Currently supports services hosted on **Azure Container Apps** and **AKS**.

## Usage

### Basic usage

To build and publish the image for a specific service defined in your `azure.yaml`:

```bash
azd publish <service-name>
```

To build and publish all services:

```bash
azd publish --all
```

### Parameters

| Flag | Description |
| :--- | :--- |
| `--all` | Publishes all services defined in `azure.yaml`. |
| `--from-package <image>` | Uses an existing local image or package instead of building from source. |
| `--to <image-ref>` | Specifies the target image reference (e.g., `myregistry.azurecr.io/my-app:v1`). Overrides default naming in `azure.yaml`. |

### Examples

**Publish a specific service to a custom tag:**

```bash
azd publish api-service --to myregistry.azurecr.io/api-service:v1.0.0
```

**Publish a local image to a remote registry:**
If you have already built an image locally (e.g., `local-api:dev`), you can tag and push it using `azd`:

```bash
azd publish api-service --from-package local-api:dev --to myregistry.azurecr.io/api-service:v1.0.0
```

## Scenario: Build once, deploy everywhere

A common production workflow involves building an image once and promoting it through environments (Dev -> Test -> Prod). Here is how to achieve this with `azd publish` and `azd deploy`.

1. **Publish the image**:

   Build the code and push it to your shared registry.

   ```bash
   azd publish api-service --to myregistry.azurecr.io/my-app:v1.0.0
   ```

2. **Deploy to Development**:
   Deploy the specific image version to the development environment. The `--from-package` flag tells `azd deploy` to skip the build/push steps and just update the service configuration.

   ```bash
   azd env select dev
   azd deploy api-service --from-package myregistry.azurecr.io/my-app:v1.0.0
   ```

3. **Promote to Production**:
   After testing in Dev, deploy the *same* image reference to the production environment.

   ```bash
   azd env select prod
   azd deploy api-service --from-package myregistry.azurecr.io/my-app:v1.0.0
   ```

## Comparison with other commands

| Command | Actions Performed | Best For |
| :--- | :--- | :--- |
| `azd publish` | Build -> Push | CI/CD pipelines, creating artifacts, "Build once" workflows. |
| `azd deploy` | Build -> Push -> Deploy | Standard development iteration (inner loop). |
| `azd deploy --from-package` | Deploy only | deploying pre-built/pre-published artifacts to environments. |
| `azd up` | Provision -> Build -> Push -> Deploy | Getting started, initializing new environments from scratch. |

> [!NOTE]
> The default behavior of `azd up` remains unchanged. It will still orchestrate the full end-to-end process. However, you can customize your workflows in `azure.yaml` to leverage `azd publish` if needed.

## Configuration in `azure.yaml`

You can configure default Docker settings for your services in `azure.yaml`. The `azd publish` command respects these settings unless overridden by flags like `--to`.

```yaml
name: my-app
services:
  api:
    project: ./src/api
    host: containerapp
    docker:
      registry: 'docker.io/myusername' # Default registry
      image: 'my-api'                  # Default image name
      tag: 'latest'                    # Default tag
```

With this configuration, running `azd publish api` would push to `docker.io/myusername/my-api:latest`.

## Next steps

* [azd deploy command reference](azd-commands.md)
* [Use external container registries](use-external-registry.md)
* [Configure GitHub Actions pipelines](pipeline-github-actions.md)
