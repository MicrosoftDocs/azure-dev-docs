---
title: Use third-party container registries
description: How to use third-party container registries
author: alexwolfmsft
ms.author: alexwolf
ms.date: 03/19/2024
ms.service: azure-dev-cli
ms.topic: conceptual
ms.custom: devx-track-azdevcli
---

# Use third-party container registries

Azure Developer CLI (`azd`) supports external third-party container registries for deployment. To use this feature, you need to manually authenticate to the external container registry before calling `azd` deploy.

Run `docker login` and authenticate to your external container registry. You may need to follow additional setup or configuration steps for your specific registry provider.

```azurecli
docker login <your-registry>
```

You can configure `azd` to pull images from an external container registry in the `azure.yaml` file of your template. In this example, during azd deploy the container is pulled from `docker.io/username/nginx:latest` and directly referenced by the container app service.

```yml
name: todo-nodejs-mongo-aca
metadata:
  template: todo-nodejs-mongo-aca@0.0.1-beta
services:
  nginx:
    image: docker.io/<username>/nginx:latest
    host: containerapp
```

Support for additional container registries provides greater flexibility for your deployment workflows.
