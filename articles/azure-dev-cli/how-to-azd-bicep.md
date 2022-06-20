---
title: How to work with Azure Bicep for Azure Developer CLI template
description: How to with Azure Bicep for Azure Developer CLI template.
author: puicchan
ms.author: puichan
ms.date: 04/12/2021
ms.topic: conceptual
ms.custom: devx-track-azdevcli
ms.prod: azure
---
#  Azure Bicep for Azure Developer CLI (azd)

This article contains resources to help you work with Bicep when making your project compatible with azd.

azd uses infrastructure as code (IaC) strategies to achieve predictable and repeatable creation of Azure resources and deployment of code. 

Bicep is a language for declaratively deploying Azure resources. It is the IaC tool currently supported by azd and used for creating azure resources. For more information, refer to [What is Bicep](/azure/azure-resource-manager/bicep/overview).

## Create azd compatible projects 

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
1. Create a file named **main.bicep** as the main entery point. Make sure you create parameters you include in **main.parameters.json**. For more information, see [Parameters in Bicep](/azure/azure-resource-manager/bicep/parameters). 
1. Add declaration of additional Azure resources or as additional Bicep files. 
1. Run `azd provision` to provision Azure resources.

## Useful Bicep resources

* For an introduction to working with Bicep files, see Quickstart: [Create Bicep files with Visual Studio Code](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code?tabs=CLI).
* [Bicep Samples](https://github.com/Azure/azure-docs-bicep-samples)
* [How to decompile Azure Resource Manager templates (ARM templates) to Bicep](/azure/azure-resource-manager/bicep/decompile?tabs=azure-cli)
