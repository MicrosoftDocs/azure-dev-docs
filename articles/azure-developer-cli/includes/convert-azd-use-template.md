---
ms.custom: devx-track-bicep
---
The **Select a template** workflow allows you to choose an existing `azd` template to use as a starting point. The contents of the selected template are added to the root directory of your project. Most templates provide the required set of `azd` files and folders, and some templates include complete infrastructure-as-code files to provision Azure resources for a chosen application stack. 

In this example, you'll use the **Starter - Bicep** template, which includes the essential structure of an `azd` template and some useful boilerplate code to get started.

1. To follow along with the steps ahead using an existing sample application, clone the following starter project to an empty directory on your computer:

    ```bash
    git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
    ```

1. In your command line tool of choice, navigate to the root directory of the cloned project.

1. Run the `azd init` command to initialize an `azd` template.

    ```bash
    azd init
    ```

1. When prompted, choose the option to **Select a template**.

1. From the list of templates, select **Starter - Bicep**. You may need to scroll through the list using your keyboard arrow keys to find the template.

1. When prompted, enter a short environment name, such as **testenv**.

1. After you run `azd init`, the following assets are added to your project:

    ```txt
    ├── .azdo                                        [ Configures an Azure Pipeline ]
    ├── .devcontainer                                [ For DevContainer ]
    ├── .github                                      [ Configures a GitHub workflow ]
    ├── .vscode                                      [ VS Code workspace configurations ]
    ├── .azure                                       [ Stores Azure configurations and environment variables ]
    ├── infra                                        [ Contains infrastructure as code files ]
    │   ├── main.bicep/main.tf                       [ Main infrastructure file ]
    │   ├── main.parameters.json/main.tfvars.json    [ Parameters file ]
    │   └── core/modules                             [ Contains reusable Bicep/Terraform modules ]
    └── azure.yaml                                   [ Describes the app and type of Azure resources]
    ```

## Update the Bicep files

Your project now contains the core structure and assets of an `azd` template. However, to provision the Azure resources for your specific project, the Bicep files in the `infra` folder need to be updated. To host the sample application, you'll need the following resources:

- An Azure App Service Plan
- An Azure App Service running on Linux

1. Open the top level project directory in your editor of choice, such as Visual Studio Code.

1. Open the `main.bicep` file in your editor. This file contains useful boilerplate code to setup essential variables, parameters, and naming conventions. Beneath the comment block around line 50 that reads **`Add resources to be provisioned below`**, add the following Bicep:

    ```bicep
    // Creates an app service instance to host the app
    module web './core/host/appservice.bicep' = {
      name: 'web'
      scope: rg
      params: {
        name: '${abbrs.webSitesAppService}web-${resourceToken}'
        location: location
        tags: union(tags, { 'azd-service-name': 'web' })
        appServicePlanId: appServicePlan.outputs.id
        runtimeName: 'python'
        runtimeVersion: '3.8'
        scmDoBuildDuringDeployment: true
      }
    }
    
    // Create an App Service Plan to group applications under the same payment plan and SKU
    module appServicePlan './core/host/appserviceplan.bicep' = {
      name: 'appserviceplan'
      scope: rg
      params: {
        name: '${abbrs.webServerFarms}${resourceToken}'
        location: location
        tags: tags
        sku: {
          name: 'B1'
        }
      }
    }
    ```

    > [!NOTE]
    > - A unique string is generated based on subscription ID and used as a `${resourceToken}` variable. This token is appended to the name of all Azure resources created by azd. `azd` uses tags to identify resources so you can modify the names based on your organization's naming convention.
    > - The `'azd-service-name': 'web'` tag on the app service is the value `azd` uses to identify deployment host. The value must be the same as what is defined for the service in the **azure.yaml** file.
    
## Update the azure.yaml file

To deploy the app, `azd` needs to know more about your app. The `azure.yaml` file is used to define the source code location, language, and the Azure hosting service for each service in your app. For full details, refer to [the azure.yaml schema](../azd-schema.md).

1. Open the `azure.yaml` at the root of the project.

1. Add the following lines to the bottom of the file:

    ```yml
    name: msdocs-python-flask-webapp-quickstart
    services:
      web:
        project: .
        language: py
        host: appservice
    ```

## Provision and deploy the template

1. Save all of your changes and run the following command to provision and deploy the app resources on Azure:

    ```azdeveloper
    azd up
    ```

1. When the command finishes, click the link in the command output to navigate to the deployed site.

Your project is now compatible with Azure Developer CLI and can be used as a template!

> [!NOTE]
> `azd` also supports using [Buildpack](https://buildpacks.io/) for containerizing your apps by default. If your `azd` template targets Azure Container Apps or Azure Kubernetes Service but does not include a Docker file, `azd` automatically generates an image using Buildpack.
