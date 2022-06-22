---
title: How to enable your project to work with Azure Developer CLI (Version 2)
description: How to convert an application to an Azure developer enabled template.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---
# How to enable your project to work with Azure Developer CLI (Version 2)

![Azure Developer CLI enable](media/how-to-devify-a-project/dev-ify.png)

All templates have the same file structure based on azd conventions.

```txt
├── .devcontainer              [ For DevContainer ]
├── .github                    [ Configure GitHub workflow ]
├── .vscode                    [ VS Code workspace ]
├── assets                     [ Assets used by README.MD ]
├── infra                      [ Creates and configures Azure resources ]
│   ├── main.bicep             [ Main infrastructure file ]
│   ├── main.parameters.json   [ Parameters file ]
│   └── resources.bicep        [ Resources file ]
├── src                        [ Contains folder(s) for the application code ]
└── azure.yaml                 [ Describes the application and type of Azure resources]
```

Here's a walkthrough on how to convert a basic application to work with Azure Developer CLI.

## Get a sample application
We start with this [simple Python Flask web app that is deployed to Azure App Service](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli). Get a copy of the code by running:

`git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart`

(Optional) Follow instructions in the [tutorial](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli#1---sample-application) to run the app locally to make sure the sample is working.

## Initialize the project

Change directory to `msdocs-python-flask-webapp-quickstart` and run `azd init`. 

* Select "Empty Template" from the list of project template
* Provide any name for new environment 
* Select an Azure location 
* Select an Azure subscription 

### What happened?
After you run this command, the following are added: 

- a new folder `.azure` 
- a subfolder called &lt;your environment name&gt; in the `.azure` folder. 
- Configuration file `.env` in `\.azure\<your environment name>` that contains information like the environment name, Azure subscription etc.
- `azure.yaml` in the root of your project

## Add Bicep files

`azd provision` uses Bicep files found under the **infra** folder for creating Azure resources needed by your app.

To create an azd compatible project:

1. Create an **infra** folder at the root of your project.
1. Create a new file named **main.parameters.json**. Include the environment variables (found in .env file under the .azure/\<environment name\> folder) you want to pass to your Bicep files. Here's an examples:

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "name": {
            "value": "${AZURE_ENV_NAME}"
            },
            "location": {
            "value": "${AZURE_LOCATION}"
            },
            "principalId": {
            "value": "${AZURE_PRINCIPAL_ID}"
            }
        }
    }
    ```
1. Create a file named **main.bicep** as the main entery point. Make sure you create parameters you include in **main.parameters.json**. For more information, see [Parameters in Bicep](/azure/azure-resource-manager/bicep/parameters). You can also start by referring to the **main.bicep** of an Azure Developer CLI templates, e.g., https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/infra/main.bicep and remove the outputs you do not need. Here's a sample:

    ```json
    targetScope = 'subscription'

    @minLength(1)
    @maxLength(50)
    @description('Name of the the environment which is used to generate a short unqiue hash used in all resources.')
    param name string

    @minLength(1)
    @description('Primary location for all resources')
    param location string

    @description('Id of the user or app to assign application roles')
    param principalId string = ''

    resource resourceGroup 'Microsoft.Resources/resourceGroups@2020-06-01' = {
        name: '${name}-rg'
        location: location
        tags: tags
    }

    var resourceToken = toLower(uniqueString(subscription().id, name))
    var tags = {
        'azd-env-name': name
    }

    module resources './resources.bicep' = {
        name: 'resources-${resourceToken}'
        scope: resourceGroup
        params: {
            location: location
            principalId: principalId
            resourceToken: resourceToken
            tags: tags
        }
    }

    output APP_WEB_BASE_URL string = resources.outputs.WEB_URI
    output AZURE_LOCATION string = location
    
    ```

1. Create **resources.bicep**. We will deploy this app to Azure App Service. For samples, you can refer to [sample Azure App Service Bicep files](/azure/app-service/samples-bicep). Here's a sample **resources.bicep**:

    ```json
    param location string
    param principalId string = ''
    param resourceToken string
    param tags object
    param sku string = 'S1' 
    param linuxFxVersion string = 'PYTHON|3.8'

    resource appServicePlan 'Microsoft.Web/serverfarms@2020-06-01' = {
      name: 'plan-${resourceToken}'
      location: location
      tags: tags
      sku: {
        name: sku
      }
      kind: 'linux'
      properties: {
      reserved: true
      }
    }

    resource web 'Microsoft.Web/sites@2020-06-01' = {
      name: 'app-web-${resourceToken}'
      location: location
      tags: union(tags, {
        'azd-service-name': 'web'
        })
      kind: 'app'
      properties: {
        serverFarmId: appServicePlan.id
        siteConfig: {
        linuxFxVersion: linuxFxVersion
        }
      }

      resource appSettings 'config' = {
        name: 'appsettings'
        properties: {
          'SCM_DO_BUILD_DURING_DEPLOYMENT': 'true'
          }
        }
      }

      output WEB_URI string = 'https://${web.properties.defaultHostName}'
    ```

1. Run `azd provision` to provision Azure resources.

### What happened?

After you run `azd provision`:
* Azure resources are created under the resource group **\<environment name\>-rg**. 
* The web end point is added to **.env** file under the .azure/\<environment name\> folder

## Update `azure.yaml`

To deploy the app, azd needs to know more about your app like where to find the source code; what kind of app you're building; and the Azure service that will be hosting your app. 

1. Update `azure.yaml` by adding the following lines:

    ```yml
    services:
    web:
        project: .
        language: py
        host: appservice
    ```
    - **name**: Root element. Required. Name of the application.
    - **services**: Root elemnt. Required. Definition of services that is part of the app.
    - **web**: Required. Name of the service. Can be any name, e.g. api, web.
    - **project**: Required. Path to the service source code directory.
    - **language**: Service implementation language. "py" for Python. If not specified, .NET will be assumed.
    - **host**: Type of Azure resource used for service implementation. "appservice" for Azure App Service. If not required, appservice is assumed.

    For full details, refer to [azure.yaml.json](https://github.com/Azure/azure-dev/blob/main/schemas/v1.0/azure.yaml.json/).

1. Run `azd deploy` to deploy the app to Azure
1. Visit the end point printed to test your app.

### What happened?

After you run `azd deploy`:
* The service **web** is deployed to the app service you provisioned in preview step.

## Next step

### Configure a DevOps pipeline

To set up GitHub Action:
1. Create a folder ".github" if it doesn't exist
1. Create a folder "workflows" under the .github folder
1. Copy the **azure-dev.yml** from any azd template, e.g., https://github.com/Azure-Samples/todo-nodejs-mongo/blob/main/.github/workflows/azure-dev.yml and paste into the .github/workflows folder.
1. Run `azd pipeline config` to push updates to your repo and trigger the GitHub Action workflow.
1. Go to the Action tab in your repo to check 

> [!NOTE]
> * `.venv` should be added to the `.gitignore` file

## Clean up

Run `azd down` to remove all Azure resources.

Your project is now Azure Dev enabled.

## Useful Bicep resources

* For an introduction to working with Bicep files, see Quickstart: [Create Bicep files with Visual Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code?tabs=CLI).
* [Bicep Samples](https://docs.microsoft.com/en-us/samples/browse/?languages=bicep)
* [How to decompile Azure Resource Manager templates (ARM templates) to Bicep](/azure/azure-resource-manager/bicep/decompile?tabs=azure-cli)