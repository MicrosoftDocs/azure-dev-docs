---
ms.prod: azure
ms.topic: include
ms.date: 08/01/2022
---

## Explore Azure Developer CLI template structure

`azd` templates are standard code repositories with additional assets included. All `azd` templates share a similar file structure based on `azd` conventions:

- **`infra` folder** - Contains all of the Bicep or Terraform infrastructure as code files for the `azd` template. `azd` executes these files to create the Azure resources required by your app.
- **`src` folder** - Contains the app source code. `azd` packages and deploys the code based on configurations in `azure.yaml`.
- **`azure.yaml` file** - A configuration file that maps source code folders in your project to Azure resources defined in the `infra` folder for deployment. For example, you might define an API service and a web front-end service in separate folders and map them to different Azure resources for deployment.
- **`.azure` folder** - Contains essential Azure configurations, such as the location to deploy resources.

For example, most `azd` templates match the following folder structure:

:::image type="content" source="../media/make-azd-compatible/azd-template-structure.png" alt-text="A screenshot showing an Azure Developer CLI template structure.":::

Visit the [Azure Developer CLI templates overview](../azd-templates.md) article for more details about `azd` template structure.
