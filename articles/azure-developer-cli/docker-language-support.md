---
title: Docker support as a language
description: Information regarding Docker support as a language in Azure Developer CLI, including an overview, use cases, and configuration example.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 06/04/2025
ms.topic: reference
ms.custom: devx-track-azdevcli
ms.service: azure-dev-cli
---

# Docker support as a language

The Azure Developer CLI (`azd`) supports Docker as a language, allowing you to define services that are built and deployed using a Dockerfile. By specifying Docker as the language, you gain full control over the containerization process, making it ideal for:

- Apps built with languages that aren't directly supported by `azd`
- Polyglot applications (apps using more than one programming language)
- Scenarios where you want to reduce local dependencies to run the template
- Workloads with custom OS or runtime requirements
- Migrating existing Docker-based projects to Azure

For example, if you have an app written in Go, or a service that uses both Python and Node.js, you can use a custom Dockerfile to define the build and runtime environment.

## Configure Docker as a language

To configure Docker as a language in your `azure.yaml` file, set the `language` property to `docker` and specify the path to your Dockerfile. Example:

```yaml
services:
  myservice:
    project: ./src/myservice
    language: docker
    docker:
      path: ./Dockerfile
```

With this configuration, `azd` uses the specified Dockerfile to build and deploy your service, giving you maximum flexibility over the build process.

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