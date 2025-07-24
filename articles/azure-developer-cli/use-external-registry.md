---
title: Use third-party container registries
description: How to use third-party container registries
author: alexwolfmsft
ms.author: alexwolf
ms.date: 09/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Use third-party container registries

Azure Developer CLI (`azd`) supports external third-party container registries for deployment. To use this feature, you need to manually authenticate to the external container registry before calling `azd` deploy.

## Authentication

Run `docker login` and authenticate to your external container registry. You may need to follow additional setup or configuration steps for your specific registry provider.

```azdeveloper
docker login <your-registry>
```

## Example scenarios

You can configure `azd` to push and pull images from an external container registry in the `azure.yaml` file of your template. Support for additional container registries provides greater flexibility for your deployment workflows.

### Pull from external container registry

In this example, during `azd` deploy the container is pulled from `docker.io/username/nginx:latest` and directly referenced by the container app service.

```yml
name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
services:
  nginx:
    image: docker.io/<username>/nginx:latest
    host: containerapp
```

> [!NOTE]
> Your containerapp infra configuration must configure credentials when pulling containers from private container registries.

### Pull, tag & push to external registry

Consider an `azure.yaml` file with the following configuration:

```yml
# azure.yaml

name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
services:
  nginx:
    image: nginx
    host: containerapp
    docker:
      registry: docker.io/<username>
      image: nginx
      tag: latest   
```

During a call to `azd deploy` the nginx image will be pulled from the configured image. In this case it is a public image on docker hub. The container/image will be retagged and pushed to the docker registry.

### Build, tag & push to external registry on azd deploy

Consider an `azure.yaml` file with the following configuration:

```yml
# azure.yaml

name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
services:
  api:
    project: ./src/api
    host: containerapp
    docker:
      registry: docker.io/<username>
      image: todo-api
```

During `azd deploy` the container source will be built, tagged and push to the docker registry.
