---
title: Compare azd container build and deploy options
description: Compare the container hosting, image build, registry, publishing, and deployment options in Azure Developer CLI (azd) to choose the right workflow for your app.
ms.date: 09/09/2026
ms.topic: product-comparison
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
#customer intent: As an azd user, I want to compare container build and deployment options so that I can choose the right workflow for my application.
---

# Choose a container build and deployment workflow

Azure Developer CLI (`azd`) can build, publish, and deploy container images across several Azure hosting services. A container workflow combines a hosting target with a build location and a publishing approach. The best combination depends on your application, the tooling your team has available, and how you promote images between environments.

Use this article to match those choices to your needs. It compares the following decisions:

- Which Azure service hosts your container.
- Whether `azd` builds the image locally, builds it remotely in Azure Container Registry (ACR), or uses an existing image.
- Whether `azd` publishes and deploys the image together or as separate steps.

The article compares these general-purpose hosting services:

- [Azure Container Apps](./container-apps-workflows.md)
- [App Service containers](./app-service-containers.md)
- [Azure Kubernetes Service (AKS)](./helm-kustomize-support.md)

Start by comparing the hosting targets and image build options. After you understand those choices, use them to identify a candidate workflow in the [Compare container deployment workflows](#compare-container-deployment-workflows) section.

## Compare container hosting targets

The `host` property in `azure.yaml` identifies the Azure service to which `azd` deploys your container. Choose the host independently from the image build location.

| Host value | Azure hosting target | Container workflow | Considerations |
| --- | --- | --- | --- |
| **`containerapp`** | Azure Container Apps and Container Apps jobs | Build from a project and Dockerfile, or deploy a prebuilt image. | Supports service-level environment variables and Container Apps-specific deployment strategies. Use the same host value for Container Apps jobs. |
| **`appservice`** | Linux Web App for Containers on Azure App Service | Build from a project and Dockerfile, or deploy a prebuilt image. | Your infrastructure must provision a Linux container-ready site and configure managed identity access to ACR. `azd deploy` updates only the image reference. |
| **`aks`** | Azure Kubernetes Service | Build an image and deploy Kubernetes manifests, Helm charts, or Kustomize configurations. | Provides the most control, but requires you to manage the cluster and Kubernetes configuration. Using Helm or Kustomize with `azd` requires enabling alpha feature flags. |

The `ai.endpoint` and `azure.ai.agent` hosts also support Docker configuration for specialized Microsoft Foundry scenarios. For those workloads, see [Deploy to Microsoft Foundry online endpoints](./azure-ai-ml-endpoints.md) and the [Microsoft Foundry agent extension](./extensions/azure-ai-foundry-extension.md).

## Compare image build options

The service definition determines whether `azd` builds an image or starts with an existing image.

| Build option | Required configuration | Where the build runs | Local container engine | Best suited for |
| --- | --- | --- | --- | --- |
| **Local build** | `project` and, optionally, `docker` | Your development environment or CI runner | Required | Fast development iterations and build environments that already provide Docker or Podman. |
| **ACR remote build** | `project` and `docker.remoteBuild: true` | Azure Container Registry | Not required unless `azd` falls back after a remote build failure | Consistent cloud builds and environments without a local container engine. The documented remote-build workflow targets Azure Container Apps. |
| **Existing image managed by `azd`** | `image` | No source build | Might be required for image lifecycle operations | Images that already exist locally or in a registry and that `azd` can pull, tag, and push. |
| **Remote image passthrough** | `image` and `docker.imagePassthrough: true` | No build | Not required | Fully qualified remote images that the hosting resource should use as-is. |

Keep these conceptual differences in mind when you read the per-option configuration articles:

- A **prebuilt image** uses the `image` property instead of `project`, and `azd` can still pull, tag, and push it.
- An **ACR remote build** falls back to a local Docker or Podman build when the remote build fails and a supported container engine is available.
- **Image passthrough** requires a fully qualified remote image reference that includes a registry, can't combine with `remoteBuild`, and doesn't support the `azd publish --from-package` or `azd publish --to` options because `azd` doesn't manage the image.

For the full configuration of each option, see [Remote builds support with Azure Container Registry](./remote-builds.md), [Use third-party container registries](./use-external-registry.md), [App Service container deployments with Azure Developer CLI](./app-service-containers.md), and the [`docker` schema](./azd-schema.md#docker).

## Compare container deployment workflows

After you compare the hosting targets in [Compare container hosting targets](#compare-container-hosting-targets) and the build options in [Compare image build options](#compare-image-build-options), use the following table to identify the most likely workflows for your needs.

| If you need to | Start with | Why |
| --- | --- | --- |
| **Deploy a containerized application to a serverless platform** | Azure Container Apps with a local build | This workflow builds and deploys a Dockerfile-based project in one development workflow. |
| **Build without installing Docker or Podman locally** | Azure Container Apps with an ACR remote build | ACR builds the image from your project and Dockerfile in Azure. |
| **Deploy an image that another build system produces** | Azure Container Apps or App Service with a prebuilt image | The `image` property identifies the existing image instead of source code to build. |
| **Reuse a remote image without pulling, tagging, or pushing it** | Azure Container Apps with image passthrough | `azd` passes the fully qualified image reference directly to the hosting resource. |
| **Host a traditional web application as a Linux container** | Web App for Containers on Azure App Service | App Service provides an integrated web hosting platform while your infrastructure controls the container-ready site configuration. |
| **Control Kubernetes manifests and cluster configuration** | Azure Kubernetes Service (AKS) | `azd` can build and publish the image, then deploy Kubernetes manifests, Helm charts, or Kustomize configurations. |
| **Build once and promote the same image through environments** | `azd publish`, followed by `azd deploy --from-package` | Publishing and deployment are separate, so each environment receives the same image. |

Each row combines the hosting choices from [Compare container hosting targets](#compare-container-hosting-targets) and the build choices from [Compare image build options](#compare-image-build-options) into a starting point. Configure your choice in `azure.yaml`, and let your Bicep or Terraform files provision the corresponding hosting and registry resources.

A minimal service definition sets the `host`, the build source, and the Dockerfile:

```yaml
services:
  api:
    project: ./src/api
    language: docker
    host: containerapp
    docker:
      path: ./Dockerfile
```

To adapt this definition to another host, change the `host` value and follow the per-host configuration contract:

- [Deploy to Azure Container Apps using the Azure Developer CLI](./container-apps-workflows.md)
- [App Service container deployments with Azure Developer CLI](./app-service-containers.md)
- [Helm and Kustomize support](./helm-kustomize-support.md)

## Compare publish and deployment commands

After you choose a host and build option, select whether to combine or separate image publishing and deployment.

| Command | Image actions | Azure resource action | Use when |
| --- | --- | --- | --- |
| **`azd up`** | Build and push | Provision and deploy | You want to create or update the complete environment and deploy the application in one workflow. |
| **`azd deploy`** | Build and push | Deploy | The infrastructure already exists and you want to deploy application changes. |
| **`azd publish`** | Build and push | None | You want to create a registry artifact without deploying it. `azd publish` supports Container Apps and AKS services. |
| **`azd publish --from-package <image>`** | Push an existing local image | None | Another process built the image, and you want `azd` to publish it. |
| **`azd deploy --from-package <image>`** | None | Deploy | You want to deploy a specific image without rebuilding it. |

For example, publish a versioned image and deploy that same image to another environment:

```bash
azd publish api --to myregistry.azurecr.io/my-api:v1.0.0
azd env select production
azd deploy api --from-package myregistry.azurecr.io/my-api:v1.0.0
```

This workflow prevents differences that can occur when you rebuild an image for each environment. For a complete promotion workflow, see [Azure Developer CLI publishing workflows](./publishing-workflows.md).

## Related content

- [Use Docker support to deploy containerized apps in any language](./docker-language-support.md)
- [Azure Developer CLI schema reference](./azd-schema.md)
- [Supported languages and environments](./supported-languages-environments.md)
