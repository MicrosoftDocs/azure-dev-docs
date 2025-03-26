---
title: Use GitHub Copilot for Azure to Generate Bicep files
description: This article provides sample prompts and example responses from GitHub Copilot for Azure to create bicep files to deploy Azure resources.
keywords: github, copilot, ai, azure
ms.service: github-copilot-for-azure
ms.topic: overview
ms.date: 2/18/2024
ms.collection: ce-skilling-ai-copilot
---

# Generate bicep files using GitHub Copilot for Azure

 There are many ways to create new resources on Azure, however bicep templates provide a declarative, modular, and reusable approach to defining Azure resources, offering improved readability, maintainability, and native integration with Azure Resource Manager (ARM) compared to JSON-based ARM templates or imperative scripting methods like PowerShell and Azure CLI.  GitHub Copilot for Azure can help you create bicep templates. 

## Generate bicep files

Getting started with Terraform templates may require some learning if you're new to the syntax, but tools like GitHub Copilot for Azure can help.

### Example Scenario

Suppose you want an easy want to create a repeatable, automated process for creating a Blob container and file share. You may be familiar with how to do this in the Azure portal, but unsure how to use bicep templates to accomplish this task.

### Example prompt

Create a New Chat (Ctrl + L), then copy and paste the following prompt into GitHub Copilot's chat pane.

```
@azure Show me Bicep template that creates an Azure Storage account with a blob container and a file share.
```

### Example response

> [!NOTE]
> The following response is an example. GitHub Copilot for Azure responses are non-deterministic, so you may get a differetn response from the one shown here.

GitHub Copilot for Azure generates a bicep file similar to the following.

```
param storageAccountName string
param location string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
  }
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-08-01' = {
  name: '${storageAccount.name}/default/blobContainerName'
  properties: {
    publicAccess: 'None'
  }
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2021-08-01' = {
  name: '${storageAccount.name}/default/filesharename'
}
```

Create a new main.bicep file, then copy the response from GitHub Copilot for Azure and paste into the new file.

Modify the place holder text for values like `blobContainerName` and `filesharename`, and modify values that affect the names, location, SKUs, etc.

## Refine the response

However, if you're new to bicep files, you may need more information. Continue prompting in the same chat sesssion to understand next steps.

For example, you may want to ask where this bicep file should be created in your VS Code workspace.

```
@azure Where in my workspace should I create the bicep file and what should I call it?
```

It may respond by suggesting a folder and file name for your new bicep file.

Furthermore, you may not be familiar with how to set the Storage Account's name, which in this example, there's no place holder text provided. You should ask additional questions about the generated bicep template. 

```
@azure In this template, how do I specify the name of the Storage Account?
```

You may get a response that includes an edit to make to the original response, initializing the `storageAccountName` to your desired value.

```
param storageAccountName string = 'yourStorageAccountName'
```

Finally, if you're unsure about how to deploy the bicep file, you can create a prompt that asks for instructions.

```
@azure How do I execute the bicep file?
```

You may receive a response similar to the following.

```
To execute a Bicep file and deploy its resources to Azure, you can use the 
Azure CLI with the following steps:

Login to Azure: Ensure you're logged in to your Azure account using:

`az login`

Deploy the Bicep File: Use the following command to deploy the Bicep file. 
Replace the placeholders with your actual values:

`az deployment group create --resource-group <YourResourceGroupName> --template-file <PathToYourBicepFile>`

`<YourResourceGroupName>`: Name of the resource group where you want the 
resources to be deployed. You must create the resource group beforehand if 
it doesn't exist.

`<PathToYourBicepFile>`: Path to the Bicep file in your workspace, e.g., `./iac/storageAccount.bicep`.
```


## Related content

- [Bicep overview](/azure/azure-resource-manager/bicep/overview)
- [What is GitHub Copilot for Azure Preview?](introduction.md)
- [Get started with GitHub Copilot for Azure Preview](get-started.md)
