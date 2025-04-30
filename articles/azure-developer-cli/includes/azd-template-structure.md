---
ms.prod: azure
ms.topic: include
ms.date: 08/01/2022
---

## Explore Azure Developer CLI template structure

`azd` templates are standard code repositories with some additional assets included. All `azd` templates share a similar file structure based on `azd` conventions:

- **`infra` folder** - Contains all of the Bicep or Terraform infrastructure as code files for the `azd` template. `azd` executes these files to create the Azure resources required to host your app.
- **`azure.yaml` file** - A configuration file that maps source code folders in your project to Azure resources defined in the `infra` folder for deployment. For example, you might define an API service and a web front-end service in separate folders and map them to different Azure resources for deployment.
- **`.azure` folder** - Contains essential Azure configurations and environment variables, such as the location to deploy resources or other subscription information.
- **`src` folder** - Contains all of the deployable app source code. Some `azd` templates exclude the `src` folder and only provide infrastructure assets so you can add your own application code.

For example, a common `azd` template might match the following folder structure:

:::image type="content" source="../media/make-azd-compatible/azd-template-structure.png" alt-text="A screenshot showing an Azure Developer CLI template structure.":::

`azd` templates also optionally include one or more of the following folders:

- **`.github` folder** - Holds the CI/CD workflow files for GitHub Actions, the default CI/CD provider for azd.
- **`.azdo` folder** - If you decide to use Azure Pipelines for CI/CD, define the workflow configuration files in this folder.
- **`.devcontainer` folder** - Allows you to set up a [Dev Container](https://code.visualstudio.com/docs/devcontainers/create-dev-container) environment for your application.
