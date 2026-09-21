---
title: App Service container deployments with azd
description: Understand how Azure Developer CLI deploys a container image to Azure App Service, what your infrastructure must configure, and how it differs from Container Apps.
ms.date: 08/25/2026
ms.topic: concept-article
ms.custom: devx-track-azdevcli
ai-usage: ai-generated
#customer intent: As an experienced azd user, I want to understand how azd deploys a container image to Azure App Service and what my infrastructure must configure, so that I can set up a container-ready site and deploy successfully.
---

# App Service container deployments with Azure Developer CLI

Azure Developer CLI (`azd`) can deploy your app to Azure App Service. This deployment mode runs your app as a Linux Web App for Containers. When a service uses `host: appservice` with a Docker-based build, `azd deploy` builds the image, pushes it to Azure Container Registry (ACR), and points an existing App Service site at the new image.

Because `azd deploy` updates only the image reference, your infrastructure must make the site container-ready before you deploy. Knowing what this deployment mode expects helps you set up the site correctly and avoid failed deployments.

This article explains how that deployment mode works, what your infrastructure must already configure, and how it differs from the `containerapp` host. It assumes you're familiar with `azd` projects, `azure.yaml`, and the `azd` provisioning and deployment commands.

## How azd deploys a container to App Service

When a service sets `host: appservice` with a container configuration, `azd deploy` treats the target site as a [Web App for Containers](/azure/app-service/quickstart-custom-container) and does the following work:

- Builds a container image from your Dockerfile.
- Pushes the image to the ACR instance that your infrastructure defines.
- Updates the site's `linuxFxVersion` setting to `DOCKER|<image>` so the site runs your image.

`azd deploy` updates _only_ the image reference for an existing site. It doesn't create or configure the underlying infrastructure, so the site must already be container-ready before you deploy.

## Service configuration in azure.yaml

A container deployment to App Service uses `host: appservice` with a Docker-based build. Set `language: docker`, or add a `docker` configuration that points to your Dockerfile:

```yaml
services:
  web:
    project: ./src/web
    host: appservice
    language: docker
    docker:
      path: ./Dockerfile
```

With this configuration, `azd` builds the image from `./src/web/Dockerfile`, pushes it to your registry, and updates the App Service site to run the image. The `appservice` host doesn't apply service-level `env:` settings, so configure app settings through your infrastructure instead.

## Infrastructure requirements for a container-ready App Service site

`azd deploy` doesn't provision or modify infrastructure for the `appservice` host, so your existing Bicep or Terraform must configure the site as a Linux container app before you deploy. The infrastructure must satisfy the following contract:

| Requirement | Details |
| --- | --- |
| Linux App Service plan | The plan runs Linux (`kind: linux` with `reserved: true`). App Service supports containers on Linux only, not Windows. |
| Container-ready site | The site's `linuxFxVersion` uses a `DOCKER\|` value. A placeholder image is fine, because `azd deploy` replaces it with the image it builds and pushes. |
| Single container | The site runs one container. The `appservice` host doesn't support multi-container or Docker Compose configurations. |
| Managed identity ACR access | The site authenticates to ACR through a user-assigned managed identity, such as `acrUseManagedIdentityCreds: true` with `acrUserManagedIdentityID`. The `appservice` host doesn't support admin credentials. |

## azd deploy compared to provision and up

Container deployment to App Service spans two concerns, infrastructure and application code, which map to different `azd` commands:

| Command | What it does | When to use it |
| --- | --- | --- |
| `azd provision` | Creates and configures Azure resources from your Bicep or Terraform, including the container-ready App Service site and ACR. | Use it when your infrastructure changes or the site doesn't exist yet. |
| `azd deploy` | Builds the image, pushes it to ACR, and updates the site's image reference. It doesn't touch infrastructure. | Use it to ship application changes to an already-provisioned site. |
| `azd up` | Runs `azd provision` and then `azd deploy` in a single command. | Use it for a first-time deployment, or when you want to provision and deploy together. |

Because `azd deploy` only updates the image reference, an `appservice` container deployment always depends on infrastructure that a prior `azd provision` or `azd up` created.

## Deployment readiness validation

Before updating the site, `azd deploy` validates that the target site is container-ready. If the site isn't a Linux container app, for example, it uses a Windows plan, is missing a `DOCKER|` `linuxFxVersion` value, or lacks managed identity access to ACR, then `azd deploy` stops and returns an error that identifies the missing configuration. Correct the infrastructure and reprovision before you deploy again.

## App Service containers compared to Container Apps

Both the `appservice` and `containerapp` hosts deploy container images, but they manage infrastructure and configuration differently:

| Behavior | `appservice` host | `containerapp` host |
| --- | --- | --- |
| Infrastructure configuration | `azd deploy` updates only the image reference and expects the site to already be container-ready. | Provisions and configures more of the container runtime for you. |
| Environment variables | Doesn't apply service-level `env:` settings. Configure app settings through your infrastructure instead. | Applies service-level `env:` settings to the container. |
| Polyglot support | Containerizes apps in any language through `language: docker`, which is useful for runtimes without built-in `azd` support. | Containerizes apps in any language through `language: docker`, which is useful for runtimes without built-in `azd` support. |

## Related content

- [Use Docker support to deploy containerized apps in any language](./docker-language-support.md)
- [azure.yaml schema reference](./azd-schema.md)
- [Supported languages and environments](./supported-languages-environments.md)
