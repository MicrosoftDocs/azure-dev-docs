---
title: "Use Docker to deploy Go, Rust, and other languages with Azure Developer CLI"
description: "Learn how to use Docker as a language in Azure Developer CLI (azd) to build and deploy Go, Rust, Ruby, and other containerized apps to Azure with full control over the build process."
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/04/2025
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Use Docker support to deploy containerized apps in any language

The Azure Developer CLI (`azd`) supports Docker as a language, allowing you to define services that are built and deployed using a Dockerfile. If your app is written in a language that `azd` doesn't have built-in support for — such as Go, Rust, Ruby, PHP, or Kotlin — you can use Docker as the language to build and deploy it to Azure. By specifying Docker as the language, you gain full control over the containerization process, making it ideal for:

- **Go, Rust, Ruby, PHP, Kotlin**, and other languages without built-in `azd` support
- Polyglot applications (for example, a service that uses both Python and Node.js)
- Scenarios where you want to reduce local dependencies to run the template
- Workloads with custom OS or runtime requirements
- Migrating existing Docker-based projects to Azure

For example, if you have an app written in Go and want to deploy it to Azure Container Apps with `azd`, you can define a Dockerfile for your Go service and configure `azd` to use it.

## Configure Docker as a language in azure.yaml

To use Docker for a Go app, Rust app, or any other service, set the `language` property to `docker` in your `azure.yaml` file and specify the path to your Dockerfile:

```yaml
services:
  myservice:
    project: ./src/myservice
    language: docker
    docker:
      path: ./Dockerfile
```

With this configuration, `azd` uses the specified Dockerfile to build and deploy your service. This approach works for any language or runtime that can be containerized.

## Example scenario

The [`hello-azd`](https://github.com/Azure-Samples/hello-azd) starter template demonstrates how to use Docker as a language in combination with remote builds. In the `azure.yaml` file, the template sets `language: docker` and specifies `remoteBuild: true`:

```yml
metadata:
  template: hello-azd-dotnet
name: azd-starter
services:
  web:
    project: ./src
    language: docker
    host: containerapp
    docker:
      path: ./Dockerfile
      remoteBuild: true
```

This configuration allows users to run the template and build the container image in Azure Container Registry, even if they do not have .NET or Docker installed locally. The build process is handled entirely in the cloud, making it easy for developers to get started without setting up local dependencies or build tools.

By leveraging remote builds, the `hello-azd` template ensures a consistent and streamlined experience for all users, regardless of their local environment.

## Next steps

- [Use third-party container registries](/azure/developer/azure-developer-cli/use-external-registry)
- [Remote environment support](/azure/developer/azure-developer-cli/remote-environments-support)
- [Azure deployment stacks integration](/azure/developer/azure-developer-cli/azure-deployment-stacks-integration)