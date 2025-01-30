---
title: Azure Developer CLI templates
description: Learn about what Azure Developer CLI templates are, how to work with them, and how to get started using them with your apps.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/13/2024
ms.topic: conceptual
ms.custom: devx-track-azdevcli, build-2023
ms.service: azure-dev-cli
---

## Deploy to Azure Container Apps using the Azure Developer CLI

Azure Container Apps is a fully managed serverless container service that allows you to run microservices and containerized applications on a scalable platform. The Azure Developer CLI (`azd`) simplifies the deployment process by providing commands that automate infrastructure provisioning, code deployment, and monitoring. In this article, you'll learn the following:

- `azd` provisioning and deployment workflow for Azure Container Apps
- Example `azure.yaml` configurations to provision and deploy your app
- Explore the Azure resource requirements and how to provision them using Bicep and `azd`

## Example templates for deploying to Azure Container Apps

(Work-in-progress)

|Language  |Template  |
|---------|---------|
|Python     |    https://github.com/pamelafox/simple-flask-server-container     |
|Python     |  https://github.com/pamelafox/flask-surveys-container-app       |
|.NET     |  https://github.com/Azure-Samples/hello-azd       |
|TBD     |         |
|TBD     |         |

## Azure Developer CLI deployment workflow for Azure Container Apps

`azd` uses the configurations defined in the `azure.yaml` file and the infrastructure as code files in your template to manage the provisioning and deployment process for Azure Container apps. `azd` deploys apps to Azure Container Apps using the following steps:

- Builds a container for your app either locally or using remote builds based on the `azure.yaml` configuration
- Provisions the required Azure resources defined in the Bicep or Terraform files or your template or through `azd compose`. Azure Container Apps generally require the following resources:
  - An **Azure Container Registry** to store the built container image
  - An **Azure Container Apps** environment to manage app container instances and resources
  - An **Azure Container Apps instance** to run your app
  - An **Azure Log Analytics Workspace** to provide logging and analytics
- Pushes the container image to a container registry (Usually Docker Hub or an Azure Container Registry)
- Deploys the image to the Azure Container App instance

## Explore `azure.yaml` configurations for deploying to Container Apps

The `azure.yaml` file supports several multiple deployment configurations for Azure Container Apps. For example, you can build the container image locally or remotely. You can also push the created image to different registries, such as Docker Hub or Azure Container Registries. The following examples demonstrate different types of deployment configurations:

A minimal setup for a simple container app that uses default settings:

```yml
name: simple-flask-container-app

services:
  web:
    project: .
    language: py
    host: containerapp
```

Configure local and remote docker builder settings for two services:

```yaml
name: my-container-app
services:
  api:
    project: ./src/api
    language: js
    host: containerapp
    docker:
      path: ./Dockerfile
  web:
    project: ./src/web
    language: js
    host: containerapp
    docker:
      remoteBuild: true
```

The following table provides a detailed overview of the Docker configuration options available when using the Azure Developer CLI with `containerapp` or `aks` as the host:

| Name          | Type      | Description                                                                                                      | Default Value                           |
|---------------|-----------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| `path`        | `string`  | Path to the Dockerfile is relative to your service                                                                | `./Dockerfile`                          |
| `context`     | `string`  | When specified overrides the default context                                                                      | `.`                                     |
| `platform`    | `string`  | The platform target                                                                                               | `amd64`                                 |
| `registry`    | `string`  | Optional. The container registry to push the image to. If omitted, will default to value of `AZURE_CONTAINER_REGISTRY_ENDPOINT` environment variable. Supports environment variable substitution. |                                         |
| `image`       | `string`  | Optional. The name that will be applied to the built container image. If omitted, will default to the `{appName}/{serviceName}-{environmentName}`. Supports environment variable substitution. |                                         |
| `tag`         | `string`  | The tag that will be applied to the built container image. If omitted, will default to `azd-deploy-{unix time (seconds)}`. Supports environment variable substitution. For example, to generate unique tags for a given release: `myapp/myimage:${DOCKER_IMAGE_TAG}` |                                         |
| `buildArgs`   | `array`   | Optional. Build arguments to pass to the docker build command                                                     |                                         |
| `remoteBuild` | `boolean` | Optional. Whether to build the image remotely. If set to true, the image will be built remotely using the Azure Container Registry remote build feature. If set to false, the image will be built locally using Docker. |                                         |




