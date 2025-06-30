---
title: Explore the Azure Developer CLI up workflow
description: Learn about how the different stages of the Azure Developer CLI provisioning and deployment workflows
author: alexwolfmsft
ms.author: alexwolf
ms.date: 04/15/2025
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli
---

# Explore the `azd up` workflow

The Azure Developer CLI (`azd`) enables you to provision and deploy application resources on Azure with only a single command using `azd up`. This guide provides a detailed breakdown of `azd up` and how the different stages of this workflow command correlate to the structure of an `azd` template.

## Follow along using a template

The sections ahead use examples from the [`hello-azd`](https://github.com/Azure-Samples/hello-azd) template to demonstrate various `azd` concepts and patterns. You can follow along by initializing the template on your local machine:

```azdeveloper
azd init -t hello-azd
```

For more information about getting started with `azd` and the `hello-azd` template, visit the [Quickstart: Deploy an Azure Developer CLI template](get-started.md) article.

## Essential concepts

When working with an `azd` template, you can provision and deploy your app resources on Azure using the `azd up` command. Run the command from a terminal window that is open to your template folder:

```azdeveloper
azd up
```

`azd up` is designed so that you can repeatedly run the command as you develop your app, and the new changes are deployed incrementally. The command initiates a powerful workflow that essentially wraps three specific stages:

1. **Packaging**: Prepares the application code and dependencies for deployment.
2. **Provisioning**: Creates and configures the necessary Azure resources required by the app using infrastructure-as-code files.
3. **Deployment**: Deploys the packaged application to the provisioned Azure resources.

You can also run each of these stages individually using their respective command, but `azd up` provides a convenience wrapper to streamline the overall process. Each stage plays a critical role in ensuring a smooth and automated deployment process. You can influence the `azd up` workflow stages using configurations in the template `azure.yaml` file. The following sections explore each stage in more detail.

## The packaging stage

The packaging stage is the first step in the `azd up` workflow. During this stage:

- The app code is prepared for deployment. Depending on the programming language the template app is built with, packaging can involve building or compiling the app, bundling dependencies, or creating deployment artifacts such as Docker images.
- The `azd` template structure typically includes a `src` folder where the application code resides. Build scripts or configuration files (such as a Dockerfile) can influence how the application should be packaged.
- The `azure.yaml` file contains configuration mappings that tell `azd` where your app code lives and which language it uses so `azd` can package it appropriately.
- This stage ensures that the application is in a deployable state before moving to the next step.

You can run the packaging process on its own outside of `azd up` using the `azd package` command:

```azdeveloper
azd package
```

### Example packaging configurations

`azd` can package apps built with different languages in different ways. For example, if your app uses a containerized approach, the `azd` template might include a `Dockerfile` in the app `src` directory. The packaging stage builds a Docker image for the app based on this file. These configurations are managed through the `azure.yaml` file.

For example, consider the following project structure and configurations of the `hello-azd` starter template:

:::image type="content" source="media/core-concepts/packaging-process.png" alt-text="A screenshot showing the packaging stage of azd up.":::

In the preceding image, the `azure.yaml` file:

- Defines the code in the `src` directory as a C# app.
- Specifies the location of a Dockerfile to use to build a container image of the app.

When you run `azd up` (or `azd package`), the Azure Developer CLI uses this combination of configurations to build and package the app code in the `src` directory as a .NET container image. If a Dockerfile wasn't configured, `azd` could also package the .NET app using the standard .NET publishing process.

## The provisioning stage

The provisioning stage creates and configures the required Azure resources for your app. For example, your app might require an Azure App Service instance to host the app itself, and an Azure Storage Account to hold uploaded files. The provisioning stage uses infrastructure-as-code (IaC) files included in the template to define the resources.

Some key points to understand about the provisioning stage include:

1. `azd` supports both Bicep and Terraform for infrastructure-as-code tasks.
1. By default, infrastructure-as-code files are stored in the `infra` folder, but this location can be customized.
1. `azd` searches for a `main.bicep` or `main.tf` file to act as the main orchestration file for the IaC process.

:::image type="content" source="media/core-concepts/provisioning-process.png" alt-text="A screenshot showing the provisioning stage of azd up.":::

You can also run the provisioning process on its own outside of `azd up` using the `azd provision` command:

```azdeveloper
azd provision
```

### Example provisioning configurations

Inside the `infra` folder, a `main.bicep` file generally defines the Azure resources that `azd` should create for the app. Consider the following snippet from `main.bicep` in the `hello-azd` starter template:

```bicep
// ...omitted code for other resource configurations

// Create an Azure Cosmos DB account
module cosmos 'app/cosmos.bicep' = {
  name: 'cosmos'
  scope: rg
  params: {
    userPrincipalId: principalId
    managedIdentityId: identity.outputs.principalId
  }
}

// Create a storage account
module storage './core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: rg
  params: {
    name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
    location: location
    tags: tags
    containers: [
      { name: 'attachments' }
    ]
  }
}

// Container apps environment and registry
module containerAppsEnv './core/host/container-apps.bicep' = {
  name: 'container-apps'
  scope: rg
  params: {
    name: 'app'
    containerAppsEnvironmentName: !empty(containerAppsEnvName) ? containerAppsEnvName : '${abbrs.appManagedEnvironments}${resourceToken}'
    containerRegistryName: !empty(containerRegistryName) ? containerRegistryName : '${abbrs.containerRegistryRegistries}${resourceToken}'
    location: location
  }
}

// ...omitted code for other resource configurations
```

Using the preceding Bicep code, `azd` creates the following resources:

- An Azure Cosmos DB instance to store data submitted through the app
- An Azure Storage account to store uploaded images
- An Azure Container App to host the app

## The deployment stage

The deployment stage is the final step in the `azd up` workflow. During this stage:

- The app artifacts created during the packaging stage are deployed to the provisioned Azure resources.
- `azd` uses configuration files in the template, such as `azure.yaml`, to determine how to deploy the app.
- Environment variables and connection strings are configured to ensure the app can interact with the provisioned resources.

You can also run the deployment process on its own outside of `azd up` using the `azd deploy` command:

```azdeveloper
azd deploy
```

### Example deployment configurations

Inside the `azure.yaml` file, you can specify which service in your project should be deployed to which Azure resource. For example, consider the following configurations for the `hello-azd` starter template:

```yaml
metadata:
  template: hello-azd-dotnet
name: azd-starter
services:
  aca:
    project: ./src # The location of the service source code
    language: csharp
    host: containerapp # The provisioned resource to deploy the service to
    docker:
      path: ./Dockerfile
```

The preceding code instructs `azd` to deploy the artifacts packaged from the code in the `src` folder to the `containerapp` that was created during the provisioning stage. You can also define multiple services and map each to a different host.

## Conclusion

The `azd up` workflow streamlines the process of deploying applications to Azure by automating the packaging, provisioning, and deployment stages. Developers can ensure a consistent and efficient deployment process by adhering to the `azd` template structure. Whether you're deploying a simple web app or a complex microservices architecture, the `azd up` command simplifies the journey from code to cloud.
