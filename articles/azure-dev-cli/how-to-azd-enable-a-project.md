---
title: How to Azure Developer CLI enable a project
description: How to convert an application to an Azure dev-enabled template.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdev
ms.prod: azure
---
# How to Azure Developer CLI enable a project

![Azure Developer CLI enable](media/how-to-devify-a-project/dev-ify.png)

As explained in [Azure Developer CLI Overview](azure-dev-cli-overview.md), `azd` looks for specific configuration files in a pre-defined folder structure. Here's a walkthrough on how to convert a basic application to a dev-ified template.

> [!NOTE]
> Currently supported/planned hosting platform for the application:
>
> | Azure service      | Supported? |
> | ----------- | ----------- |
> | Azure App Service | Yes  |
> | Azure Functions  | Yes |
> | Azure Container Apps    | Yes |
> | Azure Static Web Apps  | Coming soon |
> | Azure Container Service | Coming soon |
>
> Currently supported/planned languages:
>
> | Language      | Supported? |
> | ----------- | ----------- |
> | Node.js | Yes  |
> | Python    | Yes |
> | .NET | Coming soon |
> | Java | Coming soon |

## Get a sample application
We start with this [simple Python Flask web app that is deployed to Azure App Service](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli). Get a copy of the code by running:

`git clone https://github.com/Azure-Samples/msdocs-python-flask-webapp-quickstart`

(Optional) Follow instructions in the [tutorial](/azure/app-service/quickstart-python?tabs=flask%2Cwindows%2Cazure-portal%2Cterminal-bash%2Cvscode-deploy%2Cdeploy-instructions-azportal%2Cdeploy-instructions-zip-azcli#1---sample-application) to run the app locally to make sure the sample is working.

## Initialize the project

Change directory to `msdocs-python-flask-webapp-quickstart` and run `azd init`. The command asks for environment name, Azure region and Azure subscription. After you run this command, the following are added: 

- a new folder `.azure` 
- a subfolder called &lt;your environment name&gt; in the `.azure` folder. 
- Configuration file `.env` in `\.azure\<your environment name>` that contains information like the basename (environment name), Azure subscription etc.
- `azure.yaml` in the root of your project

## Add Bicep files

`azd provision` needs to know what to provision in Azure. The command looks for Bicep files in the `infra` folder.

Start from an Azure dev enabled template, use it as a base and remove resources that aren't needed. We reference [To Do Application with Python and Cosmo DB](https://github.com/Azure-Samples/todo-python-mongo). By doing so, you have the necessary Bicep files for setting up and configuring Azure Monitor as well. 

1. Create a new folder called `infra` in the root of your project. 
1. Copy the four files (`appinsights.bicep, main.bicep, main.parameters.json, resources.bicep`) found in the `infra` folder of the  [To do app](https://github.com/Azure-Samples/todo-python-mongo) and paste into the newly created folder.

1. Modify `resources.bicep`

- Since we need an Azure service plan with just one web app, we don't need the resources for hosting the API app, Key Vault and CosmoDB. Remove the resources (codes): **api**, **keyvault** and **cosmos**
- Remove the following lines:

``` bicep
    output AZURE_COSMOS_CONNECTION_STRING_KEY string = 'AZURE-COSMOS-CONNECTION-STRING'
    output AZURE_COSMOS_DATABASE_NAME string = cosmos::database.name
    output AZURE_KEY_VAULT_ENDPOINT string = keyvault.properties.vaultUri    
    output API_URI string = 'https://${api.properties.defaultHostName}'
```

- update code for **web**: make sure `linuxFxVersion` is `PYTHON|3.9`. Remove the line `appCommandLine: 'pm2 serve /home/site/wwwroot --no-daemon --spa'`
- update code for **webappappsettings**. Today, `azd` only supports zip deployment. Update `SCM_DO_BUILD_DURING_DEPLOYMENT` to `true`

1. Modify `main.bicep`

- Remove the following lines, which aren't needed:

``` bicep
    output AZURE_COSMOS_CONNECTION_STRING_KEY string = resources.outputs.AZURE_COSMOS_CONNECTION_STRING_KEY
    output AZURE_COSMOS_DATABASE_NAME string = resources.outputs.AZURE_COSMOS_DATABASE_NAME
    output AZURE_KEY_VAULT_ENDPOINT string = resources.outputs.AZURE_KEY_VAULT_ENDPOINT
    output REACT_APP_API_BASE_URL string = resources.outputs.API_URI
    output REACT_APP_APPINSIGHTS_INSTRUMENTATIONKEY string = resources.outputs.APPINSIGHTS_INSTRUMENTATIONKEY
```

## Update `azure.yaml`

`azd` needs to know where to find the source code; what kind of app you're building; and more about what Azure service to use. Update `azure.yaml` by adding the following lines:

```yml
services:
  - name: ${AZURE_ENV_NAME}web
    project: .
    language: py
    host: appservice
```

## Test

Congratulations, you're done. 

Run `azd provision config` to create the Azure resources.

Run `azd deploy` to deploy the web app.

Run `azd monitor --overview` and `azd monitor --logs` to monitor your app.

> [!NOTE]
> `.azure` and `.venv` should be added to the `.gitignore` file

## Clean up

Run `azd infra delete` to remove all Azure resources.

Your project is now Azure Dev enabled.