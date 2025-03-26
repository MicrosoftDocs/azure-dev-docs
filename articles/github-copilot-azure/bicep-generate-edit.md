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

Getting started with bicep templates may require some learning if you're new to the syntax, but tools like GitHub Copilot for Azure can help.

### Example Scenario

Suppose you want an easy want to create a repeatable, automated process for creating a Blob container and file share. You may be familiar with how to do this in the Azure portal, but unsure how to use bicep templates to accomplish this task.

### Example prompt

Create a New Chat (Ctrl + L), then copy and paste the following prompt into GitHub Copilot's chat pane.

```
@azure Show me a bicep template that creates an Azure Storage account with a blob container and a file share.
```

### Example response

> [!NOTE]
> The following response is an example. GitHub Copilot for Azure responses are non-deterministic, so you may get a differetn response from the one shown here.

GitHub Copilot for Azure generates a bicep file similar to the following.

```
@description('Specifies the name of the Azure Storage account.')
param storageAccountName string

@description('Specifies the name of the blob container to create.')
param blobContainerName string

@description('Specifies the name of the file share to create.')
param fileShareName string

@description('Specifies the location in which the Azure Storage resources should be deployed.')
param location string = resourceGroup().location

resource sa 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: sa
  name: 'default'
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobServices
  name: blobContainerName
  properties: {
    publicAccess: 'None'
  }
}

resource fileServices 'Microsoft.Storage/storageAccounts/fileServices@2023-01-01' = {
  parent: sa
  name: 'default'
}

resource fileShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  parent: fileServices
  name: fileShareName
  properties: {
    shareQuota: 100 // Quota in MB
  }
}
```

Create a new main.bicep file, then copy the response from GitHub Copilot for Azure and paste into the new file.

You will supply values for the params declared as `storageAccountName`, `blobContainerName`, and `fileShareName` when you use the Azure CLI to execute the bicep template.

Alternatively, you could edit the bicep template initializing the `storageAccountName` param to your desired value.

```
param storageAccountName string = '<your-storage-account-name>'
```


## Refine the response

However, if you're new to bicep files, you may need more information. Continue prompting in the same chat sesssion to understand next steps.

For example, you may want to ask where this bicep file should be created in your VS Code workspace.

```
@azure Where in my workspace should I create the bicep file and what should I call it?
```

It may respond by suggesting a folder and file name for your new bicep file. For example, `infra/storageAccount.bicep`.

Finally, if you're unsure about how to deploy the bicep file, you can create a prompt that asks for instructions.

```
@azure How do I execute the bicep file?
```

You may receive a response similar to the following.

```
To execute the Bicep file, you can use the Azure CLI with the following steps:

1. **Install Azure CLI and Bicep CLI**: Ensure you have the Azure CLI and Bicep CLI installed. You can install Bicep using the Azure CLI with the command:

   az bicep install


2. **Log in to Azure**: Use the Azure CLI to log in to your Azure account:

   az login


3. **Deploy the Bicep file**: Use the `az deployment group create` command to deploy the Bicep file to a resource group. Replace `<resource-group-name>` with your resource group name and `<location>` with your desired Azure region:
  
   az deployment group create --resource-group <resource-group-name> --template-file infra/storageAccount.bicep --parameters storageAccountName=<your-storage-account-name> containerName=<your-container-name> fileShareName=<your-file-share-name> location=<location>


This command will deploy the resources defined in your Bicep file to the specified resource group in Azure.

```

While following these instructions, if you get stuck or encounter a problem, continue asking GitHub Copilot questions creating prompts with the prefix `@azure` in the chat pane.


## Related content

- [Bicep overview](/azure/azure-resource-manager/bicep/overview)
- [What is GitHub Copilot for Azure Preview?](introduction.md)
- [Get started with GitHub Copilot for Azure Preview](get-started.md)
