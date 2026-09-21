---
title: Use third-party container registries
description: How to use third-party container registries
author: alexwolfmsft
ms.author: alexwolf
ms.date: 01/09/2026
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Use third-party container registries

Azure Developer CLI (`azd`) supports external third-party container registries for deployment. To use this feature, you need to manually authenticate to the external container registry before calling `azd` deploy.

Docker-based authentication is only required when `azd` manages image operations for you, such as pulling, building, tagging, or pushing images. If a service is configured with `services.<name>.docker.imagePassthrough: true`, `azd` reuses the configured remote image as-is. In that case, `azd` doesn't require Docker or Podman and doesn't perform any registry authentication or image lifecycle steps for that service.

## Authentication

Run `docker login` and authenticate to your external container registry. You may need to follow more setup or configuration steps for your specific registry provider.

```azdeveloper
docker login <your-registry>
```

## Example scenarios

You can configure `azd` to push and pull images from an external container registry in the `azure.yaml` file of your template. Support for more container registries provides greater flexibility for your deployment workflows.

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

To deploy a remote image without requiring Docker or Podman, set `services.<name>.docker.imagePassthrough: true` and provide the fully qualified image, including the registry, in `services.<name>.image`:

```yml
name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
services:
  nginx:
    image: docker.io/<username>/nginx:latest
    host: containerapp
    docker:
      imagePassthrough: true
```

`imagePassthrough` has the following constraints:

* It requires `services.<name>.image` to be set.
* It can't be combined with `docker.remoteBuild`.
* It doesn't support the `azd publish` image override flags, `--from-package` and `--to`, for that service.

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

The `azd deploy` command pulls the configured nginx image. In this case, it's a public image on docker hub, so `azd` retags the container/image and pushes it to the docker registry.

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

The `azd deploy` command builds the container, tags it and pushes it to the docker registry.
