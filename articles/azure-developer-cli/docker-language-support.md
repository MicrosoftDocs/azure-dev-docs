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

The Azure Developer CLI (azd) supports Docker as a language, allowing you to define services that are built and deployed using a Dockerfile. This feature is useful when your application requires a custom build process, uses multiple languages, or needs specific dependencies that are not covered by standard language runtimes.

By specifying Docker as the language, you gain full control over the containerization process, making it ideal for:
- Apps built with languages that are not directly supported by Azure Developer CLI, such as Go
- Polyglot applications (apps using more than one programming language)
- Workloads with custom OS or runtime requirements
- Migrating existing Docker-based projects to Azure

For example, if you have a service that uses both Python and Node.js, or requires a specific system library, you can use a custom Dockerfile to define the build and runtime environment.

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

With this configuration, azd will use the specified Dockerfile to build and deploy your service, giving you maximum flexibility over the build process.

## Next steps

- [Use third-party container registries](/azure/developer/azure-developer-cli/use-external-registry)
- [Remote environment suppport](/azure/developer/azure-developer-cli/remote-environments-support)
- [Azure deployment stacks integration](/azure/developer/azure-developer-cli/azure-deployment-stacks-integration)