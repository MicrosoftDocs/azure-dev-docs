---
title: Make your project compatible with Azure Developer CLI (preview)
description: How to convert an app to an Azure developer enabled template.
author: alexwolfmsft
ms.author: alexwolf
ms.date: 12/05/2022
ms.service: azure-dev-cli
ms.topic: how-to
ms.custom: devx-track-azdevcli, devx-track-bicep
zone_pivot_group_filename: developer/azure-developer-cli/azd-zone-pivot-groups.json
zone_pivot_groups: make-azure-developer-cli-compatible-set
---

# Make your project compatible with Azure Developer CLI (preview)

Azure Developer CLI (`azd`) enables developers to create apps from [templates](./azd-templates.md) stored in GitHub repositories. Microsoft provides [several templates](overview.md?branch=pr-en-us-3070&tabs=nodejs#azure-developer-cli-templates) to get you started. In this article, you learn how to enable your own project as an `azd` template.

## Understand the `azd` architecture

The following diagram gives a quick overview of the process to create an `azd` template:

:::image type="content" source="media/make-azd-compatible/workflow.png" alt-text="Diagram of Azure Developer CLI template workflow.":::

All `azd` templates have the same file structure, based on `azd` conventions. The following hierarchy shows the directory structure you'll build in this tutorial. 

```txt
├── .devcontainer              [ For DevContainer ]
├── .github                    [ Configure GitHub workflow]
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ Main infrastructure file ]
│   ├── main.parameters.json   [ Parameters file ]
│   └── core                   [ Contains Bicep modules copied from azd reference library ]
└── azure.yaml                 [ Describes the app and type of Azure resources]
```

Learn more about:
- [The complete directory structure](#azd-conventions).
- [Azure Developer CLI's azure.yaml schema](./azd-schema.md).

## Create the project and source directories

::: zone pivot="azd-create"

1. Create a new directory for your project and change into it. This directory is your `project directory`.

1. Add your app source code either:

   - To the root of your project directory, or
   - In a subdirectory `src`, or `source directory`, which can be the same as your project directory.

::: zone-end

::: zone pivot="azd-convert"

1. Run the following command to clone the [Python Flask web app](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli):

    ```azdeveloper
    git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart
    ```

   Optionally, to see the sample working, follow the instructions to [run the app locally](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli#1---sample-app).

1. Change the current directory to `msdocs-python-flask-webapp-quickstart`.

::: zone-end

## Initialize a new environment

1. Run the following command to initialize the project:

    ```azdeveloper
    azd init
    ```

1. Since your current directory isn't empty, type *y* to confirm initializing a project here. 

1. Select **Starter - Bicep** to get starter template with Bicep as IaC provider. 
    > [!NOTE]
    > - Select **Starter -  Terraform** to get starter template with Terraform as IaC provider.
    > - Select **Minimal** to get the minimum: `azure.yaml`, `infra` folder, `main.bicep` and `main.parameters.json` under the `infra` folder.

1. Supply an **environment name**. Environment name is used as a prefix for the resource group created to hold all Azure resources. [What is an Environment Name in `azd`?](./faq.yml#what-is-an-environment-name)

    **Key points**

    After you run `azd init`, the following are added to your project:

    ```txt
    ├── .azdo                      [ For Azure DevOps ]
    │   └── azure-dev.yaml         [ Azure Pipelines workflow to deploy to Azure using azd ]
    ├── .azure                     [ For storing Azure configurations]
    │   └── <your environment>     [ For storing all environment-related configurations]
    │      ├── .env                [ Contains environment variables ]
    │      └── config.json         [ Contains environment configuration ]
    ├── .devcontainer              [ For DevContainer ]
    │   ├── devcontainer.json      [ For setting up the containerized development environment ]
    │   └── Dockerfile             [ For building the container image ]
    ├── .github                    [ For GitHub workflow ]
    │   └── azure-dev.yaml         [ GitHub Actions workflow to deploy to Azure using azd ]
    ├── infra                      [ For creating and configuring Azure resources ]
    │   ├── abbreviations.json     [ Recommended abbreviations for Azure resources ]
    │   ├── main.bicep             [ Main infrastructure file ]
    │   └── main.parameters.json   [ Parameters file ]
    └── azure.yaml                 [ Describes the app and type of Azure resources]
    ```

    - A `.azdo` and a `.github` folder for Azure Pipelines and GitHub Actions respectively.
      - Both folders are optional. 
      - Depending on your choice for CICD, you can delete either one of these folders.
      - For more details, refer to the [configure a DevOps Pipeline](#configure-a-devops-pipeline) section.
    - A directory called `.azure`.
      - Within the `.azure` directory, a directory is created: `<environment_name>`.
      - Within the `\.azure\<your environment_name>` directory, a file named `.env` is created.
      - The `.env` file contains information such as the value you supplied: 
        - Environment name
    - A `.devcontainer` folder is created. This folder is optional. For more details, refer to the [make your template DevContainer and Codespaces comparible](#make-your-template-dev-container-and-codespaces-compatible) section.
    - An `infra` folder with basic Bicep files. For more details, refer to [add Bicep files](#add-bicep-files).
    - A file named [`azure.yaml`](./azd-schema.md) in the root of your project.

## Add Bicep files

To provision the Azure resources, Bicep files need to be created within a directory called `infra`. In this section, you'll see how to perform this step by provisioning Azure App Service resources.

As this sample provisions App Service resources, you need:

- An Azure App Service Plan
- An Azure App Service running on Linux

For samples, refer to [sample Azure App Service Bicep files](/azure/app-service/samples-bicep). However, you can use the information in this section with [any supported host](./overview.md#supported-azure-compute-services-host).

1. Change the directory to the `infra` folder.

1. Update the `main.parameters.json` as needed:

    ```json
    {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "environmentName": {
        "value": "${AZURE_ENV_NAME}"
      },
      "location": {
        "value": "${AZURE_LOCATION}"
      }
    }
    }
    ```
    **Additional tips:**
    - You can override the default azd resource naming conventions by providing values here. For example, to use "rg-myGroupName" as your resource group name, add:

      ```json
      "resourceGroupName": {
           "value": "rg-myGroupName"
      }
      ```
    - You can use the azd `secretOrRandomPassword` function to retrieve a secret from Azure Key Vault if parameters for the key vault name and secret are provided. For example:
      ```json
      "sqlAdminPassword": {
           "value": "$(secretOrRandomPassword ${AZURE_KEY_VAULT_NAME} sqlAdminPassword)"
      }
      ```

1. Edit the `main.bicep` file. Declare the parameters you include in `main.parameters.json`. 

   For more information, see [Parameters in Bicep](/azure/azure-resource-manager/bicep/parameters). You can also refer to the `main.bicep` of an [Azure Developer CLI template](./azd-templates.md) (such as [todo-nodejs-mongo template](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/infra/main.bicep)), copy the `/infra/core` directory, remove any Bicep modules and outputs you don't need. 

   For example:

    ```bicep
    targetScope = 'subscription'

    @minLength(1)
    @maxLength(64)
    @description('Name of the the environment which is used to generate a short unique hash used in all resources.')
    param environmentName string

    @minLength(1)
    @description('Primary location for all resources')
    param location string

    // Optional parameters to override the default azd resource naming conventions. Update the main.parameters.json file to provide values. e.g.,:
    // "resourceGroupName": {
    //      "value": "myGroupName"
    // }
    param appServicePlanName string = ''
    param resourceGroupName string = ''
    param webServiceName string = ''
    // serviceName is used as value for the tag (azd-service-name) azd uses to identify deployment host
    param serviceName string = 'web'
    @description('Id of the user or app to assign application roles')

    var abbrs = loadJsonContent('./abbreviations.json')
    var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
    var tags = { 'azd-env-name': environmentName }

    // Organize resources in a resource group
    resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
      name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
      location: location
      tags: tags
    }

    // The application frontend
    module web './core/host/appservice.bicep' = {
      name: serviceName
      scope: rg
      params: {
        name: !empty(webServiceName) ? webServiceName : '${abbrs.webSitesAppService}web-${resourceToken}'
        location: location
        tags: union(tags, { 'azd-service-name': serviceName })
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
        name: !empty(appServicePlanName) ? appServicePlanName : '${abbrs.webServerFarms}${resourceToken}'
        location: location
        tags: tags
        sku: {
          name: 'B1'
        }
      }
    }

    // App outputs
    output AZURE_LOCATION string = location
    output AZURE_TENANT_ID string = tenant().tenantId
    output REACT_APP_WEB_BASE_URL string = web.outputs.uri

    ```
  
    > [!NOTE]
    > - A unique string is generated based on subscription ID and used as a resource token. This token is appended to the name of all Azure resources created by azd. `azd` uses tags to identify resources so you can modify the names based on your organization's naming convention.
    > - `serviceName` is used as value for the tag (`azd-service-name`) azd uses to identify deployment host. The value must be the same as what is defined in the **azure.yaml** file.
    > - Make sure you create a sub directory named `core` in `infra` and copy `appservice-appsettings.bicep`, `appservice.bicep` and `appserviceplan.bicep` from the  [todo-nodejs-mongo template](https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/infra/main.bicep)`/infra/core` directory.
    
1. Run the following command to provision the Azure resources:

    ```azdeveloper
    azd provision
    ```

1. Supply/select the appropriate values for your environment.

   | Parameter | Description |
   | --------- | ----------- |
   | `Azure Subscription` | The Azure Subscription where your resources are deployed. |
   | `Azure Location`   | The Azure location where your resources are deployed. |

    **Key points**

    - After you run `azd provision`, the Azure resources are created under the resource group `rg-<environment_name>`.
    - The Azure location, subscription, tenant id, web end point are added to `.env` file in the project's `.azure/<environment_name>` directory.

## Update azure.yaml

To deploy the app, `azd` needs to know more about your app. Specify the app's source code location, the app type, and the Azure service that will be hosting your app in the [`azure.yaml` file](./azd-schema.md).

1. Edit `azure.yaml` by adding the following lines:

    ```yml
    name: msdocs-python-flask-webapp-quickstart
    services:
      web:
        project: .
        language: py
        host: appservice
    ```

    | Value | Description |
    | ----- | ----------- |
    | `name` | Root element. Required. Name of the app. |
    | `services` | Root element. Required. Definition of services that is part of the app. |
    | `web` | Required. Name of the service. Can be any name, for example, api, web. This name needs to be the same as the `azd-service-name` value you specified earlier in **main.bicep**. |
    | `project` | Required. Path to the service source code directory. Use **src/web** if your source code is found under /src/web. |
    | `language` | Service implementation language. `py` for Python. If not specified, .NET is assumed. |
    | `host` | Type of Azure resource used for service implementation. "appservice" for Azure App Service. If not required, appservice is assumed. |

    For full details, refer to [the azure.yaml schema](./azd-schema.md).

1. Run the following command to deploy the app to Azure:

    ```azdeveloper
    azd deploy
    ```

    **Key points**

    After running `azd deploy`, the service **web** is deployed to the app service you previously provisioned.

1. Use your browser to open the end point to test your app.

Your project is now compatible with Azure Developer CLI and can be used as a template!

> [!NOTE]
> You can run `azd up` to perform both `azd provision` and `azd deploy` in a single step. If you wish to create a new environment, run `azd env new`.

## Make your template Dev Container and Codespaces Compatible

You can also make your template Dev Container or Codespaces compatible. A Development Container (or Dev Container for short) allows you to use a container as a full-featured development environment. It can be used to run an application, to separate tools, libraries, or runtimes needed for working with a codebase, and to aid in continuous integration and testing. Dev containers can be run locally or remotely, in a private or public cloud. (Source: [https://containers.dev/](https://containers.dev/))

The **Starter - Bicep** template includes the Dockerfile in the `.devcontainer` directory. Note that the example includes the `apt-get update && apt-get install -y xdg-utils` command to enable interactive browser authentication for environments like Codespaces.

```dockerfile
ARG IMAGE=bullseye
FROM --platform=amd64 mcr.microsoft.com/devcontainers/${IMAGE}
RUN export DEBIAN_FRONTEND=noninteractive \
     && apt-get update && apt-get install -y xdg-utils \
     && apt-get clean -y && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://aka.ms/install-azd.sh | bash
```

You can read more about [working with Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers) on the Visual Studio Code documentation.

## Configure a DevOps pipeline

The **Starter - Bicep** template includes both samples for Azure DevOps and GitHub Actions.

For GitHub Actions, you can remove the .azdo directory:

::: zone pivot="azd-convert"

> [!NOTE]
> - If you don't have the permission to push code to the remote repository from which you initially cloned your repository, run `git remote rm origin` to remove the remote repository before you proceed further.

::: zone-end

1. Run the following command to push updates to the repository. The GitHub Actions workflow is triggered because of the update.

    ```azdeveloper
    azd pipeline config    
    ```

1. Using your browser, go to the GitHub repository for your project.

1. Select **Actions** to see the workflow running.

::: zone pivot="azd-convert"

> [!NOTE]
> `.venv` should be added to the `.gitignore` file

::: zone-end

## Clean up resources

When you no longer need the resources created in this article, run the following command:

``` azdeveloper
azd down
```

## `azd` conventions

The following hierarchy shows the complete directory structure of an `azd` template.

```txt
├── .azdo                                        [ Configure Azure Pipeline ]
├── .devcontainer                                [ For DevContainer ]
├── .github                                      [ Configure GitHub workflow ]
├── .vscode                                      [ VS Code workspace configutations ]
├── assets                                       [ Assets used by README.MD ]
├── infra                                        [ Creates and configures Azure resources ]
│   ├── main.bicep/main.tf                       [ Main infrastructure file ]
│   ├── main.parameters.json/main.tfvars.json    [ Parameters file ]
│   ├── app                                      [ Bicep only. Recommended resources directory organized by functionality ]
│   └── core/modules                             [ Contains all of the Bicep/Terraform modules used by the azd templates ]
├── src                                          [ Contains directories for the app code ]
└── azure.yaml                                   [ Describes the app and type of Azure resources]
```

## See also

- [Create Bicep files with Visual Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code?tabs=CLI) for an introduction to working with Bicep files.
- [Bicep Samples](/samples/browse/?languages=bicep)
- [How to decompile Azure Resource Manager templates (ARM templates) to Bicep](/azure/azure-resource-manager/bicep/decompile?tabs=azure-cli)
- [Azure Developer CLI's azure.yaml schema](./azd-schema.md)

## Next steps

> [!div class="nextstepaction"]
> [Azure Developer CLI FAQ](./faq.yml)
