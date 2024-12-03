---
title: Helm and Kustomize support for Azure Developer CLI
description: How to use helm and Kustomize integration with Azure Developer CLI
author: alexwolfmsft
ms.author: alexwolf
ms.date: 9/13/2024
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Helm and Kustomize support

The Azure Developer CLI provides support for Helm and Kustomize to improve the provisioning and deployment process to Azure Kubernetes Service (AKS). Helm and Kustomize are tools that help you configure and manage Kubernetes applications. In the sections ahead, you'll learn how to enable and customize support for these tools in your `azd` templates.

## Enable Helm support

To enable Helm support, make sure you have the Helm CLI installed. Enable the `azd` helm feature flag by running the `azd config` command:

```azurecli
azd config set alpha.aks.helm on
```

## Helm configuration and deployment

`azd` Helm support enables you to define a list of Helm charts to install for each `azd` service. Use the `helm` and `k8s` configuration sections in the `azure.yaml` file to define a list of helm repositories or releases to install.

```yml
name: todo-nodejs-mongo-aks
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  argocd:
    host: aks
    k8s:
      namespace: argo
      service:
        name: argocd-server
      helm:
        repositories:
          - name: argo
            url: https://argoproj.github.io/argo-helm
        releases:
          - name: argocd
            chart: argo/argo-cd
            version: 5.51.4
  jupyterhub:
    host: aks
    k8s:
      namespace: jupyterhub
      service:
        name: proxy-public
      helm:
        repositories:
          - name: jupyterhub
            url: https://hub.jupyter.org/helm-chart/
        releases:
          - name: jupyterhub
            chart: jupyterhub/jupyterhub
            version: 3.1.0
```

The `azd deploy` command handles the following tasks using the `helm` section:

- Adds any referenced Helm repositories and/or updates them
- Installs the referenced Helm charts
- Waits for Helm release to transition to a deployed state
- Lists relevant services and ingresses defined within the deployed resources

:::image type="content" source="media/k8s/helm-deploy-output.png" alt-text="A screenshot of the Helm deployment output.":::

## Enable Kustomize support

To enable Kustomize support, make sure you have the Kustomize CLI installed. Enable the `azd` Kustomize feature flag using the `azd config` command:

```azurecli
azd config set alpha.aks.kustomize on
```

## Kustomize configuration and deployment

The Kustomize feature enables you to use Kustomize as part of Kubernetes deployments and provides the following features:

- Supports `base` and `variant` configurations
- `edits` that can be run before deployments
- `configMapGenerator` with `azd` environments

Configure Kustomize features using the following `azure.yaml` sections:

- `dir`: Relative path from the service to your Kustomize directory that contains a `kustomization.yaml` file.
  - Supports environment variable substitution.
- `edits`: Array of edit expression that are applied before deployment
  - Supports environment variable substitution
- `env`: Map of key/value pairs generated before deployment
  - Map values support environment variable substitution

## Use cases

The following Kustomize use cases are supported by `azd`.

### Deploy k8s manifests

The following configuration performs a `kubectl apply -k <dir>` command that points to your manifests folder that contains a `kustomization.yaml`:

```yml
# azure.yaml

name: todo-nodejs-mongo-aks
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  api:
    project: ./src/api
    language: js
    host: aks
    k8s:
      kustomize:
        dir: ./kustomize/base
```

### Use overlays to deploy to with different variants

This use case is typically used to have custom configurations for deploying to different stages or environments, such as `dev`, `test` and `prod`. In the following example, the user can specify the `${AZURE_ENV_NAME}` environment variable within the kustomize directory to automatically leverage the azd environments as your default overlay convention:

```yml
# azure.yaml

name: todo-nodejs-mongo-aks
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  api:
    project: ./src/api
    language: js
    host: aks
    k8s:
      kustomize:
        dir: ./kustomize/overlays/${AZURE_ENV_NAME}
```

### Modify `kustomization.yaml` before deployment

A common use case for modifying the `kustomization.yaml` is to modify the container [image names/versions](https://kubectl.docs.kubernetes.io/references/kustomize/kustomization/images/) used as part of your deployment.

The following example specifies an `edits` configuration and sets any valid `kustomize edit ...` command. `azd` automatically interpolates any environment variables referenced within the `edit` command.

```yml
# azure.yaml

name: todo-nodejs-mongo-aks
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  api:
    project: ./src/api
    language: js
    host: aks
    k8s:
      kustomize:
        dir: ./kustomize/overlays/${AZURE_ENV_NAME}
        edits:
          - set image todo-api=${SERVICE_API_IMAGE_NAME}
```

### Use `azd` environment variables within config maps

Config maps or secrets are critical in configuring your k8s clusters. Since [kustomize does not support any direct environment variable substitution](https://kubectl.docs.kubernetes.io/faq/kustomize/eschewedfeatures/#build-time-side-effects-from-cli-args-or-env-variables) we can leverage the kustomize `configMapGenerator` with a `.env` file.

The `kustomize` configuration section supports a `env` section where one or many key/value pairs can be defined. This configuration automatically generates a temporary `.env` file within your kustomization directory that can be used by a `configMapGenerator`.

The following configuration will create a `.env` with the specified key/value pairs.

```yml
# azure.yaml

name: todo-nodejs-mongo-aks
metadata:
  template: todo-nodejs-mongo-aks@0.0.1-beta
services:
  api:
    project: ./src/api
    language: js
    host: aks
    k8s:
      kustomize:
        dir: ./kustomize/overlays/${AZURE_ENV_NAME}
        edits:
          - set image todo-api=${SERVICE_API_IMAGE_NAME}
        env:
          AZURE_AKS_IDENTITY_CLIENT_ID: ${AZURE_AKS_IDENTITY_CLIENT_ID}
          AZURE_KEY_VAULT_ENDPOINT: ${AZURE_KEY_VAULT_ENDPOINT}
          APPLICATIONINSIGHTS_CONNECTION_STRING: ${APPLICATIONINSIGHTS_CONNECTION_STRING}
```

The `configMapGenerator` generates a k8s config map with the specified name and contains all the key/value pairs referenced within the `.env` file.

```yml
# kustomization.yaml

apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml
  - ingress.yaml

configMapGenerator:
  - name: todo-web-config
    envs:
      - .env
```
